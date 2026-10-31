// Domain F, part 1: what a fraction is, a fraction of a number, comparing fractions and placing them on a
// line (RES-4284). The Dutch goals meet halves, quarters and "deel en geheel" at group 5, a fraction of an
// amount in context at group 6, and compare and place fractions on a line at group 6 (1F) and with harder
// fractions (1S). A fraction is written `3⁄4` in a text. Texts are plain blanks in `content/tasks-f.ru.json`.
import { formatQ } from "../math/format.js";
import { Q } from "../math/q.js";
import { between, pick } from "./draw.js";
import { forFraction, fr, q } from "./kitf.js";
import { SIGNS, type Spec } from "./spec.js";

const sign = (x: Q, y: Q): (typeof SIGNS)[number] => SIGNS[x.cmp(y) + 1] ?? "=";
const decimalOf = (x: Q): string =>
  formatQ(x, { decimal: ",", group: "", mul: "", div: "", minus: "−" });
const sorted = (v: readonly Q[], desc = false): string[] =>
  v
    .map((x, i) => [x, i] as const)
    .sort((a, b) => (desc ? -1 : 1) * a[0].cmp(b[0]) || a[1] - b[1])
    .map(([, i]) => String(i + 1));

const same = (x: readonly string[], y: readonly string[]): boolean =>
  x.join() === y.join();
const order = (v: readonly number[]): string[] => sorted(v.map((x) => q(x)));

const f1 = forFraction("F1", "share");
const share = [
  f1({
    id: "F1.share.01",
    form: "the-shaded-part-of-a-figure",
    groups: [5, 5],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [between(r, 2, 7), between(r, 3, 10)],
    valid: ([n = 0, d = 0]) => n < d && n !== d - n,
    solve: ([n = 0, d = 0]) => q(n, d),
    ref: ([n = 0, d = 0]) => q(1, d).mul(q(n)),
    traps: [
      [
        "against-the-rest",
        "conceptual",
        ([n = 0, d = 0]) => (n % (d - n) === 0 ? null : q(n, d - n)),
      ],
      ["the-unshaded-part", "conceptual", ([n = 0, d = 0]) => q(d - n, d)],
      [
        "upside-down",
        "conceptual",
        ([n = 0, d = 0]) => (d % n === 0 ? null : q(d, n)),
      ],
    ],
    extra: ([n = 0, d = 0]) => ({ r: fr(n, d) }),
  }),
  f1({
    id: "F1.share.02",
    form: "the-part-that-is-not-shaded",
    groups: [5, 5],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [between(r, 2, 7), between(r, 3, 10)],
    valid: ([n = 0, d = 0]) => n < d && n !== d - n,
    solve: ([n = 0, d = 0]) => q(d - n, d),
    ref: ([n = 0, d = 0]) => q(1).sub(q(n, d)),
    traps: [
      ["the-shaded-part", "conceptual", ([n = 0, d = 0]) => q(n, d)],
      [
        "against-the-shaded",
        "conceptual",
        ([n = 0, d = 0]) => ((d - n) % n === 0 ? null : q(d - n, n)),
      ],
    ],
    extra: ([n = 0, d = 0]) => ({ r: fr(d - n, d) }),
  }),
  f1({
    id: "F1.share.03",
    form: "how-many-equal-parts-make-a-whole",
    groups: [5, 5],
    kind: "integer",
    draw: (r) => [between(r, 2, 12)],
    solve: ([d = 0]) => q(d),
    ref: ([d = 0]) => q(1).div(q(1, d)),
    traps: [
      ["one-part", "conceptual", () => q(1)],
      [
        "counted-the-cuts",
        "conceptual",
        ([d = 0]) => (d === 2 ? null : q(d - 1)),
      ],
    ],
    consts: [1],
  }),
  f1({
    id: "F1.share.04",
    form: "write-a-fraction-from-parts-of-a-whole",
    groups: [5, 6],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [between(r, 1, 7), between(r, 3, 10)],
    valid: ([n = 0, d = 0]) => n < d,
    solve: ([n = 0, d = 0]) => q(n, d),
    ref: ([n = 0, d = 0]) => q(1, d).mul(q(n)),
    traps: [
      [
        "upside-down",
        "conceptual",
        ([n = 0, d = 0]) => (d % n === 0 ? null : q(d, n)),
      ],
      [
        "against-the-rest",
        "conceptual",
        ([n = 0, d = 0]) => (n % (d - n) === 0 ? null : q(n, d - n)),
      ],
    ],
    extra: ([n = 0, d = 0]) => ({ r: fr(n, d) }),
  }),
  f1({
    id: "F1.share.05",
    form: "numerator-and-denominator",
    groups: [5, 6],
    kind: "pair",
    draw: (r) => [between(r, 1, 7), between(r, 3, 10)],
    valid: ([n = 0, d = 0]) => n < d,
    solve: ([n = 0, d = 0]) => [q(n), q(d)],
    ref: ([n = 0, d = 0]) => [q(n), q(d)],
    traps: [["swapped", "conceptual", ([n = 0, d = 0]) => [q(d), q(n)]]],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
  }),
  f1({
    id: "F1.share.06",
    form: "name-the-denominator",
    groups: [5, 6],
    kind: "integer",
    draw: (r) => [between(r, 1, 7), between(r, 3, 10)],
    valid: ([n = 0, d = 0]) => n < d,
    solve: ([, d = 0]) => q(d),
    ref: ([, d = 0]) => q(d),
    traps: [["numerator", "conceptual", ([n = 0]) => q(n)]],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
  }),
  f1({
    id: "F1.share.07",
    form: "equal-sharing-as-a-unit-fraction",
    groups: [5, 6],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [between(r, 6, 20), between(r, 2, 6)],
    valid: ([c = 0, d = 0]) => c !== d && c % d !== 0,
    solve: ([, d = 0]) => q(1, d),
    ref: ([c = 0, d = 0]) => q(c, d).div(q(c)),
    traps: [
      ["against-the-amount", "conceptual", ([c = 0]) => q(1, c)],
      ["apples-per-child", "conceptual", ([c = 0, d = 0]) => q(c, d)],
      [
        "against-the-others",
        "conceptual",
        ([, d = 0]) => (d === 2 ? null : q(1, d - 1)),
      ],
    ],
  }),
  f1({
    id: "F1.share.08",
    form: "the-whole-from-its-half",
    groups: [5, 6],
    kind: "integer",
    draw: (r) => [2 * between(r, 3, 25)],
    solve: ([x = 0]) => q(2 * x),
    ref: ([x = 0]) => q(x).div(q(1, 2)),
    traps: [
      ["half-again", "conceptual", ([x = 0]) => q(x / 2)],
      ["the-half-itself", "conceptual", ([x = 0]) => q(x)],
      ["added-half", "procedural", ([x = 0]) => q(x + x / 2)],
    ],
    consts: [2],
  }),
  f1({
    id: "F1.share.09",
    form: "compare-two-unit-fractions",
    groups: [5, 6],
    kind: "compare",
    draw: (r) => [between(r, 2, 10), between(r, 2, 10)],
    valid: ([a = 0, b = 0]) => a !== b,
    solve: ([a = 0, b = 0]) => sign(q(1, a), q(1, b)),
    ref: ([a = 0, b = 0]) => sign(q(b, a * b), q(a, a * b)),
    traps: [
      [
        "bigger-denominator-wins",
        "conceptual",
        ([a = 0, b = 0]) => (a < b ? "<" : ">"),
      ],
      ["equal-numerators", "conceptual", () => "="],
    ],
    extra: ([a = 0, b = 0]) => ({
      f: fr(1, a),
      g: fr(1, b),
      sign: sign(q(1, a), q(1, b)),
    }),
    consts: [1],
  }),
  f1({
    id: "F1.share.10",
    form: "the-length-of-one-equal-part",
    groups: [5, 6],
    kind: "integer",
    draw: (r) => [between(r, 3, 9), between(r, 3, 12)],
    valid: ([d = 0, k = 0]) => d !== k,
    solve: ([, k = 0]) => q(k),
    ref: ([d = 0, k = 0]) => q(d * k).div(q(d)),
    traps: [
      ["difference", "procedural", ([d = 0, k = 0]) => q(d * k - d)],
      [
        "number-of-parts",
        "conceptual",
        ([d = 0, k = 0]) => (k === 2 ? null : q(d)),
      ],
      ["multiplied", "procedural", ([d = 0, k = 0]) => q(d * d * k)],
    ],
    extra: ([d = 0, k = 0]) => ({ c: String(d * k) }),
  }),
  f1({
    id: "F1.share.11",
    form: "the-part-that-is-left-over",
    groups: [5, 6],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [between(r, 1, 7), between(r, 3, 10)],
    valid: ([n = 0, d = 0]) => n < d && n !== d - n,
    solve: ([n = 0, d = 0]) => q(d - n, d),
    ref: ([n = 0, d = 0]) => q(1).sub(q(n, d)),
    traps: [
      ["the-eaten-part", "conceptual", ([n = 0, d = 0]) => q(n, d)],
      [
        "against-the-eaten",
        "conceptual",
        ([n = 0, d = 0]) => ((d - n) % n === 0 ? null : q(d - n, n)),
      ],
    ],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d), r: fr(d - n, d) }),
  }),
  f1({
    id: "F1.share.12",
    form: "how-many-quarters-in-some-wholes",
    groups: [5, 6],
    kind: "integer",
    draw: (r) => [between(r, 2, 9)],
    solve: ([k = 0]) => q(4 * k),
    ref: ([k = 0]) => q(k).div(q(1, 4)),
    traps: [
      ["halves", "conceptual", ([k = 0]) => q(2 * k)],
      ["the-number-of-wholes", "conceptual", ([k = 0]) => q(k)],
      ["added-four", "procedural", ([k = 0]) => (k === 4 ? null : q(k + 4))],
    ],
  }),
];

const f2 = forFraction("F2", "fraction-of");
const ofNumber = [
  f2({
    id: "F2.fraction-of.01",
    form: "half-of-a-number-as-a-fraction-of-it",
    groups: [5, 6],
    kind: "integer",
    draw: (r) => [2 * between(r, 6, 60)],
    solve: ([c = 0]) => q(c / 2),
    ref: ([c = 0]) => q(c, 10).mul(q(5)),
    traps: [
      ["doubled", "conceptual", ([c = 0]) => q(2 * c)],
      ["a-quarter", "conceptual", ([c = 0]) => (c % 4 === 0 ? q(c / 4) : null)],
    ],
    consts: [2],
  }),
  f2({
    id: "F2.fraction-of.02",
    form: "a-quarter-of-a-number",
    groups: [5, 6],
    kind: "integer",
    draw: (r) => [4 * between(r, 4, 40)],
    solve: ([c = 0]) => q(c / 4),
    ref: ([c = 0]) => q(c).mul(q(1, 2)).mul(q(1, 2)),
    traps: [
      ["half", "conceptual", ([c = 0]) => q(c / 2)],
      ["times-four", "procedural", ([c = 0]) => q(4 * c)],
      ["three-quarters", "conceptual", ([c = 0]) => q((3 * c) / 4)],
    ],
  }),
  f2({
    id: "F2.fraction-of.03",
    form: "a-third-of-a-number",
    groups: [5, 6],
    kind: "integer",
    draw: (r) => [3 * between(r, 4, 40)],
    solve: ([c = 0]) => q(c / 3),
    ref: ([c = 0]) => q(c).sub(q(c).mul(q(2, 3))),
    traps: [
      ["the-rest", "conceptual", ([c = 0]) => q((2 * c) / 3)],
      ["half", "conceptual", ([c = 0]) => (c % 2 === 0 ? q(c / 2) : null)],
      ["times-three", "procedural", ([c = 0]) => q(3 * c)],
    ],
  }),
  f2({
    id: "F2.fraction-of.04",
    form: "a-tenth-of-a-number",
    groups: [5, 6],
    kind: "integer",
    draw: (r) => [10 * between(r, 5, 90)],
    solve: ([c = 0]) => q(c / 10),
    ref: ([c = 0]) => q(c).mul(q(10, 100)),
    traps: [
      ["ten-times", "procedural", ([c = 0]) => q(10 * c)],
      ["nine-tenths", "conceptual", ([c = 0]) => q((9 * c) / 10)],
      [
        "subtract-ten",
        "procedural",
        ([c = 0]) => (c === 100 ? null : q(c - 10)),
      ],
    ],
    consts: [10],
  }),
  f2({
    id: "F2.fraction-of.05",
    form: "a-unit-fraction-of-an-amount-of-money",
    groups: [5, 6],
    kind: "integer",
    draw: (r) => [pick(r, [2, 4, 5, 8, 10]), between(r, 3, 30)],
    solve: ([, k = 0]) => q(k),
    ref: ([d = 0, k = 0]) => {
      let x = 0;
      while (x * d < d * k) x += 1;
      return q(x);
    },
    traps: [
      ["multiplied", "procedural", ([d = 0, k = 0]) => q(d * d * k)],
      ["number-of-parts", "conceptual", ([d = 0]) => q(d)],
      [
        "subtracted",
        "procedural",
        ([d = 0, k = 0]) => (k === 2 ? null : q(d * k - d)),
      ],
    ],
    extra: ([d = 0, k = 0]) => ({ c: String(d * k), f: fr(1, d) }),
    consts: [1],
  }),
  f2({
    id: "F2.fraction-of.06",
    form: "a-fraction-with-a-numerator-above-one",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [
      between(r, 2, 4),
      pick(r, [4, 5, 6, 8, 10]),
      between(r, 3, 20),
    ],
    valid: ([n = 0, d = 0]) => n < d,
    solve: ([n = 0, , k = 0]) => q(n * k),
    ref: ([n = 0, d = 0, k = 0]) => q(d * k * n).div(q(d)),
    traps: [
      ["unit-part-only", "procedural", ([, , k = 0]) => q(k)],
      [
        "whole-times-numerator",
        "procedural",
        ([n = 0, d = 0, k = 0]) => q(n * d * k),
      ],
      [
        "remaining-parts",
        "conceptual",
        ([n = 0, d = 0, k = 0]) => (d - n === 1 ? null : q((d - n) * k)),
      ],
    ],
    extra: ([n = 0, d = 0, k = 0]) => ({
      c: String(d * k),
      f: fr(n, d),
      u: String(k),
    }),
  }),
  f2({
    id: "F2.fraction-of.07",
    form: "a-fraction-of-a-group-of-children",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [between(r, 1, 3), pick(r, [4, 5, 6, 8]), between(r, 2, 6)],
    valid: ([n = 0, d = 0]) => n < d,
    solve: ([n = 0, , k = 0]) => q(n * k),
    ref: ([n = 0, d = 0, k = 0]) => q(d * k * n).div(q(d)),
    traps: [
      [
        "unit-part-only",
        "procedural",
        ([n = 0, , k = 0]) => (n === 1 ? null : q(k)),
      ],
      [
        "whole-times-numerator",
        "procedural",
        ([n = 0, d = 0, k = 0]) => q(n * d * k),
      ],
      [
        "remaining-parts",
        "conceptual",
        ([n = 0, d = 0, k = 0]) => (d - n === 1 ? null : q((d - n) * k)),
      ],
    ],
    extra: ([n = 0, d = 0, k = 0]) => ({
      c: String(d * k),
      f: fr(n, d),
      u: String(k),
    }),
  }),
  f2({
    id: "F2.fraction-of.08",
    form: "the-whole-from-a-fraction-of-it",
    groups: [7, 8],
    kind: "integer",
    origin: {
      extension: "the whole from its part, Russian grade 5 (RES-4284)",
    },
    draw: (r) => [between(r, 2, 4), pick(r, [4, 5, 6, 8]), between(r, 3, 12)],
    valid: ([n = 0, d = 0]) => n < d,
    solve: ([, d = 0, k = 0]) => q(d * k),
    ref: ([n = 0, d = 0, k = 0]) => q(n * k).div(q(n, d)),
    traps: [
      [
        "fraction-of-the-part",
        "procedural",
        ([n = 0, d = 0, k = 0]) =>
          (n * n * k) % d === 0 ? q((n * n * k) / d) : null,
      ],
      ["the-part-itself", "conceptual", ([n = 0, , k = 0]) => q(n * k)],
      [
        "one-part-only",
        "procedural",
        ([n = 0, d = 0, k = 0]) => (n * n === d ? null : q(k)),
      ],
      [
        "part-times-denominator",
        "procedural",
        ([n = 0, d = 0, k = 0]) => q(n * k * d),
      ],
    ],
    extra: ([n = 0, d = 0, k = 0]) => ({ p: String(n * k), f: fr(n, d) }),
  }),
  f2({
    id: "F2.fraction-of.09",
    form: "what-is-left-after-taking-a-fraction",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [
      between(r, 1, 3),
      pick(r, [4, 5, 6, 8, 10]),
      between(r, 3, 12),
    ],
    valid: ([n = 0, d = 0]) => n < d,
    solve: ([n = 0, d = 0, k = 0]) => q(d * k - n * k),
    ref: ([n = 0, d = 0, k = 0]) => q(d * k).mul(q(d - n, d)),
    traps: [
      ["the-part-taken", "conceptual", ([n = 0, , k = 0]) => q(n * k)],
      [
        "subtracted-the-numerator",
        "procedural",
        ([n = 0, d = 0, k = 0]) => q(d * k - n),
      ],
      [
        "count-of-remaining-parts",
        "conceptual",
        ([n = 0, d = 0, k = 0]) => (d - n === n * k ? null : q(d - n)),
      ],
    ],
    extra: ([n = 0, d = 0, k = 0]) => ({
      c: String(d * k),
      f: fr(n, d),
      t: String(n * k),
    }),
  }),
  f2({
    id: "F2.fraction-of.10",
    form: "a-half-of-a-third",
    groups: [7, 7],
    kind: "integer",
    draw: (r) => [6 * between(r, 3, 30)],
    solve: ([c = 0]) => q(c / 6),
    ref: ([c = 0]) => q(c).mul(q(1, 2).mul(q(1, 3))),
    traps: [
      ["only-the-third", "procedural", ([c = 0]) => q(c / 3)],
      ["only-the-half", "conceptual", ([c = 0]) => q(c / 2)],
      ["added-the-parts", "procedural", ([c = 0]) => q(c / 3 + c / 2)],
    ],
    consts: [2, 3],
  }),
  f2({
    id: "F2.fraction-of.11",
    form: "a-fraction-of-an-hour-in-minutes",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [between(r, 1, 3), pick(r, [4, 5, 6, 10, 12])],
    valid: ([n = 0, d = 0]) => n < d,
    solve: ([n = 0, d = 0]) => q((60 * n) / d),
    ref: ([n = 0, d = 0]) => q(60).div(q(d)).mul(q(n)),
    traps: [
      ["numerator-as-minutes", "conceptual", ([n = 0]) => q(n)],
      ["one-part-only", "procedural", ([, d = 0]) => q(60 / d)],
      [
        "the-rest-of-the-hour",
        "conceptual",
        ([n = 0, d = 0]) => q((60 * (d - n)) / d),
      ],
    ],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
    consts: [60],
  }),
];

const f3 = forFraction("F3", "same-den");
const likeDen = [
  f3({
    id: "F3.same-den.01",
    form: "compare-two-fractions-with-the-same-denominator",
    groups: [5, 6],
    kind: "compare",
    draw: (r) => [between(r, 1, 9), between(r, 1, 9), between(r, 5, 12)],
    valid: ([a = 0, b = 0, d = 0]) => a !== b && a < d && b < d,
    solve: ([a = 0, b = 0, d = 0]) => sign(q(a, d), q(b, d)),
    ref: ([a = 0, b = 0]) => sign(q(a - b), q(0)),
    traps: [
      ["flipped", "conceptual", ([a = 0, b = 0]) => (a < b ? ">" : "<")],
      ["equal-denominators", "conceptual", () => "="],
    ],
    extra: ([a = 0, b = 0, d = 0]) => ({
      f: fr(a, d),
      g: fr(b, d),
      sign: sign(q(a, d), q(b, d)),
    }),
  }),
  f3({
    id: "F3.same-den.02",
    form: "the-larger-of-two-like-fractions",
    groups: [6, 7],
    kind: "choice",
    draw: (r) => [
      between(r, 1, 4),
      between(r, 1, 6),
      between(r, 1, 3) * (r.int(2) === 0 ? 1 : -1),
      between(r, 7, 12),
    ],
    // The improper fraction lies one or two parts away from the mixed number, above or below it.
    valid: ([w = 0, n = 0, s = 0, d = 0]) =>
      n < d && s !== 0 && w * d + n + s > d,
    options: ([w = 0, n = 0, s = 0, d = 0]) => [
      `${w} ${fr(n, d)}`,
      fr(w * d + n + s, d),
    ],
    solve: ([w = 0, n = 0, s = 0, d = 0]) =>
      s < 0 ? `${w} ${fr(n, d)}` : fr(w * d + n + s, d),
    ref: ([w = 0, n = 0, s = 0, d = 0]) => {
      const top = w * d + n + s;
      const whole = Math.floor(top / d);
      const rest = top % d;
      return w > whole || (w === whole && n > rest)
        ? `${w} ${fr(n, d)}`
        : fr(top, d);
    },
    traps: [
      [
        "the-other-one",
        "conceptual",
        ([w = 0, n = 0, s = 0, d = 0]) =>
          s < 0 ? fr(w * d + n + s, d) : `${w} ${fr(n, d)}`,
      ],
    ],
    extra: ([w = 0, n = 0, s = 0, d = 0]) => ({
      f: `${w} ${fr(n, d)}`,
      g: fr(w * d + n + s, d),
      c: String(w * d + n + s),
    }),
  }),
  f3({
    id: "F3.same-den.03",
    form: "order-three-like-fractions",
    groups: [6, 6],
    kind: "order",
    draw: (r) => [
      between(r, 1, 9),
      between(r, 1, 9),
      between(r, 1, 9),
      between(r, 6, 12),
    ],
    valid: ([a = 0, b = 0, c = 0, d = 0]) =>
      new Set([a, b, c]).size === 3 && Math.max(a, b, c) < d,
    solve: ([a = 0, b = 0, c = 0, d = 0]) =>
      sorted([q(a, d), q(b, d), q(c, d)]),
    ref: ([a = 0, b = 0, c = 0, d = 0]) =>
      sorted([q(a - d), q(b - d), q(c - d)]),
    traps: [
      [
        "largest-first",
        "conceptual",
        ([a = 0, b = 0, c = 0, d = 0]) =>
          sorted([q(a, d), q(b, d), q(c, d)], true),
      ],
      [
        "as-listed",
        "conceptual",
        ([a = 0, b = 0, c = 0, d = 0]) => {
          const listed = ["1", "2", "3"];
          return same(listed, sorted([q(a, d), q(b, d), q(c, d)])) ||
            same(listed, sorted([q(a, d), q(b, d), q(c, d)], true))
            ? null
            : listed;
        },
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => ({
      list: [fr(a, d), fr(b, d), fr(c, d)].join("; "),
      sorted: sorted([q(a, d), q(b, d), q(c, d)])
        .map((i) => [fr(a, d), fr(b, d), fr(c, d)][Number(i) - 1])
        .join(" < "),
    }),
  }),
  f3({
    id: "F3.same-den.04",
    form: "how-many-parts-more",
    groups: [5, 6],
    kind: "integer",
    draw: (r) => [between(r, 2, 11), between(r, 1, 9), between(r, 6, 12)],
    valid: ([a = 0, b = 0, d = 0]) => a > b && a < d,
    solve: ([a = 0, b = 0]) => q(a - b),
    ref: ([a = 0, b = 0]) => {
      let x = b;
      let steps = 0;
      while (x < a) {
        x += 1;
        steps += 1;
      }
      return q(steps);
    },
    traps: [
      ["parts-added", "procedural", ([a = 0, b = 0]) => q(a + b)],
      ["the-larger-numerator", "procedural", ([a = 0]) => q(a)],
    ],
    extra: ([a = 0, b = 0, d = 0]) => ({ f: fr(a, d), g: fr(b, d) }),
  }),
  f3({
    id: "F3.same-den.05",
    form: "the-fraction-closer-to-one",
    groups: [6, 6],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [between(r, 1, 11), between(r, 1, 11), between(r, 6, 12)],
    valid: ([a = 0, b = 0, d = 0]) => a !== b && a < d && b < d,
    solve: ([a = 0, b = 0, d = 0]) => q(Math.max(a, b), d),
    ref: ([a = 0, b = 0, d = 0]) => (d - a < d - b ? q(a, d) : q(b, d)),
    traps: [
      [
        "farther-from-one",
        "conceptual",
        ([a = 0, b = 0, d = 0]) => q(Math.min(a, b), d),
      ],
      [
        "distance-to-one",
        "conceptual",
        ([a = 0, b = 0, d = 0]) =>
          d - Math.max(a, b) === Math.min(a, b)
            ? null
            : q(d - Math.max(a, b), d),
      ],
    ],
    extra: ([a = 0, b = 0, d = 0]) => ({
      f: fr(a, d),
      g: fr(b, d),
      r: fr(Math.max(a, b), d),
    }),
  }),
  f3({
    id: "F3.same-den.06",
    form: "compare-a-fraction-with-one",
    groups: [6, 6],
    kind: "compare",
    draw: (r) => [between(r, 2, 14), between(r, 4, 12)],
    valid: ([n = 0, d = 0]) => n !== d,
    solve: ([n = 0, d = 0]) => sign(q(n, d), q(1)),
    ref: ([n = 0, d = 0]) => sign(q(n - d), q(0)),
    traps: [
      ["equal", "conceptual", () => "="],
      ["flipped", "conceptual", ([n = 0, d = 0]) => (n < d ? ">" : "<")],
    ],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d), sign: sign(q(n, d), q(1)) }),
    consts: [1],
  }),
  f3({
    id: "F3.same-den.07",
    form: "the-numerator-between-two-like-fractions",
    groups: [6, 6],
    kind: "integer",
    draw: (r) => [between(r, 1, 7), between(r, 8, 12)],
    solve: ([a = 0]) => q(a + 1),
    ref: ([a = 0]) => q((a + (a + 2)) / 2),
    traps: [
      ["the-larger-end", "conceptual", ([a = 0]) => q(a + 2)],
      ["the-smaller-end", "conceptual", ([a = 0]) => q(a)],
      ["sum-not-halved", "procedural", ([a = 0]) => q(2 * a + 2)],
    ],
    extra: ([a = 0, d = 0]) => ({ f: fr(a, d), g: fr(a + 2, d) }),
  }),
  f3({
    id: "F3.same-den.08",
    form: "how-many-parts-above-the-whole",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [between(r, 6, 20), between(r, 4, 9)],
    valid: ([n = 0, d = 0]) => n > d,
    solve: ([n = 0, d = 0]) => q(n - d),
    ref: ([n = 0, d = 0]) => q(n, d).sub(q(1)).div(q(1, d)),
    traps: [
      ["numerator", "conceptual", ([n = 0]) => q(n)],
      ["added", "procedural", ([n = 0, d = 0]) => q(n + d)],
      [
        "parts-in-the-whole",
        "conceptual",
        ([n = 0, d = 0]) => (n === 2 * d ? null : q(d)),
      ],
    ],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
  }),
  f3({
    id: "F3.same-den.09",
    form: "order-three-unit-fractions",
    groups: [6, 6],
    kind: "order",
    draw: (r) => [between(r, 2, 10), between(r, 2, 10), between(r, 2, 10)],
    valid: ([a = 0, b = 0, c = 0]) => new Set([a, b, c]).size === 3,
    solve: ([a = 0, b = 0, c = 0]) => sorted([q(1, a), q(1, b), q(1, c)]),
    ref: ([a = 0, b = 0, c = 0]) => sorted([q(-a), q(-b), q(-c)]),
    traps: [
      [
        "by-denominator",
        "conceptual",
        ([a = 0, b = 0, c = 0]) => sorted([q(a), q(b), q(c)]),
      ],
      [
        "as-listed",
        "conceptual",
        ([a = 0, b = 0, c = 0]) => {
          const listed = ["1", "2", "3"];
          return same(listed, sorted([q(1, a), q(1, b), q(1, c)])) ||
            same(listed, sorted([q(a), q(b), q(c)]))
            ? null
            : listed;
        },
      ],
    ],
    extra: ([a = 0, b = 0, c = 0]) => ({
      list: [fr(1, a), fr(1, b), fr(1, c)].join("; "),
      sorted: sorted([q(1, a), q(1, b), q(1, c)])
        .map((i) => [fr(1, a), fr(1, b), fr(1, c)][Number(i) - 1])
        .join(" < "),
    }),
    consts: [1],
  }),
  f3({
    id: "F3.same-den.10",
    form: "compare-a-fraction-with-a-half",
    groups: [6, 6],
    kind: "compare",
    draw: (r) => {
      const d = 2 * between(r, 3, 6);
      return [between(r, 1, d - 1), d];
    },
    valid: ([n = 0, d = 0]) => n < d && 2 * n !== d,
    solve: ([n = 0, d = 0]) => sign(q(n, d), q(1, 2)),
    ref: ([n = 0, d = 0]) => sign(q(2 * n), q(d)),
    traps: [
      ["flipped", "conceptual", ([n = 0, d = 0]) => (2 * n < d ? ">" : "<")],
      ["equal", "conceptual", () => "="],
    ],
    extra: ([n = 0, d = 0]) => ({
      f: fr(n, d),
      h: fr(1, 2),
      sign: sign(q(n, d), q(1, 2)),
    }),
    consts: [1, 2],
  }),
  f3({
    id: "F3.same-den.11",
    form: "select-every-fraction-greater-than-a-half",
    groups: [6, 7],
    kind: "set",
    draw: (r) => [
      between(r, 1, 11),
      between(r, 1, 11),
      between(r, 1, 11),
      between(r, 1, 11),
      2 * between(r, 4, 6),
    ],
    valid: ([a = 0, b = 0, c = 0, e = 0, d = 0]) => {
      const ns = [a, b, c, e];
      const over = ns.filter((n) => 2 * n > d).length;
      return (
        new Set(ns).size === 4 &&
        Math.max(...ns) < d &&
        ns.every((n) => 2 * n !== d) &&
        over > 0 &&
        over < 4
      );
    },
    options: () => ["1", "2", "3", "4"],
    solve: ([a = 0, b = 0, c = 0, e = 0, d = 0]) =>
      [a, b, c, e].flatMap((n, i) => (2 * n > d ? [String(i + 1)] : [])),
    ref: ([a = 0, b = 0, c = 0, e = 0, d = 0]) =>
      [a, b, c, e].flatMap((n, i) =>
        q(n, d).cmp(q(1, 2)) > 0 ? [String(i + 1)] : [],
      ),
    traps: [
      [
        "the-smaller-ones",
        "conceptual",
        ([a = 0, b = 0, c = 0, e = 0, d = 0]) =>
          [a, b, c, e].flatMap((n, i) => (2 * n < d ? [String(i + 1)] : [])),
      ],
      [
        "only-the-largest",
        "conceptual",
        ([a = 0, b = 0, c = 0, e = 0, d = 0]) => {
          const ns = [a, b, c, e];
          const over = ns.filter((n) => 2 * n > d).length;
          return over === 1 ? null : [String(ns.indexOf(Math.max(...ns)) + 1)];
        },
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, e = 0, d = 0]) => ({
      list: [fr(a, d), fr(b, d), fr(c, d), fr(e, d)].join("; "),
      h: fr(1, 2),
      chosen: [a, b, c, e]
        .filter((n) => 2 * n > d)
        .map((n) => fr(n, d))
        .join("; "),
    }),
    consts: [1, 2],
  }),
];

const f3l = forFraction("F3", "line");
const onLine = [
  f3l({
    id: "F3.line.01",
    form: "between-which-whole-numbers-a-fraction-lies",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [between(r, 7, 29), between(r, 3, 6)],
    valid: ([n = 0, d = 0]) => n % d !== 0 && n > d,
    solve: ([n = 0, d = 0]) => q(Math.floor(n / d)),
    ref: ([n = 0, d = 0]) => q((n - (n % d)) / d),
    traps: [
      [
        "the-upper-whole",
        "conceptual",
        ([n = 0, d = 0]) => q(Math.floor(n / d) + 1),
      ],
      [
        "the-remainder",
        "procedural",
        ([n = 0, d = 0]) => (n % d === Math.floor(n / d) + 1 ? null : q(n % d)),
      ],
    ],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
  }),
  f3l({
    id: "F3.line.02",
    form: "a-mark-between-zero-and-one",
    groups: [6, 6],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [between(r, 4, 10), between(r, 2, 7)],
    valid: ([d = 0, k = 0]) => k < d,
    solve: ([d = 0, k = 0]) => q(k, d),
    ref: ([d = 0, k = 0]) => q(1, d).mul(q(k)),
    traps: [
      ["counted-the-end", "conceptual", ([d = 0, k = 0]) => q(k, d + 1)],
      ["counted-the-zero", "conceptual", ([d = 0, k = 0]) => q(k + 1, d)],
      [
        "from-the-other-end",
        "conceptual",
        ([d = 0, k = 0]) => (d - k === k + 1 ? null : q(d - k, d)),
      ],
    ],
    consts: [0, 1],
  }),
  f3l({
    id: "F3.line.03",
    form: "a-mark-between-one-and-two",
    groups: [6, 7],
    kind: "mixed",
    rule: "equivalent",
    draw: (r) => [between(r, 3, 6), between(r, 1, 5)],
    valid: ([d = 0, k = 0]) => k < d,
    solve: ([d = 0, k = 0]) => q(d + k, d),
    ref: ([d = 0, k = 0]) => q(1).add(q(k, d)),
    traps: [
      [
        "fraction-of-the-whole-line",
        "conceptual",
        ([d = 0, k = 0]) => q(d + k, 2 * d),
      ],
      ["forgot-the-whole", "conceptual", ([d = 0, k = 0]) => q(k, d)],
      [
        "whole-line-denominator",
        "conceptual",
        ([d = 0, k = 0]) => q(2 * d + k, 2 * d),
      ],
    ],
    extra: ([d = 0, k = 0]) => ({ m: String(d + k), c: String(2 * d) }),
    consts: [0, 1, 2],
  }),
  f3l({
    id: "F3.line.04",
    form: "the-decimal-near-a-point-on-the-line",
    groups: [6, 7],
    kind: "line",
    draw: (r) => [between(r, 1, 7), pick(r, [4, 5, 8, 10])],
    valid: ([n = 0, d = 0]) => n < d && Math.abs(1 - (2 * n) / d) > 0.2,
    within: () => q(1, 20),
    solve: ([n = 0, d = 0]) => q(n, d),
    ref: ([n = 0, d = 0]) => Q.fromDecimal(String(n / d)),
    traps: [
      ["from-the-other-end", "conceptual", ([n = 0, d = 0]) => q(d - n, d)],
      [
        "digits-after-the-comma",
        "conceptual",
        ([n = 0, d = 0]) =>
          Math.abs(n / d - n / 10) <= 0.06 ? null : Q.fromDecimal(`0,${n}`),
      ],
    ],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d), dec: decimalOf(q(n, d)) }),
    consts: [0, 1],
  }),
  f3l({
    id: "F3.line.05",
    form: "compare-fractions-with-different-denominators",
    groups: [7, 7],
    kind: "compare",
    draw: (r) => [
      between(r, 1, 5),
      pick(r, [2, 3, 4, 5, 6]),
      between(r, 1, 5),
      pick(r, [2, 3, 4, 5, 6]),
    ],
    valid: ([a = 0, b = 0, c = 0, d = 0]) =>
      a < b &&
      c < d &&
      b !== d &&
      a * d !== b * c &&
      (sign(q(a, b), q(c, d)) !== sign(q(a), q(c)) ||
        sign(q(a, b), q(c, d)) !== sign(q(b), q(d))),
    solve: ([a = 0, b = 0, c = 0, d = 0]) => sign(q(a, b), q(c, d)),
    ref: ([a = 0, b = 0, c = 0, d = 0]) =>
      a * d < c * b ? "<" : a * d > c * b ? ">" : "=",
    traps: [
      ["numerators-only", "procedural", ([a = 0, , c = 0]) => sign(q(a), q(c))],
      [
        "bigger-denominator-wins",
        "conceptual",
        ([a = 0, b = 0, c = 0, d = 0]) => {
          const s = sign(q(b), q(d));
          return s === sign(q(a), q(c)) ? null : s;
        },
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => ({
      f: fr(a, b),
      g: fr(c, d),
      sign: sign(q(a, b), q(c, d)),
    }),
  }),
  f3l({
    id: "F3.line.06",
    form: "order-three-fractions-with-different-denominators",
    groups: [7, 8],
    kind: "order",
    draw: (r) => [
      1,
      pick(r, [2, 3, 4]),
      between(r, 1, 3),
      pick(r, [4, 5, 6]),
      between(r, 1, 5),
      pick(r, [6, 8, 10]),
    ],
    valid: ([a = 0, b = 0, c = 0, d = 0, e = 0, f = 0]) =>
      a < b && c < d && e < f && new Set([a / b, c / d, e / f]).size === 3,
    solve: ([a = 0, b = 0, c = 0, d = 0, e = 0, f = 0]) =>
      sorted([q(a, b), q(c, d), q(e, f)]),
    ref: ([a = 0, b = 0, c = 0, d = 0, e = 0, f = 0]) =>
      [a / b, c / d, e / f]
        .map((x, i) => [x, i] as const)
        .sort((x, y) => x[0] - y[0])
        .map(([, i]) => String(i + 1)),
    traps: [
      [
        "by-numerator",
        "conceptual",
        ([a = 0, , c = 0, , e = 0]) => sorted([q(a), q(c), q(e)]),
      ],
      [
        "by-denominator",
        "conceptual",
        ([a = 0, b = 0, c = 0, d = 0, e = 0, f = 0]) => {
          const w = order([b, d, f]);
          return same(w, order([a, c, e])) ? null : w;
        },
      ],
      [
        "largest-first",
        "conceptual",
        ([a = 0, b = 0, c = 0, d = 0, e = 0, f = 0]) => {
          const w = sorted([q(a, b), q(c, d), q(e, f)], true);
          return same(w, order([a, c, e])) || same(w, order([b, d, f]))
            ? null
            : w;
        },
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0, e = 0, f = 0]) => ({
      list: [fr(a, b), fr(c, d), fr(e, f)].join("; "),
      sorted: sorted([q(a, b), q(c, d), q(e, f)])
        .map((i) => [fr(a, b), fr(c, d), fr(e, f)][Number(i) - 1])
        .join(" < "),
    }),
  }),
  f3l({
    id: "F3.line.07",
    form: "the-midpoint-of-two-like-fractions",
    groups: [7, 7],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [between(r, 1, 7), between(r, 8, 12)],
    valid: ([a = 0, d = 0]) => a + 2 < d,
    solve: ([a = 0, d = 0]) => q(a + 1, d),
    ref: ([a = 0, d = 0]) =>
      q(a, d)
        .add(q(a + 2, d))
        .div(q(2)),
    traps: [
      ["the-right-end", "conceptual", ([a = 0, d = 0]) => q(a + 2, d)],
      ["the-left-end", "conceptual", ([a = 0, d = 0]) => q(a, d)],
      [
        "sum-not-halved",
        "procedural",
        ([a = 0, d = 0]) => ((2 * a + 2) % d === 0 ? null : q(2 * a + 2, d)),
      ],
    ],
    extra: ([a = 0, d = 0]) => ({
      f: fr(a, d),
      g: fr(a + 2, d),
      r: fr(a + 1, d),
    }),
    consts: [2],
  }),
  f3l({
    id: "F3.line.08",
    form: "a-fraction-written-as-a-decimal",
    groups: [7, 8],
    kind: "decimal",
    draw: (r) => [between(r, 1, 7), pick(r, [2, 4, 5, 8, 10, 20, 25])],
    valid: ([n = 0, d = 0]) => n < d,
    solve: ([n = 0, d = 0]) => q(n, d),
    ref: ([n = 0, d = 0]) =>
      Q.fromDecimal((n / d).toFixed(4).replace(/0+$/, "").replace(/\.$/, "")),
    traps: [
      [
        "digits-side-by-side",
        "conceptual",
        ([n = 0, d = 0]) => Q.fromDecimal(`0,${n}${d}`),
      ],
      [
        "numerator-after-the-comma",
        "conceptual",
        ([n = 0]) => Q.fromDecimal(`0,${n}`),
      ],
      [
        "denominator-after-the-comma",
        "conceptual",
        ([n = 0, d = 0]) => (n * 10 === d ? null : Q.fromDecimal(`0,${d}`)),
      ],
    ],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
  }),
  f3l({
    id: "F3.line.09",
    form: "the-whole-number-above-a-mixed-number",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [between(r, 1, 9), between(r, 1, 4), between(r, 5, 9)],
    valid: ([, n = 0, d = 0]) => n < d,
    solve: ([w = 0]) => q(w + 1),
    ref: ([w = 0, n = 0, d = 0]) => q(Math.ceil(w + n / d)),
    traps: [
      ["the-lower-whole", "conceptual", ([w = 0]) => q(w)],
      ["added-the-numerator", "procedural", ([w = 0, n = 0]) => q(w + n)],
    ],
    extra: ([w = 0, n = 0, d = 0]) => ({ m: `${w} ${fr(n, d)}` }),
    consts: [1],
  }),
  f3l({
    id: "F3.line.10",
    form: "the-distance-between-two-like-fractions",
    groups: [7, 7],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [between(r, 1, 4), between(r, 6, 11), between(r, 12, 14)],
    valid: ([a = 0, b = 0, d = 0]) => a < b && b < d,
    solve: ([a = 0, b = 0, d = 0]) => q(b - a, d),
    ref: ([a = 0, b = 0, d = 0]) => q(b, d).sub(q(a, d)),
    traps: [
      [
        "sum-of-numerators",
        "procedural",
        ([a = 0, b = 0, d = 0]) => ((a + b) % d === 0 ? null : q(a + b, d)),
      ],
      [
        "position-of-the-second-point",
        "conceptual",
        ([, b = 0, d = 0]) => q(b, d),
      ],
    ],
    extra: ([a = 0, b = 0, d = 0]) => ({
      f: fr(a, d),
      g: fr(b, d),
      r: fr(b - a, d),
    }),
  }),
  f3l({
    id: "F3.line.11",
    form: "the-nearest-whole-number",
    groups: [7, 7],
    kind: "integer",
    draw: (r) => [between(r, 7, 29), between(r, 3, 8)],
    valid: ([n = 0, d = 0]) => n % d !== 0 && (2 * n) % d !== 0 && n > d,
    solve: ([n = 0, d = 0]) => q(Math.round(n / d)),
    ref: ([n = 0, d = 0]) =>
      q((n % d) * 2 > d ? Math.floor(n / d) + 1 : Math.floor(n / d)),
    traps: [
      [
        "the-lower-whole",
        "procedural",
        ([n = 0, d = 0]) => q(Math.floor(n / d)),
      ],
      [
        "the-upper-whole",
        "conceptual",
        ([n = 0, d = 0]) => q(Math.floor(n / d) + 1),
      ],
    ],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
  }),
];

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const lcm = (a: number, b: number): number => (a / gcd(a, b)) * b;

const shareMore = [
  f1({
    id: "F1.share.13",
    form: "a-part-of-a-set-of-objects",
    groups: [5, 6],
    kind: "fraction",
    rule: "equivalent",
    roles: { a: "number of objects in the set", b: "number of marked objects" },
    draw: (r) => [between(r, 8, 16), between(r, 2, 12)],
    valid: ([a = 0, b = 0]) => b < a - 1 && 2 * b !== a,
    solve: ([a = 0, b = 0]) => q(b, a),
    ref: ([a = 0, b = 0]) => q(1).sub(q(a - b, a)),
    traps: [
      ["against-the-others", "conceptual", ([a = 0, b = 0]) => q(b, a - b)],
      ["the-other-colour", "conceptual", ([a = 0, b = 0]) => q(a - b, a)],
    ],
    extra: ([a = 0, b = 0]) => ({ r: fr(b, a) }),
  }),
  f1({
    id: "F1.share.14",
    form: "are-the-parts-equal",
    groups: [5, 6],
    kind: "choice",
    draw: (r) => [between(r, 3, 5), pick(r, [1, 2, 2, 3, 4])],
    options: () => ["1", "2"],
    solve: ([, s = 0]) => (s === 2 ? "1" : "2"),
    ref: ([d = 0, s = 0]) => (s * d === 2 * (d - 1) + s ? "1" : "2"),
    traps: [
      [
        "counted-the-parts",
        "conceptual",
        ([, s = 0]) => (s === 2 ? null : "1"),
      ],
      ["thought-unequal", "conceptual", ([, s = 0]) => (s === 2 ? "2" : null)],
    ],
    extra: ([d = 0]) => ({ f: fr(1, d) }),
    consts: [1, 2],
  }),
  f1({
    id: "F1.share.15",
    form: "working-backwards-through-two-halvings",
    groups: [5, 6],
    origin: { olympiad: "working backwards through halvings, RES-4284" },
    kind: "integer",
    roles: { a: "number of nuts left at the end" },
    draw: (r) => [between(r, 2, 15)],
    solve: ([a = 0]) => q(4 * a),
    ref: ([a = 0]) => q(a).div(q(1, 4)),
    traps: [
      ["one-step-only", "conceptual", ([a = 0]) => q(2 * a)],
      ["each-took-the-same", "conceptual", ([a = 0]) => q(3 * a)],
      [
        "halved-instead",
        "procedural",
        ([a = 0]) => (a % 2 === 0 ? q(a / 2) : null),
      ],
    ],
    consts: [2],
  }),
  f1({
    id: "F1.share.16",
    form: "how-many-cuts-make-equal-parts",
    groups: [5, 6],
    origin: { olympiad: "cuts against pieces, the fence-post count, RES-4284" },
    kind: "integer",
    draw: (r) => [between(r, 3, 12)],
    solve: ([a = 0]) => q(a - 1),
    ref: ([a = 0]) => {
      let pieces = 1;
      let cuts = 0;
      while (pieces < a) {
        pieces += 1;
        cuts += 1;
      }
      return q(cuts);
    },
    traps: [
      ["as-many-as-parts", "conceptual", ([a = 0]) => q(a)],
      ["one-too-many", "conceptual", ([a = 0]) => q(a + 1)],
    ],
    consts: [1, 2],
  }),
];

const CASES_MORE_THAN: readonly (readonly [number, number, number, number])[] =
  [
    [1, 2, 1, 4],
    [1, 3, 1, 6],
    [2, 3, 1, 2],
    [3, 4, 1, 2],
    [1, 2, 1, 3],
    [2, 5, 1, 10],
    [3, 5, 1, 2],
    [1, 4, 1, 8],
    [3, 4, 2, 3],
    [5, 6, 1, 2],
    [2, 3, 1, 6],
    [3, 4, 1, 8],
  ];
const CASES_TWO_TAKES: readonly (readonly [number, number, number, number])[] =
  [
    [1, 2, 1, 3],
    [1, 3, 1, 2],
    [1, 4, 1, 3],
    [1, 2, 1, 4],
    [2, 3, 1, 2],
    [1, 5, 1, 2],
    [3, 4, 1, 3],
    [1, 2, 2, 3],
  ];

const ofNumberMore = [
  f2({
    id: "F2.fraction-of.12",
    form: "how-much-more-is-one-part-of-a-number-than-another",
    groups: [7, 8],
    kind: "integer",
    draw: (r) => {
      const [n1, d1, n2, d2] = pick(r, CASES_MORE_THAN);
      return [n1, d1, n2, d2, lcm(d1, d2) * between(r, 2, 9)];
    },
    solve: ([n1 = 0, d1 = 0, n2 = 0, d2 = 0, c = 0]) =>
      q(c).mul(q(n1, d1).sub(q(n2, d2))),
    ref: ([n1 = 0, d1 = 0, n2 = 0, d2 = 0, c = 0]) =>
      q((c / d1) * n1 - (c / d2) * n2),
    traps: [
      [
        "sum-instead",
        "conceptual",
        ([n1 = 0, d1 = 0, n2 = 0, d2 = 0, c = 0]) =>
          q((c / d1) * n1 + (c / d2) * n2),
      ],
      [
        "the-greater-part-only",
        "conceptual",
        ([n1 = 0, d1 = 0, , , c = 0]) => q((c / d1) * n1),
      ],
      [
        "the-smaller-part-only",
        "conceptual",
        ([n1 = 0, d1 = 0, n2 = 0, d2 = 0, c = 0]) =>
          (c / d2) * n2 === (c / d1) * n1 - (c / d2) * n2
            ? null
            : q((c / d2) * n2),
      ],
    ],
    extra: ([n1 = 0, d1 = 0, n2 = 0, d2 = 0, c = 0]) => ({
      f: fr(n1, d1),
      g: fr(n2, d2),
      x: String((c / d1) * n1),
      y: String((c / d2) * n2),
    }),
  }),
  f2({
    id: "F2.fraction-of.13",
    form: "the-whole-from-the-difference-of-two-parts",
    groups: [7, 8],
    origin: {
      olympiad: "the whole from the difference of two of its parts, RES-4284",
    },
    kind: "integer",
    draw: (r) => [between(r, 2, 9), pick(r, [2, 3, 4, 5])],
    solve: ([a = 0, p = 0]) => q(a * p * (p + 1)),
    ref: ([a = 0, p = 0]) => q(a).div(q(1, p).sub(q(1, p + 1))),
    traps: [
      ["the-difference-itself", "conceptual", ([a = 0]) => q(a)],
      ["the-common-denominator", "conceptual", ([, p = 0]) => q(p * (p + 1))],
      ["only-one-fraction", "conceptual", ([a = 0, p = 0]) => q(a * p)],
    ],
    extra: ([, p = 0]) => ({
      f: fr(1, p),
      g: fr(1, p + 1),
      z: String(p * (p + 1)),
      e: fr(p + 1, p * (p + 1)),
      h: fr(p, p * (p + 1)),
      k: fr(1, p * (p + 1)),
    }),
  }),
  f2({
    id: "F2.fraction-of.14",
    form: "a-part-and-then-a-part-of-the-rest",
    groups: [7, 8],
    kind: "integer",
    roles: { e: "number of nuts in the bag at the start" },
    draw: (r) => {
      const [n1, d1, n2, d2] = pick(r, CASES_TWO_TAKES);
      return [n1, d1, n2, d2, d1 * d2 * between(r, 1, 4)];
    },
    solve: ([n1 = 0, d1 = 0, n2 = 0, d2 = 0, e = 0]) => {
      const rest = e - (e / d1) * n1;
      return q(rest - (rest / d2) * n2);
    },
    ref: ([n1 = 0, d1 = 0, n2 = 0, d2 = 0, e = 0]) =>
      q(e)
        .mul(q(d1 - n1, d1))
        .mul(q(d2 - n2, d2)),
    traps: [
      [
        "both-from-the-whole",
        "conceptual",
        ([n1 = 0, d1 = 0, n2 = 0, d2 = 0, e = 0]) => {
          const rest = e - (e / d1) * n1;
          const w = e - (e / d1) * n1 - (e / d2) * n2;
          return w < 0 || w === rest - (rest / d2) * n2 ? null : q(w);
        },
      ],
      [
        "only-the-first-step",
        "procedural",
        ([n1 = 0, d1 = 0, , , e = 0]) => q(e - (e / d1) * n1),
      ],
      [
        "taken-instead",
        "conceptual",
        ([n1 = 0, d1 = 0, n2 = 0, d2 = 0, e = 0]) => {
          const rest = e - (e / d1) * n1;
          const taken = (e / d1) * n1 + (rest / d2) * n2;
          return taken === e - taken ? null : q(taken);
        },
      ],
    ],
    extra: ([n1 = 0, d1 = 0, n2 = 0, d2 = 0, e = 0]) => {
      const x = (e / d1) * n1;
      const y = e - x;
      return {
        f: fr(n1, d1),
        g: fr(n2, d2),
        x: String(x),
        y: String(y),
        z: String((y / d2) * n2),
      };
    },
  }),
  f2({
    id: "F2.fraction-of.15",
    form: "the-whole-from-what-is-left",
    groups: [7, 8],
    kind: "integer",
    roles: {
      a: "numerator of the spent share",
      b: "denominator of the spent share",
      c: "money left",
    },
    draw: (r) => [
      between(r, 1, 4),
      pick(r, [3, 4, 5, 6, 8]),
      between(r, 2, 12),
    ],
    valid: ([n = 0, d = 0]) => n < d,
    solve: ([, d = 0, k = 0]) => q(d * k),
    ref: ([n = 0, d = 0, k = 0]) => q((d - n) * k).div(q(d - n, d)),
    traps: [
      [
        "the-amount-left",
        "conceptual",
        ([n = 0, d = 0, k = 0]) => q((d - n) * k),
      ],
      [
        "left-times-denominator",
        "procedural",
        ([n = 0, d = 0, k = 0]) => (d - n === 1 ? null : q((d - n) * k * d)),
      ],
      [
        "left-plus-the-numerator",
        "procedural",
        ([n = 0, d = 0, k = 0]) => q((d - n) * k + n),
      ],
    ],
    extra: ([n = 0, d = 0, k = 0]) => ({
      f: fr(n, d),
      c: String((d - n) * k),
      u: String(k),
    }),
  }),
];

const likeDenMore = [
  f3({
    id: "F3.same-den.12",
    form: "compare-fractions-with-the-same-numerator",
    groups: [6, 6],
    kind: "compare",
    draw: (r) => [between(r, 2, 7), between(r, 5, 12), between(r, 5, 12)],
    valid: ([n = 0, d1 = 0, d2 = 0]) => d1 !== d2 && n < d1 && n < d2,
    solve: ([n = 0, d1 = 0, d2 = 0]) => sign(q(n, d1), q(n, d2)),
    ref: ([n = 0, d1 = 0, d2 = 0]) => sign(q(n * d2), q(n * d1)),
    traps: [
      [
        "bigger-denominator-wins",
        "conceptual",
        ([, d1 = 0, d2 = 0]) => (d1 < d2 ? "<" : ">"),
      ],
      ["equal-numerators", "conceptual", () => "="],
    ],
    extra: ([n = 0, d1 = 0, d2 = 0]) => ({
      f: fr(n, d1),
      g: fr(n, d2),
      sign: sign(q(n, d1), q(n, d2)),
    }),
  }),
  f3({
    id: "F3.same-den.13",
    form: "how-many-like-fractions-lie-between-two",
    groups: [6, 7],
    origin: {
      olympiad:
        "fractions between two like fractions, the fence-post count, RES-4284",
    },
    kind: "integer",
    draw: (r) => [between(r, 1, 6), between(r, 3, 8), between(r, 12, 16)],
    valid: ([a = 0, k = 0, d = 0]) => a + k < d,
    solve: ([, k = 0]) => q(k - 1),
    ref: ([a = 0, k = 0]) => {
      let count = 0;
      for (let x = a + 1; x < a + k; x += 1) count += 1;
      return q(count);
    },
    traps: [
      ["numbers-subtracted", "procedural", ([, k = 0]) => q(k)],
      ["both-ends-counted", "conceptual", ([, k = 0]) => q(k + 1)],
    ],
    extra: ([a = 0, k = 0, d = 0]) => ({ f: fr(a, d), g: fr(a + k, d) }),
    consts: [1],
  }),
  f3({
    id: "F3.same-den.14",
    form: "how-many-proper-fractions-exceed-a-half",
    groups: [6, 7],
    origin: { olympiad: "counting proper fractions above one half, RES-4284" },
    kind: "integer",
    draw: (r) => [between(r, 5, 20)],
    solve: ([d = 0]) => q(d - 1 - Math.floor(d / 2)),
    ref: ([d = 0]) =>
      q(
        Array.from({ length: d - 1 }, (_, i) => i + 1).filter((n) => 2 * n > d)
          .length,
      ),
    traps: [
      ["all-proper-fractions", "conceptual", ([d = 0]) => q(d - 1)],
      ["the-half-counted", "conceptual", ([d = 0]) => q(d - Math.floor(d / 2))],
    ],
    extra: () => ({ h: fr(1, 2) }),
    consts: [1, 2],
  }),
  f3({
    id: "F3.same-den.15",
    form: "the-second-fraction-has-more-parts",
    groups: [6, 6],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [between(r, 1, 6), between(r, 2, 5), between(r, 8, 12)],
    valid: ([a = 0, k = 0, d = 0]) => a + k < d,
    solve: ([a = 0, k = 0, d = 0]) => q(a + k, d),
    ref: ([a = 0, k = 0, d = 0]) => q(a, d).add(q(k, d)),
    traps: [
      [
        "denominator-changed",
        "conceptual",
        ([a = 0, k = 0, d = 0]) => q(a + k, d + k),
      ],
      [
        "added-to-denominator",
        "conceptual",
        ([a = 0, k = 0, d = 0]) => q(a, d + k),
      ],
      ["the-difference", "conceptual", ([, k = 0, d = 0]) => q(k, d)],
    ],
    extra: ([a = 0, k = 0, d = 0]) => ({
      f: fr(a, d),
      r: fr(a + k, d),
    }),
  }),
];

const onLineMore = [
  f3l({
    id: "F3.line.12",
    form: "halfway-between-zero-and-a-fraction",
    groups: [7, 7],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [between(r, 1, 9), between(r, 5, 12)],
    valid: ([n = 0, d = 0]) => n < d,
    solve: ([n = 0, d = 0]) => q(n, 2 * d),
    ref: ([n = 0, d = 0]) => q(n, d).div(q(2)),
    traps: [
      ["the-fraction-itself", "conceptual", ([n = 0, d = 0]) => q(n, d)],
      ["doubled-instead", "conceptual", ([n = 0, d = 0]) => q(2 * n, d)],
    ],
    extra: ([n = 0, d = 0]) => ({ z: "0", f: fr(n, d), r: fr(n, 2 * d) }),
    consts: [0, 2],
  }),
  f3l({
    id: "F3.line.13",
    form: "jumps-of-a-unit-fraction-along-the-line",
    groups: [6, 7],
    kind: "mixed",
    rule: "equivalent",
    roles: { a: "number of jumps", b: "number of jumps that make one whole" },
    draw: (r) => [between(r, 5, 20), between(r, 2, 6)],
    valid: ([k = 0, d = 0]) => k > d && k % d !== 0,
    solve: ([k = 0, d = 0]) => q(k, d),
    ref: ([k = 0, d = 0]) => q(1, d).mul(q(k)),
    traps: [
      ["wholes-only", "procedural", ([k = 0, d = 0]) => q(Math.floor(k / d))],
      ["the-fraction-part-only", "conceptual", ([k = 0, d = 0]) => q(k % d, d)],
    ],
    extra: ([, d = 0]) => ({ f: fr(1, d) }),
  }),
  f3l({
    id: "F3.line.14",
    form: "a-fraction-between-two-neighbours",
    groups: [7, 8],
    origin: {
      olympiad:
        "a fraction between neighbours by doubling the denominator, RES-4284",
    },
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [between(r, 1, 8), between(r, 5, 12)],
    valid: ([a = 0, d = 0]) => a + 1 < d,
    solve: ([a = 0, d = 0]) => q(2 * a + 1, 2 * d),
    ref: ([a = 0, d = 0]) =>
      q(a, d)
        .add(q(a + 1, d))
        .div(q(2)),
    traps: [
      ["the-left-end", "conceptual", ([a = 0, d = 0]) => q(2 * a, 2 * d)],
      ["the-right-end", "conceptual", ([a = 0, d = 0]) => q(2 * a + 2, 2 * d)],
    ],
    extra: ([a = 0, d = 0]) => ({
      f: fr(a, d),
      g: fr(a + 1, d),
      h: String(2 * d),
      e: fr(2 * a, 2 * d),
      k: fr(2 * a + 2, 2 * d),
      r: fr(2 * a + 1, 2 * d),
    }),
    consts: [2],
  }),
  f3l({
    id: "F3.line.15",
    form: "the-mark-of-a-fraction-on-a-finer-scale",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [between(r, 1, 5), pick(r, [3, 4, 5]), pick(r, [2, 3, 4])],
    valid: ([a = 0, b = 0]) => a < b,
    solve: ([a = 0, , k = 0]) => q(a * k),
    ref: ([a = 0, b = 0, k = 0]) => q(a, b).mul(q(b * k)),
    traps: [
      ["numerator-as-tick", "conceptual", ([a = 0]) => q(a)],
      [
        "from-the-other-end",
        "conceptual",
        ([a = 0, b = 0, k = 0]) => (b === 2 * a ? null : q((b - a) * k)),
      ],
    ],
    extra: ([a = 0, b = 0, k = 0]) => ({
      c: String(b * k),
      f: fr(a, b),
      u: String(k),
    }),
    consts: [0, 1],
  }),
];

export const fSpecs1: readonly Spec<never>[] = [
  ...share,
  ...shareMore,
  ...ofNumber,
  ...ofNumberMore,
  ...likeDen,
  ...likeDenMore,
  ...onLine,
  ...onLineMore,
];
