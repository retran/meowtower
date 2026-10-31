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
const sumOfDigits = (n: number): number =>
  [...String(n)].reduce((a, c) => a + Number(c), 0);
/** The one element with the greatest key, or null where two share it. */
const uniqueMax = (v: readonly number[], key: (n: number) => number) => {
  const top = Math.max(...v.map(key));
  const hits = v.filter((n) => key(n) === top);
  return hits.length === 1 ? (hits[0] ?? null) : null;
};

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
interface Four {
  v: number[];
  by: number;
}
interface TensOnes {
  t: number;
  n: number;
}
interface Unnormalised {
  t: number;
  o: number;
  t2: number;
  o2: number;
}
/** Rotates a list of options by a drawn offset, so the right one is not always first. */
const rotate = <T>(list: readonly T[], by: number): T[] =>
  list.map((_, i) => list[(i + by) % list.length] as T);
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
    valid: (p: Pair) => p.a !== p.b,
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
    valid: (p: Pair) => p.a !== p.b,
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
    roles: {
      a: "price of the first item in euro",
      b: "price of the second item in euro",
    },
    groups: [4, 4],
    answer: "compare",
    // The two prices are written with the same two digits, so the digits alone cannot decide.
    draw: (r): Pair => {
      const x = between(r, 1, 9);
      const y = between(r, 1, 9);
      return { a: 10 * x + y, b: 10 * y + x };
    },
    valid: (p: Pair) => p.a !== p.b,
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
    roles: {
      a: "children in the first class",
      b: "children in the second class",
    },
    groups: [3, 4],
    answer: "compare",
    draw: (r): Pair => ({ a: between(r, 12, 35), b: between(r, 12, 35) }),
    valid: (p: Pair) => p.a !== p.b,
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
    roles: {
      a: "length of the first ribbon in centimetres",
      b: "length of the second ribbon in centimetres",
    },
    groups: [4, 4],
    answer: "compare",
    // Both lengths have the same tens, so only the ones decide.
    draw: (r): Pair => {
      const t = 10 * between(r, 1, 9);
      return { a: t + between(r, 0, 9), b: t + between(r, 0, 9) };
    },
    valid: (p: Pair) => p.a !== p.b,
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
      o: between(r, 1, 9),
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
    // The second route moves the second addend to the other side: a against c − b.
    reference: (p: { a: number; b: number; c: number }) =>
      bySubtraction(p.a, p.c - p.b),
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
    // The second route compares the two digits as characters, not as numbers.
    reference: (p: Pair) =>
      REFERENCE_SIGNS[Math.sign(String(p.a).localeCompare(String(p.b))) + 1] ??
      "=",
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
  {
    id: "N1.compare.14",
    node: "N1",
    subtype: "compare",
    form: "largest-of-four-two-digit-numbers",
    groups: [4, 4],
    answer: "choice",
    draw: (r): Four => {
      const v: number[] = [];
      while (v.length < 4) {
        const x = between(r, 21, 98);
        if (!v.includes(x)) v.push(x);
      }
      return { v, by: r.int(4) };
    },
    // One option wins by its ones digit and another by its digit sum, and neither is the greatest.
    valid: (p: Four) => {
      const top = Math.max(...p.v);
      const last = uniqueMax(p.v, (n) => n % 10);
      const sum = uniqueMax(p.v, sumOfDigits);
      return (
        last !== null &&
        sum !== null &&
        last !== top &&
        sum !== top &&
        last !== sum
      );
    },
    options: (p: Four) => rotate(p.v.map(digits), p.by),
    solve: (p: Four) => digits(Math.max(...p.v)),
    reference: (p: Four) =>
      rotate(p.v.map(digits), p.by).reduce((a, b) =>
        Number(a) > Number(b) ? a : b,
      ),
    traps: [
      {
        id: "last-digit",
        kind: "conceptual" as const,
        wrong: (p: Four) => digits(uniqueMax(p.v, (n) => n % 10) ?? 0),
      },
      {
        id: "digit-sum",
        kind: "conceptual" as const,
        wrong: (p: Four) => digits(uniqueMax(p.v, sumOfDigits) ?? 0),
      },
    ],
    vars: (p: Four) => ({
      a: String(p.v[0]),
      b: String(p.v[1]),
      c: String(p.v[2]),
      d: String(p.v[3]),
      r: digits(Math.max(...p.v)),
    }),
    constants: CONSTANTS,
  } satisfies Spec<Four>,
  {
    id: "N1.compare.15",
    node: "N1",
    subtype: "compare",
    form: "tens-against-ones",
    groups: [4, 4],
    answer: "compare",
    draw: (r): TensOnes => {
      const t = between(r, 2, 9);
      const u = between(r, 1, 9);
      const k = r.int(3);
      return {
        t,
        n: k === 0 ? 10 * t : k === 1 ? Math.min(99, 10 * t + u) : 10 * t - u,
      };
    },
    solve: (p: TensOnes) => signOf(10 * p.t, p.n),
    reference: (p: TensOnes) => bySubtraction(10 * p.t, p.n),
    traps: signTraps<TensOnes>([
      ["face-value", "conceptual", (p) => signOf(p.t, p.n)],
      ["tens-only", "conceptual", (p) => signOf(p.t, tens(p.n))],
      ["swapped-sign", "fact", (p) => turned(signOf(10 * p.t, p.n))],
    ]),
    vars: (p: TensOnes) => ({
      t: String(p.t),
      n: String(p.n),
      m: String(10 * p.t),
      sign: signOf(10 * p.t, p.n),
    }),
    constants: CONSTANTS,
  } satisfies Spec<TensOnes>,
  {
    id: "N1.compare.16",
    node: "N1",
    subtype: "compare",
    form: "how-many-digits-make-the-number-greater",
    groups: [4, 4],
    origin: {
      olympiad:
        "digit puzzle: how many digits fit an inequality, the counting items of RES-4281 (Kangoeroe 2003, Dutch group 5 'one 9 in it')",
    },
    answer: "integer",
    draw: (r): Pair => ({ a: between(r, 1, 9), b: between(r, 1, 8) }),
    solve: (p: Pair) => qi(9 - p.b),
    reference: (p: Pair) =>
      qi(
        Array.from({ length: 10 }, (_, d) => d).filter(
          (d) => 10 * p.a + d > 10 * p.a + p.b,
        ).length,
      ),
    traps: numberTraps<Pair>([
      ["equal-counts", "conceptual", (p) => 10 - p.b],
      ["opposite-side", "conceptual", (p) => p.b],
    ]),
    vars: (p: Pair) => ({
      t: String(p.a),
      u: String(p.b),
      n: String(10 * p.a + p.b),
      r: String(9 - p.b),
    }),
    constants: [1, 9, 10],
  } satisfies Spec<Pair>,
  {
    id: "N1.compare.17",
    node: "N1",
    subtype: "compare",
    form: "how-many-two-digit-numbers-are-greater",
    groups: [4, 4],
    origin: {
      olympiad:
        "a clever count of the numbers above a given one, the 'how many whole numbers fit' items of RES-4281 (Kangoeroe 2003)",
    },
    answer: "integer",
    draw: (r): One => ({ a: between(r, 10, 96) }),
    valid: (p: One) => p.a % 10 !== 9,
    solve: (p: One) => qi(99 - p.a),
    reference: (p: One) =>
      qi(
        Array.from({ length: 90 }, (_, i) => 10 + i).filter((x) => x > p.a)
          .length,
      ),
    traps: numberTraps<One>([
      ["counts-the-number-itself", "conceptual", (p) => 100 - p.a],
      ["whole-tens-only", "procedural", (p) => 10 * (9 - tens(p.a))],
    ]),
    vars: (p: One) => ({
      a: String(p.a),
      f: String(p.a + 1),
      r: String(99 - p.a),
    }),
    constants: [1, 99],
  } satisfies Spec<One>,
  {
    id: "N1.compare.18",
    node: "N1",
    subtype: "compare",
    form: "tens-and-ones-with-ten-or-more-ones",
    groups: [4, 4],
    answer: "compare",
    draw: (r) => {
      const t2 = between(r, 2, 8);
      return {
        t: between(r, 1, t2),
        o: between(r, 10, 19),
        t2,
        o2: between(r, 1, 9),
      };
    },
    valid: (p: Unnormalised) =>
      10 * p.t + p.o <= 99 &&
      signOf(p.t, p.t2) !== signOf(10 * p.t + p.o, 10 * p.t2 + p.o2),
    solve: (p: Unnormalised) => signOf(10 * p.t + p.o, 10 * p.t2 + p.o2),
    reference: (p: Unnormalised) =>
      bySubtraction(10 * p.t + p.o - 10 * p.t2, p.o2),
    traps: signTraps<Unnormalised>([
      ["tens-only", "conceptual", (p) => signOf(p.t, p.t2)],
      ["ones-only", "conceptual", (p) => signOf(p.o, p.o2)],
      [
        "swapped-sign",
        "fact",
        (p) => turned(signOf(10 * p.t + p.o, 10 * p.t2 + p.o2)),
      ],
    ]),
    vars: (p: Unnormalised) => ({
      t: String(p.t),
      o: String(p.o),
      t2: String(p.t2),
      o2: String(p.o2),
      m: String(10 * p.t + p.o),
      k: String(10 * p.t2 + p.o2),
      sign: signOf(10 * p.t + p.o, 10 * p.t2 + p.o2),
    }),
    constants: CONSTANTS,
  } satisfies Spec<Unnormalised>,
  {
    id: "N1.compare.19",
    node: "N1",
    subtype: "compare",
    form: "two-groups-of-circles-in-a-picture",
    groups: [2, 3],
    answer: "compare",
    draw: (r): Pair => {
      const a = between(r, 3, 19);
      return { a, b: r.int(6) === 0 ? a : between(r, 3, 19) };
    },
    solve: (p: Pair) => signOf(p.a, p.b),
    reference: (p: Pair) => bySubtraction(p.a, p.b),
    traps: toTwenty,
    vars: pairVars,
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
    // The second route looks for the smallest number that is greater than `a`.
    reference: (p: One) => {
      let n = 0;
      while (n <= p.a) n += 1;
      return qi(n);
    },
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
    // The second route looks for the greatest number that is smaller than `a`.
    reference: (p: One) => {
      let n = p.a;
      while (n >= p.a) n -= 1;
      return qi(n);
    },
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
    roles: {
      a: "first house number on one side of a street",
      b: "second house number on the same side",
      c: "third house number on the same side",
    },
    groups: [3, 4],
    answer: "integer",
    // The houses of one side of a street are numbered in twos.
    draw: (r): One => ({ a: between(r, 1, 93) }),
    solve: (p: One) => qi(p.a + 6),
    reference: (p: One) =>
      qi([p.a, p.a + 2, p.a + 4].map((x) => x + 2).at(-1) ?? -1),
    traps: numberTraps<One>([
      ["next-number", "conceptual", (p) => p.a + 5],
      ["repeat-last", "conceptual", (p) => p.a + 4],
    ]),
    vars: (p: One) => ({
      a: r1(p.a),
      b: r1(p.a + 2),
      c: r1(p.a + 4),
      r: r1(p.a + 6),
      n: r1(p.a + 5),
    }),
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
    draw: (r): One => ({ a: between(r, 10, 97) }),
    solve: (p: One) => qi(p.a + 2),
    reference: (p: One) =>
      qi(Array.from({ length: 3 }, (_, i) => p.a + i).at(-1) ?? -1),
    traps: numberTraps<One>([
      ["one-step", "procedural", (p) => p.a + 1],
      ["back-and-forth", "conceptual", (p) => p.a],
    ]),
    vars: (p: One) => ({ a: r1(p.a), m: r1(p.a + 1), r: r1(p.a + 2) }),
    constants: CONSTANTS,
  } satisfies Spec<One>,
  {
    id: "N1.before-after.12",
    node: "N1",
    subtype: "before-after",
    form: "one-less-than",
    groups: [3, 4],
    answer: "integer",
    draw: (r): One => ({ a: between(r, 12, 99) }),
    solve: (p: One) => qi(p.a - 2),
    reference: (p: One) =>
      qi(Array.from({ length: 3 }, (_, i) => p.a - i).at(-1) ?? -1),
    traps: numberTraps<One>([
      ["one-step", "procedural", (p) => p.a - 1],
      ["back-and-forth", "conceptual", (p) => p.a],
    ]),
    vars: (p: One) => ({ a: r1(p.a), m: r1(p.a - 1), r: r1(p.a - 2) }),
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
  {
    id: "N1.before-after.16",
    node: "N1",
    subtype: "before-after",
    form: "sum-of-the-two-neighbours",
    groups: [4, 4],
    origin: {
      olympiad:
        "the two neighbours of a number are balanced around it, so their sum is twice the number; RES-4281 (MCCME school stage 2021 style)",
    },
    answer: "integer",
    draw: (r): One => ({ a: between(r, 6, 49) }),
    solve: (p: One) => qi((2 * p.a) / 2),
    reference: (p: One) => {
      const s = 2 * p.a;
      for (let n = 1; n < s; n += 1) if (n - 1 + (n + 1) === s) return qi(n);
      return qi(-1);
    },
    traps: numberTraps<One>([
      ["the-number-before", "conceptual", (p) => p.a - 1],
      ["the-number-after", "conceptual", (p) => p.a + 1],
    ]),
    vars: (p: One) => ({
      s: r1(2 * p.a),
      r: r1(p.a),
      lo: r1(p.a - 1),
      hi: r1(p.a + 1),
    }),
    constants: CONSTANTS,
  } satisfies Spec<One>,
  {
    id: "N1.before-after.17",
    node: "N1",
    subtype: "before-after",
    form: "even-numbers-between",
    groups: [4, 4],
    answer: "integer",
    draw: (r) => {
      const a = between(r, 11, 60);
      return { a, b: a + between(r, 8, 25) };
    },
    solve: (p: { a: number; b: number }) =>
      qi(Math.floor((p.b - 1) / 2) - Math.floor(p.a / 2)),
    reference: (p: { a: number; b: number }) =>
      qi(
        Array.from({ length: p.b - p.a - 1 }, (_, i) => p.a + 1 + i).filter(
          (x) => x % 2 === 0,
        ).length,
      ),
    traps: numberTraps<{ a: number; b: number }>([
      ["all-numbers", "conceptual", (p) => p.b - p.a - 1],
      [
        "ends-included",
        "conceptual",
        (p) => Math.floor(p.b / 2) - Math.floor((p.a - 1) / 2),
      ],
      ["half-of-difference", "procedural", (p) => Math.floor((p.b - p.a) / 2)],
    ]),
    vars: (p: { a: number; b: number }) => {
      const first = p.a % 2 === 0 ? p.a + 2 : p.a + 1;
      const last = p.b % 2 === 0 ? p.b - 2 : p.b - 1;
      return {
        a: r1(p.a),
        b: r1(p.b),
        n: r1(p.b - p.a - 1),
        f: r1(first),
        l: r1(last),
        r: r1(Math.floor((p.b - 1) / 2) - Math.floor(p.a / 2)),
      };
    },
    constants: CONSTANTS,
  } satisfies Spec<{ a: number; b: number }>,
  {
    id: "N1.before-after.18",
    node: "N1",
    subtype: "before-after",
    form: "digits-in-the-page-numbers",
    roles: { a: "number of the last page of the book" },
    groups: [4, 4],
    origin: {
      olympiad:
        "a clever count of digits in a row of numbers, split by the number of digits; RES-4281 (MCCME school stage 2021, Kangaroo style)",
    },
    answer: "integer",
    draw: (r): One => ({ a: between(r, 12, 39) }),
    solve: (p: One) => qi(9 + 2 * (p.a - 9)),
    reference: (p: One) =>
      qi(
        Array.from({ length: p.a }, (_, i) => String(i + 1).length).reduce(
          (x, y) => x + y,
          0,
        ),
      ),
    traps: numberTraps<One>([
      ["one-digit-each", "conceptual", (p) => p.a],
      ["two-digits-each", "conceptual", (p) => 2 * p.a],
      ["single-pages-forgotten", "procedural", (p) => 2 * (p.a - 9)],
    ]),
    vars: (p: One) => ({
      a: r1(p.a),
      m: r1(p.a - 9),
      d: r1(2 * (p.a - 9)),
      r: r1(9 + 2 * (p.a - 9)),
    }),
    constants: [1, 2, 9, 10],
  } satisfies Spec<One>,
  {
    id: "N1.before-after.19",
    node: "N1",
    subtype: "before-after",
    form: "last-number-of-a-row",
    roles: {
      a: "first number of the row",
      k: "how many numbers the row holds",
    },
    groups: [4, 4],
    answer: "integer",
    draw: (r) => ({ a: between(r, 5, 80), k: between(r, 5, 15) }),
    solve: (p: { a: number; k: number }) => qi(p.a + p.k - 1),
    reference: (p: { a: number; k: number }) =>
      qi(Array.from({ length: p.k }, (_, i) => p.a + i).at(-1) ?? -1),
    traps: numberTraps<{ a: number; k: number }>([
      ["first-counted-twice", "conceptual", (p) => p.a + p.k],
      ["both-ends-removed", "procedural", (p) => p.a + p.k - 2],
    ]),
    vars: (p: { a: number; k: number }) => ({
      a: r1(p.a),
      k: r1(p.k),
      j: r1(p.k - 1),
      r: r1(p.a + p.k - 1),
    }),
    constants: CONSTANTS,
  } satisfies Spec<{ a: number; k: number }>,
  {
    id: "N1.before-after.20",
    node: "N1",
    subtype: "before-after",
    form: "the-number-before-and-the-number-after",
    groups: [3, 4],
    answer: "pair",
    draw: (r): One => ({ a: between(r, 11, 98) }),
    solve: (p: One) => [qi(p.a - 1), qi(p.a + 1)] as const,
    reference: (p: One) => {
      const row = Array.from({ length: 101 }, (_, n) => n);
      return [
        qi(row.find((n) => n + 1 === p.a) ?? -1),
        qi(row.find((n) => n - 1 === p.a) ?? -1),
      ] as const;
    },
    traps: [
      {
        id: "order-swapped",
        kind: "conceptual" as const,
        wrong: (p: One) => [qi(p.a + 1), qi(p.a - 1)] as const,
      },
      {
        id: "two-away",
        kind: "procedural" as const,
        wrong: (p: One) => [qi(p.a - 2), qi(p.a + 2)] as const,
      },
      {
        id: "both-after",
        kind: "conceptual" as const,
        wrong: (p: One) => [qi(p.a + 1), qi(p.a + 2)] as const,
      },
    ],
    vars: (p: One) => ({
      a: r1(p.a),
      lo: r1(p.a - 1),
      hi: r1(p.a + 1),
      r: `${p.a - 1}; ${p.a + 1}`,
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
