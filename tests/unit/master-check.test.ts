// REQ-8180, REQ-8172, REQ-8176 (ADR-3270): a check's outcome is the engine's, mapped on the ladder
// clean to success, partial to cost and alt to twist, and the Master gets it as a fact it can not change.
import { describe, expect, it } from "vitest";
import type {
  Gateway,
  GatewayRequest,
} from "../../src/server/gateway/gateway.js";
import { gatewayMaster } from "../../src/story/master-gateway.js";
import { checkReply, ladder } from "../../src/story/check.js";
import { takeTurn, type MasterRequest } from "../../src/story/turn.js";

describe("REQ-8180: the outcome ladder", () => {
  it("makes a clean answer a success, a partial one a cost and a failed one a twist", () => {
    expect(ladder("clean")).toBe("success");
    expect(ladder("partial")).toBe("cost");
    expect(ladder("alt")).toBe("twist");
  });

  it("gives the Master the outcome alone, with no node, level or estimate", () => {
    for (const o of ["clean", "partial", "alt"] as const)
      expect(Object.keys(checkReply(o))).toEqual(["outcome"]);
    expect(checkReply("partial")).toEqual({ outcome: "cost" });
  });
});

describe("REQ-8172: the result reaches the Master as a fact", () => {
  it("passes the result of the check to the model, and none on an ordinary turn", async () => {
    const seen: MasterRequest[] = [];
    const model = (r: MasterRequest) => {
      seen.push(r);
      return Promise.resolve({ text: "It goes on.", calls: [] });
    };
    const base = {
      model,
      scenario: "{}",
      encounter: "e1",
      said: "I climb",
      lang: "ru" as const,
      blockedText: "x",
    };
    await takeTurn({ ...base, checkResult: "twist" });
    await takeTurn(base);
    expect(seen[0]?.checkResult).toBe("twist");
    expect(seen[1]?.checkResult).toBeUndefined();
  });

  it("puts the result in the message of the turn and never in the cached prefix", async () => {
    const sent: GatewayRequest[] = [];
    const gateway: Gateway = {
      call(r) {
        sent.push(r);
        return Promise.resolve({
          ok: true,
          text: JSON.stringify({ text: "Fine." }),
        });
      },
    };
    const ask = { system: "SYSTEM", said: "I climb", encounter: "e1" };
    await gatewayMaster(gateway, "b")({ ...ask, checkResult: "cost" });
    await gatewayMaster(gateway, "b")(ask);
    expect(sent[0]?.user).toContain("cost");
    expect(sent[0]?.user).toMatch(/cannot change|can not change/i);
    expect(sent[0]?.system).toBe("SYSTEM");
    expect(sent[1]?.user).not.toMatch(/check result/i);
  });
});
