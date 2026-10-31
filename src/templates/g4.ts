// Domain G, part 4: compass points, routes and scale (RES-4285). The Dutch goals name the compass points at group 6 and
// the legend, scale line and grid at 1S. Texts are plain blanks in `content/tasks-g.ru.json`. Generated from one table
// with the strings.
import { signed } from "./draw.js";
import { calc, of, rg } from "./kitc.js";
import { q } from "./kitf.js";
import { type Spec } from "./spec.js";

/**
 * The option number of the direction after `k` quarter turns clockwise from north, in the lists that run
 * east, west, south, north.
 */
const dir = (k: number): string => String([4, 1, 3, 2][((k % 4) + 4) % 4] ?? 4);

/** The ends of the segments of a spiral that starts north and always turns left, with the segment lengths 1, 2, 3, ... */
function spiral(n: number): readonly (readonly [number, number])[] {
  const heading: readonly (readonly [number, number])[] = [
    [0, 1],
    [-1, 0],
    [0, -1],
    [1, 0],
  ];
  const out: [number, number][] = [];
  let x = 0;
  let y = 0;
  for (let i = 1; i <= n; i += 1) {
    const [dx = 0, dy = 0] = heading[(i - 1) % 4] ?? [];
    x += dx * i;
    y += dy * i;
    out.push([x, y]);
  }
  return out;
}

/** The option number of the heading `deg` degrees clockwise from north, in the lists that run east, west, south, north. */
const BY_DEGREES: Readonly<Record<number, string>> = {
  0: "4",
  90: "1",
  180: "3",
  270: "2",
};
/** The same in the lists that run north, east, south, west. */
const BY_DEGREES_FROM_NORTH: Readonly<Record<number, string>> = {
  0: "1",
  90: "2",
  180: "3",
  270: "4",
};
const mod360 = (deg: number): number => ((deg % 360) + 360) % 360;
/** Where the turns of a walker end up, step by step: one quarter turn to the right is +1, to the left is +3. */
const walkTurns = (rights: number, lefts: number): number => {
  let place = 0;
  for (let i = 0; i < rights; i += 1) place = (place + 1) % 4;
  for (let i = 0; i < lefts; i += 1) place = (place + 3) % 4;
  return place;
};
/** The distance from the start after `n` segments of the left-turning spiral, found by whole turns of four segments. */
const spiralByCycles = (n: number): number => {
  const cycles = Math.floor(n / 4);
  let x = 2 * cycles;
  let y = -2 * cycles;
  for (let j = 1; j <= n % 4; j += 1) {
    const len = 4 * cycles + j;
    if (j === 1) y += len;
    else if (j === 2) x -= len;
    else y -= len;
  }
  return Math.abs(x) + Math.abs(y);
};

const G7_plan = calc("G7", "plan");
const G7_plan_specs: readonly Spec<never>[] = [
  G7_plan({
    id: "G7.plan.01",
    form: "the-turn-to-the-right-from-north",
    g: [6, 7],
    kind: "choice",
    p: [rg(1, 7), rg(0, 19)],
    ok: (a) => a % 4 !== 0,
    f: (a) => dir(a),
    // In degrees: each quarter turn is 90 degrees.
    alt: (a) => BY_DEGREES[mod360(90 * a)] ?? "4",
    t: {
      "the-other-way": (a) => dir(-a),
      "one-quarter-fewer": (a) => dir(a - 1),
      "one-quarter-more": (a) => dir(a + 1),
    },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
    roles: { a: "count of quarter turns" },
  }),
  G7_plan({
    id: "G7.plan.02",
    form: "the-turn-to-the-left-from-north",
    g: [6, 7],
    kind: "choice",
    p: [rg(1, 7), rg(0, 19)],
    ok: (a) => a % 4 !== 0,
    f: (a) => dir(-a),
    alt: (a) => BY_DEGREES[mod360(-90 * a)] ?? "4",
    t: {
      "the-other-way": (a) => dir(a),
      "one-quarter-fewer": (a) => dir(-(a - 1)),
      "one-quarter-more": (a) => dir(-(a + 1)),
    },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
    roles: { a: "count of quarter turns" },
  }),
  G7_plan({
    id: "G7.plan.03",
    form: "the-opposite-of-east",
    g: [6, 7],
    kind: "choice",
    p: [rg(0, 19)],
    f: () => "3",
    t: { north: () => "1", south: () => "2", "north-west": () => "4" },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
  }),
  G7_plan({
    id: "G7.plan.04",
    form: "the-direction-between-north-and-east",
    g: [6, 8],
    kind: "choice",
    p: [rg(0, 19)],
    f: () => "4",
    t: {
      "south-west": () => "1",
      "south-east": () => "2",
      "north-west": () => "3",
    },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
  }),
  G7_plan({
    id: "G7.plan.05",
    form: "the-city-seen-from-the-other-side",
    g: [7, 8],
    kind: "choice",
    p: [rg(0, 19)],
    f: () => "1",
    t: {
      "same-direction": () => "2",
      "north-east": () => "3",
      "south-west": () => "4",
    },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
  }),
  G7_plan({
    id: "G7.plan.06",
    form: "the-turn-after-quarter-turns",
    g: [6, 7],
    kind: "choice",
    p: [rg(1, 6), rg(1, 6)],
    ok: (a, b) => (a + b) % 4 !== 0 && a !== b,
    f: (a, b) => String(((a + b) % 4) + 1),
    alt: (a, b) => BY_DEGREES_FROM_NORTH[mod360(90 * (a + b))] ?? "1",
    t: {
      "no-turn": () => "1",
      "first-turn-only": (a) => String((a % 4) + 1),
      "turned-back": (a, b) => String(((((a - b) % 4) + 4) % 4) + 1),
    },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
  }),
  G7_plan({
    id: "G7.plan.07",
    form: "the-walk-there-and-back",
    g: [6, 8],
    kind: "integer",
    p: [rg(2, 9), rg(2, 9)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(2 * (a + b)),
    // Leg by leg: north, east, then west and south.
    alt: (a, b) => q(a + b + b + a),
    t: {
      "one-way": (a, b) => q(a + b),
      "straight-line": (a, b) => q(Math.max(a, b)),
      "one-leg-doubled": (a, b) => q(2 * a + b),
    },
    c: [2],
  }),
  G7_plan({
    id: "G7.plan.08",
    form: "the-distance-north-of-the-start",
    g: [6, 8],
    kind: "integer",
    p: [rg(6, 12), rg(2, 5)],
    f: (a, b) => q(a - b),
    // Check by adding: how many clearly remain after b steps back to reach a.
    alt: (a, b) =>
      q(
        Array.from({ length: a + 1 }, (_, i) => i).find((x) => b + x === a) ??
          0,
      ),
    t: {
      "total-path": (a, b) => q(a + b),
      "south-only": (a, b) => q(b),
      "north-only": (a) => q(a),
    },
  }),
  G7_plan({
    id: "G7.plan.09",
    form: "the-closed-route",
    g: [6, 8],
    kind: "integer",
    p: [rg(2, 9), rg(2, 9)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(2 * a + b),
    // The whole rectangle a by b, less the side that was not walked.
    alt: (a, b) => q(2 * (a + b) - b),
    t: {
      "two-legs": (a, b) => q(a + b),
      "straight-line": (a, b) => q(b),
      "there-and-back": (a, b) => q(2 * (a + b)),
    },
    c: [2],
  }),
  G7_plan({
    id: "G7.plan.10",
    form: "the-steps-to-the-corner",
    g: [6, 8],
    kind: "integer",
    p: [rg(2, 9), rg(2, 9)],
    ok: (a, b) => a !== b && a + b !== a * b,
    f: (a, b) => q(a + b),
    // A staircase: pairs of steps along the shorter side, then the straight rest.
    alt: (a, b) => q(2 * Math.min(a, b) + Math.abs(a - b)),
    t: {
      "longer-side": (a, b) => q(Math.max(a, b)),
      product: (a, b) => q(a * b),
      difference: (a, b) => q(Math.abs(a - b)),
    },
    c: [2],
  }),
  G7_plan({
    id: "G7.plan.11",
    form: "the-direction-after-turns-to-both-sides",
    g: [6, 7],
    kind: "choice",
    p: [rg(1, 6), rg(1, 6), rg(0, 19)],
    ok: (a, b) => a !== b,
    f: (a, b) => String(((((a - b) % 4) + 4) % 4) + 1),
    // Step by step round the circle.
    alt: (a, b) => String(walkTurns(a, b) + 1),
    t: {
      "left-as-right": (a, b) => String(((a + b) % 4) + 1),
      "only-the-first": (a) => String((a % 4) + 1),
      "sides-swapped": (a, b) => String(((((b - a) % 4) + 4) % 4) + 1),
    },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
    roles: { a: "quarter turns to the right", b: "quarter turns to the left" },
  }),
  G7_plan({
    id: "G7.plan.12",
    form: "the-direction-after-a-turn-in-degrees",
    g: [7, 8],
    kind: "choice",
    p: [of(45, 135, 225, 315, 405, 495, 585, 675)],
    f: (a) => String(((a % 360) - 45) / 90 + 1),
    // Look the heading up among the four: 45, 135, 225, 315.
    alt: (a) => String([45, 135, 225, 315].indexOf(a % 360) + 1),
    t: {
      anticlockwise: (a) => String(5 - (((a % 360) - 45) / 90 + 1)),
      "the-opposite": (a) => String(((((a % 360) - 45) / 90 + 2) % 4) + 1),
    },
    options: () => ["1", "2", "3", "4"],
    c: [0, 1, 2, 3, 4, 45, 90, 180, 270, 360],
    roles: { a: "turn in degrees" },
  }),
  G7_plan({
    id: "G7.plan.13",
    form: "the-snail-that-turns-left-at-every-step",
    g: [6, 8],
    kind: "integer",
    p: [rg(4, 10)],
    f: (a) => {
      const [fx = 0, fy = 0] = spiral(a)[a - 1] ?? [];
      return q(Math.abs(fx) + Math.abs(fy));
    },
    // Whole turns of four segments move the snail by 2 east and 2 south each time.
    alt: (a) => q(spiralByCycles(a)),
    t: {
      "walked-length": (a) => q((a * (a + 1)) / 2),
      "last-leg": (a) => q(a),
      "horizontal-shift": (a) => q(Math.abs(spiral(a)[a - 1]?.[0] ?? 0)),
    },
    x: (a) => {
      const [fx = 0, fy = 0] = spiral(a)[a - 1] ?? [];
      return {
        n: String(a),
        trail: spiral(a)
          .map(([x, y]) => `(${signed(x)}; ${signed(y)})`)
          .join(", "),
        fx: signed(fx),
        fy: signed(fy),
        ax: String(Math.abs(fx)),
        ay: String(Math.abs(fy)),
      };
    },
    c: [0, 1, 2, 3],
    roles: { a: "count of segments" },
    origin: {
      olympiad:
        "a path whose segments grow by one and turn left each time: the end is found by coordinates (RES-4285, MCCME route items)",
    },
  }),
];

const G7_plan_1S = calc("G7", "plan-1S");
const G7_plan_1S_specs: readonly Spec<never>[] = [
  G7_plan_1S({
    id: "G7.plan-1S.01",
    form: "the-distance-by-the-scale",
    g: [8, 8],
    kind: "integer",
    p: [rg(2, 9), rg(3, 12)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a * b),
    // Centimetre by centimetre.
    alt: (a, b) =>
      q(
        Array<number>(b)
          .fill(a)
          .reduce((s, x) => s + x, 0),
      ),
    t: {
      sum: (a, b) => q(a + b),
      "map-distance": (a, b) => q(b),
      divided: (a, b) => (b % a === 0 ? q(b / a) : null),
    },
    c: [1],
  }),
  G7_plan_1S({
    id: "G7.plan-1S.02",
    form: "the-map-distance-from-the-real-distance",
    g: [8, 8],
    kind: "integer",
    p: [rg(2, 9), rg(3, 12)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(b),
    // Search: how many centimetres of a kilometres each give the real distance.
    alt: (a, b) =>
      q(
        Array.from({ length: 13 }, (_, i) => i).find((m) => a * m === a * b) ??
          0,
      ),
    t: {
      product: (a, b) => q(a * a * b),
      "distance-itself": (a, b) => q(a * b),
      "scale-number": (a) => q(a),
    },
    x: (a, b) => ({ x: String(a * b) }),
    c: [1],
  }),
  G7_plan_1S({
    id: "G7.plan-1S.03",
    form: "the-perimeter-of-a-plot-from-a-plan",
    g: [8, 8],
    kind: "integer",
    p: [rg(2, 9), rg(2, 6), rg(2, 6)],
    ok: (a, b, c) => b !== c,
    f: (a, b, c) => q(2 * (b + c) * a),
    // The four sides on the ground one by one.
    alt: (a, b, c) => q(a * b + a * c + a * b + a * c),
    t: {
      "on-the-plan": (a, b, c) => q(2 * (b + c)),
      "area-style": (a, b, c) => q(b * c * a),
      "half-perimeter": (a, b, c) => q((b + c) * a),
    },
    c: [1, 2],
  }),
  G7_plan_1S({
    id: "G7.plan-1S.04",
    form: "the-houses-by-the-legend",
    g: [8, 8],
    kind: "integer",
    p: [rg(2, 9), rg(3, 12)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a * b),
    // Icon by icon.
    alt: (a, b) =>
      q(
        Array<number>(b)
          .fill(a)
          .reduce((s, x) => s + x, 0),
      ),
    t: {
      "icons-only": (a, b) => q(b),
      sum: (a, b) => q(a + b),
      divided: (a, b) => (b % a === 0 ? q(b / a) : null),
    },
  }),
  G7_plan_1S({
    id: "G7.plan-1S.05",
    form: "the-route-on-a-plan-with-a-scale",
    g: [8, 8],
    kind: "integer",
    p: [rg(2, 6), rg(2, 6), rg(2, 6), rg(2, 5)],
    ok: (a, b, c, d) => a + b + c !== d,
    f: (a, b, c, d) => q((a + b + c) * d),
    // Leg by leg.
    alt: (a, b, c, d) => q(a * d + b * d + c * d),
    t: {
      "cells-only": (a, b, c) => q(a + b + c),
      "last-leg": (a, b, c, d) => q(c * d),
      "all-added": (a, b, c, d) => q(a + b + c + d),
    },
  }),
  G7_plan_1S({
    id: "G7.plan-1S.06",
    form: "the-travel-time-by-the-map",
    g: [8, 8],
    kind: "integer",
    p: [of(10, 20, 25, 50), rg(2, 9), of(20, 25, 30, 40, 50, 60)],
    ok: (a, b, c) =>
      (a * b) % c === 0 &&
      (a * b) / c >= 2 &&
      (a * b) / c <= 12 &&
      a !== c &&
      (a * b) / c !== b,
    f: (a, b, c) => q((a * b) / c),
    // Search: how many hours of c kilometres add up to the distance.
    alt: (a, b, c) =>
      q(
        Array.from({ length: 40 }, (_, i) => i).find((h) => h * c === a * b) ??
          0,
      ),
    t: {
      distance: (a, b) => q(a * b),
      "map-distance": (a, b) => q(b),
      "distance-times-speed": (a, b, c) => q(a * b * c),
    },
    c: [1],
  }),
  G7_plan_1S({
    id: "G7.plan-1S.07",
    form: "the-area-of-a-plot-from-a-plan",
    g: [8, 8],
    kind: "integer",
    p: [rg(2, 9), rg(2, 6), rg(2, 6)],
    ok: (a, b, c) => b !== c,
    f: (a, b, c) => q(a * b * (a * c)),
    // Square by square: every square centimetre of the plan is a times a square metres.
    alt: (a, b, c) =>
      q(
        Array<number>(b * c)
          .fill(a * a)
          .reduce((s, x) => s + x, 0),
      ),
    t: {
      "on-the-plan": (a, b, c) => q(b * c),
      "area-times-scale": (a, b, c) => q(a * b * c),
      "ground-perimeter": (a, b, c) => q(2 * a * (b + c)),
    },
    c: [1],
  }),
  G7_plan_1S({
    id: "G7.plan-1S.08",
    form: "the-cells-per-square-metre",
    g: [8, 8],
    kind: "integer",
    p: [rg(2, 9), rg(3, 12)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a * b),
    // Cell by cell.
    alt: (a, b) =>
      q(
        Array<number>(b)
          .fill(a)
          .reduce((s, x) => s + x, 0),
      ),
    t: {
      "cells-only": (a, b) => q(b),
      sum: (a, b) => q(a + b),
      divided: (a, b) => (b % a === 0 ? q(b / a) : null),
    },
  }),
  G7_plan_1S({
    id: "G7.plan-1S.09",
    form: "the-kilometres-of-a-grid-route",
    g: [8, 8],
    kind: "integer",
    p: [rg(1, 4), rg(1, 4), rg(5, 9), rg(5, 9)],
    ok: (a, b, c, d) => c - a !== d - b,
    f: (a, b, c, d) => q(c - a + (d - b)),
    // The sums of the coordinates: the way is the difference of x plus y at the end and at the start.
    alt: (a, b, c, d) => q(c + d - (a + b)),
    t: {
      "end-coordinates": (a, b, c, d) => q(c + d),
      "longer-side": (a, b, c, d) => q(Math.max(c - a, d - b)),
      "horizontal-only": (a, b, c) => q(c - a),
    },
    c: [1],
  }),
  G7_plan_1S({
    id: "G7.plan-1S.10",
    form: "the-scale-of-a-reduced-map",
    g: [8, 8],
    kind: "integer",
    p: [rg(2, 9), rg(2, 9)],
    ok: (a, b) => a !== b,
    f: (a) => q(a),
    // Search: how many kilometres in one centimetre give the real length.
    alt: (a, b) =>
      q(
        Array.from({ length: 10 }, (_, i) => i).find((k) => k * b === a * b) ??
          0,
      ),
    t: {
      multiplied: (a, b) => q(a * b * b),
      "distance-itself": (a, b) => q(a * b),
      "map-length": (a, b) => q(b),
    },
    x: (a, b) => ({ x: String(a * b) }),
  }),
  G7_plan_1S({
    id: "G7.plan-1S.11",
    form: "the-ground-distance-from-a-ratio-scale",
    g: [8, 8],
    kind: "integer",
    p: [of(200, 500, 1000, 2000, 5000), rg(2, 9)],
    f: (a, b) => q((a * b) / 100),
    // Metres in one centimetre of the plan first, then the whole segment.
    alt: (a, b) => q((a / 100) * b),
    t: {
      "centimetres-not-converted": (a, b) => q(a * b),
      "ten-instead-of-hundred": (a, b) => q((a * b) / 10),
    },
    c: [1, 10, 100],
  }),
  G7_plan_1S({
    id: "G7.plan-1S.12",
    form: "the-distance-on-a-map-of-another-scale",
    g: [8, 8],
    kind: "integer",
    p: [of(5, 10, 20), rg(2, 5), rg(2, 9)],
    f: (a, b, c) => q(b * c),
    alt: (a, b, c) => q((a * b * c) / a),
    t: {
      "same-centimetres": (a, b, c) => q(c),
      kilometres: (a, b, c) => q(a * b * c),
      inverted: (a, b, c) => (c % b === 0 ? q(c / b) : null),
    },
    x: (a, b) => ({ p: String(a * b) }),
    c: [1],
    roles: {
      a: "kilometres in a centimetre of the second map",
      b: "ratio of the two scales",
      c: "centimetres on the first map",
    },
  }),
  G7_plan_1S({
    id: "G7.plan-1S.13",
    form: "the-meeting-time-from-a-map",
    g: [8, 8],
    kind: "integer",
    p: [of(10, 20, 25, 50), rg(2, 9), rg(5, 25), rg(5, 25)],
    ok: (a, b, c, d) =>
      c !== d && (a * b) % (c + d) === 0 && (a * b) / (c + d) >= 2,
    f: (a, b, c, d) => q((a * b) / (c + d)),
    // Search: after how many hours the two distances covered add up to the whole way.
    alt: (a, b, c, d) =>
      q(
        Array.from({ length: 60 }, (_, i) => i).find(
          (h) => h * c + h * d === a * b,
        ) ?? 0,
      ),
    t: {
      "one-speed": (a, b, c) => ((a * b) % c === 0 ? q((a * b) / c) : null),
      "speeds-subtracted": (a, b, c, d) =>
        (a * b) % Math.abs(c - d) === 0 ? q((a * b) / Math.abs(c - d)) : null,
      distance: (a, b) => q(a * b),
    },
    c: [1],
    roles: {
      a: "kilometres in a centimetre of the map",
      b: "centimetres between the cities",
      c: "speed of the first cyclist",
      d: "speed of the second cyclist",
    },
    origin: {
      olympiad:
        "two travellers moving towards each other: their speeds add up (RES-4285, Kangoeroe movement items)",
    },
  }),
];

export const gSpecs4: readonly Spec<never>[] = [
  ...G7_plan_specs,
  ...G7_plan_1S_specs,
];
