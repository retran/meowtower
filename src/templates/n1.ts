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

type Sign = (typeof SIGNS)[number];
type Kind = "conceptual" | "procedural" | "fact";
/** The sign turned the other way, or null for an equality. */
const turned = (s: Sign): Sign | null => (s === "=" ? null : opposite(s));
const swapped = (p: Pair) => turned(signOf(p.a, p.b));
/** Traps that give a sign: one that gives the sign an earlier trap already gives returns null. */
const signTraps = <P>(
  list: readonly (readonly [string, Kind, (p: P) => Sign | null])[],
) =>
  list.map(([id, kind, fn], i) => ({
    id,
    kind,
    wrong: (p: P) => {
      const w = fn(p);
      return w !== null && list.slice(0, i).some(([, , g]) => g(p) === w)
        ? null
        : w;
    },
  }));
/** Traps that give a whole number, with the same rule for a number an earlier trap gives. */
const numberTraps = <P>(
  list: readonly (readonly [string, Kind, (p: P) => number | null])[],
) =>
  list.map(([id, kind, fn], i) => ({
    id,
    kind,
    wrong: (p: P) => {
      const w = fn(p);
      return w === null || list.slice(0, i).some(([, , g]) => g(p) === w)
        ? null
        : qi(w);
    },
  }));
const pairVars = (p: Pair) => ({
  a: digits(p.a),
  b: digits(p.b),
  ta: String(tens(p.a)),
  tb: String(tens(p.b)),
  sign: signOf(p.a, p.b),
});
const lastDigit = (p: Pair) => signOf(p.a % 10, p.b % 10);
const firstDigit = (p: Pair) =>
  signOf(Number(String(p.a)[0]), Number(String(p.b)[0]));
const toTwenty = signTraps<Pair>([
  ["last-digit", "conceptual", lastDigit],
  ["first-digit", "conceptual", firstDigit],
  ["swapped-sign", "fact", swapped],
]);
const twoDigit = signTraps<Pair>([
  ["last-digit", "conceptual", lastDigit],
  ["swapped-sign", "fact", swapped],
  ["tens-only", "conceptual", (p) => signOf(tens(p.a), tens(p.b))],
]);
interface Tom {
  t: number;
  o: number;
  n: number;
}
interface Abc {
  a: number;
  b: number;
  c: number;
}
interface Abcd extends Abc {
  d: number;
}
const rev2 = (n: number): number => 10 * (n % 10) + tens(n);
/** The number read with both words in full: "twenty three" as 203. */
const inFull = (n: number): number | null =>
  n < 21 || n % 10 === 0 ? null : Number(`${10 * tens(n)}${n % 10}`);

/** Gives every spec the wrong answers of its traps as `w_<trap_id_with_underscores>` in its texts. */
export const withWrongAnswers = (
  list: readonly Spec<never>[],
): readonly Spec<never>[] =>
  list.map((sp) => {
    const one = sp as unknown as Spec<unknown>;
    return {
      ...one,
      vars: (p: unknown) => ({
        ...one.vars(p),
        ...Object.fromEntries(
          (one.traps ?? []).flatMap((t) => {
            const w = t.wrong(p);
            const key = `w_${t.id.replace(/-/g, "_")}`;
            return w instanceof Q
              ? [[key, digits(Number(w.toString()))]]
              : typeof w === "string"
                ? [[key, w]]
                : [];
          }),
        ),
      }),
    } as unknown as Spec<never>;
  });

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
    traps: toTwenty,
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
    traps: twoDigit,
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
    traps: twoDigit,
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
    traps: twoDigit,
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
    traps: twoDigit,
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
    traps: signTraps<Tom>([
      ["last-digit", "conceptual", (p) => signOf(p.o, p.n % 10)],
      ["tens-only", "conceptual", (p) => signOf(p.t, tens(p.n))],
      ["added-digits", "procedural", (p) => signOf(p.t + p.o, p.n)],
      ["swapped-sign", "fact", (p) => turned(signOf(10 * p.t + p.o, p.n))],
    ]),
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
    traps: signTraps<Pair>([
      ["last-digit", "conceptual", lastDigit],
      ["tens-and-ones-cancel", "conceptual", () => "="],
    ]),
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
    traps: signTraps<Pair>([
      ["last-digit", "conceptual", lastDigit],
      ["first-digit", "conceptual", firstDigit],
      ["swapped-sign", "fact", swapped],
    ]),
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
    traps: signTraps<Pair>([
      [
        "reversed-digits",
        "conceptual",
        (p) => (p.a % 10 === 0 ? null : signOf(rev2(p.a), p.b)),
      ],
      [
        "written-in-full",
        "conceptual",
        (p) => {
          const full = inFull(p.a);
          return full === null ? null : signOf(full, p.b);
        },
      ],
      ["swapped-sign", "fact", swapped],
    ]),
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
    traps: signTraps<Abc>([
      ["first-addend", "procedural", (p) => signOf(p.a, p.c)],
      [
        "difference-instead",
        "procedural",
        (p) => signOf(Math.abs(p.a - p.b), p.c),
      ],
      ["larger-addend", "procedural", (p) => signOf(Math.max(p.a, p.b), p.c)],
      ["swapped-sign", "fact", (p) => turned(signOf(p.a + p.b, p.c))],
    ]),
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
    traps: signTraps<Abcd>([
      ["first-addends", "procedural", (p) => signOf(p.a, p.c)],
      [
        "larger-addends",
        "procedural",
        (p) => signOf(Math.max(p.a, p.b), Math.max(p.c, p.d)),
      ],
      ["swapped-sign", "fact", (p) => turned(signOf(p.a + p.b, p.c + p.d))],
    ]),
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
    traps: signTraps<Abc>([
      ["bigger-number", "procedural", (p) => signOf(p.a, p.c)],
      ["added-instead", "procedural", (p) => signOf(p.a + p.b, p.c)],
      ["swapped-sign", "fact", (p) => turned(signOf(p.a - p.b, p.c))],
    ]),
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
    traps: signTraps<Pair>([
      ["stars-equal", "conceptual", () => "="],
      ["swapped-sign", "fact", swapped],
    ]),
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
    traps: numberTraps<One>([
      ["same-number", "conceptual", (p) => p.a],
      ["before-instead", "conceptual", (p) => p.a - 1],
      ["skip-one", "procedural", (p) => p.a + 2],
    ]),
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
    traps: numberTraps<One>([
      ["after-instead", "conceptual", (p) => p.a + 1],
      ["same-number", "conceptual", (p) => p.a],
      ["two-back", "procedural", (p) => p.a - 2],
    ]),
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
    traps: numberTraps<One>([
      ["before-instead", "conceptual", (p) => p.a - 1],
      ["plus-ten", "procedural", (p) => p.a + 10],
      ["same-number", "conceptual", (p) => p.a],
    ]),
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
    traps: numberTraps<One>([
      ["after-instead", "conceptual", (p) => p.a + 1],
      ["minus-ten", "procedural", (p) => p.a - 10],
      ["same-number", "conceptual", (p) => p.a],
    ]),
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
    traps: numberTraps<One>([
      ["keep-tens", "procedural", (p) => 10 * tens(p.a)],
      ["append-one", "procedural", (p) => Number(`${tens(p.a)}10`)],
      ["plus-ten", "procedural", (p) => p.a + 10],
      ["before-instead", "conceptual", (p) => p.a - 1],
    ]),
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
    traps: numberTraps<One>([
      ["tens-minus-one", "procedural", (p) => p.a - 10],
      ["ones-wrap", "procedural", (p) => p.a + 9],
      ["after-instead", "conceptual", (p) => p.a + 1],
    ]),
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
    traps: numberTraps<One>([
      ["before-instead", "conceptual", (p) => p.a - 1],
      ["same-side-house", "conceptual", (p) => p.a + 2],
    ]),
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
    traps: numberTraps<One>([
      ["left-end", "conceptual", (p) => p.a],
      ["right-end", "conceptual", (p) => p.a + 2],
      ["distance", "conceptual", () => 2],
    ]),
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
    traps: numberTraps<One>([
      ["repeat-last", "conceptual", (p) => p.a + 2],
      ["skip", "procedural", (p) => p.a + 4],
    ]),
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
    traps: numberTraps<One>([
      ["up", "conceptual", (p) => p.a + 3],
      ["repeat-last", "conceptual", (p) => p.a],
      ["skip-one", "procedural", (p) => p.a - 2],
    ]),
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
    traps: numberTraps<One>([
      ["plus-ten", "procedural", (p) => p.a + 10],
      ["less-instead", "conceptual", (p) => p.a - 1],
    ]),
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
    traps: numberTraps<One>([
      ["minus-ten", "procedural", (p) => p.a - 10],
      ["more-instead", "conceptual", (p) => p.a + 1],
    ]),
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
    traps: numberTraps<{ a: number; b: number }>([
      ["difference", "procedural", (p) => p.b - p.a],
      ["include-ends", "conceptual", (p) => p.b - p.a + 1],
      ["ends-removed-twice", "procedural", (p) => p.b - p.a - 2],
    ]),
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
    traps: numberTraps<{ a: number; b: number }>([
      ["difference", "procedural", (p) => p.b - p.a],
      ["ends-removed", "conceptual", (p) => p.b - p.a - 1],
    ]),
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
    traps: numberTraps<One>([
      ["before-instead", "conceptual", (p) => p.a - 1],
      ["tens-word-only", "procedural", (p) => 10 * tens(p.a) + 1],
      [
        "reversed-digits",
        "conceptual",
        (p) => (p.a % 10 === 0 ? null : rev2(p.a) + 1),
      ],
      [
        "written-in-full",
        "conceptual",
        (p) => {
          const full = inFull(p.a);
          return full === null ? null : full + 1;
        },
      ],
    ]),
    vars: (p: One) => ({
      a: r1(p.a),
      words: numberWords(p.a),
      r: r1(p.a + 1),
      p: r1(p.a - 1),
    }),
    constants: CONSTANTS,
  } satisfies Spec<One>,
] as unknown as readonly Spec<never>[];

export const n1Specs: readonly Spec<never>[] = withWrongAnswers([
  ...compare,
  ...beforeAfter,
]);

// `Q` is re-exported for the answer types the specs return.
export type { Q };
