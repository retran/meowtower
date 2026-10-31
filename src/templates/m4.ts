// Domain M, part 4: volume, speed, units of area and capacity (RES-4286). The Dutch goals use l x b x h at group 7,
// compute average speed at group 7 and name the units of area and capacity at groups 6 and 7. Texts are plain
// blanks in `content/tasks-m.ru.json`. Generated from one table with the strings.
import type { Q } from "../math/q.js";
import { calc, of, rg } from "./kitc.js";
import { dec, q } from "./kitf.js";
import { SIGNS, type Spec } from "./spec.js";

const sign = (x: Q, y: Q): (typeof SIGNS)[number] => SIGNS[x.cmp(y) + 1] ?? "=";

/** A whole positive wrong answer, or null when it is not one or repeats a value in `no`. */
const w = (v: number, ...no: number[]): Q | null =>
  Number.isInteger(v) && v > 0 && !no.includes(v) ? q(v) : null;
/** A wrong sign, or null when it repeats one in `no`. */
const ws = (
  s: (typeof SIGNS)[number],
  ...no: (typeof SIGNS)[number][]
): (typeof SIGNS)[number] | null => (no.includes(s) ? null : s);
const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
/** `per` added `n` times, a second route to a product that adds instead of multiplying. */
const times = (n: number, per: number): number => {
  let sum = 0;
  for (let i = 0; i < n; i += 1) sum += per;
  return sum;
};
const repeat = (n: number, per: number): Q => q(times(n, per));
/** n over d when it is a finite decimal, otherwise null. */
const dq = (n: number, d: number): Q | null => {
  let m = d / gcd(n, d);
  while (m % 2 === 0) m /= 2;
  while (m % 5 === 0) m /= 5;
  return m === 1 && n > 0 ? q(n, d) : null;
};

/** Cubic tanks poured into an aquarium: the edge of the cube, then the length and width of the aquarium floor. */
const LEVELS: readonly (readonly [number, number, number])[] = [
  [6, 9, 6],
  [6, 12, 3],
  [6, 6, 4],
  [4, 8, 2],
  [4, 4, 2],
  [8, 16, 8],
  [8, 8, 4],
  [6, 18, 4],
];
export const levelOf = (i: number): readonly [number, number, number] =>
  LEVELS[i] ?? [2, 2, 2];

const M7_by_cubes = calc("M7", "by-cubes");
const M7_by_cubes_specs: readonly Spec<never>[] = [
  M7_by_cubes({
    id: "M7.by-cubes.01",
    form: "a-box-filled-with-unit-cubes",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 5), rg(2, 5), rg(2, 4)],
    ok: (a, b, c) => a !== b && b !== c && a !== c,
    f: (a, b, c) => q(a * b * c),
    alt: (a, b, c) => repeat(c, a * b),
    t: {
      sum: (a, b, c) => q(a + b + c),
      "sum-of-edges": (a, b, c) => w(4 * (a + b + c), a * b * c, a + b + c),
      "one-layer": (a, b, c) => w(a * b, a * b * c, a + b + c, 4 * (a + b + c)),
    },
    c: [1],
  }),
  M7_by_cubes({
    id: "M7.by-cubes.02",
    form: "layers-of-cubes",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 6), rg(3, 9)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a * b),
    alt: (a, b) => repeat(a, b),
    t: { sum: (a, b) => q(a + b), "one-layer": (a, b) => w(b, a * b, a + b) },
    c: [1],
  }),
  M7_by_cubes({
    id: "M7.by-cubes.03",
    form: "one-layer-and-several-layers",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 5), rg(2, 5), rg(2, 5)],
    ok: (a, b, c) => a !== b && b !== c && a !== c,
    f: (a, b, c) => q(a * b * c),
    alt: (a, b, c) => repeat(c, a * b),
    t: {
      "one-layer": (a, b) => q(a * b),
      sum: (a, b, c) => w(a + b + c, a * b * c, a * b),
      "layers-added": (a, b, c) => w(a * b + c, a * b * c, a * b, a + b + c),
    },
    c: [1],
  }),
  M7_by_cubes({
    id: "M7.by-cubes.04",
    form: "the-volume-of-a-cube",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 8)],
    f: (a) => q(a * a * a),
    alt: (a) => repeat(a, a * a),
    t: {
      "area-of-a-face": (a) => q(a * a),
      "edge-times-three": (a) => w(3 * a, a * a * a, a * a),
      "sum-of-edges": (a) => w(12 * a, a * a * a, a * a, 3 * a),
    },
  }),
  M7_by_cubes({
    id: "M7.by-cubes.05",
    form: "cubes-in-each-layer",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 6), rg(3, 9)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(b),
    alt: (a, b) => {
      let left = a * b;
      let rounds = 0;
      while (left > 0) {
        left -= a;
        rounds += 1;
      }
      return q(rounds);
    },
    t: {
      multiplied: (a, b) => q(a * b * a),
      "total-minus-layers": (a, b) => w(a * b - a, b, a * b * a),
      layers: (a, b) => w(a, b, a * b * a, a * b - a),
    },
    x: (a, b) => ({ x: String(a * b) }),
  }),
  M7_by_cubes({
    id: "M7.by-cubes.06",
    form: "how-many-cubes-are-missing",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 5), rg(2, 5), rg(3, 6), rg(1, 2)],
    ok: (a, b, c, d) => a !== b && d < c,
    f: (a, b, c, d) => q(a * b * (c - d)),
    alt: (a, b, c, d) => q(a * b * c - a * b * d),
    t: {
      "filled-layers": (a, b, c, d) => q(a * b * d),
      "whole-box": (a, b, c, d) => w(a * b * c, a * b * (c - d), a * b * d),
      "missing-layers": (a, b, c, d) =>
        w(c - d, a * b * (c - d), a * b * d, a * b * c),
      "cubes-minus-layers": (a, b, c, d) =>
        w(a * b * c - d, a * b * (c - d), a * b * d, a * b * c, c - d),
    },
    c: [1],
  }),
  M7_by_cubes({
    id: "M7.by-cubes.07",
    form: "a-tower-of-columns",
    g: [6, 7],
    kind: "integer",
    p: [rg(3, 10)],
    f: (a) => q((a * (a + 1)) / 2),
    alt: (a) => {
      let sum = 0;
      for (let k = 1; k <= a; k += 1) sum += k;
      return q(sum);
    },
    t: {
      square: (a) => q(a * a),
      "not-halved": (a) => w(a * (a + 1), (a * (a + 1)) / 2, a * a),
      "one-column-less": (a) =>
        w((a * (a - 1)) / 2, (a * (a + 1)) / 2, a * a, a * (a + 1)),
    },
    c: [1, 2],
  }),
  M7_by_cubes({
    id: "M7.by-cubes.08",
    form: "unit-cubes-without-a-painted-face",
    g: [6, 7],
    kind: "integer",
    p: [rg(3, 8)],
    f: (a) => q((a - 2) ** 3),
    alt: (a) => q(a ** 3 - (8 + 12 * (a - 2) + 6 * (a - 2) ** 2)),
    t: {
      "all-cubes": (a) => q(a ** 3),
      "painted-cubes": (a) => w(a ** 3 - (a - 2) ** 3, (a - 2) ** 3, a ** 3),
      "one-layer-off": (a) =>
        w((a - 1) ** 3, (a - 2) ** 3, a ** 3, a ** 3 - (a - 2) ** 3),
    },
    c: [1, 2],
    origin: { olympiad: "a painted cube taken apart (RES-4286)" },
  }),
  M7_by_cubes({
    id: "M7.by-cubes.09",
    form: "two-boxes-together",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 4), rg(2, 4), rg(2, 3), rg(2, 4), rg(2, 3), rg(2, 3)],
    ok: (a, b, c, d, e, f) => a * b * c !== d * e * f,
    f: (a, b, c, d, e, f) => q(a * b * c + d * e * f),
    alt: (a, b, c, d, e, f) => q(times(c, a * b) + times(f, d * e)),
    t: {
      "one-box": (a, b, c) => q(a * b * c),
      sum: (a, b, c, d, e, f) =>
        w(a + b + c + d + e + f, a * b * c + d * e * f, a * b * c),
      "dims-added": (a, b, c, d, e, f) =>
        w(
          (a + d) * (b + e) * (c + f),
          a * b * c + d * e * f,
          a * b * c,
          a + b + c + d + e + f,
        ),
    },
  }),
  M7_by_cubes({
    id: "M7.by-cubes.10",
    form: "stacks-of-cubes",
    g: [6, 7],
    kind: "integer",
    p: [rg(6, 9), rg(4, 12), rg(2, 4)],
    f: (a, b, c) => q((a - c) * b),
    alt: (a, b, c) => q(a * b - c * b),
    t: {
      "removed-only": (a, b, c) => q(c * b),
      "stacks-minus-cubes": (a, b, c) => w(a * b - c, (a - c) * b, c * b),
      "stacks-only": (a, b, c) => w(a - c, (a - c) * b, c * b, a * b - c),
    },
  }),
  M7_by_cubes({
    id: "M7.by-cubes.11",
    form: "the-difference-of-two-towers",
    g: [6, 7],
    kind: "integer",
    p: [rg(3, 5), rg(3, 5), rg(3, 4), rg(2, 3), rg(2, 3), rg(2, 3)],
    ok: (a, b, c, d, e, f) => a * b * c > d * e * f && a * b - d * e > 0,
    f: (a, b, c, d, e, f) => q(a * b * c - d * e * f),
    alt: (a, b, c, d, e, f) => q(times(c, a * b) - times(f, d * e)),
    t: {
      "one-tower": (a, b, c) => q(a * b * c),
      "bases-compared": (a, b, c, d, e) => q(a * b - d * e),
      "sum-of-towers": (a, b, c, d, e, f) => q(a * b * c + d * e * f),
    },
  }),
  M7_by_cubes({
    id: "M7.by-cubes.12",
    form: "cubes-painted-on-exactly-one-side",
    g: [6, 7],
    kind: "integer",
    p: [rg(3, 8)],
    f: (a) => q(6 * (a - 2) ** 2),
    alt: (a) => q(a ** 3 - (a - 2) ** 3 - 12 * (a - 2) - 8),
    t: {
      "edges-included": (a) => q(6 * a * a),
      "one-face-only": (a) => q((a - 2) ** 2),
      "no-paint": (a) => w((a - 2) ** 3, 6 * (a - 2) ** 2, (a - 2) ** 2),
    },
    c: [1, 6],
    origin: {
      olympiad:
        "a painted cube taken apart: cubes with exactly one painted face (RES-4286)",
    },
  }),
  M7_by_cubes({
    id: "M7.by-cubes.13",
    form: "cubes-painted-on-exactly-two-sides",
    g: [6, 7],
    kind: "integer",
    p: [rg(3, 8)],
    f: (a) => q(12 * (a - 2)),
    alt: (a) => q(a ** 3 - (a - 2) ** 3 - 6 * (a - 2) ** 2 - 8),
    t: {
      "corners-included": (a) => q(12 * a),
      "one-edge": (a) => q(a - 2),
      "corners-only": (a) => w(8, 12 * (a - 2), a - 2, 12 * a),
    },
    c: [1, 2, 12],
    origin: {
      olympiad:
        "a painted cube taken apart: cubes with exactly two painted faces (RES-4286)",
    },
  }),
  M7_by_cubes({
    id: "M7.by-cubes.14",
    form: "a-cube-without-its-top-layer",
    g: [6, 7],
    kind: "integer",
    p: [rg(3, 8)],
    f: (a) => q(a * a * (a - 1)),
    alt: (a) => repeat(a - 1, a * a),
    t: {
      "whole-cube": (a) => q(a ** 3),
      "removed-layer": (a) => q(a * a),
      "smaller-cube": (a) => w((a - 1) ** 3, a * a * (a - 1), a ** 3, a * a),
    },
  }),
];

const M7_formula = calc("M7", "formula");
const M7_formula_specs: readonly Spec<never>[] = [
  M7_formula({
    id: "M7.formula.01",
    form: "the-volume-of-a-cuboid-in-cubic-centimetres",
    g: [7, 8],
    kind: "integer",
    p: [rg(3, 9), rg(2, 8), rg(2, 6)],
    ok: (a, b, c) => a !== b && b !== c && a !== c,
    f: (a, b, c) => q(a * b * c),
    alt: (a, b, c) => repeat(c, a * b),
    t: {
      "surface-like": (a, b, c) => q(2 * (a * b + b * c + a * c)),
      "sum-of-edges": (a, b, c) =>
        w(4 * (a + b + c), a * b * c, 2 * (a * b + b * c + a * c)),
      "base-only": (a, b, c) =>
        w(a * b, a * b * c, 2 * (a * b + b * c + a * c), 4 * (a + b + c)),
    },
  }),
  M7_formula({
    id: "M7.formula.02",
    form: "the-volume-of-a-room-in-cubic-metres",
    g: [7, 8],
    kind: "integer",
    p: [rg(3, 9), rg(3, 7), rg(2, 3)],
    ok: (a, b, c) => a !== b && b !== c && a !== c,
    f: (a, b, c) => q(a * b * c),
    alt: (a, b, c) => repeat(c, a * b),
    t: {
      "floor-only": (a, b) => q(a * b),
      "surface-like": (a, b, c) =>
        w(2 * (a * b + b * c + a * c), a * b * c, a * b),
      sum: (a, b, c) =>
        w(a + b + c, a * b * c, a * b, 2 * (a * b + b * c + a * c)),
    },
  }),
  M7_formula({
    id: "M7.formula.03",
    form: "the-volume-of-a-cube-from-its-edge",
    g: [7, 8],
    kind: "integer",
    p: [rg(2, 9)],
    f: (a) => q(a * a * a),
    alt: (a) => repeat(a, a * a),
    t: {
      "edge-times-three": (a) => q(3 * a),
      "face-area": (a) => w(a * a, a * a * a, 3 * a),
      "sum-of-edges": (a) => w(12 * a, a * a * a, 3 * a, a * a),
    },
    c: [3],
  }),
  M7_formula({
    id: "M7.formula.04",
    form: "the-missing-height",
    g: [7, 8],
    kind: "integer",
    p: [rg(2, 6), rg(2, 6), rg(2, 6)],
    ok: (a, b, c) => a !== b && b !== c && a !== c,
    f: (a, b, c) => q(c),
    alt: (a, b, c) => {
      let height = 1;
      while (a * b * height !== a * b * c) height += 1;
      return q(height);
    },
    t: {
      "volume-over-one-side": (a, b, c) => q((a * b * c) / a),
      "base-area": (a, b, c) => w(a * b, c, b * c),
      "volume-minus-sides": (a, b, c) => w(a * b * c - a - b, c, b * c, a * b),
    },
    x: (a, b, c) => ({ x: String(a * b * c) }),
  }),
  M7_formula({
    id: "M7.formula.05",
    form: "the-capacity-of-a-tank-in-litres",
    g: [7, 8],
    kind: "integer",
    p: [rg(3, 8), rg(2, 6), rg(2, 5)],
    ok: (a, b, c) => a !== b && b !== c && a !== c,
    f: (a, b, c) => q(a * b * c),
    alt: (a, b, c) => repeat(c, a * b),
    t: {
      "surface-like": (a, b, c) => q(2 * (a * b + b * c + a * c)),
      "base-only": (a, b, c) =>
        w(a * b, a * b * c, 2 * (a * b + b * c + a * c)),
      "cubic-centimetres": (a, b, c) =>
        w(1000 * a * b * c, a * b * c, 2 * (a * b + b * c + a * c), a * b),
    },
    c: [1],
  }),
  M7_formula({
    id: "M7.formula.06",
    form: "cubic-decimetres-to-cubic-centimetres",
    g: [7, 8],
    kind: "integer",
    p: [rg(2, 9)],
    f: (a) => q(1000 * a),
    alt: (a) => repeat(a, 10 * 10 * 10),
    t: {
      hundred: (a) => q(100 * a),
      ten: (a) => w(10 * a, 1000 * a, 100 * a),
      thirty: (a) => w(30 * a, 1000 * a, 100 * a, 10 * a),
    },
    c: [1, 10, 100, 1000],
  }),
  M7_formula({
    id: "M7.formula.07",
    form: "cubic-metres-to-litres",
    g: [7, 8],
    kind: "integer",
    p: [rg(2, 9)],
    f: (a) => q(1000 * a),
    alt: (a) => repeat(a, 10 * 10 * 10),
    t: {
      hundred: (a) => q(100 * a),
      ten: (a) => w(10 * a, 1000 * a, 100 * a),
      thirty: (a) => w(30 * a, 1000 * a, 100 * a, 10 * a),
    },
    c: [1, 100, 1000],
  }),
  M7_formula({
    id: "M7.formula.08",
    form: "the-volume-from-the-base-area-and-the-height",
    g: [7, 8],
    kind: "integer",
    p: [rg(12, 40), rg(2, 8)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a * b),
    alt: (a, b) => repeat(b, a),
    t: {
      sum: (a, b) => q(a + b),
      "base-squared": (a, b) => w(a * a * b, a * b, a + b),
      divided: (a, b) => w(a / b, a * b, a + b, a * a * b),
    },
  }),
  M7_formula({
    id: "M7.formula.09",
    form: "all-sides-doubled",
    g: [7, 8],
    kind: "integer",
    p: [rg(2, 12)],
    f: (a) => q(8 * a),
    // The box 1 by 1 by a, with every measurement doubled.
    alt: (a) => q(2 * 1 * (2 * 1) * (2 * a)),
    t: {
      doubled: (a) => q(2 * a),
      "four-times": (a) => w(4 * a, 8 * a, 2 * a),
      "six-times": (a) => w(6 * a, 8 * a, 2 * a, 4 * a),
    },
    c: [2, 8],
  }),
  M7_formula({
    id: "M7.formula.10",
    form: "the-volume-of-a-swimming-pool",
    g: [7, 8],
    kind: "integer",
    p: [of(10, 20, 25), of(5, 8, 10), rg(1, 3)],
    ok: (a, b) => a !== b,
    f: (a, b, c) => q(a * b * c),
    alt: (a, b, c) => repeat(c, a * b),
    t: {
      "floor-only": (a, b) => q(a * b),
      "surface-like": (a, b, c) =>
        w(2 * (a * b + b * c + a * c), a * b * c, a * b),
      sum: (a, b, c) =>
        w(a + b + c, a * b * c, a * b, 2 * (a * b + b * c + a * c)),
    },
  }),
  M7_formula({
    id: "M7.formula.11",
    form: "cubes-of-one-cubic-decimetre-in-a-box",
    g: [7, 8],
    kind: "integer",
    p: [rg(2, 5), rg(2, 5), rg(2, 5)],
    ok: (a, b, c) => a !== b && b !== c && a !== c,
    f: (a, b, c) => q(a * b * c),
    alt: (a, b, c) => q((10 * a * 10 * b * 10 * c) / 1000),
    t: {
      "cubic-centimetres": (a, b, c) => q(1000 * a * b * c),
      "divided-by-ten": (a, b, c) =>
        w((10 * a * 10 * b * 10 * c) / 10, a * b * c, 1000 * a * b * c),
      "divided-by-hundred": (a, b, c) =>
        w(
          (10 * a * 10 * b * 10 * c) / 100,
          a * b * c,
          1000 * a * b * c,
          (10 * a * 10 * b * 10 * c) / 10,
        ),
    },
    x: (a, b, c) => ({
      x: String(10 * a),
      y: String(10 * b),
      z: String(10 * c),
    }),
    c: [10, 1000],
  }),
  M7_formula({
    id: "M7.formula.12",
    form: "the-capacity-of-a-box-with-sides-in-different-units",
    g: [7, 8],
    kind: "integer",
    p: [rg(1, 2), of(40, 50, 60), of(30, 40, 50)],
    ok: (a, b, c) => b !== c,
    f: (a, b, c) => q((a * b * c) / 10),
    alt: (a, b, c) => q((100 * a * b * c) / 1000),
    t: {
      "units-not-converted": (a, b, c) => q(a * b * c),
      "cubic-centimetres": (a, b, c) => q(100 * a * b * c),
      "cm-as-dm": (a, b, c) => w(10 * a * b * c, (a * b * c) / 10),
    },
    c: [1, 1000],
  }),
  M7_formula({
    id: "M7.formula.13",
    form: "the-volume-of-a-cube-from-the-sum-of-its-edges",
    g: [7, 8],
    kind: "integer",
    p: [rg(2, 9)],
    f: (a) => q(a ** 3),
    alt: (a) => {
      let edge = 1;
      while (12 * edge !== 12 * a) edge += 1;
      return q(edge * edge * edge);
    },
    t: {
      "edge-itself": (a) => q(a),
      "edge-by-six": (a) => q((2 * a) ** 3),
      "edge-by-four": (a) => q((3 * a) ** 3),
    },
    x: (a) => ({ x: String(12 * a) }),
    c: [12],
  }),
  M7_formula({
    id: "M7.formula.14",
    form: "the-volume-of-a-block-with-a-corner-cut-out",
    g: [7, 8],
    kind: "integer",
    p: [rg(5, 8), rg(4, 6), rg(3, 5), rg(1, 2)],
    ok: (a, b, c) => a !== b && b !== c,
    f: (a, b, c, d) => q(a * b * c - d ** 3),
    alt: (a, b, c, d) => q(times(c, a * b) - times(d, d * d)),
    t: {
      "cut-added": (a, b, c, d) => q(a * b * c + d ** 3),
      "whole-block": (a, b, c) => q(a * b * c),
      "cut-face": (a, b, c, d) => w(a * b * c - d * d, a * b * c - d ** 3),
    },
  }),
  M7_formula({
    id: "M7.formula.15",
    form: "the-volume-from-the-areas-of-three-faces",
    g: [7, 8],
    kind: "integer",
    p: [rg(2, 5), rg(3, 6), rg(4, 7)],
    ok: (a, b, c) => a !== b && b !== c,
    f: (a, b, c) => q(a * b * c),
    // The square root of the product of the three face areas.
    alt: (a, b, c) => q(Math.round(Math.sqrt(a * b * (b * c) * (a * c)))),
    t: {
      "product-of-areas": (a, b, c) => q(a * b * (b * c) * (a * c)),
      "areas-added": (a, b, c) => q(a * b + b * c + a * c),
    },
    x: (a, b, c) => ({ x: String(a * b), y: String(b * c), z: String(a * c) }),
    origin: {
      olympiad:
        "the three face areas multiply to the square of the volume, found by trying the edges, in the spirit of the MCCME papers (RES-4286)",
    },
  }),
];

const M8_speed = calc("M8", "speed");
const M8_speed_specs: readonly Spec<never>[] = [
  M8_speed({
    id: "M8.speed.01",
    form: "the-speed-of-a-walker",
    g: [6, 7],
    kind: "integer",
    p: [rg(3, 6), rg(3, 9)],
    ok: (a, b) => a !== b,
    f: (a) => q(a),
    alt: (a, b) => {
      let speed = 1;
      while (speed * b !== a * b) speed += 1;
      return q(speed);
    },
    t: {
      difference: (a, b) => q(a * b - b),
      multiplied: (a, b) => w(a * b * b, a, a * b - b),
      "distance-itself": (a, b) => w(a * b, a, a * b - b, a * b * b),
    },
    x: (a, b) => ({ x: String(a * b) }),
  }),
  M8_speed({
    id: "M8.speed.02",
    form: "the-distance-of-a-cyclist",
    g: [6, 7],
    kind: "integer",
    p: [rg(8, 25), rg(2, 6)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a * b),
    alt: (a, b) => repeat(b, a),
    t: {
      added: (a, b) => q(a + b),
      divided: (a, b) => w(a / b, a * b, a + b),
      subtracted: (a, b) => w(a - b, a * b, a + b),
    },
  }),
  M8_speed({
    id: "M8.speed.03",
    form: "the-time-for-a-journey",
    g: [6, 7],
    kind: "integer",
    p: [of(40, 50, 60, 70, 80, 90, 100), rg(2, 9)],
    f: (a, b) => q(b),
    alt: (a, b) => {
      let left = a * b;
      let hours = 0;
      while (left > 0) {
        left -= a;
        hours += 1;
      }
      return q(hours);
    },
    t: {
      multiplied: (a, b) => q(a * b),
      "given-multiplied": (a, b) => w(a * a * b, b, a * b),
      subtracted: (a, b) => w(a * b - a, b, a * b, a * a * b),
    },
    x: (a, b) => ({ x: String(a * b) }),
  }),
  M8_speed({
    id: "M8.speed.04",
    form: "metres-per-second-to-kilometres-per-hour",
    g: [6, 7],
    kind: "integer",
    p: [of(5, 10, 15, 20, 25, 30, 35, 40)],
    f: (a) => q((18 * a) / 5),
    // One metre per second is 3,6 kilometres per hour.
    alt: (a) => q(36 * a, 10),
    t: {
      "ten-times": (a) => q(10 * a),
      "seconds-only": (a) => w(3600 * a, (18 * a) / 5, 10 * a),
      "minute-factor": (a) => w(60 * a, (18 * a) / 5, 10 * a, 3600 * a),
    },
    c: [10, 1000, 3600],
  }),
  M8_speed({
    id: "M8.speed.05",
    form: "kilometres-per-hour-to-metres-per-second",
    g: [6, 7],
    kind: "integer",
    p: [of(18, 36, 54, 72, 90, 108, 126, 144)],
    f: (a) => q((5 * a) / 18),
    // One kilometre per hour is 1 : 3,6 metres per second.
    alt: (a) => q(10 * a, 36),
    t: {
      "not-divided": (a) => q(a * 1000),
      "metres-per-minute": (a) => w((a * 1000) / 60, (5 * a) / 18, a * 1000),
      "opposite-way": (a) =>
        w((18 * a) / 5, (5 * a) / 18, a * 1000, (a * 1000) / 60),
    },
    c: [1000, 3600],
  }),
  M8_speed({
    id: "M8.speed.06",
    form: "the-distance-at-a-steady-pace-in-metres-per-minute",
    origin: {
      extension: "speed in metres per minute, Russian grade 4 (RES-4286)",
    },
    g: [6, 7],
    kind: "integer",
    p: [of(60, 70, 80, 90), rg(5, 20)],
    f: (a, b) => q(a * b),
    alt: (a, b) => repeat(b, a),
    t: {
      added: (a, b) => q(a + b),
      divided: (a, b) => w(a / b, a * b, a + b),
      subtracted: (a, b) => w(a - b, a * b, a + b, a / b),
    },
  }),
  M8_speed({
    id: "M8.speed.07",
    form: "which-vehicle-is-faster",
    g: [6, 7],
    kind: "compare",
    p: [rg(40, 90), rg(2, 4), rg(40, 90), rg(2, 4)],
    ok: (a, b, c, d) =>
      a !== c && b !== d && sign(q(a), q(c)) !== sign(q(a * b), q(c * d)),
    f: (a, b, c) => sign(q(a), q(c)),
    // Both vehicles over the common time b by d.
    alt: (a, b, c, d) => sign(q(a * b * d), q(c * d * b)),
    t: {
      "distances-compared": (a, b, c, d) => sign(q(a * b), q(c * d)),
      "times-compared": (a, b, c, d) =>
        ws(sign(q(b), q(d)), sign(q(a), q(c)), sign(q(a * b), q(c * d))),
    },
    x: (a, b, c, d) => ({
      x: String(a * b),
      y: String(c * d),
      sign: sign(q(a), q(c)),
    }),
  }),
  M8_speed({
    id: "M8.speed.08",
    form: "two-travellers-approaching-each-other",
    g: [6, 7],
    kind: "integer",
    p: [rg(4, 12), rg(4, 12), rg(2, 4)],
    ok: (a, b) => a !== b,
    f: (a, b, c) => q((a + b) * c),
    alt: (a, b, c) => q(a * c + b * c),
    t: {
      "one-speed": (a, b, c) => q(a * c),
      "speeds-subtracted": (a, b, c) =>
        w(Math.abs(a - b) * c, (a + b) * c, a * c),
      "speeds-added": (a, b, c) =>
        w(a + b, (a + b) * c, a * c, Math.abs(a - b) * c),
    },
  }),
  M8_speed({
    id: "M8.speed.09",
    form: "one-traveller-catching-up",
    g: [6, 7],
    kind: "integer",
    p: [rg(12, 24), rg(4, 11), rg(2, 4)],
    ok: (a, b) => a > b,
    f: (a, b, c) => q((a - b) * c),
    alt: (a, b, c) => repeat(c, a - b),
    t: {
      "speeds-added": (a, b, c) => q((a + b) * c),
      "difference-only": (a, b, c) => w(a - b, (a - b) * c, (a + b) * c),
      "faster-only": (a, b, c) => w(a * c, (a - b) * c, (a + b) * c, a - b),
    },
  }),
  M8_speed({
    id: "M8.speed.10",
    form: "the-distance-in-half-an-hour",
    g: [6, 7],
    kind: "integer",
    p: [of(30, 40, 50, 60, 70, 80, 90, 100, 110, 120)],
    f: (a) => q(a / 2),
    // The distance in one minute, taken for thirty minutes.
    alt: (a) => q(a * 30, 60),
    t: {
      "full-hour": (a) => q(a),
      "point-three": (a) => w((3 * a) / 10, a / 2, a),
      "minutes-times-speed": (a) => w(30 * a, a / 2, a, (3 * a) / 10),
    },
    c: [2],
  }),
  M8_speed({
    id: "M8.speed.11",
    form: "the-time-to-cross-a-distance-in-minutes",
    origin: {
      extension: "speed in metres per minute, Russian grade 4 (RES-4286)",
    },
    g: [6, 7],
    kind: "integer",
    p: [of(50, 60, 70, 80, 90), rg(3, 9)],
    f: (a, b) => q(b),
    alt: (a, b) => {
      let left = a * b;
      let minutes = 0;
      while (left > 0) {
        left -= a;
        minutes += 1;
      }
      return q(minutes);
    },
    t: {
      multiplied: (a, b) => q(a * b),
      "given-multiplied": (a, b) => w(a * a * b, b, a * b),
      subtracted: (a, b) => w(a * b - a, b, a * b, a * a * b),
    },
    x: (a, b) => ({ x: String(a * b) }),
  }),
  M8_speed({
    id: "M8.speed.12",
    form: "the-speed-from-a-distance-and-minutes",
    g: [6, 7],
    kind: "decimal",
    p: [rg(2, 12), of(20, 30, 40, 50)],
    f: (a, b) => q(60 * a, b),
    // The kilometres in one minute, taken for sixty minutes.
    alt: (a, b) => q(a, b).mul(q(60)),
    t: {
      "minutes-as-hours": (a, b) => dq(a, b),
      "hundred-minutes": (a, b) => dq(100 * a, b),
    },
    c: [60, 100],
  }),
  M8_speed({
    id: "M8.speed.13",
    form: "the-time-in-hours-and-minutes",
    g: [6, 7],
    kind: "pair",
    p: [rg(1, 4), of(15, 30, 45), of(40, 48, 60, 64, 80)],
    f: (a, b) => [q(a), q(b)],
    alt: (a, b, c) => {
      const minutes = Math.round(((c * a + (c * b) / 60) * 60) / c);
      return [q(Math.floor(minutes / 60)), q(minutes % 60)];
    },
    t: {
      "decimal-digits-as-minutes": (a, b) => [q(a), q((100 * b) / 60)],
      swapped: (a, b) => [q(b), q(a)],
      "hours-only": (a) => [q(a), q(0)],
    },
    x: (a, b, c) => ({ x: String(c * a + (c * b) / 60) }),
    c: [60],
  }),
  M8_speed({
    id: "M8.speed.14",
    form: "the-distance-from-a-graph",
    g: [6, 7],
    kind: "integer",
    p: [rg(3, 12), of(5, 7, 9)],
    f: (a, b) => q(a * b),
    // Read from the point at two hours, which is 2a kilometres.
    alt: (a, b) => q(2 * a * b, 2),
    t: {
      "first-point-as-speed": (a, b) => q(2 * a * b),
      "last-point": (a, b) => w(4 * a, a * b, 2 * a * b, 4 * a + (b - 4)),
      "additive-extension": (a, b) => q(4 * a + (b - 4)),
    },
    c: [4],
    roles: { a: "speed in kilometres per hour", b: "hours asked" },
  }),
  M8_speed({
    id: "M8.speed.15",
    form: "a-motorcyclist-catching-up",
    g: [7, 8],
    kind: "integer",
    p: [of(10, 12, 15, 18, 20), rg(1, 3), of(2, 3, 4, 5, 6)],
    ok: (a, b, c) =>
      (a * b) % c === 0 && (a * b) / c !== b && (a * b) / c !== c,
    f: (a, b, c) => q((a * b) / c),
    alt: (a, b, c) => {
      let gap = a * b;
      let hours = 0;
      while (gap > 0) {
        gap -= c;
        hours += 1;
      }
      return q(hours);
    },
    t: {
      "head-start-repeated": (a, b) => q(b),
      "closing-speed": (a, b, c) => q(c),
      "speeds-added": (a, b, c) =>
        (a * b) % (a + c + a) === 0
          ? w((a * b) / (2 * a + c), (a * b) / c)
          : null,
    },
    x: (a, b, c) => ({ x: String(a + c) }),
    origin: {
      olympiad:
        "a chase with a head start: the gap closes at the difference of the speeds, in the spirit of the motion items of the MCCME papers (RES-4286)",
    },
    roles: {
      a: "speed of the cyclist",
      b: "head start in hours",
      x: "speed of the motorcyclist",
    },
  }),
  M8_speed({
    id: "M8.speed.16",
    form: "a-train-on-a-bridge",
    g: [7, 8],
    kind: "integer",
    p: [of(10, 15, 20), of(100, 150, 200), of(200, 300, 400, 500)],
    ok: (a, b, c) => (b + c) % a === 0 && b / a !== c / a,
    f: (a, b, c) => q((b + c) / a),
    // The head crosses the bridge, then the tail covers the length of the train.
    alt: (a, b, c) => q(c / a + b / a),
    t: {
      "bridge-only": (a, b, c) => (c % a === 0 ? q(c / a) : null),
      "train-only": (a, b) => (b % a === 0 ? q(b / a) : null),
    },
    origin: {
      olympiad:
        "a train passing a bridge: the tail travels the length of the bridge plus the length of the train, a classic motion item in the spirit of the MCCME papers (RES-4286)",
    },
    roles: {
      a: "speed in metres per second",
      b: "length of the train",
      c: "length of the bridge",
    },
  }),
];

const M9_area_units = calc("M9", "area-units");
const M9_area_units_specs: readonly Spec<never>[] = [
  M9_area_units({
    id: "M9.area-units.01",
    form: "square-metres-to-square-centimetres",
    g: [7, 8],
    kind: "integer",
    p: [rg(2, 19)],
    f: (a) => q(10000 * a),
    alt: (a) => repeat(a, 100 * 100),
    t: {
      hundred: (a) => q(100 * a),
      "two-hundred": (a) => w(200 * a, 10000 * a, 100 * a),
      thousand: (a) => w(1000 * a, 10000 * a, 100 * a, 200 * a),
    },
    c: [1, 100, 10000],
  }),
  M9_area_units({
    id: "M9.area-units.02",
    form: "square-centimetres-to-square-millimetres",
    g: [7, 8],
    kind: "integer",
    p: [rg(2, 19)],
    f: (a) => q(100 * a),
    alt: (a) => repeat(a, 10 * 10),
    t: {
      ten: (a) => q(10 * a),
      twenty: (a) => w(20 * a, 100 * a, 10 * a),
      thousand: (a) => w(1000 * a, 100 * a, 10 * a, 20 * a),
    },
    c: [1, 10, 100],
  }),
  M9_area_units({
    id: "M9.area-units.03",
    form: "square-kilometres-to-hectares",
    g: [7, 8],
    kind: "integer",
    p: [rg(2, 19)],
    f: (a) => q(100 * a),
    alt: (a) => repeat(a, 10 * 10),
    t: {
      ten: (a) => q(10 * a),
      twenty: (a) => w(20 * a, 100 * a, 10 * a),
      thousand: (a) => w(1000 * a, 100 * a, 10 * a, 20 * a),
    },
    c: [1, 10, 100],
  }),
  M9_area_units({
    id: "M9.area-units.04",
    form: "hectares-to-square-metres",
    g: [7, 8],
    kind: "integer",
    p: [rg(2, 19)],
    f: (a) => q(10000 * a),
    alt: (a) => repeat(a, 100 * 100),
    t: {
      thousand: (a) => q(1000 * a),
      hundred: (a) => w(100 * a, 10000 * a, 1000 * a),
      "two-hundred": (a) => w(200 * a, 10000 * a, 1000 * a, 100 * a),
    },
    c: [1, 1000, 10000],
  }),
  M9_area_units({
    id: "M9.area-units.05",
    form: "square-metres-to-square-decimetres",
    g: [7, 8],
    kind: "integer",
    p: [rg(2, 19)],
    f: (a) => q(100 * a),
    alt: (a) => repeat(a, 10 * 10),
    t: {
      ten: (a) => q(10 * a),
      twenty: (a) => w(20 * a, 100 * a, 10 * a),
      thousand: (a) => w(1000 * a, 100 * a, 10 * a, 20 * a),
    },
    c: [1, 10, 100],
  }),
  M9_area_units({
    id: "M9.area-units.06",
    form: "square-decimetres-to-square-centimetres",
    g: [7, 8],
    kind: "integer",
    p: [rg(2, 19)],
    f: (a) => q(100 * a),
    alt: (a) => repeat(a, 10 * 10),
    t: {
      ten: (a) => q(10 * a),
      twenty: (a) => w(20 * a, 100 * a, 10 * a),
      thousand: (a) => w(1000 * a, 100 * a, 10 * a, 20 * a),
    },
    c: [1, 10, 100],
  }),
  M9_area_units({
    id: "M9.area-units.07",
    form: "ares-to-square-metres",
    g: [7, 8],
    kind: "integer",
    p: [rg(2, 19)],
    f: (a) => q(100 * a),
    alt: (a) => repeat(a, 10 * 10),
    t: {
      ten: (a) => q(10 * a),
      twenty: (a) => w(20 * a, 100 * a, 10 * a),
      "ten-thousand": (a) => w(10000 * a, 100 * a, 10 * a, 20 * a),
    },
    c: [1, 10, 100],
  }),
  M9_area_units({
    id: "M9.area-units.08",
    form: "hectares-to-ares",
    g: [7, 8],
    kind: "integer",
    p: [rg(2, 19)],
    f: (a) => q(100 * a),
    alt: (a) => repeat(a, 10 * 10),
    t: {
      ten: (a) => q(10 * a),
      twenty: (a) => w(20 * a, 100 * a, 10 * a),
      "ten-thousand": (a) => w(10000 * a, 100 * a, 10 * a, 20 * a),
    },
    c: [1, 10, 100],
  }),
  M9_area_units({
    id: "M9.area-units.09",
    form: "compare-areas-in-different-units",
    g: [7, 8],
    kind: "compare",
    p: [rg(2, 5), of(-60, -40, -20, -10, 0, 10, 20, 40)],
    f: (a, b) => sign(q(100 * a), q(100 * a + b)),
    // Both areas in square metres.
    alt: (a, b) => sign(q(a), q(100 * a + b, 100)),
    t: { "numbers-compared": (a, b) => sign(q(a), q(100 * a + b)) },
    x: (a, b) => ({
      b: String(100 * a + b),
      sign: sign(q(100 * a), q(100 * a + b)),
    }),
    c: [1, 100],
  }),
  M9_area_units({
    id: "M9.area-units.10",
    form: "square-metres-as-a-fraction-of-a-hectare",
    g: [7, 8],
    kind: "decimal",
    p: [
      of(
        1000,
        2000,
        2500,
        3000,
        4000,
        5000,
        6500,
        7500,
        8000,
        12500,
        15000,
        20000,
      ),
    ],
    f: (a) => q(a, 10000),
    // Square metres to ares, then ares to hectares.
    alt: (a) => q(a, 100).mul(q(1, 100)),
    t: {
      "moved-too-far": (a) => q(a, 1000),
      "moved-two-places": (a) => dq(a, 100),
      "moved-five-places": (a) => dq(a, 100000),
    },
    c: [1, 1000, 10000],
  }),
  M9_area_units({
    id: "M9.area-units.11",
    form: "tiles-for-a-floor-in-different-units",
    g: [7, 8],
    kind: "integer",
    p: [rg(2, 9), of(10, 20, 25, 50)],
    f: (a, b) => q(a * (100 / b) ** 2),
    // The floor in square centimetres divided by the area of one tile.
    alt: (a, b) => q((10000 * a) / (b * b)),
    t: {
      "forgot-square": (a, b) => q((100 * a) / b),
      "ten-thousand": (a, b) => w(10000 * a, a * (100 / b) ** 2, (100 * a) / b),
      "tile-area-twenty": (a, b) =>
        w((10000 * a) / b, a * (100 / b) ** 2, (100 * a) / b, 10000 * a),
    },
    c: [1, 100, 10000],
  }),
  M9_area_units({
    id: "M9.area-units.12",
    form: "compare-square-decimetres-against-square-metres",
    g: [7, 8],
    kind: "compare",
    p: [rg(2, 5), of(-60, -40, -20, -10, 0, 10, 20, 40)],
    f: (a, b) => sign(q(100 * a + b), q(100 * a)),
    // Both areas in square metres.
    alt: (a, b) => sign(q(100 * a + b, 100), q(a)),
    t: { "numbers-compared": (a, b) => sign(q(100 * a + b), q(a)) },
    x: (a, b) => ({ b: String(100 * a + b) }),
    c: [1, 100],
  }),
  M9_area_units({
    id: "M9.area-units.13",
    form: "decimal-square-metres-to-square-decimetres",
    g: [7, 8],
    kind: "integer",
    p: [rg(11, 59)],
    ok: (a) => a % 10 !== 0,
    f: (a) => q(10 * a),
    // The whole square metres and the tenths, each in square decimetres.
    alt: (a) => q(100 * Math.floor(a / 10) + 10 * (a % 10)),
    t: {
      "linear-factor": (a) => q(a),
      "ten-thousand": (a) => q(1000 * a),
      "cubic-factor": (a) => q(100 * a),
    },
    x: (a) => ({ x: dec(a, 1) }),
    c: [10, 100, 10000],
  }),
  M9_area_units({
    id: "M9.area-units.14",
    form: "a-square-kilometre-in-a-line-of-square-metres",
    g: [7, 8],
    kind: "integer",
    p: [rg(2, 19)],
    f: (a) => q(1000 * a),
    // The squares in a row of one square kilometre, each one metre long, in kilometres.
    alt: (a) => q((a * 1000 * 1000) / 1000),
    t: {
      "metres-not-kilometres": (a) => q(1000000 * a),
      "linear-factor": (a) => q(a),
    },
    c: [1, 1000, 1000000],
    origin: {
      olympiad:
        "a square kilometre holds a million square metres, a large-number item in the spirit of the Kangoeroe reports (RES-4286)",
    },
  }),
  M9_area_units({
    id: "M9.area-units.15",
    form: "the-fence-around-a-square-field-in-hectares",
    g: [7, 8],
    kind: "integer",
    p: [of(1, 4, 9, 16, 25, 36, 49, 64, 81, 100)],
    f: (a) => q(400 * Math.sqrt(a)),
    // One hectare is one square hectometre: the side in hectometres, times four, in metres.
    alt: (a) => q(Math.sqrt(a) * 4 * 100),
    t: {
      "side-only": (a) => q(100 * Math.sqrt(a)),
      "hectares-times-four": (a) =>
        w(4 * a, 400 * Math.sqrt(a), 100 * Math.sqrt(a)),
      "side-by-hundreds": (a) => w(400 * a, 400 * Math.sqrt(a)),
    },
    x: (a) => ({ s: String(100 * Math.sqrt(a)) }),
    c: [4],
  }),
];

const M10_capacity = calc("M10", "capacity");
const M10_capacity_specs: readonly Spec<never>[] = [
  M10_capacity({
    id: "M10.capacity.01",
    form: "litres-to-decilitres",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 19)],
    f: (a) => q(10 * a),
    alt: (a) => repeat(a, 10),
    t: {
      hundred: (a) => q(100 * a),
      thousand: (a) => w(1000 * a, 10 * a, 100 * a),
    },
    c: [10, 100],
  }),
  M10_capacity({
    id: "M10.capacity.02",
    form: "litres-to-centilitres",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 19)],
    f: (a) => q(100 * a),
    alt: (a) => repeat(a, 100),
    t: { ten: (a) => q(10 * a), thousand: (a) => w(1000 * a, 100 * a, 10 * a) },
    c: [10, 100],
  }),
  M10_capacity({
    id: "M10.capacity.03",
    form: "litres-to-millilitres",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 19)],
    f: (a) => q(1000 * a),
    alt: (a) => repeat(a, 1000),
    t: {
      hundred: (a) => q(100 * a),
      ten: (a) => w(10 * a, 1000 * a, 100 * a),
      "ten-thousand": (a) => w(10000 * a, 1000 * a, 100 * a, 10 * a),
    },
    c: [100, 1000],
  }),
  M10_capacity({
    id: "M10.capacity.04",
    form: "decilitres-to-centilitres",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 19)],
    f: (a) => q(10 * a),
    alt: (a) => q((100 * a) / 10),
    t: {
      hundred: (a) => q(100 * a),
      thousand: (a) => w(1000 * a, 10 * a, 100 * a),
    },
    c: [10, 100],
  }),
  M10_capacity({
    id: "M10.capacity.05",
    form: "millilitres-to-litres",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 19)],
    f: (a) => q(a),
    alt: (a) => {
      let left = 1000 * a;
      let litres = 0;
      while (left > 0) {
        left -= 1000;
        litres += 1;
      }
      return q(litres);
    },
    t: {
      "too-many": (a) => q(100 * a),
      "divided-by-hundred": (a) => w(10 * a, a, 100 * a),
      multiplied: (a) => w(1000000 * a, a, 100 * a, 10 * a),
    },
    x: (a) => ({ x: String(1000 * a) }),
    c: [10, 1000],
  }),
  M10_capacity({
    id: "M10.capacity.06",
    form: "glasses-from-a-jug",
    g: [6, 7],
    kind: "decimal",
    p: [rg(2, 9), of(2, 4, 5)],
    ok: (a, b) => (a * 10) % b === 0 && a * 10 !== b,
    f: (a, b) => q((a * 10) / b),
    alt: (a, b) => {
      let left = a * 10;
      let glasses = 0;
      while (left >= b) {
        left -= b;
        glasses += 1;
      }
      return q(glasses);
    },
    t: {
      "litres-over-decilitres": (a, b) => q(a, b),
      inverse: (a, b) => dq(b, a * 10),
      centilitres: (a, b) => dq(a * 100, b),
    },
    x: (a, b) => ({ x: String(b) }),
    c: [10],
  }),
  M10_capacity({
    id: "M10.capacity.07",
    form: "bottles-in-total",
    g: [6, 7],
    kind: "integer",
    p: [rg(3, 9), of(2, 3, 4, 5, 6)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a * b),
    alt: (a, b) => repeat(a, b),
    t: {
      added: (a, b) => q(a + b),
      divided: (a, b) => w(a / b, a * b, a + b),
      subtracted: (a, b) => w(a - b, a * b, a + b),
    },
  }),
  M10_capacity({
    id: "M10.capacity.08",
    form: "centilitres-to-millilitres",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 19)],
    f: (a) => q(10 * a),
    alt: (a) => repeat(a, 10),
    t: {
      hundred: (a) => q(100 * a),
      thousand: (a) => w(1000 * a, 10 * a, 100 * a),
    },
    c: [10, 100],
  }),
  M10_capacity({
    id: "M10.capacity.09",
    form: "a-litre-against-decilitres",
    g: [6, 7],
    kind: "compare",
    p: [of(5, 6, 7, 8, 9, 10, 11, 12, 15)],
    f: (a) => sign(q(10), q(a)),
    // Both in litres.
    alt: (a) => sign(q(1), q(a, 10)),
    t: { "numbers-compared": (a) => sign(q(1), q(a)) },
    x: (a) => ({ sign: sign(q(10), q(a)) }),
    c: [1, 10],
  }),
  M10_capacity({
    id: "M10.capacity.10",
    form: "days-of-drinking-from-a-bottle",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 6), of(300, 400, 600, 700)],
    ok: (a, b) => (1000 * a) % b !== 0,
    f: (a, b) => q(Math.floor((1000 * a) / b)),
    alt: (a, b) => {
      let left = 1000 * a;
      let days = 0;
      while (left >= b) {
        left -= b;
        days += 1;
      }
      return q(days);
    },
    t: {
      "rounded-up": (a, b) => q(Math.ceil((1000 * a) / b)),
      "remainder-as-answer": (a, b) =>
        w((1000 * a) % b, Math.floor((1000 * a) / b)),
    },
    c: [1000],
  }),
  M10_capacity({
    id: "M10.capacity.11",
    form: "two-containers-together",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 9), rg(2, 9)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(10 * a + b),
    // Both in millilitres, then back to decilitres.
    alt: (a, b) => q(1000 * a + 100 * b, 100),
    t: {
      "counts-added": (a, b) => q(a + b),
      "second-converted": (a, b) => w(a + 10 * b, 10 * a + b, a + b),
      "hundred-factor": (a, b) => w(100 * a + b, 10 * a + b, a + b, a + 10 * b),
    },
    c: [10],
  }),
  M10_capacity({
    id: "M10.capacity.12",
    form: "juice-left-in-a-bottle",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 5), rg(2, 4), of(2, 3)],
    f: (a, b, c) => q(10 * a - b * c),
    // Everything in centilitres, then back to decilitres.
    alt: (a, b, c) => q(100 * a - 10 * b * c, 10),
    t: {
      "poured-only": (a, b, c) => q(b * c),
      "litres-not-converted": (a, b, c) => w(a - b * c, 10 * a - b * c),
    },
    c: [10],
  }),
  M10_capacity({
    id: "M10.capacity.13",
    form: "the-price-of-some-decilitres",
    g: [6, 7],
    kind: "decimal",
    p: [rg(2, 6), rg(3, 9)],
    f: (a, b) => q(a * b, 10),
    // The price of one decilitre, taken b times.
    alt: (a, b) => q(a, 10).mul(q(b)),
    t: {
      "decilitres-as-litres": (a, b) => q(a * b),
      hundredths: (a, b) => q(a * b, 100),
    },
    c: [1, 10],
  }),
  M10_capacity({
    id: "M10.capacity.14",
    form: "portions-and-what-is-left",
    g: [6, 7],
    kind: "pair",
    p: [rg(2, 5), of(300, 400, 600, 700)],
    ok: (a, b) => (1000 * a) % b !== 0,
    f: (a, b) => [q(Math.floor((1000 * a) / b)), q((1000 * a) % b)],
    alt: (a, b) => {
      let left = 1000 * a;
      let portions = 0;
      while (left >= b) {
        left -= b;
        portions += 1;
      }
      return [q(portions), q(left)];
    },
    t: {
      swapped: (a, b) => [q((1000 * a) % b), q(Math.floor((1000 * a) / b))],
      "remainder-dropped": (a, b) => [q(Math.floor((1000 * a) / b)), q(0)],
      "rounded-up": (a, b) => [q(Math.ceil((1000 * a) / b)), q(0)],
    },
    c: [1000],
  }),
];

const M10_capacity_1S = calc("M10", "capacity-1S");
const M10_capacity_1S_specs: readonly Spec<never>[] = [
  M10_capacity_1S({
    id: "M10.capacity-1S.01",
    form: "litres-in-a-pool-from-cubic-metres",
    g: [7, 8],
    kind: "integer",
    p: [rg(2, 9), of(125, 250, 300, 400, 500, 600, 750, 800)],
    f: (a, b) => q(1000 * a + b),
    // The litres of each cubic metre added up one by one.
    alt: (a, b) => q(times(a, 1000) + b),
    t: {
      "units-added": (a, b) => q(a + b),
      "hundred-factor": (a, b) => q(100 * a + b),
    },
    c: [1000],
  }),
  M10_capacity_1S({
    id: "M10.capacity-1S.02",
    form: "litres-to-cubic-decimetres",
    g: [7, 8],
    kind: "integer",
    p: [rg(11, 99)],
    f: (a) => q(a),
    // A litre is a cube of 10 cm, which is 1000 cm³: the dm³ are the cm³ divided by 1000.
    alt: (a) => q(1000 * a, 1000),
    t: { thousand: (a) => q(1000 * a), hundred: (a) => q(100 * a) },
    c: [1, 100, 1000],
  }),
  M10_capacity_1S({
    id: "M10.capacity-1S.03",
    form: "cubic-centimetres-in-a-litre-sized-box",
    g: [7, 8],
    kind: "integer",
    p: [rg(2, 19)],
    f: (a) => q(1000 * a),
    alt: (a) => repeat(a, 10 * 10 * 10),
    t: {
      hundred: (a) => q(100 * a),
      ten: (a) => w(10 * a, 1000 * a, 100 * a),
      thirty: (a) => w(30 * a, 1000 * a, 100 * a, 10 * a),
    },
    c: [1, 100, 1000],
  }),
  M10_capacity_1S({
    id: "M10.capacity-1S.04",
    form: "cubic-centimetres-to-millilitres",
    g: [7, 8],
    kind: "decimal",
    p: [of(120, 150, 180, 250, 300, 350, 450, 500, 600, 750, 900)],
    f: (a) => q(a),
    // Through litres: the cm³ over 1000, then the litres times 1000.
    alt: (a) => q(a, 1000).mul(q(1000)),
    t: { litres: (a) => q(a, 1000), thousand: (a) => w(1000 * a, a, a / 1000) },
    c: [1],
  }),
  M10_capacity_1S({
    id: "M10.capacity-1S.05",
    form: "millilitres-to-a-decimal-number-of-litres",
    g: [7, 8],
    kind: "decimal",
    p: [of(125, 250, 350, 500, 750, 900, 1250, 1800, 2500, 3200)],
    f: (a) => q(a, 1000),
    // Tenths of a litre first, then hundredths of those.
    alt: (a) => q(a, 100).mul(q(1, 10)),
    t: {
      "moved-two-places": (a) => q(a, 100),
      "moved-one-place": (a) => dq(a, 10),
      "moved-four-places": (a) => dq(a, 10000),
    },
    c: [1000],
  }),
  M10_capacity_1S({
    id: "M10.capacity-1S.06",
    form: "an-aquarium-in-litres-from-centimetres",
    g: [7, 8],
    kind: "integer",
    p: [of(30, 40, 50, 60), of(20, 30, 40), of(20, 30, 40, 50)],
    ok: (a, b, c) => (a * b * c) % 1000 === 0 && a !== b && b !== c && a !== c,
    f: (a, b, c) => q((a * b * c) / 1000),
    // The sides in decimetres, then the volume in dm³, which is litres.
    alt: (a, b, c) => q(a, 10).mul(q(b, 10)).mul(q(c, 10)),
    t: {
      "cubic-centimetres": (a, b, c) => q(a * b * c),
      "divided-by-hundred": (a, b, c) =>
        w((a * b * c) / 100, (a * b * c) / 1000, a * b * c),
      "divided-by-ten": (a, b, c) =>
        w((a * b * c) / 10, (a * b * c) / 1000, a * b * c, (a * b * c) / 100),
    },
    c: [1, 1000],
  }),
  M10_capacity_1S({
    id: "M10.capacity-1S.07",
    form: "litres-from-millilitres-of-two-bottles",
    g: [7, 8],
    kind: "decimal",
    p: [of(250, 300, 400, 500, 600, 750), of(200, 350, 500, 750, 900, 1250)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a + b, 1000),
    // Each bottle in litres first, then the sum.
    alt: (a, b) => q(a, 1000).add(q(b, 1000)),
    t: {
      "millilitres-as-litres": (a, b) => q(a + b),
      "moved-two-places": (a, b) => dq(a + b, 100),
      "first-converted-only": (a, b) => dq(a + 1000 * b, 1000),
    },
    c: [1000],
  }),
  M10_capacity_1S({
    id: "M10.capacity-1S.08",
    form: "litres-as-a-decimal-part-of-a-cubic-metre",
    g: [7, 8],
    kind: "decimal",
    p: [of(125, 250, 350, 500, 750, 900, 1250, 1800, 2500, 3200)],
    f: (a) => q(a, 1000),
    // Litres are cubic decimetres, and a cubic metre is a thousand of them.
    alt: (a) => q(a).mul(q(1, 1000)),
    t: {
      "moved-two-places": (a) => q(a, 100),
      "moved-one-place": (a) => dq(a, 10),
      "moved-four-places": (a) => dq(a, 10000),
    },
    c: [1, 1000],
  }),
  M10_capacity_1S({
    id: "M10.capacity-1S.09",
    form: "glasses-from-a-large-bottle",
    g: [7, 8],
    kind: "integer",
    p: [rg(2, 9), of(125, 200, 250, 500)],
    f: (a, b) => q(a * (1000 / b)),
    // The whole bottle in millilitres over one glass.
    alt: (a, b) => q(1000 * a, b),
    t: {
      millilitres: (a, b) => q(a * b),
      quarter: (a, b) => w(a / (1000 / b), a * (1000 / b), a * b),
      "total-millilitres": (a, b) =>
        w(1000 * a, a * (1000 / b), a * b, a / (1000 / b)),
    },
    c: [1000],
  }),
  M10_capacity_1S({
    id: "M10.capacity-1S.10",
    form: "litres-in-a-tank-from-decimetres",
    g: [7, 8],
    kind: "integer",
    p: [rg(4, 8), rg(3, 6), rg(3, 5), of(10, 15, 20, 25)],
    ok: (a, b, c, d) => a !== b && a * b * c - d >= 10,
    f: (a, b, c, d) => q(a * b * c - d),
    alt: (a, b, c, d) => q(times(c, a * b) - d),
    t: {
      "added-back": (a, b, c, d) => q(a * b * c + d),
      "poured-out-forgotten": (a, b, c) => q(a * b * c),
    },
    c: [1],
  }),
  M10_capacity_1S({
    id: "M10.capacity-1S.11",
    form: "rain-on-a-roof",
    g: [7, 8],
    kind: "integer",
    p: [rg(2, 9), of(10, 15, 20, 25, 40, 50)],
    f: (a, b) => q(a * b),
    alt: (a, b) => repeat(a, b),
    t: {
      added: (a, b) => q(a + b),
      divided: (a, b) => w(b / a, a * b, a + b),
      subtracted: (a, b) => w(b - a, a * b, a + b),
    },
    c: [1],
    origin: { extension: "rain depth as litres per square metre (RES-4286)" },
  }),
  M10_capacity_1S({
    id: "M10.capacity-1S.12",
    form: "the-smallest-amount-two-vessels-can-measure",
    g: [7, 8],
    kind: "integer",
    p: [rg(2, 4), rg(2, 5), rg(2, 5)],
    ok: (a, b, c) => b < c && gcd(b, c) === 1,
    f: (a) => q(a),
    // The greatest common divisor of the two vessels, by Euclid's steps.
    alt: (a, b, c) => q(gcd(a * b, a * c)),
    t: {
      difference: (a, b, c) => w(a * (c - b), a),
      "smaller-vessel": (a, b) => w(a * b, a),
      "one-litre": (a) => w(1, a),
    },
    x: (a, b, c) => ({ x: String(a * b), y: String(a * c) }),
    c: [1],
    origin: {
      olympiad:
        "measuring with two vessels: every amount is a multiple of the greatest common divisor of their sizes, in the spirit of the pouring items of the MCCME papers (RES-4286)",
    },
  }),
  M10_capacity_1S({
    id: "M10.capacity-1S.13",
    form: "the-time-to-fill-a-tank",
    g: [7, 8],
    kind: "integer",
    p: [rg(4, 8), rg(3, 5), rg(3, 6), of(4, 5, 6, 8, 10)],
    ok: (a, b, c, d) => (a * b * c) % d === 0 && (a * b * c) / d > 2,
    f: (a, b, c, d) => q((a * b * c) / d),
    alt: (a, b, c, d) => {
      let left = a * b * c;
      let minutes = 0;
      while (left > 0) {
        left -= d;
        minutes += 1;
      }
      return q(minutes);
    },
    t: {
      "volume-times-rate": (a, b, c, d) => q(a * b * c * d),
      "base-over-rate": (a, b, c, d) =>
        (a * b) % d === 0 ? w((a * b) / d, (a * b * c) / d) : null,
    },
  }),
  M10_capacity_1S({
    id: "M10.capacity-1S.14",
    form: "the-water-level-after-pouring-between-vessels",
    g: [7, 8],
    kind: "integer",
    p: [rg(0, LEVELS.length - 1)],
    f: (a) => {
      const [e, b, c] = levelOf(a);
      return q((e * e * e) / (b * c));
    },
    t: {
      "edge-kept": (a) =>
        w(levelOf(a)[0], levelOf(a)[0] ** 3 / (levelOf(a)[1] * levelOf(a)[2])),
      "volume-itself": (a) => q(levelOf(a)[0] ** 3),
    },
    // The edge times the ratio of the area of a face to the area of the bottom.
    alt: (a) => {
      const [e, b, c] = levelOf(a);
      return q(e).mul(q(e * e, b * c));
    },
    x: (a) => {
      const [e, b, c] = levelOf(a);
      return { e: String(e), b: String(b), c: String(c) };
    },
  }),
];

export const mSpecs4: readonly Spec<never>[] = [
  ...M7_by_cubes_specs,
  ...M7_formula_specs,
  ...M8_speed_specs,
  ...M9_area_units_specs,
  ...M10_capacity_specs,
  ...M10_capacity_1S_specs,
];
