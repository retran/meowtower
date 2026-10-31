// Domain S, part 1: tables, bar and line charts, the mean and the missing number (RES-4288). The Dutch goals read tables
// at group 4, bar charts at group 3 and compute a simple mean at group 6. The data stand in the text, because the contract
// has no picture field. Texts are plain blanks in `content/tasks-s.ru.json`. Generated from one table with the strings.
import type { Q } from "../math/q.js";
import { calc, of, rg } from "./kitc.js";
import { q } from "./kitf.js";
import { SIGNS, type Spec } from "./spec.js";

const sign = (x: Q, y: Q): (typeof SIGNS)[number] => SIGNS[x.cmp(y) + 1] ?? "=";

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
    ok: (a, b, c) => b !== c,
    f: (a, b, c) => q(a - b - c),
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
    p: [rg(1, 4), rg(1, 4)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(2 * a + 3 * b),
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
    p: [rg(20, 50), rg(5, 15)],
    f: (a, b) => q(60 - a + b),
    t: {
      "minutes-subtracted": (a, b) => q(a - b),
      "hour-only": () => q(60),
      "hour-added": (a, b) => q(60 + b),
    },
    c: [8, 9, 60],
  }),
  S1_tables({
    id: "S1.tables.07",
    form: "the-count-above-a-level",
    g: [4, 5],
    kind: "integer",
    p: [rg(120, 150), rg(120, 150), rg(120, 150), rg(120, 150), rg(130, 140)],
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
    t: {
      largest: (a, b, c, d) => q(Math.max(a, b, c, d)),
      smallest: (a, b, c, d) => q(Math.min(a, b, c, d)),
    },
  }),
  S1_tables({
    id: "S1.tables.09",
    form: "the-second-column-total",
    g: [4, 5],
    kind: "integer",
    p: [rg(2, 9), rg(2, 9), rg(2, 9), rg(2, 9)],
    ok: (a, b, c, d) => new Set([b + d, a + c, c + d]).size === 3,
    f: (a, b, c, d) => q(b + d),
    t: {
      "first-column": (a, b, c) => q(a + c),
      "second-row": (a, b, c, d) => q(c + d),
    },
  }),
  S1_tables({
    id: "S1.tables.10",
    form: "the-doubled-row",
    g: [4, 5],
    kind: "integer",
    p: [rg(2, 9), rg(2, 9), rg(2, 9)],
    f: (a, b, c) => q(2 * (a + b + c)),
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
    t: { "one-item": (a, b) => q(a - b), "first-store": (a, b, c) => q(c * a) },
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
    t: { "icons-only": (a, b) => q(b), sum: (a, b) => q(a + b) },
  }),
  S2_bar_line({
    id: "S2.bar-line.02",
    form: "the-difference-of-two-bars",
    g: [3, 6],
    kind: "integer",
    p: [rg(5, 20), rg(25, 40)],
    f: (a, b) => q(b - a),
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
    p: [of(10, 20, 30, 40)],
    f: (a) => q(a + 5),
    t: {
      "lower-mark": (a) => q(a),
      "upper-mark": (a) => q(a + 10),
      "half-of-upper": (a) => (a === 10 ? null : q((a + 10) / 2)),
      "half-gap": () => q(5),
    },
    x: (a) => ({ y: String(a + 10) }),
    c: [2, 5, 10],
  }),
  S2_bar_line({
    id: "S2.bar-line.05",
    form: "the-rise-on-a-line-graph",
    g: [3, 6],
    kind: "integer",
    p: [rg(3, 12), rg(14, 25)],
    f: (a, b) => q(b - a),
    t: { sum: (a, b) => q(a + b), hours: () => q(12 - 8) },
    c: [8, 12],
  }),
  S2_bar_line({
    id: "S2.bar-line.06",
    form: "the-rise-per-hour",
    g: [3, 6],
    kind: "integer",
    p: [rg(2, 8), rg(2, 6), rg(2, 5)],
    ok: (a, b, c) => b !== c,
    f: (a, b) => q(b),
    t: { total: (a, b, c) => q(b * c), hours: (a, b, c) => q(c) },
    x: (a, b, c) => ({ x: String(a), y: String(a + b * c) }),
  }),
  S2_bar_line({
    id: "S2.bar-line.07",
    form: "the-bars-higher-than-a-level",
    g: [3, 6],
    kind: "integer",
    p: [rg(10, 40), rg(10, 40), rg(10, 40), rg(10, 40), rg(20, 30)],
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
    t: { height: (a, b, c) => q(Math.max(a, b, c)), last: () => q(3) },
    c: [1, 3],
  }),
  S2_bar_line({
    id: "S2.bar-line.09",
    form: "the-line-graph-after-a-rise-and-a-fall",
    g: [3, 6],
    kind: "integer",
    p: [rg(5, 12), rg(3, 8), rg(1, 5)],
    ok: (a, b, c) => b !== c,
    f: (a, b, c) => q(a + b - c),
    t: {
      "all-added": (a, b, c) => q(a + b + c),
      "rise-only": (a, b) => q(a + b),
    },
  }),
  S2_bar_line({
    id: "S2.bar-line.10",
    form: "the-bar-three-times-higher",
    g: [3, 6],
    kind: "integer",
    p: [rg(3, 15)],
    f: (a) => q(3 * a),
    t: { "three-more": (a) => q(a + 3), same: (a) => q(a) },
    c: [3],
  }),
  S2_bar_line({
    id: "S2.bar-line.11",
    form: "the-height-by-squares-of-a-scale",
    g: [3, 6],
    kind: "integer",
    p: [rg(2, 5), rg(3, 6), rg(7, 12)],
    f: (a, b, c) => q(a * (c - b)),
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
    ok: (a, b, c) => b !== c,
    f: (a, b, c) => q(a - b - c),
    t: { "one-removed": (a, b) => q(a - b), known: (a, b, c) => q(b + c) },
  }),
  S2_bar_line({
    id: "S2.bar-line.13",
    form: "the-steepest-stretch-of-a-line",
    g: [6, 7],
    kind: "integer",
    p: [rg(5, 15), rg(9, 15), rg(1, 4), rg(1, 4), rg(1, 2)],
    f: (_a, _b, _c, _d, e) => q(e),
    t: {
      "highest-point": () => q(3),
      "value-of-the-rise": (_a, b) => q(b),
    },
    x: (a, b, c, d, e) => {
      const first = e === 1 ? b : c;
      const second = e === 2 ? b : c;
      return {
        p: String(a),
        s: String(a + first),
        u: String(a + first + second),
        v: String(a + first + second + d),
      };
    },
    c: [1, 2, 3],
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
    t: { sum: (a, b) => q(a + b), larger: (a, b) => q(b) },
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
    t: { sum: (a, b) => q(a + b), mean: (a) => q(a) },
  }),
  S3_mean({
    id: "S3.mean.07",
    form: "the-mean-of-five-consecutive-numbers",
    g: [6, 7],
    kind: "integer",
    p: [rg(3, 40)],
    f: (a) => q(a + 2),
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
    p: [rg(3, 12), rg(3, 12)],
    ok: (a, b) => (a + b) % 3 === 0 && (a + b) % 2 === 0 && a !== b,
    f: (a, b) => q((a + b) / 3),
    t: { "two-days": (a, b) => q((a + b) / 2), sum: (a, b) => q(a + b) },
    c: [0, 2, 3],
  }),
  S3_mean({
    id: "S3.mean.09",
    form: "the-mean-compared-with-a-number",
    g: [6, 7],
    kind: "compare",
    p: [rg(2, 12), rg(2, 12), rg(2, 12), rg(2, 12)],
    ok: (a, b, c, d) => (a + b + c) % 3 === 0 && (a + b + c) / 3 !== d,
    f: (a, b, c, d) => sign(q((a + b + c) / 3), q(d)),
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
    t: {
      "last-number": (a) => q(a),
      "first-number": () => q(1),
      sum: (a) => q((a * (a + 1)) / 2),
    },
    c: [1, 2],
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
    t: {
      "three-times": (a, b, c, d) => q(3 * a - b - c - d),
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
    t: { times: (a, b) => q(a * b), "mean-itself": (a) => q(a) },
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
    p: [rg(10, 14), rg(3, 5), rg(11, 16)],
    ok: (a, b, c) =>
      (b + 1) * c - a * b > 0 &&
      c > a &&
      (b + 1) * c - a * b !== c &&
      (b + 1) * c - a * b !== c - a,
    f: (a, b, c) => q((b + 1) * c - a * b),
    t: {
      "mean-after": (a, b, c) => q(c),
      "mean-difference": (a, b, c) => q(c - a),
    },
    c: [1],
  }),
];

export const sSpecs1: readonly Spec<never>[] = [
  ...S1_tables_specs,
  ...S2_bar_line_specs,
  ...S3_mean_specs,
  ...S3_missing_specs,
];
