// The Bayesian knowledge tracing step of the knowledge model (ADR-0060, TSK-0517): for
// each observation the model forgets, takes the feedback step, the evidence step and
// the practice step, in that order. Forgetting is a decay towards zero with a half-life
// `H`, so an estimate falls for any starting value while no evidence arrives (REQ-0912).
import type { Observation } from "./observations.js";
import { type ModelParamsT, pGuessOf, pSlipOf } from "./params.js";

const DAY_MS = 86_400_000;

export interface PairState {
  /** The estimate that the pair is known, as of `last`. */
  readonly p: number;
  /** The forgetting half-life in days. */
  readonly halfLifeDays: number;
  /** The time of the last observation in milliseconds, or null before the first. */
  readonly last: number | null;
}

/** A pair before any observation: its prior, the initial half-life, and no last time. */
export const freshPair = (prior: number, p: ModelParamsT): PairState => ({
  p: prior,
  halfLifeDays: p.halfLife.initialDays,
  last: null,
});

/** The estimate at `now`: the stored value decayed for the time since the last observation. */
export function pKnowAt(state: PairState, now: number): number {
  if (state.last === null) return state.p;
  const days = Math.max(0, (now - state.last) / DAY_MS);
  return state.p * 2 ** (-days / state.halfLifeDays);
}

/** One observation applied to a pair: forgetting, feedback, evidence and practice (ADR-0060). */
export function applyObservation(
  state: PairState,
  obs: Observation,
  p: ModelParamsT,
): PairState {
  const days = state.last === null ? 0 : (obs.at - state.last) / DAY_MS;
  // 1. Forgetting, towards zero with the half-life.
  const forgotten =
    state.last === null ? state.p : state.p * 2 ** (-days / state.halfLifeDays);
  // 2. Feedback: a walkthrough, explanation or hint came before the task (REQ-0920).
  const fed = obs.postFeedback
    ? forgotten + (1 - forgotten) * p.pLearnFeedback
    : forgotten;
  // 3. Evidence, with the weight of the attempt; a partial answer sits between right and wrong.
  const g = pGuessOf(p, obs.form, obs.options);
  const s = pSlipOf(p, obs.steps);
  const pRight = (fed * (1 - s)) / (fed * (1 - s) + (1 - fed) * g);
  const pWrong = (fed * s) / (fed * s + (1 - fed) * (1 - g));
  const pObs = obs.c * pRight + (1 - obs.c) * pWrong;
  const evidenced = fed + obs.w * (pObs - fed);
  // 4. Practice.
  const practiced = evidenced + (1 - evidenced) * p.pLearnPractice;
  // The half-life: a right answer at least minGapDays after the last one lengthens it, a
  // wrong one resets it, a partial one leaves it (ADR-0060).
  let halfLifeDays = state.halfLifeDays;
  if (obs.c === 0) halfLifeDays = p.halfLife.initialDays;
  else if (obs.c === 1 && state.last !== null && days >= p.halfLife.minGapDays)
    halfLifeDays = Math.min(
      p.halfLife.capDays,
      state.halfLifeDays * p.halfLife.growth,
    );
  return { p: practiced, halfLifeDays, last: obs.at };
}

/** The pair key: a node and one of its subtypes. */
export const pairKey = (node: string, subtype: string): string =>
  `${node}.${subtype}`;

/**
 * The state of every pair after its observations, in time order, from the prior of each
 * pair. A pair with no observation keeps its prior (REQ-0908).
 */
export function estimatePairs(
  observations: readonly Observation[],
  params: ModelParamsT,
  priorOf: (node: string, subtype: string) => number,
): Map<string, PairState> {
  const states = new Map<string, PairState>();
  const ordered = [...observations].sort((a, b) => a.at - b.at);
  for (const obs of ordered) {
    const key = pairKey(obs.node, obs.subtype);
    const current =
      states.get(key) ?? freshPair(priorOf(obs.node, obs.subtype), params);
    states.set(key, applyObservation(current, obs, params));
  }
  return states;
}
