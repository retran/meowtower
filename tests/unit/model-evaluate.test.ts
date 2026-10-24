// TSK-0529: the candidate model is kept only when it predicts the held-out attempts better on
// log-loss and on calibration (ADR-0060, SPC-0060, REQ-0980 superseded by REQ-7506).
import { describe, expect, it } from "vitest";
import { type Observation } from "../../src/engine/model/observations.js";
import {
  decideActivation,
  eceOf,
  figuresOf,
  gateRuns,
  heldOutDays,
  logLossOf,
  predictionsOf,
} from "../../src/engine/model/evaluate.js";
import { loadParams } from "../../src/engine/model/params.js";
import { readFileSync } from "node:fs";

const params = loadParams(
  readFileSync(new URL("../../content/model.v1.json", import.meta.url), "utf8"),
);
const ZONE = "Europe/Amsterdam";
const DAY = 86_400_000;
const NOON = Date.UTC(2026, 9, 1, 10); // mid-morning in Amsterdam, so the game day is the date
const obs = (over: Partial<Observation>): Observation => ({
  itemId: "i",
  node: "N1",
  subtype: "a",
  c: 1,
  w: 1,
  timeMs: 1000,
  at: NOON,
  form: "free",
  options: 0,
  steps: 1,
  postFeedback: false,
  timeCounts: true,
  control: false,
  probe: false,
  seq: 0,
  ...over,
});

describe("AC5: log-loss and calibration by hand", () => {
  it("gives the log-loss of predictions 0.8 right and 0.5 wrong", () => {
    const preds = [
      { p: 0.8, c: 1 },
      { p: 0.5, c: 0 },
    ];
    expect(logLossOf(preds)).toBeCloseTo(
      (-Math.log(0.8) - Math.log(0.5)) / 2,
      12,
    );
  });

  it("gives the calibration error of those predictions as 0.35 over ten bins", () => {
    // bin 8 holds p 0.8 with c 1: |0.8 - 1| * 1/2; bin 5 holds p 0.5 with c 0: |0.5 - 0| * 1/2
    expect(
      eceOf([
        { p: 0.8, c: 1 },
        { p: 0.5, c: 0 },
      ]),
    ).toBeCloseTo(0.35, 12);
  });
});

describe("AC5: the held-out days are the last fifth of the play days, rounded up", () => {
  const onDays = (days: number[]) =>
    days.map((d, k) => obs({ at: NOON + d * DAY, seq: k }));

  it("holds the last two of ten play days", () => {
    const days = onDays([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect([...heldOutDays(days, ZONE)].sort((a, b) => a - b)).toHaveLength(2);
  });

  it("holds one of three play days, rounding the fifth up", () => {
    expect(heldOutDays(onDays([0, 1, 2]), ZONE).size).toBe(1);
  });

  it("holds none of an empty log", () => {
    expect(heldOutDays([], ZONE).size).toBe(0);
  });
});

describe("AC5: a prediction uses only the events before it", () => {
  it("is the same whatever the outcome of the attempt it predicts", () => {
    const earlier = obs({ at: NOON, seq: 1, c: 1 });
    const ask = (outcome: number) =>
      predictionsOf(
        [earlier, obs({ at: NOON + 9 * DAY, seq: 2, c: outcome })],
        params,
        () => 0.5,
        ZONE,
      );
    const yes = ask(1);
    const no = ask(0);
    expect(yes.map((p) => p.p)).toEqual(no.map((p) => p.p));
    expect(yes.map((p) => p.c)).not.toEqual(no.map((p) => p.c));
  });
});

describe("AC1: a candidate worse on log-loss or on calibration is refused, and names each measure", () => {
  const active = { logLoss: 0.5, ece: 0.05, n: 100 };

  it("refuses a candidate worse on log-loss only", () => {
    const d = decideActivation(active, { logLoss: 0.6, ece: 0.04, n: 100 });
    expect(d.accepted).toBe(false);
    expect(d.reasons.join(" ")).toMatch(
      /log-loss 0\.6000 is not lower than 0\.5000/,
    );
  });

  it("refuses a candidate worse on calibration only", () => {
    const d = decideActivation(active, { logLoss: 0.4, ece: 0.06, n: 100 });
    expect(d.accepted).toBe(false);
    expect(d.reasons.join(" ")).toMatch(
      /calibration error 0\.0600 is not lower than 0\.0500/,
    );
  });

  it("accepts a candidate lower on both", () => {
    expect(
      decideActivation(active, { logLoss: 0.4, ece: 0.04, n: 100 }),
    ).toEqual({ accepted: true, reasons: [] });
  });

  it("figuresOf reads both measures from the predictions", () => {
    const f = figuresOf([
      { p: 0.8, c: 1 },
      { p: 0.5, c: 0 },
    ]);
    expect(f.n).toBe(2);
    expect(f.ece).toBeCloseTo(0.35, 12);
  });
});

describe("AC3, AC4: the gate runs only for a new file with a predecessor", () => {
  it("skips the gate for model v1 with no predecessor", () => {
    expect(
      decideActivation(undefined, { logLoss: 1, ece: 1, n: 0 }).accepted,
    ).toBe(true);
    expect(gateRuns(undefined, "model.v1.json")).toBe(false);
  });

  it("runs no gate for a change of school group, which keeps the file", () => {
    expect(gateRuns("model.v1.json", "model.v1.json")).toBe(false);
  });

  it("runs the gate for a new file over a predecessor", () => {
    expect(gateRuns("model.v1.json", "model.v2.json")).toBe(true);
  });
});
