// Domain F, part 3: adding and subtracting fractions with unlike denominators, multiplying and dividing
// fractions (RES-4284). The Dutch goals add and subtract unlike fractions at group 8, multiply a whole number
// by a fraction at group 8 and 1S, and divide by a fraction at 1S only. A fraction is written `3⁄4` in a text.
// Texts are plain blanks in `content/tasks-f.ru.json`.
import { Q } from "../math/q.js";
import { between, pick } from "./draw.js";
import { forFraction, fr, q } from "./kitf.js";
import { SIGNS, type Spec } from "./spec.js";

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);
const sign = (x: Q, y: Q): (typeof SIGNS)[number] => SIGNS[x.cmp(y) + 1] ?? "=";
const mix = (w: number, n: number, d: number): Q => q(w).add(q(n, d));
const mixText = (w: number, n: number, d: number): string => `${w} ${fr(n, d)}`;
const lessThanOne = (x: Q): boolean => x.cmp(q(1)) < 0;
/** The number as a wrong answer of a decimal task, or null where it has no finite decimal form. */
const terminating = (x: Q): Q | null => {
  let d = x.d;
  while (d % 2n === 0n) d /= 2n;
  while (d % 5n === 0n) d /= 5n;
  return d === 1n ? x : null;
};
/** The number as a wrong answer of a whole-number task, or null where it is not a whole number. */
const whole = (x: Q): Q | null => (x.d === 1n ? x : null);

const f6 = forFraction("F6", "add-unlike");
const unlike = [
  f6({
    id: "F6.add-unlike.01",
    form: "one-denominator-is-a-multiple-of-the-other",
    groups: [8, 8],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [
      between(r, 1, 4),
      between(r, 2, 5),
      between(r, 1, 11),
      between(r, 2, 3),
    ],
    valid: ([x = 0, d = 0, y = 0, k = 0]) =>
      x < d &&
      d * k <= 12 &&
      y < d * k &&
      gcd(x, d) === 1 &&
      gcd(y, d * k) === 1 &&
      lessThanOne(q(x, d).add(q(y, d * k))) &&
      gcd(x * k + y, d * k) === 1,
    solve: ([x = 0, d = 0, y = 0, k = 0]) => q(x * k + y, d * k),
    ref: ([x = 0, d = 0, y = 0, k = 0]) => q(x, d).add(q(y, d * k)),
    traps: [
      [
        "denominators-added",
        "procedural",
        ([x = 0, d = 0, y = 0, k = 0]) => q(x + y, d + d * k),
      ],
      [
        "numerator-not-converted",
        "procedural",
        ([x = 0, d = 0, y = 0, k = 0]) => q(x + y, d * k),
      ],
      [
        "over-the-smaller-denominator",
        "procedural",
        ([x = 0, d = 0, y = 0]) => q(x + y, d),
      ],
    ],
    extra: ([x = 0, d = 0, y = 0, k = 0]) => ({ f: fr(x, d), g: fr(y, d * k) }),
  }),
  f6({
    id: "F6.add-unlike.02",
    form: "two-fractions-with-coprime-denominators",
    groups: [8, 8],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [
      between(r, 1, 4),
      pick(r, [2, 3, 4, 5, 6, 7]),
      between(r, 1, 6),
      pick(r, [3, 5, 7, 8, 9]),
    ],
    valid: ([a = 0, b = 0, c = 0, d = 0]) =>
      a < b &&
      c < d &&
      b !== d &&
      gcd(b, d) === 1 &&
      gcd(a, b) === 1 &&
      gcd(c, d) === 1 &&
      lessThanOne(q(a, b).add(q(c, d))),
    solve: ([a = 0, b = 0, c = 0, d = 0]) => q(a * d + c * b, b * d),
    ref: ([a = 0, b = 0, c = 0, d = 0]) => q(a, b).add(q(c, d)),
    traps: [
      [
        "denominators-added",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a + c, b + d),
      ],
      [
        "numerators-not-converted",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a + c, b * d),
      ],
      [
        "second-not-converted",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a * d + c, b * d),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => ({ f: fr(a, b), g: fr(c, d) }),
  }),
  f6({
    id: "F6.add-unlike.03",
    form: "subtract-when-one-denominator-is-a-multiple",
    groups: [8, 8],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [
      between(r, 1, 4),
      between(r, 2, 5),
      between(r, 1, 11),
      between(r, 2, 3),
    ],
    valid: ([x = 0, d = 0, y = 0, k = 0]) =>
      x < d &&
      d * k <= 12 &&
      gcd(x, d) === 1 &&
      gcd(y, d * k) === 1 &&
      q(x, d).cmp(q(y, d * k)) > 0 &&
      gcd(x * k - y, d * k) === 1,
    solve: ([x = 0, d = 0, y = 0, k = 0]) => q(x * k - y, d * k),
    ref: ([x = 0, d = 0, y = 0, k = 0]) => q(x, d).sub(q(y, d * k)),
    traps: [
      [
        "numerators-over-the-larger-denominator",
        "procedural",
        ([x = 0, d = 0, y = 0, k = 0]) => (x <= y ? null : q(x - y, d * k)),
      ],
      [
        "added",
        "procedural",
        ([x = 0, d = 0, y = 0, k = 0]) => q(x * k + y, d * k),
      ],
      [
        "numerators-over-the-smaller-denominator",
        "procedural",
        ([x = 0, d = 0, y = 0]) => (x <= y ? null : q(x - y, d)),
      ],
    ],
    extra: ([x = 0, d = 0, y = 0, k = 0]) => ({ f: fr(x, d), g: fr(y, d * k) }),
  }),
  f6({
    id: "F6.add-unlike.04",
    form: "two-portions-of-a-pizza",
    groups: [8, 8],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => {
      const b = pick(r, [2, 3, 4, 5]);
      const d = b * pick(r, [2, 3]);
      return [between(r, 1, b - 1), b, between(r, 1, 4), d];
    },
    valid: ([a = 0, b = 0, c = 0, d = 0]) =>
      gcd(a, b) === 1 &&
      gcd(c, d) === 1 &&
      lessThanOne(q(a, b).add(q(c, d))) &&
      gcd(a * (d / b) + c, d) === 1,
    solve: ([a = 0, b = 0, c = 0, d = 0]) => q(a * (d / b) + c, d),
    ref: ([a = 0, b = 0, c = 0, d = 0]) => q(a, b).add(q(c, d)),
    traps: [
      [
        "denominators-added",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a + c, b + d),
      ],
      [
        "numerators-over-the-larger-denominator",
        "procedural",
        ([a = 0, , c = 0, d = 0]) => q(a + c, d),
      ],
      [
        "numerators-over-the-smaller-denominator",
        "procedural",
        ([a = 0, b = 0, c = 0]) => q(a + c, b),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => ({ f: fr(a, b), g: fr(c, d) }),
  }),
  f6({
    id: "F6.add-unlike.05",
    form: "two-bottles-in-litres-with-a-sum-above-one",
    groups: [8, 8],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => {
      const [b, d] = pick(r, [
        [4, 2],
        [6, 3],
        [6, 2],
        [8, 4],
        [8, 2],
        [9, 3],
        [10, 2],
        [10, 5],
        [12, 3],
        [12, 4],
        [12, 6],
      ] as const);
      return [between(r, 1, b - 1), b, between(r, 1, d), d];
    },
    valid: ([a = 0, b = 0, c = 0, d = 0]) =>
      a < b &&
      c < d &&
      gcd(a, b) === 1 &&
      gcd(c, d) === 1 &&
      q(a, b).add(q(c, d)).cmp(q(1)) > 0 &&
      gcd(a + c * (b / d) - b, b) === 1,
    solve: ([a = 0, b = 0, c = 0, d = 0]) => q(a + c * (b / d), b),
    ref: ([a = 0, b = 0, c = 0, d = 0]) => q(a, b).add(q(c, d)),
    traps: [
      [
        "denominators-added",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a + c, b + d),
      ],
      [
        "numerators-over-the-larger-denominator",
        "procedural",
        ([a = 0, b = 0, c = 0]) => q(a + c, b),
      ],
      [
        "whole-dropped",
        "conceptual",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a + c * (b / d) - b, b),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => ({ f: fr(a, b), g: fr(c, d) }),
    consts: [1],
  }),
  f6({
    id: "F6.add-unlike.06",
    form: "the-smallest-common-denominator",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [pick(r, [2, 3, 4, 5, 6, 8]), pick(r, [3, 4, 5, 6, 8, 9, 10])],
    valid: ([b = 0, d = 0]) => b !== d && b * d !== lcm(b, d),
    solve: ([b = 0, d = 0]) => q(lcm(b, d)),
    ref: ([b = 0, d = 0]) =>
      q(
        Array.from({ length: b * d }, (_, i) => i + 1).find(
          (x) => x % b === 0 && x % d === 0,
        ) ?? 0,
      ),
    traps: [
      ["product", "procedural", ([b = 0, d = 0]) => q(b * d)],
      [
        "larger-denominator",
        "procedural",
        ([b = 0, d = 0]) => q(Math.max(b, d)),
      ],
      ["sum", "procedural", ([b = 0, d = 0]) => q(b + d)],
    ],
    extra: ([b = 0, d = 0]) => ({ f: fr(1, b), g: fr(1, d) }),
  }),
  f6({
    id: "F6.add-unlike.07",
    form: "what-completes-one-after-two-parts",
    groups: [8, 8],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => {
      const b = pick(r, [2, 3, 4, 5]);
      const d = b * pick(r, [2, 3, 4]);
      return [between(r, 1, b - 1), b, between(r, 1, 5), d];
    },
    valid: ([a = 0, b = 0, c = 0, d = 0]) =>
      d <= 12 &&
      gcd(a, b) === 1 &&
      gcd(c, d) === 1 &&
      lessThanOne(q(a, b).add(q(c, d))) &&
      gcd(d - a * (d / b) - c, d) === 1,
    solve: ([a = 0, b = 0, c = 0, d = 0]) => q(d - a * (d / b) - c, d),
    ref: ([a = 0, b = 0, c = 0, d = 0]) => q(1).sub(q(a, b)).sub(q(c, d)),
    traps: [
      [
        "only-one-part-taken",
        "conceptual",
        ([a = 0, b = 0]) => q(1).sub(q(a, b)),
      ],
      [
        "the-amount-taken",
        "conceptual",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a, b).add(q(c, d)),
      ],
      [
        "only-second-part-taken",
        "conceptual",
        ([, , c = 0, d = 0]) => q(1).sub(q(c, d)),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => ({ f: fr(a, b), g: fr(c, d) }),
    consts: [1],
  }),
  f6({
    id: "F6.add-unlike.08",
    form: "a-sum-of-halves-quarters-eighths",
    groups: [8, 8],
    origin: {
      olympiad: "a sum of halving fractions, Kangaroo style (RES-4284)",
    },
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [between(r, 3, 9)],
    solve: ([k = 0]) => q(2 ** k - 1, 2 ** k),
    ref: ([k = 0]) =>
      Array.from({ length: k }, (_, i) => q(1, 2 ** (i + 1))).reduce(
        (a, b) => a.add(b),
        q(0),
      ),
    traps: [
      ["one-per-term", "conceptual", ([k = 0]) => q(k, 2 ** k)],
      [
        "missing-last-term",
        "procedural",
        ([k = 0]) => (k === 2 ? null : q(2 ** (k - 1) - 1, 2 ** (k - 1))),
      ],
      ["reached-one", "conceptual", () => q(1)],
    ],
    extra: ([k = 0]) => ({ last: fr(1, 2 ** k) }),
    consts: [1, 2, 4],
  }),
  f6({
    id: "F6.add-unlike.09",
    form: "compare-a-sum-with-one",
    groups: [8, 8],
    kind: "compare",
    draw: (r) => [
      between(r, 1, 4),
      between(r, 3, 6),
      between(r, 1, 4),
      between(r, 3, 7),
    ],
    valid: ([a = 0, b = 0, c = 0, d = 0]) =>
      a < b &&
      c < d &&
      b !== d &&
      sign(q(a, b).add(q(c, d)), q(1)) !== "=" &&
      sign(q(a + c), q(b + d)) !== sign(q(a, b).add(q(c, d)), q(1)),
    solve: ([a = 0, b = 0, c = 0, d = 0]) => sign(q(a, b).add(q(c, d)), q(1)),
    ref: ([a = 0, b = 0, c = 0, d = 0]) =>
      a * d + c * b < b * d ? "<" : a * d + c * b > b * d ? ">" : "=",
    traps: [
      [
        "parts-added",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => sign(q(a + c), q(b + d)),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => ({
      f: fr(a, b),
      g: fr(c, d),
      sign: sign(q(a, b).add(q(c, d)), q(1)),
    }),
    consts: [1],
  }),
  f6({
    id: "F6.add-unlike.10",
    form: "subtract-fractions-with-coprime-denominators",
    groups: [8, 8],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [
      between(r, 1, 6),
      pick(r, [3, 4, 5, 6, 7, 8]),
      between(r, 1, 4),
      pick(r, [2, 3, 5, 7]),
    ],
    valid: ([a = 0, b = 0, c = 0, d = 0]) =>
      a < b &&
      c < d &&
      gcd(a, b) === 1 &&
      gcd(c, d) === 1 &&
      gcd(b, d) === 1 &&
      q(a, b).cmp(q(c, d)) > 0,
    solve: ([a = 0, b = 0, c = 0, d = 0]) => q(a * d - c * b, b * d),
    ref: ([a = 0, b = 0, c = 0, d = 0]) => q(a, b).sub(q(c, d)),
    traps: [
      [
        "numerators-over-the-product",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => (a <= c ? null : q(a - c, b * d)),
      ],
      [
        "second-not-converted",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a * d - c, b * d),
      ],
      [
        "added",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a * d + c * b, b * d),
      ],
      [
        "denominators-subtracted",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) =>
          a <= c || b <= d ? null : q(a - c, b - d),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => ({ f: fr(a, b), g: fr(c, d) }),
  }),
  f6({
    id: "F6.add-unlike.11",
    form: "how-much-more-of-a-bottle",
    groups: [8, 8],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => {
      const b = pick(r, [2, 3, 4, 5, 6]);
      return [between(r, 1, b - 1), b, between(r, 1, 5), b * pick(r, [2, 3])];
    },
    valid: ([a = 0, b = 0, c = 0, d = 0]) =>
      a < b &&
      d <= 12 &&
      gcd(a, b) === 1 &&
      gcd(c, d) === 1 &&
      q(a, b).cmp(q(c, d)) > 0 &&
      gcd(a * (d / b) - c, d) === 1,
    solve: ([a = 0, b = 0, c = 0, d = 0]) => q(a * (d / b) - c, d),
    ref: ([a = 0, b = 0, c = 0, d = 0]) => q(a, b).sub(q(c, d)),
    traps: [
      ["the-smaller-part", "conceptual", ([, , c = 0, d = 0]) => q(c, d)],
      [
        "added",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a * (d / b) + c, d),
      ],
      [
        "numerators-over-the-larger-denominator",
        "procedural",
        ([a = 0, , c = 0, d = 0]) => (a <= c ? null : q(a - c, d)),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => ({ f: fr(a, b), g: fr(c, d) }),
  }),
];

const f6s = forFraction("F6", "add-unlike-1S");
const unlikeS = [
  f6s({
    id: "F6.add-unlike-1S.01",
    form: "add-fractions-with-a-sum-above-one",
    groups: [8, 8],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => [
      between(r, 1, 8),
      pick(r, [3, 4, 5, 6, 7, 8, 9]),
      between(r, 1, 8),
      pick(r, [3, 4, 5, 6, 7, 8, 9]),
    ],
    valid: ([a = 0, b = 0, c = 0, d = 0]) =>
      a < b &&
      c < d &&
      b !== d &&
      gcd(a, b) === 1 &&
      gcd(c, d) === 1 &&
      q(a, b).add(q(c, d)).cmp(q(1)) > 0 &&
      gcd(a * d + c * b, b * d) === 1,
    solve: ([a = 0, b = 0, c = 0, d = 0]) => q(a * d + c * b, b * d),
    ref: ([a = 0, b = 0, c = 0, d = 0]) => q(a, b).add(q(c, d)),
    traps: [
      [
        "denominators-added",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a + c, b + d),
      ],
      [
        "numerators-over-the-product",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a + c, b * d),
      ],
      [
        "second-not-converted",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a * d + c, b * d),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => ({ f: fr(a, b), g: fr(c, d) }),
  }),
  f6s({
    id: "F6.add-unlike-1S.02",
    form: "subtract-mixed-numbers-with-unlike-fractions",
    groups: [8, 8],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => [
      between(r, 3, 7),
      between(r, 1, 4),
      pick(r, [3, 4, 5, 6]),
      between(r, 1, 3),
      between(r, 1, 5),
      pick(r, [2, 3, 4, 5, 6]),
    ],
    valid: ([w1 = 0, a = 0, b = 0, w2 = 0, c = 0, d = 0]) =>
      a < b &&
      c < d &&
      b !== d &&
      gcd(a, b) === 1 &&
      gcd(c, d) === 1 &&
      w1 > w2 &&
      q(a, b).cmp(q(c, d)) < 0 &&
      gcd(b * d + a * d - c * b, b * d) === 1,
    solve: ([w1 = 0, a = 0, b = 0, w2 = 0, c = 0, d = 0]) =>
      mix(w1, a, b).sub(mix(w2, c, d)),
    ref: ([w1 = 0, a = 0, b = 0, w2 = 0, c = 0, d = 0]) =>
      q((w1 - w2) * b * d + a * d - c * b, b * d),
    traps: [
      [
        "smaller-from-larger",
        "procedural",
        ([w1 = 0, a = 0, b = 0, w2 = 0, c = 0, d = 0]) =>
          mix(w1 - w2, Math.abs(a * d - c * b), b * d),
      ],
      [
        "borrow-not-taken-off",
        "procedural",
        ([w1 = 0, a = 0, b = 0, w2 = 0, c = 0, d = 0]) =>
          mix(w1 - w2, b * d + a * d - c * b, b * d),
      ],
      ["fractions-ignored", "conceptual", ([w1 = 0, , , w2 = 0]) => q(w1 - w2)],
    ],
    extra: ([w1 = 0, a = 0, b = 0, w2 = 0, c = 0, d = 0]) => ({
      m: mixText(w1, a, b),
      k: mixText(w2, c, d),
    }),
  }),
  f6s({
    id: "F6.add-unlike-1S.03",
    form: "add-three-unlike-fractions",
    groups: [8, 8],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => {
      const [b = 0, d = 0, f = 0] = pick(r, [
        [2, 3, 4],
        [2, 3, 6],
        [2, 3, 12],
        [2, 4, 6],
        [2, 4, 12],
        [2, 6, 12],
        [3, 4, 6],
        [3, 4, 12],
        [3, 6, 12],
        [4, 6, 12],
      ] as const);
      return [
        between(r, 1, b - 1),
        b,
        between(r, 1, d - 1),
        d,
        between(r, 1, f - 1),
        f,
        lcm(lcm(b, d), f),
      ];
    },
    valid: ([a = 0, b = 0, c = 0, d = 0, e = 0, f = 0, l = 0]) =>
      gcd(a, b) === 1 &&
      gcd(c, d) === 1 &&
      gcd(e, f) === 1 &&
      q(a, b).add(q(c, d)).add(q(e, f)).cmp(q(1)) > 0 &&
      gcd((a * l) / b + (c * l) / d + (e * l) / f, l) === 1,
    solve: ([a = 0, b = 0, c = 0, d = 0, e = 0, f = 0]) =>
      q(a, b).add(q(c, d)).add(q(e, f)),
    ref: ([a = 0, b = 0, c = 0, d = 0, e = 0, f = 0]) => {
      const l = lcm(lcm(b, d), f);
      return q((a * l) / b + (c * l) / d + (e * l) / f, l);
    },
    traps: [
      [
        "denominators-added",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0, e = 0, f = 0]) => q(a + c + e, b + d + f),
      ],
      [
        "numerators-over-the-largest-denominator",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0, e = 0, f = 0]) =>
          q(a + c + e, Math.max(b, d, f)),
      ],
      [
        "last-not-converted",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0, e = 0, f = 0]) => {
          const l = lcm(lcm(b, d), f);
          return q((a * l) / b + (c * l) / d + e, l);
        },
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0, e = 0, f = 0]) => ({
      f1: fr(a, b),
      g1: fr(c, d),
      h1: fr(e, f),
    }),
  }),
  f6s({
    id: "F6.add-unlike-1S.04",
    form: "the-common-denominator-of-fractions-with-shared-factors",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [
      pick(r, [4, 6, 8, 9, 10, 12, 14, 15]),
      pick(r, [6, 9, 10, 12, 14, 15, 18, 20]),
    ],
    valid: ([b = 0, d = 0]) =>
      b !== d &&
      gcd(b, d) > 1 &&
      lcm(b, d) !== b * d &&
      lcm(b, d) !== Math.max(b, d),
    solve: ([b = 0, d = 0]) => q(lcm(b, d)),
    ref: ([b = 0, d = 0]) =>
      q(
        Array.from({ length: b * d }, (_, i) => i + 1).find(
          (x) => x % b === 0 && x % d === 0,
        ) ?? 0,
      ),
    traps: [
      ["product", "procedural", ([b = 0, d = 0]) => q(b * d)],
      [
        "larger-denominator",
        "procedural",
        ([b = 0, d = 0]) => q(Math.max(b, d)),
      ],
      ["common-divisor", "procedural", ([b = 0, d = 0]) => q(gcd(b, d))],
    ],
    extra: ([b = 0, d = 0]) => ({ f: fr(1, b), g: fr(1, d) }),
  }),
  f6s({
    id: "F6.add-unlike-1S.05",
    form: "a-difference-that-needs-reducing",
    groups: [8, 8],
    kind: "fraction",
    rule: "simplest",
    draw: (r) => [
      between(r, 1, 9),
      pick(r, [4, 6, 8, 9, 10, 12]),
      between(r, 1, 5),
      pick(r, [6, 8, 9, 10, 12, 15]),
    ],
    valid: ([a = 0, b = 0, c = 0, d = 0]) =>
      a < b &&
      c < d &&
      gcd(a, b) === 1 &&
      gcd(c, d) === 1 &&
      q(a, b).cmp(q(c, d)) > 0 &&
      b !== d &&
      gcd(b, d) > 1 &&
      q(a, b).sub(q(c, d)).d !== BigInt(b * d),
    solve: ([a = 0, b = 0, c = 0, d = 0]) => q(a, b).sub(q(c, d)),
    ref: ([a = 0, b = 0, c = 0, d = 0]) => q(a * d - c * b, b * d),
    traps: [
      [
        "numerators-over-the-product",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a - c, b * d),
      ],
      [
        "second-not-converted",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => {
          const l = lcm(b, d);
          return l === Math.max(b, d) ? null : q(a * (l / b) - c, l);
        },
      ],
      [
        "numerators-over-the-larger-denominator",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a - c, Math.max(b, d)),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => ({ f: fr(a, b), g: fr(c, d) }),
  }),
  f6s({
    id: "F6.add-unlike-1S.06",
    form: "a-sum-of-fractions-written-as-a-decimal",
    groups: [8, 8],
    kind: "decimal",
    draw: (r) => [
      between(r, 1, 9),
      pick(r, [2, 4, 5, 10, 20]),
      between(r, 1, 9),
      pick(r, [10, 20, 25, 50]),
    ],
    valid: ([a = 0, b = 0, c = 0, d = 0]) =>
      a < b && c < d && b !== d && gcd(a, b) === 1 && gcd(c, d) === 1,
    solve: ([a = 0, b = 0, c = 0, d = 0]) => q(a, b).add(q(c, d)),
    ref: ([a = 0, b = 0, c = 0, d = 0]) =>
      q(a * (100 / b) + c * (100 / d), 100),
    traps: [
      [
        "digits-side-by-side",
        "conceptual",
        ([a = 0, , c = 0]) => Q.fromDecimal(`0,${a}${c}`),
      ],
      [
        "numerators-over-the-larger-denominator",
        "procedural",
        ([a = 0, , c = 0, d = 0]) => q(a + c, d),
      ],
      ["first-fraction-only", "conceptual", ([a = 0, b = 0]) => q(a, b)],
      [
        "denominators-added",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => terminating(q(a + c, b + d)),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => ({ f: fr(a, b), g: fr(c, d) }),
    consts: [100],
  }),
  f6s({
    id: "F6.add-unlike-1S.07",
    form: "what-remains-after-two-unit-fractions",
    groups: [8, 8],
    kind: "fraction",
    rule: "simplest",
    draw: (r) => [between(r, 2, 7), between(r, 3, 12)],
    valid: ([a = 0, b = 0]) =>
      a !== b &&
      lessThanOne(q(1, a).add(q(1, b))) &&
      gcd(a * b - a - b, a * b) === 1,
    solve: ([a = 0, b = 0]) => q(1).sub(q(1, a)).sub(q(1, b)),
    ref: ([a = 0, b = 0]) => q(a * b - b - a, a * b),
    traps: [
      ["only-one-part-taken", "conceptual", ([a = 0]) => q(1).sub(q(1, a))],
      [
        "the-amount-taken",
        "conceptual",
        ([a = 0, b = 0]) => q(1, a).add(q(1, b)),
      ],
      [
        "only-second-part-taken",
        "conceptual",
        ([, b = 0]) => q(1).sub(q(1, b)),
      ],
    ],
    extra: ([a = 0, b = 0]) => ({ f: fr(1, a), g: fr(1, b) }),
    consts: [1],
  }),
  f6s({
    id: "F6.add-unlike-1S.08",
    form: "the-positive-difference-of-two-fractions",
    groups: [8, 8],
    kind: "fraction",
    rule: "simplest",
    draw: (r) => [
      between(r, 1, 7),
      pick(r, [4, 5, 6, 8, 9, 10]),
      between(r, 1, 7),
      pick(r, [4, 6, 8, 9, 10, 12]),
    ],
    valid: ([a = 0, b = 0, c = 0, d = 0]) =>
      a < b &&
      c < d &&
      b !== d &&
      gcd(a, b) === 1 &&
      gcd(c, d) === 1 &&
      gcd(b, d) > 1 &&
      q(a, b).cmp(q(c, d)) !== 0 &&
      gcd(Math.abs(a * d - c * b), b * d) > 1,
    solve: ([a = 0, b = 0, c = 0, d = 0]) =>
      q(a, b).cmp(q(c, d)) > 0 ? q(a, b).sub(q(c, d)) : q(c, d).sub(q(a, b)),
    ref: ([a = 0, b = 0, c = 0, d = 0]) => q(Math.abs(a * d - c * b), b * d),
    traps: [
      [
        "sum",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a, b).add(q(c, d)),
      ],
      [
        "numerators-over-the-product",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) =>
          a === c ? null : q(Math.abs(a - c), b * d),
      ],
      [
        "reverse-order",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a * d - c * b, b * d),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => ({ f: fr(a, b), g: fr(c, d) }),
  }),
  f6s({
    id: "F6.add-unlike-1S.09",
    form: "a-mixed-number-plus-an-unlike-fraction",
    groups: [8, 8],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => [
      between(r, 1, 5),
      between(r, 1, 4),
      pick(r, [2, 3, 4, 5]),
      between(r, 1, 6),
      pick(r, [3, 4, 5, 6, 7]),
    ],
    valid: ([, a = 0, b = 0, c = 0, d = 0]) =>
      a < b &&
      c < d &&
      b !== d &&
      gcd(a, b) === 1 &&
      gcd(c, d) === 1 &&
      a * d + c * b > b * d &&
      gcd(a * d + c * b - b * d, b * d) === 1,
    solve: ([w = 0, a = 0, b = 0, c = 0, d = 0]) => mix(w, a, b).add(q(c, d)),
    ref: ([w = 0, a = 0, b = 0, c = 0, d = 0]) =>
      q(w * b * d + a * d + c * b, b * d),
    traps: [
      [
        "wholes-dropped",
        "conceptual",
        ([, a = 0, b = 0, c = 0, d = 0]) => q(a, b).add(q(c, d)),
      ],
      [
        "denominators-added",
        "procedural",
        ([w = 0, a = 0, b = 0, c = 0, d = 0]) => mix(w, a + c, b + d),
      ],
      [
        "numerators-over-the-product",
        "procedural",
        ([w = 0, a = 0, b = 0, c = 0, d = 0]) => mix(w, a + c, b * d),
      ],
      [
        "carried-whole-lost",
        "procedural",
        ([w = 0, a = 0, b = 0, c = 0, d = 0]) =>
          mix(w, a * d + c * b - b * d, b * d),
      ],
    ],
    extra: ([w = 0, a = 0, b = 0, c = 0, d = 0]) => ({
      m: mixText(w, a, b),
      g: fr(c, d),
    }),
  }),
  f6s({
    id: "F6.add-unlike-1S.10",
    form: "two-parts-of-an-hour-in-minutes",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [
      between(r, 2, 5),
      pick(r, [3, 4, 5, 6, 10]),
      between(r, 2, 11),
      pick(r, [5, 6, 10, 12, 15, 20]),
    ],
    valid: ([a = 0, b = 0, c = 0, d = 0]) =>
      a < b &&
      c < d &&
      b !== d &&
      gcd(a, b) === 1 &&
      gcd(c, d) === 1 &&
      lessThanOne(q(a, b).add(q(c, d))),
    solve: ([a = 0, b = 0, c = 0, d = 0]) => q((60 * a) / b + (60 * c) / d),
    ref: ([a = 0, b = 0, c = 0, d = 0]) => q(a, b).add(q(c, d)).mul(q(60)),
    traps: [
      ["first-part-only", "conceptual", ([a = 0, b = 0]) => q((60 * a) / b)],
      [
        "second-part-only",
        "conceptual",
        ([, , c = 0, d = 0]) => q((60 * c) / d),
      ],
      [
        "hour-as-100-minutes",
        "conceptual",
        ([a = 0, b = 0, c = 0, d = 0]) =>
          (100 * a) % b === 0 && (100 * c) % d === 0
            ? q((100 * a) / b + (100 * c) / d)
            : null,
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => ({ f: fr(a, b), g: fr(c, d) }),
    consts: [60],
  }),
  f6s({
    id: "F6.add-unlike-1S.11",
    form: "a-sum-that-reduces-to-lowest-terms",
    groups: [8, 8],
    kind: "fraction",
    rule: "simplest",
    draw: (r) => [
      between(r, 1, 7),
      pick(r, [4, 6, 8, 9, 10, 12]),
      between(r, 1, 7),
      pick(r, [6, 8, 9, 10, 12, 15]),
    ],
    valid: ([a = 0, b = 0, c = 0, d = 0]) =>
      a < b &&
      c < d &&
      b !== d &&
      gcd(a, b) === 1 &&
      gcd(c, d) === 1 &&
      lessThanOne(q(a, b).add(q(c, d))) &&
      gcd(a * d + c * b, b * d) > 1,
    solve: ([a = 0, b = 0, c = 0, d = 0]) => q(a, b).add(q(c, d)),
    ref: ([a = 0, b = 0, c = 0, d = 0]) => {
      const l = lcm(b, d);
      const n = (a * l) / b + (c * l) / d;
      const g = gcd(n, l);
      return q(n / g, l / g);
    },
    traps: [
      [
        "denominators-added",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a + c, b + d),
      ],
      [
        "numerators-over-the-common-denominator",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a + c, lcm(b, d)),
      ],
      [
        "second-not-converted",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => {
          const l = lcm(b, d);
          return l === b ? null : q(a * (l / b) + c, l);
        },
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => ({ f: fr(a, b), g: fr(c, d) }),
  }),
];

const f7 = forFraction("F7", "times-fraction");
const times = [
  f7({
    id: "F7.times-fraction.01",
    form: "a-fraction-times-a-whole-number",
    groups: [7, 8],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => [between(r, 1, 6), between(r, 3, 9), between(r, 2, 9)],
    valid: ([n = 0, d = 0, k = 0]) =>
      n < d && gcd(n, d) === 1 && gcd(k, d) === 1 && n * k > d,
    solve: ([n = 0, d = 0, k = 0]) => q(n * k, d),
    ref: ([n = 0, d = 0, k = 0]) =>
      Array.from({ length: k }, () => q(n, d)).reduce((a, b) => a.add(b), q(0)),
    traps: [
      [
        "denominator-multiplied",
        "procedural",
        ([n = 0, d = 0, k = 0]) => q(n, d * k),
      ],
      [
        "both-multiplied",
        "procedural",
        ([n = 0, d = 0, k = 0]) => q(n * k, d * k),
      ],
      ["added", "procedural", ([n = 0, d = 0, k = 0]) => q(n + k, d)],
    ],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
  }),
  f7({
    id: "F7.times-fraction.02",
    form: "several-equal-portions-in-litres",
    groups: [7, 8],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => [between(r, 1, 5), between(r, 3, 8), between(r, 3, 9)],
    valid: ([n = 0, d = 0, k = 0]) =>
      n < d && gcd(n, d) === 1 && gcd(k, d) === 1 && n * k > d,
    solve: ([n = 0, d = 0, k = 0]) => q(n * k, d),
    ref: ([n = 0, d = 0, k = 0]) =>
      Array.from({ length: k }, () => q(n, d)).reduce((a, b) => a.add(b), q(0)),
    traps: [
      ["count-added", "procedural", ([n = 0, d = 0, k = 0]) => q(n + k, d)],
      [
        "denominator-multiplied",
        "procedural",
        ([n = 0, d = 0, k = 0]) => q(n, d * k),
      ],
      [
        "both-multiplied",
        "procedural",
        ([n = 0, d = 0, k = 0]) => q(n * k, d * k),
      ],
    ],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
  }),
  f7({
    id: "F7.times-fraction.03",
    form: "a-fraction-times-a-multiple-of-its-denominator",
    groups: [7, 8],
    kind: "integer",
    draw: (r) => [between(r, 2, 6), between(r, 3, 9), between(r, 2, 9)],
    valid: ([n = 0, d = 0]) => n < d && gcd(n, d) === 1,
    solve: ([n = 0, , m = 0]) => q(n * m),
    ref: ([n = 0, d = 0, m = 0]) => q(n, d).mul(q(d * m)),
    traps: [
      ["not-divided", "procedural", ([n = 0, d = 0, m = 0]) => q(n * d * m)],
      ["numerator-forgotten", "procedural", ([, , m = 0]) => q(m)],
      [
        "divided-by-the-numerator",
        "procedural",
        ([n = 0, d = 0, m = 0]) => ((d * m) % n === 0 ? q((d * m) / n) : null),
      ],
    ],
    extra: ([n = 0, d = 0, m = 0]) => ({ f: fr(n, d), k: String(d * m) }),
  }),
  f7({
    id: "F7.times-fraction.04",
    form: "a-whole-number-times-a-fraction",
    groups: [8, 8],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => [between(r, 3, 9), between(r, 1, 6), between(r, 3, 9)],
    valid: ([k = 0, n = 0, d = 0]) =>
      n < d && gcd(n, d) === 1 && gcd(k, d) === 1 && n * k > d,
    solve: ([k = 0, n = 0, d = 0]) => q(k * n, d),
    ref: ([k = 0, n = 0, d = 0]) =>
      Array.from({ length: n }, () => q(k, d)).reduce((a, b) => a.add(b), q(0)),
    traps: [
      ["added", "procedural", ([k = 0, n = 0, d = 0]) => q(k + n, d)],
      [
        "both-multiplied",
        "procedural",
        ([k = 0, n = 0, d = 0]) => q(k * n, k * d),
      ],
      [
        "denominator-multiplied",
        "procedural",
        ([k = 0, n = 0, d = 0]) => q(n, d * k),
      ],
    ],
    extra: ([, n = 0, d = 0]) => ({ f: fr(n, d) }),
  }),
  f7({
    id: "F7.times-fraction.05",
    form: "the-area-of-a-strip-in-square-metres",
    groups: [8, 8],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => [between(r, 1, 6), between(r, 3, 9), between(r, 3, 9)],
    valid: ([n = 0, d = 0, k = 0]) =>
      n < d && gcd(n, d) === 1 && gcd(k, d) === 1 && n * k > d,
    solve: ([n = 0, d = 0, k = 0]) => q(n * k, d),
    ref: ([n = 0, d = 0, k = 0]) =>
      Array.from({ length: k }, () => q(n, d)).reduce((a, b) => a.add(b), q(0)),
    traps: [
      [
        "perimeter",
        "conceptual",
        ([n = 0, d = 0, k = 0]) => q(2 * (n + k * d), d),
      ],
      [
        "sum-of-sides",
        "conceptual",
        ([n = 0, d = 0, k = 0]) => q(n + k * d, d),
      ],
      [
        "denominator-multiplied",
        "procedural",
        ([n = 0, d = 0, k = 0]) => q(n, d * k),
      ],
    ],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
    consts: [],
  }),
  f7({
    id: "F7.times-fraction.06",
    form: "a-daily-portion-over-several-days",
    groups: [7, 8],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => [between(r, 1, 5), between(r, 3, 8), between(r, 4, 12)],
    valid: ([n = 0, d = 0, k = 0]) =>
      n < d && gcd(n, d) === 1 && gcd(k, d) === 1 && n * k > d,
    solve: ([n = 0, d = 0, k = 0]) => q(n * k, d),
    ref: ([n = 0, d = 0, k = 0]) =>
      Array.from({ length: k }, () => q(n, d)).reduce((a, b) => a.add(b), q(0)),
    traps: [
      [
        "denominator-multiplied",
        "procedural",
        ([n = 0, d = 0, k = 0]) => q(n, d * k),
      ],
      ["count-added", "procedural", ([n = 0, d = 0, k = 0]) => q(n + k, d)],
      [
        "both-multiplied",
        "procedural",
        ([n = 0, d = 0, k = 0]) => q(n * k, d * k),
      ],
    ],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
  }),
  f7({
    id: "F7.times-fraction.07",
    form: "a-whole-number-of-unit-fractions",
    groups: [7, 8],
    kind: "integer",
    draw: (r) => [between(r, 2, 9), between(r, 2, 9)],
    valid: ([d = 0, m = 0]) => d !== m,
    solve: ([, m = 0]) => q(m),
    ref: ([d = 0, m = 0]) => q(d * m).mul(q(1, d)),
    traps: [
      ["multiplied", "procedural", ([d = 0, m = 0]) => q(d * m * d)],
      ["the-number-itself", "conceptual", ([d = 0, m = 0]) => q(d * m)],
      ["added", "procedural", ([d = 0, m = 0]) => q(d * m + d)],
    ],
    extra: ([d = 0, m = 0]) => ({ f: fr(1, d), k: String(d * m) }),
    consts: [1],
  }),
  f7({
    id: "F7.times-fraction.08",
    form: "the-price-of-a-fraction-of-a-kilogram",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [
      between(r, 1, 5),
      pick(r, [2, 3, 4, 5, 6, 8, 10]),
      between(r, 2, 9),
    ],
    valid: ([n = 0, d = 0]) => n < d && gcd(n, d) === 1,
    solve: ([n = 0, , m = 0]) => q(n * m),
    ref: ([n = 0, d = 0, m = 0]) => q(d * m).mul(q(n, d)),
    traps: [
      [
        "price-plus-numerator",
        "procedural",
        ([n = 0, d = 0, m = 0]) => q(d * m + n),
      ],
      ["not-divided", "procedural", ([n = 0, d = 0, m = 0]) => q(n * d * m)],
      ["one-part-only", "conceptual", ([, , m = 0]) => q(m)],
      [
        "divided-by-the-numerator",
        "procedural",
        ([n = 0, d = 0, m = 0]) => ((d * m) % n === 0 ? q((d * m) / n) : null),
      ],
    ],
    extra: ([n = 0, d = 0, m = 0]) => ({ f: fr(n, d), k: String(d * m) }),
  }),
  f7({
    id: "F7.times-fraction.09",
    form: "what-remains-after-several-portions",
    groups: [8, 8],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => [
      between(r, 4, 9),
      between(r, 1, 3),
      pick(r, [2, 3, 4, 5, 6]),
      between(r, 3, 7),
    ],
    valid: ([w = 0, n = 0, d = 0, k = 0]) =>
      n < d &&
      gcd(n, d) === 1 &&
      gcd(k, d) === 1 &&
      q(w)
        .sub(q(n * k, d))
        .cmp(q(1)) > 0,
    solve: ([w = 0, n = 0, d = 0, k = 0]) => q(w * d - n * k, d),
    ref: ([w = 0, n = 0, d = 0, k = 0]) => q(w).sub(q(n, d).mul(q(k))),
    traps: [
      [
        "the-amount-taken",
        "conceptual",
        ([, n = 0, d = 0, k = 0]) => q(n * k, d),
      ],
      [
        "one-portion-taken",
        "conceptual",
        ([w = 0, n = 0, d = 0]) => q(w).sub(q(n, d)),
      ],
      ["count-subtracted", "procedural", ([w = 0, , , k = 0]) => q(w - k)],
    ],
    extra: ([, n = 0, d = 0]) => ({ f: fr(n, d) }),
  }),
  f7({
    id: "F7.times-fraction.10",
    form: "a-fraction-of-an-hour-several-times-in-minutes",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [
      between(r, 2, 5),
      pick(r, [3, 4, 5, 6, 10, 12]),
      between(r, 2, 8),
    ],
    valid: ([n = 0, d = 0]) => n < d && gcd(n, d) === 1,
    solve: ([n = 0, d = 0, k = 0]) => q((60 * n * k) / d),
    ref: ([n = 0, d = 0, k = 0]) => q(n, d).mul(q(60 * k)),
    traps: [
      ["one-time", "procedural", ([n = 0, d = 0]) => q((60 * n) / d)],
      ["fraction-ignored", "conceptual", ([, , k = 0]) => q(60 * k)],
      ["added", "procedural", ([n = 0, d = 0, k = 0]) => q((60 * n) / d + k)],
      [
        "hour-as-100-minutes",
        "conceptual",
        ([n = 0, d = 0, k = 0]) =>
          (100 * n * k) % d === 0 ? q((100 * n * k) / d) : null,
      ],
    ],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
    consts: [60],
  }),
  f7({
    id: "F7.times-fraction.11",
    form: "a-product-that-reduces-to-a-mixed-number",
    groups: [8, 8],
    kind: "mixed",
    rule: "simplest",
    draw: (r) => [
      between(r, 1, 7),
      pick(r, [4, 6, 8, 9, 10, 12]),
      between(r, 2, 9),
    ],
    valid: ([n = 0, d = 0, k = 0]) =>
      n < d &&
      gcd(n, d) === 1 &&
      gcd(n * k, d) > 1 &&
      (n * k) % d !== 0 &&
      n * k > d,
    solve: ([n = 0, d = 0, k = 0]) => q(n * k, d),
    ref: ([n = 0, d = 0, k = 0]) => q(n, d).mul(q(k)),
    traps: [
      [
        "denominator-also-multiplied",
        "procedural",
        ([n = 0, d = 0, k = 0]) => q(n * k, d * k),
      ],
      [
        "denominator-multiplied",
        "procedural",
        ([n = 0, d = 0, k = 0]) => q(n, d * k),
      ],
      ["added", "procedural", ([n = 0, d = 0, k = 0]) => q(n + k, d)],
    ],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
  }),
];

const f7s = forFraction("F7", "times-fraction-1S");
const timesS = [
  f7s({
    id: "F7.times-fraction-1S.01",
    form: "a-fraction-times-a-fraction",
    groups: [8, 8],
    kind: "fraction",
    rule: "simplest",
    draw: (r) => [
      between(r, 1, 5),
      between(r, 2, 8),
      between(r, 1, 5),
      between(r, 3, 9),
    ],
    valid: ([a = 0, b = 0, c = 0, d = 0]) =>
      a < b && c < d && gcd(a * c, b * d) === 1,
    solve: ([a = 0, b = 0, c = 0, d = 0]) => q(a * c, b * d),
    ref: ([a = 0, b = 0, c = 0, d = 0]) => q(a, b).div(q(d, c)),
    traps: [
      [
        "parts-added",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a + c, b + d),
      ],
      [
        "divided-instead",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a * d, b * c),
      ],
      [
        "numerators-added-over-the-product",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a + c, b * d),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => ({ f: fr(a, b), g: fr(c, d) }),
  }),
  f7s({
    id: "F7.times-fraction-1S.02",
    form: "a-part-of-a-part",
    groups: [8, 8],
    kind: "fraction",
    rule: "simplest",
    draw: (r) => [
      between(r, 1, 3),
      between(r, 2, 7),
      between(r, 1, 5),
      between(r, 3, 8),
    ],
    valid: ([a = 0, b = 0, c = 0, d = 0]) =>
      a < b && c < d && gcd(a * c, b * d) === 1,
    solve: ([a = 0, b = 0, c = 0, d = 0]) => q(a * c, b * d),
    ref: ([a = 0, b = 0, c = 0, d = 0]) => q(c, d).div(q(b, a)),
    traps: [
      ["the-first-part-only", "conceptual", ([a = 0, b = 0]) => q(a, b)],
      [
        "the-second-part-only",
        "conceptual",
        ([a = 0, b = 0, c = 0, d = 0]) =>
          q(c, d).cmp(q(a, b)) === 0 ? null : q(c, d),
      ],
      [
        "denominators-added",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a * c, b + d),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => ({ f: fr(a, b), g: fr(c, d) }),
  }),
  f7s({
    id: "F7.times-fraction-1S.03",
    form: "a-mixed-number-times-a-whole-number",
    groups: [8, 8],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => [
      between(r, 1, 5),
      between(r, 1, 5),
      pick(r, [2, 3, 4, 5, 6]),
      between(r, 2, 8),
    ],
    valid: ([, n = 0, d = 0, k = 0]) =>
      n < d && gcd(n, d) === 1 && gcd(k, d) === 1,
    solve: ([w = 0, n = 0, d = 0, k = 0]) => mix(w, n, d).mul(q(k)),
    ref: ([w = 0, n = 0, d = 0, k = 0]) => q(w * k).add(q(n * k, d)),
    traps: [
      ["wholes-only", "conceptual", ([w = 0, , , k = 0]) => q(w * k)],
      [
        "fraction-not-multiplied",
        "procedural",
        ([w = 0, n = 0, d = 0, k = 0]) => mix(w * k, n, d),
      ],
      ["fraction-only", "conceptual", ([, n = 0, d = 0, k = 0]) => q(n * k, d)],
    ],
    extra: ([w = 0, n = 0, d = 0]) => ({ m: mixText(w, n, d) }),
  }),
  f7s({
    id: "F7.times-fraction-1S.04",
    form: "the-area-of-a-rectangle-with-fractional-sides",
    groups: [8, 8],
    kind: "fraction",
    rule: "simplest",
    draw: (r) => [
      between(r, 1, 3),
      between(r, 2, 7),
      between(r, 1, 5),
      between(r, 3, 8),
    ],
    valid: ([a = 0, b = 0, c = 0, d = 0]) =>
      a < b && c < d && gcd(a * c, b * d) === 1,
    solve: ([a = 0, b = 0, c = 0, d = 0]) => q(a * c, b * d),
    ref: ([a = 0, b = 0, c = 0, d = 0]) => q(a, b).div(q(d, c)),
    traps: [
      [
        "perimeter-half",
        "conceptual",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a, b).add(q(c, d)),
      ],
      [
        "divided-instead",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a * d, b * c),
      ],
      [
        "numerators-multiplied-denominators-added",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a * c, b + d),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => ({ f: fr(a, b), g: fr(c, d) }),
  }),
  f7s({
    id: "F7.times-fraction-1S.05",
    form: "the-reciprocal-of-a-fraction",
    groups: [8, 8],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [between(r, 2, 9), between(r, 3, 12)],
    valid: ([n = 0, d = 0]) => n < d && gcd(n, d) === 1,
    solve: ([n = 0, d = 0]) => q(d, n),
    ref: ([n = 0, d = 0]) => q(1).div(q(n, d)),
    traps: [
      ["the-same-fraction", "conceptual", ([n = 0, d = 0]) => q(n, d)],
      ["opposite-number", "conceptual", ([n = 0, d = 0]) => q(-n, d)],
      ["complement", "conceptual", ([n = 0, d = 0]) => q(d - n, d)],
    ],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
    consts: [1],
  }),
  f7s({
    id: "F7.times-fraction-1S.06",
    form: "cancelling-before-multiplying",
    groups: [8, 8],
    kind: "fraction",
    rule: "simplest",
    draw: (r) => [
      pick(r, [2, 3, 4, 5]),
      pick(r, [6, 8, 9, 10]),
      pick(r, [3, 4, 5, 6]),
      pick(r, [4, 6, 8, 12]),
    ],
    valid: ([a = 0, b = 0, c = 0, d = 0]) =>
      a < b &&
      c < d &&
      gcd(a, b) === 1 &&
      gcd(c, d) === 1 &&
      gcd(a * c, b * d) > 1,
    solve: ([a = 0, b = 0, c = 0, d = 0]) => q(a * c, b * d),
    ref: ([a = 0, b = 0, c = 0, d = 0]) => q(a, d).mul(q(c, b)),
    traps: [
      [
        "parts-added",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a + c, b + d),
      ],
      [
        "divided-instead",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a * d, b * c),
      ],
      [
        "numerators-multiplied-denominators-added",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a * c, b + d),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => ({ f: fr(a, b), g: fr(c, d) }),
  }),
  f7s({
    id: "F7.times-fraction-1S.07",
    form: "a-product-written-as-a-decimal",
    groups: [8, 8],
    kind: "decimal",
    draw: (r) => [
      between(r, 1, 9),
      pick(r, [2, 4, 5, 10]),
      between(r, 1, 9),
      pick(r, [2, 4, 5, 10]),
    ],
    valid: ([a = 0, b = 0, c = 0, d = 0]) =>
      a < b && c < d && b !== d && gcd(a, b) === 1 && gcd(c, d) === 1,
    solve: ([a = 0, b = 0, c = 0, d = 0]) => q(a * c, b * d),
    ref: ([a = 0, b = 0, c = 0, d = 0]) =>
      Q.fromDecimal(String(a / b).replace(".", ",")).mul(
        Q.fromDecimal(String(c / d).replace(".", ",")),
      ),
    traps: [
      [
        "digits-side-by-side",
        "conceptual",
        ([, b = 0, , d = 0]) => Q.fromDecimal(`0,${b}${d}`),
      ],
      [
        "sum-of-fractions",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a, b).add(q(c, d)),
      ],
      [
        "divided-instead",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => terminating(q(a * d, b * c)),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => ({ f: fr(a, b), g: fr(c, d) }),
  }),
  f7s({
    id: "F7.times-fraction-1S.08",
    form: "a-power-of-a-half",
    groups: [8, 8],
    kind: "fraction",
    rule: "simplest",
    draw: (r) => [between(r, 2, 9)],
    solve: ([k = 0]) => q(1, 2 ** k),
    ref: ([k = 0]) =>
      Array.from({ length: k }, () => q(1, 2)).reduce((a, b) => a.mul(b), q(1)),
    traps: [
      ["factors-added", "procedural", ([k = 0]) => q(1, 2 * k)],
      ["exponent-as-factor", "procedural", ([k = 0]) => q(k, 2)],
      ["denominator-not-raised", "conceptual", () => q(1, 2)],
    ],
    extra: () => ({ h: fr(1, 2) }),
    consts: [1, 2],
  }),
  f7s({
    id: "F7.times-fraction-1S.09",
    form: "what-is-left-after-two-successive-shares",
    groups: [8, 8],
    kind: "fraction",
    rule: "simplest",
    draw: (r) => [between(r, 2, 7), between(r, 3, 9)],
    valid: ([a = 0, b = 0]) => a !== b && gcd((a - 1) * (b - 1), a * b) > 1,
    solve: ([a = 0, b = 0]) => q(a - 1, a).mul(q(b - 1, b)),
    ref: ([a = 0, b = 0]) =>
      q(1)
        .sub(q(1, a))
        .sub(q(1, b).mul(q(a - 1, a))),
    traps: [
      [
        "shares-added",
        "procedural",
        ([a = 0, b = 0]) => q(1).sub(q(1, a)).sub(q(1, b)),
      ],
      ["first-remainder-only", "conceptual", ([a = 0]) => q(a - 1, a)],
      [
        "second-share-taken",
        "conceptual",
        ([a = 0, b = 0]) => q(a - 1, a).mul(q(1, b)),
      ],
    ],
    extra: ([a = 0, b = 0]) => ({ f: fr(1, a), g: fr(1, b) }),
    consts: [1],
  }),
  f7s({
    id: "F7.times-fraction-1S.10",
    form: "the-square-of-a-fraction",
    groups: [8, 8],
    kind: "fraction",
    rule: "simplest",
    draw: (r) => [between(r, 2, 9), between(r, 3, 12)],
    valid: ([n = 0, d = 0]) => n < d && gcd(n, d) === 1,
    solve: ([n = 0, d = 0]) => q(n * n, d * d),
    ref: ([n = 0, d = 0]) => q(n, d).sub(q(n * (d - n), d * d)),
    traps: [
      ["numerator-doubled", "procedural", ([n = 0, d = 0]) => q(2 * n, d)],
      [
        "denominator-not-squared",
        "procedural",
        ([n = 0, d = 0]) => q(n * n, d),
      ],
      ["numerator-not-squared", "procedural", ([n = 0, d = 0]) => q(n, d * d)],
      ["both-doubled", "procedural", ([n = 0, d = 0]) => q(2 * n, 2 * d)],
    ],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
  }),
  f7s({
    id: "F7.times-fraction-1S.11",
    form: "a-chain-of-fractions-that-cancels",
    groups: [8, 8],
    origin: { olympiad: "a telescoping product, Kangaroo style (RES-4284)" },
    kind: "fraction",
    rule: "simplest",
    draw: (r) => [between(r, 3, 12)],
    solve: ([k = 0]) => q(1, k + 1),
    ref: ([k = 0]) =>
      Array.from({ length: k }, (_, i) => q(i + 1, i + 2)).reduce(
        (a, b) => a.mul(b),
        q(1),
      ),
    traps: [
      ["the-last-numerator-over-one", "conceptual", ([k = 0]) => q(1, k)],
      ["everything-cancelled", "conceptual", () => q(1)],
      ["last-fraction-only", "conceptual", ([k = 0]) => q(k, k + 1)],
    ],
    extra: ([k = 0]) => ({ last: fr(k, k + 1), first: fr(1, 2) }),
    consts: [1, 2, 3],
  }),
];

const f8 = forFraction("F8", "divide-fraction");
const divide = [
  f8({
    id: "F8.divide-fraction.01",
    form: "how-many-glasses-from-whole-litres",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [between(r, 2, 12), between(r, 2, 8)],
    solve: ([k = 0, d = 0]) => q(k * d),
    ref: ([k = 0, d = 0]) => q(k).div(q(1, d)),
    traps: [
      ["added", "procedural", ([k = 0, d = 0]) => q(k + d)],
      ["the-number-itself", "conceptual", ([k = 0]) => q(k)],
      [
        "divided-by-denominator",
        "procedural",
        ([k = 0, d = 0]) => (k % d === 0 ? q(k / d) : null),
      ],
    ],
    extra: ([, d = 0]) => ({ f: fr(1, d) }),
    consts: [1],
  }),
  f8({
    id: "F8.divide-fraction.02",
    form: "a-whole-number-divided-by-a-fraction",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [between(r, 2, 6), between(r, 3, 10), between(r, 2, 9)],
    valid: ([n = 0, d = 0]) => n < d && gcd(n, d) === 1,
    solve: ([, d = 0, m = 0]) => q(d * m),
    ref: ([n = 0, d = 0, m = 0]) => q(n * m).div(q(n, d)),
    traps: [
      ["multiplied", "procedural", ([n = 0, , m = 0]) => q(n * m * n)],
      ["divided-by-the-numerator", "procedural", ([, , m = 0]) => q(m)],
      [
        "not-inverted",
        "procedural",
        ([n = 0, d = 0, m = 0]) =>
          (n * n * m) % d === 0 ? q((n * n * m) / d) : null,
      ],
    ],
    extra: ([n = 0, d = 0, m = 0]) => ({ f: fr(n, d), k: String(n * m) }),
  }),
  f8({
    id: "F8.divide-fraction.03",
    form: "a-fraction-divided-by-a-whole-number",
    groups: [8, 8],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [between(r, 1, 6), between(r, 3, 10), between(r, 2, 9)],
    valid: ([n = 0, d = 0, k = 0]) =>
      n < d && gcd(n, d) === 1 && gcd(n, k) === 1,
    solve: ([n = 0, d = 0, k = 0]) => q(n, d * k),
    ref: ([n = 0, d = 0, k = 0]) => q(n, d).mul(q(1, k)),
    traps: [
      ["multiplied", "procedural", ([n = 0, d = 0, k = 0]) => q(n * k, d)],
      [
        "fraction-inverted",
        "procedural",
        ([n = 0, d = 0, k = 0]) => q(d, n * k),
      ],
      [
        "number-divided-by-fraction",
        "procedural",
        ([n = 0, d = 0, k = 0]) => q(k * d, n),
      ],
    ],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
  }),
  f8({
    id: "F8.divide-fraction.04",
    form: "a-fraction-divided-by-a-fraction",
    groups: [8, 8],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => [
      between(r, 1, 6),
      between(r, 3, 9),
      between(r, 1, 6),
      between(r, 2, 9),
    ],
    valid: ([a = 0, b = 0, c = 0, d = 0]) =>
      a < b &&
      c < d &&
      gcd(a, b) === 1 &&
      gcd(c, d) === 1 &&
      a * d > b * c &&
      gcd(a * d, b * c) === 1,
    solve: ([a = 0, b = 0, c = 0, d = 0]) => q(a * d, b * c),
    ref: ([a = 0, b = 0, c = 0, d = 0]) => q(a, b).div(q(c, d)),
    traps: [
      [
        "multiplied-straight-across",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a * c, b * d),
      ],
      [
        "inverted-the-first",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(b * c, a * d),
      ],
      [
        "inverted-both",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(b * d, a * c),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => ({ f: fr(a, b), g: fr(c, d) }),
  }),
  f8({
    id: "F8.divide-fraction.05",
    form: "how-many-small-parts-fit-in-a-fraction",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [between(r, 1, 6), between(r, 3, 9), between(r, 2, 9)],
    valid: ([n = 0, d = 0, m = 0]) =>
      n < d && gcd(n, d) === 1 && gcd(n, m) === 1,
    solve: ([, , m = 0]) => q(m),
    ref: ([n = 0, d = 0, m = 0]) => q(n, d).div(q(n, d * m)),
    traps: [
      [
        "the-denominator-of-the-part",
        "conceptual",
        ([, d = 0, m = 0]) => q(d * m),
      ],
      ["equal-numerators", "conceptual", () => q(1)],
      [
        "denominators-subtracted",
        "procedural",
        ([, d = 0, m = 0]) => q(d * m - d),
      ],
    ],
    extra: ([n = 0, d = 0, m = 0]) => ({ f: fr(n, d), g: fr(n, d * m) }),
  }),
  f8({
    id: "F8.divide-fraction.06",
    form: "how-many-packs-fill-one-litre",
    groups: [8, 8],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => [between(r, 2, 8), between(r, 3, 13)],
    valid: ([n = 0, d = 0]) => n < d && gcd(n, d) === 1,
    solve: ([n = 0, d = 0]) => q(d, n),
    ref: ([n = 0, d = 0]) => q(1).div(q(n, d)),
    traps: [
      ["upside-down", "conceptual", ([n = 0, d = 0]) => q(n, d)],
      ["denominator-only", "conceptual", ([, d = 0]) => q(d)],
      ["gap-to-a-litre", "conceptual", ([n = 0, d = 0]) => q(d - n, d)],
    ],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
    consts: [1],
  }),
  f8({
    id: "F8.divide-fraction.07",
    form: "a-mixed-number-divided-by-a-whole-number",
    groups: [8, 8],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [
      between(r, 1, 5),
      between(r, 1, 6),
      between(r, 2, 7),
      between(r, 2, 8),
    ],
    valid: ([w = 0, n = 0, d = 0, k = 0]) =>
      n < d && gcd(n, d) === 1 && gcd(w * d + n, d * k) === 1,
    solve: ([w = 0, n = 0, d = 0, k = 0]) => q(w * d + n, d * k),
    ref: ([w = 0, n = 0, d = 0, k = 0]) => mix(w, n, d).div(q(k)),
    traps: [
      [
        "wholes-divided-only",
        "conceptual",
        ([w = 0, n = 0, d = 0, k = 0]) => q(w, k).add(q(n, d)),
      ],
      [
        "fraction-divided-only",
        "conceptual",
        ([w = 0, n = 0, d = 0, k = 0]) => q(w).add(q(n, d * k)),
      ],
      [
        "multiplied",
        "procedural",
        ([w = 0, n = 0, d = 0, k = 0]) => mix(w, n, d).mul(q(k)),
      ],
    ],
    extra: ([w = 0, n = 0, d = 0]) => ({ m: mixText(w, n, d) }),
  }),
  f8({
    id: "F8.divide-fraction.08",
    form: "how-many-short-lessons-fit-in-some-hours",
    groups: [8, 8],
    kind: "integer",
    roles: {
      a: "number of hours",
      b: "numerator of the length of a lesson",
      c: "denominator of the length of a lesson",
    },
    draw: (r) => [between(r, 2, 6), between(r, 2, 4), between(r, 3, 7)],
    valid: ([k = 0, n = 0, d = 0]) => n < d && gcd(n, d) === 1 && n * k <= 12,
    solve: ([k = 0, , d = 0]) => q(k * d),
    ref: ([k = 0, n = 0, d = 0]) => q(n * k).div(q(n, d)),
    traps: [
      ["divided-by-the-numerator-only", "procedural", ([k = 0]) => q(k)],
      [
        "multiplied-by-the-denominator",
        "procedural",
        ([k = 0, n = 0, d = 0]) => q(n * k * d),
      ],
      [
        "multiplied-by-the-fraction",
        "procedural",
        ([k = 0, n = 0, d = 0]) => whole(q(n * n * k, d)),
      ],
    ],
    extra: ([k = 0, n = 0, d = 0]) => ({
      f: fr(n, d),
      a: String(n * k),
      k: String(k),
    }),
    consts: [1],
  }),
  f8({
    id: "F8.divide-fraction.09",
    form: "the-number-that-gives-a-product-with-a-fraction",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [between(r, 2, 6), between(r, 3, 10), between(r, 2, 9)],
    valid: ([n = 0, d = 0]) => n < d && gcd(n, d) === 1,
    solve: ([, d = 0, m = 0]) => q(d * m),
    ref: ([n = 0, d = 0, m = 0]) => q(n * m).div(q(n, d)),
    traps: [
      ["product-itself", "conceptual", ([n = 0, , m = 0]) => q(n * m)],
      [
        "multiplied-by-the-fraction",
        "procedural",
        ([n = 0, d = 0, m = 0]) =>
          (n * n * m) % d === 0 ? q((n * n * m) / d) : null,
      ],
      ["divided-by-the-numerator", "procedural", ([, , m = 0]) => q(m)],
    ],
    extra: ([n = 0, d = 0, m = 0]) => ({ f: fr(n, d), k: String(n * m) }),
  }),
  f8({
    id: "F8.divide-fraction.10",
    form: "how-many-times-bigger-division-by-a-unit-fraction-makes-a-number",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [between(r, 2, 12), between(r, 2, 9)],
    solve: ([, d = 0]) => q(d),
    ref: ([k = 0, d = 0]) => q(k).div(q(1, d)).div(q(k)),
    traps: [
      ["the-quotient-itself", "conceptual", ([k = 0, d = 0]) => q(k * d)],
      ["how-much-greater", "conceptual", ([k = 0, d = 0]) => q(k * d - k)],
    ],
    extra: ([k = 0, d = 0]) => ({ f: fr(1, d), p: String(k * d) }),
    consts: [1],
  }),
  f8({
    id: "F8.divide-fraction.11",
    form: "a-whole-number-divided-by-a-mixed-number",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => {
      const d = pick(r, [2, 3, 4, 5]);
      return [between(r, 1, 3), between(r, 1, d - 1), d, d * between(r, 1, 3)];
    },
    valid: ([, n = 0, d = 0]) => gcd(n, d) === 1,
    solve: ([, , , m = 0]) => q(m),
    ref: ([w = 0, n = 0, d = 0, m = 0]) =>
      q(((w * d + n) * m) / d).div(mix(w, n, d)),
    traps: [
      [
        "wholes-only",
        "conceptual",
        ([w = 0, n = 0, d = 0, m = 0]) => whole(q(((w * d + n) * m) / d, w)),
      ],
      [
        "fraction-part-only",
        "conceptual",
        ([w = 0, n = 0, d = 0, m = 0]) =>
          whole(q((((w * d + n) * m) / d) * d, n)),
      ],
      [
        "not-inverted",
        "procedural",
        ([w = 0, n = 0, d = 0, m = 0]) => {
          const x = q(((w * d + n) * m) / d).mul(mix(w, n, d));
          return x.d === 1n ? x : null;
        },
      ],
    ],
    extra: ([w = 0, n = 0, d = 0, m = 0]) => ({
      g: mixText(w, n, d),
      k: String(((w * d + n) * m) / d),
    }),
  }),
];

const unlikeMore = [
  f6({
    id: "F6.add-unlike.12",
    form: "the-missing-fraction-in-a-sum",
    groups: [8, 8],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => {
      const b = pick(r, [2, 3, 4, 5, 6]);
      const k = pick(r, [2, 3, 4]);
      const a = between(r, 1, b - 1);
      return [a, b, a * k + between(r, 1, 5), b * k];
    },
    valid: ([a = 0, b = 0, c = 0, d = 0]) =>
      c < d &&
      d <= 12 &&
      gcd(a, b) === 1 &&
      gcd(c, d) === 1 &&
      gcd(c - (a * d) / b, d) === 1,
    solve: ([a = 0, b = 0, c = 0, d = 0]) => q(c * b - a * d, b * d),
    ref: ([a = 0, b = 0, c = 0, d = 0]) => q(c, d).sub(q(a, b)),
    traps: [
      [
        "added",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q((a * d) / b + c, d),
      ],
      [
        "numerators-subtracted",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) =>
          c <= a || q(c - a, d).eq(q(c * b - a * d, b * d))
            ? null
            : q(c - a, d),
      ],
      [
        "denominators-subtracted",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) =>
          c <= a || d <= b ? null : q(c - a, d - b),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => ({
      f: fr(a, b),
      g: fr(c, d),
      r: fr(c - (a * d) / b, d),
    }),
  }),
  f6({
    id: "F6.add-unlike.13",
    form: "the-midpoint-of-two-unlike-fractions",
    groups: [8, 8],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => {
      const b = pick(r, [2, 3, 4, 5, 6]);
      const k = pick(r, [2, 3, 4]);
      const a = between(r, 1, b - 1);
      return [a, b, a * k + between(r, 1, 5), b * k];
    },
    valid: ([a = 0, b = 0, c = 0, d = 0]) =>
      c < d &&
      d <= 12 &&
      gcd(a, b) === 1 &&
      gcd(c, d) === 1 &&
      gcd((a * d) / b + c, 2 * d) === 1,
    solve: ([a = 0, b = 0, c = 0, d = 0]) => q(a, b).add(q(c, d)).div(q(2)),
    ref: ([a = 0, b = 0, c = 0, d = 0]) => q((a * d) / b + c, 2 * d),
    traps: [
      [
        "sum-not-halved",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q((a * d) / b + c, d),
      ],
      ["the-left-end", "conceptual", ([a = 0, b = 0]) => q(a, b)],
      [
        "half-the-distance",
        "conceptual",
        ([a = 0, b = 0, c = 0, d = 0]) => q(c, d).sub(q(a, b)).div(q(2)),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => ({ f: fr(a, b), g: fr(c, d) }),
    consts: [2],
  }),
  f6({
    id: "F6.add-unlike.14",
    form: "two-unit-fractions-with-consecutive-denominators",
    groups: [8, 8],
    origin: {
      olympiad:
        "two unit fractions with consecutive denominators, Kangaroo style, RES-4284",
    },
    kind: "integer",
    draw: (r) => [between(r, 2, 12)],
    solve: ([x = 0]) => q(x),
    ref: ([x = 0]) => {
      const sum = q(2 * x + 1, x * (x + 1));
      for (let k = 1; k < 100; k += 1)
        if (
          q(1, k)
            .add(q(1, k + 1))
            .eq(sum)
        )
          return q(k);
      return q(0);
    },
    traps: [
      ["the-larger-denominator", "conceptual", ([x = 0]) => q(x + 1)],
      ["the-product", "conceptual", ([x = 0]) => q(x * (x + 1))],
      ["the-sum-of-denominators", "conceptual", ([x = 0]) => q(2 * x + 1)],
    ],
    extra: ([x = 0]) => ({
      s: fr(2 * x + 1, x * (x + 1)),
      z: String(x * (x + 1)),
    }),
    consts: [1],
  }),
  f6({
    id: "F6.add-unlike.15",
    form: "the-numerator-over-the-common-denominator",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => {
      const b = between(r, 2, 8);
      const d = between(r, 3, 9);
      return [between(r, 1, b - 1), b, between(r, 1, d - 1), d];
    },
    valid: ([a = 0, b = 0, c = 0, d = 0]) =>
      b !== d && gcd(a, b) === 1 && gcd(c, d) === 1 && lcm(b, d) <= 24,
    solve: ([a = 0, b = 0, c = 0, d = 0]) =>
      q((a * lcm(b, d)) / b + (c * lcm(b, d)) / d),
    ref: ([a = 0, b = 0, c = 0, d = 0]) =>
      q(a, b)
        .add(q(c, d))
        .mul(q(lcm(b, d))),
    traps: [
      ["numerators-added", "procedural", ([a = 0, , c = 0]) => q(a + c)],
      [
        "first-not-converted",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a + (c * lcm(b, d)) / d),
      ],
      [
        "second-not-converted",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q((a * lcm(b, d)) / b + c),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => ({
      f: fr(a, b),
      g: fr(c, d),
      e: String(lcm(b, d)),
    }),
  }),
];

const unlikeSMore = [
  f6s({
    id: "F6.add-unlike-1S.12",
    form: "a-sum-of-fractions-with-products-in-the-denominators",
    groups: [8, 8],
    origin: {
      olympiad: "a telescoping sum of one over n times n plus one, RES-4284",
    },
    kind: "fraction",
    rule: "simplest",
    draw: (r) => [between(r, 3, 12)],
    solve: ([n = 0]) => q(n, n + 1),
    ref: ([n = 0]) =>
      Array.from({ length: n }, (_, i) => q(1, (i + 1) * (i + 2))).reduce(
        (acc, x) => acc.add(x),
        q(0),
      ),
    traps: [
      ["reached-one", "conceptual", () => q(1)],
      ["last-term-only", "conceptual", ([n = 0]) => q(1, n * (n + 1))],
      [
        "product-subtracted",
        "procedural",
        ([n = 0]) => q(1).sub(q(1, n * (n + 1))),
      ],
    ],
  }),
  f6s({
    id: "F6.add-unlike-1S.13",
    form: "add-two-mixed-numbers-with-unlike-fractions",
    groups: [8, 8],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => {
      const c = pick(r, [2, 3, 4, 5, 6]);
      const f = pick(r, [3, 4, 5, 6, 7]);
      return [
        between(r, 1, 6),
        between(r, 1, c - 1),
        c,
        between(r, 1, 6),
        between(r, 1, f - 1),
        f,
      ];
    },
    valid: ([, a = 0, b = 0, , c = 0, d = 0]) => {
      const l = lcm(b, d);
      const n = a * (l / b) + c * (l / d);
      return (
        b !== d &&
        gcd(a, b) === 1 &&
        gcd(c, d) === 1 &&
        n > l &&
        gcd(n, l) === 1
      );
    },
    solve: ([w1 = 0, a = 0, b = 0, w2 = 0, c = 0, d = 0]) =>
      mix(w1, a, b).add(mix(w2, c, d)),
    ref: ([w1 = 0, a = 0, b = 0, w2 = 0, c = 0, d = 0]) =>
      q(w1 * b * d + w2 * b * d + a * d + c * b, b * d),
    traps: [
      [
        "denominators-added",
        "procedural",
        ([w1 = 0, a = 0, b = 0, w2 = 0, c = 0, d = 0]) =>
          mix(w1 + w2, a + c, b + d),
      ],
      [
        "carry-lost",
        "procedural",
        ([w1 = 0, a = 0, b = 0, w2 = 0, c = 0, d = 0]) => {
          const parts = q(a, b).add(q(c, d));
          return parts.cmp(q(1)) < 0
            ? null
            : mix(w1 + w2, 0, 1).add(parts.sub(q(1)));
        },
      ],
      ["wholes-only", "conceptual", ([w1 = 0, , , w2 = 0]) => q(w1 + w2)],
    ],
    extra: ([w1 = 0, a = 0, b = 0, w2 = 0, c = 0, d = 0]) => ({
      m: mixText(w1, a, b),
      k: mixText(w2, c, d),
      l: String(lcm(b, d)),
    }),
  }),
  f6s({
    id: "F6.add-unlike-1S.14",
    form: "reduce-each-fraction-and-then-add",
    groups: [8, 8],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => [
      between(r, 1, 7),
      between(r, 3, 9),
      between(r, 2, 4),
      between(r, 1, 7),
      between(r, 3, 9),
      between(r, 2, 4),
    ],
    valid: ([n1 = 0, d1 = 0, , n2 = 0, d2 = 0]) => {
      const l = lcm(d1, d2);
      const n = n1 * (l / d1) + n2 * (l / d2);
      return (
        n1 < d1 &&
        n2 < d2 &&
        gcd(n1, d1) === 1 &&
        gcd(n2, d2) === 1 &&
        d1 !== d2 &&
        n > l &&
        gcd(n, l) === 1
      );
    },
    solve: ([n1 = 0, d1 = 0, , n2 = 0, d2 = 0]) => q(n1, d1).add(q(n2, d2)),
    ref: ([n1 = 0, d1 = 0, , n2 = 0, d2 = 0]) => q(n1 * d2 + n2 * d1, d1 * d2),
    traps: [
      [
        "denominators-added",
        "procedural",
        ([n1 = 0, d1 = 0, , n2 = 0, d2 = 0]) => q(n1 + n2, d1 + d2),
      ],
      [
        "numerators-over-the-product",
        "procedural",
        ([n1 = 0, d1 = 0, , n2 = 0, d2 = 0]) => q(n1 + n2, d1 * d2),
      ],
      [
        "whole-lost",
        "procedural",
        ([n1 = 0, d1 = 0, , n2 = 0, d2 = 0]) =>
          q(n1, d1).add(q(n2, d2)).sub(q(1)),
      ],
    ],
    extra: ([n1 = 0, d1 = 0, k1 = 0, n2 = 0, d2 = 0, k2 = 0]) => ({
      p: fr(n1 * k1, d1 * k1),
      s: fr(n2 * k2, d2 * k2),
      l: String(lcm(d1, d2)),
    }),
  }),
  f6s({
    id: "F6.add-unlike-1S.15",
    form: "the-whole-after-two-different-fractions-are-taken",
    groups: [8, 8],
    origin: {
      olympiad:
        "the whole from what remains after two fractions are taken, RES-4284",
    },
    kind: "integer",
    draw: (r) => [between(r, 2, 6), between(r, 3, 8), between(r, 2, 9)],
    valid: ([p = 0, qq = 0]) => p !== qq && lessThanOne(q(1, p).add(q(1, qq))),
    solve: ([p = 0, qq = 0, k = 0]) => q(lcm(p, qq) * k),
    ref: ([p = 0, qq = 0, k = 0]) => {
      const l = lcm(p, qq);
      return q((l - l / p - l / qq) * k).div(q(1).sub(q(1, p)).sub(q(1, qq)));
    },
    traps: [
      [
        "the-remaining-amount-itself",
        "conceptual",
        ([p = 0, qq = 0, k = 0]) => {
          const l = lcm(p, qq);
          return q((l - l / p - l / qq) * k);
        },
      ],
      [
        "only-the-first-fraction-taken",
        "conceptual",
        ([p = 0, qq = 0, k = 0]) => {
          const l = lcm(p, qq);
          return whole(q((l - l / p - l / qq) * k).div(q(p - 1, p)));
        },
      ],
      [
        "only-the-second-fraction-taken",
        "conceptual",
        ([p = 0, qq = 0, k = 0]) => {
          const l = lcm(p, qq);
          return whole(q((l - l / p - l / qq) * k).div(q(qq - 1, qq)));
        },
      ],
    ],
    extra: ([p = 0, qq = 0, k = 0]) => {
      const l = lcm(p, qq);
      return {
        f: fr(1, p),
        g: fr(1, qq),
        m: String((l - l / p - l / qq) * k),
        l: String(l),
      };
    },
  }),
];

const timesMore = [
  f7({
    id: "F7.times-fraction.12",
    form: "a-fraction-of-a-number-with-a-mixed-result",
    groups: [7, 8],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => [between(r, 1, 6), between(r, 3, 10), between(r, 3, 15)],
    valid: ([n = 0, d = 0, k = 0]) =>
      n < d && gcd(n, d) === 1 && gcd(k, d) === 1 && n * k > d,
    solve: ([n = 0, d = 0, k = 0]) => q(n * k, d),
    ref: ([n = 0, d = 0, k = 0]) => q(k, d).mul(q(n)),
    traps: [
      [
        "divided-only",
        "procedural",
        ([n = 0, d = 0, k = 0]) => (n === 1 ? null : q(k, d)),
      ],
      [
        "divided-by-the-fraction",
        "procedural",
        ([n = 0, d = 0, k = 0]) => q(k * d, n),
      ],
      [
        "denominator-multiplied",
        "procedural",
        ([n = 0, d = 0, k = 0]) => q(n, d * k),
      ],
    ],
    extra: ([n = 0, d = 0, k = 0]) => ({ f: fr(n, d), k: String(k) }),
  }),
  f7({
    id: "F7.times-fraction.13",
    form: "does-multiplying-by-a-fraction-make-the-number-bigger",
    groups: [8, 8],
    kind: "compare",
    draw: (r) => [between(r, 3, 12), between(r, 2, 9), between(r, 2, 9)],
    valid: ([, n = 0, d = 0]) => n !== d && gcd(n, d) === 1,
    solve: ([, n = 0, d = 0]) => sign(q(n, d), q(1)),
    ref: ([k = 0, n = 0, d = 0]) => (n * k < d * k ? "<" : ">"),
    traps: [
      [
        "multiplication-makes-bigger",
        "conceptual",
        ([, n = 0, d = 0]) => (n < d ? ">" : null),
      ],
      [
        "multiplication-makes-smaller",
        "conceptual",
        ([, n = 0, d = 0]) => (n > d ? "<" : null),
      ],
      ["equal", "conceptual", () => "="],
    ],
    extra: ([k = 0, n = 0, d = 0]) => ({
      k: String(k),
      f: fr(n, d),
      t: sign(q(n, d), q(1)),
      sign: sign(q(n, d), q(1)),
    }),
    consts: [1],
  }),
  f7({
    id: "F7.times-fraction.14",
    form: "the-number-and-its-product-with-a-fraction-differ-by",
    groups: [8, 8],
    origin: {
      olympiad: "the whole from its difference with a part, RES-4284",
    },
    kind: "integer",
    draw: (r) => {
      const [p, qq] = pick(r, [
        [1, 2],
        [2, 3],
        [3, 4],
        [1, 3],
        [3, 5],
        [2, 5],
        [4, 5],
        [5, 6],
        [1, 4],
      ] as const);
      return [p, qq, between(r, 2, 12)];
    },
    solve: ([, qq = 0, m = 0]) => q(qq * m),
    ref: ([p = 0, qq = 0, m = 0]) => q((qq - p) * m).div(q(1).sub(q(p, qq))),
    traps: [
      [
        "the-difference-itself",
        "conceptual",
        ([p = 0, qq = 0, m = 0]) => q((qq - p) * m),
      ],
      [
        "divided-by-the-fraction",
        "conceptual",
        ([p = 0, qq = 0, m = 0]) => whole(q((qq - p) * m).div(q(p, qq))),
      ],
      [
        "difference-times-denominator",
        "procedural",
        ([p = 0, qq = 0, m = 0]) =>
          (qq - p) * m * qq === qq * m ? null : q((qq - p) * m * qq),
      ],
    ],
    extra: ([p = 0, qq = 0, m = 0]) => ({
      f: fr(p, qq),
      s: String((qq - p) * m),
    }),
  }),
  f7({
    id: "F7.times-fraction.15",
    form: "the-wire-of-a-cube-frame",
    groups: [8, 8],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => [between(r, 1, 10), pick(r, [5, 7, 11, 13])],
    valid: ([n = 0, d = 0]) => n < d && gcd(12 * n, d) === 1,
    solve: ([n = 0, d = 0]) => q(12 * n, d),
    ref: ([n = 0, d = 0]) => q(n, d).mul(q(12)),
    traps: [
      ["only-one-edge", "conceptual", ([n = 0, d = 0]) => q(n, d)],
      ["six-edges", "conceptual", ([n = 0, d = 0]) => q(6 * n, d)],
      ["eight-edges", "conceptual", ([n = 0, d = 0]) => q(8 * n, d)],
    ],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
  }),
];

const BOUNCES: readonly (readonly [number, number])[] = [
  [2, 3],
  [3, 4],
  [1, 2],
  [3, 5],
  [4, 5],
  [2, 5],
];

const timesSMore = [
  f7s({
    id: "F7.times-fraction-1S.12",
    form: "the-height-of-a-bouncing-ball",
    groups: [8, 8],
    origin: {
      olympiad:
        "repeated multiplication by a fraction, a bouncing ball, RES-4284",
    },
    kind: "integer",
    roles: {
      a: "numerator of the rebound fraction",
      b: "denominator of the rebound fraction",
      c: "number of bounces",
    },
    draw: (r) => {
      const [p, d] = pick(r, BOUNCES);
      return [p, d, between(r, 2, d <= 3 ? 4 : 3), between(r, 1, 3)];
    },
    solve: ([p = 0, , n = 0, m = 0]) => q(m * p ** n),
    ref: ([p = 0, d = 0, n = 0, m = 0]) =>
      Array.from({ length: n }, () => q(p, d)).reduce(
        (acc, x) => acc.mul(x),
        q(m * d ** n),
      ),
    traps: [
      [
        "one-bounce-only",
        "conceptual",
        ([p = 0, d = 0, n = 0, m = 0]) => q(m * d ** (n - 1) * p),
      ],
      [
        "times-the-count",
        "procedural",
        ([p = 0, d = 0, n = 0, m = 0]) => q(m * d ** n * p * n, d),
      ],
    ],
    extra: ([p = 0, d = 0, n = 0, m = 0]) => {
      const heights = Array.from(
        { length: n },
        (_, i) => m * d ** (n - 1 - i) * p ** (i + 1),
      );
      return {
        H: String(m * d ** n),
        f: fr(p, d),
        x: String(heights[0]),
        chain: heights.join("; "),
      };
    },
  }),
  f7s({
    id: "F7.times-fraction-1S.13",
    form: "a-part-of-a-part-of-an-amount",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => {
      const [n1, d1, n2, d2] = pick(r, [
        [1, 2, 1, 3],
        [2, 3, 1, 2],
        [3, 4, 1, 3],
        [1, 2, 3, 4],
        [2, 3, 3, 4],
        [1, 3, 2, 5],
        [3, 5, 1, 2],
        [1, 4, 2, 3],
      ] as const);
      return [n1, d1, n2, d2, between(r, 1, 6)];
    },
    solve: ([n1 = 0, , n2 = 0, , m = 0]) => q(n1 * n2 * m),
    ref: ([n1 = 0, d1 = 0, n2 = 0, d2 = 0, m = 0]) =>
      q(d1 * d2 * m)
        .mul(q(n2, d2))
        .mul(q(n1, d1)),
    traps: [
      [
        "only-the-inner-part",
        "conceptual",
        ([, d1 = 0, n2 = 0, , m = 0]) => q(d1 * n2 * m),
      ],
      [
        "only-the-outer-part",
        "conceptual",
        ([n1 = 0, , , d2 = 0, m = 0]) => q(n1 * d2 * m),
      ],
      [
        "parts-added",
        "procedural",
        ([n1 = 0, d1 = 0, n2 = 0, d2 = 0, m = 0]) => {
          const total = q(d1 * d2 * m).mul(q(n1, d1).add(q(n2, d2)));
          return total.eq(q(n1 * n2 * m)) ? null : total;
        },
      ],
    ],
    extra: ([n1 = 0, d1 = 0, n2 = 0, d2 = 0, m = 0]) => ({
      f: fr(n1, d1),
      g: fr(n2, d2),
      k: String(d1 * d2 * m),
      x: String(d1 * m * n2),
    }),
  }),
  f7s({
    id: "F7.times-fraction-1S.14",
    form: "a-mixed-number-times-a-mixed-number",
    groups: [8, 8],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => [
      between(r, 1, 4),
      between(r, 1, 5),
      between(r, 2, 6),
      between(r, 1, 4),
      between(r, 1, 5),
      between(r, 3, 7),
    ],
    valid: ([, n1 = 0, d1 = 0, , n2 = 0, d2 = 0]) =>
      n1 < d1 &&
      n2 < d2 &&
      gcd(n1, d1) === 1 &&
      gcd(n2, d2) === 1 &&
      q(1, d1).mul(q(n2, d2)).d !== 1n,
    solve: ([w1 = 0, n1 = 0, d1 = 0, w2 = 0, n2 = 0, d2 = 0]) =>
      mix(w1, n1, d1).mul(mix(w2, n2, d2)),
    ref: ([w1 = 0, n1 = 0, d1 = 0, w2 = 0, n2 = 0, d2 = 0]) =>
      q((w1 * d1 + n1) * (w2 * d2 + n2), d1 * d2),
    traps: [
      [
        "parts-multiplied-separately",
        "procedural",
        ([w1 = 0, n1 = 0, d1 = 0, w2 = 0, n2 = 0, d2 = 0]) =>
          mix(w1 * w2, n1 * n2, d1 * d2),
      ],
      ["wholes-only", "conceptual", ([w1 = 0, , , w2 = 0]) => q(w1 * w2)],
    ],
    extra: ([w1 = 0, n1 = 0, d1 = 0, w2 = 0, n2 = 0, d2 = 0]) => ({
      m: mixText(w1, n1, d1),
      k: mixText(w2, n2, d2),
    }),
  }),
  f7s({
    id: "F7.times-fraction-1S.15",
    form: "a-product-of-three-fractions-with-cancelling",
    groups: [8, 8],
    kind: "fraction",
    rule: "simplest",
    draw: (r) => {
      const g1 = pick(r, [2, 3]);
      const g2 = pick(r, [2, 3, 5]);
      const [a, b, c, d, e] = Array.from({ length: 5 }, () => between(r, 1, 4));
      const f = between(r, 2, 4);
      return [
        a ?? 1,
        (b ?? 1) * g1,
        g1 * (c ?? 1),
        (d ?? 1) * g2,
        g2 * (e ?? 1),
        f ?? 1,
      ];
    },
    valid: ([a = 0, b = 0, c = 0, d = 0, e = 0, f = 0]) => {
      const g1 = gcd(b, c);
      const g2 = gcd(d, e);
      return (
        g1 > 1 &&
        g2 > 1 &&
        gcd(((a * c) / g1) * (e / g2), (b / g1) * (d / g2) * f) === 1 &&
        (b / g1) * (d / g2) * f > 1
      );
    },
    solve: ([a = 0, b = 0, c = 0, d = 0, e = 0, f = 0]) =>
      q(a * c * e, b * d * f),
    ref: ([a = 0, b = 0, c = 0, d = 0, e = 0, f = 0]) =>
      q(a, b).mul(q(c, d)).mul(q(e, f)),
    traps: [
      [
        "two-fractions-only",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a * c, b * d),
      ],
      [
        "upside-down",
        "conceptual",
        ([a = 0, b = 0, c = 0, d = 0, e = 0, f = 0]) =>
          a * c * e === b * d * f ? null : q(b * d * f, a * c * e),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0, e = 0, f = 0]) => ({
      f1: fr(a, b),
      g1: fr(c, d),
      h1: fr(e, f),
      x: String(gcd(b, c)),
      y: String(gcd(d, e)),
    }),
  }),
];

const divideMore = [
  f8({
    id: "F8.divide-fraction.12",
    form: "the-speed-from-a-fractional-distance-and-time",
    groups: [8, 8],
    kind: "mixed",
    rule: "equivalent",
    roles: {
      a: "numerator of the distance",
      b: "denominator of the distance",
      c: "numerator of the time",
      d: "denominator of the time",
    },
    draw: (r) => [
      between(r, 1, 5),
      between(r, 2, 9),
      between(r, 1, 3),
      between(r, 2, 7),
    ],
    valid: ([a = 0, b = 0, c = 0, d = 0]) =>
      a < b &&
      c < d &&
      gcd(a, b) === 1 &&
      gcd(c, d) === 1 &&
      a * d > b * c &&
      gcd(a * d, b * c) === 1,
    solve: ([a = 0, b = 0, c = 0, d = 0]) => q(a, b).div(q(c, d)),
    ref: ([a = 0, b = 0, c = 0, d = 0]) => q(a * d, b * c),
    traps: [
      [
        "time-not-inverted",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a * c, b * d),
      ],
      [
        "inverted",
        "conceptual",
        ([a = 0, b = 0, c = 0, d = 0]) => q(b * c, a * d),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => ({ f: fr(a, b), g: fr(c, d) }),
  }),
  f8({
    id: "F8.divide-fraction.13",
    form: "divide-fractions-with-the-same-denominator",
    groups: [8, 8],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => [between(r, 3, 12), between(r, 2, 9), between(r, 10, 14)],
    valid: ([a = 0, b = 0, d = 0]) =>
      a < d && b < a && gcd(a, b) === 1 && gcd(a, d) === 1 && gcd(b, d) === 1,
    solve: ([a = 0, b = 0, d = 0]) => q(a, d).div(q(b, d)),
    ref: ([a = 0, b = 0]) => q(a, b),
    traps: [
      ["denominators-divided", "conceptual", () => q(1)],
      ["inverted", "conceptual", ([a = 0, b = 0]) => q(b, a)],
      [
        "multiplied-straight",
        "procedural",
        ([a = 0, b = 0, d = 0]) => q(a * b, d * d),
      ],
    ],
    extra: ([a = 0, b = 0, d = 0]) => ({ f: fr(a, d), g: fr(b, d) }),
  }),
  f8({
    id: "F8.divide-fraction.14",
    form: "how-many-whole-pieces-of-a-fractional-length-fit",
    groups: [8, 8],
    kind: "integer",
    roles: {
      a: "length of the ribbon",
      b: "numerator of the length of a piece",
      c: "denominator of the length of a piece",
    },
    draw: (r) => [
      between(r, 3, 12),
      pick(r, [2, 3, 5, 7]),
      pick(r, [3, 4, 5, 6, 7, 8, 9]),
    ],
    valid: ([a = 0, n = 0, d = 0]) =>
      n < d && gcd(n, d) === 1 && (a * d) % n !== 0,
    solve: ([a = 0, n = 0, d = 0]) => q(Math.floor((a * d) / n)),
    ref: ([a = 0, n = 0, d = 0]) => {
      let pieces = 0;
      while ((pieces + 1) * n <= a * d) pieces += 1;
      return q(pieces);
    },
    traps: [
      [
        "rounded-up",
        "procedural",
        ([a = 0, n = 0, d = 0]) => q(Math.ceil((a * d) / n)),
      ],
      [
        "multiplied",
        "procedural",
        ([a = 0, n = 0, d = 0]) =>
          Math.floor((a * n) / d) === Math.floor((a * d) / n) || a * n < d
            ? null
            : q(Math.floor((a * n) / d)),
      ],
    ],
    extra: ([, n = 0, d = 0]) => ({ f: fr(n, d) }),
  }),
  f8({
    id: "F8.divide-fraction.15",
    form: "how-many-times-a-small-fraction-fits-in-a-sum",
    groups: [8, 8],
    origin: {
      olympiad: "how many equal unit fractions fit in a sum, RES-4284",
    },
    kind: "integer",
    draw: (r) => [between(r, 2, 8), between(r, 3, 9)],
    valid: ([a = 0, b = 0]) => a !== b && lcm(a, b) <= 30,
    solve: ([a = 0, b = 0]) => q(lcm(a, b) / a + lcm(a, b) / b),
    ref: ([a = 0, b = 0]) =>
      q(1, a)
        .add(q(1, b))
        .div(q(1, lcm(a, b))),
    traps: [
      ["numerators-added", "procedural", () => q(2)],
      [
        "the-common-denominator",
        "conceptual",
        ([a = 0, b = 0]) => q(lcm(a, b)),
      ],
      ["denominators-added", "procedural", ([a = 0, b = 0]) => q(a + b)],
    ],
    extra: ([a = 0, b = 0]) => ({
      f: fr(1, a),
      h: fr(1, b),
      g: fr(1, lcm(a, b)),
      u: String(lcm(a, b)),
    }),
    consts: [1],
  }),
];

export const fSpecs3: readonly Spec<never>[] = [
  ...unlike,
  ...unlikeMore,
  ...unlikeS,
  ...unlikeSMore,
  ...times,
  ...timesMore,
  ...timesS,
  ...timesSMore,
  ...divide,
  ...divideMore,
];
