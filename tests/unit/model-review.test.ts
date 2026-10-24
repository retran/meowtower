// TSK-0522: the review ladder, staleness and confidence of a node row (ADR-0060,
// REQ-0992, REQ-0994). Logs go through observationsOf, so the exclusions are the real ones.
import { describe, expect, it } from "vitest";
import { confidenceOf, reviewOf } from "../../src/engine/model/review.js";
import {
  observationsOf,
  type LogEvent,
  type Observation,
} from "../../src/engine/model/observations.js";

const DAY = 86_400_000;
const NOW = 100 * DAY;
const obs = (at: number, c: number): Observation => ({
  itemId: `i${at}`,
  node: "N1",
  subtype: "a",
  c,
  w: 1,
  timeMs: 1000,
  at,
  form: "free",
  options: 0,
  steps: 1,
  postFeedback: false,
  timeCounts: true,
  control: false,
  probe: false,
  seq: 0,
});

describe("REQ-0992: after an unassisted failure the next review is one day later", () => {
  it("sets lastSeen plus 1 day", () => {
    const review = reviewOf([obs(10 * DAY, 0)], NOW);
    expect(review.lastSeen).toBe(10 * DAY);
    expect(review.nextReview).toBe(11 * DAY);
  });
});

describe("REQ-0992: five successes in a row give the ladder 1, 3, 7, 14, then 30 days", () => {
  it("reads nextReview after each success and after two more", () => {
    const run = [1, 2, 3, 4, 5, 6, 7].map((k) => obs(k * DAY, 1));
    const steps = [1, 3, 7, 14, 30, 30, 30];
    run.forEach((_, k) => {
      const review = reviewOf(run.slice(0, k + 1), NOW);
      expect(review.lastSeen).toBe((k + 1) * DAY);
      expect(review.nextReview).toBe((k + 1) * DAY + (steps[k] ?? 0) * DAY);
    });
  });
});

describe("REQ-0992: a partly right answer after four successes ends the run as a failure", () => {
  it("sets lastSeen plus 1 day", () => {
    const run = [
      obs(1 * DAY, 1),
      obs(2 * DAY, 1),
      obs(3 * DAY, 1),
      obs(4 * DAY, 1),
      obs(5 * DAY, 0.5),
    ];
    expect(reviewOf(run, NOW).nextReview).toBe(6 * DAY);
  });
});

describe("REQ-0994: stale after 30 days, and warm-ups, rapid guesses and exclusions leave lastSeen alone", () => {
  const attempt = (
    id: string,
    day: number,
    extra: Record<string, unknown> = {},
    purpose = "task",
  ): LogEvent[] => {
    const ts = new Date(day * DAY).toISOString();
    return [
      {
        type: "item_shown",
        payload: {
          itemId: id,
          node: "N1",
          subtype: "a",
          purpose,
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
      { type: "verdict", payload: { itemId: id, verdict: "correct" }, ts },
    ];
  };

  it("is stale at 31 days old and not at 30", () => {
    const old = reviewOf(observationsOf(attempt("a", 69)).own, NOW);
    const edge = reviewOf(observationsOf(attempt("b", 70)).own, NOW);
    expect(old.stale).toBe(true);
    expect(edge.stale).toBe(false);
  });

  it("keeps lastSeen where it was after a warm-up, a rapid guess and an excluded task", () => {
    const log: LogEvent[] = [
      ...attempt("a", 70),
      ...attempt("w", 80, {}, "warmup"),
      ...attempt("r", 85, { rapidGuess: true }),
      ...attempt("x", 90),
      {
        type: "item_excluded",
        payload: { itemId: "x" },
        ts: new Date(90 * DAY).toISOString(),
      },
    ];
    expect(reviewOf(observationsOf(log).own, NOW).lastSeen).toBe(70 * DAY);
  });
});

describe("TSK-0522 AC5: confidence from hand-written evidence until blocks and inferred states exist", () => {
  it("is high for a full block 10 days old, medium for a probe 20 days old and low for an inferred state", () => {
    expect(confidenceOf({ kind: "full", ageDays: 10 })).toBe("high");
    expect(confidenceOf({ kind: "probe", ageDays: 20 })).toBe("medium");
    expect(confidenceOf({ kind: "inferred", ageDays: 1 })).toBe("low");
  });

  it("is low for a probe older than 30 days", () => {
    expect(confidenceOf({ kind: "probe", ageDays: 31 })).toBe("low");
  });
});
