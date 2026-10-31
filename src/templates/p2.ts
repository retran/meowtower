// Domain P, part 2: shares and percentage change, value added tax and profit, ratios, and prices per unit
// (RES-4287). The Dutch goals name percentages "ook boven 100%", interest, VAT, profit and loss at group 8
// and ratios and prices per unit at group 6. Texts are plain blanks in `content/tasks-p.ru.json`.
import { Q } from "../math/q.js";
import { between, pick } from "./draw.js";
import { dec, forFraction, fr, q, qd } from "./kitf.js";
import { SIGNS, type Spec } from "./spec.js";

const sign = (x: Q, y: Q): (typeof SIGNS)[number] => SIGNS[x.cmp(y) + 1] ?? "=";
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
/** The number when it is a whole number, or null. */
const whole = (x: Q): Q | null => (x.d === 1n ? x : null);

const p3 = forFraction("P3", "share-of");
const shareOf = [
  p3({
    id: "P3.share-of.01",
    form: "what-percentage-one-number-is-of-another",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [between(r, 3, 45), pick(r, [20, 25, 40, 50])],
    valid: ([a = 0, b = 0]) => a < b && (100 * a) % b === 0 && 2 * a !== b,
    solve: ([a = 0, b = 0]) => q((100 * a) / b),
    ref: ([a = 0, b = 0]) => q(a).div(q(b)).mul(q(100)),
    traps: [["count-itself", "conceptual", ([a = 0]) => q(a)]],
    consts: [100],
  }),
  p3({
    id: "P3.share-of.02",
    form: "the-percentage-by-which-a-number-grew",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [pick(r, [20, 40, 50, 80, 100]), between(r, 11, 60)],
    valid: ([o = 0, g = 0]) => (100 * g) % o === 0 && g !== o,
    solve: ([o = 0, g = 0]) => q((100 * g) / o),
    ref: ([o = 0, g = 0]) => q(g).div(q(o)).mul(q(100)),
    traps: [
      [
        "new-as-a-share-of-old",
        "conceptual",
        ([o = 0, g = 0]) => q((100 * (o + g)) / o),
      ],
    ],
    extra: ([o = 0, g = 0]) => ({ n: String(o + g) }),
    consts: [100],
  }),
  p3({
    id: "P3.share-of.03",
    form: "the-percentage-by-which-a-number-fell",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [pick(r, [20, 40, 50, 80, 100]), between(r, 5, 19)],
    valid: ([o = 0, g = 0]) => (100 * g) % o === 0 && g < o,
    solve: ([o = 0, g = 0]) => q((100 * g) / o),
    ref: ([o = 0, g = 0]) => q(g).div(q(o)).mul(q(100)),
    traps: [
      [
        "new-as-a-share-of-old",
        "conceptual",
        ([o = 0, g = 0]) => q((100 * (o - g)) / o),
      ],
    ],
    extra: ([o = 0, g = 0]) => ({ n: String(o - g) }),
    consts: [100],
  }),
  p3({
    id: "P3.share-of.04",
    form: "a-value-after-a-percentage-increase",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [pick(r, [10, 20, 25, 50]), 20 * between(r, 2, 15)],
    solve: ([p = 0, n = 0]) => q((n * (100 + p)) / 100),
    ref: ([p = 0, n = 0]) => q(n).mul(qd(100 + p, 2)),
    traps: [
      ["the-increase-only", "conceptual", ([p = 0, n = 0]) => q((n * p) / 100)],
      [
        "percentage-added-as-a-number",
        "procedural",
        ([p = 0, n = 0]) => q(n + p),
      ],
    ],
    consts: [100],
  }),
  p3({
    id: "P3.share-of.05",
    form: "a-value-after-a-percentage-decrease",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [pick(r, [10, 20, 25, 50]), 20 * between(r, 2, 15)],
    solve: ([p = 0, n = 0]) => q((n * (100 - p)) / 100),
    ref: ([p = 0, n = 0]) => q(n).sub(q(n).mul(qd(p, 2))),
    traps: [
      ["the-decrease-only", "conceptual", ([p = 0, n = 0]) => q((n * p) / 100)],
    ],
    consts: [100],
  }),
  p3({
    id: "P3.share-of.06",
    form: "a-share-of-a-population",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [between(r, 20, 400), pick(r, [200, 400, 500, 800, 1000])],
    valid: ([a = 0, t = 0]) => a < t && (100 * a) % t === 0 && 2 * a !== t,
    solve: ([a = 0, t = 0]) => q((100 * a) / t),
    ref: ([a = 0, t = 0]) => q(a, t).mul(q(100)),
    traps: [["count-itself", "conceptual", ([a = 0]) => q(a)]],
    consts: [100],
  }),
  p3({
    id: "P3.share-of.07",
    form: "the-difference-in-percentage-points",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [between(r, 20, 45), between(r, 46, 80)],
    solve: ([a = 0, b = 0]) => q(b - a),
    ref: ([a = 0, b = 0]) => q(b).sub(q(a)),
    traps: [["added", "procedural", ([a = 0, b = 0]) => q(a + b)]],
  }),
  p3({
    id: "P3.share-of.08",
    form: "the-original-value-before-an-increase",
    groups: [8, 8],
    origin: {
      extension: "undoing a percentage increase, Russian grade 6 (RES-4287)",
    },
    kind: "integer",
    draw: (r) => [pick(r, [10, 20, 25, 50]), 20 * between(r, 2, 12)],
    solve: ([, o = 0]) => q(o),
    ref: ([p = 0, o = 0]) => q((o * (100 + p)) / 100).div(qd(100 + p, 2)),
    traps: [
      [
        "decrease-by-the-same-percentage",
        "conceptual",
        ([p = 0, o = 0]) => whole(q(o * (100 + p) * (100 - p), 10000)),
      ],
    ],
    extra: ([p = 0, o = 0]) => ({ m: String((o * (100 + p)) / 100) }),
    consts: [1, 100],
  }),
  p3({
    id: "P3.share-of.09",
    form: "the-original-price-before-a-discount",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [pick(r, [10, 20, 25, 50]), 20 * between(r, 2, 12)],
    solve: ([, o = 0]) => q(o),
    ref: ([p = 0, o = 0]) => q((o * (100 - p)) / 100).div(qd(100 - p, 2)),
    traps: [
      [
        "increase-by-the-same-percentage",
        "conceptual",
        ([p = 0, o = 0]) => whole(q(o * (100 - p) * (100 + p), 10000)),
      ],
    ],
    extra: ([p = 0, o = 0]) => ({ m: String((o * (100 - p)) / 100) }),
    consts: [1, 100],
  }),
  p3({
    id: "P3.share-of.10",
    form: "a-share-rounded-to-whole-percent",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [between(r, 2, 8), pick(r, [3, 6, 7, 9, 11])],
    valid: ([a = 0, b = 0]) =>
      a < b &&
      (100 * a) % b !== 0 &&
      Math.floor((100 * a) / b) !== Math.round((100 * a) / b),
    solve: ([a = 0, b = 0]) => q(Math.round((100 * a) / b)),
    ref: ([a = 0, b = 0]) => q(Math.floor((200 * a + b) / (2 * b))),
    traps: [
      [
        "cut-off",
        "procedural",
        ([a = 0, b = 0]) => q(Math.floor((100 * a) / b)),
      ],
    ],
    consts: [100],
  }),
  p3({
    id: "P3.share-of.11",
    form: "the-share-of-one-metal-in-an-alloy",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [between(r, 1, 9), between(r, 1, 9)],
    valid: ([a = 0, b = 0]) => a !== b && (100 * a) % (a + b) === 0,
    solve: ([a = 0, b = 0]) => q((100 * a) / (a + b)),
    ref: ([a = 0, b = 0]) => q(a, a + b).mul(q(100)),
    traps: [
      [
        "against-the-other-part",
        "conceptual",
        ([a = 0, b = 0]) => whole(q(100 * a, b)),
      ],
    ],
    extra: ([a = 0, b = 0]) => ({ t: String(a + b) }),
    consts: [100],
  }),
  p3({
    id: "P3.share-of.12",
    form: "the-factor-of-a-percentage-increase",
    groups: [8, 8],
    kind: "decimal",
    draw: (r) => [pick(r, [10, 20, 25, 50, 75])],
    solve: ([p = 0]) => qd(100 + p, 2),
    ref: ([p = 0]) => q(1).add(q(p, 100)),
    traps: [["the-percentage-itself", "conceptual", ([p = 0]) => qd(p, 2)]],
    consts: [1],
  }),
];

const p3v = forFraction("P3", "vat");
const vat = [
  p3v({
    id: "P3.vat.01",
    form: "a-price-with-value-added-tax",
    groups: [8, 8],
    kind: "decimal",
    draw: (r) => [between(r, 2, 9)],
    solve: ([k = 0]) => q(121 * k),
    ref: ([k = 0]) => q(100 * k).mul(qd(121, 2)),
    traps: [["tax-as-a-number", "procedural", ([k = 0]) => q(100 * k + 21)]],
    extra: ([k = 0]) => ({ x: String(100 * k) }),
    consts: [21],
  }),
  p3v({
    id: "P3.vat.02",
    form: "a-price-without-value-added-tax",
    groups: [8, 8],
    kind: "decimal",
    draw: (r) => [between(r, 2, 9)],
    solve: ([k = 0]) => q(100 * k),
    ref: ([k = 0]) => q(121 * k).div(qd(121, 2)),
    traps: [
      [
        "tax-taken-off-the-total",
        "conceptual",
        ([k = 0]) => qd(79 * 121 * k, 2),
      ],
    ],
    extra: ([k = 0]) => ({ x: String(121 * k) }),
    consts: [1, 21, 100, 121],
  }),
  p3v({
    id: "P3.vat.03",
    form: "the-amount-of-value-added-tax",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [between(r, 2, 9)],
    solve: ([k = 0]) => q(21 * k),
    ref: ([k = 0]) => q(100 * k).mul(qd(21, 2)),
    traps: [["percentage-as-the-amount", "conceptual", () => q(21)]],
    extra: ([k = 0]) => ({ x: String(100 * k) }),
    consts: [21, 100],
  }),
  p3v({
    id: "P3.vat.04",
    form: "a-price-with-a-low-rate-of-tax",
    groups: [8, 8],
    kind: "decimal",
    draw: (r) => [between(r, 2, 9)],
    solve: ([k = 0]) => q(109 * k),
    ref: ([k = 0]) => q(100 * k).add(q(9 * k)),
    traps: [["tax-as-a-number", "procedural", ([k = 0]) => q(100 * k + 9)]],
    extra: ([k = 0]) => ({ x: String(100 * k) }),
    consts: [9],
  }),
  p3v({
    id: "P3.vat.05",
    form: "a-selling-price-with-a-profit",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [100 * between(r, 4, 20), pick(r, [50, 100, 150])],
    solve: ([b = 0, p = 0]) => q((b * (100 + p)) / 100),
    ref: ([b = 0, p = 0]) => q(b).add(q(b).mul(qd(p, 2))),
    traps: [
      ["the-profit-only", "conceptual", ([b = 0, p = 0]) => q((b * p) / 100)],
    ],
    consts: [100],
  }),
  p3v({
    id: "P3.vat.06",
    form: "a-selling-price-with-a-loss",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [100 * between(r, 4, 20), pick(r, [10, 20, 25, 50])],
    solve: ([b = 0, p = 0]) => q((b * (100 - p)) / 100),
    ref: ([b = 0, p = 0]) => q(b).sub(q(b).mul(qd(p, 2))),
    traps: [
      ["the-loss-only", "conceptual", ([b = 0, p = 0]) => q((b * p) / 100)],
    ],
    consts: [100],
  }),
  p3v({
    id: "P3.vat.07",
    form: "interest-for-one-year",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [pick(r, [2, 4, 5, 10]), 100 * between(r, 2, 20)],
    solve: ([p = 0, b = 0]) => q((p * b) / 100),
    ref: ([p = 0, b = 0]) => q(b).mul(qd(p, 2)),
    traps: [["percentage-as-the-amount", "conceptual", ([p = 0]) => q(p)]],
    consts: [100],
  }),
  p3v({
    id: "P3.vat.08",
    form: "a-balance-after-a-year-of-interest",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [pick(r, [2, 4, 5, 10]), 100 * between(r, 2, 20)],
    solve: ([p = 0, b = 0]) => q(b + (p * b) / 100),
    ref: ([p = 0, b = 0]) => q(b).mul(qd(100 + p, 2)),
    traps: [
      ["the-interest-only", "conceptual", ([p = 0, b = 0]) => q((p * b) / 100)],
    ],
    consts: [100],
  }),
  p3v({
    id: "P3.vat.09",
    form: "a-discount-and-then-value-added-tax",
    groups: [8, 8],
    kind: "decimal",
    draw: (r) => [100 * between(r, 1, 5), pick(r, [10, 20, 25])],
    solve: ([b = 0, p = 0]) =>
      q(b)
        .mul(q(100 - p, 100))
        .mul(qd(121, 2)),
    ref: ([b = 0, p = 0]) => q(b * (100 - p) * 121, 10000),
    traps: [
      [
        "percentages-added",
        "procedural",
        ([b = 0, p = 0]) => q(b).mul(q(100 + 21 - p, 100)),
      ],
    ],
    consts: [21],
  }),
  p3v({
    id: "P3.vat.10",
    form: "a-sale-price",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [pick(r, [20, 25, 40, 50]), 20 * between(r, 2, 10)],
    solve: ([p = 0, n = 0]) => q((n * (100 - p)) / 100),
    ref: ([p = 0, n = 0]) => q(n).mul(q(100 - p, 100)),
    traps: [
      ["the-discount-only", "conceptual", ([p = 0, n = 0]) => q((n * p) / 100)],
    ],
    consts: [100],
  }),
  p3v({
    id: "P3.vat.11",
    form: "a-sales-commission",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [pick(r, [2, 3, 4, 5]), 500 * between(r, 1, 8)],
    solve: ([p = 0, n = 0]) => q((p * n) / 100),
    ref: ([p = 0, n = 0]) => q(n).mul(qd(p, 2)),
    traps: [["percentage-as-the-amount", "conceptual", ([p = 0]) => q(p)]],
    consts: [100],
  }),
  p3v({
    id: "P3.vat.12",
    form: "the-total-for-several-items-with-value-added-tax",
    groups: [8, 8],
    kind: "decimal",
    draw: (r) => [between(r, 2, 6)],
    solve: ([n = 0]) => qd(6050 * n, 2),
    ref: ([n = 0]) => q(50 * n).mul(qd(121, 2)),
    traps: [["tax-as-a-number", "procedural", ([n = 0]) => q(50 * n + 21)]],
    extra: ([n = 0]) => ({ x: String(50 * n) }),
    consts: [21, 50],
  }),
];

const p4 = forFraction("P4", "ratio");
const ratio = [
  p4({
    id: "P4.ratio.01",
    form: "scaling-a-recipe",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [between(r, 2, 5), between(r, 2, 7), between(r, 2, 6)],
    valid: ([a = 0, b = 0, k = 0]) => a !== b && k > 1 && gcd(a, b) === 1,
    solve: ([, b = 0, k = 0]) => q(b * k),
    ref: ([a = 0, b = 0, k = 0]) => q(a * k).mul(q(b, a)),
    traps: [
      [
        "difference-kept",
        "conceptual",
        ([a = 0, b = 0, k = 0]) => q(b + (a * k - a)),
      ],
    ],
    extra: ([a = 0, , k = 0]) => ({ s: String(a * k) }),
  }),
  p4({
    id: "P4.ratio.02",
    form: "a-ratio-as-a-fraction",
    groups: [6, 7],
    kind: "fraction",
    rule: "equivalent",
    draw: (r) => [between(r, 1, 7), between(r, 2, 9)],
    valid: ([a = 0, b = 0]) => a < b && gcd(a, b) === 1,
    solve: ([a = 0, b = 0]) => q(a, b),
    ref: ([a = 0, b = 0]) => q(2 * a, 2 * b),
    traps: [["upside-down", "conceptual", ([a = 0, b = 0]) => q(b, a)]],
  }),
  p4({
    id: "P4.ratio.03",
    form: "dividing-an-amount-in-a-ratio",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [between(r, 1, 5), between(r, 2, 6), between(r, 2, 9)],
    valid: ([a = 0, b = 0]) => a !== b,
    solve: ([a = 0, , k = 0]) => q(a * k),
    ref: ([a = 0, b = 0, k = 0]) => q((a + b) * k).mul(q(a, a + b)),
    traps: [
      ["the-parts-swapped", "conceptual", ([, b = 0, k = 0]) => q(b * k)],
    ],
    extra: ([a = 0, b = 0, k = 0]) => ({ t: String((a + b) * k) }),
  }),
  p4({
    id: "P4.ratio.04",
    form: "how-many-parts-in-all",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [between(r, 1, 5), between(r, 2, 6), between(r, 2, 6)],
    valid: ([a = 0, b = 0, c = 0]) => new Set([a, b, c]).size === 3,
    solve: ([a = 0, b = 0, c = 0]) => q(a + b + c),
    ref: ([a = 0, b = 0, c = 0]) => q(c).add(q(b)).add(q(a)),
    traps: [
      ["multiplied", "procedural", ([a = 0, b = 0, c = 0]) => q(a * b * c)],
    ],
  }),
  p4({
    id: "P4.ratio.05",
    form: "several-times-as-many",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [between(r, 4, 15), between(r, 5, 10)],
    solve: ([a = 0, k = 0]) => q(a * k),
    ref: ([a = 0, k = 0]) =>
      Array.from({ length: k }, () => q(a)).reduce((x, y) => x.add(y), q(0)),
    traps: [["more-by", "conceptual", ([a = 0, k = 0]) => q(a + k)]],
  }),
  p4({
    id: "P4.ratio.06",
    form: "red-beads-in-a-pattern",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [between(r, 3, 6), between(r, 3, 9)],
    solve: ([, m = 0]) => q(m),
    ref: ([a = 0, m = 0]) => q(a * m).div(q(a)),
    traps: [["the-gap", "conceptual", ([a = 0]) => q(a)]],
    extra: ([a = 0, m = 0]) => ({ t: String(a * m) }),
  }),
  p4({
    id: "P4.ratio.07",
    form: "fill-a-gap-in-a-ratio-table",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [between(r, 2, 6), between(r, 3, 9), between(r, 2, 6)],
    valid: ([a = 0, b = 0, k = 0]) => a !== b && k > 1,
    solve: ([, b = 0, k = 0]) => q(b * k),
    ref: ([a = 0, b = 0, k = 0]) =>
      q(b)
        .div(q(a))
        .mul(q(a * k)),
    traps: [
      [
        "difference-kept",
        "conceptual",
        ([a = 0, b = 0, k = 0]) => q(b + (a * k - a)),
      ],
    ],
    extra: ([a = 0, , k = 0]) => ({ s: String(a * k) }),
  }),
  p4({
    id: "P4.ratio.08",
    form: "simplify-a-ratio",
    groups: [6, 7],
    kind: "pair",
    draw: (r) => [between(r, 1, 6), between(r, 2, 9), between(r, 2, 5)],
    valid: ([a = 0, b = 0]) => a !== b && gcd(a, b) === 1,
    solve: ([a = 0, b = 0]) => [q(a), q(b)],
    ref: ([a = 0, b = 0, k = 0]) => [q(a * k).div(q(k)), q(b * k).div(q(k))],
    traps: [
      [
        "only-the-first-term",
        "procedural",
        ([a = 0, b = 0, k = 0]) => [q(a), q(b * k)],
      ],
    ],
    extra: ([a = 0, b = 0, k = 0]) => ({ p: String(a * k), s: String(b * k) }),
  }),
  p4({
    id: "P4.ratio.09",
    form: "mixing-paint-in-a-ratio",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [between(r, 2, 5), between(r, 2, 8)],
    solve: ([a = 0, k = 0]) => q(a * k),
    ref: ([a = 0, k = 0]) => q((a + 1) * k).mul(q(a, a + 1)),
    traps: [["the-other-part", "conceptual", ([, k = 0]) => q(k)]],
    extra: ([a = 0, k = 0]) => ({ t: String((a + 1) * k) }),
    consts: [1],
  }),
  p4({
    id: "P4.ratio.10",
    form: "compare-two-ratios",
    groups: [6, 7],
    kind: "compare",
    draw: (r) => [
      between(r, 1, 5),
      between(r, 2, 8),
      between(r, 1, 5),
      between(r, 2, 8),
    ],
    valid: ([a = 0, b = 0, c = 0, d = 0]) =>
      a < b &&
      c < d &&
      a * d !== b * c &&
      sign(q(a, b), q(c, d)) !== sign(q(a), q(c)),
    solve: ([a = 0, b = 0, c = 0, d = 0]) => sign(q(a, b), q(c, d)),
    ref: ([a = 0, b = 0, c = 0, d = 0]) =>
      a * d < c * b ? "<" : a * d > c * b ? ">" : "=",
    traps: [
      [
        "first-terms-only",
        "conceptual",
        ([a = 0, , c = 0]) => sign(q(a), q(c)),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => ({
      f: fr(a, b),
      g: fr(c, d),
      sign: sign(q(a, b), q(c, d)),
    }),
  }),
  p4({
    id: "P4.ratio.11",
    form: "the-whole-group-from-one-part-of-a-ratio",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [between(r, 1, 5), between(r, 2, 6), between(r, 2, 8)],
    valid: ([a = 0, b = 0]) => a !== b,
    solve: ([a = 0, b = 0, k = 0]) => q((a + b) * k),
    ref: ([a = 0, b = 0, k = 0]) => q(a * k).div(q(a, a + b)),
    traps: [
      [
        "one-part-plus-the-other-term",
        "procedural",
        ([a = 0, b = 0, k = 0]) => q(a * k + b),
      ],
    ],
    extra: ([a = 0, , k = 0]) => ({ p: String(a * k) }),
  }),
  p4({
    id: "P4.ratio.12",
    form: "two-successive-comparisons-by-times",
    groups: [7, 8],
    origin: {
      olympiad:
        "chained multiplicative comparison, MCCME 2021 grade 5 (RES-4287)",
    },
    kind: "integer",
    draw: (r) => [between(r, 2, 5), between(r, 2, 5)],
    valid: ([a = 0, b = 0]) => a !== b,
    solve: ([a = 0, b = 0]) => q(a * b),
    ref: ([a = 0, b = 0]) => q(a).mul(q(b)),
    traps: [["added", "procedural", ([a = 0, b = 0]) => q(a + b)]],
  }),
];

const p4p = forFraction("P4", "per-one");
const perOne = [
  p4p({
    id: "P4.per-one.01",
    form: "the-price-of-one-kilogram",
    groups: [6, 7],
    kind: "decimal",
    draw: (r) => [between(r, 2, 6), between(r, 111, 499)],
    valid: ([, u = 0]) => u % 10 !== 0,
    solve: ([, u = 0]) => qd(u, 2),
    ref: ([k = 0, u = 0]) => qd(k * u, 2).div(q(k)),
    traps: [["total-itself", "conceptual", ([k = 0, u = 0]) => qd(k * u, 2)]],
    extra: ([k = 0, u = 0]) => ({ t: dec(k * u, 2) }),
  }),
  p4p({
    id: "P4.per-one.02",
    form: "the-price-of-one-piece-in-a-pack",
    groups: [6, 7],
    kind: "decimal",
    draw: (r) => [pick(r, [4, 5, 6, 8, 10]), between(r, 11, 99)],
    valid: ([, u = 0]) => u % 10 !== 0,
    solve: ([, u = 0]) => qd(u, 2),
    ref: ([k = 0, u = 0]) => qd(k * u, 2).div(q(k)),
    traps: [["multiplied", "procedural", ([k = 0, u = 0]) => qd(k * u, 2)]],
    extra: ([k = 0, u = 0]) => ({ t: dec(k * u, 2) }),
  }),
  p4p({
    id: "P4.per-one.03",
    form: "the-cost-of-several-units",
    groups: [6, 7],
    kind: "decimal",
    draw: (r) => [between(r, 111, 499), between(r, 3, 9)],
    valid: ([u = 0, n = 0]) => u % 10 !== 0 && (u * n) % 10 !== 0,
    solve: ([u = 0, n = 0]) => qd(u * n, 2),
    ref: ([u = 0, n = 0]) =>
      Array.from({ length: n }, () => qd(u, 2)).reduce(
        (a, b) => a.add(b),
        q(0),
      ),
    traps: [["added", "procedural", ([u = 0, n = 0]) => qd(u + n, 2)]],
    extra: ([u = 0]) => ({ x: dec(u, 2) }),
  }),
  p4p({
    id: "P4.per-one.04",
    form: "an-average-speed-in-kilometres-per-hour",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [between(r, 4, 12), between(r, 3, 9)],
    valid: ([s = 0, t = 0]) => s !== t,
    solve: ([s = 0]) => q(s),
    ref: ([s = 0, t = 0]) => q(s * t).div(q(t)),
    traps: [["difference", "procedural", ([s = 0, t = 0]) => q(s * t - t)]],
    extra: ([s = 0, t = 0]) => ({ d: String(s * t) }),
  }),
  p4p({
    id: "P4.per-one.05",
    form: "which-pack-is-cheaper-per-piece",
    groups: [6, 7],
    kind: "compare",
    draw: (r) => [
      pick(r, [4, 6, 8]),
      pick(r, [200, 300, 400]),
      pick(r, [10, 12, 15]),
      pick(r, [450, 550, 600]),
    ],
    valid: ([n1 = 0, p1 = 0, n2 = 0, p2 = 0]) =>
      p1 * n2 !== p2 * n1 && sign(q(p1, n1), q(p2, n2)) !== sign(q(p1), q(p2)),
    solve: ([n1 = 0, p1 = 0, n2 = 0, p2 = 0]) => sign(q(p1, n1), q(p2, n2)),
    ref: ([n1 = 0, p1 = 0, n2 = 0, p2 = 0]) =>
      p1 * n2 < p2 * n1 ? "<" : p1 * n2 > p2 * n1 ? ">" : "=",
    traps: [
      [
        "total-prices-compared",
        "conceptual",
        ([, p1 = 0, , p2 = 0]) => sign(q(p1), q(p2)),
      ],
    ],
    extra: ([n1 = 0, p1 = 0, n2 = 0, p2 = 0]) => ({
      x: dec(p1, 2),
      y: dec(p2, 2),
      sign: sign(q(p1, n1), q(p2, n2)),
    }),
  }),
  p4p({
    id: "P4.per-one.06",
    form: "the-distance-at-a-steady-speed",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [between(r, 4, 12), between(r, 3, 9)],
    valid: ([s = 0, t = 0]) => s !== t,
    solve: ([s = 0, t = 0]) => q(s * t),
    ref: ([s = 0, t = 0]) =>
      Array.from({ length: t }, () => q(s)).reduce((a, b) => a.add(b), q(0)),
    traps: [["added", "procedural", ([s = 0, t = 0]) => q(s + t)]],
  }),
  p4p({
    id: "P4.per-one.07",
    form: "the-time-for-a-distance-at-a-steady-speed",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [between(r, 4, 12), between(r, 3, 9)],
    valid: ([s = 0, t = 0]) => s !== t,
    solve: ([, t = 0]) => q(t),
    ref: ([s = 0, t = 0]) => q(s * t).div(q(s)),
    traps: [["multiplied", "procedural", ([s = 0, t = 0]) => q(s * t)]],
    extra: ([s = 0, t = 0]) => ({ d: String(s * t) }),
  }),
  p4p({
    id: "P4.per-one.08",
    form: "the-price-of-one-litre-from-a-bottle",
    groups: [6, 7],
    kind: "decimal",
    draw: (r) => [pick(r, [15, 25, 5]), pick(r, [140, 160, 180, 240])],
    valid: ([k = 0, u = 0]) => (k * u) % 10 === 0,
    solve: ([, u = 0]) => qd(u, 2),
    ref: ([k = 0, u = 0]) => qd((k * u) / 10, 2).div(qd(k, 1)),
    traps: [
      ["total-itself", "conceptual", ([k = 0, u = 0]) => qd((k * u) / 10, 2)],
    ],
    extra: ([k = 0, u = 0]) => ({ l: dec(k, 1), t: dec((k * u) / 10, 2) }),
  }),
  p4p({
    id: "P4.per-one.09",
    form: "how-many-items-a-budget-buys",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [between(r, 20, 90), pick(r, [3, 4, 6, 7, 8])],
    valid: ([b = 0, u = 0]) => b % u !== 0,
    solve: ([b = 0, u = 0]) => q(Math.floor(b / u)),
    ref: ([b = 0, u = 0]) => q((b - (b % u)) / u),
    traps: [
      ["rounded-up", "procedural", ([b = 0, u = 0]) => q(Math.ceil(b / u))],
    ],
  }),
  p4p({
    id: "P4.per-one.10",
    form: "the-price-of-more-from-the-price-of-fewer",
    groups: [6, 7],
    kind: "decimal",
    draw: (r) => [pick(r, [3, 4, 5]), between(r, 111, 299), between(r, 6, 10)],
    valid: ([k = 0, u = 0]) => u % 10 !== 0 && (u * k) % 10 !== 0,
    solve: ([, u = 0, n = 0]) => qd(u * n, 2),
    ref: ([k = 0, u = 0, n = 0]) =>
      qd(u * k, 2)
        .div(q(k))
        .mul(q(n)),
    traps: [
      [
        "added-proportion",
        "conceptual",
        ([k = 0, u = 0, n = 0]) => qd(u * k + (n - k) * 100, 2),
      ],
    ],
    extra: ([k = 0, u = 0]) => ({ t: dec(u * k, 2) }),
  }),
  p4p({
    id: "P4.per-one.11",
    form: "an-average-per-day",
    groups: [6, 7],
    kind: "decimal",
    draw: (r) => [pick(r, [4, 5, 8]), between(r, 11, 49)],
    valid: ([, u = 0]) => u % 10 !== 0,
    solve: ([, u = 0]) => qd(u, 1),
    ref: ([d = 0, u = 0]) => qd(d * u, 1).div(q(d)),
    traps: [["total-itself", "conceptual", ([d = 0, u = 0]) => qd(d * u, 1)]],
    extra: ([d = 0, u = 0]) => ({ t: dec(d * u, 1) }),
  }),
];

export const pSpecs2: readonly Spec<never>[] = [
  ...shareOf,
  ...vat,
  ...ratio,
  ...perOne,
];
