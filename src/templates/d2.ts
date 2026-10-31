// Domain D, part 2: multiplying and dividing decimals, converting between fractions and decimals, and the
// order of operations with both (RES-4282). The Dutch goals multiply and divide by simple decimals at group 7
// and convert common fractions and decimals at group 7 and 8; the order of operations with mixed numbers is an
// extension at stretch. A decimal is written with a comma and a fraction with the fraction slash in a text.
// Texts are plain blanks in `content/tasks-d.ru.json`.
import { Q } from "../math/q.js";
import { between, pick } from "./draw.js";
import { writeValue } from "./expr.js";
import { dec, forFraction, fr, q, qd } from "./kitf.js";
import { SIGNS, type Spec } from "./spec.js";

const sign = (x: Q, y: Q): (typeof SIGNS)[number] => SIGNS[x.cmp(y) + 1] ?? "=";
/** `x` rounded to hundredths, a half going up. */
/** The number when it has a finite decimal form, or null. */
const fin = (x: Q): Q | null => {
  let d = x.d;
  while (d % 2n === 0n) d /= 2n;
  while (d % 5n === 0n) d /= 5n;
  return d === 1n ? x : null;
};
/** The number when it is whole, or null. */
const whole = (x: Q): Q | null => (x.d === 1n ? x : null);
const roundHundredths = (n: number, d: number): number =>
  Math.floor((2 * 100 * n + d) / (2 * d));
const cutHundredths = (n: number, d: number): number =>
  Math.floor((100 * n) / d);

const d4 = forFraction("D4", "multiply");
const multiply = [
  d4({
    id: "D4.multiply.01",
    form: "a-tenths-decimal-times-a-whole-number",
    groups: [7, 7],
    kind: "decimal",
    draw: (r) => [between(r, 11, 49), between(r, 2, 9)],
    valid: ([t = 0, k = 0]) => t % 10 !== 0 && (t * k) % 10 !== 0,
    solve: ([t = 0, k = 0]) => qd(t * k, 1),
    ref: ([t = 0, k = 0]) => qd(t, 1).mul(q(k)),
    traps: [
      ["comma-lost", "procedural", ([t = 0, k = 0]) => q(t * k)],
      ["added", "procedural", ([t = 0, k = 0]) => qd(t + 10 * k, 1)],
      [
        "comma-in-the-wrong-place",
        "procedural",
        ([t = 0, k = 0]) => qd(t * k, 2),
      ],
      [
        "parts-multiplied-separately",
        "conceptual",
        ([t = 0, k = 0]) =>
          Q.fromDecimal(`${Math.floor(t / 10) * k},${(t % 10) * k}`),
      ],
    ],
    extra: ([t = 0]) => ({ x: dec(t, 1) }),
  }),
  d4({
    id: "D4.multiply.02",
    form: "a-whole-number-times-a-hundredths-decimal",
    groups: [7, 7],
    kind: "decimal",
    draw: (r) => [between(r, 2, 9), between(r, 111, 399)],
    valid: ([k = 0, h = 0]) => h % 10 !== 0 && (h * k) % 10 !== 0,
    solve: ([k = 0, h = 0]) => qd(k * h, 2),
    ref: ([k = 0, h = 0]) => q(k).mul(qd(h, 2)),
    traps: [
      ["comma-lost", "procedural", ([k = 0, h = 0]) => q(k * h)],
      ["added", "procedural", ([k = 0, h = 0]) => qd(h + 100 * k, 2)],
      [
        "comma-in-the-wrong-place",
        "procedural",
        ([k = 0, h = 0]) => qd(k * h, 1),
      ],
    ],
    extra: ([, h = 0]) => ({ x: dec(h, 2) }),
  }),
  d4({
    id: "D4.multiply.03",
    form: "a-price-just-below-a-round-price",
    groups: [7, 7],
    kind: "decimal",
    draw: (r) => [between(r, 3, 12), between(r, 2, 9)],
    solve: ([k = 0, n = 0]) => qd(k * (100 * n - 1), 2),
    ref: ([k = 0, n = 0]) => q(k * n).sub(qd(k, 2)),
    traps: [
      [
        "cent-subtracted-once",
        "conceptual",
        ([k = 0, n = 0]) => q(k * n).sub(qd(1, 2)),
      ],
      ["added", "procedural", ([k = 0, n = 0]) => q(k).add(qd(100 * n - 1, 2))],
      ["rounded-price", "conceptual", ([k = 0, n = 0]) => q(k * n)],
    ],
    extra: ([, n = 0]) => ({ p: dec(100 * n - 1, 2), n: String(n) }),
  }),
  d4({
    id: "D4.multiply.04",
    form: "the-total-price-of-several-items",
    groups: [7, 7],
    roles: { a: "price of one item in cents", b: "number of items" },
    kind: "decimal",
    draw: (r) => [between(r, 111, 899), between(r, 2, 9)],
    valid: ([h = 0, k = 0]) => h % 10 !== 0 && (h * k) % 10 !== 0,
    solve: ([h = 0, k = 0]) => qd(h * k, 2),
    ref: ([h = 0, k = 0]) => qd(h, 2).mul(q(k)),
    traps: [
      ["comma-lost", "procedural", ([h = 0, k = 0]) => q(h * k)],
      ["added", "procedural", ([h = 0, k = 0]) => qd(h + 100 * k, 2)],
      [
        "comma-in-the-wrong-place",
        "procedural",
        ([h = 0, k = 0]) => qd(h * k, 1),
      ],
    ],
    extra: ([h = 0]) => ({ x: dec(h, 2) }),
  }),
  d4({
    id: "D4.multiply.05",
    form: "half-as-a-decimal-times-a-whole-number",
    groups: [7, 7],
    kind: "decimal",
    draw: (r) => [between(r, 3, 49)],
    valid: ([k = 0]) => k % 2 === 1,
    solve: ([k = 0]) => qd(5 * k, 1),
    ref: ([k = 0]) => q(k).div(q(2)),
    traps: [
      ["comma-in-the-wrong-place", "procedural", ([k = 0]) => qd(5 * k, 2)],
      ["added", "procedural", ([k = 0]) => q(k).add(qd(5, 1))],
      ["comma-lost", "procedural", ([k = 0]) => q(5 * k)],
    ],
    extra: () => ({ x: dec(5, 1) }),
  }),
  d4({
    id: "D4.multiply.06",
    form: "a-decimal-just-above-one-times-a-whole-number",
    groups: [7, 7],
    kind: "decimal",
    draw: (r) => [between(r, 11, 29), between(r, 3, 9)],
    valid: ([t = 0, k = 0]) => t % 10 !== 0 && (t * k) % 10 !== 0,
    solve: ([t = 0, k = 0]) => qd(t * k, 1),
    ref: ([t = 0, k = 0]) =>
      Array.from({ length: k }, () => qd(t, 1)).reduce(
        (a, b) => a.add(b),
        q(0),
      ),
    traps: [
      [
        "comma-in-the-wrong-place",
        "procedural",
        ([t = 0, k = 0]) => qd(t * k, 2),
      ],
      ["added", "procedural", ([t = 0, k = 0]) => qd(t + 10 * k, 1)],
      ["comma-lost", "procedural", ([t = 0, k = 0]) => q(t * k)],
      [
        "parts-multiplied-separately",
        "conceptual",
        ([t = 0, k = 0]) =>
          Q.fromDecimal(`${Math.floor(t / 10) * k},${(t % 10) * k}`),
      ],
    ],
    extra: ([t = 0]) => ({ x: dec(t, 1) }),
  }),
  d4({
    id: "D4.multiply.07",
    form: "a-quarter-as-a-decimal-times-a-whole-number",
    groups: [7, 7],
    kind: "decimal",
    draw: (r) => [pick(r, [25, 75]), between(r, 3, 15)],
    valid: ([, k = 0]) => k % 4 !== 0,
    solve: ([h = 0, k = 0]) => qd(h * k, 2),
    ref: ([h = 0, k = 0]) => qd(h, 2).mul(q(k)),
    traps: [
      ["comma-lost", "procedural", ([h = 0, k = 0]) => q(h * k)],
      ["added", "procedural", ([h = 0, k = 0]) => qd(h + 100 * k, 2)],
      [
        "comma-in-the-wrong-place",
        "procedural",
        ([h = 0, k = 0]) => qd(h * k, 1),
      ],
    ],
    extra: ([h = 0]) => ({ x: dec(h, 2) }),
  }),
  d4({
    id: "D4.multiply.08",
    form: "a-decimal-with-a-five-times-a-whole-number",
    groups: [7, 7],
    kind: "decimal",
    draw: (r) => [between(r, 1, 9), between(r, 3, 9)],
    valid: ([, k = 0]) => k % 2 === 1,
    solve: ([w = 0, k = 0]) => qd((10 * w + 5) * k, 1),
    ref: ([w = 0, k = 0]) => qd(10 * w + 5, 1).mul(q(k)),
    traps: [
      ["comma-lost", "procedural", ([w = 0, k = 0]) => q((10 * w + 5) * k)],
      [
        "parts-multiplied-separately",
        "conceptual",
        ([w = 0, k = 0]) => Q.fromDecimal(`${w * k},${5 * k}`),
      ],
      [
        "comma-in-the-wrong-place",
        "procedural",
        ([w = 0, k = 0]) => qd((10 * w + 5) * k, 2),
      ],
    ],
    extra: ([w = 0]) => ({ x: dec(10 * w + 5, 1) }),
  }),
  d4({
    id: "D4.multiply.09",
    form: "the-cost-of-several-kilograms",
    groups: [7, 7],
    roles: { a: "price of a kilogram in cents", b: "number of kilograms" },
    kind: "decimal",
    draw: (r) => [between(r, 111, 699), between(r, 2, 9)],
    valid: ([h = 0, k = 0]) => h % 10 !== 0 && (h * k) % 10 !== 0,
    solve: ([h = 0, k = 0]) => qd(h * k, 2),
    ref: ([h = 0, k = 0]) =>
      Array.from({ length: k }, () => qd(h, 2)).reduce(
        (a, b) => a.add(b),
        q(0),
      ),
    traps: [
      [
        "comma-in-the-wrong-place",
        "procedural",
        ([h = 0, k = 0]) => qd(h * k, 1),
      ],
      ["comma-lost", "procedural", ([h = 0, k = 0]) => q(h * k)],
      ["added", "procedural", ([h = 0, k = 0]) => qd(h + 100 * k, 2)],
    ],
    extra: ([h = 0]) => ({ x: dec(h, 2) }),
  }),
  d4({
    id: "D4.multiply.10",
    form: "a-whole-number-times-a-tenth",
    groups: [7, 7],
    kind: "decimal",
    draw: (r) => [between(r, 3, 9), between(r, 2, 9)],
    valid: ([k = 0, t = 0]) => k !== t && (k * t) % 10 !== 0,
    solve: ([k = 0, t = 0]) => qd(k * t, 1),
    ref: ([k = 0, t = 0]) => q(k).mul(qd(t, 1)),
    traps: [
      ["comma-lost", "procedural", ([k = 0, t = 0]) => q(k * t)],
      ["added", "procedural", ([k = 0, t = 0]) => qd(t + 10 * k, 1)],
      [
        "comma-in-the-wrong-place",
        "procedural",
        ([k = 0, t = 0]) => qd(k * t, 2),
      ],
    ],
    extra: ([, t = 0]) => ({ x: dec(t, 1) }),
  }),
  d4({
    id: "D4.multiply.11",
    form: "doubling-a-decimal",
    groups: [7, 7],
    kind: "decimal",
    draw: (r) => [between(r, 111, 449)],
    valid: ([h = 0]) => h % 10 !== 0 && (2 * h) % 10 !== 0,
    solve: ([h = 0]) => qd(2 * h, 2),
    ref: ([h = 0]) => qd(h, 2).add(qd(h, 2)),
    traps: [
      ["comma-lost", "procedural", ([h = 0]) => q(2 * h)],
      [
        "decimal-part-not-doubled",
        "conceptual",
        ([h = 0]) => qd(h + 100 * Math.floor(h / 100), 2),
      ],
      ["comma-in-the-wrong-place", "procedural", ([h = 0]) => qd(2 * h, 1)],
    ],
    extra: ([h = 0]) => ({ x: dec(h, 2) }),
    consts: [2],
  }),
  d4({
    id: "D4.multiply.12",
    form: "the-price-of-several-tickets",
    groups: [7, 7],
    roles: { a: "price of a ticket in cents", b: "number of tickets" },
    kind: "decimal",
    draw: (r) => [pick(r, [275, 325, 475, 625, 875]), between(r, 3, 9)],
    valid: ([h = 0, k = 0]) => (h * k) % 100 !== 0,
    solve: ([h = 0, k = 0]) => qd(h * k, 2),
    ref: ([h = 0, k = 0]) => qd(h, 2).mul(q(k)),
    traps: [
      [
        "comma-in-the-wrong-place",
        "procedural",
        ([h = 0, k = 0]) => qd(h * k, 1),
      ],
      ["added", "procedural", ([h = 0, k = 0]) => qd(h + 100 * k, 2)],
      ["comma-lost", "procedural", ([h = 0, k = 0]) => q(h * k)],
    ],
    extra: ([h = 0]) => ({ x: dec(h, 2) }),
  }),
  d4({
    id: "D4.multiply.13",
    form: "use-a-known-product-to-multiply-a-decimal",
    groups: [7, 7],
    kind: "decimal",
    draw: (r) => [between(r, 12, 49), between(r, 3, 19), between(r, 1, 2)],
    valid: ([k = 0, l = 0]) => k % 10 !== 0 && l !== 10,
    solve: ([k = 0, l = 0, p = 0]) => qd(k * l, p),
    ref: ([k = 0, l = 0, p = 0]) => qd(k, p).mul(q(l)),
    traps: [
      ["comma-lost", "procedural", ([k = 0, l = 0]) => q(k * l)],
      [
        "one-place-too-many",
        "procedural",
        ([k = 0, l = 0, p = 0]) => qd(k * l, p + 1),
      ],
      [
        "one-place-too-few",
        "procedural",
        ([k = 0, l = 0, p = 0]) => (p === 1 ? null : qd(k * l, p - 1)),
      ],
    ],
    extra: ([k = 0, l = 0, p = 0]) => ({ x: dec(k, p), m: String(k * l) }),
  }),
  d4({
    id: "D4.multiply.14",
    form: "estimate-a-product-by-rounding-the-decimal",
    groups: [7, 7],
    kind: "integer",
    draw: (r) => [between(r, 101, 999), between(r, 3, 12)],
    valid: ([h = 0]) => h % 10 !== 0 && h % 100 !== 50 && h % 100 > 10,
    solve: ([h = 0, k = 0]) => q(Math.floor((h + 50) / 100) * k),
    ref: ([h = 0, k = 0]) => {
      // The nearer whole number by distance, not by the half-up rule of `solve`.
      const low = Math.floor(h / 100);
      const nearer = h - 100 * low > 100 * (low + 1) - h ? low + 1 : low;
      return q(nearer * k);
    },
    traps: [
      [
        "cut-off",
        "procedural",
        ([h = 0, k = 0]) => (h % 100 > 50 ? q(Math.floor(h / 100) * k) : null),
      ],
      [
        "rounded-up",
        "procedural",
        ([h = 0, k = 0]) =>
          h % 100 < 50 ? q((Math.floor(h / 100) + 1) * k) : null,
      ],
      [
        "exact-product-rounded",
        "conceptual",
        ([h = 0, k = 0]) => {
          const wrong = Math.floor((h * k + 50) / 100);
          return wrong === Math.floor((h + 50) / 100) * k ? null : q(wrong);
        },
      ],
    ],
    roles: { a: "decimal factor in hundredths", b: "whole factor" },
    extra: ([h = 0]) => ({
      x: dec(h, 2),
      x1: String(Math.floor((h + 50) / 100)),
    }),
  }),
  d4({
    id: "D4.multiply.15",
    form: "compare-two-purchases-of-equal-items",
    groups: [7, 7],
    kind: "compare",
    draw: (r) => {
      const k1 = between(r, 2, 9);
      const h1 = between(r, 111, 499);
      const k2 = between(r, 2, 9);
      return [k1, h1, k2, Math.floor((k1 * h1) / k2) + between(r, -25, 25)];
    },
    valid: ([k1 = 0, h1 = 0, k2 = 0, h2 = 0]) =>
      k1 !== k2 &&
      h1 % 10 !== 0 &&
      h2 % 10 !== 0 &&
      h2 > 100 &&
      k1 * h1 !== k2 * h2,
    solve: ([k1 = 0, h1 = 0, k2 = 0, h2 = 0]) => sign(q(k1 * h1), q(k2 * h2)),
    ref: ([k1 = 0, h1 = 0, k2 = 0, h2 = 0]) =>
      k1 * h1 > k2 * h2 ? ">" : k1 * h1 < k2 * h2 ? "<" : "=",
    traps: [
      [
        "prices-only",
        "conceptual",
        ([k1 = 0, h1 = 0, k2 = 0, h2 = 0]) => {
          const wrong = sign(q(h1), q(h2));
          return wrong === sign(q(k1 * h1), q(k2 * h2)) ? null : wrong;
        },
      ],
      [
        "counts-only",
        "conceptual",
        ([k1 = 0, h1 = 0, k2 = 0, h2 = 0]) => {
          const wrong = sign(q(k1), q(k2));
          const right = sign(q(k1 * h1), q(k2 * h2));
          return wrong === right || wrong === sign(q(h1), q(h2)) ? null : wrong;
        },
      ],
    ],
    roles: { a: "count", b: "price in cents", c: "count", d: "price in cents" },
    extra: ([k1 = 0, h1 = 0, k2 = 0, h2 = 0]) => ({
      f: `${k1} × ${dec(h1, 2)}`,
      g: `${k2} × ${dec(h2, 2)}`,
      u: dec(k1 * h1, 2),
      w: dec(k2 * h2, 2),
    }),
  }),
  d4({
    id: "D4.multiply.16",
    form: "two-kinds-of-items-in-one-purchase",
    groups: [7, 7],
    kind: "decimal",
    draw: (r) => [
      between(r, 2, 6),
      between(r, 111, 399),
      between(r, 2, 6),
      between(r, 111, 399),
    ],
    valid: ([k1 = 0, h1 = 0, k2 = 0, h2 = 0]) =>
      k1 !== k2 && h1 !== h2 && h1 % 10 !== 0 && h2 % 10 !== 0,
    solve: ([k1 = 0, h1 = 0, k2 = 0, h2 = 0]) => qd(k1 * h1 + k2 * h2, 2),
    ref: ([k1 = 0, h1 = 0, k2 = 0, h2 = 0]) =>
      qd(h1, 2)
        .mul(q(k1))
        .add(qd(h2, 2).mul(q(k2))),
    traps: [
      [
        "second-kind-forgotten",
        "procedural",
        ([k1 = 0, h1 = 0]) => qd(k1 * h1, 2),
      ],
      [
        "all-at-the-first-price",
        "conceptual",
        ([k1 = 0, h1 = 0, k2 = 0]) => qd((k1 + k2) * h1, 2),
      ],
      [
        "comma-in-the-wrong-place",
        "procedural",
        ([k1 = 0, h1 = 0, k2 = 0, h2 = 0]) => qd(k1 * h1 + k2 * h2, 1),
      ],
    ],
    roles: {
      a: "count of the first kind",
      b: "price of the first kind in cents",
      c: "count of the second kind",
      d: "price of the second kind in cents",
    },
    extra: ([k1 = 0, h1 = 0, k2 = 0, h2 = 0]) => ({
      x: dec(h1, 2),
      y: dec(h2, 2),
      s1: dec(k1 * h1, 2),
      s2: dec(k2 * h2, 2),
    }),
  }),
  d4({
    id: "D4.multiply.17",
    form: "the-number-from-the-difference-of-two-multiples",
    groups: [7, 8],
    origin: {
      olympiad:
        "the difference of two multiples of one number gives the number, reasoning with units, MCCME style (RES-4282)",
    },
    kind: "decimal",
    draw: (r) => {
      const k2 = between(r, 2, 6);
      const gap = between(r, 2, 5);
      return [k2 + gap, k2, gap, between(r, 11, 99), between(r, 1, 2)];
    },
    valid: ([, , , n = 0]) => n % 10 !== 0,
    solve: ([, , , n = 0, p = 0]) => qd(n, p),
    ref: ([k1 = 0, k2 = 0, , n = 0, p = 0]) =>
      qd(n * (k1 - k2), p).div(q(k1 - k2)),
    traps: [
      [
        "the-difference-itself",
        "conceptual",
        ([, , g = 0, n = 0, p = 0]) => qd(n * g, p),
      ],
      [
        "multiplied-by-the-gap",
        "procedural",
        ([, , g = 0, n = 0, p = 0]) => qd(n * g * g, p),
      ],
    ],
    extra: ([, , g = 0, n = 0, p = 0]) => ({ y: dec(n * g, p, true) }),
  }),
];

/** Second factors in hundredths, some below one and some above. */
const FACTORS = [30, 50, 75, 90, 99, 101, 110, 120, 150, 205];
/** A decimal in hundredths-or-other units with its places, and a whole number that makes a round product with it. */
const ROUND_PAIRS: readonly (readonly [number, number, number])[] = [
  [25, 2, 4],
  [5, 1, 2],
  [2, 1, 5],
  [125, 2, 8],
  [125, 3, 8],
  [25, 1, 4],
];

const d4s = forFraction("D4", "multiply-1S");
const multiplyS = [
  d4s({
    id: "D4.multiply-1S.01",
    form: "a-tenth-times-a-tenth",
    groups: [7, 8],
    kind: "decimal",
    draw: (r) => [between(r, 2, 9), between(r, 2, 9)],
    valid: ([a = 0, b = 0]) => a !== b && (a * b) % 10 !== 0,
    solve: ([a = 0, b = 0]) => qd(a * b, 2),
    ref: ([a = 0, b = 0]) => qd(a, 1).mul(qd(b, 1)),
    traps: [
      ["whole-product", "procedural", ([a = 0, b = 0]) => q(a * b)],
      ["added", "procedural", ([a = 0, b = 0]) => qd(a + b, 1)],
      ["one-place", "procedural", ([a = 0, b = 0]) => qd(a * b, 1)],
    ],
    extra: ([a = 0, b = 0]) => ({ x: dec(a, 1), y: dec(b, 1) }),
  }),
  d4s({
    id: "D4.multiply-1S.02",
    form: "a-decimal-above-one-times-a-tenth",
    groups: [7, 8],
    kind: "decimal",
    draw: (r) => [between(r, 11, 29), between(r, 2, 9)],
    valid: ([t = 0, b = 0]) => t % 10 !== 0 && (t * b) % 10 !== 0,
    solve: ([t = 0, b = 0]) => qd(t * b, 2),
    ref: ([t = 0, b = 0]) => qd(t, 1).mul(qd(b, 1)),
    traps: [
      ["added", "procedural", ([t = 0, b = 0]) => qd(t + b, 1)],
      ["comma-lost", "procedural", ([t = 0, b = 0]) => q(t * b)],
      ["one-place", "procedural", ([t = 0, b = 0]) => qd(t * b, 1)],
    ],
    extra: ([t = 0, b = 0]) => ({ x: dec(t, 1), y: dec(b, 1) }),
  }),
  d4s({
    id: "D4.multiply-1S.03",
    form: "a-hundredths-decimal-times-a-tenth",
    groups: [7, 8],
    kind: "decimal",
    draw: (r) => [pick(r, [25, 35, 45, 65, 75]), between(r, 2, 9)],
    valid: ([h = 0, b = 0]) => (h * b) % 10 !== 0,
    solve: ([h = 0, b = 0]) => qd(h * b, 3),
    ref: ([h = 0, b = 0]) => qd(h, 2).mul(qd(b, 1)),
    traps: [
      ["one-place", "procedural", ([h = 0, b = 0]) => qd(h * b, 1)],
      ["added", "procedural", ([h = 0, b = 0]) => qd(h + 10 * b, 2)],
      ["two-places", "procedural", ([h = 0, b = 0]) => qd(h * b, 2)],
    ],
    extra: ([h = 0, b = 0]) => ({ x: dec(h, 2), y: dec(b, 1) }),
  }),
  d4s({
    id: "D4.multiply-1S.04",
    form: "the-area-of-a-rectangle-in-decimal-metres",
    groups: [7, 8],
    roles: {
      a: "length in tenths of a metre",
      b: "width in tenths of a metre",
    },
    kind: "decimal",
    draw: (r) => [between(r, 11, 39), between(r, 11, 39)],
    valid: ([a = 0, b = 0]) => a !== b && a % 10 !== 0 && b % 10 !== 0,
    solve: ([a = 0, b = 0]) => qd(a * b, 2),
    ref: ([a = 0, b = 0]) => qd(a, 1).mul(qd(b, 1)),
    traps: [
      ["perimeter", "conceptual", ([a = 0, b = 0]) => qd(2 * (a + b), 1)],
      ["sides-added", "procedural", ([a = 0, b = 0]) => qd(a + b, 1)],
      ["one-place", "procedural", ([a = 0, b = 0]) => qd(a * b, 1)],
    ],
    extra: ([a = 0, b = 0]) => ({ x: dec(a, 1), y: dec(b, 1) }),
  }),
  d4s({
    id: "D4.multiply-1S.05",
    form: "a-tenth-times-itself",
    groups: [7, 8],
    kind: "decimal",
    draw: (r) => [between(r, 2, 9)],
    solve: ([a = 0]) => qd(a * a, 2),
    ref: ([a = 0]) => qd(a, 1).mul(qd(a, 1)),
    traps: [
      ["doubled", "conceptual", ([a = 0]) => (a === 2 ? null : qd(2 * a, 1))],
      ["comma-lost", "procedural", ([a = 0]) => q(a * a)],
      ["one-place", "procedural", ([a = 0]) => qd(a * a, 1)],
    ],
    extra: ([a = 0]) => ({ x: dec(a, 1) }),
  }),
  d4s({
    id: "D4.multiply-1S.06",
    form: "a-decimal-above-one-times-itself",
    groups: [7, 8],
    kind: "decimal",
    draw: (r) => [between(r, 11, 19)],
    solve: ([t = 0]) => qd(t * t, 2),
    ref: ([t = 0]) => qd(t, 1).mul(qd(t, 1)),
    traps: [
      ["doubled", "conceptual", ([t = 0]) => qd(2 * t, 1)],
      ["comma-lost", "procedural", ([t = 0]) => q(t * t)],
      ["one-place", "procedural", ([t = 0]) => qd(t * t, 1)],
    ],
    extra: ([t = 0]) => ({ x: dec(t, 1) }),
  }),
  d4s({
    id: "D4.multiply-1S.07",
    form: "the-price-of-a-decimal-weight",
    groups: [7, 8],
    roles: {
      a: "weight in tenths of a kilogram",
      b: "price of a kilogram in tenths of a euro",
    },
    kind: "decimal",
    draw: (r) => [between(r, 11, 39), between(r, 11, 39)],
    valid: ([a = 0, b = 0]) => a !== b && a % 10 !== 0 && b % 10 !== 0,
    solve: ([a = 0, b = 0]) => qd(a * b, 2),
    ref: ([a = 0, b = 0]) => qd(b, 1).mul(qd(a, 1)),
    traps: [
      ["one-place", "procedural", ([a = 0, b = 0]) => qd(a * b, 1)],
      ["comma-lost", "procedural", ([a = 0, b = 0]) => q(a * b)],
      ["added", "procedural", ([a = 0, b = 0]) => qd(a + b, 1)],
    ],
    extra: ([a = 0, b = 0]) => ({ x: dec(a, 1), y: dec(b, 1) }),
  }),
  d4s({
    id: "D4.multiply-1S.08",
    form: "a-discount-factor-times-a-price",
    groups: [7, 8],
    roles: { a: "factor in tenths", b: "number in tenths" },
    kind: "decimal",
    draw: (r) => [between(r, 2, 9), between(r, 11, 99)],
    valid: ([a = 0, t = 0]) => t % 10 !== 0 && (a * t) % 10 !== 0,
    solve: ([a = 0, t = 0]) => qd(a * t, 2),
    ref: ([a = 0, t = 0]) => qd(t, 1).mul(qd(a, 1)),
    traps: [
      ["added", "procedural", ([a = 0, t = 0]) => qd(a + t, 1)],
      ["comma-lost", "procedural", ([a = 0, t = 0]) => q(a * t)],
      ["one-place", "procedural", ([a = 0, t = 0]) => qd(a * t, 1)],
    ],
    extra: ([a = 0, t = 0]) => ({ x: dec(a, 1), y: dec(t, 1) }),
  }),
  d4s({
    id: "D4.multiply-1S.09",
    form: "five-hundredths-times-a-whole-number",
    groups: [7, 8],
    kind: "decimal",
    draw: (r) => [between(r, 3, 49)],
    valid: ([k = 0]) => k % 2 === 1,
    solve: ([k = 0]) => qd(5 * k, 2),
    ref: ([k = 0]) => qd(5, 2).mul(q(k)),
    traps: [
      ["added", "procedural", ([k = 0]) => qd(5 + 100 * k, 2)],
      ["comma-lost", "procedural", ([k = 0]) => q(5 * k)],
      ["one-place", "procedural", ([k = 0]) => qd(5 * k, 1)],
    ],
    consts: [],
    extra: () => ({ x: dec(5, 2) }),
  }),
  d4s({
    id: "D4.multiply-1S.10",
    form: "a-hundredths-decimal-times-a-whole-number-of-tens",
    groups: [7, 8],
    kind: "decimal",
    draw: (r) => [between(r, 11, 49), pick(r, [20, 30, 40, 50, 60])],
    valid: ([h = 0]) => h % 10 !== 0,
    solve: ([h = 0, k = 0]) => qd(h * k, 2),
    ref: ([h = 0, k = 0]) => qd(h, 2).mul(q(k)),
    traps: [
      [
        "comma-in-the-wrong-place",
        "procedural",
        ([h = 0, k = 0]) => qd(h * k, 1),
      ],
      ["added", "procedural", ([h = 0, k = 0]) => qd(h + 100 * k, 2)],
      ["zero-dropped", "procedural", ([h = 0, k = 0]) => qd(h * (k / 10), 2)],
    ],
    extra: ([h = 0]) => ({ x: dec(h, 2) }),
  }),
  d4s({
    id: "D4.multiply-1S.11",
    form: "a-tenth-of-a-tenth",
    groups: [7, 8],
    kind: "decimal",
    draw: (r) => [between(r, 2, 9)],
    solve: ([a = 0]) => qd(a, 2),
    ref: ([a = 0]) => qd(a, 1).mul(qd(1, 1)),
    traps: [
      ["times-ten", "conceptual", ([a = 0]) => q(a)],
      ["added", "procedural", ([a = 0]) => qd(a + 1, 1)],
      ["one-place", "procedural", ([a = 0]) => qd(a, 1)],
    ],
    extra: ([a = 0]) => ({ y: dec(1, 1), x: dec(a, 1) }),
  }),
  d4s({
    id: "D4.multiply-1S.12",
    form: "two-tenths-whose-product-ends-in-a-zero",
    groups: [7, 8],
    kind: "decimal",
    draw: (r) => [between(r, 2, 19), between(r, 2, 19)],
    valid: ([a = 0, b = 0]) =>
      a !== b && a % 10 !== 0 && b % 10 !== 0 && (a * b) % 10 === 0,
    solve: ([a = 0, b = 0]) => qd(a * b, 2),
    ref: ([a = 0, b = 0]) => qd(a, 1).mul(qd(b, 1)),
    traps: [
      ["added", "procedural", ([a = 0, b = 0]) => qd(a + b, 1)],
      ["whole-product", "procedural", ([a = 0, b = 0]) => q(a * b)],
      ["one-place", "procedural", ([a = 0, b = 0]) => qd(a * b, 1)],
    ],
    extra: ([a = 0, b = 0]) => ({ x: dec(a, 1), y: dec(b, 1) }),
  }),
  d4s({
    id: "D4.multiply-1S.13",
    form: "use-a-known-product-to-multiply-two-decimals",
    groups: [7, 8],
    kind: "decimal",
    draw: (r) => [
      between(r, 12, 39),
      between(r, 12, 39),
      between(r, 1, 2),
      between(r, 1, 2),
    ],
    valid: ([k = 0, l = 0]) => k !== l && k % 10 !== 0 && l % 10 !== 0,
    solve: ([k = 0, l = 0, p = 0, e = 0]) => qd(k * l, p + e),
    ref: ([k = 0, l = 0, p = 0, e = 0]) => qd(k, p).mul(qd(l, e)),
    traps: [
      ["comma-lost", "procedural", ([k = 0, l = 0]) => q(k * l)],
      [
        "one-factor-places-only",
        "procedural",
        ([k = 0, l = 0, p = 0, e = 0]) =>
          p === e ? null : qd(k * l, Math.max(p, e)),
      ],
      [
        "one-place-too-few",
        "procedural",
        ([k = 0, l = 0, p = 0, e = 0]) =>
          p + e - 1 === Math.max(p, e) || p + e - 1 === 0
            ? null
            : qd(k * l, p + e - 1),
      ],
      [
        "one-place-too-many",
        "procedural",
        ([k = 0, l = 0, p = 0, e = 0]) => qd(k * l, p + e + 1),
      ],
    ],
    extra: ([k = 0, l = 0, p = 0, e = 0]) => ({
      x: dec(k, p),
      y: dec(l, e),
      m: String(k * l),
    }),
  }),
  d4s({
    id: "D4.multiply-1S.14",
    form: "select-the-products-smaller-than-the-first-factor",
    groups: [7, 8],
    kind: "set",
    draw: (r) => [
      between(r, 6, 40),
      pick(r, FACTORS),
      pick(r, FACTORS),
      pick(r, FACTORS),
      pick(r, FACTORS),
    ],
    valid: ([, ...m]) => {
      const below = m.filter((x) => x < 100).length;
      return new Set(m).size === 4 && below >= 1 && below <= 3;
    },
    options: () => ["1", "2", "3", "4"],
    solve: ([, ...m]) => m.flatMap((x, i) => (x < 100 ? [String(i + 1)] : [])),
    ref: ([, ...m]) =>
      ["1", "2", "3", "4"].filter((_, i) => qd(m[i] ?? 0, 2).cmp(q(1)) < 0),
    traps: [
      [
        "the-larger-multipliers",
        "conceptual",
        ([, ...m]) => m.flatMap((x, i) => (x > 100 ? [String(i + 1)] : [])),
      ],
      [
        "only-the-smallest",
        "conceptual",
        ([, ...m]) => {
          const only = [String(m.indexOf(Math.min(...m)) + 1)];
          return m.filter((x) => x < 100).length === 1 ? null : only;
        },
      ],
    ],
    extra: ([a = 0, ...m]) => ({
      f1: `${a} × ${dec(m[0] ?? 0, 2, true)}`,
      f2: `${a} × ${dec(m[1] ?? 0, 2, true)}`,
      f3: `${a} × ${dec(m[2] ?? 0, 2, true)}`,
      f4: `${a} × ${dec(m[3] ?? 0, 2, true)}`,
      less: m
        .filter((x) => x < 100)
        .map((x) => dec(x, 2, true))
        .join("; "),
    }),
    consts: [1, 2, 3, 4],
  }),
  d4s({
    id: "D4.multiply-1S.15",
    form: "zeros-after-the-comma-in-a-power-of-a-tenth-multiple",
    groups: [7, 8],
    origin: {
      olympiad:
        "counting the zeros of a repeated product of decimals, Kangaroo style (RES-4282)",
    },
    kind: "integer",
    draw: (r) => [between(r, 2, 9), between(r, 3, 6)],
    valid: ([b = 0, k = 0]) => k - String(b ** k).length >= 1,
    solve: ([b = 0, k = 0]) => q(k - String(b ** k).length),
    ref: ([b = 0, k = 0]) => {
      const text = (b ** k / 10 ** k).toFixed(k);
      return q((text.split(".")[1] ?? "").search(/[1-9]/));
    },
    traps: [
      ["places-counted", "conceptual", ([, k = 0]) => q(k)],
      [
        "one-less-than-places",
        "conceptual",
        ([b = 0, k = 0]) => (String(b ** k).length === 1 ? null : q(k - 1)),
      ],
    ],
    extra: ([b = 0, k = 0]) => ({
      x: dec(b, 1),
      m: String(String(b ** k).length),
    }),
  }),
  d4s({
    id: "D4.multiply-1S.16",
    form: "hundredths-times-tenths-with-leading-zeros",
    groups: [7, 8],
    kind: "decimal",
    draw: (r) => [between(r, 2, 9), between(r, 2, 9)],
    valid: ([a = 0, b = 0]) => (a * b) % 10 !== 0,
    solve: ([a = 0, b = 0]) => qd(a * b, 3),
    ref: ([a = 0, b = 0]) => qd(a, 2).mul(qd(b, 1)),
    traps: [
      ["one-zero-lost", "procedural", ([a = 0, b = 0]) => qd(a * b, 2)],
      ["comma-lost", "procedural", ([a = 0, b = 0]) => q(a * b)],
      ["added", "procedural", ([a = 0, b = 0]) => qd(a + 10 * b, 2)],
    ],
    extra: ([a = 0, b = 0]) => ({ x: dec(a, 2), y: dec(b, 1) }),
  }),
  d4s({
    id: "D4.multiply-1S.17",
    form: "a-product-of-three-with-a-round-pair",
    groups: [7, 8],
    kind: "decimal",
    draw: (r) => [r.int(ROUND_PAIRS.length), between(r, 3, 49)],
    valid: ([, k = 0]) => k % 10 !== 0,
    solve: ([i = 0, k = 0]) => {
      const [h = 0, places = 0, v = 0] = ROUND_PAIRS[i] ?? [];
      return qd(h * v * k, places);
    },
    ref: ([i = 0, k = 0]) => {
      const [h = 0, places = 0, v = 0] = ROUND_PAIRS[i] ?? [];
      return qd(h * k, places).mul(q(v));
    },
    traps: [
      [
        "last-factor-forgotten",
        "procedural",
        ([i = 0, k = 0]) => {
          const [h = 0, places = 0] = ROUND_PAIRS[i] ?? [];
          return qd(h * k, places);
        },
      ],
      [
        "comma-lost",
        "procedural",
        ([i = 0, k = 0]) => {
          const [h = 0, , v = 0] = ROUND_PAIRS[i] ?? [];
          return q(h * v * k);
        },
      ],
    ],
    extra: ([i = 0, k = 0]) => {
      const [h = 0, places = 0, v = 0] = ROUND_PAIRS[i] ?? [];
      return {
        u: dec(h, places),
        m: String(k),
        v: String(v),
        pr: dec(h * v, places, true),
      };
    },
  }),
];

/** Divisors for the largest-quotient task, in hundredths: some below one, some above, none that makes a repeating decimal. */
const DIVISORS = [20, 25, 40, 50, 80, 125, 200, 250];
/** Small divisors with their places: 0,2; 0,4; 0,5; 0,25; 0,05. */
const SMALL_DIVISORS: readonly (readonly [number, number])[] = [
  [2, 1],
  [4, 1],
  [5, 1],
  [25, 2],
  [5, 2],
];

const d5 = forFraction("D5", "divide");
const divide = [
  d5({
    id: "D5.divide.01",
    form: "a-whole-number-divided-by-a-tenths-decimal",
    groups: [7, 8],
    kind: "decimal",
    draw: (r) => [pick(r, [25, 15, 35, 45]), between(r, 2, 14)],
    valid: ([t = 0, k = 0]) => (t * k) % 10 === 0,
    solve: ([, k = 0]) => q(k),
    ref: ([t = 0, k = 0]) => q((t * k) / 10).div(qd(t, 1)),
    traps: [
      [
        "multiplied",
        "procedural",
        ([t = 0, k = 0]) => q(t * k, 10).mul(qd(t, 1)),
      ],
      ["comma-ignored", "procedural", ([, k = 0]) => qd(k, 1)],
      [
        "dividend-only-multiplied",
        "procedural",
        ([t = 0, k = 0]) => q(t * k).div(qd(t, 1)),
      ],
    ],
    extra: ([t = 0, k = 0]) => ({ x: dec(t, 1), n: String((t * k) / 10) }),
    consts: [10],
  }),
  d5({
    id: "D5.divide.02",
    form: "a-decimal-divided-by-a-whole-number",
    groups: [7, 8],
    kind: "decimal",
    draw: (r) => [between(r, 2, 9), between(r, 2, 39)],
    valid: ([k = 0, m = 0]) => (k * m) % 10 !== 0 && m % 10 !== 0 && k !== m,
    solve: ([, m = 0]) => qd(m, 1),
    ref: ([k = 0, m = 0]) => qd(k * m, 1).div(q(k)),
    traps: [
      ["whole-answer", "procedural", ([, m = 0]) => q(m)],
      ["multiplied", "procedural", ([k = 0, m = 0]) => qd(k * m, 1).mul(q(k))],
      ["comma-moved", "procedural", ([, m = 0]) => qd(m, 2)],
    ],
    extra: ([k = 0, m = 0]) => ({ x: dec(k * m, 1) }),
  }),
  d5({
    id: "D5.divide.03",
    form: "a-whole-number-divided-by-a-half",
    groups: [7, 8],
    kind: "integer",
    draw: (r) => [2 * between(r, 2, 25)],
    solve: ([n = 0]) => q(2 * n),
    ref: ([n = 0]) => q(n).div(qd(5, 1)),
    traps: [
      ["times-five", "procedural", ([n = 0]) => q(5 * n)],
      ["comma-ignored", "procedural", ([n = 0]) => whole(q(n, 5))],
      ["halved", "conceptual", ([n = 0]) => q(n / 2)],
    ],
    extra: () => ({ x: dec(5, 1) }),
    consts: [2],
  }),
  d5({
    id: "D5.divide.04",
    form: "a-whole-number-divided-by-a-quarter",
    groups: [7, 8],
    kind: "integer",
    draw: (r) => [4 * between(r, 1, 15)],
    solve: ([n = 0]) => q(4 * n),
    ref: ([n = 0]) => q(n).div(qd(25, 2)),
    traps: [
      ["doubled", "conceptual", ([n = 0]) => q(2 * n)],
      ["quartered", "conceptual", ([n = 0]) => q(n / 4)],
    ],
    extra: () => ({ x: dec(25, 2) }),
    consts: [4],
  }),
  d5({
    id: "D5.divide.05",
    form: "a-decimal-divided-by-a-single-digit",
    groups: [7, 8],
    kind: "decimal",
    draw: (r) => [between(r, 3, 9), between(r, 11, 99)],
    valid: ([k = 0, m = 0]) => m % 10 !== 0 && (k * m) % 10 !== 0,
    solve: ([, m = 0]) => qd(m, 2),
    ref: ([k = 0, m = 0]) => qd(k * m, 2).div(q(k)),
    traps: [
      ["comma-moved", "procedural", ([, m = 0]) => qd(m, 3)],
      ["multiplied", "procedural", ([k = 0, m = 0]) => qd(k * m, 2).mul(q(k))],
      ["whole-answer", "conceptual", ([, m = 0]) => q(m)],
    ],
    extra: ([k = 0, m = 0]) => ({ x: dec(k * m, 2) }),
  }),
  d5({
    id: "D5.divide.06",
    form: "how-many-small-glasses-from-whole-litres",
    groups: [7, 8],
    roles: { a: "litres in all", b: "glass size in tenths of a litre" },
    kind: "integer",
    draw: (r) => [between(r, 2, 9), pick(r, [2, 5])],
    solve: ([n = 0, t = 0]) => q((10 * n) / t),
    ref: ([n = 0, t = 0]) => q(n).div(qd(t, 1)),
    traps: [
      ["comma-ignored", "procedural", ([n = 0, t = 0]) => whole(q(n, t))],
      ["comma-moved-twice", "procedural", ([n = 0, t = 0]) => q((100 * n) / t)],
      ["multiplied", "procedural", ([n = 0, t = 0]) => q(n * t)],
    ],
    extra: ([, t = 0]) => ({ x: dec(t, 1) }),
  }),
  d5({
    id: "D5.divide.07",
    form: "one-divided-by-a-simple-decimal",
    groups: [7, 8],
    kind: "decimal",
    draw: (r) => [pick(r, [2, 4, 5, 10, 20, 25, 50])],
    solve: ([i = 0]) => q(i),
    ref: ([i = 0]) => q(1).div(qd(100 / i, 2)),
    traps: [
      // The divisor read as a whole number: 1 : 0,25 as 1 : 25, and 1 : 0,5 as 1 : 5.
      [
        "comma-ignored",
        "procedural",
        ([i = 0]) => q(1, (100 / i) % 10 === 0 ? 10 / i : 100 / i),
      ],
      ["multiplied", "procedural", ([i = 0]) => qd(100 / i, 2)],
      // One place too few, which only a divisor with two digits after the comma allows.
      [
        "comma-moved",
        "procedural",
        ([i = 0]) => ((100 / i) % 10 === 0 ? null : qd(i, 1)),
      ],
    ],
    extra: ([i = 0]) => ({
      x: dec(100 / i, 2, true),
      nn: String((100 / i) % 10 === 0 ? 10 / i : 100 / i),
    }),
    consts: [1],
  }),
  d5({
    id: "D5.divide.08",
    form: "a-quotient-rounded-to-hundredths",
    groups: [8, 8],
    kind: "decimal",
    draw: (r) => [between(r, 5, 40), pick(r, [3, 6, 7, 9, 11])],
    valid: ([n = 0, d = 0]) =>
      (100 * n) % d !== 0 && roundHundredths(n, d) !== cutHundredths(n, d),
    solve: ([n = 0, d = 0]) => qd(roundHundredths(n, d), 2),
    ref: ([n = 0, d = 0]) => qd(Math.round((100 * n) / d + 1e-9), 2),
    traps: [
      [
        "tenths",
        "procedural",
        ([n = 0, d = 0]) => qd(Math.round((10 * n) / d), 1),
      ],
      ["swapped", "procedural", ([n = 0, d = 0]) => fin(q(d, n))],
      ["cut-off", "procedural", ([n = 0, d = 0]) => qd(cutHundredths(n, d), 2)],
    ],
    consts: [],
  }),
  d5({
    id: "D5.divide.09",
    form: "the-price-of-one-item",
    groups: [7, 8],
    roles: { a: "total paid in cents", b: "number of items" },
    kind: "decimal",
    draw: (r) => [between(r, 111, 899), between(r, 2, 6)],
    valid: ([h = 0, k = 0]) =>
      h % k === 0 && h % 10 !== 0 && (h / k) % 10 !== 0,
    solve: ([h = 0, k = 0]) => qd(h / k, 2),
    ref: ([h = 0, k = 0]) => qd(h, 2).div(q(k)),
    traps: [
      [
        "comma-in-the-wrong-place",
        "procedural",
        ([h = 0, k = 0]) => qd(h / k, 1),
      ],
      ["comma-lost", "procedural", ([h = 0, k = 0]) => q(h / k)],
      ["multiplied", "procedural", ([h = 0, k = 0]) => qd(h * k, 2)],
    ],
    extra: ([h = 0]) => ({ x: dec(h, 2) }),
  }),
  d5({
    id: "D5.divide.10",
    form: "how-many-portions-of-three-quarters",
    groups: [7, 8],
    roles: { n: "litres in all", x: "portion in hundredths of a litre" },
    kind: "integer",
    draw: (r) => [between(r, 2, 16)],
    solve: ([j = 0]) => q(4 * j),
    ref: ([j = 0]) => q(3 * j).div(qd(75, 2)),
    traps: [
      ["quarters-not-grouped", "conceptual", ([j = 0]) => q(12 * j)],
      ["multiplied", "procedural", ([j = 0]) => whole(q(9 * j, 4))],
      ["divided-by-three", "conceptual", ([j = 0]) => q(j)],
    ],
    extra: ([j = 0]) => ({ x: dec(75, 2), n: String(3 * j) }),
    consts: [3],
  }),
  d5({
    id: "D5.divide.11",
    form: "a-decimal-divided-by-a-decimal",
    groups: [7, 8],
    kind: "decimal",
    draw: (r) => [between(r, 2, 9), between(r, 2, 9)],
    valid: ([d = 0, k = 0]) => d !== k,
    solve: ([, k = 0]) => q(k),
    ref: ([d = 0, k = 0]) => qd(d * k, 1).div(qd(d, 1)),
    traps: [
      ["multiplied", "procedural", ([d = 0, k = 0]) => qd(d * d * k, 2)],
      ["comma-ignored", "procedural", ([, k = 0]) => qd(k, 1)],
      ["dividend-only-moved", "procedural", ([, k = 0]) => q(10 * k)],
    ],
    extra: ([d = 0, k = 0]) => ({ x: dec(d * k, 1), y: dec(d, 1) }),
    consts: [10],
  }),
  d5({
    id: "D5.divide.12",
    form: "a-decimal-dividend-from-a-known-quotient",
    groups: [7, 8],
    kind: "decimal",
    draw: (r) => {
      const l = between(r, 3, 9);
      const c = between(r, 11, 49);
      return [l * c, l, c, between(r, 1, 2)];
    },
    valid: ([, , c = 0]) => c % 10 !== 0,
    solve: ([, , c = 0, p = 0]) => qd(c, p),
    ref: ([a = 0, l = 0, , p = 0]) => qd(a, p).div(q(l)),
    traps: [
      ["comma-lost", "procedural", ([, , c = 0]) => q(c)],
      [
        "one-place-too-many",
        "procedural",
        ([, , c = 0, p = 0]) => qd(c, p + 1),
      ],
      [
        "one-place-too-few",
        "procedural",
        ([, , c = 0, p = 0]) => (p === 1 ? null : qd(c, p - 1)),
      ],
    ],
    extra: ([a = 0, , , p = 0]) => ({ x: dec(a, p) }),
  }),
  d5({
    id: "D5.divide.13",
    form: "a-decimal-divisor-from-a-known-quotient",
    groups: [7, 8],
    kind: "decimal",
    draw: (r) => {
      const l = between(r, 2, 9);
      const c = between(r, 11, 49);
      return [l * c, l, c, between(r, 1, 2)];
    },
    valid: ([, , c = 0]) => c % 10 !== 0,
    solve: ([, , c = 0, p = 0]) => q(c * 10 ** p),
    ref: ([a = 0, l = 0, , p = 0]) => q(a).div(qd(l, p)),
    traps: [
      ["comma-not-moved", "procedural", ([, , c = 0]) => q(c)],
      ["moved-the-wrong-way", "procedural", ([, , c = 0, p = 0]) => qd(c, p)],
      [
        "one-place-too-few",
        "procedural",
        ([, , c = 0, p = 0]) => (p === 1 ? null : q(c * 10 ** (p - 1))),
      ],
    ],
    extra: ([, l = 0, , p = 0]) => ({ y: dec(l, p) }),
  }),
  d5({
    id: "D5.divide.14",
    form: "the-largest-quotient-of-four",
    groups: [7, 8],
    kind: "choice",
    draw: (r) => [
      between(r, 6, 40),
      pick(r, DIVISORS),
      pick(r, DIVISORS),
      pick(r, DIVISORS),
      pick(r, DIVISORS),
    ],
    valid: ([, ...m]) => new Set(m).size === 4 && m.some((x) => x < 100),
    options: () => ["1", "2", "3", "4"],
    solve: ([, ...m]) => String(m.indexOf(Math.min(...m)) + 1),
    ref: ([a = 0, ...m]) => {
      const values = m.map((x) => q(a).div(qd(x, 2)));
      let best = 0;
      values.forEach((v, i) => {
        if (v.cmp(values[best] ?? v) > 0) best = i;
      });
      return String(best + 1);
    },
    traps: [
      [
        "the-largest-divisor",
        "conceptual",
        ([, ...m]) => String(m.indexOf(Math.max(...m)) + 1),
      ],
      [
        "the-divisor-nearest-to-one",
        "conceptual",
        ([, ...m]) => {
          const near = m.reduce(
            (best, x, i) =>
              Math.abs(x - 100) < Math.abs((m[best] ?? 0) - 100) ? i : best,
            0,
          );
          const wrong = String(near + 1);
          return wrong === String(m.indexOf(Math.min(...m)) + 1) ||
            wrong === String(m.indexOf(Math.max(...m)) + 1)
            ? null
            : wrong;
        },
      ],
    ],
    extra: ([a = 0, ...m]) => {
      const least = Math.min(...m);
      return {
        f1: `${a} : ${dec(m[0] ?? 0, 2, true)}`,
        f2: `${a} : ${dec(m[1] ?? 0, 2, true)}`,
        f3: `${a} : ${dec(m[2] ?? 0, 2, true)}`,
        f4: `${a} : ${dec(m[3] ?? 0, 2, true)}`,
        list: m.map((x) => dec(x, 2, true)).join("; "),
        mn: dec(least, 2, true),
        big: writeValue(q(a).div(qd(least, 2))),
      };
    },
    consts: [1, 2, 3, 4],
  }),
  d5({
    id: "D5.divide.15",
    form: "whole-pieces-cut-from-a-decimal-length",
    groups: [7, 8],
    kind: "integer",
    draw: (r) => {
      const y = between(r, 2, 9);
      return [y, between(r, 3, 9), between(r, 1, y - 1)];
    },
    solve: ([, n = 0]) => q(n),
    ref: ([y = 0, n = 0, rem = 0]) => q(Math.floor((n * y + rem) / y)),
    traps: [
      ["rounded-up", "conceptual", ([, n = 0]) => q(n + 1)],
      [
        "remainder-counted",
        "conceptual",
        ([, n = 0, rem = 0]) => (rem === n || rem === n + 1 ? null : q(rem)),
      ],
    ],
    roles: {
      a: "length of a piece in tenths of a metre",
      b: "whole pieces",
      c: "leftover in tenths of a metre",
    },
    extra: ([y = 0, n = 0, rem = 0]) => ({
      x: dec(n * y + rem, 1, true),
      y: dec(y, 1),
      X: String(n * y + rem),
      Y: String(y),
      rem: String(rem),
    }),
  }),
  d5({
    id: "D5.divide.16",
    form: "boxes-needed-for-a-decimal-weight",
    groups: [7, 8],
    kind: "integer",
    draw: (r) => {
      const y = between(r, 2, 9);
      return [y, between(r, 3, 9), between(r, 1, y - 1)];
    },
    solve: ([, n = 0]) => q(n + 1),
    ref: ([y = 0, n = 0, rem = 0]) => q(Math.ceil((n * y + rem) / y)),
    traps: [
      ["rounded-down", "conceptual", ([, n = 0]) => q(n)],
      [
        "remainder-counted",
        "conceptual",
        ([, n = 0, rem = 0]) => (rem === n || rem === n + 1 ? null : q(rem)),
      ],
    ],
    roles: {
      a: "weight in one box in tenths of a kilogram",
      b: "full boxes",
      c: "leftover in tenths of a kilogram",
    },
    extra: ([y = 0, n = 0, rem = 0]) => ({
      x: dec(n * y + rem, 1, true),
      y: dec(y, 1),
      X: String(n * y + rem),
      Y: String(y),
      n: String(n),
    }),
  }),
  d5({
    id: "D5.divide.17",
    form: "the-smallest-n-with-a-unit-fraction-below-a-bound",
    groups: [7, 8],
    origin: {
      olympiad:
        "inequality reasoning with a unit fraction, MCCME school stage style (RES-4282)",
    },
    kind: "integer",
    draw: (r) => [pick(r, [2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25])],
    solve: ([k = 0]) => q(Math.floor(100 / k) + 1),
    ref: ([k = 0]) => {
      let n = 1;
      while (q(1, n).cmp(qd(k, 2)) >= 0) n += 1;
      return q(n);
    },
    traps: [
      [
        "boundary-itself",
        "conceptual",
        ([k = 0]) => (100 % k === 0 ? q(100 / k) : null),
      ],
      [
        "cut-off",
        "procedural",
        ([k = 0]) => (100 % k === 0 ? null : q(Math.floor(100 / k))),
      ],
      [
        "rounded",
        "procedural",
        ([k = 0]) =>
          100 % k === 0 || Math.round(100 / k) === Math.floor(100 / k) + 1
            ? null
            : q(Math.round(100 / k)),
      ],
    ],
    extra: ([k = 0]) => ({
      t: dec(k, 2, true),
      fl: String(Math.floor(100 / k)),
    }),
    consts: [1],
  }),
  d5({
    id: "D5.divide.18",
    form: "the-dividend-from-the-quotient-and-a-small-divisor",
    groups: [7, 8],
    kind: "decimal",
    draw: (r) => {
      const [h = 0, places = 0] = pick(r, SMALL_DIVISORS);
      return [between(r, 6, 60), h, places];
    },
    valid: ([a = 0]) => a % 10 !== 0,
    solve: ([a = 0, h = 0, places = 0]) => qd(a * h, places),
    ref: ([a = 0, h = 0, places = 0]) => q(a).mul(qd(h, places)),
    traps: [
      [
        "divided-instead",
        "conceptual",
        ([a = 0, h = 0, places = 0]) => q(a).div(qd(h, places)),
      ],
      [
        "comma-in-the-wrong-place",
        "procedural",
        ([a = 0, h = 0, places = 0]) => qd(a * h, places + 1),
      ],
    ],
    extra: ([, h = 0, places = 0]) => ({ x: dec(h, places) }),
  }),
];

/** Fractions that have a short decimal: halves, quarters and fifths. */
const SIMPLE_FRACTIONS: readonly (readonly [number, number])[] = [
  [1, 2],
  [1, 4],
  [3, 4],
  [1, 5],
  [2, 5],
  [3, 5],
  [4, 5],
];
/** Every order of four items, so that a drawn number can pick one. */
const PERMUTATIONS: readonly (readonly number[])[] = (() => {
  const out: number[][] = [];
  const build = (rest: number[], done: number[]): void => {
    if (rest.length === 0) out.push(done);
    else
      rest.forEach((x, i) =>
        build([...rest.slice(0, i), ...rest.slice(i + 1)], [...done, x]),
      );
  };
  build([0, 1, 2, 3], []);
  return out;
})();
/** The four wrong ways to write a fraction as a decimal: digits side by side, the numerator or the denominator alone, a comma for the slash. */
const WRONG_READINGS = (n: number, d: number): readonly string[] => [
  `0,${n}${d}`,
  `0,${n}`,
  `0,${d}`,
  `${n},${d}`,
];
/** The options of "which number equals the fraction": the right one among three of the wrong readings, with the tag of each. */
function arrange(
  n: number,
  d: number,
  skip: number,
  pos: number,
): { text: string; tag: string }[] {
  const wrong = WRONG_READINGS(n, d)
    .map((text, i) => ({ text, tag: `w${i}` }))
    .filter((_, i) => i !== skip);
  const list = [...wrong];
  list.splice(pos, 0, { text: dec((100 * n) / d, 2, true), tag: "right" });
  return list;
}
/** The fractions that equal a decimal in hundredths: the decimal, then the reduced numerator and denominator. */
const EQUAL_PAIRS: readonly (readonly [number, number, number])[] = [
  [25, 1, 4],
  [75, 3, 4],
  [20, 1, 5],
  [40, 2, 5],
  [60, 3, 5],
  [80, 4, 5],
  [50, 1, 2],
  [5, 1, 20],
];
/** Whether the denominator of a fraction in lowest terms has no prime factor but 2 and 5. */
const finiteDecimal = (d: number): boolean => {
  let x = d;
  while (x % 2 === 0) x /= 2;
  while (x % 5 === 0) x /= 5;
  return x === 1;
};
/** Fractions in lowest terms with a finite decimal, and with a repeating one. */
const FINITE_FRACTIONS: readonly (readonly [number, number])[] = [
  [1, 2],
  [3, 4],
  [3, 8],
  [7, 20],
  [9, 25],
  [5, 8],
  [7, 16],
  [3, 40],
  [1, 5],
  [11, 50],
];
const REPEATING_FRACTIONS: readonly (readonly [number, number])[] = [
  [1, 3],
  [1, 6],
  [5, 6],
  [1, 7],
  [2, 9],
  [5, 12],
  [1, 11],
  [4, 15],
  [7, 30],
  [3, 14],
];
/** Fractions with no short factor in the denominator and the length of the period of their decimal. */
const PERIODIC: readonly (readonly [number, number, number])[] = [
  [1, 7, 6],
  [2, 7, 6],
  [3, 7, 6],
  [4, 7, 6],
  [5, 7, 6],
  [6, 7, 6],
  [1, 11, 2],
  [3, 11, 2],
  [5, 11, 2],
  [7, 11, 2],
  [1, 13, 6],
  [2, 13, 6],
  [1, 37, 3],
  [2, 37, 3],
];
/** The digit at place `k` after the comma of `n / d`, by long division. */
function digitAt(n: number, d: number, k: number): number {
  let rest = n % d;
  let digit = 0;
  for (let i = 1; i <= k; i += 1) {
    rest *= 10;
    digit = Math.floor(rest / d);
    rest %= d;
  }
  return digit;
}
/** Fractions of the "largest of four" task with their value in thousandths; some are decimals, some are fractions. */
const MIXED_FRACTIONS: readonly (readonly [number, number, number])[] = [
  [1, 2, 500],
  [1, 4, 250],
  [3, 4, 750],
  [1, 5, 200],
  [2, 5, 400],
  [3, 5, 600],
  [4, 5, 800],
  [1, 8, 125],
  [3, 8, 375],
  [5, 8, 625],
  [7, 8, 875],
  [7, 20, 350],
  [9, 20, 450],
  [11, 20, 550],
  [13, 20, 650],
];
/** All the fractions of the finite-decimal task, finite ones first. */
const FRACTIONS_ALL = [...FINITE_FRACTIONS, ...REPEATING_FRACTIONS];
/** The four numbers of the "largest" task in the order a drawn permutation gives, with the readings a child might use. */
function mixedItems(v: number[]): {
  text: string;
  value: number;
  digits: number;
  tenths: number;
}[] {
  const [f1 = 0, f2 = 0, g1 = 0, g2 = 0, perm = 0] = v;
  const a = MIXED_FRACTIONS[f1] ?? [1, 2, 500];
  const b = MIXED_FRACTIONS[f2] ?? [1, 2, 500];
  const x = MIXED_DECIMALS[g1] ?? 0;
  const y = MIXED_DECIMALS[g2] ?? 0;
  const base = [
    {
      text: fr(a[0], a[1]),
      value: a[2],
      digits: Number(`0.${a[0]}${a[1]}`) * 1000,
      tenths: a[0] * 100,
    },
    {
      text: fr(b[0], b[1]),
      value: b[2],
      digits: Number(`0.${b[0]}${b[1]}`) * 1000,
      tenths: b[0] * 100,
    },
    { text: dec(x, 3, true), value: x, digits: x, tenths: x },
    { text: dec(y, 3, true), value: y, digits: y, tenths: y },
  ];
  const order = PERMUTATIONS[perm] ?? [0, 1, 2, 3];
  return order.map(
    (i) => base[i] ?? base[0] ?? { text: "", value: 0, digits: 0, tenths: 0 },
  );
}
const MIXED_DECIMALS: readonly number[] = [
  150, 280, 300, 380, 420, 480, 520, 580, 620, 680, 700, 720, 780, 820, 850,
  880, 900,
];

const d6 = forFraction("D6", "convert");
const FRACTION_DEN = [2, 4, 5, 10];
const convert = [
  d6({
    id: "D6.convert.01",
    form: "a-common-fraction-as-a-decimal",
    groups: [7, 8],
    kind: "decimal",
    draw: (r) => [between(r, 1, 9), pick(r, FRACTION_DEN)],
    valid: ([n = 0, d = 0]) => n < d,
    solve: ([n = 0, d = 0]) => q(n, d),
    ref: ([n = 0, d = 0]) => qd((100 * n) / d, 2),
    traps: [
      ["numerator-tenths", "conceptual", ([n = 0]) => qd(n, 1)],
      [
        "denominator-as-decimal",
        "conceptual",
        ([, d = 0]) => Q.fromDecimal(`0,${d}`),
      ],
      [
        "digits-side-by-side",
        "conceptual",
        ([n = 0, d = 0]) => Q.fromDecimal(`0,${n}${d}`),
      ],
    ],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
  }),
  d6({
    id: "D6.convert.02",
    form: "hundredths-written-as-a-decimal",
    groups: [7, 8],
    kind: "decimal",
    draw: (r) => [between(r, 1, 9)],
    solve: ([n = 0]) => qd(n, 2),
    ref: ([n = 0]) => Q.fromDecimal(`0,0${n}`),
    traps: [
      ["whole", "conceptual", ([n = 0]) => q(n)],
      ["thousandths", "procedural", ([n = 0]) => qd(n, 3)],
      ["tenths", "conceptual", ([n = 0]) => qd(n, 1)],
    ],
    extra: ([n = 0]) => ({ f: fr(n, 100) }),
    consts: [100],
  }),
  d6({
    id: "D6.convert.03",
    form: "a-tenths-decimal-as-a-fraction",
    groups: [7, 8],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [between(r, 1, 9)],
    solve: ([t = 0]) => qd(t, 1),
    // Read the digit after the comma as the numerator of tenths, by text.
    ref: ([t = 0]) => Q.fromDecimal(`0,${t}`),
    traps: [
      ["hundredths-denominator", "procedural", ([t = 0]) => q(t, 100)],
      ["inverted", "conceptual", ([t = 0]) => q(10, t)],
      ["reciprocal", "conceptual", ([t = 0]) => q(1, t)],
    ],
    extra: ([t = 0]) => ({ x: dec(t, 1) }),
    consts: [10],
  }),
  d6({
    id: "D6.convert.04",
    form: "hundredths-decimal-as-a-fraction-in-lowest-terms",
    groups: [7, 8],
    kind: "fraction",
    rule: "simplest",
    draw: (r) => [pick(r, [25, 75, 20, 40, 60, 80, 12, 16, 24, 36])],
    solve: ([h = 0]) => qd(h, 2),
    ref: ([h = 0]) => Q.fromDecimal(`0,${String(h).padStart(2, "0")}`),
    traps: [
      ["tenths-denominator", "procedural", ([h = 0]) => q(h, 10)],
      ["inverted", "conceptual", ([h = 0]) => q(100, h)],
      ["reciprocal", "conceptual", ([h = 0]) => q(1, h)],
    ],
    extra: ([h = 0]) => ({ x: dec(h, 2) }),
    consts: [100],
  }),
  d6({
    id: "D6.convert.05",
    form: "a-decimal-as-a-mixed-number",
    groups: [7, 8],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => [between(r, 1, 9), between(r, 1, 9)],
    valid: ([, t = 0]) => t !== 5,
    solve: ([w = 0, t = 0]) => qd(10 * w + t, 1),
    ref: ([w = 0, t = 0]) => q(w).add(q(t, 10)),
    traps: [
      [
        "digit-as-denominator",
        "conceptual",
        ([w = 0, t = 0]) => q(w).add(q(1, t)),
      ],
      [
        "wrong-denominator",
        "procedural",
        ([w = 0, t = 0]) => q(w).add(q(t, 100)),
      ],
      ["sum-over-ten", "conceptual", ([w = 0, t = 0]) => q(w + t, 10)],
    ],
    extra: ([w = 0, t = 0]) => ({ x: dec(10 * w + t, 1) }),
  }),
  d6({
    id: "D6.convert.06",
    form: "a-fraction-of-a-euro-in-cents",
    groups: [7, 8],
    roles: { a: "numerator", b: "denominator" },
    kind: "integer",
    draw: (r) => [between(r, 1, 3), pick(r, [4, 5, 10])],
    valid: ([n = 0, d = 0]) => n < d,
    solve: ([n = 0, d = 0]) => q((100 * n) / d),
    ref: ([n = 0, d = 0]) => q(n, d).mul(q(100)),
    traps: [
      ["denominator-itself", "conceptual", ([, d = 0]) => q(d)],
      ["one-part", "conceptual", ([, d = 0]) => (d === 10 ? null : q(100 / d))],
      ["numerator-itself", "conceptual", ([n = 0]) => q(n)],
    ],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
    consts: [100],
  }),
  d6({
    id: "D6.convert.07",
    form: "a-tenths-decimal-as-a-fraction-in-lowest-terms",
    groups: [7, 8],
    kind: "fraction",
    rule: "simplest",
    draw: (r) => [pick(r, [2, 4, 5, 6, 8, 1, 3, 7, 9])],
    solve: ([t = 0]) => qd(t, 1),
    ref: ([t = 0]) => Q.fromDecimal(`0,${t}`),
    traps: [
      ["hundredths-denominator", "procedural", ([t = 0]) => q(t, 100)],
      ["inverted", "conceptual", ([t = 0]) => q(10, t)],
      ["reciprocal", "conceptual", ([t = 0]) => q(1, t)],
    ],
    extra: ([t = 0]) => ({ x: dec(t, 1) }),
    consts: [10],
  }),
  d6({
    id: "D6.convert.08",
    form: "hundredths-of-a-fraction-written-as-a-decimal",
    groups: [7, 8],
    kind: "decimal",
    draw: (r) => [between(r, 11, 99)],
    valid: ([h = 0]) => h % 10 !== 0,
    solve: ([h = 0]) => qd(h, 2),
    ref: ([h = 0]) => Q.fromDecimal(`0,${String(h).padStart(2, "0")}`),
    traps: [
      ["whole", "conceptual", ([h = 0]) => q(h)],
      ["thousandths", "procedural", ([h = 0]) => qd(h, 3)],
      ["tenths", "conceptual", ([h = 0]) => qd(h, 1)],
    ],
    extra: ([h = 0]) => ({ f: fr(h, 100) }),
    consts: [100],
  }),
  d6({
    id: "D6.convert.09",
    form: "compare-a-fraction-with-a-decimal",
    groups: [7, 8],
    kind: "compare",
    draw: (r) => {
      const [n = 1, d = 2] = pick(r, SIMPLE_FRACTIONS);
      return [n, d, Math.round((100 * n) / d) + between(r, -9, 9)];
    },
    solve: ([n = 0, d = 0, h = 0]) => sign(q(n, d), qd(h, 2)),
    ref: ([n = 0, d = 0, h = 0]) =>
      n * 100 > h * d ? ">" : n * 100 < h * d ? "<" : "=",
    traps: [
      [
        "digits-side-by-side",
        "conceptual",
        ([n = 0, d = 0, h = 0]) => {
          const wrong = sign(Q.fromDecimal(`0,${n}${d}`), qd(h, 2));
          return wrong === sign(q(n, d), qd(h, 2)) ? null : wrong;
        },
      ],
      [
        "flipped",
        "conceptual",
        ([n = 0, d = 0, h = 0]) => {
          const right = sign(q(n, d), qd(h, 2));
          const wrong = right === ">" ? "<" : right === "<" ? ">" : null;
          return wrong === sign(Q.fromDecimal(`0,${n}${d}`), qd(h, 2))
            ? null
            : wrong;
        },
      ],
    ],
    extra: ([n = 0, d = 0, h = 0]) => ({
      f: fr(n, d),
      x: dec(h, 2, true),
      sign: sign(q(n, d), qd(h, 2)),
    }),
  }),
  d6({
    id: "D6.convert.10",
    form: "a-mixed-number-as-a-decimal",
    groups: [7, 8],
    kind: "decimal",
    draw: (r) => [between(r, 1, 9), pick(r, [1, 3]), pick(r, [4, 5])],
    valid: ([, n = 0, d = 0]) => n < d,
    solve: ([w = 0, n = 0, d = 0]) => q(w).add(q(n, d)),
    ref: ([w = 0, n = 0, d = 0]) => qd(100 * w + (100 * n) / d, 2),
    traps: [
      [
        "numerator-only",
        "conceptual",
        ([w = 0, n = 0]) => Q.fromDecimal(`${w},${n}`),
      ],
      [
        "denominator-only",
        "conceptual",
        ([w = 0, , d = 0]) => Q.fromDecimal(`${w},${d}`),
      ],
      [
        "digits-side-by-side",
        "conceptual",
        ([w = 0, n = 0, d = 0]) => Q.fromDecimal(`${w},${n}${d}`),
      ],
    ],
    extra: ([w = 0, n = 0, d = 0]) => ({ m: `${w} ${fr(n, d)}` }),
  }),
  d6({
    id: "D6.convert.11",
    form: "hundredths-decimal-as-a-fraction-with-hundred",
    groups: [7, 8],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [pick(r, [3, 7, 9, 11, 13, 17, 19, 21, 23, 27])],
    solve: ([h = 0]) => qd(h, 2),
    ref: ([h = 0]) => Q.fromDecimal(`0,${String(h).padStart(2, "0")}`),
    traps: [
      ["reciprocal", "conceptual", ([h = 0]) => q(1, h)],
      ["thousandths", "procedural", ([h = 0]) => q(h, 1000)],
      ["tenths", "conceptual", ([h = 0]) => q(h, 10)],
    ],
    extra: ([h = 0]) => ({ x: dec(h, 2) }),
    consts: [10, 100],
  }),
  d6({
    id: "D6.convert.12",
    form: "choose-the-decimal-equal-to-a-fraction",
    groups: [7, 8],
    kind: "choice",
    draw: (r) => {
      const [n = 1, d = 2] = pick(r, SIMPLE_FRACTIONS);
      return [n, d, r.int(4), r.int(4)];
    },
    options: () => ["1", "2", "3", "4"],
    solve: ([n = 0, d = 0, skip = 0, pos = 0]) =>
      String(arrange(n, d, skip, pos).findIndex((o) => o.tag === "right") + 1),
    ref: ([n = 0, d = 0, skip = 0, pos = 0]) =>
      String(
        arrange(n, d, skip, pos).findIndex(
          (o) => Q.fromDecimal(o.text).eq(q(n, d)) && !o.tag.startsWith("w"),
        ) + 1,
      ),
    traps: [
      "digits-side-by-side",
      "numerator-as-tenths",
      "denominator-as-tenths",
      "comma-instead-of-the-slash",
    ].map(
      (id, kind) =>
        [
          id,
          "conceptual",
          ([n = 0, d = 0, skip = 0, pos = 0]: number[]) => {
            const at = arrange(n, d, skip, pos).findIndex(
              (o) => o.tag === `w${kind}`,
            );
            return at < 0 ? null : String(at + 1);
          },
        ] as const,
    ),
    extra: ([n = 0, d = 0, skip = 0, pos = 0]) => {
      const list = arrange(n, d, skip, pos);
      return {
        f: fr(n, d),
        x: dec((100 * n) / d, 2, true),
        o1: list[0]?.text ?? "",
        o2: list[1]?.text ?? "",
        o3: list[2]?.text ?? "",
        o4: list[3]?.text ?? "",
      };
    },
    consts: [1, 2, 3, 4],
  }),
  d6({
    id: "D6.convert.13",
    form: "select-every-fraction-equal-to-a-decimal",
    groups: [7, 8],
    kind: "set",
    draw: (r) => [r.int(EQUAL_PAIRS.length), r.int(PERMUTATIONS.length)],
    options: () => ["1", "2", "3", "4"],
    solve: ([i = 0, k = 0]) => {
      const order = PERMUTATIONS[k] ?? [];
      return ["1", "2", "3", "4"].filter(
        (_, at) => (order[at] ?? 9) < 2 && i >= 0,
      );
    },
    ref: ([i = 0, k = 0]) => {
      const [h = 0, n = 0, d = 0] = EQUAL_PAIRS[i] ?? [];
      const order = PERMUTATIONS[k] ?? [];
      const texts = [fr(n, d), fr(h, 100), fr(d, n), fr(h, 10)];
      return ["1", "2", "3", "4"].filter((_, at) => {
        const [a = 0, b = 1] = (texts[order[at] ?? 0] ?? "0⁄1")
          .split("⁄")
          .map(Number);
        return a * 100 === h * b;
      });
    },
    traps: [
      [
        "only-the-reduced-one",
        "conceptual",
        ([, k = 0]) => {
          const order = PERMUTATIONS[k] ?? [];
          return [String(order.indexOf(0) + 1)];
        },
      ],
      [
        "also-the-inverse",
        "conceptual",
        ([, k = 0]) => {
          const order = PERMUTATIONS[k] ?? [];
          return [0, 1, 2]
            .map((m) => order.indexOf(m) + 1)
            .sort((x, y) => x - y)
            .map(String);
        },
      ],
    ],
    extra: ([i = 0, k = 0]) => {
      const [h = 0, n = 0, d = 0] = EQUAL_PAIRS[i] ?? [];
      const order = PERMUTATIONS[k] ?? [];
      const texts = [fr(n, d), fr(h, 100), fr(d, n), fr(h, 10)];
      return {
        h: String(h),
        x: dec(h, 2, true),
        red: fr(n, d),
        o1: texts[order[0] ?? 0] ?? "",
        o2: texts[order[1] ?? 0] ?? "",
        o3: texts[order[2] ?? 0] ?? "",
        o4: texts[order[3] ?? 0] ?? "",
      };
    },
    consts: [1, 2, 3, 4],
  }),
  d6({
    id: "D6.convert.14",
    form: "read-a-fraction-of-a-segment-as-a-decimal",
    groups: [7, 8],
    kind: "decimal",
    draw: (r) => {
      const d = pick(r, [4, 5, 10, 20]);
      return [between(r, 1, d - 1), d];
    },
    solve: ([n = 0, d = 0]) => q(n, d),
    ref: ([n = 0, d = 0]) => qd((100 * n) / d, 2),
    traps: [
      [
        "digits-side-by-side",
        "conceptual",
        ([n = 0, d = 0]) => Q.fromDecimal(`0,${n}${d}`),
      ],
      [
        "numerator-tenths",
        "conceptual",
        ([n = 0, d = 0]) =>
          n > 9 || d === 10 ? null : Q.fromDecimal(`0,${n}`),
      ],
      [
        "counted-from-the-right",
        "procedural",
        ([n = 0, d = 0]) => (2 * n === d ? null : q(d - n, d)),
      ],
    ],
  }),
  d6({
    id: "D6.convert.15",
    form: "the-numerator-from-the-sum-and-the-decimal",
    groups: [7, 8],
    origin: {
      olympiad:
        "recovering a fraction from a ratio and a total, MCCME school stage style (RES-4282)",
    },
    kind: "integer",
    draw: (r) => {
      const [n = 1, m = 2] = pick(r, SIMPLE_FRACTIONS);
      return [n, m, between(r, 2, 9)];
    },
    solve: ([n = 0, , k = 0]) => q(n * k),
    ref: ([n = 0, m = 0, k = 0]) => q(k * (n + m)).mul(q(n, n + m)),
    traps: [
      ["reduced-numerator", "procedural", ([n = 0]) => q(n)],
      ["the-denominator", "conceptual", ([, m = 0, k = 0]) => q(m * k)],
    ],
    extra: ([n = 0, m = 0, k = 0]) => ({
      n: String(n),
      m: String(m),
      s: String(k * (n + m)),
      x: dec((100 * n) / m, 2, true),
    }),
  }),
];

const d6s = forFraction("D6", "convert-1S");
const EIGHTHS = [1, 3, 5, 7];
const convertS = [
  d6s({
    id: "D6.convert-1S.01",
    form: "eighths-as-a-decimal",
    groups: [8, 8],
    kind: "decimal",
    draw: (r) => [between(r, 1, 15)],
    valid: ([n = 0]) => n % 8 !== 0,
    solve: ([n = 0]) => q(n, 8),
    ref: ([n = 0]) => qd(125 * n, 3),
    traps: [
      ["numerator-tenths", "conceptual", ([n = 0]) => qd(n, 1)],
      ["denominator-as-decimal", "conceptual", ([]) => qd(8, 1)],
      [
        "digits-side-by-side",
        "conceptual",
        ([n = 0]) => Q.fromDecimal(`0,${n}8`),
      ],
    ],
    extra: ([n = 0]) => ({ f: fr(n, 8) }),
  }),
  d6s({
    id: "D6.convert-1S.02",
    form: "a-hundredths-decimal-as-a-fraction-over-fifty",
    groups: [8, 8],
    kind: "fraction",
    rule: "simplest",
    draw: (r) => [pick(r, [22, 26, 34, 38, 42, 46, 14, 18])],
    solve: ([h = 0]) => qd(h, 2),
    ref: ([h = 0]) => Q.fromDecimal(`0,${String(h).padStart(2, "0")}`),
    traps: [
      ["denominator-halved", "procedural", ([h = 0]) => q(h, 50)],
      ["numerator-halved-only", "procedural", ([h = 0]) => q(h / 2, 100)],
      ["reciprocal", "conceptual", ([h = 0]) => q(1, h)],
    ],
    extra: ([h = 0]) => ({ x: dec(h, 2) }),
    consts: [100],
  }),
  d6s({
    id: "D6.convert-1S.03",
    form: "a-repeating-fraction-rounded-to-hundredths",
    groups: [8, 8],
    kind: "decimal",
    draw: (r) => {
      const d = pick(r, [3, 6, 7, 9, 11]);
      return [between(r, 1, d - 1), d];
    },
    valid: ([n = 0, d = 0]) => roundHundredths(n, d) !== cutHundredths(n, d),
    solve: ([n = 0, d = 0]) => qd(roundHundredths(n, d), 2),
    ref: ([n = 0, d = 0]) => qd(Math.round((100 * n) / d + 1e-9), 2),
    traps: [
      [
        "tenths",
        "procedural",
        ([n = 0, d = 0]) => qd(Math.round((10 * n) / d), 1),
      ],
      [
        "digits-side-by-side",
        "conceptual",
        ([n = 0, d = 0]) => Q.fromDecimal(`0,${n}${d}`),
      ],
      ["cut-off", "procedural", ([n = 0, d = 0]) => qd(cutHundredths(n, d), 2)],
    ],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
  }),
  d6s({
    id: "D6.convert-1S.04",
    form: "order-a-fraction-and-two-decimals",
    groups: [8, 8],
    kind: "order",
    draw: (r) => [pick(r, [3, 1]), 4, between(r, 5, 8), between(r, 5, 9)],
    valid: ([n = 0, d = 0, t = 0, u = 0]) =>
      new Set([n / d, t / 10, u / 10]).size === 3,
    solve: ([n = 0, d = 0, t = 0, u = 0]) =>
      [n / d, t / 10, u / 10]
        .map((x, i) => [x, i] as const)
        .sort((a, b) => a[0] - b[0])
        .map(([, i]) => String(i + 1)),
    ref: ([n = 0, d = 0, t = 0, u = 0]) => {
      const v = [(100 * n) / d, 10 * t, 10 * u];
      return ["1", "2", "3"].sort(
        (x, y) => (v[Number(x) - 1] ?? 0) - (v[Number(y) - 1] ?? 0),
      );
    },
    traps: [
      [
        "fraction-last",
        "conceptual",
        ([n = 0, d = 0, t = 0, u = 0]) =>
          [n + d / 10, t / 10, u / 10]
            .map((x, i) => [x, i] as const)
            .sort((a, b) => a[0] - b[0])
            .map(([, i]) => String(i + 1)),
      ],
      [
        "largest-first",
        "conceptual",
        ([n = 0, d = 0, t = 0, u = 0]) =>
          [n / d, t / 10, u / 10]
            .map((x, i) => [x, i] as const)
            .sort((a, b) => b[0] - a[0])
            .map(([, i]) => String(i + 1)),
      ],
    ],
    extra: ([n = 0, d = 0, t = 0, u = 0]) => ({
      list: [fr(n, d), dec(t, 1), dec(u, 1)].join("; "),
      sorted: [
        [n / d, fr(n, d)],
        [t / 10, dec(t, 1)],
        [u / 10, dec(u, 1)],
      ]
        .sort((a, b) => (a[0] as number) - (b[0] as number))
        .map((x) => x[1])
        .join(" < "),
    }),
  }),
  d6s({
    id: "D6.convert-1S.05",
    form: "compare-eighths-with-a-decimal",
    groups: [8, 8],
    kind: "compare",
    draw: (r) => [pick(r, EIGHTHS), between(r, 3, 9)],
    valid: ([n = 0, t = 0]) => sign(q(n, 8), qd(t, 1)) !== "=",
    solve: ([n = 0, t = 0]) => sign(q(n, 8), qd(t, 1)),
    ref: ([n = 0, t = 0]) =>
      10 * n > 8 * t ? ">" : 10 * n < 8 * t ? "<" : "=",
    traps: [
      [
        "digits-side-by-side",
        "conceptual",
        ([n = 0, t = 0]) => (10 * n < 8 * t ? ">" : null),
      ],
      [
        "flipped",
        "conceptual",
        ([n = 0, t = 0]) => (10 * n > 8 * t ? "<" : null),
      ],
    ],
    extra: ([n = 0, t = 0]) => ({
      f: fr(n, 8),
      x: dec(t, 1),
      sign: sign(q(n, 8), qd(t, 1)),
    }),
  }),
  d6s({
    id: "D6.convert-1S.06",
    form: "a-quarter-plus-a-decimal",
    groups: [8, 8],
    kind: "decimal",
    draw: (r) => [pick(r, [1, 3]), between(r, 1, 6)],
    valid: ([n = 0, t = 0]) => (25 * n + 10 * t) % 100 !== 0,
    solve: ([n = 0, t = 0]) => qd(25 * n + 10 * t, 2),
    ref: ([n = 0, t = 0]) => q(n, 4).add(qd(t, 1)),
    traps: [
      ["numerator-tenths", "conceptual", ([n = 0, t = 0]) => qd(n + t, 1)],
      ["denominator-tenths", "conceptual", ([, t = 0]) => qd(4 + t, 1)],
      [
        "digits-side-by-side",
        "conceptual",
        ([n = 0, t = 0]) => Q.fromDecimal(`0,${n}${t}`),
      ],
    ],
    extra: ([n = 0, t = 0]) => ({ f: fr(n, 4), x: dec(t, 1) }),
  }),
  d6s({
    id: "D6.convert-1S.07",
    form: "a-mixed-number-with-eighths-as-a-decimal",
    groups: [8, 8],
    kind: "decimal",
    draw: (r) => [between(r, 1, 6), pick(r, EIGHTHS)],
    solve: ([w = 0, n = 0]) => q(w).add(q(n, 8)),
    ref: ([w = 0, n = 0]) => qd(1000 * w + 125 * n, 3),
    traps: [
      [
        "numerator-only",
        "conceptual",
        ([w = 0, n = 0]) => Q.fromDecimal(`${w},${n}`),
      ],
      ["denominator-only", "conceptual", ([w = 0]) => Q.fromDecimal(`${w},8`)],
      [
        "digits-side-by-side",
        "conceptual",
        ([w = 0, n = 0]) => Q.fromDecimal(`${w},${n}8`),
      ],
    ],
    extra: ([w = 0, n = 0]) => ({ m: `${w} ${fr(n, 8)}` }),
  }),
  d6s({
    id: "D6.convert-1S.08",
    form: "a-three-place-decimal-as-a-fraction",
    groups: [8, 8],
    kind: "fraction",
    rule: "simplest",
    draw: (r) => [pick(r, [125, 375, 625, 875, 25, 75, 175, 225])],
    solve: ([h = 0]) => qd(h, 3),
    ref: ([h = 0]) => Q.fromDecimal(`0,${String(h).padStart(3, "0")}`),
    traps: [
      ["hundredths-denominator", "procedural", ([h = 0]) => q(h, 100)],
      ["inverted", "conceptual", ([h = 0]) => q(1000, h)],
      ["reciprocal", "conceptual", ([h = 0]) => q(1, h)],
    ],
    extra: ([h = 0]) => ({ x: dec(h, 3) }),
    consts: [1000],
  }),
  d6s({
    id: "D6.convert-1S.09",
    form: "a-small-hundredths-decimal-as-a-fraction",
    groups: [8, 8],
    kind: "fraction",
    rule: "simplest",
    draw: (r) => [pick(r, [4, 8, 12, 16, 24, 28, 36, 44])],
    solve: ([h = 0]) => qd(h, 2),
    ref: ([h = 0]) => Q.fromDecimal(`0,${String(h).padStart(2, "0")}`),
    traps: [
      ["reciprocal", "conceptual", ([h = 0]) => q(1, h)],
      ["inverted", "conceptual", ([h = 0]) => q(100, h)],
      ["tenths", "conceptual", ([h = 0]) => q(h, 10)],
    ],
    extra: ([h = 0]) => ({ x: dec(h, 2) }),
    consts: [10, 100],
  }),
  d6s({
    id: "D6.convert-1S.10",
    form: "compare-twentieths-with-a-decimal",
    groups: [8, 8],
    kind: "compare",
    draw: (r) => [between(r, 5, 9), between(r, 30, 45)],
    valid: ([n = 0, h = 0]) => sign(q(n, 20), qd(h, 2)) !== "=",
    solve: ([n = 0, h = 0]) => sign(q(n, 20), qd(h, 2)),
    ref: ([n = 0, h = 0]) =>
      n * 100 > h * 20 ? ">" : n * 100 < h * 20 ? "<" : "=",
    traps: [
      [
        "digits-side-by-side",
        "conceptual",
        ([n = 0, h = 0]) => (n * 100 < h * 20 ? ">" : null),
      ],
      [
        "flipped",
        "conceptual",
        ([n = 0, h = 0]) => (n * 100 > h * 20 ? "<" : null),
      ],
    ],
    extra: ([n = 0, h = 0]) => ({
      f: fr(n, 20),
      x: dec(h, 2),
      sign: sign(q(n, 20), qd(h, 2)),
    }),
  }),
  d6s({
    id: "D6.convert-1S.11",
    form: "a-fifth-plus-a-decimal",
    groups: [8, 8],
    kind: "decimal",
    draw: (r) => [between(r, 1, 4), between(r, 11, 49)],
    valid: ([, h = 0]) => h % 10 !== 0,
    solve: ([n = 0, h = 0]) => qd(20 * n + h, 2),
    ref: ([n = 0, h = 0]) => q(n, 5).add(qd(h, 2)),
    traps: [
      ["numerator-tenths", "conceptual", ([n = 0, h = 0]) => qd(10 * n + h, 2)],
      ["denominator-tenths", "conceptual", ([, h = 0]) => qd(50 + h, 2)],
      ["digits-side-by-side", "conceptual", ([n = 0, h = 0]) => qd(n + h, 2)],
    ],
    extra: ([n = 0, h = 0]) => ({ f: fr(n, 5), x: dec(h, 2) }),
  }),
  d6s({
    id: "D6.convert-1S.12",
    form: "eighths-of-a-euro-in-cents",
    groups: [8, 8],
    roles: { a: "numerator over eight" },
    kind: "decimal",
    draw: (r) => [between(r, 1, 7)],
    solve: ([n = 0]) => qd(125 * n, 1),
    ref: ([n = 0]) => q(n, 8).mul(q(100)),
    traps: [
      ["denominator-itself", "conceptual", ([]) => q(8)],
      ["one-part", "conceptual", ([]) => qd(125, 1)],
      ["comma-in-the-wrong-place", "procedural", ([n = 0]) => q(125 * n)],
      ["numerator-itself", "conceptual", ([n = 0]) => q(n)],
    ],
    extra: ([n = 0]) => ({ f: fr(n, 8) }),
    consts: [100],
  }),
  d6s({
    id: "D6.convert-1S.13",
    form: "which-fractions-have-a-finite-decimal",
    groups: [8, 8],
    origin: {
      olympiad:
        "a finite decimal needs a denominator with only the factors 2 and 5 (RES-4282)",
    },
    kind: "set",
    draw: (r) => {
      const finite = between(r, 1, 3);
      const fin = [...FINITE_FRACTIONS.keys()];
      const rep = [...REPEATING_FRACTIONS.keys()].map(
        (i) => i + FINITE_FRACTIONS.length,
      );
      const chosen: number[] = [];
      for (let i = 0; i < finite; i += 1)
        chosen.push(fin.splice(r.int(fin.length), 1)[0] ?? 0);
      for (let i = finite; i < 4; i += 1)
        chosen.push(rep.splice(r.int(rep.length), 1)[0] ?? 0);
      for (let i = 3; i > 0; i -= 1) {
        const j = r.int(i + 1);
        [chosen[i], chosen[j]] = [chosen[j] ?? 0, chosen[i] ?? 0];
      }
      return chosen;
    },
    options: () => ["1", "2", "3", "4"],
    solve: (v) =>
      v.flatMap((i, at) =>
        i < FINITE_FRACTIONS.length ? [String(at + 1)] : [],
      ),
    ref: (v) =>
      ["1", "2", "3", "4"].filter((_, at) => {
        const [, d = 1] = FRACTIONS_ALL[v[at] ?? 0] ?? [];
        return finiteDecimal(d);
      }),
    traps: [
      [
        "even-denominators",
        "conceptual",
        (v) => {
          const wrong = v.flatMap((i, at) =>
            (FRACTIONS_ALL[i]?.[1] ?? 1) % 2 === 0 ? [String(at + 1)] : [],
          );
          const right = v.flatMap((i, at) =>
            i < FINITE_FRACTIONS.length ? [String(at + 1)] : [],
          );
          return wrong.length === 0 || wrong.join() === right.join()
            ? null
            : wrong;
        },
      ],
      [
        "only-two-five-ten",
        "conceptual",
        (v) => {
          const wrong = v.flatMap((i, at) =>
            [2, 5, 10].includes(FRACTIONS_ALL[i]?.[1] ?? 1)
              ? [String(at + 1)]
              : [],
          );
          const right = v.flatMap((i, at) =>
            i < FINITE_FRACTIONS.length ? [String(at + 1)] : [],
          );
          const even = v.flatMap((i, at) =>
            (FRACTIONS_ALL[i]?.[1] ?? 1) % 2 === 0 ? [String(at + 1)] : [],
          );
          return wrong.length === 0 ||
            wrong.join() === right.join() ||
            wrong.join() === even.join()
            ? null
            : wrong;
        },
      ],
    ],
    extra: (v) => {
      const texts = v.map((i) => {
        const [n = 0, d = 0] = FRACTIONS_ALL[i] ?? [];
        return fr(n, d);
      });
      return {
        o1: texts[0] ?? "",
        o2: texts[1] ?? "",
        o3: texts[2] ?? "",
        o4: texts[3] ?? "",
        ok: v
          .flatMap((i, at) => (i < FINITE_FRACTIONS.length ? [texts[at]] : []))
          .join("; "),
        bad: v
          .flatMap((i, at) => (i >= FINITE_FRACTIONS.length ? [texts[at]] : []))
          .join("; "),
      };
    },
    consts: [1, 2, 3, 4],
  }),
  d6s({
    id: "D6.convert-1S.14",
    form: "the-digit-at-a-place-of-a-repeating-decimal",
    groups: [8, 8],
    origin: {
      olympiad:
        "a digit far along a repeating decimal, cyclic remainders, Kangaroo style (RES-4282)",
    },
    kind: "integer",
    draw: (r) => [r.int(PERIODIC.length), between(r, 13, 58)],
    solve: ([i = 0, k = 0]) => {
      const [n = 0, d = 1, p = 1] = PERIODIC[i] ?? [];
      const rem = k % p;
      return q(digitAt(n, d, rem === 0 ? p : rem));
    },
    ref: ([i = 0, k = 0]) => {
      const [n = 0, d = 1] = PERIODIC[i] ?? [];
      return q(digitAt(n, d, k));
    },
    traps: [
      [
        "next-place",
        "procedural",
        ([i = 0, k = 0]) => {
          const [n = 0, d = 1] = PERIODIC[i] ?? [];
          return q(digitAt(n, d, k + 1));
        },
      ],
      [
        "previous-place",
        "procedural",
        ([i = 0, k = 0]) => {
          const [n = 0, d = 1] = PERIODIC[i] ?? [];
          return q(digitAt(n, d, k - 1));
        },
      ],
      [
        "first-digit",
        "conceptual",
        ([i = 0]) => {
          const [n = 0, d = 1] = PERIODIC[i] ?? [];
          return q(digitAt(n, d, 1));
        },
      ],
    ],
    extra: ([i = 0, k = 0]) => {
      const [n = 0, d = 1, p = 1] = PERIODIC[i] ?? [];
      const digitsOf = (len: number): string =>
        Array.from({ length: len }, (_, at) => digitAt(n, d, at + 1)).join("");
      return {
        f: fr(n, d),
        s: `0,${digitsOf(12)}`,
        period: `(${digitsOf(p)})`,
        p: String(p),
        q: String(Math.floor(k / p)),
        rem: String(k % p),
        pos: String(k % p === 0 ? p : k % p),
      };
    },
  }),
  d6s({
    id: "D6.convert-1S.15",
    form: "count-the-unit-fractions-with-a-finite-decimal",
    groups: [8, 8],
    origin: {
      olympiad:
        "counting denominators made of the factors 2 and 5 only, Kangaroo style (RES-4282)",
    },
    kind: "integer",
    draw: (r) => [pick(r, [10, 12, 14, 16, 18, 20, 24, 25])],
    solve: ([top = 0]) =>
      q(
        Array.from({ length: top - 1 }, (_, i) => i + 2).filter(finiteDecimal)
          .length,
      ),
    ref: ([top = 0]) => {
      let count = 0;
      for (let d = 2; d <= top; d += 1) {
        let x = d;
        for (const f of [2, 5]) while (x % f === 0) x /= f;
        if (x === 1) count += 1;
      }
      return q(count);
    },
    traps: [
      [
        "even-denominators",
        "conceptual",
        ([top = 0]) => {
          const wrong = Math.floor(top / 2);
          const right = Array.from({ length: top - 1 }, (_, i) => i + 2).filter(
            finiteDecimal,
          ).length;
          return wrong === right ? null : q(wrong);
        },
      ],
      ["only-two-and-five", "conceptual", () => q(2)],
    ],
    extra: ([top = 0]) => ({
      f1: fr(1, 2),
      f2: fr(1, 3),
      f3: fr(1, 4),
      last: fr(1, top),
      list: Array.from({ length: top - 1 }, (_, i) => i + 2)
        .filter(finiteDecimal)
        .join("; "),
    }),
    consts: [1],
  }),
  d6s({
    id: "D6.convert-1S.16",
    form: "half-way-between-a-fraction-and-a-decimal",
    groups: [8, 8],
    kind: "decimal",
    draw: (r) => {
      const [n = 1, d = 2] = pick(r, SIMPLE_FRACTIONS);
      return [n, d, between(r, 1, 9)];
    },
    valid: ([n = 0, d = 0, t = 0]) => !q(n, d).eq(qd(t, 1)),
    solve: ([n = 0, d = 0, t = 0]) => q(n, d).add(qd(t, 1)).div(q(2)),
    ref: ([n = 0, d = 0, t = 0]) =>
      qd((100 * n) / d, 2)
        .add(qd(t, 1))
        .mul(qd(5, 1)),
    traps: [
      [
        "not-halved",
        "procedural",
        ([n = 0, d = 0, t = 0]) => q(n, d).add(qd(t, 1)),
      ],
      [
        "digits-side-by-side",
        "conceptual",
        ([n = 0, d = 0, t = 0]) => {
          const wrong = Q.fromDecimal(`0,${n}${d}`).add(qd(t, 1)).div(q(2));
          return wrong.eq(q(n, d).add(qd(t, 1)).div(q(2))) ? null : wrong;
        },
      ],
    ],
    extra: ([n = 0, d = 0, t = 0]) => ({
      f: fr(n, d),
      x: dec(t, 1),
      y: dec((100 * n) / d, 2, true),
    }),
  }),
  d6s({
    id: "D6.convert-1S.17",
    form: "the-largest-of-two-fractions-and-two-decimals",
    groups: [8, 8],
    kind: "choice",
    draw: (r) => {
      const f1 = r.int(MIXED_FRACTIONS.length);
      const f2 = r.int(MIXED_FRACTIONS.length);
      return [
        f1,
        f2,
        r.int(MIXED_DECIMALS.length),
        r.int(MIXED_DECIMALS.length),
        r.int(PERMUTATIONS.length),
      ];
    },
    valid: ([f1 = 0, f2 = 0, g1 = 0, g2 = 0]) => {
      const values = [
        MIXED_FRACTIONS[f1]?.[2],
        MIXED_FRACTIONS[f2]?.[2],
        MIXED_DECIMALS[g1],
        MIXED_DECIMALS[g2],
      ];
      return new Set(values).size === 4;
    },
    options: () => ["1", "2", "3", "4"],
    solve: (v) => {
      const items = mixedItems(v);
      const best = Math.max(...items.map((x) => x.value));
      return String(items.findIndex((x) => x.value === best) + 1);
    },
    ref: (v) => {
      const items = mixedItems(v);
      return String(
        items
          .map((x, i) => [x.value, i] as const)
          .sort((a, b) => b[0] - a[0])
          .map(([, i]) => i + 1)[0],
      );
    },
    traps: [
      [
        "fractions-as-digits",
        "conceptual",
        (v) => {
          const items = mixedItems(v);
          const alt = items.map((x) => x.digits);
          const wrong = String(alt.indexOf(Math.max(...alt)) + 1);
          const best = Math.max(...items.map((x) => x.value));
          return wrong === String(items.findIndex((x) => x.value === best) + 1)
            ? null
            : wrong;
        },
      ],
      [
        "numerator-as-tenths",
        "conceptual",
        (v) => {
          const items = mixedItems(v);
          const alt = items.map((x) => x.tenths);
          const wrong = String(alt.indexOf(Math.max(...alt)) + 1);
          const best = Math.max(...items.map((x) => x.value));
          const first = items.map((x) => x.digits);
          return wrong ===
            String(items.findIndex((x) => x.value === best) + 1) ||
            wrong === String(first.indexOf(Math.max(...first)) + 1)
            ? null
            : wrong;
        },
      ],
    ],
    extra: (v) => {
      const items = mixedItems(v);
      const best = Math.max(...items.map((x) => x.value));
      return {
        o1: items[0]?.text ?? "",
        o2: items[1]?.text ?? "",
        o3: items[2]?.text ?? "",
        o4: items[3]?.text ?? "",
        list: items.map((x) => dec(x.value, 3, true)).join("; "),
        list0: items.map((x) => dec(x.value, 3)).join("; "),
        big: dec(best, 3, true),
      };
    },
    consts: [1, 2, 3, 4],
  }),
];

const d7 = forFraction("D7", "order-mixed");
const EXT = {
  extension:
    "the order of operations with decimals and fractions, Russian grade 5 to 6 (RES-4282)",
};
/** A fraction with a short decimal as that decimal, such as 1⁄4 as 0,25. */
const fd = (n: number, d: number): string => dec((100 * n) / d, 2, true);
/** Unit fractions: dividing by them always leaves a finite decimal. */
const UNIT_FRACTIONS: readonly (readonly [number, number])[] = [
  [1, 2],
  [1, 4],
  [1, 5],
];
/** Tenths used by the bracket tasks: 0,5 to 4. */
const BRACKET_NUMBERS = [5, 15, 20, 25, 30, 40];
/** Operation orders of the bracket task, three signs for four numbers. */
const BRACKET_OPS: readonly (readonly string[])[] = [
  ["+", "×", "−"],
  ["−", "×", "+"],
  ["+", "×", "+"],
  ["×", "−", "×"],
  ["×", "+", "−"],
];
const OPERATIONS = ["+", "−", "×", ":"] as const;
/** The inverse operation and the neighbouring operation of each sign, by position. */
const OPPOSITE = [1, 0, 3, 2];
const NEIGHBOUR = [2, 3, 0, 1];
/** Numbers of the arranging task, in tenths. */
const TENTHS_POOL = [2, 3, 4, 5, 10, 15, 20, 25, 30, 40];

const applyOp = (op: string, x: Q, y: Q): Q =>
  op === "+"
    ? x.add(y)
    : op === "−"
      ? x.sub(y)
      : op === "×"
        ? x.mul(y)
        : x.div(y);

/** Every value of `n0 o0 n1 o1 n2 ...` for every way to place brackets, with the text of that placing; a bracket is written only where the order of operations needs it. */
function bracketings(
  nums: readonly Q[],
  texts: readonly string[],
  ops: readonly string[],
): { text: string; value: Q; rank: number }[] {
  if (nums.length === 1)
    return [{ text: texts[0] ?? "", value: nums[0] ?? q(0), rank: 3 }];
  const out: { text: string; value: Q; rank: number }[] = [];
  for (let cut = 1; cut < nums.length; cut += 1) {
    const lefts = bracketings(
      nums.slice(0, cut),
      texts.slice(0, cut),
      ops.slice(0, cut - 1),
    );
    const rights = bracketings(
      nums.slice(cut),
      texts.slice(cut),
      ops.slice(cut),
    );
    const op = ops[cut - 1] ?? "+";
    const rank = op === "×" ? 2 : 1;
    for (const l of lefts)
      for (const r of rights) {
        const left = l.rank < rank ? `(${l.text})` : l.text;
        const right =
          r.rank < rank || (r.rank === rank && op === "−")
            ? `(${r.text})`
            : r.text;
        out.push({
          text: `${left} ${op} ${right}`,
          value: applyOp(op, l.value, r.value),
          rank,
        });
      }
  }
  return out;
}
/** The bracketings without repeats of the same text. */
const distinctBracketings = (task: {
  nums: Q[];
  texts: string[];
  ops: readonly string[];
}): { text: string; value: Q }[] => {
  const seen = new Map<string, { text: string; value: Q }>();
  for (const x of bracketings(task.nums, task.texts, task.ops))
    if (!seen.has(x.text)) seen.set(x.text, { text: x.text, value: x.value });
  return [...seen.values()];
};
/** The same values found another way: apply the signs one at a time in every order. */
function byOrders(nums: readonly Q[], ops: readonly string[]): Q[] {
  if (ops.length === 0) return [nums[0] ?? q(0)];
  return ops.flatMap((op, i) =>
    byOrders(
      [
        ...nums.slice(0, i),
        applyOp(op, nums[i] ?? q(0), nums[i + 1] ?? q(0)),
        ...nums.slice(i + 2),
      ],
      [...ops.slice(0, i), ...ops.slice(i + 1)],
    ),
  );
}
/** The value of the expression by the usual order: products first. */
function usualValue(nums: readonly Q[], ops: readonly string[]): Q {
  const terms: { plus: boolean; value: Q }[] = [
    { plus: true, value: nums[0] ?? q(0) },
  ];
  ops.forEach((op, i) => {
    const next = nums[i + 1] ?? q(0);
    const last = terms[terms.length - 1];
    if (op === "×" && last) last.value = last.value.mul(next);
    else terms.push({ plus: op === "+", value: next });
  });
  return terms.reduce(
    (sum, t) => (t.plus ? sum.add(t.value) : sum.sub(t.value)),
    q(0),
  );
}
/** The numbers, their texts and signs of one bracket task: the first drawn value picks the signs. */
const bracketTask = (
  v: number[],
): { nums: Q[]; texts: string[]; ops: readonly string[] } => {
  const [o = 0, ...tenths] = v;
  return {
    nums: tenths.map((x) => qd(x, 1)),
    texts: tenths.map((x) => dec(x, 1, true)),
    ops: BRACKET_OPS[o] ?? [],
  };
};
const bracketText = (
  texts: readonly string[],
  ops: readonly string[],
): string =>
  texts.map((t, i) => (i < ops.length ? `${t} ${ops[i]}` : t)).join(" ");

const mixedOps = [
  d7({
    id: "D7.order-mixed.01",
    form: "a-decimal-plus-a-fraction-times-a-whole-number",
    groups: [7, 8],
    origin: EXT,
    kind: "decimal",
    draw: (r) => {
      const [n = 1, d = 2] = pick(r, SIMPLE_FRACTIONS);
      return [between(r, 1, 9), n, d, between(r, 2, 6)];
    },
    solve: ([t = 0, n = 0, d = 0, k = 0]) => qd(t, 1).add(q(n, d).mul(q(k))),
    ref: ([t = 0, n = 0, d = 0, k = 0]) => q(n * k, d).add(qd(t, 1)),
    traps: [
      [
        "fraction-as-digits",
        "conceptual",
        ([t = 0, n = 0, d = 0, k = 0]) =>
          qd(t, 1).add(Q.fromDecimal(`0,${n}${d}`).mul(q(k))),
      ],
      [
        "multiplier-forgotten",
        "procedural",
        ([t = 0, n = 0, d = 0]) => qd(t, 1).add(q(n, d)),
      ],
      [
        "left-to-right",
        "procedural",
        ([t = 0, n = 0, d = 0, k = 0]) => qd(t, 1).add(q(n, d)).mul(q(k)),
      ],
    ],
    extra: ([t = 0, n = 0, d = 0, k = 0]) => ({
      x: dec(t, 1),
      f: fr(n, d),
      fd: fd(n, d),
      kk: String(k),
    }),
  }),
  d7({
    id: "D7.order-mixed.02",
    form: "a-fraction-plus-a-decimal-times-a-whole-number",
    groups: [7, 8],
    origin: EXT,
    kind: "decimal",
    draw: (r) => {
      const [n = 1, d = 2] = pick(r, SIMPLE_FRACTIONS);
      return [n, d, between(r, 2, 9), between(r, 2, 6)];
    },
    solve: ([n = 0, d = 0, t = 0, k = 0]) => q(n, d).add(qd(t, 1).mul(q(k))),
    ref: ([n = 0, d = 0, t = 0, k = 0]) => qd(t * k, 1).add(q(n, d)),
    traps: [
      [
        "first-term-multiplied",
        "procedural",
        ([n = 0, d = 0, t = 0, k = 0]) => q(n, d).mul(q(k)).add(qd(t, 1)),
      ],
      [
        "multiplier-forgotten",
        "procedural",
        ([n = 0, d = 0, t = 0]) => q(n, d).add(qd(t, 1)),
      ],
      [
        "fraction-as-digits",
        "conceptual",
        ([n = 0, d = 0, t = 0, k = 0]) =>
          Q.fromDecimal(`0,${n}${d}`).add(qd(t, 1).mul(q(k))),
      ],
      [
        "left-to-right",
        "procedural",
        ([n = 0, d = 0, t = 0, k = 0]) => q(n, d).add(qd(t, 1)).mul(q(k)),
      ],
    ],
    extra: ([n = 0, d = 0, t = 0, k = 0]) => ({
      f: fr(n, d),
      fd: fd(n, d),
      x: dec(t, 1),
      kk: String(k),
    }),
  }),
  d7({
    id: "D7.order-mixed.03",
    form: "a-whole-number-minus-a-decimal-times-a-whole-number",
    groups: [7, 8],
    origin: EXT,
    kind: "decimal",
    draw: (r) => [between(r, 3, 9), between(r, 2, 9), between(r, 2, 4)],
    valid: ([w = 0, t = 0, k = 0]) => 10 * w > t * k && (t * k) % 10 !== 0,
    solve: ([w = 0, t = 0, k = 0]) => q(w).sub(qd(t, 1).mul(q(k))),
    ref: ([w = 0, t = 0, k = 0]) => qd(10 * w - t * k, 1),
    traps: [
      [
        "multiplier-forgotten",
        "procedural",
        ([w = 0, t = 0]) => q(w).sub(qd(t, 1)),
      ],
      [
        "wrong-term-multiplied",
        "procedural",
        ([w = 0, t = 0, k = 0]) => q(w * k).sub(qd(t, 1)),
      ],
      [
        "left-to-right",
        "procedural",
        ([w = 0, t = 0, k = 0]) => q(w).sub(qd(t, 1)).mul(q(k)),
      ],
    ],
    extra: ([, t = 0]) => ({ x: dec(t, 1) }),
  }),
  d7({
    id: "D7.order-mixed.04",
    form: "a-bracketed-sum-of-a-decimal-and-a-fraction-times-a-number",
    groups: [7, 8],
    origin: EXT,
    kind: "decimal",
    draw: (r) => {
      const [n = 1, d = 2] = pick(r, SIMPLE_FRACTIONS);
      return [between(r, 1, 9), n, d, between(r, 2, 6)];
    },
    solve: ([t = 0, n = 0, d = 0, k = 0]) => qd(t, 1).add(q(n, d)).mul(q(k)),
    ref: ([t = 0, n = 0, d = 0, k = 0]) =>
      q(k)
        .mul(qd(t, 1))
        .add(q(k * n, d)),
    traps: [
      [
        "multiplier-forgotten",
        "procedural",
        ([t = 0, n = 0, d = 0]) => qd(t, 1).add(q(n, d)),
      ],
      [
        "fraction-as-digits",
        "conceptual",
        ([t = 0, n = 0, d = 0, k = 0]) =>
          qd(t, 1)
            .add(Q.fromDecimal(`0,${n}${d}`))
            .mul(q(k)),
      ],
      [
        "brackets-ignored",
        "procedural",
        ([t = 0, n = 0, d = 0, k = 0]) => qd(t, 1).add(q(n, d).mul(q(k))),
      ],
    ],
    extra: ([t = 0, n = 0, d = 0, k = 0]) => ({
      x: dec(t, 1),
      f: fr(n, d),
      fd: fd(n, d),
      kk: String(k),
    }),
  }),
  d7({
    id: "D7.order-mixed.05",
    form: "a-decimal-minus-a-decimal-divided-by-a-fraction",
    groups: [7, 8],
    origin: EXT,
    kind: "decimal",
    draw: (r) => {
      const [n = 1, d = 2] = pick(r, UNIT_FRACTIONS);
      return [between(r, 26, 79), between(r, 1, 5), n, d];
    },
    valid: ([u = 0, t = 0, , d = 0]) => u > t * d,
    solve: ([u = 0, t = 0, n = 0, d = 0]) =>
      qd(u, 1).sub(qd(t, 1).div(q(n, d))),
    ref: ([u = 0, t = 0, , d = 0]) => qd(u - t * d, 1),
    traps: [
      [
        "multiplied-by-the-fraction",
        "conceptual",
        ([u = 0, t = 0, n = 0, d = 0]) => qd(u, 1).sub(qd(t, 1).mul(q(n, d))),
      ],
      [
        "left-to-right",
        "procedural",
        ([u = 0, t = 0, n = 0, d = 0]) => qd(u - t, 1).div(q(n, d)),
      ],
    ],
    extra: ([u = 0, t = 0, n = 0, d = 0]) => ({
      y: dec(u, 1),
      x: dec(t, 1),
      f: fr(n, d),
      fd: fd(n, d),
    }),
  }),
  d7({
    id: "D7.order-mixed.06",
    form: "a-decimal-divided-by-a-fraction-plus-a-number",
    groups: [7, 8],
    origin: EXT,
    kind: "decimal",
    draw: (r) => {
      const [n = 1, d = 2] = pick(r, UNIT_FRACTIONS);
      return [between(r, 2, 9), n, d, between(r, 1, 9)];
    },
    solve: ([t = 0, n = 0, d = 0, k = 0]) => qd(t, 1).div(q(n, d)).add(q(k)),
    ref: ([t = 0, , d = 0, k = 0]) => qd(t * d, 1).add(q(k)),
    traps: [
      [
        "multiplied-by-the-fraction",
        "conceptual",
        ([t = 0, n = 0, d = 0, k = 0]) => qd(t, 1).mul(q(n, d)).add(q(k)),
      ],
      [
        "brackets-ignored",
        "procedural",
        ([t = 0, n = 0, d = 0, k = 0]) => fin(qd(t, 1).div(q(n, d).add(q(k)))),
      ],
    ],
    extra: ([t = 0, n = 0, d = 0, k = 0]) => ({
      x: dec(t, 1),
      f: fr(n, d),
      fd: fd(n, d),
      kk: String(k),
    }),
  }),
  d7({
    id: "D7.order-mixed.07",
    form: "a-whole-number-minus-a-fraction-divided-by-a-decimal",
    groups: [7, 8],
    origin: EXT,
    kind: "decimal",
    draw: (r) => {
      const [n = 1, d = 2] = pick(r, SIMPLE_FRACTIONS);
      return [between(r, 2, 9), n, d, pick(r, [1, 2, 4, 5, 8])];
    },
    valid: ([w = 0, n = 0, d = 0, t = 0]) =>
      q(w).cmp(q(n, d).div(qd(t, 1))) > 0,
    solve: ([w = 0, n = 0, d = 0, t = 0]) => q(w).sub(q(n, d).div(qd(t, 1))),
    ref: ([w = 0, n = 0, d = 0, t = 0]) => q(w).sub(q(10 * n, d * t)),
    traps: [
      [
        "division-reversed",
        "procedural",
        ([w = 0, n = 0, d = 0, t = 0]) => {
          const quotient = fin(qd(t, 1).div(q(n, d)));
          return quotient === null ? null : q(w).sub(quotient);
        },
      ],
      [
        "multiplied",
        "procedural",
        ([w = 0, n = 0, d = 0, t = 0]) => q(w).sub(q(n, d).mul(qd(t, 1))),
      ],
      [
        "left-to-right",
        "procedural",
        ([w = 0, n = 0, d = 0, t = 0]) => q(w).sub(q(n, d)).div(qd(t, 1)),
      ],
    ],
    extra: ([w = 0, n = 0, d = 0, t = 0]) => ({
      kk: String(w),
      f: fr(n, d),
      fd: fd(n, d),
      x: dec(t, 1),
    }),
  }),
  d7({
    id: "D7.order-mixed.08",
    form: "a-decimal-times-a-whole-number-plus-a-fraction",
    groups: [7, 8],
    origin: EXT,
    kind: "decimal",
    draw: (r) => {
      const [n = 1, d = 2] = pick(r, SIMPLE_FRACTIONS);
      return [between(r, 1, 9), between(r, 2, 8), n, d];
    },
    solve: ([t = 0, k = 0, n = 0, d = 0]) => qd(t, 1).mul(q(k)).add(q(n, d)),
    ref: ([t = 0, k = 0, n = 0, d = 0]) => qd(t * k, 1).add(q(n, d)),
    traps: [
      [
        "wrong-term-multiplied",
        "procedural",
        ([t = 0, k = 0, n = 0, d = 0]) => qd(t, 1).add(q(n, d).mul(q(k))),
      ],
      [
        "fraction-as-digits",
        "conceptual",
        ([t = 0, k = 0, n = 0, d = 0]) =>
          qd(t, 1)
            .mul(q(k))
            .add(Q.fromDecimal(`0,${n}${d}`)),
      ],
      [
        "left-to-right",
        "procedural",
        ([t = 0, k = 0, n = 0, d = 0]) => qd(t, 1).mul(q(k).add(q(n, d))),
      ],
    ],
    extra: ([t = 0, k = 0, n = 0, d = 0]) => ({
      x: dec(t, 1),
      kk: String(k),
      f: fr(n, d),
      fd: fd(n, d),
    }),
  }),
  d7({
    id: "D7.order-mixed.09",
    form: "one-minus-a-decimal-times-a-fraction",
    groups: [7, 8],
    origin: EXT,
    kind: "decimal",
    draw: (r) => {
      const [n = 1, d = 2] = pick(r, SIMPLE_FRACTIONS);
      return [pick(r, [10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90]), n, d];
    },
    solve: ([h = 0, n = 0, d = 0]) => q(1).sub(qd(h, 2)).mul(q(n, d)),
    ref: ([h = 0, n = 0, d = 0]) => qd(100 - h, 2).mul(q(n, d)),
    traps: [
      ["multiplier-forgotten", "procedural", ([h = 0]) => qd(100 - h, 2)],
      [
        "fraction-as-digits",
        "conceptual",
        ([h = 0, n = 0, d = 0]) =>
          qd(100 - h, 2).mul(Q.fromDecimal(`0,${n}${d}`)),
      ],
      [
        "brackets-ignored",
        "procedural",
        ([h = 0, n = 0, d = 0]) => q(1).sub(qd(h, 2).mul(q(n, d))),
      ],
    ],
    extra: ([h = 0, n = 0, d = 0]) => ({
      x: dec(h, 2, true),
      f: fr(n, d),
      fd: fd(n, d),
    }),
    consts: [1],
  }),
  d7({
    id: "D7.order-mixed.10",
    form: "a-decimal-minus-a-fraction-times-a-whole-number",
    groups: [7, 8],
    origin: EXT,
    kind: "decimal",
    draw: (r) => {
      const [n = 1, d = 2] = pick(r, SIMPLE_FRACTIONS);
      return [between(r, 21, 59), n, d, between(r, 2, 4)];
    },
    valid: ([t = 0, n = 0, d = 0, k = 0]) => qd(t, 1).cmp(q(n * k, d)) > 0,
    solve: ([t = 0, n = 0, d = 0, k = 0]) => qd(t, 1).sub(q(n, d).mul(q(k))),
    ref: ([t = 0, n = 0, d = 0, k = 0]) => qd(t, 1).sub(q(n * k, d)),
    traps: [
      [
        "multiplier-forgotten",
        "procedural",
        ([t = 0, n = 0, d = 0]) => qd(t, 1).sub(q(n, d)),
      ],
      [
        "wrong-term-multiplied",
        "procedural",
        ([t = 0, n = 0, d = 0, k = 0]) => qd(t, 1).mul(q(k)).sub(q(n, d)),
      ],
      [
        "fraction-as-digits",
        "conceptual",
        ([t = 0, n = 0, d = 0, k = 0]) =>
          qd(t, 1).sub(Q.fromDecimal(`0,${n}${d}`).mul(q(k))),
      ],
      [
        "left-to-right",
        "procedural",
        ([t = 0, n = 0, d = 0, k = 0]) => qd(t, 1).sub(q(n, d)).mul(q(k)),
      ],
    ],
    extra: ([t = 0, n = 0, d = 0, k = 0]) => ({
      x: dec(t, 1),
      f: fr(n, d),
      fd: fd(n, d),
      kk: String(k),
    }),
  }),
  d7({
    id: "D7.order-mixed.11",
    form: "a-fraction-plus-a-decimal-times-a-decimal",
    groups: [7, 8],
    origin: EXT,
    kind: "decimal",
    draw: (r) => {
      const [n = 1, d = 2] = pick(r, SIMPLE_FRACTIONS);
      return [n, d, between(r, 3, 9), between(r, 2, 9)];
    },
    solve: ([n = 0, d = 0, t = 0, u = 0]) =>
      q(n, d).add(qd(t, 1).mul(qd(u, 1))),
    ref: ([n = 0, d = 0, t = 0, u = 0]) => qd(t * u, 2).add(q(n, d)),
    traps: [
      [
        "one-place",
        "procedural",
        ([n = 0, d = 0, t = 0, u = 0]) => q(n, d).add(qd(t * u, 1)),
      ],
      [
        "fraction-as-digits",
        "conceptual",
        ([n = 0, d = 0, t = 0, u = 0]) =>
          Q.fromDecimal(`0,${n}${d}`).add(qd(t * u, 2)),
      ],
      [
        "left-to-right",
        "procedural",
        ([n = 0, d = 0, t = 0, u = 0]) => q(n, d).add(qd(t, 1)).mul(qd(u, 1)),
      ],
    ],
    extra: ([n = 0, d = 0, t = 0, u = 0]) => ({
      f: fr(n, d),
      fd: fd(n, d),
      x: dec(t, 1),
      y: dec(u, 1),
    }),
  }),
  d7({
    id: "D7.order-mixed.12",
    form: "a-bracketed-difference-divided-by-a-whole-number",
    groups: [7, 8],
    origin: EXT,
    kind: "decimal",
    draw: (r) => {
      const [n = 1, d = 2] = pick(r, SIMPLE_FRACTIONS);
      return [between(r, 21, 49), n, d, pick(r, [2, 4, 5])];
    },
    valid: ([t = 0, n = 0, d = 0]) => t % 10 !== 0 && qd(t, 1).cmp(q(n, d)) > 0,
    solve: ([t = 0, n = 0, d = 0, k = 0]) => qd(t, 1).sub(q(n, d)).div(q(k)),
    ref: ([t = 0, n = 0, d = 0, k = 0]) =>
      qd(t * 100 - (100 * n * 10) / d, 3).div(q(k)),
    traps: [
      [
        "division-forgotten",
        "procedural",
        ([t = 0, n = 0, d = 0]) => qd(t, 1).sub(q(n, d)),
      ],
      [
        "fraction-as-digits",
        "conceptual",
        ([t = 0, n = 0, d = 0, k = 0]) =>
          qd(t, 1)
            .sub(Q.fromDecimal(`0,${n}${d}`))
            .div(q(k)),
      ],
      [
        "brackets-ignored",
        "procedural",
        ([t = 0, n = 0, d = 0, k = 0]) => qd(t, 1).sub(q(n, d).div(q(k))),
      ],
    ],
    extra: ([t = 0, n = 0, d = 0, k = 0]) => ({
      x: dec(t, 1),
      f: fr(n, d),
      fd: fd(n, d),
      kk: String(k),
    }),
  }),
  d7({
    id: "D7.order-mixed.13",
    form: "place-brackets-for-the-largest-value",
    groups: [7, 8],
    origin: {
      olympiad:
        "placing brackets in a chain of operations for the largest value, MCCME style (RES-4282)",
    },
    kind: "decimal",
    draw: (r) => [
      r.int(BRACKET_OPS.length),
      pick(r, BRACKET_NUMBERS),
      pick(r, BRACKET_NUMBERS),
      pick(r, BRACKET_NUMBERS),
      pick(r, BRACKET_NUMBERS),
    ],
    valid: (v) => {
      const task = bracketTask(v);
      const { nums, ops } = task;
      const all = distinctBracketings(task).map((x) => x.value);
      const best = all.reduce((x, y) => (x.cmp(y) >= 0 ? x : y));
      const plain = usualValue(nums, ops);
      return (
        new Set(v.slice(1)).size >= 3 &&
        best.cmp(plain) > 0 &&
        all.filter((x) => x.eq(best)).length === 1
      );
    },
    solve: (v) =>
      distinctBracketings(bracketTask(v))
        .map((x) => x.value)
        .reduce((x, y) => (x.cmp(y) >= 0 ? x : y)),
    ref: (v) => {
      const { nums, ops } = bracketTask(v);
      return byOrders(nums, ops).reduce((x, y) => (x.cmp(y) >= 0 ? x : y));
    },
    traps: [
      [
        "no-brackets",
        "procedural",
        (v) => {
          const { nums, ops } = bracketTask(v);
          return usualValue(nums, ops);
        },
      ],
      [
        "left-to-right",
        "procedural",
        (v) => {
          const { nums, ops } = bracketTask(v);
          const value = nums
            .slice(1)
            .reduce(
              (acc, x, i) => applyOp(ops[i] ?? "+", acc, x),
              nums[0] ?? q(0),
            );
          return value.eq(usualValue(nums, ops)) ? null : value;
        },
      ],
      [
        "the-smallest",
        "conceptual",
        (v) => {
          const task = bracketTask(v);
          const { nums, ops } = task;
          const all = distinctBracketings(task).map((x) => x.value);
          const least = all.reduce((x, y) => (x.cmp(y) <= 0 ? x : y));
          const left = nums
            .slice(1)
            .reduce(
              (acc, x, i) => applyOp(ops[i] ?? "+", acc, x),
              nums[0] ?? q(0),
            );
          return least.eq(usualValue(nums, ops)) || least.eq(left)
            ? null
            : least;
        },
      ],
    ],
    extra: (v) => {
      const task = bracketTask(v);
      const { nums, texts, ops } = task;
      const all = distinctBracketings(task);
      const best = all.reduce((x, y) => (x.value.cmp(y.value) >= 0 ? x : y));
      return {
        e: bracketText(texts, ops),
        v0: writeValue(usualValue(nums, ops)),
        best: best.text,
      };
    },
  }),
  d7({
    id: "D7.order-mixed.14",
    form: "the-missing-sign-of-an-operation",
    groups: [7, 8],
    origin: EXT,
    kind: "choice",
    draw: (r) => [
      pick(r, [2, 4, 5, 8]),
      r.int(UNIT_FRACTIONS.length),
      r.int(OPERATIONS.length),
    ],
    valid: ([t = 0, i = 0, op = 0]) => {
      const [n = 1, d = 2] = UNIT_FRACTIONS[i] ?? [];
      const results = OPERATIONS.map((o) => applyOp(o, qd(t, 1), q(n, d)));
      const target = results[op];
      return (
        target !== undefined &&
        target.cmp(q(0)) > 0 &&
        results.filter((x) => x.eq(target)).length === 1
      );
    },
    options: () => ["1", "2", "3", "4"],
    solve: ([, , op = 0]) => String(op + 1),
    ref: ([t = 0, i = 0, op = 0]) => {
      const [n = 1, d = 2] = UNIT_FRACTIONS[i] ?? [];
      const target = applyOp(OPERATIONS[op] ?? "+", qd(t, 1), q(n, d));
      return String(
        OPERATIONS.findIndex((o) => applyOp(o, qd(t, 1), q(n, d)).eq(target)) +
          1,
      );
    },
    traps: [
      [
        "opposite-operation",
        "conceptual",
        ([, , op = 0]) => String((OPPOSITE[op] ?? 0) + 1),
      ],
      [
        "neighbouring-operation",
        "conceptual",
        ([, , op = 0]) => String((NEIGHBOUR[op] ?? 0) + 1),
      ],
    ],
    extra: ([t = 0, i = 0, op = 0]) => {
      const [n = 1, d = 2] = UNIT_FRACTIONS[i] ?? [];
      const x = qd(t, 1);
      const f = q(n, d);
      return {
        x: dec(t, 1),
        f: fr(n, d),
        fd: fd(n, d),
        cc: writeValue(applyOp(OPERATIONS[op] ?? "+", x, f)),
        sym: OPERATIONS[op] ?? "+",
        tests: OPERATIONS.map(
          (o) =>
            `${dec(t, 1)} ${o} ${fd(n, d)} = ${writeValue(applyOp(o, x, f))}`,
        ).join("; "),
      };
    },
    consts: [1, 2, 3, 4],
  }),
  d7({
    id: "D7.order-mixed.15",
    form: "the-quotient-of-a-decimal-and-a-fraction-reduced-by-a-number",
    groups: [7, 8],
    origin: EXT,
    kind: "decimal",
    draw: (r) => {
      const [n = 1, d = 2] = pick(r, UNIT_FRACTIONS);
      return [between(r, 2, 9), n, d, between(r, 1, 9)];
    },
    valid: ([t = 0, , d = 0, u = 0]) => t * d > u,
    solve: ([t = 0, n = 0, d = 0, u = 0]) =>
      qd(t, 1).div(q(n, d)).sub(qd(u, 1)),
    ref: ([t = 0, , d = 0, u = 0]) => qd(t * d - u, 1),
    traps: [
      [
        "product-instead",
        "conceptual",
        ([t = 0, n = 0, d = 0, u = 0]) => {
          const wrong = qd(t, 1).mul(q(n, d)).sub(qd(u, 1));
          return wrong.cmp(q(0)) < 0 ? null : wrong;
        },
      ],
      [
        "reversed-subtraction",
        "procedural",
        ([t = 0, n = 0, d = 0, u = 0]) =>
          qd(u, 1)
            .sub(qd(t, 1).div(q(n, d)))
            .cmp(q(0)) < 0
            ? null
            : qd(u, 1).sub(qd(t, 1).div(q(n, d))),
      ],
      ["reduction-forgotten", "procedural", ([t = 0, , d = 0]) => qd(t * d, 1)],
      [
        "increased-instead",
        "conceptual",
        ([t = 0, , d = 0, u = 0]) => qd(t * d + u, 1),
      ],
      [
        "dividend-and-divisor-swapped",
        "conceptual",
        ([t = 0, n = 0, d = 0, u = 0]) => {
          const swapped = fin(q(n, d).div(qd(t, 1)));
          if (swapped === null) return null;
          const wrong = swapped.sub(qd(u, 1));
          return wrong.cmp(q(0)) < 0 ? null : wrong;
        },
      ],
    ],
    extra: ([t = 0, n = 0, d = 0, u = 0]) => ({
      x: dec(t, 1),
      f: fr(n, d),
      fd: fd(n, d),
      y: dec(u, 1),
    }),
  }),
  d7({
    id: "D7.order-mixed.16",
    form: "arrange-three-numbers-for-the-largest-difference-times",
    groups: [7, 8],
    origin: {
      olympiad:
        "arranging numbers in a pattern for the largest value, reasoning about the sizes, MCCME style (RES-4282)",
    },
    kind: "decimal",
    draw: (r) => [
      pick(r, TENTHS_POOL),
      pick(r, TENTHS_POOL),
      pick(r, TENTHS_POOL),
    ],
    valid: ([a = 0, b = 0, c = 0]) => new Set([a, b, c]).size === 3,
    solve: ([a = 0, b = 0, c = 0]) => {
      const [lo = 0, mid = 0, hi = 0] = [a, b, c].sort((x, y) => x - y);
      return qd((hi - lo) * mid, 2);
    },
    ref: (v) => {
      const orders = [
        [0, 1, 2],
        [0, 2, 1],
        [1, 0, 2],
        [1, 2, 0],
        [2, 0, 1],
        [2, 1, 0],
      ];
      return orders
        .map(([i = 0, j = 0, k = 0]) =>
          qd(((v[i] ?? 0) - (v[j] ?? 0)) * (v[k] ?? 0), 2),
        )
        .reduce((x, y) => (x.cmp(y) >= 0 ? x : y));
    },
    traps: [
      [
        "given-order",
        "procedural",
        ([a = 0, b = 0, c = 0]) => {
          const wrong = qd((a - b) * c, 2);
          const [lo = 0, mid = 0, hi = 0] = [a, b, c].sort((x, y) => x - y);
          return wrong.cmp(q(0)) <= 0 ||
            wrong.eq(qd((hi - lo) * mid, 2)) ||
            wrong.eq(qd((mid - lo) * hi, 2))
            ? null
            : wrong;
        },
      ],
      [
        "multiplier-is-the-largest",
        "conceptual",
        ([a = 0, b = 0, c = 0]) => {
          const [lo = 0, mid = 0, hi = 0] = [a, b, c].sort((x, y) => x - y);
          return qd((mid - lo) * hi, 2);
        },
      ],
      [
        "numbers-in-order",
        "procedural",
        ([a = 0, b = 0, c = 0]) => {
          const [lo = 0, mid = 0, hi = 0] = [a, b, c].sort((x, y) => x - y);
          const wrong = qd((hi - mid) * lo, 2);
          return wrong.eq(qd((mid - lo) * hi, 2)) ? null : wrong;
        },
      ],
    ],
    extra: ([a = 0, b = 0, c = 0]) => {
      const [lo = 0, mid = 0, hi = 0] = [a, b, c].sort((x, y) => x - y);
      return {
        n1: dec(a, 1, true),
        n2: dec(b, 1, true),
        n3: dec(c, 1, true),
        mx: dec(hi, 1, true),
        mn: dec(lo, 1, true),
        md: dec(mid, 1, true),
        df: dec(hi - lo, 1, true),
      };
    },
  }),
];

export const dSpecs2: readonly Spec<never>[] = [
  ...multiply,
  ...multiplyS,
  ...divide,
  ...convert,
  ...convertS,
  ...mixedOps,
];
