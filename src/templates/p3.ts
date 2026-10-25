// Domain P, part 3: scale on maps and plans, comparing offers and relative size, and successive percentage
// changes (RES-4287). The Dutch goals name scale at the end of group 7, with 1 : 50 000 at group 8, offers and
// relative comparison at group 8, and the rule that percentages add only over the same whole at group 8.
// Successive changes are stretch. Texts are plain blanks in `content/tasks-p.ru.json`.
import { Q } from "../math/q.js";
import { between, digits, pick } from "./draw.js";
import { forFraction, q, qd } from "./kitf.js";
import { SIGNS, type Spec } from "./spec.js";

const sign = (x: Q, y: Q): (typeof SIGNS)[number] => SIGNS[x.cmp(y) + 1] ?? "=";
const flip = (s: (typeof SIGNS)[number]): (typeof SIGNS)[number] =>
  s === "<" ? ">" : s === ">" ? "<" : "=";
const whole = (x: Q): Q | null => (x.d === 1n ? x : null);

const p5 = forFraction("P5", "map-scale");
const mapScale = [
  p5({
    id: "P5.map-scale.01",
    form: "what-one-centimetre-on-the-map-stands-for",
    groups: [7, 7],
    kind: "integer",
    draw: (r) => [pick(r, [50, 100, 200, 500, 1000])],
    solve: ([a = 0]) => q(a),
    ref: ([a = 0]) => q(1).div(q(1, a)),
    traps: [["one", "conceptual", () => q(1)]],
    extra: ([a = 0]) => ({ s: digits(a) }),
    consts: [1],
  }),
  p5({
    id: "P5.map-scale.02",
    form: "a-map-length-in-real-centimetres",
    groups: [7, 7],
    kind: "integer",
    draw: (r) => [pick(r, [50, 100, 200, 500]), between(r, 3, 12)],
    solve: ([a = 0, b = 0]) => q(a * b),
    ref: ([a = 0, b = 0]) =>
      Array.from({ length: b }, () => q(a)).reduce((x, y) => x.add(y), q(0)),
    traps: [["added", "procedural", ([a = 0, b = 0]) => q(a + b)]],
    consts: [1],
  }),
  p5({
    id: "P5.map-scale.03",
    form: "a-map-length-in-real-metres",
    groups: [7, 7],
    kind: "integer",
    draw: (r) => [pick(r, [1, 2, 5, 10, 20]), between(r, 3, 12)],
    solve: ([k = 0, b = 0]) => q(k * b),
    ref: ([k = 0, b = 0]) => q(100 * k * b).div(q(100)),
    traps: [["centimetres", "procedural", ([k = 0, b = 0]) => q(100 * k * b)]],
    extra: ([k = 0]) => ({ s: digits(100 * k) }),
    consts: [1, 100],
  }),
  p5({
    id: "P5.map-scale.04",
    form: "a-map-length-in-kilometres-at-fifty-thousand",
    groups: [8, 8],
    kind: "decimal",
    draw: (r) => [between(r, 3, 19)],
    valid: ([c = 0]) => c % 2 === 1,
    solve: ([c = 0]) => qd(5 * c, 1),
    ref: ([c = 0]) => q(50_000 * c).div(q(100_000)),
    traps: [
      ["comma-in-the-wrong-place", "procedural", ([c = 0]) => qd(5 * c, 2)],
    ],
    consts: [50000, 1000, 500],
  }),
  p5({
    id: "P5.map-scale.05",
    form: "a-real-distance-on-the-map-at-one-to-a-hundred-thousand",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [between(r, 3, 15)],
    solve: ([k = 0]) => q(k),
    ref: ([k = 0]) => q(k * 100_000).div(q(100_000)),
    traps: [["ten-times", "procedural", ([k = 0]) => q(10 * k)]],
    consts: [1, 100, 1000, 100000],
  }),
  p5({
    id: "P5.map-scale.06",
    form: "a-real-length-on-a-plan-at-one-to-fifty",
    groups: [7, 7],
    kind: "integer",
    draw: (r) => [between(r, 2, 15)],
    solve: ([m = 0]) => q(2 * m),
    ref: ([m = 0]) => q(100 * m).div(q(50)),
    traps: [["metres-as-centimetres", "conceptual", ([m = 0]) => q(m)]],
    consts: [1, 50, 100],
  }),
  p5({
    id: "P5.map-scale.07",
    form: "which-scale-shows-more-detail",
    groups: [7, 8],
    kind: "compare",
    draw: (r) => [
      pick(r, [100, 200, 500, 1000]),
      pick(r, [2000, 5000, 10_000]),
    ],
    solve: ([a = 0, b = 0]) => sign(q(1, a), q(1, b)),
    ref: ([a = 0, b = 0]) => (a < b ? ">" : a > b ? "<" : "="),
    traps: [
      [
        "bigger-number-wins",
        "conceptual",
        ([a = 0, b = 0]) => sign(q(a), q(b)),
      ],
    ],
    extra: ([a = 0, b = 0]) => ({
      s: digits(a),
      t: digits(b),
      sign: sign(q(1, a), q(1, b)),
    }),
    consts: [1],
  }),
  p5({
    id: "P5.map-scale.08",
    form: "the-real-height-of-a-model",
    groups: [7, 8],
    kind: "decimal",
    draw: (r) => [between(r, 5, 19)],
    valid: ([c = 0]) => c % 5 !== 0,
    solve: ([c = 0]) => qd(2 * c, 1),
    ref: ([c = 0]) => q(20 * c).div(q(100)),
    traps: [["centimetres", "procedural", ([c = 0]) => q(20 * c)]],
    consts: [1, 20, 100],
  }),
  p5({
    id: "P5.map-scale.09",
    form: "a-floor-plan-where-one-centimetre-stands-for-fifty",
    groups: [7, 7],
    kind: "decimal",
    draw: (r) => [between(r, 3, 19)],
    valid: ([c = 0]) => c % 2 === 1,
    solve: ([c = 0]) => qd(5 * c, 1),
    ref: ([c = 0]) => q(50 * c).div(q(100)),
    traps: [["centimetres", "procedural", ([c = 0]) => q(50 * c)]],
    consts: [50, 100],
  }),
  p5({
    id: "P5.map-scale.10",
    form: "the-scale-from-a-map-length-and-a-real-length",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [pick(r, [4, 5, 8, 10]), pick(r, [25, 50, 100])],
    valid: ([c = 0, d = 0]) => (c * d) % 100 === 0,
    solve: ([, d = 0]) => q(1000 * d),
    ref: ([c = 0, d = 0]) => q(((c * d) / 100) * 100_000).div(q(c)),
    traps: [["kilometres-as-metres", "procedural", ([, d = 0]) => q(10 * d)]],
    extra: ([c = 0, d = 0]) => ({ km: String((c * d) / 100) }),
    consts: [1, 100000],
  }),
  p5({
    id: "P5.map-scale.11",
    form: "a-real-distance-on-a-plan-at-one-to-five-hundred",
    groups: [7, 8],
    kind: "integer",
    draw: (r) => [5 * between(r, 2, 14)],
    solve: ([m = 0]) => q(m / 5),
    ref: ([m = 0]) => q(100 * m).div(q(500)),
    traps: [["multiplied", "procedural", ([m = 0]) => q(5 * m)]],
    consts: [1, 100, 500],
  }),
];

const p5s = forFraction("P5", "map-scale-1S");
const mapScaleS = [
  p5s({
    id: "P5.map-scale-1S.01",
    form: "a-distance-at-one-to-five-hundred-thousand",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [between(r, 2, 16)],
    solve: ([c = 0]) => q(5 * c),
    ref: ([c = 0]) => q(500_000 * c).div(q(100_000)),
    traps: [["metres", "procedural", ([c = 0]) => q(50 * c)]],
    consts: [1, 1000, 100000, 500000],
  }),
  p5s({
    id: "P5.map-scale-1S.02",
    form: "a-distance-at-one-to-four-hundred-thousand",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [between(r, 2, 20)],
    solve: ([c = 0]) => q(4 * c),
    ref: ([c = 0]) => q(400_000 * c).div(q(100_000)),
    traps: [["ten-times", "procedural", ([c = 0]) => q(40 * c)]],
    consts: [1, 100000, 400000],
  }),
  p5s({
    id: "P5.map-scale-1S.03",
    form: "a-real-distance-as-a-map-length",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [between(r, 3, 20)],
    solve: ([c = 0]) => q(c),
    ref: ([c = 0]) => q(4 * c * 100_000).div(q(400_000)),
    traps: [["scale-multiplied", "procedural", ([c = 0]) => q(4 * c)]],
    extra: ([c = 0]) => ({ km: String(4 * c) }),
    consts: [1, 100000, 400000],
  }),
  p5s({
    id: "P5.map-scale-1S.04",
    form: "the-scale-from-two-measurements",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [pick(r, [2, 4, 5, 10]), pick(r, [1, 2, 5, 10])],
    valid: ([c = 0, km = 0]) => c !== km && (km * 100_000) % c === 0,
    solve: ([c = 0, km = 0]) => q((km * 100_000) / c),
    ref: ([c = 0, km = 0]) => q(km).mul(q(100_000)).div(q(c)),
    traps: [
      [
        "kilometres-as-metres",
        "procedural",
        ([c = 0, km = 0]) => q((km * 1000) / c),
      ],
    ],
    consts: [1, 1000, 100000],
  }),
  p5s({
    id: "P5.map-scale-1S.05",
    form: "which-scale-shows-the-longer-real-distance",
    groups: [8, 8],
    kind: "compare",
    draw: (r) => [
      pick(r, [200_000, 400_000, 500_000]),
      pick(r, [50_000, 100_000, 1_000_000]),
    ],
    valid: ([a = 0, b = 0]) => a !== b,
    solve: ([a = 0, b = 0]) => sign(q(a), q(b)),
    ref: ([a = 0, b = 0]) => (a > b ? ">" : a < b ? "<" : "="),
    traps: [
      [
        "bigger-scale-number-means-more-detail",
        "conceptual",
        ([a = 0, b = 0]) => flip(sign(q(a), q(b))),
      ],
    ],
    extra: ([a = 0, b = 0]) => ({
      s: digits(a),
      t: digits(b),
      sign: sign(q(a), q(b)),
    }),
    consts: [1],
  }),
  p5s({
    id: "P5.map-scale-1S.06",
    form: "travel-time-from-a-map-length",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [pick(r, [10, 20, 30, 40, 50, 60, 80]), pick(r, [50, 100])],
    valid: ([c = 0, s = 0]) => (5 * c) % s === 0 && c * 5 !== s,
    solve: ([c = 0, s = 0]) => q((5 * c) / s),
    ref: ([c = 0, s = 0]) =>
      q(500_000 * c)
        .div(q(100_000))
        .div(q(s)),
    traps: [
      [
        "map-length-as-kilometres",
        "procedural",
        ([c = 0, s = 0]) => whole(q(c, s)),
      ],
    ],
    consts: [1, 100000, 500000],
  }),
  p5s({
    id: "P5.map-scale-1S.07",
    form: "metres-for-one-centimetre-of-the-map",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [between(r, 1, 8)],
    solve: ([k = 0]) => q(100 * k),
    ref: ([k = 0]) => q(10_000 * k).div(q(100)),
    traps: [["centimetres", "procedural", ([k = 0]) => q(10_000 * k)]],
    extra: ([k = 0]) => ({ s: digits(10_000 * k) }),
    consts: [1, 100],
  }),
  p5s({
    id: "P5.map-scale-1S.08",
    form: "a-distance-at-one-to-twenty-thousand",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [between(r, 3, 19)],
    solve: ([c = 0]) => q(200 * c),
    ref: ([c = 0]) => q(20_000 * c).div(q(100)),
    traps: [["ten-times-too-small", "procedural", ([c = 0]) => q(20 * c)]],
    consts: [1, 100, 20000],
  }),
  p5s({
    id: "P5.map-scale-1S.09",
    form: "a-scale-bar-and-a-longer-distance",
    groups: [8, 8],
    kind: "decimal",
    draw: (r) => [pick(r, [2, 4, 5]), pick(r, [1, 2, 3]), between(r, 3, 15)],
    valid: ([a = 0, b = 0, c = 0]) => (c * b) % a !== 0 && a !== c,
    solve: ([a = 0, b = 0, c = 0]) => q(b * c, a),
    ref: ([a = 0, b = 0, c = 0]) => q(b, a).mul(q(c)),
    traps: [
      ["segments-added", "procedural", ([a = 0, b = 0, c = 0]) => q(b + c, a)],
    ],
  }),
  p5s({
    id: "P5.map-scale-1S.10",
    form: "an-enlarged-drawing-of-a-small-animal",
    groups: [8, 8],
    kind: "decimal",
    draw: (r) => [between(r, 2, 9)],
    solve: ([c = 0]) => qd(c, 1),
    ref: ([c = 0]) => q(c).div(q(10)),
    traps: [["ten-times-too-big", "procedural", ([c = 0]) => q(10 * c)]],
    consts: [10, 1],
  }),
  p5s({
    id: "P5.map-scale-1S.11",
    form: "kilometres-from-a-millionth-scale",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [between(r, 2, 14)],
    solve: ([c = 0]) => q(10 * c),
    ref: ([c = 0]) => q(1_000_000 * c).div(q(100_000)),
    traps: [["map-length-itself", "conceptual", ([c = 0]) => q(c)]],
    consts: [1, 100000, 1000000],
  }),
];

const p6 = forFraction("P6", "compare-offer");
const offers = [
  p6({
    id: "P6.compare-offer.01",
    form: "four-for-the-price-of-three-against-a-percentage-off",
    groups: [8, 8],
    kind: "compare",
    draw: (r) => [pick(r, [10, 20, 30, 40]), pick(r, [20, 30, 40])],
    valid: ([u = 0, p = 0]) =>
      sign(q(3 * u), q((4 * u * (100 - p)) / 100)) !== "=",
    solve: ([u = 0, p = 0]) => sign(q(3 * u), q((4 * u * (100 - p)) / 100)),
    ref: ([u = 0, p = 0]) =>
      300 * u < 4 * u * (100 - p)
        ? "<"
        : 300 * u > 4 * u * (100 - p)
          ? ">"
          : "=",
    traps: [["free-item-always-better", "conceptual", () => "<"]],
    extra: ([u = 0, p = 0]) => ({
      x: String(3 * u),
      y: String((4 * u * (100 - p)) / 100),
      sign: sign(q(3 * u), q((4 * u * (100 - p)) / 100)),
    }),
  }),
  p6({
    id: "P6.compare-offer.02",
    form: "two-for-the-price-of-one-against-half-price",
    groups: [8, 8],
    kind: "compare",
    draw: (r) => [between(r, 5, 30)],
    solve: () => "=",
    ref: () => "=",
    traps: [["first-is-cheaper", "conceptual", () => "<"]],
    extra: ([u = 0]) => ({ x: String(u) }),
    consts: [50],
  }),
  p6({
    id: "P6.compare-offer.03",
    form: "a-percentage-discount-against-a-fixed-discount",
    groups: [8, 8],
    kind: "compare",
    draw: (r) => [
      pick(r, [40, 60, 80, 100]),
      pick(r, [10, 20, 25]),
      between(r, 3, 15),
    ],
    valid: ([u = 0, p = 0, e = 0]) =>
      sign(q((u * (100 - p)) / 100), q(u - e)) !== "=",
    solve: ([u = 0, p = 0, e = 0]) => sign(q((u * (100 - p)) / 100), q(u - e)),
    ref: ([u = 0, p = 0, e = 0]) =>
      (u * (100 - p)) / 100 < u - e
        ? "<"
        : (u * (100 - p)) / 100 > u - e
          ? ">"
          : "=",
    traps: [
      [
        "percentage-compared-with-euros",
        "conceptual",
        ([, p = 0, e = 0]) => sign(q(p), q(e)),
      ],
    ],
    extra: ([u = 0, p = 0, e = 0]) => ({
      sign: sign(q((u * (100 - p)) / 100), q(u - e)),
    }),
  }),
  p6({
    id: "P6.compare-offer.04",
    form: "the-saving-from-three-for-the-price-of-two",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [between(r, 4, 25)],
    solve: ([u = 0]) => q(u),
    ref: ([u = 0]) => q(3 * u).sub(q(2 * u)),
    traps: [["two-prices", "procedural", ([u = 0]) => q(2 * u)]],
  }),
  p6({
    id: "P6.compare-offer.05",
    form: "one-free-item-as-a-percentage-discount",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [pick(r, [2, 4, 5, 10])],
    solve: ([n = 0]) => q(100 / n),
    ref: ([n = 0]) => q(1, n).mul(q(100)),
    traps: [["items-in-the-pack", "conceptual", ([n = 0]) => q(n)]],
    consts: [1, 100],
  }),
  p6({
    id: "P6.compare-offer.06",
    form: "the-second-item-at-half-price",
    groups: [8, 8],
    kind: "decimal",
    draw: (r) => [between(r, 10, 60)],
    valid: ([u = 0]) => u % 2 === 1,
    solve: ([u = 0]) => qd(15 * u, 1),
    ref: ([u = 0]) => q(u).add(q(u, 2)),
    traps: [["both-at-half-price", "conceptual", ([u = 0]) => q(u)]],
    consts: [50],
  }),
  p6({
    id: "P6.compare-offer.07",
    form: "the-saving-from-a-percentage-discount",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [pick(r, [10, 20, 25, 30, 40, 50]), 20 * between(r, 2, 10)],
    solve: ([p = 0, u = 0]) => q((p * u) / 100),
    ref: ([p = 0, u = 0]) => q(u).mul(qd(p, 2)),
    traps: [
      [
        "price-after-the-discount",
        "conceptual",
        ([p = 0, u = 0]) => q(u - (p * u) / 100),
      ],
    ],
    consts: [100],
  }),
  p6({
    id: "P6.compare-offer.08",
    form: "how-much-cheaper-one-offer-is",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [
      pick(r, [20, 40, 60, 80]),
      pick(r, [10, 20, 25]),
      between(r, 2, 9),
    ],
    valid: ([u = 0, p = 0, e = 0]) =>
      (u * p) % 100 === 0 && (u * p) / 100 !== e,
    solve: ([u = 0, p = 0, e = 0]) => q(Math.abs((u * p) / 100 - e)),
    ref: ([u = 0, p = 0, e = 0]) => q(Math.abs(u - e - (u * (100 - p)) / 100)),
    traps: [
      [
        "the-percentage-discount-only",
        "conceptual",
        ([u = 0, p = 0]) => q((u * p) / 100),
      ],
    ],
  }),
  p6({
    id: "P6.compare-offer.09",
    form: "a-discounted-price-with-a-delivery-fee",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [
      pick(r, [10, 20, 25]),
      20 * between(r, 2, 9),
      between(r, 3, 9),
    ],
    solve: ([p = 0, u = 0, f = 0]) => q((u * (100 - p)) / 100 + f),
    ref: ([p = 0, u = 0, f = 0]) => q(f).add(q(u).mul(q(100 - p, 100))),
    traps: [
      [
        "fee-also-discounted",
        "procedural",
        ([p = 0, u = 0, f = 0]) => whole(q((u + f) * (100 - p), 100)),
      ],
    ],
  }),
  p6({
    id: "P6.compare-offer.10",
    form: "the-price-of-one-item-in-a-four-for-three-offer",
    groups: [8, 8],
    kind: "decimal",
    draw: (r) => [pick(r, [10, 20, 30, 40])],
    solve: ([u = 0]) => q(3 * u, 4),
    ref: ([u = 0]) => q(3 * u).div(q(4)),
    traps: [["full-price", "conceptual", ([u = 0]) => q(u)]],
    consts: [3, 4],
  }),
  p6({
    id: "P6.compare-offer.11",
    form: "one-free-in-a-pack-against-a-percentage",
    groups: [8, 8],
    kind: "compare",
    draw: (r) => [pick(r, [2, 4, 5, 10]), pick(r, [10, 15, 20, 30, 40])],
    valid: ([n = 0, p = 0]) => sign(q(100, n), q(p)) !== "=",
    solve: ([n = 0, p = 0]) => sign(q(100, n), q(p)),
    ref: ([n = 0, p = 0]) => (100 < p * n ? "<" : 100 > p * n ? ">" : "="),
    traps: [
      [
        "flipped",
        "conceptual",
        ([n = 0, p = 0]) => flip(sign(q(100, n), q(p))),
      ],
    ],
    extra: ([n = 0, p = 0]) => ({ sign: sign(q(100, n), q(p)) }),
  }),
];

const p6r = forFraction("P6", "relative");
const relative = [
  p6r({
    id: "P6.relative.01",
    form: "which-group-has-the-larger-share",
    groups: [8, 8],
    kind: "compare",
    draw: (r) => [
      between(r, 6, 14),
      pick(r, [20, 24, 30]),
      between(r, 6, 14),
      pick(r, [16, 20, 25]),
    ],
    valid: ([g1 = 0, n1 = 0, g2 = 0, n2 = 0]) =>
      g1 * n2 !== g2 * n1 && sign(q(g1, n1), q(g2, n2)) !== sign(q(g1), q(g2)),
    solve: ([g1 = 0, n1 = 0, g2 = 0, n2 = 0]) => sign(q(g1, n1), q(g2, n2)),
    ref: ([g1 = 0, n1 = 0, g2 = 0, n2 = 0]) =>
      g1 * n2 < g2 * n1 ? "<" : g1 * n2 > g2 * n1 ? ">" : "=",
    traps: [
      [
        "counts-compared",
        "conceptual",
        ([g1 = 0, , g2 = 0]) => sign(q(g1), q(g2)),
      ],
    ],
    extra: ([g1 = 0, n1 = 0, g2 = 0, n2 = 0]) => ({
      sign: sign(q(g1, n1), q(g2, n2)),
    }),
  }),
  p6r({
    id: "P6.relative.02",
    form: "the-difference-between-two-shares-in-points",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [
      between(r, 2, 9),
      pick(r, [20, 25, 50]),
      between(r, 2, 9),
      pick(r, [20, 25, 50]),
    ],
    valid: ([g1 = 0, n1 = 0, g2 = 0, n2 = 0]) =>
      g1 < n1 &&
      g2 < n2 &&
      n1 !== n2 &&
      (100 * g1) / n1 !== (100 * g2) / n2 &&
      Math.abs(g1 - g2) !== Math.abs((100 * g1) / n1 - (100 * g2) / n2),
    solve: ([g1 = 0, n1 = 0, g2 = 0, n2 = 0]) =>
      q(Math.abs((100 * g1) / n1 - (100 * g2) / n2)),
    ref: ([g1 = 0, n1 = 0, g2 = 0, n2 = 0]) =>
      q(g1, n1)
        .sub(q(g2, n2))
        .mul(q(100))
        .div(q(1))
        .mul(q(sign(q(g1, n1), q(g2, n2)) === "<" ? -1 : 1)),
    traps: [
      [
        "counts-subtracted",
        "procedural",
        ([g1 = 0, , g2 = 0]) => q(Math.abs(g1 - g2)),
      ],
    ],
    consts: [100],
  }),
  p6r({
    id: "P6.relative.03",
    form: "relative-growth",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [pick(r, [40, 50, 80, 200]), pick(r, [10, 20, 25, 50])],
    valid: ([o = 0, p = 0]) => (o * p) % 100 === 0,
    solve: ([, p = 0]) => q(p),
    ref: ([o = 0, p = 0]) =>
      q((o * p) / 100)
        .div(q(o))
        .mul(q(100)),
    traps: [
      ["absolute-growth", "conceptual", ([o = 0, p = 0]) => q((o * p) / 100)],
    ],
    extra: ([o = 0, p = 0]) => ({ n: String(o + (o * p) / 100) }),
    consts: [100],
  }),
  p6r({
    id: "P6.relative.04",
    form: "relative-decline",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [pick(r, [40, 50, 80, 200]), pick(r, [10, 20, 25, 50])],
    valid: ([o = 0, p = 0]) => (o * p) % 100 === 0,
    solve: ([, p = 0]) => q(p),
    ref: ([o = 0, p = 0]) =>
      q((o * p) / 100)
        .div(q(o))
        .mul(q(100)),
    traps: [
      ["absolute-decline", "conceptual", ([o = 0, p = 0]) => q((o * p) / 100)],
    ],
    extra: ([o = 0, p = 0]) => ({ n: String(o - (o * p) / 100) }),
    consts: [100],
  }),
  p6r({
    id: "P6.relative.05",
    form: "which-grew-more-in-percent",
    groups: [8, 8],
    kind: "compare",
    draw: (r) => [
      pick(r, [20, 40]),
      pick(r, [30, 50]),
      pick(r, [50, 100]),
      pick(r, [60, 120]),
    ],
    valid: ([a1 = 0, b1 = 0, a2 = 0, b2 = 0]) =>
      b1 > a1 &&
      b2 > a2 &&
      (b1 - a1) * a2 !== (b2 - a2) * a1 &&
      sign(q(b1 - a1, a1), q(b2 - a2, a2)) !== sign(q(b1 - a1), q(b2 - a2)),
    solve: ([a1 = 0, b1 = 0, a2 = 0, b2 = 0]) =>
      sign(q(b1 - a1, a1), q(b2 - a2, a2)),
    ref: ([a1 = 0, b1 = 0, a2 = 0, b2 = 0]) =>
      (b1 - a1) * a2 < (b2 - a2) * a1
        ? "<"
        : (b1 - a1) * a2 > (b2 - a2) * a1
          ? ">"
          : "=",
    traps: [
      [
        "absolute-growth-compared",
        "conceptual",
        ([a1 = 0, b1 = 0, a2 = 0, b2 = 0]) => sign(q(b1 - a1), q(b2 - a2)),
      ],
    ],
    extra: ([a1 = 0, b1 = 0, a2 = 0, b2 = 0]) => ({
      sign: sign(q(b1 - a1, a1), q(b2 - a2, a2)),
    }),
  }),
  p6r({
    id: "P6.relative.06",
    form: "relative-frequency-of-an-outcome",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [between(r, 5, 36), pick(r, [20, 25, 40, 50])],
    valid: ([n = 0, t = 0]) => n < t && (100 * n) % t === 0,
    solve: ([n = 0, t = 0]) => q((100 * n) / t),
    ref: ([n = 0, t = 0]) => q(n, t).mul(q(100)),
    traps: [["count-itself", "conceptual", ([n = 0]) => q(n)]],
    consts: [100],
  }),
  p6r({
    id: "P6.relative.07",
    form: "how-many-times-one-quantity-exceeds-another",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [between(r, 3, 12), between(r, 3, 9)],
    solve: ([, k = 0]) => q(k),
    ref: ([a = 0, k = 0]) => q(a * k).div(q(a)),
    traps: [["difference", "procedural", ([a = 0, k = 0]) => q(a * k - a)]],
    extra: ([a = 0, k = 0]) => ({ big: String(a * k) }),
  }),
  p6r({
    id: "P6.relative.08",
    form: "by-what-percentage-the-smaller-is-below-the-larger",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [pick(r, [40, 80, 120, 160, 200]), pick(r, [25, 100])],
    solve: ([, p = 0]) => q(100 * p, 100 + p),
    ref: ([b = 0, p = 0]) =>
      q((b * p) / 100)
        .div(q(b + (b * p) / 100))
        .mul(q(100)),
    traps: [["measured-from-the-smaller", "conceptual", ([, p = 0]) => q(p)]],
    extra: ([b = 0, p = 0]) => ({ big: String(b + (b * p) / 100) }),
    consts: [100],
  }),
  p6r({
    id: "P6.relative.09",
    form: "which-place-is-more-crowded",
    groups: [8, 8],
    kind: "compare",
    draw: (r) => [
      pick(r, [200, 300, 400]),
      pick(r, [10, 20, 25]),
      pick(r, [300, 400, 600]),
      pick(r, [20, 30, 50]),
    ],
    valid: ([p1 = 0, a1 = 0, p2 = 0, a2 = 0]) =>
      p1 * a2 !== p2 * a1 && sign(q(p1, a1), q(p2, a2)) !== sign(q(p1), q(p2)),
    solve: ([p1 = 0, a1 = 0, p2 = 0, a2 = 0]) => sign(q(p1, a1), q(p2, a2)),
    ref: ([p1 = 0, a1 = 0, p2 = 0, a2 = 0]) =>
      p1 * a2 < p2 * a1 ? "<" : p1 * a2 > p2 * a1 ? ">" : "=",
    traps: [
      [
        "populations-compared",
        "conceptual",
        ([p1 = 0, , p2 = 0]) => sign(q(p1), q(p2)),
      ],
    ],
    extra: ([p1 = 0, a1 = 0, p2 = 0, a2 = 0]) => ({
      sign: sign(q(p1, a1), q(p2, a2)),
    }),
    consts: [1],
  }),
  p6r({
    id: "P6.relative.10",
    form: "a-rate-of-faulty-items",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [between(r, 1, 9), pick(r, [50, 100, 200, 250])],
    valid: ([n = 0, t = 0]) => (100 * n) % t === 0,
    solve: ([n = 0, t = 0]) => q((100 * n) / t),
    ref: ([n = 0, t = 0]) => q(n, t).mul(q(100)),
    traps: [["count-itself", "conceptual", ([n = 0]) => q(n)]],
    consts: [100],
  }),
  p6r({
    id: "P6.relative.11",
    form: "which-test-score-is-better",
    groups: [8, 8],
    kind: "compare",
    draw: (r) => [between(r, 15, 19), 20, between(r, 19, 24), 25],
    valid: ([a = 0, , b = 0]) =>
      a * 25 !== b * 20 && sign(q(a, 20), q(b, 25)) !== sign(q(a), q(b)),
    solve: ([a = 0, , b = 0]) => sign(q(a, 20), q(b, 25)),
    ref: ([a = 0, , b = 0]) =>
      a * 25 < b * 20 ? "<" : a * 25 > b * 20 ? ">" : "=",
    traps: [
      ["points-compared", "conceptual", ([a = 0, , b = 0]) => sign(q(a), q(b))],
    ],
    extra: ([a = 0, , b = 0]) => ({ sign: sign(q(a, 20), q(b, 25)) }),
    consts: [20, 25],
  }),
];

const p7 = forFraction("P7", "successive");
const EXT = {
  extension: "successive percentage changes, Russian grade 6 (RES-4287)",
};
const successive = [
  p7({
    id: "P7.successive.01",
    form: "a-rise-and-then-the-same-fall",
    groups: [8, 8],
    origin: EXT,
    kind: "decimal",
    draw: (r) => [pick(r, [10, 20, 25, 30, 40])],
    solve: ([p = 0]) => q(10_000 - p * p, 100),
    ref: ([p = 0]) =>
      q(100)
        .mul(q(100 + p, 100))
        .mul(q(100 - p, 100)),
    traps: [["back-to-the-start", "conceptual", () => q(100)]],
    consts: [1, 100],
  }),
  p7({
    id: "P7.successive.02",
    form: "two-discounts-one-after-the-other",
    groups: [8, 8],
    origin: EXT,
    kind: "decimal",
    draw: (r) => [pick(r, [10, 20, 25, 30]), pick(r, [10, 20, 40, 50])],
    valid: ([a = 0, b = 0]) => a !== b,
    solve: ([a = 0, b = 0]) => q((100 - a) * (100 - b), 100),
    ref: ([a = 0, b = 0]) =>
      q(100)
        .mul(q(100 - a, 100))
        .mul(q(100 - b, 100)),
    traps: [
      ["discounts-added", "procedural", ([a = 0, b = 0]) => q(100 - a - b)],
    ],
    consts: [100],
  }),
  p7({
    id: "P7.successive.03",
    form: "the-same-rise-twice",
    groups: [8, 8],
    origin: EXT,
    kind: "decimal",
    draw: (r) => [pick(r, [10, 20, 25, 50])],
    solve: ([p = 0]) => q((100 + p) * (100 + p), 100),
    ref: ([p = 0]) =>
      q(100)
        .mul(q(100 + p, 100))
        .mul(q(100 + p, 100)),
    traps: [["rises-added", "procedural", ([p = 0]) => q(100 + 2 * p)]],
    consts: [100],
  }),
  p7({
    id: "P7.successive.04",
    form: "a-halving-and-then-a-doubling",
    groups: [8, 8],
    origin: EXT,
    kind: "integer",
    draw: (r) => [2 * between(r, 10, 60)],
    solve: ([b = 0]) => q(b),
    ref: ([b = 0]) => q(b).mul(q(1, 2)).mul(q(2)),
    traps: [["doubled", "conceptual", ([b = 0]) => q(2 * b)]],
    consts: [50, 100],
  }),
  p7({
    id: "P7.successive.05",
    form: "the-start-before-two-rises",
    groups: [8, 8],
    origin: EXT,
    kind: "integer",
    draw: (r) => [between(r, 1, 9)],
    solve: ([k = 0]) => q(100 * k),
    ref: ([k = 0]) => q(132 * k).div(qd(132, 2)),
    traps: [
      [
        "rises-subtracted",
        "conceptual",
        ([k = 0]) => whole(q(132 * k * 70, 100)),
      ],
    ],
    extra: ([k = 0]) => ({ m: String(132 * k) }),
    consts: [20, 10],
  }),
  p7({
    id: "P7.successive.06",
    form: "two-discounts-against-one-combined-discount",
    groups: [8, 8],
    origin: EXT,
    kind: "integer",
    draw: (r) => [between(r, 1, 6)],
    solve: ([k = 0]) => q(2 * k),
    ref: ([k = 0]) => q(30 * k).sub(q(100 * k).sub(q(72 * k))),
    traps: [["no-difference", "conceptual", () => q(0)]],
    extra: ([k = 0]) => ({ u: String(100 * k) }),
    consts: [10, 20, 30],
  }),
  p7({
    id: "P7.successive.07",
    form: "a-percentage-of-a-percentage",
    groups: [8, 8],
    origin: EXT,
    kind: "integer",
    draw: (r) => [pick(r, [50, 20, 10, 25]), pick(r, [20, 40, 60, 80])],
    valid: ([a = 0, b = 0]) => (a * b) % 100 === 0,
    solve: ([a = 0, b = 0]) => q((a * b) / 100),
    ref: ([a = 0, b = 0]) => q(a, 100).mul(q(b)),
    traps: [["percentages-added", "procedural", ([a = 0, b = 0]) => q(a + b)]],
    consts: [100],
  }),
  p7({
    id: "P7.successive.08",
    form: "a-rise-of-a-quarter-and-a-fall-of-a-fifth",
    groups: [8, 8],
    origin: EXT,
    kind: "integer",
    draw: (r) => [20 * between(r, 2, 12)],
    solve: ([u = 0]) => q(u),
    ref: ([u = 0]) => q(u).mul(q(5, 4)).mul(q(4, 5)),
    traps: [
      [
        "net-five-percent",
        "conceptual",
        ([u = 0]) => whole(q((u * 105) / 100)),
      ],
    ],
    consts: [25, 20],
  }),
  p7({
    id: "P7.successive.09",
    form: "a-fall-and-a-rise-in-euros",
    groups: [8, 8],
    origin: EXT,
    kind: "decimal",
    draw: (r) => [10 * between(r, 4, 30)],
    solve: ([u = 0]) => q(99 * u, 100),
    ref: ([u = 0]) => q(u).mul(qd(90, 2)).mul(qd(110, 2)),
    traps: [["back-to-the-start", "conceptual", ([u = 0]) => q(u)]],
    consts: [10],
  }),
  p7({
    id: "P7.successive.10",
    form: "the-total-change-after-two-equal-falls",
    groups: [8, 8],
    origin: EXT,
    kind: "integer",
    draw: (r) => [pick(r, [10, 20, 30, 40, 50])],
    solve: ([p = 0]) => q(100 - ((100 - p) * (100 - p)) / 100),
    ref: ([p = 0]) => q(2 * p - (p * p) / 100),
    traps: [["falls-added", "procedural", ([p = 0]) => q(2 * p)]],
    consts: [100],
  }),
  p7({
    id: "P7.successive.11",
    form: "a-rise-by-half-then-a-fall-by-a-third-of-the-new-price",
    groups: [8, 8],
    origin: EXT,
    kind: "decimal",
    draw: (r) => [6 * between(r, 2, 15)],
    solve: ([u = 0]) => q(u),
    ref: ([u = 0]) =>
      q(u)
        .add(q(u, 2))
        .sub(q(u).add(q(u, 2)).mul(q(1, 3))),
    traps: [
      [
        "fall-from-the-old-price",
        "procedural",
        ([u = 0]) => q(u).add(q(u, 2)).sub(q(u, 3)),
      ],
    ],
    consts: [50, 3],
  }),
];

export const pSpecs3: readonly Spec<never>[] = [
  ...mapScale,
  ...mapScaleS,
  ...offers,
  ...relative,
  ...successive,
];
