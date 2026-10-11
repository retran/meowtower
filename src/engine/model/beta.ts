// The "with help" and fluency estimates (ADR-0060, TSK-0521). Each is a beta estimate
// from alpha = beta = 1: an observation adds its weight, aged by 2^(-age / 30 days), to
// alpha when it is a success and to beta otherwise. Neither touches pKnow (REQ-0922).
import thresholds from "../../../content/thresholds.v1.json" with { type: "json" };
import type { Observation } from "./observations.js";

const DAY_MS = 86_400_000;
/** The age half-life of the two beta estimates, in days (ADR-0060). */
export const BETA_HALF_LIFE_DAYS = 30;

export interface Beta {
  readonly alpha: number;
  readonly beta: number;
}

const ageWeight = (o: Observation, now: number): number => {
  const age = Math.max(0, (now - o.at) / DAY_MS);
  return o.w * 2 ** (-age / BETA_HALF_LIFE_DAYS);
};

/** The threshold of a node in seconds, from RES-1200 through one function (TSK-0521). */
export function fluencyThresholdSeconds(node: string): number {
  const found = (thresholds.thresholds as Record<string, number>)[node];
  return found ?? thresholds.defaultSeconds;
}

/**
 * "With help": a right assisted attempt is a success, a wrong one a failure, each with
 * its weight aged by 30 days (REQ-0922, REQ-0924).
 */
export function withHelpOf(help: readonly Observation[], now: number): Beta {
  let alpha = 1;
  let beta = 1;
  for (const o of help) {
    const w = ageWeight(o, now);
    alpha += w * o.c;
    beta += w * (1 - o.c);
  }
  return { alpha, beta };
}

/**
 * Fluency: a right unassisted first attempt no slower than the node's threshold adds to
 * alpha; a right one slower, or a wrong one, adds to beta. An interrupted or cross-device
 * attempt is never fast (REQ-0926, REQ-0928, REQ-0930).
 */
export function fluencyOf(own: readonly Observation[], now: number): Beta {
  let alpha = 1;
  let beta = 1;
  for (const o of own) {
    const w = ageWeight(o, now);
    const fast =
      o.c === 1 &&
      o.timeCounts &&
      o.timeMs <= fluencyThresholdSeconds(o.node) * 1000;
    if (fast) alpha += w;
    else beta += w;
  }
  return { alpha, beta };
}
