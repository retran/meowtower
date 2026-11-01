// Rule level.v1 (ADR-3220): a node's ability level from its estimate. A level rises as soon as the
// estimate reaches the next line, and falls only after three observations in a row well below its
// own line, so one bad answer moves nothing (REQ-7966, REQ-7968).
import { applyObservation, freshPair, type PairState } from "./bkt.js";
import { nodeEstimate } from "./aggregate.js";
import type { Observation } from "./observations.js";
import type { ModelParamsT } from "./params.js";

export const LEVEL_RULE = "level.v1";
const TOP_LEVEL = 5;
/** The estimate that starts levels 2, 3, 4 and 5. */
const LINES = [0.35, 0.6, 0.8, 0.92];
const FALL_MARGIN = 0.1;
const WARN_AFTER = 2;
const FALL_AFTER = 3;
const OLYMPIAD_CLEAN = 2;

export type LevelObservation = Pick<
  Observation,
  | "subtype"
  | "c"
  | "w"
  | "at"
  | "form"
  | "options"
  | "steps"
  | "postFeedback"
  | "itemId"
> & { readonly olympiad: boolean };

export interface LevelChange {
  readonly from: number;
  readonly to: number;
  readonly fell: boolean;
  readonly itemId: string;
}

export interface LevelResult {
  readonly level: number;
  readonly rule: string;
  /** True after a second observation in a row below the line (REQ-7996). */
  readonly warning: boolean;
  readonly changes: readonly LevelChange[];
}

export interface LevelAsk {
  /** Each subtype's weight in the node. */
  readonly weights: Readonly<Record<string, number>>;
  readonly prior: number;
  /** A node with olympiad tasks reaches level 5 only by them (REQ-7978). */
  readonly hasOlympiad: boolean;
  readonly params: ModelParamsT;
}

const lineOf = (level: number): number => LINES[level - 2] ?? 0;

/** The level the estimate alone reaches, capped below the top without olympiad proof. */
function reached(p: number, cap: number): number {
  let level = 1;
  while (level < cap && p >= lineOf(level + 1)) level += 1;
  return level;
}

/** A node's level after its observations in time order. */
export function levelOf(
  observations: readonly LevelObservation[],
  { weights, prior, hasOlympiad, params }: LevelAsk,
): LevelResult {
  const pairs = new Map<string, PairState>(
    Object.keys(weights).map((s) => [s, freshPair(prior, params)]),
  );
  const estimate = (): number =>
    nodeEstimate(
      [...pairs].map(([s, pair]) => ({ weight: weights[s] ?? 0, p: pair.p })),
    );
  let level = reached(estimate(), TOP_LEVEL - 1);
  let below = 0;
  let clean = 0;
  const changes: LevelChange[] = [];
  for (const o of observations) {
    const current = pairs.get(o.subtype) ?? freshPair(prior, params);
    pairs.set(o.subtype, applyObservation(current, o, params));
    if (o.olympiad && o.c === 1) clean += 1;
    const p = estimate();
    const cap =
      !hasOlympiad || clean >= OLYMPIAD_CLEAN ? TOP_LEVEL : TOP_LEVEL - 1;
    const up = reached(p, cap);
    if (up > level) {
      changes.push({ from: level, to: up, fell: false, itemId: o.itemId });
      level = up;
      below = 0;
    } else if (level > 1 && p < lineOf(level) - FALL_MARGIN) {
      below += 1;
      if (below >= FALL_AFTER) {
        changes.push({
          from: level,
          to: level - 1,
          fell: true,
          itemId: o.itemId,
        });
        level -= 1;
        below = 0;
      }
    } else below = 0;
  }
  return {
    level,
    rule: LEVEL_RULE,
    warning: below >= WARN_AFTER,
    changes,
  };
}

const DAY_MS = 86_400_000;
const SIMULATED_DAYS = 180;
const RUNS = 500;

/** Mean changes of level for a simulated player, and the median days to a fall after a drop. */
export function simulateChanges(
  params: ModelParamsT,
  {
    recall,
    gapDays,
    dropTo,
  }: { recall: number; gapDays: number; dropTo?: number },
): { after: number; daysToFall: number } {
  let seed = 12345;
  const random = (): number => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };
  const half = SIMULATED_DAYS / 2;
  let changed = 0;
  const falls: number[] = [];
  for (let run = 0; run < RUNS; run += 1) {
    const seen: LevelObservation[] = [];
    for (let day = 0; day < SIMULATED_DAYS; day += gapDays) {
      const chance = dropTo !== undefined && day >= half ? dropTo : recall;
      seen.push({
        subtype: "s",
        c: random() < chance ? 1 : 0,
        w: 1,
        at: day * DAY_MS,
        form: "free",
        options: 0,
        steps: 2,
        postFeedback: false,
        itemId: String(day),
        olympiad: false,
      });
    }
    const { changes } = levelOf(seen, {
      weights: { s: 1 },
      prior: 0.3,
      hasOlympiad: false,
      params,
    });
    // Climbing from the prior isn't a change of a steady player's level.
    const settled = changes.filter((c) => c.fell || Number(c.itemId) >= half);
    changed += settled.length;
    const fall = changes.find((c) => c.fell && Number(c.itemId) >= half);
    if (fall) falls.push(Number(fall.itemId) - half);
  }
  falls.sort((a, b) => a - b);
  return {
    after: changed / RUNS,
    daysToFall: falls[Math.floor(falls.length / 2)] ?? SIMULATED_DAYS,
  };
}
