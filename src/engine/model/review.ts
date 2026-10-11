// The review ladder and the row fields it feeds (ADR-0060, TSK-0522, REQ-0992): after
// each unassisted success in a row the next review falls 1, 3, 7, 14, then 30 days
// later, and a failure or a partly right answer ends the run and sets 1 day. A node is
// stale when its last unassisted first attempt is over 30 days old (REQ-0994). Pure:
// it reads the observations it is given, never a clock.
import type { Observation } from "./observations.js";

const DAY_MS = 86_400_000;
/** Days until the next review after the 1st to 5th success in a row (ADR-0060). */
export const LADDER_DAYS = [1, 3, 7, 14, 30] as const;
/** The days a failure sets; a partly right answer counts as a failure (ADR-0060). */
export const FAILURE_DAYS = 1;
/** The age, in days, after which a last-seen date makes a node stale (REQ-0994). */
export const STALE_DAYS = 30;

export interface Review {
  /** The time of the last unassisted first attempt, or null with none. */
  readonly lastSeen: number | null;
  /** True when lastSeen is over STALE_DAYS old; false with no attempt. */
  readonly stale: boolean;
  /** lastSeen plus the ladder's days; null with no attempt. */
  readonly nextReview: number | null;
}

/**
 * The review of one list of unassisted first attempts, in any order. The run counts
 * right answers (c = 1) in time order; the step after the run's n-th success is
 * LADDER_DAYS[min(n, 5) - 1].
 */
export function reviewOf(own: readonly Observation[], now: number): Review {
  if (own.length === 0)
    return { lastSeen: null, stale: false, nextReview: null };
  const ordered = [...own].sort((a, b) => a.at - b.at);
  let run = 0;
  let days = FAILURE_DAYS;
  for (const o of ordered) {
    if (o.c === 1) {
      run += 1;
      days = LADDER_DAYS[Math.min(run, LADDER_DAYS.length) - 1] ?? FAILURE_DAYS;
    } else {
      run = 0;
      days = FAILURE_DAYS;
    }
  }
  const lastSeen = ordered[ordered.length - 1]?.at ?? 0;
  return {
    lastSeen,
    stale: now - lastSeen > STALE_DAYS * DAY_MS,
    nextReview: lastSeen + days * DAY_MS,
  };
}

export type Confidence = "high" | "medium" | "low";
/** One piece of evidence behind a row: a full block, a probe, or an inferred state. */
export interface Evidence {
  readonly kind: "full" | "probe" | "inferred";
  readonly ageDays: number;
}

/**
 * How far a row can be trusted (TSK-0522 AC5). An inferred state is low; a probe older
 * than STALE_DAYS is low, and a probe within it medium; a full block within STALE_DAYS is
 * high, and an older one medium (a choice this file makes, as the task leaves it open).
 */
export function confidenceOf(evidence: Evidence): Confidence {
  if (evidence.kind === "inferred") return "low";
  if (evidence.kind === "probe")
    return evidence.ageDays > STALE_DAYS ? "low" : "medium";
  return evidence.ageDays > STALE_DAYS ? "medium" : "high";
}
