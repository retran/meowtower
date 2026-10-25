// Node N1, comparing numbers and the number before and after (RES-4281, RES-1200). The Dutch goals
// compare numbers to 20 at group 3 and to 100 at group 4, and put the number line and the number
// before and after in the same range. Every template is written by hand: its own task form, its own
// parameter shape and its own traps. Texts are in `content/tasks-n.ru.json`, keyed by the template id.
import { Q } from "../math/q.js";
import { between, digits, qi, signOf } from "./draw.js";
import { SIGNS, type Spec } from "./spec.js";
import { numberWords } from "./words.js";

const REFERENCE_SIGNS = SIGNS;
/** The sign of `a` against `b` by their difference, a route different from `signOf`. */
const bySubtraction = (a: number, b: number): (typeof SIGNS)[number] =>
  REFERENCE_SIGNS[Math.sign(a - b) + 1] ?? "=";
const opposite = (s: (typeof SIGNS)[number]): (typeof SIGNS)[number] =>
  s === "<" ? ">" : s === ">" ? "<" : "=";
const tens = (n: number): number => Math.floor(n / 10);
const CONSTANTS = [1, 2, 10];

interface Pair {
  a: number;
  b: number;
}

const swapped = (p: Pair) => {
  const s = signOf(p.a, p.b);
  return s === "=" ? null : opposite(s);
};
const pairVars = (p: Pair) => ({
  a: digits(p.a),
  b: digits(p.b),
  ta: String(tens(p.a)),
  tb: String(tens(p.b)),
  sign: signOf(p.a, p.b),
});
const pairTrap = [
  { id: "swapped-sign", kind: "fact" as const, wrong: swapped },
];

/** Comparison templates: the answer is the sign that stands between the two numbers. */
const compare: readonly Spec<never>[] = [
  {
    id: "N1.compare.01",
    node: "N1",
    subtype: "compare",
    form: "sign-between-two-numbers-to-20",
    groups: [2, 3],
    answer: "compare",
    draw: (r): Pair => ({ a: between(r, 1, 20), b: between(r, 1, 20) }),
    solve: (p: Pair) => signOf(p.a, p.b),
    reference: (p: Pair) => bySubtraction(p.a, p.b),
    traps: pairTrap,
    vars: pairVars,
    constants: CONSTANTS,
  } satisfies Spec<Pair>,
  {
    id: "N1.compare.02",
    node: "N1",
    subtype: "compare",
    form: "sign-between-two-numbers-to-100",
    groups: [4, 4],
    answer: "compare",
    draw: (r): Pair => ({ a: between(r, 10, 99), b: between(r, 10, 99) }),
    solve: (p: Pair) => signOf(p.a, p.b),
    reference: (p: Pair) => bySubtraction(p.a, p.b),
    traps: pairTrap,
    vars: pairVars,
    constants: CONSTANTS,
  } satisfies Spec<Pair>,
  {
    id: "N1.compare.03",
    node: "N1",
    subtype: "compare",
    form: "prices-in-euro",
    groups: [4, 4],
    answer: "compare",
    draw: (r): Pair => ({ a: between(r, 10, 99), b: between(r, 10, 99) }),
    solve: (p: Pair) => signOf(p.a, p.b),
    reference: (p: Pair) => bySubtraction(p.a, p.b),
    traps: pairTrap,
    vars: pairVars,
    constants: CONSTANTS,
  } satisfies Spec<Pair>,
  {
    id: "N1.compare.04",
    node: "N1",
    subtype: "compare",
    form: "children-in-two-classes",
    groups: [3, 4],
    answer: "compare",
    draw: (r): Pair => ({ a: between(r, 12, 35), b: between(r, 12, 35) }),
    solve: (p: Pair) => signOf(p.a, p.b),
    reference: (p: Pair) => bySubtraction(p.a, p.b),
    traps: pairTrap,
    vars: pairVars,
    constants: CONSTANTS,
  } satisfies Spec<Pair>,
  {
    id: "N1.compare.05",
    node: "N1",
    subtype: "compare",
    form: "two-lengths-in-centimetres",
    groups: [4, 4],
    answer: "compare",
    draw: (r): Pair => ({ a: between(r, 10, 99), b: between(r, 10, 99) }),
    solve: (p: Pair) => signOf(p.a, p.b),
    reference: (p: Pair) => bySubtraction(p.a, p.b),
    traps: pairTrap,
    vars: pairVars,
    constants: CONSTANTS,
  } satisfies Spec<Pair>,
  {
    id: "N1.compare.06",
    node: "N1",
    subtype: "compare",
    form: "tens-and-ones-against-a-number",
    groups: [4, 4],
    answer: "compare",
    draw: (r) => ({
      t: between(r, 1, 9),
      o: between(r, 0, 9),
      n: between(r, 10, 99),
    }),
    solve: (p: { t: number; o: number; n: number }) =>
      signOf(10 * p.t + p.o, p.n),
    reference: (p: { t: number; o: number; n: number }) =>
      bySubtraction(Number(`${p.t}${p.o}`), p.n),
    traps: [
      {
        id: "tens-only",
        kind: "conceptual" as const,
        wrong: (p: { t: number; o: number; n: number }) =>
          signOf(p.t, tens(p.n)),
      },
    ],
    vars: (p: { t: number; o: number; n: number }) => ({
      t: String(p.t),
      o: String(p.o),
      n: String(p.n),
      m: String(10 * p.t + p.o),
      sign: signOf(10 * p.t + p.o, p.n),
    }),
    constants: CONSTANTS,
  } satisfies Spec<{ t: number; o: number; n: number }>,
  {
    id: "N1.compare.07",
    node: "N1",
    subtype: "compare",
    form: "more-tens-fewer-ones",
    groups: [4, 4],
    answer: "compare",
    draw: (r): Pair => ({ a: between(r, 10, 99), b: between(r, 10, 99) }),
    valid: (p: Pair) =>
      tens(p.a) !== tens(p.b) &&
      p.a % 10 !== p.b % 10 &&
      Math.sign(tens(p.a) - tens(p.b)) !== Math.sign((p.a % 10) - (p.b % 10)),
    solve: (p: Pair) => signOf(p.a, p.b),
    reference: (p: Pair) => bySubtraction(p.a, p.b),
    traps: [
      {
        id: "last-digit",
        kind: "conceptual" as const,
        wrong: (p: Pair) => signOf(p.a % 10, p.b % 10),
      },
    ],
    vars: pairVars,
    constants: CONSTANTS,
  } satisfies Spec<Pair>,
  {
    id: "N1.compare.08",
    node: "N1",
    subtype: "compare",
    form: "one-digit-against-two-digits",
    groups: [3, 4],
    answer: "compare",
    draw: (r): Pair => {
      const small = between(r, 2, 9);
      const large = between(r, 10, 29);
      return r.int(2) === 0 ? { a: small, b: large } : { a: large, b: small };
    },
    solve: (p: Pair) => signOf(p.a, p.b),
    reference: (p: Pair) => bySubtraction(p.a, p.b),
    traps: [
      {
        id: "first-digit",
        kind: "conceptual" as const,
        wrong: (p: Pair) =>
          signOf(Number(String(p.a)[0]), Number(String(p.b)[0])),
      },
    ],
    vars: (p: Pair) => ({
      ...pairVars(p),
      short: String(Math.min(p.a, p.b)),
      long: String(Math.max(p.a, p.b)),
    }),
    constants: CONSTANTS,
  } satisfies Spec<Pair>,
  {
    id: "N1.compare.09",
    node: "N1",
    subtype: "compare",
    form: "number-in-words-against-digits",
    groups: [3, 4],
    answer: "compare",
    draw: (r): Pair => ({ a: between(r, 11, 99), b: between(r, 11, 99) }),
    solve: (p: Pair) => signOf(p.a, p.b),
    reference: (p: Pair) => bySubtraction(p.a, p.b),
    traps: pairTrap,
    vars: (p: Pair) => ({
      ...pairVars(p),
      words: numberWords(p.a),
      m: String(p.a),
      n: String(p.b),
    }),
    constants: CONSTANTS,
  } satisfies Spec<Pair>,
  {
    id: "N1.compare.10",
    node: "N1",
    subtype: "compare",
    form: "sum-against-a-number",
    groups: [4, 4],
    answer: "compare",
    draw: (r) => ({
      a: between(r, 5, 60),
      b: between(r, 5, 40),
      c: between(r, 10, 100),
    }),
    valid: (p: { a: number; b: number; c: number }) => p.a + p.b <= 100,
    solve: (p: { a: number; b: number; c: number }) => signOf(p.a + p.b, p.c),
    reference: (p: { a: number; b: number; c: number }) =>
      bySubtraction(p.c, p.a + p.b) === "<"
        ? ">"
        : bySubtraction(p.c, p.a + p.b) === ">"
          ? "<"
          : "=",
    traps: [
      {
        id: "first-addend",
        kind: "procedural" as const,
        wrong: (p: { a: number; b: number; c: number }) => signOf(p.a, p.c),
      },
    ],
    vars: (p: { a: number; b: number; c: number }) => ({
      a: String(p.a),
      b: String(p.b),
      c: String(p.c),
      s: String(p.a + p.b),
      sign: signOf(p.a + p.b, p.c),
    }),
    constants: CONSTANTS,
  } satisfies Spec<{ a: number; b: number; c: number }>,
  {
    id: "N1.compare.11",
    node: "N1",
    subtype: "compare",
    form: "sum-against-a-sum",
    groups: [4, 4],
    answer: "compare",
    draw: (r) => ({
      a: between(r, 5, 50),
      b: between(r, 5, 50),
      c: between(r, 5, 50),
      d: between(r, 5, 50),
    }),
    solve: (p: { a: number; b: number; c: number; d: number }) =>
      signOf(p.a + p.b, p.c + p.d),
    reference: (p: { a: number; b: number; c: number; d: number }) =>
      bySubtraction(p.a + p.b - p.c, p.d),
    traps: [
      {
        id: "first-addends",
        kind: "procedural" as const,
        wrong: (p: { a: number; b: number; c: number; d: number }) =>
          signOf(p.a, p.c),
      },
    ],
    vars: (p: { a: number; b: number; c: number; d: number }) => ({
      a: String(p.a),
      b: String(p.b),
      c: String(p.c),
      d: String(p.d),
      s: String(p.a + p.b),
      t: String(p.c + p.d),
      sign: signOf(p.a + p.b, p.c + p.d),
    }),
    constants: CONSTANTS,
  } satisfies Spec<{ a: number; b: number; c: number; d: number }>,
  {
    id: "N1.compare.12",
    node: "N1",
    subtype: "compare",
    form: "difference-against-a-number",
    groups: [4, 4],
    answer: "compare",
    draw: (r) => ({
      a: between(r, 20, 99),
      b: between(r, 5, 19),
      c: between(r, 5, 99),
    }),
    solve: (p: { a: number; b: number; c: number }) => signOf(p.a - p.b, p.c),
    reference: (p: { a: number; b: number; c: number }) =>
      bySubtraction(p.a, p.b + p.c),
    traps: [
      {
        id: "bigger-number",
        kind: "procedural" as const,
        wrong: (p: { a: number; b: number; c: number }) => signOf(p.a, p.c),
      },
    ],
    vars: (p: { a: number; b: number; c: number }) => ({
      a: String(p.a),
      b: String(p.b),
      c: String(p.c),
      d: String(p.a - p.b),
      sign: signOf(p.a - p.b, p.c),
    }),
    constants: CONSTANTS,
  } satisfies Spec<{ a: number; b: number; c: number }>,
  {
    id: "N1.compare.13",
    node: "N1",
    subtype: "compare",
    form: "reason-about-unknown-digits",
    groups: [4, 4],
    answer: "compare",
    draw: (r): Pair => ({ a: between(r, 1, 9), b: between(r, 1, 9) }),
    valid: (p: Pair) => p.a !== p.b,
    solve: (p: Pair) => signOf(p.a, p.b),
    reference: (p: Pair) => bySubtraction(p.a * 10, p.b * 10),
    traps: [
      {
        id: "stars-equal",
        kind: "conceptual" as const,
        wrong: () => "=",
      },
    ],
    vars: (p: Pair) => ({
      a: String(p.a),
      b: String(p.b),
      sign: signOf(p.a, p.b),
    }),
    constants: CONSTANTS,
  } satisfies Spec<Pair>,
] as unknown as readonly Spec<never>[];

interface One {
  a: number;
}

const r1 = (n: number): string => String(n);

/** The number before and after: the answer is one whole number. */
const beforeAfter: readonly Spec<never>[] = [
  {
    id: "N1.before-after.01",
    node: "N1",
    subtype: "before-after",
    form: "number-after-to-20",
    groups: [2, 3],
    answer: "integer",
    draw: (r): One => ({ a: between(r, 1, 19) }),
    solve: (p: One) => qi(p.a + 1),
    reference: (p: One) => qi([...Array(p.a + 2).keys()][p.a + 1] ?? -1),
    traps: [
      {
        id: "same-number",
        kind: "conceptual" as const,
        wrong: (p: One) => qi(p.a),
      },
      {
        id: "before-instead",
        kind: "conceptual" as const,
        wrong: (p: One) => qi(p.a - 1),
      },
    ],
    vars: (p: One) => ({ a: r1(p.a), r: r1(p.a + 1), p: r1(p.a - 1) }),
    constants: CONSTANTS,
  } satisfies Spec<One>,
  {
    id: "N1.before-after.02",
    node: "N1",
    subtype: "before-after",
    form: "number-before-to-20",
    groups: [2, 3],
    answer: "integer",
    draw: (r): One => ({ a: between(r, 2, 20) }),
    solve: (p: One) => qi(p.a - 1),
    reference: (p: One) => qi([...Array(p.a).keys()][p.a - 1] ?? -1),
    traps: [
      {
        id: "after-instead",
        kind: "conceptual" as const,
        wrong: (p: One) => qi(p.a + 1),
      },
    ],
    vars: (p: One) => ({ a: r1(p.a), r: r1(p.a - 1), n: r1(p.a + 1) }),
    constants: CONSTANTS,
  } satisfies Spec<One>,
  {
    id: "N1.before-after.03",
    node: "N1",
    subtype: "before-after",
    form: "number-after-to-100",
    groups: [4, 4],
    answer: "integer",
    draw: (r): One => ({ a: between(r, 10, 98) }),
    valid: (p: One) => p.a % 10 !== 9,
    solve: (p: One) => qi(p.a + 1),
    reference: (p: One) => qi(Number(`${tens(p.a)}${(p.a % 10) + 1}`)),
    traps: [
      {
        id: "before-instead",
        kind: "conceptual" as const,
        wrong: (p: One) => qi(p.a - 1),
      },
    ],
    vars: (p: One) => ({ a: r1(p.a), r: r1(p.a + 1), p: r1(p.a - 1) }),
    constants: CONSTANTS,
  } satisfies Spec<One>,
  {
    id: "N1.before-after.04",
    node: "N1",
    subtype: "before-after",
    form: "number-before-to-100",
    groups: [4, 4],
    answer: "integer",
    draw: (r): One => ({ a: between(r, 11, 99) }),
    valid: (p: One) => p.a % 10 !== 0,
    solve: (p: One) => qi(p.a - 1),
    reference: (p: One) => qi(Number(`${tens(p.a)}${(p.a % 10) - 1}`)),
    traps: [
      {
        id: "after-instead",
        kind: "conceptual" as const,
        wrong: (p: One) => qi(p.a + 1),
      },
    ],
    vars: (p: One) => ({ a: r1(p.a), r: r1(p.a - 1), n: r1(p.a + 1) }),
    constants: CONSTANTS,
  } satisfies Spec<One>,
  {
    id: "N1.before-after.05",
    node: "N1",
    subtype: "before-after",
    form: "number-after-across-a-ten",
    groups: [4, 4],
    answer: "integer",
    draw: (r): One => ({ a: 10 * between(r, 1, 9) + 9 }),
    solve: (p: One) => qi(p.a + 1),
    reference: (p: One) => qi(10 * (tens(p.a) + 1)),
    traps: [
      {
        id: "keep-tens",
        kind: "procedural" as const,
        wrong: (p: One) => qi(10 * tens(p.a)),
      },
      {
        id: "append-one",
        kind: "procedural" as const,
        wrong: (p: One) => qi(Number(`${tens(p.a)}10`)),
      },
    ],
    vars: (p: One) => ({
      a: r1(p.a),
      r: r1(p.a + 1),
      keep: r1(10 * tens(p.a)),
      append: r1(Number(`${tens(p.a)}10`)),
    }),
    constants: CONSTANTS,
  } satisfies Spec<One>,
  {
    id: "N1.before-after.06",
    node: "N1",
    subtype: "before-after",
    form: "number-before-across-a-ten",
    groups: [4, 4],
    answer: "integer",
    draw: (r): One => ({ a: 10 * between(r, 2, 10) }),
    solve: (p: One) => qi(p.a - 1),
    reference: (p: One) => qi(10 * (tens(p.a) - 1) + 9),
    traps: [
      {
        id: "tens-minus-one",
        kind: "procedural" as const,
        wrong: (p: One) => qi(p.a - 10),
      },
      {
        id: "ones-wrap",
        kind: "procedural" as const,
        wrong: (p: One) => qi(p.a + 9),
      },
    ],
    vars: (p: One) => ({
      a: r1(p.a),
      r: r1(p.a - 1),
      down: r1(p.a - 10),
      up: r1(p.a + 9),
    }),
    constants: CONSTANTS,
  } satisfies Spec<One>,
  {
    id: "N1.before-after.07",
    node: "N1",
    subtype: "before-after",
    form: "next-house-number",
    groups: [3, 4],
    answer: "integer",
    draw: (r): One => ({ a: between(r, 1, 98) }),
    solve: (p: One) => qi(p.a + 1),
    reference: (p: One) => qi(p.a - -1),
    traps: [
      {
        id: "before-instead",
        kind: "conceptual" as const,
        wrong: (p: One) => qi(p.a - 1),
      },
    ],
    vars: (p: One) => ({ a: r1(p.a), r: r1(p.a + 1), p: r1(p.a - 1) }),
    constants: CONSTANTS,
  } satisfies Spec<One>,
  {
    id: "N1.before-after.08",
    node: "N1",
    subtype: "before-after",
    form: "number-between-two-numbers",
    groups: [3, 4],
    answer: "integer",
    draw: (r): One => ({ a: between(r, 1, 98) }),
    solve: (p: One) => qi(p.a + 1),
    reference: (p: One) => qi((p.a + (p.a + 2)) / 2),
    traps: [
      {
        id: "left-end",
        kind: "conceptual" as const,
        wrong: (p: One) => qi(p.a),
      },
      {
        id: "right-end",
        kind: "conceptual" as const,
        wrong: (p: One) => qi(p.a + 2),
      },
    ],
    vars: (p: One) => ({ a: r1(p.a), c: r1(p.a + 2), r: r1(p.a + 1) }),
    constants: CONSTANTS,
  } satisfies Spec<One>,
  {
    id: "N1.before-after.09",
    node: "N1",
    subtype: "before-after",
    form: "next-number-in-a-counting-row",
    groups: [3, 4],
    answer: "integer",
    draw: (r): One => ({ a: between(r, 1, 96) }),
    solve: (p: One) => qi(p.a + 3),
    reference: (p: One) => qi([p.a, p.a + 1, p.a + 2, p.a + 3].at(-1) ?? -1),
    traps: [
      {
        id: "repeat-last",
        kind: "conceptual" as const,
        wrong: (p: One) => qi(p.a + 2),
      },
      {
        id: "skip",
        kind: "procedural" as const,
        wrong: (p: One) => qi(p.a + 4),
      },
    ],
    vars: (p: One) => ({
      a: r1(p.a),
      b: r1(p.a + 1),
      c: r1(p.a + 2),
      r: r1(p.a + 3),
    }),
    constants: CONSTANTS,
  } satisfies Spec<One>,
  {
    id: "N1.before-after.10",
    node: "N1",
    subtype: "before-after",
    form: "next-number-counting-back",
    groups: [3, 4],
    answer: "integer",
    draw: (r): One => ({ a: between(r, 2, 98) }),
    solve: (p: One) => qi(p.a - 1),
    reference: (p: One) => qi([p.a + 2, p.a + 1, p.a, p.a - 1].at(-1) ?? -1),
    traps: [
      { id: "up", kind: "conceptual" as const, wrong: (p: One) => qi(p.a + 3) },
    ],
    vars: (p: One) => ({
      a: r1(p.a),
      b: r1(p.a + 1),
      c: r1(p.a + 2),
      r: r1(p.a - 1),
    }),
    constants: CONSTANTS,
  } satisfies Spec<One>,
  {
    id: "N1.before-after.11",
    node: "N1",
    subtype: "before-after",
    form: "one-more-than",
    groups: [3, 4],
    answer: "integer",
    draw: (r): One => ({ a: between(r, 10, 98) }),
    solve: (p: One) => qi(p.a + 1),
    reference: (p: One) => qi(p.a + 11 - 10),
    traps: [
      {
        id: "plus-ten",
        kind: "procedural" as const,
        wrong: (p: One) => qi(p.a + 10),
      },
    ],
    vars: (p: One) => ({ a: r1(p.a), r: r1(p.a + 1), w: r1(p.a + 10) }),
    constants: CONSTANTS,
  } satisfies Spec<One>,
  {
    id: "N1.before-after.12",
    node: "N1",
    subtype: "before-after",
    form: "one-less-than",
    groups: [3, 4],
    answer: "integer",
    draw: (r): One => ({ a: between(r, 11, 99) }),
    solve: (p: One) => qi(p.a - 1),
    reference: (p: One) => qi(p.a - 11 + 10),
    traps: [
      {
        id: "minus-ten",
        kind: "procedural" as const,
        wrong: (p: One) => qi(p.a - 10),
      },
    ],
    vars: (p: One) => ({ a: r1(p.a), r: r1(p.a - 1), w: r1(p.a - 10) }),
    constants: CONSTANTS,
  } satisfies Spec<One>,
  {
    id: "N1.before-after.13",
    node: "N1",
    subtype: "before-after",
    form: "how-many-numbers-between",
    groups: [4, 4],
    answer: "integer",
    draw: (r) => {
      const a = between(r, 1, 80);
      return { a, b: a + between(r, 3, 15) };
    },
    solve: (p: { a: number; b: number }) => qi(p.b - p.a - 1),
    reference: (p: { a: number; b: number }) =>
      qi(Array.from({ length: p.b - p.a - 1 }, (_, i) => p.a + 1 + i).length),
    traps: [
      {
        id: "difference",
        kind: "procedural" as const,
        wrong: (p: { a: number; b: number }) => qi(p.b - p.a),
      },
      {
        id: "include-ends",
        kind: "conceptual" as const,
        wrong: (p: { a: number; b: number }) => qi(p.b - p.a + 1),
      },
    ],
    vars: (p: { a: number; b: number }) => ({
      a: r1(p.a),
      b: r1(p.b),
      r: r1(p.b - p.a - 1),
      d: r1(p.b - p.a),
      e: r1(p.b - p.a + 1),
    }),
    constants: CONSTANTS,
  } satisfies Spec<{ a: number; b: number }>,
  {
    id: "N1.before-after.14",
    node: "N1",
    subtype: "before-after",
    form: "how-many-numbers-in-a-row",
    groups: [4, 4],
    answer: "integer",
    draw: (r) => {
      const a = between(r, 1, 80);
      return { a, b: a + between(r, 3, 15) };
    },
    solve: (p: { a: number; b: number }) => qi(p.b - p.a + 1),
    reference: (p: { a: number; b: number }) =>
      qi(Array.from({ length: p.b - p.a + 1 }, (_, i) => p.a + i).length),
    traps: [
      {
        id: "difference",
        kind: "procedural" as const,
        wrong: (p: { a: number; b: number }) => qi(p.b - p.a),
      },
    ],
    vars: (p: { a: number; b: number }) => ({
      a: r1(p.a),
      a1: r1(p.a + 1),
      b: r1(p.b),
      r: r1(p.b - p.a + 1),
      d: r1(p.b - p.a),
    }),
    constants: CONSTANTS,
  } satisfies Spec<{ a: number; b: number }>,
  {
    id: "N1.before-after.15",
    node: "N1",
    subtype: "before-after",
    form: "number-after-a-number-in-words",
    groups: [3, 4],
    answer: "integer",
    draw: (r): One => ({ a: between(r, 20, 98) }),
    solve: (p: One) => qi(p.a + 1),
    reference: (p: One) => qi(Number(`${tens(p.a)}${p.a % 10}`) + 1),
    traps: [
      {
        id: "before-instead",
        kind: "conceptual" as const,
        wrong: (p: One) => qi(p.a - 1),
      },
    ],
    vars: (p: One) => ({
      a: r1(p.a),
      words: numberWords(p.a),
      r: r1(p.a + 1),
      p: r1(p.a - 1),
    }),
    constants: CONSTANTS,
  } satisfies Spec<One>,
] as unknown as readonly Spec<never>[];

export const n1Specs: readonly Spec<never>[] = [...compare, ...beforeAfter];

// `Q` is re-exported for the answer types the specs return.
export type { Q };
