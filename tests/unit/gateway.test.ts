// ADR-3100: each role names its route, both routes write one log, and the limits count every route.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { openDatabase, type Db } from "../../src/server/database.js";
import {
  ConfigInvalid,
  parseRole,
  providersFor,
  readConfig,
  type GatewayConfig,
} from "../../src/server/gateway/config.js";
import { createGateway } from "../../src/server/gateway/gateway.js";
import { eventsOfType } from "../../src/engine/events/read.js";
import {
  recordRoute,
  replayRoute,
} from "../../src/server/gateway/recording.js";
import { costOf } from "../../src/server/gateway/prices.js";
import { type Route, type Routes } from "../../src/server/gateway/routes.js";

const root = mkdtempSync(join(tmpdir(), "meowtower-gateway-"));
const opened: Db[] = [];
afterAll(() => {
  for (const db of opened) db.close();
  rmSync(root, { recursive: true, force: true });
});
let n = 0;
const database = (): Db => {
  n += 1;
  const db = openDatabase(join(root, `${n.toString()}.sqlite`));
  opened.push(db);
  return db;
};

const env = {
  TASK_TEXT_MODEL: "anthropic:claude-haiku-5-5",
  FRAME_JUDGE_MODEL: "openrouter:anthropic/claude-haiku-5.5",
  ANTHROPIC_API_KEY: "a",
  OPENROUTER_PLAY_KEY: "o",
};
const config = readConfig(env) as GatewayConfig;

function fake(costUsd = 0.001): Route & { calls: number } {
  return {
    calls: 0,
    body: (r) => r,
    async call() {
      this.calls += 1;
      return Promise.resolve({
        text: "ok",
        stopReason: "end_turn",
        inputTokens: 10,
        outputTokens: 5,
        costUsd,
      });
    },
    hasModel: () => Promise.resolve(true),
  };
}

const asked = { system: "s", user: "u", bucket: "b" };

describe("role values", () => {
  it("reads a route and a model", () => {
    expect(
      parseRole("X", "anthropic:claude-haiku-5-5", "content", false),
    ).toEqual({ route: "anthropic", model: "claude-haiku-5-5" });
  });
  it("refuses an unknown route, an image role and an unattested player role", () => {
    expect(() => parseRole("X", "claude-haiku-5-5", "content", false)).toThrow(
      ConfigInvalid,
    );
    expect(() =>
      parseRole("ART_MODEL_BG", "anthropic:m", "content", true),
    ).toThrow("image output");
    expect(() => parseRole("X", "anthropic:m", "player", false)).toThrow(
      "ANTHROPIC_ZDR_ATTESTED",
    );
    expect(parseRole("X", "anthropic:m", "player", true).route).toBe(
      "anthropic",
    );
  });
  it("leaves frames off while a role is unset and refuses a route with no key", () => {
    expect(readConfig({})).toBeNull();
    expect(() => readConfig({ ...env, ANTHROPIC_API_KEY: "" })).toThrow(
      "no key",
    );
  });
  it("keeps a prefixed provider to its models", () => {
    const c = { ...config, playerProviders: ["vertex", "mistral:z-ai/glm-"] };
    expect(providersFor(c, "player", "anthropic/x")).toEqual(["vertex"]);
    expect(providersFor(c, "player", "z-ai/glm-5")).toEqual([
      "vertex",
      "mistral",
    ]);
  });
});

describe("the gateway", () => {
  it("sends each request by its role's route and logs both the same way", async () => {
    const db = database();
    const routes = { anthropic: fake(), openrouter: fake() };
    const gateway = createGateway({ db, config, routes: routes as Routes });
    await gateway.call({ role: "TASK_TEXT_MODEL", ...asked });
    await gateway.call({ role: "FRAME_JUDGE_MODEL", ...asked });
    expect(routes.anthropic.calls).toBe(1);
    expect(routes.openrouter.calls).toBe(1);
    const rows = db
      .prepare("SELECT route, outcome, request, response FROM llm_log")
      .all() as { route: string; outcome: string; response: string }[];
    expect(rows.map((r) => r.route)).toEqual(["anthropic", "openrouter"]);
    expect(rows.every((r) => r.outcome === "ok" && r.response === "ok")).toBe(
      true,
    );
  });
  it("counts the month across routes", async () => {
    const db = database();
    const routes = { anthropic: fake(), openrouter: fake(199.9999) };
    const gateway = createGateway({ db, config, routes: routes as Routes });
    await gateway.call({
      role: "FRAME_JUDGE_MODEL",
      ...asked,
      bucket: "first",
    });
    const refused = await gateway.call({
      role: "TASK_TEXT_MODEL",
      ...asked,
      bucket: "second",
    });
    expect(refused).toEqual({ ok: false, reason: "budget_exhausted" });
    expect(routes.anthropic.calls).toBe(0);
    expect(eventsOfType(db, "budget_month_spent")).toHaveLength(1);
    expect(eventsOfType(db, "llm_call")).toHaveLength(1);
    expect(
      db
        .prepare("SELECT role FROM llm_log WHERE outcome = 'budget_exhausted'")
        .all(),
    ).toEqual([{ role: "TASK_TEXT_MODEL" }]);
  });
  it("logs a failure and answers provider_failed", async () => {
    const db = database();
    const broken: Route = {
      ...fake(),
      call: () => Promise.reject(new Error("down")),
    };
    const gateway = createGateway({
      db,
      config,
      routes: { anthropic: broken, openrouter: fake() },
    });
    expect(await gateway.call({ role: "TASK_TEXT_MODEL", ...asked })).toEqual({
      ok: false,
      reason: "provider_failed",
    });
    expect(
      db.prepare("SELECT outcome, response FROM llm_log").get(),
    ).toMatchObject({ outcome: "provider_failed", response: "down" });
  });
  it("stops an adventure at $5 and leaves another adventure alone", async () => {
    const db = database();
    const routes = { anthropic: fake(4.9999), openrouter: fake() };
    const gateway = createGateway({ db, config, routes: routes as Routes });
    const first = { role: "TASK_TEXT_MODEL", ...asked } as const;
    await gateway.call(first);
    expect((await gateway.call(first)).ok).toBe(false);
    expect((await gateway.call({ ...first, bucket: "other" })).ok).toBe(true);
  });
  it("cleans names and contact details", async () => {
    const db = database();
    const seen: string[] = [];
    const route: Route = {
      ...fake(),
      call(r) {
        seen.push(r.user);
        return Promise.resolve({
          text: "ok",
          stopReason: "end_turn",
          inputTokens: 1,
          outputTokens: 1,
          costUsd: 0,
        });
      },
    };
    const gateway = createGateway({
      db,
      config,
      routes: { anthropic: route, openrouter: route },
      names: ["Мурка"],
    });
    const user = "Мурка a@b.nl 1234 AB +31 6 1234 5678";
    await gateway.call({ role: "TASK_TEXT_MODEL", ...asked, user });
    expect(seen[0]).toBe("[имя] [почта] [адрес] [телефон]");
  });
  it("replays a recording, and a request with none fails as recording_missing", async () => {
    const dir = mkdtempSync(join(root, "recordings-"));
    const live = fake();
    const request = {
      model: "m",
      tier: "content" as const,
      system: "s",
      user: "u",
      maxTokens: 1,
      timeoutMs: 1,
    };
    await recordRoute(live, dir).call(request);
    const replay = replayRoute(live, dir);
    expect((await replay.call(request)).text).toBe("ok");
    expect(live.calls).toBe(1);
    expect(() => replay.call({ ...request, user: "other" })).toThrow(
      "recording_missing",
    );
  });
  it("spends from the offline key in verify mode", () => {
    const verify = readConfig({
      ...env,
      GATEWAY_MODE: "verify",
      OPENROUTER_OFFLINE_KEY: "off",
    });
    expect(verify?.openrouterKey).toBe("off");
    expect(() => readConfig({ ...env, GATEWAY_MODE: "x" })).toThrow("unknown");
  });
  it("computes a direct call's cost from the price table", () => {
    expect(costOf("claude-haiku-5-5", 1_000_000, 1_000_000)).toBeCloseTo(0.6);
  });
});
