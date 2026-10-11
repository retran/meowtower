// TSK-0517: each pair keeps its own estimate, which forgets with a half-life, moves on
// feedback, on evidence and on practice, in that order (ADR-0060, REQ-0908 to REQ-0930).
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  applyObservation,
  estimatePairs,
  freshPair,
  pKnowAt,
  type PairState,
} from "../../src/engine/model/bkt.js";
import type { Observation } from "../../src/engine/model/observations.js";
import {
  loadParams,
  pGuessOf,
  pSlipOf,
} from "../../src/engine/model/params.js";

const params = loadParams(
  readFileSync(new URL("../../content/model.v1.json", import.meta.url), "utf8"),
);
const DAY = 86_400_000;
const obs = (over: Partial<Observation>): Observation => ({
  itemId: "i",
  node: "N1",
  subtype: "sum",
  c: 1,
  w: 1,
  timeMs: 0,
  at: 0,
  form: "free",
  options: 0,
  steps: 1,
  postFeedback: false,
  timeCounts: true,
  control: false,
  ...over,
});

describe("REQ-0908: each pair keeps its own estimate", () => {
  it("leaves the other subtype at its prior and moves the observed one", () => {
    const states = estimatePairs(
      [obs({ subtype: "a", at: DAY })],
      params,
      () => 0.55,
    );
    expect(pKnowAt(states.get("N1.b") ?? freshPair(0.55, params), DAY)).toBe(
      0.55,
    );
    expect(states.get("N1.a")?.p).not.toBe(0.55);
  });
});

describe("REQ-0912: forgetting halves the estimate after one half-life", () => {
  it("halves at 60 days and quarters at 120 days", () => {
    const state: PairState = { p: 0.8, halfLifeDays: 60, last: 0 };
    expect(pKnowAt(state, 60 * DAY)).toBeCloseTo(0.4, 12);
    expect(pKnowAt(state, 120 * DAY)).toBeCloseTo(0.2, 12);
  });
});

describe("REQ-0920: feedback before the task raises p, then the evidence step runs", () => {
  it("matches the hand-computed value", () => {
    const fresh = freshPair(0.5, params);
    const after = applyObservation(
      fresh,
      obs({ postFeedback: true, c: 1, at: DAY }),
      params,
    );
    const fed = 0.5 + 0.5 * 0.15;
    const pr = (fed * 0.9) / (fed * 0.9 + (1 - fed) * 0.03);
    const practiced = pr + (1 - pr) * 0.05;
    expect(after.p).toBeCloseTo(practiced, 12);
  });
});

describe("REQ-0922: the golden sequence of ten observations on one pair", () => {
  it("gives the test's values after each observation, and the half-life rules", () => {
    const seq: Observation[] = [1, 1, 0, 1, 0.5, 1, 1, 0, 1, 1].map((c, i) =>
      obs({ c, at: (i + 1) * 5 * DAY, postFeedback: i === 2 }),
    );
    let state = freshPair(0.55, params);
    const ps: number[] = [];
    for (const o of seq) {
      state = applyObservation(state, o, params);
      ps.push(Number(state.p.toFixed(6)));
    }
    expect(ps).toEqual(GOLDEN_P);
    expect(state.halfLifeDays).toBe(135);
  });

  it("lengthens H after a right answer at least 3 days late, resets it after a wrong one, keeps it after a partial one", () => {
    const start = freshPair(0.5, params);
    const first = applyObservation(start, obs({ c: 1, at: 0 }), params);
    const late = applyObservation(first, obs({ c: 1, at: 5 * DAY }), params);
    expect(late.halfLifeDays).toBe(90);
    const wrong = applyObservation(late, obs({ c: 0, at: 6 * DAY }), params);
    expect(wrong.halfLifeDays).toBe(60);
    const partial = applyObservation(
      late,
      obs({ c: 0.5, at: 6 * DAY }),
      params,
    );
    expect(partial.halfLifeDays).toBe(90);
    const soon = applyObservation(first, obs({ c: 1, at: 1 * DAY }), params);
    expect(soon.halfLifeDays).toBe(60);
  });
});

describe("REQ-0926: a control fact moves its pair like any observation", () => {
  it("applies the same step", () => {
    const plain = applyObservation(
      freshPair(0.4, params),
      obs({ c: 1, at: DAY }),
      params,
    );
    const control = applyObservation(
      freshPair(0.4, params),
      obs({ c: 1, at: DAY, control: true }),
      params,
    );
    expect(control.p).toBe(plain.p);
  });
});

describe("REQ-0928: pGuess and pSlip by form and steps", () => {
  it("gives 0.03 for free input, 0.25 for four options, and the slip of three steps", () => {
    expect(pGuessOf(params, "free", 0)).toBe(0.03);
    expect(pGuessOf(params, "choice", 4)).toBe(0.25);
    expect(pSlipOf(params, 3)).toBeCloseTo(Math.max(0.1, 1 - 0.95 ** 3), 12);
    expect(pSlipOf(params, 1)).toBe(0.1);
  });
});

// The golden values, from the step order of ADR-0060 on the sequence of the test above.
const GOLDEN_P: number[] = [
  0.974779, 0.997257, 0.756277, 0.987472, 0.839011, 0.992502, 0.998932,
  0.856459, 0.992553, 0.998512,
];
