// REQ-8514: the month's model spend of the profiles of one account counts against that account's
// budget alone: another account's spend and calls never count, and the account's own limit is used.
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
const acct = `t_${tag}_hb0`;
let accounts: Db;
// One ledger for all the gateways of the test, as the server has one.
let ledger: ReturnType<typeof createLedger>;
const opened: Db[] = [];
const schemas: string[] = [acct];
const NOW = Date.UTC(2026, 10, 8, 12, 0, 0);

beforeAll(async () => {
  accounts = await openAccounts(URL, acct);
  ledger = createLedger(accounts);
});
afterAll(async () => {
  for (const d of opened) await d.close();
  await accounts.close();
  for (const s of schemas) await dropSchema(URL, s);
});

/** An account with the profiles named, each its own schema; returns the schemas. */
async function account(
  name: string,
  profiles: string[],
  limit: number | null = null,
): Promise<{ id: string; dbs: Db[]; schemas: string[] }> {
  const id = `acc-${name}`;
  await accounts
    .prepare(
      "INSERT INTO accounts (id, email, verified_at, created_at, month_limit_usd) VALUES (?, ?, 'x', 'x', ?)",
    )
    .run(id, `${name}@example.org`, limit);
  const dbs: Db[] = [];
  const names: string[] = [];
  for (const p of profiles) {
    const schema = `t_${tag}_${name}${p}`;
    schemas.push(schema);
    names.push(schema);
    const db = await openProfile(URL, schema);
    opened.push(db);
    dbs.push(db);
    await accounts
      .prepare(
        "INSERT INTO profiles (id, account_id, label, schema_name, created_at) VALUES (?, ?, ?, ?, 'x')",
      )
      .run(`${id}-${p}`, id, p, schema);
  }
  return { id, dbs, schemas: names };
}

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
const gatewayOf = (
  db: Db,
  schema: string,
  month: number,
  route_: Route = route(),
) =>
  createGateway({
    db,
    config,
    routes: routesOf(route_),
    now: () => NOW,
    limits: { adventure: 100, month },
    household: ledger.forProfile(schema),
  });

oncePerRun("the month's budget of an account", () => {
  it("counts the account's profiles together and never another account's", async () => {
    const x = await account("x", ["1", "2"]);
    const y = await account("y", ["1"]);
    await spend(x.dbs[0] as Db, 4);
    await spend(x.dbs[1] as Db, 5.997);
    await spend(y.dbs[0] as Db, 7);
    // Account x has spent 9.997 of 10: one more worst case (0.006) does not fit.
    expect(
      await gatewayOf(x.dbs[0] as Db, x.schemas[0] as string, 10).call(asked),
    ).toEqual({ ok: false, reason: "budget_exhausted" });
    // Account y has spent 7 of 10, and the 16.997 together do not matter to it.
    expect(
      (await gatewayOf(y.dbs[0] as Db, y.schemas[0] as string, 10).call(asked))
        .ok,
    ).toBe(true);
  });

  it("uses the limit the account set", async () => {
    const z = await account("z", ["1"], 20);
    await spend(z.dbs[0] as Db, 12);
    // The default of the gateway is 10, and the account's own 20 is what counts.
    expect(
      (await gatewayOf(z.dbs[0] as Db, z.schemas[0] as string, 10).call(asked))
        .ok,
    ).toBe(true);
  });

  it("counts a call still running in the account's other profile, and not in another account", async () => {
    const w = await account("w", ["1", "2"]);
    const v = await account("v", ["1"]);
    let release!: () => void;
    const gate = new Promise<void>((r) => {
      release = r;
    });
    const slow = gatewayOf(
      w.dbs[0] as Db,
      w.schemas[0] as string,
      0.01,
      route(0.001, gate),
    );
    const sibling = gatewayOf(w.dbs[1] as Db, w.schemas[1] as string, 0.01);
    const stranger = gatewayOf(v.dbs[0] as Db, v.schemas[0] as string, 0.01);
    const running = slow.call(asked);
    await new Promise((r) => setTimeout(r, 50));
    expect((await sibling.call(asked)).ok).toBe(false);
    expect((await stranger.call(asked)).ok).toBe(true);
    release();
    expect((await running).ok).toBe(true);
    expect((await sibling.call(asked)).ok).toBe(true);
  });
});
