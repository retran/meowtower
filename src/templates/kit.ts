// A compact way to write whole-number templates: the drawn parameters are a list of numbers, `a` to `h`
// name them in the texts, `r` is the answer and `w_<trap>` is each trap's wrong answer. A template
// that needs another answer kind, or other values in its texts, writes a full spec instead.
import type { Xoshiro128 } from "../math/rng.js";
import { digits, qi } from "./draw.js";
import { defineSpec, type Origin, type Spec } from "./spec.js";

/** The names the texts use for the drawn numbers, in order. */
const NAMES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

/** A number, or a quotient and a remainder. */
export type Num = number | readonly [number, number];

export interface Arith {
  readonly id: string;
  readonly form: string;
  readonly groups: readonly [number, number];
  readonly origin?: Origin;
  readonly draw: (r: Xoshiro128) => number[];
  readonly valid?: (v: number[]) => boolean;
  readonly solve: (v: number[]) => Num;
  /** A second route to the same answer, written differently from `solve`. */
  readonly ref: (v: number[]) => Num;
  /** Each trap: its id, its kind and the wrong answer it gives (null where it does not apply). */
  readonly traps?: readonly (readonly [
    string,
    "conceptual" | "procedural" | "fact",
    (v: number[]) => Num | null,
  ])[];
  /** Further values the texts may name. */
  readonly extra?: (v: number[]) => Record<string, string>;
  /** Numbers the texts may state that no parameter or answer holds. */
  readonly consts?: readonly number[];
}

const toAnswer = (x: Num) =>
  typeof x === "number" ? qi(x) : ([qi(x[0]), qi(x[1])] as const);
const show = (x: Num): string =>
  typeof x === "number" ? digits(x) : `${digits(x[0])}; ${digits(x[1])}`;
/** A whole number of four digits or more gets its thousands groups, as a text shows it. */
const grouped = (vars: Record<string, string>): Record<string, string> =>
  Object.fromEntries(
    Object.entries(vars).map(([k, x]) => [
      k,
      /^\d{4,}$/.test(x) ? digits(Number(x)) : x,
    ]),
  );
const trapKey = (id: string): string => `w_${id.replace(/-/g, "_")}`;

/** Builds a spec for node `node` and subtype `subtype` from the short form above. */
export function arith(node: string, subtype: string, o: Arith): Spec<never> {
  return defineSpec<number[]>({
    id: o.id,
    node,
    subtype,
    form: o.form,
    groups: o.groups,
    ...(o.origin ? { origin: o.origin } : {}),
    answer: Array.isArray(o.solve([20, 3, 2, 4, 6, 7, 8, 9]) as Num)
      ? "pair"
      : "integer",
    draw: o.draw,
    ...(o.valid ? { valid: o.valid } : {}),
    solve: (v) => toAnswer(o.solve(v)) as never,
    reference: (v) => toAnswer(o.ref(v)) as never,
    traps: (o.traps ?? []).map(([id, kind, wrong]) => ({
      id,
      kind,
      wrong: (v: number[]) => {
        const w = wrong(v);
        return w === null ? null : (toAnswer(w) as never);
      },
    })),
    vars: (v) => ({
      ...Object.fromEntries(
        v.slice(0, NAMES.length).map((x, i) => [NAMES[i], digits(x)]),
      ),
      r: show(o.solve(v)),
      ...Object.fromEntries(
        (o.traps ?? []).flatMap(([id, , wrong]) => {
          const w = wrong(v);
          return w === null ? [] : [[trapKey(id), show(w)]];
        }),
      ),
      ...(o.extra ? grouped(o.extra(v)) : {}),
    }),
    constants: o.consts ?? [],
  });
}

/** The same, bound to a node and subtype, for a file of many templates. */
export const forSubtype =
  (node: string, subtype: string) =>
  (o: Arith): Spec<never> =>
    arith(node, subtype, o);
