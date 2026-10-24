// The flow corridor (ADR-0070, SPC-0070, TSK-0532): the success share of the last 10 graded first
// attempts decides whether a room slot is review or frontier. Below 0.70 every slot is review,
// above 0.80 every slot is frontier, and inside the corridor a deficit rule keeps review at 30 %
// to 40 % of the adventure's slots. Pure: it reads the outcomes and the adventure's own counts,
// so one log gives one answer.
import type { LogEvent } from "../model/observations.js";

export type Outcome = "clean" | "partial" | "alt";
export type SlotType = "review" | "frontier";

/** The attempts the share counts (REQ-1006). */
export const SHARE_WINDOW = 10;
/** The corridor's bounds: below LOW is review, above HIGH is frontier (REQ-1006, REQ-1008). */
export const CORRIDOR_LOW = 0.7;
export const CORRIDOR_HIGH = 0.8;

const WEIGHT: Record<Outcome, number> = { clean: 1, partial: 0.5, alt: 0 };

/**
 * The outcomes of the graded first attempts in the log, oldest first, across adventures. A
 * graded attempt is a first attempt whose verdict the checker could read; mental arithmetic and
 * control facts count (REQ-1006).
 */
export function outcomesOf(log: readonly LogEvent[]): Outcome[] {
  const out: Outcome[] = [];
  for (const event of log) {
    if (event.type !== "verdict") continue;
    const p = event.payload as {
      attemptNo?: number;
      verdict?: string;
      outcome?: Outcome;
    };
    if (p.attemptNo !== 1 || p.verdict === "unparsed") continue;
    if (p.outcome === "clean" || p.outcome === "partial" || p.outcome === "alt")
      out.push(p.outcome);
  }
  return out;
}

/**
 * The success share of the last `SHARE_WINDOW` outcomes: clean counts 1, partial 0.5, alt 0. With
 * fewer than ten it uses what exists, and with none it is null, which counts as inside the
 * corridor (REQ-1006).
 */
export function successShare(outcomes: readonly Outcome[]): number | null {
  const recent = outcomes.slice(-SHARE_WINDOW);
  if (recent.length === 0) return null;
  const total = recent.reduce((acc, o) => acc + WEIGHT[o], 0);
  return total / recent.length;
}

/**
 * The type of the next room slot. `inCorridorSlots` is how many slots of this adventure were
 * decided inside the corridor, and `reviewAmongThem` how many of those were review; review is
 * chosen while that count is below `0.30 * (n + 1)` rounded up, which holds the band from 8 slots
 * on (REQ-1010).
 */
export function slotType(
  share: number | null,
  inCorridorSlots: number,
  reviewAmongThem: number,
): SlotType {
  if (share !== null && share < CORRIDOR_LOW) return "review";
  if (share !== null && share > CORRIDOR_HIGH) return "frontier";
  const wanted = Math.ceil((3 * (inCorridorSlots + 1)) / 10);
  return reviewAmongThem < wanted ? "review" : "frontier";
}
