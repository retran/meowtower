// TSK-0521: the "with help" and fluency estimates are beta estimates from alpha = beta = 1.
// Assisted attempts never touch pKnow or fluency; each one ages by 2^(-age / 30 days)
// (ADR-0060, REQ-0922 to REQ-0930).
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { estimatePairs } from "../../src/engine/model/bkt.js";
import {
  fluencyOf,
  fluencyThresholdSeconds,
  withHelpOf,
} from "../../src/engine/model/beta.js";
import {
  observationsOf,
  type LogEvent,
  type Observation,
} from "../../src/engine/model/observations.js";
import { loadParams } from "../../src/engine/model/params.js";

const params = loadParams(
  readFileSync(new URL("../../content/model.v1.json", import.meta.url), "utf8"),
);
const DAY = 86_400_000;
const NOW = 100 * DAY;
const obs = (over: Partial<Observation>): Observation => ({
  itemId: "i",
  node: "N1",
  subtype: "a",
  c: 1,
  w: 1,
  timeMs: 1000,
  at: NOW,
  form: "free",
  options: 0,
  steps: 1,
  postFeedback: false,
  timeCounts: true,
  control: false,
  ...over,
});

/** One graded attempt on item `id`, given as log events (the shape observationsOf reads). */
const attempt = (
  id: string,
  at: number,
  verdict: string,
  extra: Record<string, unknown> = {},
): LogEvent[] => {
  const ts = new Date(at).toISOString();
  return [
    {
      type: "item_shown",
      payload: {
        itemId: id,
        node: "N1",
        subtype: "a",
        purpose: "task",
        answerForm: "free",
        options: 0,
        steps: 1,
      },
      ts,
    },
    {
      type: "attempt_submitted",
      payload: {
        itemId: id,
        attemptNo: 1,
        input: { submittedMs: 1000 },
        ...extra,
      },
      ts,
    },
    { type: "verdict", payload: { itemId: id, verdict }, ts },
  ];
};

describe("REQ-0922: an assisted attempt changes the with-help estimate and nothing else", () => {
  it("leaves pKnow and fluency exactly as they were", () => {
    const base = [...attempt("a1", 10 * DAY, "correct")];
    const withAssist = [
      ...base,
      ...attempt("a2", 20 * DAY, "correct", { assisted: true, hintLevel: 1 }),
    ];
    const plain = observationsOf(base);
    const assisted = observationsOf(withAssist);
    expect(assisted.own).toEqual(plain.own);
    expect(assisted.help).toHaveLength(1);
    expect(estimatePairs(assisted.own, params, () => 0.5)).toEqual(
      estimatePairs(plain.own, params, () => 0.5),
    );
    expect(fluencyOf(assisted.own, NOW)).toEqual(fluencyOf(plain.own, NOW));
    expect(withHelpOf(assisted.help, NOW)).not.toEqual(
      withHelpOf(plain.help, NOW),
    );
  });
});

describe("REQ-0924: a right assisted attempt 30 days old counts half of one made today", () => {
  it("halves its contribution to the with-help alpha", () => {
    const today = withHelpOf([obs({ at: NOW })], NOW);
    const aged = withHelpOf([obs({ at: NOW - 30 * DAY })], NOW);
    expect(aged.alpha - 1).toBeCloseTo((today.alpha - 1) / 2, 12);
  });
});

describe("REQ-0926: fluency adds to alpha when fast and right, to beta otherwise", () => {
  it("gives exact values for a fast right attempt, a slow right one and a wrong one", () => {
    const threshold = fluencyThresholdSeconds("N1") * 1000;
    const fast = obs({ at: NOW, timeMs: threshold });
    const slow = obs({ at: NOW, timeMs: threshold + 1 });
    const wrong = obs({ at: NOW, c: 0, timeMs: 1 });
    expect(fluencyOf([fast], NOW)).toEqual({ alpha: 2, beta: 1 });
    expect(fluencyOf([slow], NOW)).toEqual({ alpha: 1, beta: 2 });
    expect(fluencyOf([wrong], NOW)).toEqual({ alpha: 1, beta: 2 });
  });
});

describe("REQ-0928: an observation 30 days old counts half of what it did on the day", () => {
  it("halves the fluency contribution", () => {
    const today = fluencyOf([obs({ at: NOW })], NOW).alpha - 1;
    const aged = fluencyOf([obs({ at: NOW - 30 * DAY })], NOW).alpha - 1;
    expect(aged).toBeCloseTo(today / 2, 12);
  });
});

describe("REQ-0930: an interrupted or cross-device attempt is never fast", () => {
  it("adds its weight to beta even when it was quick", () => {
    expect(fluencyOf([obs({ at: NOW, timeCounts: false })], NOW)).toEqual({
      alpha: 1,
      beta: 2,
    });
  });
});
