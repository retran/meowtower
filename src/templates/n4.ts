// Node N4, rounding and estimating (RES-4281). The Dutch goals round to hundreds at group 5, to
// thousands at group 6 and to the accuracy a goal sets at group 7, and they estimate with rounded
// numbers ("ongeveer"). An estimate is checked as a number on a line: right within a stated distance.
// Texts are plain blanks in `content/tasks-n.ru.json`, keyed by the template id.
import { between, digits, qi } from "./draw.js";
import { defineSpec, type Spec } from "./spec.js";
import { formatQ } from "../math/format.js";
import { Q } from "../math/q.js";

const s = String;
/** `n` rounded to the nearest multiple of `step`, a half going up. */
const nearest = (n: number, step: number): number =>
  Math.floor((n + step / 2) / step) * step;
const down = (n: number, step: number): number => Math.floor(n / step) * step;
const up = (n: number, step: number): number => Math.ceil(n / step) * step;

interface N {
  n: number;
}

/** A rounding template: a number is drawn, and the answer, a second route and one trap come from it. */
const rounding = (o: {
  id: string;
  form: string;
  groups: readonly [number, number];
  origin?: { olympiad: string } | { extension: string };
  draw: (r: Parameters<Spec<N>["draw"]>[0]) => number;
  valid?: (n: number) => boolean;
  solve: (n: number) => number;
  reference: (n: number) => number;
  traps: readonly {
    id: string;
    kind: "conceptual" | "procedural";
    wrong: (n: number) => number;
  }[];
  vars?: (n: number) => Record<string, string>;
  constants?: readonly number[];
}) =>
  defineSpec<N>({
    id: o.id,
    node: "N4",
    subtype: "round",
    form: o.form,
    groups: o.groups,
    ...(o.origin ? { origin: o.origin } : {}),
    answer: "integer",
    draw: (r) => ({ n: o.draw(r) }),
    ...(o.valid ? { valid: (p: N) => o.valid?.(p.n) ?? true } : {}),
    solve: (p) => qi(o.solve(p.n)),
    reference: (p) => qi(o.reference(p.n)),
    traps: o.traps.map((t) => ({
      id: t.id,
      kind: t.kind,
      wrong: (p: N) => qi(t.wrong(p.n)),
    })),
    vars: (p) => ({
      n: digits(p.n),
      r: digits(o.solve(p.n)),
      ...(o.vars ? o.vars(p.n) : {}),
      ...Object.fromEntries(
        o.traps.map((t) => [
          `w_${t.id.replace(/-/g, "_")}`,
          digits(t.wrong(p.n)),
        ]),
      ),
    }),
    constants: o.constants ?? [5, 10, 100, 1000],
  });

const roundSpecs = [
  rounding({
    id: "N4.round.01",
    form: "nearest-ten-of-a-two-digit-number",
    groups: [4, 5],
    draw: (r) => between(r, 11, 98),
    valid: (n) => n % 10 !== 0,
    solve: (n) => nearest(n, 10),
    reference: (n) => Math.round(n / 10 + 1e-9) * 10,
    traps: [{ id: "cut-off", kind: "procedural", wrong: (n) => down(n, 10) }],
    vars: (n) => ({ o: s(n % 10) }),
  }),
  rounding({
    id: "N4.round.02",
    form: "nearest-hundred-of-a-three-digit-number",
    groups: [5, 5],
    draw: (r) => between(r, 101, 999),
    valid: (n) => n % 100 !== 0 && n % 100 !== 50,
    solve: (n) => nearest(n, 100),
    reference: (n) =>
      n % 100 >= 50
        ? Math.floor(n / 100) * 100 + 100
        : Math.floor(n / 100) * 100,
    traps: [
      { id: "cut-off", kind: "procedural", wrong: (n) => down(n, 100) },
      { id: "to-tens", kind: "conceptual", wrong: (n) => nearest(n, 10) },
    ],
    vars: (n) => ({ t: s(n % 100) }),
  }),
  rounding({
    id: "N4.round.03",
    form: "nearest-hundred-of-a-four-digit-number",
    groups: [6, 6],
    draw: (r) => between(r, 1001, 9999),
    valid: (n) => n % 100 !== 0 && n % 100 !== 50,
    solve: (n) => nearest(n, 100),
    reference: (n) => Number((Math.round(n / 100 + 1e-9) * 100).toFixed(0)),
    traps: [{ id: "cut-off", kind: "procedural", wrong: (n) => down(n, 100) }],
    vars: (n) => ({ t: s(n % 100) }),
  }),
  rounding({
    id: "N4.round.04",
    form: "nearest-thousand",
    groups: [6, 6],
    draw: (r) => between(r, 1001, 99_999),
    valid: (n) => n % 1000 !== 0 && n % 1000 !== 500,
    solve: (n) => nearest(n, 1000),
    reference: (n) => (n % 1000 >= 500 ? down(n, 1000) + 1000 : down(n, 1000)),
    traps: [
      { id: "cut-off", kind: "procedural", wrong: (n) => down(n, 1000) },
      { id: "to-hundreds", kind: "conceptual", wrong: (n) => nearest(n, 100) },
    ],
    vars: (n) => ({ t: s(n % 1000) }),
  }),
  rounding({
    id: "N4.round.05",
    form: "a-half-rounds-up",
    groups: [5, 6],
    draw: (r) => 100 * between(r, 1, 9) + 50,
    solve: (n) => n + 50,
    reference: (n) => Math.floor(n / 100) * 100 + 100,
    traps: [{ id: "half-down", kind: "conceptual", wrong: (n) => n - 50 }],
    vars: (n) => ({ h: s(n % 100) }),
  }),
  rounding({
    id: "N4.round.06",
    form: "nearest-ten-thousand-by-the-accuracy-of-the-goal",
    groups: [7, 7],
    draw: (r) => between(r, 100_001, 999_999),
    valid: (n) => n % 10_000 !== 0 && n % 10_000 !== 5000,
    solve: (n) => nearest(n, 10_000),
    reference: (n) =>
      n % 10_000 >= 5000 ? down(n, 10_000) + 10_000 : down(n, 10_000),
    traps: [
      {
        id: "nearest-thousand",
        kind: "conceptual",
        wrong: (n) => nearest(n, 1000),
      },
      { id: "round-up", kind: "procedural", wrong: (n) => up(n, 10_000) },
    ],
    vars: () => ({}),
    constants: [1000, 10_000],
  }),
  rounding({
    id: "N4.round.07",
    form: "a-price-to-the-nearest-ten-euro",
    groups: [5, 5],
    draw: (r) => between(r, 11, 199),
    valid: (n) => n % 10 !== 0 && n % 10 !== 5,
    solve: (n) => nearest(n, 10),
    reference: (n) => (n % 10 > 5 ? down(n, 10) + 10 : down(n, 10)),
    traps: [{ id: "cut-off", kind: "procedural", wrong: (n) => down(n, 10) }],
    vars: () => ({}),
  }),
  rounding({
    id: "N4.round.08",
    form: "largest-number-that-rounds-to-a-round-number",
    groups: [5, 6],
    origin: { olympiad: "rounding-boundary reasoning, RES-4281" },
    draw: (r) => 10 * between(r, 2, 99),
    solve: (n) => n + 4,
    reference: (n) => {
      let best = n;
      for (let x = n - 10; x <= n + 10; x += 1)
        if (nearest(x, 10) === n) best = Math.max(best, x);
      return best;
    },
    traps: [
      { id: "next-ten", kind: "conceptual", wrong: (n) => n + 5 },
      { id: "half-way-down", kind: "conceptual", wrong: (n) => n - 5 },
    ],
    vars: () => ({}),
  }),
  rounding({
    id: "N4.round.09",
    form: "round-down-to-hundreds",
    groups: [5, 6],
    draw: (r) => between(r, 150, 999),
    valid: (n) => n % 100 >= 50,
    solve: (n) => down(n, 100),
    reference: (n) => n - (n % 100),
    traps: [
      { id: "nearest", kind: "conceptual", wrong: (n) => nearest(n, 100) },
    ],
    vars: () => ({}),
  }),
  rounding({
    id: "N4.round.10",
    form: "round-up-to-hundreds-for-boxes",
    groups: [5, 6],
    draw: (r) => between(r, 101, 899),
    valid: (n) => n % 100 !== 0 && n % 100 < 50,
    solve: (n) => up(n, 100),
    reference: (n) => (Math.floor(n / 100) + 1) * 100,
    traps: [
      { id: "nearest", kind: "conceptual", wrong: (n) => nearest(n, 100) },
    ],
    vars: () => ({}),
  }),
  rounding({
    id: "N4.round.11",
    form: "smallest-number-that-rounds-to-a-round-number",
    groups: [6, 7],
    origin: { olympiad: "rounding-boundary reasoning, RES-4281" },
    draw: (r) => 100 * between(r, 2, 99),
    solve: (n) => n - 50,
    reference: (n) => {
      let best = n;
      for (let x = n + 100; x >= n - 100; x -= 1)
        if (nearest(x, 100) === n) best = Math.min(best, x);
      return best;
    },
    traps: [
      { id: "one-too-high", kind: "conceptual", wrong: (n) => n - 49 },
      { id: "round-number-itself", kind: "conceptual", wrong: (n) => n },
    ],
    vars: () => ({}),
    constants: [5, 49, 50, 100],
  }),
  rounding({
    id: "N4.round.12",
    form: "nearest-ten-of-a-three-digit-number",
    groups: [4, 5],
    draw: (r) => between(r, 101, 999),
    valid: (n) => n % 10 !== 0,
    solve: (n) => nearest(n, 10),
    reference: (n) => (n % 10 >= 5 ? down(n, 10) + 10 : down(n, 10)),
    traps: [{ id: "cut-off", kind: "procedural", wrong: (n) => down(n, 10) }],
    vars: (n) => ({ o: s(n % 10) }),
  }),
];

const q = (n: number): Q => qi(n);
const fq = (x: Q): string =>
  formatQ(x, { decimal: ",", group: "", mul: "", div: "", minus: "-" });

interface Est {
  a: number;
  b: number;
  c: number;
}

/** An estimate: the exact value is the target, and any entry within `slack` of it is right. */
const estimating = (o: {
  id: string;
  form: string;
  groups: readonly [number, number];
  draw: (r: Parameters<Spec<Est>["draw"]>[0]) => Est;
  valid?: (p: Est) => boolean;
  exact: (p: Est) => Q;
  second: (p: Est) => Q;
  slack: (p: Est) => number;
  trap: { id: string; wrong: (p: Est) => Q };
  vars?: (p: Est) => Record<string, string>;
  constants?: readonly number[];
}) =>
  defineSpec<Est>({
    id: o.id,
    node: "N4",
    subtype: "estimate",
    form: o.form,
    groups: o.groups,
    answer: "line",
    draw: o.draw,
    ...(o.valid ? { valid: o.valid } : {}),
    solve: o.exact,
    reference: o.second,
    within: (p) => qi(o.slack(p)),
    traps: [{ id: o.trap.id, kind: "conceptual", wrong: o.trap.wrong }],
    vars: (p) => ({
      a: digits(p.a),
      b: digits(p.b),
      c: digits(p.c),
      exact: fq(o.exact(p)),
      slack: s(o.slack(p)),
      wrong: fq(o.trap.wrong(p)),
      ...(o.vars ? o.vars(p) : {}),
    }),
    constants: o.constants ?? [10],
  });

const estimateSpecs = [
  estimating({
    id: "N4.estimate.01",
    form: "estimate-a-sum-of-two-numbers",
    groups: [5, 5],
    draw: (r) => ({ a: between(r, 21, 98), b: between(r, 21, 98), c: 0 }),
    exact: (p) => q(p.a + p.b),
    second: (p) => q(p.b + p.a),
    slack: () => 10,
    trap: { id: "one-addend", wrong: (p) => q(Math.max(p.a, p.b)) },
    vars: (p) => ({
      ra: s(nearest(p.a, 10)),
      rb: s(nearest(p.b, 10)),
      rs: s(nearest(p.a, 10) + nearest(p.b, 10)),
    }),
  }),
  estimating({
    id: "N4.estimate.02",
    form: "estimate-a-difference-of-two-numbers",
    groups: [5, 5],
    draw: (r) => ({ a: between(r, 301, 999), b: between(r, 101, 299), c: 0 }),
    exact: (p) => q(p.a - p.b),
    second: (p) => q(p.a + -p.b),
    slack: () => 10,
    trap: { id: "sum-instead", wrong: (p) => q(p.a + p.b) },
    vars: (p) => ({
      ra: s(nearest(p.a, 10)),
      rb: s(nearest(p.b, 10)),
      rs: s(nearest(p.a, 10) - nearest(p.b, 10)),
    }),
    constants: [10],
  }),
  estimating({
    id: "N4.estimate.03",
    form: "estimate-a-product-of-two-digit-and-one-digit",
    groups: [5, 6],
    draw: (r) => ({ a: between(r, 21, 98), b: between(r, 3, 9), c: 0 }),
    exact: (p) => q(p.a * p.b),
    second: (p) =>
      q(Array.from({ length: p.b }, () => p.a).reduce((x, y) => x + y, 0)),
    slack: (p) => 5 * p.b,
    trap: { id: "sum-instead", wrong: (p) => q(p.a + p.b) },
    vars: (p) => ({ ra: s(nearest(p.a, 10)), rs: s(nearest(p.a, 10) * p.b) }),
  }),
  estimating({
    id: "N4.estimate.04",
    form: "estimate-a-product-of-two-two-digit-numbers",
    groups: [6, 6],
    draw: (r) => ({ a: between(r, 21, 79), b: between(r, 21, 79), c: 0 }),
    exact: (p) => q(p.a * p.b),
    second: (p) => q(p.b * p.a),
    slack: (p) => 5 * (p.a + p.b) + 25,
    trap: { id: "ten-times-off", wrong: (p) => q(10 * p.a * p.b) },
    vars: (p) => ({
      ra: s(nearest(p.a, 10)),
      rb: s(nearest(p.b, 10)),
      rs: digits(nearest(p.a, 10) * nearest(p.b, 10)),
    }),
    constants: [10, 25],
  }),
  estimating({
    id: "N4.estimate.05",
    form: "estimate-a-quotient-with-a-one-digit-divisor",
    groups: [6, 6],
    draw: (r) => {
      const b = between(r, 3, 9);
      return { a: b * between(r, 30, 99) + between(r, 1, b - 1), b, c: 0 };
    },
    exact: (p) => q(Math.floor(p.a / p.b)),
    second: (p) => q((p.a - (p.a % p.b)) / p.b),
    slack: (p) => Math.floor(p.a / p.b / 10) + 2,
    trap: { id: "product-instead", wrong: (p) => q(p.a * p.b) },
    vars: (p) => ({ qt: s(Math.floor(p.a / p.b)) }),
    constants: [10, 2],
  }),
  estimating({
    id: "N4.estimate.06",
    form: "estimate-the-total-price-of-several-items",
    groups: [5, 6],
    draw: (r) => ({ a: between(r, 12, 98), b: between(r, 3, 9), c: 0 }),
    exact: (p) => q(p.a * p.b),
    second: (p) => q(p.b * p.a),
    slack: (p) => 5 * p.b,
    trap: { id: "one-item", wrong: (p) => q(p.a) },
    vars: (p) => ({ ra: s(nearest(p.a, 10)), rs: s(nearest(p.a, 10) * p.b) }),
  }),
  estimating({
    id: "N4.estimate.07",
    form: "estimate-a-sum-of-three-numbers",
    groups: [5, 6],
    draw: (r) => ({
      a: between(r, 21, 98),
      b: between(r, 21, 98),
      c: between(r, 21, 98),
    }),
    exact: (p) => q(p.a + p.b + p.c),
    second: (p) => q(p.c + p.b + p.a),
    slack: () => 15,
    trap: { id: "two-addends", wrong: (p) => q(p.a + p.b) },
    vars: (p) => ({
      ra: s(nearest(p.a, 10)),
      rb: s(nearest(p.b, 10)),
      rc: s(nearest(p.c, 10)),
    }),
    constants: [10, 15],
  }),
  estimating({
    id: "N4.estimate.08",
    form: "estimate-the-length-of-a-trip-in-three-legs",
    groups: [6, 6],
    draw: (r) => ({
      a: between(r, 201, 899),
      b: between(r, 201, 899),
      c: between(r, 201, 899),
    }),
    exact: (p) => q(p.a + p.b + p.c),
    second: (p) => q(p.b + p.c + p.a),
    slack: () => 150,
    trap: { id: "forgot-a-leg", wrong: (p) => q(p.a + p.b) },
    vars: (p) => ({
      ra: s(nearest(p.a, 100)),
      rb: s(nearest(p.b, 100)),
      rc: s(nearest(p.c, 100)),
    }),
    constants: [100, 150],
  }),
  estimating({
    id: "N4.estimate.09",
    form: "estimate-how-many-fifties-fit",
    groups: [6, 7],
    draw: (r) => ({ a: between(r, 101, 999), b: 50, c: 0 }),
    exact: (p) => Q.of(BigInt(p.a), 50n),
    second: (p) => Q.fromDecimal((p.a / 50).toFixed(2)),
    slack: () => 1,
    trap: { id: "ten-times-more", wrong: (p) => Q.of(BigInt(p.a), 5n) },
    vars: (p) => ({ near: s(nearest(p.a, 50)), cnt: s(nearest(p.a, 50) / 50) }),
    constants: [1, 50],
  }),
  estimating({
    id: "N4.estimate.10",
    form: "estimate-the-price-of-several-items-costing-just-under-a-round-price",
    groups: [6, 7],
    draw: (r) => ({ a: between(r, 2, 9) * 100 - 1, b: between(r, 3, 9), c: 0 }),
    valid: (p) => Math.abs(p.a * p.b - p.a - 100 * p.b) > 100,
    exact: (p) => Q.of(BigInt(p.a * p.b), 100n),
    second: (p) => Q.fromDecimal(((p.a * p.b) / 100).toFixed(2)),
    slack: () => 1,
    trap: {
      id: "price-plus-count",
      wrong: (p) => Q.of(BigInt(p.a + 100 * p.b), 100n),
    },
    vars: (p) => ({
      price: `${Math.floor(p.a / 100)},${s(p.a % 100).padStart(2, "0")}`,
      round: s(Math.ceil(p.a / 100)),
      rs: s(Math.ceil(p.a / 100) * p.b),
    }),
    constants: [1],
  }),
];

export const n4Specs: readonly Spec<never>[] = [
  ...roundSpecs,
  ...estimateSpecs,
];
