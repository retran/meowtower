// Domain F, part 2: equivalent fractions, simplifying, and adding and subtracting fractions with the same
// denominator and mixed numbers (RES-4284). The Dutch goals simplify and "complicate" fractions at group 7
// (tussendoelen) and add and subtract like fractions at group 7 too; mixed numbers come with 1S. A fraction is
// written `3⁄4` in a text. Texts are plain blanks in `content/tasks-f.ru.json`.
import { Q } from "../math/q.js";
import { between, pick } from "./draw.js";
import { forFraction, fr, q } from "./kitf.js";
import { SIGNS, type Spec } from "./spec.js";

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const sign = (x: Q, y: Q): (typeof SIGNS)[number] => SIGNS[x.cmp(y) + 1] ?? "=";
/** A mixed number `w n⁄d` as an exact number. */
const mix = (w: number, n: number, d: number): Q => q(w).add(q(n, d));
const mixText = (w: number, n: number, d: number): string => `${w} ${fr(n, d)}`;
const coprime = (a: number, b: number): boolean => gcd(a, b) === 1;

const f4 = forFraction("F4", "equivalent");
const equivalent = [
  f4({
    id: "F4.equivalent.01",
    form: "find-the-numerator-of-an-equal-fraction",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [between(r, 1, 5), between(r, 2, 8), between(r, 2, 6)],
    valid: ([n = 0, d = 0, k = 0]) => n < d && n + (d * k - d) !== n * k,
    solve: ([n = 0, , k = 0]) => q(n * k),
    ref: ([n = 0, d = 0, k = 0]) => q(n, d).mul(q(d * k)),
    traps: [
      ["same-gap", "conceptual", ([n = 0, d = 0, k = 0]) => q(n + (d * k - d))],
    ],
    extra: ([n = 0, d = 0, k = 0]) => ({ f: fr(n, d), e: String(d * k) }),
  }),
  f4({
    id: "F4.equivalent.02",
    form: "find-the-denominator-of-an-equal-fraction",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [between(r, 1, 5), between(r, 2, 8), between(r, 2, 6)],
    valid: ([n = 0, d = 0, k = 0]) => n < d && d + (n * k - n) !== d * k,
    solve: ([, d = 0, k = 0]) => q(d * k),
    ref: ([n = 0, d = 0, k = 0]) => q(n * k).div(q(n, d)),
    traps: [
      ["same-gap", "conceptual", ([n = 0, d = 0, k = 0]) => q(d + (n * k - n))],
    ],
    extra: ([n = 0, d = 0, k = 0]) => ({ f: fr(n, d), m: String(n * k) }),
  }),
  f4({
    id: "F4.equivalent.03",
    form: "write-a-fraction-equal-to-a-given-one",
    groups: [6, 7],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [between(r, 1, 5), between(r, 2, 8), between(r, 2, 5)],
    valid: ([n = 0, d = 0]) => n < d && coprime(n, d),
    solve: ([n = 0, d = 0]) => q(n, d),
    ref: ([n = 0, d = 0, k = 0]) => q(n * k, d * k),
    traps: [
      [
        "different-value",
        "conceptual",
        ([n = 0, d = 0, k = 0]) => q(n + k, d + k),
      ],
    ],
    extra: ([n = 0, d = 0, k = 0]) => ({ f: fr(n, d), e: String(d * k) }),
  }),
  f4({
    id: "F4.equivalent.04",
    form: "by-how-many-times-both-parts-grow",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [between(r, 1, 5), between(r, 2, 8), between(r, 2, 8)],
    valid: ([n = 0, d = 0, k = 0]) => n < d && coprime(n, d) && k !== d,
    solve: ([, , k = 0]) => q(k),
    ref: ([n = 0, , k = 0]) => q(n * k).div(q(n)),
    traps: [["difference", "procedural", ([n = 0, , k = 0]) => q(n * k - n)]],
    extra: ([n = 0, d = 0, k = 0]) => ({ f: fr(n, d), g: fr(n * k, d * k) }),
  }),
  f4({
    id: "F4.equivalent.05",
    form: "choose-the-fraction-that-is-equal",
    groups: [6, 7],
    kind: "choice",
    draw: (r) => [
      between(r, 1, 5),
      between(r, 2, 8),
      between(r, 2, 4),
      r.int(4),
    ],
    valid: ([n = 0, d = 0, k = 0]) =>
      n < d &&
      coprime(n, d) &&
      n + k < d + k &&
      new Set([fr(n * k, d * k), fr(n + k, d + k), fr(n * k, d), fr(n, d * k)])
        .size === 4,
    options: ([n = 0, d = 0, k = 0, by = 0]) => {
      const list = [
        fr(n * k, d * k),
        fr(n + k, d + k),
        fr(n * k, d),
        fr(n, d * k),
      ];
      return list.map((_, i) => list[(i + by) % 4] ?? "");
    },
    solve: ([n = 0, d = 0, k = 0]) => fr(n * k, d * k),
    ref: ([n = 0, d = 0, k = 0]) => fr(n * k, d * k),
    traps: [
      [
        "same-addend",
        "conceptual",
        ([n = 0, d = 0, k = 0]) => fr(n + k, d + k),
      ],
      [
        "only-the-numerator",
        "conceptual",
        ([n = 0, d = 0, k = 0]) => fr(n * k, d),
      ],
      [
        "only-the-denominator",
        "conceptual",
        ([n = 0, d = 0, k = 0]) => fr(n, d * k),
      ],
    ],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
  }),
  f4({
    id: "F4.equivalent.06",
    form: "a-fraction-written-in-hundredths",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [between(r, 1, 9), pick(r, [2, 4, 5, 10, 20, 25])],
    valid: ([n = 0, d = 0]) => n < d,
    solve: ([n = 0, d = 0]) => q((100 * n) / d),
    ref: ([n = 0, d = 0]) => q(n, d).mul(q(100)),
    traps: [["numerator-itself", "conceptual", ([n = 0]) => q(n)]],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
    consts: [100],
  }),
  f4({
    id: "F4.equivalent.07",
    form: "how-many-pieces-make-half-of-a-pizza",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [2 * between(r, 2, 6)],
    solve: ([e = 0]) => q(e / 2),
    ref: ([e = 0]) => q(1, 2).mul(q(e)),
    traps: [["all-pieces", "conceptual", ([e = 0]) => q(e)]],
  }),
  f4({
    id: "F4.equivalent.08",
    form: "continue-a-row-of-equal-fractions",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [between(r, 2, 5), between(r, 6, 9)],
    valid: ([n = 0, d = 0]) => n < d && coprime(n, d),
    solve: ([n = 0]) => q(4 * n),
    ref: ([n = 0]) => q(n + n + n + n),
    traps: [["step-of-one", "procedural", ([n = 0]) => q(3 * n + 1)]],
    extra: ([n = 0, d = 0]) => ({
      f: fr(n, d),
      g: fr(2 * n, 2 * d),
      h: fr(3 * n, 3 * d),
      e: String(4 * d),
    }),
  }),
  f4({
    id: "F4.equivalent.09",
    form: "find-the-smaller-numerator-of-an-equal-fraction",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [between(r, 1, 5), between(r, 2, 8), between(r, 2, 6)],
    valid: ([n = 0, d = 0]) => n < d && coprime(n, d),
    solve: ([n = 0]) => q(n),
    ref: ([n = 0, , k = 0]) => q(n * k).div(q(k)),
    traps: [
      ["the-large-numerator", "conceptual", ([n = 0, , k = 0]) => q(n * k)],
    ],
    extra: ([n = 0, d = 0, k = 0]) => ({ f: fr(n * k, d * k) }),
  }),
  f4({
    id: "F4.equivalent.10",
    form: "how-many-equal-fractions-have-a-small-denominator",
    groups: [7, 8],
    origin: { olympiad: "counting equal fractions, Kangaroo style (RES-4284)" },
    kind: "integer",
    draw: (r) => [1, pick(r, [2, 3, 4, 5, 6, 7]), between(r, 20, 40)],
    solve: ([, d = 0, c = 0]) => q(Math.floor(c / d)),
    ref: ([, d = 0, c = 0]) =>
      q(
        Array.from({ length: c }, (_, i) => i + 1).filter((x) => x % d === 0)
          .length,
      ),
    traps: [
      ["rounded-up", "procedural", ([, d = 0, c = 0]) => q(Math.ceil(c / d))],
    ],
    valid: ([, d = 0, c = 0]) => c % d !== 0,
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
  }),
  f4({
    id: "F4.equivalent.11",
    form: "a-fraction-of-an-hour-in-sixtieths",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [1, pick(r, [2, 3, 4, 5, 6, 10, 12])],
    solve: ([n = 0, d = 0]) => q((60 * n) / d),
    ref: ([n = 0, d = 0]) => q(n, d).mul(q(60)),
    traps: [["denominator-itself", "conceptual", ([, d = 0]) => q(d)]],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
    consts: [60],
  }),
];

const f4s = forFraction("F4", "simplify");
const COMPOSITE = [4, 6, 8, 9, 10, 12];
const simplify = [
  f4s({
    id: "F4.simplify.01",
    form: "reduce-a-fraction-to-lowest-terms",
    groups: [7, 7],
    kind: "fraction",
    rule: "simplest",
    draw: (r) => [between(r, 1, 5), between(r, 2, 7), pick(r, COMPOSITE)],
    valid: ([n = 0, d = 0]) => n < d && coprime(n, d),
    solve: ([n = 0, d = 0]) => q(n, d),
    ref: ([n = 0, d = 0, k = 0]) => q(n * k, d * k),
    traps: [
      [
        "reduced-only-halfway",
        "procedural",
        ([n = 0, d = 0, k = 0]) =>
          k % 2 === 0
            ? q((n * k) / 2, (d * k) / 2)
            : q((n * k) / 3, (d * k) / 3),
      ],
    ],
    extra: ([n = 0, d = 0, k = 0]) => ({ f: fr(n * k, d * k) }),
  }),
  f4s({
    id: "F4.simplify.02",
    form: "the-largest-number-to-cancel-by",
    groups: [7, 7],
    kind: "integer",
    draw: (r) => [between(r, 1, 5), between(r, 2, 7), pick(r, COMPOSITE)],
    valid: ([n = 0, d = 0]) => n < d && coprime(n, d),
    solve: ([, , k = 0]) => q(k),
    ref: ([n = 0, d = 0, k = 0]) => q(gcd(n * k, d * k)),
    traps: [
      [
        "smallest-common-factor",
        "procedural",
        ([, , k = 0]) => q(k % 2 === 0 ? 2 : 3),
      ],
    ],
    extra: ([n = 0, d = 0, k = 0]) => ({ f: fr(n * k, d * k) }),
  }),
  f4s({
    id: "F4.simplify.03",
    form: "the-numerator-after-reducing",
    groups: [7, 7],
    kind: "integer",
    draw: (r) => [between(r, 1, 5), between(r, 2, 7), pick(r, COMPOSITE)],
    valid: ([n = 0, d = 0]) => n < d && coprime(n, d),
    solve: ([n = 0]) => q(n),
    ref: ([n = 0, d = 0, k = 0]) => q(n * k).div(q(gcd(n * k, d * k))),
    traps: [["the-denominator", "conceptual", ([, d = 0]) => q(d)]],
    extra: ([n = 0, d = 0, k = 0]) => ({ f: fr(n * k, d * k) }),
  }),
  f4s({
    id: "F4.simplify.04",
    form: "take-the-wholes-out-of-an-improper-fraction",
    groups: [7, 8],
    kind: "mixed",
    rule: "simplest",
    draw: (r) => [between(r, 1, 6), between(r, 1, 6), between(r, 3, 9)],
    valid: ([, n = 0, d = 0]) => n < d && coprime(n, d),
    solve: ([w = 0, n = 0, d = 0]) => mix(w, n, d),
    ref: ([w = 0, n = 0, d = 0]) => q(w * d + n, d),
    traps: [["wholes-only", "conceptual", ([w = 0]) => q(w)]],
    extra: ([w = 0, n = 0, d = 0]) => ({
      f: fr(w * d + n, d),
      nn: String(w * d + n),
    }),
  }),
  f4s({
    id: "F4.simplify.05",
    form: "write-a-mixed-number-as-an-improper-fraction",
    groups: [7, 8],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [between(r, 1, 6), between(r, 1, 6), between(r, 3, 9)],
    valid: ([, n = 0, d = 0]) => n < d,
    solve: ([w = 0, n = 0, d = 0]) => q(w * d + n, d),
    ref: ([w = 0, n = 0, d = 0]) => mix(w, n, d),
    traps: [
      [
        "whole-times-numerator",
        "procedural",
        ([w = 0, n = 0, d = 0]) => q(w * n, d),
      ],
    ],
    extra: ([w = 0, n = 0, d = 0]) => ({ m: mixText(w, n, d) }),
  }),
  f4s({
    id: "F4.simplify.06",
    form: "a-part-of-a-class-in-lowest-terms",
    groups: [7, 7],
    kind: "fraction",
    rule: "simplest",
    draw: (r) => [pick(r, [4, 6, 8, 9, 10, 12]), pick(r, [15, 18, 20, 24, 30])],
    valid: ([a = 0, b = 0]) => a < b && gcd(a, b) > 1,
    solve: ([a = 0, b = 0]) => q(a, b),
    ref: ([a = 0, b = 0]) => q(a / gcd(a, b), b / gcd(a, b)),
    traps: [["the-other-part", "conceptual", ([a = 0, b = 0]) => q(b - a, b)]],
  }),
  f4s({
    id: "F4.simplify.07",
    form: "hundredths-in-lowest-terms",
    groups: [7, 8],
    kind: "fraction",
    rule: "simplest",
    draw: (r) => [pick(r, [5, 15, 25, 35, 45, 55, 65, 75, 85, 95])],
    solve: ([n = 0]) => q(n, 100),
    ref: ([n = 0]) => q(n / gcd(n, 100), 100 / gcd(n, 100)),
    traps: [
      [
        "cancelled-only-by-five",
        "procedural",
        ([n = 0]) => (gcd(n / 5, 20) > 1 ? q(n / 5, 20) : null),
      ],
    ],
    extra: ([n = 0]) => ({ f: fr(n, 100) }),
    consts: [100],
  }),
  f4s({
    id: "F4.simplify.08",
    form: "reduce-to-a-unit-fraction",
    groups: [7, 7],
    kind: "fraction",
    rule: "simplest",
    draw: (r) => [between(r, 2, 6), between(r, 2, 6)],
    valid: ([m = 0, k = 0]) => m !== k,
    solve: ([, k = 0]) => q(1, k),
    ref: ([m = 0, k = 0]) => q(m, m * k),
    traps: [["upside-down", "conceptual", ([, k = 0]) => q(k)]],
    extra: ([m = 0, k = 0]) => ({ f: fr(m, m * k) }),
    consts: [1],
  }),
  f4s({
    id: "F4.simplify.09",
    form: "minutes-as-a-fraction-of-an-hour-in-lowest-terms",
    groups: [7, 7],
    kind: "fraction",
    rule: "simplest",
    draw: (r) => [pick(r, [10, 15, 20, 30, 45, 50])],
    solve: ([m = 0]) => q(m, 60),
    ref: ([m = 0]) => q(m / gcd(m, 60), 60 / gcd(m, 60)),
    traps: [["out-of-a-hundred", "conceptual", ([m = 0]) => q(m, 100)]],
    consts: [60, 100],
  }),
  f4s({
    id: "F4.simplify.10",
    form: "how-many-fractions-are-already-in-lowest-terms",
    groups: [7, 8],
    kind: "integer",
    draw: (r) => [
      between(r, 1, 8),
      between(r, 2, 12),
      between(r, 1, 8),
      between(r, 2, 12),
      between(r, 1, 8),
      between(r, 2, 12),
      between(r, 1, 8),
      between(r, 2, 12),
    ],
    valid: ([a = 0, b = 0, c = 0, d = 0, e = 0, f = 0, g = 0, h = 0]) =>
      a < b &&
      c < d &&
      e < f &&
      g < h &&
      [coprime(a, b), coprime(c, d), coprime(e, f), coprime(g, h)].filter(
        Boolean,
      ).length %
        4 !==
        0,
    solve: ([a = 0, b = 0, c = 0, d = 0, e = 0, f = 0, g = 0, h = 0]) =>
      q(
        [coprime(a, b), coprime(c, d), coprime(e, f), coprime(g, h)].filter(
          Boolean,
        ).length,
      ),
    ref: ([a = 0, b = 0, c = 0, d = 0, e = 0, f = 0, g = 0, h = 0]) =>
      q(
        [
          [a, b],
          [c, d],
          [e, f],
          [g, h],
        ].reduce((acc, [n = 0, m = 0]) => (gcd(n, m) === 1 ? acc + 1 : acc), 0),
      ),
    traps: [
      [
        "counted-the-reducible",
        "conceptual",
        ([a = 0, b = 0, c = 0, d = 0, e = 0, f = 0, g = 0, h = 0]) =>
          q(
            4 -
              [
                coprime(a, b),
                coprime(c, d),
                coprime(e, f),
                coprime(g, h),
              ].filter(Boolean).length,
          ),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0, e = 0, f = 0, g = 0, h = 0]) => ({
      list: [fr(a, b), fr(c, d), fr(e, f), fr(g, h)].join("; "),
    }),
    consts: [1],
  }),
  f4s({
    id: "F4.simplify.11",
    form: "how-many-wholes-an-improper-fraction-holds",
    groups: [7, 8],
    kind: "integer",
    draw: (r) => [between(r, 11, 59), between(r, 3, 9)],
    valid: ([n = 0, d = 0]) => n > d && n % d !== 0,
    solve: ([n = 0, d = 0]) => q(Math.floor(n / d)),
    ref: ([n = 0, d = 0]) => q((n - (n % d)) / d),
    traps: [["the-remainder", "conceptual", ([n = 0, d = 0]) => q(n % d)]],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
  }),
];

const f5 = forFraction("F5", "add-same-den");
const addLike = [
  f5({
    id: "F5.add-same-den.01",
    form: "add-two-like-fractions-with-a-sum-below-one",
    groups: [7, 7],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [between(r, 1, 5), between(r, 1, 5), between(r, 7, 12)],
    valid: ([a = 0, b = 0, d = 0]) => a + b < d,
    solve: ([a = 0, b = 0, d = 0]) => q(a + b, d),
    ref: ([a = 0, b = 0, d = 0]) => q(a, d).add(q(b, d)),
    traps: [
      [
        "denominators-added",
        "procedural",
        ([a = 0, b = 0, d = 0]) => q(a + b, 2 * d),
      ],
    ],
    extra: ([a = 0, b = 0, d = 0]) => ({ f: fr(a, d), g: fr(b, d) }),
  }),
  f5({
    id: "F5.add-same-den.02",
    form: "subtract-two-like-fractions",
    groups: [7, 7],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [between(r, 3, 9), between(r, 1, 5), between(r, 7, 12)],
    valid: ([a = 0, b = 0, d = 0]) => a > b && a < d,
    solve: ([a = 0, b = 0, d = 0]) => q(a - b, d),
    ref: ([a = 0, b = 0, d = 0]) => q(a, d).sub(q(b, d)),
    traps: [
      [
        "numerators-added",
        "procedural",
        ([a = 0, b = 0, d = 0]) => q(a + b, d),
      ],
    ],
    extra: ([a = 0, b = 0, d = 0]) => ({ f: fr(a, d), g: fr(b, d) }),
  }),
  f5({
    id: "F5.add-same-den.03",
    form: "add-like-fractions-with-a-sum-above-one",
    groups: [7, 7],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => [between(r, 4, 9), between(r, 4, 9), between(r, 7, 12)],
    valid: ([a = 0, b = 0, d = 0]) => a < d && b < d && a + b > d,
    solve: ([a = 0, b = 0, d = 0]) => q(a + b, d),
    ref: ([a = 0, b = 0, d = 0]) => q(a, d).add(q(b, d)),
    traps: [
      [
        "denominators-added",
        "procedural",
        ([a = 0, b = 0, d = 0]) => q(a + b, 2 * d),
      ],
    ],
    extra: ([a = 0, b = 0, d = 0]) => ({ f: fr(a, d), g: fr(b, d) }),
  }),
  f5({
    id: "F5.add-same-den.04",
    form: "the-fraction-that-completes-one",
    groups: [7, 7],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [between(r, 1, 6), between(r, 7, 12)],
    valid: ([a = 0, d = 0]) => a < d && a !== d - a,
    solve: ([a = 0, d = 0]) => q(d - a, d),
    ref: ([a = 0, d = 0]) => q(1).sub(q(a, d)),
    traps: [["the-given-fraction", "conceptual", ([a = 0, d = 0]) => q(a, d)]],
    extra: ([a = 0, d = 0]) => ({ f: fr(a, d) }),
    consts: [1],
  }),
  f5({
    id: "F5.add-same-den.05",
    form: "two-portions-of-milk-in-litres",
    groups: [7, 7],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [between(r, 1, 4), between(r, 1, 4), between(r, 6, 10)],
    valid: ([a = 0, b = 0, d = 0]) => a + b < d,
    solve: ([a = 0, b = 0, d = 0]) => q(a + b, d),
    ref: ([a = 0, b = 0, d = 0]) => q(a, d).add(q(b, d)),
    traps: [
      [
        "denominators-added",
        "procedural",
        ([a = 0, b = 0, d = 0]) => q(a + b, 2 * d),
      ],
    ],
    extra: ([a = 0, b = 0, d = 0]) => ({ f: fr(a, d), g: fr(b, d) }),
  }),
  f5({
    id: "F5.add-same-den.06",
    form: "one-minus-a-fraction",
    groups: [7, 7],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [between(r, 2, 8), between(r, 7, 12)],
    valid: ([a = 0, d = 0]) => a < d && a !== d - a,
    solve: ([a = 0, d = 0]) => q(d - a, d),
    ref: ([a = 0, d = 0]) => q(d, d).sub(q(a, d)),
    traps: [
      ["numerator-minus-one", "procedural", ([a = 0, d = 0]) => q(a - 1, d)],
    ],
    extra: ([a = 0, d = 0]) => ({ f: fr(a, d) }),
    consts: [1],
  }),
  f5({
    id: "F5.add-same-den.07",
    form: "add-three-like-fractions",
    groups: [7, 7],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => [
      between(r, 2, 6),
      between(r, 2, 6),
      between(r, 2, 6),
      between(r, 7, 10),
    ],
    valid: ([a = 0, b = 0, c = 0, d = 0]) =>
      a + b + c > d && new Set([a, b, c]).size > 1,
    solve: ([a = 0, b = 0, c = 0, d = 0]) => q(a + b + c, d),
    ref: ([a = 0, b = 0, c = 0, d = 0]) => q(a, d).add(q(b, d)).add(q(c, d)),
    traps: [
      [
        "two-fractions-only",
        "procedural",
        ([a = 0, b = 0, , d = 0]) => q(a + b, d),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => ({
      f: fr(a, d),
      g: fr(b, d),
      h: fr(c, d),
    }),
  }),
  f5({
    id: "F5.add-same-den.08",
    form: "three-wholes-minus-a-fraction",
    groups: [7, 8],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => [between(r, 1, 6), between(r, 7, 12)],
    valid: ([a = 0, d = 0]) => a < d,
    solve: ([a = 0, d = 0]) => q(3 * d - a, d),
    ref: ([a = 0, d = 0]) => q(3).sub(q(a, d)),
    traps: [
      ["only-the-fraction-part", "conceptual", ([a = 0, d = 0]) => q(d - a, d)],
    ],
    extra: ([a = 0, d = 0]) => ({ f: fr(a, d) }),
    consts: [3],
  }),
  f5({
    id: "F5.add-same-den.09",
    form: "what-is-left-after-two-portions",
    groups: [7, 7],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [
      between(r, 7, 11),
      between(r, 1, 3),
      between(r, 1, 3),
      between(r, 12, 14),
    ],
    valid: ([x = 0, a = 0, b = 0, d = 0]) => x < d && x - a - b > 0 && a !== b,
    solve: ([x = 0, a = 0, b = 0, d = 0]) => q(x - a - b, d),
    ref: ([x = 0, a = 0, b = 0, d = 0]) => q(x, d).sub(q(a, d)).sub(q(b, d)),
    traps: [
      [
        "second-portion-added",
        "procedural",
        ([x = 0, a = 0, b = 0, d = 0]) => q(x - a + b, d),
      ],
    ],
    extra: ([x = 0, a = 0, b = 0, d = 0]) => ({
      f: fr(x, d),
      g: fr(a, d),
      h: fr(b, d),
    }),
  }),
  f5({
    id: "F5.add-same-den.10",
    form: "how-many-parts-are-missing-to-one",
    groups: [7, 7],
    kind: "integer",
    draw: (r) => [between(r, 1, 6), between(r, 7, 12)],
    valid: ([a = 0, d = 0]) => a < d && a !== d - a,
    solve: ([a = 0, d = 0]) => q(d - a),
    ref: ([a = 0, d = 0]) => q(d).sub(q(a)),
    traps: [["the-given-numerator", "conceptual", ([a = 0]) => q(a)]],
    extra: ([a = 0, d = 0]) => ({ f: fr(a, d) }),
  }),
  f5({
    id: "F5.add-same-den.11",
    form: "a-fraction-added-to-itself",
    groups: [7, 7],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => [between(r, 3, 8), between(r, 7, 12)],
    valid: ([a = 0, d = 0]) => a < d && 2 * a > d,
    solve: ([a = 0, d = 0]) => q(2 * a, d),
    ref: ([a = 0, d = 0]) => q(a, d).add(q(a, d)),
    traps: [
      ["denominators-added", "procedural", ([a = 0, d = 0]) => q(2 * a, 2 * d)],
    ],
    extra: ([a = 0, d = 0]) => ({ f: fr(a, d) }),
  }),
];

const f5m = forFraction("F5", "mixed");
const mixedNumbers = [
  f5m({
    id: "F5.mixed.01",
    form: "an-improper-fraction-as-a-mixed-number",
    groups: [7, 8],
    kind: "mixed",
    rule: "simplest",
    draw: (r) => [between(r, 1, 5), between(r, 1, 6), between(r, 4, 9)],
    valid: ([, n = 0, d = 0]) => n < d && coprime(n, d),
    solve: ([w = 0, n = 0, d = 0]) => mix(w, n, d),
    ref: ([w = 0, n = 0, d = 0]) => q(w * d + n, d),
    traps: [["wholes-only", "conceptual", ([w = 0]) => q(w)]],
    extra: ([w = 0, n = 0, d = 0]) => ({ f: fr(w * d + n, d) }),
  }),
  f5m({
    id: "F5.mixed.02",
    form: "a-mixed-number-as-an-improper-fraction",
    groups: [7, 8],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [between(r, 1, 5), between(r, 1, 6), between(r, 4, 9)],
    valid: ([, n = 0, d = 0]) => n < d,
    solve: ([w = 0, n = 0, d = 0]) => q(w * d + n, d),
    ref: ([w = 0, n = 0, d = 0]) => mix(w, n, d),
    traps: [
      [
        "wholes-added-to-numerator",
        "procedural",
        ([w = 0, n = 0, d = 0]) => q(w + n, d),
      ],
    ],
    extra: ([w = 0, n = 0, d = 0]) => ({ m: mixText(w, n, d) }),
  }),
  f5m({
    id: "F5.mixed.03",
    form: "add-two-mixed-numbers-without-a-carry",
    groups: [7, 8],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => [
      between(r, 1, 4),
      between(r, 1, 3),
      between(r, 1, 4),
      between(r, 1, 3),
      between(r, 7, 10),
    ],
    valid: ([, a = 0, , b = 0, d = 0]) => a + b < d,
    solve: ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) => mix(w1 + w2, a + b, d),
    ref: ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) =>
      mix(w1, a, d).add(mix(w2, b, d)),
    traps: [["wholes-only", "conceptual", ([w1 = 0, , w2 = 0]) => q(w1 + w2)]],
    extra: ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) => ({
      m: mixText(w1, a, d),
      k: mixText(w2, b, d),
    }),
  }),
  f5m({
    id: "F5.mixed.04",
    form: "add-two-mixed-numbers-with-a-carry",
    groups: [7, 8],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => [
      between(r, 1, 4),
      between(r, 4, 7),
      between(r, 1, 4),
      between(r, 4, 7),
      between(r, 8, 10),
    ],
    valid: ([, a = 0, , b = 0, d = 0]) => a < d && b < d && a + b > d,
    solve: ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) => mix(w1 + w2, a + b, d),
    ref: ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) =>
      mix(w1, a, d).add(mix(w2, b, d)),
    traps: [
      [
        "carry-lost",
        "procedural",
        ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) => mix(w1 + w2, a + b - d, d),
      ],
    ],
    extra: ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) => ({
      m: mixText(w1, a, d),
      k: mixText(w2, b, d),
    }),
  }),
  f5m({
    id: "F5.mixed.05",
    form: "subtract-mixed-numbers-without-borrowing",
    groups: [7, 8],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => [
      between(r, 3, 6),
      between(r, 4, 7),
      between(r, 1, 2),
      between(r, 1, 3),
      between(r, 8, 10),
    ],
    valid: ([, a = 0, , b = 0, d = 0]) => a > b && a < d,
    solve: ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) => mix(w1 - w2, a - b, d),
    ref: ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) =>
      mix(w1, a, d).sub(mix(w2, b, d)),
    traps: [
      [
        "numerators-added",
        "procedural",
        ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) => mix(w1 - w2, a + b, d),
      ],
    ],
    extra: ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) => ({
      m: mixText(w1, a, d),
      k: mixText(w2, b, d),
    }),
  }),
  f5m({
    id: "F5.mixed.06",
    form: "subtract-mixed-numbers-with-borrowing",
    groups: [7, 8],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => [
      between(r, 3, 6),
      between(r, 1, 3),
      between(r, 1, 2),
      between(r, 4, 7),
      between(r, 8, 10),
    ],
    valid: ([, a = 0, , b = 0, d = 0]) => a < b && b < d,
    solve: ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) =>
      mix(w1, a, d).sub(mix(w2, b, d)),
    ref: ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) => q((w1 - w2) * d + a - b, d),
    traps: [
      [
        "smaller-from-larger",
        "procedural",
        ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) => mix(w1 - w2, b - a, d),
      ],
    ],
    extra: ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) => ({
      m: mixText(w1, a, d),
      k: mixText(w2, b, d),
    }),
  }),
  f5m({
    id: "F5.mixed.07",
    form: "a-whole-number-and-a-fraction-as-one-number",
    groups: [7, 8],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => [between(r, 1, 6), between(r, 1, 4), between(r, 5, 9)],
    valid: ([, n = 0, d = 0]) => n < d,
    solve: ([w = 0, n = 0, d = 0]) => mix(w, n, d),
    ref: ([w = 0, n = 0, d = 0]) => q(w).add(q(n, d)),
    traps: [
      ["multiplied", "procedural", ([w = 0, n = 0, d = 0]) => q(w * n, d)],
    ],
    extra: ([, n = 0, d = 0]) => ({ f: fr(n, d) }),
  }),
  f5m({
    id: "F5.mixed.08",
    form: "how-many-wholes-in-a-fraction-above-one",
    groups: [7, 8],
    kind: "integer",
    draw: (r) => [between(r, 11, 49), between(r, 3, 8)],
    valid: ([n = 0, d = 0]) => n > d && n % d !== 0,
    solve: ([n = 0, d = 0]) => q(Math.floor(n / d)),
    ref: ([n = 0, d = 0]) => q((n - (n % d)) / d),
    traps: [
      [
        "rounded-up",
        "procedural",
        ([n = 0, d = 0]) => q(Math.floor(n / d) + 1),
      ],
    ],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
  }),
  f5m({
    id: "F5.mixed.09",
    form: "compare-two-mixed-numbers",
    groups: [7, 8],
    kind: "compare",
    draw: (r) => [
      between(r, 1, 5),
      between(r, 1, 6),
      between(r, 1, 5),
      between(r, 1, 6),
      between(r, 7, 10),
    ],
    valid: ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) =>
      a < d &&
      b < d &&
      w1 !== w2 &&
      sign(q(a, d), q(b, d)) !== sign(q(w1), q(w2)),
    solve: ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) =>
      sign(mix(w1, a, d), mix(w2, b, d)),
    ref: ([w1 = 0, a = 0, w2 = 0, b = 0]) =>
      w1 !== w2 ? (w1 < w2 ? "<" : ">") : a < b ? "<" : a > b ? ">" : "=",
    traps: [
      [
        "fractional-parts-only",
        "conceptual",
        ([, a = 0, , b = 0]) => (a < b ? "<" : a > b ? ">" : "="),
      ],
    ],
    extra: ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) => ({
      m: mixText(w1, a, d),
      k: mixText(w2, b, d),
      sign: sign(mix(w1, a, d), mix(w2, b, d)),
    }),
  }),
  f5m({
    id: "F5.mixed.10",
    form: "the-total-length-of-two-pieces-in-metres",
    groups: [7, 8],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => [
      between(r, 1, 4),
      between(r, 3, 6),
      between(r, 1, 4),
      between(r, 3, 6),
      between(r, 7, 9),
    ],
    valid: ([, a = 0, , b = 0, d = 0]) => a < d && b < d && a + b > d,
    solve: ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) => mix(w1 + w2, a + b, d),
    ref: ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) =>
      q(w1 * d + a + w2 * d + b, d),
    traps: [
      [
        "carry-lost",
        "procedural",
        ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) => mix(w1 + w2, a + b - d, d),
      ],
    ],
    extra: ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) => ({
      m: mixText(w1, a, d),
      k: mixText(w2, b, d),
    }),
  }),
  f5m({
    id: "F5.mixed.11",
    form: "how-many-parts-a-mixed-number-holds",
    groups: [7, 8],
    kind: "integer",
    draw: (r) => [between(r, 1, 5), between(r, 1, 4), between(r, 5, 9)],
    valid: ([, n = 0, d = 0]) => n < d,
    solve: ([w = 0, n = 0, d = 0]) => q(w * d + n),
    ref: ([w = 0, n = 0, d = 0]) => mix(w, n, d).mul(q(d)),
    traps: [
      ["wholes-added-to-numerator", "procedural", ([w = 0, n = 0]) => q(w + n)],
    ],
    extra: ([w = 0, n = 0, d = 0]) => ({ m: mixText(w, n, d), u: fr(1, d) }),
  }),
];

export const fSpecs2: readonly Spec<never>[] = [
  ...equivalent,
  ...simplify,
  ...addLike,
  ...mixedNumbers,
];
