// Domain M, part 2: perimeter and area of rectangles and of figures made of rectangles (RES-4286). The Dutch
// goals measure the perimeter of squares and rectangles at group 5 and use the formulas at group 6. Texts are plain
// blanks in `content/tasks-m.ru.json`. Generated from one table with the strings.
import type { Q } from "../math/q.js";
import { calc, of, rg } from "./kitc.js";
import { q } from "./kitf.js";
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
/** `v` added `n` times, one addition at a time. */
const sumTimes = (n: number, v: number): number => {
  let s = 0;
  for (let i = 0; i < n; i++) s += v;
  return s;
};
/** How many times `step` can be taken from `total`, counted by taking it away one time after another. */
const takeAway = (total: number, step: number): number => {
  let n = 0;
  for (let left = total; left > 0; left -= step) n++;
  return n;
};
const divs = (n: number): number =>
  Array.from({ length: n }, (_, i) => i + 1).filter((k) => n % k === 0).length;
const pairs = (n: number): number => Math.floor((divs(n) + 1) / 2);
/** The perimeter of the rectangle with whole sides whose sides are closest. */
const nearSquare = (n: number): number => {
  let k = Math.floor(Math.sqrt(n));
  while (n % k !== 0) k--;
  return 2 * (k + n / k);
};

/** Pairs of rectangles with the same area and different perimeters, each pair in both orders. */
const EQUAL_AREA: readonly (readonly [number, number, number, number])[] = (
  [
    [2, 12, 4, 6],
    [1, 12, 3, 4],
    [2, 9, 3, 6],
    [2, 10, 4, 5],
    [3, 8, 4, 6],
    [1, 16, 2, 8],
    [3, 10, 5, 6],
    [2, 15, 5, 6],
    [4, 9, 6, 6],
    [1, 8, 2, 4],
    [3, 12, 4, 9],
    [2, 18, 4, 9],
  ] as const
).flatMap(([a, b, c, d]) => [[a, b, c, d] as const, [c, d, a, b] as const]);
export const equalArea = (
  i: number,
): readonly [number, number, number, number] => EQUAL_AREA[i] ?? [1, 1, 1, 1];

const M4_rect_squares = calc("M4", "rect-squares");
const M4_rect_squares_specs: readonly Spec<never>[] = [
  M4_rect_squares({
    id: "M4.rect-squares.01",
    alt: (a, b) => q(4 * a + 2 * (b - a)),
    form: "perimeter-of-a-rectangle-in-squares",
    g: [5, 6],
    kind: "integer",
    p: [rg(3, 9), rg(2, 8)],
    ok: (a, b) => a !== b && a * b !== 2 * (a + b) && a + b !== a * b,
    f: (a, b) => q(2 * (a + b)),
    t: {
      area: (a, b) => q(a * b),
      "one-pair": (a, b) => q(a + b),
      "three-sides": (a, b) => w(2 * a + b, 2 * (a + b), a * b, a + b),
      "border-cells": (a, b) =>
        w(2 * (a + b) - 4, 2 * (a + b), a * b, a + b, 2 * a + b),
    },
    c: [1, 2],
  }),
  M4_rect_squares({
    id: "M4.rect-squares.02",
    alt: (a, b) => q(sumTimes(b, a)),
    form: "area-of-a-rectangle-in-squares",
    g: [5, 6],
    kind: "integer",
    p: [rg(3, 9), rg(2, 8)],
    ok: (a, b) => a !== b && a * b !== 2 * (a + b),
    f: (a, b) => q(a * b),
    t: {
      perimeter: (a, b) => q(2 * (a + b)),
      "one-pair": (a, b) => w(a + b, a * b, 2 * (a + b)),
    },
    c: [1],
  }),
  M4_rect_squares({
    id: "M4.rect-squares.03",
    alt: (a) => q(sumTimes(4, a)),
    form: "perimeter-of-a-square-in-squares",
    g: [5, 6],
    kind: "integer",
    p: [rg(2, 12)],
    ok: (a) => a !== 4,
    f: (a) => q(4 * a),
    t: {
      area: (a) => q(a * a),
      "two-sides": (a) => w(2 * a, 4 * a, a * a),
      "three-sides": (a) => w(3 * a, 4 * a, a * a, 2 * a),
    },
    c: [1, 4],
  }),
  M4_rect_squares({
    id: "M4.rect-squares.04",
    alt: (a, b) => q((a - 2) * (b - 2) - 4),
    form: "how-much-larger-the-area-is-than-the-perimeter",
    g: [5, 6],
    kind: "integer",
    p: [rg(5, 9), rg(5, 9)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a * b - 2 * (a + b)),
    t: {
      "area-itself": (a, b) => q(a * b),
      "perimeter-itself": (a, b) => w(2 * (a + b), a * b - 2 * (a + b), a * b),
      "one-pair-subtracted": (a, b) =>
        w(a * b - (a + b), a * b - 2 * (a + b), a * b, 2 * (a + b)),
    },
    c: [1, 2],
  }),
  M4_rect_squares({
    id: "M4.rect-squares.05",
    alt: (a, b) => q(a * b - (a - 2) * (b - 2)),
    form: "squares-along-the-border",
    g: [5, 6],
    kind: "integer",
    p: [rg(3, 9), rg(3, 9)],
    f: (a, b) => q(2 * (a + b) - 4),
    t: {
      "corners-counted-twice": (a, b) => q(2 * (a + b)),
      "sides-minus-two": (a, b) =>
        w(2 * (a + b) - 2, 2 * (a + b) - 4, 2 * (a + b)),
      "interior-cells": (a, b) =>
        w((a - 2) * (b - 2), 2 * (a + b) - 4, 2 * (a + b), 2 * (a + b) - 2),
    },
    c: [2, 4],
  }),
  M4_rect_squares({
    id: "M4.rect-squares.06",
    alt: (a, b) => q(2 * (a + b) + 2),
    form: "perimeter-after-adding-a-row",
    g: [5, 6],
    kind: "integer",
    p: [rg(3, 9), rg(2, 8)],
    f: (a, b) => q(2 * (a + b + 1)),
    t: {
      "old-perimeter": (a, b) => q(2 * (a + b)),
      "plus-one": (a, b) => w(2 * (a + b) + 1, 2 * (a + b + 1), 2 * (a + b)),
      "new-area": (a, b) =>
        w(a * (b + 1), 2 * (a + b + 1), 2 * (a + b), 2 * (a + b) + 1),
    },
    c: [1],
  }),
  M4_rect_squares({
    id: "M4.rect-squares.07",
    alt: (a, b) => q(a * b + a * b),
    form: "area-after-doubling-the-length",
    g: [5, 6],
    kind: "integer",
    p: [rg(3, 9), rg(2, 8)],
    f: (a, b) => q(2 * a * b),
    t: {
      "old-area": (a, b) => q(a * b),
      "both-doubled": (a, b) => w(4 * a * b, 2 * a * b, a * b),
      "perimeter-instead": (a, b) =>
        w(2 * (2 * a + b), 2 * a * b, a * b, 4 * a * b),
    },
  }),
  M4_rect_squares({
    id: "M4.rect-squares.08",
    alt: (a, b) => q(4 * (a + b) - 2 * b),
    form: "perimeter-of-two-rectangles-joined",
    g: [5, 6],
    kind: "integer",
    p: [rg(2, 8), rg(2, 8)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(2 * (2 * a + b)),
    t: {
      "perimeters-added": (a, b) => q(4 * (a + b)),
      "one-rectangle": (a, b) => w(2 * (a + b), 2 * (2 * a + b), 4 * (a + b)),
      "half-perimeter": (a, b) =>
        w(2 * a + b, 2 * (2 * a + b), 4 * (a + b), 2 * (a + b)),
    },
  }),
  M4_rect_squares({
    id: "M4.rect-squares.09",
    alt: (a) => q((a + 1) ** 2 - a ** 2),
    form: "how-much-bigger-the-next-square-is",
    g: [5, 6],
    kind: "integer",
    p: [rg(3, 14)],
    f: (a) => q(2 * a + 1),
    t: {
      "side-increase": () => q(1),
      "side-doubled": (a) => q(2 * a),
      "new-area": (a) => w((a + 1) * (a + 1), 2 * a + 1, 2 * a),
      "one-strip": (a) => w(a + 1, 2 * a + 1, 2 * a, (a + 1) * (a + 1)),
    },
    c: [1],
  }),
  M4_rect_squares({
    id: "M4.rect-squares.10",
    alt: (a, b) => q(a + b + a + b - 1 - 1 + 1 + 1),
    form: "a-corner-square-cut-out",
    g: [5, 6],
    kind: "integer",
    p: [rg(3, 9), rg(3, 9)],
    f: (a, b) => q(2 * (a + b)),
    t: {
      smaller: (a, b) => q(2 * (a + b) - 2),
      "area-left": (a, b) => w(a * b - 1, 2 * (a + b), 2 * (a + b) - 2),
      "plus-two": (a, b) =>
        w(2 * (a + b) + 2, 2 * (a + b), 2 * (a + b) - 2, a * b - 1),
    },
    c: [1],
  }),
  M4_rect_squares({
    id: "M4.rect-squares.11",
    alt: (a) => {
      const cells = (a * (a + 1)) / 2;
      return q(4 * cells - 4 * (cells - a));
    },
    form: "perimeter-of-a-staircase",
    g: [5, 6],
    kind: "integer",
    p: [rg(2, 12)],
    ok: (a) => (a * (a + 1)) / 2 !== 4 * a,
    f: (a) => q(4 * a),
    t: {
      area: (a) => q((a * (a + 1)) / 2),
      "two-sides": (a) => w(2 * a, 4 * a, (a * (a + 1)) / 2),
      "all-squares": (a) => w(2 * a * (a + 1), 4 * a, (a * (a + 1)) / 2, 2 * a),
    },
    c: [1],
  }),
  M4_rect_squares({
    id: "M4.rect-squares.12",
    alt: (a) => q(4 * a - 2 * (a - 1)),
    form: "perimeter-of-a-chain-of-squares",
    g: [5, 6],
    kind: "integer",
    p: [rg(4, 12)],
    f: (a) => q(2 * a + 2),
    t: {
      "separate-squares": (a) => q(4 * a),
      "joins-hide-one": (a) => q(3 * a + 1),
      "one-joint-too-many": (a) => q(2 * a),
    },
    c: [4, 2, 1],
    origin: {
      olympiad:
        "the perimeter of a chain of squares does not depend on its bends: every joint hides two sides, in the spirit of the matchstick and zigzag items of the Kangoeroe reports (RES-4286)",
    },
    roles: { a: "number of squares in the chain" },
  }),
  M4_rect_squares({
    id: "M4.rect-squares.13",
    alt: (a, b, c) => q(a + b + a + b + c + c + c + c),
    form: "perimeter-of-a-rectangle-with-a-hole",
    g: [5, 6],
    kind: "integer",
    p: [rg(5, 10), rg(6, 12), rg(1, 2)],
    ok: (a, b) => a !== b,
    f: (a, b, c) => q(2 * (a + b) + 4 * c),
    t: {
      "outer-only": (a, b) => q(2 * (a + b)),
      "hole-area-added": (a, b, c) => q(2 * (a + b) + c * c),
      "one-side-of-hole": (a, b, c) =>
        w(
          2 * (a + b) + c,
          2 * (a + b) + 4 * c,
          2 * (a + b),
          2 * (a + b) + c * c,
        ),
    },
    c: [1, 2, 4],
  }),
  M4_rect_squares({
    id: "M4.rect-squares.14",
    alt: (a, b) => q((a + 2) * (b + 2) - a * b),
    form: "squares-in-a-frame-around-a-rectangle",
    g: [5, 6],
    kind: "integer",
    p: [rg(3, 9), rg(2, 8)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(2 * (a + b) + 4),
    t: {
      "without-corners": (a, b) => q(2 * (a + b)),
      "whole-figure": (a, b) => q((a + 2) * (b + 2)),
      "two-corners": (a, b) => q(2 * (a + b) + 2),
    },
    c: [2, 4],
  }),
];

const M4_rect_sides = calc("M4", "rect-sides");
const M4_rect_sides_specs: readonly Spec<never>[] = [
  M4_rect_sides({
    id: "M4.rect-sides.01",
    alt: (a, b) => q(4 * b + 2 * (a - b)),
    form: "perimeter-from-the-sides",
    g: [6, 6],
    kind: "integer",
    p: [rg(3, 19), rg(2, 14)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(2 * (a + b)),
    t: {
      "one-pair": (a, b) => q(a + b),
      area: (a, b) => w(a * b, 2 * (a + b), a + b),
      "three-sides": (a, b) => w(2 * a + b, 2 * (a + b), a + b, a * b),
    },
    c: [2],
  }),
  M4_rect_sides({
    id: "M4.rect-sides.02",
    alt: (a, b) => q(sumTimes(b, a)),
    form: "area-from-the-sides",
    g: [6, 6],
    kind: "integer",
    p: [rg(3, 19), rg(2, 14)],
    ok: (a, b) => a !== b && a * b !== 2 * (a + b),
    f: (a, b) => q(a * b),
    t: {
      perimeter: (a, b) => q(2 * (a + b)),
      "one-pair": (a, b) => w(a + b, a * b, 2 * (a + b)),
    },
  }),
  M4_rect_sides({
    id: "M4.rect-sides.03",
    alt: (a) => q(sumTimes(4, a)),
    form: "perimeter-of-a-square",
    g: [6, 6],
    kind: "integer",
    p: [rg(3, 19)],
    ok: (a) => a !== 4,
    f: (a) => q(4 * a),
    t: {
      area: (a) => q(a * a),
      "two-sides": (a) => w(2 * a, 4 * a, a * a),
      "three-sides": (a) => w(3 * a, 4 * a, a * a, 2 * a),
    },
    c: [4],
  }),
  M4_rect_sides({
    id: "M4.rect-sides.04",
    alt: (a, b) => q((2 * (a + b) - 2 * a) / 2),
    form: "the-other-side-from-the-perimeter",
    g: [6, 6],
    kind: "integer",
    p: [rg(3, 14), rg(2, 12)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(b),
    t: {
      "half-perimeter": (a, b) => q(a + b),
      "perimeter-minus-side": (a, b) => q(2 * (a + b) - a),
      "two-sides-left": (a, b) => w(2 * b, b, a + b, 2 * (a + b) - a),
    },
    x: (a, b) => ({ x: String(2 * (a + b)) }),
  }),
  M4_rect_sides({
    id: "M4.rect-sides.05",
    alt: (a, b) => q(sumTimes(a, b)),
    form: "the-area-of-a-floor",
    g: [6, 6],
    kind: "integer",
    p: [rg(3, 9), rg(2, 8)],
    ok: (a, b) => a !== b && a * b !== 2 * (a + b),
    f: (a, b) => q(a * b),
    t: {
      perimeter: (a, b) => q(2 * (a + b)),
      "one-pair": (a, b) => w(a + b, a * b, 2 * (a + b)),
    },
  }),
  M4_rect_sides({
    id: "M4.rect-sides.06",
    alt: (a, b) => q(4 * b - 2 * (b - a)),
    form: "the-length-of-a-fence",
    g: [6, 6],
    kind: "integer",
    p: [rg(8, 30), rg(5, 20)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(2 * (a + b)),
    t: {
      area: (a, b) => q(a * b),
      "one-pair": (a, b) => w(a + b, 2 * (a + b), a * b),
      "three-sides": (a, b) => w(2 * a + b, 2 * (a + b), a * b, a + b),
    },
    c: [2],
  }),
  M4_rect_sides({
    id: "M4.rect-sides.07",
    alt: (a, b, c, d) => sign(q(a + b), q(c + d)),
    form: "compare-two-perimeters",
    g: [6, 6],
    kind: "compare",
    p: [rg(3, 12), rg(2, 9), rg(3, 12), rg(2, 9)],
    ok: (a, b, c, d) =>
      a + b !== c + d && sign(q(a + b), q(c + d)) !== sign(q(a * b), q(c * d)),
    f: (a, b, c, d) => sign(q(2 * (a + b)), q(2 * (c + d))),
    t: {
      "areas-compared": (a, b, c, d) => sign(q(a * b), q(c * d)),
      "lengths-compared": (a, b, c, d) =>
        ws(
          sign(q(a), q(c)),
          sign(q(2 * (a + b)), q(2 * (c + d))),
          sign(q(a * b), q(c * d)),
        ),
      "widths-compared": (a, b, c, d) =>
        ws(
          sign(q(b), q(d)),
          sign(q(2 * (a + b)), q(2 * (c + d))),
          sign(q(a * b), q(c * d)),
          sign(q(a), q(c)),
        ),
    },
    x: (a, b, c, d) => ({ sign: sign(q(2 * (a + b)), q(2 * (c + d))) }),
  }),
  M4_rect_sides({
    id: "M4.rect-sides.08",
    alt: (a, b) => q((100 * a * (10 * b)) / 100),
    form: "area-with-sides-in-different-units",
    g: [6, 6],
    kind: "integer",
    p: [rg(2, 6), rg(3, 9)],
    f: (a, b) => q(10 * a * b),
    t: {
      "units-mixed": (a, b) => q(a * b),
      hundred: (a, b) => w(100 * a * b, 10 * a * b, a * b),
      "perimeter-in-dm": (a, b) =>
        w(2 * (10 * a + b), 10 * a * b, a * b, 100 * a * b),
    },
    c: [10],
  }),
  M4_rect_sides({
    id: "M4.rect-sides.09",
    alt: (a, b) => q(takeAway(a * b, a)),
    form: "the-other-side-from-the-area",
    g: [6, 6],
    kind: "integer",
    p: [rg(3, 12), rg(2, 9)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(b),
    t: {
      "area-minus-side": (a, b) => q(a * b - a),
      "halved-area": (a, b) => w((a * b) / 2, b, a * b - a),
    },
    x: (a, b) => ({ x: String(a * b) }),
  }),
  M4_rect_sides({
    id: "M4.rect-sides.10",
    alt: (a, b, c, d) => q(sumTimes(b, a) + sumTimes(d, c)),
    form: "the-total-area-of-two-rectangles",
    g: [6, 6],
    kind: "integer",
    p: [rg(3, 9), rg(2, 8), rg(3, 9), rg(2, 8)],
    ok: (a, b, c, d) => a * b !== c * d,
    f: (a, b, c, d) => q(a * b + c * d),
    t: {
      "sides-added": (a, b, c, d) => q(a + b + c + d),
      "sides-multiplied": (a, b, c, d) =>
        w((a + c) * (b + d), a * b + c * d, a + b + c + d),
      "perimeters-added": (a, b, c, d) =>
        w(2 * (a + b + c + d), a * b + c * d, a + b + c + d, (a + c) * (b + d)),
    },
  }),
  M4_rect_sides({
    id: "M4.rect-sides.11",
    alt: (a, b) => q((2 * a * (2 * b)) / 4),
    form: "the-number-of-large-tiles",
    g: [6, 6],
    kind: "integer",
    p: [rg(2, 9), rg(2, 9)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a * b),
    t: {
      "area-itself": (a, b) => q(4 * a * b),
      "tile-area-two": (a, b) => w(2 * a * b, a * b, 4 * a * b),
      "rows-added": (a, b) => w(a + b, a * b, 4 * a * b, 2 * a * b),
    },
    x: (a, b) => ({ x: String(2 * a), y: String(2 * b) }),
    c: [2, 4],
  }),
  M4_rect_sides({
    id: "M4.rect-sides.12",
    alt: (a, b, c) => q(a + b + a + (b - c)),
    form: "a-baseboard-around-a-room",
    g: [6, 6],
    kind: "integer",
    p: [rg(4, 9), rg(5, 12), rg(1, 2)],
    ok: (a, b) => a !== b,
    f: (a, b, c) => q(2 * (a + b) - c),
    t: {
      "door-ignored": (a, b) => q(2 * (a + b)),
      "door-twice": (a, b, c) => q(2 * (a + b) - 2 * c),
      "door-added": (a, b, c) => q(2 * (a + b) + c),
    },
    c: [2],
    roles: {
      a: "length of the room",
      b: "width of the room",
      c: "width of the door",
    },
  }),
  M4_rect_sides({
    id: "M4.rect-sides.13",
    alt: (a, b) => q(sumTimes(2, 100 * a) + sumTimes(2, b)),
    form: "perimeter-with-sides-in-different-units",
    g: [6, 6],
    kind: "integer",
    p: [rg(2, 6), of(20, 25, 30, 40, 50, 60, 70, 75)],
    f: (a, b) => q(2 * (100 * a + b)),
    t: {
      "units-added": (a, b) => q(2 * (a + b)),
      "metre-as-ten": (a, b) => q(2 * (10 * a + b)),
      "half-perimeter": (a, b) => q(100 * a + b),
    },
    c: [100, 2],
  }),
  M4_rect_sides({
    id: "M4.rect-sides.14",
    alt: (a, b) => q(2 * (a + b) - b),
    form: "a-pen-against-a-wall",
    g: [6, 6],
    kind: "integer",
    p: [rg(3, 8), rg(6, 15)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(b + 2 * a),
    t: {
      "full-perimeter": (a, b) => q(2 * (a + b)),
      "one-width-only": (a, b) => q(a + b),
      "wall-side-swapped": (a, b) => q(2 * b + a),
    },
    roles: { a: "width of the pen", b: "length along the wall" },
  }),
  M4_rect_sides({
    id: "M4.rect-sides.15",
    alt: (a, b) => {
      const part = 1;
      return q(2 * (part + b) + 2 * (a - part + b) - 2 * (a + b));
    },
    form: "the-perimeters-after-a-cut",
    g: [6, 8],
    kind: "integer",
    p: [rg(4, 12), rg(3, 9)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(2 * b),
    t: {
      "no-change": () => q(0),
      "cut-once": (a, b) => q(b),
      "sum-of-parts": (a, b) => q(2 * a + 4 * b),
    },
    c: [2],
    origin: {
      olympiad:
        "a cut adds its length twice to the sum of the perimeters, in the spirit of the perimeter items of MCCME 2021 grades 7 and 8 (RES-4286)",
    },
  }),
];

const M4_not_rect = calc("M4", "not-rect");
const M4_not_rect_specs: readonly Spec<never>[] = [
  M4_not_rect({
    id: "M4.not-rect.01",
    alt: (a, b, c, d) => q(sumTimes(b, a) + sumTimes(d, c)),
    form: "area-of-two-joined-rectangles",
    g: [6, 7],
    kind: "integer",
    p: [rg(4, 9), rg(2, 6), rg(2, 5), rg(2, 5)],
    ok: (a, b, c, d) => a * b !== c * d,
    f: (a, b, c, d) => q(a * b + c * d),
    t: {
      "sides-added": (a, b, c, d) => q(a + b + c + d),
      "sides-multiplied": (a, b, c, d) =>
        w((a + c) * (b + d), a * b + c * d, a + b + c + d),
      "perimeters-added": (a, b, c, d) =>
        w(2 * (a + b + c + d), a * b + c * d, a + b + c + d, (a + c) * (b + d)),
    },
  }),
  M4_not_rect({
    id: "M4.not-rect.02",
    alt: (a, b, c, d) => q((a - c) * b + c * (b - d)),
    form: "area-of-a-rectangle-with-a-corner-cut-out",
    g: [6, 7],
    kind: "integer",
    p: [rg(6, 12), rg(5, 10), rg(2, 4), rg(2, 4)],
    f: (a, b, c, d) => q(a * b - c * d),
    t: {
      added: (a, b, c, d) => q(a * b + c * d),
      "sides-subtracted": (a, b, c, d) =>
        w((a - c) * (b - d), a * b - c * d, a * b + c * d),
      "cut-part": (a, b, c, d) =>
        w(c * d, a * b - c * d, a * b + c * d, (a - c) * (b - d)),
    },
  }),
  M4_not_rect({
    id: "M4.not-rect.03",
    alt: (a, b, c, d) => q(b + a + (b - d) + c + d + (a - c)),
    form: "perimeter-of-a-rectangle-with-a-corner-cut-out",
    g: [6, 7],
    kind: "integer",
    p: [rg(6, 12), rg(5, 10), rg(2, 4), rg(2, 4)],
    f: (a, b) => q(2 * (a + b)),
    t: {
      "cut-sides-subtracted": (a, b, c, d) => q(2 * (a + b) - 2 * (c + d)),
      "area-left": (a, b, c, d) =>
        w(a * b - c * d, 2 * (a + b), 2 * (a + b) - 2 * (c + d)),
      "plus-cut-sides": (a, b, c, d) =>
        w(
          2 * (a + b) + 2 * (c + d),
          2 * (a + b),
          2 * (a + b) - 2 * (c + d),
          a * b - c * d,
        ),
    },
  }),
  M4_not_rect({
    id: "M4.not-rect.04",
    alt: (a, b, c, d) => q(sumTimes(b, a) - sumTimes(d, c)),
    form: "area-of-a-frame",
    g: [6, 7],
    kind: "integer",
    p: [rg(8, 14), rg(6, 10), rg(2, 5), rg(2, 4)],
    f: (a, b, c, d) => q(a * b - c * d),
    t: {
      added: (a, b, c, d) => q(a * b + c * d),
      "inner-area": (a, b, c, d) => w(c * d, a * b - c * d, a * b + c * d),
      "sides-subtracted": (a, b, c, d) =>
        w((a - c) * (b - d), a * b - c * d, a * b + c * d, c * d),
      "perimeters-subtracted": (a, b, c, d) =>
        w(
          2 * (a + b) - 2 * (c + d),
          a * b - c * d,
          a * b + c * d,
          c * d,
          (a - c) * (b - d),
        ),
    },
  }),
  M4_not_rect({
    id: "M4.not-rect.05",
    alt: (a) => q(5 * 4 * a - 4 * 2 * a),
    form: "perimeter-of-a-cross",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 9)],
    f: (a) => q(12 * a),
    t: {
      "squares-perimeter": (a) => q(20 * a),
      "shared-once": (a) => w(16 * a, 12 * a, 20 * a),
      area: (a) => w(5 * a * a, 12 * a, 20 * a, 16 * a),
    },
    c: [12, 20],
  }),
  M4_not_rect({
    id: "M4.not-rect.06",
    alt: (a, b, c, d, e, f) =>
      q(sumTimes(b, a) + sumTimes(d, c) + sumTimes(f, e)),
    form: "area-of-three-rectangles",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 6), rg(2, 6), rg(2, 5), rg(2, 5), rg(2, 4), rg(2, 4)],
    ok: (a, b, c, d, e, f) => a * b !== c * d && c * d !== e * f,
    f: (a, b, c, d, e, f) => q(a * b + c * d + e * f),
    t: {
      "two-rectangles-only": (a, b, c, d) => q(a * b + c * d),
      "sides-added": (a, b, c, d, e, f) =>
        w(a + b + c + d + e + f, a * b + c * d + e * f, a * b + c * d),
      "perimeters-added": (a, b, c, d, e, f) =>
        w(
          2 * (a + b + c + d + e + f),
          a * b + c * d + e * f,
          a * b + c * d,
          a + b + c + d + e + f,
        ),
    },
  }),
  M4_not_rect({
    id: "M4.not-rect.07",
    alt: (a, b) => {
      const cells = (b * (b + 1)) / 2;
      return q(a * (4 * cells - 4 * (cells - b)));
    },
    form: "perimeter-of-a-staircase-shape",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 8), rg(2, 5)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(4 * a * b),
    t: {
      area: (a, b) => q((a * a * b * (b + 1)) / 2),
      "two-sides": (a, b) => w(2 * a * b, 4 * a * b, (a * a * b * (b + 1)) / 2),
      "all-squares": (a, b) =>
        w(2 * a * b * (b + 1), 4 * a * b, (a * a * b * (b + 1)) / 2, 2 * a * b),
    },
    c: [4],
  }),
  M4_not_rect({
    id: "M4.not-rect.08",
    alt: (a, b, c) => q(2 * c * a + 2 * c * b + 4 * c * c),
    form: "area-of-a-path-around-a-garden",
    g: [6, 7],
    kind: "integer",
    p: [rg(4, 9), rg(4, 9), rg(1, 2)],
    ok: (a, b) => a !== b,
    f: (a, b, c) => q((a + 2 * c) * (b + 2 * c) - a * b),
    t: {
      "path-on-one-side": (a, b, c) => q((a + c) * (b + c) - a * b),
      "corners-missed": (a, b, c) =>
        w(
          2 * c * (a + b),
          (a + 2 * c) * (b + 2 * c) - a * b,
          (a + c) * (b + c) - a * b,
        ),
      "outer-area": (a, b, c) =>
        w(
          (a + 2 * c) * (b + 2 * c),
          (a + 2 * c) * (b + 2 * c) - a * b,
          (a + c) * (b + c) - a * b,
          2 * c * (a + b),
        ),
    },
    c: [2],
  }),
  M4_not_rect({
    id: "M4.not-rect.09",
    alt: (a, b, c, d) => q(takeAway(a * b + c * d - a * b, c)),
    form: "the-missing-side-of-a-second-rectangle",
    g: [6, 7],
    kind: "integer",
    p: [rg(3, 8), rg(3, 6), rg(2, 5), rg(2, 5)],
    ok: (a, b, c, d) => c !== d,
    f: (a, b, c, d) => q(d),
    t: {
      "area-of-the-second": (a, b, c, d) => q(c * d),
      "total-over-side": (a, b, c, d) => w((a * b + c * d) / c, d, c * d),
      "second-minus-side": (a, b, c, d) =>
        w(c * d - c, d, c * d, (a * b + c * d) / c),
    },
    x: (a, b, c, d) => ({ x: String(a * b + c * d) }),
  }),
  M4_not_rect({
    id: "M4.not-rect.10",
    alt: (a, b, c) => q((a - c) * b + c * (b - c)),
    form: "area-of-a-corner-piece-and-the-rest",
    g: [6, 7],
    kind: "integer",
    p: [rg(8, 14), rg(6, 10), rg(2, 5)],
    f: (a, b, c) => q(a * b - c * c),
    t: {
      added: (a, b, c) => q(a * b + c * c),
      "cut-part": (a, b, c) => w(c * c, a * b - c * c, a * b + c * c),
      "side-not-squared": (a, b, c) =>
        w(a * b - c, a * b - c * c, a * b + c * c, c * c),
      "sides-subtracted": (a, b, c) =>
        w((a - c) * (b - c), a * b - c * c, a * b + c * c, c * c, a * b - c),
    },
  }),
  M4_not_rect({
    id: "M4.not-rect.11",
    alt: (a, b) => q(4 * a - b + 3 * b),
    form: "perimeter-of-two-squares-side-by-side",
    g: [6, 7],
    kind: "integer",
    p: [rg(4, 10), rg(2, 5)],
    ok: (a, b) => b < a,
    f: (a, b) => q(4 * a + 2 * b),
    t: {
      "perimeters-added": (a, b) => q(4 * a + 4 * b),
      "common-side-once": (a, b) =>
        w(4 * a + 3 * b, 4 * a + 2 * b, 4 * a + 4 * b),
      area: (a, b) =>
        w(a * a + b * b, 4 * a + 2 * b, 4 * a + 4 * b, 4 * a + 3 * b),
    },
  }),
  M4_not_rect({
    id: "M4.not-rect.12",
    alt: (a, b, c) => q(a * b - (a - c) * (b - c)),
    form: "area-of-an-l-shaped-path",
    g: [6, 7],
    kind: "integer",
    p: [rg(8, 14), rg(7, 12), rg(2, 4)],
    ok: (a, b) => a !== b,
    f: (a, b, c) => q(c * (a + b - c)),
    t: {
      "corner-twice": (a, b, c) => q(c * (a + b)),
      "rest-of-the-plot": (a, b, c) => q((a - c) * (b - c)),
      "corner-removed-twice": (a, b, c) =>
        w(c * (a + b - 2 * c), c * (a + b - c), c * (a + b), (a - c) * (b - c)),
    },
    roles: {
      a: "length of the plot",
      b: "width of the plot",
      c: "width of the path",
    },
  }),
  M4_not_rect({
    id: "M4.not-rect.13",
    alt: (a, b, c) => q(a * b - c * a - c * b + c * c),
    form: "a-garden-with-two-crossing-paths",
    g: [6, 8],
    kind: "integer",
    p: [rg(8, 16), rg(6, 12), rg(1, 2)],
    ok: (a, b) => a !== b,
    f: (a, b, c) => q((a - c) * (b - c)),
    t: {
      "crossing-counted-twice": (a, b, c) => q(a * b - c * a - c * b),
      "one-path-only": (a, b, c) => q(a * (b - c)),
      "paths-area": (a, b, c) =>
        w(
          c * (a + b - c),
          (a - c) * (b - c),
          a * b - c * a - c * b,
          a * (b - c),
        ),
    },
    origin: {
      olympiad:
        "paths moved to the edges leave the area without paths unchanged, in the spirit of the garden-path items of the Kangoeroe and MCCME papers (RES-4286)",
    },
    roles: {
      a: "length of the garden",
      b: "width of the garden",
      c: "width of each path",
    },
  }),
  M4_not_rect({
    id: "M4.not-rect.14",
    alt: (a, b, c, d) => q(a - c + 2 * d + c + a + 2 * b),
    form: "perimeter-with-a-notch-in-a-side",
    g: [6, 7],
    kind: "integer",
    p: [rg(8, 14), rg(6, 10), rg(2, 4), rg(2, 4)],
    ok: (a, b) => a !== b,
    f: (a, b, c, d) => q(2 * (a + b) + 2 * d),
    t: {
      "perimeter-unchanged": (a, b) => q(2 * (a + b)),
      "depth-once": (a, b, c, d) => q(2 * (a + b) + d),
      "bottom-added": (a, b, c, d) => q(2 * (a + b) + 2 * d + c),
    },
    c: [2],
  }),
];

const M4_side_from_perimeter = calc("M4", "side-from-perimeter");
const M4_side_from_perimeter_specs: readonly Spec<never>[] = [
  M4_side_from_perimeter({
    id: "M4.side-from-perimeter.01",
    alt: (a) => q((4 * a) / 2 / 2),
    form: "the-side-of-a-square",
    g: [6, 7],
    kind: "integer",
    p: [rg(3, 19)],
    f: (a) => q(a),
    t: {
      half: (a) => q(2 * a),
      "perimeter-itself": (a) => w(4 * a, a, 2 * a),
      "divided-by-three": (a) => w((4 * a) / 3, a, 2 * a, 4 * a),
    },
    x: (a) => ({ x: String(4 * a) }),
    c: [4],
  }),
  M4_side_from_perimeter({
    id: "M4.side-from-perimeter.02",
    alt: (a, b) => q((100 * a - 2 * b) / 2),
    form: "the-other-side-of-a-rectangle",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 6), of(10, 20, 30, 40, 60, 70, 80)],
    f: (a, b) => q(50 * a - b),
    t: {
      "not-halved": (a, b) => q(100 * a - b),
      "side-doubled-forgotten": (a, b) => q(50 * a - b / 2),
      "two-sides-left": (a, b) => q(100 * a - 2 * b),
    },
    c: [100, 2],
    roles: { a: "perimeter in metres", b: "one side in centimetres" },
  }),
  M4_side_from_perimeter({
    id: "M4.side-from-perimeter.03",
    alt: (a) => q(takeAway(3 * a, 3)),
    form: "the-side-of-an-equilateral-triangle",
    g: [6, 7],
    kind: "integer",
    p: [of(4, 6, 8, 10, 12, 14, 16, 18)],
    f: (a) => q(a),
    t: {
      "perimeter-itself": (a) => q(3 * a),
      half: (a) => w((3 * a) / 2, a, 3 * a),
      "divided-by-four": (a) => w((3 * a) / 4, a, 3 * a, (3 * a) / 2),
    },
    x: (a) => ({ x: String(3 * a) }),
    c: [3],
  }),
  M4_side_from_perimeter({
    id: "M4.side-from-perimeter.04",
    alt: (a) => q(takeAway(5 * a, 5)),
    form: "the-side-of-a-regular-pentagon",
    g: [6, 7],
    kind: "integer",
    p: [of(4, 6, 8, 12, 16, 18, 20, 24)],
    f: (a) => q(a),
    t: {
      "perimeter-itself": (a) => q(5 * a),
      "divided-by-four": (a) => w((5 * a) / 4, a, 5 * a),
      "divided-by-six": (a) => w((5 * a) / 6, a, 5 * a, (5 * a) / 4),
    },
    x: (a) => ({ x: String(5 * a) }),
    c: [5],
  }),
  M4_side_from_perimeter({
    id: "M4.side-from-perimeter.05",
    alt: (a) => q((6 * a) / 2 / 3),
    form: "the-width-when-the-length-is-twice-the-width",
    g: [6, 7],
    kind: "integer",
    p: [rg(3, 14)],
    f: (a) => q(a),
    t: {
      length: (a) => q(2 * a),
      "half-perimeter": (a) => w((6 * a) / 2, a, 2 * a),
      "divided-by-four": (a) => w((6 * a) / 4, a, 2 * a, (6 * a) / 2),
    },
    x: (a) => ({ x: String(6 * a) }),
    c: [6],
  }),
  M4_side_from_perimeter({
    id: "M4.side-from-perimeter.06",
    alt: (a) => q(takeAway(6 * a, 6)),
    form: "the-side-of-a-regular-hexagon",
    g: [6, 7],
    kind: "integer",
    p: [rg(3, 15)],
    f: (a) => q(a),
    t: {
      "perimeter-itself": (a) => q(6 * a),
      half: (a) => w((6 * a) / 2, a, 6 * a),
      "divided-by-five": (a) => w((6 * a) / 5, a, 6 * a, (6 * a) / 2),
    },
    x: (a) => ({ x: String(6 * a) }),
    c: [6],
  }),
  M4_side_from_perimeter({
    id: "M4.side-from-perimeter.07",
    alt: (a, b) => q(2 * a + b - a - a),
    form: "the-base-of-an-isosceles-triangle",
    g: [6, 7],
    kind: "integer",
    p: [rg(4, 12), of(4, 6, 8, 10, 12)],
    ok: (a, b) => b < 2 * a && a !== b,
    f: (a, b) => q(b),
    t: {
      "one-leg-subtracted": (a, b) => q(2 * a + b - a),
      "divided-by-three": (a, b) => w((2 * a + b) / 3, b, 2 * a + b - a),
      "half-minus-leg": (a, b) =>
        w((2 * a + b) / 2 - a, b, 2 * a + b - a, (2 * a + b) / 3),
    },
    x: (a, b) => ({ x: String(2 * a + b) }),
    c: [2],
  }),
  M4_side_from_perimeter({
    id: "M4.side-from-perimeter.08",
    alt: (a) => q(sumTimes(a, a)),
    form: "the-area-of-a-square-from-its-perimeter",
    g: [6, 7],
    kind: "integer",
    p: [rg(3, 12)],
    f: (a) => q(a * a),
    t: {
      "side-only": (a) => q(a),
      "perimeter-itself": (a) => w(4 * a, a * a, a),
      "perimeter-squared": (a) => w(4 * a * 4 * a, a * a, a, 4 * a),
    },
    x: (a) => ({ x: String(4 * a), b: String(a) }),
    c: [4],
  }),
  M4_side_from_perimeter({
    id: "M4.side-from-perimeter.09",
    alt: (a, b) => q(a * (a + b) - a * a),
    form: "the-area-from-the-perimeter-and-one-side",
    g: [6, 7],
    kind: "integer",
    p: [rg(3, 12), rg(2, 9)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a * b),
    t: {
      "half-perimeter-times-side": (a, b) => q(a * (a + b)),
      "perimeter-times-side": (a, b) => w(2 * (a + b) * a, a * b, a * (a + b)),
      "other-side": (a, b) => w(b, a * b, a * (a + b), 2 * (a + b) * a),
    },
    x: (a, b) => ({ x: String(2 * (a + b)) }),
    c: [2],
  }),
  M4_side_from_perimeter({
    id: "M4.side-from-perimeter.10",
    alt: (a) => q(takeAway(8 * a, 8)),
    form: "the-side-of-a-regular-octagon",
    g: [6, 7],
    kind: "integer",
    p: [rg(3, 12)],
    f: (a) => q(a),
    t: {
      "perimeter-itself": (a) => q(8 * a),
      half: (a) => w((8 * a) / 2, a, 8 * a),
      "divided-by-four": (a) => w((8 * a) / 4, a, 8 * a, (8 * a) / 2),
    },
    x: (a) => ({ x: String(8 * a) }),
    c: [8],
  }),
  M4_side_from_perimeter({
    id: "M4.side-from-perimeter.11",
    alt: (a) => q(3 * ((10 * a) / 2 / 5)),
    form: "the-longer-side-of-a-rectangle-with-sides-in-a-ratio",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 9)],
    f: (a) => q(3 * a),
    t: {
      shorter: (a) => q(2 * a),
      "one-part": (a) => w(a, 3 * a, 2 * a),
      "half-perimeter": (a) => w(5 * a, 3 * a, 2 * a, a),
    },
    x: (a) => ({ x: String(10 * a), b: String(a) }),
    c: [2, 3, 10],
  }),
  M4_side_from_perimeter({
    id: "M4.side-from-perimeter.12",
    alt: (a, b) => {
      const perimeter = 4 * a + 2 * b;
      let side = 1;
      while (4 * side + 2 * b !== perimeter && side < 1000) side++;
      return q(side);
    },
    form: "the-shorter-side-from-the-perimeter-and-the-difference",
    g: [6, 7],
    kind: "integer",
    p: [rg(3, 10), rg(2, 6)],
    f: (a) => q(a),
    t: {
      "longer-side": (a, b) => q(a + b),
      "difference-not-halved": (a) => q(2 * a),
    },
    x: (a, b) => ({ x: String(4 * a + 2 * b) }),
    c: [2],
  }),
  M4_side_from_perimeter({
    id: "M4.side-from-perimeter.13",
    alt: (a) => {
      let n = 0;
      for (let s = 1; s <= a / 2 - s; s++) n++;
      return q(n);
    },
    form: "how-many-rectangles-have-a-perimeter",
    g: [6, 8],
    kind: "integer",
    p: [of(12, 14, 16, 18, 20, 22, 24, 26, 30)],
    f: (a) => q(Math.floor(a / 4)),
    t: {
      "ordered-pairs": (a) => q(a / 2 - 1),
      "square-left-out": (a) =>
        w(Math.floor((a / 2 - 1) / 2), Math.floor(a / 4)),
    },
    x: (a) => {
      const sides = Array.from({ length: Math.floor(a / 4) }, (_, i) => i + 1);
      return {
        e: sides.map((s) => `${s} + ${a / 2 - s}`).join(", "),
        s: sides.map(() => "1").join(" + "),
      };
    },
    c: [1, 2, 3],
    origin: {
      olympiad:
        "counting rectangles of a given perimeter by cases of the pair of sides, a clever count in the spirit of the MCCME papers (RES-4286)",
    },
  }),
  M4_side_from_perimeter({
    id: "M4.side-from-perimeter.14",
    alt: (a, b) => q(((2 * a + 2) * b) / (2 * a + 2)),
    form: "the-square-in-a-row-from-the-perimeter",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 6), rg(2, 7)],
    f: (a, b) => q(b),
    t: {
      "half-perimeter-over-count": (a, b) =>
        ((a + 1) * b) % a === 0 ? w(((a + 1) * b) / a, b) : null,
      "not-halved": (a, b) => q(2 * b),
    },
    x: (a, b) => ({ x: String((2 * a + 2) * b) }),
    c: [1],
  }),
  M4_side_from_perimeter({
    id: "M4.side-from-perimeter.15",
    alt: (a, b) => q((4 * a - 2 * b) / 2),
    form: "a-rectangle-with-the-perimeter-of-a-square",
    g: [6, 7],
    kind: "integer",
    p: [rg(5, 12), rg(2, 9)],
    ok: (a, b) => b < 2 * a && b !== a,
    f: (a, b) => q(2 * a - b),
    t: {
      "square-side-taken": (a) => q(a),
      "half-perimeter-only": (a) => q(2 * a),
    },
    c: [4, 2],
  }),
];

const M4_same_area = calc("M4", "same-area");
const M4_same_area_specs: readonly Spec<never>[] = [
  M4_same_area({
    id: "M4.same-area.01",
    alt: (a, b, c) => q(takeAway(a * (b * c), a * b)),
    form: "the-other-side-at-the-same-area",
    g: [6, 8],
    kind: "integer",
    p: [rg(2, 5), rg(2, 5), rg(2, 4)],
    ok: (a, b) => a !== b,
    f: (a, b, c) => q(c),
    t: {
      "first-side": (a) => q(a),
      area: (a, b, c) => w(a * b * c, c, a),
      "second-side": (a, b, c) => w(b * c, c, a, a * b * c),
    },
    x: (a, b, c) => ({ x: String(b * c), y: String(a * b) }),
  }),
  M4_same_area({
    id: "M4.same-area.02",
    alt: (a, b) => q(2 * a + 2 * takeAway(a * b, a)),
    form: "the-perimeter-from-the-area-and-one-side",
    g: [6, 8],
    kind: "integer",
    p: [rg(3, 9), rg(2, 9)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(2 * (a + b)),
    t: {
      "area-plus-side": (a, b) => q(2 * (a + a * b)),
      "other-side": (a, b) => w(b, 2 * (a + b), 2 * (a + a * b)),
      "half-perimeter": (a, b) => w(a + b, 2 * (a + b), 2 * (a + a * b), b),
    },
    x: (a, b) => ({ x: String(a * b) }),
    c: [2],
  }),
  M4_same_area({
    id: "M4.same-area.03",
    alt: (a) => {
      const [m, n, k, l] = equalArea(a);
      return sign(q(m + n), q(k + l));
    },
    form: "which-has-the-longer-perimeter",
    g: [6, 8],
    kind: "compare",
    p: [rg(0, EQUAL_AREA.length - 1)],
    f: (a) => {
      const [m, n, k, l] = equalArea(a);
      return sign(q(2 * (m + n)), q(2 * (k + l)));
    },
    t: {
      equal: () => "=",
      reversed: (a) => {
        const [m, n, k, l] = equalArea(a);
        return sign(q(2 * (m + n)), q(2 * (k + l))) === ">" ? "<" : ">";
      },
    },
    x: (a) => {
      const [m, n, k, l] = equalArea(a);
      return { m: String(m), n: String(n), k: String(k), l: String(l) };
    },
    c: [2],
  }),
  M4_same_area({
    id: "M4.same-area.04",
    form: "how-many-rectangles-with-whole-sides-have-an-area",
    g: [6, 8],
    kind: "integer",
    p: [of(12, 16, 18, 20, 24, 28, 30, 36, 40, 48)],
    alt: (a) => {
      let n = 0;
      for (let k = 1; k * k <= a; k++) if (a % k === 0) n++;
      return q(n);
    },
    x: (a) => ({
      pairs: Array.from({ length: a }, (_, i) => i + 1)
        .filter((k) => a % k === 0 && k * k <= a)
        .map((k) => `${k} \u00d7 ${a / k}`)
        .join(", "),
    }),
    f: (a) =>
      q(
        Math.floor(
          (Array.from({ length: a }, (_, i) => i + 1).filter((k) => a % k === 0)
            .length +
            1) /
            2,
        ),
      ),
    t: {
      "ordered-pairs": (a) =>
        q(
          Array.from({ length: a }, (_, i) => i + 1).filter((k) => a % k === 0)
            .length,
        ),
      "square-missed": (a) => w(Math.floor(divs(a) / 2), pairs(a), divs(a)),
      "without-the-strip": (a) =>
        w(pairs(a) - 1, pairs(a), divs(a), Math.floor(divs(a) / 2)),
    },
    c: [2, 3],
    origin: { olympiad: "counting rectangles of a given area (RES-4286)" },
  }),
  M4_same_area({
    id: "M4.same-area.05",
    alt: (a, b) => {
      const area = a * a * b * b;
      let side = 1;
      while (side * side < area) side++;
      return q(side);
    },
    form: "the-side-of-a-square-with-the-same-area",
    g: [6, 8],
    kind: "integer",
    p: [rg(2, 4), rg(2, 5)],
    f: (a, b) => q(a * b),
    t: {
      "longer-side": (a, b) => q(a * a * b),
      area: (a, b) => w(a * a * b * b, a * b, a * a * b),
      "mean-of-sides": (a, b) =>
        w((a * a * b + b) / 2, a * b, a * a * b, a * a * b * b),
    },
    x: (a, b) => ({ x: String(a * a * b), y: String(a * a * b * b) }),
  }),
  M4_same_area({
    id: "M4.same-area.06",
    alt: (a, b) => q(2 * a).mul(q(b, 2)),
    form: "stretching-one-side-and-shrinking-the-other",
    g: [6, 8],
    kind: "integer",
    p: [rg(3, 9), rg(2, 8)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a * b),
    t: {
      doubled: (a, b) => q(2 * a * b),
      halved: (a, b) => w((a * b) / 2, a * b, 2 * a * b),
      "perimeter-like": (a, b) => w(2 * (a + b), a * b, 2 * a * b, (a * b) / 2),
    },
    x: (a, b) => ({ x: String(a * b) }),
  }),
  M4_same_area({
    id: "M4.same-area.07",
    form: "the-area-after-cutting-and-rearranging",
    g: [6, 8],
    kind: "integer",
    alt: (a, b) => {
      const area = a * (a * b * b);
      let side = 1;
      while (side * side < area) side++;
      return q(side);
    },
    p: [rg(2, 9), rg(2, 4)],
    ok: (a, b) => a * b * b <= 100,
    f: (a, b) => q(a * b),
    t: {
      "mean-of-sides": (a, b) => w((a + a * b * b) / 2, a * b),
      "area-over-four": (a, b) => w((a * a * b * b) / 4, a * b),
    },
    x: (a, b) => ({ x: String(a), y: String(a * b * b) }),
    c: [4],
    origin: {
      olympiad:
        "cutting a rectangle into pieces that form a square, so that the area is kept, in the spirit of the cut-and-fold items of the MCCME papers (RES-4286)",
    },
  }),
  M4_same_area({
    id: "M4.same-area.08",
    alt: (a) => {
      let best = Infinity;
      for (let k = 1; k <= a; k++)
        if (a % k === 0) best = Math.min(best, 2 * (k + a / k));
      return q(best);
    },
    form: "the-smallest-perimeter-for-a-square-area",
    g: [6, 8],
    kind: "integer",
    p: [of(16, 24, 25, 28, 30, 36, 40, 42, 48)],
    f: (a) => q(nearSquare(a)),
    t: {
      "long-thin": (a) => w(2 * (1 + a), nearSquare(a)),
      "square-estimate": (a) => w(4 * Math.round(Math.sqrt(a)), nearSquare(a)),
      "half-perimeter": (a) => w(nearSquare(a) / 2, nearSquare(a)),
    },
    x: (a) => {
      const sides = Array.from({ length: a }, (_, i) => i + 1).filter(
        (k) => a % k === 0 && k * k <= a,
      );
      const k = sides[sides.length - 1] ?? 1;
      return {
        e1: sides.map((s) => `${s} × ${a / s}`).join(", "),
        e2: sides.map((s) => String(2 * (s + a / s))).join(", "),
        e3: `${2} × (${k} + ${a / k}) = ${2 * (k + a / k)}`,
      };
    },
    c: [2],
  }),
  M4_same_area({
    id: "M4.same-area.09",
    form: "the-largest-perimeter-for-a-given-area",
    g: [6, 8],
    kind: "integer",
    alt: (a) => {
      let best = 0;
      for (let k = 1; k <= a; k++)
        if (a % k === 0) best = Math.max(best, 2 * (k + a / k));
      return q(best);
    },
    p: [of(12, 14, 15, 18, 20, 21, 24, 28, 30)],
    f: (a) => q(2 * (1 + a)),
    t: {
      half: (a) => q(1 + a),
      "smallest-perimeter": (a) => w(nearSquare(a), 2 * (1 + a), 1 + a),
      "forgot-width": (a) => w(2 * a, 2 * (1 + a), 1 + a, nearSquare(a)),
    },
    c: [1],
  }),
  M4_same_area({
    id: "M4.same-area.10",
    alt: (a, b) => q(2 * b * (a - 1) * (a - 1)),
    form: "how-much-longer-the-rectangle-border-is",
    g: [6, 8],
    kind: "integer",
    p: [rg(2, 4), rg(2, 5)],
    f: (a, b) => q(2 * (a * a * b + b) - 4 * a * b),
    t: {
      "rectangle-only": (a, b) => q(2 * (a * a * b + b)),
      "square-only": (a, b) =>
        w(4 * a * b, 2 * (a * a * b + b) - 4 * a * b, 2 * (a * a * b + b)),
      "forgot-doubling": (a, b) =>
        w(
          a * a * b + b - 2 * a * b,
          2 * (a * a * b + b) - 4 * a * b,
          2 * (a * a * b + b),
          4 * a * b,
        ),
    },
    x: (a, b) => ({ x: String(a * a * b), y: String(a * b) }),
    c: [2, 4],
  }),
  M4_same_area({
    id: "M4.same-area.11",
    alt: (a, b) => q(sumTimes(6, a * b)),
    form: "the-area-of-the-enlarged-rectangle",
    g: [6, 8],
    kind: "integer",
    p: [rg(3, 9), rg(3, 9)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(6 * a * b),
    t: {
      "factors-added": (a, b) => q(5 * a * b),
      "one-factor-only": (a, b) => q(3 * a * b),
    },
    c: [2, 3],
  }),
  M4_same_area({
    id: "M4.same-area.12",
    alt: (a) => {
      const growth = 2 * a + 1;
      let side = 1;
      while ((side + 1) ** 2 - side ** 2 !== growth && side < 1000) side++;
      return q(side);
    },
    form: "the-side-of-a-square-from-the-growth-of-its-area",
    g: [6, 8],
    kind: "integer",
    p: [rg(3, 12)],
    f: (a) => q(a),
    t: {
      "increase-as-side": (a) => q(2 * a + 1),
      "not-halved": (a) => q(2 * a),
      "corner-added": (a) => q(a + 1),
    },
    x: (a) => ({ x: String(2 * a + 1) }),
    c: [1, 2],
    origin: {
      olympiad:
        "the strip added to a square is two sides and a corner, so the growth is twice the side plus one, in the spirit of the MCCME papers (RES-4286)",
    },
  }),
  M4_same_area({
    id: "M4.same-area.13",
    alt: (a, b) => q(a * a - (a + b) * (a - b)),
    form: "a-square-with-one-side-longer-and-the-other-shorter",
    g: [6, 8],
    kind: "integer",
    p: [rg(6, 15), rg(1, 4)],
    f: (a, b) => q(b * b),
    t: {
      unchanged: () => q(0),
      "shift-taken": (a, b) => q(b),
      "both-shifts": (a, b) => q(2 * b),
    },
  }),
  M4_same_area({
    id: "M4.same-area.14",
    alt: (a, b) => {
      const x = a + b;
      const y = a - b;
      return q(((x + y) / 2) ** 2 - x * y);
    },
    form: "how-much-larger-the-square-is-at-an-equal-perimeter",
    g: [6, 8],
    kind: "integer",
    p: [rg(5, 12), rg(1, 4)],
    f: (a, b) => q(b * b),
    t: {
      "equal-areas": () => q(0),
      "side-difference": (a, b) => q(2 * b),
      "square-side": (a, b) => w(a, b * b, 2 * b),
    },
    x: (a, b) => ({ x: String(a + b), y: String(a - b) }),
    c: [2],
  }),
];

export const mSpecs2: readonly Spec<never>[] = [
  ...M4_rect_squares_specs,
  ...M4_rect_sides_specs,
  ...M4_not_rect_specs,
  ...M4_side_from_perimeter_specs,
  ...M4_same_area_specs,
];
