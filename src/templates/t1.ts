// Domain T, part 1: one-step and two-step word problems (RES-4289). The Dutch goals set one operation at the end of group 2
// and a combination of operations at the end of group 4. Each text is a plain blank: it states the numbers and what each one
// stands for, with no story, and `roles` names the part each number plays so the story writer can dress it (ADR-0130).
// Texts are in `content/tasks-t.ru.json`. Generated from one table with the strings.
import { calc, of, rg } from "./kitc.js";
import { q, tm, type FVal } from "./kitf.js";
import { type Spec } from "./spec.js";

/** The button number of the calculation at place `k` of the fixed list, when the list is turned by `s`. */
const seat = (k: number, s: number): string => String(((k - s + 4) % 4) + 1);

/** The subtraction a child does digit by digit, taking the smaller units from the larger when the units do not fit. */
const flip = (a: number, b: number): FVal | null =>
  a % 10 >= b % 10
    ? null
    : q((Math.floor(a / 10) - Math.floor(b / 10)) * 10 + ((b % 10) - (a % 10)));
/** Tens and units added one after the other. */
const byTens = (a: number, b: number): FVal =>
  q(Math.floor(a / 10) * 10 + Math.floor(b / 10) * 10 + (a % 10) + (b % 10));
/** Tens and units taken away one after the other. */
const lessByTens = (a: number, b: number): FVal =>
  q(a - Math.floor(b / 10) * 10 - (b % 10));
/** A product as repeated addition. */
const repeated = (a: number, b: number): FVal =>
  q(Array.from({ length: b }, () => a).reduce((s, n) => s + n, 0));

const T1_one_step = calc("T1", "one-step");
const T1_one_step_specs: readonly Spec<never>[] = [
  T1_one_step({
    id: "T1.one-step.01",
    form: "the-total-of-two-parts",
    g: [3, 4],
    kind: "integer",
    p: [rg(5, 60), rg(5, 60)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a + b),
    alt: byTens,
    t: { difference: (a, b) => q(Math.abs(a - b)), "first-part": (a) => q(a) },
    roles: { a: "first part", b: "second part" },
  }),
  T1_one_step({
    id: "T1.one-step.02",
    form: "the-rest-after-taking-away",
    g: [3, 4],
    kind: "integer",
    p: [rg(30, 90), rg(5, 29)],
    f: (a, b) => q(a - b),
    alt: lessByTens,
    t: {
      sum: (a, b) => q(a + b),
      removed: (a, b) => q(b),
      "swapped-units": flip,
    },
    roles: { a: "start", b: "removed" },
  }),
  T1_one_step({
    id: "T1.one-step.03",
    form: "a-number-that-is-more-by-a-given-amount",
    g: [3, 4],
    kind: "integer",
    p: [rg(10, 60), rg(3, 25)],
    ok: (a, b) => a > b,
    f: (a, b) => q(a + b),
    alt: byTens,
    t: { difference: (a, b) => q(a - b), times: (a, b) => q(a * b) },
    roles: { a: "base", b: "increase" },
  }),
  T1_one_step({
    id: "T1.one-step.04",
    form: "a-number-that-is-less-by-a-given-amount",
    g: [3, 4],
    kind: "integer",
    p: [rg(30, 90), rg(3, 25)],
    ok: (a, b) => a % b === 0 && a / b !== a - b,
    f: (a, b) => q(a - b),
    alt: lessByTens,
    t: {
      sum: (a, b) => q(a + b),
      times: (a, b) => q(a / b),
      "swapped-units": flip,
    },
    roles: { a: "base", b: "decrease" },
  }),
  T1_one_step({
    id: "T1.one-step.05",
    form: "the-difference-of-two-numbers",
    g: [3, 4],
    kind: "integer",
    p: [rg(30, 90), rg(5, 29)],
    ok: (a, b) => a % b === 0 && a / b !== a - b,
    f: (a, b) => q(a - b),
    alt: lessByTens,
    t: {
      sum: (a, b) => q(a + b),
      times: (a, b) => q(a / b),
      "swapped-units": flip,
    },
    roles: { a: "larger", b: "smaller" },
  }),
  T1_one_step({
    id: "T1.one-step.06",
    form: "the-total-of-equal-groups",
    g: [3, 4],
    kind: "integer",
    p: [rg(3, 9), rg(3, 9)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a * b),
    alt: repeated,
    t: { sum: (a, b) => q(a + b), difference: (a, b) => q(Math.abs(a - b)) },
    roles: { a: "groups", b: "in each group" },
  }),
  T1_one_step({
    id: "T1.one-step.07",
    form: "the-size-of-each-equal-share",
    g: [3, 4],
    kind: "integer",
    p: [rg(3, 9), rg(3, 9)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(b),
    alt: (a, b) => q(a * b).div(q(a)),
    t: { total: (a, b) => q(a * b), parts: (a) => q(a) },
    x: (a, b) => ({ x: String(a * b) }),
    roles: { a: "parts", b: "in each part" },
  }),
  T1_one_step({
    id: "T1.one-step.08",
    form: "the-number-of-equal-groups",
    g: [3, 4],
    kind: "integer",
    p: [rg(3, 9), rg(3, 9)],
    ok: (a, b) => a !== b,
    f: (a) => q(a),
    alt: (a, b) => q(a * b).div(q(b)),
    t: { total: (a, b) => q(a * b), "in-a-group": (a, b) => q(b) },
    x: (a, b) => ({ x: String(a * b) }),
    roles: { a: "groups", b: "in each group" },
  }),
  T1_one_step({
    id: "T1.one-step.09",
    form: "a-number-that-is-several-times-more",
    g: [3, 4],
    kind: "integer",
    p: [rg(3, 12), rg(2, 9)],
    ok: (a, b) => a % b === 0 && a !== b,
    f: (a, b) => q(a * b),
    alt: repeated,
    t: { sum: (a, b) => q(a + b), division: (a, b) => q(a / b) },
    roles: { a: "base", b: "factor" },
  }),
  T1_one_step({
    id: "T1.one-step.10",
    form: "how-many-times-more",
    g: [3, 4],
    kind: "integer",
    p: [rg(3, 12), rg(2, 9)],
    ok: (a, b) => a !== b && a * b - a !== b,
    f: (a, b) => q(b),
    alt: (a, b) => q(a * b).div(q(a)),
    t: { difference: (a, b) => q(a * b - a), second: (a, b) => q(a * b) },
    x: (a, b) => ({ x: String(a * b) }),
    roles: { a: "smaller", b: "ratio" },
  }),
  T1_one_step({
    id: "T1.one-step.11",
    form: "the-cost-of-several-items",
    g: [3, 4],
    kind: "integer",
    p: [rg(2, 9), rg(2, 9)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a * b),
    alt: repeated,
    t: { sum: (a, b) => q(a + b), price: (a) => q(a) },
    roles: { a: "price", b: "count" },
  }),
  T1_one_step({
    id: "T1.one-step.12",
    form: "the-change-from-a-payment",
    g: [3, 4],
    kind: "integer",
    p: [rg(20, 50), rg(5, 19)],
    f: (a, b) => q(a - b),
    alt: lessByTens,
    t: {
      sum: (a, b) => q(a + b),
      cost: (a, b) => q(b),
      "swapped-units": flip,
    },
    roles: { a: "paid", b: "cost" },
  }),
  T1_one_step({
    id: "T1.one-step.13",
    form: "the-number-to-add",
    g: [3, 4],
    kind: "integer",
    p: [rg(10, 40), rg(41, 90)],
    f: (a, b) => q(b - a),
    alt: (a, b) => lessByTens(b, a),
    t: {
      sum: (a, b) => q(a + b),
      start: (a) => q(a),
      "swapped-units": (a, b) => flip(b, a),
    },
    roles: { a: "start", b: "end" },
  }),
  T1_one_step({
    id: "T1.one-step.14",
    form: "the-number-at-the-start",
    g: [3, 4],
    kind: "integer",
    p: [rg(5, 30), rg(5, 30)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a + b),
    alt: byTens,
    t: {
      difference: (a, b) => q(Math.abs(a - b)),
      removed: (a) => q(a),
      left: (a, b) => q(b),
    },
    roles: { a: "removed", b: "left" },
  }),
  T1_one_step({
    id: "T1.one-step.15",
    form: "a-number-the-question-does-not-need",
    g: [3, 4],
    kind: "integer",
    p: [rg(2, 9), rg(2, 9), rg(60, 99)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a * b),
    alt: repeated,
    t: {
      "money-in-purse": (a, b, c) => q(c),
      "extra-number-used": (a, b, c) => (c > a * b ? q(c - a * b) : null),
      "all-numbers-added": (a, b, c) => q(a + b + c),
    },
    roles: { a: "price", b: "count", c: "money in the purse, not needed" },
  }),
  T1_one_step({
    id: "T1.one-step.16",
    form: "a-number-that-is-several-times-less",
    g: [3, 4],
    kind: "integer",
    p: [rg(2, 9), rg(2, 9)],
    ok: (a, b) => a !== b,
    f: (a) => q(a),
    alt: (a, b) => q(a * b).div(q(b)),
    t: {
      difference: (a, b) => q(a * b - b),
      product: (a, b) => q(a * b * b),
      "the-factor": (a, b) => q(b),
    },
    x: (a, b) => ({ x: String(a * b) }),
    roles: { a: "smaller", b: "factor" },
  }),
  T1_one_step({
    id: "T1.one-step.17",
    form: "the-remainder-of-a-sharing",
    g: [4, 5],
    kind: "integer",
    p: [rg(20, 80), rg(4, 9)],
    ok: (a, b) => a % b !== 0,
    f: (a, b) => q(a % b),
    alt: (a, b) => q(a - b * Math.floor(a / b)),
    t: {
      "full-groups": (a, b) => q(Math.floor(a / b)),
      "minus-one-group": (a, b) => q(a - b),
      "short-of-a-group": (a, b) =>
        b - (a % b) === a % b ? null : q(b - (a % b)),
    },
    origin: {
      extension: "division with a remainder, Russian grade 3 (RES-4289)",
    },
    roles: { a: "total", b: "in each group" },
  }),
  T1_one_step({
    id: "T1.one-step.18",
    form: "the-boxes-needed-for-all-the-things",
    g: [4, 5],
    kind: "integer",
    p: [rg(20, 70), rg(4, 9)],
    ok: (a, b) => a % b !== 0,
    f: (a, b) => q(Math.ceil(a / b)),
    alt: (a, b) => q(Math.floor((a + b - 1) / b)),
    t: {
      "quotient-only": (a, b) => q(Math.floor(a / b)),
      "remainder-added": (a, b) => q(Math.floor(a / b) + (a % b)),
    },
    roles: { a: "things", b: "capacity of a box" },
  }),
  T1_one_step({
    id: "T1.one-step.19",
    form: "the-most-things-for-a-sum-of-money",
    g: [4, 5],
    kind: "integer",
    p: [rg(3, 9), rg(20, 60)],
    ok: (a, b) => b % a !== 0,
    f: (a, b) => q(Math.floor(b / a)),
    alt: (a, b) => q((b - (b % a)) / a),
    t: {
      "rounded-up": (a, b) => q(Math.floor(b / a) + 1),
      "left-over-money": (a, b) => q(b % a),
    },
    roles: { a: "price", b: "money" },
  }),
  T1_one_step({
    id: "T1.one-step.20",
    form: "the-price-of-one-of-equal-things",
    g: [3, 4],
    kind: "integer",
    p: [rg(2, 9), rg(3, 9)],
    ok: (a, b) => a !== b,
    f: (a) => q(a),
    alt: (a, b) => q(a * b).div(q(b)),
    t: { total: (a, b) => q(a * b), count: (a, b) => q(b) },
    x: (a, b) => ({ x: String(a * b) }),
    roles: { a: "price of one", b: "count" },
  }),
  T1_one_step({
    id: "T1.one-step.21",
    form: "one-part-of-a-quantity",
    g: [4, 5],
    kind: "integer",
    p: [rg(2, 9), of(2, 3, 4, 5, 10)],
    ok: (a, b) => a !== b,
    f: (a) => q(a),
    alt: (a, b) => q(a * b).div(q(b)),
    t: {
      "the-rest": (a, b) => q(a * b - a),
      "times-the-denominator": (a, b) => q(a * b * b),
      "the-denominator": (a, b) => q(b),
    },
    x: (a, b) => ({ x: String(a * b) }),
    c: [1],
    origin: {
      extension: "unit fractions of a quantity, Russian grade 3 (RES-4289)",
    },
    roles: { a: "one part", b: "parts in the whole" },
  }),
  T1_one_step({
    id: "T1.one-step.22",
    form: "the-gaps-between-posts-in-a-row",
    g: [3, 4],
    kind: "integer",
    p: [rg(5, 15)],
    f: (a) => q(a - 1),
    alt: (a) =>
      q(Array.from({ length: a }, (_, i) => i + 1).filter((i) => i < a).length),
    t: { "same-count": (a) => q(a), "one-more": (a) => q(a + 1) },
    c: [1],
    origin: {
      olympiad: "posts and gaps in a row, a fence-post count (RES-4289)",
    },
    roles: { a: "posts" },
  }),
  T1_one_step({
    id: "T1.one-step.23",
    form: "the-length-of-a-row-from-two-places",
    g: [4, 5],
    kind: "integer",
    p: [rg(3, 12), rg(3, 12)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a + b - 1),
    alt: (a, b) => q(a - 1 + (b - 1) + 1),
    t: {
      "counted-twice": (a, b) => q(a + b),
      "both-others-only": (a, b) => q(a + b - 2),
    },
    c: [1],
    origin: { olympiad: "a place counted from both ends of a row (RES-4289)" },
    roles: { a: "place from the start", b: "place from the end" },
  }),
  T1_one_step({
    id: "T1.one-step.24",
    form: "the-gap-in-age-that-does-not-change",
    g: [4, 5],
    kind: "integer",
    p: [rg(25, 40), rg(5, 15), rg(2, 9)],
    f: (a, b) => q(a - b),
    alt: (a, b, c) => q(a + c - (b + c)),
    t: {
      grows: (a, b, c) => q(a - b + c),
      shrinks: (a, b, c) => q(a - b - c),
      "first-later": (a, b, c) => q(a + c),
    },
    origin: {
      olympiad: "a difference that stays the same over time (RES-4289)",
    },
    roles: { a: "first age", b: "second age", c: "years later" },
  }),
  T1_one_step({
    id: "T1.one-step.25",
    form: "choose-the-calculation-for-equal-groups",
    g: [3, 4],
    kind: "choice",
    p: [rg(3, 9), rg(3, 9), rg(0, 3)],
    ok: (a, b) => a > b,
    f: (a, b, s) => seat(0, s),
    alt: (a, b, s) =>
      String(
        [0, 1, 2, 3]
          .map((i) => ["×", "+", "−", ":"][(i + s) % 4])
          .indexOf("×") + 1,
      ),
    t: {
      add: (a, b, s) => seat(1, s),
      subtract: (a, b, s) => seat(2, s),
      divide: (a, b, s) => seat(3, s),
    },
    options: () => ["1", "2", "3", "4"],
    x: (a, b, s) => {
      const list = [`${a} × ${b}`, `${a} + ${b}`, `${a} − ${b}`, `${a} : ${b}`];
      return Object.fromEntries(
        [0, 1, 2, 3].map((i) => [`o${i + 1}`, list[(i + s) % 4] ?? ""]),
      );
    },
    roles: { a: "groups", b: "in each group" },
  }),
];

/** The five levels of the water graph: a first level and four rises. */
const levels = (b: number, ...rises: number[]): number[] =>
  rises.reduce<number[]>(
    (out, r) => [...out, (out[out.length - 1] ?? b) + r],
    [b],
  );

const T2_two_step = calc("T2", "two-step");
const T2_two_step_specs: readonly Spec<never>[] = [
  T2_two_step({
    id: "T2.two-step.01",
    form: "the-sum-then-the-rest",
    g: [4, 5],
    kind: "integer",
    p: [rg(20, 50), rg(10, 30), rg(5, 25)],
    f: (a, b, c) => q(a + b - c),
    alt: (a, b, c) => q(a - c + b),
    t: {
      "add-all": (a, b, c) => q(a + b + c),
      "one-step-less": (a, b) => q(a + b),
      "no-addition": (a, b, c) => (a - c > 0 ? q(a - c) : null),
    },
    roles: { a: "start", b: "added", c: "removed" },
  }),
  T2_two_step({
    id: "T2.two-step.02",
    form: "the-total-of-two-kinds-of-groups",
    g: [4, 5],
    kind: "integer",
    p: [rg(2, 6), rg(2, 6), rg(2, 6), rg(2, 6)],
    ok: (a, b, c, d) => a * b !== c * d && a * b * c * d !== a * b + c * d,
    f: (a, b, c, d) => q(a * b + c * d),
    alt: (a, b, c, d) =>
      q(
        [
          ...Array.from({ length: a }, () => b),
          ...Array.from({ length: c }, () => d),
        ].reduce((s, n) => s + n, 0),
      ),
    t: {
      "first-kind": (a, b) => q(a * b),
      "all-times": (a, b, c, d) => q(a * b * c * d),
      "add-all": (a, b, c, d) =>
        a + b + c + d === a * b || a + b + c + d === a * b * c * d
          ? null
          : q(a + b + c + d),
    },
    roles: {
      a: "first groups",
      b: "first in each",
      c: "second groups",
      d: "second in each",
    },
  }),
  T2_two_step({
    id: "T2.two-step.03",
    form: "the-total-minus-equal-groups",
    g: [4, 5],
    kind: "integer",
    p: [rg(2, 8), rg(3, 9), rg(2, 20)],
    ok: (a, b, c) => a !== b && c >= b,
    f: (a) => q(a),
    alt: (a, b, c) => {
      let n = 0;
      for (let v = a * b + c; v > c; v -= b) n++;
      return q(n);
    },
    t: {
      taken: (a, b) => q(a * b),
      "each-time": (a, b) => q(b),
      "total-over-size": (a, b, c) => q(Math.floor((a * b + c) / b)),
    },
    x: (a, b, c) => ({ x: String(a * b + c) }),
    roles: { a: "times taken", b: "taken each time", c: "left" },
  }),
  T2_two_step({
    id: "T2.two-step.04",
    form: "the-first-and-the-second-that-is-more",
    g: [4, 5],
    kind: "integer",
    p: [rg(10, 40), rg(3, 20)],
    f: (a, b) => q(2 * a + b),
    alt: (a, b) => q(2 * (a + b) - b),
    t: {
      "second-only": (a, b) => q(a + b),
      "twice-first": (a) => q(2 * a),
      "extra-only": (a, b) => (b === 2 * a ? null : q(b)),
    },
    roles: { a: "first", b: "extra of the second" },
  }),
  T2_two_step({
    id: "T2.two-step.05",
    form: "the-difference-of-a-number-and-its-multiple",
    g: [4, 5],
    kind: "integer",
    p: [rg(3, 12), rg(2, 6)],
    ok: (a, b) => a * (b - 1) !== a,
    f: (a, b) => q(a * (b - 1)),
    alt: (a, b) =>
      q(Array.from({ length: b - 1 }, () => a).reduce((s, n) => s + n, 0)),
    t: {
      second: (a, b) => q(a * b),
      first: (a) => q(a),
      added: (a, b) => q(a + b),
    },
    roles: { a: "first", b: "factor" },
  }),
  T2_two_step({
    id: "T2.two-step.06",
    form: "the-change-after-several-items",
    g: [4, 5],
    kind: "integer",
    p: [rg(40, 90), rg(2, 6), rg(3, 9)],
    ok: (a, b, c) => a - b * c > 0 && b !== c,
    f: (a, b, c) => q(a - b * c),
    alt: (a, b, c) =>
      q(Array.from({ length: b }).reduce<number>((s) => s - c, a)),
    t: {
      cost: (a, b, c) => q(b * c),
      "one-item": (a, b, c) => q(a - c),
      "add-all": (a, b, c) => q(a + b + c),
    },
    roles: { a: "paid", b: "count", c: "price" },
  }),
  T2_two_step({
    id: "T2.two-step.07",
    form: "the-share-then-the-addition",
    g: [4, 5],
    kind: "integer",
    p: [rg(3, 9), rg(3, 9), rg(2, 15)],
    ok: (a, b) => a !== b,
    f: (a, b, c) => q(b + c),
    alt: (a, b, c) => q(a * b + a * c).div(q(a)),
    t: {
      share: (a, b) => q(b),
      "total-plus": (a, b, c) => q(a * b + c),
      "all-numbers": (a, b, c) => q(a * b + a + c),
    },
    x: (a, b) => ({ x: String(a * b) }),
    roles: { a: "parts", b: "in each part", c: "added" },
  }),
  T2_two_step({
    id: "T2.two-step.08",
    form: "the-sum-then-the-share",
    g: [4, 5],
    kind: "integer",
    p: [rg(10, 30), rg(10, 30), rg(2, 6)],
    ok: (a, b, c) => (a + b) % c === 0 && (a + b) % 2 === 0 && c !== 2,
    f: (a, b, c) => q((a + b) / c),
    alt: (a, b, c) =>
      q(
        Math.floor(a / c) +
          Math.floor(b / c) +
          Math.floor(((a % c) + (b % c)) / c),
      ),
    t: {
      total: (a, b) => q(a + b),
      halved: (a, b) => q((a + b) / 2),
      "add-all": (a, b, c) => q(a + b + c),
    },
    c: [2],
    roles: { a: "start", b: "added", c: "parts" },
  }),
  T2_two_step({
    id: "T2.two-step.09",
    form: "the-difference-then-the-groups",
    g: [4, 5],
    kind: "integer",
    p: [rg(30, 60), rg(5, 25), rg(2, 6)],
    ok: (a, b) => a - b > 0,
    f: (a, b, c) => q((a - b) * c),
    alt: (a, b, c) =>
      q(Array.from({ length: c }, () => a - b).reduce((s, n) => s + n, 0)),
    t: {
      remainder: (a, b) => q(a - b),
      "multiply-first": (a, b, c) => q(a * c - b),
      "add-all": (a, b, c) => q(a + b + c),
      "plus-instead": (a, b, c) => q((a + b) * c),
    },
    roles: { a: "start", b: "removed", c: "times" },
  }),
  T2_two_step({
    id: "T2.two-step.10",
    form: "the-third-part-of-a-whole",
    g: [4, 5],
    kind: "integer",
    p: [rg(40, 90), rg(10, 25), rg(10, 25)],
    ok: (a, b, c) => a - b - c > 0 && b !== c,
    f: (a, b, c) => q(a - b - c),
    alt: (a, b, c) => {
      let x = 0;
      while (b + c + x < a) x++;
      return q(x);
    },
    t: {
      "one-removed": (a, b) => q(a - b),
      known: (a, b, c) => q(b + c),
      "add-all": (a, b, c) => q(a + b + c),
    },
    roles: { a: "whole", b: "first part", c: "second part" },
  }),
  T2_two_step({
    id: "T2.two-step.11",
    form: "the-number-of-groups-after-removing",
    g: [4, 5],
    kind: "integer",
    p: [rg(30, 60), rg(5, 15), rg(3, 6)],
    ok: (a, b, c) => (a - b) % c === 0 && (a - b) / c !== c && a - b !== c,
    f: (a, b, c) => q(c),
    alt: (a, b, c) => {
      const size = (a - b) / c;
      let n = 0;
      for (let v = a - b; v > 0; v -= size) n++;
      return q(n);
    },
    t: {
      remainder: (a, b) => q(a - b),
      "group-size": (a, b, c) => q((a - b) / c),
      "add-all": (a, b, c) => q(a + b + c),
    },
    x: (a, b, c) => ({ x: String((a - b) / c) }),
    roles: { a: "start", b: "removed", c: "group size" },
  }),
  T2_two_step({
    id: "T2.two-step.12",
    form: "the-half-and-the-extra",
    g: [4, 5],
    kind: "integer",
    p: [of(20, 30, 40, 50, 60), rg(3, 15)],
    ok: (a, b) => a / 2 !== b,
    f: (a, b) => q(a / 2 + b),
    alt: (a, b) => q(a + 2 * b).div(q(2)),
    t: {
      "less-instead": (a, b) => (a / 2 - b > 0 ? q(a / 2 - b) : null),
      second: (a) => q(a / 2),
      "first-plus": (a, b) => q(a + b),
      doubled: (a, b) => q(2 * a + b),
    },
    c: [2],
    roles: { a: "first", b: "extra of the third" },
  }),
  T2_two_step({
    id: "T2.two-step.13",
    form: "the-start-after-two-changes",
    g: [4, 5],
    kind: "integer",
    p: [rg(5, 30), rg(5, 30), rg(20, 80)],
    ok: (a, b, c) => a !== b && c + b - a > 0,
    f: (a, b, c) => q(c - a + b),
    alt: (a, b, c) => q(c - (a - b)),
    t: {
      "both-subtracted": (a, b, c) => (c - a - b > 0 ? q(c - a - b) : null),
      "not-inverted": (a, b, c) => (c + a - b > 0 ? q(c + a - b) : null),
      "only-one": (a, b, c) => (c - a > 0 ? q(c - a) : null),
    },
    roles: { a: "added", b: "removed", c: "result" },
  }),
  T2_two_step({
    id: "T2.two-step.14",
    form: "the-larger-number-from-the-sum-and-the-difference",
    g: [5, 6],
    kind: "integer",
    p: [rg(10, 40), rg(1, 8)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a + 2 * b),
    alt: (a, b) => q(2 * a + 4 * b).div(q(2)),
    t: {
      smaller: (a) => q(a),
      "half-the-sum": (a, b) => q(a + b),
      "sum-minus-difference": (a) => q(2 * a),
    },
    x: (a, b) => ({ x: String(2 * a + 2 * b), y: String(2 * b) }),
    origin: {
      olympiad:
        "two numbers from their sum and difference, by equalising (RES-4289)",
    },
    roles: { a: "smaller number (hidden)", b: "half the difference (hidden)" },
  }),
  T2_two_step({
    id: "T2.two-step.15",
    form: "the-price-from-two-purchases-that-differ",
    g: [5, 6],
    kind: "integer",
    p: [rg(2, 9), rg(2, 9), rg(2, 4), rg(3, 6), rg(1, 2)],
    ok: (a, b, c, d, e) => a !== b && d - e >= 2,
    f: (a, b) => q(b),
    alt: (a, b, c, d, e) => q(c * a + d * b - (c * a + e * b)).div(q(d - e)),
    t: {
      "the-difference": (a, b, c, d, e) => q((d - e) * b),
      "the-pen-price": (a) => q(a),
      "extra-notebooks": (a, b, c, d, e) => (d - e === b ? null : q(d - e)),
    },
    x: (a, b, c, d, e) => ({
      x: String(c * a + d * b),
      y: String(c * a + e * b),
    }),
    origin: {
      olympiad: "a price from two purchases that differ in one item (RES-4289)",
    },
    roles: {
      a: "pen price (hidden)",
      b: "notebook price",
      c: "pens in each purchase",
      d: "notebooks in the first purchase",
      e: "notebooks in the second purchase",
    },
  }),
  T2_two_step({
    id: "T2.two-step.16",
    form: "the-length-of-a-path-between-posts",
    g: [4, 5],
    kind: "integer",
    p: [rg(5, 12), rg(2, 9)],
    f: (a, b) => q((a - 1) * b),
    alt: (a, b) =>
      q(Array.from({ length: a - 1 }, () => b).reduce((s, n) => s + n, 0)),
    t: {
      "gaps-plus-distance": (a, b) => q(a - 1 + b),
      "posts-times-gap": (a, b) => q(a * b),
      "one-gap-too-many": (a, b) => q((a + 1) * b),
    },
    origin: { olympiad: "posts and gaps, a fence-post count (RES-4289)" },
    roles: { a: "posts", b: "gap between posts" },
  }),
  T2_two_step({
    id: "T2.two-step.17",
    form: "the-pairs-without-the-forbidden-ones",
    g: [4, 5],
    kind: "integer",
    p: [rg(2, 5), rg(2, 5), rg(2, 3)],
    ok: (a, b, c) => a !== b && a * b - c > 3,
    f: (a, b, c) => q(a * b - c),
    alt: (a, b, c) =>
      q(Array.from({ length: a }, () => b).reduce((s, n) => s + n, 0) - c),
    t: {
      "no-restriction": (a, b) => q(a * b),
      "restriction-added": (a, b, c) => q(a * b + c),
      added: (a, b, c) => q(a + b - c),
    },
    origin: {
      extension: "listing all the combinations, Russian grade 2 (RES-4289)",
    },
    roles: { a: "shirts", b: "skirts", c: "pairs that do not match" },
  }),
  T2_two_step({
    id: "T2.two-step.18",
    form: "the-minutes-between-two-times-over-an-hour",
    g: [4, 5],
    kind: "integer",
    p: [
      rg(8, 11),
      of(10, 15, 20, 30, 40, 45),
      rg(1, 3),
      of(20, 25, 30, 35, 40, 45, 50, 55),
    ],
    ok: (a, b, c, d) => b + d - 60 >= 5 && c > 0 && a > 0,
    f: (a, b, c, d) => q(c * 60 + d),
    alt: (a, b, c, d) => q((a + c + 1) * 60 + (b + d - 60) - (a * 60 + b)),
    t: {
      "whole-hours-only": (a, b, c) => q((c + 1) * 60),
      "minutes-swapped": (a, b, c, d) => q((c + 1) * 60 + (b - (b + d - 60))),
      "hour-is-a-hundred": (a, b, c, d) => q((c + 1) * 100 + (b + d - 60 - b)),
    },
    x: (a, b, c, d) => ({
      t1: tm(a, b),
      t2: tm(a + c + 1, b + d - 60),
      h: String(a + c + 1),
      m: String(b + d - 60),
    }),
    roles: {
      a: "start hour",
      b: "start minutes",
      c: "whole hours",
      d: "extra minutes",
    },
  }),
  T2_two_step({
    id: "T2.two-step.19",
    form: "the-cost-of-the-trips-for-all-the-boxes",
    g: [4, 5],
    kind: "integer",
    p: [rg(20, 60), rg(4, 8), rg(3, 9)],
    ok: (a, b) => a % b !== 0,
    f: (a, b, c) => q(Math.ceil(a / b) * c),
    alt: (a, b, c) => q(Math.floor((a + b - 1) / b) * c),
    t: {
      "cars-only": (a, b) => q(Math.ceil(a / b)),
      "rounded-down": (a, b, c) => q(Math.floor(a / b) * c),
      "remainder-as-cars": (a, b, c) => q((Math.floor(a / b) + (a % b)) * c),
    },
    roles: { a: "boxes", b: "boxes in a car", c: "price of a trip" },
  }),
  T2_two_step({
    id: "T2.two-step.20",
    form: "the-amount-to-move-to-make-two-piles-equal",
    g: [5, 6],
    kind: "integer",
    p: [rg(10, 40), rg(2, 10)],
    f: (a, b) => q(b),
    alt: (a, b) => q(a + 2 * b - a).div(q(2)),
    t: {
      "the-whole-difference": (a, b) => q(2 * b),
      "the-equal-amount": (a, b) => q(a + b),
    },
    x: (a, b) => ({ x: String(a + 2 * b) }),
    origin: { olympiad: "equalising two piles by moving (RES-4289)" },
    roles: { a: "smaller pile", b: "amount to move (hidden)" },
  }),
  T2_two_step({
    id: "T2.two-step.21",
    form: "the-minutes-to-reach-a-level-on-the-graph",
    g: [4, 5],
    kind: "integer",
    p: [
      of(5, 10, 15, 20),
      rg(10, 30),
      rg(5, 20),
      rg(5, 20),
      rg(5, 20),
      rg(5, 20),
      rg(2, 4),
    ],
    ok: (a, b, c, d, e, f, g) =>
      levels(b, c, d, e, f).every((v) => v !== g * a),
    f: (a, b, c, d, e, f, g) => q(g * a),
    alt: (a, b, c, d, e, f, g) =>
      q(
        levels(b, c, d, e, f).findIndex((v) => v === levels(b, c, d, e, f)[g]) *
          a,
      ),
    t: {
      "one-interval-too-many": (a, b, c, d, e, f, g) => q((g + 1) * a),
      "the-interval": (a) => q(a),
      "the-point-number": (a, b, c, d, e, f, g) => q(g + 1),
      "the-level": (a, b, c, d, e, f, g) => q(levels(b, c, d, e, f)[g] ?? 0),
    },
    x: (a, b, c, d, e, f, g) => ({ x: String(levels(b, c, d, e, f)[g] ?? 0) }),
    roles: {
      a: "minutes between measurements",
      b: "first level",
      c: "first rise",
      d: "second rise",
      e: "third rise",
      f: "fourth rise",
      g: "number of the asked point (hidden)",
    },
  }),
];

export const tSpecs1: readonly Spec<never>[] = [
  ...T1_one_step_specs,
  ...T2_two_step_specs,
];
