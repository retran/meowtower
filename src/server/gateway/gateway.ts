// The model gateway (ADR-0100, ADR-3100): one call per request, by the route its role names. It
// reserves the worst case first, so concurrent calls can't pass a limit together, and writes the
// whole request and reply to `llm_log`, which is the audit of everything that leaves the Mac.
import type { Db } from "../database.js";
import { ROLES, type GatewayConfig, type RoleName } from "./config.js";
import { costOf } from "./prices.js";
import type { RouteReply, Routes } from "./routes.js";

export const ADVENTURE_LIMIT_USD = 1.5;
export const MONTH_LIMIT_USD = 60;

export interface GatewayRequest {
  readonly role: RoleName;
  /** The adventure or session this call spends from. */
  readonly bucket: string;
  readonly system: string;
  readonly user: string;
  readonly schema?: Readonly<Record<string, unknown>>;
}

export type GatewayResult =
  | { readonly ok: true; readonly text: string }
  | {
      readonly ok: false;
      readonly reason: "budget_exhausted" | "provider_failed";
    };

export interface Gateway {
  call(request: GatewayRequest): Promise<GatewayResult>;
}

/** About 3 characters a token, a cautious count for three languages. */
const tokensIn = (text: string): number => Math.ceil(text.length / 3);

export function createGateway({
  db,
  config,
  routes,
  now = Date.now,
}: {
  db: Db;
  config: GatewayConfig;
  routes: Routes;
  now?: () => number;
}): Gateway {
  const held = new Map<string, number>();
  const hold = (key: string, amount: number): void => {
    held.set(key, (held.get(key) ?? 0) + amount);
  };
  const heldOn = (key: string): number => held.get(key) ?? 0;
  const spentSince = (from: string): number =>
    (
      db
        .prepare(
          "SELECT COALESCE(SUM(cost_usd), 0) AS s FROM llm_log WHERE at >= ?",
        )
        .get(from) as { s: number }
    ).s;
  const spentOn = (bucket: string): number =>
    (
      db
        .prepare(
          "SELECT COALESCE(SUM(cost_usd), 0) AS s FROM llm_log WHERE bucket = ?",
        )
        .get(bucket) as { s: number }
    ).s;
  const insert = db.prepare(
    `INSERT INTO llm_log (at, role, route, model, tier, bucket, input_tokens, output_tokens,
       cost_usd, latency_ms, outcome, request, response)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  return {
    async call({ role, bucket, system, user, schema }) {
      const spec = ROLES[role];
      const { route: name, model } = config.roles[role];
      const route = routes[name];
      const request = {
        model,
        tier: spec.tier,
        system,
        user,
        maxTokens: spec.maxTokens,
        timeoutMs: spec.timeoutMs,
        ...(schema ? { schema } : {}),
      };
      const started = new Date(now());
      const month = `${started.toISOString().slice(0, 7)}-01`;
      const worst = costOf(
        model,
        tokensIn(system) + tokensIn(user),
        spec.maxTokens,
      );
      if (
        spentOn(bucket) + heldOn(bucket) + worst > ADVENTURE_LIMIT_USD ||
        spentSince(month) + heldOn("month") + worst > MONTH_LIMIT_USD
      )
        return { ok: false, reason: "budget_exhausted" };
      hold(bucket, worst);
      hold("month", worst);
      const log = (
        outcome: string,
        reply: RouteReply | null,
        response: string,
      ): void => {
        insert.run(
          started.toISOString(),
          role,
          name,
          model,
          spec.tier,
          bucket,
          reply?.inputTokens ?? 0,
          reply?.outputTokens ?? 0,
          reply?.costUsd ?? 0,
          now() - started.getTime(),
          outcome,
          JSON.stringify(route.body(request)),
          response,
        );
      };
      try {
        const reply = await route.call(request);
        const finished = reply.stopReason !== "refusal" && reply.text !== "";
        log(finished ? "ok" : reply.stopReason, reply, reply.text);
        return finished
          ? { ok: true, text: reply.text }
          : { ok: false, reason: "provider_failed" };
      } catch (err) {
        log("provider_failed", null, err instanceof Error ? err.message : "");
        return { ok: false, reason: "provider_failed" };
      } finally {
        hold(bucket, -worst);
        hold("month", -worst);
      }
    },
  };
}

/** Whether every configured model exists: `missing` names the first that doesn't. */
export async function verifyModels(
  config: GatewayConfig,
  routes: Routes,
): Promise<
  | { state: "ok" }
  | { state: "unreachable" }
  | { state: "missing"; role: string }
> {
  try {
    for (const [role, { route, model }] of Object.entries(config.roles))
      if (!(await routes[route as keyof Routes].hasModel(model)))
        return { state: "missing", role };
    return { state: "ok" };
  } catch {
    return { state: "unreachable" };
  }
}
