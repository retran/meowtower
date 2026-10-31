// Domain A, part 2: dividing with the tables, column work to 1,000, multiplying by one digit and by
// round numbers (RES-4283). The Dutch goals divide from the tables at group 5, add and subtract to
// 1,000 at group 5 and multiply by one digit with a split at group 5 to 6. Texts are plain blanks in
// `content/tasks-a.ru.json`, keyed by the template id.
import { between, pick } from "./draw.js";
import { FOUR, forChoice, forSubtype, placeOf, turn } from "./a1.js";
import type { Spec } from "./spec.js";

const sum = (n: number, x: number): number =>
  Array.from({ length: n }, () => x).reduce((p, q) => p + q, 0);
const ones = (n: number): number => n % 10;
const tens = (n: number): number => Math.floor(n / 10) % 10;
const hundreds = (n: number): number => Math.floor(n / 100);

const keep = (x: number, ...not: number[]): number | null =>
  Number.isInteger(x) && x >= 0 && !not.includes(x) ? x : null;

/** The count of zeros at the end of a whole number. */
const zerosAtEnd = (n: number): number => {
  let z = 0;
  let m = n;
  while (m > 0 && m % 10 === 0) {
    m /= 10;
    z += 1;
  }
  return z;
};
const roundTen = (n: number): number => Math.round(n / 10) * 10;

const a4 = forSubtype("A4", "divide-table");
const divide = [
  a4({
    id: "A4.divide-table.01",
    form: "a-quotient-from-the-tables-of-2-5-and-10",
    groups: [5, 5],
    draw: (r) => [pick(r, [2, 5, 10]), between(r, 3, 10)],
    valid: ([a = 0, q = 0]) => a !== q,
    solve: ([, q = 0]) => q,
    ref: ([a = 0, q = 0]) =>
      Array.from({ length: 11 }, (_, x) => x).find((x) => a * x === a * q) ??
      -1,
    traps: [
      ["subtracted", "procedural", ([a = 0, q = 0]) => a * q - a],
      ["neighbour-above", "fact", ([a = 0, q = 0]) => keep(q + 1, a * q - a)],
      [
        "neighbour-below",
        "fact",
        ([a = 0, q = 0]) => keep(q - 1, a * q - a, q + 1),
      ],
    ],
    extra: ([a = 0, q = 0]) => ({ c: String(a * q) }),
  }),
  a4({
    id: "A4.divide-table.02",
    form: "a-quotient-from-the-tables-of-3-and-4",
    groups: [5, 5],
    draw: (r) => [pick(r, [3, 4]), between(r, 3, 10)],
    valid: ([a = 0, q = 0]) => a !== q,
    solve: ([, q = 0]) => q,
    ref: ([a = 0, q = 0]) =>
      Array.from({ length: 11 }, (_, x) => x).find((x) => a * x === a * q) ??
      -1,
    traps: [
      ["subtracted", "procedural", ([a = 0, q = 0]) => a * q - a],
      ["neighbour-above", "fact", ([a = 0, q = 0]) => keep(q + 1, a * q - a)],
      [
        "neighbour-below",
        "fact",
        ([a = 0, q = 0]) => keep(q - 1, a * q - a, q + 1),
      ],
    ],
    extra: ([a = 0, q = 0]) => ({ c: String(a * q) }),
  }),
  a4({
    id: "A4.divide-table.03",
    form: "a-quotient-from-the-tables-of-6-to-9",
    groups: [5, 5],
    draw: (r) => [between(r, 6, 9), between(r, 6, 9)],
    valid: ([a = 0, q = 0]) => a !== q,
    solve: ([, q = 0]) => q,
    ref: ([a = 0, q = 0]) =>
      Array.from({ length: 11 }, (_, x) => x).find((x) => a * x === a * q) ??
      -1,
    traps: [
      ["divisor-as-answer", "conceptual", ([a = 0]) => a],
      ["neighbour-above", "fact", ([a = 0, q = 0]) => keep(q + 1, a)],
      ["neighbour-below", "fact", ([a = 0, q = 0]) => keep(q - 1, a, q + 1)],
    ],
    extra: ([a = 0, q = 0]) => ({ c: String(a * q) }),
  }),
  a4({
    id: "A4.divide-table.04",
    form: "a-missing-divisor",
    groups: [5, 5],
    draw: (r) => [between(r, 3, 9), between(r, 3, 9)],
    valid: ([a = 0, q = 0]) => a !== q,
    solve: ([a = 0]) => a,
    ref: ([a = 0, q = 0]) =>
      Array.from({ length: 11 }, (_, x) => x).find((x) => x * q === a * q) ??
      -1,
    traps: [
      ["quotient-as-answer", "conceptual", ([, q = 0]) => q],
      ["neighbour-above", "fact", ([a = 0, q = 0]) => keep(a + 1, q)],
      ["neighbour-below", "fact", ([a = 0, q = 0]) => keep(a - 1, q, a + 1)],
    ],
    extra: ([a = 0, q = 0]) => ({ c: String(a * q) }),
  }),
  a4({
    id: "A4.divide-table.05",
    form: "the-inverse-of-a-product",
    groups: [5, 5],
    draw: (r) => [between(r, 3, 9), between(r, 3, 9)],
    valid: ([a = 0, b = 0]) => a !== b,
    solve: ([, b = 0]) => b,
    ref: ([a = 0, b = 0]) => (a * b) / a,
    traps: [
      ["first-factor", "conceptual", ([a = 0]) => a],
      ["neighbour-above", "fact", ([a = 0, b = 0]) => keep(b + 1, a)],
      ["neighbour-below", "fact", ([a = 0, b = 0]) => keep(b - 1, a, b + 1)],
    ],
    extra: ([a = 0, b = 0]) => ({ c: String(a * b) }),
  }),
  a4({
    id: "A4.divide-table.06",
    form: "sharing-equally",
    groups: [5, 5],
    draw: (r) => [between(r, 3, 9), between(r, 3, 9)],
    valid: ([a = 0, q = 0]) => a !== q,
    solve: ([, q = 0]) => q,
    ref: ([a = 0, q = 0]) => sum(a, q) / a,
    traps: [
      ["subtracted", "procedural", ([a = 0, q = 0]) => a * q - a],
      ["neighbour-above", "fact", ([a = 0, q = 0]) => keep(q + 1, a * q - a)],
      [
        "neighbour-below",
        "fact",
        ([a = 0, q = 0]) => keep(q - 1, a * q - a, q + 1),
      ],
    ],
    extra: ([a = 0, q = 0]) => ({ c: String(a * q) }),
  }),
  a4({
    id: "A4.divide-table.07",
    form: "making-equal-groups",
    groups: [5, 5],
    draw: (r) => [between(r, 3, 9), between(r, 3, 9)],
    valid: ([a = 0, q = 0]) => a !== q,
    solve: ([, q = 0]) => q,
    ref: ([a = 0, q = 0]) =>
      Array.from({ length: 12 }, (_, x) => x).find((x) => x * a === q * a) ??
      -1,
    traps: [
      ["multiplied", "procedural", ([a = 0, q = 0]) => a * q * a],
      [
        "subtracted",
        "procedural",
        ([a = 0, q = 0]) => keep(a * q - a, a * q * a),
      ],
      ["neighbour-above", "fact", ([a = 0, q = 0]) => keep(q + 1, a * q - a)],
      [
        "neighbour-below",
        "fact",
        ([a = 0, q = 0]) => keep(q - 1, a * q - a, q + 1),
      ],
    ],
    extra: ([a = 0, q = 0]) => ({ c: String(a * q) }),
  }),
  a4({
    id: "A4.divide-table.08",
    form: "half-of-an-even-number",
    groups: [5, 5],
    draw: (r) => [between(r, 6, 49)],
    solve: ([q = 0]) => q,
    ref: ([q = 0]) => (2 * q) / 2,
    traps: [
      ["doubled", "conceptual", ([q = 0]) => 4 * q],
      ["quarter", "conceptual", ([q = 0]) => (q % 2 === 0 ? q / 2 : null)],
      [
        "half-of-tens-only",
        "procedural",
        ([q = 0]) =>
          Math.floor((2 * q) / 10) % 2 === 0
            ? 5 * Math.floor((2 * q) / 10) + ((2 * q) % 10)
            : null,
      ],
    ],
    extra: ([q = 0]) => ({ c: String(2 * q) }),
    consts: [2],
  }),
  a4({
    id: "A4.divide-table.09",
    form: "the-number-that-gives-a-quotient",
    groups: [5, 5],
    draw: (r) => [between(r, 3, 9), between(r, 3, 9)],
    valid: ([a = 0, q = 0]) => a !== q,
    solve: ([a = 0, q = 0]) => a * q,
    ref: ([a = 0, q = 0]) => sum(q, a),
    traps: [
      ["added", "procedural", ([a = 0, q = 0]) => a + q],
      ["neighbour-above", "fact", ([a = 0, q = 0]) => keep(a * (q + 1), a + q)],
      ["neighbour-below", "fact", ([a = 0, q = 0]) => keep(a * (q - 1), a + q)],
      [
        "quotient-named",
        "conceptual",
        ([a = 0, q = 0]) => keep(q, a + q, a * (q - 1)),
      ],
    ],
  }),
  a4({
    id: "A4.divide-table.10",
    form: "a-product-then-a-quotient",
    groups: [5, 6],
    draw: (r) => [
      between(r, 2, 9),
      pick(r, [2, 3, 4, 5, 6]),
      pick(r, [2, 3, 4, 5, 6]),
    ],
    valid: ([a = 0, b = 0, c = 0]) =>
      b !== c && (a * b) % c === 0 && a * b !== (a * b) / c,
    solve: ([a = 0, b = 0, c = 0]) => (a * b) / c,
    ref: ([a = 0, b = 0, c = 0]) =>
      Array.from({ length: 60 }, (_, x) => x).find((x) => x * c === a * b) ??
      -1,
    traps: [
      ["forgot-to-divide", "procedural", ([a = 0, b = 0]) => a * b],
      [
        "multiplied-by-divisor",
        "procedural",
        ([a = 0, b = 0, c = 0]) => a * b * c,
      ],
      [
        "added-then-divided",
        "procedural",
        ([a = 0, b = 0, c = 0]) =>
          (a + b) % c === 0 ? keep((a + b) / c, a * b) : null,
      ],
    ],
    extra: ([a = 0, b = 0]) => ({ p: String(a * b) }),
  }),
  a4({
    id: "A4.divide-table.11",
    form: "several-times-shorter",
    groups: [5, 6],
    origin: {
      extension: "comparison by how many times, Russian grade 3 (RES-4283)",
    },
    draw: (r) => [between(r, 5, 10), between(r, 3, 9)],
    solve: ([, q = 0]) => q,
    ref: ([a = 0, q = 0]) => (a * q) / a,
    traps: [
      ["shorter-by", "conceptual", ([a = 0, q = 0]) => a * q - a],
      [
        "multiplied",
        "procedural",
        ([a = 0, q = 0]) => keep(a * q * a, a * q - a),
      ],
      [
        "divisor-as-answer",
        "conceptual",
        ([a = 0, q = 0]) => keep(a, a * q * a, a * q - a),
      ],
    ],
    extra: ([a = 0, q = 0]) => ({ c: String(a * q) }),
  }),
  a4({
    id: "A4.divide-table.12",
    form: "dividing-by-one-and-by-itself",
    groups: [5, 5],
    draw: (r) => [between(r, 2, 9)],
    solve: ([c = 0]) => c + 1,
    ref: ([c = 0]) => c / 1 + c / c,
    traps: [
      ["itself-only", "conceptual", ([c = 0]) => c],
      ["itself-gives-itself", "conceptual", ([c = 0]) => 2 * c],
      ["by-one-gives-one", "conceptual", ([c = 0]) => (c === 2 ? null : 2)],
    ],
    consts: [1],
  }),
  forChoice(
    "A4",
    "divide-table",
  )({
    id: "A4.divide-table.13",
    form: "the-number-that-is-not-in-the-table",
    groups: [5, 5],
    kind: "choice",
    draw: (r) => {
      const a = between(r, 3, 9);
      const ks = [3, 4, 5, 6, 7, 8, 9, 10];
      const k1 = pick(r, ks);
      const k2 = pick(
        r,
        ks.filter((k) => k !== k1),
      );
      const k3 = pick(
        r,
        ks.filter((k) => k !== k1 && k !== k2),
      );
      const k4 = pick(r, ks);
      return [
        a,
        a * k4 + between(r, 1, a - 1),
        a * k1,
        a * k2,
        a * k3,
        r.int(4),
      ];
    },
    solve: ([, , , , , by = 0]) => placeOf(0, by),
    ref: ([a = 0, n = 0, m1 = 0, m2 = 0, m3 = 0, by = 0]) =>
      String(turn([n, m1, m2, m3], by).findIndex((x) => x % a !== 0) + 1),
    traps: [
      [
        "a-multiple-first",
        "conceptual",
        ([, , , , , by = 0]) => placeOf(1, by),
      ],
      [
        "a-multiple-second",
        "conceptual",
        ([, , , , , by = 0]) => placeOf(2, by),
      ],
      [
        "a-multiple-third",
        "conceptual",
        ([, , , , , by = 0]) => placeOf(3, by),
      ],
    ],
    options: () => FOUR,
    extra: ([, n = 0, m1 = 0, m2 = 0, m3 = 0, by = 0]) => {
      const list = turn([n, m1, m2, m3], by);
      return {
        o1: String(list[0]),
        o2: String(list[1]),
        o3: String(list[2]),
        o4: String(list[3]),
        n: String(n),
        m1: String(m1),
        m2: String(m2),
        m3: String(m3),
      };
    },
    consts: [1, 2, 3, 4],
  }),
  a4({
    id: "A4.divide-table.14",
    form: "how-many-times-longer",
    groups: [5, 6],
    origin: {
      extension: "comparison by how many times, Russian grade 3 (RES-4283)",
    },
    roles: {
      c: "length of the longer ribbon",
      a: "length of the shorter ribbon",
    },
    draw: (r) => [between(r, 4, 10), between(r, 2, 9)],
    valid: ([a = 0, q = 0]) => a !== q,
    solve: ([, q = 0]) => q,
    ref: ([a = 0, q = 0]) =>
      Array.from({ length: 12 }, (_, x) => x).find((x) => a * x === a * q) ??
      -1,
    traps: [
      ["how-much-longer", "conceptual", ([a = 0, q = 0]) => a * q - a],
      ["shorter-length", "conceptual", ([a = 0, q = 0]) => keep(a, a * q - a)],
      [
        "the-two-lengths-multiplied",
        "procedural",
        ([a = 0, q = 0]) => a * a * q,
      ],
    ],
    extra: ([a = 0, q = 0]) => ({ c: String(a * q) }),
  }),
  a4({
    id: "A4.divide-table.15",
    form: "how-many-cuts-make-equal-pieces",
    groups: [5, 6],
    origin: { olympiad: "cuts and pieces, a fence-post count (RES-4283, F15)" },
    roles: { c: "length of the log", a: "length of one piece" },
    draw: (r) => [between(r, 2, 5), between(r, 4, 9)],
    solve: ([, m = 0]) => m - 1,
    ref: ([a = 0, m = 0]) => {
      let cuts = 0;
      let left = a * m;
      while (left > a) {
        left -= a;
        cuts += 1;
      }
      return cuts;
    },
    traps: [
      ["cuts-as-pieces", "conceptual", ([, m = 0]) => m],
      ["one-cut-too-many", "conceptual", ([, m = 0]) => m + 1],
    ],
    extra: ([a = 0, m = 0]) => ({ c: String(a * m), n: String(m) }),
    consts: [1],
  }),
  a4({
    id: "A4.divide-table.16",
    form: "the-larger-of-two-numbers-from-their-sum-and-ratio",
    groups: [5, 6],
    origin: { olympiad: "parts of a whole, a bar model (RES-4283, F12)" },
    roles: { a: "how many times larger", b: "sum of the two numbers" },
    draw: (r) => {
      const q = between(r, 2, 5);
      return [q, (q + 1) * between(r, 3, 9)];
    },
    solve: ([q = 0, s = 0]) => (q * s) / (q + 1),
    ref: ([q = 0, s = 0]) =>
      Array.from({ length: s }, (_, x) => x).find((x) => x * q + x === s) !==
      undefined
        ? q *
          (Array.from({ length: s }, (_, x) => x).find(
            (x) => x * q + x === s,
          ) ?? 0)
        : -1,
    traps: [
      ["the-smaller-number", "conceptual", ([q = 0, s = 0]) => s / (q + 1)],
      [
        "the-sum-over-the-ratio",
        "procedural",
        ([q = 0, s = 0]) => keep(s / q, (q * s) / (q + 1), s / (q + 1)),
      ],
      [
        "the-sum-less-the-ratio",
        "procedural",
        ([q = 0, s = 0]) => keep(s - q, (q * s) / (q + 1), s / (q + 1)),
      ],
    ],
    extra: ([q = 0, s = 0]) => ({ m: String(s / (q + 1)), p: String(q + 1) }),
    consts: [1],
  }),
];

const a5 = forSubtype("A5", "column");
const digit3 = (h: number, t: number, o: number): number =>
  100 * h + 10 * t + o;
const column = [
  a5({
    id: "A5.column.01",
    form: "adding-three-digit-numbers-with-no-carry",
    groups: [5, 5],
    draw: (r) => [
      digit3(between(r, 1, 4), between(r, 1, 4), between(r, 1, 4)),
      digit3(between(r, 1, 4), between(r, 1, 4), between(r, 1, 4)),
    ],
    solve: ([a = 0, b = 0]) => a + b,
    ref: ([a = 0, b = 0]) =>
      100 * (hundreds(a) + hundreds(b)) +
      10 * (tens(a) + tens(b)) +
      ones(a) +
      ones(b),
    traps: [
      ["subtracted", "procedural", ([a = 0, b = 0]) => Math.abs(a - b)],
      [
        "hundreds-not-added",
        "procedural",
        ([a = 0, b = 0]) => a + b - 100 * hundreds(b),
      ],
      ["ones-not-added", "procedural", ([a = 0, b = 0]) => a + b - ones(b)],
    ],
  }),
  a5({
    id: "A5.column.02",
    form: "adding-with-a-carry-in-the-ones",
    groups: [5, 5],
    draw: (r) => [
      digit3(between(r, 1, 4), between(r, 1, 4), between(r, 5, 9)),
      digit3(between(r, 1, 4), between(r, 1, 4), between(r, 5, 9)),
    ],
    valid: ([a = 0, b = 0]) =>
      ones(a) + ones(b) >= 10 && tens(a) + tens(b) + 1 <= 9,
    solve: ([a = 0, b = 0]) => a + b,
    ref: ([a = 0, b = 0]) =>
      digit3(
        hundreds(a) + hundreds(b),
        tens(a) + tens(b) + 1,
        ones(a) + ones(b) - 10,
      ),
    traps: [
      [
        "carry-forgotten",
        "procedural",
        ([a = 0, b = 0]) =>
          digit3(
            hundreds(a) + hundreds(b),
            tens(a) + tens(b),
            (ones(a) + ones(b)) % 10,
          ),
      ],
      [
        "carry-to-hundreds",
        "procedural",
        ([a = 0, b = 0]) =>
          digit3(
            hundreds(a) + hundreds(b) + 1,
            tens(a) + tens(b),
            (ones(a) + ones(b)) % 10,
          ),
      ],
      ["subtracted", "procedural", ([a = 0, b = 0]) => Math.abs(a - b)],
    ],
  }),
  a5({
    id: "A5.column.03",
    form: "adding-with-two-carries",
    groups: [5, 5],
    draw: (r) => [
      digit3(between(r, 1, 4), between(r, 5, 9), between(r, 5, 9)),
      digit3(between(r, 1, 4), between(r, 5, 9), between(r, 5, 9)),
    ],
    valid: ([a = 0, b = 0]) => a + b < 1000,
    solve: ([a = 0, b = 0]) => a + b,
    ref: ([a = 0, b = 0]) => {
      const o = ones(a) + ones(b);
      const t = tens(a) + tens(b) + Math.floor(o / 10);
      return digit3(
        hundreds(a) + hundreds(b) + Math.floor(t / 10),
        t % 10,
        o % 10,
      );
    },
    traps: [
      ["one-carry-lost", "procedural", ([a = 0, b = 0]) => a + b - 100],
      ["ones-carry-lost", "procedural", ([a = 0, b = 0]) => a + b - 10],
      ["both-carries-lost", "procedural", ([a = 0, b = 0]) => a + b - 110],
    ],
  }),
  a5({
    id: "A5.column.04",
    form: "subtracting-with-no-borrowing",
    groups: [5, 5],
    draw: (r) => [
      digit3(between(r, 6, 9), between(r, 5, 9), between(r, 5, 9)),
      digit3(between(r, 1, 5), between(r, 1, 4), between(r, 1, 4)),
    ],
    solve: ([a = 0, b = 0]) => a - b,
    ref: ([a = 0, b = 0]) =>
      digit3(hundreds(a) - hundreds(b), tens(a) - tens(b), ones(a) - ones(b)),
    traps: [
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
      ["ones-added", "procedural", ([a = 0, b = 0]) => a - b + 2 * ones(b)],
      ["tens-added", "procedural", ([a = 0, b = 0]) => a - b + 20 * tens(b)],
    ],
  }),
  a5({
    id: "A5.column.05",
    form: "subtracting-with-one-borrowing",
    groups: [5, 5],
    draw: (r) => [
      digit3(between(r, 5, 9), between(r, 3, 9), between(r, 0, 4)),
      digit3(between(r, 1, 4), between(r, 1, 2), between(r, 5, 9)),
    ],
    valid: ([a = 0, b = 0]) => ones(a) < ones(b) && tens(a) > tens(b),
    solve: ([a = 0, b = 0]) => a - b,
    ref: ([a = 0, b = 0]) =>
      digit3(
        hundreds(a) - hundreds(b),
        tens(a) - tens(b) - 1,
        10 + ones(a) - ones(b),
      ),
    traps: [
      [
        "smaller-from-larger",
        "procedural",
        ([a = 0, b = 0]) =>
          digit3(
            hundreds(a) - hundreds(b),
            tens(a) - tens(b),
            Math.abs(ones(a) - ones(b)),
          ),
      ],
      [
        "ten-not-reduced",
        "procedural",
        ([a = 0, b = 0]) =>
          keep(
            digit3(
              hundreds(a) - hundreds(b),
              tens(a) - tens(b),
              10 + ones(a) - ones(b),
            ),
            digit3(
              hundreds(a) - hundreds(b),
              tens(a) - tens(b),
              Math.abs(ones(a) - ones(b)),
            ),
          ),
      ],
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
    ],
  }),
  a5({
    id: "A5.column.06",
    form: "subtracting-across-a-zero",
    groups: [5, 5],
    draw: (r) => [100 * between(r, 4, 9), between(r, 101, 399)],
    valid: ([a = 0, b = 0]) => a > b && ones(b) !== 0 && tens(b) !== 0,
    solve: ([a = 0, b = 0]) => a - b,
    ref: ([a = 0, b = 0]) => a - 1 - b + 1,
    traps: [
      ["zero-skipped", "procedural", ([a = 0, b = 0]) => a - b + 10],
      [
        "smaller-from-larger",
        "procedural",
        ([a = 0, b = 0]) => digit3(hundreds(a) - hundreds(b), tens(b), ones(b)),
      ],
      ["hundreds-not-reduced", "procedural", ([a = 0, b = 0]) => a - b + 100],
    ],
  }),
  a5({
    id: "A5.column.07",
    form: "the-complement-to-1000",
    groups: [5, 5],
    draw: (r) => [between(r, 101, 899)],
    valid: ([a = 0]) => ones(a) !== 0,
    solve: ([a = 0]) => 1000 - a,
    ref: ([a = 0]) => digit3(9 - hundreds(a), 9 - tens(a), 10 - ones(a)),
    traps: [
      [
        "all-to-ten",
        "procedural",
        ([a = 0]) => digit3(10 - hundreds(a), 10 - tens(a), 10 - ones(a)),
      ],
      [
        "all-to-nine",
        "procedural",
        ([a = 0]) => digit3(9 - hundreds(a), 9 - tens(a), 9 - ones(a)),
      ],
      [
        "tens-to-ten",
        "procedural",
        ([a = 0]) => digit3(9 - hundreds(a), 10 - tens(a), 10 - ones(a)),
      ],
    ],
    consts: [1000],
  }),
  a5({
    id: "A5.column.08",
    form: "a-missing-addend-in-a-column-sum",
    groups: [5, 5],
    draw: (r) => [between(r, 120, 480), between(r, 250, 500)],
    valid: ([a = 0, b = 0]) => a + b < 1000,
    solve: ([a = 0]) => a,
    ref: ([a = 0, b = 0]) => a + b - b,
    traps: [
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
      [
        "smaller-from-larger",
        "procedural",
        ([a = 0, b = 0]) =>
          digit3(
            Math.abs(hundreds(a + b) - hundreds(b)),
            Math.abs(tens(a + b) - tens(b)),
            Math.abs(ones(a + b) - ones(b)),
          ),
      ],
      [
        "ten-not-reduced",
        "procedural",
        ([a = 0, b = 0]) => (ones(a + b) < ones(b) ? a + 10 : null),
      ],
    ],
    extra: ([a = 0, b = 0]) => ({ s: String(a + b) }),
  }),
  a5({
    id: "A5.column.09",
    form: "a-word-problem-with-a-three-digit-sum",
    groups: [5, 5],
    draw: (r) => [between(r, 150, 480), between(r, 120, 450)],
    valid: ([a = 0, b = 0]) => a !== b && a + b < 1000,
    solve: ([a = 0, b = 0]) => a + b,
    ref: ([a = 0, b = 0]) => b + a,
    traps: [
      ["difference", "procedural", ([a = 0, b = 0]) => Math.abs(a - b)],
      [
        "ones-carry-lost",
        "procedural",
        ([a = 0, b = 0]) => (ones(a) + ones(b) >= 10 ? a + b - 10 : null),
      ],
      [
        "tens-carry-lost",
        "procedural",
        ([a = 0, b = 0]) =>
          tens(a) + tens(b) + Math.floor((ones(a) + ones(b)) / 10) >= 10
            ? a + b - 100
            : null,
      ],
    ],
  }),
  a5({
    id: "A5.column.10",
    form: "a-word-problem-with-a-three-digit-difference",
    groups: [5, 5],
    draw: (r) => [between(r, 450, 980), between(r, 120, 440)],
    solve: ([a = 0, b = 0]) => a - b,
    ref: ([a = 0, b = 0]) => -(b - a),
    traps: [
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
      [
        "smaller-from-larger",
        "procedural",
        ([a = 0, b = 0]) =>
          digit3(
            Math.abs(hundreds(a) - hundreds(b)),
            Math.abs(tens(a) - tens(b)),
            Math.abs(ones(a) - ones(b)),
          ),
      ],
      [
        "ten-not-reduced",
        "procedural",
        ([a = 0, b = 0]) => (ones(a) < ones(b) ? a - b + 10 : null),
      ],
    ],
  }),
  a5({
    id: "A5.column.11",
    form: "find-the-right-answer-to-a-checked-sum",
    groups: [5, 6],
    origin: {
      extension: "checking a given answer, tussendoelen group 6 (RES-4283)",
    },
    draw: (r) => [
      between(r, 150, 480),
      between(r, 150, 480),
      pick(r, [-100, -10, 10, 100]),
    ],
    valid: ([a = 0, b = 0]) => a + b < 1000,
    solve: ([a = 0, b = 0]) => a + b,
    ref: ([a = 0, b = 0]) => b + a,
    traps: [
      ["stated-answer", "conceptual", ([a = 0, b = 0, c = 0]) => a + b + c],
      ["subtracted", "procedural", ([a = 0, b = 0]) => Math.abs(a - b)],
      [
        "ones-carry-lost",
        "procedural",
        ([a = 0, b = 0]) => (ones(a) + ones(b) >= 10 ? a + b - 10 : null),
      ],
    ],
    consts: [],
  }),
  a5({
    id: "A5.column.12",
    form: "a-difference-of-nearly-equal-numbers",
    groups: [5, 5],
    draw: (r) => [between(r, 301, 900), between(r, 2, 9)],
    solve: ([, b = 0]) => b,
    ref: ([a = 0, b = 0]) => a - (a - b),
    traps: [
      ["first-number-minus-gap", "conceptual", ([a = 0, b = 0]) => a - b],
      ["added", "procedural", ([a = 0, b = 0]) => a + (a - b)],
      [
        "smaller-from-larger",
        "procedural",
        ([a = 0, b = 0]) =>
          digit3(
            Math.abs(hundreds(a) - hundreds(a - b)),
            Math.abs(tens(a) - tens(a - b)),
            Math.abs(ones(a) - ones(a - b)),
          ),
      ],
    ],
    extra: ([a = 0, b = 0]) => ({ s: String(a - b) }),
  }),
  a5({
    id: "A5.column.13",
    form: "the-largest-sum-of-two-numbers-made-from-four-digits",
    groups: [5, 6],
    origin: {
      olympiad:
        "the largest value under a condition, digits in places (RES-4283, F14)",
    },
    draw: (r) => {
      const all = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const a = pick(r, all);
      const b = pick(
        r,
        all.filter((x) => x !== a),
      );
      const c = pick(
        r,
        all.filter((x) => x !== a && x !== b),
      );
      const d = pick(
        r,
        all.filter((x) => x !== a && x !== b && x !== c),
      );
      return [a, b, c, d];
    },
    solve: (v) => {
      const [p = 0, q = 0, u = 0, w = 0] = [...v].sort((x, y) => y - x);
      return 10 * (p + q) + u + w;
    },
    ref: (v) => {
      let best = 0;
      for (const i of [0, 1, 2, 3])
        for (const j of [0, 1, 2, 3]) {
          if (i === j) continue;
          const rest = [0, 1, 2, 3].filter((k) => k !== i && k !== j);
          for (const k of rest) {
            const l = rest.find((m) => m !== k) ?? 0;
            const total =
              10 * (v[i] ?? 0) + (v[k] ?? 0) + 10 * (v[j] ?? 0) + (v[l] ?? 0);
            if (total > best) best = total;
          }
        }
      return best;
    },
    traps: [
      [
        "the-large-digits-in-the-ones",
        "conceptual",
        (v) => {
          const [p = 0, q = 0, u = 0, w = 0] = [...v].sort((x, y) => y - x);
          return 10 * (u + w) + p + q;
        },
      ],
      [
        "the-digits-in-the-order-given",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => 10 * a + b + (10 * c + d),
      ],
      [
        "the-sum-of-the-digits",
        "conceptual",
        ([a = 0, b = 0, c = 0, d = 0]) => a + b + c + d,
      ],
    ],
    extra: (v) => {
      const [p = 0, q = 0, u = 0, w = 0] = [...v].sort((x, y) => y - x);
      return {
        x1: String(p),
        x2: String(q),
        x3: String(u),
        x4: String(w),
        ten: String(10 * (p + q)),
        one: String(u + w),
      };
    },
    consts: [10],
  }),
  forChoice(
    "A5",
    "column",
  )({
    id: "A5.column.14",
    form: "the-estimate-of-a-sum-rounded-to-hundreds",
    groups: [5, 6],
    kind: "choice",
    draw: (r) => [between(r, 130, 830), between(r, 130, 830), r.int(4)],
    valid: ([a = 0, b = 0]) =>
      a % 100 !== 0 &&
      b % 100 !== 0 &&
      Math.abs((a % 100) - 50) > 8 &&
      Math.abs((b % 100) - 50) > 8 &&
      a + b < 1000 &&
      ones(a) !== 0 &&
      ones(b) !== 0 &&
      Math.abs(a + b - Math.round(a / 100) * 100 - Math.round(b / 100) * 100) >
        20,
    solve: ([, , by = 0]) => placeOf(0, by),
    ref: ([a = 0, b = 0, by = 0]) => {
      const est = Math.round(a / 100) * 100 + Math.round(b / 100) * 100;
      return String(
        turn([est, est + 100, est - 100, a + b], by).findIndex(
          (x) => x === est,
        ) + 1,
      );
    },
    traps: [
      ["a-hundred-too-many", "procedural", ([, , by = 0]) => placeOf(1, by)],
      ["a-hundred-too-few", "procedural", ([, , by = 0]) => placeOf(2, by)],
      ["the-exact-sum", "conceptual", ([, , by = 0]) => placeOf(3, by)],
    ],
    options: () => FOUR,
    extra: ([a = 0, b = 0, by = 0]) => {
      const ra = Math.round(a / 100) * 100;
      const rb = Math.round(b / 100) * 100;
      const est = ra + rb;
      const list = turn([est, est + 100, est - 100, a + b], by);
      return {
        o1: String(list[0]),
        o2: String(list[1]),
        o3: String(list[2]),
        o4: String(list[3]),
        ra: String(ra),
        rb: String(rb),
        est: String(est),
        exact: String(a + b),
      };
    },
    consts: [1, 2, 3, 4],
  }),
  a5({
    id: "A5.column.15",
    form: "three-addends-in-a-column",
    groups: [5, 5],
    roles: { a: "first amount", b: "second amount", c: "third amount" },
    draw: (r) => [
      between(r, 120, 380),
      between(r, 120, 380),
      between(r, 120, 380),
    ],
    valid: ([a = 0, b = 0, c = 0]) =>
      a + b + c < 1000 &&
      ones(a) + ones(b) + ones(c) >= 10 &&
      new Set([a, b, c]).size === 3,
    solve: ([a = 0, b = 0, c = 0]) => a + b + c,
    ref: ([a = 0, b = 0, c = 0]) => {
      const o = ones(a) + ones(b) + ones(c);
      const t = tens(a) + tens(b) + tens(c) + Math.floor(o / 10);
      return (
        100 * (hundreds(a) + hundreds(b) + hundreds(c) + Math.floor(t / 10)) +
        10 * (t % 10) +
        (o % 10)
      );
    },
    traps: [
      ["two-addends-only", "procedural", ([a = 0, b = 0]) => a + b],
      [
        "ones-carry-lost",
        "procedural",
        ([a = 0, b = 0, c = 0]) =>
          a + b + c - 10 * Math.floor((ones(a) + ones(b) + ones(c)) / 10),
      ],
      [
        "carry-of-two-tens-lost",
        "procedural",
        ([a = 0, b = 0, c = 0]) => {
          const o = Math.floor((ones(a) + ones(b) + ones(c)) / 10);
          return o >= 2 ? a + b + c - 10 * (o - 1) : null;
        },
      ],
    ],
  }),
];

const a6 = forSubtype("A6", "by-one-digit");
const byOne = [
  a6({
    id: "A6.by-one-digit.01",
    form: "a-two-digit-number-by-one-digit-with-no-carry",
    groups: [5, 6],
    draw: (r) => [between(r, 11, 33), between(r, 2, 3)],
    valid: ([a = 0, b = 0]) =>
      tens(a) * b <= 9 && ones(a) * b <= 9 && ones(a) > 0,
    solve: ([a = 0, b = 0]) => a * b,
    ref: ([a = 0, b = 0]) => 10 * tens(a) * b + ones(a) * b,
    traps: [
      [
        "ones-only",
        "procedural",
        ([a = 0, b = 0]) => 10 * tens(a) + ones(a) * b,
      ],
      [
        "tens-only",
        "procedural",
        ([a = 0, b = 0]) => 10 * tens(a) * b + ones(a),
      ],
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
    ],
  }),
  a6({
    id: "A6.by-one-digit.02",
    form: "a-two-digit-number-by-one-digit-with-a-carry",
    groups: [5, 6],
    draw: (r) => [between(r, 14, 49), between(r, 3, 9)],
    valid: ([a = 0, b = 0]) => ones(a) * b >= 10 && ones(a) > 1,
    solve: ([a = 0, b = 0]) => a * b,
    ref: ([a = 0, b = 0]) =>
      10 * (tens(a) * b + Math.floor((ones(a) * b) / 10)) +
      ((ones(a) * b) % 10),
    traps: [
      [
        "carry-forgotten",
        "procedural",
        ([a = 0, b = 0]) => 10 * tens(a) * b + ((ones(a) * b) % 10),
      ],
      [
        "carry-multiplied",
        "procedural",
        ([a = 0, b = 0]) =>
          keep(
            10 * tens(a) * b * Math.floor((ones(a) * b) / 10) +
              ((ones(a) * b) % 10),
            10 * tens(a) * b + ((ones(a) * b) % 10),
          ),
      ],
      [
        "tens-not-multiplied",
        "procedural",
        ([a = 0, b = 0]) =>
          keep(
            10 * tens(a) + ones(a) * b,
            10 * tens(a) * b + ((ones(a) * b) % 10),
          ),
      ],
    ],
  }),
  a6({
    id: "A6.by-one-digit.03",
    form: "a-three-digit-number-by-one-digit",
    groups: [6, 6],
    draw: (r) => [between(r, 2, 9), between(r, 120, 399)],
    valid: ([d = 0, n = 0]) => d * n < 3000 && ones(n) > 0 && tens(n) > 0,
    solve: ([d = 0, n = 0]) => d * n,
    ref: ([d = 0, n = 0]) =>
      d * 100 * hundreds(n) + d * 10 * tens(n) + d * ones(n),
    traps: [
      ["hundreds-lost", "procedural", ([d = 0, n = 0]) => d * (n % 100)],
      [
        "carry-forgotten",
        "procedural",
        ([d = 0, n = 0]) => d * n - 10 * Math.floor((d * ones(n)) / 10),
      ],
      [
        "middle-digit-skipped",
        "procedural",
        ([d = 0, n = 0]) =>
          keep(d * (100 * hundreds(n) + ones(n)), d * (n % 100)),
      ],
    ],
  }),
  a6({
    id: "A6.by-one-digit.04",
    form: "splitting-a-factor-into-tens-and-ones",
    groups: [5, 6],
    draw: (r) => [between(r, 3, 9), between(r, 12, 59)],
    valid: ([, n = 0]) => ones(n) > 0 && n >= 20,
    solve: ([d = 0, n = 0]) => d * n,
    ref: ([d = 0, n = 0]) => d * (n - ones(n)) + d * ones(n),
    traps: [
      ["tens-part-only", "procedural", ([d = 0, n = 0]) => d * (n - ones(n))],
      ["ones-part-only", "procedural", ([d = 0, n = 0]) => d * ones(n)],
      [
        "ones-not-multiplied",
        "procedural",
        ([d = 0, n = 0]) => d * (n - ones(n)) + ones(n),
      ],
    ],
    extra: ([d = 0, n = 0]) => ({
      t: String(n - ones(n)),
      o: String(ones(n)),
      pt: String(d * (n - ones(n))),
      po: String(d * ones(n)),
    }),
  }),
  a6({
    id: "A6.by-one-digit.05",
    form: "the-price-of-several-items",
    groups: [5, 6],
    draw: (r) => [between(r, 3, 9), between(r, 13, 48)],
    valid: ([, n = 0]) => ones(n) > 0,
    solve: ([d = 0, n = 0]) => d * n,
    ref: ([d = 0, n = 0]) => sum(d, n),
    traps: [
      ["added", "procedural", ([d = 0, n = 0]) => d + n],
      ["ones-forgotten", "procedural", ([d = 0, n = 0]) => d * (n - ones(n))],
      [
        "carry-forgotten",
        "procedural",
        ([d = 0, n = 0]) => 10 * tens(n) * d + ((d * ones(n)) % 10),
      ],
    ],
  }),
  a6({
    id: "A6.by-one-digit.06",
    form: "a-missing-factor-in-a-bigger-product",
    groups: [6, 6],
    draw: (r) => [between(r, 3, 9), between(r, 12, 49)],
    valid: ([, n = 0]) => ones(n) > 0,
    solve: ([, n = 0]) => n,
    ref: ([d = 0, n = 0]) => (d * n) / d,
    traps: [
      ["divisor-as-answer", "conceptual", ([d = 0]) => d],
      ["subtracted", "procedural", ([d = 0, n = 0]) => d * n - d],
      ["tens-only", "procedural", ([d = 0, n = 0]) => keep(10 * tens(n), d)],
    ],
    extra: ([d = 0, n = 0]) => ({ p: String(d * n) }),
  }),
  a6({
    id: "A6.by-one-digit.07",
    form: "doubling-three-times",
    groups: [5, 6],
    draw: (r) => [between(r, 12, 98)],
    solve: ([a = 0]) => 8 * a,
    ref: ([a = 0]) => a * 2 * 2 * 2,
    traps: [
      ["adding-two", "conceptual", ([a = 0]) => 6 * a],
      ["doubled-twice", "conceptual", ([a = 0]) => 4 * a],
      ["doubled-four-times", "conceptual", ([a = 0]) => 16 * a],
    ],
  }),
  a6({
    id: "A6.by-one-digit.08",
    form: "rows-of-equal-length",
    groups: [5, 6],
    draw: (r) => [between(r, 4, 9), between(r, 104, 199)],
    valid: ([, n = 0]) => ones(n) > 0 && tens(n) > 0,
    solve: ([d = 0, n = 0]) => d * n,
    ref: ([d = 0, n = 0]) => sum(d, n),
    traps: [
      ["hundreds-lost", "procedural", ([d = 0, n = 0]) => d * (n % 100)],
      [
        "hundreds-not-multiplied",
        "procedural",
        ([d = 0, n = 0]) => 100 + d * (n % 100),
      ],
      ["added", "procedural", ([d = 0, n = 0]) => d + n],
      [
        "ones-carry-lost",
        "procedural",
        ([d = 0, n = 0]) => d * n - 10 * Math.floor((d * ones(n)) / 10),
      ],
    ],
  }),
  a6({
    id: "A6.by-one-digit.09",
    form: "how-much-more-for-more-items",
    groups: [6, 6],
    draw: (r) => [between(r, 3, 9), between(r, 25, 60), between(r, 12, 24)],
    valid: ([, a = 0, b = 0]) => a > b,
    solve: ([d = 0, a = 0, b = 0]) => d * (a - b),
    ref: ([d = 0, a = 0, b = 0]) => d * a - d * b,
    traps: [
      [
        "difference-unscaled",
        "procedural",
        ([d = 0, a = 0, b = 0]) => d * a - b,
      ],
      ["count-difference", "procedural", ([, a = 0, b = 0]) => a - b],
      ["price-of-more", "procedural", ([d = 0, a = 0]) => d * a],
    ],
  }),
  a6({
    id: "A6.by-one-digit.10",
    form: "two-products-added",
    groups: [6, 6],
    draw: (r) => [
      between(r, 3, 9),
      between(r, 12, 39),
      between(r, 3, 9),
      between(r, 12, 39),
    ],
    solve: ([a = 0, b = 0, c = 0, d = 0]) => a * b + c * d,
    ref: ([a = 0, b = 0, c = 0, d = 0]) => sum(a, b) + sum(c, d),
    traps: [
      [
        "factors-added",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => a + b + c + d,
      ],
      [
        "left-to-right",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => (a * b + c) * d,
      ],
      ["first-product-only", "procedural", ([a = 0, b = 0]) => a * b],
    ],
  }),
  a6({
    id: "A6.by-one-digit.11",
    form: "the-last-digit-of-a-product",
    groups: [5, 6],
    origin: {
      olympiad: "the last digit of a product, Kangaroo style (RES-4283, F13)",
    },
    draw: (r) => [between(r, 123, 987), between(r, 2, 9)],
    valid: ([a = 0, b = 0]) =>
      ones(a) > 1 &&
      (b * ones(a)) % 10 !== ones(a) &&
      (b * ones(a)) % 10 !== b &&
      (b * ones(a)) % 10 !== (b * tens(a)) % 10,
    solve: ([a = 0, b = 0]) => (a * b) % 10,
    ref: ([a = 0, b = 0]) => Number(String(a * b).slice(-1)),
    traps: [
      [
        "the-last-digit-of-the-first-factor",
        "conceptual",
        ([a = 0]) => ones(a),
      ],
      ["the-second-factor", "conceptual", ([, b = 0]) => b],
      [
        "the-tens-digit-multiplied",
        "procedural",
        ([a = 0, b = 0]) => (b * tens(a)) % 10,
      ],
    ],
    consts: [10],
  }),
  a6({
    id: "A6.by-one-digit.12",
    form: "the-change-from-a-note-for-several-items",
    groups: [5, 6],
    roles: { a: "count of items", b: "price of one item", c: "amount paid" },
    draw: (r) => {
      const d = between(r, 3, 9);
      const price = between(r, 12, 48);
      return [d, price, 100 * Math.ceil((d * price + 1) / 100)];
    },
    valid: ([d = 0, price = 0]) => d * price < 450 && ones(price) > 0,
    solve: ([d = 0, price = 0, k = 0]) => k - d * price,
    ref: ([d = 0, price = 0, k = 0]) => k - sum(d, price),
    traps: [
      [
        "the-price-of-the-items",
        "conceptual",
        ([d = 0, price = 0]) => d * price,
      ],
      [
        "the-price-of-one-item-taken-away",
        "procedural",
        ([, price = 0, k = 0]) => k - price,
      ],
      [
        "the-amount-and-the-price-added",
        "procedural",
        ([d = 0, price = 0, k = 0]) => k + d * price,
      ],
    ],
    extra: ([d = 0, price = 0]) => ({ t: String(d * price) }),
  }),
  a6({
    id: "A6.by-one-digit.13",
    form: "the-hidden-digit-of-a-factor",
    groups: [6, 6],
    origin: { olympiad: "a hidden digit in a product (RES-4283, F10)" },
    draw: (r) => [
      between(r, 2, 6),
      between(r, 1, 3),
      between(r, 1, 9),
      between(r, 1, 9),
    ],
    solve: ([, , x = 0]) => x,
    ref: ([d = 0, h = 0, x = 0, o = 0]) =>
      Array.from({ length: 10 }, (_, k) => k).find(
        (k) => d * (100 * h + 10 * k + o) === d * (100 * h + 10 * x + o),
      ) ?? -1,
    traps: [
      [
        "the-whole-factor",
        "conceptual",
        ([, h = 0, x = 0, o = 0]) => 100 * h + 10 * x + o,
      ],
      [
        "the-tens-digit-of-the-product",
        "conceptual",
        ([d = 0, h = 0, x = 0, o = 0]) =>
          keep(Math.floor((d * (100 * h + 10 * x + o)) / 10) % 10, x),
      ],
      ["the-next-digit", "procedural", ([, , x = 0]) => (x + 1) % 10],
    ],
    extra: ([d = 0, h = 0, x = 0, o = 0]) => ({
      p: String(d * (100 * h + 10 * x + o)),
      n: String(100 * h + 10 * x + o),
    }),
    consts: [10],
  }),
];

const a6a = forSubtype("A6a", "round-numbers");
const round = [
  a6a({
    id: "A6a.round-numbers.01",
    form: "multiplying-by-ten",
    groups: [5, 5],
    draw: (r) => [between(r, 2, 99)],
    solve: ([a = 0]) => a * 10,
    ref: ([a = 0]) => Number(`${a}0`),
    traps: [
      ["hundred", "procedural", ([a = 0]) => a * 100],
      ["same-number", "procedural", ([a = 0]) => a],
      ["added", "procedural", ([a = 0]) => a + 10],
    ],
    consts: [10],
  }),
  a6a({
    id: "A6a.round-numbers.02",
    form: "multiplying-by-a-hundred",
    groups: [5, 5],
    draw: (r) => [between(r, 2, 99)],
    solve: ([a = 0]) => a * 100,
    ref: ([a = 0]) => Number(`${a}00`),
    traps: [
      ["ten", "procedural", ([a = 0]) => a * 10],
      ["thousand", "procedural", ([a = 0]) => a * 1000],
      ["added", "procedural", ([a = 0]) => a + 100],
    ],
    consts: [100],
  }),
  a6a({
    id: "A6a.round-numbers.03",
    form: "a-one-digit-number-by-a-round-ten",
    groups: [5, 5],
    draw: (r) => [between(r, 2, 9), 10 * between(r, 2, 9)],
    solve: ([a = 0, b = 0]) => a * b,
    ref: ([a = 0, b = 0]) => a * (b / 10) * 10,
    traps: [
      ["zero-dropped", "procedural", ([a = 0, b = 0]) => a * (b / 10)],
      ["extra-zero", "procedural", ([a = 0, b = 0]) => 10 * a * b],
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
    ],
  }),
  a6a({
    id: "A6a.round-numbers.04",
    form: "a-round-ten-by-a-round-ten",
    groups: [5, 6],
    draw: (r) => [10 * between(r, 2, 9), 10 * between(r, 2, 9)],
    solve: ([a = 0, b = 0]) => a * b,
    ref: ([a = 0, b = 0]) => (a / 10) * (b / 10) * 100,
    traps: [
      ["one-zero", "procedural", ([a = 0, b = 0]) => (a / 10) * (b / 10) * 10],
      ["no-zeros", "procedural", ([a = 0, b = 0]) => (a / 10) * (b / 10)],
      [
        "extra-zero",
        "procedural",
        ([a = 0, b = 0]) => (a / 10) * (b / 10) * 1000,
      ],
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
    ],
  }),
  a6a({
    id: "A6a.round-numbers.05",
    form: "dividing-round-tens-by-a-digit",
    groups: [5, 5],
    draw: (r) => [between(r, 2, 9), 10 * between(r, 2, 9)],
    valid: ([d = 0, q = 0]) => d !== q / 10,
    solve: ([, q = 0]) => q,
    ref: ([d = 0, q = 0]) => (d * q) / d,
    traps: [
      ["zero-dropped", "procedural", ([, q = 0]) => q / 10],
      ["extra-zero", "procedural", ([, q = 0]) => q * 10],
      [
        "subtracted",
        "procedural",
        ([d = 0, q = 0]) => keep(d * q - d, q / 10, q * 10),
      ],
    ],
    extra: ([d = 0, q = 0]) => ({ c: String(d * q) }),
  }),
  a6a({
    id: "A6a.round-numbers.06",
    form: "dividing-round-hundreds-by-a-digit",
    groups: [5, 6],
    draw: (r) => [between(r, 2, 9), 100 * between(r, 2, 9)],
    valid: ([d = 0, q = 0]) => d !== q / 100,
    solve: ([, q = 0]) => q,
    ref: ([d = 0, q = 0]) => (d * q) / d,
    traps: [
      ["one-zero-lost", "procedural", ([, q = 0]) => q / 10],
      ["two-zeros-lost", "procedural", ([, q = 0]) => q / 100],
      ["extra-zero", "procedural", ([, q = 0]) => q * 10],
      [
        "subtracted",
        "procedural",
        ([d = 0, q = 0]) => keep(d * q - d, q / 10, q / 100, q * 10),
      ],
    ],
    extra: ([d = 0, q = 0]) => ({ c: String(d * q) }),
  }),
  a6a({
    id: "A6a.round-numbers.07",
    form: "multiplying-by-a-thousand",
    groups: [6, 6],
    draw: (r) => [between(r, 2, 99)],
    solve: ([a = 0]) => a * 1000,
    ref: ([a = 0]) => Number(`${a}000`),
    traps: [
      ["hundred", "procedural", ([a = 0]) => a * 100],
      ["ten-thousand", "procedural", ([a = 0]) => a * 10000],
      ["added", "procedural", ([a = 0]) => a + 1000],
    ],
    consts: [1000],
  }),
  a6a({
    id: "A6a.round-numbers.08",
    form: "a-round-hundred-by-a-digit",
    groups: [5, 6],
    draw: (r) => [100 * between(r, 2, 9), between(r, 2, 9)],
    solve: ([a = 0, b = 0]) => a * b,
    ref: ([a = 0, b = 0]) => (a / 100) * b * 100,
    traps: [
      ["one-zero", "procedural", ([a = 0, b = 0]) => (a / 100) * b * 10],
      ["zeros-dropped", "procedural", ([a = 0, b = 0]) => (a / 100) * b],
      ["extra-zero", "procedural", ([a = 0, b = 0]) => (a / 100) * b * 1000],
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
    ],
  }),
  a6a({
    id: "A6a.round-numbers.09",
    form: "dividing-a-round-number-by-a-round-ten",
    groups: [6, 6],
    draw: (r) => [10 * between(r, 2, 9), between(r, 2, 9)],
    valid: ([x = 0, q = 0]) => x / 10 !== q,
    solve: ([, q = 0]) => q,
    ref: ([x = 0, q = 0]) => (x * q) / x,
    traps: [
      ["extra-zero", "procedural", ([, q = 0]) => q * 10],
      ["divided-by-ten-only", "procedural", ([x = 0, q = 0]) => (x * q) / 10],
      [
        "subtracted",
        "procedural",
        ([x = 0, q = 0]) => keep(x * q - x, q * 10, (x * q) / 10),
      ],
    ],
    extra: ([x = 0, q = 0]) => ({ c: String(x * q) }),
  }),
  a6a({
    id: "A6a.round-numbers.10",
    form: "round-boxes-in-a-word-problem",
    groups: [5, 6],
    draw: (r) => [between(r, 3, 9), 10 * between(r, 2, 9)],
    solve: ([a = 0, b = 0]) => a * b,
    ref: ([a = 0, b = 0]) => sum(a, b),
    traps: [
      ["zero-dropped", "procedural", ([a = 0, b = 0]) => a * (b / 10)],
      ["extra-zero", "procedural", ([a = 0, b = 0]) => 10 * a * b],
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
    ],
  }),
  a6a({
    id: "A6a.round-numbers.11",
    form: "a-missing-round-factor",
    groups: [6, 6],
    draw: (r) => [10 * between(r, 2, 9), between(r, 2, 9)],
    valid: ([x = 0, q = 0]) => x / 10 !== q,
    solve: ([, q = 0]) => q,
    ref: ([x = 0, q = 0]) => (x * q) / x,
    traps: [
      ["extra-zero", "procedural", ([, q = 0]) => q * 10],
      ["divided-by-ten-only", "procedural", ([x = 0, q = 0]) => (x * q) / 10],
      [
        "subtracted",
        "procedural",
        ([x = 0, q = 0]) => keep(x * q - x, q * 10, (x * q) / 10),
      ],
    ],
    extra: ([x = 0, q = 0]) => ({ c: String(x * q) }),
  }),
  a6a({
    id: "A6a.round-numbers.12",
    form: "how-many-zeros-end-a-product",
    groups: [5, 6],
    origin: {
      olympiad: "trailing zeros of a product, Kangaroo style (RES-4283, F15)",
    },
    draw: (r) => [
      pick(r, [4, 5, 8, 12, 15, 16, 20, 25, 50]),
      pick(r, [4, 5, 8, 12, 15, 16, 20, 25, 50]),
      pick(r, [4, 5, 8, 12, 15, 16, 20, 25, 50]),
    ],
    valid: ([a = 0, b = 0, c = 0]) => {
      const z = zerosAtEnd(a * b * c);
      const naive = zerosAtEnd(a) + zerosAtEnd(b) + zerosAtEnd(c);
      return (
        z >= 1 && z <= 4 && naive !== z && z + 1 !== naive && a * b * c < 400000
      );
    },
    solve: ([a = 0, b = 0, c = 0]) => zerosAtEnd(a * b * c),
    ref: ([a = 0, b = 0, c = 0]) => {
      const text = String(a * b * c);
      return text.length - text.replace(/0+$/, "").length;
    },
    traps: [
      [
        "only-the-zeros-of-the-factors",
        "conceptual",
        ([a = 0, b = 0, c = 0]) =>
          zerosAtEnd(a) + zerosAtEnd(b) + zerosAtEnd(c),
      ],
      [
        "one-zero-too-many",
        "procedural",
        ([a = 0, b = 0, c = 0]) => zerosAtEnd(a * b * c) + 1,
      ],
      [
        "one-zero-too-few",
        "procedural",
        ([a = 0, b = 0, c = 0]) => zerosAtEnd(a * b * c) - 1,
      ],
    ],
    consts: [],
  }),
  forChoice(
    "A6a",
    "round-numbers",
  )({
    id: "A6a.round-numbers.13",
    form: "the-estimate-of-a-product-by-round-tens",
    groups: [5, 6],
    kind: "choice",
    draw: (r) => [between(r, 21, 79), between(r, 21, 79), r.int(4)],
    valid: ([a = 0, b = 0]) =>
      ones(a) !== 0 &&
      ones(b) !== 0 &&
      ones(a) !== 5 &&
      ones(b) !== 5 &&
      a * b !== roundTen(a) * roundTen(b),
    solve: ([, , by = 0]) => placeOf(0, by),
    ref: ([a = 0, b = 0, by = 0]) => {
      const est = roundTen(a) * roundTen(b);
      return String(
        turn([est, est / 10, est * 10, a * b], by).findIndex((x) => x === est) +
          1,
      );
    },
    traps: [
      ["a-zero-lost", "procedural", ([, , by = 0]) => placeOf(1, by)],
      ["a-zero-added", "procedural", ([, , by = 0]) => placeOf(2, by)],
      ["the-exact-product", "conceptual", ([, , by = 0]) => placeOf(3, by)],
    ],
    options: () => FOUR,
    extra: ([a = 0, b = 0, by = 0]) => {
      const est = roundTen(a) * roundTen(b);
      const list = turn([est, est / 10, est * 10, a * b], by);
      return {
        o1: String(list[0]),
        o2: String(list[1]),
        o3: String(list[2]),
        o4: String(list[3]),
        ra: String(roundTen(a)),
        rb: String(roundTen(b)),
        est: String(est),
        exact: String(a * b),
      };
    },
    consts: [1, 2, 3, 4],
  }),
  a6a({
    id: "A6a.round-numbers.14",
    form: "the-fewest-notes-for-a-round-sum",
    groups: [5, 5],
    origin: { olympiad: "the fewest notes, a greedy count (RES-4283, F14)" },
    roles: { a: "amount to pay out" },
    draw: (r) => [10 * between(r, 13, 96)],
    valid: ([a = 0]) => a % 100 !== 0,
    solve: ([a = 0]) => Math.floor(a / 100) + (a % 100) / 10,
    ref: ([a = 0]) => {
      let left = a;
      let count = 0;
      for (const note of [100, 10])
        while (left >= note) {
          left -= note;
          count += 1;
        }
      return count;
    },
    traps: [
      ["only-notes-of-ten", "procedural", ([a = 0]) => a / 10],
      ["the-rest-left-out", "procedural", ([a = 0]) => Math.floor(a / 100)],
      [
        "the-rest-counted-in-euros",
        "conceptual",
        ([a = 0]) => Math.floor(a / 100) + (a % 100),
      ],
    ],
    consts: [100, 10],
  }),
];

export const aSpecs2: readonly Spec<never>[] = [
  ...divide,
  ...column,
  ...byOne,
  ...round,
];
