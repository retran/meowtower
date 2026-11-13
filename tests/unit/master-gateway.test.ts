// REQ-8168, REQ-8236, REQ-8234 (ADR-3270): the Master is one gateway role in the player tier, and the
// model's tool calls come back as a structured reply that the turn checks.
import { describe, expect, it } from "vitest";
import {
  ConfigInvalid,
  readConfig,
  ROLES,
} from "../../src/server/gateway/config.js";
import type {
  Gateway,
  GatewayRequest,
  GatewayResult,
} from "../../src/server/gateway/gateway.js";
import { gatewayMaster, MasterFailed } from "../../src/story/master-gateway.js";

const base = {
  TASK_TEXT_MODEL: "anthropic:claude-haiku-5-5",
  FRAME_JUDGE_MODEL: "openrouter:anthropic/claude-haiku-5.5",
  ANTHROPIC_API_KEY: "a",
  OPENROUTER_PLAY_KEY: "o",
};

describe("the MASTER_MODEL role", () => {
  it("is a player-tier role the game can run without", () => {
    expect(ROLES.MASTER_MODEL.tier).toBe("player");
    expect(readConfig(base)?.roles.MASTER_MODEL).toBeUndefined();
  });

  it("reads a route and a model, and needs the attestation on the direct route", () => {
    expect(
      readConfig({
        ...base,
        MASTER_MODEL: "openrouter:anthropic/claude-sonnet-5.5",
      })?.roles.MASTER_MODEL,
    ).toEqual({ route: "openrouter", model: "anthropic/claude-sonnet-5.5" });
    expect(() =>
      readConfig({ ...base, MASTER_MODEL: "anthropic:claude-sonnet-5-5" }),
    ).toThrow(ConfigInvalid);
    expect(
      readConfig({
        ...base,
        MASTER_MODEL: "anthropic:claude-sonnet-5-5",
        ANTHROPIC_ZDR_ATTESTED: "true",
      })?.roles.MASTER_MODEL,
    ).toEqual({ route: "anthropic", model: "claude-sonnet-5-5" });
  });
});

const gatewayAnswering = (
  result: GatewayResult,
): Gateway & { asked: GatewayRequest[] } => ({
  asked: [],
  call(request) {
    this.asked.push(request);
    return Promise.resolve(result);
  },
});
const ask = { system: "SYSTEM", said: "I open the gate", encounter: "e1" };

describe("the gateway as the Master's model", () => {
  it("asks the Master role for a structured reply and reads the text and the calls", async () => {
    const gateway = gatewayAnswering({
      ok: true,
      text: JSON.stringify({
        text: "The gate creaks.",
        calls: [{ tool: "record_fact", input: { fact: "The gate is old" } }],
      }),
    });
    const reply = await gatewayMaster(gateway, "adventure-1")(ask);
    expect(reply).toEqual({
      text: "The gate creaks.",
      calls: [{ tool: "record_fact", input: { fact: "The gate is old" } }],
    });
    const sent = gateway.asked[0];
    expect(sent?.role).toBe("MASTER_MODEL");
    expect(sent?.bucket).toBe("adventure-1");
    expect(sent?.system).toBe("SYSTEM");
    expect(sent?.user).toContain("I open the gate");
    expect(sent?.user).toContain("e1");
    expect(sent?.schema).toBeDefined();
  });

  it("reads a reply with no calls as a story only", async () => {
    const reply = await gatewayMaster(
      gatewayAnswering({ ok: true, text: JSON.stringify({ text: "Quiet." }) }),
      "b",
    )(ask);
    expect(reply).toEqual({ text: "Quiet.", calls: [] });
  });

  it("fails with a reason when the budget is spent, the provider fails or the reply is not the shape", async () => {
    for (const [result, reason] of [
      [{ ok: false, reason: "budget_exhausted" }, "budget_exhausted"],
      [{ ok: false, reason: "provider_failed" }, "provider_failed"],
      [{ ok: true, text: "not json" }, "reply_invalid"],
      [{ ok: true, text: JSON.stringify({ calls: [] }) }, "reply_invalid"],
      [{ ok: true, text: JSON.stringify({ text: "" }) }, "reply_invalid"],
    ] as const) {
      const failed = await gatewayMaster(
        gatewayAnswering(result),
        "b",
      )(ask).then(
        () => null,
        (err: unknown) => err,
      );
      expect(failed, reason).toBeInstanceOf(MasterFailed);
      expect((failed as MasterFailed).reason).toBe(reason);
    }
  });
});
