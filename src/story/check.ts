// What a check gives the Master (ADR-3270, REQ-8172, REQ-8180): the engine's outcome on a ladder, and
// nothing else. A clean answer is a success, a partial one a cost and a failed one a twist that moves
// the story on. The Master gets the result as a fact in the turn's message and has no tool that sets it.
import type { z } from "zod";
import { CheckReply, type Outcome } from "./master-tools.js";

/** The outcome the engine's verdict carries: the corridor's own names. */
export type EngineOutcome = "clean" | "partial" | "alt";

export const ENGINE_OUTCOMES: readonly EngineOutcome[] = [
  "clean",
  "partial",
  "alt",
];

const LADDER: Readonly<Record<EngineOutcome, Outcome>> = {
  clean: "success",
  partial: "cost",
  alt: "twist",
};

/** The Master's word for an engine outcome. */
export const ladder = (outcome: EngineOutcome): Outcome => LADDER[outcome];

/** The reply of a check, which holds the outcome alone (REQ-8176 and the contract in master-tools). */
export const checkReply = (
  outcome: EngineOutcome,
): z.infer<typeof CheckReply> => CheckReply.parse({ outcome: ladder(outcome) });

/**
 * The outcome of the check her last action called for: the engine's latest verdict that no turn has
 * used yet (REQ-8172). It reads the log in order, a turn closes the verdicts before it, and a verdict
 * whose outcome is not one of the engine's is skipped. None where nothing waits.
 */
export function engineOutcomeOf(
  events: readonly { type: string; payload: unknown }[],
): EngineOutcome | null {
  let waiting: EngineOutcome | null = null;
  for (const e of events) {
    if (e.type === "turn_taken") waiting = null;
    else if (e.type === "verdict") {
      const o = (e.payload as { outcome?: unknown }).outcome;
      if (ENGINE_OUTCOMES.includes(o as EngineOutcome))
        waiting = o as EngineOutcome;
    }
  }
  return waiting;
}
