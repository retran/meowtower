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

export type Purpose = "learn" | "practise" | "use";

/** Why a skill is practised: to learn it, to settle it, or to use it for others. */
export function purposeOf(level: number | null): Purpose {
  if (level === null || level <= 2) return "learn";
  return level >= TOP_LEVEL ? "use" : "practise";
}

export interface PracticeItem {
  skill: string;
  purpose: Purpose;
  checks: number;
}

/** The adventure's plan of practice: the skills drawn, each with its purpose and the checks asked (REQ-8416). */
export function practisePlan(
  skills: readonly SkillLevel[],
  count: number,
  seed: Uint8Array,
  checks: number,
): PracticeItem[] {
  const level = new Map(skills.map((s) => [s.skill, s.level]));
  return chooseSkills(skills, count, seed).map((skill) => ({
    skill,
    purpose: purposeOf(level.get(skill) ?? null),
    checks,
  }));
}

/**
 * The skill whose check a player's action takes among those the encounter accepts: the one she needs
 * most, which is the lowest level, and a tie goes by the seed (REQ-8404). `null` where none is known.
 */
export function pickAccepted(
  accepts: readonly string[],
  skills: readonly SkillLevel[],
  seed: Uint8Array,
): string | null {
  const known = skills.filter((s) => accepts.includes(s.skill));
  const lowest = Math.min(...known.map((s) => s.level ?? 1));
  const tied = known.filter((s) => (s.level ?? 1) === lowest);
  if (tied.length === 0) return null;
  return tied[Xoshiro128.fromSeed(seed).int(tied.length)]?.skill ?? null;
}
