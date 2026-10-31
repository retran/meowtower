// Domain S, part 2: pie charts, global graphs, patterns, the median and the mode (RES-4288). The Dutch goals read pie charts
// at group 6, draw a graph from a description at group 6 and continue number rows at group 5; the median and the mode are
// Russian extensions of grade 7. Texts are plain blanks in `content/tasks-s.ru.json`. Generated from one table with the strings.
import type { Q } from "../math/q.js";
import { at, calc, of, rg, sortedAt } from "./kitc.js";
import { q } from "./kitf.js";
import { arrangement } from "./pictures-s.js";
import { SIGNS, type Spec } from "./spec.js";

const sign = (x: Q, y: Q): (typeof SIGNS)[number] => SIGNS[x.cmp(y) + 1] ?? "=";

/** The 1-based place that item `i` takes among `n` pictures when the draw is `k` (the picture uses the same order). */
const place = (k: number, i: number, n = 4): string =>
  String(arrangement(k, n).indexOf(i) + 1);

const S4_pie = calc("S4", "pie");
const S4_pie_specs: readonly Spec<never>[] = [
  S4_pie({
    id: "S4.pie.01",
    form: "the-people-in-a-sector",
    g: [6, 7],
    kind: "integer",
    p: [of(100, 200, 50, 20), of(10, 20, 25, 50)],
    ok: (a, b) => (a * b) % 100 === 0 && (a * b) / 100 !== b,
    f: (a, b) => q((a * b) / 100),
    t: {
      "percent-itself": (a, b) => q(b),
      all: (a) => q(a),
      "not-divided": (a, b) => q(a * b),
    },
    c: [100],
  }),
  S4_pie({
    id: "S4.pie.02",
    form: "the-percent-of-an-equal-sector",
    g: [6, 7],
    kind: "integer",
    p: [of(2, 4, 5, 10, 20, 25, 50)],
    ok: (a) => 100 / a !== a,
    f: (a) => q(100 / a),
    t: {
      sectors: (a) => q(a),
      all: () => q(100),
      degrees: (a) => (360 % a === 0 ? q(360 / a) : null),
    },
    c: [100],
  }),
  S4_pie({
    id: "S4.pie.03",
    form: "the-rest-of-the-circle",
    g: [6, 7],
    kind: "integer",
    p: [rg(10, 30), rg(10, 30), rg(10, 30)],
    ok: (a, b, c) => a !== b && b !== c && a !== c,
    f: (a, b, c) => q(100 - a - b - c),
    t: {
      "three-sectors": (a, b, c) => q(a + b + c),
      "one-removed": (a) => q(100 - a),
      "from-360": (a, b, c) => q(360 - a - b - c),
    },
    c: [100],
  }),
  S4_pie({
    id: "S4.pie.04",
    form: "the-degrees-of-a-sector",
    g: [6, 7],
    kind: "integer",
    p: [of(5, 10, 15, 20, 25, 30, 35, 40, 45, 60, 75)],
    ok: (a) => a !== 50,
    f: (a) => q((360 * a) / 100),
    t: {
      "percent-itself": (a) => q(a),
      "fraction-of-hundred": (a) => q(100 - a),
      "not-divided": (a) => q(360 * a),
    },
    c: [3, 3.6, 6, 100, 360],
  }),
  S4_pie({
    id: "S4.pie.05",
    form: "the-percent-from-the-people",
    g: [6, 7],
    kind: "integer",
    p: [of(20, 25, 50, 100), rg(1, 9)],
    ok: (a, b) =>
      (100 * b) % a === 0 && (100 * b) / a !== b && a - b !== (100 * b) / a,
    f: (a, b) => q((100 * b) / a),
    t: { people: (a, b) => q(b), "all-minus": (a, b) => q(a - b) },
    c: [100],
  }),
  S4_pie({
    id: "S4.pie.06",
    form: "the-sectors-of-a-tenth",
    g: [6, 7],
    kind: "integer",
    p: [of(10, 20, 30, 40, 50, 60, 70)],
    ok: (a) => a !== 10,
    f: (a) => q(a / 10),
    t: { "percent-itself": (a) => q(a), half: (a) => q(a / 2) },
    c: [2, 10],
  }),
  S4_pie({
    id: "S4.pie.07",
    form: "the-people-in-two-sectors",
    g: [6, 7],
    kind: "integer",
    p: [of(100, 200, 400), of(10, 20, 25), of(10, 20, 30)],
    ok: (a, b, c) =>
      (a * (b + c)) % 100 === 0 && (a * b) % 100 === 0 && b !== c,
    f: (a, b, c) => q((a * (b + c)) / 100),
    t: {
      percents: (a, b, c) => q(b + c),
      "first-only": (a, b) => q((a * b) / 100),
    },
    c: [100],
  }),
  S4_pie({
    id: "S4.pie.08",
    form: "the-difference-of-two-sectors-in-people",
    g: [6, 7],
    kind: "integer",
    p: [of(100, 200, 400), of(30, 40, 50), of(10, 20, 25)],
    ok: (a, b, c) => (a * (b - c)) % 100 === 0 && (a * b) % 100 === 0 && b > c,
    f: (a, b, c) => q((a * (b - c)) / 100),
    t: {
      percents: (a, b, c) => q(b - c),
      "first-sector": (a, b) => q((a * b) / 100),
    },
    c: [100],
  }),
  S4_pie({
    id: "S4.pie.09",
    form: "the-circle-from-a-sector",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 9), of(2, 4, 5, 10)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a * b),
    t: { sum: (a, b) => q(a + b), sector: (a) => q(a) },
  }),
  S4_pie({
    id: "S4.pie.10",
    form: "the-largest-sector",
    g: [6, 7],
    kind: "integer",
    p: [rg(10, 40), rg(10, 40), rg(10, 40)],
    ok: (a, b, c) =>
      a !== b &&
      b !== c &&
      a !== c &&
      a + b + c <= 95 &&
      Math.max(a, b, c) !== [a, b, c].indexOf(Math.max(a, b, c)) + 1,
    f: (a, b, c) => q([a, b, c].indexOf(Math.max(a, b, c)) + 1),
    t: {
      percent: (a, b, c) => q(Math.max(a, b, c)),
      last: (a, b, c) =>
        [a, b, c].indexOf(Math.max(a, b, c)) === 2 ? null : q(3),
    },
    c: [3],
  }),
  S4_pie({
    id: "S4.pie.11",
    form: "the-bigger-sector",
    g: [6, 7],
    kind: "compare",
    p: [rg(10, 60), of(4, 5, 10), rg(1, 3)],
    ok: (a, b, c) => c < b && a !== (100 * c) / b && (100 * c) % b === 0,
    f: (a, b, c) => sign(q(a), q((100 * c) / b)),
    t: {
      reversed: (a, b, c) => sign(q((100 * c) / b), q(a)),
      "percent-vs-denominator": (a, b, c) => {
        const w = sign(q(a), q(b));
        return w === sign(q((100 * c) / b), q(a)) ? null : w;
      },
    },
    c: [100],
  }),
  S4_pie({
    id: "S4.pie.12",
    form: "the-shaded-share-of-a-circle",
    g: [6, 7],
    kind: "integer",
    p: [of(4, 5, 10, 20), rg(1, 19)],
    ok: (a, b) => b < a && 2 * b !== a,
    f: (a, b) => q((100 * b) / a),
    alt: (a, b) => q(b * (100 / a)),
    t: {
      count: (a, b) => q(b),
      unshaded: (a, b) => q(100 - (100 * b) / a),
      "one-sector": (a) => q(100 / a),
    },
    c: [100],
  }),
  S4_pie({
    id: "S4.pie.13",
    form: "the-chart-for-the-parts-of-a-whole",
    g: [8, 8],
    kind: "choice",
    p: [rg(20, 32)],
    f: () => "2",
    t: { line: () => "1", pictogram: () => "3" },
    options: () => ["1", "2", "3"],
    c: [1, 2, 3],
  }),
  S4_pie({
    id: "S4.pie.14",
    form: "the-largest-sector-in-a-ratio",
    g: [7, 8],
    kind: "integer",
    p: [rg(1, 6), rg(1, 6), rg(1, 6)],
    ok: (a, b, c) =>
      [4, 5, 10].includes(a + b + c) &&
      Math.max(a, b, c) > Math.min(a, b, c) &&
      [a, b, c].filter((x) => x === Math.max(a, b, c)).length === 1,
    f: (a, b, c) => q((100 * Math.max(a, b, c)) / (a + b + c)),
    alt: (a, b, c) => q(Math.max(a, b, c) * (100 / (a + b + c))),
    t: {
      parts: (a, b, c) => q(Math.max(a, b, c)),
      smallest: (a, b, c) => q((100 * Math.min(a, b, c)) / (a + b + c)),
      "one-part": (a, b, c) => q(100 / (a + b + c)),
    },
    c: [100],
  }),
  S4_pie({
    id: "S4.pie.15",
    form: "the-two-sectors-one-twice-the-other",
    g: [7, 8],
    kind: "integer",
    p: [of(30, 36, 45, 48, 60, 66, 72, 75, 90)],
    f: (a) => q((2 * a) / 3),
    alt: (a) => q(a - a / 3),
    t: {
      "half-of-total": (a) => (a % 2 === 0 ? q(a / 2) : null),
      smaller: (a) => q(a / 3),
      total: (a) => q(a),
    },
    c: [2, 3],
    origin: {
      olympiad: "parts of a whole: one sector twice the other (RES-4288)",
    },
  }),
];

const S5_global = calc("S5", "global");
const S5_global_specs: readonly Spec<never>[] = [
  S5_global({
    id: "S5.global.01",
    form: "the-hour-of-the-highest-reading",
    g: [6, 7],
    kind: "integer",
    p: [rg(5, 25), rg(5, 25), rg(5, 25), rg(5, 25)],
    ok: (a, b, c, d) => new Set([a, b, c, d]).size === 4,
    f: (a, b, c, d) =>
      q(at([6, 9, 12, 15], [a, b, c, d].indexOf(Math.max(a, b, c, d)))),
    t: {
      temperature: (a, b, c, d) => q(Math.max(a, b, c, d)),
      "last-hour": () => q(15),
    },
    c: [6, 9, 12, 15],
  }),
  S5_global({
    id: "S5.global.02",
    form: "the-rise-between-two-readings",
    g: [6, 7],
    kind: "integer",
    p: [rg(3, 10), rg(11, 20)],
    f: (a, b) => q(b - a),
    t: { sum: (a, b) => q(a + b), hours: () => q(12 - 9) },
    c: [9, 12],
  }),
  S5_global({
    id: "S5.global.03",
    form: "the-fall-per-hour",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 6), rg(2, 5), rg(10, 18)],
    ok: (a, b) => a !== b,
    f: (a) => q(a),
    t: { total: (a, b) => q(a * b), hours: (a, b) => q(b) },
    x: (a, b, c) => ({ x: String(c + a * b), y: String(c) }),
    c: [12],
  }),
  S5_global({
    id: "S5.global.04",
    form: "the-reading-between-two-points",
    g: [6, 7],
    kind: "integer",
    p: [of(10, 14, 16, 20), of(20, 24, 26, 30)],
    f: (a, b) => q((a + b) / 2),
    t: {
      "first-reading": (a) => q(a),
      "second-reading": (a, b) => q(b),
      "sum-not-halved": (a, b) => q(a + b),
    },
    c: [2, 10, 11, 12],
  }),
  S5_global({
    id: "S5.global.05",
    form: "the-level-after-more-hours",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 6), rg(5, 20), rg(2, 6)],
    ok: (a, b, c) => a !== c && c > 1,
    f: (a, b, c) => q(b + a * c),
    t: {
      "rise-only": (a, b, c) => q(a * c),
      "one-hour": (a, b) => q(b + a),
      "all-multiplied": (a, b, c) => q((a + b) * c),
    },
  }),
  S5_global({
    id: "S5.global.06",
    form: "the-time-to-reach-a-level",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 6), rg(5, 20), rg(2, 6)],
    ok: (a, b, c) => a !== c && c > 1,
    f: (a, b, c) => q(c),
    t: {
      rise: (a, b, c) => q(a * c),
      level: (a, b, c) => q(b + a * c),
      "level-not-reduced": (a, b, c) =>
        (b + a * c) % a === 0 ? q((b + a * c) / a) : null,
    },
    x: (a, b, c) => ({ x: String(b + a * c) }),
  }),
  S5_global({
    id: "S5.global.07",
    form: "the-readings-above-a-level",
    g: [6, 7],
    kind: "integer",
    p: [rg(5, 25), rg(5, 25), rg(5, 25), rg(5, 25), rg(12, 18)],
    ok: (a, b, c, d, e) => Math.max(a, b, c, d) - e >= 2,
    f: (a, b, c, d, e) => q(Math.max(a, b, c, d) - e),
    alt: (a, b, c, d, e) => q(Math.max(a - e, b - e, c - e, d - e)),
    t: {
      highest: (a, b, c, d) => q(Math.max(a, b, c, d)),
      norm: (a, b, c, d, e) => q(e),
      count: (a, b, c, d, e) => {
        const w = [a, b, c, d].filter((z) => z > e).length;
        return w === Math.max(a, b, c, d) - e ? null : q(w);
      },
    },
  }),
  S5_global({
    id: "S5.global.08",
    form: "the-line-of-a-steady-fall",
    g: [6, 7],
    kind: "choice",
    p: [rg(0, 23)],
    f: (k) => place(k, 0),
    t: {
      upward: (k) => place(k, 1),
      horizontal: (k) => place(k, 2),
      "steeper-and-steeper": (k) => place(k, 3),
    },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
  }),
  S5_global({
    id: "S5.global.09",
    form: "the-line-of-a-stop",
    g: [6, 7],
    kind: "choice",
    p: [rg(0, 23)],
    f: (k) => place(k, 0),
    t: {
      upward: (k) => place(k, 1),
      downward: (k) => place(k, 2),
      "up-then-down": (k) => place(k, 3),
    },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
  }),
  S5_global({
    id: "S5.global.10",
    form: "the-line-of-a-trip-there-and-back",
    g: [6, 7],
    kind: "choice",
    p: [rg(0, 23)],
    f: (k) => place(k, 0),
    t: {
      upward: (k) => place(k, 1),
      downward: (k) => place(k, 2),
      horizontal: (k) => place(k, 3),
    },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
  }),
  S5_global({
    id: "S5.global.11",
    form: "the-hour-of-the-fastest-run",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 9), rg(2, 9), rg(2, 9)],
    ok: (a, b, c) => a !== b && b !== c && a !== c,
    f: (a, b, c) => q(at([1, 2, 3], [a, b, c].indexOf(Math.max(a, b, c)))),
    t: { distance: (a, b, c) => q(Math.max(a, b, c)), last: () => q(3) },
    c: [1, 2, 3],
  }),
  S5_global({
    id: "S5.global.12",
    form: "the-distance-over-three-hours",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 9), rg(2, 9), rg(2, 9)],
    ok: (a, b, c) => a !== b && b !== c && a !== c,
    f: (a, b, c) => q(a + b + c),
    t: {
      fastest: (a, b, c) => q(Math.max(a, b, c)),
      "two-hours": (a, b) => q(a + b),
    },
  }),
  S5_global({
    id: "S5.global.13",
    form: "the-fastest-of-three-lines",
    g: [6, 7],
    kind: "choice",
    p: [rg(0, 5), rg(1, 2), rg(3, 4), rg(5, 7)],
    f: (k) => place(k, 2, 3),
    t: {
      slowest: (k) => place(k, 0, 3),
      middle: (k) => place(k, 1, 3),
    },
    options: () => ["1", "2", "3"],
    c: [1, 2, 3],
  }),
  S5_global({
    id: "S5.global.14",
    form: "the-chart-for-a-change-in-time",
    g: [8, 8],
    kind: "choice",
    p: [rg(0, 19)],
    f: () => "3",
    t: { pie: () => "1", pictogram: () => "2" },
    options: () => ["1", "2", "3"],
    c: [1, 2, 3],
  }),
  S5_global({
    id: "S5.global.15",
    form: "the-graph-of-a-walk-with-a-stop",
    g: [6, 7],
    kind: "choice",
    p: [rg(0, 23)],
    f: (k) => place(k, 0),
    t: {
      "no-stop": (k) => place(k, 1),
      stays: (k) => place(k, 2),
      "stop-first": (k) => place(k, 3),
    },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
  }),
  S5_global({
    id: "S5.global.16",
    form: "the-graph-of-pouring-fast-then-slowly",
    g: [6, 8],
    kind: "choice",
    p: [rg(0, 23)],
    f: (k) => place(k, 0),
    t: {
      straight: (k) => place(k, 1),
      "slow-then-fast": (k) => place(k, 2),
      falling: (k) => place(k, 3),
    },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
    origin: {
      olympiad:
        "the slope of a graph tells how fast a quantity changes (RES-4288)",
    },
  }),
  S5_global({
    id: "S5.global.17",
    form: "the-value-further-along-a-straight-line",
    g: [6, 7],
    kind: "integer",
    p: [rg(1, 4), rg(2, 3), rg(5, 15), rg(2, 5), rg(2, 4)],
    ok: (a, b, c, d, e) => e !== b,
    f: (a, b, c, d, e) => q(c + d * (b + e)),
    alt: (a, b, c, d, e) => q(c + b * d + e * d),
    t: {
      "hours-added": (a, b, c, d, e) => q(c + b * d + e),
      "same-rise": (a, b, c, d) => q(c + 2 * b * d),
    },
    x: (a, b, c, d) => ({ v: String(c + b * d) }),
  }),
];

const S5_global_1S = calc("S5", "global-1S");
const S5_global_1S_specs: readonly Spec<never>[] = [
  S5_global_1S({
    id: "S5.global-1S.01",
    form: "the-next-value-of-a-steady-rise",
    g: [8, 8],
    kind: "integer",
    p: [rg(5, 30), rg(2, 9)],
    f: (a, b) => q(a + 3 * b),
    t: {
      "last-value": (a, b) => q(a + 2 * b),
      "double-step": (a, b) => q(a + 4 * b),
    },
    x: (a, b) => ({ y: String(a + b), z: String(a + 2 * b) }),
    c: [1],
  }),
  S5_global_1S({
    id: "S5.global-1S.02",
    form: "the-value-after-several-years",
    g: [8, 8],
    kind: "integer",
    p: [rg(10, 40), rg(2, 9), rg(3, 8)],
    ok: (a, b, c) => b !== c,
    f: (a, b, c) => q(a + b * c),
    t: {
      "rise-only": (a, b, c) => q(b * c),
      "one-year": (a, b) => q(a + b),
      "all-multiplied": (a, b, c) => q((a + b) * c),
    },
  }),
  S5_global_1S({
    id: "S5.global-1S.03",
    form: "the-year-when-the-value-is-reached",
    g: [8, 8],
    kind: "integer",
    p: [rg(10, 40), rg(2, 9), rg(3, 8)],
    ok: (a, b, c) => b !== c,
    f: (a, b, c) => q(c),
    t: {
      rise: (a, b, c) => q(b * c),
      target: (a, b, c) => q(a + b * c),
      "level-not-reduced": (a, b, c) =>
        (a + b * c) % b === 0 ? q((a + b * c) / b) : null,
    },
    x: (a, b, c) => ({ x: String(a + b * c) }),
  }),
  S5_global_1S({
    id: "S5.global-1S.04",
    form: "the-average-rise-per-year",
    g: [8, 8],
    kind: "integer",
    p: [rg(10, 30), rg(2, 9), rg(2, 6)],
    ok: (a, b, c) => b !== c,
    f: (a, b) => q(b),
    t: { total: (a, b, c) => q(b * c), years: (a, b, c) => q(c) },
    x: (a, b, c) => ({ x: String(a + b * c) }),
  }),
  S5_global_1S({
    id: "S5.global-1S.05",
    form: "the-largest-jump",
    g: [8, 8],
    kind: "integer",
    p: [rg(5, 15), rg(5, 15), rg(5, 15), rg(5, 15)],
    ok: (a, b, c, d) =>
      a !== b &&
      b !== c &&
      c !== d &&
      Math.max(Math.abs(b - a), Math.abs(c - b), Math.abs(d - c)) !==
        Math.abs(b - a) &&
      Math.max(a, b, c, d) - Math.min(a, b, c, d) !==
        Math.max(Math.abs(b - a), Math.abs(c - b), Math.abs(d - c)),
    f: (a, b, c, d) =>
      q(Math.max(Math.abs(b - a), Math.abs(c - b), Math.abs(d - c))),
    t: {
      "first-jump": (a, b) => q(Math.abs(b - a)),
      spread: (a, b, c, d) => q(Math.max(a, b, c, d) - Math.min(a, b, c, d)),
    },
  }),
  S5_global_1S({
    id: "S5.global-1S.06",
    form: "the-trend-of-a-rising-row",
    g: [8, 8],
    kind: "choice",
    p: [rg(3, 12), rg(1, 6), rg(1, 6), rg(1, 6)],
    f: () => "4",
    t: { falling: () => "1", constant: () => "2", "up-then-down": () => "3" },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
  }),
  S5_global_1S({
    id: "S5.global-1S.07",
    form: "the-trend-of-a-falling-row",
    g: [8, 8],
    kind: "choice",
    p: [rg(20, 32), rg(1, 6), rg(1, 6), rg(1, 6)],
    f: () => "1",
    t: { rising: () => "2", constant: () => "3", "down-then-up": () => "4" },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
  }),
  S5_global_1S({
    id: "S5.global-1S.08",
    form: "the-trend-of-a-peak",
    g: [8, 8],
    kind: "choice",
    p: [rg(3, 8), rg(2, 6), rg(2, 6), rg(2, 6), rg(1, 5)],
    ok: (a, b, c, d, e) => a + b + c - d - e >= 1,
    f: () => "2",
    t: {
      "only-rising": () => "1",
      "only-falling": () => "3",
      constant: () => "4",
    },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
  }),
  S5_global_1S({
    id: "S5.global-1S.09",
    form: "the-percent-of-growth",
    g: [8, 8],
    kind: "integer",
    p: [of(10, 20, 25, 50, 100, 200), of(10, 20, 25, 50)],
    ok: (a, b) => (a * b) % 100 === 0 && (a * b) / 100 !== b && a !== b,
    f: (a, b) => q(b),
    t: {
      increase: (a, b) => q((a * b) / 100),
      "new-value": (a, b) => q(a + b),
      "of-new-value": (a, b) =>
        (100 * b) % (100 + b) === 0 ? q((100 * b) / (100 + b)) : null,
    },
    x: (a, b) => ({ x: String(a + (a * b) / 100) }),
    c: [100],
  }),
  S5_global_1S({
    id: "S5.global-1S.10",
    form: "the-middle-reading-of-three-years",
    g: [8, 8],
    kind: "integer",
    p: [rg(10, 40), rg(2, 9)],
    f: (a, b) => q(a + b),
    t: {
      first: (a) => q(a),
      third: (a, b) => q(a + 2 * b),
      "step-only": (a, b) => q(b),
    },
    x: (a, b) => ({ x: String(a + 2 * b) }),
    c: [2],
  }),
  S5_global_1S({
    id: "S5.global-1S.11",
    form: "the-forecast-by-the-average-rise",
    g: [8, 8],
    kind: "integer",
    p: [rg(10, 30), rg(2, 9), rg(2, 9), rg(2, 9)],
    ok: (a, b, c, d) =>
      (b + c + d) % 3 === 0 && !(b === c && c === d) && (b + c + d) / 3 !== d,
    f: (a, b, c, d) => q(a + b + c + d + (b + c + d) / 3),
    alt: (a, b, c, d) => q((3 * (a + b + c + d) + b + c + d) / 3),
    t: {
      "last-rise": (a, b, c, d) => q(a + b + c + 2 * d),
      "total-rise": (a, b, c, d) => q(a + 2 * (b + c + d)),
      "last-value": (a, b, c, d) => q(a + b + c + d),
    },
    c: [3],
  }),
  S5_global_1S({
    id: "S5.global-1S.12",
    form: "the-year-when-two-values-meet",
    g: [8, 8],
    kind: "integer",
    p: [rg(20, 60), rg(4, 9), rg(1, 3), rg(3, 8)],
    f: (a, b, c, d) => q(d),
    alt: (a, b, c, d) => q(((b - c) * d) / (b - c)),
    t: {
      "gap-only": (a, b, c, d) => q((b - c) * d),
      "rate-gap": (a, b, c, d) => (b - c === d ? null : q(b - c)),
      "faster-only": (a, b, c, d) =>
        ((b - c) * d) % b === 0 ? q(((b - c) * d) / b) : null,
    },
    x: (a, b, c, d) => ({ x: String(a + (b - c) * d) }),
    origin: {
      olympiad:
        "catching up: the gap closes by the difference of the rates (RES-4288)",
    },
  }),
  S5_global_1S({
    id: "S5.global-1S.13",
    form: "the-next-value-of-a-slowing-rise",
    g: [8, 8],
    kind: "integer",
    p: [rg(5, 20), rg(6, 12), rg(1, 2)],
    ok: (a, b, s) => b - 3 * s >= 1,
    f: (a, b, s) => q(a + 3 * b - 3 * s + (b - 3 * s)),
    alt: (a, b, s) => q(a + 4 * b - 6 * s),
    t: {
      "last-rise-again": (a, b, s) => q(a + 3 * b - 3 * s + (b - 2 * s)),
      "first-rise": (a, b, s) => q(a + 3 * b - 3 * s + b),
    },
  }),
  S5_global_1S({
    id: "S5.global-1S.14",
    form: "the-graph-that-matches-the-values",
    g: [8, 8],
    kind: "choice",
    p: [rg(2, 20), rg(2, 20), rg(2, 20), rg(2, 20), rg(0, 23)],
    ok: (a, b, c, d) => {
      const up = a < b && b < c && c < d;
      const down = a > b && b > c && c > d;
      return (
        new Set([a, b, c, d]).size === 4 &&
        !up &&
        !down &&
        !(a === d && b === c)
      );
    },
    f: (a, b, c, d, k) => place(k, 0),
    t: {
      "reversed-order": (a, b, c, d, k) => place(k, 1),
      "only-rising": (a, b, c, d, k) => place(k, 2),
      "only-falling": (a, b, c, d, k) => place(k, 3),
    },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
  }),
];

const S6_patterns = calc("S6", "patterns");
const S6_patterns_specs: readonly Spec<never>[] = [
  S6_patterns({
    id: "S6.patterns.01",
    form: "the-next-term-of-a-rising-row",
    g: [3, 5],
    kind: "integer",
    p: [rg(1, 20), rg(2, 9)],
    f: (a, b) => q(a + 4 * b),
    t: {
      last: (a, b) => q(a + 3 * b),
      "double-step": (a, b) => q(a + 5 * b),
      "n-times-step": (a, b) => (a === 2 * b ? null : q(5 * b)),
    },
    x: (a, b) => ({ row: [a, a + b, a + 2 * b, a + 3 * b].join(", ") + ", …" }),
  }),
  S6_patterns({
    id: "S6.patterns.02",
    form: "the-next-term-of-a-falling-row",
    g: [3, 5],
    kind: "integer",
    p: [rg(40, 90), rg(3, 9)],
    f: (a, b) => q(a - 4 * b),
    t: { last: (a, b) => q(a - 3 * b), "double-step": (a, b) => q(a - 5 * b) },
    x: (a, b) => ({ row: [a, a - b, a - 2 * b, a - 3 * b].join(", ") + ", …" }),
  }),
  S6_patterns({
    id: "S6.patterns.03",
    form: "the-tenth-term",
    g: [3, 5],
    kind: "integer",
    p: [rg(1, 9), rg(2, 6)],
    f: (a, b) => q(a + 9 * b),
    t: {
      "ten-steps": (a, b) => q(a + 10 * b),
      "eight-steps": (a, b) => q(a + 8 * b),
      "step-times-ten": (a, b) => (a === 2 * b ? null : q(10 * b)),
    },
    c: [8, 9, 10],
  }),
  S6_patterns({
    id: "S6.patterns.04",
    form: "the-next-term-of-a-doubling-row",
    g: [3, 5],
    kind: "integer",
    p: [rg(1, 6)],
    f: (a) => q(16 * a),
    t: {
      added: (a) => q(8 * a + 2 * a),
      last: (a) => q(8 * a),
      "same-difference": (a) => q(12 * a),
    },
    x: (a) => ({ row: [a, 2 * a, 4 * a, 8 * a].join(", ") + ", …" }),
    c: [2, 8, 16],
  }),
  S6_patterns({
    id: "S6.patterns.05",
    form: "the-colour-of-a-bead",
    g: [3, 5],
    kind: "integer",
    p: [of(3, 4, 5), rg(10, 40)],
    ok: (a, b) => b !== a,
    f: (a, b) => q(((b - 1) % a) + 1),
    t: { position: (a, b) => q(b), remainder: (a, b) => q(b % a) },
    c: [0],
  }),
  S6_patterns({
    id: "S6.patterns.06",
    form: "the-missing-term-in-a-row",
    g: [3, 5],
    kind: "integer",
    p: [rg(1, 20), rg(2, 9)],
    f: (a, b) => q(a + 2 * b),
    t: { before: (a, b) => q(a + b), after: (a, b) => q(a + 3 * b) },
    x: (a, b) => ({ row: [a, a + b, "…", a + 3 * b, a + 4 * b].join(", ") }),
  }),
  S6_patterns({
    id: "S6.patterns.07",
    form: "the-next-square",
    g: [5, 6],
    kind: "integer",
    p: [rg(3, 8)],
    f: (a) => q((a + 1) * (a + 1)),
    t: {
      last: (a) => q(a * a),
      doubled: (a) => q(2 * a * a),
      "twice-the-base": (a) => q(2 * (a + 1)),
    },
    c: [1, 2, 3, 4, 9],
  }),
  S6_patterns({
    id: "S6.patterns.08",
    form: "the-matchsticks-for-triangles-in-a-row",
    g: [3, 5],
    kind: "integer",
    p: [rg(4, 15)],
    f: (a) => q(2 * a + 1),
    t: { separate: (a) => q(3 * a), "two-per-triangle": (a) => q(2 * a) },
    c: [1, 2, 3, 5, 7],
  }),
  S6_patterns({
    id: "S6.patterns.09",
    form: "the-sum-of-the-first-numbers",
    g: [5, 6],
    kind: "integer",
    p: [rg(4, 14)],
    f: (a) => q((a * (a + 1)) / 2),
    t: {
      last: (a) => q(a),
      square: (a) => q(a * a),
      "not-halved": (a) => q(a * (a + 1)),
    },
    c: [1, 2],
  }),
  S6_patterns({
    id: "S6.patterns.10",
    form: "the-step-of-a-row",
    g: [3, 5],
    kind: "integer",
    p: [rg(1, 20), rg(2, 9)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(b),
    t: { first: (a) => q(a), "two-steps": (a, b) => q(2 * b) },
    x: (a, b) => ({ row: [a, a + b, a + 2 * b, a + 3 * b].join(", ") + ", …" }),
  }),
  S6_patterns({
    id: "S6.patterns.11",
    form: "the-alternating-row",
    g: [5, 6],
    kind: "integer",
    p: [rg(10, 30), rg(5, 9), rg(2, 4), rg(2, 5)],
    ok: (a, b, c, d) => b > c && d > 1 && b - c !== 1,
    f: (a, b, c, d) => q(a + d * (b - c)),
    t: {
      "only-additions": (a, b, c, d) => q(a + d * b),
      "one-pair": (a, b, c) => q(a + b - c),
    },
  }),
  S6_patterns({
    id: "S6.patterns.12",
    form: "the-count-of-terms",
    g: [5, 6],
    kind: "integer",
    p: [rg(1, 9), rg(2, 5), rg(5, 12)],
    f: (a, b, c) => q(c + 1),
    t: { steps: (a, b, c) => q(c), next: (a, b, c) => q(c + 2) },
    x: (a, b, c) => ({
      y: String(a + b * c),
      row: [a, a + b, a + 2 * b].join(", ") + ", …",
    }),
    c: [1],
  }),
  S6_patterns({
    id: "S6.patterns.13",
    form: "the-beads-of-the-first-colour",
    g: [4, 5],
    kind: "integer",
    p: [of(3, 4, 5), rg(11, 40)],
    f: (a, b) => q(Math.floor(b / a) + Math.min(1, b % a)),
    alt: (a, b) => q(Math.ceil(b / a)),
    t: {
      "whole-only": (a, b) => (b % a === 0 ? null : q(Math.floor(b / a))),
      "plus-one": (a, b) => q(Math.ceil(b / a) + 1),
    },
    c: [0, 1],
  }),
  S6_patterns({
    id: "S6.patterns.14",
    form: "the-first-term-above-a-limit",
    g: [5, 6],
    kind: "integer",
    p: [rg(3, 12), rg(3, 8), rg(40, 90)],
    ok: (a, b, c) => c > a + 3 * b,
    f: (a, b, c) => q(a + (Math.floor((c - a) / b) + 1) * b),
    alt: (a, b, c) => q(a + Math.ceil((c - a + 1) / b) * b),
    t: {
      "last-not-above": (a, b, c) => q(a + Math.floor((c - a) / b) * b),
      "limit-itself": (a, b, c) => q(c),
      "ceil-step": (a, b, c) => q(a + Math.ceil((c - a) / b) * b),
    },
  }),
  S6_patterns({
    id: "S6.patterns.15",
    form: "the-digits-in-a-row-of-numbers",
    g: [5, 7],
    kind: "integer",
    p: [rg(12, 40)],
    f: (a) => q(9 + 2 * (a - 9)),
    alt: (a) => q(2 * a - 9),
    t: {
      "all-two": (a) => q(2 * a),
      count: (a) => q(a),
      "off-by-one": (a) => q(9 + 2 * (a - 10)),
    },
    c: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    origin: {
      olympiad: "the digits of the numbers written in a row (RES-4288)",
    },
  }),
  S6_patterns({
    id: "S6.patterns.16",
    form: "the-triangles-from-the-matchsticks",
    g: [4, 5],
    kind: "integer",
    p: [rg(5, 20)],
    f: (n) => q(n),
    alt: (n) => q((2 * n + 1 - 3) / 2 + 1),
    t: {
      "without-first": (n) => q(n - 1),
      "one-more": (n) => q(n + 1),
      separate: (n) => ((2 * n + 1) % 3 === 0 ? q((2 * n + 1) / 3) : null),
    },
    x: (n) => ({ s: String(2 * n + 1) }),
    c: [1, 2, 3, 5, 7],
  }),
];

const S6_patterns_1S = calc("S6", "patterns-1S");
const S6_patterns_1S_specs: readonly Spec<never>[] = [
  S6_patterns_1S({
    id: "S6.patterns-1S.01",
    form: "the-row-with-growing-steps",
    g: [5, 8],
    kind: "integer",
    p: [rg(1, 9)],
    f: (a) => q(a + 15),
    t: { last: (a) => q(a + 10), "constant-step": (a) => q(a + 14) },
    x: (a) => ({ row: [a, a + 1, a + 3, a + 6, a + 10].join(", ") + ", …" }),
    c: [1, 2, 3, 4, 5, 15],
  }),
  S6_patterns_1S({
    id: "S6.patterns-1S.02",
    form: "the-next-term-of-a-sum-row",
    g: [5, 8],
    kind: "integer",
    p: [rg(1, 6), rg(1, 6)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(2 * a + 3 * b),
    t: { last: (a, b) => q(a + 2 * b), doubled: (a, b) => q(2 * (a + 2 * b)) },
    x: (a, b) => ({ row: [a, b, a + b, a + 2 * b].join(", ") + ", …" }),
    c: [2],
  }),
  S6_patterns_1S({
    id: "S6.patterns-1S.03",
    form: "the-sum-of-the-first-odd-numbers",
    g: [5, 8],
    kind: "integer",
    p: [rg(3, 12)],
    f: (a) => q(a * a),
    t: { count: (a) => q(a), double: (a) => q(2 * a) },
    c: [1, 2, 3, 5],
  }),
  S6_patterns_1S({
    id: "S6.patterns-1S.04",
    form: "the-term-of-a-square-plus-one-row",
    g: [5, 8],
    kind: "integer",
    p: [rg(5, 15)],
    f: (a) => q(a * a + 1),
    t: { square: (a) => q(a * a), "number-plus-one": (a) => q(a + 1) },
    c: [1, 2, 5, 10, 17],
  }),
  S6_patterns_1S({
    id: "S6.patterns-1S.05",
    form: "the-matchsticks-for-squares-in-a-row",
    g: [5, 8],
    kind: "integer",
    p: [rg(4, 15)],
    f: (a) => q(3 * a + 1),
    t: { separate: (a) => q(4 * a), "three-per-square": (a) => q(3 * a) },
    c: [1, 2, 3, 4, 7, 10],
  }),
  S6_patterns_1S({
    id: "S6.patterns-1S.06",
    form: "the-position-of-a-number-in-a-row",
    g: [5, 8],
    kind: "integer",
    p: [rg(2, 9), rg(2, 5), rg(5, 15)],
    f: (a, b, c) => q(c + 1),
    t: { steps: (a, b, c) => q(c), "value-difference": (a, b, c) => q(b * c) },
    x: (a, b, c) => ({
      y: String(a + b * c),
      row: [a, a + b, a + 2 * b].join(", ") + ", …",
    }),
    c: [1],
  }),
  S6_patterns_1S({
    id: "S6.patterns-1S.07",
    form: "the-row-with-two-alternating-steps",
    g: [5, 8],
    kind: "integer",
    p: [rg(1, 9), rg(2, 4), rg(5, 8)],
    ok: (a, b, c) => b !== c,
    f: (a, b, c) => q(a + 3 * (b + c)),
    t: {
      "last-shown": (a, b, c) => q(a + 2 * (b + c)),
      "single-step": (a, b) => q(a + 6 * b),
    },
    x: (a, b, c) => ({
      row:
        [a, a + b, a + b + c, a + 2 * b + c, a + 2 * (b + c)].join(", ") +
        ", …",
    }),
    c: [3, 7],
  }),
  S6_patterns_1S({
    id: "S6.patterns-1S.08",
    form: "the-next-cube",
    g: [5, 8],
    kind: "integer",
    p: [rg(2, 9)],
    f: (a) => q((a + 1) * (a + 1) * (a + 1)),
    t: { last: (a) => q(a * a * a), square: (a) => q((a + 1) * (a + 1)) },
    c: [1, 2, 8, 27],
  }),
  S6_patterns_1S({
    id: "S6.patterns-1S.09",
    form: "the-multiples-up-to-a-limit",
    g: [5, 8],
    kind: "integer",
    p: [rg(2, 6), rg(4, 9)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(b),
    t: { limit: (a, b) => q(a * b), "one-more": (a, b) => q(b + 1) },
    x: (a, b) => ({ x: String(a * b) }),
    c: [1, 2, 3],
  }),
  S6_patterns_1S({
    id: "S6.patterns-1S.10",
    form: "the-sum-of-a-repeating-row",
    g: [5, 8],
    kind: "integer",
    p: [rg(1, 5), rg(1, 5), rg(1, 5), rg(2, 6)],
    ok: (a, b, c, d) =>
      a !== b &&
      b !== c &&
      a !== c &&
      d > 1 &&
      3 * d !== d * (a + b + c) &&
      a + b + c !== d * (a + b + c),
    f: (a, b, c, d) => q(d * (a + b + c)),
    t: {
      "one-triple": (a, b, c) => q(a + b + c),
      terms: (a, b, c, d) => q(3 * d),
    },
    x: (a, b, c, d) => ({ x: String(3 * d) }),
    c: [3],
  }),
  S6_patterns_1S({
    id: "S6.patterns-1S.11",
    form: "the-term-with-doubling-and-adding",
    g: [5, 8],
    kind: "integer",
    p: [rg(1, 3), rg(2, 4)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(2 * (2 * (2 * a + b) + b) + b),
    t: {
      third: (a, b) => q(2 * (2 * a + b) + b),
      "doubling-only": (a) => q(8 * a),
    },
    c: [2, 8],
  }),
  S6_patterns_1S({
    id: "S6.patterns-1S.12",
    form: "the-sum-of-powers-of-two",
    g: [7, 8],
    kind: "integer",
    p: [rg(4, 9)],
    f: (a) => q(2 ** a - 1),
    alt: (a) =>
      q(Array.from({ length: a }, (_, i) => 2 ** i).reduce((x, y) => x + y, 0)),
    t: {
      "last-term": (a) => q(2 ** (a - 1)),
      power: (a) => q(2 ** a),
    },
    c: [1, 2, 4, 8],
    origin: {
      olympiad:
        "doubling: the sum plus one is the next power of two (RES-4288)",
    },
  }),
  S6_patterns_1S({
    id: "S6.patterns-1S.13",
    form: "the-first-term-from-later-terms",
    g: [6, 8],
    kind: "integer",
    p: [rg(2, 9), rg(2, 9)],
    ok: (a, b) => a !== b,
    f: (a) => q(a),
    alt: (a, b) => q(2 * (a + b) - (a + 2 * b)),
    t: { second: (a, b) => q(b), third: (a, b) => q(a + b) },
    origin: { olympiad: "working backwards through a row of sums (RES-4288)" },
  }),
  S6_patterns_1S({
    id: "S6.patterns-1S.14",
    form: "the-cells-of-a-diamond",
    g: [6, 8],
    kind: "integer",
    p: [rg(5, 12)],
    f: (a) => q(a * a + (a - 1) * (a - 1)),
    alt: (a) => q(2 * a * (a - 1) + 1),
    t: {
      "one-square": (a) => q(a * a),
      double: (a) => q(2 * a * a),
      "plus-side": (a) => q(a * a + a),
    },
    c: [1, 5, 13],
  }),
  S6_patterns_1S({
    id: "S6.patterns-1S.15",
    form: "the-tenth-term-of-growing-steps",
    g: [6, 8],
    kind: "integer",
    p: [rg(1, 9), rg(8, 12)],
    f: (a, b) => q(a + ((b - 1) * b) / 2),
    alt: (a, b) =>
      q(
        a +
          Array.from({ length: b - 1 }, (_, i) => i + 1).reduce(
            (x, y) => x + y,
            0,
          ),
      ),
    t: {
      "all-steps-one": (a, b) => q(a + b - 1),
      "one-more-step": (a, b) => q(a + (b * (b + 1)) / 2),
    },
    c: [1, 2, 3],
  }),
  S6_patterns_1S({
    id: "S6.patterns-1S.16",
    form: "the-numbers-not-divisible-by-two-or-three",
    g: [7, 8],
    kind: "integer",
    p: [(r) => 6 * rg(2, 10)(r)],
    f: (a) => q(a - a / 2 - a / 3 + a / 6),
    alt: (a) => q(a / 3),
    t: {
      "forgot-overlap": (a) => q(a - a / 2 - a / 3),
      "only-odd": (a) => q(a / 2),
    },
    c: [2, 3, 6],
    origin: {
      olympiad:
        "counting with an overlap: numbers divisible by neither 2 nor 3 (RES-4288)",
    },
  }),
];

const S7_median_mode = calc("S7", "median-mode");
const S7_median_mode_specs: readonly Spec<never>[] = [
  S7_median_mode({
    id: "S7.median-mode.01",
    form: "the-median-of-five-numbers",
    g: [8, 8],
    kind: "integer",
    p: [rg(1, 30), rg(1, 30), rg(1, 30), rg(1, 30), rg(1, 30)],
    ok: (a, b, c, d, e) =>
      new Set([a, b, c, d, e]).size === 5 &&
      sortedAt([a, b, c, d, e], 2) !== a &&
      sortedAt([a, b, c, d, e], 2) !== c,
    f: (a, b, c, d, e) => q(sortedAt([a, b, c, d, e], 2)),
    t: {
      "first-number": (a) => q(a),
      "middle-written": (a, b, c) => q(c),
      mean: (a, b, c, d, e) =>
        (a + b + c + d + e) % 5 === 0 &&
        (a + b + c + d + e) / 5 !== a &&
        (a + b + c + d + e) / 5 !== c
          ? q((a + b + c + d + e) / 5)
          : null,
    },
    origin: {
      extension: "the median and the mode, Russian grade 7 (RES-4288)",
    },
  }),
  S7_median_mode({
    id: "S7.median-mode.02",
    form: "the-median-of-three-numbers",
    g: [8, 8],
    kind: "integer",
    p: [rg(1, 40), rg(1, 40), rg(1, 40)],
    ok: (a, b, c) => new Set([a, b, c]).size === 3,
    f: (a, b, c) => q(sortedAt([a, b, c], 1)),
    t: {
      largest: (a, b, c) => q(Math.max(a, b, c)),
      smallest: (a, b, c) => q(Math.min(a, b, c)),
    },
    origin: {
      extension: "the median and the mode, Russian grade 7 (RES-4288)",
    },
  }),
  S7_median_mode({
    id: "S7.median-mode.03",
    form: "the-median-of-four-numbers",
    g: [8, 8],
    kind: "integer",
    p: [rg(1, 20), rg(1, 20), rg(1, 20), rg(1, 20)],
    ok: (a, b, c, d) =>
      new Set([a, b, c, d]).size === 4 &&
      (sortedAt([a, b, c, d], 1) + sortedAt([a, b, c, d], 2)) % 2 === 0 &&
      (a + b + c + d) % 4 === 0 &&
      (a + b + c + d) / 4 !==
        (sortedAt([a, b, c, d], 1) + sortedAt([a, b, c, d], 2)) / 2,
    f: (a, b, c, d) =>
      q((sortedAt([a, b, c, d], 1) + sortedAt([a, b, c, d], 2)) / 2),
    t: {
      "second-number": (a, b, c, d) => q(sortedAt([a, b, c, d], 1)),
      mean: (a, b, c, d) => q((a + b + c + d) / 4),
      "unordered-middle": (a, b, c, d) => {
        const w = (b + c) / 2;
        return Number.isInteger(w) &&
          w !== sortedAt([a, b, c, d], 1) &&
          w !== (a + b + c + d) / 4
          ? q(w)
          : null;
      },
    },
    origin: {
      extension: "the median and the mode, Russian grade 7 (RES-4288)",
    },
  }),
  S7_median_mode({
    id: "S7.median-mode.04",
    form: "the-mode-of-a-set",
    g: [8, 8],
    kind: "integer",
    p: [rg(1, 9), rg(10, 20), rg(21, 30), rg(31, 40)],
    f: (a) => q(a),
    t: { "first-number": (a, b) => q(b), "last-number": (a, b, c, d) => q(d) },
    origin: {
      extension: "the median and the mode, Russian grade 7 (RES-4288)",
    },
  }),
  S7_median_mode({
    id: "S7.median-mode.05",
    form: "the-range-of-a-set",
    g: [8, 8],
    kind: "integer",
    p: [rg(1, 30), rg(1, 30), rg(1, 30), rg(1, 30)],
    ok: (a, b, c, d) =>
      new Set([a, b, c, d]).size === 4 &&
      Math.min(a, b, c, d) !== Math.max(a, b, c, d) - Math.min(a, b, c, d),
    f: (a, b, c, d) => q(Math.max(a, b, c, d) - Math.min(a, b, c, d)),
    t: {
      largest: (a, b, c, d) => q(Math.max(a, b, c, d)),
      "sum-of-extremes": (a, b, c, d) =>
        q(Math.max(a, b, c, d) + Math.min(a, b, c, d)),
    },
    origin: {
      extension: "the median and the mode, Russian grade 7 (RES-4288)",
    },
  }),
  S7_median_mode({
    id: "S7.median-mode.06",
    form: "the-count-of-the-mode",
    g: [8, 8],
    kind: "integer",
    p: [rg(1, 9), rg(2, 4)],
    ok: (a, b) => b > 1,
    f: (a, b) => q(b),
    t: { all: (a, b) => q(b + 5), others: () => q(5) },
    x: (a, b) => ({ x: String(b + 5), y: String(5) }),
    c: [5],
    origin: {
      extension: "the median and the mode, Russian grade 7 (RES-4288)",
    },
  }),
  S7_median_mode({
    id: "S7.median-mode.07",
    form: "the-median-compared-with-the-mean",
    g: [8, 8],
    kind: "compare",
    p: [rg(1, 30), rg(1, 30), rg(1, 30)],
    ok: (a, b, c) =>
      new Set([a, b, c]).size === 3 &&
      (a + b + c) % 3 === 0 &&
      sortedAt([a, b, c], 1) !== (a + b + c) / 3,
    f: (a, b, c) => sign(q(sortedAt([a, b, c], 1)), q((a + b + c) / 3)),
    t: {
      reversed: (a, b, c) => {
        const m = (a + b + c) / 3;
        const w = sign(q(m), q(sortedAt([a, b, c], 1)));
        return w === sign(q(b), q(m)) ? null : w;
      },
      "unordered-middle": (a, b, c) => {
        const m = (a + b + c) / 3;
        const w = sign(q(b), q(m));
        return w === sign(q(sortedAt([a, b, c], 1)), q(m)) ? null : w;
      },
    },
    c: [3],
    origin: {
      extension: "the median and the mode, Russian grade 7 (RES-4288)",
    },
  }),
  S7_median_mode({
    id: "S7.median-mode.08",
    form: "the-place-of-the-median",
    g: [8, 8],
    kind: "integer",
    p: [of(5, 7, 9, 11, 13, 15)],
    f: (a) => q((a + 1) / 2),
    t: { half: (a) => q((a - 1) / 2), last: (a) => q(a) },
    c: [1, 2],
    origin: {
      extension: "the median and the mode, Russian grade 7 (RES-4288)",
    },
  }),
  S7_median_mode({
    id: "S7.median-mode.09",
    form: "the-sum-of-the-extremes",
    g: [8, 8],
    kind: "integer",
    p: [rg(1, 30), rg(1, 30), rg(1, 30), rg(1, 30)],
    ok: (a, b, c, d) =>
      new Set([a, b, c, d]).size === 4 &&
      Math.min(a, b, c, d) !== Math.max(a, b, c, d) - Math.min(a, b, c, d),
    f: (a, b, c, d) => q(Math.max(a, b, c, d) + Math.min(a, b, c, d)),
    t: {
      range: (a, b, c, d) => q(Math.max(a, b, c, d) - Math.min(a, b, c, d)),
      largest: (a, b, c, d) => q(Math.max(a, b, c, d)),
    },
    origin: {
      extension: "the median and the mode, Russian grade 7 (RES-4288)",
    },
  }),
  S7_median_mode({
    id: "S7.median-mode.10",
    form: "the-median-after-adding-a-large-number",
    g: [8, 8],
    kind: "integer",
    p: [rg(1, 10), rg(12, 20), rg(22, 30), rg(40, 60)],
    ok: (a, b, c) => (b + c) % 2 === 0 && (b + c) / 2 !== b,
    f: (a, b, c) => q((b + c) / 2),
    t: { "old-median": (a, b) => q(b), "new-number": (a, b, c, d) => q(d) },
    origin: {
      extension: "the median and the mode, Russian grade 7 (RES-4288)",
    },
  }),
  S7_median_mode({
    id: "S7.median-mode.11",
    form: "the-mode-of-the-repeated-pair",
    g: [8, 8],
    kind: "integer",
    p: [rg(1, 9), rg(10, 20), rg(21, 30)],
    f: (a, b) => q(b),
    t: { "first-number": (a) => q(a), "last-number": (a, b, c) => q(c) },
    origin: {
      extension: "the median and the mode, Russian grade 7 (RES-4288)",
    },
  }),
  S7_median_mode({
    id: "S7.median-mode.12",
    form: "the-median-of-seven-numbers",
    g: [8, 8],
    kind: "integer",
    p: [
      rg(1, 40),
      rg(1, 40),
      rg(1, 40),
      rg(1, 40),
      rg(1, 40),
      rg(1, 40),
      rg(1, 40),
    ],
    ok: (a, b, c, d, e, f, g) =>
      new Set([a, b, c, d, e, f, g]).size === 7 &&
      sortedAt([a, b, c, d, e, f, g], 3) !== a &&
      sortedAt([a, b, c, d, e, f, g], 3) !== d,
    f: (a, b, c, d, e, f, g) => q(sortedAt([a, b, c, d, e, f, g], 3)),
    t: {
      "first-number": (a) => q(a),
      "middle-written": (a, b, c, d) => q(d),
      mean: (a, b, c, d, e, f, g) =>
        (a + b + c + d + e + f + g) % 7 === 0 &&
        (a + b + c + d + e + f + g) / 7 !== a &&
        (a + b + c + d + e + f + g) / 7 !== d
          ? q((a + b + c + d + e + f + g) / 7)
          : null,
    },
    c: [4],
    origin: {
      extension: "the median and the mode, Russian grade 7 (RES-4288)",
    },
  }),
  S7_median_mode({
    id: "S7.median-mode.13",
    form: "the-mode-from-a-frequency-table",
    g: [8, 8],
    kind: "integer",
    p: [rg(30, 36), rg(2, 9), rg(2, 9), rg(2, 9)],
    ok: (s, x, y, z) => new Set([x, y, z]).size === 3,
    f: (s, x, y, z) => q(s + [x, y, z].indexOf(Math.max(x, y, z))),
    t: {
      count: (s, x, y, z) => q(Math.max(x, y, z)),
      "middle-size": (s) => q(s + 1),
      "largest-size": (s) => q(s + 2),
    },
    x: (s, x, y, z) => ({ k: String([x, y, z].indexOf(Math.max(x, y, z))) }),
    c: [0, 1, 2],
    origin: {
      extension: "the median and the mode, Russian grade 7 (RES-4288)",
    },
  }),
  S7_median_mode({
    id: "S7.median-mode.14",
    form: "the-median-with-a-half",
    g: [8, 8],
    kind: "decimal",
    p: [rg(1, 20), rg(1, 20), rg(1, 20), rg(1, 20)],
    ok: (a, b, c, d) =>
      new Set([a, b, c, d]).size === 4 &&
      (sortedAt([a, b, c, d], 1) + sortedAt([a, b, c, d], 2)) % 2 === 1,
    f: (a, b, c, d) =>
      q(sortedAt([a, b, c, d], 1) + sortedAt([a, b, c, d], 2), 2),
    alt: (a, b, c, d) =>
      q(sortedAt([a, b, c, d], 1), 1).add(
        q(sortedAt([a, b, c, d], 2) - sortedAt([a, b, c, d], 1), 2),
      ),
    t: {
      "second-number": (a, b, c, d) => q(sortedAt([a, b, c, d], 1)),
      "unordered-middle": (a, b, c) => q(b + c, 2),
      mean: (a, b, c, d) => q(a + b + c + d, 4),
    },
    c: [2],
    origin: {
      extension: "the median and the mode, Russian grade 7 (RES-4288)",
    },
  }),
  S7_median_mode({
    id: "S7.median-mode.15",
    form: "the-median-after-replacing-the-smallest",
    g: [8, 8],
    kind: "integer",
    p: [rg(1, 40), rg(1, 40), rg(1, 40), rg(1, 40), rg(1, 40), rg(1, 40)],
    ok: (a, b, c, d, e, f) => {
      const all = [a, b, c, d, e, f];
      return (
        new Set(all).size === 6 &&
        (sortedAt(all, 3) + sortedAt(all, 4)) % 2 === 0
      );
    },
    f: (a, b, c, d, e, f) => {
      const all = [a, b, c, d, e, f];
      return q((sortedAt(all, 3) + sortedAt(all, 4)) / 2);
    },
    t: {
      "old-median": (a, b, c, d, e, f) => {
        const all = [a, b, c, d, e, f];
        const w = sortedAt(all, 2) + sortedAt(all, 3);
        return w % 2 === 0 ? q(w / 2) : null;
      },
      "with-new-number": (a, b, c, d, e, f) => {
        const w = Math.max(a, b, c, d, e, f) + 100;
        return w % 2 === 0 ? q(w / 2) : null;
      },
    },
    c: [100],
    origin: {
      olympiad: "what changes when one number of a set is replaced (RES-4288)",
    },
  }),
  S7_median_mode({
    id: "S7.median-mode.16",
    form: "the-largest-from-the-mean-and-the-median",
    g: [8, 8],
    kind: "integer",
    p: [rg(10, 20), rg(8, 18), rg(2, 7)],
    ok: (a, b, c) => 3 * a - b - c >= b + 1 && b > c,
    f: (a, b, c) => q(3 * a - b - c),
    alt: (a, b, c) => q(3 * a - (b + c)),
    t: {
      "mean-itself": (a) => q(a),
      "no-median": (a, b, c) => q(3 * a - c),
      sum: (a) => q(3 * a),
    },
    c: [3],
    origin: {
      olympiad:
        "the mean and the median of three numbers fix the third (RES-4288)",
    },
  }),
  S7_median_mode({
    id: "S7.median-mode.17",
    form: "the-most-different-numbers-with-a-mode",
    g: [8, 8],
    kind: "integer",
    p: [rg(8, 14), rg(3, 4)],
    f: (a, b) => q(a - b + 1),
    alt: (a, b) => q(1 + (a - b)),
    t: {
      "without-mode": (a, b) => q(a - b),
      count: (a) => q(a),
    },
    c: [1],
    origin: {
      olympiad:
        "the most different numbers a set with a given mode can hold (RES-4288)",
    },
  }),
  S7_median_mode({
    id: "S7.median-mode.18",
    form: "the-smallest-sum-with-a-given-median",
    g: [8, 8],
    kind: "integer",
    p: [rg(5, 15)],
    f: (a) => q(3 * a + 6),
    alt: (a) => q(1 + 2 + a + (a + 1) + (a + 2)),
    t: {
      "all-equal": (a) => q(5 * a),
      "zero-allowed": (a) => q(3 * a + 4),
      "equal-right": (a) => q(3 * a + 3),
    },
    c: [1, 2, 3],
    origin: {
      olympiad:
        "the smallest sum of different whole numbers with a given median (RES-4288)",
    },
  }),
];

/** What each drawn number stands for, by template id, for the story that ADR-0130 writes around the numbers. */
const ROLES: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  "S4.pie.01": { a: "people asked", b: "percent of the circle for one answer" },
  "S4.pie.02": { a: "number of equal sectors" },
  "S4.pie.03": {
    a: "percent of the first sector",
    b: "percent of the second sector",
    c: "percent of the third sector",
  },
  "S4.pie.04": { a: "percent of the circle for the sector" },
  "S4.pie.05": { a: "people asked", b: "people who chose one answer" },
  "S4.pie.06": { a: "percent of the circle that is shaded" },
  "S4.pie.07": {
    a: "people asked",
    b: "percent of the first sector",
    c: "percent of the second sector",
  },
  "S4.pie.08": {
    a: "people asked",
    b: "percent of the first sector",
    c: "percent of the second sector",
  },
  "S4.pie.09": {
    a: "people in one sector",
    b: "number of equal sectors in the circle",
  },
  "S4.pie.10": {
    a: "percent of the first sector",
    b: "percent of the second sector",
    c: "percent of the third sector",
  },
  "S4.pie.11": {
    a: "percent of the first sector",
    b: "denominator of the second sector",
    c: "numerator of the second sector",
  },
  "S4.pie.12": { a: "number of equal sectors", b: "number of shaded sectors" },
  "S4.pie.13": { a: "children in the class" },
  "S4.pie.14": {
    a: "parts of the first sector",
    b: "parts of the second sector",
    c: "parts of the third sector",
  },
  "S4.pie.15": { a: "percent taken by the two sectors together" },
  "S5.global.01": {
    a: "reading at 6",
    b: "reading at 9",
    c: "reading at 12",
    d: "reading at 15",
  },
  "S5.global.02": { a: "temperature at 9", b: "temperature at 12" },
  "S5.global.03": {
    a: "fall per hour",
    b: "number of hours",
    c: "temperature at the end",
  },
  "S5.global.04": { a: "temperature at 10", b: "temperature at 12" },
  "S5.global.05": { a: "rise per hour", b: "level now", c: "number of hours" },
  "S5.global.06": {
    a: "rise per hour",
    b: "level now",
    c: "number of hours to the target",
  },
  "S5.global.07": {
    a: "first reading",
    b: "second reading",
    c: "third reading",
    d: "fourth reading",
    e: "the norm",
  },
  "S5.global.11": {
    a: "distance in the first hour",
    b: "distance in the second hour",
    c: "distance in the third hour",
  },
  "S5.global.12": {
    a: "distance in the first hour",
    b: "distance in the second hour",
    c: "distance in the third hour",
  },
  "S5.global.13": {
    a: "which order the lines are drawn in",
    b: "slope of the slowest line",
    c: "slope of the middle line",
    d: "slope of the fastest line",
  },
  "S5.global.17": {
    a: "hour of the first point",
    b: "hours between the two points",
    c: "temperature at the first point",
    d: "rise per hour",
    e: "hours after the second point",
  },
  "S5.global-1S.01": { a: "first value", b: "rise per year" },
  "S5.global-1S.02": {
    a: "value now",
    b: "rise per year",
    c: "number of years",
  },
  "S5.global-1S.03": {
    a: "value now",
    b: "rise per year",
    c: "years to the target",
  },
  "S5.global-1S.04": {
    a: "first value",
    b: "rise per year",
    c: "number of years",
  },
  "S5.global-1S.06": {
    a: "first value",
    b: "first rise",
    c: "second rise",
    d: "third rise",
  },
  "S5.global-1S.07": {
    a: "first value",
    b: "first fall",
    c: "second fall",
    d: "third fall",
  },
  "S5.global-1S.08": {
    a: "first value",
    b: "first rise",
    c: "second rise",
    d: "first fall",
    e: "second fall",
  },
  "S5.global-1S.09": { a: "value at the start", b: "percent of growth" },
  "S5.global-1S.10": { a: "value in the first year", b: "rise per year" },
  "S5.global-1S.11": {
    a: "first value",
    b: "first rise",
    c: "second rise",
    d: "third rise",
  },
  "S5.global-1S.12": {
    a: "value of A now",
    b: "yearly rise of A",
    c: "yearly rise of B",
    d: "years until they meet",
  },
  "S5.global-1S.13": {
    a: "first value",
    b: "first rise",
    c: "how much each rise is smaller than the one before",
  },
  "S5.global-1S.14": {
    a: "first value",
    b: "second value",
    c: "third value",
    d: "fourth value",
    e: "which order the graphs are drawn in",
  },
  "S6.patterns.01": { a: "first number", b: "step" },
  "S6.patterns.02": { a: "first number", b: "step" },
  "S6.patterns.03": { a: "first number", b: "step" },
  "S6.patterns.04": { a: "first number" },
  "S6.patterns.05": { a: "colours in the pattern", b: "number of the bead" },
  "S6.patterns.06": { a: "first number", b: "step" },
  "S6.patterns.07": { a: "number of the last square written" },
  "S6.patterns.08": { a: "number of triangles in the row" },
  "S6.patterns.09": { a: "last number to add" },
  "S6.patterns.10": { a: "first number", b: "step" },
  "S6.patterns.11": {
    a: "starting number",
    b: "amount added",
    c: "amount subtracted",
    d: "number of repeats",
  },
  "S6.patterns.12": { a: "first number", b: "step", c: "number of steps" },
  "S6.patterns.13": { a: "colours in the pattern", b: "beads taken" },
  "S6.patterns.14": { a: "first number", b: "step", c: "the limit" },
  "S6.patterns.15": { a: "last number written" },
  "S6.patterns.16": { a: "triangles in the row" },
  "S6.patterns-1S.01": { a: "first number" },
  "S6.patterns-1S.02": { a: "first number", b: "second number" },
  "S6.patterns-1S.03": { a: "how many odd numbers" },
  "S6.patterns-1S.04": { a: "number of the term asked" },
  "S6.patterns-1S.05": { a: "number of squares in the row" },
  "S6.patterns-1S.06": {
    a: "first number",
    b: "step",
    c: "steps to the number asked",
  },
  "S6.patterns-1S.07": { a: "first number", b: "first step", c: "second step" },
  "S6.patterns-1S.08": { a: "base of the last cube written" },
  "S6.patterns-1S.09": {
    a: "the number whose multiples are counted",
    b: "how many multiples fit",
  },
  "S6.patterns-1S.10": {
    a: "first number of the repeating triple",
    b: "second number",
    c: "third number",
    d: "number of repeats",
  },
  "S6.patterns-1S.11": { a: "first term", b: "amount added after doubling" },
  "S6.patterns-1S.12": { a: "how many terms are added" },
  "S6.patterns-1S.13": { a: "first term", b: "second term" },
  "S6.patterns-1S.14": { a: "number of the diamond" },
  "S6.patterns-1S.15": { a: "first term", b: "number of the term asked" },
  "S6.patterns-1S.16": { a: "the largest number counted" },
  "S7.median-mode.01": {
    a: "first number",
    b: "second number",
    c: "third number",
    d: "fourth number",
    e: "fifth number",
  },
  "S7.median-mode.02": {
    a: "first number",
    b: "second number",
    c: "third number",
  },
  "S7.median-mode.03": {
    a: "first number",
    b: "second number",
    c: "third number",
    d: "fourth number",
  },
  "S7.median-mode.04": {
    a: "the repeated number",
    b: "first other number",
    c: "second other number",
    d: "third other number",
  },
  "S7.median-mode.05": {
    a: "first number",
    b: "second number",
    c: "third number",
    d: "fourth number",
  },
  "S7.median-mode.06": {
    a: "the number that repeats",
    b: "how many times it repeats",
  },
  "S7.median-mode.07": {
    a: "first number",
    b: "second number",
    c: "third number",
  },
  "S7.median-mode.08": { a: "how many numbers in the set" },
  "S7.median-mode.09": {
    a: "first number",
    b: "second number",
    c: "third number",
    d: "fourth number",
  },
  "S7.median-mode.10": {
    a: "first number",
    b: "second number",
    c: "third number",
    d: "the added number",
  },
  "S7.median-mode.11": {
    a: "first number",
    b: "the repeated number",
    c: "last number",
  },
  "S7.median-mode.12": {
    a: "first number",
    b: "second number",
    c: "third number",
    d: "fourth number",
    e: "fifth number",
    f: "sixth number",
    g: "seventh number",
  },
  "S7.median-mode.13": {
    a: "the smallest shoe size",
    b: "people with the smallest size",
    c: "people with the next size",
    d: "people with the largest size",
  },
  "S7.median-mode.14": {
    a: "first number",
    b: "second number",
    c: "third number",
    d: "fourth number",
  },
  "S7.median-mode.15": {
    a: "first number",
    b: "second number",
    c: "third number",
    d: "fourth number",
    e: "fifth number",
    f: "sixth number",
  },
  "S7.median-mode.16": {
    a: "the mean",
    b: "the median",
    c: "the smallest number",
  },
  "S7.median-mode.17": { a: "numbers in the set", b: "times the mode appears" },
  "S7.median-mode.18": { a: "the median" },
};

/** The specs with the roles of their numbers attached. */
const dressed = (list: readonly Spec<never>[]): readonly Spec<never>[] =>
  list.map((spec) => {
    const roles = ROLES[spec.id];
    return roles ? ({ ...spec, roles } as Spec<never>) : spec;
  });

export const sSpecs2: readonly Spec<never>[] = dressed([
  ...S4_pie_specs,
  ...S5_global_specs,
  ...S5_global_1S_specs,
  ...S6_patterns_specs,
  ...S6_patterns_1S_specs,
  ...S7_median_mode_specs,
]);
