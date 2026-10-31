// Domain S, part 1: tables, bar and line charts, the mean and the missing number (RES-4288). The Dutch goals read tables
// at group 4, bar charts at group 3 and compute a simple mean at group 6. The data stand in the text, because the contract
// has no picture field. Texts are plain blanks in `content/tasks-s.ru.json`. Generated from one table with the strings.
import type { Q } from "../math/q.js";
import { calc, of, rg, sortedAt } from "./kitc.js";
import { q, tm } from "./kitf.js";
import { SIGNS, type Spec } from "./spec.js";

const sign = (x: Q, y: Q): (typeof SIGNS)[number] => SIGNS[x.cmp(y) + 1] ?? "=";

/** The hour and the minute of the departure `k` intervals of `step` minutes after `h:m`. */
const hm = (
  h: number,
  m: number,
  step: number,
  k: number,
): [number, number] => {
  const t = h * 60 + m + k * step;
  return [Math.floor(t / 60), t % 60];
};
const departure = (h: number, m: number, step: number, k: number): [Q, Q] => {
  const [hh, mm] = hm(h, m, step, k);
  return [q(hh), q(mm)];
};

const S1_tables = calc("S1", "tables");
const S1_tables_specs: readonly Spec<never>[] = [
  S1_tables({
    id: "S1.tables.01",
    form: "a-value-in-a-table-row",
    g: [4, 5],
    kind: "integer",
    p: [rg(5, 30), rg(5, 30), rg(5, 30)],
    ok: (a, b, c) => a !== b && b !== c && a !== c,
    f: (a, b) => q(b),
    alt: (a, b, c) => q(a + b + c - a - c),
    t: {
      monday: (a) => q(a),
      wednesday: (a, b, c) => q(c),
      "all-added": (a, b, c) => q(a + b + c),
    },
  }),
  S1_tables({
    id: "S1.tables.02",
    form: "the-difference-of-two-cells",
    g: [4, 5],
    kind: "integer",
    p: [rg(5, 20), rg(25, 40), rg(5, 40)],
    ok: (a, b, c) => c !== b && c > a,
    f: (a, b) => q(b - a),
    alt: (a, b) =>
      q(Array.from({ length: b }, (_, i) => i + 1).filter((z) => z > a).length),
    t: { sum: (a, b) => q(a + b), wednesday: (a, b, c) => q(c - a) },
  }),
  S1_tables({
    id: "S1.tables.03",
    form: "the-total-of-a-column",
    g: [4, 5],
    kind: "integer",
    p: [rg(5, 30), rg(5, 30), rg(5, 30)],
    ok: (a, b, c) => a !== b && b !== c && a !== c,
    f: (a, b, c) => q(a + b + c),
    alt: (a, b, c) =>
      q(
        10 * (Math.floor(a / 10) + Math.floor(b / 10) + Math.floor(c / 10)) +
          (a % 10) +
          (b % 10) +
          (c % 10),
      ),
    t: {
      largest: (a, b, c) => q(Math.max(a, b, c)),
      "two-days": (a, b) => q(a + b),
    },
  }),
  S1_tables({
    id: "S1.tables.04",
    form: "the-missing-cell-of-a-total",
    g: [4, 5],
    kind: "integer",
    p: [rg(60, 90), rg(10, 30), rg(10, 30)],
    ok: (a, b, c) => b !== c && a - b - c >= 5,
    f: (a, b, c) => q(a - b - c),
    alt: (a, b, c) =>
      q([...Array(a + 1).keys()].find((x) => b + c + x === a) ?? 0),
    t: {
      "one-day-removed": (a, b) => q(a - b),
      "known-days": (a, b, c) => q(b + c),
    },
  }),
  S1_tables({
    id: "S1.tables.05",
    form: "the-cost-of-two-kinds",
    g: [4, 5],
    kind: "integer",
    p: [rg(2, 9), rg(2, 9)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(2 * a + 3 * b),
    alt: (a, b) => q(a + a + b + b + b),
    t: {
      "swapped-counts": (a, b) => q(3 * a + 2 * b),
      "one-of-each": (a, b) => q(a + b),
    },
    c: [2, 3],
  }),
  S1_tables({
    id: "S1.tables.06",
    form: "the-time-in-a-timetable",
    g: [4, 5],
    kind: "integer",
    p: [rg(20, 50), rg(5, 15), rg(7, 10)],
    f: (a, b) => q(60 - a + b),
    alt: (a, b, c) => q((c + 1) * 60 + b - (c * 60 + a)),
    x: (a, b, c) => ({ t1: tm(c, a), t2: tm(c + 1, b) }),
    t: {
      "minutes-subtracted": (a, b) => q(a - b),
      "hour-only": () => q(60),
      "hour-added": (a, b) => q(60 + b),
    },
    c: [60],
  }),
  S1_tables({
    id: "S1.tables.07",
    form: "the-count-above-a-level",
    g: [4, 5],
    kind: "integer",
    p: [rg(120, 150), rg(120, 150), rg(120, 150), rg(120, 150), rg(130, 140)],
    ok: (a, b, c, d, e) =>
      [a, b, c, d].every((z) => z !== e) &&
      [a, b, c, d].filter((z) => z > e).length >= 1 &&
      [a, b, c, d].filter((z) => z > e).length <= 3,
    f: (a, b, c, d, e) => q([a, b, c, d].filter((z) => z > e).length),
    alt: (a, b, c, d, e) => q(4 - [a, b, c, d].filter((z) => z < e).length),
    t: {
      all: () => q(4),
      "not-above": (a, b, c, d, e) => {
        const w = [a, b, c, d].filter((z) => z < e).length;
        return w === [a, b, c, d].filter((z) => z > e).length ? null : q(w);
      },
    },
    c: [4],
  }),
  S1_tables({
    id: "S1.tables.08",
    form: "the-spread-of-a-row",
    g: [4, 5],
    kind: "integer",
    p: [rg(10, 40), rg(10, 40), rg(10, 40), rg(10, 40)],
    ok: (a, b, c, d) =>
      new Set([a, b, c, d]).size === 4 &&
      Math.min(a, b, c, d) !== Math.max(a, b, c, d) - Math.min(a, b, c, d),
    f: (a, b, c, d) => q(Math.max(a, b, c, d) - Math.min(a, b, c, d)),
    alt: (a, b, c, d) => {
      const s = [a, b, c, d].sort((u, v) => u - v);
      return q(
        (s[1] ?? 0) -
          (s[0] ?? 0) +
          ((s[2] ?? 0) - (s[1] ?? 0)) +
          ((s[3] ?? 0) - (s[2] ?? 0)),
      );
    },
    t: {
      largest: (a, b, c, d) => q(Math.max(a, b, c, d)),
      smallest: (a, b, c, d) => q(Math.min(a, b, c, d)),
      "first-last": (a, b, c, d) => {
        const w = Math.abs(a - d);
        return w === Math.max(a, b, c, d) - Math.min(a, b, c, d) ? null : q(w);
      },
    },
  }),
  S1_tables({
    id: "S1.tables.09",
    form: "the-second-column-total",
    g: [4, 5],
    kind: "integer",
    p: [rg(2, 9), rg(2, 9), rg(2, 9), rg(2, 9)],
    ok: (a, b, c, d) => new Set([b + d, a + c, c + d, a + b]).size === 4,
    f: (a, b, c, d) => q(b + d),
    alt: (a, b, c, d) => q(a + b + c + d - (a + c)),
    t: {
      "first-column": (a, b, c) => q(a + c),
      "second-row": (a, b, c, d) => q(c + d),
      "first-row": (a, b) => q(a + b),
    },
  }),
  S1_tables({
    id: "S1.tables.10",
    form: "the-doubled-row",
    g: [4, 5],
    kind: "integer",
    p: [rg(2, 9), rg(2, 9), rg(2, 9)],
    f: (a, b, c) => q(2 * (a + b + c)),
    alt: (a, b, c) => q(2 * a + 2 * b + 2 * c),
    t: {
      "first-row": (a, b, c) => q(a + b + c),
      tripled: (a, b, c) => q(3 * (a + b + c)),
    },
    c: [2, 3],
  }),
  S1_tables({
    id: "S1.tables.11",
    form: "the-bigger-cell",
    g: [4, 5],
    kind: "compare",
    p: [rg(10, 99), rg(10, 99)],
    ok: (a, b) => a !== b,
    f: (a, b) => sign(q(a), q(b)),
    alt: (a, b) => sign(q(a - b), q(0)),
    t: {
      reversed: (a, b) => {
        const w = sign(q(b), q(a));
        return w === sign(q(a % 10), q(b % 10)) ? null : w;
      },
      "units-first": (a, b) => {
        const w = sign(q(a % 10), q(b % 10));
        return w === sign(q(a), q(b)) ? null : w;
      },
    },
  }),
  S1_tables({
    id: "S1.tables.12",
    form: "the-saving-on-several-items",
    g: [4, 5],
    kind: "integer",
    p: [rg(4, 9), rg(1, 3), rg(2, 6)],
    ok: (a, b) => a > b,
    f: (a, b, c) => q(c * (a - b)),
    alt: (a, b, c) => q(c * a - c * b),
    t: {
      "one-item": (a, b) => q(a - b),
      "first-store": (a, b, c) => q(c * a),
      "second-store": (a, b, c) => (a === 2 * b ? null : q(c * b)),
    },
  }),
  S1_tables({
    id: "S1.tables.13",
    form: "the-column-total-from-the-row-totals",
    g: [5, 6],
    kind: "integer",
    p: [rg(20, 40), rg(20, 40), rg(10, 25), rg(10, 25)],
    ok: (a, b, c, d) =>
      a !== b &&
      c !== d &&
      a + b - c - d >= 5 &&
      ![a, b, c, d].includes(a + b - c - d),
    f: (a, b, c, d) => q(a + b - c - d),
    alt: (a, b, c, d) =>
      q([...Array(a + b + 1).keys()].find((x) => c + d + x === a + b) ?? 0),
    t: {
      "whole-table": (a, b) => q(a + b),
      "two-columns": (a, b, c, d) => q(c + d),
    },
    origin: {
      olympiad: "a total counted by rows and by columns (RES-4288)",
    },
  }),
  S1_tables({
    id: "S1.tables.14",
    form: "the-fifth-departure-from-a-timetable",
    g: [4, 5],
    kind: "time",
    p: [rg(6, 9), of(5, 10, 20, 25, 40, 50), of(15, 20, 25, 35, 40, 45)],
    f: (a, b, c) => departure(a, b, c, 4),
    alt: (a, b, c) => {
      let h = a;
      let m = b;
      for (let i = 0; i < 4; i += 1) {
        m += c;
        if (m >= 60) {
          m -= 60;
          h += 1;
        }
      }
      return [q(h), q(m)];
    },
    t: {
      fourth: (a, b, c) => departure(a, b, c, 3),
      sixth: (a, b, c) => departure(a, b, c, 5),
      "hour-not-changed": (a, b, c) => [q(a), q((b + 4 * c) % 60)],
    },
    x: (a, b, c) => ({
      t1: tm(a, b),
      t2: tm(...hm(a, b, c, 1)),
      t3: tm(...hm(a, b, c, 2)),
    }),
  }),
  S1_tables({
    id: "S1.tables.15",
    form: "the-cells-with-a-given-sum",
    g: [6, 8],
    kind: "integer",
    p: [of(3, 4, 5, 6, 7, 8, 9, 10, 11)],
    f: (a) => q(6 - Math.abs(a - 7)),
    alt: (a) => q(a <= 7 ? a - 1 : 13 - a),
    t: {
      unordered: (a) => {
        const k = 6 - Math.abs(a - 7);
        return Math.ceil(k / 2) === k ? null : q(Math.ceil(k / 2));
      },
      "a-minus-one": (a) => (a <= 7 ? null : q(a - 1)),
      six: (a) => (a === 7 ? null : q(6)),
    },
    x: (a) => ({
      pairs: Array.from(
        { length: 6 - Math.abs(a - 7) },
        (_, i) => `${Math.max(1, a - 6) + i} + ${a - Math.max(1, a - 6) - i}`,
      ).join(", "),
    }),
    origin: {
      olympiad:
        "the pairs of two dice in a table of sums (Kangoeroe, RES-4288)",
    },
  }),
  S1_tables({
    id: "S1.tables.16",
    form: "the-missing-product-in-a-table",
    g: [4, 5],
    kind: "integer",
    p: [rg(3, 9), rg(3, 9), rg(3, 9), rg(3, 9)],
    ok: (a, b, c, d) =>
      a !== b &&
      c !== d &&
      new Set([a * c, a * d, b * c, b * d]).size === 4 &&
      ![a, b, c, d].includes(a * c) &&
      ![a, b, c, d].includes(a * d) &&
      ![a, b, c, d].includes(b * c) &&
      ![a, b, c, d].includes(b * d),
    f: (a, b, c, d) => q(b * d),
    alt: (a, b, c, d) => q((a * d * (b * c)) / (a * c)),
    t: {
      sum: (a, b, c, d) => q(b + d),
      "other-row": (a, b, c, d) => q(a * d),
      "other-column": (a, b, c) => q(b * c),
    },
  }),
  S1_tables({
    id: "S1.tables.17",
    form: "the-total-of-tally-marks",
    g: [3, 5],
    kind: "integer",
    p: [rg(6, 14), rg(6, 14), rg(6, 14)],
    ok: (a, b, c) =>
      a !== b && b !== c && a !== c && [a, b, c].every((x) => x % 5 !== 0),
    f: (a, b, c) => q(a + b + c),
    alt: (a, b, c) =>
      q(
        5 * (Math.floor(a / 5) + Math.floor(b / 5) + Math.floor(c / 5)) +
          (a % 5) +
          (b % 5) +
          (c % 5),
      ),
    t: {
      "bundle-as-one": (a, b, c) =>
        q([a, b, c].reduce((s, x) => s + Math.floor(x / 5) + (x % 5), 0)),
      "bundle-as-four": (a, b, c) =>
        q([a, b, c].reduce((s, x) => s + Math.floor(x / 5) * 4 + (x % 5), 0)),
      "largest-row": (a, b, c) => q(Math.max(a, b, c)),
    },
  }),
];

const S2_bar_line = calc("S2", "bar-line");
const S2_bar_line_specs: readonly Spec<never>[] = [
  S2_bar_line({
    id: "S2.bar-line.01",
    form: "the-books-by-pictures",
    g: [3, 6],
    kind: "integer",
    p: [rg(2, 6), rg(3, 9)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a * b),
    alt: (a, b) =>
      q(
        Array<number>(b)
          .fill(a)
          .reduce((s, x) => s + x, 0),
      ),
    t: { "icons-only": (a, b) => q(b), sum: (a, b) => q(a + b) },
  }),
  S2_bar_line({
    id: "S2.bar-line.02",
    form: "the-difference-of-two-bars",
    g: [3, 6],
    kind: "integer",
    p: [rg(5, 20), rg(25, 40)],
    f: (a, b) => q(b - a),
    alt: (a, b) =>
      q(Array.from({ length: b }, (_, i) => i + 1).filter((z) => z > a).length),
    t: { sum: (a, b) => q(a + b), "second-only": (a, b) => q(b) },
  }),
  S2_bar_line({
    id: "S2.bar-line.03",
    form: "the-total-of-three-bars",
    g: [3, 6],
    kind: "integer",
    p: [rg(5, 30), rg(5, 30), rg(5, 30)],
    ok: (a, b, c) => a !== b && b !== c && a !== c,
    f: (a, b, c) => q(a + b + c),
    alt: (a, b, c) =>
      q(
        10 * (Math.floor(a / 10) + Math.floor(b / 10) + Math.floor(c / 10)) +
          (a % 10) +
          (b % 10) +
          (c % 10),
      ),
    t: {
      highest: (a, b, c) => q(Math.max(a, b, c)),
      "two-bars": (a, b) => q(a + b),
    },
  }),
  S2_bar_line({
    id: "S2.bar-line.04",
    form: "the-bar-between-two-marks",
    g: [3, 6],
    kind: "integer",
    p: [of(10, 20, 30, 40, 50, 60), of(10, 20, 40)],
    f: (a, g) => q(a + g / 2),
    alt: (a, g) => q((a + (a + g)) / 2),
    t: {
      "lower-mark": (a) => q(a),
      "upper-mark": (a, g) => q(a + g),
      "half-of-upper": (a, g) => q((a + g) / 2),
      "half-gap": (a, g) => q(g / 2),
    },
    x: (a, g) => ({ y: String(a + g) }),
    c: [2],
  }),
  S2_bar_line({
    id: "S2.bar-line.05",
    form: "the-rise-on-a-line-graph",
    g: [3, 6],
    kind: "integer",
    p: [rg(3, 12), rg(14, 25), rg(6, 10), rg(3, 5)],
    f: (a, b) => q(b - a),
    alt: (a, b) => q([...Array(b + 1).keys()].filter((z) => z > a).length),
    t: { sum: (a, b) => q(a + b), hours: (a, b, c, d) => q(d) },
  }),
  S2_bar_line({
    id: "S2.bar-line.06",
    form: "the-rise-per-hour",
    g: [3, 6],
    kind: "integer",
    p: [rg(2, 8), rg(2, 6), rg(2, 5)],
    ok: (a, b, c) => b !== c,
    f: (a, b) => q(b),
    alt: (a, b, c) =>
      q([...Array(b * c + 1).keys()].find((k) => k * c === b * c) ?? 0),
    t: { total: (a, b, c) => q(b * c), hours: (a, b, c) => q(c) },
    x: (a, b, c) => ({ x: String(a), y: String(a + b * c) }),
  }),
  S2_bar_line({
    id: "S2.bar-line.07",
    form: "the-bars-higher-than-a-level",
    g: [3, 6],
    kind: "integer",
    p: [
      of(10, 20, 30, 40),
      of(10, 20, 30, 40),
      of(10, 20, 30, 40),
      of(10, 20, 30, 40),
      of(15, 25, 35),
    ],
    ok: (a, b, c, d, e) =>
      [a, b, c, d].filter((z) => z > e).length >= 1 &&
      [a, b, c, d].filter((z) => z > e).length <= 3,
    f: (a, b, c, d, e) => q([a, b, c, d].filter((z) => z > e).length),
    alt: (a, b, c, d, e) => q(4 - [a, b, c, d].filter((z) => z < e).length),
    t: {
      all: () => q(4),
      "not-above": (a, b, c, d, e) => {
        const w = [a, b, c, d].filter((z) => z < e).length;
        return w === [a, b, c, d].filter((z) => z > e).length ? null : q(w);
      },
    },
    c: [4],
  }),
  S2_bar_line({
    id: "S2.bar-line.08",
    form: "the-day-of-the-highest-bar",
    g: [3, 6],
    kind: "integer",
    p: [rg(5, 30), rg(5, 30), rg(5, 30)],
    ok: (a, b, c) =>
      a !== b &&
      b !== c &&
      a !== c &&
      Math.max(a, b, c) !== [a, b, c].indexOf(Math.max(a, b, c)) + 1 &&
      [a, b, c].indexOf(Math.max(a, b, c)) !== 2,
    f: (a, b, c) => q([a, b, c].indexOf(Math.max(a, b, c)) + 1),
    alt: (a, b, c) =>
      q(
        ([a, b, c]
          .map((h, i) => [h, i] as const)
          .sort((u, v) => v[0] - u[0])[0]?.[1] ?? 0) + 1,
      ),
    t: { height: (a, b, c) => q(Math.max(a, b, c)), last: () => q(3) },
    c: [1, 2, 3],
  }),
  S2_bar_line({
    id: "S2.bar-line.09",
    form: "the-line-graph-after-a-rise-and-a-fall",
    g: [3, 6],
    kind: "integer",
    p: [rg(5, 12), rg(3, 8), rg(1, 5)],
    ok: (a, b, c) => b !== c,
    f: (a, b, c) => q(a + b - c),
    alt: (a, b, c) => q(a + (b - c)),
    t: {
      "all-added": (a, b, c) => q(a + b + c),
      "rise-only": (a, b) => q(a + b),
      "fall-only": (a, b, c) => q(a - c),
    },
  }),
  S2_bar_line({
    id: "S2.bar-line.10",
    form: "the-bar-three-times-higher",
    g: [3, 6],
    kind: "integer",
    p: [rg(3, 15)],
    f: (a) => q(3 * a),
    alt: (a) => q(a + a + a),
    t: {
      "three-more": (a) => q(a + 3),
      same: (a) => q(a),
      doubled: (a) => q(2 * a),
    },
    c: [3],
  }),
  S2_bar_line({
    id: "S2.bar-line.11",
    form: "the-height-by-squares-of-a-scale",
    g: [3, 6],
    kind: "integer",
    p: [rg(2, 5), rg(3, 6), rg(7, 12)],
    f: (a, b, c) => q(a * (c - b)),
    alt: (a, b, c) => q(c * a - b * a),
    t: {
      cells: (a, b, c) => q(c - b),
      "unit-of-second": (a, b, c) => q(a * c),
    },
  }),
  S2_bar_line({
    id: "S2.bar-line.12",
    form: "the-third-bar-from-the-total",
    g: [3, 6],
    kind: "integer",
    p: [rg(60, 90), rg(10, 30), rg(10, 30)],
    ok: (a, b, c) => b !== c && a - b - c >= 5,
    f: (a, b, c) => q(a - b - c),
    alt: (a, b, c) =>
      q([...Array(a + 1).keys()].find((x) => b + c + x === a) ?? 0),
    t: { "one-removed": (a, b) => q(a - b), known: (a, b, c) => q(b + c) },
  }),
  S2_bar_line({
    id: "S2.bar-line.13",
    form: "the-steepest-stretch-of-a-line",
    g: [6, 7],
    kind: "integer",
    p: [rg(5, 15), rg(9, 15), rg(1, 4), rg(1, 4), rg(1, 3)],
    f: (_a, _b, _c, _d, e) => q(e),
    alt: (_a, b, c, d, e) => {
      const rise = [e === 1 ? b : c, e === 2 ? b : c, e === 3 ? b : d];
      return q(rise.indexOf(Math.max(...rise)) + 1);
    },
    t: {
      "highest-point": (_a, _b, _c, _d, e) => (e === 3 ? null : q(3)),
      "value-of-the-rise": (_a, b) => q(b),
    },
    x: (a, b, c, d, e) => {
      const rise = [e === 1 ? b : c, e === 2 ? b : c, e === 3 ? b : d];
      return {
        p: String(a),
        s: String(a + (rise[0] ?? 0)),
        u: String(a + (rise[0] ?? 0) + (rise[1] ?? 0)),
        v: String(a + (rise[0] ?? 0) + (rise[1] ?? 0) + (rise[2] ?? 0)),
      };
    },
    c: [1, 2, 3],
  }),
  S2_bar_line({
    id: "S2.bar-line.14",
    form: "the-bar-on-an-unmarked-line",
    g: [5, 6],
    kind: "integer",
    p: [of(2, 5, 10), of(5, 7, 9), rg(1, 4), rg(1, 4), rg(0, 2)],
    f: (a, b) => q(a * b),
    alt: (a, b) => q(((b - 1) / 2) * 2 * a + a),
    t: {
      "lower-label": (a, b) => q((b - 1) * a),
      "upper-label": (a, b) => q((b + 1) * a),
      lines: (a, b) => q(b),
    },
    c: [2],
  }),
  S2_bar_line({
    id: "S2.bar-line.15",
    form: "the-range-on-a-line-graph-with-a-scale",
    g: [6, 7],
    kind: "integer",
    p: [of(2, 5, 10), rg(1, 8), rg(1, 8), rg(1, 8), rg(1, 8), rg(1, 8)],
    ok: (a, b, c, d, e, f) => {
      const span = Math.max(b, c, d, e, f) - Math.min(b, c, d, e, f);
      return span >= 3 && span % 2 === 1;
    },
    f: (a, b, c, d, e, f) =>
      q((Math.max(b, c, d, e, f) - Math.min(b, c, d, e, f)) * a),
    alt: (a, b, c, d, e, f) =>
      q(Math.max(b, c, d, e, f) * a - Math.min(b, c, d, e, f) * a),
    t: {
      highest: (a, b, c, d, e, f) => q(Math.max(b, c, d, e, f) * a),
      lowest: (a, b, c, d, e, f) => q(Math.min(b, c, d, e, f) * a),
      lines: (a, b, c, d, e, f) =>
        q(Math.max(b, c, d, e, f) - Math.min(b, c, d, e, f)),
      "largest-jump": (a, b, c, d, e, f) => {
        const top = Math.max(b, c, d, e, f) - Math.min(b, c, d, e, f);
        const jump = Math.max(
          Math.abs(c - b),
          Math.abs(d - c),
          Math.abs(e - d),
          Math.abs(f - e),
        );
        return jump === top ? null : q(jump * a);
      },
    },
    c: [2],
  }),
  S2_bar_line({
    id: "S2.bar-line.16",
    form: "the-tallest-bar-of-an-even-staircase",
    g: [6, 8],
    kind: "integer",
    p: [(r) => 5 * rg(6, 16)(r), rg(2, 5)],
    f: (a, b) => q(a / 5 + 2 * b),
    alt: (a, b) => q((a + 10 * b) / 5),
    t: {
      middle: (a) => q(a / 5),
      "mean-as-first": (a, b) => q(a / 5 + 4 * b),
      "one-step": (a, b) => q(a / 5 + b),
    },
    c: [5],
    origin: {
      olympiad: "an evenly rising row: the middle term is the mean (RES-4288)",
    },
  }),
  S2_bar_line({
    id: "S2.bar-line.17",
    form: "the-pictogram-with-a-half-icon",
    g: [6, 6],
    kind: "integer",
    p: [of(2, 4, 6, 8, 10), rg(2, 7)],
    f: (a, b) => q(2 * a * b + a, 2),
    alt: (a, b) => q(a * b + a / 2),
    t: {
      "half-as-whole": (a, b) => q((b + 1) * a),
      "half-ignored": (a, b) => q(a * b),
      "half-as-one": (a, b) => q(a * b + 1),
    },
    c: [2],
  }),
  S2_bar_line({
    id: "S2.bar-line.18",
    form: "the-bars-made-equal",
    g: [6, 8],
    kind: "integer",
    p: [rg(6, 20), rg(14, 40)],
    ok: (a, b) => b - a >= 4 && (b - a) % 2 === 0,
    f: (a, b) => q((b - a) / 2),
    alt: (a, b) => q(b - (a + b) / 2),
    t: {
      difference: (a, b) => q(b - a),
      "final-height": (a, b) => q((a + b) / 2),
    },
    c: [2],
    origin: {
      olympiad: "levelling out: the sum stays the same (RES-4288)",
    },
  }),
];

const S3_mean = calc("S3", "mean");
const S3_mean_specs: readonly Spec<never>[] = [
  S3_mean({
    id: "S3.mean.01",
    form: "the-mean-of-two-numbers",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 20), rg(21, 40)],
    ok: (a, b) => (a + b) % 2 === 0,
    f: (a, b) => q((a + b) / 2),
    alt: (a, b) => q(a + (b - a) / 2),
    t: {
      sum: (a, b) => q(a + b),
      larger: (a, b) => q(b),
      "half-difference": (a, b) => q((b - a) / 2),
    },
    c: [2],
  }),
  S3_mean({
    id: "S3.mean.02",
    form: "the-mean-of-three-numbers",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 20), rg(2, 20), rg(2, 20)],
    ok: (a, b, c) =>
      (a + b + c) % 3 === 0 &&
      a !== b &&
      b !== c &&
      Number.isInteger((a + b) / 2),
    f: (a, b, c) => q((a + b + c) / 3),
    alt: (a, b, c) => q(a + (b - a + (c - a)) / 3),
    t: {
      sum: (a, b, c) => q(a + b + c),
      "two-numbers": (a, b) => q((a + b) / 2),
      "middle-of-list": (a, b) => q(b),
    },
    c: [2, 3],
  }),
  S3_mean({
    id: "S3.mean.03",
    form: "the-mean-of-four-numbers",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 20), rg(2, 20), rg(2, 20), rg(2, 20)],
    ok: (a, b, c, d) =>
      (a + b + c + d) % 4 === 0 && (a + b + c + d) % 3 === 0 && a !== b,
    f: (a, b, c, d) => q((a + b + c + d) / 4),
    alt: (a, b, c, d) => q(a + (b - a + (c - a) + (d - a)) / 4),
    t: {
      sum: (a, b, c, d) => q(a + b + c + d),
      "divided-by-three": (a, b, c, d) => q((a + b + c + d) / 3),
      "middle-two": (a, b, c) => ((b + c) % 2 === 0 ? q((b + c) / 2) : null),
    },
    c: [3, 4],
  }),
  S3_mean({
    id: "S3.mean.04",
    form: "the-mean-of-two-groups-of-equal-values",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 9), rg(11, 19), rg(1, 3), rg(1, 3)],
    ok: (a, b, c, d) =>
      c !== d &&
      (c * a + d * b) % (c + d) === 0 &&
      (a + b) / 2 !== (c * a + d * b) / (c + d) &&
      Number.isInteger((a + b) / 2),
    f: (a, b, c, d) => q((c * a + d * b) / (c + d)),
    alt: (a, b, c, d) => q(a + (d * (b - a)) / (c + d)),
    t: {
      "simple-mean": (a, b) => q((a + b) / 2),
      sum: (a, b, c, d) => q(c * a + d * b),
    },
  }),
  S3_mean({
    id: "S3.mean.05",
    form: "the-mean-from-a-sum-and-a-count",
    g: [6, 7],
    kind: "integer",
    p: [rg(3, 15), rg(3, 9)],
    ok: (a, b) => a !== b,
    f: (a) => q(a),
    alt: (a, b) =>
      q([...Array(a * b + 1).keys()].find((k) => k * b === a * b) ?? 0),
    t: { total: (a, b) => q(a * b), days: (a, b) => q(b) },
    x: (a, b) => ({ x: String(a * b) }),
  }),
  S3_mean({
    id: "S3.mean.06",
    form: "the-total-from-a-mean",
    g: [6, 7],
    kind: "integer",
    p: [rg(3, 15), rg(3, 9)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a * b),
    alt: (a, b) =>
      q(
        Array<number>(b)
          .fill(a)
          .reduce((s, x) => s + x, 0),
      ),
    t: { sum: (a, b) => q(a + b), mean: (a) => q(a) },
  }),
  S3_mean({
    id: "S3.mean.07",
    form: "the-mean-of-five-consecutive-numbers",
    g: [6, 7],
    kind: "integer",
    p: [rg(3, 40)],
    f: (a) => q(a + 2),
    alt: (a) => q([0, 1, 2, 3, 4].reduce((s, i) => s + a + i, 0) / 5),
    t: {
      smallest: (a) => q(a),
      largest: (a) => q(a + 4),
      sum: (a) => q(5 * a + 10),
    },
    c: [1, 2, 3, 4],
  }),
  S3_mean({
    id: "S3.mean.08",
    form: "the-mean-with-a-zero",
    g: [6, 7],
    kind: "integer",
    p: [rg(3, 14), rg(3, 14)],
    ok: (a, b) => (a + b) % 3 === 0 && a !== b,
    f: (a, b) => q((a + b) / 3),
    alt: (a, b) => q(a / 3 + b / 3),
    t: {
      "two-days": (a, b) => ((a + b) % 2 === 0 ? q((a + b) / 2) : null),
      sum: (a, b) => q(a + b),
    },
    c: [0, 2, 3],
  }),
  S3_mean({
    id: "S3.mean.09",
    form: "the-mean-compared-with-a-number",
    g: [6, 7],
    kind: "compare",
    p: [rg(2, 12), rg(2, 12), rg(2, 12), rg(2, 12)],
    ok: (a, b, c, d) =>
      (a + b + c) % 3 === 0 && (a + b + c) / 3 !== d && !(a === b && b === c),
    f: (a, b, c, d) => sign(q((a + b + c) / 3), q(d)),
    alt: (a, b, c, d) => sign(q(a + b + c), q(3 * d)),
    t: {
      reversed: (a, b, c, d) => {
        const w = sign(q(d), q((a + b + c) / 3));
        return w === sign(q(a + b + c), q(d)) ? null : w;
      },
      "sum-compared": (a, b, c, d) => {
        const w = sign(q(a + b + c), q(d));
        return w === sign(q((a + b + c) / 3), q(d)) ? null : w;
      },
    },
    c: [3],
  }),
  S3_mean({
    id: "S3.mean.10",
    form: "the-mean-of-the-numbers-up-to-a-limit",
    g: [6, 7],
    kind: "integer",
    p: [of(5, 7, 9, 11, 13, 15, 17, 19)],
    f: (a) => q((a + 1) / 2),
    alt: (a) => q([...Array(a + 1).keys()].reduce((s, x) => s + x, 0) / a),
    t: {
      "last-number": (a) => q(a),
      "first-number": () => q(1),
      sum: (a) => q((a * (a + 1)) / 2),
    },
    c: [1, 2],
  }),
  S3_mean({
    id: "S3.mean.11",
    form: "the-mean-as-the-level-of-equal-bars",
    g: [6, 7],
    kind: "integer",
    p: [rg(3, 12), rg(3, 12), rg(3, 12), rg(3, 12)],
    ok: (a, b, c, d) =>
      (a + b + c + d) % 4 === 0 &&
      ![a, b, c, d].includes((a + b + c + d) / 4) &&
      Math.max(a, b, c, d) !== Math.min(a, b, c, d),
    f: (a, b, c, d) => q((a + b + c + d) / 4),
    alt: (a, b, c, d) => q((a + b + c + d - 4 * a) / 4 + a),
    t: {
      sum: (a, b, c, d) => q(a + b + c + d),
      tallest: (a, b, c, d) => q(Math.max(a, b, c, d)),
      "middle-two": (a, b, c) => ((b + c) % 2 === 0 ? q((b + c) / 2) : null),
    },
  }),
  S3_mean({
    id: "S3.mean.12",
    form: "the-mean-with-a-half",
    g: [7, 8],
    kind: "decimal",
    p: [rg(8, 20), rg(8, 20)],
    ok: (a, b) => (a + b) % 2 === 1,
    f: (a, b) => q(a + b, 2),
    alt: (a, b) => q(2 * a + (b - a), 2),
    t: {
      sum: (a, b) => q(a + b),
      "rounded-down": (a, b) => q(Math.floor((a + b) / 2)),
      larger: (a, b) => q(Math.max(a, b)),
    },
  }),
  S3_mean({
    id: "S3.mean.13",
    form: "the-mean-lies-between-the-numbers",
    g: [6, 7],
    kind: "choice",
    p: [rg(2, 20), rg(2, 20), rg(2, 20)],
    ok: (a, b, c) =>
      new Set([a, b, c]).size === 3 &&
      (a + b + c) % 3 === 0 &&
      (a + b + c) / 3 !== sortedAt([a, b, c], 1),
    f: (a, b, c) => ((a + b + c) / 3 < sortedAt([a, b, c], 1) ? "2" : "3"),
    alt: (a, b, c) => (a + b + c < 3 * sortedAt([a, b, c], 1) ? "2" : "3"),
    t: {
      "below-min": () => "1",
      "above-max": () => "4",
      "other-interval": (a, b, c) =>
        (a + b + c) / 3 < sortedAt([a, b, c], 1) ? "3" : "2",
    },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
  }),
  S3_mean({
    id: "S3.mean.14",
    form: "the-largest-of-consecutive-numbers-by-the-mean",
    g: [6, 8],
    kind: "integer",
    p: [rg(10, 40), of(3, 5, 7, 9, 11)],
    f: (a, b) => q(a + (b - 1) / 2),
    alt: (a, b) => q((2 * a + b - 1) / 2),
    t: {
      mean: (a) => q(a),
      "off-by-one": (a, b) => q(a + (b + 1) / 2),
      "mean-plus-count": (a, b) => q(a + b),
    },
    origin: {
      olympiad:
        "symmetry: the mean of consecutive numbers is the middle one (RES-4288)",
    },
  }),
  S3_mean({
    id: "S3.mean.15",
    form: "the-mean-of-a-line-graph",
    g: [6, 7],
    kind: "integer",
    p: [rg(4, 20), rg(4, 20), rg(4, 20), rg(4, 20)],
    ok: (a, b, c, d) =>
      (a + b + c + d) % 4 === 0 &&
      ![a, b, c, d].includes((a + b + c + d) / 4) &&
      Math.max(a, b, c, d) !== Math.min(a, b, c, d),
    f: (a, b, c, d) => q((a + b + c + d) / 4),
    alt: (a, b, c, d) => q((a + b) / 4 + (c + d) / 4),
    t: {
      sum: (a, b, c, d) => q(a + b + c + d),
      highest: (a, b, c, d) => q(Math.max(a, b, c, d)),
      ends: (a, b, c, d) => ((a + d) % 2 === 0 ? q((a + d) / 2) : null),
    },
  }),
];

const S3_missing = calc("S3", "missing");
const S3_missing_specs: readonly Spec<never>[] = [
  S3_missing({
    id: "S3.missing.01",
    form: "the-third-number-for-a-given-mean",
    g: [6, 7],
    kind: "integer",
    p: [rg(8, 15), rg(3, 20), rg(3, 20)],
    ok: (a, b, c) => 3 * a - b - c > 0 && 3 * a - b - c !== a && b !== c,
    f: (a, b, c) => q(3 * a - b - c),
    alt: (a, b, c) => q(a + (a - b) + (a - c)),
    t: {
      "mean-itself": (a) => q(a),
      sum: (a) => q(3 * a),
      "known-sum": (a, b, c) => q(b + c),
    },
    c: [3],
  }),
  S3_missing({
    id: "S3.missing.02",
    form: "the-other-of-two-numbers",
    g: [6, 7],
    kind: "integer",
    p: [rg(8, 20), rg(3, 20)],
    ok: (a, b) => 2 * a - b > 0 && 2 * a - b !== a && a - b > 0 && a !== b,
    f: (a, b) => q(2 * a - b),
    alt: (a, b) => q(a + (a - b)),
    t: {
      "mean-itself": (a) => q(a),
      "mean-minus-number": (a, b) => q(a - b),
      added: (a, b) => q(a + b),
    },
    c: [2],
  }),
  S3_missing({
    id: "S3.missing.03",
    form: "the-fourth-number-for-a-given-mean",
    g: [6, 7],
    kind: "integer",
    p: [rg(8, 15), rg(3, 20), rg(3, 20), rg(3, 20)],
    ok: (a, b, c, d) =>
      4 * a - b - c - d > 0 &&
      4 * a - b - c - d !== a &&
      3 * a - b - c - d !== 4 * a - b - c - d,
    f: (a, b, c, d) => q(4 * a - b - c - d),
    alt: (a, b, c, d) => q(a + (a - b) + (a - c) + (a - d)),
    t: {
      "three-times": (a, b, c, d) =>
        3 * a - b - c - d > 0 ? q(3 * a - b - c - d) : null,
      "mean-itself": (a) => q(a),
      "known-sum": (a, b, c, d) => q(b + c + d),
    },
    c: [3, 4],
  }),
  S3_missing({
    id: "S3.missing.04",
    form: "the-number-to-raise-the-mean",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 9), rg(2, 9), rg(2, 9), rg(10, 14)],
    ok: (a, b, c, d) => 4 * d - a - b - c > d,
    f: (a, b, c, d) => q(4 * d - a - b - c),
    alt: (a, b, c, d) => q(d + (d - a) + (d - b) + (d - c)),
    t: {
      "target-mean": (a, b, c, d) => q(d),
      "old-sum": (a, b, c) => q(a + b + c),
    },
    c: [4],
  }),
  S3_missing({
    id: "S3.missing.05",
    form: "the-mean-after-adding-to-each",
    g: [6, 7],
    kind: "integer",
    p: [rg(5, 15), rg(2, 9)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a + b),
    alt: (a, b) => q((3 * a + 3 * b) / 3),
    t: {
      times: (a, b) => q(a * b),
      "mean-itself": (a) => q(a),
      "new-sum": (a, b) => q(3 * (a + b)),
    },
    c: [3],
  }),
  S3_missing({
    id: "S3.missing.06",
    form: "the-number-equal-to-the-mean",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 20), rg(2, 20)],
    ok: (a, b) => (a + b) % 2 === 0 && a !== b,
    f: (a, b) => q((a + b) / 2),
    alt: (a, b) =>
      q([...Array(a + b + 1).keys()].find((x) => 3 * x === a + b + x) ?? 0),
    t: { sum: (a, b) => q(a + b), larger: (a, b) => q(Math.max(a, b)) },
    c: [2],
  }),
  S3_missing({
    id: "S3.missing.07",
    form: "the-top-of-a-pyramid-of-means",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 9), rg(2, 9), rg(2, 9)],
    ok: (a, b, c) =>
      (a + 2 * b + c) % 4 === 0 &&
      (a + b) % 2 === 0 &&
      (b + c) % 2 === 0 &&
      (a + 2 * b + c) / 4 !== b,
    f: (a, b, c) => q((a + 2 * b + c) / 4),
    alt: (a, b, c) => q(((a + b) / 2 + (b + c) / 2) / 2),
    t: { middle: (a, b) => q(b), "sum-of-bottom": (a, b, c) => q(a + b + c) },
    c: [2, 4],
  }),
  S3_missing({
    id: "S3.missing.08",
    form: "the-last-score-for-a-target-mean",
    g: [6, 7],
    kind: "integer",
    p: [rg(6, 9), rg(3, 5), rg(10, 20)],
    ok: (a, b, c) => a * b - c > 0 && a * b - c !== a,
    f: (a, b, c) => q(a * b - c),
    alt: (a, b, c) =>
      q([...Array(a * b + 1).keys()].find((x) => c + x === a * b) ?? 0),
    t: { "mean-only": (a) => q(a), "sum-needed": (a, b) => q(a * b) },
  }),
  S3_missing({
    id: "S3.missing.09",
    form: "the-total-after-a-box-is-removed",
    g: [6, 7],
    kind: "integer",
    p: [rg(3, 9), rg(2, 8)],
    ok: (a, b) => a !== b && 5 * a - b !== 4 * a && a > b,
    f: (a, b) => q(5 * a - b),
    alt: (a, b) => q(4 * a + (a - b)),
    t: {
      "mean-times-four": (a) => q(4 * a),
      "mean-minus-box": (a, b) => q(a - b),
    },
    c: [4, 5],
  }),
  S3_missing({
    id: "S3.missing.10",
    form: "the-age-of-a-new-member",
    g: [6, 7],
    kind: "integer",
    p: [rg(9, 12), rg(3, 5), rg(10, 14)],
    ok: (a, b, c) =>
      c - a >= 1 &&
      c - a <= 2 &&
      (b + 1) * c - a * b !== c &&
      (b + 1) * c - a * b !== c - a,
    f: (a, b, c) => q((b + 1) * c - a * b),
    alt: (a, b, c) => q(c + b * (c - a)),
    t: {
      "mean-after": (a, b, c) => q(c),
      "mean-difference": (a, b, c) => q(c - a),
    },
    c: [1],
  }),
  S3_missing({
    id: "S3.missing.11",
    form: "the-shared-number-of-two-groups",
    g: [7, 8],
    kind: "integer",
    p: [rg(8, 14), rg(8, 14), rg(9, 13)],
    ok: (a, b, c) => {
      const x = 4 * a + 4 * b - 7 * c;
      return (
        x >= 3 &&
        x <= 30 &&
        4 * a - x >= 3 &&
        4 * b - x >= 3 &&
        ![a, b, c].includes(x) &&
        a !== b
      );
    },
    f: (a, b, c) => q(4 * a + 4 * b - 7 * c),
    alt: (a, b, c) => q(4 * (a + b) - 7 * c),
    t: {
      "two-sums": (a, b) => q(4 * a + 4 * b),
      "means-only": (a, b, c) => (a + b - c > 0 ? q(a + b - c) : null),
      "sum-of-all": (a, b, c) => q(7 * c),
    },
    origin: {
      olympiad: "a number counted twice in two overlapping groups (RES-4288)",
    },
  }),
  S3_missing({
    id: "S3.missing.12",
    form: "the-third-number-by-the-deviations",
    g: [7, 8],
    kind: "integer",
    p: [rg(10, 20), rg(2, 8), rg(2, 8)],
    ok: (a, b, c) => b !== c && a + b - c > 0,
    f: (a, b, c) => q(3 * a - (a - b) - (a + c)),
    alt: (a, b, c) => q(a + b - c),
    t: {
      "mean-itself": (a) => q(a),
      "sign-flipped": (a, b, c) => q(a - b + c),
      "only-first": (a, b) => q(a + b),
    },
    c: [3],
    origin: {
      olympiad: "the deviations from the mean add up to zero (RES-4288)",
    },
  }),
  S3_missing({
    id: "S3.missing.13",
    form: "the-mean-after-two-numbers-are-removed",
    g: [7, 8],
    kind: "integer",
    p: [rg(6, 15), rg(8, 40)],
    ok: (a, b) => (6 * a - b) % 4 === 0 && b < 3 * a && (6 * a - b) / 4 !== a,
    f: (a, b) => q((6 * a - b) / 4),
    alt: (a, b) => q(a + (2 * a - b) / 4),
    t: {
      "mean-itself": (a) => q(a),
      "sum-left": (a, b) => q(6 * a - b),
      "divided-by-six": (a, b) =>
        (6 * a - b) % 6 === 0 ? q((6 * a - b) / 6) : null,
    },
  }),
  S3_missing({
    id: "S3.missing.14",
    form: "the-larger-number-by-the-mean-and-the-difference",
    g: [7, 8],
    kind: "integer",
    p: [rg(8, 25), of(2, 4, 6, 8, 10)],
    f: (a, b) => q(a + b / 2),
    alt: (a, b) => q((2 * a + b) / 2),
    t: {
      "mean-plus-difference": (a, b) => q(a + b),
      smaller: (a, b) => q(a - b / 2),
      mean: (a) => q(a),
    },
    c: [2],
    origin: {
      olympiad: "two numbers placed symmetrically around their mean (RES-4288)",
    },
  }),
  S3_missing({
    id: "S3.missing.15",
    form: "the-mean-after-a-number-is-corrected",
    g: [7, 8],
    kind: "integer",
    p: [rg(10, 20), rg(10, 40), rg(10, 40)],
    ok: (a, b, c) => b !== c && (b - c) % 5 === 0,
    f: (a, b, c) => q((5 * a + b - c) / 5),
    alt: (a, b, c) => q(a + (b - c) / 5),
    t: {
      uncorrected: (a) => q(a),
      difference: (a, b, c) => q(Math.abs(b - c)),
      sum: (a, b, c) => q(5 * a + b - c),
    },
  }),
];

/** What each drawn number stands for, by template id, for the story that ADR-0130 writes around the numbers. */
const ROLES: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  "S1.tables.01": {
    a: "pages read on Monday",
    b: "pages read on Tuesday",
    c: "pages read on Wednesday",
  },
  "S1.tables.02": {
    a: "pages read on Monday",
    b: "pages read on Tuesday",
    c: "pages read on Wednesday",
  },
  "S1.tables.03": {
    a: "pages read on Monday",
    b: "pages read on Tuesday",
    c: "pages read on Wednesday",
  },
  "S1.tables.04": {
    a: "pages read in the three days in all",
    b: "pages read on Monday",
    c: "pages read on Tuesday",
  },
  "S1.tables.05": {
    a: "price of a loaf of bread",
    b: "price of a carton of milk",
  },
  "S1.tables.06": {
    a: "minutes past the hour when the bus leaves",
    b: "minutes past the next hour when the bus arrives",
    c: "hour when the bus leaves",
  },
  "S1.tables.07": {
    a: "height of the first child",
    b: "height of the second child",
    c: "height of the third child",
    d: "height of the fourth child",
    e: "the height asked about",
  },
  "S1.tables.08": {
    a: "first number of the row",
    b: "second number of the row",
    c: "third number of the row",
    d: "fourth number of the row",
  },
  "S1.tables.09": {
    a: "top left cell",
    b: "top right cell",
    c: "bottom left cell",
    d: "bottom right cell",
  },
  "S1.tables.10": {
    a: "first number of the first row",
    b: "second number of the first row",
    c: "third number of the first row",
  },
  "S1.tables.11": {
    a: "number in the first cell",
    b: "number in the second cell",
  },
  "S1.tables.12": {
    a: "price in the first shop",
    b: "price in the second shop",
    c: "number of notebooks",
  },
  "S1.tables.13": {
    a: "sum of the first row",
    b: "sum of the second row",
    c: "sum of the first column",
    d: "sum of the second column",
  },
  "S1.tables.14": {
    a: "hour of the first departure",
    b: "minute of the first departure",
    c: "minutes between departures",
  },
  "S1.tables.15": { a: "sum of the two dice" },
  "S1.tables.16": {
    a: "label of the first row",
    b: "label of the second row",
    c: "label of the first column",
    d: "label of the second column",
  },
  "S1.tables.17": {
    a: "people who chose the first answer",
    b: "people who chose the second answer",
    c: "people who chose the third answer",
  },
  "S2.bar-line.01": { a: "books one icon stands for", b: "icons drawn" },
  "S2.bar-line.02": {
    a: "height of the first bar",
    b: "height of the second bar",
  },
  "S2.bar-line.03": {
    a: "height of the first bar",
    b: "height of the second bar",
    c: "height of the third bar",
  },
  "S2.bar-line.04": {
    a: "lower mark of the scale",
    b: "gap between the two marks",
  },
  "S2.bar-line.05": {
    a: "temperature at the first hour",
    b: "temperature at the later hour",
    c: "the first hour",
    d: "hours between the two points",
  },
  "S2.bar-line.06": {
    a: "temperature at the start",
    b: "rise per hour",
    c: "number of hours",
  },
  "S2.bar-line.07": {
    a: "height of the first bar",
    b: "height of the second bar",
    c: "height of the third bar",
    d: "height of the fourth bar",
    e: "level of the dashed mark",
  },
  "S2.bar-line.08": {
    a: "height of the bar for Monday",
    b: "height of the bar for Tuesday",
    c: "height of the bar for Wednesday",
  },
  "S2.bar-line.09": {
    a: "morning temperature",
    b: "rise by noon",
    c: "fall by evening",
  },
  "S2.bar-line.10": { a: "height of the first bar" },
  "S2.bar-line.11": {
    a: "units in one square of the scale",
    b: "squares in the first bar",
    c: "squares in the second bar",
  },
  "S2.bar-line.12": {
    a: "sum of the three heights",
    b: "height of the first bar",
    c: "height of the second bar",
  },
  "S2.bar-line.13": {
    a: "value at the first point",
    b: "the large rise",
    c: "a small rise",
    d: "another small rise",
    e: "number of the steepest stretch",
  },
  "S2.bar-line.14": {
    a: "value of one grid line",
    b: "grid lines the highest bar spans",
    c: "grid lines of one lower bar",
    d: "grid lines of the other lower bar",
    e: "place of the highest bar",
  },
  "S2.bar-line.15": {
    a: "value of one grid line",
    b: "grid lines of the first point",
    c: "grid lines of the second point",
    d: "grid lines of the third point",
    e: "grid lines of the fourth point",
    f: "grid lines of the fifth point",
  },
  "S2.bar-line.16": {
    a: "sum of the five heights",
    b: "step between neighbouring bars",
  },
  "S2.bar-line.17": { a: "books one icon stands for", b: "whole icons drawn" },
  "S2.bar-line.18": {
    a: "height of the lower bar",
    b: "height of the higher bar",
  },
  "S3.mean.01": { a: "first number", b: "second number" },
  "S3.mean.02": { a: "first number", b: "second number", c: "third number" },
  "S3.mean.03": {
    a: "first number",
    b: "second number",
    c: "third number",
    d: "fourth number",
  },
  "S3.mean.04": {
    a: "temperature of the first measurements",
    b: "temperature of the other measurements",
    c: "number of the first measurements",
    d: "number of the other measurements",
  },
  "S3.mean.05": { a: "mean per day", b: "number of days" },
  "S3.mean.06": { a: "mean pages per day", b: "number of days" },
  "S3.mean.07": { a: "smallest of five consecutive numbers" },
  "S3.mean.08": { a: "pages on the first day", b: "pages on the second day" },
  "S3.mean.09": {
    a: "first number",
    b: "second number",
    c: "third number",
    d: "number to compare with",
  },
  "S3.mean.10": { a: "last number of the list that starts at 1" },
  "S3.mean.11": {
    a: "height of the first bar",
    b: "height of the second bar",
    c: "height of the third bar",
    d: "height of the fourth bar",
  },
  "S3.mean.12": { a: "morning temperature", b: "evening temperature" },
  "S3.mean.13": { a: "first number", b: "second number", c: "third number" },
  "S3.mean.14": { a: "the mean", b: "how many consecutive numbers" },
  "S3.mean.15": {
    a: "temperature at the first point",
    b: "temperature at the second point",
    c: "temperature at the third point",
    d: "temperature at the fourth point",
  },
  "S3.missing.01": {
    a: "the mean",
    b: "first known number",
    c: "second known number",
  },
  "S3.missing.02": { a: "the mean", b: "the known number" },
  "S3.missing.03": {
    a: "the mean",
    b: "first known number",
    c: "second known number",
    d: "third known number",
  },
  "S3.missing.04": {
    a: "first known number",
    b: "second known number",
    c: "third known number",
    d: "the mean to reach",
  },
  "S3.missing.05": { a: "the mean", b: "amount added to each number" },
  "S3.missing.06": { a: "first known number", b: "second known number" },
  "S3.missing.07": {
    a: "left number of the bottom row",
    b: "middle number of the bottom row",
    c: "right number of the bottom row",
  },
  "S3.missing.08": {
    a: "mean points to reach",
    b: "number of games",
    c: "points in the games already played",
  },
  "S3.missing.09": {
    a: "mean mass of five boxes",
    b: "mass of the removed box",
  },
  "S3.missing.10": {
    a: "mean age before",
    b: "members before",
    c: "mean age after",
  },
  "S3.missing.11": {
    a: "mean of the first four numbers",
    b: "mean of the last four numbers",
    c: "mean of all seven numbers",
  },
  "S3.missing.12": {
    a: "the mean",
    b: "how far the first number is below the mean",
    c: "how far the second number is above the mean",
  },
  "S3.missing.13": {
    a: "mean of six numbers",
    b: "sum of the two removed numbers",
  },
  "S3.missing.14": { a: "the mean", b: "difference of the two numbers" },
  "S3.missing.15": {
    a: "mean of the five numbers",
    b: "the actual number",
    c: "the number as recorded",
  },
};

/** The specs with the roles of their numbers attached. */
const dressed = (list: readonly Spec<never>[]): readonly Spec<never>[] =>
  list.map((spec) => {
    const roles = ROLES[spec.id];
    return roles ? ({ ...spec, roles } as Spec<never>) : spec;
  });

export const sSpecs1: readonly Spec<never>[] = dressed([
  ...S1_tables_specs,
  ...S2_bar_line_specs,
  ...S3_mean_specs,
  ...S3_missing_specs,
]);
