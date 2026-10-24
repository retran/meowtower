// The review slot (ADR-0070, SPC-0070, TSK-0533): a review task comes from a fluent or stable
// node the player will probably solve, taken from the one unchecked for longest. It is graded as
// `purpose: review` and the model counts it like any other first attempt (REQ-1018). Pure: it reads
// node rows, which carry the model's estimates, and a parameter file, and no clock.
import { type ModelParamsT, pGuessOf, pSlipOf } from "../model/params.js";
import type { StateName } from "../states/rules.js";

/** The expected chance of success a review subtype needs (REQ-1012). */
export const REVIEW_MIN_CHANCE = 0.85;

/** What the review list reads of a node: its tested state, last-seen time and subtype estimates. */
export interface ReviewNode {
  readonly node: string;
  readonly state: StateName;
  readonly lastSeen: number | null;
  /** The subtypes with their `pKnow` as of now, forgetting applied (ADR-0060). */
  readonly subtypes: readonly { id: string; pKnow: number }[];
}

export interface ReviewPick {
  readonly node: string;
  readonly subtype: string;
  readonly chance: number;
  readonly lastSeen: number | null;
}

/** `pKnow * (1 - pSlip) + (1 - pKnow) * pGuess` for a free-input, one-step task (REQ-1012). */
export const expectedChance = (pKnow: number, params: ModelParamsT): number =>
  pKnow * (1 - pSlipOf(params, 1)) + (1 - pKnow) * pGuessOf(params, "free", 0);

/**
 * The review candidates: nodes tested «fluent» or «stable» that have a subtype whose expected
 * chance is at least 0.85 now. Inferred states and "understands" never qualify, because the island
 * checks test inferred nodes. The subtype is the eligible one with the highest chance, a tie going
 * to the lower identifier.
 */
export function reviewCandidates(
  nodes: readonly ReviewNode[],
  params: ModelParamsT,
): ReviewPick[] {
  const picks: ReviewPick[] = [];
  for (const n of nodes) {
    if (n.state !== "fluent" && n.state !== "stable") continue;
    const best = n.subtypes
      .map((s) => ({ id: s.id, chance: expectedChance(s.pKnow, params) }))
      .filter((s) => s.chance >= REVIEW_MIN_CHANCE)
      .sort((a, b) => b.chance - a.chance || a.id.localeCompare(b.id))[0];
    if (best)
      picks.push({
        node: n.node,
        subtype: best.id,
        chance: best.chance,
        lastSeen: n.lastSeen,
      });
  }
  return picks;
}

/** The candidate unchecked for longest; a tie goes to the lower node identifier (REQ-1012). */
export function chooseReview(
  candidates: readonly ReviewPick[],
): ReviewPick | undefined {
  return [...candidates].sort(
    (a, b) =>
      (a.lastSeen ?? 0) - (b.lastSeen ?? 0) || a.node.localeCompare(b.node),
  )[0];
}

export interface SlotFill {
  readonly pick: ReviewPick | undefined;
  /** Set when no review candidate existed and a fallback filled the slot. */
  readonly why?: "no_review_candidate";
}

/**
 * Fills a review slot. With no candidate it takes a cold-start review node, then the frontier
 * candidate with the highest expected chance, and records `no_review_candidate` as the reason
 * (the reason stays on the server and in no packet, REQ-1016).
 */
export function fillReviewSlot(
  candidates: readonly ReviewPick[],
  fallbacks: { coldStart?: ReviewPick; frontier?: ReviewPick },
): SlotFill {
  const chosen = chooseReview(candidates);
  if (chosen) return { pick: chosen };
  return {
    pick: fallbacks.coldStart ?? fallbacks.frontier,
    why: "no_review_candidate",
  };
}
