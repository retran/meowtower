// The frontier choice and the whole slot (ADR-0070, SPC-0070, TSK-0534): `nextTask` fills a room
// slot with a node, a subtype, a purpose and the reason, from the node facts the model writes, the
// success share and the adventure's counts. The value formula never reads the expected chance of
// success, so the Director cannot pick a task to make the player fail or to balance the share
// (REQ-1020, REQ-1022). Pure: one set of facts always gives one answer.
import type { ModelParamsT } from "../model/params.js";
import type { StateName } from "../states/rules.js";
import type { ObligationKind } from "../states/inference.js";
import { slotType } from "./corridor.js";
import { fillReviewSlot, reviewCandidates, type ReviewPick } from "./review.js";

const DAY_MS = 86_400_000;

export interface Weights {
  readonly uncertainty: number;
  readonly staleness: number;
  readonly frontier: number;
  readonly escalation: number;
  readonly stretch: number;
  readonly spacedReview: number;
  readonly recheck: number;
  readonly parentTopic: number;
  readonly recentShows: number;
}

/** `content/director.v1.json`: the weights and the limits RES-1000 and ADR-0070 set. */
export interface DirectorConfig {
  readonly version: string;
  readonly weights: Weights;
  readonly stalenessDays: { readonly frontier: number; readonly other: number };
  readonly staleAfterDays: number;
  readonly recentShowsDays: number;
  readonly recentShowsCap: number;
  readonly uncertainFrom: number;
  readonly parentTopicDays: number;
  readonly parentTopicPerDay: number;
}

export interface SubtypeFacts {
  readonly id: string;
  readonly pKnow: number;
  readonly nEff: number;
}

/** What the Director reads of one node: the model's row, its obligations and today's counts. */
export interface NodeFacts {
  readonly node: string;
  readonly stretch: boolean;
  /** True when the stretch gate admitted the node today (TSK-0536). */
  readonly admitted: boolean;
  readonly state: StateName;
  readonly inferredState: string | null;
  readonly cutBy: string | null;
  readonly uncertainty: number;
  readonly lastSeen: number | null;
  readonly obligations: readonly ObligationKind[];
  /** 0 or 1: a lesson recheck is due / a lesson mark is fresh (REQ-1002). */
  readonly recheckDue: number;
  readonly freshMark: number;
  /** Shows of the node within the last `recentShowsDays` days. */
  readonly recentShows: number;
  /** The tested state of each prerequisite, with its inferred state. */
  readonly prereqs: readonly {
    state: StateName;
    inferredState: string | null;
    cutBy: string | null;
  }[];
  readonly subtypes: readonly SubtypeFacts[];
}

export interface Valued {
  readonly facts: NodeFacts;
  readonly value: number;
  /** The value terms that decided it, for the `why` field (SPC-0070). */
  readonly terms: Readonly<Record<string, number>>;
}

/**
 * A node is on the frontier when it is understood, being clarified or unchecked, and none of its
 * prerequisites is not mastered, understands or cut off; a checked prerequisite must be fluent or
 * stable, an inferred "fluent" included (RES-1000).
 */
export function onFrontier(n: NodeFacts): boolean {
  const open: StateName[] = [
    "understands",
    "understands, needs speed",
    "being clarified",
    "not checked",
  ];
  if (!open.includes(n.state) || n.cutBy !== null) return false;
  return n.prereqs.every((p) => {
    if (p.cutBy !== null) return false;
    if (
      p.state === "fluent" ||
      p.state === "stable" ||
      p.state === "fluent (probe)"
    )
      return true;
    if (p.state === "not checked" || p.state === "stretch: not checked")
      return (
        p.inferredState === null || p.inferredState === "fluent (inferred)"
      );
    return false;
  });
}

const staleDays = (n: NodeFacts, now: number): number | null =>
  n.lastSeen === null ? null : (now - n.lastSeen) / DAY_MS;

/** Staleness: days since `lastSeen` over 7 on the frontier and 14 elsewhere, at most 1 (REQ-1002). */
export function staleness(
  n: NodeFacts,
  now: number,
  cfg: DirectorConfig,
): number {
  const days = staleDays(n, now);
  if (days === null) return 1;
  const divisor = onFrontier(n)
    ? cfg.stalenessDays.frontier
    : cfg.stalenessDays.other;
  return Math.min(1, Math.max(0, days / divisor));
}

const ASKS_EVIDENCE: readonly ObligationKind[] = [
  "escalation",
  "probe_owed",
  "island",
];

/** The value of a node and the terms behind it (REQ-1002). */
export function valueOf(
  n: NodeFacts,
  now: number,
  cfg: DirectorConfig,
): Valued {
  const w = cfg.weights;
  const days = staleDays(n, now);
  const stale = days !== null && days > cfg.staleAfterDays;
  const t = {
    uncertainty: w.uncertainty * n.uncertainty,
    staleness: w.staleness * (stale ? 1 : staleness(n, now, cfg)),
    frontier: w.frontier * (onFrontier(n) ? 1 : 0),
    escalation:
      w.escalation *
      (n.obligations.some((k) => ASKS_EVIDENCE.includes(k)) ? 1 : 0),
    stretch: w.stretch * (n.stretch && n.admitted ? 1 : 0),
    spacedReview:
      w.spacedReview * (n.obligations.includes("review_due") ? 1 : 0),
    // A node with a lesson mark scores the larger of the two terms and never both (ADR-0070).
    mark: Math.max(w.recheck * n.recheckDue, w.parentTopic * n.freshMark),
    recentShows:
      -w.recentShows * Math.min(1, n.recentShows / cfg.recentShowsCap),
  };
  const value = Object.values(t).reduce((a, b) => a + b, 0);
  return { facts: n, value, terms: t };
}

/**
 * The candidate set: the frontier nodes, the uncertain nodes, the nodes with obligations, the
 * admitted stretch nodes and every stale node. A node cut off by another stays out unless an
 * island check asks for it (REQ-0966). `canGenerate` leaves out a node with no template.
 */
export function candidatesOf(
  nodes: readonly NodeFacts[],
  now: number,
  cfg: DirectorConfig,
  canGenerate: (node: string) => boolean = () => true,
): NodeFacts[] {
  return nodes.filter((n) => {
    if (!canGenerate(n.node)) return false;
    if (n.cutBy !== null && !n.obligations.includes("island")) return false;
    if (n.stretch && !n.admitted) return false;
    const days = staleDays(n, now);
    return (
      onFrontier(n) ||
      n.uncertainty >= cfg.uncertainFrom ||
      n.obligations.length > 0 ||
      (n.stretch && n.admitted) ||
      (days !== null && days > cfg.staleAfterDays)
    );
  });
}

/**
 * The frontier choice: the candidate of highest value. Among equal values a stale node goes first,
 * the oldest first, then the lower identifier, so a replay gives the same node (REQ-1002, REQ-6844).
 */
export function chooseFrontier(
  candidates: readonly NodeFacts[],
  now: number,
  cfg: DirectorConfig,
): Valued | undefined {
  return candidates
    .map((n) => valueOf(n, now, cfg))
    .sort(
      (a, b) =>
        b.value - a.value ||
        (a.facts.lastSeen ?? 0) - (b.facts.lastSeen ?? 0) ||
        a.facts.node.localeCompare(b.facts.node),
    )[0];
}

/** The subtype with the least evidence, a tie going to the lower identifier. */
export function subtypeFor(n: NodeFacts): string {
  return (
    [...n.subtypes].sort(
      (a, b) => a.nEff - b.nEff || a.id.localeCompare(b.id),
    )[0]?.id ?? ""
  );
}

/**
 * Whether a parent-topic slot may be given: at most `parentTopicPerDay` such tasks a day, and only
 * in the first `parentTopicDays` days after the mark. A recheck block sits outside the cap.
 */
export function parentTopicAllowed(
  givenToday: number,
  daysSinceMark: number,
  cfg: DirectorConfig,
): boolean {
  return (
    daysSinceMark < cfg.parentTopicDays && givenToday < cfg.parentTopicPerDay
  );
}

export type FlowSlot = "review" | "frontier";
export interface Slot {
  readonly node: string;
  readonly subtype: string;
  readonly purpose: "review" | "frontier";
  readonly flowSlot: FlowSlot;
  /** The value terms or the fallback that decided it; kept on the server (REQ-1016). */
  readonly why: Readonly<Record<string, number>> | "no_review_candidate";
}

export interface SlotInput {
  readonly nodes: readonly NodeFacts[];
  readonly now: number;
  readonly share: number | null;
  /** Slots of this adventure decided inside the corridor, and the review ones among them. */
  readonly inCorridor: number;
  readonly reviewAmong: number;
  readonly params: ModelParamsT;
  readonly config: DirectorConfig;
  readonly canGenerate?: (node: string) => boolean;
}

/** Fills one room slot: the corridor picks review or frontier, then the source picks the node. */
export function nextTask(input: SlotInput): Slot | undefined {
  const { nodes, now, config, params } = input;
  const can = input.canGenerate ?? (() => true);
  const usable = nodes.filter((n) => can(n.node));
  const frontier = chooseFrontier(
    candidatesOf(usable, now, config, can),
    now,
    config,
  );
  const frontierSlot = (v: Valued): Slot => ({
    node: v.facts.node,
    subtype: subtypeFor(v.facts),
    purpose: "frontier",
    flowSlot: "frontier",
    why: v.terms,
  });
  if (slotType(input.share, input.inCorridor, input.reviewAmong) === "frontier")
    return frontier ? frontierSlot(frontier) : undefined;
  const picks = reviewCandidates(
    usable.map((n) => ({
      node: n.node,
      state: n.state,
      lastSeen: n.lastSeen,
      subtypes: n.subtypes.map((s) => ({ id: s.id, pKnow: s.pKnow })),
    })),
    params,
  );
  const filled = fillReviewSlot(picks, {});
  if (filled.pick) return reviewSlot(filled.pick, filled.why ?? null);
  return frontier
    ? { ...frontierSlot(frontier), why: "no_review_candidate" }
    : undefined;
}

const reviewSlot = (
  pick: ReviewPick,
  why: "no_review_candidate" | null,
): Slot => ({
  node: pick.node,
  subtype: pick.subtype,
  purpose: "review",
  flowSlot: "review",
  why: why ?? { lastSeen: pick.lastSeen ?? 0, chance: pick.chance },
});
