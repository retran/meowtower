// Rule rank.v1 (ADR-3220, ADR-3230): the rank from the node levels. A rank counts every Dutch group
// up to its own, rises when 80 % of those nodes stand on level 4, and falls only after 14 played
// days with that share below 65 %. Rank S asks the same of level 5 over every node.
export const RANK_RULE = "rank.v1";
export const RANKS = ["E", "D", "C", "B", "A", "S"] as const;
export type Rank = (typeof RANKS)[number];

/** The highest typical group each rank counts; S counts them all. */
const UPPER_GROUP: Readonly<Record<Rank, number>> = {
  E: 3,
  D: 4,
  C: 5,
  B: 6,
  A: 8,
  S: 8,
};
const RISE_SHARE = 0.8;
const FALL_SHARE = 0.65;
const FALL_DAYS = 14;
const WARN_DAYS = 7;

export interface RankDay {
  /** The game day of play. */
  readonly day: number;
  /** Each node's level at the end of that day. */
  readonly levels: Readonly<Record<string, number>>;
}

export interface RankChange {
  readonly from: Rank;
  readonly to: Rank;
  readonly fell: boolean;
  readonly day: number;
}

export interface RankResult {
  readonly rank: Rank;
  readonly rule: string;
  /** True once the share has stayed below the line for a week (REQ-7996). */
  readonly warning: boolean;
  readonly changes: readonly RankChange[];
}

/** The share of a rank's nodes on the level it asks for. */
function shareOf(
  nodes: readonly { node: string; group: number }[],
  levels: Readonly<Record<string, number>>,
  rank: Rank,
): number {
  const counted = nodes.filter((n) => n.group <= UPPER_GROUP[rank]);
  if (counted.length === 0) return 0;
  const need = rank === "S" ? 5 : 4;
  const met = counted.filter((n) => (levels[n.node] ?? 1) >= need).length;
  return met / counted.length;
}

/** The highest rank whose share, and every lower one's, reaches the line. */
function qualifiedRank(
  nodes: readonly { node: string; group: number }[],
  levels: Readonly<Record<string, number>>,
): Rank {
  let best: Rank = "E";
  for (const rank of RANKS.slice(1)) {
    if (shareOf(nodes, levels, rank) < RISE_SHARE) break;
    best = rank;
  }
  return best;
}

/** The rank after the played days in order (REQ-7982, REQ-7984, REQ-7986, REQ-7988, REQ-8054). */
export function rankOver(
  nodes: readonly { node: string; group: number }[],
  days: readonly RankDay[],
): RankResult {
  let held: Rank = "E";
  let below = 0;
  const changes: RankChange[] = [];
  for (const { day, levels } of days) {
    const qualified = qualifiedRank(nodes, levels);
    if (RANKS.indexOf(qualified) > RANKS.indexOf(held)) {
      changes.push({ from: held, to: qualified, fell: false, day });
      held = qualified;
      below = 0;
      continue;
    }
    if (held === "E" || shareOf(nodes, levels, held) >= FALL_SHARE) {
      below = 0;
      continue;
    }
    below += 1;
    if (below >= FALL_DAYS) {
      changes.push({ from: held, to: qualified, fell: true, day });
      held = qualified;
      below = 0;
    }
  }
  return { rank: held, rule: RANK_RULE, warning: below >= WARN_DAYS, changes };
}
