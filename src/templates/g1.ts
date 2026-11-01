// Domain G, part 1: shapes and angles (RES-4285). The Dutch goals name the shapes at the end of group 2 and the
// angle words at group 4; measuring angles is a Russian extension of grade 5. There are no pictures: each task
// describes its figure in words. Texts are plain blanks in `content/tasks-g.ru.json`. Generated from one table with the strings.
import type { Q } from "../math/q.js";
import { calc, of, rg } from "./kitc.js";
import { q } from "./kitf.js";
import { SIGNS, type Spec } from "./spec.js";

const sign = (x: Q, y: Q): (typeof SIGNS)[number] => SIGNS[x.cmp(y) + 1] ?? "=";

/** The ratios of the angles of a triangle whose sum, 180 degrees, they divide without a rest. */
export const RATIOS: readonly (readonly [number, number, number])[] = [
  [1, 2, 3],
  [1, 1, 2],
  [2, 3, 4],
  [3, 4, 5],
  [1, 3, 5],
  [1, 4, 7],
  [2, 3, 5],
  [1, 2, 6],
  [2, 2, 5],
  [3, 3, 4],
  [3, 2, 1],
  [2, 5, 3],
  [4, 3, 2],
  [1, 6, 2],
  [5, 2, 3],
];
const ratio = (i: number): readonly [number, number, number] =>
  RATIOS[i] ?? [1, 2, 3];
const sumOf = (r: readonly number[]): number => r.reduce((s, x) => s + x, 0);

/** The kind of an angle of `deg` degrees: 1 acute, 2 right, 3 obtuse, 4 straight. */
const kindOf = (deg: number): number =>
  deg < 90 ? 1 : deg === 90 ? 2 : deg < 180 ? 3 : 4;
const OPPOSITE: Readonly<Record<number, number>> = { 1: 3, 2: 4, 3: 1, 4: 2 };
const NEIGHBOUR: Readonly<Record<number, number>> = { 1: 2, 2: 3, 3: 4, 4: 3 };

const G1_shapes = calc("G1", "shapes");
const G1_shapes_specs: readonly Spec<never>[] = [
  G1_shapes({
    id: "G1.shapes.01",
    form: "the-sides-of-separate-polygons",
    g: [2, 3],
    kind: "integer",
    p: [rg(2, 6), rg(3, 8)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a * b),
    alt: (a, b) => {
      let total = 0;
      for (let i = 0; i < a; i += 1) total += b;
      return q(total);
    },
    t: { "figures-added": (a, b) => q(a + b), "one-polygon": (a, b) => q(b) },
  }),
  G1_shapes({
    id: "G1.shapes.02",
    form: "the-corners-of-squares-and-circles",
    g: [2, 3],
    kind: "integer",
    p: [rg(2, 6), rg(2, 6)],
    ok: (a, b) => a !== b,
    f: (a) => q(4 * a),
    alt: (a, b) => {
      const corners = [
        ...Array<number>(a).fill(4),
        ...Array<number>(b).fill(0),
      ];
      return q(corners.reduce((s, x) => s + x, 0));
    },
    t: {
      "circles-counted": (a, b) => q(4 * a + b),
      "figures-added": (a, b) => q(a + b),
      "all-as-squares": (a, b) => q(4 * (a + b)),
    },
    c: [4],
  }),
  G1_shapes({
    id: "G1.shapes.03",
    form: "the-sides-of-triangles-and-quadrilaterals",
    g: [2, 3],
    kind: "integer",
    p: [rg(2, 6), rg(2, 6)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(3 * a + 4 * b),
    alt: (a, b) => {
      const sides = [...Array<number>(a).fill(3), ...Array<number>(b).fill(4)];
      return q(sides.reduce((s, x) => s + x, 0));
    },
    t: {
      "figures-counted": (a, b) => q(a + b),
      "all-as-triangles": (a, b) => q(3 * (a + b)),
    },
    c: [3, 4],
  }),
  G1_shapes({
    id: "G1.shapes.04",
    form: "two-squares-side-by-side",
    g: [2, 3],
    kind: "integer",
    p: [rg(2, 12)],
    f: (a) => q(2 * a),
    alt: (a) => q((6 * a) / 2 - a),
    t: {
      "one-side": (a) => q(a),
      area: (a) => q(2 * a * a),
      perimeter: (a) => (a === 3 ? null : q(6 * a)),
    },
    c: [2],
  }),
  G1_shapes({
    id: "G1.shapes.05",
    form: "a-square-cut-into-four-equal-squares",
    g: [2, 3],
    kind: "integer",
    p: [of(4, 8, 12, 16, 20, 24, 28, 32, 36, 40)],
    f: (a) => q(a / 2),
    alt: (a) => q(Math.round(Math.sqrt((a * a) / 4))),
    t: { quarter: (a) => q(a / 4), "whole-side": (a) => q(a) },
    c: [2, 4],
  }),
  G1_shapes({
    id: "G1.shapes.06",
    form: "the-sides-of-a-rectangle-with-the-same-length",
    g: [2, 3],
    kind: "integer",
    p: [rg(2, 9), rg(10, 19), rg(2, 5)],
    f: (a, b, c) => q(2 * c),
    alt: (a, b, c) => {
      let found = 0;
      for (let i = 0; i < c; i += 1)
        for (const side of [a, b, a, b]) if (side === a) found += 1;
      return q(found);
    },
    t: {
      "all-sides": (a, b, c) => q(4 * c),
      "one-side": (a, b, c) => q(c),
    },
    c: [2, 4],
    roles: {
      a: "length of the first side",
      b: "length of the second side",
      c: "count of rectangles",
    },
  }),
  G1_shapes({
    id: "G1.shapes.07",
    form: "the-triangles-from-the-diagonals-of-one-vertex",
    g: [5, 8],
    kind: "integer",
    p: [rg(4, 12)],
    f: (a) => q(a - 2),
    alt: (a) => {
      let triangles = 1;
      for (let sides = 4; sides <= a; sides += 1) triangles += 1;
      return q(triangles);
    },
    t: {
      sides: (a) => q(a),
      "one-less": (a) => q(a - 1),
      diagonals: (a) => q(a - 3),
    },
    c: [2, 3],
  }),
  G1_shapes({
    id: "G1.shapes.08",
    form: "the-squares-of-all-sizes",
    g: [4, 6],
    kind: "integer",
    p: [rg(2, 7)],
    f: (a) => q((a * (a + 1) * (2 * a + 1)) / 6),
    alt: (a) => {
      let total = 0;
      for (let size = 1; size <= a; size += 1)
        total += (a - size + 1) * (a - size + 1);
      return q(total);
    },
    x: (a) => ({
      sizes: Array.from({ length: a }, (_, i) => (a - i) * (a - i)).join(" + "),
    }),
    t: {
      "unit-squares-only": (a) => q(a * a),
      "cells-and-the-whole": (a) => q(a * a + 1),
      "without-the-big-one": (a) =>
        a === 2 ? null : q((a * (a + 1) * (2 * a + 1)) / 6 - 1),
      "two-sizes-only": (a) =>
        a === 2 || a === 3 ? null : q(a * a + (a - 1) * (a - 1)),
    },
    c: [1, 2],
  }),
  G1_shapes({
    id: "G1.shapes.09",
    form: "the-sides-after-a-cut-corner",
    g: [4, 6],
    kind: "integer",
    p: [rg(3, 10)],
    f: (a) => q(a + 1),
    alt: (a) => q(a - 1 + 2),
    t: {
      same: (a) => q(a),
      "one-less": (a) => q(a - 1),
      "two-new": (a) => q(a + 2),
    },
    c: [1],
  }),
  G1_shapes({
    id: "G1.shapes.10",
    form: "the-name-of-a-square",
    g: [2, 3],
    kind: "choice",
    p: [rg(0, 19)],
    f: () => "1",
    t: { triangle: () => "2", circle: () => "3", pentagon: () => "4" },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
  }),
  G1_shapes({
    id: "G1.shapes.13",
    form: "a-square-standing-on-its-corner",
    g: [3, 4],
    kind: "choice",
    p: [rg(0, 19)],
    f: () => "1",
    t: {
      "rotated-square-is-not-a-square": () => "2",
      "a-triangle-on-top": () => "3",
    },
    options: () => ["1", "2", "3"],
    c: [1, 2, 3],
  }),
  G1_shapes({
    id: "G1.shapes.11",
    form: "the-shape-without-corners",
    g: [2, 3],
    kind: "choice",
    p: [rg(0, 19)],
    f: () => "2",
    t: { square: () => "1", triangle: () => "3", rectangle: () => "4" },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
  }),
  G1_shapes({
    id: "G1.shapes.12",
    form: "the-quadrilaterals-among-shapes",
    g: [2, 3],
    kind: "set",
    p: [rg(0, 19)],
    f: () => ["1", "3"],
    t: {
      "only-the-square": () => ["1"],
      "with-the-triangle": () => ["1", "2", "3"],
    },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
  }),
  G1_shapes({
    id: "G1.shapes.14",
    form: "the-triangles-in-a-fan-of-segments",
    g: [5, 8],
    kind: "integer",
    p: [rg(2, 8)],
    f: (a) => q(((a + 2) * (a + 1)) / 2),
    alt: (a) => {
      let total = 0;
      for (let i = 1; i <= a + 1; i += 1) total += i;
      return q(total);
    },
    t: {
      "small-only": (a) => q(a + 1),
      "segments-only": (a) => q(a),
      "without-the-big-one": (a) => q(((a + 2) * (a + 1)) / 2 - 1),
    },
    c: [2],
    roles: { a: "count of segments from one vertex" },
    origin: {
      olympiad:
        "counting triangles in a fan of segments by pairs of points on the base (RES-4285, Kangoeroe and MCCME counting items)",
    },
  }),
  G1_shapes({
    id: "G1.shapes.15",
    form: "the-rectangles-on-a-chequered-board",
    g: [6, 8],
    kind: "integer",
    p: [rg(2, 3), rg(3, 6)],
    f: (a, b) => q((((a + 1) * a) / 2) * (((b + 1) * b) / 2)),
    alt: (a, b) => {
      let total = 0;
      for (let w = 1; w <= b; w += 1)
        for (let h = 1; h <= a; h += 1) total += (b - w + 1) * (a - h + 1);
      return q(total);
    },
    t: {
      "cells-only": (a, b) => q(a * b),
      "cells-and-the-whole": (a, b) => q(a * b + 1),
      "pairs-added": (a, b) => q(((a + 1) * a) / 2 + ((b + 1) * b) / 2),
    },
    c: [2],
    roles: { a: "count of rows", b: "count of cells in a row" },
    origin: {
      olympiad:
        "counting rectangles by choosing two vertical and two horizontal lines of the grid (RES-4285, Kangoeroe and MCCME counting items)",
    },
  }),
  G1_shapes({
    id: "G1.shapes.16",
    form: "the-diagonals-of-a-convex-polygon",
    g: [5, 8],
    kind: "integer",
    p: [rg(5, 12)],
    f: (a) => q((a * (a - 3)) / 2),
    alt: (a) => q((a * (a - 1)) / 2 - a),
    t: {
      "from-one-vertex": (a) => q(a - 3),
      "counted-twice": (a) => q(a * (a - 3)),
      "all-segments": (a) => (a === 5 ? null : q((a * (a - 1)) / 2)),
    },
    c: [2, 3],
    roles: { a: "count of vertices" },
    origin: {
      olympiad:
        "counting the diagonals of a polygon by counting each from both ends (RES-4285, Kangoeroe and MCCME counting items)",
    },
  }),
  G1_shapes({
    id: "G1.shapes.17",
    form: "the-perimeters-of-the-parts-of-a-cut-square",
    g: [5, 8],
    kind: "integer",
    p: [rg(3, 12)],
    f: (a) => q(6 * a),
    alt: (a) => q(2 * (1 + a) + 2 * (a - 1 + a)),
    t: {
      "the-square-perimeter": (a) => q(4 * a),
      "cut-counted-once": (a) => q(5 * a),
      "perimeter-doubled": (a) => q(8 * a),
    },
    c: [2, 4],
    roles: { a: "side of the square" },
    origin: {
      olympiad:
        "a straight cut adds its length twice to the sum of the perimeters (RES-4285, MCCME cutting items)",
    },
  }),
  G1_shapes({
    id: "G1.shapes.18",
    form: "the-figures-that-have-corners",
    g: [2, 3],
    kind: "integer",
    p: [rg(1, 3), rg(1, 3), rg(1, 3), rg(1, 3)],
    f: (a, b, c) => q(a + b + c),
    alt: (a, b, c, d) => {
      const figures: readonly (readonly [number, number])[] = [
        [a, 4],
        [b, 4],
        [c, 3],
        [d, 0],
      ];
      return q(
        figures.reduce(
          (s, [count, corners]) => s + (corners > 0 ? count : 0),
          0,
        ),
      );
    },
    t: {
      "all-figures": (a, b, c, d) => q(a + b + c + d),
      "quadrilaterals-only": (a, b) => q(a + b),
      "circles-only": (a, b, c, d) => q(d),
    },
    roles: {
      a: "count of squares",
      b: "count of rectangles",
      c: "count of triangles",
      d: "count of circles",
    },
  }),
  G1_shapes({
    id: "G1.shapes.19",
    form: "the-name-by-the-number-of-sides",
    g: [3, 4],
    kind: "choice",
    p: [rg(3, 8)],
    f: (a) => String(a - 2),
    alt: (a) => String(["3", "4", "5", "6", "7", "8"].indexOf(String(a)) + 1),
    t: {
      "the-fewer-sides": (a) => (a === 3 ? null : String(a - 3)),
      "the-more-sides": (a) => (a === 8 ? null : String(a - 1)),
      "number-as-sides": (a) => (a > 6 ? null : String(a)),
    },
    options: () => ["1", "2", "3", "4", "5", "6"],
    c: [1, 2, 3, 4, 5, 6],
    roles: { a: "count of sides" },
  }),
];

const G2_angles = calc("G2", "angles");
const G2_angles_specs: readonly Spec<never>[] = [
  G2_angles({
    id: "G2.angles.01",
    form: "the-third-angle-of-a-triangle",
    g: [7, 8],
    kind: "integer",
    p: [rg(30, 80), rg(30, 80)],
    f: (a, b) => q(180 - a - b),
    alt: (a, b) => {
      let third = 0;
      while (a + b + third < 180) third += 1;
      return q(third);
    },
    t: {
      "sum-of-two": (a, b) => q(a + b),
      "from-360": (a, b) => q(360 - a - b),
      "one-angle": (a) => q(180 - a),
    },
    c: [180, 360],
    origin: { extension: "the angle measure, Russian grade 5 (RES-4285)" },
  }),
  G2_angles({
    id: "G2.angles.02",
    form: "the-angle-next-to-a-given-one-on-a-straight-line",
    g: [7, 8],
    kind: "integer",
    p: [rg(20, 160)],
    ok: (a) => a !== 90,
    f: (a) => q(180 - a),
    alt: (a) => {
      let next = 0;
      while (a + next < 180) next += 1;
      return q(next);
    },
    t: {
      "same-angle": (a) => q(a),
      "from-90": (a) => {
        const w = Math.abs(90 - a);
        return w === a || w === 180 - a ? null : q(w);
      },
      "from-360": (a) => q(360 - a),
    },
    c: [180],
    origin: { extension: "the angle measure, Russian grade 5 (RES-4285)" },
  }),
  G2_angles({
    id: "G2.angles.03",
    form: "the-rest-of-a-right-angle",
    g: [7, 8],
    kind: "integer",
    p: [rg(10, 80)],
    ok: (a) => a !== 45,
    f: (a) => q(90 - a),
    alt: (a) => {
      let rest = 0;
      while (a + rest < 90) rest += 1;
      return q(rest);
    },
    t: { "from-180": (a) => q(180 - a), sum: (a) => q(90 + a) },
    c: [90, 180],
    origin: { extension: "the angle measure, Russian grade 5 (RES-4285)" },
  }),
  G2_angles({
    id: "G2.angles.04",
    form: "the-base-angle-of-an-isosceles-triangle",
    g: [7, 8],
    kind: "integer",
    p: [of(20, 30, 40, 50, 70, 80, 100, 110, 120)],
    f: (a) => q((180 - a) / 2),
    alt: (a) => {
      let base = 1;
      while (2 * base + a < 180) base += 1;
      return q(base);
    },
    t: {
      "not-halved": (a) => q(180 - a),
      "half-of-the-top": (a) => (a === 120 ? null : q(a / 2)),
      "equal-to-the-top": (a) => q(a),
    },
    c: [2, 180],
    origin: { extension: "the angle measure, Russian grade 5 (RES-4285)" },
  }),
  G2_angles({
    id: "G2.angles.05",
    form: "the-angle-between-clock-hands",
    g: [7, 8],
    kind: "integer",
    p: [rg(1, 11)],
    ok: (a) => a !== 6,
    f: (a) => q(30 * Math.min(a, 12 - a)),
    alt: (a) => q(Math.min(a, 12 - a) * 5 * 6),
    t: {
      "five-per-hour": (a) => q(5 * a),
      "other-way": (a) => q(30 * Math.max(a, 12 - a)),
    },
    c: [5, 6, 12, 30, 360],
    origin: { extension: "the angle measure, Russian grade 5 (RES-4285)" },
  }),
  G2_angles({
    id: "G2.angles.06",
    form: "the-turn-of-the-minute-hand",
    g: [7, 8],
    kind: "integer",
    p: [of(2, 4, 6, 8, 10, 12, 14, 16, 18, 20)],
    f: (a) => q(6 * a),
    alt: (a) => q(30 * a, 5),
    t: {
      "one-per-minute": (a) => q(a),
      "hour-hand": (a) => q(a / 2),
      "hour-step": (a) => q(30 * a),
    },
    c: [5, 6, 30, 60, 360],
    origin: { extension: "the angle measure, Russian grade 5 (RES-4285)" },
  }),
  G2_angles({
    id: "G2.angles.07",
    form: "the-angle-of-a-regular-polygon",
    g: [7, 8],
    kind: "integer",
    p: [of(3, 5, 6, 8, 9, 10, 12)],
    f: (a) => q((180 * (a - 2)) / a),
    alt: (a) => q(180 - 360 / a),
    t: {
      "sum-of-angles": (a) => q(180 * (a - 2)),
      "central-angle": (a) => q(360 / a),
    },
    c: [2, 180, 360],
    origin: { extension: "the angle measure, Russian grade 5 (RES-4285)" },
  }),
  G2_angles({
    id: "G2.angles.08",
    form: "the-sum-of-the-angles-of-a-polygon",
    g: [7, 8],
    kind: "integer",
    p: [rg(3, 10)],
    f: (a) => q(180 * (a - 2)),
    alt: (a) => {
      let total = 180;
      for (let sides = 4; sides <= a; sides += 1) total += 180;
      return q(total);
    },
    t: {
      "times-sides": (a) => q(180 * a),
      "minus-one": (a) => q(180 * (a - 1)),
      "always-360": (a) => (a <= 4 ? null : q(360)),
    },
    c: [2, 180],
    origin: { extension: "the angle measure, Russian grade 5 (RES-4285)" },
  }),
  G2_angles({
    id: "G2.angles.09",
    form: "the-turns-of-a-walker",
    g: [7, 8],
    kind: "integer",
    p: [rg(2, 8)],
    f: (a) => q(90 * a),
    alt: (a) => q((360 * a) / 4),
    t: { "one-turn": () => q(90), "full-turns": (a) => q(360 * a) },
    c: [90, 360],
    origin: { extension: "the angle measure, Russian grade 5 (RES-4285)" },
  }),
  G2_angles({
    id: "G2.angles.10",
    form: "the-right-angles-on-a-staircase",
    g: [7, 8],
    kind: "integer",
    p: [rg(2, 8)],
    f: (a) => q(2 * a - 1),
    alt: (a) => {
      let turns = 0;
      for (let k = 1; k < 2 * a; k += 1) turns += 1;
      return q(turns);
    },
    t: {
      twice: (a) => q(2 * a),
      steps: (a) => q(a),
      "between-steps": (a) => q(a - 1),
    },
    c: [1, 2],
    origin: { extension: "the angle measure, Russian grade 5 (RES-4285)" },
  }),
  G2_angles({
    id: "G2.angles.11",
    form: "the-right-angles-of-separate-rectangles",
    g: [7, 8],
    kind: "integer",
    p: [rg(2, 9)],
    f: (a) => q(4 * a),
    alt: (a) => {
      let total = 0;
      for (let i = 0; i < a; i += 1) total += 4;
      return q(total);
    },
    t: { "rectangles-only": (a) => q(a), "two-per-rectangle": (a) => q(2 * a) },
    c: [2, 4],
    origin: { extension: "the angle measure, Russian grade 5 (RES-4285)" },
  }),
  G2_angles({
    id: "G2.angles.12",
    form: "the-half-of-a-folded-angle",
    g: [7, 8],
    kind: "integer",
    p: [of(20, 30, 40, 50, 60, 80, 100, 120, 140)],
    f: (a) => q(a / 2),
    alt: (a) => {
      let half = 0;
      while (half + half < a) half += 1;
      return q(half);
    },
    t: {
      doubled: (a) => q(2 * a),
      whole: (a) => q(a),
      "minus-two": (a) => q(a - 2),
    },
    c: [2],
    origin: { extension: "the angle measure, Russian grade 5 (RES-4285)" },
  }),
  G2_angles({
    id: "G2.angles.13",
    form: "the-angle-between-two-rays-of-a-protractor",
    g: [7, 8],
    kind: "integer",
    p: [rg(10, 70), rg(80, 170)],
    f: (a, b) => q(b - a),
    alt: (a, b) => {
      let gap = 0;
      while (a + gap < b) gap += 1;
      return q(gap);
    },
    t: {
      "far-mark": (a, b) => q(b),
      "marks-added": (a, b) => q(a + b),
      "wrong-scale": (a, b) => {
        const w = Math.abs(a + b - 180);
        return w === b - a ? null : q(w);
      },
    },
    origin: { extension: "the angle measure, Russian grade 5 (RES-4285)" },
  }),
  G2_angles({
    id: "G2.angles.14",
    form: "an-angle-does-not-grow-with-its-arms",
    g: [7, 8],
    kind: "compare",
    p: [
      of(40, 50, 60, 70, 80, 90, 100, 110),
      of(40, 50, 60, 70, 80, 90, 100, 110),
      rg(2, 5),
    ],
    ok: (a, b) => a >= b,
    f: (a, b) => sign(q(a), q(b)),
    alt: (a, b) => SIGNS[Math.sign(a - b) + 1] ?? "=",
    t: { "longer-arms-bigger": () => "<" },
    origin: { extension: "the angle measure, Russian grade 5 (RES-4285)" },
  }),
  G2_angles({
    id: "G2.angles.15",
    form: "the-kind-of-an-angle-by-its-degrees",
    g: [4, 8],
    kind: "choice",
    p: [of(25, 40, 60, 75, 85, 90, 100, 120, 150, 170, 180)],
    f: (a) => String(kindOf(a)),
    alt: (a) =>
      String(1 + (a >= 90 ? 1 : 0) + (a > 90 ? 1 : 0) + (a >= 180 ? 1 : 0)),
    t: {
      "the-opposite-kind": (a) => String(OPPOSITE[kindOf(a)] ?? 1),
      "the-neighbour-kind": (a) => String(NEIGHBOUR[kindOf(a)] ?? 1),
    },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4, 90, 180],
    roles: { a: "measure of the angle" },
    origin: { extension: "the angle measure, Russian grade 5 (RES-4285)" },
  }),
  G2_angles({
    id: "G2.angles.16",
    form: "the-angle-read-on-a-protractor",
    g: [7, 8],
    kind: "integer",
    p: [of(20, 40, 50, 70, 80, 100, 110, 130, 140, 160)],
    f: (a) => q(a),
    alt: (a) => {
      const last = Math.floor(a / 30) * 30;
      return q(last + ((a - last) / 10) * 10);
    },
    t: {
      "other-scale": (a) => q(180 - a),
      "nearest-label": (a) => q(Math.round(a / 30) * 30),
      "divisions-as-ones": (a) =>
        q(Math.floor(a / 30) * 30 + (a - Math.floor(a / 30) * 30) / 10),
    },
    c: [10, 30],
    origin: { extension: "the angle measure, Russian grade 5 (RES-4285)" },
  }),
  G2_angles({
    id: "G2.angles.17",
    form: "the-angle-between-the-hands-at-half-past",
    g: [7, 8],
    kind: "integer",
    p: [rg(1, 11)],
    f: (a) => q(Math.abs(30 * a - 165)),
    alt: (a) => {
      const gap = Math.abs(30 * a + 15 - 180);
      return q(Math.min(gap, 360 - gap));
    },
    t: {
      "hour-hand-not-moved": (a) => q(Math.abs(30 * a - 180)),
      "bigger-angle": (a) => q(360 - Math.abs(30 * a - 165)),
      "minute-hand-on-twelve": (a) => q(Math.min(30 * a + 15, 345 - 30 * a)),
    },
    c: [6, 12, 15, 30, 180, 360],
    roles: { a: "hours shown" },
    origin: { extension: "the angle measure, Russian grade 5 (RES-4285)" },
  }),
  G2_angles({
    id: "G2.angles.18",
    form: "the-greatest-angle-of-a-triangle-in-a-ratio",
    g: [7, 8],
    kind: "integer",
    p: [rg(0, RATIOS.length - 1)],
    f: (i) => q((Math.max(...ratio(i)) * 180) / sumOf(ratio(i))),
    alt: (i) => {
      const r = ratio(i);
      let angle = 1;
      while (angle * sumOf(r) < 180 * Math.max(...r)) angle += 1;
      return q(angle);
    },
    t: {
      "one-part": (i) => q(180 / sumOf(ratio(i))),
      "from-360": (i) => q((Math.max(...ratio(i)) * 360) / sumOf(ratio(i))),
    },
    x: (i) => {
      const [u = 0, v = 0, t = 0] = ratio(i);
      return {
        u: String(u),
        v: String(v),
        t: String(t),
        m: String(Math.max(u, v, t)),
      };
    },
    c: [180, 360],
    origin: {
      olympiad:
        "the angles of a triangle in a given ratio, parts of 180 degrees (RES-4285, MCCME angle items)",
    },
  }),
  G2_angles({
    id: "G2.angles.19",
    form: "the-angle-next-to-a-vertical-pair",
    g: [7, 8],
    kind: "integer",
    p: [of(40, 60, 80, 100, 120, 140, 160, 200)],
    f: (a) => q(180 - a / 2),
    alt: (a) => q((360 - a) / 2),
    t: {
      "the-vertical-angle": (a) => q(a / 2),
      "from-180-the-sum": (a) =>
        Math.abs(180 - a) === a / 2 ? null : q(Math.abs(180 - a)),
      "both-others": (a) => q(360 - a),
    },
    c: [2, 180, 360],
    roles: { a: "sum of two vertical angles" },
    origin: { extension: "the angle measure, Russian grade 5 (RES-4285)" },
  }),
  G2_angles({
    id: "G2.angles.20",
    form: "the-two-angles-of-a-straight-angle-by-their-difference",
    g: [7, 8],
    kind: "integer",
    p: [of(10, 20, 30, 40, 50, 60, 70, 80, 100, 120)],
    f: (a) => q((180 + a) / 2),
    alt: (a) => {
      let smaller = 0;
      while (smaller + (smaller + a) < 180) smaller += 1;
      return q(smaller + a);
    },
    t: {
      "the-smaller-angle": (a) => q((180 - a) / 2),
      "half-plus-difference": (a) => q(90 + a),
      "just-the-rest": (a) => q(180 - a),
    },
    c: [2, 180],
    roles: { a: "difference of the two angles" },
    origin: {
      olympiad:
        "two angles from their sum and their difference (RES-4285, MCCME angle items)",
    },
  }),
  G2_angles({
    id: "G2.angles.21",
    form: "the-net-turn-of-a-hand",
    g: [6, 8],
    kind: "integer",
    p: [
      of(50, 60, 70, 80, 90, 100, 110, 120),
      of(20, 30, 40, 50, 60),
      of(30, 40, 50, 60, 70, 80),
    ],
    f: (a, b, c) => q(a - b + c),
    alt: (a, b, c) => q(a + c - b),
    t: {
      "all-added": (a, b, c) => q(a + b + c),
      "wrong-sign": (a, b, c) => (a + b - c > 0 ? q(a + b - c) : null),
      "all-subtracted": (a, b, c) => (a - b - c > 0 ? q(a - b - c) : null),
    },
    roles: { a: "first turn", b: "second turn", c: "third turn" },
    origin: { extension: "the angle measure, Russian grade 5 (RES-4285)" },
  }),
];

export const gSpecs1: readonly Spec<never>[] = [
  ...G1_shapes_specs,
  ...G2_angles_specs,
];
