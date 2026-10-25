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
    ref: ([n = 0, d = 0]) => q(2 * n, 2 * d),
    traps: [
      ["against-the-rest", "conceptual", ([n = 0, d = 0]) => q(n, d - n)],
    ],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
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
    traps: [["the-shaded-part", "conceptual", ([n = 0, d = 0]) => q(n, d)]],
  }),
  f1({
    id: "F1.share.03",
    form: "how-many-equal-parts-make-a-whole",
    groups: [5, 5],
    kind: "integer",
    draw: (r) => [between(r, 2, 10)],
    solve: ([d = 0]) => q(d),
    ref: ([d = 0]) => q(Array.from({ length: d }).length),
    traps: [["one-part", "conceptual", () => q(1)]],
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
    ref: ([n = 0, d = 0]) => q(3 * n, 3 * d),
    traps: [["upside-down", "conceptual", ([n = 0, d = 0]) => q(d, n)]],
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
    ref: ([, d = 0]) => q(2, 2 * d),
    traps: [["against-the-amount", "conceptual", ([c = 0]) => q(1, c)]],
  }),
  f1({
    id: "F1.share.08",
    form: "the-whole-from-its-half",
    groups: [5, 6],
    kind: "integer",
    draw: (r) => [2 * between(r, 3, 25)],
    solve: ([x = 0]) => q(2 * x),
    ref: ([x = 0]) => q(x + x),
    traps: [["half-again", "conceptual", ([x = 0]) => q(x / 2)]],
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
    ref: ([a = 0, b = 0]) => (a < b ? ">" : "<"),
    traps: [
      [
        "bigger-denominator-wins",
        "conceptual",
        ([a = 0, b = 0]) => (a < b ? "<" : ">"),
      ],
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
    traps: [["difference", "procedural", ([d = 0, k = 0]) => q(d * k - d)]],
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
    traps: [["the-eaten-part", "conceptual", ([n = 0, d = 0]) => q(n, d)]],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
  }),
  f1({
    id: "F1.share.12",
    form: "how-many-quarters-in-some-wholes",
    groups: [5, 6],
    kind: "integer",
    draw: (r) => [between(r, 2, 9)],
    solve: ([k = 0]) => q(4 * k),
    ref: ([k = 0]) => q(k + k + k + k),
    traps: [["halves", "conceptual", ([k = 0]) => q(2 * k)]],
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
    ref: ([c = 0]) => q(c).mul(q(1, 2)),
    traps: [["doubled", "conceptual", ([c = 0]) => q(2 * c)]],
    consts: [2],
  }),
  f2({
    id: "F2.fraction-of.02",
    form: "a-quarter-of-a-number",
    groups: [5, 6],
    kind: "integer",
    draw: (r) => [4 * between(r, 4, 40)],
    solve: ([c = 0]) => q(c / 4),
    ref: ([c = 0]) => q(c).mul(q(1, 4)),
    traps: [["half", "conceptual", ([c = 0]) => q(c / 2)]],
  }),
  f2({
    id: "F2.fraction-of.03",
    form: "a-third-of-a-number",
    groups: [5, 6],
    kind: "integer",
    draw: (r) => [3 * between(r, 4, 40)],
    solve: ([c = 0]) => q(c / 3),
    ref: ([c = 0]) => q(c).mul(q(1, 3)),
    traps: [["the-rest", "conceptual", ([c = 0]) => q((2 * c) / 3)]],
  }),
  f2({
    id: "F2.fraction-of.04",
    form: "a-tenth-of-a-number",
    groups: [5, 6],
    kind: "integer",
    draw: (r) => [10 * between(r, 5, 90)],
    solve: ([c = 0]) => q(c / 10),
    ref: ([c = 0]) => q(c).mul(q(1, 10)),
    traps: [["ten-times", "procedural", ([c = 0]) => q(10 * c)]],
    consts: [10],
  }),
  f2({
    id: "F2.fraction-of.05",
    form: "a-unit-fraction-of-an-amount-of-money",
    groups: [5, 6],
    kind: "integer",
    draw: (r) => [pick(r, [2, 4, 5, 8, 10]), between(r, 3, 30)],
    solve: ([, k = 0]) => q(k),
    ref: ([d = 0, k = 0]) => q(d * k).mul(q(1, d)),
    traps: [["multiplied", "procedural", ([d = 0, k = 0]) => q(d * d * k)]],
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
    ref: ([n = 0, d = 0, k = 0]) => q(d * k).mul(q(n, d)),
    traps: [["unit-part-only", "procedural", ([, , k = 0]) => q(k)]],
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
    ref: ([n = 0, d = 0, k = 0]) => q(d * k).mul(q(n, d)),
    traps: [
      [
        "unit-part-only",
        "procedural",
        ([n = 0, , k = 0]) => (n === 1 ? null : q(k)),
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
    traps: [["the-part-taken", "conceptual", ([n = 0, , k = 0]) => q(n * k)]],
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
    ref: ([c = 0]) => q(c).mul(q(1, 3)).mul(q(1, 2)),
    traps: [["only-the-third", "procedural", ([c = 0]) => q(c / 3)]],
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
    ref: ([n = 0, d = 0]) => q(60).mul(q(n, d)),
    traps: [["numerator-as-minutes", "conceptual", ([n = 0]) => q(n)]],
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
    ref: ([a = 0, b = 0]) => (a < b ? "<" : ">"),
    traps: [["flipped", "conceptual", ([a = 0, b = 0]) => (a < b ? ">" : "<")]],
    extra: ([a = 0, b = 0, d = 0]) => ({
      f: fr(a, d),
      g: fr(b, d),
      sign: sign(q(a, d), q(b, d)),
    }),
  }),
  f3({
    id: "F3.same-den.02",
    form: "the-larger-of-two-like-fractions",
    groups: [5, 6],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [between(r, 1, 9), between(r, 1, 9), between(r, 5, 12)],
    valid: ([a = 0, b = 0, d = 0]) => a !== b && a < d && b < d,
    solve: ([a = 0, b = 0, d = 0]) => q(Math.max(a, b), d),
    ref: ([a = 0, b = 0, d = 0]) => (a > b ? q(a, d) : q(b, d)),
    traps: [
      [
        "the-smaller",
        "conceptual",
        ([a = 0, b = 0, d = 0]) => q(Math.min(a, b), d),
      ],
    ],
    extra: ([a = 0, b = 0, d = 0]) => ({ f: fr(a, d), g: fr(b, d) }),
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
    ref: ([a = 0, b = 0, c = 0]) => sorted([q(a), q(b), q(c)]),
    traps: [
      [
        "largest-first",
        "conceptual",
        ([a = 0, b = 0, c = 0, d = 0]) =>
          sorted([q(a, d), q(b, d), q(c, d)], true),
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
    ref: ([a = 0, b = 0]) => q(Math.abs(b - a)),
    traps: [["parts-added", "procedural", ([a = 0, b = 0]) => q(a + b)]],
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
    ],
    extra: ([a = 0, b = 0, d = 0]) => ({ f: fr(a, d), g: fr(b, d) }),
  }),
  f3({
    id: "F3.same-den.06",
    form: "compare-a-fraction-with-one",
    groups: [6, 6],
    kind: "compare",
    draw: (r) => [between(r, 2, 14), between(r, 4, 12)],
    valid: ([n = 0, d = 0]) => n !== d,
    solve: ([n = 0, d = 0]) => sign(q(n, d), q(1)),
    ref: ([n = 0, d = 0]) => (n < d ? "<" : ">"),
    traps: [["equal", "conceptual", () => "="]],
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
    traps: [["the-larger-end", "conceptual", ([a = 0]) => q(a + 2)]],
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
    ref: ([n = 0, d = 0]) => q(n).sub(q(d)),
    traps: [["numerator", "conceptual", ([n = 0]) => q(n)]],
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
    draw: (r) => [between(r, 1, 11), 2 * between(r, 3, 6)],
    valid: ([n = 0, d = 0]) => n < d && 2 * n !== d,
    solve: ([n = 0, d = 0]) => sign(q(n, d), q(1, 2)),
    ref: ([n = 0, d = 0]) => (2 * n < d ? "<" : ">"),
    traps: [
      ["flipped", "conceptual", ([n = 0, d = 0]) => (2 * n < d ? ">" : "<")],
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
      ["1", "2", "3", "4"].filter(
        (_, i) => 2 * (i === 0 ? a : i === 1 ? b : i === 2 ? c : e) > d,
      ),
    traps: [
      [
        "the-smaller-ones",
        "conceptual",
        ([a = 0, b = 0, c = 0, e = 0, d = 0]) =>
          [a, b, c, e].flatMap((n, i) => (2 * n < d ? [String(i + 1)] : [])),
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
    ref: ([d = 0, k = 0]) => q(2 * k, 2 * d),
    traps: [["counted-the-end", "conceptual", ([d = 0, k = 0]) => q(k, d + 1)]],
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
    ],
    extra: ([d = 0, k = 0]) => ({ m: String(d + k), c: String(2 * d) }),
    consts: [0, 1, 2],
  }),
  f3l({
    id: "F3.line.04",
    form: "the-decimal-near-a-point-on-the-line",
    groups: [6, 7],
    kind: "line",
    draw: (r) => [pick(r, [1, 3, 5, 7]), 8],
    valid: ([n = 0]) => Math.abs(1 - (2 * n) / 8) > 0.2,
    within: () => q(1, 20),
    solve: ([n = 0, d = 0]) => q(n, d),
    ref: ([n = 0, d = 0]) => Q.fromDecimal(String(n / d)),
    traps: [
      ["from-the-other-end", "conceptual", ([n = 0, d = 0]) => q(d - n, d)],
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
      sign(q(a, b), q(c, d)) !== sign(q(a), q(c)),
    solve: ([a = 0, b = 0, c = 0, d = 0]) => sign(q(a, b), q(c, d)),
    ref: ([a = 0, b = 0, c = 0, d = 0]) =>
      a * d < c * b ? "<" : a * d > c * b ? ">" : "=",
    traps: [
      ["numerators-only", "procedural", ([a = 0, , c = 0]) => sign(q(a), q(c))],
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
    traps: [["the-right-end", "conceptual", ([a = 0, d = 0]) => q(a + 2, d)]],
    extra: ([a = 0, d = 0]) => ({ f: fr(a, d), g: fr(a + 2, d) }),
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
    ref: ([w = 0]) => q(w).add(q(1)),
    traps: [["the-lower-whole", "conceptual", ([w = 0]) => q(w)]],
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
        ([a = 0, b = 0, d = 0]) => q(a + b, d),
      ],
    ],
    extra: ([a = 0, b = 0, d = 0]) => ({ f: fr(a, d), g: fr(b, d) }),
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
    ],
    extra: ([n = 0, d = 0]) => ({ f: fr(n, d) }),
  }),
];

export const fSpecs1: readonly Spec<never>[] = [
  ...share,
  ...ofNumber,
  ...likeDen,
  ...onLine,
];
