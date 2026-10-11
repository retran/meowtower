// The held-out evaluation of a candidate model (ADR-0060, SPC-0060, TSK-0529): the last fifth
// of the play days, rounded up, is held out; each unassisted first attempt there is predicted
// from the events before it alone, and the candidate is kept only when it has lower log-loss
// and lower expected calibration error than the active version. Pure: it takes the observations,
// the parameters, the prior of each pair and the game-day zone, and reads no file or clock.
import { gameDayOf } from "../../shared/game-day.js";
import {
  applyObservation,
  freshPair,
  type PairState,
  pairKey,
  pKnowAt,
} from "./bkt.js";
import type { ModelParamsT } from "./params.js";
import type { Observation } from "./observations.js";

/** The share of play days held out for the comparison (ADR-0060). */
export const HELD_OUT_SHARE = 0.2;
/** The equal-width bins of the expected calibration error (SPC-0060). */
export const CALIBRATION_BINS = 10;
const EPS = 1e-6;

export interface Prediction {
  /** The predicted probability that the pair is known. */
  readonly p: number;
  /** The outcome: 1 right, 0.5 partly right, 0 wrong. */
  readonly c: number;
}

export interface Figures {
  readonly logLoss: number;
  readonly ece: number;
  readonly n: number;
}

/**
 * The game days held out: the last `ceil(HELD_OUT_SHARE * n)` of the `n` distinct play days
 * of the observations (TSK-0529 AC5). An empty log holds none.
 */
export function heldOutDays(
  observations: readonly Observation[],
  zone: string,
): Set<number> {
  const days = [
    ...new Set(observations.map((o) => gameDayOf(o.at, zone))),
  ].sort((a, b) => a - b);
  const count = Math.ceil(HELD_OUT_SHARE * days.length);
  return new Set(days.slice(days.length - count));
}

/**
 * The predictions for the held-out unassisted first attempts. Each attempt is predicted from
 * the state its pair had before it, so it sees only the events before it (TSK-0529 AC5).
 */
export function predictionsOf(
  own: readonly Observation[],
  params: ModelParamsT,
  priorOf: (o: Observation) => number,
  zone: string,
): Prediction[] {
  const held = heldOutDays(own, zone);
  const states = new Map<string, PairState>();
  const predictions: Prediction[] = [];
  for (const o of [...own].sort((a, b) => a.seq - b.seq)) {
    const key = pairKey(o.node, o.subtype);
    const state = states.get(key) ?? freshPair(priorOf(o), params);
    if (held.has(gameDayOf(o.at, zone)))
      predictions.push({ p: pKnowAt(state, o.at), c: o.c });
    states.set(key, applyObservation(state, o, params));
  }
  return predictions;
}

/** The mean log-loss of the predictions, with a soft outcome (ADR-0060). */
export function logLossOf(predictions: readonly Prediction[]): number {
  if (predictions.length === 0) return 0;
  const total = predictions.reduce((acc, { p, c }) => {
    const q = Math.min(1 - EPS, Math.max(EPS, p));
    return acc - (c * Math.log(q) + (1 - c) * Math.log(1 - q));
  }, 0);
  return total / predictions.length;
}

/** The expected calibration error over equal-width bins of the predictions (SPC-0060). */
export function eceOf(predictions: readonly Prediction[]): number {
  if (predictions.length === 0) return 0;
  const bins = Array.from({ length: CALIBRATION_BINS }, () => ({
    n: 0,
    p: 0,
    c: 0,
  }));
  for (const { p, c } of predictions) {
    const bin =
      bins[Math.min(CALIBRATION_BINS - 1, Math.floor(p * CALIBRATION_BINS))];
    if (bin) {
      bin.n += 1;
      bin.p += p;
      bin.c += c;
    }
  }
  return bins.reduce((acc, b) => {
    if (b.n === 0) return acc;
    return acc + (b.n / predictions.length) * Math.abs(b.p / b.n - b.c / b.n);
  }, 0);
}

/** The figures of one model version over the held-out attempts. */
export function figuresOf(predictions: readonly Prediction[]): Figures {
  return {
    logLoss: logLossOf(predictions),
    ece: eceOf(predictions),
    n: predictions.length,
  };
}

export interface Decision {
  readonly accepted: boolean;
  /** Why the candidate was refused, one line per measure that did not improve. */
  readonly reasons: readonly string[];
}

/**
 * The activation decision: the candidate is written active only when its log-loss and its
 * calibration error are both lower than the active version's (TSK-0529 AC1). With no active
 * version there is no comparison, so the gate is skipped (AC3).
 */
export function decideActivation(
  active: Figures | undefined,
  candidate: Figures,
): Decision {
  if (active === undefined)
    return { accepted: true, reasons: ["no predecessor: the gate is skipped"] };
  const reasons: string[] = [];
  if (!(candidate.logLoss < active.logLoss))
    reasons.push(
      `log-loss ${candidate.logLoss.toFixed(4)} is not lower than ${active.logLoss.toFixed(4)}`,
    );
  if (!(candidate.ece < active.ece))
    reasons.push(
      `calibration error ${candidate.ece.toFixed(4)} is not lower than ${active.ece.toFixed(4)}`,
    );
  return { accepted: reasons.length === 0, reasons };
}

/**
 * Whether the gate runs for a candidate file: it runs when a predecessor exists and the file
 * version differs. A change of school group changes the model version's row, not the file,
 * so it runs no gate (SPC-0060, TSK-0529 AC4).
 */
export const gateRuns = (
  activeFile: string | undefined,
  candidateFile: string,
): boolean => activeFile !== undefined && activeFile !== candidateFile;
