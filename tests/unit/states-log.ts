// A log builder for the state tests: each try is one item shown, submitted and graded, at
// the given day, so the tests read as the attempts they describe (TSK-0523 to TSK-0526).
import type { LogEvent } from "../../src/engine/model/observations.js";

export const DAY = 86_400_000;

export interface Try {
  readonly id: string;
  readonly node?: string;
  readonly subtype?: string;
  readonly day: number;
  readonly verdict?: "correct" | "partial" | "wrong" | "dont_know";
  readonly ms?: number;
  readonly purpose?: string;
  readonly form?: "free" | "choice";
  readonly options?: number;
  readonly assisted?: boolean;
}

/** The events of the tries, in the order given. */
export function logOf(tries: readonly Try[]): LogEvent[] {
  return tries.flatMap((t): LogEvent[] => {
    const ts = new Date(t.day * DAY).toISOString();
    return [
      {
        type: "item_shown",
        payload: {
          itemId: t.id,
          node: t.node ?? "N1",
          subtype: t.subtype ?? "a",
          purpose: t.purpose ?? "task",
          answerForm: t.form ?? "free",
          options: t.options ?? 0,
          steps: 1,
        },
        ts,
      },
      {
        type: "attempt_submitted",
        payload: {
          itemId: t.id,
          attemptNo: 1,
          assisted: t.assisted ?? false,
          input: { submittedMs: t.ms ?? 1000 },
        },
        ts,
      },
      {
        type: "verdict",
        payload: { itemId: t.id, verdict: t.verdict ?? "correct" },
        ts,
      },
    ];
  });
}

/** A lesson mark event, as the parent writes it (REQ-0952). */
export const mark = (
  type: "parent_tag_added" | "parent_tag_removed",
  node: string,
  day: number,
): LogEvent => ({
  type,
  payload: { node, subtype: null },
  ts: new Date(day * DAY).toISOString(),
});
