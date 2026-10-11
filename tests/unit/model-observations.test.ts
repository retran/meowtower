// TSK-0516: the observations of the knowledge model come from the log alone. Only a
// graded first attempt without help is an observation of the "on her own" estimate; a
// second or assisted attempt is listed apart; an excluded, rapid-guess or unparsed
// attempt is in none; an interrupted attempt counts for accuracy but not for time
// (REQ-0914 to REQ-0930, ADR-0500).
import { describe, expect, it } from "vitest";
import {
  observationsOf,
  type LogEvent,
} from "../../src/engine/model/observations.js";

const shown = (
  itemId: string,
  node: string,
  purpose = "frontier",
  attemptNo = 1,
  parent?: string,
): LogEvent => ({
  type: "item_shown",
  payload: {
    itemId,
    node,
    subtype: "sum",
    purpose,
    attemptNo,
    ...(parent ? { parentItemId: parent } : {}),
  },
});
const submitted = (
  itemId: string,
  extra: Record<string, unknown> = {},
): LogEvent => ({
  type: "attempt_submitted",
  payload: {
    itemId,
    attemptNo: 1,
    input: { submittedMs: 2000 },
    answer: { entered: "7", parsed: 7 },
    assisted: false,
    hintLevel: 0,
    interrupted: false,
    crossDevice: false,
    ...extra,
  },
});
const verdict = (itemId: string, v: string, attemptNo = 1): LogEvent => ({
  type: "verdict",
  payload: { itemId, attemptNo, verdict: v },
});

describe("REQ-0914: only a first attempt without help is an observation of the estimate", () => {
  const log: LogEvent[] = [
    shown("a", "N1"),
    submitted("a"),
    verdict("a", "correct"),
    shown("b", "N1", "frontier", 2, "a"),
    submitted("b", { attemptNo: 2 }),
    verdict("b", "correct", 2),
    shown("c", "N1"),
    submitted("c", { assisted: true, hintLevel: 1 }),
    verdict("c", "correct"),
    shown("w", "N1", "warmup"),
    submitted("w"),
    verdict("w", "correct"),
    shown("s", "N1", "session0"),
    submitted("s"),
    verdict("s", "correct"),
    { type: "attempt_late", payload: { itemId: "a" } },
  ];
  const result = observationsOf(log);

  it("keeps only the first unassisted attempt in the own estimate", () => {
    expect(result.own.map((o) => o.itemId)).toEqual(["a"]);
  });

  it("lists the second and the assisted attempt apart, for the with-help estimate", () => {
    expect(result.help.map((o) => o.itemId).sort()).toEqual(["b", "c"]);
  });
});

describe("REQ-0916: an excluded task is in no list until it is included again", () => {
  it("keeps an item excluded and never re-included out of every list", () => {
    const log: LogEvent[] = [
      shown("x", "N1"),
      submitted("x"),
      verdict("x", "correct"),
      { type: "item_excluded", payload: { itemId: "x", reason: "parent" } },
    ];
    expect(observationsOf(log).own).toEqual([]);
  });

  it("puts an item back once item_included follows its exclusion", () => {
    const log: LogEvent[] = [
      shown("y", "N1"),
      submitted("y"),
      verdict("y", "correct"),
      { type: "item_excluded", payload: { itemId: "y", reason: "parent" } },
      { type: "item_included", payload: { itemId: "y" } },
    ];
    expect(observationsOf(log).own.map((o) => o.itemId)).toEqual(["y"]);
  });
});

describe("REQ-0918: the score and the weight of each verdict", () => {
  it("scores right, partly right, wrong and dont_know as 1, 0.5, 0 and 0", () => {
    const scores = ["correct", "partial", "wrong", "dont_know"].map((v, i) => {
      const id = `v${i}`;
      return observationsOf([shown(id, "N1"), submitted(id), verdict(id, v)])
        .own[0]?.c;
    });
    expect(scores).toEqual([1, 0.5, 0, 0]);
  });

  it("weights an attempt with the fatigue mark 0.5 and an ordinary one 1", () => {
    const log: LogEvent[] = [
      shown("f", "N1"),
      submitted("f", { fatigue: true }),
      verdict("f", "correct"),
      shown("g", "N1"),
      submitted("g"),
      verdict("g", "correct"),
    ];
    const weights = observationsOf(log).own.map((o) => [o.itemId, o.w]);
    expect(weights).toEqual([
      ["f", 0.5],
      ["g", 1],
    ]);
  });
});

describe("REQ-0918: a rapid guess is in none of the lists", () => {
  it("drops an attempt marked rapidGuess", () => {
    const log: LogEvent[] = [
      shown("r", "N1"),
      submitted("r", { rapidGuess: true }),
      verdict("r", "correct"),
    ];
    expect(observationsOf(log)).toEqual({ own: [], help: [] });
  });

  it("keeps an interrupted attempt for accuracy and drops its time from every measure", () => {
    const log: LogEvent[] = [
      shown("i", "N1"),
      submitted("i", { interrupted: true }),
      verdict("i", "correct"),
    ];
    const [obs] = observationsOf(log).own;
    expect(obs?.c).toBe(1);
    expect(obs?.timeCounts).toBe(false);
  });
});

describe("REQ-0930: an attempt on a control fact is an observation of its own node", () => {
  it("marks a control fact's attempt as control on its node and subtype", () => {
    const log: LogEvent[] = [
      shown("k", "N2", "control"),
      submitted("k"),
      verdict("k", "correct"),
    ];
    const [obs] = observationsOf(log).own;
    expect(obs).toEqual(
      expect.objectContaining({ node: "N2", subtype: "sum", control: true }),
    );
  });
});
