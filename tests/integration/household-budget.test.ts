// REQ-8510: the month's model spend of all profiles sums to no more than the limit, though each
// profile alone is under it, and a call in flight in one profile counts against the others.
import { afterAll, beforeAll, expect, it } from "vitest";
import { openAccounts } from "../../src/server/accounts/store.js";
import { openProfile } from "../../src/server/database.js";
import { dropSchema, type Db } from "../../src/server/db/index.js";
import {
  readConfig,
  type GatewayConfig,
} from "../../src/server/gateway/config.js";
import { createGateway } from "../../src/server/gateway/gateway.js";
import { createLedger } from "../../src/server/gateway/household.js";
import type { Route, Routes } from "../../src/server/gateway/routes.js";
import { oncePerRun } from "../helpers/backend.js";

const URL =
  process.env["MEOWTOWER_TEST_DATABASE_URL"] ??
  "postgres://postgres@127.0.0.1:55432/postgres";
const tag = `${String(process.pid)}`;
const names = {
  accounts: `t_${tag}_hb0`,
  a: `t_${tag}_hba`,
  b: `t_${tag}_hbb`,
};
let accounts: Db;
let a: Db;
let b: Db;
const NOW = Date.UTC(2026, 10, 8, 12, 0, 0);

beforeAll(async () => {
  accounts = await openAccounts(URL, names.accounts);
  a = await openProfile(URL, names.a);
  b = await openProfile(URL, names.b);
});
afterAll(async () => {
  for (const d of [accounts, a, b]) await d.close();
  for (const s of Object.values(names)) await dropSchema(URL, s);
});

const config = readConfig({
  TASK_TEXT_MODEL: "anthropic:claude-haiku-5-5",
  FRAME_JUDGE_MODEL: "openrouter:anthropic/claude-haiku-5.5",
  ANTHROPIC_API_KEY: "a",
  OPENROUTER_PLAY_KEY: "o",
}) as GatewayConfig;

const route = (
  costUsd = 0.001,
  gate?: Promise<void>,
): Route & { calls: number } => ({
  calls: 0,
  body: (r) => r,
  async call() {
    this.calls += 1;
    if (gate) await gate;
    return {
      text: "ok",
      stopReason: "end_turn",
      inputTokens: 10,
      outputTokens: 5,
      costUsd,
    };
  },
  hasModel: async () => Promise.resolve(true),
});
const routesOf = (r: Route): Routes =>
  ({ anthropic: r, openrouter: r }) as Routes;
const asked = {
  role: "TASK_TEXT_MODEL",
  system: "s",
  user: "u",
  bucket: "b",
} as const;

const spend = async (db: Db, usd: number): Promise<void> => {
  await db
    .prepare(
      `INSERT INTO llm_log (at, role, route, model, tier, bucket, input_tokens, output_tokens,
         cost_usd, latency_ms, outcome, request, response)
       VALUES (?, 'r', 'anthropic', 'm', 'content', 'old', 1, 1, ?, 1, 'ok', '{}', '')`,
    )
    .run(new Date(NOW).toISOString(), usd);
};

oncePerRun("the month's limit over the profiles", () => {
  it("refuses a call that the other profile's spend has made too dear", async () => {
    await spend(a, 4);
    await spend(b, 5.997);
    const ledger = createLedger(accounts, [names.a, names.b]);
    const limits = { adventure: 100, month: 10 };
    const alone = createGateway({
      db: a,
      config,
      routes: routesOf(route()),
      now: () => NOW,
      limits,
    });
    // Alone, the profile has spent 4 of 10, and a call is allowed.
    expect((await alone.call(asked)).ok).toBe(true);
    const shared = createGateway({
      db: a,
      config,
      routes: routesOf(route()),
      now: () => NOW,
      limits,
      household: ledger.forProfile(names.a),
    });
    // Together the two spent 9.997 of 10, and the worst case of one more call does not fit.
    const refused = await shared.call(asked);
    expect(refused).toEqual({ ok: false, reason: "budget_exhausted" });
  });

  it("counts a call in flight in another profile", async () => {
    const fresh = `t_${tag}_hbc`;
    const d = await openProfile(URL, fresh);
    const e = await openProfile(URL, `${fresh}e`);
    try {
      const ledger = createLedger(accounts, [fresh, `${fresh}e`]);
      let release!: () => void;
      const gate = new Promise<void>((r) => {
        release = r;
      });
      const limits = { adventure: 100, month: 0.01 };
      const slow = createGateway({
        db: d,
        config,
        routes: routesOf(route(0.001, gate)),
        now: () => NOW,
        limits,
        household: ledger.forProfile(fresh),
      });
      const other = createGateway({
        db: e,
        config,
        routes: routesOf(route()),
        now: () => NOW,
        limits,
        household: ledger.forProfile(`${fresh}e`),
      });
      const inFlight = slow.call(asked);
      await new Promise((r) => setTimeout(r, 50));
      // The slow call holds its worst case, and the other profile cannot also reserve its own.
      expect((await other.call(asked)).ok).toBe(false);
      release();
      expect((await inFlight).ok).toBe(true);
      expect((await other.call(asked)).ok).toBe(true);
    } finally {
      await d.close();
      await e.close();
      await dropSchema(URL, fresh);
      await dropSchema(URL, `${fresh}e`);
    }
  });
});
