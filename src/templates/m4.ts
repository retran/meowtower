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
    p: [rg(2, 6)],
    ok: (a) => a !== 3,
    f: (a) => q(a * a * a),
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
    t: {
      "filled-layers": (a, b, c, d) => q(a * b * d),
      "whole-box": (a, b, c, d) => w(a * b * c, a * b * (c - d), a * b * d),
      "missing-layers": (a, b, c, d) =>
        w(c - d, a * b * (c - d), a * b * d, a * b * c),
    },
    c: [1],
  }),
  M7_by_cubes({
    id: "M7.by-cubes.07",
    form: "a-tower-of-columns",
    g: [6, 7],
    kind: "integer",
    p: [rg(3, 7)],
    f: (a) => q((a * (a + 1)) / 2),
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
    p: [rg(3, 6)],
    f: (a) => q((a - 2) ** 3),
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
    p: [rg(5, 9), rg(4, 12), rg(2, 4)],
    f: (a, b, c) => q((a - c) * b),
    t: {
      "removed-only": (a, b, c) => q(c * b),
      "stacks-minus-cubes": (a, b, c) => w(a * b - c, (a - c) * b, c * b),
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
    t: {
      "one-tower": (a, b, c) => q(a * b * c),
      "bases-compared": (a, b, c, d, e) => q(a * b - d * e),
    },
  }),
  M7_by_cubes({
    id: "M7.by-cubes.12",
    form: "cubes-painted-on-exactly-one-side",
    g: [6, 7],
    kind: "integer",
    p: [rg(3, 6)],
    f: (a) => q(6 * (a - 2) ** 2),
    t: {
      "edges-included": (a) => q(6 * a * a),
      "one-face-only": (a) => q((a - 2) ** 2),
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
    p: [rg(3, 7)],
    f: (a) => q(12 * (a - 2)),
    t: {
      "corners-included": (a) => q(12 * a),
      "one-edge": (a) => q(a - 2),
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
    p: [rg(3, 7)],
    f: (a) => q(a * a * (a - 1)),
    t: {
      "whole-cube": (a) => q(a ** 3),
      "removed-layer": (a) => q(a * a),
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
    ok: (a) => a !== 3,
    f: (a) => q(a * a * a),
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
    p: [rg(2, 9)],
    f: (a) => q(8 * a),
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
    t: {
      "units-not-converted": (a, b, c) => q(a * b * c),
      "cubic-centimetres": (a, b, c) => q(100 * a * b * c),
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
    t: {
      "edge-itself": (a) => q(a),
      "edge-by-six": (a) => q((2 * a) ** 3),
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
    t: {
      "cut-added": (a, b, c, d) => q(a * b * c + d ** 3),
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
    p: [rg(40, 100), rg(2, 6)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(b),
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
    p: [of(5, 10, 15, 20, 25)],
    f: (a) => q((18 * a) / 5),
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
    p: [of(18, 36, 54, 72, 90)],
    f: (a) => q((5 * a) / 18),
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
    p: [rg(100, 240), rg(2, 4), rg(100, 240), rg(2, 4)],
    ok: (a, b, c, d) =>
      b !== d && sign(q(a * b, b), q(c, d)) !== sign(q(a * b), q(c)),
    f: (a, b, c, d) => sign(q(a * b, b), q(c, d)),
    t: {
      "distances-compared": (a, b, c) => sign(q(a * b), q(c)),
      "times-compared": (a, b, c, d) =>
        ws(sign(q(b), q(d)), sign(q(a * b, b), q(c, d)), sign(q(a * b), q(c))),
    },
    x: (a, b, c, d) => ({ x: String(a * b), sign: sign(q(a * b, b), q(c, d)) }),
  }),
  M8_speed({
    id: "M8.speed.08",
    form: "two-travellers-approaching-each-other",
    g: [6, 7],
    kind: "integer",
    p: [rg(4, 12), rg(4, 12), rg(2, 4)],
    ok: (a, b) => a !== b,
    f: (a, b, c) => q((a + b) * c),
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
    p: [of(60, 80, 100, 120)],
    f: (a) => q(a / 2),
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
    p: [of(60, 70, 80), rg(3, 9)],
    f: (a, b) => q(b),
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
    t: {
      "first-point-as-speed": (a, b) => q(2 * a * b),
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
    p: [rg(2, 9)],
    f: (a) => q(10000 * a),
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
    p: [rg(2, 9)],
    f: (a) => q(100 * a),
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
    p: [rg(2, 9)],
    f: (a) => q(100 * a),
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
    p: [rg(2, 9)],
    f: (a) => q(10000 * a),
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
    p: [rg(2, 9)],
    f: (a) => q(100 * a),
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
    p: [rg(2, 9)],
    f: (a) => q(100 * a),
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
    p: [rg(2, 9)],
    f: (a) => q(100 * a),
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
    p: [rg(2, 9)],
    f: (a) => q(100 * a),
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
    p: [rg(2, 5), of(-40, -10, 0, 10, 40)],
    f: (a, b) => sign(q(100 * a), q(100 * a + b)),
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
    p: [of(2500, 5000, 7500, 12500)],
    f: (a) => q(a, 10000),
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
    p: [rg(2, 9)],
    f: (a) => q(25 * a),
    t: {
      "forgot-square": (a) => q(5 * a),
      "ten-thousand": (a) => w(10000 * a, 25 * a, 5 * a),
      "tile-area-twenty": (a) => w(500 * a, 25 * a, 5 * a, 10000 * a),
    },
    c: [1, 20, 400, 10000],
  }),
  M9_area_units({
    id: "M9.area-units.12",
    form: "compare-square-decimetres-against-square-metres",
    g: [7, 8],
    kind: "compare",
    p: [rg(2, 5), of(-60, -20, 0, 20, 60)],
    f: (a, b) => sign(q(100 * a + b), q(100 * a)),
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
    t: {
      "linear-factor": (a) => q(a),
      "ten-thousand": (a) => q(1000 * a),
    },
    x: (a) => ({ x: dec(a, 1) }),
    c: [10, 100, 10000],
  }),
  M9_area_units({
    id: "M9.area-units.14",
    form: "a-square-kilometre-in-a-line-of-square-metres",
    g: [7, 8],
    kind: "integer",
    p: [rg(2, 9)],
    f: (a) => q(1000 * a),
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
    p: [of(1, 4, 9, 16, 25)],
    f: (a) => q(400 * Math.sqrt(a)),
    t: {
      "side-only": (a) => q(100 * Math.sqrt(a)),
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
    p: [rg(2, 9)],
    f: (a) => q(10 * a),
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
    p: [rg(2, 9)],
    f: (a) => q(100 * a),
    t: { ten: (a) => q(10 * a), thousand: (a) => w(1000 * a, 100 * a, 10 * a) },
    c: [10, 100],
  }),
  M10_capacity({
    id: "M10.capacity.03",
    form: "litres-to-millilitres",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 9)],
    f: (a) => q(1000 * a),
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
    p: [rg(2, 9)],
    f: (a) => q(a),
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
    p: [rg(2, 6), rg(2, 4)],
    ok: (a, b) => (a * 10) % (b * 2) === 0 && a * 10 !== b * 2,
    f: (a, b) => q((a * 10) / (b * 2)),
    t: {
      "litres-over-decilitres": (a, b) => q(a, b * 2),
      inverse: (a, b) => dq(b * 2, a * 10),
      centilitres: (a, b) => dq(a * 100, b * 2),
    },
    x: (a, b) => ({ x: String(b * 2) }),
    c: [10],
  }),
  M10_capacity({
    id: "M10.capacity.07",
    form: "bottles-in-total",
    g: [6, 7],
    kind: "integer",
    p: [rg(3, 9), of(1, 2, 3)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a * b),
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
    p: [of(5, 7, 9, 10, 12, 15)],
    f: (a) => sign(q(10), q(a)),
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
    p: [rg(2, 9), of(250, 500, 750)],
    f: (a, b) => q(1000 * a + b),
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
    t: { thousand: (a) => q(1000 * a), hundred: (a) => q(100 * a) },
    c: [1, 100, 1000],
  }),
  M10_capacity_1S({
    id: "M10.capacity-1S.03",
    form: "cubic-centimetres-in-a-litre-sized-box",
    g: [7, 8],
    kind: "integer",
    p: [rg(2, 9)],
    f: (a) => q(1000 * a),
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
    p: [of(150, 250, 350, 500, 750)],
    f: (a) => q(a),
    t: { litres: (a) => q(a, 1000), thousand: (a) => w(1000 * a, a, a / 1000) },
    c: [1],
  }),
  M10_capacity_1S({
    id: "M10.capacity-1S.05",
    form: "millilitres-to-a-decimal-number-of-litres",
    g: [7, 8],
    kind: "decimal",
    p: [of(250, 500, 750, 1250, 2500)],
    f: (a) => q(a, 1000),
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
    p: [of(250, 500, 750), of(500, 750, 1250)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a + b, 1000),
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
    p: [of(250, 500, 750, 1250)],
    f: (a) => q(a, 1000),
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
    p: [rg(2, 6)],
    f: (a) => q(4 * a),
    t: {
      millilitres: (a) => q(250 * a),
      quarter: (a) => w(a / 4, 4 * a, 250 * a),
      "total-millilitres": (a) => w(1000 * a, 4 * a, 250 * a, a / 4),
    },
    c: [4, 250],
  }),
  M10_capacity_1S({
    id: "M10.capacity-1S.10",
    form: "litres-in-a-tank-from-decimetres",
    g: [7, 8],
    kind: "integer",
    p: [rg(4, 8), rg(3, 6), rg(3, 5), of(10, 15, 20, 25)],
    ok: (a, b, c, d) => a !== b && a * b * c - d >= 10,
    f: (a, b, c, d) => q(a * b * c - d),
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
    p: [rg(2, 9), of(10, 20, 50)],
    f: (a, b) => q(a * b),
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
    t: {
      difference: (a, b, c) => w(a * (c - b), a),
      "smaller-vessel": (a, b) => w(a * b, a),
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
