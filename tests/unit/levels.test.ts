// REQ-7960, REQ-7962, REQ-7966, REQ-7968, REQ-7978: a node's ability level comes from its estimate
// by rule level.v1, and one bad answer doesn't move it.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  type LevelObservation,
  LEVEL_RULE,
  levelOf,
  simulateChanges,
} from "../../src/engine/model/levels.js";
import { validateParams } from "../../src/engine/model/params.js";

const params = validateParams(
  JSON.parse(readFileSync("content/model.v1.json", "utf8")),
);
const DAY = 86_400_000;
const answer = (
  c: number,
  day: number,
  olympiad = false,
): LevelObservation => ({
  subtype: "s",
  c,
  w: 1,
  at: day * DAY,
  form: "free",
  options: 0,
  steps: 2,
  postFeedback: false,
  itemId: `i${String(day)}`,
  olympiad,
});
const ask = { weights: { s: 1 }, prior: 0.3, hasOlympiad: false, params };

describe("an ability's level", () => {
  it("starts from the prior and names its rule", () => {
    const got = levelOf([], ask);
    expect(got.level).toBe(1);
    expect(got.rule).toBe(LEVEL_RULE);
  });

  it("stays on level 1 with no answers, whatever the prior says", () => {
    expect(levelOf([], { ...ask, prior: 0.9 }).level).toBe(1);
  });

  it("stays on level 1 until three answers stand behind it", () => {
    const two = [answer(1, 1), answer(1, 2)];
    expect(levelOf(two, { ...ask, prior: 0.9 }).level).toBe(1);
    const three = [...two, answer(1, 3)];
    expect(levelOf(three, { ...ask, prior: 0.9 }).level).toBeGreaterThan(1);
  });

  it("rises as soon as the estimate reaches a line", () => {
    const rights = Array.from({ length: 12 }, (_, i) => answer(1, i));
    const got = levelOf(rights, ask);
    expect(got.level).toBeGreaterThanOrEqual(4);
    expect(got.changes[0]?.from).toBe(1);
  });

  it("doesn't fall on one or two bad answers, and warns on the second", () => {
    const rights = Array.from({ length: 12 }, (_, i) => answer(1, i * 4));
    const high = levelOf(rights, ask).level;
    const one = levelOf([...rights, answer(0, 60)], ask);
    expect(one.level).toBe(high);
    expect(one.warning).toBe(false);
    const two = levelOf([...rights, answer(0, 60), answer(0, 61)], ask);
    expect(two.level).toBe(high);
    expect(two.warning).toBe(true);
  });

  it("falls after three in a row below the line", () => {
    const rights = Array.from({ length: 12 }, (_, i) => answer(1, i * 4));
    const high = levelOf(rights, ask).level;
    const got = levelOf(
      [...rights, answer(0, 60), answer(0, 61), answer(0, 62), answer(0, 63)],
      ask,
    );
    expect(got.level).toBeLessThan(high);
    expect(got.changes.at(-1)?.fell).toBe(true);
  });

  it("needs two clean olympiad attempts for level 5 where the node has them", () => {
    const rights = Array.from({ length: 40 }, (_, i) => answer(1, i * 4));
    const on = { ...ask, hasOlympiad: true };
    expect(levelOf(rights, on).level).toBe(4);
    const two = [...rights, answer(1, 200, true), answer(1, 204, true)];
    expect(levelOf(two, on).level).toBe(5);
  });
});

describe("the simulation of level.v1", () => {
  it("changes a steady player's level at most once in 180 days", () => {
    const changes = simulateChanges(params, { recall: 0.9, gapDays: 2 });
    expect(changes.after).toBeLessThanOrEqual(1);
  });

  it("finds a true drop within 14 days", () => {
    const { daysToFall } = simulateChanges(params, {
      recall: 0.9,
      gapDays: 2,
      dropTo: 0.4,
    });
    expect(daysToFall).toBeLessThanOrEqual(14);
  });
});
