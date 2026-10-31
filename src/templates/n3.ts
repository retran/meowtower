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

const ROMAN: readonly (readonly [number, string])[] = [
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];
const toRoman = (n: number): string => {
  let rest = n;
  let out = "";
  for (const [v, sym] of ROMAN)
    while (rest >= v) {
      out += sym;
      rest -= v;
    }
  return out;
};
const LETTER: Readonly<Record<string, number>> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
};
/** The value of a numeral by the rule that a smaller letter before a larger one is taken away. */
const fromRoman = (t: string): number =>
  [...t].reduce((acc, c, i) => {
    const v = LETTER[c] ?? 0;
    const next = LETTER[t[i + 1] ?? ""] ?? 0;
    return acc + (v < next ? -v : v);
  }, 0);
const swapVX = (t: string): string =>
  [...t].map((c) => (c === "V" ? "X" : c === "X" ? "V" : c)).join("");
const hasTaking = (n: number): boolean => /IV|IX|XL|XC/.test(toRoman(n));

interface Words4 {
  k: number;
  tail: number;
  by: number;
}
const countDigit = (n: number, d: number): number =>
  Array.from({ length: n }, (_, i) => String(i + 1))
    .join("")
    .split(String(d)).length - 1;

interface Four6 {
  v: number[];
  by: number;
}
interface Gap {
  digitsA: number[];
  at: number;
  x: number;
  tailB: number[];
}
/** Six digits written with a space between the thousands, a square standing for the unknown digit. */
const groupText = (t: string): string => `${t.slice(0, 3)}\u00A0${t.slice(3)}`;
const countGreater = (p: Gap): number => {
  const tailA = Number(p.digitsA.slice(p.at + 1).join(""));
  const tailB = Number(p.tailB.join(""));
  return 9 - p.x + (tailA > tailB ? 1 : 0);
};
const smallestWithSum = (sum: number): number => {
  const nines = Math.floor((sum - 1) / 9);
  const mid = sum - 9 * nines - 1;
  const zeros = 6 - 1 - nines - (mid > 0 ? 1 : 0);
  return Number(
    `1${"0".repeat(zeros)}${mid > 0 ? String(mid) : ""}${"9".repeat(nines)}`,
  );
};
let smallest: Map<number, number> | null = null;
/** The smallest six-digit number of each digit sum, found by walking up from 100,000. */
const scanSmallest = (sum: number): number => {
  if (smallest === null) {
    smallest = new Map();
    for (let n = 100_000; n <= 999_999; n += 1) {
      const t = sumDigits(n);
      if (!smallest.has(t)) smallest.set(t, n);
    }
  }
  return smallest.get(sum) ?? -1;
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
    // The second route joins the two digits as text, not as tens and ones.
    reference: (p: N) => qi(Number(`${Math.floor(p.n / 10)}${p.n % 10}`)),
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
    // The second route joins the thousands and the three last digits as text.
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
  {
    id: "N3.words-digits.11",
    node: "N3",
    subtype: "words-digits",
    form: "number-with-a-teen-in-words-to-digits",
    groups: [5, 5],
    answer: "integer",
    draw: (r) => ({ h: between(r, 1, 9), u: between(r, 1, 9) }),
    solve: (p: { h: number; u: number }) => qi(100 * p.h + 10 + p.u),
    reference: (p: { h: number; u: number }) => qi(Number(`${p.h}1${p.u}`)),
    traps: numberTraps<{ h: number; u: number }>([
      ["units-first", "conceptual", (p) => Number(`${p.h}${p.u}1`)],
      ["each-word-in-full", "conceptual", (p) => Number(`${p.h}00${10 + p.u}`)],
      ["teen-as-ones", "procedural", (p) => 100 * p.h + p.u],
    ]),
    vars: (p: { h: number; u: number }) => ({
      w: numberWords(100 * p.h + 10 + p.u),
      r: s(100 * p.h + 10 + p.u),
      hh: s(100 * p.h),
      teen: s(10 + p.u),
    }),
    constants: [10],
  } satisfies Spec<{ h: number; u: number }>,
  {
    id: "N3.words-digits.12",
    node: "N3",
    subtype: "words-digits",
    form: "roman-numeral-to-digits",
    groups: [7, 8],
    origin: {
      extension:
        "Roman numerals, Russian grade 5 (RES-4281, federal programme for grades 5 to 9)",
    },
    answer: "integer",
    draw: (r) => ({ n: between(r, 4, 89) }),
    valid: (p: N) => hasTaking(p.n),
    solve: (p: N) => qi(p.n),
    reference: (p: N) => qi(fromRoman(toRoman(p.n))),
    traps: numberTraps<N>([
      [
        "every-letter-added",
        "conceptual",
        (p) => [...toRoman(p.n)].reduce((a, c) => a + (LETTER[c] ?? 0), 0),
      ],
      ["v-and-x-swapped", "conceptual", (p) => fromRoman(swapVX(toRoman(p.n)))],
    ]),
    vars: (p: N) => ({
      roman: toRoman(p.n),
      r: s(p.n),
      added: s([...toRoman(p.n)].reduce((a, c) => a + (LETTER[c] ?? 0), 0)),
    }),
    constants: [1, 5, 10, 50],
  } satisfies Spec<N>,
  {
    id: "N3.words-digits.13",
    node: "N3",
    subtype: "words-digits",
    form: "choose-the-words-for-a-six-digit-number",
    groups: [6, 7],
    answer: "choice",
    draw: (r): Words4 => ({
      k: between(r, 101, 999),
      tail: between(r, 1, 99),
      by: r.int(4),
    }),
    valid: (p: Words4) => p.k % 100 !== 0 && p.k !== p.tail,
    options: (p: Words4) =>
      rotate(
        [
          numberWords(1000 * p.k + p.tail),
          numberWords(Number(`${p.k}${p.tail}`)),
          numberWords(1000 * p.tail + p.k),
          numberWords(1000 * p.k),
        ],
        p.by,
      ),
    solve: (p: Words4) => numberWords(1000 * p.k + p.tail),
    reference: (p: Words4) =>
      rotate(
        [
          numberWords(1000 * p.k + p.tail),
          numberWords(Number(`${p.k}${p.tail}`)),
          numberWords(1000 * p.tail + p.k),
          numberWords(1000 * p.k),
        ],
        p.by,
      ).find((o) => o === numberWords(1000 * p.k + p.tail)) ?? "",
    traps: [
      {
        id: "zeros-lost",
        kind: "conceptual" as const,
        wrong: (p: Words4) => numberWords(Number(`${p.k}${p.tail}`)),
      },
      {
        id: "groups-swapped",
        kind: "conceptual" as const,
        wrong: (p: Words4) => numberWords(1000 * p.tail + p.k),
      },
      {
        id: "thousands-only",
        kind: "procedural" as const,
        wrong: (p: Words4) => numberWords(1000 * p.k),
      },
    ],
    vars: (p: Words4) => ({
      n: digits(1000 * p.k + p.tail),
      r: numberWords(1000 * p.k + p.tail),
      k: s(p.k),
      tail: s(p.tail),
      tg: s(p.tail).padStart(3, "0"),
      lost: digits(Number(`${p.k}${p.tail}`)),
      swapped: digits(1000 * p.tail + p.k),
      kk: digits(1000 * p.k),
    }),
    constants: [1000],
  } satisfies Spec<Words4>,
  {
    id: "N3.words-digits.14",
    node: "N3",
    subtype: "words-digits",
    form: "how-many-tens-of-thousands-in-a-number",
    groups: [6, 7],
    answer: "integer",
    draw: (r): N => ({ n: between(r, 110_000, 999_999) }),
    valid: (p: N) => Math.floor(p.n / 10_000) % 10 !== 0 && p.n % 10_000 !== 0,
    solve: (p: N) => qi(Math.floor(p.n / 10_000)),
    reference: (p: N) => qi(Number(s(p.n).slice(0, -4))),
    traps: numberTraps<N>([
      [
        "tens-of-thousands-digit",
        "conceptual",
        (p) => Math.floor(p.n / 10_000) % 10,
      ],
      ["thousands", "conceptual", (p) => Math.floor(p.n / 1000)],
      [
        "hundred-thousands-digit",
        "conceptual",
        (p) => Math.floor(p.n / 100_000),
      ],
    ]),
    vars: (p: N) => ({
      n: digits(p.n),
      r: s(Math.floor(p.n / 10_000)),
      rest: s(p.n % 10_000),
      cut: digits(10_000 * Math.floor(p.n / 10_000)),
      d: s(Math.floor(p.n / 10_000) % 10),
      th: s(Math.floor(p.n / 1000)),
    }),
    constants: [10, 10_000],
  } satisfies Spec<N>,
  {
    id: "N3.words-digits.15",
    node: "N3",
    subtype: "words-digits",
    form: "how-many-times-a-digit-is-written-in-the-numbers-up-to",
    groups: [5, 6],
    origin: {
      olympiad:
        "counting how often a digit is written in a run of numbers; RES-4281 (Dutch group 5 example 'how many numbers have a 9', MCCME school stage)",
    },
    answer: "integer",
    draw: (r) => ({ n: between(r, 30, 99), d: between(r, 1, 9) }),
    valid: (p: { n: number; d: number }) => p.d <= Math.floor(p.n / 10) + 1,
    solve: (p: { n: number; d: number }) => {
      const tens = Math.floor(p.n / 10);
      const ones = tens + (p.n % 10 >= p.d ? 1 : 0);
      const asTens = tens > p.d ? 10 : tens === p.d ? (p.n % 10) + 1 : 0;
      return qi(ones + asTens);
    },
    reference: (p: { n: number; d: number }) => qi(countDigit(p.n, p.d)),
    traps: numberTraps<{ n: number; d: number }>([
      [
        "only-the-ones-place",
        "conceptual",
        (p) => Math.floor(p.n / 10) + (p.n % 10 >= p.d ? 1 : 0),
      ],
      [
        "only-the-tens-place",
        "conceptual",
        (p) => {
          const tens = Math.floor(p.n / 10);
          const asTens = tens > p.d ? 10 : tens === p.d ? (p.n % 10) + 1 : 0;
          return asTens === 0 ? null : asTens;
        },
      ],
      [
        "numbers-containing",
        "conceptual",
        (p) =>
          Array.from({ length: p.n }, (_, i) => String(i + 1)).filter((x) =>
            x.includes(String(p.d)),
          ).length,
      ],
    ]),
    vars: (p: { n: number; d: number }) => {
      const tens = Math.floor(p.n / 10);
      const ones = tens + (p.n % 10 >= p.d ? 1 : 0);
      const asTens = tens > p.d ? 10 : tens === p.d ? (p.n % 10) + 1 : 0;
      return {
        n: s(p.n),
        d: s(p.d),
        ones: s(ones),
        tensPlace: s(asTens),
        r: s(ones + asTens),
      };
    },
    constants: [1, 10],
  } satisfies Spec<{ n: number; d: number }>,
] as const;

const pairSpec = (
  id: string,
  form: string,
  draw: (r: Xoshiro128) => Pair,
  extra: {
    valid?: (p: Pair) => boolean;
    traps: readonly (readonly [string, Kind, (p: Pair) => Sign | null])[];
    vars?: (p: Pair) => Record<string, string>;
    groups?: readonly [number, number];
    reference?: (p: Pair) => Sign;
    roles?: Readonly<Record<string, string>>;
  },
): Spec<Pair> => ({
  id,
  node: "N3",
  subtype: "compare-six",
  form,
  groups: extra.groups ?? [7, 7],
  ...(extra.roles ? { roles: extra.roles } : {}),
  answer: "compare",
  draw,
  ...(extra.valid ? { valid: extra.valid } : {}),
  solve: (p) => signOf(p.a, p.b),
  reference: (p) =>
    extra.reference ? extra.reference(p) : bySubtraction(p.a, p.b),
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
        ta: s(p.a % 1000).padStart(3, "0"),
        tb: s(p.b % 1000).padStart(3, "0"),
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
    (r) => {
      const lead = between(r, 1, 9) * 100_000;
      return {
        a: lead + between(r, 0, 99_999),
        b: lead + between(r, 0, 99_999),
      };
    },
    {
      roles: {
        a: "inhabitants of the first city",
        b: "inhabitants of the second city",
      },
      valid: (p) => p.a !== p.b,
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
      // The second route sets the first addend against what the number leaves for it.
      reference: (p) => bySubtraction(p.x ?? 0, p.b - (p.y ?? 0)),
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
  {
    id: "N3.compare-six.11",
    node: "N3",
    subtype: "compare-six",
    form: "largest-of-four-numbers-of-five-and-six-digits",
    groups: [7, 7],
    answer: "choice",
    draw: (r): Four6 => ({
      v: [
        between(r, 100_000, 899_999),
        between(r, 100_000, 899_999),
        between(r, 100_000, 899_999),
        between(r, 90_000, 99_999),
      ],
      by: r.int(4),
    }),
    valid: (p: Four6) => {
      const six3 = p.v.slice(0, 3);
      const top = Math.max(...six3);
      const lasts = six3.map((x) => x % 10);
      const worst = Math.max(...lasts);
      const at = six3.filter((x) => x % 10 === worst);
      return (
        new Set(p.v).size === 4 &&
        at.length === 1 &&
        at[0] !== top &&
        firstDigit(top) < 9
      );
    },
    options: (p: Four6) => rotate(p.v.map(digits), p.by),
    solve: (p: Four6) => digits(Math.max(...p.v.slice(0, 3))),
    reference: (p: Four6) =>
      rotate(p.v.map(digits), p.by)
        .filter((o) => o.replace(/ /g, "").length === 6)
        .reduce((a, b) =>
          Number(a.replace(/ /g, "")) > Number(b.replace(/ /g, "")) ? a : b,
        ),
    traps: [
      {
        id: "biggest-first-digit",
        kind: "conceptual" as const,
        wrong: (p: Four6) => digits(p.v[3] ?? 0),
      },
      {
        id: "biggest-last-digit",
        kind: "conceptual" as const,
        wrong: (p: Four6) => {
          const six3 = p.v.slice(0, 3);
          const worst = Math.max(...six3.map((x) => x % 10));
          return digits(six3.find((x) => x % 10 === worst) ?? 0);
        },
      },
    ],
    vars: (p: Four6) => ({
      a: digits(p.v[0] ?? 0),
      b: digits(p.v[1] ?? 0),
      c: digits(p.v[2] ?? 0),
      d: digits(p.v[3] ?? 0),
      r: digits(Math.max(...p.v.slice(0, 3))),
    }),
    constants: [1, 10, 1000],
  } satisfies Spec<Four6>,
  {
    id: "N3.compare-six.12",
    node: "N3",
    subtype: "compare-six",
    form: "smallest-six-digit-number-with-a-digit-sum",
    groups: [7, 8],
    origin: {
      olympiad:
        "the smallest number with a given digit sum, built by placing the nines on the right; RES-4281 (MCCME school stage 2021 style)",
    },
    answer: "integer",
    draw: (r) => ({ sum: [12, 17, 19, 23, 28, 31, 37, 41][r.int(8)] ?? 17 }),
    solve: (p: { sum: number }) => qi(smallestWithSum(p.sum)),
    reference: (p: { sum: number }) => qi(scanSmallest(p.sum)),
    traps: numberTraps<{ sum: number }>([
      [
        "digits-spread-evenly",
        "conceptual",
        (p) => {
          const base = Math.floor(p.sum / 6);
          const extra = p.sum % 6;
          return Number(
            Array.from({ length: 6 }, (_, i) =>
              i >= 6 - extra ? base + 1 : base,
            ).join(""),
          );
        },
      ],
      [
        "right-digits-spread-evenly",
        "conceptual",
        (p) => {
          const rest = p.sum - 1;
          const m = Math.ceil(rest / 9);
          const base = Math.floor(rest / m);
          const extra = rest % m;
          const tail = Array.from({ length: m }, (_, i) =>
            i >= m - extra ? base + 1 : base,
          ).join("");
          return Number(`1${"0".repeat(5 - m)}${tail}`);
        },
      ],
      [
        "the-largest-number",
        "conceptual",
        (p) => {
          let rest = p.sum;
          return Number(
            Array.from({ length: 6 }, () => {
              const d = Math.min(9, rest);
              rest -= d;
              return d;
            }).join(""),
          );
        },
      ],
    ]),
    vars: (p: { sum: number }) => {
      const nines = Math.floor((p.sum - 1) / 9);
      const mid = p.sum - 9 * nines - 1;
      return {
        sum: s(p.sum),
        nines: s(nines),
        mid: s(mid),
        left: s(p.sum - 1),
        r: s(smallestWithSum(p.sum)),
      };
    },
    constants: [1, 9],
  } satisfies Spec<{ sum: number }>,
  {
    id: "N3.compare-six.13",
    node: "N3",
    subtype: "compare-six",
    form: "how-many-digits-make-a-six-digit-number-greater",
    groups: [7, 8],
    origin: {
      olympiad:
        "digit puzzle in which the equal digit is decided by the next places; RES-4281 (Kangoeroe 2003 counting items)",
    },
    answer: "integer",
    draw: (r): Gap => {
      const digitsA = Array.from({ length: 6 }, () => between(r, 1, 9));
      const at = between(r, 1, 4);
      const x = between(r, 1, 8);
      const tailB = Array.from({ length: 5 - at }, () => between(r, 0, 9));
      return { digitsA, at, x, tailB };
    },
    valid: (p: Gap) => {
      const tailA = p.digitsA.slice(p.at + 1).join("");
      return tailA !== p.tailB.join("");
    },
    solve: (p: Gap) => qi(countGreater(p)),
    reference: (p: Gap) => {
      let c = 0;
      for (let d = 0; d <= 9; d += 1) {
        const a = [...p.digitsA];
        a[p.at] = d;
        const b = [...p.digitsA.slice(0, p.at), p.x, ...p.tailB];
        if (Number(a.join("")) > Number(b.join(""))) c += 1;
      }
      return qi(c);
    },
    traps: numberTraps<Gap>([
      ["tail-ignored", "conceptual", (p) => 9 - p.x],
      ["equal-digit-always-counted", "conceptual", (p) => 10 - p.x],
      ["smaller-digits", "conceptual", (p) => p.x],
    ]),
    vars: (p: Gap) => {
      const shown = p.digitsA.map(String);
      shown[p.at] = "□";
      const b = [...p.digitsA.slice(0, p.at), p.x, ...p.tailB];
      const ta = p.digitsA.slice(p.at + 1).join("");
      const tb = p.tailB.join("");
      return {
        a: groupText(shown.join("")),
        b: digits(Number(b.join(""))),
        x: s(p.x),
        ta,
        tb,
        sign: signOf(Number(ta), Number(tb)),
        greater: s(9 - p.x),
        extra: s(countGreater(p) - (9 - p.x)),
        r: s(countGreater(p)),
      };
    },
    constants: [9],
  } satisfies Spec<Gap>,
] as const;

export const n3Specs = withWrongAnswers([
  ...wordsDigits,
  ...compareSix,
] as unknown as readonly Spec<never>[]);
