// REQ-8394, REQ-8398, REQ-8400: the nine skills, and a skill's score as a whole level plus the
// percentage to the next, from the levels and estimates of its nodes.
import { describe, expect, it } from "vitest";
import {
  fractionOf,
  SKILLS,
  skillScoresOf,
  type SkillNode,
} from "../../src/engine/model/skills.js";

const node = (
  domain: string,
  level: number,
  estimate: number,
  answers = 5,
): SkillNode => ({
  node: `${domain}${String(level)}`,
  domain,
  level,
  estimate,
  answers,
});

describe("the nine skills", () => {
  it("has one skill for each of the graph's nine domains", () => {
    expect(SKILLS).toHaveLength(9);
    expect(new Set(SKILLS.map((s) => s.domain)).size).toBe(9);
    expect(SKILLS.map((s) => s.domain).sort()).toEqual([
      "A",
      "D",
      "F",
      "G",
      "M",
      "N",
      "P",
      "S",
      "T",
    ]);
  });
});

describe("the fraction of the way to the next level", () => {
  it("runs from a level's own line to the next line", () => {
    expect(fractionOf(2, 0.475)).toBeCloseTo(0.5);
    expect(fractionOf(1, 0.175)).toBeCloseTo(0.5);
    expect(fractionOf(5, 0.96)).toBeCloseTo(0.5);
  });

  it("counts below zero as zero and never reaches a whole level before the rule says so", () => {
    expect(fractionOf(3, 0.5)).toBe(0);
    expect(fractionOf(2, 0.9)).toBeLessThan(1);
    expect(fractionOf(1, 0.99)).toBeLessThan(1);
  });
});

describe("a skill's score", () => {
  it("is not yet shown when no node of the domain has an answer", () => {
    const scores = skillScoresOf([node("N", 1, 0.9, 0)]);
    const marks = scores.find((s) => s.skill === "marks");
    expect(marks).toMatchObject({ shown: false });
    expect(marks && "level" in marks).toBe(false);
  });

  it("starts on level 1 at 0 % after the first answer", () => {
    const [marks] = skillScoresOf([node("N", 1, 0, 1)]);
    expect(marks).toMatchObject({ shown: true, level: 1, percent: 0 });
  });

  it("shows a whole level and the percentage to the next", () => {
    const [marks] = skillScoresOf([node("N", 2, 0.475)]);
    expect(marks).toMatchObject({ shown: true, level: 2, percent: 50 });
  });

  it("is the mean over answered nodes, leaving out the nodes with no answer", () => {
    const [marks] = skillScoresOf([
      node("N", 2, 0.35),
      node("N", 4, 0.8),
      { node: "Nx", domain: "N", level: 1, estimate: 0.9, answers: 0 },
    ]);
    // (2.0 + 4.0) / 2 = 3.0
    expect(marks).toMatchObject({ level: 3, percent: 0 });
  });

  it("rises in small steps within a level", () => {
    const at = (p: number) => skillScoresOf([node("N", 3, p)])[0];
    expect(at(0.6)).toMatchObject({ level: 3, percent: 0 });
    expect(at(0.7)).toMatchObject({ level: 3, percent: 50 });
    expect(at(0.79)).toMatchObject({ level: 3 });
  });

  it("fills towards full mastery on level 5", () => {
    const [marks] = skillScoresOf([node("N", 5, 0.96)]);
    expect(marks).toMatchObject({ level: 5, percent: 50 });
  });

  it("never shows a level higher than its nodes hold", () => {
    const [marks] = skillScoresOf([node("N", 1, 0.9, 2)]);
    expect(marks).toMatchObject({ level: 1 });
  });
});
