// Node N7, temperatures below zero (level 1F) and ordering numbers (level 1S) (RES-4281). The Dutch
// goals meet negative numbers as temperatures and on the number line from group 7 and order whole
// numbers under 100,000 and decimals from group 6. An order task lists the items; the player's entry
// is the list of their positions, so the answer is a sequence of positions. Texts are plain blanks in
// `content/tasks-n.ru.json`.
import {
  between,
  digits,
  hundredthsText,
  pick,
  qi,
  signed,
  signOf,
  tenthsText,
} from "./draw.js";
import { defineSpec, type Spec } from "./spec.js";

const s = String;
const flip = (sign: "<" | "=" | ">"): "<" | "=" | ">" =>
  sign === "<" ? ">" : sign === ">" ? "<" : "=";

interface T {
  a: number;
  b: number;
  c: number;
}

const temp = <P>(o: {
  id: string;
  form: string;
  groups?: readonly [number, number];
  answer?: "integer" | "compare";
  draw: Spec<P>["draw"];
  valid?: Spec<P>["valid"];
  solve: Spec<P>["solve"];
  reference: Spec<P>["reference"];
  traps: Spec<P>["traps"];
  vars: Spec<P>["vars"];
  constants?: readonly number[];
}) =>
  defineSpec<P>({
    id: o.id,
    node: "N7",
    subtype: "thermometer",
    form: o.form,
    groups: o.groups ?? [6, 7],
    answer: o.answer ?? "integer",
    draw: o.draw,
    ...(o.valid ? { valid: o.valid } : {}),
    solve: o.solve,
    reference: o.reference,
    ...(o.traps ? { traps: o.traps } : {}),
    vars: o.vars,
    constants: o.constants ?? [0],
  });

const thermometer = [
  temp<{ a: number }>({
    id: "N7.thermometer.01",
    form: "a-temperature-below-zero-as-a-number",
    draw: (r) => ({ a: between(r, 1, 25) }),
    solve: (p) => qi(-p.a),
    reference: (p) => qi(0 - p.a),
    traps: [{ id: "no-sign", kind: "conceptual", wrong: (p) => qi(p.a) }],
    vars: (p) => ({ a: s(p.a), r: signed(-p.a) }),
  }),
  temp<{ a: number; d: number }>({
    id: "N7.thermometer.02",
    form: "warmer-than-a-temperature-below-zero",
    draw: (r) => ({ a: between(r, 1, 15), d: between(r, 1, 25) }),
    valid: (p) => p.a !== p.d,
    solve: (p) => qi(p.d - p.a),
    reference: (p) => qi(-p.a + p.d),
    traps: [
      {
        id: "added-magnitudes",
        kind: "procedural",
        wrong: (p) => qi(-(p.a + p.d)),
      },
    ],
    vars: (p) => ({
      a: s(p.a),
      d: s(p.d),
      r: signed(p.d - p.a),
      w: signed(-(p.a + p.d)),
    }),
  }),
  temp<{ t: number; d: number }>({
    id: "N7.thermometer.03",
    form: "colder-than-a-positive-temperature",
    draw: (r) => ({ t: between(r, 1, 15), d: between(r, 2, 30) }),
    valid: (p) => p.d > p.t,
    solve: (p) => qi(p.t - p.d),
    reference: (p) => qi(-(p.d - p.t)),
    traps: [
      {
        id: "positive-result",
        kind: "conceptual",
        wrong: (p) => qi(p.d - p.t),
      },
    ],
    vars: (p) => ({
      t: s(p.t),
      d: s(p.d),
      r: signed(p.t - p.d),
      w: s(p.d - p.t),
    }),
  }),
  temp<{ a: number; b: number }>({
    id: "N7.thermometer.04",
    form: "rise-from-below-zero-to-above-zero",
    draw: (r) => ({ a: between(r, 1, 20), b: between(r, 1, 20) }),
    valid: (p) => p.a !== p.b,
    solve: (p) => qi(p.a + p.b),
    reference: (p) => qi(p.b - -p.a),
    traps: [
      {
        id: "difference-of-numbers",
        kind: "conceptual",
        wrong: (p) => qi(Math.abs(p.b - p.a)),
      },
    ],
    vars: (p) => ({
      a: s(p.a),
      b: s(p.b),
      r: s(p.a + p.b),
      w: s(Math.abs(p.b - p.a)),
    }),
  }),
  temp<{ a: number; b: number }>({
    id: "N7.thermometer.05",
    form: "compare-two-temperatures-below-zero",
    answer: "compare",
    draw: (r) => ({ a: between(r, 1, 30), b: between(r, 1, 30) }),
    valid: (p) => p.a !== p.b,
    solve: (p) => signOf(-p.a, -p.b),
    reference: (p) => (p.a > p.b ? "<" : ">"),
    traps: [
      {
        id: "bigger-number-wins",
        kind: "conceptual",
        wrong: (p) => signOf(p.a, p.b),
      },
    ],
    vars: (p) => ({
      a: s(p.a),
      b: s(p.b),
      sign: signOf(-p.a, -p.b),
      w: flip(signOf(-p.a, -p.b)),
    }),
  }),
  temp<{ v: number[] }>({
    id: "N7.thermometer.06",
    form: "the-coldest-of-four-temperatures",
    draw: (r) => {
      const v = new Set<number>();
      while (v.size < 4) v.add(between(r, -9, 9));
      return { v: [...v] };
    },
    valid: (p) => {
      const min = Math.min(...p.v);
      const far = [...p.v].sort((x, y) => Math.abs(y) - Math.abs(x))[0];
      return min < 0 && far !== min && Math.abs(far ?? 0) !== Math.abs(min);
    },
    solve: (p) => qi(Math.min(...p.v)),
    reference: (p) => qi([...p.v].sort((x, y) => x - y)[0] ?? 0),
    traps: [
      {
        id: "largest-number",
        kind: "conceptual",
        wrong: (p) =>
          qi([...p.v].sort((x, y) => Math.abs(y) - Math.abs(x))[0] ?? 0),
      },
    ],
    vars: (p) => ({
      list: p.v.map(signed).join("; "),
      r: signed(Math.min(...p.v)),
      w: signed([...p.v].sort((x, y) => Math.abs(y) - Math.abs(x))[0] ?? 0),
    }),
  }),
  temp<{ s: number; f: number; u: number }>({
    id: "N7.thermometer.07",
    form: "falls-then-rises",
    draw: (r) => ({
      s: between(r, 1, 10),
      f: between(r, 8, 25),
      u: between(r, 1, 10),
    }),
    valid: (p) => p.s - p.f + p.u !== 0 && p.s - p.f - p.u !== p.s - p.f + p.u,
    solve: (p) => qi(p.s - p.f + p.u),
    reference: (p) => qi(p.s + -p.f + p.u),
    traps: [
      {
        id: "both-down",
        kind: "procedural",
        wrong: (p) => qi(p.s - p.f - p.u),
      },
    ],
    vars: (p) => ({
      s: s(p.s),
      f: s(p.f),
      u: s(p.u),
      r: signed(p.s - p.f + p.u),
      w: signed(p.s - p.f - p.u),
      mid: signed(p.s - p.f),
    }),
  }),
  temp<{ a: number; b: number }>({
    id: "N7.thermometer.08",
    form: "difference-of-two-temperatures-below-zero",
    draw: (r) => ({ a: between(r, 5, 30), b: between(r, 1, 25) }),
    valid: (p) => p.a > p.b,
    solve: (p) => qi(p.a - p.b),
    reference: (p) => qi(-p.b - -p.a),
    traps: [
      {
        id: "added-magnitudes",
        kind: "procedural",
        wrong: (p) => qi(p.a + p.b),
      },
    ],
    vars: (p) => ({ a: s(p.a), b: s(p.b), r: s(p.a - p.b), w: s(p.a + p.b) }),
  }),
  temp<{ a: number }>({
    id: "N7.thermometer.09",
    form: "degrees-to-rise-to-zero",
    draw: (r) => ({ a: between(r, 1, 30) }),
    solve: (p) => qi(p.a),
    reference: (p) => qi(0 - -p.a),
    traps: [
      { id: "negative-answer", kind: "conceptual", wrong: (p) => qi(-p.a) },
    ],
    vars: (p) => ({ a: s(p.a), r: s(p.a), w: signed(-p.a) }),
  }),
  temp<T>({
    id: "N7.thermometer.10",
    form: "range-of-three-temperatures",
    draw: (r) => ({
      a: between(r, -15, -1),
      b: between(r, -5, 12),
      c: between(r, 1, 15),
    }),
    valid: (p) =>
      p.b !== p.a &&
      p.b !== p.c &&
      Math.max(p.b, p.c) + p.a !== Math.max(p.b, p.c) - p.a,
    solve: (p) => qi(Math.max(p.a, p.b, p.c) - Math.min(p.a, p.b, p.c)),
    reference: (p) => {
      const l = [p.a, p.b, p.c].sort((x, y) => x - y);
      return qi((l[2] ?? 0) - (l[0] ?? 0));
    },
    traps: [
      {
        id: "sum-of-extremes",
        kind: "conceptual",
        wrong: (p) => qi(Math.max(p.a, p.b, p.c) + Math.min(p.a, p.b, p.c)),
      },
    ],
    vars: (p) => ({
      a: signed(p.a),
      b: signed(p.b),
      c: signed(p.c),
      r: s(Math.max(p.a, p.b, p.c) - Math.min(p.a, p.b, p.c)),
      w: signed(Math.max(p.a, p.b, p.c) + Math.min(p.a, p.b, p.c)),
      hi: signed(Math.max(p.a, p.b, p.c)),
      lo: signed(Math.min(p.a, p.b, p.c)),
    }),
  }),
  temp<{ t: number; d: number; h: number }>({
    id: "N7.thermometer.11",
    form: "temperature-after-hours-of-falling",
    draw: (r) => ({
      t: between(r, 5, 12),
      d: between(r, 2, 5),
      h: between(r, 3, 6),
    }),
    valid: (p) => p.t - p.d * p.h < 0 && p.t - p.d !== p.t - p.d * p.h,
    solve: (p) => qi(p.t - p.d * p.h),
    reference: (p) =>
      qi(Array.from({ length: p.h }, () => -p.d).reduce((a, b) => a + b, p.t)),
    traps: [
      { id: "one-hour", kind: "procedural", wrong: (p) => qi(p.t - p.d) },
    ],
    vars: (p) => ({
      t: s(p.t),
      d: s(p.d),
      h: s(p.h),
      r: signed(p.t - p.d * p.h),
      w: signed(p.t - p.d),
      f: s(p.d * p.h),
    }),
  }),
];

/** An order task over drawn values; the answer lists the positions in the right order. */
interface V {
  v: number[];
}

const ordering = (o: {
  id: string;
  form: string;
  groups: readonly [number, number];
  origin?: { olympiad: string };
  items: (r: Parameters<Spec<V>["draw"]>[0]) => number[];
  label: (v: number, i: number, all: readonly number[]) => string;
  dir: "asc" | "desc";
  trap: { id: string; order: (v: readonly number[]) => number[] };
  constants?: readonly number[];
}) => {
  const sortIdx = (v: readonly number[], key: (i: number) => number) =>
    v.map((_, i) => i).sort((a, b) => key(a) - key(b) || a - b);
  const correct = (v: readonly number[]): string[] =>
    sortIdx(v, (i) => (o.dir === "asc" ? 1 : -1) * (v[i] ?? 0)).map((i) =>
      s(i + 1),
    );
  return defineSpec<V>({
    id: o.id,
    node: "N7",
    subtype: "order",
    form: o.form,
    groups: o.groups,
    ...(o.origin ? { origin: o.origin } : {}),
    answer: "order",
    draw: (r) => ({ v: o.items(r) }),
    valid: (p) => new Set(p.v).size === p.v.length,
    solve: (p) => correct(p.v),
    reference: (p) => {
      // Insertion sort, a route that shares no code with the key sort above.
      const out: number[] = [];
      p.v.forEach((x, i) => {
        let at = out.length;
        while (
          at > 0 &&
          (o.dir === "asc"
            ? (p.v[out[at - 1] ?? 0] ?? 0) > x
            : (p.v[out[at - 1] ?? 0] ?? 0) < x)
        )
          at -= 1;
        out.splice(at, 0, i);
      });
      return out.map((i) => s(i + 1));
    },
    traps: [
      {
        id: o.trap.id,
        kind: "conceptual",
        wrong: (p) => o.trap.order(p.v).map((i) => s(i + 1)),
      },
    ],
    vars: (p) => {
      const labels = p.v.map((x, i) => o.label(x, i, p.v));
      const order = sortIdx(
        p.v,
        (i) => (o.dir === "asc" ? 1 : -1) * (p.v[i] ?? 0),
      );
      const wrong = o.trap.order(p.v);
      const join = o.dir === "asc" ? " < " : " > ";
      return {
        list: labels.join("; "),
        sorted: order.map((i) => labels[i] ?? "").join(join),
        wrongList: wrong.map((i) => labels[i] ?? "").join(join),
        first: labels[order[0] ?? 0] ?? "",
        last: labels[order[order.length - 1] ?? 0] ?? "",
      };
    },
    constants: o.constants ?? [],
  });
};

const idx = (
  v: readonly number[],
  key: (x: number, i: number) => number | string,
) =>
  v
    .map((_, i) => i)
    .sort((a, b) => {
      const ka = key(v[a] ?? 0, a);
      const kb = key(v[b] ?? 0, b);
      return ka < kb ? -1 : ka > kb ? 1 : a - b;
    });
const draw4 = (
  r: Parameters<Spec<V>["draw"]>[0],
  lo: number,
  hi: number,
  n = 4,
) => {
  const v = new Set<number>();
  while (v.size < n) v.add(between(r, lo, hi));
  return [...v];
};
const decLabel = (h: number): string =>
  h % 10 === 0 ? tenthsText(h / 10) : hundredthsText(h);

const orderSpecs = [
  ordering({
    id: "N7.order.01",
    form: "whole-numbers-from-smallest-to-largest",
    groups: [5, 6],
    items: (r) => draw4(r, 11, 999, 5),
    label: (x) => s(x),
    dir: "asc",
    trap: { id: "largest-first", order: (v) => idx(v, (x) => -x) },
  }),
  ordering({
    id: "N7.order.02",
    form: "numbers-of-both-signs-from-smallest-to-largest",
    groups: [7, 7],
    items: (r) => draw4(r, -20, 20, 5),
    label: (x) => signed(x),
    dir: "asc",
    trap: {
      id: "by-size-without-sign",
      order: (v) => idx(v, (x) => Math.abs(x)),
    },
  }),
  ordering({
    id: "N7.order.03",
    form: "tenths-and-hundredths-from-smallest-to-largest",
    groups: [6, 7],
    items: (r) => {
      const v = new Set<number>();
      while (v.size < 4)
        v.add(r.int(2) === 0 ? 10 * between(r, 1, 9) : between(r, 11, 99));
      return [...v];
    },
    label: (h) => decLabel(h),
    dir: "asc",
    trap: {
      id: "longer-is-bigger",
      order: (v) => idx(v, (h) => Number(decLabel(h).split(",")[1] ?? "0")),
    },
  }),
  ordering({
    id: "N7.order.04",
    form: "numbers-with-different-digit-counts",
    groups: [6, 7],
    items: (r) => {
      const v = [
        between(r, 1000, 9999),
        between(r, 10_000, 99_999),
        between(r, 100, 999),
        between(r, 100_000, 999_999),
      ];
      const k = r.int(4);
      return [...v.slice(k), ...v.slice(0, k)];
    },
    label: (x) => digits(x),
    dir: "asc",
    trap: {
      id: "by-first-digit-as-text",
      order: (v) => idx(v, (x) => String(x)),
    },
  }),
  ordering({
    id: "N7.order.05",
    form: "numbers-of-both-signs-from-largest-to-smallest",
    groups: [7, 7],
    items: (r) => draw4(r, -30, 30, 5),
    label: (x) => signed(x),
    dir: "desc",
    trap: { id: "smallest-first", order: (v) => idx(v, (x) => x) },
  }),
  ordering({
    id: "N7.order.06",
    form: "wholes-and-tenths-mixed",
    groups: [6, 7],
    items: (r) => {
      const v = new Set<number>();
      while (v.size < 5) v.add(between(r, 5, 60));
      return [...v];
    },
    label: (t) => (t % 10 === 0 ? s(t / 10) : tenthsText(t)),
    dir: "asc",
    trap: {
      id: "comma-ignored",
      order: (v) =>
        idx(v, (t) =>
          Number((t % 10 === 0 ? s(t / 10) : tenthsText(t)).replace(",", "")),
        ),
    },
  }),
  ordering({
    id: "N7.order.07",
    form: "numbers-with-the-same-hundreds",
    groups: [5, 6],
    items: (r) => {
      const h = between(r, 1, 9) * 100;
      const v = new Set<number>();
      while (v.size < 5) v.add(h + between(r, 1, 99));
      return [...v];
    },
    label: (x) => s(x),
    dir: "asc",
    trap: { id: "by-last-digit", order: (v) => idx(v, (x) => x % 10) },
  }),
  ordering({
    id: "N7.order.08",
    form: "temperatures-from-coldest-to-warmest",
    groups: [7, 7],
    items: (r) => draw4(r, -25, 15, 5),
    label: (x) => signed(x),
    dir: "asc",
    trap: {
      id: "by-size-without-sign",
      order: (v) => idx(v, (x) => Math.abs(x)),
    },
  }),
  ordering({
    id: "N7.order.09",
    form: "sums-from-smallest-to-largest",
    groups: [5, 6],
    items: (r) => draw4(r, 40, 180, 4),
    label: (x, i, all) => {
      const first = 10 + ((x * 7 + i * 13) % (x - 19));
      void all;
      return `${first} + ${x - first}`;
    },
    dir: "asc",
    trap: {
      id: "by-first-addend",
      order: (v) =>
        idx(v, (x, i) => Number(`${10 + ((x * 7 + i * 13) % (x - 19))}`)),
    },
  }),
  ordering({
    id: "N7.order.10",
    form: "numbers-made-of-the-same-three-digits",
    groups: [5, 6],
    origin: { olympiad: "digit-arrangement ordering, RES-4281" },
    items: (r) => {
      const d = [pick(r, [1, 2, 3]), pick(r, [4, 5, 6]), pick(r, [7, 8, 9])];
      const perms = [
        [0, 1, 2],
        [0, 2, 1],
        [1, 0, 2],
        [1, 2, 0],
        [2, 0, 1],
        [2, 1, 0],
      ].map(
        ([a = 0, b = 0, c = 0]) =>
          100 * (d[a] ?? 0) + 10 * (d[b] ?? 0) + (d[c] ?? 0),
      );
      const skip = r.int(6);
      return perms.filter((_, i) => i !== skip);
    },
    label: (x) => s(x),
    dir: "asc",
    trap: { id: "by-last-digit", order: (v) => idx(v, (x) => x % 10) },
  }),
  ordering({
    id: "N7.order.11",
    form: "decimals-from-largest-to-smallest",
    groups: [6, 7],
    items: (r) => {
      const v = new Set<number>();
      while (v.size < 4) v.add(between(r, 101, 999));
      return [...v];
    },
    label: (h) => hundredthsText(h),
    dir: "desc",
    trap: { id: "smallest-first", order: (v) => idx(v, (x) => x) },
  }),
];

export const n7Specs: readonly Spec<never>[] = [...thermometer, ...orderSpecs];
