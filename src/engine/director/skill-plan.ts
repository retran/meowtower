// Which skills an adventure practises (REQ-8420, REQ-8422): drawn by weighted chance, so a less
// developed skill comes up more often and none is certain, from a seed that defaults to a function
// of the adventure so a replay draws the same.
import { baseSeed, Xoshiro128 } from "../../math/rng.js";

const TOP_LEVEL = 5;

export interface SkillLevel {
  skill: string;
  /** `null` when the skill is not yet shown. */
  level: number | null;
}

/** 1 plus the levels a skill lacks to the top; a skill not yet shown weighs like level 1. */
export function weightOf(level: number | null): number {
  return 1 + TOP_LEVEL - (level ?? 1);
}

export function defaultSeed(adventureKey: string): Uint8Array {
  return baseSeed(adventureKey, "skills", 0);
}

/** Up to `count` distinct skills, each draw weighted by what the skill lacks. */
export function chooseSkills(
  skills: readonly SkillLevel[],
  count: number,
  seed: Uint8Array,
): string[] {
  const rng = Xoshiro128.fromSeed(seed);
  const pool = skills.map((s) => ({
    skill: s.skill,
    weight: weightOf(s.level),
  }));
  const chosen: string[] = [];
  while (chosen.length < count && pool.length > 0) {
    let roll = rng.int(pool.reduce((sum, s) => sum + s.weight, 0));
    const index = pool.findIndex((s) => (roll -= s.weight) < 0);
    chosen.push(pool[index]?.skill ?? "");
    pool.splice(index, 1);
  }
  return chosen;
}
