// Domain M, part 5: the circle, estimates, instruments and average speed (RES-4286). The Dutch goals name benchmarks at
// groups 6 and 7 and read instruments from group 5; the circle and average speed with work problems are Russian
// extensions at stretch. Texts are plain blanks in `content/tasks-m.ru.json`. Generated from one table with the strings.
import { calc, of, rg } from "./kitc.js";
import { q, qd } from "./kitf.js";
import type { Q } from "../math/q.js";
import { type Spec } from "./spec.js";

/** A whole positive wrong answer, or null when it repeats a value in `no`. */
const w = (v: number, ...no: number[]): Q | null =>
  Number.isInteger(v) && v > 0 && !no.includes(v) ? q(v) : null;
/** The fewest weighings that find the lighter coin among `n` when each weighing splits the coins into `parts` piles. */
const weighings = (n: number, parts: number): number => {
  let k = 0;
  for (let reach = 1; reach < n; reach *= parts) k += 1;
  return k;
};

const M11_circle = calc("M11", "circle");
const M11_circle_specs: readonly Spec<never>[] = [
  M11_circle({
    id: "M11.circle.01",
    form: "the-diameter-from-the-radius",
    g: [8, 8],
    kind: "integer",
    p: [rg(3, 19)],
    f: (a) => q(2 * a),
    t: {
      "radius-itself": (a) => q(a),
      halved: (a) => (a % 2 === 0 ? q(a / 2) : null),
      "added-two": (a) => q(a + 2),
    },
    c: [2],
    origin: { extension: "the circle, Russian grade 6 (RES-4286)" },
  }),
  M11_circle({
    id: "M11.circle.02",
    form: "the-radius-from-the-diameter",
    g: [8, 8],
    kind: "integer",
    p: [rg(3, 19)],
    f: (a) => q(a),
    t: { "diameter-itself": (a) => q(2 * a), doubled: (a) => q(4 * a) },
    x: (a) => ({ x: String(2 * a) }),
    c: [2],
    origin: { extension: "the circle, Russian grade 6 (RES-4286)" },
  }),
  M11_circle({
    id: "M11.circle.03",
    form: "the-circumference-from-the-diameter",
    g: [8, 8],
    kind: "integer",
    p: [rg(2, 15)],
    f: (a) => q(3 * a),
    t: {
      added: (a) => q(a + 3),
      "area-formula": (a) => (a === 2 ? null : q(3 * a * a)),
      "radius-formula": (a) => q(6 * a),
    },
    c: [3],
    origin: { extension: "the circle, Russian grade 6 (RES-4286)" },
  }),
  M11_circle({
    id: "M11.circle.04",
    form: "the-circumference-from-the-radius",
    g: [8, 8],
    kind: "integer",
    p: [rg(2, 15)],
    f: (a) => q(6 * a),
    t: {
      "diameter-times-one": (a) => q(2 * a),
      "pi-times-radius": (a) => q(3 * a),
      "area-formula": (a) => (a === 2 ? null : q(3 * a * a)),
    },
    c: [2, 3, 6],
    origin: { extension: "the circle, Russian grade 6 (RES-4286)" },
  }),
  M11_circle({
    id: "M11.circle.05",
    form: "the-area-from-the-radius",
    g: [8, 8],
    kind: "integer",
    p: [rg(2, 9)],
    f: (a) => q(3 * a * a),
    t: {
      "diameter-squared": (a) => q(12 * a * a),
      "circumference-formula": (a) => q(6 * a),
      "pi-forgotten": (a) => (a === 6 ? null : q(a * a)),
    },
    c: [3, 4],
    origin: { extension: "the circle, Russian grade 6 (RES-4286)" },
  }),
  M11_circle({
    id: "M11.circle.06",
    form: "the-area-from-the-diameter",
    g: [8, 8],
    kind: "integer",
    p: [rg(2, 9)],
    f: (a) => q(3 * a * a),
    t: {
      "diameter-used": (a) => q(12 * a * a),
      "circumference-formula": (a) => q(6 * a),
      "radius-not-squared": (a) => q(3 * a),
    },
    x: (a) => ({ x: String(2 * a) }),
    c: [2, 3, 4],
    origin: { extension: "the circle, Russian grade 6 (RES-4286)" },
  }),
  M11_circle({
    id: "M11.circle.07",
    form: "the-radius-from-the-circumference",
    g: [8, 8],
    kind: "integer",
    p: [rg(2, 15)],
    f: (a) => q(a),
    t: {
      diameter: (a) => q(2 * a),
      "circumference-itself": (a) => q(6 * a),
      "halved-circumference": (a) => q(3 * a),
    },
    x: (a) => ({ x: String(6 * a) }),
    c: [2, 3, 6],
    origin: { extension: "the circle, Russian grade 6 (RES-4286)" },
  }),
  M11_circle({
    id: "M11.circle.08",
    form: "the-diameter-from-the-circumference",
    g: [8, 8],
    kind: "integer",
    p: [rg(2, 15)],
    f: (a) => q(a),
    t: {
      "circumference-itself": (a) => q(3 * a),
      "pi-multiplied": (a) => q(9 * a),
      "divided-by-two": (a) => (a % 2 === 0 ? q((3 * a) / 2) : null),
    },
    x: (a) => ({ x: String(3 * a) }),
    c: [3],
    origin: { extension: "the circle, Russian grade 6 (RES-4286)" },
  }),
  M11_circle({
    id: "M11.circle.09",
    form: "the-length-of-a-semicircle-arc",
    g: [8, 8],
    kind: "integer",
    p: [rg(2, 9)],
    f: (a) => q(3 * a),
    t: {
      "whole-circle": (a) => q(6 * a),
      "with-diameter": (a) => q(5 * a),
      "radius-as-diameter": (a) => (a % 2 === 0 ? q((3 * a) / 2) : null),
    },
    c: [2, 3, 6],
    origin: { extension: "the circle, Russian grade 6 (RES-4286)" },
  }),
  M11_circle({
    id: "M11.circle.10",
    form: "the-turns-of-a-wheel",
    g: [8, 8],
    kind: "integer",
    p: [rg(2, 6), rg(2, 9)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(3 * a * b),
    t: {
      "one-turn": (a) => q(3 * a),
      "radius-formula": (a, b) => q(6 * a * b),
      "pi-forgotten": (a, b) => (b === 3 ? null : q(a * b)),
    },
    c: [1, 3],
    origin: { extension: "the circle, Russian grade 6 (RES-4286)" },
  }),
  M11_circle({
    id: "M11.circle.11",
    form: "the-circumference-with-a-better-pi",
    g: [8, 8],
    kind: "decimal",
    p: [of(10, 20, 30, 40, 50)],
    ok: () => true,
    f: (a) => qd(314 * a, 2),
    t: {
      "pi-as-three": (a) => q(3 * a),
      "radius-formula": (a) => qd(628 * a, 2),
      "area-formula": (a) => qd(314 * a * a, 2),
    },
    c: [3, 3.14],
    origin: { extension: "the circle, Russian grade 6 (RES-4286)" },
  }),
  M11_circle({
    id: "M11.circle.12",
    form: "the-area-of-a-ring",
    g: [8, 8],
    kind: "integer",
    p: [rg(3, 9), rg(1, 2)],
    ok: (a, b) => a > b,
    f: (a, b) => q(3 * (a * a - b * b)),
    t: {
      "radii-subtracted": (a, b) =>
        a === 2 * b ? null : q(3 * (a - b) * (a - b)),
      "outer-circle-only": (a) => q(3 * a * a),
      "pi-forgotten": (a, b) => q(a * a - b * b),
    },
    c: [3],
    origin: { extension: "the circle, Russian grade 6 (RES-4286)" },
  }),
  M11_circle({
    id: "M11.circle.13",
    form: "the-perimeter-of-a-half-disc",
    g: [8, 8],
    kind: "integer",
    p: [rg(2, 9)],
    f: (a) => q(5 * a),
    t: {
      "arc-only": (a) => q(3 * a),
      "arc-and-radius": (a) => q(4 * a),
    },
    c: [2, 3],
    origin: { extension: "the circle, Russian grade 6 (RES-4286)" },
  }),
  M11_circle({
    id: "M11.circle.14",
    form: "the-area-of-a-half-disc",
    g: [8, 8],
    kind: "integer",
    p: [of(2, 4, 6, 8)],
    f: (a) => q((3 * a * a) / 2),
    t: {
      "whole-circle": (a) => q(3 * a * a),
      "arc-length": (a) => q(3 * a),
    },
    c: [2, 3],
    origin: { extension: "the circle, Russian grade 6 (RES-4286)" },
  }),
  M11_circle({
    id: "M11.circle.15",
    form: "a-square-around-a-circle-minus-the-circle",
    g: [8, 8],
    kind: "integer",
    p: [rg(2, 8)],
    f: (a) => q(a * a),
    t: {
      "circle-only": (a) => q(3 * a * a),
      "square-only": (a) => q(4 * a * a),
    },
    c: [2, 3],
    origin: {
      olympiad:
        "a circle inscribed in a square: the part left over is a fraction of the square, in the spirit of the figure items of the Kangaroo papers (RES-4286)",
    },
  }),
  M11_circle({
    id: "M11.circle.16",
    form: "a-rope-round-two-pipes",
    g: [8, 8],
    kind: "integer",
    p: [rg(2, 9)],
    f: (a) => q(10 * a),
    t: {
      "two-circumferences": (a) => q(12 * a),
      "arcs-only": (a) => q(6 * a),
    },
    c: [2, 3],
    origin: {
      olympiad:
        "a belt round two touching circles: the arcs make one circle and the straight parts are two diameters, a classic item in the spirit of the Kangaroo papers (RES-4286)",
    },
  }),
  M11_circle({
    id: "M11.circle.17",
    form: "the-circumference-from-the-radius-with-a-better-pi",
    g: [8, 8],
    kind: "decimal",
    p: [rg(2, 9)],
    f: (a) => qd(628 * a, 2),
    t: {
      "pi-times-radius": (a) => qd(314 * a, 2),
      "pi-as-three": (a) => q(6 * a),
      "area-formula": (a) => qd(314 * a * a, 2),
    },
    c: [2, 3.14],
    origin: { extension: "the circle, Russian grade 6 (RES-4286)" },
  }),
];

/** The 24 orders in which the four options of a benchmark task can stand: the item at each place. */
const ORDERS: readonly (readonly number[])[] = (function permute(
  items: readonly number[],
): number[][] {
  if (items.length <= 1) return [[...items]];
  return items.flatMap((item, i) =>
    permute([...items.slice(0, i), ...items.slice(i + 1)]).map((rest) => [
      item,
      ...rest,
    ]),
  );
})([0, 1, 2, 3]);
/** The place, from 1, of an option when the options stand in a given order. */
const place = (a: number, item: number): string =>
  String((ORDERS[a] ?? [0, 1, 2, 3]).indexOf(item) + 1);
/** The four options in a given order, then the right value and the three wrong ones for the texts. */
const values = (a: number, v: readonly string[]): Record<string, string> => {
  const order = ORDERS[a] ?? [0, 1, 2, 3];
  const at = (i: number): string => v[order[i] ?? 0] ?? "";
  return {
    o1: at(0),
    o2: at(1),
    o3: at(2),
    o4: at(3),
    g: v[0] ?? "",
    t1: v[1] ?? "",
    t2: v[2] ?? "",
    t3: v[3] ?? "",
  };
};

const M12_benchmark = calc("M12", "benchmark");
const M12_benchmark_specs: readonly Spec<never>[] = [
  M12_benchmark({
    id: "M12.benchmark.01",
    form: "the-height-of-a-ten-year-old-child",
    g: [6, 7],
    kind: "choice",
    p: [rg(0, 23)],
    f: (a) => place(a, 0),
    t: {
      "ten-times-too-small": (a) => place(a, 1),
      "ten-times-too-large": (a) => place(a, 2),
      "a-hundred-times-too-large": (a) => place(a, 3),
    },
    options: () => ["1", "2", "3", "4"],
    x: (a) => values(a, ["140", "14", "1400", "14000"]),
    c: [1, 2, 3, 4],
  }),
  M12_benchmark({
    id: "M12.benchmark.02",
    form: "the-mass-of-an-apple",
    g: [6, 7],
    kind: "choice",
    p: [rg(0, 23)],
    f: (a) => place(a, 0),
    t: {
      "ten-times-too-small": (a) => place(a, 1),
      "ten-times-too-large": (a) => place(a, 2),
      "a-hundred-times-too-large": (a) => place(a, 3),
    },
    options: () => ["1", "2", "3", "4"],
    x: (a) => values(a, ["150", "15", "1500", "15000"]),
    c: [1, 2, 3, 4],
  }),
  M12_benchmark({
    id: "M12.benchmark.03",
    form: "the-length-of-a-classroom",
    g: [6, 7],
    kind: "choice",
    p: [rg(0, 23)],
    f: (a) => place(a, 0),
    t: {
      "too-small-unit": (a) => place(a, 1),
      "ten-times-too-large": (a) => place(a, 2),
      "a-hundred-times-too-large": (a) => place(a, 3),
    },
    options: () => ["1", "2", "3", "4"],
    x: (a) => values(a, ["8", "0,8", "80", "800"]),
    c: [1, 2, 3, 4],
  }),
  M12_benchmark({
    id: "M12.benchmark.04",
    form: "the-volume-of-a-cup",
    g: [6, 7],
    kind: "choice",
    p: [rg(0, 23)],
    f: (a) => place(a, 0),
    t: {
      "a-hundred-times-too-small": (a) => place(a, 1),
      "ten-times-too-large": (a) => place(a, 2),
      "a-hundred-times-too-large": (a) => place(a, 3),
    },
    options: () => ["1", "2", "3", "4"],
    x: (a) => values(a, ["2", "0,02", "20", "200"]),
    c: [1, 2, 3, 4],
  }),
  M12_benchmark({
    id: "M12.benchmark.05",
    form: "the-time-of-a-breakfast",
    g: [6, 7],
    kind: "choice",
    p: [rg(0, 23)],
    f: (a) => place(a, 0),
    t: {
      "too-small-unit": (a) => place(a, 1),
      "ten-times-too-large": (a) => place(a, 2),
      "too-large-unit": (a) => place(a, 3),
    },
    options: () => ["1", "2", "3", "4"],
    x: (a) => values(a, ["15", "0,25", "150", "900"]),
    c: [1, 2, 3, 4],
  }),
  M12_benchmark({
    id: "M12.benchmark.06",
    form: "the-temperature-of-a-room",
    g: [6, 7],
    kind: "choice",
    p: [rg(0, 23)],
    f: (a) => place(a, 0),
    t: {
      "ten-times-too-small": (a) => place(a, 1),
      "ten-times-too-large": (a) => place(a, 2),
      "wrong-sign": (a) => place(a, 3),
    },
    options: () => ["1", "2", "3", "4"],
    x: (a) => values(a, ["20", "2", "200", "−20"]),
    c: [1, 2, 3, 4],
  }),
  M12_benchmark({
    id: "M12.benchmark.07",
    form: "the-price-of-a-loaf-of-bread",
    g: [6, 7],
    kind: "choice",
    p: [rg(0, 23)],
    f: (a) => place(a, 0),
    t: {
      "ten-times-too-small": (a) => place(a, 1),
      "ten-times-too-large": (a) => place(a, 2),
      "a-hundred-times-too-large": (a) => place(a, 3),
    },
    options: () => ["1", "2", "3", "4"],
    x: (a) => values(a, ["2", "0,2", "20", "200"]),
    c: [1, 2, 3, 4],
  }),
  M12_benchmark({
    id: "M12.benchmark.08",
    form: "the-estimated-speed-of-a-walker",
    g: [6, 7],
    kind: "choice",
    p: [rg(0, 23)],
    f: (a) => place(a, 0),
    t: {
      "ten-times-too-small": (a) => place(a, 1),
      "ten-times-too-large": (a) => place(a, 2),
      "a-hundred-times-too-large": (a) => place(a, 3),
    },
    options: () => ["1", "2", "3", "4"],
    x: (a) => values(a, ["5", "0,5", "50", "500"]),
    c: [1, 2, 3, 4],
  }),
  M12_benchmark({
    id: "M12.benchmark.09",
    form: "the-area-of-a-classroom",
    g: [6, 7],
    kind: "choice",
    p: [rg(0, 23)],
    f: (a) => place(a, 0),
    t: {
      "ten-times-too-small": (a) => place(a, 1),
      "ten-times-too-large": (a) => place(a, 2),
      "a-hundred-times-too-large": (a) => place(a, 3),
    },
    options: () => ["1", "2", "3", "4"],
    x: (a) => values(a, ["50", "5", "500", "5000"]),
    c: [1, 2, 3, 4],
  }),
  M12_benchmark({
    id: "M12.benchmark.10",
    form: "the-mass-of-a-car",
    g: [6, 7],
    kind: "choice",
    p: [rg(0, 23)],
    f: (a) => place(a, 0),
    t: {
      "ten-times-too-small": (a) => place(a, 1),
      "ten-times-too-large": (a) => place(a, 2),
      "a-hundred-times-too-small": (a) => place(a, 3),
    },
    options: () => ["1", "2", "3", "4"],
    x: (a) => values(a, ["1000", "100", "10000", "10"]),
    c: [1, 2, 3, 4],
  }),
  M12_benchmark({
    id: "M12.benchmark.11",
    form: "the-length-of-a-school-day",
    g: [6, 7],
    kind: "choice",
    p: [rg(0, 23)],
    f: (a) => place(a, 0),
    t: {
      "ten-times-too-small": (a) => place(a, 1),
      "ten-times-too-large": (a) => place(a, 2),
      "too-small-unit": (a) => place(a, 3),
    },
    options: () => ["1", "2", "3", "4"],
    x: (a) => values(a, ["6", "0,6", "60", "0,1"]),
    c: [1, 2, 3, 4],
  }),
  M12_benchmark({
    id: "M12.benchmark.12",
    form: "a-hectare-as-football-fields",
    g: [6, 7],
    kind: "choice",
    p: [rg(0, 23)],
    f: (a) => place(a, 0),
    t: {
      "ten-times-too-small": (a) => place(a, 1),
      "ten-times-too-large": (a) => place(a, 2),
      "a-hundred-times-too-large": (a) => place(a, 3),
    },
    options: () => ["1", "2", "3", "4"],
    x: (a) => values(a, ["2", "0,2", "20", "200"]),
    c: [1, 2, 3, 4],
  }),
  M12_benchmark({
    id: "M12.benchmark.13",
    form: "the-height-of-a-door",
    g: [6, 7],
    kind: "choice",
    p: [rg(0, 23)],
    f: (a) => place(a, 0),
    t: {
      "ten-times-too-small": (a) => place(a, 1),
      "ten-times-too-large": (a) => place(a, 2),
      "a-hundred-times-too-large": (a) => place(a, 3),
    },
    options: () => ["1", "2", "3", "4"],
    x: (a) => values(a, ["200", "20", "2000", "20000"]),
    c: [1, 2, 3, 4],
  }),
  M12_benchmark({
    id: "M12.benchmark.14",
    form: "the-length-of-a-childs-step",
    g: [6, 7],
    kind: "choice",
    p: [rg(0, 23)],
    f: (a) => place(a, 0),
    t: {
      "ten-times-too-small": (a) => place(a, 1),
      "ten-times-too-large": (a) => place(a, 2),
      "a-hundred-times-too-large": (a) => place(a, 3),
    },
    options: () => ["1", "2", "3", "4"],
    x: (a) => values(a, ["50", "5", "500", "5000"]),
    c: [1, 2, 3, 4],
  }),
  M12_benchmark({
    id: "M12.benchmark.15",
    form: "the-number-of-steps-in-a-hundred-metres",
    g: [6, 7],
    kind: "choice",
    p: [rg(0, 23)],
    f: (a) => place(a, 0),
    t: {
      "ten-times-too-small": (a) => place(a, 1),
      "ten-times-too-large": (a) => place(a, 2),
      "a-hundred-times-too-large": (a) => place(a, 3),
    },
    options: () => ["1", "2", "3", "4"],
    x: (a) => values(a, ["200", "20", "2000", "20000"]),
    c: [1, 2, 3, 4, 100],
  }),
  M12_benchmark({
    id: "M12.benchmark.16",
    form: "the-mass-of-a-school-bag",
    g: [6, 7],
    kind: "choice",
    p: [rg(0, 23)],
    f: (a) => place(a, 0),
    t: {
      "ten-times-too-small": (a) => place(a, 1),
      "ten-times-too-large": (a) => place(a, 2),
      "a-hundred-times-too-large": (a) => place(a, 3),
    },
    options: () => ["1", "2", "3", "4"],
    x: (a) => values(a, ["4", "0,4", "40", "400"]),
    c: [1, 2, 3, 4],
  }),
];

const M12_benchmark_1S = calc("M12", "benchmark-1S");
const M12_benchmark_1S_specs: readonly Spec<never>[] = [
  M12_benchmark_1S({
    id: "M12.benchmark-1S.01",
    form: "the-water-in-a-bath",
    g: [7, 8],
    kind: "choice",
    p: [rg(0, 23)],
    f: (a) => place(a, 0),
    t: {
      "ten-times-too-small": (a) => place(a, 1),
      "ten-times-too-large": (a) => place(a, 2),
      "too-small-unit": (a) => place(a, 3),
    },
    options: () => ["1", "2", "3", "4"],
    x: (a) => values(a, ["150", "15", "1500", "0,015"]),
    c: [1, 2, 3, 4],
  }),
  M12_benchmark_1S({
    id: "M12.benchmark-1S.02",
    form: "the-mass-of-a-newborn",
    g: [7, 8],
    kind: "choice",
    p: [rg(0, 23)],
    f: (a) => place(a, 0),
    t: {
      "ten-times-too-small": (a) => place(a, 1),
      "ten-times-too-large": (a) => place(a, 2),
      "a-hundred-times-too-large": (a) => place(a, 3),
    },
    options: () => ["1", "2", "3", "4"],
    x: (a) => values(a, ["3,5", "0,35", "35", "350"]),
    c: [1, 2, 3, 4],
  }),
  M12_benchmark_1S({
    id: "M12.benchmark-1S.03",
    form: "the-distance-between-two-cities",
    g: [7, 8],
    kind: "choice",
    p: [rg(0, 23)],
    f: (a) => place(a, 0),
    t: {
      "ten-times-too-small": (a) => place(a, 1),
      "ten-times-too-large": (a) => place(a, 2),
      "too-small-unit": (a) => place(a, 3),
    },
    options: () => ["1", "2", "3", "4"],
    x: (a) => values(a, ["150", "15", "1500", "0,15"]),
    c: [1, 2, 3, 4],
  }),
  M12_benchmark_1S({
    id: "M12.benchmark-1S.04",
    form: "the-mass-of-an-elephant",
    g: [7, 8],
    kind: "choice",
    p: [rg(0, 23)],
    f: (a) => place(a, 0),
    t: {
      "ten-times-too-small": (a) => place(a, 1),
      "ten-times-too-large": (a) => place(a, 2),
      "a-hundred-times-too-small": (a) => place(a, 3),
    },
    options: () => ["1", "2", "3", "4"],
    x: (a) => values(a, ["5", "0,5", "50", "0,05"]),
    c: [1, 2, 3, 4],
  }),
  M12_benchmark_1S({
    id: "M12.benchmark-1S.05",
    form: "the-thickness-of-a-book-page",
    g: [7, 8],
    kind: "choice",
    p: [rg(0, 23)],
    f: (a) => place(a, 0),
    t: {
      "ten-times-too-small": (a) => place(a, 1),
      "ten-times-too-large": (a) => place(a, 2),
      "a-hundred-times-too-large": (a) => place(a, 3),
    },
    options: () => ["1", "2", "3", "4"],
    x: (a) => values(a, ["0,1", "0,01", "1", "10"]),
    c: [1, 2, 3, 4],
  }),
  M12_benchmark_1S({
    id: "M12.benchmark-1S.06",
    form: "the-speed-of-a-car-on-a-motorway",
    g: [7, 8],
    kind: "choice",
    p: [rg(0, 23)],
    f: (a) => place(a, 0),
    t: {
      "ten-times-too-small": (a) => place(a, 1),
      "ten-times-too-large": (a) => place(a, 2),
      "too-small-unit": (a) => place(a, 3),
    },
    options: () => ["1", "2", "3", "4"],
    x: (a) => values(a, ["120", "12", "1200", "0,012"]),
    c: [1, 2, 3, 4],
  }),
  M12_benchmark_1S({
    id: "M12.benchmark-1S.07",
    form: "the-length-of-a-football-pitch",
    g: [7, 8],
    kind: "choice",
    p: [rg(0, 23)],
    f: (a) => place(a, 0),
    t: {
      "ten-times-too-small": (a) => place(a, 1),
      "ten-times-too-large": (a) => place(a, 2),
      "a-hundred-times-too-large": (a) => place(a, 3),
    },
    options: () => ["1", "2", "3", "4"],
    x: (a) => values(a, ["100", "10", "1000", "10000"]),
    c: [1, 2, 3, 4],
  }),
  M12_benchmark_1S({
    id: "M12.benchmark-1S.08",
    form: "the-population-of-a-big-city",
    g: [7, 8],
    kind: "choice",
    p: [rg(0, 23)],
    f: (a) => place(a, 0),
    t: {
      "ten-times-too-small": (a) => place(a, 1),
      "ten-times-too-large": (a) => place(a, 2),
      "a-hundred-times-too-small": (a) => place(a, 3),
    },
    options: () => ["1", "2", "3", "4"],
    x: (a) => values(a, ["900", "90", "9000", "9"]),
    c: [1, 2, 3, 4],
  }),
  M12_benchmark_1S({
    id: "M12.benchmark-1S.09",
    form: "the-water-in-a-swimming-pool",
    g: [7, 8],
    kind: "choice",
    p: [rg(0, 23)],
    f: (a) => place(a, 0),
    t: {
      "ten-times-too-small": (a) => place(a, 1),
      "ten-times-too-large": (a) => place(a, 2),
      "a-hundred-times-too-small": (a) => place(a, 3),
    },
    options: () => ["1", "2", "3", "4"],
    x: (a) => values(a, ["500", "50", "5000", "5"]),
    c: [1, 2, 3, 4],
  }),
  M12_benchmark_1S({
    id: "M12.benchmark-1S.10",
    form: "the-age-of-a-grandparent",
    g: [7, 8],
    kind: "choice",
    p: [rg(0, 23)],
    f: (a) => place(a, 0),
    t: {
      "ten-times-too-small": (a) => place(a, 1),
      "ten-times-too-large": (a) => place(a, 2),
      "too-young": (a) => place(a, 3),
    },
    options: () => ["1", "2", "3", "4"],
    x: (a) => values(a, ["65", "6", "650", "15"]),
    c: [1, 2, 3, 4],
  }),
  M12_benchmark_1S({
    id: "M12.benchmark-1S.11",
    form: "the-height-of-a-tall-building",
    g: [7, 8],
    kind: "choice",
    p: [rg(0, 23)],
    f: (a) => place(a, 0),
    t: {
      "ten-times-too-small": (a) => place(a, 1),
      "ten-times-too-large": (a) => place(a, 2),
      "a-hundred-times-too-large": (a) => place(a, 3),
    },
    options: () => ["1", "2", "3", "4"],
    x: (a) => values(a, ["30", "3", "300", "3000"]),
    c: [1, 2, 3, 4],
  }),
  M12_benchmark_1S({
    id: "M12.benchmark-1S.12",
    form: "the-volume-of-a-classroom",
    g: [7, 8],
    kind: "choice",
    p: [rg(0, 23)],
    f: (a) => place(a, 0),
    t: {
      "ten-times-too-small": (a) => place(a, 1),
      "ten-times-too-large": (a) => place(a, 2),
      "a-hundred-times-too-large": (a) => place(a, 3),
    },
    options: () => ["1", "2", "3", "4"],
    x: (a) => values(a, ["150", "15", "1500", "15000"]),
    c: [1, 2, 3, 4],
  }),
  M12_benchmark_1S({
    id: "M12.benchmark-1S.13",
    form: "the-seconds-in-a-school-day",
    g: [7, 8],
    kind: "choice",
    p: [rg(0, 23)],
    f: (a) => place(a, 0),
    t: {
      "ten-times-too-small": (a) => place(a, 1),
      "ten-times-too-large": (a) => place(a, 2),
      "too-small-unit": (a) => place(a, 3),
    },
    options: () => ["1", "2", "3", "4"],
    x: (a) => values(a, ["20000", "2000", "200000", "360"]),
    c: [1, 2, 3, 4],
  }),
  M12_benchmark_1S({
    id: "M12.benchmark-1S.14",
    form: "the-area-of-a-football-pitch",
    g: [7, 8],
    kind: "choice",
    p: [rg(0, 23)],
    f: (a) => place(a, 0),
    t: {
      "ten-times-too-small": (a) => place(a, 1),
      "ten-times-too-large": (a) => place(a, 2),
      "a-hundred-times-too-large": (a) => place(a, 3),
    },
    options: () => ["1", "2", "3", "4"],
    x: (a) => values(a, ["7000", "700", "70000", "700000"]),
    c: [1, 2, 3, 4],
  }),
];

/** The wrong difference of a child who takes the smaller digit from the larger in every place, never borrowing. */
const noBorrow = (a: number, b: number): number => {
  let out = 0;
  for (let place = 1; a >= place || b >= place; place *= 10)
    out +=
      Math.abs((Math.floor(b / place) % 10) - (Math.floor(a / place) % 10)) *
      place;
  return out;
};

const M13_instruments = calc("M13", "instruments");
const M13_instruments_specs: readonly Spec<never>[] = [
  M13_instruments({
    id: "M13.instruments.01",
    form: "a-length-between-two-marks-of-a-ruler",
    g: [5, 7],
    kind: "integer",
    p: [rg(1, 4), rg(7, 12)],
    f: (a, b) => q(b - a),
    t: {
      "end-mark": (a, b) => q(b),
      "counted-marks": (a, b) => q(b - a + 1),
      added: (a, b) => q(a + b),
    },
  }),
  M13_instruments({
    id: "M13.instruments.02",
    form: "a-length-in-centimetres-and-millimetres",
    g: [5, 7],
    kind: "integer",
    p: [rg(2, 9), rg(1, 9)],
    f: (a, b) => q(10 * a + b),
    t: {
      "counts-added": (a, b) => q(a + b),
      "hundred-per-cm": (a, b) => q(100 * a + b),
      "mm-dropped": (a) => q(10 * a),
    },
    c: [10],
  }),
  M13_instruments({
    id: "M13.instruments.03",
    form: "a-level-in-a-measuring-cup",
    g: [5, 7],
    kind: "integer",
    p: [rg(1, 6)],
    f: (a) => q(50 * a),
    t: {
      "mark-number": (a) => q(a),
      added: (a) => q(a + 50),
      "zero-counted": (a) => q(50 * (a + 1)),
    },
    c: [50],
  }),
  M13_instruments({
    id: "M13.instruments.04",
    form: "a-pointer-between-two-marks-of-a-scale",
    g: [5, 7],
    kind: "integer",
    p: [rg(1, 9)],
    f: (a) => q(100 * a + 50),
    t: {
      "lower-mark": (a) => q(100 * a),
      "upper-mark": (a) => q(100 * a + 100),
      "half-of-upper": (a) => (a === 1 ? null : q(50 * a + 50)),
    },
    x: (a) => ({ x: String(100 * a), y: String(100 * a + 100) }),
    c: [50, 100],
  }),
  M13_instruments({
    id: "M13.instruments.05",
    form: "a-thermometer-with-marks-every-two-degrees",
    g: [5, 7],
    kind: "integer",
    p: [rg(1, 12)],
    f: (a) => q(2 * a),
    t: {
      "mark-number": (a) => q(a),
      added: (a) => (a === 2 ? null : q(a + 2)),
      "zero-counted": (a) => q(2 * (a + 1)),
    },
    c: [2],
  }),
  M13_instruments({
    id: "M13.instruments.06",
    form: "a-thermometer-below-zero",
    g: [5, 7],
    kind: "integer",
    p: [rg(1, 15)],
    f: (a) => q(-a),
    t: { "no-sign": (a) => q(a), "zero-counted": (a) => q(-(a + 1)) },
    c: [1],
  }),
  M13_instruments({
    id: "M13.instruments.07",
    form: "a-clinical-thermometer",
    g: [5, 7],
    kind: "decimal",
    p: [rg(1, 9)],
    ok: () => true,
    f: (a) => qd(360 + a, 1),
    t: {
      "tenths-as-wholes": (a) => q(36 + a),
      hundredths: (a) => qd(3600 + a, 2),
      "scale-only": (a) => qd(a, 1),
    },
    c: [0.1, 36],
  }),
  M13_instruments({
    id: "M13.instruments.08",
    form: "the-difference-of-two-lengths",
    g: [5, 7],
    kind: "integer",
    p: [rg(11, 49), rg(52, 99)],
    f: (a, b) => q(b - a),
    t: {
      added: (a, b) => q(a + b),
      "no-borrow": (a, b) => {
        const w = noBorrow(a, b);
        return w === b - a ? null : q(w);
      },
    },
  }),
  M13_instruments({
    id: "M13.instruments.09",
    form: "a-speedometer-reading",
    g: [5, 7],
    kind: "integer",
    p: [rg(2, 9)],
    f: (a) => q(10 * a),
    t: {
      "mark-number": (a) => q(a),
      added: (a) => q(a + 10),
      "zero-counted": (a) => q(10 * (a + 1)),
    },
    c: [10],
  }),
  M13_instruments({
    id: "M13.instruments.10",
    form: "the-weight-of-an-object-from-two-weighings",
    g: [5, 7],
    kind: "integer",
    p: [rg(200, 480), rg(520, 900)],
    f: (a, b) => q(b - a),
    t: {
      added: (a, b) => q(a + b),
      "full-weight": (a, b) => q(b),
      "no-borrow": (a, b) => {
        const w = noBorrow(a, b);
        return w === b - a ? null : q(w);
      },
    },
  }),
  M13_instruments({
    id: "M13.instruments.11",
    form: "a-rain-gauge",
    g: [5, 7],
    kind: "integer",
    p: [rg(2, 9)],
    f: (a) => q(2 * a),
    t: {
      "mark-number": (a) => q(a),
      added: (a) => (a === 2 ? null : q(a + 2)),
      "zero-counted": (a) => q(2 * (a + 1)),
    },
    c: [2],
  }),
  M13_instruments({
    id: "M13.instruments.12",
    form: "a-balance-with-a-weight-on-each-pan",
    g: [5, 7],
    kind: "integer",
    p: [rg(4, 9), rg(1, 3)],
    ok: (a, b) => a - b >= 2,
    f: (a, b) => q(a - b),
    t: {
      "weights-added": (a, b) => q(a + b),
      "left-weight": (a) => q(a),
    },
    roles: {
      a: "weight on the left pan",
      b: "weight on the right pan beside the object",
    },
  }),
  M13_instruments({
    id: "M13.instruments.13",
    form: "the-lighter-coin-on-a-balance",
    g: [7, 8],
    kind: "integer",
    p: [of(4, 9, 10, 27, 28, 50, 81)],
    f: (a) => q(weighings(a, 3)),
    t: {
      halves: (a) => w(weighings(a, 2), weighings(a, 3)),
      "one-by-one": (a) => w(a - 1, weighings(a, 3)),
    },
    x: (a) => {
      const k = weighings(a, 3);
      return {
        e: `${Array.from({ length: k }, () => "3").join(" \\u00d7 ")} = ${3 ** k}`,
        s: Array.from({ length: k }, () => "1").join(" + "),
      };
    },
    c: [3],
    origin: {
      olympiad:
        "finding the lighter coin on a balance by splitting the coins into three piles, a classic item in the spirit of the Kangaroo and MCCME papers (RES-4286)",
    },
  }),
  M13_instruments({
    id: "M13.instruments.14",
    form: "a-measuring-cup-with-unlabelled-marks",
    g: [5, 7],
    kind: "integer",
    p: [of(100, 200), of(4, 5, 10), rg(1, 3)],
    ok: (a, b, c) => c < b,
    f: (a, b, c) => q(a + (c * 100) / b),
    t: {
      "ticks-as-millilitres": (a, b, c) => q(a + c),
      "ticks-as-hundreds": (a, b, c) => q(a + 100 * c),
      "next-mark": (a) => q(a + 100),
    },
    c: [100, 200, 300],
  }),
  M13_instruments({
    id: "M13.instruments.15",
    form: "a-thermometer-with-unlabelled-marks",
    g: [5, 7],
    kind: "integer",
    p: [of(-10, 0, 10, 20), rg(1, 4)],
    f: (a, b) => q(a + 2 * b),
    t: {
      "ticks-as-degrees": (a, b) => q(a + b),
      "next-mark": (a) => q(a + 10),
    },
    x: (a) => ({ a: a < 0 ? `\u2212${-a}` : String(a) }),
    c: [2, 4, 5, 10],
  }),
];

/** Times in which three workers do a job alone, chosen so that together they need a whole number of hours. */
const TRIOS: readonly (readonly [number, number, number])[] = [
  [6, 12, 12],
  [10, 15, 30],
  [4, 12, 6],
  [12, 24, 24],
];
const trio = (i: number): readonly [number, number, number] =>
  TRIOS[i] ?? [6, 12, 12];

const M14_average_speed = calc("M14", "average-speed");
const M14_average_speed_specs: readonly Spec<never>[] = [
  M14_average_speed({
    id: "M14.average-speed.01",
    form: "two-legs-of-the-same-duration",
    g: [8, 8],
    kind: "integer",
    p: [of(40, 60, 80, 100), of(20, 40, 60, 80)],
    ok: (a, b) => a !== b && (a + b) % 2 === 0 && (2 * a * b) % (a + b) === 0,
    f: (a, b) => q((a + b) / 2),
    t: {
      harmonic: (a, b) => q((2 * a * b) / (a + b)),
      "sum-of-speeds": (a, b) => q(a + b),
    },
    c: [2],
    origin: {
      extension: "average speed and work problems, Russian grade 6 (RES-4286)",
    },
  }),
  M14_average_speed({
    id: "M14.average-speed.02",
    form: "two-legs-of-the-same-length",
    g: [8, 8],
    kind: "integer",
    p: [of(30, 24, 40, 20, 50, 60), of(60, 40, 60, 30, 75, 90)],
    ok: (a, b) =>
      a !== b &&
      (2 * a * b) % (a + b) === 0 &&
      (a + b) % 2 === 0 &&
      (a + b) / 2 !== (2 * a * b) / (a + b),
    f: (a, b) => q((2 * a * b) / (a + b)),
    t: {
      "arithmetic-mean": (a, b) => q((a + b) / 2),
      "sum-of-speeds": (a, b) => q(a + b),
      "product-over-sum": (a, b) =>
        (a * b) % (a + b) === 0 ? q((a * b) / (a + b)) : null,
    },
    origin: {
      extension: "average speed and work problems, Russian grade 6 (RES-4286)",
    },
  }),
  M14_average_speed({
    id: "M14.average-speed.03",
    form: "total-distance-over-total-time",
    g: [8, 8],
    kind: "integer",
    p: [of(60, 80), rg(2, 4), of(40, 60), rg(2, 4)],
    ok: (a, b, c, d) =>
      b !== d &&
      (a * b + c * d) % (b + d) === 0 &&
      (a + c) / 2 !== (a * b + c * d) / (b + d),
    f: (a, b, c, d) => q((a * b + c * d) / (b + d)),
    t: {
      "speeds-averaged": (a, b, c) => q((a + c) / 2),
      "distance-only": (a, b, c, d) => q(a * b + c * d),
      "legs-averaged": (a, b, c, d) =>
        (a * b + c * d) % 2 === 0 ? q((a * b + c * d) / 2) : null,
    },
    origin: {
      extension: "average speed and work problems, Russian grade 6 (RES-4286)",
    },
  }),
  M14_average_speed({
    id: "M14.average-speed.04",
    form: "a-journey-with-a-stop",
    g: [8, 8],
    kind: "integer",
    p: [of(60, 80, 90), rg(2, 4), rg(1, 2)],
    ok: (a, b, c) => (a * b) % (b + c) === 0 && b !== c,
    f: (a, b, c) => q((a * b) / (b + c)),
    t: {
      "stop-ignored": (a) => q(a),
      "distance-only": (a, b) => q(a * b),
      "speed-and-zero": (a) => q(a / 2),
    },
    origin: {
      extension: "average speed and work problems, Russian grade 6 (RES-4286)",
    },
  }),
  M14_average_speed({
    id: "M14.average-speed.05",
    form: "two-workers-together",
    g: [8, 8],
    kind: "integer",
    p: [of(3, 4, 6, 10, 12), of(6, 12, 15, 24)],
    ok: (a, b) => a < b && (a * b) % (a + b) === 0,
    f: (a, b) => q((a * b) / (a + b)),
    t: {
      "sum-of-times": (a, b) => q(a + b),
      "average-of-times": (a, b) => ((a + b) % 2 === 0 ? q((a + b) / 2) : null),
      "faster-alone": (a) => q(a),
    },
    c: [1],
    origin: {
      extension: "average speed and work problems, Russian grade 6 (RES-4286)",
    },
  }),
  M14_average_speed({
    id: "M14.average-speed.06",
    form: "the-time-to-meet",
    g: [8, 8],
    kind: "integer",
    p: [of(40, 50, 60), of(30, 40, 60), rg(2, 6)],
    ok: (a, b, c) => a !== b && (c * (a + b)) % a === 0,
    f: (a, b, c) => q(c),
    t: {
      "one-speed": (a, b, c) => q((c * (a + b)) / a),
      "other-train": (a, b, c) =>
        (c * (a + b)) % b === 0 ? q((c * (a + b)) / b) : null,
      "speeds-subtracted": (a, b, c) => {
        const d = Math.abs(a - b);
        return (c * (a + b)) % d === 0 && d !== a && d !== b
          ? q((c * (a + b)) / d)
          : null;
      },
    },
    x: (a, b, c) => ({ x: String(c * (a + b)) }),
    origin: {
      extension: "average speed and work problems, Russian grade 6 (RES-4286)",
    },
  }),
  M14_average_speed({
    id: "M14.average-speed.07",
    form: "a-boat-with-the-current",
    g: [8, 8],
    kind: "integer",
    p: [rg(8, 20), rg(2, 5)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a + b),
    t: {
      "against-the-current": (a, b) => q(a - b),
      "boat-itself": (a) => q(a),
      product: (a, b) => q(a * b),
    },
    origin: {
      extension: "average speed and work problems, Russian grade 6 (RES-4286)",
    },
  }),
  M14_average_speed({
    id: "M14.average-speed.08",
    form: "a-boat-against-the-current",
    g: [8, 8],
    kind: "integer",
    p: [rg(8, 20), rg(2, 5)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a - b),
    t: {
      "with-the-current": (a, b) => q(a + b),
      "boat-itself": (a) => q(a),
      product: (a, b) => q(a * b),
    },
    origin: {
      extension: "average speed and work problems, Russian grade 6 (RES-4286)",
    },
  }),
  M14_average_speed({
    id: "M14.average-speed.09",
    form: "the-average-of-three-days",
    g: [8, 8],
    kind: "integer",
    p: [of(60, 80, 100), of(90, 120, 150), of(120, 150, 180)],
    ok: (a, b, c) => (a + b + c) % 3 === 0 && a !== b && b !== c,
    f: (a, b, c) => q((a + b + c) / 3),
    t: {
      total: (a, b, c) => q(a + b + c),
      "divided-by-two": (a, b, c) =>
        (a + b + c) % 2 === 0 ? q((a + b + c) / 2) : null,
      "middle-day": (a, b) => q(b),
    },
    c: [3],
    origin: {
      extension: "average speed and work problems, Russian grade 6 (RES-4286)",
    },
  }),
  M14_average_speed({
    id: "M14.average-speed.10",
    form: "the-distance-at-an-average-speed",
    g: [8, 8],
    kind: "integer",
    p: [rg(40, 80), rg(2, 6)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a * b),
    t: {
      added: (a, b) => q(a + b),
      divided: (a, b) => (a % b === 0 ? q(a / b) : null),
      subtracted: (a, b) => q(a - b),
    },
    origin: {
      extension: "average speed and work problems, Russian grade 6 (RES-4286)",
    },
  }),
  M14_average_speed({
    id: "M14.average-speed.11",
    form: "the-average-speed-of-a-round-trip-of-equal-halves",
    g: [8, 8],
    kind: "integer",
    p: [rg(1, 4)],
    f: (k) => q(15 * k),
    t: {
      "slowest-speed": (k) => q(10 * k),
      "arithmetic-mean": (k) => w((55 * k) / 3, 15 * k),
    },
    x: (k) => ({
      a: String(10 * k),
      b: String(15 * k),
      c: String(30 * k),
      L: String(30 * k),
      ta: "3",
      tb: "2",
      tc: "1",
      t: "6",
    }),
    origin: {
      extension: "average speed and work problems, Russian grade 6 (RES-4286)",
    },
  }),
  M14_average_speed({
    id: "M14.average-speed.12",
    form: "a-pool-with-a-pipe-in-and-a-pipe-out",
    g: [8, 8],
    kind: "integer",
    p: [of(2, 3, 4, 6, 8, 10), of(4, 6, 12, 15, 24)],
    ok: (a, b) => a < b && (a * b) % (b - a) === 0,
    f: (a, b) => q((a * b) / (b - a)),
    t: {
      "rates-added": (a, b) =>
        (a * b) % (a + b) === 0
          ? w((a * b) / (a + b), (a * b) / (b - a))
          : null,
      "times-subtracted": (a, b) => w(b - a, (a * b) / (b - a)),
    },
    origin: {
      olympiad:
        "one pipe fills and another empties: the rates are subtracted, in the spirit of the work items of the MCCME papers (RES-4286)",
    },
  }),
  M14_average_speed({
    id: "M14.average-speed.13",
    form: "a-boat-there-and-back-on-a-river",
    g: [8, 8],
    kind: "integer",
    p: [of(8, 9, 10, 15), of(2, 3, 5), of(24, 40, 48)],
    ok: (a, b, c) => a > b && c % (a + b) === 0 && c % (a - b) === 0,
    f: (a, b, c) => q(c / (a + b) + c / (a - b)),
    t: {
      "still-water-speed": (a, b, c) =>
        (2 * c) % a === 0 ? w((2 * c) / a, c / (a + b) + c / (a - b)) : null,
      "one-way": (a, b, c) => w(c / (a + b), c / (a + b) + c / (a - b)),
      "both-ways-slow": (a, b, c) =>
        w((2 * c) / (a - b), c / (a + b) + c / (a - b)),
      "both-ways-fast": (a, b, c) =>
        w((2 * c) / (a + b), c / (a + b) + c / (a - b)),
    },
    origin: {
      extension: "average speed and work problems, Russian grade 6 (RES-4286)",
    },
  }),
  M14_average_speed({
    id: "M14.average-speed.14",
    form: "three-workers-together",
    g: [8, 8],
    kind: "integer",
    p: [rg(0, TRIOS.length - 1)],
    f: (a) => {
      const [x, y, z] = trio(a);
      return q((x * y * z) / (y * z + x * z + x * y));
    },
    t: {
      "average-of-times": (a) => {
        const [x, y, z] = trio(a);
        return w((x + y + z) / 3, (x * y * z) / (y * z + x * z + x * y));
      },
      "two-workers-only": (a) => {
        const [x, y, z] = trio(a);
        return (x * y) % (x + y) === 0
          ? w((x * y) / (x + y), (x * y * z) / (y * z + x * z + x * y))
          : null;
      },
    },
    x: (a) => {
      const [x, y, z] = trio(a);
      const whole = x * y * z;
      return {
        a: String(x),
        b: String(y),
        c: String(z),
        x: String(whole),
        xa: String(whole / x),
        xb: String(whole / y),
        xc: String(whole / z),
        xs: String(whole / x + whole / y + whole / z),
      };
    },
    origin: {
      extension: "average speed and work problems, Russian grade 6 (RES-4286)",
    },
  }),
];

export const mSpecs5: readonly Spec<never>[] = [
  ...M11_circle_specs,
  ...M12_benchmark_specs,
  ...M12_benchmark_1S_specs,
  ...M13_instruments_specs,
  ...M14_average_speed_specs,
];
