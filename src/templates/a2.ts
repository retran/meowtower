// Domain A, part 2: dividing with the tables, column work to 1,000, multiplying by one digit and by
// round numbers (RES-4283). The Dutch goals divide from the tables at group 5, add and subtract to
// 1,000 at group 5 and multiply by one digit with a split at group 5 to 6. Texts are plain blanks in
// `content/tasks-a.ru.json`, keyed by the template id.
import { between, pick } from "./draw.js";
import { forSubtype } from "./kit.js";
import type { Spec } from "./spec.js";

const sum = (n: number, x: number): number =>
  Array.from({ length: n }, () => x).reduce((p, q) => p + q, 0);
const ones = (n: number): number => n % 10;
const tens = (n: number): number => Math.floor(n / 10) % 10;
const hundreds = (n: number): number => Math.floor(n / 100);

const keep = (x: number, ...not: number[]): number | null =>
  Number.isInteger(x) && x >= 0 && !not.includes(x) ? x : null;

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
];

export const aSpecs2: readonly Spec<never>[] = [
  ...divide,
  ...column,
  ...byOne,
  ...round,
];
