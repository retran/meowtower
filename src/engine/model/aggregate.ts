// The node rows of the knowledge model (ADR-0060, TSK-0520): a node's estimate is the
// weighted mean of its subtypes' estimates, its uncertainty falls with the weight of its
// evidence, and every node and subtype the graph lists has a row, even with no evidence
// (REQ-0910, REQ-0988, REQ-0994). Pure: the graph is read through its query module only.
import { type PairState, pKnowAt, pairKey } from "./bkt.js";
import type { Observation } from "./observations.js";
import { type Confidence, confidenceOf, reviewOf } from "./review.js";

const DAY_MS = 86_400_000;

/** The binary entropy of p, in bits; 0 at 0 and at 1. */
export function binaryEntropy(p: number): number {
  if (p <= 0 || p >= 1) return 0;
  return -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));
}

/** `H(pKnow) * 3 / (3 + nEff)`: the uncertainty of an estimate (ADR-0060, REQ-0988). */
export const uncertaintyOf = (pKnow: number, nEff: number): number =>
  (binaryEntropy(pKnow) * 3) / (3 + nEff);

/** A node's estimate: the subtype estimates, each weighted by the graph's weight (REQ-0910). */
export function nodeEstimate(
  parts: readonly { weight: number; p: number }[],
): number {
  const total = parts.reduce((acc, s) => acc + s.weight, 0);
  if (total === 0) return 0;
  return parts.reduce((acc, s) => acc + s.weight * s.p, 0) / total;
}

/**
 * nEff of the observations, each times 2^(-age / H) with the observing pair's current
 * half-life (ADR-0060, REQ-0988).
 */
export function nEffOf(
  observations: readonly Observation[],
  halfLifeOf: (node: string, subtype: string) => number,
  now: number,
): number {
  return observations.reduce((acc, o) => {
    const age = Math.max(0, (now - o.at) / DAY_MS);
    return acc + o.w * 2 ** (-age / halfLifeOf(o.node, o.subtype));
  }, 0);
}

export interface GraphView {
  nodes(): { id: string; level: string }[];
  subtypes(id: string): { id: string; level: string; weight: number }[];
}

export interface Row {
  readonly node: string;
  readonly subtype: string | null;
  readonly pKnow: number;
  readonly nEff: number;
  readonly uncertainty: number;
  readonly state: "not checked" | "stretch: not checked" | "tested";
  /** The review fields of review.ts (TSK-0522); null with no unassisted attempt. */
  readonly lastSeen: number | null;
  readonly stale: boolean;
  readonly nextReview: number | null;
  /** Low with no evidence; from the last attempt, a probe, until blocks exist (TSK-0523). */
  readonly confidence: Confidence;
}

const reviewFields = (own: readonly Observation[], now: number) => {
  const review = reviewOf(own, now);
  const ageDays =
    review.lastSeen === null ? 0 : (now - review.lastSeen) / DAY_MS;
  const confidence: Confidence =
    review.lastSeen === null ? "low" : confidenceOf({ kind: "probe", ageDays });
  return { ...review, confidence };
};

/**
 * Every node row and subtype row of the graph at `now`, from the pair states and the
 * observations. A node or subtype with no observation has its prior and full uncertainty.
 */
export function rowsOf(
  graph: GraphView,
  observations: readonly Observation[],
  states: ReadonlyMap<string, PairState>,
  prior: (node: string, subtype: string, level: string) => number,
  now: number,
): Row[] {
  const halfLifeOf = (node: string, subtype: string): number =>
    states.get(pairKey(node, subtype))?.halfLifeDays ?? 60;
  const pKnowOf = (node: string, subtype: string, level: string): number => {
    const state = states.get(pairKey(node, subtype));
    return state === undefined
      ? prior(node, subtype, level)
      : pKnowAt(state, now);
  };
  const rows: Row[] = [];
  const byNode = new Map<string, Observation[]>();
  for (const o of observations) {
    const list = byNode.get(o.node);
    if (list) list.push(o);
    else byNode.set(o.node, [o]);
  }
  for (const node of graph.nodes()) {
    const subs = graph.subtypes(node.id);
    const mine = byNode.get(node.id) ?? [];
    const nodeNEff = nEffOf(mine, halfLifeOf, now);
    const parts = subs.map((s) => ({
      weight: s.weight,
      p: pKnowOf(node.id, s.id, s.level),
    }));
    const pKnow = nodeEstimate(parts);
    const stretch = node.level === "stretch";
    rows.push({
      node: node.id,
      subtype: null,
      pKnow,
      nEff: nodeNEff,
      uncertainty: uncertaintyOf(pKnow, nodeNEff),
      ...reviewFields(mine, now),
      state:
        mine.length === 0
          ? stretch
            ? "stretch: not checked"
            : "not checked"
          : "tested",
    });
    for (const s of subs) {
      const own = mine.filter((o) => o.subtype === s.id);
      const subNEff = nEffOf(own, halfLifeOf, now);
      const p = pKnowOf(node.id, s.id, s.level);
      rows.push({
        node: node.id,
        subtype: s.id,
        pKnow: p,
        nEff: subNEff,
        uncertainty: uncertaintyOf(p, subNEff),
        ...reviewFields(own, now),
        state:
          own.length === 0
            ? stretch
              ? "stretch: not checked"
              : "not checked"
            : "tested",
      });
    }
  }
  return rows;
}
