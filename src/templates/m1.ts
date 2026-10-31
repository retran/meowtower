// Domain M, part 1: lengths and masses, time and money (RES-4286). The Dutch goals name the metric units and
// decimal lengths at groups 5 to 7, read clocks and calendars at groups 4 to 7, and give change with cents at
// group 5. Texts are plain blanks in `content/tasks-m.ru.json`. Generated from one table with the strings.
import type { Q } from "../math/q.js";
import { calc, of, rg } from "./kitc.js";
import { dec, q, qd, tm } from "./kitf.js";
import { SIGNS, type Spec } from "./spec.js";

const sign = (x: Q, y: Q): (typeof SIGNS)[number] => SIGNS[x.cmp(y) + 1] ?? "=";

/** The sum of `n` equal steps, added one by one: a second route for a product. */
const times = (n: number, step: number): number => {
  let sum = 0;
  for (let i = 0; i < n; i += 1) sum += step;
  return sum;
};

/** A clock time n minutes after midnight, as an answer. */
const hm = (n: number): readonly [Q, Q] => [q(Math.floor(n / 60)), q(n % 60)];
/** The time that the two hands of a clock show, read from their angles: 30 degrees an hour and 6 a minute. */
const readFromAngles = (hour: number, minutes: number): [Q, Q] => {
  const hourHand = (hour % 12) * 30 + minutes / 2;
  const minuteHand = minutes * 6;
  return [q(Math.floor(hourHand / 30) || 12), q(minuteHand / 6)];
};
/** The same as hours and minutes of a text. */
const end = (n: number): [number, number] => [Math.floor(n / 60), n % 60];

/** Years for the tasks of February and of centuries; a text writes one as two parts, so it is not grouped as a number. */
const FEBRUARY_YEARS = [
  2000, 2012, 2016, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2028,
] as const;
const CENTURY_YEARS = [
  1066, 1147, 1492, 1703, 1812, 1900, 1941, 1961, 1999, 2000, 2001, 2024,
] as const;
const yearOf = (list: readonly number[], i: number): number => list[i] ?? 0;
const isLeap = (y: number): boolean =>
  y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
const centuryOf = (y: number): number => Math.floor((y - 1) / 100) + 1;
const yearParts = (y: number): Record<string, string> => ({
  c: String(Math.floor(y / 100)),
  d: String(y % 100).padStart(2, "0"),
  y: String(y),
});
/** The weekday numbers of the days left over after whole weeks, for a month of len days starting on weekday s. */
const extraDays = (s: number, len: number): number[] =>
  Array.from({ length: len % 7 }, (_, i) => ((s - 1 + i) % 7) + 1);

/** The fewest coins of 1 and 2 euros that make 0 to 4 euros. */
const FEWEST = [0, 1, 1, 2, 2] as const;
/** The numbers of 5-euro coins with which `sum` euros can be paid exactly, the rest in 2-euro coins. */
const waysToPay = (sum: number): number[] =>
  Array.from({ length: Math.floor(sum / 5) + 1 }, (_, y) => y).filter(
    (y) => (sum - 5 * y) % 2 === 0,
  );
/** Option 1 when the money is more than the cost, 2 when equal, 3 when less. */
const enough = (money: number, cost: number): string =>
  money > cost ? "1" : money === cost ? "2" : "3";
/** A price rounded to the nearest ten euros. */
const tenth = (price: number): number => Math.round(price / 10) * 10;

const M1_whole = calc("M1", "whole");
const M1_whole_specs: readonly Spec<never>[] = [
  M1_whole({
    id: "M1.whole.01",
    form: "kilometres-to-metres",
    g: [5, 5],
    kind: "integer",
    p: [rg(2, 19)],
    f: (a) => q(1000 * a),
    alt: (a) => q(times(a, 1000)),
    t: {
      "zeros-lost": (a) => q(100 * a),
      "tens-only": (a) => q(10 * a),
      "extra-zero": (a) => q(10000 * a),
    },
    c: [100, 1000],
  }),
  M1_whole({
    id: "M1.whole.02",
    form: "metres-to-centimetres",
    g: [5, 5],
    kind: "integer",
    p: [rg(2, 19)],
    f: (a) => q(100 * a),
    alt: (a) => q(10 * a * 10),
    t: {
      "tens-only": (a) => q(10 * a),
      thousand: (a) => q(1000 * a),
    },
    c: [10, 100],
  }),
  M1_whole({
    id: "M1.whole.03",
    form: "centimetres-to-millimetres",
    g: [5, 5],
    kind: "integer",
    p: [rg(2, 19)],
    f: (a) => q(10 * a),
    alt: (a) => q(times(a, 10)),
    t: {
      hundred: (a) => q(100 * a),
      "number-kept": (a) => q(a),
    },
    c: [10, 100],
  }),
  M1_whole({
    id: "M1.whole.04",
    form: "kilograms-to-grams",
    g: [5, 5],
    kind: "integer",
    p: [rg(2, 19)],
    f: (a) => q(1000 * a),
    alt: (a) => q(times(a, 1000)),
    t: {
      "zeros-lost": (a) => q(100 * a),
      "tens-only": (a) => q(10 * a),
      "extra-zero": (a) => q(10000 * a),
    },
    c: [100, 1000],
  }),
  M1_whole({
    id: "M1.whole.05",
    form: "tonnes-to-kilograms",
    g: [5, 5],
    kind: "integer",
    p: [rg(2, 19)],
    f: (a) => q(1000 * a),
    alt: (a) => q(times(a, 1000)),
    t: {
      "zeros-lost": (a) => q(100 * a),
      "tens-only": (a) => q(10 * a),
      "extra-zero": (a) => q(10000 * a),
    },
    c: [100, 1000],
  }),
  M1_whole({
    id: "M1.whole.06",
    form: "kilometres-and-metres-to-metres",
    g: [5, 5],
    kind: "integer",
    p: [rg(1, 9), of(100, 200, 300, 400, 500, 600, 700, 800, 900)],
    f: (a, b) => q(1000 * a + b),
    alt: (a, b) => q((10 * a + b / 100) * 100),
    t: {
      "metres-forgotten": (a) => q(1000 * a),
      "counts-added": (a, b) => q(a + b),
      "wrong-factor": (a, b) => q(100 * a + b),
    },
    c: [1000],
  }),
  M1_whole({
    id: "M1.whole.07",
    form: "metres-and-centimetres-to-centimetres",
    g: [5, 5],
    kind: "integer",
    p: [rg(1, 9), rg(11, 99)],
    f: (a, b) => q(100 * a + b),
    alt: (a, b) => q(Number(`${a}${b}`)),
    t: {
      "counts-added": (a, b) => q(a + b),
      "metres-only": (a) => q(100 * a),
      "wrong-factor": (a, b) => q(10 * a + b),
      "kilometre-factor": (a, b) => q(1000 * a + b),
    },
    c: [100],
  }),
  M1_whole({
    id: "M1.whole.08",
    form: "kilograms-and-grams-to-grams",
    g: [5, 5],
    kind: "integer",
    p: [rg(1, 9), of(100, 200, 300, 400, 500, 600, 700, 800, 900)],
    f: (a, b) => q(1000 * a + b),
    alt: (a, b) => q(Number(`${a}${String(b).padStart(3, "0")}`)),
    t: {
      "counts-added": (a, b) => q(a + b),
      "grams-forgotten": (a) => q(1000 * a),
      "wrong-factor": (a, b) => q(100 * a + b),
    },
    c: [1000],
  }),
  M1_whole({
    id: "M1.whole.09",
    form: "grams-to-kilograms",
    g: [5, 5],
    kind: "integer",
    p: [rg(2, 9)],
    f: (a) => q(a),
    alt: (a) => {
      let kilograms = 0;
      for (let left = 1000 * a; left >= 1000; left -= 1000) kilograms += 1;
      return q(kilograms);
    },
    t: {
      "too-many": (a) => q(100 * a),
      "not-divided": (a) => q(1000 * a),
      "tens-only": (a) => q(10 * a),
    },
    x: (a) => ({ x: String(1000 * a) }),
    c: [10, 1000],
  }),
  M1_whole({
    id: "M1.whole.10",
    form: "metres-to-kilometres",
    g: [5, 5],
    kind: "integer",
    p: [rg(2, 9)],
    f: (a) => q(a),
    alt: (a) => {
      let kilometres = 0;
      for (let left = 1000 * a; left >= 1000; left -= 1000) kilometres += 1;
      return q(kilometres);
    },
    t: {
      "too-many": (a) => q(100 * a),
      "not-divided": (a) => q(1000 * a),
      "tens-only": (a) => q(10 * a),
    },
    x: (a) => ({ x: String(1000 * a) }),
    c: [10, 1000],
  }),
  M1_whole({
    id: "M1.whole.11",
    form: "decimetres-to-centimetres",
    g: [5, 5],
    kind: "integer",
    p: [rg(3, 6), rg(4, 9)],
    f: (a, b) => q(10 * a * b),
    alt: (a, b) => q(times(b, 10 * a)),
    t: {
      "units-not-converted": (a, b) => q(a * b),
      "wrong-factor": (a, b) => q(100 * a * b),
    },
    c: [10, 100],
    roles: { a: "length of one step in decimetres", b: "number of steps" },
  }),
  M1_whole({
    id: "M1.whole.12",
    form: "a-metre-against-centimetres",
    g: [5, 5],
    kind: "compare",
    p: [rg(1, 5), of(50, 100, 120, 150, 200, 250, 300, 350, 400)],
    f: (a, b) => sign(q(100 * a), q(b)),
    alt: (a, b) => sign(q(a), q(b, 100)),
    t: { "numbers-compared": (a, b) => sign(q(a), q(b)) },
    x: (a, b) => ({ sign: sign(q(100 * a), q(b)) }),
  }),
  M1_whole({
    id: "M1.whole.13",
    form: "a-rope-after-a-piece-is-cut",
    g: [5, 6],
    kind: "integer",
    p: [rg(2, 9), rg(11, 89), rg(101, 199)],
    f: (a, b, c) => q(100 * a + b - c),
    alt: (a, b, c) => q((a - Math.floor(c / 100)) * 100 + b - (c % 100)),
    t: {
      "extra-centimetres-forgotten": (a, b, c) => q(100 * a - c),
      "metre-as-ten": (a, b, c) => (10 * a + b > c ? q(10 * a + b - c) : null),
      "metre-as-thousand": (a, b, c) => q(1000 * a + b - c),
      "smaller-from-larger": (a, b, c) =>
        q((a - 1) * 100 + Math.abs(b - (c - 100))),
    },
    c: [100, 10, 1000],
    roles: {
      a: "whole metres of the rope",
      b: "extra centimetres",
      c: "centimetres cut off",
    },
  }),
  M1_whole({
    id: "M1.whole.14",
    form: "a-ribbon-cut-into-pieces",
    g: [5, 6],
    kind: "integer",
    p: [rg(2, 8), of(10, 20, 25, 50)],
    f: (a, b) => q((100 * a) / b),
    alt: (a, b) => q((100 / b) * a),
    t: {
      multiplied: (a, b) => q(100 * a * b),
      "metre-as-thousand": (a, b) => q((1000 * a) / b),
      "metre-as-ten": (a, b) => ((10 * a) % b === 0 ? q((10 * a) / b) : null),
    },
    c: [100, 10, 1000],
    roles: {
      a: "length of the ribbon in metres",
      b: "length of one piece in centimetres",
    },
  }),
  M1_whole({
    id: "M1.whole.15",
    form: "posts-along-a-road",
    g: [5, 6],
    kind: "integer",
    p: [rg(1, 4), of(50, 100, 125, 200, 250, 500)],
    f: (a, b) => q((1000 * a) / b + 1),
    alt: (a, b) => {
      let posts = 0;
      for (let at = 0; at <= 1000 * a; at += b) posts += 1;
      return q(posts);
    },
    t: {
      "no-extra-post": (a, b) => q((1000 * a) / b),
      "metre-as-hundred": (a, b) =>
        (100 * a) % b === 0 ? q((100 * a) / b + 1) : null,
      "both-ends-added": (a, b) => q((1000 * a) / b + 2),
    },
    c: [1000, 1],
    origin: {
      olympiad:
        "posts at both ends of a road: one more post than gaps, in the spirit of the fence items of Kangaroo ecolier (RES-4286)",
    },
    roles: {
      a: "length of the road in kilometres",
      b: "distance between posts in metres",
    },
  }),
  M1_whole({
    id: "M1.whole.16",
    form: "strips-glued-with-an-overlap",
    g: [5, 6],
    kind: "integer",
    p: [rg(3, 6), rg(2, 5), rg(2, 5)],
    f: (a, b, c) => q(10 * b * a - (a - 1) * c),
    alt: (a, b, c) => q(10 * b + (a - 1) * (10 * b - c)),
    t: {
      "no-overlap": (a, b) => q(10 * b * a),
      "overlap-every-strip": (a, b, c) => q(10 * b * a - a * c),
      "overlap-once": (a, b, c) => q(10 * b * a - c),
    },
    c: [10],
    origin: {
      olympiad:
        "one joint fewer than strips, in the spirit of the zigzag and stick items of the Kangoeroe reports (RES-4286)",
    },
    roles: {
      a: "number of strips",
      b: "length of a strip in decimetres",
      c: "overlap in centimetres",
    },
  }),
  M1_whole({
    id: "M1.whole.17",
    form: "bags-of-mixed-mass",
    g: [5, 6],
    kind: "integer",
    p: [rg(3, 9), rg(1, 4), of(100, 200, 250, 500, 750)],
    f: (a, b, c) => q(a * (1000 * b + c)),
    alt: (a, b, c) => q(1000 * a * b + a * c),
    t: {
      "units-added-first": (a, b, c) => q(a * (b + c)),
      "grams-once": (a, b, c) => q(1000 * a * b + c),
    },
    c: [1000],
    roles: {
      a: "number of bags",
      b: "whole kilograms of one bag",
      c: "extra grams of one bag",
    },
  }),
];

const M1_decimal = calc("M1", "decimal");
const M1_decimal_specs: readonly Spec<never>[] = [
  M1_decimal({
    id: "M1.decimal.01",
    form: "decimal-kilometres-to-metres",
    g: [6, 8],
    kind: "integer",
    p: [rg(11, 59)],
    ok: (a) => a % 10 !== 0,
    f: (a) => q(100 * a),
    alt: (a) => q(1000 * Math.floor(a / 10) + 100 * (a % 10)),
    t: {
      "ten-times-too-big": (a) => q(1000 * a),
      "wrong-factor": (a) => q(10 * a),
      "tenths-dropped": (a) => q(1000 * Math.floor(a / 10)),
    },
    x: (a) => ({ x: dec(a, 1) }),
    c: [100, 1000],
  }),
  M1_decimal({
    id: "M1.decimal.02",
    form: "decimal-metres-to-centimetres",
    g: [6, 8],
    kind: "integer",
    p: [rg(11, 59)],
    ok: (a) => a % 10 !== 0,
    f: (a) => q(10 * a),
    alt: (a) => q(100 * Math.floor(a / 10) + 10 * (a % 10)),
    t: {
      "ten-times-too-big": (a) => q(100 * a),
      "wrong-factor": (a) => q(a),
      "tenths-dropped": (a) => q(100 * Math.floor(a / 10)),
    },
    x: (a) => ({ x: dec(a, 1) }),
    c: [10, 100],
  }),
  M1_decimal({
    id: "M1.decimal.03",
    form: "decimal-kilograms-to-grams",
    g: [6, 8],
    kind: "decimal",
    p: [rg(101, 899)],
    ok: (a) => a % 10 !== 0,
    f: (a) => q(a),
    alt: (a) => qd(a, 3).mul(q(1000)),
    t: {
      "moved-one-place": (a) => qd(a, 1),
      "moved-two-places": (a) => qd(a, 2),
      "number-kept": (a) => qd(a, 3),
    },
    x: (a) => ({ x: dec(a, 3) }),
    c: [1000],
  }),
  M1_decimal({
    id: "M1.decimal.04",
    form: "grams-to-decimal-kilograms",
    g: [6, 8],
    kind: "decimal",
    p: [rg(101, 899)],
    ok: (a) => a % 10 !== 0,
    f: (a) => qd(a, 3),
    alt: (a) =>
      qd(Math.floor(a / 100), 1)
        .add(qd(Math.floor(a / 10) % 10, 2))
        .add(qd(a % 10, 3)),
    t: {
      "moved-two-places": (a) => qd(a, 2),
      "moved-one-place": (a) => qd(a, 1),
      "number-kept": (a) => q(a),
    },
    c: [1000],
  }),
  M1_decimal({
    id: "M1.decimal.05",
    form: "centimetres-to-decimal-metres",
    g: [6, 8],
    kind: "decimal",
    p: [rg(105, 395)],
    ok: (a) => a % 10 !== 0,
    f: (a) => qd(a, 2),
    alt: (a) =>
      q(Math.floor(a / 100))
        .add(qd(Math.floor(a / 10) % 10, 1))
        .add(qd(a % 10, 2)),
    t: {
      "moved-one-place": (a) => qd(a, 1),
      "moved-three-places": (a) => qd(a, 3),
      "number-kept": (a) => q(a),
      "zero-lost": (a) =>
        a % 100 < 10 ? qd(10 * Math.floor(a / 100) + (a % 10), 1) : null,
    },
    c: [100],
  }),
  M1_decimal({
    id: "M1.decimal.06",
    form: "metres-to-decimal-kilometres",
    g: [6, 8],
    kind: "decimal",
    p: [
      of(
        1200,
        1500,
        1800,
        2300,
        2500,
        2700,
        3400,
        3500,
        3900,
        4200,
        4600,
        4800,
        5100,
        5700,
        6300,
        6800,
        7500,
        7900,
        1250,
        2750,
        3050,
        4125,
        5025,
      ),
    ],
    f: (a) => qd(a, 3),
    alt: (a) => q(Math.floor(a / 1000)).add(qd(a % 1000, 3)),
    t: {
      "moved-two-places": (a) => qd(a, 2),
      "moved-four-places": (a) => qd(a, 4),
      "whole-only": (a) => q(Math.floor(a / 1000)),
    },
    c: [1000],
  }),
  M1_decimal({
    id: "M1.decimal.07",
    form: "decimal-kilograms-with-hundredths-to-grams",
    g: [6, 8],
    kind: "integer",
    p: [rg(111, 499)],
    ok: (a) => a % 10 !== 0,
    f: (a) => q(10 * a),
    alt: (a) => q(1000 * Math.floor(a / 100) + 10 * (a % 100)),
    t: {
      "comma-lost": (a) => q(a),
      "hundredths-as-grams": (a) => q(1000 * Math.floor(a / 100) + (a % 100)),
      "kilograms-only": (a) => q(1000 * Math.floor(a / 100)),
    },
    x: (a) => ({ x: dec(a, 2) }),
    c: [1000],
  }),
  M1_decimal({
    id: "M1.decimal.08",
    form: "millimetres-to-decimal-centimetres",
    g: [6, 8],
    kind: "decimal",
    p: [rg(11, 99)],
    ok: (a) => a % 10 !== 0,
    f: (a) => qd(a, 1),
    alt: (a) => q(Math.floor(a / 10)).add(qd(a % 10, 1)),
    t: {
      "moved-two-places": (a) => qd(a, 2),
      "multiplied-by-ten": (a) => q(10 * a),
      "number-kept": (a) => q(a),
    },
    c: [10],
  }),
  M1_decimal({
    id: "M1.decimal.09",
    form: "metres-and-a-few-centimetres-as-a-decimal",
    g: [6, 8],
    kind: "decimal",
    p: [rg(1, 9), rg(1, 9)],
    f: (a, b) => qd(100 * a + b, 2),
    alt: (a, b) => q(a).add(qd(b, 2)),
    t: {
      tenths: (a, b) => qd(10 * a + b, 1),
      "comma-forgotten": (a, b) => q(100 * a + b),
    },
  }),
  M1_decimal({
    id: "M1.decimal.10",
    form: "decimal-tonnes-to-kilograms",
    g: [6, 8],
    kind: "integer",
    p: [rg(11, 99)],
    ok: (a) => a % 10 !== 0,
    f: (a) => q(10 * a),
    alt: (a) => q(times(a, 10)),
    t: {
      "comma-lost": (a) => q(a),
      "comma-ignored": (a) => q(1000 * a),
    },
    x: (a) => ({ x: dec(a, 2) }),
    c: [1000],
  }),
  M1_decimal({
    id: "M1.decimal.11",
    form: "a-decimal-length-against-centimetres",
    g: [6, 8],
    kind: "compare",
    p: [rg(11, 19), rg(100, 199)],
    f: (a, b) => sign(q(10 * a), q(b)),
    alt: (a, b) => sign(qd(a, 1), qd(b, 2)),
    t: { "numbers-compared": (a, b) => sign(q(a), q(b)) },
    x: (a, b) => ({ x: dec(a, 1), sign: sign(q(10 * a), q(b)) }),
  }),
  M1_decimal({
    id: "M1.decimal.12",
    form: "a-decimal-length-plus-centimetres",
    g: [6, 8],
    kind: "decimal",
    p: [rg(11, 29), of(10, 20, 30, 40, 50)],
    ok: (a) => a % 10 !== 0,
    f: (a, b) => qd(10 * a + b, 2),
    alt: (a, b) => qd(a, 1).add(qd(b, 2)),
    t: {
      "added-as-numbers": (a, b) => qd(a + b, 1),
      "centimetres-kept": (a, b) => q(10 * a + b),
      "moved-one-place": (a, b) => qd(10 * a + b, 1),
    },
    x: (a) => ({ x: dec(a, 1) }),
  }),
  M1_decimal({
    id: "M1.decimal.13",
    form: "a-decimal-length-after-a-cut",
    g: [6, 8],
    kind: "decimal",
    p: [rg(15, 49), rg(11, 99)],
    ok: (a, b) => a % 10 !== 0 && 10 * a - b >= 50,
    f: (a, b) => qd(10 * a - b, 2),
    alt: (a, b) => qd(a, 1).sub(qd(b, 2)),
    t: {
      "centimetres-as-thousandths": (a, b) => qd(100 * a - b, 3),
      "centimetres-kept": (a, b) => q(10 * a - b),
      "misaligned-comma": (a, b) => (a > b ? qd(a - b, 1) : null),
    },
    x: (a) => ({ x: dec(a, 1) }),
    c: [100],
    roles: { a: "length in metres, tenths", b: "centimetres cut off" },
  }),
  M1_decimal({
    id: "M1.decimal.14",
    form: "a-decimal-length-against-metres-and-centimetres",
    g: [6, 8],
    kind: "compare",
    p: [rg(11, 39), rg(5, 95)],
    ok: (a) => a % 10 !== 0,
    f: (a, b) => sign(q(10 * (a % 10)), q(b)),
    alt: (a, b) => sign(q(10 * a), q(100 * Math.floor(a / 10) + b)),
    t: {
      "tenths-as-centimetres": (a, b) => sign(q(a % 10), q(b)),
    },
    x: (a) => ({ x: dec(a, 1), k: String(Math.floor(a / 10)) }),
    c: [100],
  }),
  M1_decimal({
    id: "M1.decimal.15",
    form: "two-days-of-a-walk",
    g: [6, 8],
    kind: "integer",
    p: [rg(12, 48), of(100, 200, 300, 400, 500)],
    ok: (a) => a % 10 !== 0,
    f: (a, b) => q(2 * 100 * a + b),
    alt: (a, b) =>
      qd(2 * a, 1)
        .add(qd(b, 3))
        .mul(q(1000)),
    t: {
      "second-day-only": (a, b) => q(100 * a + b),
      "extra-metres-forgotten": (a) => q(200 * a),
      "tenth-as-tens": (a, b) =>
        q(2 * (1000 * Math.floor(a / 10) + 10 * (a % 10)) + b),
    },
    x: (a) => ({ x: dec(a, 1) }),
    c: [1000],
    roles: {
      a: "first day in kilometres, tenths",
      b: "extra metres on the second day",
    },
  }),
  M1_decimal({
    id: "M1.decimal.16",
    form: "a-snail-on-a-pole",
    g: [6, 8],
    kind: "integer",
    p: [of(30, 40, 50, 60), of(10, 20), rg(3, 8)],
    f: (a, b, c) => q(c + 1),
    alt: (a, b, c) => {
      const height = a + c * (a - b);
      let level = 0;
      let day = 0;
      for (;;) {
        day += 1;
        level += a;
        if (level >= height) return q(day);
        level -= b;
      }
    },
    t: {
      "gain-per-day-only": (a, b, c) =>
        q(Math.ceil((a + c * (a - b)) / (a - b))),
      "last-day-forgotten": (a, b, c) => q(c),
      "slide-ignored": (a, b, c) => q(Math.ceil((a + c * (a - b)) / a)),
    },
    x: (a, b, c) => ({
      x: dec(a + c * (a - b), 2, true),
      h: String(a + c * (a - b)),
    }),
    c: [1],
    origin: {
      olympiad:
        "the snail on a pole: no slide back on the last day, in the spirit of the rate items of the Kangoeroe reports (RES-4286)",
    },
    roles: {
      a: "centimetres climbed by day",
      b: "centimetres slid back by night",
      c: "full days and nights before the last day",
    },
  }),
];

const M2_clock = calc("M2", "clock");
const M2_clock_specs: readonly Spec<never>[] = [
  M2_clock({
    id: "M2.clock.01",
    form: "plus-whole-hours",
    g: [4, 5],
    kind: "time",
    p: [rg(1, 9), of(0, 15, 30, 45), rg(1, 4)],
    ok: (a, b) => b > 0,
    f: (a, b, c) => [q(a + c), q(b)],
    alt: (a, b, c) => hm(60 * a + b + 60 * c),
    t: {
      "minutes-dropped": (a, b, c) => [q(a + c), q(0)],
      "hours-added-to-minutes": (a, b, c) => [q(a), q(b + c)],
      "wrapped-at-twelve": (a, b, c) =>
        a + c > 12 ? [q(a + c - 12), q(b)] : null,
    },
    x: (a, b) => ({ t: tm(a, b) }),
  }),
  M2_clock({
    id: "M2.clock.02",
    form: "plus-minutes-across-the-hour",
    g: [4, 5],
    kind: "time",
    p: [rg(1, 10), of(20, 30, 40, 45, 50), of(20, 25, 30, 40)],
    ok: (a, b, c) => b + c >= 60,
    f: (a, b, c) => [q(a + Math.floor((b + c) / 60)), q((b + c) % 60)],
    alt: (a, b, c) => hm(60 * a + b + c),
    t: {
      "hour-not-carried": (a, b, c) => [q(a), q((b + c) % 60)],
      "next-hour-rounded": (a) => [q(a + 1), q(0)],
    },
    x: (a, b) => ({ t: tm(a, b) }),
    c: [60],
  }),
  M2_clock({
    id: "M2.clock.03",
    form: "duration-in-minutes",
    g: [4, 5],
    kind: "integer",
    p: [rg(8, 12), of(0, 15, 30, 45), rg(1, 3), of(10, 20, 35, 40)],
    ok: (a, b, c, d) => b + d < 60,
    f: (a, b, c, d) => q(60 * c + d),
    alt: (a, b, c, d) => q(60 * (a + c) + b + d - (60 * a + b)),
    t: {
      "hours-only": (a, b, c) => q(60 * c),
      "minutes-only": (a, b, c, d) => q(d),
      "hour-as-hundred": (a, b, c, d) => q(100 * c + d),
    },
    x: (a, b, c, d) => ({ t1: tm(a, b), t2: tm(a + c, b + d) }),
    c: [60],
  }),
  M2_clock({
    id: "M2.clock.04",
    form: "duration-in-hours-and-minutes",
    g: [4, 5],
    kind: "pair",
    p: [rg(8, 12), of(0, 15, 30, 45), rg(1, 3), of(10, 20, 35, 40)],
    ok: (a, b, c, d) => b + d < 60,
    f: (a, b, c, d) => [q(c), q(d)],
    alt: (a, b, c, d) => hm(60 * (a + c) + b + d - (60 * a + b)),
    t: {
      swapped: (a, b, c, d) => [q(d), q(c)],
      "minutes-forgotten": (a, b, c) => [q(c), q(0)],
      "hours-forgotten": (a, b, c, d) => [q(0), q(d)],
    },
    x: (a, b, c, d) => ({ t1: tm(a, b), t2: tm(a + c, b + d) }),
  }),
  M2_clock({
    id: "M2.clock.05",
    form: "half-past-from-its-name",
    g: [4, 5],
    kind: "time",
    p: [rg(2, 12)],
    f: (a) => [q(a - 1), q(30)],
    alt: (a) => hm(60 * a - 30),
    t: {
      "the-named-hour": (a) => [q(a), q(30)],
      "half-as-fifty": (a) => [q(a - 1), q(50)],
    },
    c: [30],
  }),
  M2_clock({
    id: "M2.clock.06",
    form: "quarter-to-from-its-name",
    g: [4, 5],
    kind: "time",
    p: [rg(2, 12)],
    f: (a) => [q(a - 1), q(45)],
    alt: (a) => hm(60 * a - 15),
    t: {
      "the-named-hour": (a) => [q(a), q(45)],
      "quarter-as-fifteen": (a) => [q(a - 1), q(15)],
      "quarter-to-the-hour": (a) => [q(a), q(15)],
    },
    c: [15, 45],
  }),
  M2_clock({
    id: "M2.clock.07",
    form: "quarter-past-from-its-name",
    g: [4, 5],
    kind: "time",
    p: [rg(2, 12)],
    f: (a) => [q(a - 1), q(15)],
    alt: (a) => hm(60 * (a - 1) + 15),
    t: {
      "the-named-hour": (a) => [q(a), q(15)],
      "quarter-as-forty-five": (a) => [q(a - 1), q(45)],
      "quarter-as-twenty-five": (a) => [q(a - 1), q(25)],
    },
    c: [15],
  }),
  M2_clock({
    id: "M2.clock.08",
    form: "the-end-of-an-activity",
    g: [4, 5],
    kind: "time",
    p: [rg(8, 14), of(0, 15, 30), of(30, 40, 45, 50)],
    ok: (a, b, c) => b + c >= 60,
    f: (a, b, c) => [q(a + Math.floor((b + c) / 60)), q((b + c) % 60)],
    alt: (a, b, c) => hm(60 * a + b + c),
    t: {
      "hour-not-carried": (a, b, c) => [q(a), q((b + c) % 60)],
      "next-hour-rounded": (a) => [q(a + 1), q(0)],
    },
    x: (a, b) => ({ t: tm(a, b) }),
    c: [60],
  }),
  M2_clock({
    id: "M2.clock.09",
    form: "hours-and-minutes-to-minutes",
    g: [4, 5],
    kind: "integer",
    p: [rg(1, 5), rg(5, 55)],
    f: (a, b) => q(60 * a + b),
    alt: (a, b) => q(times(a, 60) + b),
    t: {
      "counts-added": (a, b) => q(a + b),
      "hour-as-hundred": (a, b) => q(100 * a + b),
      "minutes-forgotten": (a) => q(60 * a),
    },
    c: [60],
  }),
  M2_clock({
    id: "M2.clock.10",
    form: "afternoon-hours-from-a-digital-clock",
    g: [4, 5],
    kind: "integer",
    p: [rg(13, 23), of(0, 15, 30, 45)],
    f: (a) => q(a - 12),
    alt: (a) => q(((a - 1) % 12) + 1),
    t: {
      "same-number": (a) => q(a),
      "twelve-added": (a) => q(a + 12),
      "ten-subtracted": (a) => q(a - 10),
    },
    x: (a, b) => ({ t: tm(a, b) }),
    c: [12],
  }),
  M2_clock({
    id: "M2.clock.11",
    form: "the-time-some-minutes-ago",
    g: [4, 5],
    kind: "time",
    p: [rg(9, 15), of(30, 40, 45, 50, 55), of(10, 15, 20, 25)],
    ok: (a, b, c) => b + c < 60,
    f: (a, b, c) => [q(a), q(b - c)],
    alt: (a, b, c) => hm(60 * a + b - c),
    t: {
      added: (a, b, c) => [q(a), q(b + c)],
      "needless-borrow": (a, b, c) => [q(a - 1), q(b - c)],
    },
    x: (a, b) => ({ t: tm(a, b) }),
  }),
  M2_clock({
    id: "M2.clock.12",
    form: "the-start-from-the-end-and-hours",
    g: [4, 5],
    kind: "time",
    p: [rg(9, 15), of(0, 15, 30, 45), rg(1, 3)],
    f: (a, b, c) => [q(a - c), q(b)],
    alt: (a, b, c) => hm(60 * a + b - 60 * c),
    t: {
      added: (a, b, c) => [q(a + c), q(b)],
      "minutes-dropped": (a, b, c) => [q(a - c), q(0)],
      "hours-from-minutes": (a, b, c) => (b < c ? null : [q(a), q(b - c)]),
    },
    x: (a, b) => ({ t: tm(a, b) }),
  }),
  M2_clock({
    id: "M2.clock.13",
    form: "reading-an-analogue-clock-on-the-quarter",
    g: [4, 5],
    kind: "time",
    face: "analogue",
    p: [rg(1, 12), of(0, 15, 30, 45)],
    f: (a, b) => [q(a), q(b)],
    alt: (a, b) => readFromAngles(a, b),
    t: {
      "hands-swapped": (a, b) => [q(b === 0 ? 12 : b / 5), q((a % 12) * 5)],
      "next-hour-read": (a, b) => (b >= 30 ? [q((a % 12) + 1), q(b)] : null),
      "minutes-read-as-marks": (a, b) => (b > 0 ? [q(a), q(b / 5)] : null),
    },
    c: [5],
  }),
  M2_clock({
    id: "M2.clock.14",
    form: "reading-an-analogue-clock-to-five-minutes",
    g: [5, 5],
    kind: "time",
    face: "analogue",
    p: [rg(1, 12), of(5, 10, 20, 25, 35, 40, 50, 55)],
    f: (a, b) => [q(a), q(b)],
    alt: (a, b) => readFromAngles(a, b),
    t: {
      "minutes-read-as-marks": (a, b) => [q(a), q(b / 5)],
      "hands-swapped": (a, b) => [q(b / 5), q((a % 12) * 5)],
      "next-hour-read": (a, b) => (b >= 35 ? [q((a % 12) + 1), q(b)] : null),
    },
    c: [5],
  }),
  M2_clock({
    id: "M2.clock.15",
    form: "the-arrival-after-hours-and-minutes",
    g: [5, 5],
    kind: "time",
    p: [
      rg(6, 15),
      of(0, 10, 15, 20, 30, 40, 45, 50),
      rg(1, 4),
      of(15, 20, 25, 30, 35, 40, 45, 50),
    ],
    f: (a, b, c, d) => hm(60 * (a + c) + b + d),
    alt: (a, b, c, d) => [q(a + c + Math.floor((b + d) / 60)), q((b + d) % 60)],
    t: {
      "carry-forgotten": (a, b, c, d) =>
        b + d >= 60 ? [q(a + c), q((b + d) % 60)] : null,
      "hours-forgotten": (a, b, c, d) => hm(60 * a + b + d),
    },
    x: (a, b) => ({ t: tm(a, b) }),
    c: [60],
    roles: {
      a: "start hour",
      b: "start minutes",
      c: "hours of travel",
      d: "minutes of travel",
    },
  }),
  M2_clock({
    id: "M2.clock.16",
    form: "a-journey-across-midnight",
    g: [5, 5],
    kind: "integer",
    p: [rg(20, 23), of(30, 40, 45, 50), rg(0, 4), of(5, 10, 15, 20)],
    f: (a, b, c, d) => q(60 * (24 - a + c) - (b - d)),
    alt: (a, b, c, d) => q(60 * (24 - a) - b + (60 * c + d)),
    t: {
      "borrow-reversed": (a, b, c, d) => q(60 * (24 - a + c) + (b - d)),
      "hours-only": (a, b, c) => q(60 * (24 - a + c)),
      "times-subtracted": (a, b, c, d) => q(60 * (a - c) + (b - d)),
    },
    x: (a, b, c, d) => ({ t1: tm(a, b), t2: tm(c, d) }),
    c: [24, 60],
    roles: {
      a: "departure hour",
      b: "departure minutes",
      c: "arrival hour",
      d: "arrival minutes",
    },
  }),
  M2_clock({
    id: "M2.clock.17",
    form: "buses-at-a-fixed-interval",
    g: [5, 6],
    kind: "integer",
    p: [rg(6, 9), of(0, 10, 20, 30), of(10, 15, 20, 30), rg(3, 7)],
    f: (a, b, c, d) => q(d + 1),
    alt: (a, b, c, d) => {
      let buses = 0;
      for (let at = 60 * a + b; at <= 60 * a + b + c * d; at += c) buses += 1;
      return q(buses);
    },
    t: {
      "first-bus-left-out": (a, b, c, d) => q(d),
      "hours-ignored": (a, b, c, d) => {
        const total = c * d;
        const rest = total % 60;
        return total >= 60 && rest > 0 && rest % c === 0
          ? q(rest / c + 1)
          : null;
      },
    },
    x: (a, b, c, d) => ({ t1: tm(a, b), t2: tm(...end(60 * a + b + c * d)) }),
    c: [1, 60],
    origin: {
      olympiad:
        "buses at a fixed interval with the first and the last counted: one more than the gaps, in the spirit of the fence items of Kangaroo ecolier (RES-4286)",
    },
    roles: {
      a: "hour of the first bus",
      b: "minutes of the first bus",
      c: "interval in minutes",
      d: "gaps between the first and the last bus",
    },
  }),
  M2_clock({
    id: "M2.clock.18",
    form: "a-clock-that-gains-minutes-every-hour",
    g: [5, 6],
    kind: "time",
    p: [rg(7, 12), of(2, 3, 4, 5), rg(3, 9)],
    f: (a, b, c) => [q(a + c), q(b * c)],
    alt: (a, b, c) => hm(60 * (a + c) + b * c),
    t: {
      "error-not-accumulated": (a, b, c) => [q(a + c), q(b)],
      "slow-instead": (a, b, c) => [q(a + c - 1), q(60 - b * c)],
    },
    x: (a, b, c) => ({ t1: tm(a, 0), t2: tm(a + c, 0) }),
    origin: {
      olympiad:
        "a clock that gains a fixed number of minutes each hour, so the error accumulates, in the spirit of the clock items of the Kangoeroe reports (RES-4286)",
    },
    roles: {
      a: "hour when the clock was set",
      b: "minutes gained per hour",
      c: "hours that passed",
    },
  }),
  M2_clock({
    id: "M2.clock.19",
    form: "the-start-of-a-later-lesson",
    g: [5, 6],
    kind: "time",
    p: [rg(8, 9), of(0, 15, 30), of(35, 40, 45), of(5, 10, 15), rg(3, 5)],
    f: (a, b, c, d, e) => hm(60 * a + b + (e - 1) * (c + d)),
    alt: (a, b, c, d, e) => {
      let at = 60 * a + b;
      for (let lesson = 1; lesson < e; lesson += 1) at += c + d;
      return hm(at);
    },
    t: {
      "breaks-left-out": (a, b, c, d, e) => hm(60 * a + b + (e - 1) * c),
      "one-lesson-too-many": (a, b, c, d, e) => hm(60 * a + b + e * (c + d)),
    },
    x: (a, b) => ({ t: tm(a, b) }),
    roles: {
      a: "start hour",
      b: "start minutes",
      c: "length of a lesson",
      d: "length of a break",
      e: "number of the lesson asked",
    },
  }),
];

const M2_calendar = calc("M2", "calendar");
const M2_calendar_specs: readonly Spec<never>[] = [
  M2_calendar({
    id: "M2.calendar.01",
    form: "weeks-to-days",
    g: [4, 7],
    kind: "integer",
    p: [rg(2, 9)],
    f: (a) => q(7 * a),
    alt: (a) => q(times(a, 7)),
    t: {
      added: (a) => q(a + 7),
      "working-days": (a) => q(5 * a),
    },
    c: [7],
  }),
  M2_calendar({
    id: "M2.calendar.02",
    form: "days-between-two-dates-in-a-month",
    g: [4, 7],
    kind: "integer",
    p: [rg(2, 14), rg(16, 28)],
    f: (a, b) => q(b - a),
    alt: (a, b) => {
      let days = 0;
      for (let date = a; date < b; date += 1) days += 1;
      return q(days);
    },
    t: {
      "inclusive-count": (a, b) => q(b - a + 1),
      "dates-added": (a, b) => q(a + b),
      "both-ends-left-out": (a, b) => q(b - a - 1),
    },
  }),
  M2_calendar({
    id: "M2.calendar.03",
    form: "days-left-in-a-thirty-day-month",
    g: [4, 7],
    kind: "integer",
    p: [rg(2, 28)],
    f: (a) => q(30 - a),
    alt: (a) => {
      let days = 0;
      for (let date = a + 1; date <= 30; date += 1) days += 1;
      return q(days);
    },
    t: {
      "one-day-too-many": (a) => q(31 - a),
      added: (a) => q(30 + a),
    },
    c: [30],
  }),
  M2_calendar({
    id: "M2.calendar.04",
    form: "years-and-months-to-months",
    g: [4, 7],
    kind: "integer",
    p: [rg(1, 6), rg(1, 11)],
    f: (a, b) => q(12 * a + b),
    alt: (a, b) => q(times(a, 12) + b),
    t: {
      "counts-added": (a, b) => q(a + b),
      "year-as-ten": (a, b) => q(10 * a + b),
      "months-forgotten": (a) => q(12 * a),
    },
    c: [12],
  }),
  M2_calendar({
    id: "M2.calendar.05",
    form: "days-in-ordinary-years",
    g: [4, 7],
    kind: "integer",
    p: [rg(2, 9)],
    f: (a) => q(365 * a),
    alt: (a) => q(times(a, 365)),
    t: {
      "months-counted": (a) => q(360 * a),
      "leap-year-days": (a) => q(366 * a),
      added: (a) => q(a + 365),
    },
    c: [12, 30, 365],
  }),
  M2_calendar({
    id: "M2.calendar.06",
    form: "days-to-hours",
    g: [4, 7],
    kind: "integer",
    p: [rg(2, 9)],
    f: (a) => q(24 * a),
    alt: (a) => q(times(a, 24)),
    t: {
      added: (a) => q(a + 24),
      "twelve-hour-day": (a) => q(12 * a),
    },
    c: [24],
  }),
  M2_calendar({
    id: "M2.calendar.07",
    form: "days-between-dates-in-different-months",
    g: [4, 7],
    kind: "integer",
    p: [rg(10, 28), rg(3, 25)],
    f: (a, b) => q(31 - a + b),
    alt: (a, b) => q(31 + b - a),
    t: {
      "days-added": (a, b) => (2 * a === 30 ? null : q(a + b)),
      "thirty-day-month": (a, b) => (2 * a === 30 ? null : q(30 - a + b)),
      "inclusive-count": (a, b) => (2 * a === 32 ? null : q(32 - a + b)),
    },
    c: [31],
  }),
  M2_calendar({
    id: "M2.calendar.08",
    form: "days-as-weeks-and-days",
    g: [4, 7],
    kind: "pair",
    p: [rg(15, 60)],
    ok: (a) => a % 7 !== 0 && Math.floor(a / 7) !== a % 7,
    f: (a) => [q(Math.floor(a / 7)), q(a % 7)],
    alt: (a) => {
      let weeks = 0;
      let rest = a;
      while (rest >= 7) {
        rest -= 7;
        weeks += 1;
      }
      return [q(weeks), q(rest)];
    },
    t: {
      swapped: (a) => [q(a % 7), q(Math.floor(a / 7))],
      "week-as-ten-days": (a) => [q(Math.floor(a / 10)), q(a % 10)],
      "days-left-out": (a) => [q(Math.floor(a / 7)), q(0)],
    },
    c: [7],
  }),
  M2_calendar({
    id: "M2.calendar.09",
    form: "age-after-some-years",
    g: [4, 7],
    kind: "integer",
    p: [rg(8, 14), rg(3, 9)],
    f: (a, b) => q(a + b),
    alt: (a, b) => {
      let age = a;
      for (let year = 0; year < b; year += 1) age += 1;
      return q(age);
    },
    t: {
      multiplied: (a, b) => q(a * b),
      subtracted: (a, b) => (a - b > 0 ? q(a - b) : null),
    },
  }),
  M2_calendar({
    id: "M2.calendar.10",
    form: "years-in-centuries",
    g: [4, 7],
    kind: "integer",
    p: [rg(2, 9)],
    f: (a) => q(100 * a),
    alt: (a) => q(times(a, 100)),
    t: {
      "tens-only": (a) => q(10 * a),
      thousand: (a) => q(1000 * a),
    },
    c: [10, 100],
  }),
  M2_calendar({
    id: "M2.calendar.11",
    form: "days-in-two-months",
    g: [4, 7],
    kind: "integer",
    p: [of(28, 30, 31), of(28, 30, 31)],
    ok: (a, b) => a !== 28 || b !== 28,
    f: (a, b) => q(a + b),
    alt: (a, b) => q(60 + (a - 30) + (b - 30)),
    t: {
      multiplied: (a, b) => q(a * b),
      "thirty-days-each": (a, b) => (a === 30 && b === 30 ? null : q(60)),
    },
  }),
  M2_calendar({
    id: "M2.calendar.12",
    form: "the-weekday-number-after-some-days",
    g: [4, 7],
    kind: "integer",
    p: [rg(1, 7), rg(10, 40)],
    ok: (a, b) => b % 7 !== 0 && ((a - 1 + b) % 7) + 1 !== b % 7,
    f: (a, b) => q(((a - 1 + b) % 7) + 1),
    alt: (a, b) => {
      let day = a;
      for (let i = 0; i < b; i += 1) day = (day % 7) + 1;
      return q(day);
    },
    t: {
      "start-forgotten": (a, b) => q(b % 7),
      "no-wrap": (a, b) => q(a + b),
    },
    c: [1, 7],
  }),
  M2_calendar({
    id: "M2.calendar.13",
    form: "the-date-after-some-days",
    g: [5, 7],
    kind: "integer",
    p: [of(28, 30, 31), rg(15, 27), rg(3, 20)],
    f: (a, b, c) => q(c),
    alt: (a, b, c) => {
      let day = b;
      for (let i = 0; i < a - b + c; i += 1) day = day === a ? 1 : day + 1;
      return q(day);
    },
    t: {
      "no-wrap": (a, b, c) => q(a + c),
      "thirty-days-assumed": (a, b, c) => (a === 30 ? null : q(a + c - 30)),
      "today-counted": (a, b, c) => q(c - 1),
    },
    x: (a, b, c) => ({ x: String(a - b + c) }),
    roles: { a: "days in the month", b: "today's date", x: "days to wait" },
  }),
  M2_calendar({
    id: "M2.calendar.14",
    form: "february-in-a-given-year",
    g: [6, 7],
    kind: "integer",
    p: [rg(0, FEBRUARY_YEARS.length - 1)],
    f: (a) => q(isLeap(yearOf(FEBRUARY_YEARS, a)) ? 29 : 28),
    alt: (a) =>
      q(new Date(Date.UTC(yearOf(FEBRUARY_YEARS, a), 2, 0)).getUTCDate()),
    t: {
      "every-year-28": (a) => {
        const y = yearOf(FEBRUARY_YEARS, a);
        return isLeap(y) && y !== 2000 ? q(28) : null;
      },
      "round-year-28": (a) =>
        yearOf(FEBRUARY_YEARS, a) === 2000 ? q(28) : null,
      "even-years": (a) => {
        const y = yearOf(FEBRUARY_YEARS, a);
        return y % 2 === 0 && !isLeap(y) ? q(29) : null;
      },
    },
    x: (a) => yearParts(yearOf(FEBRUARY_YEARS, a)),
    c: [...FEBRUARY_YEARS, 4],
  }),
  M2_calendar({
    id: "M2.calendar.15",
    form: "century-of-a-year",
    g: [7, 8],
    kind: "integer",
    p: [rg(0, CENTURY_YEARS.length - 1)],
    f: (a) => q(centuryOf(yearOf(CENTURY_YEARS, a))),
    alt: (a) => q(Math.ceil(yearOf(CENTURY_YEARS, a) / 100)),
    t: {
      "first-digits": (a) => q(Math.floor(yearOf(CENTURY_YEARS, a) / 100)),
      "plus-one-always": (a) =>
        q(Math.floor(yearOf(CENTURY_YEARS, a) / 100) + 1),
    },
    x: (a) => yearParts(yearOf(CENTURY_YEARS, a)),
    c: [...CENTURY_YEARS, 1, 100, 101, 200],
  }),
  M2_calendar({
    id: "M2.calendar.16",
    form: "how-often-a-weekday-comes-in-a-month",
    g: [6, 8],
    kind: "integer",
    p: [rg(1, 7), of(29, 30, 31), rg(1, 7)],
    f: (a, b, c) =>
      q(Math.floor(b / 7) + (extraDays(a, b).includes(c) ? 1 : 0)),
    alt: (a, b, c) => {
      let weekday = a;
      let count = 0;
      for (let day = 0; day < b; day += 1) {
        if (weekday === c) count += 1;
        weekday = (weekday % 7) + 1;
      }
      return q(count);
    },
    t: {
      "four-weeks-only": (a, b) => q(Math.floor(b / 7)),
      "always-five": (a, b) => q(Math.floor(b / 7) + 1),
    },
    x: (a, b, c) => ({
      e: extraDays(a, b).join(", "),
      g: extraDays(a, b).includes(c) ? "1" : "0",
    }),
    c: [0, 1, 7],
    origin: {
      olympiad:
        "the days left over after whole weeks repeat once more, in the spirit of the date items of the Kangoeroe reports (RES-4286)",
    },
    roles: {
      a: "weekday of the first day",
      b: "days in the month",
      c: "weekday asked",
    },
  }),
  M2_calendar({
    id: "M2.calendar.17",
    form: "a-square-of-four-dates",
    g: [6, 8],
    kind: "integer",
    p: [rg(1, 20)],
    ok: (a) => a % 7 !== 0,
    f: (a) => q(a),
    alt: (a) => {
      let n = 1;
      while (n + (n + 1) + (n + 7) + (n + 8) !== 4 * a + 16) n += 1;
      return q(n);
    },
    t: {
      "average-taken": (a) => q(a + 4),
      "eight-subtracted": (a) => q(a + 2),
    },
    x: (a) => ({ x: String(4 * a + 16) }),
    c: [1, 4, 7, 8, 16],
    origin: {
      olympiad:
        "dates in a block of the calendar written through the smallest one, an invariant item in the spirit of the MCCME papers of RES-4286",
    },
    roles: { x: "sum of the four dates" },
  }),
];

const M3_whole = calc("M3", "whole");
const M3_whole_specs: readonly Spec<never>[] = [
  M3_whole({
    id: "M3.whole.01",
    form: "change-from-a-banknote",
    g: [5, 6],
    kind: "integer",
    p: [of(10, 20, 50), rg(3, 9)],
    f: (a, b) => q(a - b),
    alt: (a, b) => {
      let change = 0;
      for (let paid = b; paid < a; paid += 1) change += 1;
      return q(change);
    },
    t: {
      added: (a, b) => q(a + b),
      "price-itself": (a, b) => q(b),
    },
  }),
  M3_whole({
    id: "M3.whole.02",
    form: "the-total-of-two-prices",
    g: [5, 6],
    kind: "integer",
    p: [rg(3, 19), rg(3, 19)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a + b),
    alt: (a, b) => q(2 * Math.max(a, b) - Math.abs(a - b)),
    t: {
      difference: (a, b) => q(Math.abs(a - b)),
      product: (a, b) => q(a * b),
    },
  }),
  M3_whole({
    id: "M3.whole.03",
    form: "coins-of-two-euros",
    g: [5, 6],
    kind: "integer",
    p: [rg(3, 9)],
    f: (a) => q(2 * a),
    alt: (a) => q(times(a, 2)),
    t: {
      added: (a) => q(a + 2),
      "count-itself": (a) => q(a),
    },
    c: [2],
  }),
  M3_whole({
    id: "M3.whole.04",
    form: "notes-of-five-euros-in-a-sum",
    g: [5, 6],
    kind: "integer",
    p: [of(20, 25, 35, 40, 45, 55, 60, 65, 75, 80, 90, 95)],
    f: (a) => q(a / 5),
    alt: (a) => {
      let notes = 0;
      for (let left = a; left > 0; left -= 5) notes += 1;
      return q(notes);
    },
    t: {
      multiplied: (a) => q(5 * a),
      subtracted: (a) => q(a - 5),
    },
    c: [5],
  }),
  M3_whole({
    id: "M3.whole.05",
    form: "the-price-of-several-whole-euro-items",
    g: [5, 6],
    kind: "integer",
    p: [rg(2, 9), rg(3, 15)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a * b),
    alt: (a, b) => q(times(a, b)),
    t: {
      added: (a, b) => q(a + b),
      difference: (a, b) => q(Math.abs(a - b)),
    },
  }),
  M3_whole({
    id: "M3.whole.06",
    form: "change-in-one-euro-coins",
    g: [5, 6],
    kind: "integer",
    p: [rg(3, 9)],
    f: (a) => q(10 - a),
    alt: (a) => {
      let coins = 0;
      for (let sum = a; sum < 10; sum += 1) coins += 1;
      return q(coins);
    },
    t: {
      "price-itself": (a) => q(a),
      added: (a) => q(10 + a),
    },
    c: [1, 10],
  }),
  M3_whole({
    id: "M3.whole.07",
    form: "cents-to-whole-euros",
    g: [5, 6],
    kind: "integer",
    p: [rg(2, 9)],
    f: (a) => q(a),
    alt: (a) => {
      let euros = 0;
      for (let cents = 100 * a; cents >= 100; cents -= 100) euros += 1;
      return q(euros);
    },
    t: {
      "moved-too-far": (a) => q(100 * a),
      "divided-by-ten": (a) => q(10 * a),
    },
    x: (a) => ({ x: String(100 * a) }),
    c: [100],
  }),
  M3_whole({
    id: "M3.whole.08",
    form: "tens-and-twos-together",
    g: [5, 6],
    kind: "integer",
    p: [rg(2, 6), rg(2, 6)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(10 * a + 2 * b),
    alt: (a, b) => q(2 * (5 * a + b)),
    t: {
      "counts-added": (a, b) => q(a + b),
      "coins-as-ones": (a, b) => q(10 * a + b),
      "notes-as-ones": (a, b) => q(a + 2 * b),
    },
    c: [2, 10],
  }),
  M3_whole({
    id: "M3.whole.09",
    form: "saved-over-several-weeks",
    g: [5, 6],
    kind: "integer",
    p: [rg(3, 9), rg(4, 12)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a * b),
    alt: (a, b) => q(times(b, a)),
    t: {
      added: (a, b) => q(a + b),
      difference: (a, b) => q(Math.abs(a - b)),
    },
  }),
  M3_whole({
    id: "M3.whole.10",
    form: "money-left-after-buying-several-items",
    g: [5, 6],
    kind: "integer",
    p: [rg(30, 60), rg(2, 5), rg(3, 8)],
    ok: (a, b, c) => a > b * c,
    f: (a, b, c) => q(a - b * c),
    alt: (a, b, c) => {
      let money = a;
      for (let item = 0; item < b; item += 1) money -= c;
      return q(money);
    },
    t: {
      "spent-itself": (a, b, c) => q(b * c),
      "one-item-only": (a, b, c) => q(a - c),
      "numbers-subtracted": (a, b, c) => q(a - b - c),
    },
  }),
  M3_whole({
    id: "M3.whole.11",
    form: "how-many-items-the-money-buys",
    g: [5, 6],
    kind: "integer",
    p: [rg(20, 90), rg(3, 9)],
    ok: (a, b) => a % b !== 0,
    f: (a, b) => q(Math.floor(a / b)),
    alt: (a, b) => {
      let items = 0;
      for (let money = a; money >= b; money -= b) items += 1;
      return q(items);
    },
    t: {
      "rounded-up": (a, b) => q(Math.ceil(a / b)),
      "remainder-as-answer": (a, b) =>
        a % b === Math.ceil(a / b) ? null : q(a % b),
    },
  }),
  M3_whole({
    id: "M3.whole.12",
    form: "a-bill-shared-equally",
    g: [5, 6],
    kind: "integer",
    p: [rg(3, 9), rg(2, 5)],
    ok: (a, b) => a !== b,
    f: (a) => q(a),
    alt: (a, b) => {
      let share = 0;
      for (let left = a * b; left >= b; left -= b) share += 1;
      return q(share);
    },
    t: {
      multiplied: (a, b) => q(a * b),
      "divided-by-the-share": (a, b) => q(b),
    },
    x: (a, b) => ({ x: String(a * b) }),
  }),
  M3_whole({
    id: "M3.whole.13",
    form: "fewest-coins-for-a-sum",
    g: [5, 6],
    kind: "integer",
    p: [rg(11, 39)],
    f: (a) => q(Math.floor(a / 5) + (FEWEST[a % 5] ?? 0)),
    alt: (a) => {
      const best: number[] = [0];
      for (let sum = 1; sum <= a; sum += 1) {
        best[sum] =
          Math.min(
            ...[1, 2, 5].filter((c) => c <= sum).map((c) => best[sum - c] ?? 0),
          ) + 1;
      }
      return q(best[a] ?? 0);
    },
    t: {
      "fives-and-ones-only": (a) => q(Math.floor(a / 5) + (a % 5)),
      "twos-only": (a) => q(Math.ceil(a / 2)),
    },
    x: (a) => ({ k: String(FEWEST[a % 5] ?? 0) }),
    c: [1, 2, 3, 4, 5],
    roles: { a: "sum to make in euros" },
  }),
  M3_whole({
    id: "M3.whole.14",
    form: "ways-to-pay-with-two-coins",
    g: [5, 6],
    kind: "integer",
    p: [of(10, 12, 14, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28)],
    f: (a) => q(waysToPay(a).length),
    alt: (a) => {
      let ways = 0;
      for (let fives = 0; 5 * fives <= a; fives += 1)
        for (let twos = 0; 2 * twos <= a; twos += 1)
          if (5 * fives + 2 * twos === a) ways += 1;
      return q(ways);
    },
    t: {
      "fives-counted": (a) => q(Math.floor(a / 5) + 1),
      "case-without-fives-forgotten": (a) =>
        a % 2 === 0 ? q(waysToPay(a).length - 1) : null,
    },
    x: (a) => {
      const fives = Array.from({ length: Math.floor(a / 5) + 1 }, (_, y) => y);
      return {
        e1: fives.join(", "),
        e2: fives.map((y) => a - 5 * y).join(", "),
        e3: waysToPay(a)
          .map((y) => a - 5 * y)
          .join(", "),
        s: waysToPay(a)
          .map(() => "1")
          .join(" + "),
      };
    },
    c: [1, 2, 5],
    origin: {
      olympiad:
        "paying an exact sum with two kinds of coins, a clever count in the spirit of the payment items of MCCME 2021 grade 5 (RES-4286)",
    },
    roles: { a: "sum to pay in euros" },
  }),
  M3_whole({
    id: "M3.whole.15",
    form: "fewest-hundred-euro-notes",
    g: [5, 6],
    kind: "integer",
    p: [rg(101, 199), rg(60, 150)],
    ok: (a, b) => (a + b) % 100 !== 0,
    f: (a, b) => q(Math.ceil((a + b) / 100)),
    alt: (a, b) => {
      let notes = 0;
      while (100 * notes < a + b) notes += 1;
      return q(notes);
    },
    t: {
      "rounded-down": (a, b) => q(Math.floor((a + b) / 100)),
      "each-item-rounded-up": (a, b) =>
        q(Math.ceil(a / 100) + Math.ceil(b / 100)),
    },
    c: [100, 1],
    roles: { a: "price of the first item", b: "price of the second item" },
  }),
  M3_whole({
    id: "M3.whole.16",
    form: "coins-of-two-kinds-from-the-count-and-the-sum",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 8), rg(3, 9)],
    ok: (a, b) => a !== b,
    f: (a) => q(a),
    alt: (a, b) => {
      const coins = a + b;
      const total = 5 * a + 2 * b;
      for (let fives = 0; fives <= coins; fives += 1)
        if (5 * fives + 2 * (coins - fives) === total) return q(fives);
      return q(0);
    },
    t: {
      "difference-not-divided": (a) => q(3 * a),
      "twos-counted": (a, b) => q(b),
    },
    x: (a, b) => ({ n: String(a + b), S: String(5 * a + 2 * b) }),
    c: [2, 5],
    origin: {
      olympiad:
        "two kinds of coins from their number and total value, solved by supposing all are the smaller kind, in the spirit of the coin items of MCCME 2021 grade 4 (RES-4286)",
    },
    roles: { n: "number of coins", S: "total value in euros" },
  }),
  M3_whole({
    id: "M3.whole.17",
    form: "is-the-money-enough",
    g: [5, 6],
    kind: "choice",
    // The fourth number is how far the money lies from the cost; the text names the money itself.
    p: [rg(35, 99), rg(35, 99), rg(35, 99), of(-7, -4, -2, 0, 0, 2, 4, 7)],
    f: (a, b, c, d) => enough(a + b + c + d, a + b + c),
    alt: (a, b, c, d) => (d > 0 ? "1" : d === 0 ? "2" : "3"),
    t: {
      "tens-rounded": (a, b, c, d) =>
        enough(a + b + c + d, tenth(a) + tenth(b) + tenth(c)),
      "third-forgotten": (a, b, c, d) => enough(a + b + c + d, a + b),
    },
    x: (a, b, c, d) => ({ d: String(a + b + c + d) }),
    options: () => ["1", "2", "3"],
    c: [1, 2, 3],
    roles: { a: "price", b: "price", c: "price", d: "money you have" },
  }),
];

const M3_cents = calc("M3", "cents");
const M3_cents_specs: readonly Spec<never>[] = [
  M3_cents({
    id: "M3.cents.01",
    form: "change-with-cents",
    g: [5, 7],
    kind: "decimal",
    p: [of(20, 50), rg(1111, 1999)],
    ok: (a, b) => b % 10 !== 0,
    f: (a, b) => qd(100 * a - b, 2),
    alt: (a, b) =>
      qd(100 * (a - Math.ceil(b / 100)) + ((100 - (b % 100)) % 100), 2),
    t: {
      "price-itself": (a, b) => qd(b, 2),
      "cents-copied": (a, b) =>
        qd(100 * (a - Math.floor(b / 100)) + (b % 100), 2),
      "euros-only": (a, b) => q(a - Math.floor(b / 100)),
    },
    x: (a, b) => ({ x: dec(b, 2) }),
  }),
  M3_cents({
    id: "M3.cents.02",
    form: "the-total-of-two-prices-with-cents",
    g: [5, 7],
    kind: "decimal",
    p: [rg(111, 899), rg(111, 899)],
    ok: (a, b) => a % 10 !== 0 && b % 10 !== 0,
    f: (a, b) => qd(a + b, 2),
    alt: (a, b) =>
      q(Math.floor(a / 100) + Math.floor(b / 100)).add(
        qd((a % 100) + (b % 100), 2),
      ),
    t: {
      "comma-ignored": (a, b) => q(a + b),
      difference: (a, b) => (a === b ? null : qd(Math.abs(a - b), 2)),
      "comma-one-place-off": (a, b) => qd(a + b, 1),
    },
    x: (a, b) => ({ x: dec(a, 2), y: dec(b, 2) }),
  }),
  M3_cents({
    id: "M3.cents.03",
    form: "the-price-of-several-items-with-cents",
    g: [5, 7],
    kind: "decimal",
    p: [rg(111, 499), rg(2, 6)],
    ok: (a, b) => a % 10 !== 0 && (a * b) % 10 !== 0,
    f: (a, b) => qd(a * b, 2),
    alt: (a, b) => q(Math.floor(a / 100) * b).add(qd((a % 100) * b, 2)),
    t: {
      "comma-in-the-wrong-place": (a, b) => qd(a * b, 1),
      "comma-ignored": (a, b) => q(a * b),
      "only-euros-multiplied": (a, b) =>
        qd(100 * Math.floor(a / 100) * b + (a % 100), 2),
    },
    x: (a) => ({ x: dec(a, 2) }),
  }),
  M3_cents({
    id: "M3.cents.04",
    form: "cents-as-a-decimal-of-a-euro",
    g: [5, 7],
    kind: "decimal",
    p: [rg(101, 899)],
    ok: (a) => a % 10 !== 0,
    f: (a) => qd(a, 2),
    alt: (a) =>
      q(Math.floor(a / 100))
        .add(qd(Math.floor(a / 10) % 10, 1))
        .add(qd(a % 10, 2)),
    t: {
      "moved-one-place": (a) => qd(a, 1),
      "moved-three-places": (a) => qd(a, 3),
      "number-kept": (a) => q(a),
      "zero-lost": (a) =>
        a % 100 < 10 ? qd(10 * Math.floor(a / 100) + (a % 10), 1) : null,
    },
    c: [100],
  }),
  M3_cents({
    id: "M3.cents.05",
    form: "euros-as-cents",
    g: [5, 7],
    kind: "decimal",
    p: [rg(111, 899)],
    ok: (a) => a % 10 !== 0,
    f: (a) => q(a),
    alt: (a) => q(100 * Math.floor(a / 100) + (a % 100)),
    t: {
      "moved-one-place": (a) => qd(a, 1),
      "number-kept": (a) => qd(a, 2),
      "euros-only": (a) => q(100 * Math.floor(a / 100)),
    },
    x: (a) => ({ x: dec(a, 2) }),
    c: [100],
  }),
  M3_cents({
    id: "M3.cents.06",
    form: "an-amount-rounded-to-five-cents",
    g: [5, 7],
    kind: "decimal",
    p: [rg(1001, 2999)],
    ok: (a) => a % 5 !== 0,
    f: (a) => qd(5 * Math.round(a / 5), 2),
    alt: (a) => {
      const down = 5 * Math.floor(a / 5);
      return qd(a - down < down + 5 - a ? down : down + 5, 2);
    },
    t: {
      "cut-off": (a) => qd(5 * Math.floor(a / 5), 2),
      "always-up": (a) => qd(5 * Math.ceil(a / 5), 2),
      "rounded-to-euro": (a) =>
        100 * Math.round(a / 100) === 5 * Math.floor(a / 5)
          ? null
          : qd(100 * Math.round(a / 100), 2),
    },
    x: (a) => ({ x: dec(a, 2) }),
    c: [5],
  }),
  M3_cents({
    id: "M3.cents.07",
    form: "change-in-ten-cent-coins",
    g: [5, 7],
    kind: "pair",
    p: [rg(11, 99)],
    ok: (a) => a % 10 !== 0 && Math.floor(a / 10) !== a % 10,
    f: (a) => [q(Math.floor(a / 10)), q(a % 10)],
    alt: (a) => {
      let coins = 0;
      let rest = a;
      while (rest >= 10) {
        rest -= 10;
        coins += 1;
      }
      return [q(coins), q(rest)];
    },
    t: {
      swapped: (a) => [q(a % 10), q(Math.floor(a / 10))],
      "rest-forgotten": (a) => [q(Math.floor(a / 10)), q(0)],
      "all-cents-as-rest": (a) => [q(Math.floor(a / 10)), q(a)],
    },
    c: [10],
  }),
  M3_cents({
    id: "M3.cents.08",
    form: "a-discount-in-cents-on-each-item",
    g: [5, 7],
    kind: "decimal",
    p: [rg(111, 499), rg(2, 5)],
    ok: (a, b) => a % 10 !== 0 && ((a - 10) * b) % 10 !== 0,
    f: (a, b) => qd((a - 10) * b, 2),
    alt: (a, b) => qd(a * b, 2).sub(qd(10 * b, 2)),
    t: {
      "discount-forgotten": (a, b) => qd(a * b, 2),
      "discount-once": (a, b) => qd(a * b - 10, 2),
      "discount-added": (a, b) => qd((a + 10) * b, 2),
    },
    x: (a) => ({ x: dec(a, 2) }),
    c: [10],
  }),
  M3_cents({
    id: "M3.cents.09",
    form: "the-total-of-three-amounts",
    g: [5, 7],
    kind: "decimal",
    p: [rg(111, 599), rg(111, 599), rg(111, 599)],
    ok: (a, b, c) => a % 10 !== 0 && b % 10 !== 0 && c % 10 !== 0,
    f: (a, b, c) => qd(a + b + c, 2),
    alt: (a, b, c) =>
      q(Math.floor(a / 100) + Math.floor(b / 100) + Math.floor(c / 100)).add(
        qd((a % 100) + (b % 100) + (c % 100), 2),
      ),
    t: {
      "two-amounts-only": (a, b) => qd(a + b, 2),
      "comma-ignored": (a, b, c) => q(a + b + c),
      "comma-one-place-off": (a, b, c) => qd(a + b + c, 1),
    },
    x: (a, b, c) => ({ x: dec(a, 2), y: dec(b, 2), z: dec(c, 2) }),
  }),
  M3_cents({
    id: "M3.cents.10",
    form: "the-average-price-of-three-items",
    g: [5, 7],
    kind: "decimal",
    p: [rg(111, 499)],
    ok: (a) => a % 10 !== 0,
    f: (a) => qd(a, 2),
    alt: (a) => qd(3 * a, 2).div(q(3)),
    t: {
      "total-itself": (a) => qd(3 * a, 2),
      multiplied: (a) => qd(9 * a, 2),
    },
    x: (a) => ({ x: dec(3 * a, 2) }),
    c: [3],
  }),
  M3_cents({
    id: "M3.cents.11",
    form: "coins-of-fifty-cents",
    g: [5, 7],
    kind: "decimal",
    p: [rg(3, 19)],
    ok: (a) => a % 2 === 1,
    f: (a) => qd(50 * a, 2),
    alt: (a) => q(Math.floor(a / 2)).add(qd(50, 2)),
    t: {
      "cents-as-euros": (a) => q(50 * a),
      "moved-one-place": (a) => q(5 * a),
      "one-euro-each": (a) => q(a),
    },
    c: [50],
  }),
  M3_cents({
    id: "M3.cents.12",
    form: "cents-in-an-amount",
    g: [5, 7],
    kind: "integer",
    p: [rg(111, 899)],
    ok: (a) => a % 10 !== 0 && a >= 100,
    f: (a) => q(a),
    alt: (a) => q(100 * Math.floor(a / 100) + (a % 100)),
    t: {
      "euros-only": (a) => q(Math.floor(a / 100)),
      "cents-part-only": (a) => q(a % 100),
      "euros-in-cents": (a) => q(100 * Math.floor(a / 100)),
    },
    x: (a) => ({ x: dec(a, 2) }),
    c: [100],
  }),
  M3_cents({
    id: "M3.cents.13",
    form: "the-price-of-a-part-of-a-kilogram",
    g: [6, 7],
    kind: "decimal",
    p: [of(250, 500, 750), rg(2, 19)],
    f: (a, b) => q(a * b, 1000),
    alt: (a, b) =>
      q(b)
        .mul(q(a / 250))
        .div(q(4)),
    t: {
      "no-conversion": (a, b) => q(a * b),
      "hundred-instead": (a, b) => q(a * b, 100),
    },
    c: [1000, 100],
    roles: { a: "grams bought", b: "price of a kilogram in euros" },
  }),
  M3_cents({
    id: "M3.cents.14",
    form: "change-after-three-purchases",
    g: [5, 7],
    kind: "decimal",
    p: [of(20, 50), rg(105, 799), rg(105, 799), rg(105, 799)],
    ok: (a, b, c, d) => 100 * a - b - c - d >= 100,
    f: (a, b, c, d) => qd(100 * a - b - c - d, 2),
    alt: (a, b, c, d) =>
      qd(100 * a, 2)
        .sub(qd(b, 2))
        .sub(qd(c, 2))
        .sub(qd(d, 2)),
    t: {
      "total-itself": (a, b, c, d) => qd(b + c + d, 2),
      "last-item-forgotten": (a, b, c) => qd(100 * a - b - c, 2),
    },
    x: (a, b, c, d) => ({
      x: dec(b, 2),
      y: dec(c, 2),
      z: dec(d, 2),
      t: dec(b + c + d, 2),
    }),
    roles: { a: "banknote paid", x: "price", y: "price", z: "price" },
  }),
  M3_cents({
    id: "M3.cents.15",
    form: "the-price-of-more-from-the-price-of-some",
    g: [5, 7],
    kind: "decimal",
    p: [rg(3, 6), rg(7, 12), of(45, 55, 65, 80, 95, 120, 150, 175)],
    f: (a, b, c) => qd(b * c, 2),
    alt: (a, b, c) =>
      qd(a * c, 2)
        .mul(q(b))
        .div(q(a)),
    t: {
      "price-of-one": (a, b, c) => qd(c, 2),
      "count-difference-added": (a, b, c) => qd(a * c + 100 * (b - a), 2),
    },
    x: (a, b, c) => ({ x: dec(a * c, 2), u: dec(c, 2) }),
    roles: {
      a: "number of notebooks priced together",
      b: "number of notebooks asked",
      x: "price of the first group",
    },
  }),
  M3_cents({
    id: "M3.cents.16",
    form: "an-apple-and-a-pear-together",
    g: [6, 7],
    kind: "decimal",
    p: [rg(10, 40), rg(10, 40)],
    ok: (a, b) => a !== b,
    f: (a, b) => qd(5 * (a + b), 2),
    alt: (a, b) => {
      const first = 5 * (3 * a + 2 * b);
      const second = 5 * (2 * a + 3 * b);
      return qd((3 * first - 2 * second) / 5 + (3 * second - 2 * first) / 5, 2);
    },
    t: {
      "average-taken": (a, b) => q(25 * (a + b), 200),
      "difference-taken": (a, b) => qd(5 * Math.abs(a - b), 2),
    },
    x: (a, b) => ({
      x: dec(5 * (3 * a + 2 * b), 2),
      y: dec(5 * (2 * a + 3 * b), 2),
      s: dec(25 * (a + b), 2),
    }),
    c: [2, 3, 5],
    origin: {
      olympiad:
        "adding two purchases to get five of each, a symmetric sum, in the spirit of the price items of the MCCME and Kangoeroe papers (RES-4286)",
    },
    roles: {
      x: "price of 3 apples and 2 pears",
      y: "price of 2 apples and 3 pears",
    },
  }),
  M3_cents({
    id: "M3.cents.17",
    form: "estimating-a-price-by-rounding",
    g: [5, 7],
    kind: "line",
    p: [rg(3, 9), rg(2, 9), of(95, 96, 97, 98, 99)],
    f: (a, b, c) => qd(a * (100 * b + c), 2),
    alt: (a, b, c) => q(a * b).add(qd(a * c, 2)),
    t: {
      "cents-ignored": (a, b) => q(a * b),
      added: (a, b, c) => qd(100 * b + c + 100 * a, 2),
    },
    within: () => q(1, 2),
    x: (a, b, c) => ({ x: dec(100 * b + c, 2) }),
    roles: { a: "kilograms", x: "price of a kilogram in euros" },
  }),
];

export const mSpecs1: readonly Spec<never>[] = [
  ...M1_whole_specs,
  ...M1_decimal_specs,
  ...M2_clock_specs,
  ...M2_calendar_specs,
  ...M3_whole_specs,
  ...M3_cents_specs,
];
