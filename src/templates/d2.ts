// Domain D, part 2: multiplying and dividing decimals, converting between fractions and decimals, and the
// order of operations with both (RES-4282). The Dutch goals multiply and divide by simple decimals at group 7
// and convert common fractions and decimals at group 7 and 8; the order of operations with mixed numbers is an
// extension at stretch. A decimal is written with a comma and a fraction with the fraction slash in a text.
// Texts are plain blanks in `content/tasks-d.ru.json`.
import { Q } from "../math/q.js";
import { between, pick } from "./draw.js";
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
    draw: (r) => [between(r, 3, 19)],
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
    draw: (r) => [between(r, 3, 19)],
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
    draw: (r) => [pick(r, [2, 4, 5, 6, 8]), pick(r, [5, 5, 5, 5, 5])],
    valid: ([a = 0]) => (a * 5) % 10 === 0,
    solve: ([a = 0, b = 0]) => qd(a * b, 2),
    ref: ([a = 0, b = 0]) => qd(a, 1).mul(qd(b, 1)),
    traps: [
      ["added", "procedural", ([a = 0, b = 0]) => qd(a + b, 1)],
      ["whole-product", "procedural", ([a = 0, b = 0]) => q(a * b)],
      ["one-place", "procedural", ([a = 0, b = 0]) => qd(a * b, 1)],
    ],
    extra: ([a = 0, b = 0]) => ({ x: dec(a, 1), y: dec(b, 1) }),
  }),
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
    ],
    extra: ([t = 0, k = 0]) => ({ x: dec(t, 1), n: String((t * k) / 10) }),
    consts: [10],
  }),
  d5({
    id: "D5.divide.02",
    form: "a-decimal-divided-by-a-whole-number",
    groups: [7, 8],
    kind: "decimal",
    draw: (r) => [between(r, 2, 9), between(r, 2, 9)],
    valid: ([k = 0, m = 0]) => (k * m) % 10 !== 0 && k !== m,
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
    draw: (r) => [2 * between(r, 2, 12)],
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
    draw: (r) => [4 * between(r, 1, 6)],
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
    draw: (r) => [between(r, 3, 9), between(r, 2, 9)],
    valid: ([k = 0, m = 0]) => k !== m && (k * m) % 10 !== 0,
    solve: ([, m = 0]) => qd(m, 1),
    ref: ([k = 0, m = 0]) => qd(k * m, 1).div(q(k)),
    traps: [
      ["comma-moved", "procedural", ([, m = 0]) => qd(m, 2)],
      ["multiplied", "procedural", ([k = 0, m = 0]) => qd(k * m, 1).mul(q(k))],
      ["whole-answer", "conceptual", ([, m = 0]) => q(m)],
    ],
    extra: ([k = 0, m = 0]) => ({ x: dec(k * m, 1) }),
  }),
  d5({
    id: "D5.divide.06",
    form: "how-many-small-glasses-from-whole-litres",
    groups: [7, 8],
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
    draw: (r) => [pick(r, [2, 4, 5, 10])],
    solve: ([i = 0]) => q(i),
    ref: ([i = 0]) => q(1).div(qd(100 / i, 2)),
    traps: [
      ["comma-ignored", "procedural", ([i = 0]) => qd(i, 2)],
      [
        "multiplied",
        "procedural",
        ([i = 0]) => (i === 10 ? null : qd(100 / i, 2)),
      ],
      ["comma-moved", "procedural", ([i = 0]) => qd(i, 1)],
    ],
    extra: ([i = 0]) => ({ x: dec(100 / i, 2) }),
    consts: [1],
  }),
  d5({
    id: "D5.divide.08",
    form: "a-quotient-rounded-to-hundredths",
    groups: [8, 8],
    kind: "decimal",
    draw: (r) => [pick(r, [10, 20, 5, 7, 8, 11]), pick(r, [3, 6, 7, 9])],
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
    kind: "integer",
    draw: (r) => [between(r, 2, 8)],
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
    ],
    extra: ([d = 0, k = 0]) => ({ x: dec(d * k, 1), y: dec(d, 1) }),
    consts: [10],
  }),
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
    ref: ([t = 0]) => q(t, 10),
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
    ref: ([h = 0]) => q(h, 100),
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
    draw: (r) => [pick(r, [2, 4, 5, 6, 8])],
    solve: ([t = 0]) => qd(t, 1),
    ref: ([t = 0]) => q(t, 10),
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
    ref: ([h = 0]) => q(h, 100),
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
    draw: (r) => [3, 4, between(r, 5, 9)],
    valid: ([n = 0, d = 0, t = 0]) => sign(q(n, d), qd(t, 1)) !== "=",
    solve: ([n = 0, d = 0, t = 0]) => sign(q(n, d), qd(t, 1)),
    ref: ([n = 0, d = 0, t = 0]) =>
      n * 10 > t * d ? ">" : n * 10 < t * d ? "<" : "=",
    traps: [
      [
        "digits-side-by-side",
        "conceptual",
        ([n = 0, d = 0, t = 0]) => (n * 10 < t * d ? ">" : null),
      ],
      [
        "flipped",
        "conceptual",
        ([n = 0, d = 0, t = 0]) => (n * 10 > t * d ? "<" : null),
      ],
    ],
    extra: ([n = 0, d = 0, t = 0]) => ({
      f: fr(n, d),
      x: dec(t, 1),
      sign: sign(q(n, d), qd(t, 1)),
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
    ref: ([h = 0]) => q(h, 100),
    traps: [
      ["reciprocal", "conceptual", ([h = 0]) => q(1, h)],
      ["thousandths", "procedural", ([h = 0]) => q(h, 1000)],
      ["tenths", "conceptual", ([h = 0]) => q(h, 10)],
    ],
    extra: ([h = 0]) => ({ x: dec(h, 2) }),
    consts: [10, 100],
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
    draw: (r) => [pick(r, EIGHTHS)],
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
    ref: ([h = 0]) => q(h, 100),
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
    draw: (r) => [pick(r, [125, 375, 625, 875])],
    solve: ([h = 0]) => qd(h, 3),
    ref: ([h = 0]) => q(h, 1000),
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
    ref: ([h = 0]) => q(h, 100),
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
    kind: "decimal",
    draw: (r) => [pick(r, [1, 3, 5, 7])],
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
];

const d7 = forFraction("D7", "order-mixed");
const EXT = {
  extension:
    "the order of operations with decimals and fractions, Russian grade 5 to 6 (RES-4282)",
};
const mixedOps = [
  d7({
    id: "D7.order-mixed.01",
    form: "a-decimal-plus-a-fraction-times-a-whole-number",
    groups: [7, 8],
    origin: EXT,
    kind: "decimal",
    draw: (r) => [between(r, 1, 9), 1, pick(r, [2, 4]), between(r, 2, 6)],
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
      kk: String(k),
    }),
  }),
  d7({
    id: "D7.order-mixed.02",
    form: "a-fraction-plus-a-decimal-times-a-whole-number",
    groups: [7, 8],
    origin: EXT,
    kind: "decimal",
    draw: (r) => [
      1,
      pick(r, [2, 4, 5]),
      pick(r, [2, 4, 6, 8]),
      between(r, 2, 5),
    ],
    valid: ([, , t = 0]) => t % 2 === 0,
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
    draw: (r) => [5, 1, 2, between(r, 2, 6)],
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
      kk: String(k),
    }),
  }),
  d7({
    id: "D7.order-mixed.05",
    form: "a-decimal-minus-a-decimal-divided-by-a-fraction",
    groups: [7, 8],
    origin: EXT,
    kind: "decimal",
    draw: (r) => [between(r, 7, 9), between(r, 1, 3), 1, 2],
    solve: ([u = 0, t = 0, n = 0, d = 0]) =>
      qd(u, 1).sub(qd(t, 1).div(q(n, d))),
    ref: ([u = 0, t = 0, n = 0, d = 0]) =>
      Q.fromDecimal(String(Number((u / 10 - t / 10 / (n / d)).toFixed(3)))),
    traps: [
      [
        "multiplied-by-the-fraction",
        "conceptual",
        ([u = 0, t = 0, n = 0, d = 0]) => qd(u, 1).sub(qd(t, 1).mul(q(n, d))),
      ],
      [
        "left-to-right",
        "procedural",
        ([u = 0, t = 0, n = 0, d = 0]) => qd(u, 1).sub(qd(t, 1)).div(q(n, d)),
      ],
    ],
    extra: ([u = 0, t = 0, n = 0, d = 0]) => ({
      y: dec(u, 1),
      x: dec(t, 1),
      f: fr(n, d),
    }),
  }),
  d7({
    id: "D7.order-mixed.06",
    form: "a-decimal-divided-by-a-fraction-plus-a-number",
    groups: [7, 8],
    origin: EXT,
    kind: "decimal",
    draw: (r) => [between(r, 2, 9), 1, 2, between(r, 1, 5)],
    solve: ([t = 0, n = 0, d = 0, k = 0]) => qd(t, 1).div(q(n, d)).add(q(k)),
    ref: ([t = 0, n = 0, d = 0, k = 0]) =>
      qd(t * d, 1)
        .div(q(n))
        .add(q(k)),
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
      kk: String(k),
    }),
  }),
  d7({
    id: "D7.order-mixed.07",
    form: "a-whole-number-minus-a-fraction-divided-by-a-decimal",
    groups: [7, 8],
    origin: EXT,
    kind: "decimal",
    draw: (r) => [between(r, 2, 6), 1, 4, 5],
    solve: ([w = 0, n = 0, d = 0, t = 0]) => q(w).sub(q(n, d).div(qd(t, 1))),
    ref: ([w = 0, n = 0, d = 0, t = 0]) =>
      Q.fromDecimal(String(Number((w - n / d / (t / 10)).toFixed(3)))),
    traps: [
      [
        "division-reversed",
        "procedural",
        ([w = 0, n = 0, d = 0, t = 0]) => q(w).sub(qd(t, 1).div(q(n, d))),
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
      x: dec(t, 1),
    }),
  }),
  d7({
    id: "D7.order-mixed.08",
    form: "a-decimal-times-a-whole-number-plus-a-fraction",
    groups: [7, 8],
    origin: EXT,
    kind: "decimal",
    draw: (r) => [pick(r, [2, 4, 6, 8]), 5, 1, 2],
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
    }),
  }),
  d7({
    id: "D7.order-mixed.09",
    form: "one-minus-a-decimal-times-a-fraction",
    groups: [7, 8],
    origin: EXT,
    kind: "decimal",
    draw: (r) => [pick(r, [25, 50, 75]), 1, pick(r, [2, 5])],
    valid: ([h = 0]) => h > 0,
    solve: ([h = 0, n = 0, d = 0]) => q(1).sub(qd(h, 2)).mul(q(n, d)),
    ref: ([h = 0, n = 0, d = 0]) => qd(100 - h, 2).mul(q(n, d)),
    traps: [
      ["multiplier-forgotten", "procedural", ([h = 0, ,]) => qd(100 - h, 2)],
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
    extra: ([h = 0, n = 0, d = 0]) => ({ x: dec(h, 2), f: fr(n, d) }),
    consts: [1],
  }),
  d7({
    id: "D7.order-mixed.10",
    form: "a-decimal-minus-a-fraction-times-a-whole-number",
    groups: [7, 8],
    origin: EXT,
    kind: "decimal",
    draw: (r) => [between(r, 11, 29), 1, 4, 2],
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
      kk: String(k),
    }),
  }),
  d7({
    id: "D7.order-mixed.11",
    form: "a-fraction-plus-a-decimal-times-a-decimal",
    groups: [7, 8],
    origin: EXT,
    kind: "decimal",
    draw: (r) => [1, pick(r, [2, 4, 5]), between(r, 3, 9), between(r, 2, 9)],
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
    draw: (r) => [between(r, 21, 49), 1, 2, pick(r, [2, 4, 5])],
    valid: ([t = 0]) => t % 10 !== 0,
    solve: ([t = 0, n = 0, d = 0, k = 0]) => qd(t, 1).sub(q(n, d)).div(q(k)),
    ref: ([t = 0, n = 0, d = 0, k = 0]) =>
      Q.fromDecimal(String(Number(((t / 10 - n / d) / k).toFixed(3)))),
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
      kk: String(k),
    }),
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
