// The word-problem structure contract (ADR-0040, REQ-0780 to REQ-0836). A
// problem fixes its steps, numbers and answer first, and only then chooses its
// story frame, whose placeholders hold roles and never values. Its nouns take
// the Russian form their number requires. A model choice offers four notes,
// one correct and three from the structure traps, drawn as SVG by code.
import { candidateSeed, Xoshiro128 } from "../math/rng.js";

/** The seven structures of RES-0700, in the catalogue's order. */
export const STRUCTURES = [
  "chain",
  "fork_comparison",
  "parts_whole",
  "more_times",
  "price_change",
  "motion",
  "work",
] as const;
export type Structure = (typeof STRUCTURES)[number];

/** Returned when no node is allowed, so the problem builds nothing (REQ-0784). */
export const NO_FLUENT_NUMBERS = "no_fluent_numbers";

export interface Frame {
  /** The placeholders the frame holds: roles such as `{role:part}`, never values. */
  readonly placeholders: readonly string[];
}

export type Composed =
  | {
      readonly status: "ok";
      readonly structure: Structure;
      readonly numbers: readonly number[];
      readonly answer: number;
      readonly frame: Frame;
    }
  | { readonly status: typeof NO_FLUENT_NUMBERS };

/** The frame a structure takes, chosen after its numbers are fixed. */
const FRAMES: Record<Structure, readonly string[]> = {
  chain: ["{role:start}", "{role:change}", "{role:end}"],
  fork_comparison: ["{role:first}", "{role:second}", "{role:difference}"],
  parts_whole: ["{role:part}", "{role:part}", "{role:whole}"],
  more_times: ["{role:base}", "{role:factor}", "{role:result}"],
  price_change: ["{role:price}", "{role:count}", "{role:change}"],
  motion: ["{role:speed}", "{role:time}", "{role:distance}"],
  work: ["{role:rate}", "{role:time}", "{role:amount}"],
};

const ANSWER: Record<Structure, (n: readonly number[]) => number> = {
  chain: (n) => n.reduce((a, b) => a + b, 0),
  fork_comparison: (n) => (n[0] ?? 0) - (n[1] ?? 0),
  parts_whole: (n) => n.reduce((a, b) => a + b, 0),
  more_times: (n) => (n[0] ?? 0) * (n[1] ?? 0),
  price_change: (n) => (n[0] ?? 0) * (n[1] ?? 0),
  motion: (n) => (n[0] ?? 0) * (n[1] ?? 0),
  work: (n) => (n[0] ?? 0) * (n[1] ?? 0),
};

/** The numbers, structure and answer, fixed before a frame is chosen (REQ-0782). */
export interface Fixed {
  readonly structure: Structure;
  readonly numbers: readonly number[];
  readonly answer: number;
}

export type FrameChooser = (fixed: Fixed) => Frame;

/**
 * Fixes the numbers and the answer, then chooses the frame. With no allowed
 * node it builds nothing (REQ-0784).
 */
export function compose(
  structure: Structure,
  numbers: readonly number[],
  allowedNodes: readonly string[],
  chooseFrame: FrameChooser = (fixed) => ({
    placeholders: FRAMES[fixed.structure],
  }),
): Composed {
  if (allowedNodes.length === 0) return { status: NO_FLUENT_NUMBERS };
  const answer = ANSWER[structure](numbers);
  const frame = chooseFrame({ structure, numbers, answer });
  return { status: "ok", structure, numbers, answer, frame };
}

/** A T4 problem: the numbers its solution uses, and one number it doesn't. */
export interface T4Problem {
  readonly numbers: readonly number[];
  readonly used: readonly number[];
}

/** Two used numbers and one distractor, from the seed alone (REQ-0786). */
export function t4Problem(seed: Uint8Array): T4Problem {
  const rng = Xoshiro128.fromSeed(candidateSeed(seed, 0));
  const a = 2 + rng.int(18);
  const b = 2 + rng.int(18);
  const distractor = 50 + rng.int(20);
  return { numbers: [a, b, distractor], used: [a, b] };
}

/**
 * The Russian noun form a number takes: `forms` is the one form (1), the few
 * form (2 to 4) and the many form (5 to 20 and the rest), as in «1 зелье,
 * 3 зелья, 5 зелий» (REQ-0788).
 */
export function nounForm(
  n: number,
  forms: readonly [string, string, string],
): string {
  const last = n % 10;
  const tens = n % 100;
  if (last === 1 && tens !== 11) return forms[0];
  if (last >= 2 && last <= 4 && (tens < 12 || tens > 14)) return forms[1];
  return forms[2];
}

export interface ModelNote {
  readonly value: number;
  readonly correct: boolean;
}

export interface ModelChoice {
  readonly notes: readonly ModelNote[];
  readonly svg: readonly string[];
}

/** A bar drawn by code from the note's own value (REQ-0836). */
const bar = (value: number): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${value * 10} 20"><rect width="${value * 10}" height="20"/></svg>`;

/**
 * Four notes: the correct one from the valid graph and three from the trap
 * answers. The correct note sits at the position the seed picks.
 */
export function modelChoice(
  answer: number,
  trapValues: readonly number[],
  seed: number,
): ModelChoice {
  const wrong = trapValues.slice(0, 3).map((value) => ({
    value,
    correct: false,
  }));
  const at = seed % 4;
  const notes = [...wrong];
  notes.splice(at, 0, { value: answer, correct: true });
  return { notes, svg: notes.map((n) => bar(n.value)) };
}

/** One problem in four opens with a model choice (REQ-0836). */
export const opensWithModel = (k: number): boolean => k % 4 === 0;
