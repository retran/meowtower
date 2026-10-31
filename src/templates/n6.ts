// Node N6, numbers to a million and decimals (level 1F) and rounding them (level 1S) (RES-4281). The
// Dutch goals reach 100,000 at group 6 and one million at group 7, meet decimals at group 5 and round
// "where the goal sets the accuracy". Texts are plain blanks in `content/tasks-n.ru.json`.
import { Q } from "../math/q.js";
import {
  between,
  digits,
  hundredthsText,
  pick,
  qHundredths,
  qi,
  qTenths,
  signOf,
  tenthsText,
} from "./draw.js";
import { formatQ } from "../math/format.js";
import { defineSpec, type Spec } from "./spec.js";

const s = String;

const keyOf = (a: unknown): string =>
  a instanceof Q
    ? a.toString()
    : Array.isArray(a)
      ? a.map(String).join("|")
      : String(a);

/**
 * Builds a spec whose later traps give way to an earlier one with the same wrong answer, and whose
 * texts can name each trap's wrong answer as `w_<trap_id_with_underscores>`.
 */
const define = <P>(sp: Spec<P>): Spec<never> => {
  const traps = (sp.traps ?? []).map((t, i, all) => ({
    ...t,
    wrong: (p: P) => {
      const w = t.wrong(p);
      if (w === null) return null;
      for (const e of all.slice(0, i)) {
        const o = e.wrong(p);
        if (o !== null && keyOf(o) === keyOf(w)) return null;
      }
      return w;
    },
  }));
  return defineSpec<P>({
    ...sp,
    traps,
    vars: (p) => ({
      ...sp.vars(p),
      ...Object.fromEntries(
        traps.flatMap((t) => {
          const w = t.wrong(p);
          const key = `w_${t.id.replace(/-/g, "_")}`;
          return w instanceof Q
            ? [[key, formatQ(w)]]
            : typeof w === "string"
              ? [[key, w]]
              : [];
        }),
      ),
    }),
  });
};
const nearest = (n: number, step: number): number =>
  Math.floor((n + step / 2) / step) * step;
const down = (n: number, step: number): number => Math.floor(n / step) * step;
const isTie = (n: number, step: number): boolean => n % step === step / 2;

interface N {
  n: number;
}

const million = [
  define<{ k: number; rem: number }>({
    id: "N6.million-decimal.01",
    node: "N6",
    subtype: "million-decimal",
    form: "thousands-and-units-to-a-number",
    groups: [6, 7],
    answer: "integer",
    draw: (r) => ({
      k: between(r, 100, 999),
      rem: r.int(2) === 0 ? between(r, 1, 99) : between(r, 100, 999),
    }),
    solve: (p) => qi(1000 * p.k + p.rem),
    reference: (p) => qi(Number(`${p.k}${s(p.rem).padStart(3, "0")}`)),
    traps: [
      {
        id: "joined-without-zeros",
        kind: "conceptual",
        wrong: (p) => (p.rem >= 100 ? null : qi(Number(`${p.k}${p.rem}`))),
      },
      {
        id: "one-zero-short",
        kind: "conceptual",
        wrong: (p) => (p.rem >= 10 ? null : qi(Number(`${p.k}0${p.rem}`))),
      },
      { id: "added", kind: "conceptual", wrong: (p) => qi(p.k + p.rem) },
      {
        id: "swapped",
        kind: "conceptual",
        wrong: (p) => qi(Number(`${p.rem}${p.k}`)),
      },
    ],
    vars: (p) => ({
      k: s(p.k),
      m: s(p.rem),
      r: digits(1000 * p.k + p.rem),
      joined: s(Number(`${p.k}${p.rem}`)),
    }),
    constants: [0, 1000],
  }),
  define<N>({
    id: "N6.million-decimal.02",
    node: "N6",
    subtype: "million-decimal",
    form: "digit-in-the-hundred-thousands-place",
    groups: [6, 7],
    answer: "integer",
    draw: (r) => ({ n: between(r, 100_000, 999_999) }),
    valid: (p) => s(p.n)[0] !== s(p.n)[1],
    solve: (p) => qi(Number(s(p.n)[0])),
    reference: (p) => qi(Math.floor(p.n / 100_000)),
    traps: [
      {
        id: "ten-thousands-digit",
        kind: "conceptual",
        wrong: (p) => qi(Number(s(p.n)[1])),
      },
      {
        id: "hundreds-digit",
        kind: "conceptual",
        wrong: (p) => qi(Number(s(p.n)[3])),
      },
      {
        id: "thousands-digit",
        kind: "conceptual",
        wrong: (p) => qi(Number(s(p.n)[2])),
      },
    ],
    vars: (p) => ({
      n: digits(p.n),
      r: s(Math.floor(p.n / 100_000)),
      t: s(Number(s(p.n)[1])),
    }),
  }),
  define<N>({
    id: "N6.million-decimal.03",
    node: "N6",
    subtype: "million-decimal",
    form: "how-many-whole-thousands-in-a-number",
    groups: [6, 7],
    answer: "integer",
    draw: (r) => ({ n: between(r, 100_001, 999_999) }),
    valid: (p) =>
      Math.floor(p.n / 1000) % 10 !== Math.floor(p.n / 1000) &&
      p.n % 1000 !== 0,
    solve: (p) => qi(Math.floor(p.n / 1000)),
    reference: (p) => qi(Number(s(p.n).slice(0, -3))),
    traps: [
      {
        id: "thousands-digit",
        kind: "conceptual",
        wrong: (p) => qi(Math.floor(p.n / 1000) % 10),
      },
      { id: "last-three", kind: "conceptual", wrong: (p) => qi(p.n % 1000) },
      {
        id: "as-number",
        kind: "conceptual",
        wrong: (p) => qi(1000 * Math.floor(p.n / 1000)),
      },
    ],
    vars: (p) => ({
      n: digits(p.n),
      r: s(Math.floor(p.n / 1000)),
      d: s(Math.floor(p.n / 1000) % 10),
    }),
    constants: [1000],
  }),
  define<N>({
    id: "N6.million-decimal.04",
    node: "N6",
    subtype: "million-decimal",
    form: "one-thousand-more",
    groups: [6, 7],
    answer: "integer",
    draw: (r) => ({ n: between(r, 100_000, 998_999) }),
    solve: (p) => qi(p.n + 1000),
    reference: (p) => qi(p.n - -1000),
    traps: [
      {
        id: "ten-thousand-more",
        kind: "procedural",
        wrong: (p) => qi(p.n + 10_000),
      },
      { id: "hundred-more", kind: "procedural", wrong: (p) => qi(p.n + 100) },
      {
        id: "hundred-thousand-more",
        kind: "procedural",
        wrong: (p) => qi(p.n + 100_000),
      },
    ],
    vars: (p) => ({
      n: digits(p.n),
      r: digits(p.n + 1000),
      a: digits(p.n + 10_000),
      b: digits(p.n + 100),
    }),
    constants: [1000],
  }),
  define<{ w: number; k: number }>({
    id: "N6.million-decimal.05",
    node: "N6",
    subtype: "million-decimal",
    form: "whole-and-tenths-to-a-decimal",
    groups: [5, 6],
    answer: "decimal",
    draw: (r) => ({ w: between(r, 1, 30), k: between(r, 1, 9) }),
    solve: (p) => qTenths(10 * p.w + p.k),
    reference: (p) => Q.fromDecimal(`${p.w},${p.k}`),
    traps: [
      { id: "added", kind: "conceptual", wrong: (p) => qi(p.w + p.k) },
      {
        id: "tenths-as-hundredths",
        kind: "conceptual",
        wrong: (p) => Q.fromDecimal(`${p.w},0${p.k}`),
      },
      {
        id: "no-comma",
        kind: "conceptual",
        wrong: (p) => qi(10 * p.w + p.k),
      },
    ],
    vars: (p) => ({
      w: s(p.w),
      k: s(p.k),
      r: `${p.w},${p.k}`,
      sum: s(p.w + p.k),
    }),
    constants: [0],
  }),
  define<{ w: number; k: number }>({
    id: "N6.million-decimal.06",
    node: "N6",
    subtype: "million-decimal",
    form: "whole-and-hundredths-to-a-decimal",
    groups: [5, 6],
    answer: "decimal",
    draw: (r) => ({ w: between(r, 1, 30), k: between(r, 1, 9) }),
    solve: (p) => qHundredths(100 * p.w + p.k),
    reference: (p) => Q.fromDecimal(`${p.w},0${p.k}`),
    traps: [
      {
        id: "tenths-slip",
        kind: "conceptual",
        wrong: (p) => qTenths(10 * p.w + p.k),
      },
      {
        id: "thousandths",
        kind: "conceptual",
        wrong: (p) => Q.of(BigInt(1000 * p.w + p.k), 1000n),
      },
      {
        id: "no-comma",
        kind: "conceptual",
        wrong: (p) => qi(100 * p.w + p.k),
      },
    ],
    vars: (p) => ({
      w: s(p.w),
      k: s(p.k),
      r: `${p.w},0${p.k}`,
      t: `${p.w},${p.k}`,
    }),
    constants: [0],
  }),
  define<{ x: number; p: number; q: number; swap: boolean }>({
    id: "N6.million-decimal.07",
    node: "N6",
    subtype: "million-decimal",
    form: "compare-a-tenths-decimal-with-a-hundredths-decimal",
    groups: [6, 6],
    answer: "compare",
    draw: (r) => {
      const p = between(r, 2, 9);
      return {
        x: between(r, 0, 20),
        p,
        q: between(r, 1, p - 1),
        swap: r.int(2) === 0,
      };
    },
    solve: (p) => (p.swap ? "<" : ">"),
    reference: (p) => {
      const tenths = p.x * 100 + p.p * 10;
      const hundredths = p.x * 100 + p.q * 10 + 5;
      return p.swap ? signOf(hundredths, tenths) : signOf(tenths, hundredths);
    },
    traps: [
      {
        id: "longer-is-bigger",
        kind: "conceptual",
        wrong: (p) => (p.swap ? ">" : "<"),
      },
    ],
    vars: (p) => {
      const tenths = `${p.x},${p.p}`;
      const hundredths = `${p.x},${p.q}5`;
      return {
        a: p.swap ? hundredths : tenths,
        b: p.swap ? tenths : hundredths,
        sign: p.swap ? "<" : ">",
      };
    },
  }),
  define<{ x: number; y: number }>({
    id: "N6.million-decimal.08",
    node: "N6",
    subtype: "million-decimal",
    form: "how-many-tenths-in-a-decimal",
    groups: [5, 6],
    answer: "integer",
    draw: (r) => ({ x: between(r, 1, 30), y: between(r, 1, 9) }),
    solve: (p) => qi(10 * p.x + p.y),
    reference: (p) => qi(Number(`${p.x}${p.y}`)),
    traps: [
      { id: "wholes-only", kind: "conceptual", wrong: (p) => qi(p.x) },
      { id: "tenths-digit", kind: "conceptual", wrong: (p) => qi(p.y) },
      {
        id: "tenths-of-wholes",
        kind: "conceptual",
        wrong: (p) => qi(10 * p.x),
      },
    ],
    vars: (p) => ({
      n: `${p.x},${p.y}`,
      x: s(p.x),
      y: s(p.y),
      r: s(10 * p.x + p.y),
    }),
    constants: [10],
  }),
  define<{ x: number; y: number }>({
    id: "N6.million-decimal.09",
    node: "N6",
    subtype: "million-decimal",
    form: "the-number-between-two-neighbouring-tenths",
    groups: [6, 7],
    answer: "decimal",
    draw: (r) => ({ x: between(r, 0, 20), y: between(r, 0, 8) }),
    solve: (p) => qHundredths(100 * p.x + 10 * p.y + 5),
    reference: (p) => Q.fromDecimal(`${p.x},${p.y}5`),
    traps: [
      {
        id: "right-tenth",
        kind: "conceptual",
        wrong: (p) => qTenths(10 * p.x + p.y + 1),
      },
      {
        id: "left-end",
        kind: "conceptual",
        wrong: (p) => qTenths(10 * p.x + p.y),
      },
      {
        id: "right-with-five",
        kind: "conceptual",
        wrong: (p) => qHundredths(100 * p.x + 10 * (p.y + 1) + 5),
      },
    ],
    vars: (p) => ({
      a: `${p.x},${p.y}`,
      b: tenthsText(10 * p.x + p.y + 1),
      r: `${p.x},${p.y}5`,
    }),
    constants: [0],
  }),
  define<{ d: number }>({
    id: "N6.million-decimal.10",
    node: "N6",
    subtype: "million-decimal",
    form: "a-given-amount-below-a-million",
    groups: [7, 7],
    answer: "integer",
    draw: (r) => ({ d: between(r, 1, 999) }),
    valid: (p) => p.d !== 500,
    solve: (p) => qi(1_000_000 - p.d),
    reference: (p) => qi(999_999 - p.d + 1),
    traps: [
      {
        id: "borrow-slip",
        kind: "procedural",
        wrong: (p) => qi(999_000 + p.d),
      },
      {
        id: "forgot-one",
        kind: "procedural",
        wrong: (p) => qi(999_999 - p.d),
      },
      {
        id: "wrong-direction",
        kind: "conceptual",
        wrong: (p) => qi(1_000_000 + p.d),
      },
    ],
    vars: (p) => ({
      d: s(p.d),
      r: digits(1_000_000 - p.d),
      w: digits(999_000 + p.d),
    }),
    constants: [1_000_000, 1],
  }),
  define<{ m: number; c: number }>({
    id: "N6.million-decimal.11",
    node: "N6",
    subtype: "million-decimal",
    form: "metres-and-centimetres-to-decimal-metres",
    groups: [6, 6],
    answer: "decimal",
    draw: (r) => ({ m: between(r, 1, 9), c: between(r, 1, 9) }),
    solve: (p) => qHundredths(100 * p.m + p.c),
    reference: (p) => Q.fromDecimal(`${p.m},0${p.c}`),
    traps: [
      {
        id: "tenths-slip",
        kind: "conceptual",
        wrong: (p) => qTenths(10 * p.m + p.c),
      },
      {
        id: "in-centimetres",
        kind: "conceptual",
        wrong: (p) => qi(100 * p.m + p.c),
      },
      {
        id: "thousandths",
        kind: "conceptual",
        wrong: (p) => Q.of(BigInt(1000 * p.m + p.c), 1000n),
      },
    ],
    vars: (p) => ({
      m: s(p.m),
      c: s(p.c),
      r: `${p.m},0${p.c}`,
      w: `${p.m},${p.c}`,
    }),
    constants: [0, 100],
  }),
  define<{ t: number }>({
    id: "N6.million-decimal.12",
    node: "N6",
    subtype: "million-decimal",
    form: "one-tenth-more-than-a-decimal",
    groups: [6, 6],
    answer: "decimal",
    draw: (r) => ({ t: between(r, 11, 98) }),
    valid: (p) => p.t % 10 !== 9,
    solve: (p) => qTenths(p.t + 1),
    reference: (p) => qHundredths(10 * p.t + 10),
    traps: [
      {
        id: "one-hundredth-more",
        kind: "conceptual",
        wrong: (p) => qHundredths(10 * p.t + 1),
      },
      {
        id: "one-whole-more",
        kind: "conceptual",
        wrong: (p) => qTenths(p.t + 10),
      },
    ],
    vars: (p) => ({
      a: tenthsText(p.t),
      r: tenthsText(p.t + 1),
      w: hundredthsText(10 * p.t + 1),
    }),
    constants: [0, 1],
  }),
];

const rounding = <P>(o: {
  id: string;
  form: string;
  groups: readonly [number, number];
  answer?: "integer" | "decimal";
  origin?: { olympiad: string };
  draw: Spec<P>["draw"];
  valid?: Spec<P>["valid"];
  solve: Spec<P>["solve"];
  reference: Spec<P>["reference"];
  traps: Spec<P>["traps"];
  vars: Spec<P>["vars"];
  constants?: readonly number[];
}) =>
  define<P>({
    id: o.id,
    node: "N6",
    subtype: "round-million",
    form: o.form,
    groups: o.groups,
    ...(o.origin ? { origin: o.origin } : {}),
    answer: o.answer ?? "integer",
    draw: o.draw,
    ...(o.valid ? { valid: o.valid } : {}),
    solve: o.solve,
    reference: o.reference,
    ...(o.traps ? { traps: o.traps } : {}),
    vars: o.vars,
    constants: o.constants ?? [5, 10, 100, 1000],
  });

const whole = (
  id: string,
  form: string,
  groups: readonly [number, number],
  lo: number,
  hi: number,
  step: number,
  wrongStep: number,
  wrongId: string,
  cutId: string,
) =>
  rounding<N>({
    id,
    form,
    groups,
    draw: (r) => ({ n: between(r, lo, hi) }),
    valid: (p) => p.n % step !== 0 && !isTie(p.n, step),
    solve: (p) => qi(nearest(p.n, step)),
    reference: (p) =>
      qi(p.n % step > step / 2 ? down(p.n, step) + step : down(p.n, step)),
    traps: [
      { id: cutId, kind: "procedural", wrong: (p) => qi(down(p.n, step)) },
      {
        id: wrongId,
        kind: "conceptual",
        wrong: (p) => qi(nearest(p.n, wrongStep)),
      },
      {
        id: "always-up",
        kind: "conceptual",
        wrong: (p) => qi(down(p.n, step) + step),
      },
    ],
    vars: (p) => ({
      next: s(Math.floor((p.n % step) / (step / 10))),
      n: digits(p.n),
      r: digits(nearest(p.n, step)),
      cut: digits(down(p.n, step)),
      other: digits(nearest(p.n, wrongStep)),
    }),
    constants: [1000, 10_000, 100_000, 1_000_000],
  });

const roundSpecs = [
  whole(
    "N6.round-million.01",
    "nearest-hundred-thousand-of-a-six-digit-number",
    [7, 7],
    100_001,
    999_999,
    100_000,
    10_000,
    "to-ten-thousands",
    "cut-off",
  ),
  whole(
    "N6.round-million.02",
    "nearest-million-of-a-seven-digit-number",
    [7, 7],
    1_000_001,
    9_999_999,
    1_000_000,
    100_000,
    "to-hundred-thousands",
    "cut-off",
  ),
  whole(
    "N6.round-million.03",
    "nearest-hundred-thousand-of-a-seven-digit-number",
    [7, 8],
    1_000_001,
    9_999_999,
    100_000,
    1_000_000,
    "to-millions",
    "cut-off",
  ),
  whole(
    "N6.round-million.04",
    "nearest-thousand-of-a-six-digit-number",
    [7, 7],
    100_001,
    999_999,
    1000,
    100,
    "to-hundreds",
    "cut-off",
  ),
  rounding<{ t: number }>({
    id: "N6.round-million.05",
    form: "decimal-to-the-nearest-whole-number",
    groups: [7, 7],
    draw: (r) => ({ t: between(r, 11, 999) }),
    valid: (p) => p.t % 10 !== 0 && p.t % 10 !== 5,
    solve: (p) => qi(Math.round(p.t / 10)),
    reference: (p) =>
      qi(p.t % 10 > 5 ? Math.floor(p.t / 10) + 1 : Math.floor(p.t / 10)),
    traps: [
      {
        id: "cut-off",
        kind: "procedural",
        wrong: (p) => qi(Math.floor(p.t / 10)),
      },
      {
        id: "always-up",
        kind: "conceptual",
        wrong: (p) => qi(Math.floor(p.t / 10) + 1),
      },
      {
        id: "to-tens",
        kind: "conceptual",
        wrong: (p) => qi(Math.floor((p.t + 50) / 100) * 10),
      },
    ],
    vars: (p) => ({
      last: s(p.t % 10),
      n: tenthsText(p.t),
      r: s(Math.round(p.t / 10)),
      cut: s(Math.floor(p.t / 10)),
    }),
    constants: [5],
  }),
  rounding<{ h: number }>({
    id: "N6.round-million.06",
    form: "hundredths-to-the-nearest-tenth",
    groups: [7, 7],
    answer: "decimal",
    draw: (r) => ({ h: between(r, 101, 9999) }),
    valid: (p) => p.h % 10 !== 0 && p.h % 10 !== 5,
    solve: (p) => qTenths(Math.round(p.h / 10)),
    reference: (p) =>
      qTenths(p.h % 10 > 5 ? Math.floor(p.h / 10) + 1 : Math.floor(p.h / 10)),
    traps: [
      {
        id: "cut-off",
        kind: "procedural",
        wrong: (p) => qTenths(Math.floor(p.h / 10)),
      },
      {
        id: "always-up",
        kind: "conceptual",
        wrong: (p) => qTenths(Math.floor(p.h / 10) + 1),
      },
      {
        id: "to-wholes",
        kind: "conceptual",
        wrong: (p) => qi(Math.floor((p.h + 50) / 100)),
      },
    ],
    vars: (p) => ({
      last: s(p.h % 10),
      n: hundredthsText(p.h),
      r: tenthsText(Math.round(p.h / 10)),
      cut: tenthsText(Math.floor(p.h / 10)),
    }),
    constants: [5],
  }),
  rounding<{ t: number }>({
    id: "N6.round-million.07",
    form: "round-a-decimal-up-to-whole-packs",
    groups: [7, 8],
    draw: (r) => ({ t: between(r, 101, 999) }),
    valid: (p) => p.t % 10 !== 0 && p.t % 10 < 5,
    solve: (p) => qi(Math.floor(p.t / 10) + 1),
    reference: (p) => qi(Math.ceil(p.t / 10)),
    traps: [
      {
        id: "nearest",
        kind: "conceptual",
        wrong: (p) => qi(Math.floor(p.t / 10)),
      },
    ],
    vars: (p) => ({
      n: tenthsText(p.t),
      r: s(Math.floor(p.t / 10) + 1),
      near: s(Math.floor(p.t / 10)),
    }),
    constants: [0],
  }),
  rounding<{ w: number }>({
    id: "N6.round-million.08",
    form: "a-half-in-a-decimal-rounds-up",
    groups: [7, 7],
    draw: (r) => ({ w: between(r, 1, 99) }),
    solve: (p) => qi(p.w + 1),
    reference: (p) => qi(Math.round((10 * p.w + 5) / 10 + 1e-9)),
    traps: [
      { id: "half-down", kind: "conceptual", wrong: (p) => qi(p.w) },
      {
        id: "to-tens",
        kind: "conceptual",
        wrong: (p) => qi(Math.floor((10 * p.w + 55) / 100) * 10),
      },
    ],
    vars: (p) => ({ n: `${p.w},5`, r: s(p.w + 1), down: s(p.w) }),
  }),
  whole(
    "N6.round-million.09",
    "nearest-million-of-an-eight-digit-number",
    [8, 8],
    10_000_001,
    999_999_999,
    1_000_000,
    100_000,
    "to-hundred-thousands",
    "cut-off",
  ),
  rounding<{ q: number }>({
    id: "N6.round-million.10",
    form: "thousandths-to-the-nearest-hundredth",
    groups: [7, 8],
    answer: "decimal",
    draw: (r) => ({ q: between(r, 1001, 99_999) }),
    valid: (p) => p.q % 10 !== 0 && p.q % 10 !== 5,
    solve: (p) => qHundredths(Math.round(p.q / 10)),
    reference: (p) =>
      qHundredths(
        p.q % 10 > 5 ? Math.floor(p.q / 10) + 1 : Math.floor(p.q / 10),
      ),
    traps: [
      {
        id: "cut-off",
        kind: "procedural",
        wrong: (p) => qHundredths(Math.floor(p.q / 10)),
      },
      {
        id: "always-up",
        kind: "conceptual",
        wrong: (p) => qHundredths(Math.floor(p.q / 10) + 1),
      },
      {
        id: "to-tenths",
        kind: "conceptual",
        wrong: (p) => qTenths(Math.floor((p.q + 50) / 100)),
      },
    ],
    vars: (p) => ({
      last: s(p.q % 10),
      n: `${Math.floor(p.q / 1000)},${s(p.q % 1000).padStart(3, "0")}`,
      r: hundredthsText(Math.round(p.q / 10)),
      cut: hundredthsText(Math.floor(p.q / 10)),
    }),
    constants: [0, 5],
  }),
  rounding<{ m: number }>({
    id: "N6.round-million.11",
    form: "largest-whole-number-that-rounds-to-a-round-number-of-thousands",
    groups: [7, 8],
    origin: { olympiad: "rounding-boundary reasoning, RES-4281" },
    draw: (r) => ({ m: pick(r, [2, 3, 5, 7, 12, 25, 40, 99, 250, 999]) }),
    solve: (p) => qi(1000 * p.m + 499),
    reference: (p) => {
      let best = 1000 * p.m;
      for (let x = 1000 * p.m; x <= 1000 * p.m + 1000; x += 1)
        if (nearest(x, 1000) === 1000 * p.m) best = x;
      return qi(best);
    },
    traps: [
      {
        id: "next-round-number",
        kind: "conceptual",
        wrong: (p) => qi(1000 * p.m + 500),
      },
      {
        id: "smallest-instead",
        kind: "conceptual",
        wrong: (p) => qi(1000 * p.m - 500),
      },
      {
        id: "cut-thinking",
        kind: "conceptual",
        wrong: (p) => qi(1000 * p.m + 999),
      },
    ],
    vars: (p) => ({
      n: digits(1000 * p.m),
      r: digits(1000 * p.m + 499),
      w: digits(1000 * p.m + 500),
    }),
    constants: [5, 499, 500, 1000],
  }),
];

export const n6Specs: readonly Spec<never>[] = [...million, ...roundSpecs];
