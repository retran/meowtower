// The inferred and cut-off states beside the tested state (ADR-0060, SPC-0060, TSK-0526),
// the gap count and the obligations the Director reads. Inference never enters a tested
// state, a pKnow, a beta estimate, nEff or a count of tested nodes (REQ-0976): it sits in
// its own field. Pure: it reads the states of statesOf and the graph's prerequisites.
import { STALE_DAYS } from "../model/review.js";
import type { NodeState, StateName } from "./rules.js";

const DAY_MS = 86_400_000;
/** Days a node may go untested before a fluent neighbour infers it (REQ-0962). */
export const INFER_AFTER_DAYS = 30;

export interface Graphish {
  nodes(): { id: string; level: string }[];
  prereqs(id: string): { node: string; subtype: string | undefined }[];
}

export interface Inferred {
  readonly node: string;
  /** "fluent (inferred)" or "not tested, cut off by node X"; null when none applies. */
  readonly inferredState: string | null;
  /** The node X whose failed block cut this node off, or null (REQ-0964). */
  readonly cutBy: string | null;
  /** True only for a node tested "not mastered": a cut-off node is never a gap (REQ-0968). */
  readonly isGap: boolean;
}

/** The inferred and cut-off state of every node, from the states of statesOf. */
export function inferredOf(
  graph: Graphish,
  states: readonly NodeState[],
  now: number,
): Inferred[] {
  const byId = new Map(states.map((s) => [s.node, s]));
  const inferred = new Map<string, string>();
  const cutBy = new Map<string, string>();
  const dependents = new Map<string, string[]>();
  for (const n of graph.nodes())
    for (const p of graph.prereqs(n.id))
      dependents.set(p.node, [...(dependents.get(p.node) ?? []), n.id]);

  const untestedFor = (id: string, days: number): boolean => {
    const at = byId.get(id)?.lastAttemptAt;
    return at === undefined || now - at > days * DAY_MS;
  };

  // Rule 1: a fluent block gives each untested ancestor "fluent (inferred)". A tagged
  // prerequisite of a subtype is the only one that gets it, and the walk stops there.
  for (const s of states) {
    if (!(s.fluentBlock || s.state === "stable")) continue;
    const queue = graph
      .prereqs(s.node)
      .map((p) => ({ from: p, tagged: p.subtype !== undefined }));
    const seen = new Set<string>();
    for (let step = queue.shift(); step; step = queue.shift()) {
      const { from, tagged } = step;
      if (seen.has(from.node)) continue;
      seen.add(from.node);
      if (untestedFor(from.node, INFER_AFTER_DAYS) && !inferred.has(from.node))
        inferred.set(from.node, "fluent (inferred)");
      if (!tagged)
        for (const p of graph.prereqs(from.node))
          queue.push({ from: p, tagged: p.subtype !== undefined });
    }
  }

  // Rule 2: a block that reads "not mastered" cuts off each untested descendant.
  for (const s of states) {
    if (s.rule !== "block-low") continue;
    const seen = new Set<string>();
    const queue = [...(dependents.get(s.node) ?? [])];
    for (let id = queue.shift(); id !== undefined; id = queue.shift()) {
      if (seen.has(id)) continue;
      seen.add(id);
      const d = byId.get(id);
      if (d?.rule === "none" && !cutBy.has(id)) {
        cutBy.set(id, s.node);
        if (!inferred.has(id))
          inferred.set(id, `not tested, cut off by node ${s.node}`);
      }
      queue.push(...(dependents.get(id) ?? []));
    }
  }

  return states.map((s) => ({
    node: s.node,
    inferredState: inferred.get(s.node) ?? null,
    cutBy: cutBy.get(s.node) ?? null,
    isGap: s.state === "not mastered",
  }));
}

/** The tested gaps: nodes tested "not mastered" and no others (REQ-0968). */
export const gapCountOf = (rows: readonly Inferred[]): number =>
  rows.filter((r) => r.isGap).length;

export type ObligationKind =
  | "escalation"
  | "block_owed"
  | "probe_owed"
  | "island"
  | "cut_off"
  | "stale"
  | "review_due";

export interface Obligation {
  readonly node: string;
  readonly kind: ObligationKind;
  /** The node that cut this one off, for kind cut_off. */
  readonly cutBy?: string;
}

/** A failed island check: the node and the prerequisites it was queued with. */
export interface IslandFailure {
  readonly node: string;
  readonly prereqs: readonly string[];
}

const UNDERSTANDS: readonly StateName[] = [
  "understands",
  "understands, needs speed",
];

/**
 * The obligations of a run: a set keyed by node and kind, so one node holds at most one row
 * per kind (SPC-0060, REQ-0970 and TSK-0526 AC5). `islands` is the failed island checks,
 * which no event carries yet, so the caller passes them.
 */
export function obligationsOf(
  graph: Graphish,
  states: readonly NodeState[],
  inferred: readonly Inferred[],
  now: number,
  islands: readonly IslandFailure[] = [],
): Obligation[] {
  const rows = new Map<string, Obligation>();
  const add = (node: string, kind: ObligationKind, cutBy?: string): void => {
    rows.set(
      `${node}|${kind}`,
      cutBy === undefined ? { node, kind } : { node, kind, cutBy },
    );
  };
  const byId = new Map(states.map((s) => [s.node, s]));
  for (const s of states) {
    if (s.state === "being clarified") add(s.node, "escalation");
    if (s.probeZero) add(s.node, "block_owed");
    if (s.nextReview !== null && s.nextReview <= now) add(s.node, "review_due");
    if (
      s.lastAttemptAt !== undefined &&
      now - s.lastAttemptAt > STALE_DAYS * DAY_MS
    )
      add(s.node, "stale");
    if (UNDERSTANDS.includes(s.state))
      for (const n of graph.nodes())
        if (
          graph
            .prereqs(n.id)
            .some((p) => p.node === s.node && p.subtype === undefined)
        )
          add(n.id, "probe_owed");
  }
  for (const r of inferred)
    if (r.cutBy !== null) add(r.node, "cut_off", r.cutBy);
  for (const f of islands) {
    add(f.node, "island");
    for (const p of f.prereqs) if (byId.has(p)) add(p, "island");
  }
  return [...rows.values()].sort((a, b) =>
    a.node === b.node
      ? a.kind.localeCompare(b.kind)
      : a.node.localeCompare(b.node),
  );
}
