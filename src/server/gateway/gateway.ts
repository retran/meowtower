// The model gateway (ADR-0100, ADR-3100): one call per request, by the route its role names. It
// reserves the worst case first, so concurrent calls can't pass a limit together, and writes the
// whole request and reply to `llm_log`, which is the audit of everything that leaves the Mac.
import { appendEvents } from "../../engine/events/append.js";
import type { Db } from "../database.js";
import { ROLES, type GatewayConfig, type RoleName } from "./config.js";
import { cleanEgress } from "./egress.js";
import { costOf } from "./prices.js";
import type { RouteReply, Routes } from "./routes.js";

export const ADVENTURE_LIMIT_USD = 5;
export const MONTH_LIMIT_USD = 200;

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
  limits = { adventure: ADVENTURE_LIMIT_USD, month: MONTH_LIMIT_USD },
  names = [],
}: {
  db: Db;
  config: GatewayConfig;
  routes: Routes;
  now?: () => number;
  limits?: { readonly adventure: number; readonly month: number };
  /** The names the parent set, which the egress guard cleans. */
  names?: readonly string[];
}): Gateway {
  let monthSpent: string | null = null;
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
    async call({ role, bucket, system, user: raw, schema }) {
      const spec = ROLES[role];
      const user = cleanEgress(raw, names);
      const assigned = config.roles[role];
      if (!assigned) return { ok: false, reason: "provider_failed" };
      const { route: name, model } = assigned;
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
      const monthOver =
        spentSince(month) + heldOn("month") + worst > limits.month;
      const row = (
        outcome: string,
        reply: RouteReply | null,
        response: string,
      ): number | bigint =>
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
        ).lastInsertRowid;
      const log = (
        outcome: string,
        reply: RouteReply | null,
        response: string,
      ): void => {
        const id = row(outcome, reply, response);
        appendEvents(db, [
          {
            type: "llm_call",
            v: 1,
            payload: { llmLogId: String(id), role },
            origin: { deviceId: "server", clientMs: now() },
          },
        ]);
      };
      if (
        spentOn(bucket) + heldOn(bucket) + worst > limits.adventure ||
        monthOver
      ) {
        if (monthOver && monthSpent !== month) {
          monthSpent = month;
          appendEvents(db, [
            {
              type: "budget_month_spent",
              v: 1,
              payload: { month: month.slice(0, 7) },
              origin: { deviceId: "server", clientMs: now() },
            },
          ]);
        }
        row("budget_exhausted", null, `reserve ${worst.toFixed(6)}`);
        return { ok: false, reason: "budget_exhausted" };
      }
      hold(bucket, worst);
      hold("month", worst);
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
      if (!(await routes[route].hasModel(model)))
        return { state: "missing", role };
    return { state: "ok" };
  } catch {
    return { state: "unreachable" };
  }
}
