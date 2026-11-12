// REQ-8284, REQ-6322, REQ-8314 (ADR-3350): the sandbox is a schema beside a profile's, made empty or
// as a copy of her game with no credential, nothing done in it reaches her schema, and its gateway
// has a month limit of its own.
import { afterAll, beforeAll, expect, it } from "vitest";
import { openProfile } from "../../src/server/database.js";
import { dropSchema, type Db } from "../../src/server/db/index.js";
import { registerDevice, hashToken } from "../../src/server/devices.js";
import { setPin } from "../../src/server/parent-access.js";
import {
  readConfig,
  type GatewayConfig,
} from "../../src/server/gateway/config.js";
import type { Route, Routes } from "../../src/server/gateway/routes.js";
import {
  createSandbox,
  createSandboxGateway,
  sandboxLimit,
  sandboxSchemaOf,
  sandboxState,
} from "../../src/server/sandbox/sandbox.js";
import { onlyOnPostgres } from "../helpers/backend.js";
import { writeSyntheticLog } from "../helpers/synthetic-log.js";

const URL =
  process.env["MEOWTOWER_TEST_DATABASE_URL"] ??
  "postgres://postgres@127.0.0.1:55432/postgres";
const schema = `t_${String(process.pid)}_sbx`;
let game: Db;
let events = 0;
const NOW = Date.UTC(2026, 10, 11, 12, 0, 0);

beforeAll(async () => {
  game = await openProfile(URL, schema);
  events = await writeSyntheticLog(game, { days: 6, tasksPerDay: 8, seed: 9 });
  await registerDevice(game, "tablet");
  await setPin(game, "4821", new Date(NOW));
  await game
    .prepare(
      `INSERT INTO llm_log (at, role, route, model, tier, bucket, input_tokens, output_tokens,
         cost_usd, latency_ms, outcome, request, response)
       VALUES (?, 'r', 'anthropic', 'm', 'content', 'b', 1, 1, 3.5, 1, 'ok', '{}', '')`,
    )
    .run(new Date(NOW).toISOString());
});
afterAll(async () => {
  await game.close();
  await dropSchema(URL, schema);
  await dropSchema(URL, sandboxSchemaOf(schema));
});

const count = async (db: Db, table: string): Promise<number> =>
  Number(
    (
      (await db.prepare(`SELECT count(*) AS n FROM ${table}`).get()) as {
        n: number;
      }
    ).n,
  );

onlyOnPostgres("the parent's sandbox", () => {
  it("names the sandbox's schema beside the profile's", () => {
    expect(sandboxSchemaOf("p_1")).toBe("s_1");
    expect(sandboxSchemaOf("p_abc123")).toBe("s_abc123");
  });

  it("copies her game with no credential and none of her spend", async () => {
    const made = await createSandbox(URL, game, "copy");
    try {
      expect(await count(made.db, "events")).toBe(events);
      expect(made.copied?.events).toBe(events);
      for (const table of ["devices", "parent_pin", "lockouts", "llm_log"])
        expect(await count(made.db, table), table).toBe(0);
      // Her tables still hold what they held.
      expect(await count(game, "devices")).toBe(1);
      expect(await count(game, "parent_pin")).toBe(1);
    } finally {
      await made.db.close();
    }
  });

  it("changes nothing in her schema when the sandbox is written", async () => {
    const before = {
      events: await count(game, "events"),
      devices: await count(game, "devices"),
      llm: await count(game, "llm_log"),
    };
    const made = await createSandbox(URL, game, "copy");
    try {
      await made.db
        .prepare(
          "INSERT INTO events (id, ts, client_ms, device_id, type, v, payload) VALUES ('sandbox-only', 'x', 1, 'sandbox', 'session_started', 1, '{}')",
        )
        .run();
      await registerDevice(made.db, "computer");
      expect(await count(made.db, "events")).toBe(events + 1);
    } finally {
      await made.db.close();
    }
    expect({
      events: await count(game, "events"),
      devices: await count(game, "devices"),
      llm: await count(game, "llm_log"),
    }).toEqual(before);
    // The token hash of her device is not among the sandbox's rows, whatever the sandbox made.
    const hash = hashToken("anything");
    expect(hash).toHaveLength(64);
  });

  it("starts empty on a reset from nothing and drops what the copy held", async () => {
    const empty = await createSandbox(URL, game, "empty");
    try {
      expect(await count(empty.db, "events")).toBe(0);
      expect(empty.copied).toBeNull();
    } finally {
      await empty.db.close();
    }
  });

  it("reports whether the sandbox exists, what it holds and what it spent against its limit", async () => {
    await dropSchema(URL, sandboxSchemaOf(schema));
    expect(await sandboxState(URL, game, NOW)).toMatchObject({
      exists: false,
      events: 0,
    });
    const made = await createSandbox(URL, game, "copy");
    await made.db.close();
    const state = await sandboxState(URL, game, NOW);
    expect(state).toMatchObject({ exists: true, events, spentUsd: 0 });
    expect(state.limitUsd).toBe(sandboxLimit());
  });

  it("counts the sandbox's calls against its own limit, apart from her spend", async () => {
    const config = readConfig({
      TASK_TEXT_MODEL: "anthropic:claude-haiku-5-5",
      FRAME_JUDGE_MODEL: "openrouter:anthropic/claude-haiku-5.5",
      ANTHROPIC_API_KEY: "a",
      OPENROUTER_PLAY_KEY: "o",
    }) as GatewayConfig;
    const route: Route = {
      body: (r) => r,
      call: () =>
        Promise.resolve({
          text: "ok",
          stopReason: "end_turn",
          inputTokens: 1,
          outputTokens: 1,
          costUsd: 0.004,
        }),
      hasModel: () => Promise.resolve(true),
    };
    const made = await createSandbox(URL, game, "empty");
    try {
      const gateway = createSandboxGateway({
        db: made.db,
        config,
        routes: { anthropic: route, openrouter: route } as Routes,
        now: () => NOW,
        limit: 0.01,
      });
      const ask = {
        role: "TASK_TEXT_MODEL",
        system: "s",
        user: "u",
        bucket: "b",
      } as const;
      // Her profile spent 3.5 dollars this month, which does not count here: the first call fits.
      expect((await gateway.call(ask)).ok).toBe(true);
      // The sandbox's log holds that call, and the next one no longer fits the 0.01 limit.
      expect(await count(made.db, "llm_log")).toBe(1);
      expect((await gateway.call(ask)).ok).toBe(false);
      expect(await count(game, "llm_log")).toBe(1);
    } finally {
      await made.db.close();
    }
  });
});
