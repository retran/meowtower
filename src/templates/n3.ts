// Node N3, numbers in words and digits (level 1F) and comparing numbers of up to six digits (level 1S)
// (RES-4281). The Dutch goals read and write numbers to 100 at group 3, to 1,000 at group 5 and to
// 100,000 at group 6, and compare numbers to 1,000,000 at group 7. Texts are plain blanks in
// `content/tasks-n.ru.json`, keyed by the template id.
import type { Xoshiro128 } from "../math/rng.js";
import { between, digits, qi, signOf } from "./draw.js";
import { SIGNS, type Spec } from "./spec.js";
import { withWrongAnswers } from "./n1.js";
import { numberWords } from "./words.js";

const s = String;
const sumDigits = (n: number): number =>
  [...s(n)].reduce((a, c) => a + Number(c), 0);
const flip = (sign: (typeof SIGNS)[number]): (typeof SIGNS)[number] =>
  sign === "<" ? ">" : sign === ">" ? "<" : "=";
const bySubtraction = (a: number, b: number): (typeof SIGNS)[number] =>
  SIGNS[Math.sign(a - b) + 1] ?? "=";
const firstDigit = (n: number): number => Number(s(n)[0]);

interface N {
  n: number;
}
interface Pair {
  a: number;
  b: number;
  x?: number;
  y?: number;
}

type Sign = (typeof SIGNS)[number];
type Kind = "conceptual" | "procedural" | "fact";
/** Traps that give a whole number: one that gives a number an earlier trap already gives returns null. */
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
/** Traps that give a sign, with the same rule for a sign an earlier trap already gives. */
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
/** Both parts of a number of thousands written in full: 2312 as 2000312. */
const partsInFull = (n: number): number =>
  Number(`${Math.floor(n / 1000) * 1000}${n % 1000}`);

const wordsVars = (p: N) => ({ w: numberWords(p.n), r: s(p.n) });

/** A number built from thousands and a remainder: the remainder has an empty place half the time. */
const thousands = (r: Xoshiro128, lo: number, hi: number): number =>
  between(r, lo, hi) * 1000 +
  (r.int(2) === 0 ? between(r, 1, 99) : between(r, 100, 999));
const joined = (n: number): number | null =>
  n % 1000 >= 100 ? null : Number(`${Math.floor(n / 1000)}${n % 1000}`);

/** Rotates a list of options by a drawn offset, so the right one is not always first. */
const rotate = <T>(list: readonly T[], by: number): T[] =>
  list.map((_, i) => list[(i + by) % list.length] as T);

interface Choice {
  n: number;
  by: number;
}

const choiceSpec = (
  id: string,
  form: string,
  groups: readonly [number, number],
  drawN: (r: Xoshiro128) => number,
  distract: (n: number) => readonly [string, string, string],
  names: readonly [string, string, string],
  valid?: (n: number) => boolean,
): Spec<Choice> => {
  const options = (p: Choice) => rotate([digits(p.n), ...distract(p.n)], p.by);
  return {
    id,
    node: "N3",
    subtype: "words-digits",
    form,
    groups,
    answer: "choice",
    draw: (r) => ({ n: drawN(r), by: r.int(4) }),
    ...(valid ? { valid: (p: Choice) => valid(p.n) } : {}),
    solve: (p) => digits(p.n),
    reference: (p) =>
      options(p).find((o) => o.replace(/ /g, "") === s(p.n)) ?? "",
    options,
    traps: names.map((name, i) => ({
      id: name,
      kind: "conceptual" as const,
      wrong: (p: Choice) => distract(p.n)[i] ?? null,
    })),
    vars: (p) => ({
      w: numberWords(p.n),
      r: digits(p.n),
      o1: distract(p.n)[0],
      o2: distract(p.n)[1],
      o3: distract(p.n)[2],
    }),
    constants: [0, 10],
  };
};

const wordsDigits = [
  {
    id: "N3.words-digits.01",
    node: "N3",
    subtype: "words-digits",
    form: "two-digit-number-in-words-to-digits",
    groups: [3, 4],
    answer: "integer",
    draw: (r): N => ({ n: between(r, 21, 99) }),
    valid: (p: N) => p.n % 10 !== 0 && Math.floor(p.n / 10) !== p.n % 10,
    solve: (p: N) => qi(p.n),
    reference: (p: N) => qi(10 * Math.floor(p.n / 10) + (p.n % 10)),
    traps: numberTraps<N>([
      ["reversed", "conceptual", (p) => 10 * (p.n % 10) + Math.floor(p.n / 10)],
      [
        "each-word-in-full",
        "conceptual",
        (p) => Number(`${10 * Math.floor(p.n / 10)}${p.n % 10}`),
      ],
      ["tens-word-only", "procedural", (p) => 10 * Math.floor(p.n / 10)],
    ]),
    vars: (p: N) => ({
      ...wordsVars(p),
      rev: s(10 * (p.n % 10) + Math.floor(p.n / 10)),
      t: s(Math.floor(p.n / 10)),
      o: s(p.n % 10),
    }),
    constants: [10],
  } satisfies Spec<N>,
  {
    id: "N3.words-digits.02",
    node: "N3",
    subtype: "words-digits",
    form: "hundreds-and-ones-in-words-with-an-empty-tens-place",
    groups: [5, 5],
    answer: "integer",
    draw: (r): N => ({ n: 100 * between(r, 1, 9) + between(r, 1, 9) }),
    solve: (p: N) => qi(p.n),
    reference: (p: N) => qi(Number(`${Math.floor(p.n / 100)}0${p.n % 10}`)),
    traps: numberTraps<N>([
      [
        "dropped-zero",
        "conceptual",
        (p) => 10 * Math.floor(p.n / 100) + (p.n % 10),
      ],
      [
        "two-zeros",
        "conceptual",
        (p) => Number(`${Math.floor(p.n / 100)}00${p.n % 10}`),
      ],
      [
        "zero-at-end",
        "conceptual",
        (p) => Number(`${Math.floor(p.n / 100)}${p.n % 10}0`),
      ],
    ]),
    vars: (p: N) => ({
      ...wordsVars(p),
      short: s(10 * Math.floor(p.n / 100) + (p.n % 10)),
    }),
    constants: [0],
  } satisfies Spec<N>,
  {
    id: "N3.words-digits.03",
    node: "N3",
    subtype: "words-digits",
    form: "three-digit-number-in-words-to-digits",
    groups: [5, 5],
    answer: "integer",
    draw: (r): N => ({
      n: 100 * between(r, 1, 9) + 10 * between(r, 2, 9) + between(r, 1, 9),
    }),
    solve: (p: N) => qi(p.n),
    reference: (p: N) =>
      qi([...s(p.n)].reduce((acc, c, i) => acc + Number(c) * 10 ** (2 - i), 0)),
    traps: numberTraps<N>([
      [
        "each-word-in-full",
        "conceptual",
        (p) =>
          Number(
            `${Math.floor(p.n / 100)}${(Math.floor(p.n / 10) % 10) * 10}${p.n % 10}`,
          ),
      ],
      [
        "forgot-tens",
        "procedural",
        (p) => Number(`${Math.floor(p.n / 100)}0${p.n % 10}`),
      ],
      [
        "tens-not-scaled",
        "procedural",
        (p) =>
          100 * Math.floor(p.n / 100) +
          (Math.floor(p.n / 10) % 10) +
          (p.n % 10),
      ],
    ]),
    vars: (p: N) => ({
      ...wordsVars(p),
      long: s(
        Number(
          `${Math.floor(p.n / 100)}${(Math.floor(p.n / 10) % 10) * 10}${p.n % 10}`,
        ),
      ),
    }),
    constants: [10],
  } satisfies Spec<N>,
  {
    id: "N3.words-digits.04",
    node: "N3",
    subtype: "words-digits",
    form: "four-digit-number-in-words-to-digits",
    groups: [5, 6],
    answer: "integer",
    draw: (r): N => ({ n: thousands(r, 1, 9) }),
    solve: (p: N) => qi(p.n),
    reference: (p: N) =>
      qi(Number(`${Math.floor(p.n / 1000)}${s(p.n % 1000).padStart(3, "0")}`)),
    traps: numberTraps<N>([
      ["joined-without-zeros", "conceptual", (p) => joined(p.n)],
      ["each-part-in-full", "conceptual", (p) => partsInFull(p.n)],
      ["thousands-only", "procedural", (p) => 1000 * Math.floor(p.n / 1000)],
    ]),
    vars: (p: N) => ({
      ...wordsVars(p),
      joined: s(joined(p.n) ?? 0),
      k: s(Math.floor(p.n / 1000)),
      rem: s(p.n % 1000),
    }),
    constants: [0, 1000],
  } satisfies Spec<N>,
  {
    id: "N3.words-digits.05",
    node: "N3",
    subtype: "words-digits",
    form: "six-digit-number-in-words-to-digits",
    groups: [6, 7],
    answer: "integer",
    draw: (r): N => ({ n: thousands(r, 10, 999) }),
    solve: (p: N) => qi(p.n),
    reference: (p: N) => qi(Math.floor(p.n / 1000) * 1000 + (p.n % 1000)),
    traps: numberTraps<N>([
      ["joined-without-zeros", "conceptual", (p) => joined(p.n)],
      ["each-part-in-full", "conceptual", (p) => partsInFull(p.n)],
      ["thousands-only", "procedural", (p) => 1000 * Math.floor(p.n / 1000)],
    ]),
    vars: (p: N) => ({
      ...wordsVars(p),
      joined: s(joined(p.n) ?? 0),
      k: s(Math.floor(p.n / 1000)),
      rem: s(p.n % 1000),
    }),
    constants: [0, 1000],
  } satisfies Spec<N>,
  {
    id: "N3.words-digits.06",
    node: "N3",
    subtype: "words-digits",
    form: "how-many-digits-in-a-number-given-in-words",
    groups: [5, 6],
    answer: "integer",
    draw: (r): N => ({
      n: [between(r, 21, 99), thousands(r, 1, 9), thousands(r, 10, 999)][
        r.int(3)
      ] as number,
    }),
    valid: (p: N) => p.n % 1000 !== 0,
    solve: (p: N) => qi(s(p.n).length),
    reference: (p: N) => qi(Math.floor(Math.log10(p.n)) + 1),
    traps: numberTraps<N>([
      ["count-words", "conceptual", (p) => numberWords(p.n).split(" ").length],
      ["zeros-forgotten", "conceptual", (p) => s(p.n).replace(/0/g, "").length],
      [
        "each-part-in-full",
        "conceptual",
        (p) =>
          p.n >= 1000
            ? s(partsInFull(p.n)).length
            : p.n % 10 === 0
              ? null
              : s(Number(`${10 * Math.floor(p.n / 10)}${p.n % 10}`)).length,
      ],
    ]),
    vars: (p: N) => ({
      w: numberWords(p.n),
      r: s(s(p.n).length),
      cnt: s(numberWords(p.n).split(" ").length),
      n: s(p.n),
    }),
    constants: [10],
  } satisfies Spec<N>,
  choiceSpec(
    "N3.words-digits.07",
    "choose-the-digits-for-a-two-digit-number-in-words",
    [3, 4],
    (r) => between(r, 21, 99),
    (n) => [
      digits(10 * (n % 10) + Math.floor(n / 10)),
      digits(n * 10),
      digits(n + 10),
    ],
    ["reversed", "times-ten", "plus-ten"],
    (n) => n % 10 !== 0 && Math.floor(n / 10) !== n % 10,
  ),
  choiceSpec(
    "N3.words-digits.08",
    "choose-the-digits-for-hundreds-and-ones-in-words",
    [5, 5],
    (r) => 100 * between(r, 1, 9) + between(r, 1, 9),
    (n) => [
      digits(10 * Math.floor(n / 100) + (n % 10)),
      digits(10 * n),
      digits(Number(`${Math.floor(n / 100)}00${n % 10}`)),
    ],
    ["dropped-zero", "ends-with-zero", "two-zeros"],
  ),
  choiceSpec(
    "N3.words-digits.09",
    "choose-the-digits-for-thousands-and-hundreds-in-words",
    [5, 6],
    (r) => 1000 * between(r, 1, 9) + 100 * between(r, 1, 9),
    (n) => [
      digits(Number(`${Math.floor(n / 1000)}${Math.floor((n % 1000) / 100)}`)),
      digits(
        Number(`${Math.floor(n / 1000)}0${Math.floor((n % 1000) / 100)}0`),
      ),
      digits(10 * n),
    ],
    ["no-zeros", "zeros-in-the-wrong-places", "extra-zero"],
  ),
  choiceSpec(
    "N3.words-digits.10",
    "choose-the-digits-for-whole-thousands-in-words",
    [6, 7],
    (r) => 1000 * between(r, 101, 999),
    (n) => [digits(n / 1000), digits(n / 10), digits(10 * n)],
    ["thousand-lost", "one-zero-short", "one-zero-extra"],
    (n) => (n / 1000) % 10 !== 0,
  ),
] as const;

type Cmp = (a: number, b: number) => (typeof SIGNS)[number];

const pairSpec = (
  id: string,
  form: string,
  draw: (r: Xoshiro128) => Pair,
  extra: {
    valid?: (p: Pair) => boolean;
    traps: readonly (readonly [string, Kind, (p: Pair) => Sign | null])[];
    vars?: (p: Pair) => Record<string, string>;
    groups?: readonly [number, number];
    reference?: Cmp;
  },
): Spec<Pair> => ({
  id,
  node: "N3",
  subtype: "compare-six",
  form,
  groups: extra.groups ?? [7, 7],
  answer: "compare",
  draw,
  ...(extra.valid ? { valid: extra.valid } : {}),
  solve: (p) => signOf(p.a, p.b),
  reference: (p) => (extra.reference ?? bySubtraction)(p.a, p.b),
  traps: signTraps<Pair>(extra.traps),
  vars: (p) => ({
    a: digits(p.a),
    b: digits(p.b),
    sign: signOf(p.a, p.b),
    ...(extra.vars ? extra.vars(p) : {}),
  }),
  constants: [1, 10, 1000],
});

const swappedSign = (p: Pair): Sign | null => {
  const sign = signOf(p.a, p.b);
  return sign === "=" ? null : flip(sign);
};
const lastDigits = (p: Pair): Sign => signOf(p.a % 10, p.b % 10);
const firstDigits = (p: Pair): Sign => signOf(firstDigit(p.a), firstDigit(p.b));
const digitSum = (p: Pair): Sign => signOf(sumDigits(p.a), sumDigits(p.b));
/** The traps of two plain six-digit numbers. */
const plainTraps: readonly (readonly [
  string,
  Kind,
  (p: Pair) => Sign | null,
])[] = [
  ["last-digits", "conceptual", lastDigits],
  ["swapped-sign", "fact", swappedSign],
  ["digit-sum", "conceptual", digitSum],
  ["first-digits", "conceptual", firstDigits],
];

const six = (r: Xoshiro128): number => between(r, 100_000, 999_999);

const compareSix = [
  pairSpec(
    "N3.compare-six.01",
    "two-six-digit-numbers",
    (r) => ({ a: six(r), b: six(r) }),
    {
      groups: [7, 7],
      traps: plainTraps,
    },
  ),
  pairSpec(
    "N3.compare-six.02",
    "same-first-three-digits",
    (r) => {
      const head = between(r, 100, 999) * 1000;
      return { a: head + between(r, 0, 999), b: head + between(r, 0, 999) };
    },
    {
      valid: (p) => p.a !== p.b,
      traps: [
        ["heads-equal", "conceptual", () => "="],
        [
          "tail-first-digits",
          "conceptual",
          (p) => signOf(firstDigit(p.a % 1000), firstDigit(p.b % 1000)),
        ],
        ["last-digits", "conceptual", lastDigits],
        ["swapped-sign", "fact", swappedSign],
      ],
      vars: (p) => ({
        head: s(Math.floor(p.a / 1000)),
        ta: s(p.a % 1000),
        tb: s(p.b % 1000),
      }),
    },
  ),
  pairSpec(
    "N3.compare-six.03",
    "five-digits-against-six-digits",
    (r) => {
      const small = between(r, 10_000, 99_999);
      const large = six(r);
      return r.int(2) === 0 ? { a: small, b: large } : { a: large, b: small };
    },
    {
      groups: [6, 7],
      traps: [
        ["first-digits", "conceptual", firstDigits],
        ["last-digits", "conceptual", lastDigits],
        ["swapped-sign", "fact", swappedSign],
      ],
    },
  ),
  pairSpec(
    "N3.compare-six.04",
    "six-digit-number-in-words-against-digits",
    (r) => ({ a: six(r), b: six(r) }),
    {
      traps: [
        ["written-in-full", "conceptual", (p) => signOf(partsInFull(p.a), p.b)],
        [
          "joined-without-zeros",
          "conceptual",
          (p) => {
            const j = joined(p.a);
            return j === null ? null : signOf(j, p.b);
          },
        ],
        [
          "thousands-only",
          "procedural",
          (p) => signOf(1000 * Math.floor(p.a / 1000), p.b),
        ],
        ["swapped-sign", "fact", swappedSign],
      ],
      vars: (p) => ({
        w: numberWords(p.a),
        k: s(Math.floor(p.a / 1000)),
        rem: s(p.a % 1000),
      }),
    },
  ),
  pairSpec(
    "N3.compare-six.05",
    "populations-of-two-cities",
    (r) => ({ a: six(r), b: six(r) }),
    {
      traps: plainTraps,
    },
  ),
  pairSpec(
    "N3.compare-six.06",
    "only-the-hundreds-differ",
    (r) => {
      const base = between(r, 100, 999) * 1000 + between(r, 0, 99);
      return {
        a: base + 100 * between(r, 0, 9),
        b: base + 100 * between(r, 0, 9),
      };
    },
    {
      valid: (p) => p.a !== p.b,
      traps: [
        ["last-digits", "conceptual", lastDigits],
        ["swapped-sign", "fact", swappedSign],
      ],
      vars: (p) => ({
        ha: s(Math.floor((p.a % 1000) / 100)),
        hb: s(Math.floor((p.b % 1000) / 100)),
      }),
    },
  ),
  pairSpec(
    "N3.compare-six.07",
    "a-round-number-against-nines",
    (r) => {
      const x = between(r, 2, 9) * 100_000;
      return r.int(2) === 0 ? { a: x, b: x - 1 } : { a: x - 1, b: x };
    },
    {
      traps: [
        ["digit-sum", "conceptual", digitSum],
        ["same-length-equal", "conceptual", () => "="],
        ["swapped-sign", "fact", swappedSign],
      ],
    },
  ),
  pairSpec(
    "N3.compare-six.08",
    "thousands-against-a-number",
    (r) => ({ a: between(r, 100, 999) * 1000, b: six(r) }),
    {
      traps: [
        ["thousands-ignored", "conceptual", (p) => signOf(p.a / 1000, p.b)],
        ["last-digits", "conceptual", lastDigits],
        ["swapped-sign", "fact", swappedSign],
        ["first-digits", "conceptual", firstDigits],
      ],
      vars: (p) => ({ k: s(p.a / 1000) }),
    },
  ),
  pairSpec(
    "N3.compare-six.09",
    "sum-of-two-six-digit-addends-against-a-number",
    (r) => {
      const x = between(r, 100_000, 499_999);
      const y = between(r, 100_000, 499_999);
      return { a: x + y, b: six(r), x, y };
    },
    {
      traps: [
        ["first-addend", "procedural", (p) => signOf(p.x ?? 0, p.b)],
        [
          "larger-addend",
          "procedural",
          (p) => signOf(Math.max(p.x ?? 0, p.y ?? 0), p.b),
        ],
        ["swapped-sign", "fact", swappedSign],
      ],
      vars: (p) => ({
        x: digits(p.x ?? 0),
        y: digits(p.y ?? 0),
        sum: digits(p.a),
      }),
    },
  ),
  pairSpec(
    "N3.compare-six.10",
    "same-digits-in-another-order",
    (r) => {
      const a = six(r);
      const rev = Number([...s(a)].reverse().join(""));
      return { a, b: rev };
    },
    {
      valid: (p) => p.a !== p.b && p.b >= 100_000,
      traps: [
        ["same-digits-equal", "conceptual", () => "="],
        ["last-digits", "conceptual", lastDigits],
        ["swapped-sign", "fact", swappedSign],
      ],
    },
  ),
] as const;

export const n3Specs = withWrongAnswers([
  ...wordsDigits,
  ...compareSix,
] as unknown as readonly Spec<never>[]);
