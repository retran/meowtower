// Domain P, part 1: fractions and percentages, and a percentage of a number (RES-4287). The Dutch goals
// name percentages at the end of group 7 and a percentage of a number at group 8; the graph places them a
// year earlier. A percentage answer is the number of percent. Texts are plain blanks in
// `content/tasks-p.ru.json`.
import { Q } from "../math/q.js";
import { between, pick } from "./draw.js";
import { dec, forFraction, fr, q, qd } from "./kitf.js";
import { SIGNS, type Spec } from "./spec.js";

const sign = (x: Q, y: Q): (typeof SIGNS)[number] => SIGNS[x.cmp(y) + 1] ?? "=";
const ordered = (v: readonly Q[]): string[] =>
  v
    .map((x, i) => [x, i] as const)
    .sort((a, b) => a[0].cmp(b[0]) || a[1] - b[1])
    .map(([, i]) => String(i + 1));
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
/** The quotient `n / d` when it is a whole number, or null. */
const exact = (n: number, d: number): Q | null =>
  n % d === 0 ? q(n / d) : null;
const same = (x: string[], y: string[]): boolean => x.join() === y.join();
/** The order of the three numbers of P1.decimal.10 and the orders a child gives by mistake. */
const orders = (p: number, n: number, d: number, h: number) => {
  const right = ordered([qd(p, 2), q(n, d), qd(h, 2)]);
  return {
    reverse: [...right].reverse(),
    plain: ordered([q(p), q(n, d), qd(h, 2)]),
    digits: ordered([q(p), q(d), q(h)]),
  };
};

const p1 = forFraction("P1", "half-tenth");
const halfTenth = [
  p1({
    id: "P1.half-tenth.01",
    form: "one-in-a-number-as-a-fraction",
    groups: [7, 7],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [pick(r, [2, 3, 4, 5, 8, 10])],
    solve: ([d = 0]) => q(1, d),
    ref: ([d = 0]) => q(2, 2 * d),
    traps: [
      ["upside-down", "conceptual", ([d = 0]) => q(d, 1)],
      ["the-others", "conceptual", ([d = 0]) => q(d - 1, d)],
      [
        "against-the-others",
        "conceptual",
        ([d = 0]) => (d === 2 ? null : q(1, d - 1)),
      ],
    ],
    consts: [1],
  }),
  p1({
    id: "P1.half-tenth.02",
    form: "a-simple-fraction-as-a-percentage",
    groups: [7, 7],
    kind: "integer",
    draw: (r) => [between(r, 1, 9), pick(r, [2, 4, 5, 10])],
    valid: ([n = 0, d = 0]) => n < d,
    solve: ([n = 0, d = 0]) => q((100 * n) / d),
    ref: ([n = 0, d = 0]) => q(n, d).mul(q(100)),
    traps: [
      ["numerator-itself", "conceptual", ([n = 0]) => q(n)],
      ["one-part-only", "procedural", ([, d = 0]) => q(100, d)],
    ],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
    consts: [100],
  }),
  p1({
    id: "P1.half-tenth.03",
    form: "one-in-a-number-as-a-percentage",
    groups: [7, 7],
    kind: "integer",
    draw: (r) => [pick(r, [2, 4, 5, 10, 20, 25, 50])],
    solve: ([d = 0]) => q(100 / d),
    ref: ([d = 0]) => q(1, d).mul(q(100)),
    traps: [
      ["denominator-itself", "conceptual", ([d = 0]) => q(d)],
      ["multiplied-by-the-denominator", "procedural", ([d = 0]) => q(100 * d)],
    ],
    consts: [100],
  }),
  p1({
    id: "P1.half-tenth.04",
    form: "a-percentage-of-a-hundred-people",
    groups: [7, 7],
    kind: "integer",
    draw: (r) => [between(r, 11, 89)],
    valid: ([p = 0]) => p !== 50,
    solve: ([p = 0]) => q(p),
    ref: ([p = 0]) => q(p, 100).mul(q(100)),
    traps: [
      ["the-rest", "conceptual", ([p = 0]) => q(100 - p)],
      ["the-whole", "conceptual", () => q(100)],
    ],
    consts: [100],
  }),
  p1({
    id: "P1.half-tenth.05",
    form: "the-rest-in-percent",
    groups: [7, 7],
    kind: "integer",
    draw: (r) => [between(r, 11, 89)],
    valid: ([p = 0]) => p !== 50,
    solve: ([p = 0]) => q(100 - p),
    ref: ([p = 0]) => q(100).sub(q(p)),
    traps: [
      ["the-given-percentage", "conceptual", ([p = 0]) => q(p)],
      ["added", "procedural", ([p = 0]) => q(100 + p)],
    ],
    consts: [100],
  }),
  p1({
    id: "P1.half-tenth.06",
    form: "the-whole-as-a-percentage",
    groups: [7, 7],
    kind: "integer",
    draw: (r) => [between(r, 12, 98)],
    solve: () => q(100),
    ref: ([a = 0]) => q(a).div(q(a)).mul(q(100)),
    traps: [
      ["the-number-itself", "conceptual", ([a = 0]) => q(a)],
      ["the-whole-is-one", "conceptual", () => q(1)],
    ],
    consts: [100],
  }),
  p1({
    id: "P1.half-tenth.07",
    form: "half-of-a-number-as-a-percentage",
    groups: [7, 7],
    kind: "integer",
    draw: (r) => [2 * between(r, 6, 49)],
    solve: () => q(50),
    ref: ([a = 0]) =>
      q(a / 2)
        .div(q(a))
        .mul(q(100)),
    traps: [
      ["half-of-the-number", "conceptual", ([a = 0]) => q(a / 2)],
      ["the-whole", "conceptual", () => q(100)],
      ["two", "conceptual", () => q(2)],
    ],
    extra: ([a = 0]) => ({ h: String(a / 2) }),
    consts: [100, 2],
  }),
  p1({
    id: "P1.half-tenth.08",
    form: "quarters-as-a-percentage",
    groups: [7, 7],
    kind: "integer",
    draw: (r) => [between(r, 1, 7)],
    solve: ([k = 0]) => q(25 * k),
    ref: ([k = 0]) => q(k, 4).mul(q(100)),
    traps: [
      ["numerator-itself", "conceptual", ([k = 0]) => q(k)],
      ["one-quarter-only", "procedural", () => q(25)],
      [
        "denominator-itself",
        "conceptual",
        ([k = 0]) => (k === 4 ? null : q(4)),
      ],
    ],
    extra: ([k = 0]) => ({ f: fr(k, 4) }),
    consts: [100],
  }),
  p1({
    id: "P1.half-tenth.09",
    form: "tenths-as-a-percentage",
    groups: [7, 7],
    kind: "integer",
    draw: (r) => [between(r, 1, 9)],
    solve: ([k = 0]) => q(10 * k),
    ref: ([k = 0]) => q(k, 10).mul(q(100)),
    traps: [
      ["numerator-itself", "conceptual", ([k = 0]) => q(k)],
      ["one-tenth-only", "procedural", () => q(10)],
      ["forgot-the-denominator", "procedural", ([k = 0]) => q(100 * k)],
    ],
    extra: ([k = 0]) => ({ f: fr(k, 10) }),
    consts: [100],
  }),
  p1({
    id: "P1.half-tenth.10",
    form: "fifths-as-a-percentage",
    groups: [7, 7],
    kind: "integer",
    draw: (r) => [between(r, 1, 4)],
    solve: ([k = 0]) => q(20 * k),
    ref: ([k = 0]) => q(k, 5).mul(q(100)),
    traps: [
      ["numerator-itself", "conceptual", ([k = 0]) => q(k)],
      ["one-fifth-only", "procedural", () => q(20)],
      ["forgot-the-denominator", "procedural", ([k = 0]) => q(100 * k)],
    ],
    extra: ([k = 0]) => ({ f: fr(k, 5) }),
    consts: [100],
  }),
  p1({
    id: "P1.half-tenth.11",
    form: "a-share-of-twenty-as-a-percentage",
    groups: [7, 7],
    kind: "integer",
    draw: (r) => [between(r, 1, 19)],
    valid: ([n = 0]) => n !== 10,
    solve: ([n = 0]) => q(5 * n),
    ref: ([n = 0]) => q(n, 20).mul(q(100)),
    traps: [
      ["count-itself", "conceptual", ([n = 0]) => q(n)],
      ["one-student-only", "procedural", ([n = 0]) => (n === 5 ? null : q(5))],
      ["forgot-the-division", "procedural", ([n = 0]) => q(100 * n)],
    ],
    consts: [20, 100],
  }),
  p1({
    id: "P1.half-tenth.12",
    form: "how-many-times-a-percentage-fits-in-the-whole",
    groups: [7, 7],
    kind: "integer",
    draw: (r) => [pick(r, [10, 20, 25, 50])],
    solve: ([p = 0]) => q(100 / p),
    ref: ([p = 0]) => q(100).div(q(p)),
    traps: [
      ["the-percentage-itself", "conceptual", ([p = 0]) => q(p)],
      ["multiplied", "procedural", ([p = 0]) => q(100 * p)],
      ["subtracted", "procedural", ([p = 0]) => (p === 50 ? null : q(100 - p))],
    ],
    consts: [100],
  }),
];

const p1d = forFraction("P1", "decimal");
const OPT_PERCENT = [10, 20, 25, 40, 50, 60, 75];
const decimal = [
  p1d({
    id: "P1.decimal.01",
    form: "a-percentage-as-a-fraction-in-lowest-terms",
    groups: [7, 8],
    kind: "fraction",
    rule: "simplest",
    draw: (r) => [pick(r, [25, 50, 75, 20, 40, 60, 80, 10, 5, 30])],
    solve: ([p = 0]) => q(p, 100),
    ref: ([p = 0]) => q(p / 5, 20),
    traps: [
      ["tenths", "conceptual", ([p = 0]) => q(p, 10)],
      [
        "numerator-only-reduced",
        "procedural",
        ([p = 0]) => q(p / gcd(p, 100), 100),
      ],
      ["one-over-the-percentage", "conceptual", ([p = 0]) => q(1, p)],
    ],
    consts: [10, 100],
  }),
  p1d({
    id: "P1.decimal.02",
    form: "a-percentage-as-a-decimal",
    groups: [7, 8],
    kind: "decimal",
    draw: (r) => [between(r, 11, 89)],
    valid: ([p = 0]) => p % 10 !== 0,
    solve: ([p = 0]) => qd(p, 2),
    ref: ([p = 0]) => q(p).div(q(100)),
    traps: [
      ["tenths", "conceptual", ([p = 0]) => qd(p, 1)],
      ["thousandths", "procedural", ([p = 0]) => qd(p, 3)],
      ["the-number-itself", "conceptual", ([p = 0]) => q(p)],
    ],
    consts: [100],
  }),
  p1d({
    id: "P1.decimal.03",
    form: "a-decimal-as-a-percentage",
    groups: [7, 8],
    kind: "integer",
    draw: (r) => [between(r, 11, 89)],
    valid: ([h = 0]) => h % 10 !== 0,
    solve: ([h = 0]) => q(h),
    ref: ([h = 0]) => qd(h, 2).mul(q(100)),
    traps: [
      ["moved-one-place", "procedural", ([h = 0]) => q(10 * h)],
      ["digits-times-hundred", "procedural", ([h = 0]) => q(100 * h)],
    ],
    extra: ([h = 0]) => ({ x: dec(h, 2) }),
    consts: [100],
  }),
  p1d({
    id: "P1.decimal.04",
    form: "a-fraction-over-twenty-or-fifty-as-a-percentage",
    groups: [7, 8],
    kind: "integer",
    draw: (r) => [between(r, 1, 19), pick(r, [20, 25, 50])],
    valid: ([n = 0, d = 0]) => n < d && (100 * n) % d === 0 && n * 2 !== d,
    solve: ([n = 0, d = 0]) => q((100 * n) / d),
    ref: ([n = 0, d = 0]) => q(n, d).mul(q(100)),
    traps: [
      ["numerator-itself", "conceptual", ([n = 0]) => q(n)],
      [
        "one-part-only",
        "procedural",
        ([n = 0, d = 0]) => (n * d === 100 ? null : q(100, d)),
      ],
      ["forgot-the-division", "procedural", ([n = 0]) => q(100 * n)],
    ],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
    consts: [100],
  }),
  p1d({
    id: "P1.decimal.05",
    form: "a-count-out-of-a-total-as-a-percentage",
    groups: [7, 8],
    kind: "integer",
    draw: (r) => [between(r, 3, 30), pick(r, [20, 25, 40, 50])],
    valid: ([n = 0, t = 0]) => n < t && (100 * n) % t === 0 && 2 * n !== t,
    solve: ([n = 0, t = 0]) => q((100 * n) / t),
    ref: ([n = 0, t = 0]) => q(n).div(q(t)).mul(q(100)),
    traps: [
      ["count-itself", "conceptual", ([n = 0]) => q(n)],
      [
        "one-part-only",
        "procedural",
        ([n = 0, t = 0]) =>
          100 % t !== 0 || n * t === 100 ? null : q(100 / t),
      ],
      ["forgot-the-division", "procedural", ([n = 0]) => q(100 * n)],
    ],
    consts: [100],
  }),
  p1d({
    id: "P1.decimal.06",
    form: "choose-the-notation-equal-to-a-decimal",
    groups: [7, 8],
    kind: "choice",
    draw: (r) => [pick(r, OPT_PERCENT), r.int(4)],
    options: ([p = 0, by = 0]) => {
      const list = [`${p}%`, `${10 * p}%`, `${dec(p, 1, true)}%`, fr(1, p)];
      return list.map((_, i) => list[(i + by) % 4] ?? "");
    },
    valid: ([p = 0]) =>
      new Set([`${p}%`, `${10 * p}%`, `${dec(p, 1, true)}%`, fr(1, p)]).size ===
      4,
    solve: ([p = 0]) => `${p}%`,
    ref: ([p = 0]) => `${(p / 100) * 100}%`,
    traps: [
      ["ten-times-too-big", "conceptual", ([p = 0]) => `${10 * p}%`],
      ["ten-times-too-small", "conceptual", ([p = 0]) => `${dec(p, 1, true)}%`],
      ["unit-fraction", "conceptual", ([p = 0]) => fr(1, p)],
    ],
    extra: ([p = 0]) => ({ x: dec(p, 2) }),
    consts: [100],
  }),
  p1d({
    id: "P1.decimal.07",
    form: "a-percentage-above-one-hundred-as-a-decimal",
    groups: [8, 8],
    kind: "decimal",
    draw: (r) => [pick(r, [110, 120, 125, 150, 175, 200, 250])],
    solve: ([p = 0]) => qd(p, 2),
    ref: ([p = 0]) => q(p).div(q(100)),
    traps: [
      ["tenths", "conceptual", ([p = 0]) => qd(p, 1)],
      ["forgot-the-whole", "conceptual", ([p = 0]) => qd(p - 100, 2)],
      ["thousandths", "procedural", ([p = 0]) => qd(p, 3)],
    ],
    consts: [1, 100],
  }),
  p1d({
    id: "P1.decimal.08",
    form: "two-percentages-added-over-the-same-whole",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [between(r, 11, 49), between(r, 11, 49)],
    valid: ([a = 0, b = 0]) => a !== b,
    solve: ([a = 0, b = 0]) => q(a + b),
    ref: ([a = 0, b = 0]) => q(b).add(q(a)),
    traps: [
      ["multiplied", "procedural", ([a = 0, b = 0]) => q(a * b)],
      ["subtracted", "procedural", ([a = 0, b = 0]) => q(Math.abs(a - b))],
    ],
  }),
  p1d({
    id: "P1.decimal.09",
    form: "compare-a-percentage-with-a-fraction",
    groups: [7, 8],
    kind: "compare",
    draw: (r) => [
      pick(r, [10, 20, 25, 30, 40, 60, 70, 75]),
      1,
      pick(r, [2, 3, 4, 5, 8]),
    ],
    valid: ([p = 0, n = 0, d = 0]) =>
      sign(qd(p, 2), q(n, d)) !== "=" &&
      sign(q(p), q(d)) !== sign(qd(p, 2), q(n, d)),
    solve: ([p = 0, n = 0, d = 0]) => sign(qd(p, 2), q(n, d)),
    ref: ([p = 0, , d = 0]) => (p * d > 100 ? ">" : p * d < 100 ? "<" : "="),
    traps: [
      [
        "numbers-compared-directly",
        "conceptual",
        ([p = 0, , d = 0]) => sign(q(p), q(d)),
      ],
    ],
    extra: ([p = 0, n = 0, d = 0]) => ({
      f: fr(n, d),
      sign: sign(qd(p, 2), q(n, d)),
    }),
  }),
  p1d({
    id: "P1.decimal.10",
    form: "order-a-percentage-a-fraction-and-a-decimal",
    groups: [8, 8],
    kind: "order",
    draw: (r) => [
      pick(r, [30, 35, 45, 55]),
      1,
      pick(r, [3, 4, 5]),
      pick(r, [20, 28, 42, 52, 65]),
    ],
    valid: ([p = 0, n = 0, d = 0, h = 0]) =>
      new Set([p / 100, n / d, h / 100]).size === 3,
    solve: ([p = 0, n = 0, d = 0, h = 0]) =>
      ordered([qd(p, 2), q(n, d), qd(h, 2)]),
    ref: ([p = 0, n = 0, d = 0, h = 0]) => {
      const v = [p / 100, n / d, h / 100];
      return ["1", "2", "3"].sort(
        (x, y) => (v[Number(x) - 1] ?? 0) - (v[Number(y) - 1] ?? 0),
      );
    },
    traps: [
      [
        "largest-first",
        "conceptual",
        ([p = 0, n = 0, d = 0, h = 0]) => orders(p, n, d, h).reverse,
      ],
      [
        "percent-as-a-plain-number",
        "conceptual",
        ([p = 0, n = 0, d = 0, h = 0]) => {
          const o = orders(p, n, d, h);
          return same(o.plain, o.reverse) ? null : o.plain;
        },
      ],
      [
        "digits-only",
        "conceptual",
        ([p = 0, n = 0, d = 0, h = 0]) => {
          const o = orders(p, n, d, h);
          return same(o.digits, o.plain) || same(o.digits, o.reverse)
            ? null
            : o.digits;
        },
      ],
    ],
    extra: ([p = 0, n = 0, d = 0, h = 0]) => ({
      list: [`${p}%`, fr(n, d), dec(h, 2)].join("; "),
      sorted: [
        [p / 100, `${p}%`],
        [n / d, fr(n, d)],
        [h / 100, dec(h, 2)],
      ]
        .sort((a, b) => (a[0] as number) - (b[0] as number))
        .map((x) => x[1])
        .join(" < "),
    }),
  }),
  p1d({
    id: "P1.decimal.11",
    form: "eighths-as-a-percentage",
    groups: [8, 8],
    kind: "decimal",
    draw: (r) => [pick(r, [1, 3, 5, 7])],
    solve: ([n = 0]) => qd(125 * n, 1),
    ref: ([n = 0]) => q(n, 8).mul(q(100)),
    traps: [
      ["numerator-itself", "conceptual", ([n = 0]) => q(n)],
      ["one-eighth-only", "procedural", () => qd(125, 1)],
      ["forgot-the-division", "procedural", ([n = 0]) => q(100 * n)],
    ],
    extra: ([n = 0]) => ({ f: fr(n, 8) }),
    consts: [100],
  }),
  p1d({
    id: "P1.decimal.12",
    form: "every-nth-item-as-a-percentage",
    groups: [7, 8],
    kind: "integer",
    draw: (r) => [pick(r, [2, 4, 5, 10, 20, 25, 50])],
    solve: ([d = 0]) => q(100 / d),
    ref: ([d = 0]) => q(1, d).mul(q(100)),
    traps: [
      ["denominator-itself", "conceptual", ([d = 0]) => q(d)],
      ["multiplied", "procedural", ([d = 0]) => q(100 * d)],
      ["the-rest", "conceptual", ([d = 0]) => q(100 - 100 / d)],
    ],
    consts: [100],
  }),
];

const p2 = forFraction("P2", "percent-of");
const percentOf = [
  p2({
    id: "P2.percent-of.01",
    form: "fifty-percent-of-an-even-number",
    groups: [7, 8],
    kind: "integer",
    draw: (r) => [2 * between(r, 6, 60)],
    solve: ([n = 0]) => q(n / 2),
    ref: ([n = 0]) => q(n).mul(qd(50, 2)),
    traps: [
      ["percentage-as-a-factor", "procedural", ([n = 0]) => q(50 * n)],
      ["divided-by-the-percentage", "procedural", ([n = 0]) => exact(n, 50)],
      ["doubled", "procedural", ([n = 0]) => q(2 * n)],
    ],
    consts: [50, 2],
  }),
  p2({
    id: "P2.percent-of.02",
    form: "twenty-five-percent-of-a-multiple-of-four",
    groups: [7, 8],
    kind: "integer",
    draw: (r) => [4 * between(r, 4, 50)],
    solve: ([n = 0]) => q(n / 4),
    ref: ([n = 0]) => q(n).mul(qd(25, 2)),
    traps: [
      ["half", "conceptual", ([n = 0]) => q(n / 2)],
      ["percentage-as-a-factor", "procedural", ([n = 0]) => q(25 * n)],
      ["divided-by-the-percentage", "procedural", ([n = 0]) => exact(n, 25)],
    ],
    consts: [25, 4],
  }),
  p2({
    id: "P2.percent-of.03",
    form: "ten-percent-of-a-round-number",
    groups: [7, 8],
    kind: "integer",
    draw: (r) => [10 * between(r, 5, 90)],
    solve: ([n = 0]) => q(n / 10),
    ref: ([n = 0]) => q(n).mul(qd(10, 2)),
    traps: [
      ["ten-times", "procedural", ([n = 0]) => q(10 * n)],
      ["one-percent", "conceptual", ([n = 0]) => exact(n, 100)],
      ["the-rest", "conceptual", ([n = 0]) => q((9 * n) / 10)],
    ],
    consts: [10],
  }),
  p2({
    id: "P2.percent-of.04",
    form: "twenty-percent-of-a-multiple-of-five",
    groups: [7, 8],
    kind: "integer",
    draw: (r) => [5 * between(r, 8, 60)],
    solve: ([n = 0]) => q(n / 5),
    ref: ([n = 0]) => q(n).mul(qd(20, 2)),
    traps: [
      ["twenty-times", "procedural", ([n = 0]) => q(20 * n)],
      ["divided-by-the-percentage", "procedural", ([n = 0]) => exact(n, 20)],
      ["the-rest", "conceptual", ([n = 0]) => q((4 * n) / 5)],
    ],
    consts: [20, 5],
  }),
  p2({
    id: "P2.percent-of.05",
    form: "seventy-five-percent-of-a-multiple-of-four",
    groups: [7, 8],
    kind: "integer",
    draw: (r) => [4 * between(r, 4, 40)],
    solve: ([n = 0]) => q((3 * n) / 4),
    ref: ([n = 0]) => q(n).mul(qd(75, 2)),
    traps: [
      ["a-quarter-only", "conceptual", ([n = 0]) => q(n / 4)],
      ["percentage-as-a-factor", "procedural", ([n = 0]) => q(75 * n)],
      ["three-times-the-number", "procedural", ([n = 0]) => q(3 * n)],
    ],
    consts: [75],
  }),
  p2({
    id: "P2.percent-of.06",
    form: "a-percentage-through-one-percent",
    groups: [8, 8],
    kind: "decimal",
    draw: (r) => [pick(r, [15, 30, 35, 45, 60]), 20 * between(r, 2, 10)],
    solve: ([p = 0, n = 0]) => q(p * n, 100),
    ref: ([p = 0, n = 0]) => q(n, 100).mul(q(p)),
    traps: [
      ["one-percent-only", "procedural", ([, n = 0]) => qd(n, 2)],
      ["percentage-as-a-factor", "procedural", ([p = 0, n = 0]) => q(p * n)],
      ["comma-one-place", "procedural", ([p = 0, n = 0]) => qd(p * n, 1)],
    ],
    extra: ([, n = 0]) => ({ o: dec(n, 2, true) }),
    consts: [1, 100],
  }),
  p2({
    id: "P2.percent-of.07",
    form: "one-percent-of-a-number",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [100 * between(r, 2, 50)],
    solve: ([n = 0]) => q(n / 100),
    ref: ([n = 0]) => q(n).mul(qd(1, 2)),
    traps: [
      ["ten-percent", "conceptual", ([n = 0]) => q(n / 10)],
      ["the-number-itself", "conceptual", ([n = 0]) => q(n)],
      ["comma-too-far", "procedural", ([n = 0]) => exact(n, 1000)],
    ],
    consts: [1, 100],
  }),
  p2({
    id: "P2.percent-of.08",
    form: "a-percentage-of-an-amount-of-money",
    groups: [7, 8],
    kind: "integer",
    draw: (r) => [pick(r, [10, 20, 25, 50]), 20 * between(r, 2, 10)],
    solve: ([p = 0, n = 0]) => q((p * n) / 100),
    ref: ([p = 0, n = 0]) => qd(p, 2).mul(q(n)),
    traps: [
      ["percentage-as-a-factor", "procedural", ([p = 0, n = 0]) => q(p * n)],
      [
        "divided-by-the-percentage",
        "procedural",
        ([p = 0, n = 0]) => exact(n, p),
      ],
      ["the-rest", "conceptual", ([p = 0, n = 0]) => q(n - (p * n) / 100)],
    ],
    consts: [100],
  }),
  p2({
    id: "P2.percent-of.09",
    form: "the-whole-from-a-percentage-of-it",
    groups: [8, 8],
    origin: {
      extension: "the whole from its percentage, Russian grade 6 (RES-4287)",
    },
    kind: "integer",
    draw: (r) => [pick(r, [10, 20, 25, 50]), between(r, 3, 24)],
    solve: ([, k = 0]) => q(100 * k),
    ref: ([p = 0, k = 0]) => q(p * k).div(qd(p, 2)),
    traps: [
      [
        "percentage-of-the-part",
        "procedural",
        ([p = 0, k = 0]) =>
          (p * p * k) % 100 === 0 ? q((p * p * k) / 100) : null,
      ],
      [
        "forgot-times-hundred",
        "procedural",
        ([p = 0, k = 0]) => (p === 10 ? null : q(k)),
      ],
      [
        "part-increased",
        "conceptual",
        ([p = 0, k = 0]) => exact(p * k * (100 + p), 100),
      ],
    ],
    extra: ([p = 0, k = 0]) => ({ part: String(p * k) }),
    consts: [1, 100],
  }),
  p2({
    id: "P2.percent-of.10",
    form: "children-in-a-class-who-wear-glasses",
    groups: [7, 8],
    kind: "integer",
    draw: (r) => [pick(r, [10, 20, 25, 50]), 20 * between(r, 1, 3)],
    solve: ([p = 0, n = 0]) => q((p * n) / 100),
    ref: ([p = 0, n = 0]) => q(n).mul(qd(p, 2)),
    traps: [
      ["the-rest", "conceptual", ([p = 0, n = 0]) => q(n - (p * n) / 100)],
      ["percentage-itself", "conceptual", ([p = 0]) => q(p)],
      ["percentage-as-a-factor", "procedural", ([p = 0, n = 0]) => q(p * n)],
    ],
    consts: [100],
  }),
  p2({
    id: "P2.percent-of.11",
    form: "a-discount-in-euros",
    groups: [8, 8],
    kind: "decimal",
    draw: (r) => [pick(r, [15, 30, 35]), 20 * between(r, 2, 6)],
    solve: ([p = 0, n = 0]) => qd(p * n, 2),
    ref: ([p = 0, n = 0]) => q(n).mul(q(p, 100)),
    traps: [
      ["percentage-as-a-factor", "procedural", ([p = 0, n = 0]) => q(p * n)],
      ["price-after", "conceptual", ([p = 0, n = 0]) => q(n).sub(qd(p * n, 2))],
      ["comma-one-place", "procedural", ([p = 0, n = 0]) => qd(p * n, 1)],
    ],
    consts: [100],
  }),
  p2({
    id: "P2.percent-of.12",
    form: "a-percentage-above-one-hundred-of-a-number",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [pick(r, [150, 200, 250]), 4 * between(r, 5, 30)],
    solve: ([p = 0, n = 0]) => q((p * n) / 100),
    ref: ([p = 0, n = 0]) => q(n).mul(qd(p, 2)),
    traps: [
      ["capped-at-the-number", "conceptual", ([, n = 0]) => q(n)],
      ["percentage-as-a-factor", "procedural", ([p = 0, n = 0]) => q(p * n)],
      [
        "only-the-excess",
        "conceptual",
        ([p = 0, n = 0]) => (p === 200 ? null : q((n * (p - 100)) / 100)),
      ],
    ],
    consts: [100],
  }),
];

export const pSpecs1: readonly Spec<never>[] = [
  ...halfTenth,
  ...decimal,
  ...percentOf,
];
