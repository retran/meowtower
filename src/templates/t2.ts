// Domain T, part 2: three-step and four-step word problems (RES-4289). The Dutch goals set a chain of operations at the end of
// group 5 and longer chains at groups 7 and 8, with percentages, motion and work. Each text is a plain blank (ADR-0130);
// `roles` names the part each number plays. Texts are in `content/tasks-t.ru.json`. Generated from one table with the strings.
import { calc, of, rg } from "./kitc.js";
import { q } from "./kitf.js";
import { type Spec } from "./spec.js";

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
    ok: (a, b, c, d, e) => a - b * c - d * e > 0 && b * c !== d * e,
    f: (a, b, c, d, e) => q(a - b * c - d * e),
    t: {
      "first-purchase": (a, b, c) => q(a - b * c),
      costs: (a, b, c, d, e) => q(b * c + d * e),
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
      "first-only": (a, b, c) => q(a - c),
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
    },
    c: [2],
    roles: { a: "price", b: "count", c: "discount" },
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
    },
    c: [1],
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
    p: [rg(2, 4), rg(5, 9), rg(3, 6), rg(3, 6), rg(60, 99)],
    ok: (a, b, c, d, e) => e - a * b - c * d > 0 && a !== c && b !== d,
    f: (a, b, c, d, e) => q(e - a * b - c * d),
    t: {
      "adult-only": (a, b, c, d, e) => q(e - a * b),
      cost: (a, b, c, d) => q(a * b + c * d),
    },
    roles: {
      a: "adult count",
      b: "adult price",
      c: "child count",
      d: "child price",
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
    },
    roles: { a: "sum", b: "first parts", c: "second parts", d: "extra" },
  }),
];

export const tSpecs2: readonly Spec<never>[] = [
  ...T3_three_step_specs,
  ...T4_four_step_specs,
];
