// Classifies a wrong answer and builds a choice task's options (ADR-0040,
// REQ-0702 to REQ-0730). Both are pure: they read only the task's traps and its
// correct answer, so no answer or option depends on anything but the task.
import { Q } from "../../math/q.js";
import type { AnswerKind, Trap } from "./template.js";

/** The classes of a wrong answer that matches no trap. */
export const COMPUTATIONAL = "computational";
export const UNCLASSIFIED = "unclassified";

export interface ClassifiableTask {
  readonly answer: Q;
  readonly kind: AnswerKind;
  readonly traps: readonly Trap[];
  /** The two factors of a times-table answer, for the neighbouring-fact rule. */
  readonly factors?: readonly [Q, Q];
}

export interface Option {
  readonly value: Q;
  readonly role: "correct" | "trap" | "filler";
  readonly trapId?: string;
}

const one = Q.of(1n);

/** One digit off, or two digits swapped, for whole answers (REQ-0728). */
const digitNeighbour = (entry: Q, answer: Q): boolean => {
  if (!entry.isInteger() || !answer.isInteger()) return false;
  const s = entry.n.toString();
  const t = answer.n.toString();
  if (s.length !== t.length) return false;
  const differing: number[] = [];
  for (let i = 0; i < s.length; i++) if (s[i] !== t[i]) differing.push(i);
  if (differing.length === 1) return true;
  if (differing.length !== 2) return false;
  const [i, j] = differing as [number, number];
  return s[i] === t[j] && s[j] === t[i];
};

/** A neighbouring times-table fact: one factor off by one (REQ-0730). */
const timesTableNeighbour = (entry: Q, factors: readonly [Q, Q]): boolean => {
  const [a, b] = factors;
  return [
    a.add(one).mul(b),
    a.sub(one).mul(b),
    a.mul(b.add(one)),
    a.mul(b.sub(one)),
  ].some((candidate) => candidate.eq(entry));
};

/**
 * The class of a wrong answer: the trap whose answer it equals (REQ-0726),
 * computational (REQ-0728, REQ-0730), or unclassified (REQ-0730).
 */
export function classify(entry: Q, task: ClassifiableTask): string {
  const trap = task.traps.find((t) => t.value.eq(entry));
  if (trap !== undefined) return trap.id;
  const computational =
    digitNeighbour(entry, task.answer) ||
    (task.factors !== undefined && timesTableNeighbour(entry, task.factors));
  return computational ? COMPUTATIONAL : UNCLASSIFIED;
}

/**
 * The fillers for a choice task that its traps don't give: close in form to
 * the answer, the same number of digits for a whole answer and the same
 * denominator for a fraction (REQ-0704). Nearest first, positive only.
 */
const fillers = (answer: Q, need: number, taken: (v: Q) => boolean): Q[] => {
  const found: Q[] = [];
  const accept = (v: Q) => {
    if (
      found.length < need &&
      v.n > 0n &&
      !taken(v) &&
      !found.some((f) => f.eq(v))
    )
      found.push(v);
  };
  if (answer.d === 1n) {
    const digits = answer.n.toString().length;
    for (let k = 1n; found.length < need && k < 100_000n; k++)
      for (const v of [Q.of(answer.n + k), Q.of(answer.n - k)])
        if (v.n.toString().length === digits) accept(v);
  } else {
    for (let k = 1n; found.length < need && k < 100_000n; k++)
      for (const n of [answer.n + k, answer.n - k]) {
        const v = Q.of(n, answer.d);
        if (v.d === answer.d) accept(v);
      }
  }
  if (found.length < need) throw new RangeError("no_filler");
  return found;
};

/**
 * The options of a choice task: the correct answer, then the traps' answers as
 * far as they are distinct, then fillers up to `count`. The caller orders them.
 */
export function buildOptions(task: ClassifiableTask, count: number): Option[] {
  const options: Option[] = [{ value: task.answer, role: "correct" }];
  const taken = (v: Q) => options.some((o) => o.value.eq(v));
  for (const trap of task.traps) {
    if (options.length >= count) break;
    if (taken(trap.value)) continue;
    options.push({ value: trap.value, role: "trap", trapId: trap.id });
  }
  for (const value of fillers(task.answer, count - options.length, taken))
    options.push({ value, role: "filler" });
  return options;
}
