// REQ-8172, REQ-8180 (ADR-3270): the outcome a check gives the Master is the engine's latest verdict
// that no turn has used yet, read from the log and never typed by the model.
import { describe, expect, it } from "vitest";
import { engineOutcomeOf } from "../../src/story/check.js";

const verdict = (outcome: string) => ({
  type: "verdict",
  payload: { outcome },
});
const turn = { type: "turn_taken", payload: {} };

describe("REQ-8172: the engine's outcome of the check", () => {
  it("reads the latest verdict after the last turn", () => {
    expect(engineOutcomeOf([verdict("alt"), turn, verdict("clean")])).toBe(
      "clean",
    );
    expect(engineOutcomeOf([verdict("clean"), verdict("partial")])).toBe(
      "partial",
    );
  });

  it("has none when a turn already used the last verdict, or when nothing was answered", () => {
    expect(engineOutcomeOf([verdict("clean"), turn])).toBeNull();
    expect(engineOutcomeOf([])).toBeNull();
    expect(engineOutcomeOf([turn])).toBeNull();
  });

  it("skips a verdict whose outcome is not one of the engine's", () => {
    expect(engineOutcomeOf([verdict("clean"), verdict("???")])).toBe("clean");
  });
});
