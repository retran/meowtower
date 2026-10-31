// Domain A, part 1: adding and subtracting to 20 and 100, and the multiplication tables (RES-4283). The Dutch goals add and subtract to 20 at
// group 3, to 100 at group 4 and to 1,000 at group 5, and learn the tables at groups 4 and 5. Texts are
// plain blanks in `content/tasks-a.ru.json`, keyed by the template id.
import { between, pick } from "./draw.js";
import { forSubtype } from "./kit.js";
import type { Spec } from "./spec.js";

const sum = (n: number, x: number): number =>
  Array.from({ length: n }, () => x).reduce((p, q) => p + q, 0);
const ones = (n: number): number => n % 10;
const tens = (n: number): number => Math.floor(n / 10);

const keep = (x: number, ...not: number[]): number | null =>
  Number.isInteger(x) && x >= 0 && !not.includes(x) ? x : null;

const a1 = forSubtype("A1", "add-sub-20");
const add20 = [
  a1({
    id: "A1.add-sub-20.01",
    form: "a-sum-that-stays-below-ten",
    groups: [1, 2],
    draw: (r) => [between(r, 1, 6), between(r, 2, 4)],
    valid: ([a = 0, b = 0]) => a + b <= 9 && a !== b,
    solve: ([a = 0, b = 0]) => a + b,
    ref: ([a = 0, b = 0]) => sum(b, 1) + a,
    traps: [
      ["subtracted", "procedural", ([a = 0, b = 0]) => Math.abs(a - b)],
      ["counted-one-more", "procedural", ([a = 0, b = 0]) => a + b + 1],
      ["counted-one-less", "procedural", ([a = 0, b = 0]) => a + b - 1],
    ],
  }),
  a1({
    id: "A1.add-sub-20.02",
    form: "a-sum-across-ten",
    groups: [2, 3],
    draw: (r) => [between(r, 6, 9), between(r, 5, 9)],
    valid: ([a = 0, b = 0]) => a + b > 10,
    solve: ([a = 0, b = 0]) => a + b,
    ref: ([a = 0, b = 0]) => 10 + (b - (10 - a)),
    traps: [
      ["tens-forgotten", "procedural", ([a = 0, b = 0]) => a + b - 10],
      ["off-by-one", "procedural", ([a = 0, b = 0]) => a + b + 1],
      ["counted-one-less", "procedural", ([a = 0, b = 0]) => a + b - 1],
    ],
    consts: [10],
  }),
  a1({
    id: "A1.add-sub-20.03",
    form: "a-difference-within-ten",
    groups: [1, 2],
    draw: (r) => [between(r, 3, 10), between(r, 1, 7)],
    valid: ([a = 0, b = 0]) => a > b + 1,
    solve: ([a = 0, b = 0]) => a - b,
    ref: ([a = 0, b = 0]) =>
      Array.from({ length: a }, (_, i) => i + 1).filter((i) => i > b).length,
    traps: [
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
      ["counted-one-more", "procedural", ([a = 0, b = 0]) => a - b + 1],
      ["counted-one-less", "procedural", ([a = 0, b = 0]) => a - b - 1],
    ],
  }),
  a1({
    id: "A1.add-sub-20.04",
    form: "a-difference-across-ten",
    groups: [2, 3],
    draw: (r) => [between(r, 11, 18), between(r, 3, 9)],
    valid: ([a = 0, b = 0]) => ones(a) < b,
    solve: ([a = 0, b = 0]) => a - b,
    ref: ([a = 0, b = 0]) => 10 - (b - ones(a)),
    traps: [
      ["ones-swapped", "procedural", ([a = 0, b = 0]) => b - ones(a)],
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
      ["counted-one-more", "procedural", ([a = 0, b = 0]) => a - b + 1],
      ["counted-one-less", "procedural", ([a = 0, b = 0]) => a - b - 1],
    ],
    consts: [10],
  }),
  a1({
    id: "A1.add-sub-20.05",
    form: "a-missing-addend",
    groups: [2, 3],
    draw: (r) => [between(r, 2, 12), between(r, 13, 20)],
    solve: ([a = 0, b = 0]) => b - a,
    ref: ([a = 0, b = 0]) =>
      Array.from({ length: b }, (_, i) => i).filter((x) => x + a === b).length >
      0
        ? b - a
        : -1,
    traps: [
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
      [
        "counted-one-more",
        "procedural",
        ([a = 0, b = 0]) => keep(b - a + 1, a + b),
      ],
      [
        "counted-one-less",
        "procedural",
        ([a = 0, b = 0]) => keep(b - a - 1, a + b) || null,
      ],
    ],
  }),
  a1({
    id: "A1.add-sub-20.06",
    form: "a-missing-subtrahend",
    groups: [2, 3],
    origin: { extension: "Moro grade 2, find the subtrahend (RES-4283)" },
    draw: (r) => [between(r, 11, 20), between(r, 2, 9)],
    solve: ([a = 0, b = 0]) => a - b,
    ref: ([a = 0, b = 0]) =>
      Array.from({ length: a + 1 }, (_, x) => x).find((x) => a - x === b) !==
      undefined
        ? a - b
        : -1,
    traps: [
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
      ["counted-one-more", "procedural", ([a = 0, b = 0]) => a - b + 1],
      ["counted-one-less", "procedural", ([a = 0, b = 0]) => a - b - 1],
    ],
  }),
  a1({
    id: "A1.add-sub-20.07",
    form: "a-near-double",
    groups: [2, 3],
    draw: (r) => [between(r, 4, 9)],
    solve: ([a = 0]) => 2 * a + 1,
    ref: ([a = 0]) => a + (a + 1),
    traps: [
      ["double-only", "conceptual", ([a = 0]) => 2 * a],
      ["doubled-bigger", "conceptual", ([a = 0]) => 2 * a + 2],
    ],
    extra: ([a = 0]) => ({ n: String(a + 1) }),
  }),
  a1({
    id: "A1.add-sub-20.08",
    form: "a-word-problem-with-a-gain",
    groups: [2, 3],
    draw: (r) => [between(r, 5, 12), between(r, 3, 8)],
    valid: ([a = 0, b = 0]) => a + b <= 20,
    solve: ([a = 0, b = 0]) => a + b,
    ref: ([a = 0, b = 0]) => sum(b, 1) + a,
    traps: [
      ["difference", "procedural", ([a = 0, b = 0]) => Math.abs(a - b)],
      ["counted-one-more", "procedural", ([a = 0, b = 0]) => a + b + 1],
      ["counted-one-less", "procedural", ([a = 0, b = 0]) => a + b - 1],
    ],
  }),
  a1({
    id: "A1.add-sub-20.09",
    form: "how-many-more",
    groups: [2, 3],
    draw: (r) => [between(r, 11, 20), between(r, 3, 9)],
    solve: ([a = 0, b = 0]) => a - b,
    ref: ([a = 0, b = 0]) => -(b - a),
    traps: [
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
      ["counted-one-more", "procedural", ([a = 0, b = 0]) => a - b + 1],
      ["counted-one-less", "procedural", ([a = 0, b = 0]) => a - b - 1],
    ],
  }),
  a1({
    id: "A1.add-sub-20.10",
    form: "a-two-step-chain-within-twenty",
    groups: [3, 3],
    draw: (r) => [between(r, 3, 10), between(r, 3, 9), between(r, 2, 9)],
    valid: ([a = 0, b = 0, c = 0]) =>
      a + b <= 20 && c < a + b && a + b - c !== a + b + c,
    solve: ([a = 0, b = 0, c = 0]) => a + b - c,
    ref: ([a = 0, b = 0, c = 0]) => a - c + b,
    traps: [
      ["last-sign-lost", "procedural", ([a = 0, b = 0, c = 0]) => a + b + c],
      ["stopped-after-sum", "procedural", ([a = 0, b = 0]) => a + b],
      [
        "all-subtracted",
        "procedural",
        ([a = 0, b = 0, c = 0]) => keep(a - b - c, a + b),
      ],
    ],
    extra: ([a = 0, b = 0]) => ({ s: String(a + b) }),
  }),
  a1({
    id: "A1.add-sub-20.11",
    form: "a-thought-of-number-after-subtracting",
    groups: [3, 3],
    origin: {
      extension: "Moro grade 2, a hidden number from a clue (RES-4283)",
    },
    draw: (r) => [between(r, 3, 9), between(r, 4, 11)],
    valid: ([a = 0, b = 0]) => a !== b,
    solve: ([a = 0, b = 0]) => a + b,
    ref: ([a = 0, b = 0]) =>
      Array.from({ length: 21 }, (_, x) => x).filter((x) => x - a === b)[0] ??
      -1,
    traps: [
      ["subtracted-again", "procedural", ([a = 0, b = 0]) => Math.abs(b - a)],
      [
        "result-named",
        "procedural",
        ([a = 0, b = 0]) => keep(b, Math.abs(b - a)),
      ],
      ["counted-one-more", "procedural", ([a = 0, b = 0]) => a + b + 1],
    ],
  }),
  a1({
    id: "A1.add-sub-20.12",
    form: "the-number-that-makes-twenty",
    groups: [3, 3],
    draw: (r) => [between(r, 11, 19)],
    solve: ([a = 0]) => 20 - a,
    ref: ([a = 0]) => 10 - ones(a),
    traps: [
      ["ones-only", "conceptual", ([a = 0]) => ones(a)],
      ["counted-one-more", "procedural", ([a = 0]) => 20 - a + 1],
      [
        "counted-one-less",
        "procedural",
        ([a = 0]) => keep(20 - a - 1, ones(a)),
      ],
    ],
    valid: ([a = 0]) => ones(a) !== 10 - ones(a),
    consts: [20],
  }),
];

const a2 = forSubtype("A2", "mental-100");
const mental = [
  a2({
    id: "A2.mental-100.01",
    form: "tens-plus-tens",
    groups: [4, 4],
    draw: (r) => [10 * between(r, 1, 6), 10 * between(r, 1, 4)],
    solve: ([a = 0, b = 0]) => a + b,
    ref: ([a = 0, b = 0]) => 10 * (tens(a) + tens(b)),
    traps: [
      ["no-zero", "procedural", ([a = 0, b = 0]) => tens(a) + tens(b)],
      [
        "extra-zero",
        "procedural",
        ([a = 0, b = 0]) => 100 * (tens(a) + tens(b)),
      ],
      [
        "subtracted",
        "procedural",
        ([a = 0, b = 0]) => keep(Math.abs(a - b), tens(a) + tens(b)),
      ],
    ],
  }),
  a2({
    id: "A2.mental-100.02",
    form: "two-digit-plus-ones-staying-in-the-tens",
    groups: [4, 4],
    draw: (r) => [between(r, 21, 85), between(r, 2, 6)],
    valid: ([a = 0, b = 0]) => ones(a) + b <= 9 && ones(a) > 0,
    solve: ([a = 0, b = 0]) => a + b,
    ref: ([a = 0, b = 0]) => 10 * tens(a) + ones(a) + b,
    traps: [
      ["tens-added", "conceptual", ([a = 0, b = 0]) => a + 10 * b],
      ["subtracted", "procedural", ([a = 0, b = 0]) => a - b],
      ["ones-replaced", "procedural", ([a = 0, b = 0]) => 10 * tens(a) + b],
    ],
  }),
  a2({
    id: "A2.mental-100.03",
    form: "two-digit-plus-ones-across-a-ten",
    groups: [4, 4],
    draw: (r) => [between(r, 21, 89), between(r, 3, 9)],
    valid: ([a = 0, b = 0]) => ones(a) + b >= 11,
    solve: ([a = 0, b = 0]) => a + b,
    ref: ([a = 0, b = 0]) => 10 * (tens(a) + 1) + (ones(a) + b - 10),
    traps: [
      [
        "carry-forgotten",
        "procedural",
        ([a = 0, b = 0]) => 10 * tens(a) + ((ones(a) + b) % 10),
      ],
      ["subtracted", "procedural", ([a = 0, b = 0]) => a - b],
      [
        "tens-added",
        "conceptual",
        ([a = 0, b = 0]) =>
          keep(a + 10 * b, 10 * tens(a) + ((ones(a) + b) % 10)),
      ],
    ],
  }),
  a2({
    id: "A2.mental-100.04",
    form: "two-digit-plus-two-digit",
    groups: [4, 4],
    draw: (r) => [between(r, 12, 66), between(r, 12, 33)],
    valid: ([a = 0, b = 0]) => ones(a) + ones(b) >= 10 && a + b <= 100,
    solve: ([a = 0, b = 0]) => a + b,
    ref: ([a = 0, b = 0]) =>
      10 * (tens(a) + tens(b) + 1) + (ones(a) + ones(b) - 10),
    traps: [
      [
        "carry-forgotten",
        "procedural",
        ([a = 0, b = 0]) =>
          10 * (tens(a) + tens(b)) + ((ones(a) + ones(b)) % 10),
      ],
      [
        "subtracted",
        "procedural",
        ([a = 0, b = 0]) =>
          keep(
            Math.abs(a - b),
            10 * (tens(a) + tens(b)) + ((ones(a) + ones(b)) % 10),
          ),
      ],
      [
        "second-tens-lost",
        "procedural",
        ([a = 0, b = 0]) =>
          keep(
            a + ones(b),
            Math.abs(a - b),
            10 * (tens(a) + tens(b)) + ((ones(a) + ones(b)) % 10),
          ),
      ],
    ],
  }),
  a2({
    id: "A2.mental-100.05",
    form: "tens-minus-tens",
    groups: [4, 4],
    draw: (r) => [10 * between(r, 4, 10), 10 * between(r, 1, 3)],
    solve: ([a = 0, b = 0]) => a - b,
    ref: ([a = 0, b = 0]) => 10 * (tens(a) - tens(b)),
    traps: [
      ["no-zero", "procedural", ([a = 0, b = 0]) => tens(a) - tens(b)],
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
      [
        "extra-zero",
        "procedural",
        ([a = 0, b = 0]) => 100 * (tens(a) - tens(b)),
      ],
    ],
  }),
  a2({
    id: "A2.mental-100.06",
    form: "two-digit-minus-ones-across-a-ten",
    groups: [4, 4],
    draw: (r) => [between(r, 21, 95), between(r, 3, 9)],
    valid: ([a = 0, b = 0]) => ones(a) < b,
    solve: ([a = 0, b = 0]) => a - b,
    ref: ([a = 0, b = 0]) => 10 * (tens(a) - 1) + (10 + ones(a) - b),
    traps: [
      [
        "ones-swapped",
        "procedural",
        ([a = 0, b = 0]) => 10 * tens(a) + (b - ones(a)),
      ],
      [
        "ten-not-reduced",
        "procedural",
        ([a = 0, b = 0]) =>
          keep(10 * tens(a) + (10 + ones(a) - b), 10 * tens(a) + (b - ones(a))),
      ],
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
    ],
  }),
  a2({
    id: "A2.mental-100.07",
    form: "two-digit-minus-two-digit",
    groups: [4, 4],
    draw: (r) => [between(r, 41, 98), between(r, 12, 39)],
    valid: ([a = 0, b = 0]) => ones(b) > ones(a),
    solve: ([a = 0, b = 0]) => a - b,
    ref: ([a = 0, b = 0]) =>
      10 * (tens(a) - tens(b) - 1) + (10 + ones(a) - ones(b)),
    traps: [
      [
        "smaller-from-larger",
        "procedural",
        ([a = 0, b = 0]) =>
          10 * (tens(a) - tens(b)) + Math.abs(ones(a) - ones(b)),
      ],
      [
        "ten-not-reduced",
        "procedural",
        ([a = 0, b = 0]) =>
          keep(
            10 * (tens(a) - tens(b)) + (10 + ones(a) - ones(b)),
            10 * (tens(a) - tens(b)) + Math.abs(ones(a) - ones(b)),
          ),
      ],
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
    ],
  }),
  a2({
    id: "A2.mental-100.08",
    form: "the-complement-to-100",
    groups: [4, 4],
    draw: (r) => [between(r, 11, 89)],
    valid: ([a = 0]) => ones(a) !== 0 && ones(a) !== 5,
    solve: ([a = 0]) => 100 - a,
    ref: ([a = 0]) => 10 * (9 - tens(a)) + (10 - ones(a)),
    traps: [
      [
        "both-to-ten",
        "procedural",
        ([a = 0]) => 10 * (10 - tens(a)) + (10 - ones(a)),
      ],
      [
        "both-to-nine",
        "procedural",
        ([a = 0]) => 10 * (9 - tens(a)) + (9 - ones(a)),
      ],
      ["to-next-ten-only", "procedural", ([a = 0]) => 10 - ones(a)],
    ],
    consts: [100],
  }),
  a2({
    id: "A2.mental-100.09",
    form: "what-to-add-to-reach-a-round-number",
    groups: [4, 4],
    draw: (r) => [between(r, 11, 78), 10 * between(r, 5, 10)],
    valid: ([a = 0, b = 0]) => b > a && ones(a) !== 0,
    solve: ([a = 0, b = 0]) => b - a,
    ref: ([a = 0, b = 0]) =>
      Array.from({ length: 101 }, (_, x) => x).filter((x) => a + x === b)[0] ??
      -1,
    traps: [
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
      [
        "ones-copied",
        "procedural",
        ([a = 0, b = 0]) => 10 * (tens(b) - tens(a)) + ones(a),
      ],
      ["to-next-ten-only", "procedural", ([a = 0]) => 10 - ones(a)],
    ],
  }),
  a2({
    id: "A2.mental-100.10",
    form: "jumps-of-tens-and-ones",
    groups: [4, 4],
    draw: (r) => [between(r, 11, 40), between(r, 1, 4), between(r, 1, 9)],
    solve: ([a = 0, b = 0, c = 0]) => a + 10 * b + c,
    ref: ([a = 0, b = 0, c = 0]) => a + c + sum(b, 10),
    traps: [
      ["counts-only", "procedural", ([a = 0, b = 0, c = 0]) => a + b + c],
      [
        "sizes-swapped",
        "procedural",
        ([a = 0, b = 0, c = 0]) => keep(a + 10 * c + b, a + b + c),
      ],
      [
        "one-jump-of-ten",
        "procedural",
        ([a = 0, b = 0, c = 0]) => keep(a + 10 + c, a + b + c, a + 10 * c + b),
      ],
    ],
  }),
  a2({
    id: "A2.mental-100.11",
    form: "a-word-problem-with-two-amounts",
    groups: [4, 4],
    draw: (r) => [between(r, 24, 58), between(r, 15, 39)],
    valid: ([a = 0, b = 0]) => a + b <= 100 && a !== b,
    solve: ([a = 0, b = 0]) => a + b,
    ref: ([a = 0, b = 0]) => b + a,
    traps: [
      ["difference", "procedural", ([a = 0, b = 0]) => Math.abs(a - b)],
      [
        "carry-forgotten",
        "procedural",
        ([a = 0, b = 0]) =>
          10 * (tens(a) + tens(b)) + ((ones(a) + ones(b)) % 10),
      ],
      [
        "second-tens-lost",
        "procedural",
        ([a = 0, b = 0]) =>
          keep(
            a + ones(b),
            Math.abs(a - b),
            10 * (tens(a) + tens(b)) + ((ones(a) + ones(b)) % 10),
          ),
      ],
    ],
  }),
  a2({
    id: "A2.mental-100.12",
    form: "a-word-problem-with-a-difference",
    groups: [4, 4],
    draw: (r) => [between(r, 52, 95), between(r, 18, 47)],
    valid: ([a = 0, b = 0]) => ones(b) > ones(a),
    solve: ([a = 0, b = 0]) => a - b,
    ref: ([a = 0, b = 0]) => -(b - a),
    traps: [
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
      [
        "smaller-from-larger",
        "procedural",
        ([a = 0, b = 0]) =>
          10 * (tens(a) - tens(b)) + Math.abs(ones(a) - ones(b)),
      ],
      [
        "ten-not-reduced",
        "procedural",
        ([a = 0, b = 0]) =>
          keep(
            10 * (tens(a) - tens(b)) + (10 + ones(a) - ones(b)),
            10 * (tens(a) - tens(b)) + Math.abs(ones(a) - ones(b)),
          ),
      ],
    ],
  }),
];

const a3 = forSubtype("A3", "table");
const table = [
  a3({
    id: "A3.table.01",
    form: "a-product-from-the-tables-of-2-5-and-10",
    groups: [4, 4],
    draw: (r) => [pick(r, [2, 5, 10]), between(r, 3, 10)],
    valid: ([a = 0, b = 0]) => a !== b && a + b !== a * b,
    solve: ([a = 0, b = 0]) => a * b,
    ref: ([a = 0, b = 0]) => sum(b, a),
    traps: [
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
      ["neighbour-above", "fact", ([a = 0, b = 0]) => keep(a * (b + 1), a + b)],
      ["neighbour-below", "fact", ([a = 0, b = 0]) => keep(a * (b - 1), a + b)],
    ],
  }),
  a3({
    id: "A3.table.02",
    form: "a-product-from-the-tables-of-3-and-4",
    groups: [4, 5],
    draw: (r) => [pick(r, [3, 4]), between(r, 3, 10)],
    valid: ([a = 0, b = 0]) => a !== b,
    solve: ([a = 0, b = 0]) => a * b,
    ref: ([a = 0, b = 0]) => sum(a, b),
    traps: [
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
      ["neighbour-above", "fact", ([a = 0, b = 0]) => keep(a * (b + 1), a + b)],
      ["neighbour-below", "fact", ([a = 0, b = 0]) => keep(a * (b - 1), a + b)],
    ],
  }),
  a3({
    id: "A3.table.03",
    form: "a-product-from-the-tables-of-6-to-9",
    groups: [5, 5],
    draw: (r) => [between(r, 6, 9), between(r, 6, 9)],
    valid: ([a = 0, b = 0]) => a !== b,
    solve: ([a = 0, b = 0]) => a * b,
    ref: ([a = 0, b = 0]) => a * 5 + a * (b - 5),
    traps: [
      ["neighbour-fact", "fact", ([a = 0, b = 0]) => a * (b + 1)],
      ["neighbour-below", "fact", ([a = 0, b = 0]) => a * (b - 1)],
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
    ],
  }),
  a3({
    id: "A3.table.04",
    form: "a-missing-factor",
    groups: [4, 5],
    draw: (r) => [between(r, 2, 9), between(r, 3, 10)],
    valid: ([a = 0, b = 0]) => a !== b,
    solve: ([, b = 0]) => b,
    ref: ([a = 0, b = 0]) =>
      Array.from({ length: 11 }, (_, x) => x).find((x) => a * x === a * b) ??
      -1,
    traps: [
      ["product-minus-factor", "procedural", ([a = 0, b = 0]) => a * b - a],
      ["neighbour-above", "fact", ([a = 0, b = 0]) => keep(b + 1, a * b - a)],
      [
        "neighbour-below",
        "fact",
        ([a = 0, b = 0]) => keep(b - 1, a * b - a, b + 1),
      ],
    ],
    extra: ([a = 0, b = 0]) => ({ p: String(a * b) }),
  }),
  a3({
    id: "A3.table.05",
    form: "a-repeated-sum",
    groups: [4, 4],
    draw: (r) => [between(r, 3, 9), between(r, 3, 8)],
    valid: ([a = 0, b = 0]) => a !== b && a * b !== a + b,
    solve: ([a = 0, b = 0]) => a * b,
    ref: ([a = 0, b = 0]) =>
      Array.from({ length: b }).reduce<number>((acc) => acc + a, 0),
    traps: [
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
      [
        "one-repeat-short",
        "fact",
        ([a = 0, b = 0]) => keep(a * (b - 1), a + b),
      ],
      [
        "one-repeat-extra",
        "fact",
        ([a = 0, b = 0]) => keep(a * (b + 1), a + b),
      ],
    ],
  }),
  a3({
    id: "A3.table.06",
    form: "equal-groups-in-a-word-problem",
    groups: [4, 5],
    draw: (r) => [between(r, 3, 9), between(r, 3, 9)],
    valid: ([a = 0, b = 0]) => a !== b,
    solve: ([a = 0, b = 0]) => a * b,
    ref: ([a = 0, b = 0]) => sum(a, b),
    traps: [
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
      ["one-box-more", "fact", ([a = 0, b = 0]) => keep((a + 1) * b, a + b)],
      ["one-box-less", "fact", ([a = 0, b = 0]) => keep((a - 1) * b, a + b)],
    ],
  }),
  a3({
    id: "A3.table.07",
    form: "a-neighbouring-fact-from-a-known-one",
    groups: [5, 5],
    draw: (r) => [between(r, 3, 9)],
    solve: ([a = 0]) => 6 * a,
    ref: ([a = 0]) => 5 * a + a,
    traps: [
      ["plus-one", "procedural", ([a = 0]) => 5 * a + 1],
      ["known-fact-reused", "procedural", ([a = 0]) => 5 * a],
      ["added-six", "procedural", ([a = 0]) => 5 * a + 6],
    ],
    extra: ([a = 0]) => ({ k: String(5 * a) }),
    valid: ([a = 0]) => 5 * a + 1 !== 6 * a,
    consts: [5, 6],
  }),
  a3({
    id: "A3.table.08",
    form: "multiplying-by-zero-and-by-one",
    groups: [4, 5],
    draw: (r) => [between(r, 2, 9), between(r, 0, 1)],
    solve: ([a = 0, b = 0]) => a * b,
    ref: ([a = 0, b = 0]) => (b === 0 ? 0 : a),
    traps: [
      ["added", "procedural", ([a = 0, b = 0]) => (b === 0 ? null : a + b)],
      ["zero-ignored", "procedural", ([a = 0, b = 0]) => (b === 0 ? a : null)],
      ["one-gives-zero", "procedural", ([, b = 0]) => (b === 1 ? 0 : null)],
    ],
    consts: [0, 1],
  }),
  a3({
    id: "A3.table.09",
    form: "a-square-number",
    groups: [5, 5],
    draw: (r) => [between(r, 3, 10)],
    solve: ([a = 0]) => a * a,
    ref: ([a = 0]) => sum(a, a),
    traps: [
      ["doubled", "conceptual", ([a = 0]) => a + a],
      ["neighbour-above", "fact", ([a = 0]) => keep(a * (a + 1), a + a)],
      [
        "neighbour-below",
        "fact",
        ([a = 0]) => keep(a * (a - 1), a + a, a * (a + 1)),
      ],
    ],
  }),
  a3({
    id: "A3.table.10",
    form: "several-times-longer",
    groups: [5, 5],
    origin: {
      extension: "comparison by how many times, Russian grade 3 (RES-4283)",
    },
    draw: (r) => [between(r, 5, 10), between(r, 3, 9)],
    solve: ([a = 0, b = 0]) => a * b,
    ref: ([a = 0, b = 0]) => sum(a, b),
    traps: [
      ["longer-by", "conceptual", ([a = 0, b = 0]) => a + b],
      ["original-added", "fact", ([a = 0, b = 0]) => keep((a + 1) * b, a + b)],
      [
        "original-taken-away",
        "fact",
        ([a = 0, b = 0]) => keep((a - 1) * b, a + b),
      ],
    ],
  }),
  a3({
    id: "A3.table.11",
    form: "the-area-of-a-rectangle-in-squares",
    groups: [5, 5],
    draw: (r) => [between(r, 3, 9), between(r, 3, 9)],
    valid: ([a = 0, b = 0]) => a !== b,
    solve: ([a = 0, b = 0]) => a * b,
    ref: ([a = 0, b = 0]) => sum(b, a),
    traps: [
      ["perimeter", "conceptual", ([a = 0, b = 0]) => 2 * (a + b)],
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
      [
        "one-row-more",
        "fact",
        ([a = 0, b = 0]) => keep((a + 1) * b, 2 * (a + b), a + b),
      ],
    ],
  }),
];
export const aSpecs1: readonly Spec<never>[] = [...add20, ...mental, ...table];
