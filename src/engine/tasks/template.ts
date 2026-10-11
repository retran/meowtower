// The template contract (RES-1200, ADR-0040) and the seeded generator with its
// fallback (REQ-1202, REQ-1206, REQ-1208, REQ-1210, REQ-0830). A template draws
// its parameters from the seeded source, then computes its answer and traps
// exactly in `Q`, so the same template, version and effective seed rebuild the
// same task, and `rebuild` needs no history to do it.
import { Q } from "../../math/q.js";
import { candidateSeed, Xoshiro128 } from "../../math/rng.js";

/** How many candidates sampling tries before it takes a fallback entry. */
export const CANDIDATE_LIMIT = 1000;

/** The fewest fallback entries a template may carry (ADR-0040). */
export const MIN_FALLBACK = 5;

export type AnswerKind = "number" | "fraction";

export interface Trap {
  readonly id: string;
  readonly value: Q;
}

export interface Template<P> {
  readonly id: string;
  readonly version: string;
  readonly inputClass: string;
  readonly answerKind: AnswerKind;
  /** Draws one candidate's parameters from the seeded source. */
  readonly draw: (rng: Xoshiro128) => P;
  /** Whether a candidate meets every constraint its subtype sets (REQ-1206). */
  readonly valid: (params: P) => boolean;
  /** The correct answer, computed exactly. */
  readonly solve: (params: P) => Q;
  /** Each trap's wrong answer, computed exactly. */
  readonly traps: (params: P) => readonly Trap[];
  /** Parameters used when sampling finds nothing (REQ-1208). */
  readonly fallback: readonly P[];
}

/** A task built from one effective seed: parameters, answer and traps. */
export interface Built<P> {
  readonly params: P;
  readonly answer: Q;
  readonly traps: readonly Trap[];
  /** `base/k` for a sampled candidate, `base/f<i>` for a fallback entry. */
  readonly effectiveSeed: string;
}

/** The failure states a generation or a twin can report as a typed result. */
export type FailureState =
  "generation_fallback" | "generation_error" | "twin_unavailable";

export type Generation<P> =
  | {
      readonly status: "ok";
      readonly built: Built<P>;
      readonly effectiveSeed: string;
    }
  | {
      readonly status: "generation_fallback";
      readonly built: Built<P>;
      readonly effectiveSeed: string;
    }
  | { readonly status: "generation_error"; readonly reason: "no_fallback" };

const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

const buildFrom = <P>(
  template: Template<P>,
  params: P,
  effectiveSeed: string,
): Built<P> => ({
  params,
  answer: template.solve(params),
  traps: template.traps(params),
  effectiveSeed,
});

const candidate = <P>(
  template: Template<P>,
  base: Uint8Array,
  k: number,
): Built<P> =>
  buildFrom(
    template,
    template.draw(Xoshiro128.fromSeed(candidateSeed(base, k))),
    `${hex(base)}/${k}`,
  );

/**
 * Whether no two values are equal: the answer and every trap, compared by
 * value, so `2/4` and `1/2` are the same value (REQ-1210).
 */
export function distinct(answer: Q, traps: readonly Trap[]): boolean {
  const values = [answer, ...traps.map((trap) => trap.value)];
  return values.every((v, i) => values.findIndex((w) => w.eq(v)) === i);
}

/**
 * The build problems of a template's fallback list: too short, an entry that
 * `valid()` rejects, or an entry whose traps aren't distinct from its answer.
 */
export function checkTemplate<P>(template: Template<P>): string[] {
  const problems: string[] = [];
  if (template.fallback.length < MIN_FALLBACK)
    problems.push("fallback_too_short");
  template.fallback.forEach((params, i) => {
    if (!template.valid(params)) problems.push(`fallback_invalid_${i}`);
    else if (!distinct(template.solve(params), template.traps(params)))
      problems.push(`fallback_trap_equal_${i}`);
  });
  return problems;
}

/**
 * Draws candidate `k` from `hash(baseSeed, k)` until one passes `valid()`, the
 * distinctness test and the reject predicate, which returns true to refuse. If
 * none does in 1,000 candidates, it takes the first fallback entry the
 * predicate accepts, or the first entry when it accepts none (REQ-1208).
 */
export function generate<P>(
  template: Template<P>,
  base: Uint8Array,
  reject: (built: Built<P>) => boolean = () => false,
): Generation<P> {
  for (let k = 0; k < CANDIDATE_LIMIT; k++) {
    const built = candidate(template, base, k);
    if (
      template.valid(built.params) &&
      distinct(built.answer, built.traps) &&
      !reject(built)
    )
      return { status: "ok", built, effectiveSeed: built.effectiveSeed };
  }
  const entries = template.fallback.map((params, i) =>
    buildFrom(template, params, `${hex(base)}/f${i}`),
  );
  const [first] = entries;
  if (first === undefined)
    return { status: "generation_error", reason: "no_fallback" };
  const built = entries.find((entry) => !reject(entry)) ?? first;
  return {
    status: "generation_fallback",
    built,
    effectiveSeed: built.effectiveSeed,
  };
}

/**
 * Rebuilds a task from its effective seed alone: `base/k` draws candidate `k`,
 * `base/f<i>` takes fallback entry `i`. No history is read (REQ-1202).
 */
export function rebuild<P>(
  template: Template<P>,
  effectiveSeed: string,
): Built<P> {
  const m = /^([0-9a-f]+)\/(?:(\d+)|f(\d+))$/.exec(effectiveSeed);
  if (m === null) throw new SyntaxError("bad_effective_seed");
  const [, base = "", k, f] = m;
  if (f !== undefined) {
    const params = template.fallback[Number(f)];
    if (params === undefined) throw new RangeError("no_fallback_entry");
    return buildFrom(template, params, effectiveSeed);
  }
  return candidate(template, Buffer.from(base, "hex"), Number(k));
}
