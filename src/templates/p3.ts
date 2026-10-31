// Domain P, part 3: scale on maps and plans, comparing offers and relative size, and successive percentage
// changes (RES-4287). The Dutch goals name scale at the end of group 7, with 1 : 50 000 at group 8, offers and
// relative comparison at group 8, and the rule that percentages add only over the same whole at group 8.
// Successive changes are stretch. Texts are plain blanks in `content/tasks-p.ru.json`.
import { Q } from "../math/q.js";
import { between, digits, pick } from "./draw.js";
import { dec, forFraction, q, qd } from "./kitf.js";
import { SIGNS, type Spec } from "./spec.js";

const sign = (x: Q, y: Q): (typeof SIGNS)[number] => SIGNS[x.cmp(y) + 1] ?? "=";
const flip = (s: (typeof SIGNS)[number]): (typeof SIGNS)[number] =>
  s === "<" ? ">" : s === ">" ? "<" : "=";
const whole = (x: Q): Q | null => (x.d === 1n ? x : null);
/** The quotient `n / d` when it is a whole number, or null. */
const exactOrNull = (n: number, d: number): Q | null =>
  n % d === 0 ? q(n / d) : null;
/** A sign, or `null` when it repeats a sign another trap of the same task already gives. */
const unless = (
  x: (typeof SIGNS)[number],
  ...seen: (typeof SIGNS)[number][]
): (typeof SIGNS)[number] | null => (seen.includes(x) ? null : x);

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
    traps: [
      ["one", "conceptual", () => q(1)],
      [
        "metres",
        "procedural",
        ([a = 0]) => (a === 100 ? null : whole(q(a, 100))),
      ],
    ],
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
    traps: [
      ["added", "procedural", ([a = 0, b = 0]) => q(a + b)],
      ["metres", "procedural", ([a = 0, b = 0]) => whole(q(a * b, 100))],
      ["scale-only", "conceptual", ([a = 0]) => q(a)],
      [
        "divided",
        "procedural",
        ([a = 0, b = 0]) => (b === 10 ? null : whole(q(a, b))),
      ],
    ],
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
    traps: [
      ["centimetres", "procedural", ([k = 0, b = 0]) => q(100 * k * b)],
      [
        "ten-instead-of-hundred",
        "procedural",
        ([k = 0, b = 0]) => q(10 * k * b),
      ],
      ["one-centimetre-only", "conceptual", ([k = 0]) => q(k)],
      ["divided", "procedural", ([k = 0, b = 0]) => whole(q(k, b))],
    ],
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
      ["comma-one-place-short", "procedural", ([c = 0]) => q(5 * c)],
      ["metres", "procedural", ([c = 0]) => q(500 * c)],
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
    traps: [
      ["ten-times", "procedural", ([k = 0]) => q(10 * k)],
      ["metres", "procedural", ([k = 0]) => q(1000 * k)],
      ["centimetres", "procedural", ([k = 0]) => q(100_000 * k)],
    ],
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
    traps: [
      ["metres-as-centimetres", "conceptual", ([m = 0]) => q(m)],
      ["centimetres-not-divided", "procedural", ([m = 0]) => q(100 * m)],
      ["scale-multiplied", "procedural", ([m = 0]) => q(5000 * m)],
    ],
    consts: [1, 50, 100],
  }),
  p5({
    id: "P5.map-scale.07",
    form: "which-scale-shows-more-detail",
    groups: [7, 8],
    kind: "compare",
    draw: (r) => [
      pick(r, [100, 200, 500, 1000, 2000, 5000, 10_000, 20_000]),
      pick(r, [100, 200, 500, 1000, 2000, 5000, 10_000, 20_000]),
    ],
    valid: ([a = 0, b = 0]) => a !== b,
    solve: ([a = 0, b = 0]) => sign(q(1, a), q(1, b)),
    ref: ([a = 0, b = 0]) => (a < b ? ">" : a > b ? "<" : "="),
    traps: [
      [
        "bigger-number-wins",
        "conceptual",
        ([a = 0, b = 0]) => sign(q(a), q(b)),
      ],
      ["same-numerator-means-equal", "conceptual", () => "="],
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
    traps: [
      ["centimetres", "procedural", ([c = 0]) => q(20 * c)],
      ["comma-one-place-off", "procedural", ([c = 0]) => q(2 * c)],
      ["divided", "procedural", ([c = 0]) => q(c, 20)],
    ],
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
    traps: [
      ["centimetres", "procedural", ([c = 0]) => q(50 * c)],
      ["comma-one-place-off", "procedural", ([c = 0]) => q(5 * c)],
      ["divided", "procedural", ([c = 0]) => q(c, 50)],
    ],
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
    traps: [
      ["kilometres-as-metres", "procedural", ([, d = 0]) => q(10 * d)],
      [
        "kilometre-as-ten-thousand-centimetres",
        "procedural",
        ([, d = 0]) => q(100 * d),
      ],
      [
        "kilometre-as-a-million-centimetres",
        "procedural",
        ([, d = 0]) => q(10_000 * d),
      ],
    ],
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
    traps: [
      ["multiplied", "procedural", ([m = 0]) => q(5 * m)],
      ["centimetres-not-divided", "procedural", ([m = 0]) => q(100 * m)],
      ["divided-by-fifty", "procedural", ([m = 0]) => q(2 * m)],
    ],
    consts: [1, 100, 500],
  }),
];

const mapScaleMore = [
  p5({
    id: "P5.map-scale.12",
    form: "a-segment-read-on-a-ruler-at-a-map-scale",
    groups: [8, 8],
    kind: "decimal",
    draw: (r) => [
      pick(r, [20_000, 50_000, 200_000, 250_000, 400_000, 500_000]),
      between(r, 3, 10),
    ],
    solve: ([a = 0, b = 0]) => q(a * b, 100_000),
    ref: ([a = 0, b = 0]) => q(b).mul(q(a)).div(q(100_000)),
    traps: [
      ["centimetres", "procedural", ([a = 0, b = 0]) => q(a * b)],
      [
        "metres-instead-of-kilometres",
        "procedural",
        ([a = 0, b = 0]) => q(a * b, 100),
      ],
      [
        "map-length-itself",
        "conceptual",
        ([a = 0, b = 0]) => (a === 100_000 ? null : q(b)),
      ],
    ],
    extra: ([a = 0]) => ({ a: digits(a) }),
    consts: [1, 100000],
  }),
  p5({
    id: "P5.map-scale.13",
    form: "the-same-distance-on-a-map-of-another-scale",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [
      pick(r, [20_000, 25_000, 50_000, 100_000, 200_000, 250_000]),
      between(r, 2, 12),
      pick(r, [20_000, 25_000, 50_000, 100_000, 200_000, 250_000]),
    ],
    valid: ([a = 0, b = 0, c = 0]) => a !== c && (a * b) % c === 0,
    solve: ([a = 0, b = 0, c = 0]) => q((a * b) / c),
    ref: ([a = 0, b = 0, c = 0]) => q(a).mul(q(b)).div(q(c)),
    traps: [
      [
        "real-distance-in-centimetres",
        "procedural",
        ([a = 0, b = 0]) => q(a * b),
      ],
      [
        "scales-swapped",
        "conceptual",
        ([a = 0, b = 0, c = 0]) => whole(q(b * c, a)),
      ],
      ["same-length", "conceptual", ([, b = 0]) => q(b)],
    ],
    consts: [1],
  }),
  p5({
    id: "P5.map-scale.14",
    form: "the-area-of-a-room-from-a-plan",
    groups: [8, 8],
    origin: {
      olympiad:
        "a scale stretches each side, so an area grows by the scale twice (RES-4287)",
    },
    kind: "decimal",
    draw: (r) => [pick(r, [100, 200, 500]), between(r, 2, 8), between(r, 2, 8)],
    valid: ([, b = 0, c = 0]) => b !== c,
    solve: ([a = 0, b = 0, c = 0]) => q(a * a * b * c, 10_000),
    ref: ([a = 0, b = 0, c = 0]) => q(a * b, 100).mul(q(a * c, 100)),
    traps: [
      [
        "area-scaled-like-a-length",
        "conceptual",
        ([a = 0, b = 0, c = 0]) => q(a * b * c, 100),
      ],
      [
        "centimetres-squared",
        "procedural",
        ([a = 0, b = 0, c = 0]) => q(a * a * b * c),
      ],
      [
        "one-side-scaled",
        "conceptual",
        ([a = 0, b = 0, c = 0]) => q(a * b * c, 10_000),
      ],
    ],
    consts: [1, 10000, 100],
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
    traps: [
      ["metres", "procedural", ([c = 0]) => q(50 * c)],
      ["centimetres", "procedural", ([c = 0]) => q(500_000 * c)],
      ["metres-instead-of-kilometres", "procedural", ([c = 0]) => q(5000 * c)],
    ],
    consts: [1, 1000, 100000, 500000],
  }),
  p5s({
    id: "P5.map-scale-1S.02",
    form: "a-distance-at-one-to-four-hundred-thousand",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [2 * between(r, 2, 19) + 1],
    solve: ([k = 0]) => q(2 * k),
    ref: ([k = 0]) => q(k, 2).mul(q(400_000)).div(q(100_000)),
    traps: [
      ["ten-times", "procedural", ([k = 0]) => q(20 * k)],
      ["centimetres", "procedural", ([k = 0]) => q(200_000 * k)],
      ["metres-instead-of-kilometres", "procedural", ([k = 0]) => q(2000 * k)],
    ],
    extra: ([k = 0]) => ({ x: dec(5 * k, 1, true) }),
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
    traps: [
      ["scale-multiplied", "procedural", ([c = 0]) => q(4 * c)],
      ["centimetres-not-divided", "procedural", ([c = 0]) => q(400_000 * c)],
      [
        "kilometre-as-a-million-centimetres",
        "procedural",
        ([c = 0]) => q(10 * c),
      ],
    ],
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
      [
        "kilometre-as-ten-thousand-centimetres",
        "procedural",
        ([c = 0, km = 0]) => q((km * 10_000) / c),
      ],
      ["not-converted", "procedural", ([c = 0, km = 0]) => whole(q(km, c))],
    ],
    consts: [1, 1000, 100000],
  }),
  p5s({
    id: "P5.map-scale-1S.05",
    form: "which-scale-shows-the-longer-real-distance",
    groups: [8, 8],
    kind: "compare",
    draw: (r) => [
      pick(r, [50_000, 100_000, 200_000, 400_000, 500_000, 1_000_000]),
      pick(r, [50_000, 100_000, 200_000, 400_000, 500_000, 1_000_000]),
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
      ["same-length-same-distance", "conceptual", () => "="],
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
      ["speed-multiplied", "procedural", ([c = 0, s = 0]) => q(5 * c * s)],
      [
        "distance-ten-times-too-big",
        "procedural",
        ([c = 0, s = 0]) => whole(q(50 * c, s)),
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
    traps: [
      ["centimetres", "procedural", ([k = 0]) => q(10_000 * k)],
      ["divided-by-ten", "procedural", ([k = 0]) => q(1000 * k)],
      ["divided-by-a-thousand", "procedural", ([k = 0]) => q(10 * k)],
    ],
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
    traps: [
      ["ten-times-too-small", "procedural", ([c = 0]) => q(20 * c)],
      ["centimetres", "procedural", ([c = 0]) => q(20_000 * c)],
      ["ten-times-too-big", "procedural", ([c = 0]) => q(2000 * c)],
    ],
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
      ["bar-ignored", "procedural", ([, b = 0, c = 0]) => q(b * c)],
      ["one-centimetre-only", "conceptual", ([a = 0, b = 0]) => q(b, a)],
      [
        "ratio-inverted",
        "conceptual",
        ([a = 0, b = 0, c = 0]) => (b === 3 ? null : q(a * c, b)),
      ],
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
    traps: [
      ["ten-times-too-big", "procedural", ([c = 0]) => q(10 * c)],
      ["drawing-length", "conceptual", ([c = 0]) => q(c)],
      ["divided-by-a-hundred", "procedural", ([c = 0]) => qd(c, 2)],
    ],
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
    traps: [
      ["map-length-itself", "conceptual", ([c = 0]) => q(c)],
      [
        "metres-instead-of-kilometres",
        "procedural",
        ([c = 0]) => q(10_000 * c),
      ],
      ["centimetres", "procedural", ([c = 0]) => q(1_000_000 * c)],
    ],
    consts: [1, 100000, 1000000],
  }),
];

const mapScaleSMore = [
  p5s({
    id: "P5.map-scale-1S.12",
    form: "a-bicycle-ride-measured-on-a-map",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [between(r, 3, 20), pick(r, [10, 12, 15, 18, 20, 30])],
    valid: ([a = 0, b = 0]) => (30 * a) % b === 0,
    solve: ([a = 0, b = 0]) => q((30 * a) / b),
    ref: ([a = 0, b = 0]) =>
      q(a * 50_000, 100_000)
        .mul(q(60))
        .div(q(b)),
    traps: [
      [
        "hours-instead-of-minutes",
        "procedural",
        ([a = 0, b = 0]) => exactOrNull(a, 2 * b),
      ],
      [
        "map-length-as-kilometres",
        "conceptual",
        ([a = 0, b = 0]) => exactOrNull(60 * a, b),
      ],
      ["the-distance-itself", "conceptual", ([a = 0]) => exactOrNull(a, 2)],
    ],
    extra: ([a = 0]) => ({ km: dec(5 * a, 1, true) }),
    consts: [1, 50000, 100000],
  }),
  p5s({
    id: "P5.map-scale-1S.13",
    form: "where-two-cars-meet-on-a-map",
    groups: [8, 8],
    origin: {
      olympiad:
        "speeds in a ratio split the road in the same ratio, MCCME 2023 grade 8 (RES-4287)",
    },
    kind: "integer",
    draw: (r) => {
      const pair = pick(r, [
        [1, 2],
        [2, 3],
        [3, 2],
        [1, 3],
        [3, 1],
        [2, 5],
        [3, 4],
        [4, 3],
      ]);
      const b = pair[0] ?? 0;
      const c = pair[1] ?? 0;
      return [(b + c) * between(r, 1, 6), b, c];
    },
    solve: ([a = 0, b = 0, c = 0]) => q((2 * a * b) / (b + c)),
    ref: ([a = 0, b = 0, c = 0]) => q(a * 200_000, 100_000).mul(q(b, b + c)),
    traps: [
      [
        "second-car-distance",
        "conceptual",
        ([a = 0, b = 0, c = 0]) => q((2 * a * c) / (b + c)),
      ],
      [
        "half-way",
        "conceptual",
        ([a = 0, b = 0, c = 0]) => (b === c ? null : q(a)),
      ],
      ["the-whole-distance", "conceptual", ([a = 0]) => q(2 * a)],
    ],
    extra: ([a = 0]) => ({ km: String(2 * a) }),
    consts: [1, 200000, 100000],
  }),
  p5s({
    id: "P5.map-scale-1S.14",
    form: "a-route-of-two-legs-on-a-map",
    groups: [8, 8],
    kind: "decimal",
    draw: (r) => [between(r, 3, 14), between(r, 3, 14)],
    valid: ([a = 0, b = 0]) => a !== b,
    solve: ([a = 0, b = 0]) => qd(25 * (a + b), 1),
    ref: ([a = 0, b = 0]) => q((a + b) * 250_000, 100_000),
    traps: [
      ["one-leg-only", "conceptual", ([a = 0]) => qd(25 * a, 1)],
      ["centimetres", "procedural", ([a = 0, b = 0]) => q((a + b) * 250_000)],
      [
        "comma-one-place-off",
        "procedural",
        ([a = 0, b = 0]) => qd(25 * (a + b), 2),
      ],
    ],
    consts: [1, 250000, 100000],
  }),
];

/** The price of six items under the three offers of P6.compare-offer.12, in euros. */
const totals = (v: readonly number[]): number[] => {
  const u = v[0] ?? 0;
  const p = v[1] ?? 0;
  const d = v[2] ?? 0;
  return [(6 * u * (100 - p)) / 100, 4 * u, 6 * (u - d)];
};
/** The index of the least total. */
const best = (t: readonly number[]): number => t.indexOf(Math.min(...t));
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
    traps: [
      ["free-item-always-better", "conceptual", () => "<"],
      ["one-item-against-the-total", "conceptual", () => ">"],
      ["offers-look-equal", "conceptual", () => "="],
    ],
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
    draw: (r) => [between(r, 5, 30), pick(r, [30, 40, 50, 60, 70])],
    solve: ([u = 0, p = 0]) => sign(q(u), q(2 * u * (100 - p), 100)),
    ref: ([u = 0, p = 0]) =>
      100 * u < 2 * u * (100 - p)
        ? "<"
        : 100 * u > 2 * u * (100 - p)
          ? ">"
          : "=",
    traps: [
      [
        "first-is-cheaper",
        "conceptual",
        ([u = 0, p = 0]) => unless("<", sign(q(u), q(2 * u * (100 - p), 100))),
      ],
      [
        "second-is-cheaper",
        "conceptual",
        ([u = 0, p = 0]) => unless(">", sign(q(u), q(2 * u * (100 - p), 100))),
      ],
      [
        "offers-look-equal",
        "conceptual",
        ([u = 0, p = 0]) => unless("=", sign(q(u), q(2 * u * (100 - p), 100))),
      ],
    ],
    extra: ([u = 0, p = 0]) => ({
      sign: sign(q(u), q(2 * u * (100 - p), 100)),
    }),
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
      [
        "discounts-compared",
        "conceptual",
        ([u = 0, p = 0, e = 0]) =>
          unless(
            flip(sign(q((u * (100 - p)) / 100), q(u - e))),
            sign(q(p), q(e)),
          ),
      ],
      [
        "offers-look-equal",
        "conceptual",
        ([, p = 0, e = 0]) => (p === e ? null : "="),
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
    traps: [
      ["two-prices", "procedural", ([u = 0]) => q(2 * u)],
      ["three-prices", "conceptual", ([u = 0]) => q(3 * u)],
      ["prices-added", "procedural", ([u = 0]) => q(5 * u)],
    ],
  }),
  p6({
    id: "P6.compare-offer.05",
    form: "one-free-item-as-a-percentage-discount",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [pick(r, [2, 4, 5, 10])],
    solve: ([n = 0]) => q(100 / n),
    ref: ([n = 0]) => q(1, n).mul(q(100)),
    traps: [
      ["items-in-the-pack", "conceptual", ([n = 0]) => q(n)],
      ["one-item-one-percent", "conceptual", () => q(1)],
      ["percent-paid", "conceptual", ([n = 0]) => q(100 - 100 / n)],
    ],
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
    traps: [
      ["both-at-half-price", "conceptual", ([u = 0]) => q(u)],
      ["no-discount", "conceptual", ([u = 0]) => q(2 * u)],
      ["half-price-item-only", "conceptual", ([u = 0]) => qd(5 * u, 1)],
    ],
    consts: [50],
  }),
  p6({
    id: "P6.compare-offer.07",
    form: "the-saving-from-a-percentage-discount",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [pick(r, [10, 15, 20, 25]), 5 * between(r, 2, 10)],
    solve: ([p = 0, u = 0]) => q((12 * u * p) / 100),
    ref: ([p = 0, u = 0]) => q(u * 12).mul(qd(p, 2)),
    traps: [
      [
        "price-after-the-discount",
        "conceptual",
        ([p = 0, u = 0]) => q(12 * u - (12 * u * p) / 100),
      ],
      ["percent-as-euros", "conceptual", ([p = 0]) => q(p)],
      [
        "one-month-only",
        "conceptual",
        ([p = 0, u = 0]) => whole(q(u * p, 100)),
      ],
      [
        "not-divided-by-a-hundred",
        "procedural",
        ([p = 0, u = 0]) => q(12 * p * u),
      ],
    ],
    consts: [12, 100],
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
      ["the-euro-discount-only", "conceptual", ([, , e = 0]) => q(e)],
      [
        "discounts-added",
        "procedural",
        ([u = 0, p = 0, e = 0]) => q((u * p) / 100 + e),
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
      [
        "fee-forgotten",
        "procedural",
        ([p = 0, u = 0]) => q((u * (100 - p)) / 100),
      ],
      [
        "discount-added",
        "procedural",
        ([p = 0, u = 0, f = 0]) => q(u + (u * p) / 100 + f),
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
    traps: [
      ["full-price", "conceptual", ([u = 0]) => q(u)],
      ["total-for-four", "conceptual", ([u = 0]) => q(3 * u)],
      ["quarter-of-the-price", "procedural", ([u = 0]) => q(u, 4)],
    ],
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
      ["offers-look-equal", "conceptual", () => "="],
    ],
    extra: ([n = 0, p = 0]) => ({ sign: sign(q(100, n), q(p)) }),
  }),
];

const offersMore = [
  p6({
    id: "P6.compare-offer.12",
    form: "the-best-of-three-offers-for-six-items",
    groups: [8, 8],
    kind: "choice",
    draw: (r) => [
      pick(r, [12, 15, 20, 24, 30]),
      pick(r, [20, 25, 30, 40]),
      pick(r, [2, 3, 4, 5]),
    ],
    valid: (v) => {
      return new Set(totals(v)).size === 3;
    },
    options: () => ["1", "2", "3"],
    solve: (v) => String(best(totals(v)) + 1),
    ref: (v) => {
      const t = totals(v);
      const least = t.reduce((m, x) => (x < m ? x : m));
      return String(t.findIndex((x) => x === least) + 1);
    },
    traps: [
      [
        "free-item-always-best",
        "conceptual",
        (v) => (best(totals(v)) === 1 ? null : "2"),
      ],
      [
        "largest-number-wins",
        "conceptual",
        (v) => {
          const chosen = (v[1] ?? 0) > (v[2] ?? 0) ? 1 : 3;
          return chosen === best(totals(v)) + 1 ? null : String(chosen);
        },
      ],
    ],
    extra: (v) => {
      const t = totals(v);
      return {
        t1: dec(Math.round((t[0] ?? 0) * 100), 2, true),
        t2: dec(Math.round((t[1] ?? 0) * 100), 2, true),
        t3: dec(Math.round((t[2] ?? 0) * 100), 2, true),
      };
    },
    consts: [1, 2, 3, 4, 6],
  }),
  p6({
    id: "P6.compare-offer.13",
    form: "every-third-item-free",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => [between(r, 4, 20), between(r, 7, 20)],
    valid: ([, n = 0]) => n % 3 !== 0,
    solve: ([u = 0, n = 0]) => q(u * (n - Math.floor(n / 3))),
    ref: ([u = 0, n = 0]) => q(u).mul(q(n - Math.floor(n / 3))),
    traps: [
      [
        "one-third-free",
        "conceptual",
        ([u = 0, n = 0]) => whole(q(2 * u * n, 3)),
      ],
      [
        "free-rounded-up",
        "conceptual",
        ([u = 0, n = 0]) => q(u * (n - Math.ceil(n / 3))),
      ],
      ["no-discount", "conceptual", ([u = 0, n = 0]) => q(u * n)],
    ],
    extra: ([, n = 0]) => ({ f: String(Math.floor(n / 3)) }),
    roles: { a: "price of one item", b: "count of items" },
    consts: [3],
  }),
  p6({
    id: "P6.compare-offer.14",
    form: "a-coupon-and-a-discount-in-either-order",
    groups: [8, 8],
    origin: {
      olympiad:
        "the answer does not depend on the price: the coupon taken after the discount loses p per cent of itself (RES-4287)",
    },
    kind: "integer",
    draw: (r) => [
      10 * between(r, 6, 20),
      pick(r, [10, 20, 25, 30, 40, 50]),
      pick(r, [10, 20, 50]),
    ],
    valid: ([u = 0, p = 0, c = 0]) =>
      (c * p) % 100 === 0 && (u * (100 - p)) / 100 > c,
    solve: ([, p = 0, c = 0]) => q((c * p) / 100),
    ref: ([u = 0, p = 0, c = 0]) =>
      q((u - c) * (100 - p), 100).sub(q(u * (100 - p), 100).sub(q(c))),
    traps: [
      ["order-does-not-matter", "conceptual", () => q(0)],
      ["the-coupon-itself", "conceptual", ([, , c = 0]) => q(c)],
      [
        "the-discount-itself",
        "conceptual",
        ([u = 0, p = 0]) => whole(q(u * p, 100)),
      ],
    ],
    roles: { a: "price", b: "percent of the discount", c: "coupon in euros" },
    consts: [100],
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
      [
        "totals-compared",
        "conceptual",
        ([g1 = 0, n1 = 0, g2 = 0, n2 = 0]) =>
          unless(sign(q(n1), q(n2)), sign(q(g1), q(g2))),
      ],
      [
        "shares-look-equal",
        "conceptual",
        ([g1 = 0, n1 = 0, g2 = 0, n2 = 0]) =>
          g1 === g2 || n1 === n2 ? null : "=",
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
      [
        "shares-added",
        "procedural",
        ([g1 = 0, n1 = 0, g2 = 0, n2 = 0]) =>
          q((100 * g1) / n1 + (100 * g2) / n2),
      ],
      [
        "totals-subtracted",
        "procedural",
        ([g1 = 0, n1 = 0, g2 = 0, n2 = 0]) =>
          Math.abs(n1 - n2) === Math.abs(g1 - g2) ? null : q(Math.abs(n1 - n2)),
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
    valid: ([o = 0, p = 0]) =>
      (o * p) % 100 === 0 && p !== o && p !== o + (o * p) / 100,
    solve: ([, p = 0]) => q(p),
    ref: ([o = 0, p = 0]) =>
      q((o * p) / 100)
        .div(q(o))
        .mul(q(100)),
    traps: [
      ["absolute-growth", "conceptual", ([o = 0, p = 0]) => q((o * p) / 100)],
      ["new-as-percent", "conceptual", ([, p = 0]) => q(100 + p)],
      [
        "growth-over-new",
        "conceptual",
        ([o = 0, p = 0]) => whole(q(100 * ((o * p) / 100), o + (o * p) / 100)),
      ],
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
    valid: ([o = 0, p = 0]) =>
      (o * p) % 100 === 0 && p !== o && p !== o - (o * p) / 100,
    solve: ([, p = 0]) => q(p),
    ref: ([o = 0, p = 0]) =>
      q((o * p) / 100)
        .div(q(o))
        .mul(q(100)),
    traps: [
      ["absolute-decline", "conceptual", ([o = 0, p = 0]) => q((o * p) / 100)],
      ["remaining-percent", "conceptual", ([, p = 0]) => q(100 - p)],
      [
        "decline-over-new",
        "conceptual",
        ([o = 0, p = 0]) => whole(q(100 * ((o * p) / 100), o - (o * p) / 100)),
      ],
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
      [
        "new-values-compared",
        "conceptual",
        ([a1 = 0, b1 = 0, a2 = 0, b2 = 0]) =>
          unless(sign(q(b1), q(b2)), sign(q(b1 - a1), q(b2 - a2))),
      ],
      [
        "growth-looks-equal",
        "conceptual",
        ([a1 = 0, b1 = 0, a2 = 0, b2 = 0]) =>
          b1 === b2 || b1 - a1 === b2 - a2 ? null : "=",
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
    traps: [
      ["count-itself", "conceptual", ([n = 0]) => q(n)],
      [
        "total-itself",
        "conceptual",
        ([n = 0, t = 0]) => (t === n ? null : q(t)),
      ],
      [
        "other-outcome",
        "conceptual",
        ([n = 0, t = 0]) => {
          const w = 100 - (100 * n) / t;
          return w === n || w === t ? null : q(w);
        },
      ],
    ],
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
    traps: [
      ["difference", "procedural", ([a = 0, k = 0]) => q(a * k - a)],
      ["extra-copies", "conceptual", ([, k = 0]) => q(k - 1)],
      ["numbers-added", "procedural", ([a = 0, k = 0]) => q(a * k + a)],
    ],
    extra: ([a = 0, k = 0]) => ({ big: String(a * k) }),
  }),
  p6r({
    id: "P6.relative.08",
    form: "by-what-percentage-the-smaller-is-below-the-larger",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => {
      const a = 20 * between(r, 2, 12);
      const x = pick(r, [10, 20, 25, 30, 40, 60, 75, 80]);
      return [a, (a * (100 - x)) / 100];
    },
    valid: ([a = 0, b = 0]) => {
      const x = (100 * (a - b)) / a;
      return x !== a && x !== b;
    },
    solve: ([a = 0, b = 0]) => q((100 * (a - b)) / a),
    ref: ([a = 0, b = 0]) => q(a - b, a).mul(q(100)),
    traps: [
      [
        "measured-from-the-smaller",
        "conceptual",
        ([a = 0, b = 0]) => whole(q(100 * (a - b), b)),
      ],
      ["difference-in-units", "conceptual", ([a = 0, b = 0]) => q(a - b)],
      [
        "the-share-itself",
        "conceptual",
        ([a = 0, b = 0]) => whole(q(100 * b, a)),
      ],
    ],
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
      [
        "areas-compared",
        "conceptual",
        ([p1 = 0, a1 = 0, p2 = 0, a2 = 0]) =>
          unless(sign(q(a1), q(a2)), sign(q(p1), q(p2))),
      ],
      [
        "density-looks-equal",
        "conceptual",
        ([p1 = 0, a1 = 0, p2 = 0, a2 = 0]) =>
          p1 === p2 || a1 === a2 ? null : "=",
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
    kind: "decimal",
    draw: (r) => [between(r, 1, 9), pick(r, [200, 250, 400, 500, 1000])],
    valid: ([n = 0, t = 0]) => (100 * n) / t !== n,
    solve: ([n = 0, t = 0]) => q(100 * n, t),
    ref: ([n = 0, t = 0]) => q(n, t).mul(q(100)),
    traps: [
      ["count-itself", "conceptual", ([n = 0]) => q(n)],
      [
        "good-share",
        "conceptual",
        ([n = 0, t = 0]) => q(100).sub(q(100 * n, t)),
      ],
      ["good-count", "conceptual", ([n = 0, t = 0]) => q(t - n)],
    ],
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
      [
        "bigger-maximum-wins",
        "conceptual",
        ([a = 0, , b = 0]) => unless("<", sign(q(a), q(b))),
      ],
      [
        "results-look-equal",
        "conceptual",
        ([a = 0, , b = 0]) => (a === b ? null : "="),
      ],
    ],
    extra: ([a = 0, , b = 0]) => ({ sign: sign(q(a, 20), q(b, 25)) }),
    consts: [20, 25],
  }),
];

const relativeMore = [
  p6r({
    id: "P6.relative.12",
    form: "two-languages-and-the-people-who-speak-both",
    groups: [8, 8],
    origin: {
      olympiad:
        "the overlap of two percentages of one whole, Kangoeroe 397 lines 634 to 638 (RES-4287)",
    },
    kind: "integer",
    draw: (r) => [between(r, 56, 95), between(r, 56, 95)],
    valid: ([a = 0, b = 0]) =>
      a !== b && a + b > 100 && a + b - 100 !== a && a + b - 100 !== b,
    solve: ([a = 0, b = 0]) => q(a + b - 100),
    ref: ([a = 0, b = 0]) => q(a).sub(q(100 - b)),
    traps: [
      ["the-sum", "procedural", ([a = 0, b = 0]) => q(a + b)],
      ["the-difference", "procedural", ([a = 0, b = 0]) => q(Math.abs(a - b))],
    ],
    consts: [100],
  }),
  p6r({
    id: "P6.relative.13",
    form: "a-percentage-of-a-percentage-in-two-groups",
    groups: [8, 8],
    origin: {
      olympiad:
        "a share of a share in two groups, Kangoeroe 397 lines 736 to 743 (RES-4287)",
    },
    kind: "integer",
    draw: (r) => [
      pick(r, [20, 25, 40, 50, 60, 75]),
      pick(r, [10, 20, 30, 40, 50, 60, 80]),
      pick(r, [10, 20, 30, 40, 50, 60, 80]),
    ],
    valid: ([p = 0, b = 0, c = 0]) =>
      (p * b) % 100 === 0 && ((100 - p) * c) % 100 === 0 && b !== c,
    solve: ([p = 0, b = 0, c = 0]) => q((p * b + (100 - p) * c) / 100),
    ref: ([p = 0, b = 0, c = 0]) =>
      q(p, 100)
        .mul(q(b))
        .add(q(100 - p, 100).mul(q(c))),
    traps: [
      [
        "percentages-averaged",
        "conceptual",
        ([, b = 0, c = 0]) => whole(q(b + c, 2)),
      ],
      ["boys-only", "conceptual", ([p = 0, b = 0]) => q((p * b) / 100)],
      ["percentages-added", "procedural", ([, b = 0, c = 0]) => q(b + c)],
    ],
    consts: [100],
  }),
  p6r({
    id: "P6.relative.14",
    form: "shots-needed-to-reach-a-target-share",
    groups: [8, 8],
    origin: {
      olympiad:
        "the misses stay the same, so the target share fixes the total (RES-4287)",
    },
    kind: "integer",
    draw: (r) => {
      const p = pick(r, [50, 60, 75, 80]);
      const m = between(r, 2, 10);
      const total = (100 * m) / (100 - p);
      const n = between(r, m + 1, Math.max(m + 1, Math.ceil(total) - 1));
      return [n, n - m, p];
    },
    valid: ([n = 0, h = 0, p = 0]) => {
      const m = n - h;
      const total = (100 * m) / (100 - p);
      return Number.isInteger(total) && total > n && h >= 1 && total - n !== m;
    },
    solve: ([n = 0, h = 0, p = 0]) => q((100 * (n - h)) / (100 - p) - n),
    ref: ([n = 0, h = 0, p = 0]) =>
      q(n - h)
        .div(q(100 - p, 100))
        .sub(q(n)),
    traps: [
      [
        "the-total-shots",
        "conceptual",
        ([n = 0, h = 0, p = 0]) => q((100 * (n - h)) / (100 - p)),
      ],
      ["the-misses", "conceptual", ([n = 0, h = 0]) => q(n - h)],
    ],
    extra: ([n = 0, h = 0, p = 0]) => ({
      t: String((100 * (n - h)) / (100 - p)),
    }),
    consts: [100],
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
    traps: [
      ["back-to-the-start", "conceptual", () => q(100)],
      ["rise-only", "conceptual", ([p = 0]) => q(100 + p)],
      ["loss-added", "conceptual", ([p = 0]) => q(10_000 + p * p, 100)],
    ],
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
      ["first-discount-only", "conceptual", ([a = 0]) => q(100 - a)],
      [
        "total-discount-in-percent",
        "conceptual",
        ([a = 0, b = 0]) => q(100).sub(q((100 - a) * (100 - b), 100)),
      ],
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
    traps: [
      ["rises-added", "procedural", ([p = 0]) => q(100 + 2 * p)],
      ["first-rise-only", "conceptual", ([p = 0]) => q(100 + p)],
      [
        "total-rise-in-percent",
        "conceptual",
        ([p = 0]) => q((100 + p) * (100 + p), 100).sub(q(100)),
      ],
    ],
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
    traps: [
      ["doubled", "conceptual", ([b = 0]) => q(2 * b)],
      ["halved-only", "conceptual", ([b = 0]) => q(b / 2)],
      ["halved-twice", "conceptual", ([b = 0]) => whole(q(b, 4))],
    ],
    consts: [50, 100],
  }),
  p7({
    id: "P7.successive.05",
    form: "the-start-before-two-rises",
    groups: [8, 8],
    origin: EXT,
    kind: "integer",
    draw: (r) => [
      pick(r, [10, 20, 25, 50]),
      pick(r, [10, 20, 50]),
      between(r, 1, 5),
    ],
    valid: ([a = 0, b = 0]) => a !== b,
    solve: ([, , k = 0]) => q(400 * k),
    ref: ([a = 0, b = 0, k = 0]) =>
      q(((100 + a) * (100 + b) * 400 * k) / 10_000).div(
        q((100 + a) * (100 + b), 10_000),
      ),
    traps: [
      [
        "rises-subtracted",
        "conceptual",
        ([a = 0, b = 0, k = 0]) =>
          whole(q((100 + a) * (100 + b) * 4 * k * (100 - a - b), 10_000)),
      ],
      [
        "undo-only-the-last-rise",
        "conceptual",
        ([a = 0, , k = 0]) => whole(q((100 + a) * 4 * k, 1)),
      ],
      [
        "undo-only-the-first-rise",
        "conceptual",
        ([, b = 0, k = 0]) => whole(q((100 + b) * 4 * k, 1)),
      ],
      [
        "percents-added-to-the-end",
        "conceptual",
        ([a = 0, b = 0, k = 0]) =>
          whole(q((100 + a) * (100 + b) * 4 * k * (100 + a + b), 10_000)),
      ],
    ],
    extra: ([a = 0, b = 0, k = 0]) => ({
      m: String(((100 + a) * (100 + b) * 4 * k) / 100),
    }),
    consts: [100],
  }),
  p7({
    id: "P7.successive.06",
    form: "two-discounts-against-one-combined-discount",
    groups: [8, 8],
    origin: EXT,
    kind: "integer",
    draw: (r) => [
      400 * between(r, 1, 5),
      pick(r, [10, 20, 25, 30]),
      pick(r, [10, 20, 25, 50]),
    ],
    solve: ([u = 0, b = 0, c = 0]) => q((u * b * c) / 10_000),
    ref: ([u = 0, b = 0, c = 0]) =>
      q(u * (100 - b) * (100 - c), 10_000).sub(q(u * (100 - b - c), 100)),
    traps: [
      ["no-difference", "conceptual", () => q(0)],
      [
        "price-after-two-discounts",
        "conceptual",
        ([u = 0, b = 0, c = 0]) => q((u * (100 - b) * (100 - c)) / 10_000),
      ],
      [
        "price-after-one-discount",
        "conceptual",
        ([u = 0, b = 0, c = 0]) => q((u * (100 - b - c)) / 100),
      ],
    ],
    extra: ([, b = 0, c = 0]) => ({ s: String(b + c) }),
    consts: [100],
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
    traps: [
      ["percentages-added", "procedural", ([a = 0, b = 0]) => q(a + b)],
      ["not-divided-by-a-hundred", "procedural", ([a = 0, b = 0]) => q(a * b)],
      ["divided-by-ten", "procedural", ([a = 0, b = 0]) => q((a * b) / 10)],
    ],
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
      ["net-five-percent", "conceptual", ([u = 0]) => whole(q(u * 105, 100))],
      ["rise-only", "conceptual", ([u = 0]) => whole(q(u * 125, 100))],
      ["fall-only", "conceptual", ([u = 0]) => whole(q(u * 80, 100))],
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
    traps: [
      ["back-to-the-start", "conceptual", ([u = 0]) => q(u)],
      ["fall-only", "conceptual", ([u = 0]) => q((u * 90) / 100)],
      ["loss-added", "conceptual", ([u = 0]) => q(101 * u, 100)],
    ],
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
    traps: [
      ["falls-added", "procedural", ([p = 0]) => q(2 * p)],
      [
        "remaining-price",
        "conceptual",
        ([p = 0]) => q(((100 - p) * (100 - p)) / 100),
      ],
      ["first-fall-only", "conceptual", ([p = 0]) => q(p)],
    ],
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
      ["rise-only", "conceptual", ([u = 0]) => q(3 * u, 2)],
      ["fall-only", "conceptual", ([u = 0]) => q(2 * u, 3)],
    ],
    consts: [50, 3],
  }),
];

const successiveMore = [
  p7({
    id: "P7.successive.12",
    form: "two-rises-as-one-total-rise",
    groups: [8, 8],
    origin: {
      olympiad:
        "successive rises multiply and do not add, in the spirit of Kangoeroe (RES-4287)",
    },
    kind: "integer",
    draw: (r) => [
      pick(r, [10, 20, 25, 30, 40, 50, 60, 100]),
      pick(r, [10, 20, 25, 30, 40, 50, 60, 100]),
    ],
    valid: ([a = 0, b = 0]) => ((100 + a) * (100 + b)) % 100 === 0,
    solve: ([a = 0, b = 0]) => q(((100 + a) * (100 + b)) / 100 - 100),
    ref: ([a = 0, b = 0]) =>
      q(100 + a, 100)
        .mul(q(100 + b, 100))
        .sub(q(1))
        .mul(q(100)),
    traps: [
      ["percentages-added", "procedural", ([a = 0, b = 0]) => q(a + b)],
      ["first-rise-only", "conceptual", ([a = 0]) => q(a)],
    ],
    consts: [100],
  }),
  p7({
    id: "P7.successive.13",
    form: "a-deposit-with-interest-on-interest",
    groups: [8, 8],
    origin: EXT,
    kind: "integer",
    draw: (r) => [1000 * between(r, 1, 4), pick(r, [10, 20, 50, 100])],
    solve: ([a = 0, b = 0]) => q((a * (100 + b) ** 3) / 1_000_000),
    ref: ([a = 0, b = 0]) =>
      q(a)
        .mul(q(100 + b, 100))
        .mul(q(100 + b, 100))
        .mul(q(100 + b, 100)),
    traps: [
      [
        "simple-interest",
        "conceptual",
        ([a = 0, b = 0]) => q(a + (3 * a * b) / 100),
      ],
      [
        "only-two-years",
        "conceptual",
        ([a = 0, b = 0]) => q((a * (100 + b) ** 2) / 10_000),
      ],
    ],
    extra: ([a = 0, b = 0]) => ({
      y1: String((a * (100 + b)) / 100),
      y2: String((a * (100 + b) ** 2) / 10_000),
    }),
    consts: [100],
  }),
  p7({
    id: "P7.successive.14",
    form: "the-start-before-a-rise-and-a-fall",
    groups: [8, 8],
    origin: EXT,
    kind: "integer",
    draw: (r) => [
      pick(r, [10, 20, 25, 50]),
      pick(r, [10, 20, 25, 40, 50]),
      between(r, 1, 5),
    ],
    solve: ([, , k = 0]) => q(400 * k),
    ref: ([a = 0, b = 0, k = 0]) =>
      q(((100 + a) * (100 - b) * 400 * k) / 10_000).div(
        q((100 + a) * (100 - b), 10_000),
      ),
    traps: [
      [
        "undo-only-the-fall",
        "conceptual",
        ([a = 0, , k = 0]) => whole(q((100 + a) * 4 * k, 1)),
      ],
      [
        "undo-only-the-rise",
        "conceptual",
        ([, b = 0, k = 0]) => whole(q((100 - b) * 4 * k, 1)),
      ],
      [
        "percentages-combined",
        "conceptual",
        ([a = 0, b = 0, k = 0]) =>
          a === b
            ? null
            : whole(q((100 + a) * (100 - b) * 4 * k * (100 - a + b), 10_000)),
      ],
    ],
    extra: ([a = 0, b = 0, k = 0]) => ({
      m: String(((100 + a) * (100 - b) * 4 * k) / 100),
    }),
    consts: [100],
  }),
  p7({
    id: "P7.successive.15",
    form: "a-fall-over-three-months-from-a-chart",
    groups: [8, 8],
    kind: "integer",
    draw: (r) => {
      const a = pick(r, [100, 200, 400, 500]);
      const rise = pick(r, [10, 20, 25, 50]);
      const fall = pick(r, [20, 25, 40, 50, 60]);
      const b = (a * (100 + rise)) / 100;
      return [a, b, (b * (100 - fall)) / 100];
    },
    valid: ([a = 0, b = 0, c = 0]) => {
      const x = (100 * (a - c)) / a;
      return (
        Number.isInteger(b) &&
        Number.isInteger(c) &&
        c < a &&
        Number.isInteger(x) &&
        ![a, b, c].includes(x)
      );
    },
    solve: ([a = 0, , c = 0]) => q((100 * (a - c)) / a),
    ref: ([a = 0, , c = 0]) => q(a - c, a).mul(q(100)),
    traps: [
      [
        "the-last-fall-only",
        "conceptual",
        ([, b = 0, c = 0]) => whole(q(100 * (b - c), b)),
      ],
      ["the-difference-itself", "conceptual", ([a = 0, , c = 0]) => q(a - c)],
      [
        "compared-with-the-middle",
        "conceptual",
        ([a = 0, b = 0, c = 0]) => whole(q(100 * (a - c), b)),
      ],
    ],
    consts: [100],
  }),
];

export const pSpecs3: readonly Spec<never>[] = [
  ...mapScale,
  ...mapScaleMore,
  ...mapScaleS,
  ...mapScaleSMore,
  ...offers,
  ...offersMore,
  ...relative,
  ...relativeMore,
  ...successive,
  ...successiveMore,
];
