// The shortest way to write a template: the drawn numbers are the named arguments of the functions
// (`(a, b) => ...`), each drawn from a range or a list. It builds on `kitf.ts`, so `r` is the answer
// and `w_<trap>` the wrong answers in the texts. Used where a template is one formula over a few numbers.
import type { Xoshiro128 } from "../math/rng.js";
import { Q } from "../math/q.js";
import { between, pick } from "./draw.js";
import { forFraction, q, type FracT, type FVal } from "./kitf.js";
import type { AnswerKind, Origin, Spec } from "./spec.js";

/** A parameter drawn from `lo` up to `hi`. */
export const rg =
  (lo: number, hi: number): ((r: Xoshiro128) => number) =>
  (r) =>
    between(r, lo, hi);
/** A parameter drawn from a list. */
export const of =
  (...list: number[]): ((r: Xoshiro128) => number) =>
  (r) =>
    pick(r, list);
/** A parameter that is always the same number. */
export const fix =
  (n: number): ((r: Xoshiro128) => number) =>
  () =>
    n;

type F = (...v: number[]) => FVal;
type Cond = (...v: number[]) => boolean;
type Extra = (...v: number[]) => Record<string, string>;

export interface Def {
  readonly id: string;
  readonly form: string;
  readonly g: readonly [number, number];
  readonly kind: AnswerKind;
  readonly p: readonly ((r: Xoshiro128) => number)[];
  readonly ok?: Cond;
  readonly f: F;
  /** A second route to the same answer. */
  readonly alt?: F;
  /** The traps: id to the wrong answer (null where it does not apply). */
  readonly t?: Record<string, (...v: number[]) => FVal | null>;
  readonly x?: Extra;
  readonly c?: readonly number[];
  readonly rule?: "equivalent" | "simplest";
  readonly face?: "analogue" | "digital";
  readonly origin?: Origin;
  readonly options?: (...v: number[]) => string[];
  readonly within?: (...v: number[]) => Q;
}

/** Builds the spec of one template of node `node` and subtype `subtype`. */
export const calc =
  (node: string, subtype: string) =>
  (d: Def): Spec<never> => {
    const make = forFraction(node, subtype);
    const fn =
      <T>(h: (...v: number[]) => T) =>
      (v: number[]) =>
        h(...v);
    const t: FracT["traps"] = Object.entries(d.t ?? {}).map(([id, w]) => [
      id,
      "conceptual",
      fn(w),
    ]);
    return make({
      id: d.id,
      form: d.form,
      groups: d.g,
      kind: d.kind,
      draw: (r) => d.p.map((h) => h(r)),
      ...(d.ok ? { valid: fn(d.ok) } : {}),
      solve: fn(d.f),
      ref: fn(d.alt ?? d.f),
      traps: t,
      ...(d.x ? { extra: fn(d.x) } : {}),
      ...(d.c ? { consts: d.c } : {}),
      ...(d.rule ? { rule: d.rule } : {}),
      ...(d.face ? { face: d.face } : {}),
      ...(d.origin ? { origin: d.origin } : {}),
      ...(d.options ? { options: fn(d.options) } : {}),
      ...(d.within ? { within: fn(d.within) } : {}),
    });
  };

export { q };
