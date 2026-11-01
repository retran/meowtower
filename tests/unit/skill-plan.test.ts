// REQ-8420, REQ-8422: the skills an adventure practises are drawn by weighted chance from a seed
// that defaults to a function of the adventure.
import { describe, expect, it } from "vitest";
import {
  chooseSkills,
  defaultSeed,
  weightOf,
} from "../../src/engine/director/skill-plan.js";

const skills = [
  { skill: "marks", level: 1 },
  { skill: "mechanics", level: 2 },
  { skill: "sharing", level: 3 },
  { skill: "precision", level: 4 },
  { skill: "trade", level: 5 },
  { skill: "wayfinding", level: null },
] as const;

describe("a skill's weight", () => {
  it("is 1 plus the levels it lacks to the top, and a skill not yet shown weighs like level 1", () => {
    expect(weightOf(1)).toBe(5);
    expect(weightOf(3)).toBe(3);
    expect(weightOf(5)).toBe(1);
    expect(weightOf(null)).toBe(5);
  });
});

describe("the draw", () => {
  it("gives distinct skills and the same ones for the same seed", () => {
    const seed = defaultSeed("adventure-1");
    const first = chooseSkills(skills, 3, seed);
    expect(new Set(first).size).toBe(3);
    expect(chooseSkills(skills, 3, seed)).toEqual(first);
  });

  it("derives the default seed from the adventure alone", () => {
    expect(defaultSeed("a")).toEqual(defaultSeed("a"));
    expect(defaultSeed("a")).not.toEqual(defaultSeed("b"));
  });

  it("takes every skill when asked for more than there are", () => {
    expect(chooseSkills(skills, 99, defaultSeed("x"))).toHaveLength(6);
  });

  it("favours a less developed skill but is never certain", () => {
    const counts = new Map<string, number>();
    for (let i = 0; i < 3000; i += 1)
      for (const s of chooseSkills(skills, 2, defaultSeed(`run-${String(i)}`)))
        counts.set(s, (counts.get(s) ?? 0) + 1);
    const of = (s: string): number => counts.get(s) ?? 0;
    expect(of("marks")).toBeGreaterThan(of("trade"));
    expect(of("marks")).toBeLessThan(3000);
    expect(of("trade")).toBeGreaterThan(0);
  });
});
