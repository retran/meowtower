// Domain S, part 2: pie charts, global graphs, patterns, the median and the mode (RES-4288). The Dutch goals read pie charts
// at group 6, draw a graph from a description at group 6 and continue number rows at group 5; the median and the mode are
// Russian extensions of grade 7. Texts are plain blanks in `content/tasks-s.ru.json`. Generated from one table with the strings.
import type { Q } from "../math/q.js";
import { at, calc, of, rg, sortedAt } from "./kitc.js";
import { q } from "./kitf.js";
import { SIGNS, type Spec } from "./spec.js";

const sign = (x: Q, y: Q): (typeof SIGNS)[number] => SIGNS[x.cmp(y) + 1] ?? "=";

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
    t: { "percent-itself": (a, b) => q(b), all: (a) => q(a) },
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
    t: { sectors: (a) => q(a), all: () => q(100) },
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
    },
    c: [100],
  }),
  S4_pie({
    id: "S4.pie.04",
    form: "the-degrees-of-a-sector",
    g: [6, 7],
    kind: "integer",
    p: [of(5, 10, 20, 25, 50)],
    ok: (a) => a !== 50,
    f: (a) => q((360 * a) / 100),
    t: {
      "percent-itself": (a) => q(a),
      "fraction-of-hundred": (a) => q(100 - a),
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
      Math.max(a, b, c) !== [a, b, c].indexOf(Math.max(a, b, c)) + 1 &&
      [a, b, c].indexOf(Math.max(a, b, c)) !== 2,
    f: (a, b, c) => q([a, b, c].indexOf(Math.max(a, b, c)) + 1),
    t: { percent: (a, b, c) => q(Math.max(a, b, c)), last: () => q(3) },
    c: [3],
  }),
  S4_pie({
    id: "S4.pie.11",
    form: "the-bigger-sector",
    g: [6, 7],
    kind: "compare",
    p: [rg(5, 45), rg(5, 45)],
    ok: (a, b) => a !== b,
    f: (a, b) => sign(q(a), q(b)),
    t: { reversed: (a, b) => sign(q(b), q(a)) },
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
    ok: (a, b, c, d) =>
      new Set([a, b, c, d]).size === 4 &&
      [a, b, c, d].indexOf(Math.max(a, b, c, d)) !== 3 &&
      [a, b, c, d].indexOf(Math.max(a, b, c, d)) !== 0,
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
    t: { "first-reading": (a) => q(a), "second-reading": (a, b) => q(b) },
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
    t: { "rise-only": (a, b, c) => q(a * c), "one-hour": (a, b) => q(b + a) },
  }),
  S5_global({
    id: "S5.global.06",
    form: "the-time-to-reach-a-level",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 6), rg(5, 20), rg(2, 6)],
    ok: (a, b, c) => a !== c && c > 1,
    f: (a, b, c) => q(c),
    t: { rise: (a, b, c) => q(a * c), level: (a, b, c) => q(b + a * c) },
    x: (a, b, c) => ({ x: String(b + a * c) }),
  }),
  S5_global({
    id: "S5.global.07",
    form: "the-readings-above-a-level",
    g: [6, 7],
    kind: "integer",
    p: [rg(5, 25), rg(5, 25), rg(5, 25), rg(5, 25), rg(12, 18)],
    ok: (a, b, c, d, e) =>
      [a, b, c, d].every((z) => z !== e) &&
      [a, b, c, d].filter((z) => z > e).length % 2 === 1,
    f: (a, b, c, d, e) => q([a, b, c, d].filter((z) => z > e).length),
    t: {
      all: () => q(4),
      "not-above": (a, b, c, d, e) =>
        q([a, b, c, d].filter((z) => z < e).length),
    },
    c: [4],
  }),
  S5_global({
    id: "S5.global.08",
    form: "the-line-of-a-steady-fall",
    g: [6, 7],
    kind: "choice",
    p: [rg(0, 19)],
    f: () => "1",
    t: {
      upward: () => "2",
      horizontal: () => "3",
      "steeper-and-steeper": () => "4",
    },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
  }),
  S5_global({
    id: "S5.global.09",
    form: "the-line-of-a-stop",
    g: [6, 7],
    kind: "choice",
    p: [rg(0, 19)],
    f: () => "2",
    t: { upward: () => "1", downward: () => "3", "up-then-down": () => "4" },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
  }),
  S5_global({
    id: "S5.global.10",
    form: "the-line-of-a-trip-there-and-back",
    g: [6, 7],
    kind: "choice",
    p: [rg(0, 19)],
    f: () => "3",
    t: { upward: () => "1", downward: () => "2", horizontal: () => "4" },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
  }),
  S5_global({
    id: "S5.global.11",
    form: "the-hour-of-the-fastest-run",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 9), rg(2, 9), rg(2, 9)],
    ok: (a, b, c) =>
      a !== b &&
      b !== c &&
      a !== c &&
      [a, b, c].indexOf(Math.max(a, b, c)) !== 2 &&
      Math.max(a, b, c) !== [a, b, c].indexOf(Math.max(a, b, c)) + 1,
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
    t: { "rise-only": (a, b, c) => q(b * c), "one-year": (a, b) => q(a + b) },
  }),
  S5_global_1S({
    id: "S5.global-1S.03",
    form: "the-year-when-the-value-is-reached",
    g: [8, 8],
    kind: "integer",
    p: [rg(10, 40), rg(2, 9), rg(3, 8)],
    ok: (a, b, c) => b !== c,
    f: (a, b, c) => q(c),
    t: { rise: (a, b, c) => q(b * c), target: (a, b, c) => q(a + b * c) },
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
    p: [rg(0, 19)],
    f: () => "4",
    t: { falling: () => "1", constant: () => "2", "up-then-down": () => "3" },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4, 5, 8, 12],
  }),
  S5_global_1S({
    id: "S5.global-1S.07",
    form: "the-trend-of-a-falling-row",
    g: [8, 8],
    kind: "choice",
    p: [rg(0, 19)],
    f: () => "1",
    t: { rising: () => "2", constant: () => "3", "down-then-up": () => "4" },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4, 8, 11, 15, 20],
  }),
  S5_global_1S({
    id: "S5.global-1S.08",
    form: "the-trend-of-a-peak",
    g: [8, 8],
    kind: "choice",
    p: [rg(0, 19)],
    f: () => "2",
    t: {
      "only-rising": () => "1",
      "only-falling": () => "3",
      constant: () => "4",
    },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4, 8, 9, 14],
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
    t: { first: (a) => q(a), third: (a, b) => q(a + 2 * b) },
    x: (a, b) => ({ x: String(a + 2 * b) }),
    c: [2],
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
    t: { last: (a, b) => q(a + 3 * b), "double-step": (a, b) => q(a + 5 * b) },
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
    t: { added: (a) => q(8 * a + 2 * a), last: (a) => q(8 * a) },
    x: (a) => ({ row: [a, 2 * a, 4 * a, 8 * a].join(", ") + ", …" }),
    c: [2, 8, 16],
  }),
  S6_patterns({
    id: "S6.patterns.05",
    form: "the-colour-of-a-bead",
    g: [3, 5],
    kind: "integer",
    p: [of(3, 4, 5), rg(10, 40)],
    ok: (a, b) => b % a === 0 && b !== a,
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
    g: [3, 5],
    kind: "integer",
    p: [rg(3, 8)],
    f: (a) => q((a + 1) * (a + 1)),
    t: { last: (a) => q(a * a), doubled: (a) => q(2 * a * a) },
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
    g: [3, 5],
    kind: "integer",
    p: [rg(4, 14)],
    f: (a) => q((a * (a + 1)) / 2),
    t: { last: (a) => q(a), square: (a) => q(a * a) },
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
    g: [3, 5],
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
    g: [3, 5],
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
    p: [rg(2, 6)],
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
    t: { "first-number": (a) => q(a), "middle-written": (a, b, c) => q(c) },
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
      reversed: (a, b, c) =>
        sign(q((a + b + c) / 3), q(sortedAt([a, b, c], 1))),
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
    t: { "first-number": (a) => q(a), "middle-written": (a, b, c, d) => q(d) },
    c: [4],
    origin: {
      extension: "the median and the mode, Russian grade 7 (RES-4288)",
    },
  }),
];

export const sSpecs2: readonly Spec<never>[] = [
  ...S4_pie_specs,
  ...S5_global_specs,
  ...S5_global_1S_specs,
  ...S6_patterns_specs,
  ...S6_patterns_1S_specs,
  ...S7_median_mode_specs,
];
