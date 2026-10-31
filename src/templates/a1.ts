// Domain A, part 1: adding and subtracting to 20 and 100, and the multiplication tables (RES-4283). The Dutch goals add and subtract to 20 at
// group 3, to 100 at group 4 and to 1,000 at group 5, and learn the tables at groups 4 and 5. Texts are
// plain blanks in `content/tasks-a.ru.json`, keyed by the template id.
import { between, pick } from "./draw.js";
import { arith, type Arith } from "./kit.js";
import { forFraction, q } from "./kitf.js";
import type { Spec } from "./spec.js";

/** The short form of `kit.ts` with the roles of the numbers, which a story writer needs (ADR-0130). */
export interface ArithA extends Arith {
  readonly roles?: Readonly<Record<string, string>>;
}
export const forSubtype =
  (node: string, subtype: string) =>
  (o: ArithA): Spec<never> => {
    const spec = arith(node, subtype, o);
    return o.roles ? ({ ...spec, roles: o.roles } as Spec<never>) : spec;
  };
/** The same for a task answered by a button: the answer and the traps are option numbers as text. */
export const forChoice = forFraction;
export { q };
/** The option numbers "1" to "4" of a choice task. */
export const FOUR = ["1", "2", "3", "4"];
/** Where the option at `index` of the list lands when the list is turned by `by` places, as a number text. */
export const placeOf = (index: number, by: number): string =>
  String(((index - by + 4) % 4) + 1);
/** The list turned by `by` places, so that the right option is not always the first. */
export const turn = <T>(list: readonly T[], by: number): T[] =>
  list.map((_, i) => list[(i + by) % list.length] as T);

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
    draw: (r) => [between(r, 4, 10), between(r, 2, 7)],
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
    roles: { a: "count in the first box", b: "count in the second box" },
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
    roles: { a: "count in the larger pile", b: "count in the smaller pile" },
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
      a + b <= 20 && c < a + b && c !== a && c !== b,
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
    roles: { a: "amount taken away", b: "what is left" },
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
    roles: { a: "amount already there" },
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
  a1({
    id: "A1.add-sub-20.13",
    form: "how-many-numbers-lie-between",
    groups: [2, 3],
    origin: {
      olympiad:
        "counting the numbers between two numbers, a fence-post count (RES-4283, F15)",
    },
    draw: (r) => {
      const a = between(r, 2, 11);
      return [a, a + between(r, 4, 9)];
    },
    valid: ([, b = 0]) => b <= 20,
    solve: ([a = 0, b = 0]) => b - a - 1,
    ref: ([a = 0, b = 0]) =>
      Array.from({ length: 21 }, (_, x) => x).filter((x) => x > a && x < b)
        .length,
    traps: [
      ["both-ends-counted", "conceptual", ([a = 0, b = 0]) => b - a + 1],
      ["one-end-counted", "conceptual", ([a = 0, b = 0]) => b - a],
    ],
    consts: [1, 2],
  }),
  forChoice(
    "A1",
    "add-sub-20",
  )({
    id: "A1.add-sub-20.14",
    form: "the-true-equality-among-four",
    groups: [2, 3],
    kind: "choice",
    draw: (r) => {
      const x = between(r, 3, 12);
      const y = between(r, 3, 9);
      return [x, y, x + y, r.int(4)];
    },
    valid: ([, , z = 0]) => z <= 20,
    solve: ([, , , by = 0]) => placeOf(0, by),
    ref: ([x = 0, y = 0, z = 0, by = 0]) =>
      String(
        turn(
          [x + y === z, z + y === x, z - y === x + 1, z - x === y + 1],
          by,
        ).findIndex(Boolean) + 1,
      ),
    traps: [
      [
        "added-instead-of-subtracted",
        "procedural",
        ([, , , by = 0]) => placeOf(1, by),
      ],
      [
        "difference-one-too-big",
        "procedural",
        ([, , , by = 0]) => placeOf(2, by),
      ],
      [
        "difference-one-too-small",
        "procedural",
        ([, , , by = 0]) => placeOf(3, by),
      ],
    ],
    options: () => FOUR,
    extra: ([x = 0, y = 0, z = 0, by = 0]) => {
      const list = turn(
        [
          `${x} + ${y} = ${z}`,
          `${z} + ${y} = ${x}`,
          `${z} − ${y} = ${x + 1}`,
          `${z} − ${x} = ${y + 1}`,
        ],
        by,
      );
      return {
        o1: list[0] ?? "",
        o2: list[1] ?? "",
        o3: list[2] ?? "",
        o4: list[3] ?? "",
        t: `${x} + ${y} = ${z}`,
      };
    },
    consts: [1, 2, 3, 4],
  }),
  a1({
    id: "A1.add-sub-20.15",
    form: "a-thought-of-number-after-two-steps",
    groups: [3, 4],
    origin: { olympiad: "working backwards through two steps (RES-4283, F12)" },
    roles: { a: "amount added", b: "amount taken away", c: "final result" },
    draw: (r) => {
      const x = between(r, 2, 12);
      const a = between(r, 3, 9);
      const b = between(r, 2, 9);
      return [a, b, x + a - b];
    },
    valid: ([a = 0, b = 0, c = 0]) => c >= 3 && b !== a && c + b - a >= 2,
    solve: ([a = 0, b = 0, c = 0]) => c + b - a,
    ref: ([a = 0, b = 0, c = 0]) =>
      Array.from({ length: 31 }, (_, x) => x).find((x) => x + a - b === c) ??
      -1,
    traps: [
      ["steps-repeated", "procedural", ([a = 0, b = 0, c = 0]) => c + a - b],
      [
        "both-subtracted",
        "procedural",
        ([a = 0, b = 0, c = 0]) => keep(c - a - b, c + a - b),
      ],
      [
        "first-step-undone-only",
        "procedural",
        ([a = 0, b = 0, c = 0]) => keep(c - a, c + a - b, c - a - b),
      ],
    ],
    extra: ([, b = 0, c = 0]) => ({ s: String(c + b) }),
  }),
  a1({
    id: "A1.add-sub-20.16",
    form: "the-larger-of-two-numbers-from-sum-and-difference",
    groups: [3, 5],
    origin: {
      olympiad:
        "a sum and a difference of two numbers, Kangaroo style (RES-4283, F12)",
    },
    roles: { a: "sum of two numbers", b: "difference of the two numbers" },
    draw: (r) => {
      const small = between(r, 2, 9);
      const d = between(r, 2, 6);
      return [2 * small + d, d];
    },
    valid: ([a = 0]) => a <= 20,
    solve: ([a = 0, b = 0]) => (a + b) / 2,
    ref: ([a = 0, b = 0]) =>
      Array.from({ length: a + 1 }, (_, x) => x).find(
        (x) => x >= b && x + (x - b) === a,
      ) ?? -1,
    traps: [
      ["the-smaller-number", "conceptual", ([a = 0, b = 0]) => (a - b) / 2],
      ["difference-taken-away-only", "procedural", ([a = 0, b = 0]) => a - b],
      [
        "half-of-the-sum",
        "conceptual",
        ([a = 0, b = 0]) =>
          a % 2 === 0 ? keep(a / 2, (a + b) / 2, (a - b) / 2, a - b) : null,
      ],
    ],
    consts: [2],
  }),
  forChoice(
    "A1",
    "add-sub-20",
  )({
    id: "A1.add-sub-20.17",
    form: "the-sum-of-two-odd-numbers",
    groups: [3, 5],
    kind: "choice",
    origin: { olympiad: "parity of a sum, Kangaroo style (RES-4283, F13)" },
    draw: (r) => {
      const even = 2 * between(r, 4, 9);
      const odd = [1, 3, 5, 7, 9].map((k) => 2 * k + 1);
      const first = pick(r, odd);
      const second = pick(
        r,
        odd.filter((k) => k !== first),
      );
      const third = pick(
        r,
        odd.filter((k) => k !== first && k !== second),
      );
      return [even, first, second, third, r.int(4)];
    },
    solve: ([, , , , by = 0]) => placeOf(0, by),
    ref: ([e = 0, f = 0, s = 0, t = 0, by = 0]) =>
      String(turn([e, f, s, t], by).findIndex((x) => x % 2 === 0) + 1),
    traps: [
      [
        "an-odd-number-first",
        "conceptual",
        ([, , , , by = 0]) => placeOf(1, by),
      ],
      [
        "an-odd-number-second",
        "conceptual",
        ([, , , , by = 0]) => placeOf(2, by),
      ],
      [
        "an-odd-number-third",
        "conceptual",
        ([, , , , by = 0]) => placeOf(3, by),
      ],
    ],
    options: () => FOUR,
    extra: ([e = 0, f = 0, s = 0, t = 0, by = 0]) => {
      const list = turn([e, f, s, t], by);
      return {
        o1: String(list[0]),
        o2: String(list[1]),
        o3: String(list[2]),
        o4: String(list[3]),
        ev: String(e),
        od: String(f),
      };
    },
    consts: [1, 2, 3, 4],
  }),
];

/** The two-digit numbers whose digits add up to `s`. */
const listWithDigitSum = (s: number): number[] =>
  Array.from({ length: 90 }, (_, k) => k + 10).filter(
    (n) => tens(n) + ones(n) === s,
  );
/** Pairs of a tens digit and a smaller ones digit, the ones digit at least 1. */
const DIGIT_PAIRS: readonly (readonly [number, number])[] = [
  [3, 1],
  [4, 1],
  [4, 2],
  [5, 1],
  [5, 2],
  [5, 3],
  [6, 1],
  [6, 2],
  [6, 4],
  [7, 1],
  [7, 3],
  [7, 4],
  [8, 2],
  [8, 3],
  [8, 5],
  [9, 1],
  [9, 4],
  [9, 5],
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
    roles: {
      a: "start",
      b: "count of jumps of ten",
      c: "count of jumps of one",
    },
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
    roles: { a: "count in the first box", b: "count in the second box" },
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
    roles: { a: "count at the start", b: "count taken away" },
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
  a2({
    id: "A2.mental-100.13",
    form: "pages-from-the-first-to-the-last-inclusive",
    groups: [4, 5],
    origin: {
      olympiad: "counting inclusive, a fence-post count (RES-4283, F15)",
    },
    roles: { a: "first page", b: "last page" },
    draw: (r) => {
      const a = between(r, 21, 79);
      return [a, a + between(r, 6, 18)];
    },
    solve: ([a = 0, b = 0]) => b - a + 1,
    ref: ([a = 0, b = 0]) =>
      Array.from({ length: 101 }, (_, x) => x).filter((x) => x >= a && x <= b)
        .length,
    traps: [
      ["last-page-not-counted", "conceptual", ([a = 0, b = 0]) => b - a],
      ["both-ends-left-out", "conceptual", ([a = 0, b = 0]) => b - a - 1],
    ],
    consts: [1],
  }),
  a2({
    id: "A2.mental-100.14",
    form: "how-many-two-digit-numbers-have-a-digit-sum",
    groups: [4, 5],
    origin: {
      olympiad: "counting the numbers with a given digit sum (RES-4283, F15)",
    },
    draw: (r) => [pick(r, [4, 5, 6, 7, 8, 11, 12, 13, 14])],
    solve: ([s = 0]) => Math.min(9, s) - Math.max(1, s - 9) + 1,
    ref: ([s = 0]) => listWithDigitSum(s).length,
    traps: [
      [
        "number-with-a-zero-missed",
        "procedural",
        ([s = 0]) => (s <= 9 ? s - 1 : null),
      ],
      [
        "a-leading-zero-allowed",
        "procedural",
        ([s = 0]) => (s <= 9 ? s + 1 : null),
      ],
      [
        "a-digit-above-nine-allowed",
        "conceptual",
        ([s = 0]) => (s >= 10 ? s - 1 : null),
      ],
      ["one-end-lost", "procedural", ([s = 0]) => (s >= 10 ? 18 - s : null)],
    ],
    extra: ([s = 0]) => ({ list: listWithDigitSum(s).join(", ") }),
    consts: [9, 1],
  }),
  a2({
    id: "A2.mental-100.15",
    form: "moves-on-the-hundred-chart",
    groups: [3, 4],
    roles: { a: "marked number", b: "rows down", c: "cells to the left" },
    draw: (r) => {
      const row = between(r, 0, 5);
      const col = between(r, 4, 9);
      return [10 * row + col + 1, between(r, 1, 3), between(r, 1, 4)];
    },
    solve: ([a = 0, b = 0, c = 0]) => a + 10 * b - c,
    ref: ([a = 0, b = 0, c = 0]) => {
      const at = a - 1;
      return 10 * (Math.floor(at / 10) + b) + ((at % 10) - c) + 1;
    },
    traps: [
      [
        "moved-up",
        "procedural",
        ([a = 0, b = 0, c = 0]) => keep(a - 10 * b - c),
      ],
      [
        "row-counted-as-one",
        "conceptual",
        ([a = 0, b = 0, c = 0]) => a + b - c,
      ],
      ["moved-right", "procedural", ([a = 0, b = 0, c = 0]) => a + 10 * b + c],
    ],
    consts: [10],
  }),
  a2({
    id: "A2.mental-100.16",
    form: "the-number-from-the-sum-and-the-difference-of-its-digits",
    groups: [4, 5],
    origin: {
      olympiad: "digits from their sum and difference (RES-4283, F12)",
    },
    roles: { a: "sum of the digits", b: "difference of the digits" },
    draw: (r) => {
      const [t = 0, o = 0] = pick(r, DIGIT_PAIRS);
      return [t + o, t - o];
    },
    solve: ([s = 0, d = 0]) => 10 * ((s + d) / 2) + (s - d) / 2,
    ref: ([s = 0, d = 0]) =>
      Array.from({ length: 90 }, (_, k) => k + 10).find(
        (n) => tens(n) + ones(n) === s && tens(n) - ones(n) === d,
      ) ?? -1,
    traps: [
      [
        "digits-swapped",
        "procedural",
        ([s = 0, d = 0]) => 10 * ((s - d) / 2) + (s + d) / 2,
      ],
      ["the-tens-digit-only", "conceptual", ([s = 0, d = 0]) => (s + d) / 2],
      [
        "the-ones-digit-only",
        "conceptual",
        ([s = 0, d = 0]) => keep((s - d) / 2, (s + d) / 2),
      ],
    ],
    extra: ([s = 0, d = 0]) => ({
      t: String((s + d) / 2),
      o: String((s - d) / 2),
    }),
    consts: [2, 10],
  }),
];

/** The pairs `d × (p / d)` with `d` up to the root of `p`, as texts. */
const factorPairs = (p: number): string[] =>
  Array.from({ length: p }, (_, i) => i + 1)
    .filter((d) => d * d <= p && p % d === 0)
    .map((d) => `${d} × ${p / d}`);
/** The smaller of two numbers whose product is `p` and sum `s`, found by trying the divisors of `p`. */
const smallerOf = (p: number, s: number): number =>
  Array.from({ length: p }, (_, i) => i + 1).find(
    (d) => d * d <= p && p % d === 0 && d + p / d === s,
  ) ?? 0;
/** The smallest divisor of `p` above 1 that is not `p` itself, or null. */
const firstFactor = (p: number): number | null =>
  Array.from({ length: p }, (_, i) => i + 2).find(
    (d) => d < p && p % d === 0,
  ) ?? null;

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
    roles: { a: "count of boxes", b: "count in each box" },
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
    roles: { a: "times longer", b: "length of the first ribbon" },
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
    roles: { a: "count of rows", b: "count in each row" },
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
  a3({
    id: "A3.table.12",
    form: "two-numbers-from-their-product-and-their-sum",
    groups: [5, 6],
    origin: {
      olympiad: "a product and a sum of two numbers (RES-4283, F12)",
    },
    roles: { a: "product of two numbers", b: "sum of the two numbers" },
    draw: (r) => {
      const x = between(r, 2, 8);
      const y = between(r, x + 1, 9);
      return [x * y, x + y];
    },
    solve: ([p = 0, s = 0]) => s - smallerOf(p, s),
    ref: ([p = 0, s = 0]) =>
      Math.max(
        ...Array.from({ length: 10 }, (_, k) => k + 1)
          .filter((x) => p % x === 0 && x + p / x === s)
          .map((x) => p / x),
      ),
    traps: [
      ["the-smaller-number", "conceptual", ([p = 0, s = 0]) => smallerOf(p, s)],
      [
        "the-first-pair-of-factors",
        "procedural",
        ([p = 0, s = 0]) => {
          const d = firstFactor(p);
          return d === null
            ? null
            : keep(p / d, s - smallerOf(p, s), smallerOf(p, s));
        },
      ],
    ],
    extra: ([p = 0, s = 0]) => ({
      pairs: factorPairs(p).join(", "),
      x: String(smallerOf(p, s)),
      y: String(s - smallerOf(p, s)),
    }),
    consts: [1],
  }),
  a3({
    id: "A3.table.13",
    form: "how-many-outfits-from-two-sets",
    groups: [5, 6],
    origin: {
      olympiad: "the product rule for counting, Kangaroo style (RES-4283, F15)",
    },
    roles: { a: "count of tops", b: "count of skirts" },
    draw: (r) => [between(r, 3, 7), between(r, 3, 6)],
    valid: ([a = 0, b = 0]) => a !== b,
    solve: ([a = 0, b = 0]) => a * b,
    ref: ([a = 0, b = 0]) =>
      Array.from({ length: a }, (_, i) =>
        Array.from({ length: b }, (_, j) => [i, j]),
      ).flat().length,
    traps: [
      ["added", "conceptual", ([a = 0, b = 0]) => a + b],
      ["each-used-once", "conceptual", ([a = 0, b = 0]) => Math.max(a, b)],
      ["pairs-doubled", "conceptual", ([a = 0, b = 0]) => 2 * a * b],
    ],
    consts: [2],
  }),
  a3({
    id: "A3.table.14",
    form: "rabbits-and-hens-from-heads-and-legs",
    groups: [5, 6],
    origin: {
      olympiad: "hens and rabbits, the assumption method (RES-4283, F12)",
    },
    roles: { a: "count of heads", b: "count of legs" },
    draw: (r) => {
      const n = between(r, 6, 12);
      const k = between(r, 2, n - 3);
      return [n, 2 * n + 2 * k];
    },
    solve: ([n = 0, l = 0]) => (l - 2 * n) / 2,
    ref: ([n = 0, l = 0]) =>
      Array.from({ length: n + 1 }, (_, k) => k).find(
        (k) => 4 * k + 2 * (n - k) === l,
      ) ?? -1,
    traps: [
      ["the-hens", "conceptual", ([n = 0, l = 0]) => n - (l - 2 * n) / 2],
      [
        "legs-minus-heads",
        "procedural",
        ([n = 0, l = 0]) => keep(l - n, n - (l - 2 * n) / 2),
      ],
      [
        "legs-over-four",
        "procedural",
        ([n = 0, l = 0]) =>
          l % 4 === 0
            ? keep(l / 4, (l - 2 * n) / 2, n - (l - 2 * n) / 2, l - n)
            : null,
      ],
    ],
    consts: [2],
  }),
  forChoice(
    "A3",
    "table",
  )({
    id: "A3.table.15",
    form: "the-product-that-equals-a-number-among-four",
    groups: [5, 5],
    kind: "choice",
    draw: (r) => [between(r, 3, 9), between(r, 3, 9), r.int(4)],
    valid: ([a = 0, b = 0]) => Math.abs(a - b) >= 2,
    solve: ([, , by = 0]) => placeOf(0, by),
    ref: ([a = 0, b = 0, by = 0]) =>
      String(
        turn(
          [a * b, (a + 1) * b, a * (b - 1), (a + 1) * (b - 1)],
          by,
        ).findIndex((v) => v === a * b) + 1,
      ),
    traps: [
      ["a-group-more", "fact", ([, , by = 0]) => placeOf(1, by)],
      ["a-group-less", "fact", ([, , by = 0]) => placeOf(2, by)],
      ["both-neighbours", "fact", ([, , by = 0]) => placeOf(3, by)],
    ],
    options: () => FOUR,
    extra: ([a = 0, b = 0, by = 0]) => {
      const texts = [
        `${a} × ${b}`,
        `${a + 1} × ${b}`,
        `${a} × ${b - 1}`,
        `${a + 1} × ${b - 1}`,
      ];
      const list = turn(texts, by);
      const vals = turn(
        [a * b, (a + 1) * b, a * (b - 1), (a + 1) * (b - 1)],
        by,
      );
      return {
        o1: list[0] ?? "",
        o2: list[1] ?? "",
        o3: list[2] ?? "",
        o4: list[3] ?? "",
        v1: String(vals[0]),
        v2: String(vals[1]),
        v3: String(vals[2]),
        v4: String(vals[3]),
        p: String(a * b),
      };
    },
    consts: [1, 2, 3, 4],
  }),
];
export const aSpecs1: readonly Spec<never>[] = [...add20, ...mental, ...table];
