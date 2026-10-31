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
import { costOf } from "../../src/server/gateway/prices.js";
import type { Route, Routes } from "../../src/server/gateway/routes.js";

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
  LIVE_CHECK_MODEL: "openrouter:anthropic/claude-haiku-5.5",
  SAFETY_MODEL: "openrouter:anthropic/claude-haiku-5.5",
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
    await gateway.call({ role: "SAFETY_MODEL", ...asked });
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
    const routes = { anthropic: fake(), openrouter: fake(59.9999) };
    const gateway = createGateway({ db, config, routes: routes as Routes });
    await gateway.call({ role: "SAFETY_MODEL", ...asked, bucket: "first" });
    const refused = await gateway.call({
      role: "TASK_TEXT_MODEL",
      ...asked,
      bucket: "second",
    });
    expect(refused).toEqual({ ok: false, reason: "budget_exhausted" });
    expect(routes.anthropic.calls).toBe(0);
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
  it("computes a direct call's cost from the price table", () => {
    expect(costOf("claude-haiku-5-5", 1_000_000, 1_000_000)).toBeCloseTo(0.6);
  });
});
