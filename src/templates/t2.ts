// Domain T, part 2: three-step and four-step word problems (RES-4289). The Dutch goals set a chain of operations at the end of
// group 5 and longer chains at groups 7 and 8, with percentages, motion and work. Each text is a plain blank (ADR-0130);
// `roles` names the part each number plays. Texts are in `content/tasks-t.ru.json`. Generated from one table with the strings.
import { calc, of, rg } from "./kitc.js";
import { q, tm } from "./kitf.js";
import { type Spec } from "./spec.js";

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

/** The most pieces that `e` euro buy in small packs (`a` pieces for `b`) and large packs (`c` pieces for `d`), with the packs. */
function bestBuy(
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
): { pieces: number; large: number; small: number } {
  let best = { pieces: 0, large: 0, small: 0 };
  for (let large = 0; large * d <= e; large += 1) {
    const small = Math.floor((e - large * d) / b);
    const pieces = large * c + small * a;
    if (pieces >= best.pieces) best = { pieces, large, small };
  }
  return best;
}

/** The same by the table of the best purchase for every sum of money up to `e`. */
function bestBuyTable(
  a: number,
  b: number,
  c: number,
  d: number,
  e: number,
): number {
  const best = Array.from({ length: e + 1 }, () => 0);
  for (let m = 1; m <= e; m += 1)
    best[m] = Math.max(
      best[m - 1] ?? 0,
      m >= b ? (best[m - b] ?? 0) + a : 0,
      m >= d ? (best[m - d] ?? 0) + c : 0,
    );
  return best[e] ?? 0;
}

const digitsOf = (n: number): number[] => String(n).split("").map(Number);
const digitSum = (n: number): number =>
  digitsOf(n).reduce((sum, x) => sum + x, 0);
const allDifferent = (n: number): boolean =>
  new Set(digitsOf(n)).size === digitsOf(n).length;

/** The largest four-digit number with different digits and a digit sum `s`, by trying numbers from the top. */
function largestDifferent(s: number): number {
  for (let n = 9999; n >= 1000; n -= 1)
    if (allDifferent(n) && digitSum(n) === s) return n;
  return 0;
}
/** The same by choosing the digits one at a time, each as large as the rest can still make the sum. */
function largestByDigits(s: number): number {
  const choose = (
    left: number,
    used: number[],
    rest: number,
  ): number[] | null => {
    if (rest === 0) return left === 0 ? used : null;
    for (let d = 9; d >= 0; d -= 1) {
      if (used.includes(d)) continue;
      const found = choose(left - d, [...used, d], rest - 1);
      if (found) return found;
    }
    return null;
  };
  return Number((choose(s, [], 4) ?? []).join(""));
}
const largestWithSum = (s: number): number => {
  for (let n = 9999; n >= 1000; n -= 1) if (digitSum(n) === s) return n;
  return 0;
};
const smallestDifferent = (s: number): number => {
  for (let n = 1000; n <= 9999; n += 1)
    if (allDifferent(n) && digitSum(n) === s) return n;
  return 0;
};

/** How many ways pay `s` with coins of `a` and `b`, as the number of coins of each kind. */
const ways = (a: number, b: number, s: number): [number, number][] => {
  const found: [number, number][] = [];
  for (let j = 0; j * b <= s; j += 1)
    if ((s - j * b) % a === 0) found.push([(s - j * b) / a, j]);
  return found;
};

const SPEEDS: readonly (readonly [number, number, number])[] = [
  [30, 60, 60],
  [40, 60, 120],
  [60, 120, 120],
  [20, 30, 60],
  [40, 120, 120],
  [60, 90, 180],
  [20, 60, 60],
  [30, 90, 90],
];
const speedPair = (i: number): readonly [number, number, number] =>
  SPEEDS[i] ?? [30, 60, 60];
const UNIT: Readonly<Record<number, number>> = {
  10: 100,
  20: 25,
  25: 16,
  50: 4,
};

const T3_three_step = calc("T3", "three-step");
const T3_three_step_specs: readonly Spec<never>[] = [
  T3_three_step({
    id: "T3.three-step.01",
    form: "the-total-of-three-kinds",
    g: [5, 7],
    kind: "integer",
    p: [rg(2, 6), rg(2, 6), rg(2, 6), rg(2, 6), rg(2, 6), rg(2, 6)],
    ok: (a, b, c, d, e, f) =>
      new Set([a * b, c * d, e * f]).size === 3 &&
      a + c + e !== a * b + c * d + e * f,
    f: (a, b, c, d, e, f) => q(a * b + c * d + e * f),
    t: {
      "two-kinds": (a, b, c, d) => q(a * b + c * d),
      "count-of-groups": (a, b, c, d, e) => q(a + c + e),
      "first-kind": (a, b) => q(a * b),
      "add-all": (a, b, c, d, e, f) => {
        const w = a + b + c + d + e + f;
        return w === a * b + c * d + a + c + e || w === a + c + e || w === a * b
          ? null
          : q(w);
      },
    },
    roles: {
      a: "first groups",
      b: "first in each",
      c: "second groups",
      d: "second in each",
      e: "third groups",
      f: "third in each",
    },
  }),
  T3_three_step({
    id: "T3.three-step.02",
    form: "the-change-after-two-purchases",
    g: [5, 7],
    kind: "integer",
    p: [rg(60, 99), rg(2, 5), rg(3, 9), rg(2, 5), rg(3, 9)],
    ok: (a, b, c, d, e) => a - b * c - d * e > 0 && b * c !== d * e && c !== e,
    f: (a, b, c, d, e) => q(a - b * c - d * e),
    t: {
      "first-purchase": (a, b, c) => q(a - b * c),
      costs: (a, b, c, d, e) => q(b * c + d * e),
      "add-all": (a, b, c, d, e) => {
        const w = a + b + c + d + e;
        return w === b * c + d * e || w === a - b * c ? null : q(w);
      },
    },
    roles: {
      a: "paid",
      b: "first count",
      c: "first price",
      d: "second count",
      e: "second price",
    },
  }),
  T3_three_step({
    id: "T3.three-step.03",
    form: "the-sum-then-the-share-then-the-groups",
    g: [5, 7],
    kind: "integer",
    p: [rg(10, 30), rg(10, 30), rg(2, 6), rg(2, 6)],
    ok: (a, b, c, d) => (a + b) % c === 0 && c !== d,
    f: (a, b, c, d) => q(((a + b) / c) * d),
    t: {
      "one-part": (a, b, c) => q((a + b) / c),
      "no-share": (a, b, c, d) => q((a + b) * d),
      "add-all": (a, b, c, d) => {
        const w = a + b + c + d;
        return w === (a + b) * d || w === (a + b) / c ? null : q(w);
      },
    },
    roles: { a: "start", b: "added", c: "parts", d: "parts taken" },
  }),
  T3_three_step({
    id: "T3.three-step.04",
    form: "the-total-of-three-growing-parts",
    g: [5, 7],
    kind: "integer",
    p: [rg(10, 30), rg(3, 12), rg(3, 12)],
    ok: (a, b, c) => b !== c,
    f: (a, b, c) => q(3 * a + 2 * b + c),
    t: {
      "two-numbers": (a, b) => q(2 * a + b),
      "three-firsts": (a) => q(3 * a),
      "add-all": (a, b, c) => q(a + b + c),
    },
    roles: { a: "first", b: "extra of the second", c: "extra of the third" },
  }),
  T3_three_step({
    id: "T3.three-step.05",
    form: "the-multiple-then-the-sum",
    g: [5, 7],
    kind: "integer",
    p: [rg(3, 9), rg(2, 5), rg(3, 12)],
    ok: (a, b, c) => a + 2 * a * b - c > 0 && b !== c,
    f: (a, b, c) => q(a + a * b + a * b - c),
    t: {
      "no-subtraction": (a, b) => q(a + 2 * a * b),
      "first-only": (a, b, c) => (a - c > 0 ? q(a - c) : null),
      "add-all": (a, b, c) => {
        const w = a + b + c;
        return w === a + 2 * a * b || w === a - c ? null : q(w);
      },
    },
    c: [2],
    roles: { a: "first", b: "factor", c: "removed" },
  }),
  T3_three_step({
    id: "T3.three-step.06",
    form: "the-full-groups-and-their-cost",
    g: [5, 7],
    kind: "integer",
    p: [rg(40, 70), rg(5, 9), rg(2, 6)],
    ok: (a, b, c) => a % b !== 0 && Math.floor(a / b) !== c,
    f: (a, b, c) => q(Math.floor(a / b) * c),
    t: {
      "with-remainder": (a, b, c) => q((Math.floor(a / b) + 1) * c),
      "groups-only": (a, b) => q(Math.floor(a / b)),
      "per-item": (a, b, c) => q(a * c),
    },
    roles: { a: "total", b: "in each group", c: "payment per group" },
  }),
  T3_three_step({
    id: "T3.three-step.07",
    form: "the-difference-then-the-share-then-the-total",
    g: [5, 7],
    kind: "integer",
    p: [rg(40, 80), rg(10, 25), rg(3, 6), rg(2, 9)],
    ok: (a, b, c, d) => (a - b) % c === 0 && a > b && c !== d,
    f: (a, b, c, d) => q((a - b) / c + d),
    t: {
      remainder: (a, b) => q(a - b),
      "before-add": (a, b, c) => q((a - b) / c),
      "add-all": (a, b, c, d) => {
        const w = a + b + c + d;
        return w === a - b ? null : q(w);
      },
    },
    roles: { a: "start", b: "removed", c: "parts", d: "added" },
  }),
  T3_three_step({
    id: "T3.three-step.08",
    form: "the-ages-of-three",
    g: [5, 7],
    kind: "integer",
    p: [rg(35, 45), rg(5, 9), rg(2, 4)],
    ok: (a, b, c) => (a - b) % c === 0 && b !== c,
    f: (a, b, c) => q(a + (a - b) + (a - b) / c),
    t: {
      "two-ages": (a, b) => q(a + (a - b)),
      "first-times-three": (a) => q(3 * a),
      "add-all": (a, b, c) => q(a + b + c),
    },
    roles: { a: "first", b: "younger by", c: "times younger" },
  }),
  T3_three_step({
    id: "T3.three-step.09",
    form: "the-remaining-distance",
    g: [5, 7],
    kind: "integer",
    p: [rg(100, 200), rg(30, 50), rg(2, 3), rg(40, 60), rg(1, 2)],
    ok: (a, b, c, d, e) => a - b * c - d * e > 0 && b !== d,
    f: (a, b, c, d, e) => q(a - b * c - d * e),
    t: {
      "first-leg": (a, b, c) => q(a - b * c),
      travelled: (a, b, c, d, e) => q(b * c + d * e),
      "add-all": (a, b, c, d, e) => {
        const w = a + b + c + d + e;
        return w === b * c + d * e || w === a - b * c ? null : q(w);
      },
    },
    origin: {
      extension: "speed, time and distance, Russian grade 4 (RES-4289)",
    },
    roles: {
      a: "distance",
      b: "first speed",
      c: "first time",
      d: "second speed",
      e: "second time",
    },
  }),
  T3_three_step({
    id: "T3.three-step.10",
    form: "the-cost-after-a-reduction-and-the-share",
    g: [5, 7],
    kind: "integer",
    p: [rg(5, 9), rg(2, 4), rg(2, 5)],
    ok: (a, b, c) => (a * b - c) % 2 === 0 && (a * b) % 2 === 0 && a * b > c,
    f: (a, b, c) => q((a * b - c) / 2),
    t: {
      "total-after-discount": (a, b, c) => q(a * b - c),
      "no-discount": (a, b) => q((a * b) / 2),
      "add-all": (a, b, c) => q(a + b + c),
    },
    c: [2],
    roles: { a: "price", b: "count", c: "discount" },
  }),
  T3_three_step({
    id: "T3.three-step.11",
    form: "the-number-back-through-three-steps",
    g: [5, 7],
    kind: "integer",
    p: [rg(4, 15), rg(3, 12), rg(2, 5), rg(2, 12)],
    f: (a) => q(a),
    alt: (a, b, c, d) => q(((a + b) * c - d + d) / c - b),
    t: {
      "forgot-the-multiplier": (a, b, c, d) => q((a + b) * c - d + d - b),
      "multiplied-again": (a, b, c, d) => q(((a + b) * c - d + d) * c - b),
      "undone-in-order": (a, b, c, d) => {
        const x = (a + b) * c - d;
        return (x - b) % c === 0 && (x - b) / c + d !== a
          ? q((x - b) / c + d)
          : null;
      },
    },
    x: (a, b, c, d) => ({ x: String((a + b) * c - d) }),
    roles: {
      a: "number thought of (hidden)",
      b: "added",
      c: "multiplied by",
      d: "subtracted",
    },
  }),
  T3_three_step({
    id: "T3.three-step.12",
    form: "the-two-digit-numbers-with-a-given-digit-sum",
    g: [5, 7],
    kind: "integer",
    p: [of(4, 5, 6, 7, 8, 9, 10, 11, 12, 13)],
    f: (s) => {
      let count = 0;
      for (let n = 10; n <= 99; n += 1) if (digitSum(n) === s) count += 1;
      return q(count);
    },
    alt: (s) => q(Math.min(s, 19 - s)),
    t: {
      "no-zero-ending": (s) => (s <= 9 ? q(s - 1) : null),
      "unordered-pairs": (s) => {
        let pairs = 0;
        for (let x = 1; x <= 9; x += 1)
          for (let y = x; y <= 9; y += 1) if (x + y === s) pairs += 1;
        return q(pairs);
      },
    },
    origin: { olympiad: "two-digit numbers with a given digit sum (RES-4289)" },
    roles: { a: "digit sum" },
  }),
  T3_three_step({
    id: "T3.three-step.13",
    form: "the-handshakes-of-friends",
    g: [5, 7],
    kind: "integer",
    p: [rg(4, 9)],
    f: (n) => q((n * (n - 1)) / 2),
    alt: (n) =>
      q(
        Array.from({ length: n - 1 }, (_, i) => i + 1).reduce(
          (s, x) => s + x,
          0,
        ),
      ),
    t: {
      "counted-twice": (n) => q(n * (n - 1)),
      "everyone-with-everyone": (n) => q(n * n),
      "one-person": (n) => q(n - 1),
    },
    origin: { olympiad: "counting pairs, handshakes (RES-4289)" },
    roles: { a: "friends" },
  }),
  T3_three_step({
    id: "T3.three-step.14",
    form: "the-total-from-the-prices-of-pairs",
    g: [5, 7],
    kind: "integer",
    p: [rg(2, 9), rg(2, 9), rg(2, 9)],
    ok: (a, b, c) => new Set([a, b, c]).size === 3,
    f: (a, b, c) => q(a + b + c),
    alt: (a, b, c) => q(a + b + (b + c) + (a + c)).div(q(2)),
    t: {
      "not-halved": (a, b, c) => q(2 * (a + b + c)),
      "two-pairs": (a, b, c) => q(a + 2 * b + c),
    },
    x: (a, b, c) => ({ u: String(a + b), v: String(b + c), t: String(a + c) }),
    origin: {
      olympiad: "a total from the sums of pairs, each counted twice (RES-4289)",
    },
    roles: { a: "apple (hidden)", b: "pear (hidden)", c: "plum (hidden)" },
  }),
  T3_three_step({
    id: "T3.three-step.15",
    form: "the-most-pieces-from-two-sizes-of-pack",
    g: [5, 7],
    kind: "integer",
    p: [rg(2, 4), rg(3, 6), rg(6, 10), rg(8, 14), rg(30, 60)],
    ok: (a, b, c, d, e) => {
      if (c <= a || d <= b || a * d >= c * b) return false;
      const best = bestBuy(a, b, c, d, e).pieces;
      const large = Math.floor(e / d);
      const greedy = large * c + Math.floor((e - large * d) / b) * a;
      return greedy !== best && large * c !== best && greedy !== large * c;
    },
    f: (a, b, c, d, e) => q(bestBuy(a, b, c, d, e).pieces),
    alt: (a, b, c, d, e) => q(bestBuyTable(a, b, c, d, e)),
    t: {
      "only-large": (a, b, c, d, e) => q(Math.floor(e / d) * c),
      "large-first": (a, b, c, d, e) => {
        const large = Math.floor(e / d);
        return q(large * c + Math.floor((e - large * d) / b) * a);
      },
      "only-small": (a, b, c, d, e) => {
        const large = Math.floor(e / d);
        const w = Math.floor(e / b) * a;
        return w === large * c ||
          w === large * c + Math.floor((e - large * d) / b) * a
          ? null
          : q(w);
      },
    },
    x: (a, b, c, d, e) => {
      const best = bestBuy(a, b, c, d, e);
      return { ib: String(best.large), jb: String(best.small) };
    },
    origin: {
      olympiad:
        "the most for a sum with two pack sizes, Kangaroo style (RES-4289)",
    },
    roles: {
      a: "pieces in a small pack",
      b: "price of a small pack",
      c: "pieces in a large pack",
      d: "price of a large pack",
      e: "money",
    },
  }),
  T3_three_step({
    id: "T3.three-step.16",
    form: "the-time-to-cut-a-log-into-equal-pieces",
    g: [5, 7],
    kind: "integer",
    p: [rg(3, 9), rg(2, 6), rg(2, 5)],
    f: (a, b, c) => q((a - 1) * c),
    alt: (a, b, c) => q(a * c - c),
    t: {
      "pieces-as-cuts": (a, b, c) => q(a * c),
      "cuts-only": (a) => q(a - 1),
    },
    x: (a, b) => ({ x: String(a * b) }),
    origin: { olympiad: "cuts and pieces of a log (RES-4289)" },
    roles: { a: "pieces", b: "length of a piece", c: "minutes for a cut" },
  }),
  T3_three_step({
    id: "T3.three-step.17",
    form: "the-arrival-time-with-a-stop",
    g: [5, 7],
    kind: "time",
    p: [
      rg(8, 11),
      of(0, 15, 30, 45),
      of(40, 60, 80),
      rg(3, 9),
      of(10, 15, 20, 30),
    ],
    f: (a, b, c, d, e) => {
      const t = a * 60 + b + 15 * d + e;
      return [q(Math.floor(t / 60)), q(t % 60)];
    },
    alt: (a, b, c, d, e) => {
      const ride = ((c * d) / 4 / c) * 60;
      const t = a * 60 + b + ride + e;
      return [q(Math.floor(t / 60)), q(t % 60)];
    },
    t: {
      "no-stop": (a, b, c, d) => {
        const t = a * 60 + b + 15 * d;
        return [q(Math.floor(t / 60)), q(t % 60)];
      },
      "only-the-stop": (a, b, c, d, e) => {
        const t = a * 60 + b + e;
        return [q(Math.floor(t / 60)), q(t % 60)];
      },
    },
    x: (a, b, c, d) => ({ x: String((c * d) / 4), t0: tm(a, b) }),
    origin: {
      extension: "speed, time and distance, Russian grade 4 (RES-4289)",
    },
    roles: {
      a: "departure hour",
      b: "departure minutes",
      c: "speed",
      d: "quarters of an hour on the road (hidden)",
      e: "minutes of the stop",
    },
  }),
  T3_three_step({
    id: "T3.three-step.18",
    form: "the-rest-after-a-part-and-half-of-the-rest",
    g: [5, 7],
    kind: "integer",
    p: [of(3, 4, 5), rg(2, 9)],
    f: (a, b) => q(b * (a - 1)),
    alt: (a, b) => q(2 * a * b - (2 * a * b) / a).div(q(2)),
    t: {
      "half-of-all": (a, b) => q(a * b),
      "one-step-only": (a, b) => q(2 * b * (a - 1)),
      "taken-instead": (a, b) => q(b * (a + 1)),
    },
    x: (a, b) => ({ x: String(2 * a * b) }),
    origin: {
      extension: "fractions of a quantity, Russian grade 3 (RES-4289)",
    },
    roles: { a: "parts in the whole", b: "half of a part (hidden)" },
  }),
];

const T4_four_step = calc("T4", "four-step");
const T4_four_step_specs: readonly Spec<never>[] = [
  T4_four_step({
    id: "T4.four-step.01",
    form: "the-percent-increase-then-the-groups",
    g: [7, 8],
    kind: "integer",
    p: [of(20, 40, 60, 80), of(10, 25, 50), rg(5, 15), of(2, 3, 4, 5)],
    ok: (a, b, c, d) =>
      (a * b) % 100 === 0 &&
      (a + (a * b) / 100 - c) % d === 0 &&
      a + (a * b) / 100 - c > 0 &&
      (a - c) % d === 0,
    f: (a, b, c, d) => q((a + (a * b) / 100 - c) / d),
    t: {
      "before-share": (a, b, c) => q(a + (a * b) / 100 - c),
      "no-percent": (a, b, c, d) => q((a - c) / d),
      "percent-as-number": (a, b, c, d) => {
        const w = (a + b - c) / d;
        return Number.isInteger(w) && w !== (a - c) / d ? q(w) : null;
      },
    },
    c: [100],
    roles: { a: "start", b: "percent", c: "removed", d: "parts" },
  }),
  T4_four_step({
    id: "T4.four-step.02",
    form: "the-distance-left-after-two-travellers",
    g: [7, 8],
    kind: "integer",
    p: [rg(100, 200), rg(20, 40), rg(20, 40), rg(2, 3)],
    ok: (a, b, c, d) => a - (b + c) * d > 0 && b !== c,
    f: (a, b, c, d) => q(a - (b + c) * d),
    t: {
      "closing-distance": (a, b, c, d) => q((b + c) * d),
      "one-train": (a, b, c, d) => q(a - b * d),
      "no-time": (a, b, c) => q(a - b - c),
    },
    origin: {
      extension: "speed, time and distance, Russian grade 4 (RES-4289)",
    },
    roles: { a: "distance", b: "first speed", c: "second speed", d: "time" },
  }),
  T4_four_step({
    id: "T4.four-step.03",
    form: "the-number-before-a-chain-of-operations",
    g: [7, 8],
    kind: "integer",
    p: [rg(3, 12), rg(2, 4), rg(1, 9), rg(2, 4), rg(1, 9)],
    ok: (a, b, c, d, e) =>
      (a * b + c) % d === 0 &&
      (a * b + c) / d - e > 0 &&
      b !== d &&
      (a * b + c) / d - e !== a,
    f: (a) => q(a),
    t: {
      result: (a, b, c, d, e) => q((a * b + c) / d - e),
      "forward-order": (a, b, c) => q(a * b + c),
      "not-inverted": (a, b, c, d, e) => {
        const x = (a * b + c) / d - e;
        const w = ((x - e) * d - c) / b;
        return Number.isInteger(w) &&
          w > 0 &&
          w !== a &&
          w !== x &&
          w !== a * b + c
          ? q(w)
          : null;
      },
    },
    x: (a, b, c, d, e) => ({ x: String((a * b + c) / d - e) }),
    roles: {
      a: "start",
      b: "multiplied by",
      c: "added",
      d: "divided by",
      e: "subtracted",
    },
  }),
  T4_four_step({
    id: "T4.four-step.04",
    form: "the-distance-after-two-fractions-of-the-way",
    g: [7, 8],
    kind: "integer",
    p: [of(200, 400, 800), of(25, 50, 10, 20), of(10, 20, 25, 50)],
    ok: (a, b, c) =>
      (a * (100 - b)) % 100 === 0 &&
      (((a * (100 - b)) / 100) * (100 - c)) % 100 === 0 &&
      a - (a * b) / 100 - (a * c) / 100 !==
        (((a * (100 - b)) / 100) * (100 - c)) / 100 &&
      (a * c) % 100 === 0,
    f: (a, b, c) => q((((a * (100 - b)) / 100) * (100 - c)) / 100),
    t: {
      "after-first": (a, b) => q((a * (100 - b)) / 100),
      "of-the-whole": (a, b, c) => q(a - (a * b) / 100 - (a * c) / 100),
      "first-part": (a, b) => q((a * b) / 100),
    },
    c: [100],
    roles: { a: "distance", b: "first percent", c: "second percent" },
  }),
  T4_four_step({
    id: "T4.four-step.05",
    form: "the-time-to-fill-with-two-pumps",
    g: [7, 8],
    kind: "integer",
    p: [of(6, 10, 15, 20), of(12, 15, 30, 60), rg(2, 4)],
    ok: (a, b, c) => a < b && (a * b) % (a + b) === 0 && a !== c && b !== c,
    f: (a, b, c) => q((c * a * b) / (a + b)),
    t: {
      "sum-of-times": (a, b, c) => q(c * (a + b)),
      "one-pool": (a, b) => q((a * b) / (a + b)),
      "add-all": (a, b, c) => q(a + b + c),
    },
    c: [1],
    origin: { extension: "work and productivity, Russian grade 4 (RES-4289)" },
    roles: { a: "first time", b: "second time", c: "count" },
  }),
  T4_four_step({
    id: "T4.four-step.06",
    form: "the-change-after-a-discount",
    g: [7, 8],
    kind: "integer",
    p: [rg(15, 25), of(10, 20, 25, 50), rg(2, 5), rg(80, 150)],
    ok: (a, b, c, d) =>
      (a * b) % 100 === 0 &&
      d - c * (a - (a * b) / 100) > 0 &&
      d - c * a > 0 &&
      c !== b,
    f: (a, b, c, d) => q(d - c * (a - (a * b) / 100)),
    t: {
      "full-price": (a, b, c, d) => q(d - c * a),
      "discounted-cost": (a, b, c) => q(c * (a - (a * b) / 100)),
      "percent-as-euros": (a, b, c, d) =>
        a <= b ||
        d - c * (a - b) <= 0 ||
        d - c * (a - b) === d - c * (a - (a * b) / 100) ||
        d - c * (a - b) === d - c * a
          ? null
          : q(d - c * (a - b)),
    },
    c: [100],
    roles: { a: "price", b: "discount percent", c: "count", d: "paid" },
  }),
  T4_four_step({
    id: "T4.four-step.07",
    form: "the-age-in-some-years",
    g: [7, 8],
    kind: "integer",
    p: [rg(80, 100), rg(10, 20), rg(10, 20), rg(3, 8)],
    ok: (a, b, c, d) => a - b - c > 0 && b !== c && a - b - c !== d,
    f: (a, b, c, d) => q(a - b - c + d),
    t: {
      now: (a, b, c) => q(a - b - c),
      "no-wait": (a, b, c, d) => q(b + c + d),
      "add-all": (a, b, c, d) => q(a + b + c + d),
    },
    roles: {
      a: "sum of ages",
      b: "first age",
      c: "second age",
      d: "years later",
    },
  }),
  T4_four_step({
    id: "T4.four-step.08",
    form: "the-tickets-and-the-change",
    g: [7, 8],
    kind: "integer",
    p: [rg(2, 4), rg(6, 9), rg(3, 6), rg(1, 3), rg(60, 99)],
    ok: (a, b, c, d, e) => e - a * b - c * (b - d) > 0 && a !== c,
    f: (a, b, c, d, e) => q(e - a * b - c * (b - d)),
    alt: (a, b, c, d, e) => q(e - (a + c) * b + c * d),
    t: {
      "no-discount": (a, b, c, d, e) =>
        e - (a + c) * b > 0 ? q(e - (a + c) * b) : null,
      "discount-as-price": (a, b, c, d, e) =>
        e - a * b - c * d > 0 && c * d !== c * (b - d)
          ? q(e - a * b - c * d)
          : null,
      cost: (a, b, c, d) => q(a * b + c * (b - d)),
    },
    roles: {
      a: "adult count",
      b: "adult price",
      c: "child count",
      d: "discount of a child ticket",
      e: "paid",
    },
  }),
  T4_four_step({
    id: "T4.four-step.09",
    form: "the-time-of-a-trip-there-and-back",
    g: [7, 8],
    kind: "integer",
    p: [of(60, 120, 180, 240), of(20, 30, 40, 60), of(30, 40, 60, 120)],
    ok: (a, b, c) =>
      a % b === 0 &&
      a % c === 0 &&
      b !== c &&
      (2 * a) % ((b + c) / 2) === 0 &&
      (b + c) % 2 === 0 &&
      (2 * a) / ((b + c) / 2) !== a / b + a / c,
    f: (a, b, c) => q(a / b + a / c),
    t: {
      "there-only": (a, b) => q(a / b),
      "distance-over-mean": (a, b, c) => q((2 * a) / ((b + c) / 2)),
      "back-only": (a, b, c) => {
        const w = a / c;
        return w === (2 * a) / ((b + c) / 2) ? null : q(w);
      },
      "add-all": (a, b, c) => {
        const w = a + b + c;
        return w === (2 * a) / ((b + c) / 2) ? null : q(w);
      },
    },
    origin: {
      extension: "speed, time and distance, Russian grade 4 (RES-4289)",
    },
    roles: { a: "distance", b: "speed there", c: "speed back" },
  }),
  T4_four_step({
    id: "T4.four-step.10",
    form: "the-difference-of-two-shares",
    g: [7, 8],
    kind: "integer",
    p: [of(60, 90, 120, 180), of(2, 3), of(4, 5), rg(3, 6)],
    ok: (a, b, c, d) =>
      a % b === 0 && a % c === 0 && a / b > a / c && d !== a / b - a / c,
    f: (a, b, c, d) => q(a / b - a / c + d),
    t: {
      "first-share": (a, b) => q(a / b),
      difference: (a, b, c) => q(a / b - a / c),
      "second-share": (a, b, c) => q(a / c),
    },
    roles: { a: "sum", b: "first parts", c: "second parts", d: "extra" },
  }),
  T4_four_step({
    id: "T4.four-step.11",
    form: "the-points-of-one-zone-from-two-totals",
    g: [7, 8],
    kind: "integer",
    p: [rg(2, 9), rg(2, 9)],
    ok: (a, b) => a > b,
    f: (a) => q(a),
    alt: (a, b) =>
      q(3 * a + 2 * b + (2 * a + 3 * b))
        .div(q(5))
        .add(q(a - b))
        .div(q(2)),
    t: {
      "one-of-each": (a, b) => q(a + b),
      "the-difference": (a, b) => q(a - b),
      "the-other-zone": (a, b) => q(b),
    },
    x: (a, b) => ({ x: String(3 * a + 2 * b), y: String(2 * a + 3 * b) }),
    origin: {
      olympiad:
        "two unknowns from two partial sums, darts (MCCME 2021, RES-4289)",
    },
    roles: {
      a: "points of the first zone (hidden)",
      b: "points of the second zone (hidden)",
    },
  }),
  T4_four_step({
    id: "T4.four-step.12",
    form: "the-sweets-before-two-halvings",
    g: [7, 8],
    kind: "integer",
    p: [rg(1, 4), rg(1, 4), rg(2, 8)],
    ok: (a, b) => a !== b,
    f: (a, b, c) => q(2 * (2 * (c + b) + a)),
    alt: (a, b, c) => q(4 * c + 4 * b + 2 * a),
    t: {
      "ignored-extras": (a, b, c) => q(4 * c),
      "extras-subtracted": (a, b, c) =>
        2 * (c - b) - a > 0 ? q(2 * (2 * (c - b) - a)) : null,
      "one-step-back": (a, b, c) => q(2 * (c + b) + a),
    },
    origin: {
      olympiad: "working backwards through halvings, Kangaroo style (RES-4289)",
    },
    roles: {
      a: "extra of the first giving",
      b: "extra of the second giving",
      c: "left",
    },
  }),
  T4_four_step({
    id: "T4.four-step.13",
    form: "the-fewest-moves-to-level-three-stacks",
    g: [7, 8],
    kind: "integer",
    p: [rg(5, 20), rg(5, 20), rg(5, 20)],
    ok: (a, b, c) =>
      (a + b + c) % 3 === 0 &&
      !(a === b && b === c) &&
      new Set([a, b, c]).size > 1,
    f: (a, b, c) => {
      const m = (a + b + c) / 3;
      return q(Math.max(0, a - m) + Math.max(0, b - m) + Math.max(0, c - m));
    },
    alt: (a, b, c) => {
      const m = (a + b + c) / 3;
      return q(Math.abs(a - m) + Math.abs(b - m) + Math.abs(c - m)).div(q(2));
    },
    t: {
      "all-differences": (a, b, c) => {
        const m = (a + b + c) / 3;
        return q(Math.abs(a - m) + Math.abs(b - m) + Math.abs(c - m));
      },
      "largest-excess": (a, b, c) => q(Math.max(a, b, c) - (a + b + c) / 3),
      "the-average": (a, b, c) => q((a + b + c) / 3),
    },
    x: (a, b, c) => ({ m: String((a + b + c) / 3) }),
    origin: {
      olympiad: "the fewest moves to level stacks, MCCME 2023 (RES-4289)",
    },
    roles: { a: "first stack", b: "second stack", c: "third stack" },
  }),
  T4_four_step({
    id: "T4.four-step.14",
    form: "the-largest-number-with-different-digits-and-a-sum",
    g: [7, 8],
    kind: "integer",
    p: [of(10, 14, 17, 19, 22, 25, 28)],
    f: (s) => q(largestDifferent(s)),
    alt: (s) => q(largestByDigits(s)),
    t: {
      "digits-repeat": (s) => q(largestWithSum(s)),
      "the-smallest": (s) => q(smallestDifferent(s)),
    },
    x: (s) => {
      const [u = 0, v = 0, t = 0, y = 0] = digitsOf(largestDifferent(s));
      return { u: String(u), v: String(v), t: String(t), y: String(y) };
    },
    origin: {
      olympiad:
        "the largest number with a digit sum and different digits (RES-4289)",
    },
    roles: { a: "digit sum" },
  }),
  T4_four_step({
    id: "T4.four-step.15",
    form: "the-multiples-of-one-or-the-other-number",
    g: [7, 8],
    kind: "integer",
    p: [of(2, 3, 4, 5), of(3, 5, 6, 7), of(30, 40, 50, 60, 70, 80, 90, 100)],
    ok: (a, b) => a !== b,
    f: (a, b, c) =>
      q(
        Math.floor(c / a) +
          Math.floor(c / b) -
          Math.floor(c / ((a * b) / gcd(a, b))),
      ),
    alt: (a, b, c) =>
      q(
        Array.from({ length: c }, (_, i) => i + 1).filter(
          (n) => n % a === 0 || n % b === 0,
        ).length,
      ),
    t: {
      "counted-twice": (a, b, c) => q(Math.floor(c / a) + Math.floor(c / b)),
      "only-the-first": (a, b, c) => q(Math.floor(c / a)),
    },
    origin: {
      olympiad:
        "counting multiples of one or the other number, Kangaroo style (RES-4289)",
    },
    roles: { a: "first divisor", b: "second divisor", c: "last number" },
  }),
  T4_four_step({
    id: "T4.four-step.16",
    form: "the-parity-of-the-last-number-on-the-board",
    g: [7, 8],
    kind: "choice",
    p: [rg(5, 40)],
    f: (n) => (((n * (n + 1)) / 2) % 2 === 0 ? "1" : "2"),
    alt: (n) =>
      Array.from({ length: n }, (_, i) => i + 1).reduce((s, x) => s + x, 0) %
        2 ===
      0
        ? "1"
        : "2",
    t: {
      "other-parity": (n) => (((n * (n + 1)) / 2) % 2 === 0 ? "2" : "1"),
      depends: () => "3",
    },
    options: () => ["1", "2", "3"],
    origin: {
      olympiad: "the parity of a sum that moves cannot change (RES-4289)",
    },
    roles: { a: "largest number written" },
  }),
  T4_four_step({
    id: "T4.four-step.17",
    form: "the-ways-to-pay-with-two-kinds-of-coins",
    g: [7, 8],
    kind: "integer",
    p: [of(2, 3), of(5, 7), rg(20, 40)],
    ok: (a, b, c) => {
      const n = ways(a, b, c).length;
      return n >= 2 && n <= 5;
    },
    f: (a, b, c) => q(ways(a, b, c).length),
    alt: (a, b, c) => {
      let n = 0;
      for (let i = 0; i * a <= c; i += 1) if ((c - i * a) % b === 0) n += 1;
      return q(n);
    },
    t: {
      "both-kinds-used": (a, b, c) =>
        q(ways(a, b, c).filter(([i, j]) => i > 0 && j > 0).length),
      "every-value": (a, b, c) => q(Math.floor(c / b) + 1),
    },
    x: (a, b, c) => {
      const list = ways(a, b, c);
      return {
        js: list.map(([, j]) => String(j)).join(", "),
        ones: list.map(() => "1").join(" + "),
      };
    },
    origin: { olympiad: "counting ways to pay with two coins (RES-4289)" },
    roles: { a: "first coin", b: "second coin", c: "sum to pay" },
  }),
  T4_four_step({
    id: "T4.four-step.18",
    form: "the-average-speed-of-a-round-trip",
    g: [7, 8],
    kind: "integer",
    p: [rg(0, 7)],
    f: (i) => {
      const [x, y] = speedPair(i);
      return q(2 * x * y, x + y);
    },
    alt: (i) => {
      const [x, y, z] = speedPair(i);
      return q(2 * z).div(q(z, x).add(q(z, y)));
    },
    t: {
      "the-mean-of-speeds": (i) => {
        const [x, y] = speedPair(i);
        return q(x + y, 2);
      },
      "half-the-answer": (i) => {
        const [x, y] = speedPair(i);
        return (x * y) % (x + y) === 0 ? q((x * y) / (x + y)) : null;
      },
    },
    x: (i) => {
      const [x, y, z] = speedPair(i);
      return { x: String(x), y: String(y), z: String(z) };
    },
    origin: {
      olympiad:
        "the average speed of a round trip is not the mean of two speeds (RES-4289)",
    },
    roles: { a: "pair of speeds (hidden)" },
  }),
  T4_four_step({
    id: "T4.four-step.19",
    form: "the-price-after-a-rise-and-a-fall-by-the-same-percent",
    g: [7, 8],
    kind: "integer",
    p: [of(10, 20, 25, 50), rg(2, 6)],
    f: (a, k) => q((UNIT[a] ?? 0) * k * (100 + a) * (100 - a), 10000),
    alt: (a, k) =>
      q((UNIT[a] ?? 0) * k)
        .mul(q(100 + a, 100))
        .mul(q(100 - a, 100)),
    t: {
      "back-to-the-start": (a, k) => q((UNIT[a] ?? 0) * k),
      "only-the-rise": (a, k) => q(((UNIT[a] ?? 0) * k * (100 + a)) / 100),
    },
    x: (a, k) => ({ x: String((UNIT[a] ?? 0) * k) }),
    c: [100],
    roles: {
      a: "percent of the rise and the fall",
      b: "factor of the price (hidden)",
    },
  }),
  T4_four_step({
    id: "T4.four-step.20",
    form: "the-votes-of-the-third-candidate",
    g: [7, 8],
    kind: "integer",
    p: [
      of(200, 400, 500, 600, 800),
      of(10, 15, 20, 25, 30, 35, 40),
      of(10, 15, 20, 25, 30, 35, 40),
    ],
    ok: (a, b, c) => b !== c && b + c <= 75,
    f: (a, b, c) => q((a * (100 - b - c)) / 100),
    alt: (a, b, c) =>
      q(a)
        .sub(q(a * b, 100))
        .sub(q(a * c, 100)),
    t: {
      "percent-only": (a, b, c) => q(100 - b - c),
      "percent-as-votes": (a, b, c) => q(a - b - c),
    },
    c: [100],
    roles: {
      a: "votes",
      b: "percent for the first",
      c: "percent for the second",
    },
  }),
];

export const tSpecs2: readonly Spec<never>[] = [
  ...T3_three_step_specs,
  ...T4_four_step_specs,
];
