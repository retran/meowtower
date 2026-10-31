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
/** A mixed number as a text, or just the fraction when there are no wholes. */
const mixOr = (w: number, n: number, d: number): string =>
  w === 0 ? fr(n, d) : mixText(w, n, d);

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
      ["numerator-unchanged", "conceptual", ([n = 0]) => q(n)],
      [
        "the-denominator",
        "conceptual",
        ([n = 0, d = 0, k = 0]) =>
          n + (d * k - d) === d * k ? null : q(d * k),
      ],
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
      [
        "denominator-unchanged",
        "conceptual",
        ([n = 0, d = 0, k = 0]) => (n * k === d ? null : q(d)),
      ],
      ["the-given-numerator", "conceptual", ([n = 0, , k = 0]) => q(n * k)],
    ],
    extra: ([n = 0, d = 0, k = 0]) => ({ f: fr(n, d), m: String(n * k) }),
  }),
  f4({
    id: "F4.equivalent.03",
    form: "write-a-fraction-equal-to-a-given-one",
    groups: [6, 7],
    kind: "pair",
    draw: (r) => [between(r, 1, 5), between(r, 2, 8), between(r, 2, 5)],
    valid: ([n = 0, d = 0]) => n < d && coprime(n, d),
    solve: ([n = 0, d = 0, k = 0]) => [q(n * k), q(d * k)],
    ref: ([n = 0, d = 0, k = 0]) => {
      let x = 0;
      while (x * d < n * d * k) x += 1;
      return [q(x), q(d * k)];
    },
    traps: [
      [
        "numerator-unchanged",
        "conceptual",
        ([n = 0, d = 0, k = 0]) => [q(n), q(d * k)],
      ],
      [
        "same-difference",
        "conceptual",
        ([n = 0, d = 0, k = 0]) => [q(n + d * k - d), q(d * k)],
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
    traps: [
      ["difference", "procedural", ([n = 0, , k = 0]) => q(n * k - n)],
      [
        "the-new-numerator",
        "conceptual",
        ([n = 0, d = 0, k = 0]) => (n * k === d * k - d ? null : q(n * k)),
      ],
      [
        "denominator-difference",
        "procedural",
        ([, d = 0, k = 0]) => q(d * k - d),
      ],
    ],
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
    ref: ([n = 0, d = 0, k = 0]) => {
      const pairs = [
        [n * k, d * k],
        [n + k, d + k],
        [n * k, d],
        [n, d * k],
      ] as const;
      const [top = 0, bottom = 1] =
        pairs.find(([x, y]) => x * d === n * y) ?? [];
      return fr(top, bottom);
    },
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
    ref: ([n = 0, d = 0]) => q(100).div(q(d)).mul(q(n)),
    traps: [
      ["numerator-itself", "conceptual", ([n = 0]) => q(n)],
      ["times-hundred", "procedural", ([n = 0]) => q(100 * n)],
      ["same-gap", "conceptual", ([n = 0, d = 0]) => q(n + 100 - d)],
    ],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
    consts: [100],
  }),
  f4({
    id: "F4.equivalent.07",
    form: "how-many-pieces-make-half-of-a-pizza",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [2 * between(r, 2, 8)],
    solve: ([e = 0]) => q(e / 2),
    ref: ([e = 0]) => {
      let x = 0;
      while (x + x < e) x += 1;
      return q(x);
    },
    traps: [
      ["all-pieces", "conceptual", ([e = 0]) => q(e)],
      ["doubled", "procedural", ([e = 0]) => q(2 * e)],
      ["a-quarter", "conceptual", ([e = 0]) => (e % 4 === 0 ? q(e / 4) : null)],
    ],
  }),
  f4({
    id: "F4.equivalent.08",
    form: "continue-a-row-of-equal-fractions",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [between(r, 2, 5), between(r, 6, 9)],
    valid: ([n = 0, d = 0]) => n < d && coprime(n, d),
    solve: ([n = 0]) => q(4 * n),
    ref: ([n = 0, d = 0]) => q(n, d).mul(q(4 * d)),
    traps: [
      ["step-of-one", "procedural", ([n = 0]) => q(3 * n + 1)],
      ["last-numerator-repeated", "conceptual", ([n = 0]) => q(3 * n)],
      ["the-denominator", "conceptual", ([, d = 0]) => q(4 * d)],
    ],
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
    ref: ([n = 0, d = 0, k = 0]) => q(n * k, d * k).mul(q(d)),
    traps: [
      ["the-large-numerator", "conceptual", ([n = 0, , k = 0]) => q(n * k)],
      [
        "same-gap-subtracted",
        "conceptual",
        ([n = 0, d = 0, k = 0]) => {
          const w = n * k - (d * k - d);
          return w > 0 ? q(w) : null;
        },
      ],
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
      [
        "first-fraction-skipped",
        "procedural",
        ([, d = 0, c = 0]) =>
          Math.floor(c / d) > 1 ? q(Math.floor(c / d) - 1) : null,
      ],
      [
        "largest-denominator",
        "conceptual",
        ([, d = 0, c = 0]) => q(d * Math.floor(c / d)),
      ],
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
    ref: ([n = 0, d = 0]) => {
      let x = 0;
      while (x * d < 60 * n) x += 1;
      return q(x);
    },
    traps: [
      ["denominator-itself", "conceptual", ([, d = 0]) => q(d)],
      ["multiplied", "procedural", ([, d = 0]) => q(60 * d)],
      ["whole-hour", "conceptual", () => q(60)],
    ],
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
    ref: ([n = 0, d = 0, k = 0]) => {
      let x = n * k;
      let y = d * k;
      for (let p = 2; p <= x;) {
        if (x % p === 0 && y % p === 0) {
          x /= p;
          y /= p;
        } else p += 1;
      }
      return q(x, y);
    },
    traps: [
      [
        "divided-only-the-numerator",
        "procedural",
        ([n = 0, d = 0, k = 0]) => q(n, d * k),
      ],
      [
        "divided-only-the-denominator",
        "procedural",
        ([n = 0, d = 0, k = 0]) => ((n * k) % d === 0 ? null : q(n * k, d)),
      ],
      [
        "subtracted-the-same-number",
        "conceptual",
        ([n = 0, d = 0]) => (n === 1 ? null : q(n - 1, d - 1)),
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
      [
        "half-of-the-largest",
        "conceptual",
        ([, , k = 0]) => (k % 2 === 0 && k !== 4 ? q(k / 2) : null),
      ],
      ["the-reduced-numerator", "conceptual", ([n = 0]) => q(n)],
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
    solve: ([n = 0, , k = 0]) => q((n * k) / (k % 2 === 0 ? 2 : 3)),
    ref: ([n = 0, , k = 0]) => q(n * k).div(q(k % 2 === 0 ? 2 : 3)),
    traps: [
      ["reduced-fully", "conceptual", ([n = 0]) => q(n)],
      [
        "numerator-minus-the-divisor",
        "procedural",
        ([n = 0, , k = 0]) => {
          const m = k % 2 === 0 ? 2 : 3;
          return n * k - m === (n * k) / m ? null : q(n * k - m);
        },
      ],
      [
        "the-denominator-divided",
        "conceptual",
        ([, d = 0, k = 0]) => q((d * k) / (k % 2 === 0 ? 2 : 3)),
      ],
    ],
    extra: ([n = 0, d = 0, k = 0]) => ({
      f: fr(n * k, d * k),
      m: String(k % 2 === 0 ? 2 : 3),
    }),
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
    traps: [
      ["wholes-only", "conceptual", ([w = 0]) => q(w)],
      ["remainder-only", "conceptual", ([, n = 0, d = 0]) => q(n, d)],
      [
        "swapped-parts",
        "conceptual",
        ([w = 0, n = 0, d = 0]) =>
          w === n || gcd(w, d) > 1 ? null : mix(n, w, d),
      ],
    ],
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
      [
        "wholes-added-to-numerator",
        "procedural",
        ([w = 0, n = 0, d = 0]) =>
          w * n === w + n || (w + n) % d === 0 ? null : q(w + n, d),
      ],
      [
        "denominator-also-multiplied",
        "conceptual",
        ([w = 0, n = 0, d = 0]) => q(w * d + n, w * d),
      ],
    ],
    extra: ([w = 0, n = 0, d = 0]) => ({
      m: mixText(w, n, d),
      r: fr(w * d + n, d),
    }),
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
    traps: [
      ["the-other-part", "conceptual", ([a = 0, b = 0]) => q(b - a, b)],
      ["against-the-boys", "conceptual", ([a = 0, b = 0]) => q(a, b - a)],
      [
        "cancelled-top-only",
        "procedural",
        ([a = 0, b = 0]) => q(a / gcd(a, b), b),
      ],
    ],
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
      ["divided-only-the-numerator", "procedural", ([n = 0]) => q(n / 5, 100)],
      ["divided-only-the-denominator", "procedural", ([n = 0]) => q(n, 20)],
      ["crossed-out-a-zero", "conceptual", ([n = 0]) => q(n, 10)],
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
    ref: ([m = 0, k = 0]) => q(1).div(q(m * k, m)),
    traps: [
      ["upside-down", "conceptual", ([, k = 0]) => q(k)],
      [
        "denominator-only-cancelled",
        "procedural",
        ([m = 0, k = 0]) => (m === k * k ? null : q(m, k)),
      ],
      [
        "numerator-only-cancelled",
        "procedural",
        ([m = 0, k = 0]) => q(1, m * k),
      ],
    ],
    extra: ([m = 0, k = 0]) => ({ f: fr(m, m * k) }),
    consts: [1],
  }),
  f4s({
    id: "F4.simplify.09",
    form: "minutes-as-a-fraction-of-an-hour-in-lowest-terms",
    groups: [7, 7],
    kind: "fraction",
    rule: "simplest",
    draw: (r) => [pick(r, [5, 10, 12, 15, 20, 25, 30, 40, 45, 50])],
    solve: ([m = 0]) => q(m, 60),
    ref: ([m = 0]) => q(m / gcd(m, 60), 60 / gcd(m, 60)),
    traps: [
      ["out-of-a-hundred", "conceptual", ([m = 0]) => q(m, 100)],
      [
        "cancelled-numerator-only",
        "procedural",
        ([m = 0]) => q(m / gcd(m, 60), 60),
      ],
      [
        "cancelled-denominator-only",
        "procedural",
        ([m = 0]) =>
          m % (60 / gcd(m, 60)) === 0 ? null : q(m, 60 / gcd(m, 60)),
      ],
    ],
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
      new Set([fr(a, b), fr(c, d), fr(e, f), fr(g, h)]).size === 4 &&
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
        ].reduce((acc, [n = 0, m = 0]) => {
          let shared = false;
          for (let t = 2; t <= n; t += 1)
            if (n % t === 0 && m % t === 0) shared = true;
          return shared ? acc : acc + 1;
        }, 0),
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
      [
        "reduced-only-by-two",
        "conceptual",
        ([a = 0, b = 0, c = 0, d = 0, e = 0, f = 0, g = 0, h = 0]) => {
          const ps = [
            [a, b],
            [c, d],
            [e, f],
            [g, h],
          ];
          const even = ps.filter(
            ([x = 0, y = 0]) => x % 2 === 0 && y % 2 === 0,
          );
          const reducible = ps.filter(([x = 0, y = 0]) => gcd(x, y) > 1);
          return 4 - even.length === reducible.length
            ? null
            : q(4 - even.length);
        },
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
    traps: [
      ["the-remainder", "conceptual", ([n = 0, d = 0]) => q(n % d)],
      [
        "rounded-up",
        "procedural",
        ([n = 0, d = 0]) =>
          Math.floor(n / d) + 1 === n % d ? null : q(Math.floor(n / d) + 1),
      ],
    ],
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
      ["dropped-the-denominator", "conceptual", ([a = 0, b = 0]) => q(a + b)],
      [
        "subtracted",
        "procedural",
        ([a = 0, b = 0, d = 0]) => (a === b ? null : q(Math.abs(a - b), d)),
      ],
    ],
    extra: ([a = 0, b = 0, d = 0]) => ({
      f: fr(a, d),
      g: fr(b, d),
      r: fr(a + b, d),
    }),
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
      ["dropped-the-denominator", "conceptual", ([a = 0, b = 0]) => q(a - b)],
    ],
    extra: ([a = 0, b = 0, d = 0]) => ({
      f: fr(a, d),
      g: fr(b, d),
      r: fr(a - b, d),
    }),
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
      ["dropped-the-denominator", "conceptual", ([a = 0, b = 0]) => q(a + b)],
      ["whole-lost", "conceptual", ([a = 0, b = 0, d = 0]) => q(a + b - d, d)],
    ],
    extra: ([a = 0, b = 0, d = 0]) => ({
      f: fr(a, d),
      g: fr(b, d),
      r: mixText(Math.floor((a + b) / d), (a + b) % d, d),
    }),
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
    traps: [
      ["the-given-fraction", "conceptual", ([a = 0, d = 0]) => q(a, d)],
      ["dropped-the-denominator", "conceptual", ([a = 0, d = 0]) => q(d - a)],
      [
        "against-the-part",
        "conceptual",
        ([a = 0, d = 0]) => ((d - a) % a === 0 ? null : q(d - a, a)),
      ],
    ],
    extra: ([a = 0, d = 0]) => ({ f: fr(a, d), r: fr(d - a, d) }),
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
      ["dropped-the-denominator", "conceptual", ([a = 0, b = 0]) => q(a + b)],
      [
        "subtracted",
        "procedural",
        ([a = 0, b = 0, d = 0]) => (a === b ? null : q(Math.abs(a - b), d)),
      ],
    ],
    extra: ([a = 0, b = 0, d = 0]) => ({
      f: fr(a, d),
      g: fr(b, d),
      r: fr(a + b, d),
    }),
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
      ["the-given-fraction", "conceptual", ([a = 0, d = 0]) => q(a, d)],
      [
        "against-the-part",
        "conceptual",
        ([a = 0, d = 0]) => ((d - a) % a === 0 ? null : q(d - a, a)),
      ],
    ],
    extra: ([a = 0, d = 0]) => ({ f: fr(a, d), r: fr(d - a, d) }),
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
      [
        "denominators-added",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => q(a + b + c, 3 * d),
      ],
      [
        "whole-lost",
        "conceptual",
        ([a = 0, b = 0, c = 0, d = 0]) =>
          (a + b + c - d) % d === 0 ? null : q(a + b + c - d, d),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => ({
      f: fr(a, d),
      g: fr(b, d),
      h: fr(c, d),
      r: mixText(Math.floor((a + b + c) / d), (a + b + c) % d, d),
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
      ["forgot-to-borrow", "conceptual", ([a = 0, d = 0]) => q(4 * d - a, d)],
      ["added", "procedural", ([a = 0, d = 0]) => q(3 * d + a, d)],
    ],
    extra: ([a = 0, d = 0]) => ({
      f: fr(a, d),
      r: mixText(2, d - a, d),
    }),
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
      [
        "first-portion-only",
        "procedural",
        ([x = 0, a = 0, , d = 0]) => q(x - a, d),
      ],
      [
        "the-eaten-part",
        "conceptual",
        ([x = 0, a = 0, b = 0, d = 0]) =>
          x === 2 * (a + b) ? null : q(a + b, d),
      ],
    ],
    extra: ([x = 0, a = 0, b = 0, d = 0]) => ({
      f: fr(x, d),
      g: fr(a, d),
      h: fr(b, d),
      r: fr(x - a - b, d),
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
    ref: ([a = 0, d = 0]) => {
      let added = 0;
      while (a + added < d) added += 1;
      return q(added);
    },
    traps: [
      ["the-given-numerator", "conceptual", ([a = 0]) => q(a)],
      ["all-the-parts", "conceptual", ([, d = 0]) => q(d)],
    ],
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
    ref: ([a = 0, d = 0]) => q(a, d).mul(q(2)),
    traps: [
      ["denominators-added", "procedural", ([a = 0, d = 0]) => q(2 * a, 2 * d)],
      ["multiplied-numerators", "procedural", ([a = 0, d = 0]) => q(a * a, d)],
      ["denominator-doubled", "conceptual", ([a = 0, d = 0]) => q(a, 2 * d)],
    ],
    extra: ([a = 0, d = 0]) => ({
      f: fr(a, d),
      r: mixText(1, 2 * a - d, d),
    }),
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
    traps: [
      ["wholes-only", "conceptual", ([w = 0]) => q(w)],
      ["remainder-only", "conceptual", ([, n = 0, d = 0]) => q(n, d)],
      [
        "swapped-parts",
        "conceptual",
        ([w = 0, n = 0, d = 0]) =>
          w === n || gcd(w, d) > 1 ? null : mix(n, w, d),
      ],
    ],
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
      [
        "whole-times-numerator",
        "procedural",
        ([w = 0, n = 0, d = 0]) =>
          w === 1 || w * n === w + n || (w * n) % d === 0 ? null : q(w * n, d),
      ],
      [
        "wholes-dropped",
        "conceptual",
        ([w = 0, n = 0, d = 0]) => (w === 1 ? null : q(n, d)),
      ],
    ],
    extra: ([w = 0, n = 0, d = 0]) => ({
      m: mixText(w, n, d),
      r: fr(w * d + n, d),
    }),
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
      q(w1 * d + a + w2 * d + b, d),
    traps: [
      ["wholes-only", "conceptual", ([w1 = 0, , w2 = 0]) => q(w1 + w2)],
      [
        "fractions-only",
        "conceptual",
        ([, a = 0, , b = 0, d = 0]) => q(a + b, d),
      ],
      [
        "denominators-added",
        "procedural",
        ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) => mix(w1 + w2, a + b, 2 * d),
      ],
    ],
    extra: ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) => ({
      m: mixText(w1, a, d),
      k: mixText(w2, b, d),
      r: mixText(w1 + w2, a + b, d),
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
      q(w1 * d + a + w2 * d + b, d),
    traps: [
      [
        "carry-lost",
        "procedural",
        ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) => mix(w1 + w2, a + b - d, d),
      ],
      ["wholes-only", "conceptual", ([w1 = 0, , w2 = 0]) => q(w1 + w2)],
      [
        "denominators-added",
        "procedural",
        ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) => mix(w1 + w2, a + b, 2 * d),
      ],
    ],
    extra: ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) => ({
      m: mixText(w1, a, d),
      k: mixText(w2, b, d),
      r: mixText(w1 + w2 + 1, a + b - d, d),
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
      ["wholes-only", "conceptual", ([w1 = 0, , w2 = 0]) => q(w1 - w2)],
      [
        "numerators-only",
        "conceptual",
        ([, a = 0, , b = 0, d = 0]) => q(a - b, d),
      ],
    ],
    extra: ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) => ({
      m: mixText(w1, a, d),
      k: mixText(w2, b, d),
      r: mixOr(w1 - w2, a - b, d),
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
      ["wholes-only", "conceptual", ([w1 = 0, , w2 = 0]) => q(w1 - w2)],
      [
        "borrowed-wholes-kept",
        "procedural",
        ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) =>
          d + a - b === b - a ? null : mix(w1 - w2, d + a - b, d),
      ],
    ],
    extra: ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) => ({
      m: mixText(w1, a, d),
      k: mixText(w2, b, d),
      r: mixOr(w1 - w2 - 1, d + a - b, d),
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
    ref: ([w = 0, n = 0, d = 0]) => q(w * d + n, d),
    traps: [
      ["multiplied", "procedural", ([w = 0, n = 0, d = 0]) => q(w * n, d)],
      [
        "wholes-added-to-numerator",
        "procedural",
        ([w = 0, n = 0, d = 0]) =>
          w * n === w + n || (w + n) % d === 0 ? null : q(w + n, d),
      ],
      ["fraction-only", "conceptual", ([, n = 0, d = 0]) => q(n, d)],
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
      [
        "the-remainder",
        "conceptual",
        ([n = 0, d = 0]) => (n % d === Math.floor(n / d) + 1 ? null : q(n % d)),
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
      [
        "same-sum",
        "conceptual",
        ([w1 = 0, a = 0, w2 = 0, b = 0]) => (w1 + a === w2 + b ? "=" : null),
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
      ["wholes-only", "conceptual", ([w1 = 0, , w2 = 0]) => q(w1 + w2)],
      [
        "denominators-added",
        "procedural",
        ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) => mix(w1 + w2, a + b, 2 * d),
      ],
    ],
    extra: ([w1 = 0, a = 0, w2 = 0, b = 0, d = 0]) => ({
      m: mixText(w1, a, d),
      k: mixText(w2, b, d),
      r: mixText(w1 + w2 + 1, a + b - d, d),
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
      [
        "whole-times-numerator",
        "procedural",
        ([w = 0, n = 0]) => (w * n === w + n ? null : q(w * n)),
      ],
      ["forgot-the-numerator", "conceptual", ([w = 0, , d = 0]) => q(w * d)],
    ],
    extra: ([w = 0, n = 0, d = 0]) => ({ m: mixText(w, n, d), u: fr(1, d) }),
  }),
];

const argmax = (list: readonly number[]): number =>
  list.indexOf(Math.max(...list));
const reducedText = (n: number, d: number): string =>
  fr(n / gcd(n, d), d / gcd(n, d));

/** Three equal fractions and one that differs, the odd one placed at index `pos`. */
function oddOne(v: readonly number[]): {
  readonly list: readonly string[];
  readonly numerators: readonly number[];
  readonly denominators: readonly number[];
  readonly pos: number;
} {
  const [n = 0, d = 0, k1 = 0, k2 = 0, k3 = 0, k4 = 0, pos = 0, shift = 0] = v;
  const equal = [k1, k2, k3].map((k) => [n * k, d * k] as const);
  const odd = [n * k4 + shift, d * k4] as const;
  const all = [...equal.slice(0, pos), odd, ...equal.slice(pos)];
  return {
    list: all.map(([x, y]) => fr(x, y)),
    numerators: all.map(([x]) => x),
    denominators: all.map(([, y]) => y),
    pos,
  };
}

const IRREDUCIBLE: readonly (readonly [number, number])[] = [
  [3, 8],
  [5, 12],
  [7, 9],
  [4, 9],
  [5, 8],
  [7, 10],
  [9, 14],
  [11, 12],
  [5, 6],
  [2, 9],
  [8, 15],
  [7, 12],
];
const BOTH_EVEN: readonly (readonly [number, number])[] = [
  [4, 6],
  [6, 10],
  [4, 10],
  [8, 12],
  [6, 8],
  [10, 14],
];
const BY_THREE: readonly (readonly [number, number])[] = [
  [3, 9],
  [3, 15],
  [9, 15],
  [15, 21],
];
const BY_FIVE: readonly (readonly [number, number])[] = [
  [5, 10],
  [10, 15],
  [5, 15],
  [15, 20],
];

/** The four fractions of the "which is irreducible" task, the irreducible one at `pos`. */
function irreducibleLayout(v: readonly number[]): {
  readonly list: readonly string[];
  readonly at: Record<"irr" | "even" | "three" | "five", number>;
  readonly parts: Record<"irr" | "even" | "three" | "five", string>;
} {
  const [pos = 0, i = 0, j = 0, k = 0, m = 0] = v;
  const irr = IRREDUCIBLE[i] ?? [3, 8];
  const even = BOTH_EVEN[j] ?? [4, 6];
  const three = BY_THREE[k] ?? [3, 9];
  const five = BY_FIVE[m] ?? [5, 10];
  const others = [
    ["even", even],
    ["three", three],
    ["five", five],
  ] as const;
  const order: ("irr" | "even" | "three" | "five")[] = [];
  let next = 0;
  for (let slot = 0; slot < 4; slot += 1)
    order.push(slot === pos ? "irr" : (others[next++]?.[0] ?? "even"));
  const pair = { irr, even, three, five };
  const text = (key: keyof typeof pair): string => fr(...pair[key]);
  return {
    list: order.map(text),
    at: {
      irr: order.indexOf("irr"),
      even: order.indexOf("even"),
      three: order.indexOf("three"),
      five: order.indexOf("five"),
    },
    parts: {
      irr: text("irr"),
      even: text("even"),
      three: text("three"),
      five: text("five"),
    },
  };
}

const equivalentMore = [
  f4({
    id: "F4.equivalent.12",
    form: "the-odd-one-out-among-equal-fractions",
    groups: [6, 7],
    kind: "choice",
    draw: (r) => {
      const k1 = between(r, 2, 3);
      const k2 = k1 + between(r, 1, 2);
      const k3 = k2 + between(r, 1, 2);
      return [
        between(r, 1, 5),
        between(r, 2, 8),
        k1,
        k2,
        k3,
        between(r, 2, 6),
        r.int(4),
        between(r, 1, 2),
      ];
    },
    valid: ([n = 0, d = 0]) => n < d && coprime(n, d),
    options: () => ["1", "2", "3", "4"],
    solve: (v) => String(oddOne(v).pos + 1),
    ref: (v) => {
      const o = oddOne(v);
      const [n = 0, d = 0] = v;
      return String(
        o.numerators.findIndex(
          (x, i) => x * d !== n * (o.denominators[i] ?? 1),
        ) + 1,
      );
    },
    traps: [
      [
        "largest-numerator",
        "conceptual",
        (v) => {
          const o = oddOne(v);
          const i = argmax(o.numerators);
          return i === o.pos ? null : String(i + 1);
        },
      ],
      [
        "largest-denominator",
        "conceptual",
        (v) => {
          const o = oddOne(v);
          const i = argmax(o.denominators);
          return i === o.pos || i === argmax(o.numerators)
            ? null
            : String(i + 1);
        },
      ],
      [
        "looks-different",
        "conceptual",
        (v) => {
          const o = oddOne(v);
          const used = [o.pos, argmax(o.numerators), argmax(o.denominators)];
          const free = [0, 1, 2, 3].find((i) => !used.includes(i));
          return free === undefined ? null : String(free + 1);
        },
      ],
    ],
    extra: (v) => {
      const o = oddOne(v);
      const [n = 0, d = 0] = v;
      const reduced = o.numerators.map((x, i) =>
        reducedText(x, o.denominators[i] ?? 1),
      );
      return {
        p: o.list[0] ?? "",
        s: o.list[1] ?? "",
        t: o.list[2] ?? "",
        u: o.list[3] ?? "",
        x: reduced[0] ?? "",
        y: reduced[1] ?? "",
        z: reduced[2] ?? "",
        w: reduced[3] ?? "",
        e: fr(n, d),
      };
    },
    consts: [1, 2, 3, 4],
  }),
  f4({
    id: "F4.equivalent.13",
    form: "two-missing-numbers-in-a-chain-of-equal-fractions",
    groups: [6, 7],
    kind: "pair",
    draw: (r) => [
      between(r, 1, 5),
      between(r, 2, 8),
      between(r, 2, 5),
      between(r, 2, 5),
    ],
    valid: ([n = 0, d = 0, k1 = 0, k2 = 0]) =>
      n < d && coprime(n, d) && k1 !== k2,
    solve: ([n = 0, d = 0, k1 = 0, k2 = 0]) => [q(n * k1), q(d * k2)],
    ref: ([n = 0, d = 0, k1 = 0, k2 = 0]) => {
      let x = 0;
      while (x * d < n * d * k1) x += 1;
      let y = 0;
      while (n * y < n * d * k2) y += 1;
      return [q(x), q(y)];
    },
    traps: [
      [
        "swapped",
        "conceptual",
        ([n = 0, d = 0, k1 = 0, k2 = 0]) => [q(d * k2), q(n * k1)],
      ],
      [
        "same-gap",
        "conceptual",
        ([n = 0, d = 0, k1 = 0, k2 = 0]) => [
          q(n + d * k1 - d),
          q(d + n * k2 - n),
        ],
      ],
    ],
    extra: ([n = 0, d = 0, k1 = 0, k2 = 0]) => ({
      f: fr(n, d),
      e: String(d * k1),
      g: String(n * k2),
    }),
  }),
  f4({
    id: "F4.equivalent.14",
    form: "the-numerator-from-the-sum-of-its-parts",
    groups: [7, 8],
    origin: {
      olympiad:
        "the parts of a fraction from the sum of numerator and denominator, RES-4284",
    },
    kind: "integer",
    draw: (r) => [between(r, 1, 5), between(r, 2, 8), between(r, 2, 9)],
    valid: ([n = 0, d = 0]) => n < d && coprime(n, d),
    solve: ([n = 0, , k = 0]) => q(n * k),
    ref: ([n = 0, d = 0, k = 0]) => {
      let part = 0;
      while (part * (n + d) < (n + d) * k) part += 1;
      return q(n * part);
    },
    traps: [
      ["the-denominator", "conceptual", ([, d = 0, k = 0]) => q(d * k)],
      ["the-given-numerator", "conceptual", ([n = 0]) => q(n)],
      [
        "half-of-the-sum",
        "conceptual",
        ([n = 0, d = 0, k = 0]) =>
          ((n + d) * k) % 2 === 0 && ((n + d) * k) / 2 !== n * k
            ? q(((n + d) * k) / 2)
            : null,
      ],
    ],
    extra: ([n = 0, d = 0, k = 0]) => ({
      f: fr(n, d),
      s: String((n + d) * k),
    }),
  }),
  f4({
    id: "F4.equivalent.15",
    form: "is-the-equality-of-two-fractions-right",
    groups: [6, 7],
    kind: "choice",
    draw: (r) => [
      between(r, 1, 5),
      between(r, 3, 8),
      between(r, 2, 4),
      pick(r, [0, 0, 1, 2]),
    ],
    valid: ([n = 0, d = 0, k = 0, t = 0]) =>
      n < d && coprime(n, d) && !(t === 2 && d === 2 && k === 2),
    options: () => ["1", "2"],
    solve: ([, , , t = 0]) => (t === 0 ? "1" : "2"),
    ref: ([n = 0, d = 0, k = 0, t = 0]) => {
      const [x, y] =
        t === 0 ? [n * k, d * k] : t === 1 ? [n + k, d + k] : [n * k, d + k];
      return x * d === n * y ? "1" : "2";
    },
    traps: [
      [
        "thought-different",
        "conceptual",
        ([, , , t = 0]) => (t === 0 ? "2" : null),
      ],
      [
        "added-the-same-number",
        "conceptual",
        ([, , , t = 0]) => (t === 1 ? "1" : null),
      ],
      [
        "multiplied-only-the-numerator",
        "conceptual",
        ([, , , t = 0]) => (t === 2 ? "1" : null),
      ],
    ],
    extra: ([n = 0, d = 0, k = 0, t = 0]) => {
      const [x, y] =
        t === 0 ? [n * k, d * k] : t === 1 ? [n + k, d + k] : [n * k, d + k];
      return { f: fr(n, d), g: fr(x, y), x: String(x), y: String(y) };
    },
    consts: [1, 2],
  }),
];

const phi = (d: number): number =>
  Array.from({ length: d - 1 }, (_, i) => i + 1).filter((n) => gcd(n, d) === 1)
    .length;

const simplifyMore = [
  f4s({
    id: "F4.simplify.12",
    form: "how-many-proper-fractions-are-irreducible",
    groups: [7, 8],
    origin: {
      olympiad:
        "counting irreducible fractions with a given denominator, RES-4284",
    },
    kind: "integer",
    draw: (r) => [pick(r, [6, 8, 9, 10, 12, 14, 15])],
    solve: ([d = 0]) => q(phi(d)),
    ref: ([d = 0]) =>
      q(
        Array.from({ length: d - 1 }, (_, i) => i + 1).filter((n) =>
          coprime(n, d),
        ).length,
      ),
    traps: [
      ["all-numerators", "conceptual", ([d = 0]) => q(d - 1)],
      [
        "only-evens-crossed-out",
        "conceptual",
        ([d = 0]) => {
          const odd = Array.from({ length: d - 1 }, (_, i) => i + 1).filter(
            (n) => n % 2 === 1,
          ).length;
          return odd === phi(d) ? null : q(odd);
        },
      ],
    ],
    extra: ([d = 0]) => {
      const all = Array.from({ length: d - 1 }, (_, i) => i + 1);
      return {
        k: all.filter((n) => gcd(n, d) > 1).join("; "),
        l: all.filter((n) => gcd(n, d) === 1).join("; "),
      };
    },
    consts: [1],
  }),
  f4s({
    id: "F4.simplify.13",
    form: "cancel-a-fraction-of-products-before-multiplying",
    groups: [7, 8],
    kind: "fraction",
    rule: "simplest",
    draw: (r) => {
      for (let tries = 0; tries < 200; tries += 1) {
        const g1 = pick(r, [2, 3, 4]);
        const g2 = pick(r, [2, 3, 5]);
        const [p, u, w, s] = [
          between(r, 1, 4),
          between(r, 1, 5),
          between(r, 1, 4),
          between(r, 1, 5),
        ];
        if (
          coprime(p, u) &&
          coprime(w, s) &&
          coprime(p * w, u * s) &&
          w !== s &&
          u * s > 1
        )
          return [p * g1, w * g2, u * g1, s * g2];
      }
      return [4, 9, 6, 6];
    },
    solve: ([a = 0, b = 0, c = 0, d = 0]) => q(a * b, c * d),
    ref: ([a = 0, b = 0, c = 0, d = 0]) => q(a * b).div(q(c * d)),
    traps: [
      [
        "factors-added",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) =>
          (a + b) * c * d === (c + d) * a * b ? null : q(a + b, c + d),
      ],
      [
        "upside-down",
        "conceptual",
        ([a = 0, b = 0, c = 0, d = 0]) =>
          a * b === c * d ? null : q(c * d, a * b),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => ({
      g: String(gcd(a, c)),
      h: String(gcd(b, d)),
    }),
  }),
  f4s({
    id: "F4.simplify.14",
    form: "wholes-out-of-an-improper-fraction-then-reduce",
    groups: [7, 8],
    kind: "mixed",
    rule: "simplest",
    draw: (r) => [
      between(r, 1, 5),
      between(r, 1, 5),
      between(r, 2, 8),
      between(r, 2, 4),
    ],
    valid: ([, n = 0, d = 0]) => n < d && coprime(n, d),
    solve: ([w = 0, n = 0, d = 0]) => mix(w, n, d),
    ref: ([w = 0, n = 0, d = 0, k = 0]) => q((w * d + n) * k, d * k),
    traps: [
      ["wholes-only", "conceptual", ([w = 0]) => q(w)],
      ["remainder-only", "conceptual", ([, n = 0, d = 0]) => q(n, d)],
    ],
    extra: ([w = 0, n = 0, d = 0, k = 0]) => ({
      f: fr((w * d + n) * k, d * k),
      N: String((w * d + n) * k),
      D: String(d * k),
    }),
  }),
  f4s({
    id: "F4.simplify.15",
    form: "which-of-four-fractions-is-irreducible",
    groups: [7, 8],
    kind: "choice",
    draw: (r) => [
      r.int(4),
      r.int(IRREDUCIBLE.length),
      r.int(BOTH_EVEN.length),
      r.int(BY_THREE.length),
      r.int(BY_FIVE.length),
    ],
    options: () => ["1", "2", "3", "4"],
    solve: (v) => String(irreducibleLayout(v).at.irr + 1),
    ref: (v) => {
      const l = irreducibleLayout(v);
      const found = l.list.findIndex((text) => {
        const [x = 0, y = 0] = text.split("⁄").map(Number);
        return gcd(x, y) === 1;
      });
      return String(found + 1);
    },
    traps: [
      [
        "checked-only-evens",
        "conceptual",
        (v) => String(irreducibleLayout(v).at.three + 1),
      ],
      [
        "checked-only-two-and-three",
        "conceptual",
        (v) => String(irreducibleLayout(v).at.five + 1),
      ],
    ],
    extra: (v) => {
      const l = irreducibleLayout(v);
      return {
        p: l.list[0] ?? "",
        s: l.list[1] ?? "",
        t: l.list[2] ?? "",
        u: l.list[3] ?? "",
        x: l.parts.even,
        y: l.parts.three,
        z: l.parts.five,
        w: l.parts.irr,
      };
    },
    consts: [1, 2, 3, 4, 5],
  }),
];

const addLikeMore = [
  f5({
    id: "F5.add-same-den.12",
    form: "the-missing-numerator-of-a-sum-of-like-fractions",
    groups: [7, 7],
    kind: "integer",
    draw: (r) => [between(r, 1, 6), between(r, 1, 6), between(r, 8, 13)],
    valid: ([a = 0, b = 0, d = 0]) => a + b < d && a !== b,
    solve: ([, b = 0]) => q(b),
    ref: ([a = 0, b = 0, d = 0]) =>
      q(a + b, d)
        .sub(q(a, d))
        .mul(q(d)),
    traps: [
      ["the-sum-itself", "conceptual", ([a = 0, b = 0]) => q(a + b)],
      ["added-instead", "procedural", ([a = 0, b = 0]) => q(2 * a + b)],
    ],
    extra: ([a = 0, b = 0, d = 0]) => ({ f: fr(a, d), g: fr(a + b, d) }),
  }),
  f5({
    id: "F5.add-same-den.13",
    form: "two-colours-on-a-strip",
    groups: [7, 7],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [between(r, 1, 5), between(r, 1, 5), between(r, 8, 12)],
    valid: ([a = 0, b = 0, d = 0]) => a + b < d - 1 && a !== b,
    solve: ([a = 0, b = 0, d = 0]) => q(a + b, d),
    ref: ([a = 0, b = 0, d = 0]) => q(a, d).add(q(b, d)),
    traps: [
      ["only-red", "conceptual", ([a = 0, d = 0]) => q(a, d)],
      ["unshaded", "conceptual", ([a = 0, b = 0, d = 0]) => q(d - a - b, d)],
      [
        "against-the-rest",
        "conceptual",
        ([a = 0, b = 0, d = 0]) =>
          (a + b) % (d - a - b) === 0 ? null : q(a + b, d - a - b),
      ],
    ],
    extra: ([a = 0, b = 0, d = 0]) => ({ r: fr(a + b, d) }),
  }),
  f5({
    id: "F5.add-same-den.14",
    form: "three-fractions-with-consecutive-numerators",
    groups: [7, 8],
    origin: { olympiad: "three consecutive numbers from their sum, RES-4284" },
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [between(r, 1, 7), between(r, 10, 14)],
    valid: ([m = 0, d = 0]) => m + 2 < d,
    solve: ([m = 0, d = 0]) => q(m, d),
    ref: ([m = 0, d = 0]) =>
      q(3 * m + 3, d)
        .sub(q(m + 1, d))
        .sub(q(m + 2, d)),
    traps: [
      ["the-middle-fraction", "conceptual", ([m = 0, d = 0]) => q(m + 1, d)],
      ["the-largest", "conceptual", ([m = 0, d = 0]) => q(m + 2, d)],
    ],
    extra: ([m = 0, d = 0]) => ({ s: fr(3 * m + 3, d), r: fr(m, d) }),
    consts: [3],
  }),
  f5({
    id: "F5.add-same-den.15",
    form: "how-many-equal-fractions-pass-one",
    groups: [7, 7],
    kind: "integer",
    draw: (r) => [between(r, 2, 5), between(r, 7, 13)],
    valid: ([a = 0, d = 0]) => a < d,
    solve: ([a = 0, d = 0]) => q(Math.floor(d / a) + 1),
    ref: ([a = 0, d = 0]) => {
      let k = 1;
      while (k * a <= d) k += 1;
      return q(k);
    },
    traps: [
      ["rounded-down", "procedural", ([a = 0, d = 0]) => q(Math.floor(d / a))],
      [
        "the-denominator",
        "conceptual",
        ([a = 0, d = 0]) => (d === Math.floor(d / a) ? null : q(d)),
      ],
    ],
    extra: ([a = 0, d = 0]) => ({ f: fr(a, d) }),
    consts: [1],
  }),
];

const mixedMore = [
  f5m({
    id: "F5.mixed.12",
    form: "read-a-mixed-number-from-strips",
    groups: [6, 7],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => [between(r, 1, 3), between(r, 1, 7), between(r, 5, 9)],
    valid: ([, n = 0, d = 0]) => n < d,
    solve: ([w = 0, n = 0, d = 0]) => mix(w, n, d),
    ref: ([w = 0, n = 0, d = 0]) => q(w * d + n, d),
    traps: [
      ["wholes-only", "conceptual", ([w = 0]) => q(w)],
      ["only-the-partial-strip", "conceptual", ([, n = 0, d = 0]) => q(n, d)],
      ["strips-counted", "conceptual", ([w = 0]) => q(w + 1)],
    ],
  }),
  f5m({
    id: "F5.mixed.13",
    form: "a-whole-number-minus-a-mixed-number",
    groups: [7, 8],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => [
      between(r, 4, 9),
      between(r, 1, 3),
      between(r, 1, 5),
      between(r, 5, 9),
    ],
    valid: ([w = 0, m = 0, n = 0, d = 0]) => n < d && w > m + 1,
    solve: ([w = 0, m = 0, n = 0, d = 0]) => q(w).sub(mix(m, n, d)),
    ref: ([w = 0, m = 0, n = 0, d = 0]) => q(w * d - m * d - n, d),
    traps: [
      ["wholes-only", "conceptual", ([w = 0, m = 0]) => q(w - m)],
      [
        "forgot-to-borrow",
        "procedural",
        ([w = 0, m = 0, n = 0, d = 0]) => mix(w - m, n, d),
      ],
    ],
    extra: ([w = 0, m = 0, n = 0, d = 0]) => ({
      m: mixText(m, n, d),
      r: mixText(w - m - 1, d - n, d),
    }),
  }),
  f5m({
    id: "F5.mixed.14",
    form: "how-many-equal-fractions-make-a-whole-number",
    groups: [7, 8],
    origin: {
      olympiad:
        "the smallest count of equal fractions with a whole sum, RES-4284",
    },
    kind: "integer",
    draw: (r) =>
      pick(r, [
        [2, 6],
        [3, 6],
        [4, 6],
        [2, 8],
        [4, 8],
        [6, 8],
        [3, 9],
        [6, 9],
        [2, 10],
        [4, 10],
        [5, 10],
        [3, 12],
        [4, 12],
        [6, 12],
        [3, 4],
        [5, 6],
        [5, 8],
        [7, 9],
        [2, 5],
        [3, 10],
      ]),
    solve: ([a = 0, d = 0]) => q(d / gcd(a, d)),
    ref: ([a = 0, d = 0]) => {
      let k = 1;
      while ((k * a) % d !== 0) k += 1;
      return q(k);
    },
    traps: [
      [
        "the-denominator",
        "conceptual",
        ([a = 0, d = 0]) => (gcd(a, d) === 1 ? null : q(d)),
      ],
      [
        "the-product",
        "conceptual",
        ([a = 0, d = 0]) => (gcd(a, d) === a ? null : q(a * d)),
      ],
      [
        "the-common-divisor",
        "conceptual",
        ([a = 0, d = 0]) =>
          gcd(a, d) === d / gcd(a, d) || gcd(a, d) === 1 ? null : q(gcd(a, d)),
      ],
    ],
    extra: ([a = 0, d = 0]) => {
      const g = gcd(a, d);
      return {
        f: fr(a, d),
        g: String(g),
        t: String((d / g) * a),
        w: String(((d / g) * a) / d),
      };
    },
  }),
  f5m({
    id: "F5.mixed.15",
    form: "the-midpoint-of-two-mixed-numbers",
    groups: [7, 8],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => {
      const w1 = between(r, 1, 4);
      return [
        w1,
        between(r, 1, 5),
        w1 + between(r, 1, 4),
        between(r, 1, 5),
        between(r, 6, 10),
      ];
    },
    valid: ([, n = 0, , m = 0, d = 0]) => n < d && m < d && n !== m,
    solve: ([w1 = 0, n = 0, w2 = 0, m = 0, d = 0]) =>
      mix(w1, n, d)
        .add(mix(w2, m, d))
        .div(q(2)),
    ref: ([w1 = 0, n = 0, w2 = 0, m = 0, d = 0]) =>
      q(w1 * d + n + w2 * d + m, 2 * d),
    traps: [
      [
        "sum-not-halved",
        "procedural",
        ([w1 = 0, n = 0, w2 = 0, m = 0, d = 0]) =>
          mix(w1, n, d).add(mix(w2, m, d)),
      ],
      [
        "average-of-the-wholes",
        "conceptual",
        ([w1 = 0, , w2 = 0]) => q(w1 + w2, 2),
      ],
    ],
    extra: ([w1 = 0, n = 0, w2 = 0, m = 0, d = 0]) => ({
      f: mixText(w1, n, d),
      g: mixText(w2, m, d),
    }),
    consts: [2],
  }),
];

export const fSpecs2: readonly Spec<never>[] = [
  ...equivalent,
  ...equivalentMore,
  ...simplify,
  ...simplifyMore,
  ...addLike,
  ...addLikeMore,
  ...mixedNumbers,
  ...mixedMore,
];
