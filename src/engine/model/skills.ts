// The player's nine skills in game terms (ADR-3300): each skill is one domain of the graph, and its
// score is a whole level plus the percentage to the next, taken from the levels and estimates of the
// nodes the player has answered.

export const SKILLS = [
  { skill: "marks", domain: "N" },
  { skill: "mechanics", domain: "A" },
  { skill: "sharing", domain: "F" },
  { skill: "precision", domain: "D" },
  { skill: "trade", domain: "P" },
  { skill: "wayfinding", domain: "M" },
  { skill: "shaping", domain: "G" },
  { skill: "scouting", domain: "S" },
  { skill: "interpreting", domain: "T" },
] as const;

export type SkillName = (typeof SKILLS)[number]["skill"];

export interface SkillNode {
  node: string;
  domain: string;
  level: number;
  estimate: number;
  answers: number;
}

export type SkillScore =
  | { skill: SkillName; shown: false }
  | { skill: SkillName; shown: true; level: number; percent: number };

const TOP_LEVEL = 5;
/** Where levels 1 to 5 begin, and the estimate that means full mastery (the level.v1 lines). */
const LINES = [0, 0.35, 0.6, 0.8, 0.92, 1];
/** A score sums to a hundredth of a percent before the floor, so 2.9999999 reads as 3. */
const EPSILON = 1e-9;

/** How far an estimate has come from its level's line to the next, from 0 up to 1. */
export function fractionOf(level: number, estimate: number): number {
  const from = LINES[level - 1] ?? 0;
  const to = LINES[level] ?? 1;
  const fraction = (estimate - from) / (to - from);
  const cap = level >= TOP_LEVEL ? 1 : 0.99;
  return Math.min(cap, Math.max(0, fraction));
}

export function skillScoresOf(nodes: readonly SkillNode[]): SkillScore[] {
  return SKILLS.map(({ skill, domain }): SkillScore => {
    const answered = nodes.filter((n) => n.domain === domain && n.answers > 0);
    if (answered.length === 0) return { skill, shown: false };
    const total = answered.reduce(
      (sum, n) => sum + n.level + fractionOf(n.level, n.estimate),
      0,
    );
    const score = total / answered.length + EPSILON;
    const level = Math.min(TOP_LEVEL, Math.floor(score));
    const share = Math.round((score - level) * 100);
    const percent =
      level === TOP_LEVEL ? Math.min(100, share) : Math.min(99, share);
    return { skill, shown: true, level, percent };
  });
}
