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

const G7_plan = calc("G7", "plan");
const G7_plan_specs: readonly Spec<never>[] = [
  G7_plan({
    id: "G7.plan.01",
    form: "the-turn-to-the-right-from-north",
    g: [6, 7],
    kind: "choice",
    p: [rg(1, 3), rg(0, 19)],
    f: (a) => dir(a),
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
    p: [rg(1, 3), rg(0, 19)],
    f: (a) => dir(-a),
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
    p: [rg(1, 3), rg(1, 3)],
    ok: (a, b) => (a + b) % 4 !== 0,
    f: (a, b) => String(((a + b) % 4) + 1),
    t: { "no-turn": () => "1", "first-turn-only": (a) => String(a + 1) },
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
    t: {
      "one-way": (a, b) => q(a + b),
      "straight-line": (a, b) => q(Math.max(a, b)),
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
    t: { "total-path": (a, b) => q(a + b), "south-only": (a, b) => q(b) },
  }),
  G7_plan({
    id: "G7.plan.09",
    form: "the-closed-route",
    g: [6, 8],
    kind: "integer",
    p: [rg(2, 9), rg(2, 9)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(2 * a + b),
    t: { "two-legs": (a, b) => q(a + b), "straight-line": (a, b) => q(b) },
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
    t: {
      "longer-side": (a, b) => q(Math.max(a, b)),
      product: (a, b) => q(a * b),
    },
  }),
  G7_plan({
    id: "G7.plan.11",
    form: "the-direction-after-turns-to-both-sides",
    g: [6, 7],
    kind: "choice",
    p: [rg(1, 3), rg(1, 3), rg(0, 19)],
    ok: (a, b) => a !== b,
    f: (a, b) => String(((((a - b) % 4) + 4) % 4) + 1),
    t: {
      "left-as-right": (a, b) => String(((a + b) % 4) + 1),
      "only-the-first": (a) => String((a % 4) + 1),
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
    p: [of(45, 135, 225, 315)],
    f: (a) => String((a - 45) / 90 + 1),
    t: {
      anticlockwise: (a) => String(5 - ((a - 45) / 90 + 1)),
      "the-opposite": (a) => String((((a - 45) / 90 + 2) % 4) + 1),
    },
    options: () => ["1", "2", "3", "4"],
    c: [0, 1, 2, 3, 4, 45, 90, 180, 270],
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
    t: {
      product: (a, b) => q(a * a * b),
      "distance-itself": (a, b) => q(a * b),
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
    t: {
      "on-the-plan": (a, b, c) => q(2 * (b + c)),
      "area-style": (a, b, c) => q(b * c * a),
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
    t: { "icons-only": (a, b) => q(b), sum: (a, b) => q(a + b) },
  }),
  G7_plan_1S({
    id: "G7.plan-1S.05",
    form: "the-route-on-a-plan-with-a-scale",
    g: [8, 8],
    kind: "integer",
    p: [rg(2, 6), rg(2, 6), rg(2, 6), rg(2, 5)],
    ok: (a, b, c, d) => a + b + c !== d,
    f: (a, b, c, d) => q((a + b + c) * d),
    t: {
      "cells-only": (a, b, c) => q(a + b + c),
      "last-leg": (a, b, c, d) => q(c * d),
    },
  }),
  G7_plan_1S({
    id: "G7.plan-1S.06",
    form: "the-travel-time-by-the-map",
    g: [8, 8],
    kind: "integer",
    p: [rg(2, 5), rg(2, 6), rg(2, 4)],
    ok: (a, b, c) =>
      (a * b) % c === 0 && a * b !== c && a * b !== b && b !== (a * b) / c,
    f: (a, b, c) => q((a * b) / c),
    t: { distance: (a, b) => q(a * b), "map-distance": (a, b) => q(b) },
    c: [1],
  }),
  G7_plan_1S({
    id: "G7.plan-1S.07",
    form: "the-area-of-a-plot-from-a-plan",
    g: [8, 8],
    kind: "integer",
    p: [rg(2, 9)],
    ok: (a) => a !== 1,
    f: (a) => q(a * a * 12),
    t: { "on-the-plan": () => q(12), "area-times-scale": (a) => q(12 * a) },
    c: [1, 3, 4, 12],
  }),
  G7_plan_1S({
    id: "G7.plan-1S.08",
    form: "the-cells-per-square-metre",
    g: [8, 8],
    kind: "integer",
    p: [rg(2, 9), rg(3, 12)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a * b),
    t: { "cells-only": (a, b) => q(b), sum: (a, b) => q(a + b) },
  }),
  G7_plan_1S({
    id: "G7.plan-1S.09",
    form: "the-kilometres-of-a-grid-route",
    g: [8, 8],
    kind: "integer",
    p: [rg(1, 4), rg(1, 4), rg(5, 9), rg(5, 9)],
    ok: (a, b, c, d) => c - a !== d - b,
    f: (a, b, c, d) => q(c - a + (d - b)),
    t: {
      "end-coordinates": (a, b, c, d) => q(c + d),
      "longer-side": (a, b, c, d) => q(Math.max(c - a, d - b)),
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
    t: {
      multiplied: (a, b) => q(a * b * b),
      "distance-itself": (a, b) => q(a * b),
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
    t: {
      "one-speed": (a, b, c) => ((a * b) % c === 0 ? q((a * b) / c) : null),
      "speeds-subtracted": (a, b, c, d) =>
        (a * b) % Math.abs(c - d) === 0 ? q((a * b) / Math.abs(c - d)) : null,
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
