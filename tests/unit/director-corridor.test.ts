// TSK-0532: the success share of the last 10 graded first attempts decides review or frontier
// (ADR-0070, REQ-1006, REQ-1008, REQ-1010).
import { describe, expect, it } from "vitest";
import {
  type Outcome,
  outcomesOf,
  slotType,
  successShare,
} from "../../src/engine/director/corridor.js";
import type { LogEvent } from "../../src/engine/model/observations.js";

const verdict = (outcome: Outcome, attemptNo = 1, v = "correct"): LogEvent => ({
  type: "verdict",
  payload: { attemptNo, verdict: v, outcome },
});
const of = (clean: number, partial: number, alt: number): Outcome[] => [
  ...Array<Outcome>(clean).fill("clean"),
  ...Array<Outcome>(partial).fill("partial"),
  ...Array<Outcome>(alt).fill("alt"),
];

describe("REQ-1006: the share counts clean 1, partial 0.5 and alt 0", () => {
  it("weighs the three outcomes", () => {
    expect(successShare(of(5, 2, 3))).toBeCloseTo(0.6, 12);
  });

  it("reads the last ten across adventure boundaries", () => {
    const old = of(0, 0, 5);
    expect(successShare([...old, ...of(10, 0, 0)])).toBe(1);
  });

  it("uses what exists with fewer than ten, and is null with none", () => {
    expect(successShare(of(1, 0, 1))).toBe(0.5);
    expect(successShare([])).toBeNull();
  });

  it("reads graded first attempts only, from the log", () => {
    const log = [
      verdict("clean"),
      verdict("alt", 2),
      verdict("alt", 1, "unparsed"),
      verdict("partial"),
    ];
    expect(outcomesOf(log)).toEqual(["clean", "partial"]);
  });
});

describe("REQ-1006, REQ-1008: below 0.70 the slot is review, above 0.80 it is frontier", () => {
  it.each([
    [0.69, "review"],
    [0.81, "frontier"],
  ] as const)(
    "at %f the slot is %s whatever the deficit says",
    (share, type) => {
      expect(slotType(share, 0, 0)).toBe(type);
      expect(slotType(share, 9, 9)).toBe(type);
    },
  );

  it("is inside the corridor at 0.70 and at 0.80", () => {
    // Inside, the first slot (n = 0, no review yet) is review by the deficit rule.
    expect(slotType(0.7, 0, 0)).toBe("review");
    expect(slotType(0.8, 0, 0)).toBe("review");
    expect(slotType(0.8, 1, 1)).toBe("frontier");
  });

  it("counts no share as inside the corridor", () => {
    expect(slotType(null, 0, 0)).toBe("review");
  });
});

describe("REQ-1010: inside the corridor review is 30 % to 40 % of the slots from 8 on", () => {
  /** Runs `slots` corridor slots and returns how many were review. */
  const reviewIn = (slots: number): number => {
    let review = 0;
    for (let n = 0; n < slots; n += 1)
      if (slotType(0.75, n, review) === "review") review += 1;
    return review;
  };

  it.each([8, 10, 20, 30])("holds the band at %i slots", (slots) => {
    const share = reviewIn(slots) / slots;
    expect(share).toBeGreaterThanOrEqual(0.3);
    expect(share).toBeLessThanOrEqual(0.4);
  });

  it("still runs the rule at 7 slots, where whole slots land outside the band", () => {
    expect(reviewIn(7)).toBe(3);
    expect(3 / 7).toBeGreaterThan(0.4);
  });

  it("follows ceil(0.30 * (n + 1)) for n from 0 to 30", () => {
    for (let n = 0; n <= 30; n += 1) {
      const wanted = Math.ceil(0.3 * (n + 1) - 1e-9);
      expect(slotType(0.75, n, wanted - 1)).toBe("review");
      expect(slotType(0.75, n, wanted)).toBe("frontier");
    }
  });
});
