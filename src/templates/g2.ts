// Domain G, part 2: symmetry and coordinates (RES-4285). The Dutch goals give line symmetry at group 5 and the grid
// reference at group 6; symmetry about a centre and the coordinate plane are Russian extensions of grade 6. Texts are
// plain blanks in `content/tasks-g.ru.json`. Generated from one table with the strings.
import type { Q } from "../math/q.js";
import { calc, of, rg } from "./kitc.js";
import { signed } from "./draw.js";
import { q, tm } from "./kitf.js";
import { SIGNS, type Spec } from "./spec.js";

/** The ends of the shortest-path tasks: the steps right and the steps up. */
export const GRID_PATHS: readonly (readonly [number, number])[] = [
  [2, 2],
  [2, 3],
  [3, 3],
  [2, 4],
  [3, 4],
  [2, 5],
  [3, 5],
];
const legsOf = (i: number): [number, number] => {
  const [u = 2, v = 2] = GRID_PATHS[i] ?? [];
  return [u, v];
};
/** The number of shortest paths right and up over `u` by `v` steps: the binomial of the steps. */
const paths = (u: number, v: number): number => {
  let result = 1;
  for (let i = 1; i <= Math.min(u, v); i += 1)
    result = (result * (u + v - i + 1)) / i;
  return result;
};

/**
 * Four positions for a piece that made `n` moves on a grid: one it can reach, two whose sum of coordinates has the
 * wrong parity and one that has the right parity but lies too far. `v` is the drawn list of the template.
 */
function reachOptions(v: readonly number[]): {
  readonly points: readonly (readonly [number, number])[];
  readonly answer: number;
  readonly parity: number;
  readonly far: number;
  readonly distinct: boolean;
} {
  const [n = 5, pos = 0, farPick = 0, jc = 0, jw1 = 0, jw2 = 0, jf = 0] = v;
  const t = v.slice(7);
  const others = [0, 1, 2, 3].filter((i) => i !== pos);
  const far = others[farPick % 3] ?? 0;
  const wrong = others.filter((i) => i !== far);
  const sums: number[] = [0, 0, 0, 0];
  sums[pos] = n - 2 * (jc % (Math.floor((n - 1) / 2) + 1));
  sums[far] = n + 2 + 2 * jf;
  sums[wrong[0] ?? 0] = n - 1 - 2 * (jw1 % (Math.floor((n - 2) / 2) + 1));
  sums[wrong[1] ?? 0] = n - 1 - 2 * (jw2 % (Math.floor((n - 2) / 2) + 1));
  const points = sums.map((s, i): readonly [number, number] => {
    const k = t[i] ?? 0;
    const x = k % (s + 1);
    const y = s - x;
    return [k % 2 === 1 && x > 0 ? -x : x, k >= 4 && y > 0 ? -y : y];
  });
  const keys = points.map((p) => `${p[0]},${p[1]}`);
  return {
    points,
    answer: pos + 1,
    parity: (wrong[0] ?? 0) + 1,
    far: far + 1,
    distinct: new Set(keys).size === 4,
  };
}

const sign = (x: Q, y: Q): (typeof SIGNS)[number] => SIGNS[x.cmp(y) + 1] ?? "=";

const G3_symmetry = calc("G3", "symmetry");
const G3_symmetry_specs: readonly Spec<never>[] = [
  G3_symmetry({
    id: "G3.symmetry.01",
    form: "the-axes-of-a-regular-polygon",
    g: [5, 6],
    kind: "integer",
    p: [of(3, 4, 5, 6, 7, 8, 9, 10, 12)],
    f: (a) => q(a),
    alt: (a) => q(a % 2 === 1 ? a : a / 2 + a / 2),
    t: {
      "one-axis": () => q(1),
      doubled: (a) => q(2 * a),
      "half-of-sides": (a) => (a % 2 === 0 ? q(a / 2) : null),
    },
    c: [1, 2],
  }),
  G3_symmetry({
    id: "G3.symmetry.02",
    form: "the-mirror-image-of-a-number",
    g: [5, 6],
    kind: "integer",
    p: [rg(1, 8), rg(9, 15)],
    f: (a, b) => q(2 * b - a),
    alt: (a, b) => {
      let image = 0;
      while ((a + image) / 2 !== b) image += 1;
      return q(image);
    },
    t: {
      "distance-only": (a, b) => q(b - a),
      "mirror-itself": (a, b) => q(b),
      "wrong-side": (a, b) => (2 * a - b === b - a ? null : q(2 * a - b)),
    },
    c: [2],
  }),
  G3_symmetry({
    id: "G3.symmetry.03",
    form: "the-mirror-point-on-a-grid",
    g: [5, 6],
    kind: "pair",
    p: [rg(1, 4), rg(1, 6), rg(5, 7)],
    ok: (a, b, c) => b !== 2 * c - a,
    f: (a, b, c) => [q(2 * c - a), q(b)] as const,
    alt: (a, b, c) => {
      let image = 0;
      while ((a + image) / 2 !== c) image += 1;
      return [q(image), q(b)] as const;
    },
    t: {
      "same-point": (a, b) => [q(a), q(b)] as const,
      swapped: (a, b, c) => [q(b), q(2 * c - a)] as const,
      "on-the-axis": (a, b, c) => [q(c), q(b)] as const,
      "horizontal-mirror": (a, b, c) =>
        a === b ? null : ([q(a), q(2 * c - b)] as const),
    },
    c: [2],
  }),
  G3_symmetry({
    id: "G3.symmetry.04",
    form: "the-point-reflected-in-a-centre",
    g: [7, 8],
    kind: "pair",
    p: [rg(1, 4), rg(1, 4), rg(5, 7), rg(5, 7)],
    f: (a, b, c, d) => [q(2 * c - a), q(2 * d - b)] as const,
    alt: (a, b, c, d) => {
      let x = 0;
      while ((a + x) / 2 !== c) x += 1;
      let y = 0;
      while ((b + y) / 2 !== d) y += 1;
      return [q(x), q(y)] as const;
    },
    t: {
      centre: (a, b, c, d) => [q(c), q(d)] as const,
      "line-mirror": (a, b, c) => [q(2 * c - a), q(b)] as const,
      "horizontal-mirror": (a, b, c, d) => [q(a), q(2 * d - b)] as const,
    },
    c: [2],
    origin: {
      extension:
        "the symmetry about a centre and the coordinate plane, Russian grade 6 (RES-4285)",
    },
  }),
  G3_symmetry({
    id: "G3.symmetry.05",
    form: "the-letters-with-a-vertical-axis",
    g: [5, 6],
    kind: "set",
    p: [rg(0, 19)],
    f: () => ["1", "3"],
    t: {
      "only-the-first": () => ["1"],
      "only-the-third": () => ["3"],
      "with-the-fourth": () => ["1", "3", "4"],
    },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
  }),
  G3_symmetry({
    id: "G3.symmetry.06",
    form: "the-letters-with-a-horizontal-axis",
    g: [5, 6],
    kind: "set",
    p: [rg(0, 19)],
    f: () => ["1", "3"],
    t: {
      "only-the-first": () => ["1"],
      "only-the-third": () => ["3"],
      "with-the-second": () => ["1", "2", "3"],
    },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
  }),
  G3_symmetry({
    id: "G3.symmetry.07",
    form: "the-letter-with-two-axes",
    g: [5, 6],
    kind: "choice",
    p: [rg(0, 19)],
    f: () => "3",
    t: {
      "one-vertical-axis": () => "1",
      "one-horizontal-axis": () => "2",
      "no-axis": () => "4",
    },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
  }),
  G3_symmetry({
    id: "G3.symmetry.08",
    form: "the-axes-of-a-rectangle",
    g: [5, 6],
    kind: "integer",
    p: [rg(2, 9), rg(10, 19), rg(2, 5)],
    f: (a, b, c) => q(2 * c),
    alt: (a, b, c) => {
      const perRectangle = ["along", "across"];
      let axes = 0;
      for (let i = 0; i < c; i += 1) axes += perRectangle.length;
      return q(axes);
    },
    t: {
      "as-a-square": (a, b, c) => q(4 * c),
      one: (a, b, c) => q(c),
    },
    c: [2],
    roles: {
      a: "length of the first side",
      b: "length of the second side",
      c: "count of rectangles",
    },
  }),
  G3_symmetry({
    id: "G3.symmetry.09",
    form: "the-axes-of-an-isosceles-triangle",
    g: [5, 6],
    kind: "integer",
    p: [rg(1, 4), rg(1, 3), rg(1, 4)],
    f: (a, b) => q(a + 3 * b),
    alt: (a, b, c) => {
      const kinds: readonly (readonly [number, number])[] = [
        [a, 1],
        [b, 3],
        [c, 0],
      ];
      return q(kinds.reduce((s, [count, axes]) => s + count * axes, 0));
    },
    t: {
      "scalene-with-an-axis": (a, b, c) => q(a + 3 * b + c),
      "equilateral-with-one-axis": (a, b) => q(a + b),
      "one-axis-each": (a, b, c) => q(a + b + c),
    },
    c: [0, 1, 3],
    roles: {
      a: "count of isosceles triangles",
      b: "count of equilateral triangles",
      c: "count of scalene triangles",
    },
  }),
  G3_symmetry({
    id: "G3.symmetry.10",
    form: "the-holes-in-a-folded-sheet",
    g: [5, 6],
    kind: "integer",
    p: [rg(1, 6)],
    f: (a) => q(2 ** a),
    alt: (a) => {
      let layers = [1];
      for (let fold = 0; fold < a; fold += 1) layers = [...layers, ...layers];
      return q(layers.length);
    },
    t: {
      "one-hole": () => q(1),
      "per-fold": (a) => (a <= 2 ? null : q(a)),
      "one-fold-less": (a) => (a <= 2 ? null : q(2 ** (a - 1))),
    },
    c: [2],
  }),
  G3_symmetry({
    id: "G3.symmetry.11",
    form: "the-card-flipped-twice",
    g: [5, 6],
    kind: "choice",
    p: [rg(2, 7)],
    f: (a) => (a % 2 === 0 ? "2" : "1"),
    alt: (a) => {
      let mirrored = false;
      for (let flip = 0; flip < a; flip += 1) mirrored = !mirrored;
      return mirrored ? "1" : "2";
    },
    t: {
      "upside-down": () => "3",
      "quarter-turn": () => "4",
      "the-other-parity": (a) => (a % 2 === 0 ? "1" : "2"),
    },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
    roles: { a: "count of flips" },
  }),
  G3_symmetry({
    id: "G3.symmetry.12",
    form: "the-axes-of-a-square",
    g: [5, 6],
    kind: "integer",
    p: [rg(1, 4), rg(1, 4)],
    f: (a, b) => q(4 * a + 2 * b),
    alt: (a, b) => {
      const square = ["across", "along", "diagonal", "other diagonal"];
      const rectangle = ["across", "along"];
      let axes = 0;
      for (let i = 0; i < a; i += 1) axes += square.length;
      for (let i = 0; i < b; i += 1) axes += rectangle.length;
      return q(axes);
    },
    t: {
      "as-a-rectangle": (a, b) => q(2 * a + 2 * b),
      "diagonals-of-rectangles": (a, b) => q(4 * a + 4 * b),
    },
    c: [2, 4],
    roles: { a: "count of squares", b: "count of rectangles" },
  }),
  G3_symmetry({
    id: "G3.symmetry.13",
    form: "the-time-in-a-mirror",
    g: [6, 8],
    kind: "time",
    face: "analogue",
    p: [rg(1, 10), of(10, 15, 20, 25, 30, 35, 40, 45, 50)],
    f: (a, b) => [q(11 - a), q(60 - b)] as const,
    alt: (a, b) => {
      const gone = 720 - (60 * a + b);
      return [q(Math.floor(gone / 60)), q(gone % 60)] as const;
    },
    t: {
      "the-shown-time": (a, b) => [q(a), q(b)] as const,
      "same-minutes": (a, b) => [q(11 - a), q(b)] as const,
      "forgot-the-hour": (a, b) => [q(12 - a), q(60 - b)] as const,
    },
    x: (a, b) => ({ t: tm(a, b) }),
    c: [0, 11, 12, 60],
    roles: { a: "hours in the mirror", b: "minutes in the mirror" },
    origin: {
      olympiad:
        "the time in a mirror and the time itself make 12 hours (RES-4285, Kangoeroe clock items)",
    },
  }),
  G3_symmetry({
    id: "G3.symmetry.14",
    form: "the-perimeter-of-a-figure-and-its-mirror-image",
    g: [5, 8],
    kind: "integer",
    p: [rg(2, 9), rg(2, 9)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(2 * (2 * a + b)),
    alt: (a, b) => q(2 * (2 * (a + b)) - 2 * b),
    t: {
      "both-perimeters": (a, b) => q(4 * (a + b)),
      "one-perimeter": (a, b) => q(2 * (a + b)),
      area: (a, b) => q(2 * a * b),
    },
    c: [2],
    roles: { a: "side across the mirror", b: "side along the mirror" },
  }),
  G3_symmetry({
    id: "G3.symmetry.15",
    form: "the-symmetric-colourings-of-a-strip",
    g: [6, 8],
    kind: "integer",
    p: [rg(3, 10)],
    f: (a) => q(2 ** Math.floor((a + 1) / 2)),
    alt: (a) => {
      let count = 0;
      for (let mask = 0; mask < 2 ** a; mask += 1) {
        const cells = Array.from({ length: a }, (_, i) => (mask >> i) & 1);
        if (cells.every((cell, i) => cell === cells[a - 1 - i])) count += 1;
      }
      return q(count);
    },
    t: {
      "all-colourings": (a) => q(2 ** a),
      "middle-cell-forgotten": (a) =>
        a % 2 === 0 ? null : q(2 ** Math.floor(a / 2)),
      "free-cells": (a) => q(Math.floor((a + 1) / 2)),
    },
    c: [2],
    roles: { a: "count of cells" },
    origin: {
      olympiad:
        "counting symmetric colourings: the free half decides (RES-4285, Kangoeroe and MCCME counting items)",
    },
  }),
  G3_symmetry({
    id: "G3.symmetry.16",
    form: "the-numbers-that-read-the-same-in-a-mirror",
    g: [6, 8],
    kind: "integer",
    p: [rg(3, 8)],
    f: (a) => q(9 * 10 ** (Math.floor((a + 1) / 2) - 1)),
    alt: (a) => {
      const half = Math.floor((a + 1) / 2);
      let count = 0;
      for (let h = 10 ** (half - 1); h < 10 ** half; h += 1) {
        const left = String(h);
        const whole = left + [...left.slice(0, a - half)].reverse().join("");
        if (whole.length === a && whole === [...whole].reverse().join(""))
          count += 1;
      }
      return q(count);
    },
    t: {
      "all-numbers": (a) => q(9 * 10 ** (a - 1)),
      "zero-first": (a) => q(10 ** Math.floor((a + 1) / 2)),
    },
    c: [9, 121, 1331],
    roles: { a: "count of digits" },
    origin: {
      olympiad:
        "counting palindromic numbers: the free half decides (RES-4285, Kangoeroe and MCCME counting items)",
    },
  }),
  G3_symmetry({
    id: "G3.symmetry.17",
    form: "the-centre-from-a-point-and-its-image",
    g: [7, 8],
    kind: "pair",
    p: [rg(1, 4), rg(1, 4), rg(5, 10), rg(5, 10)],
    ok: (a, b, c, d) =>
      (a + c) % 2 === 0 && (b + d) % 2 === 0 && a + c !== b + d,
    f: (a, b, c, d) => [q((a + c) / 2), q((b + d) / 2)] as const,
    alt: (a, b, c, d) => [q(a + (c - a) / 2), q(b + (d - b) / 2)] as const,
    t: {
      "sum-not-halved": (a, b, c, d) => [q(a + c), q(b + d)] as const,
      swapped: (a, b, c, d) => [q((b + d) / 2), q((a + c) / 2)] as const,
      "first-point": (a, b) => [q(a), q(b)] as const,
    },
    c: [2],
    origin: {
      extension:
        "the symmetry about a centre and the coordinate plane, Russian grade 6 (RES-4285)",
    },
  }),
  G3_symmetry({
    id: "G3.symmetry.18",
    form: "the-mirror-point-in-a-horizontal-line",
    g: [5, 6],
    kind: "pair",
    p: [rg(1, 6), rg(1, 4), rg(5, 7)],
    f: (a, b, c) => [q(a), q(2 * c - b)] as const,
    alt: (a, b, c) => {
      let image = 0;
      while ((b + image) / 2 !== c) image += 1;
      return [q(a), q(image)] as const;
    },
    t: {
      "same-point": (a, b) => [q(a), q(b)] as const,
      swapped: (a, b, c) => [q(2 * c - b), q(a)] as const,
      "vertical-mirror": (a, b, c) =>
        a === c ? null : ([q(2 * c - a), q(b)] as const),
      "on-the-axis": (a, b, c) => [q(a), q(c)] as const,
    },
    c: [2],
  }),
];

const G4_coordinates = calc("G4", "coordinates");
const G4_coordinates_specs: readonly Spec<never>[] = [
  G4_coordinates({
    id: "G4.coordinates.01",
    form: "the-distance-along-a-row",
    g: [6, 7],
    kind: "integer",
    p: [rg(1, 5), rg(6, 12), rg(1, 9)],
    f: (a, b) => q(b - a),
    alt: (a, b) => {
      let steps = 0;
      for (let x = a; x < b; x += 1) steps += 1;
      return q(steps);
    },
    t: {
      "far-coordinate": (a, b) => q(b),
      "coordinates-added": (a, b) => q(a + b),
      "counted-points": (a, b) => q(b - a + 1),
    },
  }),
  G4_coordinates({
    id: "G4.coordinates.02",
    form: "the-distance-along-a-column",
    g: [6, 7],
    kind: "integer",
    p: [rg(1, 9), rg(1, 5), rg(6, 12)],
    f: (a, b, c) => q(c - b),
    alt: (a, b, c) => {
      let steps = 0;
      for (let y = b; y < c; y += 1) steps += 1;
      return q(steps);
    },
    t: {
      "far-coordinate": (a, b, c) => q(c),
      "coordinates-added": (a, b, c) => q(b + c),
      "counted-points": (a, b, c) => q(c - b + 1),
    },
  }),
  G4_coordinates({
    id: "G4.coordinates.03",
    form: "the-fourth-vertex-of-a-rectangle",
    g: [6, 7],
    kind: "pair",
    p: [rg(1, 3), rg(1, 3), rg(5, 9), rg(5, 9)],
    f: (a, b, c, d) => [q(a), q(d)] as const,
    alt: (a, b, c, d) => [q(a + c - c), q(b + d - b)] as const,
    t: {
      "first-vertex": (a, b) => [q(a), q(b)] as const,
      "third-vertex": (a, b, c, d) => [q(c), q(d)] as const,
      swapped: (a, b, c, d) => [q(d), q(a)] as const,
    },
  }),
  G4_coordinates({
    id: "G4.coordinates.04",
    form: "the-position-after-a-move",
    g: [6, 7],
    kind: "pair",
    p: [rg(1, 4), rg(1, 4), rg(1, 5), rg(1, 5)],
    ok: (a, b, c, d) => c !== d,
    f: (a, b, c, d) => [q(a + c), q(b + d)] as const,
    alt: (a, b, c, d) => {
      let x = a;
      let y = b;
      for (let step = 0; step < c; step += 1) x += 1;
      for (let step = 0; step < d; step += 1) y += 1;
      return [q(x), q(y)] as const;
    },
    t: {
      "swapped-shifts": (a, b, c, d) => [q(a + d), q(b + c)] as const,
      "shifts-only": (a, b, c, d) => [q(c), q(d)] as const,
      swapped: (a, b, c, d) => [q(b + d), q(a + c)] as const,
    },
  }),
  G4_coordinates({
    id: "G4.coordinates.05",
    form: "the-middle-of-a-segment-on-a-row",
    g: [6, 7],
    kind: "pair",
    p: [of(2, 4, 6), of(8, 10, 12), rg(1, 9)],
    ok: (a, b, c) => (a + b) / 2 !== c,
    f: (a, b, c) => [q((a + b) / 2), q(c)] as const,
    alt: (a, b, c) => [q(a + (b - a) / 2), q(c)] as const,
    t: {
      "left-end": (a, b, c) => [q(a), q(c)] as const,
      "half-the-sum": (a, b) => [q((a + b) / 2), q((a + b) / 2)] as const,
      swapped: (a, b, c) => [q(c), q((a + b) / 2)] as const,
      "not-halved": (a, b, c) => [q(a + b), q(c)] as const,
    },
    c: [2],
  }),
  G4_coordinates({
    id: "G4.coordinates.06",
    form: "the-area-of-a-rectangle-from-two-opposite-vertices",
    g: [6, 7],
    kind: "integer",
    p: [rg(1, 3), rg(1, 3), rg(5, 9), rg(5, 9)],
    ok: (a, b, c, d) => c - a !== d - b,
    f: (a, b, c, d) => q((c - a) * (d - b)),
    alt: (a, b, c, d) => {
      let cells = 0;
      for (let x = a; x < c; x += 1) for (let y = b; y < d; y += 1) cells += 1;
      return q(cells);
    },
    t: {
      perimeter: (a, b, c, d) => q(2 * (c - a + (d - b))),
      "sides-added": (a, b, c, d) => q(c - a + (d - b)),
      "far-vertex-product": (a, b, c, d) =>
        c * d === 2 * (c - a + (d - b)) || c * d === c - a + (d - b)
          ? null
          : q(c * d),
    },
    c: [2],
  }),
  G4_coordinates({
    id: "G4.coordinates.07",
    form: "the-shortest-walk-on-a-grid",
    g: [6, 7],
    kind: "integer",
    p: [rg(1, 4), rg(1, 4), rg(5, 9), rg(5, 9)],
    ok: (a, b, c, d) => c - a !== d - b,
    f: (a, b, c, d) => q(c - a + (d - b)),
    alt: (a, b, c, d) => {
      let x = a;
      let y = b;
      let steps = 0;
      while (x < c || y < d) {
        if (x < c) x += 1;
        else y += 1;
        steps += 1;
      }
      return q(steps);
    },
    t: {
      "longer-side": (a, b, c, d) => q(Math.max(c - a, d - b)),
      "end-coordinates": (a, b, c, d) => q(c + d),
      area: (a, b, c, d) =>
        (c - a) * (d - b) === c + d ||
        (c - a) * (d - b) === Math.max(c - a, d - b)
          ? null
          : q((c - a) * (d - b)),
    },
  }),
  G4_coordinates({
    id: "G4.coordinates.08",
    form: "the-points-with-both-coordinates-up-to-a-bound",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 9)],
    f: (a) => q((a + 1) * (a + 1)),
    alt: (a) => {
      let points = 0;
      for (let x = 0; x <= a; x += 1)
        for (let y = 0; y <= a; y += 1) points += 1;
      return q(points);
    },
    t: {
      "without-zero": (a) => q(a * a),
      "one-axis": (a) => q(a + 1),
      "counts-added": (a) => q(2 * a + 2),
    },
    x: () => ({ x: "x", y: "y" }),
    c: [0, 1],
  }),
  G4_coordinates({
    id: "G4.coordinates.09",
    form: "the-distance-to-an-axis",
    g: [6, 7],
    kind: "integer",
    p: [rg(1, 5), rg(6, 12)],
    f: (a, b) => q(b),
    alt: (a, b) => {
      let rows = 0;
      for (let row = b; row > 0; row -= 1) rows += 1;
      return q(rows);
    },
    t: {
      "first-coordinate": (a) => q(a),
      "coordinates-added": (a, b) => q(a + b),
      "counted-rows": (a, b) => q(b + 1),
    },
    c: [0],
  }),
  G4_coordinates({
    id: "G4.coordinates.10",
    form: "the-position-after-a-return-walk",
    g: [6, 7],
    kind: "pair",
    p: [rg(4, 7), rg(4, 7), rg(1, 3), rg(1, 3)],
    ok: (a, b, c, d) => c !== d,
    f: (a, b, c, d) => [q(a - c), q(b - d)] as const,
    alt: (a, b, c, d) => {
      let x = 0;
      let y = 0;
      for (let step = 0; step < a; step += 1) x += 1;
      for (let step = 0; step < b; step += 1) y += 1;
      for (let step = 0; step < c; step += 1) x -= 1;
      for (let step = 0; step < d; step += 1) y -= 1;
      return [q(x), q(y)] as const;
    },
    t: {
      "all-added": (a, b, c, d) => [q(a + c), q(b + d)] as const,
      "first-part": (a, b) => [q(a), q(b)] as const,
      swapped: (a, b, c, d) =>
        a - c === b - d ? null : ([q(b - d), q(a - c)] as const),
    },
    c: [0],
  }),
  G4_coordinates({
    id: "G4.coordinates.11",
    form: "the-higher-point",
    g: [6, 7],
    kind: "compare",
    p: [rg(1, 9), rg(1, 9)],
    ok: (a, b) => a !== b,
    f: (a, b) => sign(q(a), q(b)),
    alt: (a, b) => SIGNS[Math.sign(a - b) + 1] ?? "=",
    t: { reversed: (a, b) => sign(q(b), q(a)) },
  }),
  G4_coordinates({
    id: "G4.coordinates.12",
    form: "the-coordinates-of-a-marked-point",
    g: [6, 7],
    kind: "pair",
    p: [rg(1, 9), rg(1, 7)],
    ok: (a, b) => a !== b,
    f: (a, b) => [q(a), q(b)] as const,
    alt: (a, b) => {
      let right = 0;
      let up = 0;
      while (right < a) right += 1;
      while (up < b) up += 1;
      return [q(right), q(up)] as const;
    },
    t: {
      swapped: (a, b) => [q(b), q(a)] as const,
      "counted-from-one": (a, b) => [q(a + 1), q(b + 1)] as const,
    },
  }),
  G4_coordinates({
    id: "G4.coordinates.13",
    form: "the-points-inside-a-rectangle-on-a-grid",
    g: [6, 8],
    kind: "integer",
    p: [rg(1, 3), rg(1, 3), rg(5, 9), rg(5, 9)],
    f: (a, b, c, d) => q((c - a - 1) * (d - b - 1)),
    alt: (a, b, c, d) => {
      let count = 0;
      for (let x = a + 1; x < c; x += 1)
        for (let y = b + 1; y < d; y += 1) count += 1;
      return q(count);
    },
    t: {
      "all-points": (a, b, c, d) => q((c - a + 1) * (d - b + 1)),
      area: (a, b, c, d) => q((c - a) * (d - b)),
      "one-direction-only": (a, b, c, d) => q((c - a - 1) * (d - b)),
    },
    c: [1],
    origin: {
      olympiad:
        "counting the points of a grid inside a rectangle, the fence-post idea (RES-4285, Kangoeroe counting items)",
    },
  }),
  G4_coordinates({
    id: "G4.coordinates.14",
    form: "the-shortest-paths-on-a-grid",
    g: [6, 8],
    kind: "integer",
    p: [rg(0, GRID_PATHS.length - 1)],
    f: (i) => q(paths(...legsOf(i))),
    alt: (i) => {
      const [u, v] = legsOf(i);
      const row: number[] = Array<number>(v + 1).fill(1);
      for (let x = 1; x <= u; x += 1)
        for (let y = 1; y <= v; y += 1)
          row[y] = (row[y] ?? 0) + (row[y - 1] ?? 0);
      return q(row[v] ?? 0);
    },
    t: {
      "steps-count": (i) => q(legsOf(i)[0] + legsOf(i)[1]),
      "two-corner-routes": (i) => (paths(...legsOf(i)) === 2 ? null : q(2)),
      "points-count": (i) => q((legsOf(i)[0] + 1) * (legsOf(i)[1] + 1)),
    },
    x: (i) => {
      const [u, v] = legsOf(i);
      return {
        u: String(u),
        v: String(v),
        p1: String(paths(u - 1, v)),
        p2: String(paths(u, v - 1)),
      };
    },
    c: [0],
    origin: {
      olympiad:
        "counting shortest paths on a grid by adding the counts of the two neighbours (RES-4285, Kangoeroe and MCCME counting items)",
    },
  }),
  G4_coordinates({
    id: "G4.coordinates.15",
    form: "the-positions-a-piece-reaches-in-a-given-number-of-moves",
    g: [6, 8],
    kind: "choice",
    p: [
      rg(5, 9),
      rg(0, 3),
      rg(0, 2),
      rg(0, 3),
      rg(0, 3),
      rg(0, 3),
      rg(0, 1),
      rg(0, 8),
      rg(0, 8),
      rg(0, 8),
      rg(0, 8),
    ],
    ok: (...v) => reachOptions(v).distinct,
    f: (...v) => String(reachOptions(v).answer),
    alt: (...v) => {
      const n = v[0] ?? 0;
      const o = reachOptions(v);
      const fits = o.points.flatMap(([x, y], i) => {
        const far = Math.abs(x) + Math.abs(y);
        return far <= n && (n - far) % 2 === 0 ? [String(i + 1)] : [];
      });
      return fits.length === 1 ? (fits[0] ?? "") : "";
    },
    t: {
      "wrong-parity": (...v) => String(reachOptions(v).parity),
      "too-far": (...v) => String(reachOptions(v).far),
    },
    x: (...v) => {
      const o = reachOptions(v);
      const text = (xy: readonly [number, number]): [string, string] => [
        signed(xy[0]),
        signed(xy[1]),
      ];
      return {
        n: String(v[0] ?? 0),
        ...Object.fromEntries(
          o.points.flatMap((xy, i) => {
            const [px, py] = text(xy);
            return [
              [`x${i + 1}`, px],
              [`y${i + 1}`, py],
              [`s${i + 1}`, String(Math.abs(xy[0]) + Math.abs(xy[1]))],
            ];
          }),
        ),
      };
    },
    options: () => ["1", "2", "3", "4"],
    c: [0, 1, 2, 3, 4],
    origin: {
      olympiad:
        "the parity of the sum of the coordinates after each move (RES-4285, MCCME parity and chessboard items)",
    },
  }),
  G4_coordinates({
    id: "G4.coordinates.16",
    form: "the-area-of-a-right-triangle-from-its-vertices",
    g: [6, 7],
    kind: "integer",
    p: [rg(1, 3), rg(1, 3), rg(5, 9), rg(5, 9)],
    ok: (a, b, c, d) => ((c - a) * (d - b)) % 2 === 0 && c - a !== d - b,
    f: (a, b, c, d) => q(((c - a) * (d - b)) / 2),
    alt: (a, b, c, d) => q((c - a) * ((d - b) / 2)),
    t: {
      "rectangle-area": (a, b, c, d) => q((c - a) * (d - b)),
      "legs-added": (a, b, c, d) =>
        (c - a) * (d - b) === 2 * (c - a + d - b) ? null : q(c - a + d - b),
    },
    c: [2],
  }),
  G4_coordinates({
    id: "G4.coordinates.17",
    form: "the-points-on-a-line-of-equal-sums",
    g: [6, 8],
    kind: "integer",
    p: [rg(5, 12)],
    f: (a) => q(a - 1),
    alt: (a) => {
      let points = 0;
      for (let x = 1; x < a; x += 1) if (a - x >= 1) points += 1;
      return q(points);
    },
    t: {
      "with-zeros": (a) => q(a + 1),
      "fence-post": (a) => q(a - 2),
    },
    x: () => ({ x: "x", y: "y" }),
    c: [1],
    origin: {
      olympiad:
        "counting the points of a grid on the line x + y = n (RES-4285, Kangoeroe counting items)",
    },
  }),
  G4_coordinates({
    id: "G4.coordinates.18",
    form: "the-grid-reference-of-a-cell",
    g: [6, 7],
    kind: "pair",
    p: [rg(2, 5), rg(1, 5)],
    ok: (a, b) => a !== b,
    f: (a, b) => [q(a), q(b)] as const,
    alt: (a, b) =>
      [q("ABCDE".indexOf(String.fromCharCode(64 + a)) + 1), q(b)] as const,
    t: {
      swapped: (a, b) => [q(b), q(a)] as const,
      "counted-from-zero": (a, b) => [q(a - 1), q(b)] as const,
    },
    x: (a) => ({ l: String.fromCharCode(64 + a) }),
    c: [1, 2, 3, 4, 5],
  }),
];

export const gSpecs2: readonly Spec<never>[] = [
  ...G3_symmetry_specs,
  ...G4_coordinates_specs,
];
