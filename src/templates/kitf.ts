// A compact way to write fraction templates, like `kit.ts` for whole numbers: the drawn numbers are a
// list, `a` to `h` name them in the texts, `r` is the answer and `w_<trap>` is each trap's wrong answer.
// A fraction is written in a text as numerator, a fraction slash and denominator (`3⁄4`), because the text
// rules refuse the plain slash that a division sign shares; the client lays it out.
import { formatQ } from "../math/format.js";
import { Q } from "../math/q.js";
import type { Xoshiro128 } from "../math/rng.js";
import { digits } from "./draw.js";
import { defineSpec, type AnswerKind, type Origin, type Spec } from "./spec.js";

const NAMES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

/** An exact number, a sign, a list of option names, or two exact numbers. */
export type FVal = Q | string | readonly string[] | readonly [Q, Q];

/** The exact number `n / d`. */
export const q = (n: number, d = 1): Q => Q.of(BigInt(n), BigInt(d));

const SLASH = "⁄";
/** `n` over `d` as a text: `3⁄4`. */
export const fr = (n: number, d: number): string => `${n}${SLASH}${d}`;

/** A number as a text of the kind named: a whole number, a decimal, a fraction or a mixed number. */
export function show(kind: AnswerKind, x: FVal): string {
  if (typeof x === "string") return x;
  if (kind === "time" && Array.isArray(x)) {
    const [h, m] = x as unknown as readonly [Q, Q];
    return `${h.n.toString()}:${m.n.toString().padStart(2, "0")}`;
  }
  if (!(x instanceof Q)) {
    return (x as readonly (Q | string)[])
      .map((y) => (y instanceof Q ? show("integer", y) : y))
      .join("; ");
  }
  if (kind === "decimal" || kind === "line")
    return formatQ(x, {
      decimal: ",",
      group: "",
      mul: "",
      div: "",
      minus: "−",
    });
  const neg = x.n < 0n;
  const n = neg ? -x.n : x.n;
  const sign = neg ? "−" : "";
  if (x.d === 1n) return `${sign}${digits(Number(n))}`;
  if (kind === "mixed" && n > x.d)
    return `${sign}${(n / x.d).toString()} ${(n % x.d).toString()}${SLASH}${x.d.toString()}`;
  return `${sign}${n.toString()}${SLASH}${x.d.toString()}`;
}

export interface FracT {
  readonly id: string;
  readonly form: string;
  readonly groups: readonly [number, number];
  readonly origin?: Origin;
  readonly kind: AnswerKind;
  readonly rule?: "equivalent" | "simplest";
  readonly face?: "analogue" | "digital";
  readonly draw: (r: Xoshiro128) => number[];
  readonly valid?: (v: number[]) => boolean;
  readonly solve: (v: number[]) => FVal;
  readonly ref: (v: number[]) => FVal;
  readonly traps?: readonly (readonly [
    string,
    "conceptual" | "procedural" | "fact",
    (v: number[]) => FVal | null,
  ])[];
  readonly extra?: (v: number[]) => Record<string, string>;
  readonly consts?: readonly number[];
  /** The options of a set or choice task, in the order shown. */
  readonly options?: (v: number[]) => string[];
  /** How far an entry may lie from the answer of a `line` task. */
  readonly within?: (v: number[]) => Q;
}

const trapKey = (id: string): string => `w_${id.replace(/-/g, "_")}`;

/** A whole-number text with thousands groups, as `kit.ts` does for extra values. */
const grouped = (vars: Record<string, string>): Record<string, string> =>
  Object.fromEntries(
    Object.entries(vars).map(([k, x]) => [
      k,
      /^\d{4,}$/.test(x) ? digits(Number(x)) : x,
    ]),
  );

/** Builds a spec for node `node` and subtype `subtype` from the short form above. */
export function frac(node: string, subtype: string, o: FracT): Spec<never> {
  return defineSpec<number[]>({
    id: o.id,
    node,
    subtype,
    form: o.form,
    groups: o.groups,
    ...(o.origin ? { origin: o.origin } : {}),
    answer: o.kind,
    ...(o.rule ? { rule: o.rule } : {}),
    ...(o.face ? { face: o.face } : {}),
    draw: o.draw,
    valid: (v: number[]) => {
      if (o.valid && !o.valid(v)) return false;
      // The checker of a mixed number refuses a bare whole number, so such draws are skipped.
      const x = o.solve(v);
      return !(o.kind === "mixed" && x instanceof Q && x.d === 1n);
    },
    solve: (v) => o.solve(v) as never,
    reference: (v) => o.ref(v) as never,
    ...(o.options ? { options: (v: number[]) => o.options?.(v) ?? [] } : {}),
    ...(o.within ? { within: (v: number[]) => o.within?.(v) ?? Q.of(0n) } : {}),
    traps: (o.traps ?? []).map(([id, kind, wrong]) => ({
      id,
      kind,
      wrong: (v: number[]) => {
        const w = wrong(v);
        return w === null ? null : (w as never);
      },
    })),
    vars: (v) => ({
      ...Object.fromEntries(
        v.slice(0, NAMES.length).map((x, i) => [NAMES[i], digits(x)]),
      ),
      r: show(o.kind, o.solve(v)),
      ...Object.fromEntries(
        (o.traps ?? []).flatMap(([id, , wrong]) => {
          const w = wrong(v);
          return w === null ? [] : [[trapKey(id), show(o.kind, w)]];
        }),
      ),
      ...(o.extra ? grouped(o.extra(v)) : {}),
    }),
    constants: o.consts ?? [],
  });
}

/** The same, bound to a node and subtype, for a file of many templates. */
export const forFraction =
  (node: string, subtype: string) =>
  (o: FracT): Spec<never> =>
    frac(node, subtype, o);

/** `n` hundredths-or-other: the exact number `n / 10^places`. */
export const qd = (n: number, places: number): Q =>
  Q.of(BigInt(n), 10n ** BigInt(places));

/** `n / 10^places` as a decimal text with a comma; `trim` drops zeros at the end, as `2,5` for `2,50`. */
export function dec(n: number, places: number, trim = false): string {
  const neg = n < 0;
  const abs = Math.abs(n);
  const unit = 10 ** places;
  const whole = Math.floor(abs / unit);
  let rest = String(abs % unit).padStart(places, "0");
  if (trim) rest = rest.replace(/0+$/, "");
  const sign = neg ? "−" : "";
  return rest === ""
    ? `${sign}${digits(whole)}`
    : `${sign}${digits(whole)},${rest}`;
}

/** A clock time as the text of a task: `h:mm`. */
export const tm = (h: number, m: number): string =>
  `${h}:${m.toString().padStart(2, "0")}`;
