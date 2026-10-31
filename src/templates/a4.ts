// Domain A, part 4: divisibility, efficient calculation and properties, the calculator, and equations
// (RES-4283). The Dutch goals name divisibility at group 8 and efficient calculation and the calculator
// at groups 6 to 8; equations come from the Russian programme and are extensions at stretch. Texts are
// plain blanks in `content/tasks-a.ru.json`, keyed by the template id.
import { between, digits, pick, tenthsText } from "./draw.js";
import { q } from "./kitf.js";
import { FOUR, forChoice, forSubtype, placeOf, turn } from "./a1.js";
import type { Spec } from "./spec.js";

const sum = (n: number, x: number): number =>
  Array.from({ length: n }, () => x).reduce((p, q) => p + q, 0);
const ones = (n: number): number => n % 10;
const tens = (n: number): number => Math.floor(n / 10) % 10;
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const divisors = (n: number): number[] =>
  Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
const digitSum = (n: number): number =>
  [...String(n)].reduce((p, c) => p + Number(c), 0);

const by3 = (v: number[]): number => v.filter((x) => x % 3 === 0).length;
const by9 = (v: number[]): number => v.filter((x) => x % 9 === 0).length;
/** The three digits after the comma of a quotient, read as a whole number. */
const frac3 = (n: number, d: number): number =>
  Math.floor(((n % d) * 1000) / d);
/** Two numbers digit by digit, each column worked out by `f` with no carry or borrow. */
const columns = (
  a: number,
  b: number,
  f: (x: number, y: number) => number,
): number => {
  const w = Math.max(String(a).length, String(b).length);
  const s = String(a).padStart(w, "0");
  const t = String(b).padStart(w, "0");
  return Number([...s].map((c, i) => f(Number(c), Number(t[i]))).join(""));
};

const keep = (x: number, ...not: number[]): number | null =>
  Number.isInteger(x) && x >= 0 && !not.includes(x) ? x : null;

const apartOf = (x: number, ...not: number[]): number | null =>
  Number.isInteger(x) && x >= 0 && !not.includes(x) ? x : null;

const a12 = forSubtype("A12", "divisibility");
const divisible = [
  a12({
    id: "A12.divisibility.01",
    form: "the-smallest-multiple-above-a-number",
    groups: [8, 8],
    draw: (r) => [between(r, 6, 9), between(r, 100, 900)],
    valid: ([d = 0, n = 0]) => n % d !== 0,
    solve: ([d = 0, n = 0]) => (Math.floor(n / d) + 1) * d,
    ref: ([d = 0, n = 0]) => {
      let m = n + 1;
      while (m % d !== 0) m += 1;
      return m;
    },
    traps: [
      [
        "multiple-below",
        "procedural",
        ([d = 0, n = 0]) => Math.floor(n / d) * d,
      ],
      ["add-divisor", "procedural", ([d = 0, n = 0]) => n + d],
    ],
  }),
  a12({
    id: "A12.divisibility.02",
    form: "how-many-multiples-up-to-a-number",
    groups: [8, 8],
    draw: (r) => [between(r, 4, 9), between(r, 50, 200)],
    valid: ([d = 0, n = 0]) => n % d !== 0,
    solve: ([d = 0, n = 0]) => Math.floor(n / d),
    ref: ([d = 0, n = 0]) =>
      Array.from({ length: n }, (_, i) => i + 1).filter((x) => x % d === 0)
        .length,
    traps: [
      ["rounded-up", "procedural", ([d = 0, n = 0]) => Math.floor(n / d) + 1],
      [
        "largest-multiple",
        "conceptual",
        ([d = 0, n = 0]) => Math.floor(n / d) * d,
      ],
    ],
    consts: [1],
  }),
  a12({
    id: "A12.divisibility.03",
    form: "the-smallest-digit-that-makes-a-number-divisible-by-3",
    groups: [8, 8],
    draw: (r) => [between(r, 1, 9), between(r, 1, 9)],
    solve: ([a = 0, b = 0]) => (3 - ((a + b) % 3)) % 3,
    ref: ([a = 0, b = 0]) =>
      Array.from({ length: 10 }, (_, x) => x).find(
        (x) => (a + b + x) % 3 === 0,
      ) ?? -1,
    traps: [
      [
        "a-larger-digit",
        "conceptual",
        ([a = 0, b = 0]) => ((3 - ((a + b) % 3)) % 3) + 3,
      ],
      ["remainder-left", "conceptual", ([a = 0, b = 0]) => (a + b) % 3],
      [
        "digit-three",
        "conceptual",
        ([a = 0, b = 0]) => ((3 - ((a + b) % 3)) % 3 === 0 ? null : 3),
      ],
    ],
    consts: [3],
  }),
  a12({
    id: "A12.divisibility.04",
    form: "the-digit-that-makes-a-number-divisible-by-9",
    groups: [8, 8],
    draw: (r) => [between(r, 1, 9), between(r, 1, 9), between(r, 1, 9)],
    valid: ([a = 0, b = 0, c = 0]) => (a + b + c) % 9 !== 0,
    solve: ([a = 0, b = 0, c = 0]) => 9 - ((a + b + c) % 9),
    ref: ([a = 0, b = 0, c = 0]) =>
      Array.from({ length: 10 }, (_, x) => x).find(
        (x) => (a + b + c + x) % 9 === 0 && x > 0,
      ) ?? -1,
    traps: [
      [
        "smallest-for-3",
        "conceptual",
        ([a = 0, b = 0, c = 0]) =>
          keep((3 - ((a + b + c) % 3)) % 3, 9 - ((a + b + c) % 9)),
      ],
      [
        "remainder-left",
        "conceptual",
        ([a = 0, b = 0, c = 0]) => keep((a + b + c) % 9, 9 - ((a + b + c) % 9)),
      ],
      [
        "digit-nine",
        "conceptual",
        ([a = 0, b = 0, c = 0]) => keep(9, 9 - ((a + b + c) % 9)),
      ],
    ],
    consts: [9, 3],
  }),
  a12({
    id: "A12.divisibility.05",
    form: "how-many-multiples-of-five",
    groups: [8, 8],
    draw: (r) => [between(r, 52, 198)],
    valid: ([n = 0]) => n % 5 !== 0,
    solve: ([n = 0]) => Math.floor(n / 5),
    ref: ([n = 0]) =>
      Array.from({ length: n }, (_, i) => i + 1).filter((x) => x % 5 === 0)
        .length,
    traps: [
      ["rounded-up", "procedural", ([n = 0]) => Math.floor(n / 5) + 1],
      ["ends-in-five", "conceptual", ([n = 0]) => Math.floor((n + 5) / 10)],
      ["largest-multiple", "conceptual", ([n = 0]) => 5 * Math.floor(n / 5)],
    ],
    consts: [1, 5],
  }),
  a12({
    id: "A12.divisibility.06",
    form: "how-many-listed-numbers-are-divisible-by-3",
    groups: [8, 8],
    draw: (r) => [
      between(r, 21, 99),
      between(r, 21, 99),
      between(r, 21, 99),
      between(r, 21, 99),
      between(r, 21, 99),
    ],
    valid: (v) =>
      new Set(v).size === v.length &&
      v.filter((x) => x % 3 === 0).length > 0 &&
      v.filter((x) => x % 3 === 0).length !==
        v.filter((x) => x % 9 === 0).length,
    extra: (v) => ({
      detail: v.map((x) => `${x} \u2192 ${digitSum(x)}`).join(", "),
      list: v.filter((x) => digitSum(x) % 3 === 0).join(", "),
    }),
    solve: (v) => v.filter((x) => digitSum(x) % 3 === 0).length,
    ref: (v) => v.reduce((c, x) => (x % 3 === 0 ? c + 1 : c), 0),
    traps: [
      ["divisible-by-9", "conceptual", (v) => by9(v)],
      [
        "not-divisible",
        "conceptual",
        (v) => {
          const w = v.length - by3(v);
          return w === by9(v) ? null : w;
        },
      ],
      [
        "last-digit-test",
        "conceptual",
        (v) => {
          const w = v.filter((x) => ones(x) % 3 === 0).length;
          return w === by9(v) || w === v.length - by3(v) ? null : w;
        },
      ],
    ],
    consts: [3, 9],
  }),
  a12({
    id: "A12.divisibility.07",
    form: "how-many-divisors-a-number-has",
    groups: [8, 8],
    draw: (r) => [pick(r, [12, 18, 20, 24, 28, 30, 40, 42, 45, 48, 50, 60])],
    extra: ([n = 0]) => ({
      pairs: divisors(n)
        .filter((d) => d * d <= n)
        .map((d) => `${d} \u00d7 ${n / d}`)
        .join(", "),
      np: String(divisors(n).length / 2),
    }),
    solve: ([n = 0]) => divisors(n).length,
    ref: ([n = 0]) =>
      Array.from({ length: n }, (_, i) => i + 1).reduce(
        (c, d) => (n % d === 0 ? c + 1 : c),
        0,
      ),
    traps: [
      [
        "without-one-and-itself",
        "conceptual",
        ([n = 0]) => divisors(n).length - 2,
      ],
      ["one-missing", "procedural", ([n = 0]) => divisors(n).length - 1],
      [
        "pairs-counted",
        "conceptual",
        ([n = 0]) =>
          divisors(n).length % 2 === 0 ? divisors(n).length / 2 : null,
      ],
    ],
  }),
  a12({
    id: "A12.divisibility.08",
    form: "the-remainder-on-division-by-9-from-the-digit-sum",
    groups: [8, 8],
    draw: (r) => [between(r, 123, 987)],
    valid: ([n = 0]) =>
      digitSum(n) > 9 &&
      digitSum(n) % 9 !== 0 &&
      digitSum(n) % 9 !== digitSum(n),
    extra: ([n = 0]) => ({ s: String(digitSum(n)) }),
    solve: ([n = 0]) => n % 9,
    ref: ([n = 0]) => digitSum(n) % 9,
    traps: [
      ["digit-sum-itself", "procedural", ([n = 0]) => digitSum(n)],
      [
        "quotient-instead",
        "conceptual",
        ([n = 0]) =>
          Math.floor(n / 9) === digitSum(n) ? null : Math.floor(n / 9),
      ],
      ["nine-minus-remainder", "conceptual", ([n = 0]) => 9 - (n % 9)],
    ],
    consts: [9],
  }),
  a12({
    id: "A12.divisibility.09",
    form: "the-smallest-number-both-numbers-divide",
    groups: [8, 8],
    origin: { extension: "least common multiple, Russian grade 6 (RES-4283)" },
    draw: (r) => [pick(r, [4, 6, 8, 9, 10, 12]), pick(r, [3, 5, 6, 7, 9, 15])],
    valid: ([a = 0, b = 0]) =>
      a !== b && gcd(a, b) > 1 && a % b !== 0 && b % a !== 0,
    solve: ([a = 0, b = 0]) => (a * b) / gcd(a, b),
    ref: ([a = 0, b = 0]) => {
      let m = Math.max(a, b);
      while (m % a !== 0 || m % b !== 0) m += 1;
      return m;
    },
    traps: [
      ["product", "procedural", ([a = 0, b = 0]) => a * b],
      ["larger-number", "conceptual", ([a = 0, b = 0]) => Math.max(a, b)],
      ["common-divisor", "conceptual", ([a = 0, b = 0]) => gcd(a, b)],
    ],
  }),
  a12({
    id: "A12.divisibility.10",
    form: "the-largest-number-that-divides-both",
    groups: [8, 8],
    origin: {
      extension: "greatest common divisor, Russian grade 6 (RES-4283)",
    },
    draw: (r) => [
      pick(r, [12, 16, 18, 20, 24, 30, 36, 40, 48]),
      pick(r, [8, 10, 14, 15, 18, 20, 21, 27, 28, 32]),
    ],
    valid: ([a = 0, b = 0]) =>
      a !== b && gcd(a, b) > 1 && gcd(a, b) !== Math.min(a, b),
    solve: ([a = 0, b = 0]) => gcd(a, b),
    ref: ([a = 0, b = 0]) =>
      Math.max(...divisors(a).filter((d) => b % d === 0)),
    traps: [
      ["smaller-number", "conceptual", ([a = 0, b = 0]) => Math.min(a, b)],
      [
        "common-multiple",
        "conceptual",
        ([a = 0, b = 0]) => (a * b) / gcd(a, b),
      ],
      [
        "first-common-divisor",
        "procedural",
        ([a = 0, b = 0]) =>
          divisors(a).find((d) => d > 1 && b % d === 0) ?? null,
      ],
    ],
  }),
  a12({
    id: "A12.divisibility.11",
    form: "the-largest-three-digit-multiple",
    groups: [8, 8],
    draw: (r) => [between(r, 6, 19)],
    valid: ([d = 0]) => 999 % d !== 0,
    solve: ([d = 0]) => 999 - (999 % d),
    ref: ([d = 0]) => {
      let m = 999;
      while (m % d !== 0) m -= 1;
      return m;
    },
    traps: [
      ["upper-bound", "conceptual", ([]) => 999],
      ["quotient-only", "procedural", ([d = 0]) => Math.floor(999 / d)],
      [
        "next-multiple",
        "procedural",
        ([d = 0]) => (Math.floor(999 / d) + 1) * d,
      ],
    ],
    consts: [999],
  }),
  a12({
    id: "A12.divisibility.12",
    form: "how-many-multiples-between-two-numbers",
    groups: [8, 8],
    draw: (r) => [between(r, 11, 40), between(r, 101, 200), between(r, 4, 9)],
    valid: ([a = 0, b = 0, d = 0]) =>
      Math.floor(b / d) - Math.floor(a / d) !== Math.floor((b - a) / d),
    solve: ([a = 0, b = 0, d = 0]) =>
      Math.floor(b / d) - Math.floor((a - 1) / d),
    ref: ([a = 0, b = 0, d = 0]) =>
      Array.from({ length: b - a + 1 }, (_, i) => a + i).filter(
        (x) => x % d === 0,
      ).length,
    traps: [
      [
        "length-over-step",
        "procedural",
        ([a = 0, b = 0, d = 0]) => Math.floor((b - a) / d),
      ],
      ["from-one", "conceptual", ([, b = 0, d = 0]) => Math.floor(b / d)],
    ],
  }),
  a12({
    id: "A12.divisibility.13",
    form: "how-many-two-digit-numbers-divide-by-both",
    groups: [8, 8],
    origin: {
      olympiad: "common multiples in a range, a clever count (RES-4283, F15)",
    },
    draw: (r) => [pick(r, [4, 6, 8, 9, 10]), pick(r, [3, 5, 6, 7, 12, 15])],
    valid: ([a = 0, b = 0]) => {
      const l = (a * b) / gcd(a, b);
      return a !== b && l >= 12 && l <= 45 && a % b !== 0 && b % a !== 0;
    },
    solve: ([a = 0, b = 0]) => {
      const l = (a * b) / gcd(a, b);
      return Math.floor(99 / l) - Math.floor(9 / l);
    },
    ref: ([a = 0, b = 0]) =>
      Array.from({ length: 90 }, (_, i) => i + 10).filter(
        (n) => n % a === 0 && n % b === 0,
      ).length,
    traps: [
      [
        "multiples-of-the-product",
        "procedural",
        ([a = 0, b = 0]) =>
          keep(
            Math.floor(99 / (a * b)) - Math.floor(9 / (a * b)),
            Math.floor(99 / ((a * b) / gcd(a, b))) -
              Math.floor(9 / ((a * b) / gcd(a, b))),
          ),
      ],
      [
        "multiples-of-the-first-only",
        "conceptual",
        ([a = 0, b = 0]) =>
          keep(
            Math.floor(99 / a) - Math.floor(9 / a),
            Math.floor(99 / ((a * b) / gcd(a, b))) -
              Math.floor(9 / ((a * b) / gcd(a, b))),
          ),
      ],
      [
        "numbers-from-one",
        "procedural",
        ([a = 0, b = 0]) =>
          keep(
            Math.floor(99 / ((a * b) / gcd(a, b))),
            Math.floor(99 / ((a * b) / gcd(a, b))) -
              Math.floor(9 / ((a * b) / gcd(a, b))),
          ),
      ],
    ],
    extra: ([a = 0, b = 0]) => {
      const l = (a * b) / gcd(a, b);
      return {
        l: String(l),
        list: Array.from({ length: 90 }, (_, i) => i + 10)
          .filter((n) => n % l === 0)
          .join(", "),
        top: String(Math.floor(99 / l)),
        low: String(Math.floor(9 / l)),
      };
    },
  }),
  forChoice(
    "A12",
    "divisibility",
  )({
    id: "A12.divisibility.14",
    form: "which-number-divides-by-nine",
    groups: [8, 8],
    kind: "choice",
    draw: (r) => {
      const h = between(r, 1, 9);
      const t = between(r, 0, 9);
      const o = (9 - ((h + t) % 9)) % 9;
      const correct = 100 * h + 10 * t + o;
      return [
        correct,
        between(r, 101, 998),
        between(r, 101, 998),
        between(r, 101, 998),
        r.int(4),
      ];
    },
    valid: ([c = 0, x = 0, y = 0, z = 0]) =>
      c % 9 === 0 &&
      c < 1000 &&
      [x, y, z].every((v) => v % 9 !== 0) &&
      new Set([c, x, y, z]).size === 4 &&
      [x, y, z].some((v) => v % 3 === 0),
    solve: ([, , , , by = 0]) => placeOf(0, by),
    ref: ([c = 0, x = 0, y = 0, z = 0, by = 0]) =>
      String(
        turn([c, x, y, z], by).findIndex((v) => digitSum(v) % 9 === 0) + 1,
      ),
    traps: [
      ["the-first-other", "conceptual", ([, , , , by = 0]) => placeOf(1, by)],
      ["the-second-other", "conceptual", ([, , , , by = 0]) => placeOf(2, by)],
      ["the-third-other", "conceptual", ([, , , , by = 0]) => placeOf(3, by)],
    ],
    options: () => FOUR,
    extra: ([c = 0, x = 0, y = 0, z = 0, by = 0]) => {
      const list = turn([c, x, y, z], by);
      return {
        o1: String(list[0]),
        o2: String(list[1]),
        o3: String(list[2]),
        o4: String(list[3]),
        t: String(c),
        q1: String(digitSum(list[0] ?? 0)),
        q2: String(digitSum(list[1] ?? 0)),
        q3: String(digitSum(list[2] ?? 0)),
        q4: String(digitSum(list[3] ?? 0)),
        sc: String(digitSum(c)),
        s1: String(digitSum(x)),
        s2: String(digitSum(y)),
        s3: String(digitSum(z)),
      };
    },
    consts: [1, 2, 3, 4, 9],
  }),
  a12({
    id: "A12.divisibility.15",
    form: "numbers-left-after-crossing-out-multiples",
    groups: [8, 8],
    origin: {
      olympiad:
        "crossing out multiples of two numbers, a clever count (RES-4283, F15)",
    },
    draw: (r) => [between(r, 20, 60)],
    valid: ([n = 0]) => n % 6 !== 0,
    solve: ([n = 0]) =>
      n - Math.floor(n / 2) - Math.floor(n / 3) + Math.floor(n / 6),
    ref: ([n = 0]) =>
      Array.from({ length: n }, (_, i) => i + 1).filter(
        (x) => x % 2 !== 0 && x % 3 !== 0,
      ).length,
    traps: [
      [
        "the-multiples-of-six-subtracted-twice",
        "conceptual",
        ([n = 0]) =>
          n - Math.floor(n / 2) - Math.floor(n / 3) - Math.floor(n / 6),
      ],
      [
        "the-common-multiples-not-taken-back",
        "conceptual",
        ([n = 0]) => n - Math.floor(n / 2) - Math.floor(n / 3),
      ],
      [
        "only-the-multiples-of-two",
        "conceptual",
        ([n = 0]) => n - Math.floor(n / 2),
      ],
    ],
    consts: [1, 2, 3, 6],
  }),
];

const a13e = forSubtype("A13", "efficient");
const efficient = [
  a13e({
    id: "A13.efficient.01",
    form: "a-product-with-25-and-4",
    groups: [6, 7],
    draw: (r) => [between(r, 3, 19)],
    solve: ([a = 0]) => 100 * a,
    ref: ([a = 0]) => 25 * 4 * a,
    traps: [
      ["partial-product", "procedural", ([a = 0]) => 25 * a],
      ["only-four", "procedural", ([a = 0]) => 4 * a],
      ["factors-added", "conceptual", ([a = 0]) => 29 * a],
    ],
    consts: [25, 4, 100],
  }),
  a13e({
    id: "A13.efficient.02",
    form: "multiplying-by-99",
    groups: [6, 7],
    draw: (r) => [between(r, 3, 9)],
    solve: ([a = 0]) => 99 * a,
    ref: ([a = 0]) => 100 * a - a,
    traps: [
      ["hundred-only", "conceptual", ([a = 0]) => 100 * a],
      ["minus-one", "procedural", ([a = 0]) => 100 * a - 1],
      ["plus-a", "conceptual", ([a = 0]) => 101 * a],
    ],
    consts: [99, 100],
  }),
  a13e({
    id: "A13.efficient.03",
    form: "a-product-with-5-and-2",
    groups: [6, 7],
    draw: (r) => [between(r, 12, 49)],
    valid: ([a = 0]) => ones(a) > 0,
    solve: ([a = 0]) => 10 * a,
    ref: ([a = 0]) => 5 * a * 2,
    traps: [
      ["five-only", "procedural", ([a = 0]) => 5 * a],
      ["two-only", "procedural", ([a = 0]) => 2 * a],
      ["factors-added", "conceptual", ([a = 0]) => 7 * a],
    ],
    consts: [5, 2, 10],
  }),
  a13e({
    id: "A13.efficient.04",
    form: "adding-98-through-100",
    groups: [6, 7],
    draw: (r) => [between(r, 25, 77)],
    solve: ([a = 0]) => 98 + a,
    ref: ([a = 0]) => 100 + a - 2,
    traps: [
      ["hundred-only", "procedural", ([a = 0]) => 100 + a],
      ["plus-two", "conceptual", ([a = 0]) => 102 + a],
    ],
    consts: [98, 100, 2],
  }),
  a13e({
    id: "A13.efficient.05",
    form: "three-addends-with-a-friendly-pair",
    groups: [6, 7],
    draw: (r) => {
      const a = 10 * between(r, 1, 3) + between(r, 1, 9);
      return [a, between(r, 13, 39), 10 - (a % 10)];
    },
    solve: ([a = 0, b = 0, c = 0]) => a + b + c,
    ref: ([a = 0, b = 0, c = 0]) => a + c + b,
    traps: [
      ["two-addends", "procedural", ([a = 0, b = 0]) => a + b],
      ["pair-only", "procedural", ([a = 0, , c = 0]) => a + c],
      [
        "without-first",
        "procedural",
        ([a = 0, b = 0, c = 0]) => (a === b ? null : b + c),
      ],
    ],
    extra: ([a = 0, , c = 0]) => ({ f: String(a + c) }),
  }),
  a13e({
    id: "A13.efficient.06",
    form: "multiplying-by-98",
    groups: [6, 7],
    draw: (r) => [between(r, 3, 9)],
    solve: ([a = 0]) => 98 * a,
    ref: ([a = 0]) => 100 * a - 2 * a,
    traps: [
      ["two-only", "procedural", ([a = 0]) => 100 * a - 2],
      ["hundred-only", "procedural", ([a = 0]) => 100 * a],
      ["plus-two-times", "conceptual", ([a = 0]) => 102 * a],
    ],
    consts: [98, 100, 2],
  }),
  a13e({
    id: "A13.efficient.07",
    form: "multiplying-by-50-through-half-a-hundred",
    groups: [6, 7],
    draw: (r) => [2 * between(r, 6, 24)],
    solve: ([a = 0]) => 50 * a,
    ref: ([a = 0]) => 100 * (a / 2),
    traps: [
      ["fifth-only", "procedural", ([a = 0]) => 5 * a],
      ["hundred-times", "conceptual", ([a = 0]) => 100 * a],
      ["half-only", "procedural", ([a = 0]) => a / 2],
    ],
    consts: [5, 50, 100, 2],
  }),
  a13e({
    id: "A13.efficient.08",
    form: "subtracting-99-through-100",
    groups: [6, 7],
    draw: (r) => [between(r, 120, 480)],
    solve: ([a = 0]) => a - 99,
    ref: ([a = 0]) => a - 100 + 1,
    traps: [
      ["hundred-only", "procedural", ([a = 0]) => a - 100],
      ["wrong-direction", "conceptual", ([a = 0]) => a - 101],
    ],
    consts: [99, 100, 1],
  }),
  a13e({
    id: "A13.efficient.09",
    form: "the-sum-of-the-first-numbers-by-pairing",
    groups: [7, 8],
    origin: { olympiad: "Gauss pairing, Kangaroo style (RES-4283)" },
    draw: (r) => [pick(r, [10, 12, 14, 16, 18, 20])],
    solve: ([n = 0]) => (n * (n + 1)) / 2,
    ref: ([n = 0]) =>
      Array.from({ length: n }, (_, i) => i + 1).reduce((p, q) => p + q, 0),
    traps: [
      ["last-number-times-half", "procedural", ([n = 0]) => (n * n) / 2],
      ["not-halved", "conceptual", ([n = 0]) => n * (n + 1)],
      ["one-pair-only", "procedural", ([n = 0]) => n + 1],
    ],
    extra: ([n = 0]) => ({ p: String(n / 2), s: String(n + 1) }),
    consts: [1, 2],
  }),
  a13e({
    id: "A13.efficient.10",
    form: "multiplying-by-5-through-halving-and-ten",
    groups: [6, 7],
    draw: (r) => [2 * between(r, 7, 49)],
    valid: ([a = 0]) => ones(a) > 0,
    solve: ([a = 0]) => 5 * a,
    ref: ([a = 0]) => (a / 2) * 10,
    traps: [
      ["ten-times", "procedural", ([a = 0]) => 10 * a],
      ["half-only", "procedural", ([a = 0]) => a / 2],
      ["half-times-five", "conceptual", ([a = 0]) => (a / 2) * 5],
    ],
    consts: [5, 2, 10],
  }),
  a13e({
    id: "A13.efficient.11",
    form: "multiplying-by-16-through-doubling",
    groups: [7, 8],
    draw: (r) => [between(r, 11, 29)],
    solve: ([a = 0]) => 16 * a,
    ref: ([a = 0]) => a * 2 * 2 * 2 * 2,
    traps: [
      ["three-doublings", "procedural", ([a = 0]) => 8 * a],
      ["five-doublings", "procedural", ([a = 0]) => 32 * a],
      ["two-doublings", "procedural", ([a = 0]) => 4 * a],
    ],
    consts: [16, 2],
  }),
  a13e({
    id: "A13.efficient.12",
    form: "the-sum-of-the-even-numbers-by-pairing",
    groups: [7, 8],
    origin: { olympiad: "Gauss pairing for even numbers (RES-4283, F14)" },
    draw: (r) => [4 * between(r, 3, 10)],
    solve: ([n = 0]) => (n / 2) * (n / 2 + 1),
    ref: ([n = 0]) =>
      Array.from({ length: n / 2 }, (_, i) => 2 * (i + 1)).reduce(
        (p, q) => p + q,
        0,
      ),
    traps: [
      [
        "the-sum-of-all-whole-numbers",
        "conceptual",
        ([n = 0]) => (n * (n + 1)) / 2,
      ],
      ["one-pair-only", "procedural", ([n = 0]) => n + 2],
      [
        "the-pairs-as-many-as-numbers",
        "procedural",
        ([n = 0]) => (n / 2) * (n + 2),
      ],
    ],
    extra: ([n = 0]) => ({ s: String(n + 2) }),
    consts: [1, 2],
  }),
  a13e({
    id: "A13.efficient.13",
    form: "multiplying-by-15-through-ten-and-five",
    groups: [6, 7],
    draw: (r) => [2 * between(r, 7, 24)],
    valid: ([a = 0]) => ones(a) > 0,
    solve: ([a = 0]) => 15 * a,
    ref: ([a = 0]) => 10 * a + (10 * a) / 2,
    traps: [
      ["ten-times-only", "procedural", ([a = 0]) => 10 * a],
      ["five-times-only", "procedural", ([a = 0]) => 5 * a],
      ["the-half-lost-a-digit", "procedural", ([a = 0]) => 10 * a + 5],
    ],
    consts: [15, 10, 5, 2],
  }),
  a13e({
    id: "A13.efficient.14",
    form: "multiplying-by-9-through-ten",
    groups: [6, 7],
    draw: (r) => [between(r, 12, 49)],
    valid: ([a = 0]) => ones(a) > 0,
    solve: ([a = 0]) => 9 * a,
    ref: ([a = 0]) => 10 * a - a,
    traps: [
      ["ten-times-only", "procedural", ([a = 0]) => 10 * a],
      ["one-subtracted", "procedural", ([a = 0]) => 10 * a - 1],
      ["the-number-added", "conceptual", ([a = 0]) => 11 * a],
    ],
    consts: [1, 9, 10],
  }),
];

const a13p = forSubtype("A13", "properties");
const properties = [
  a13p({
    id: "A13.properties.01",
    form: "a-missing-number-in-the-distributive-law",
    groups: [7, 8],
    draw: (r) => [between(r, 3, 9), between(r, 4, 12), between(r, 4, 12)],
    valid: ([, b = 0, c = 0]) => b !== c,
    solve: ([, , c = 0]) => c,
    ref: ([a = 0, b = 0, c = 0]) => (a * (b + c) - a * b) / a,
    traps: [
      ["sum", "procedural", ([, b = 0, c = 0]) => b + c],
      [
        "product-term",
        "conceptual",
        ([a = 0, b = 0, c = 0]) => (a * c === b + c ? null : a * c),
      ],
      ["whole-product", "conceptual", ([a = 0, b = 0, c = 0]) => a * (b + c)],
    ],
    extra: ([a = 0, b = 0, c = 0]) => ({
      s: String(b + c),
      p: String(a * (b + c)),
    }),
  }),
  a13p({
    id: "A13.properties.02",
    form: "collecting-a-common-factor",
    groups: [7, 8],
    draw: (r) => [between(r, 3, 9), between(r, 8, 15), between(r, 5, 9)],
    valid: ([, b = 0, c = 0]) => b !== c,
    solve: ([, b = 0, c = 0]) => b + c,
    ref: ([a = 0, b = 0, c = 0]) => (a * b + a * c) / a,
    traps: [
      [
        "product",
        "procedural",
        ([a = 0, b = 0, c = 0]) => (b * c === a * (b + c) ? null : b * c),
      ],
      ["whole-value", "conceptual", ([a = 0, b = 0, c = 0]) => a * (b + c)],
      ["all-added", "procedural", ([a = 0, b = 0, c = 0]) => a + b + c],
    ],
  }),
  a13p({
    id: "A13.properties.03",
    form: "one-more-group-from-a-known-product",
    groups: [7, 8],
    draw: (r) => [between(r, 12, 39), between(r, 12, 39)],
    valid: ([a = 0, b = 0]) => a !== b,
    solve: ([a = 0, b = 0]) => a * b + b,
    ref: ([a = 0, b = 0]) => (a + 1) * b,
    traps: [
      ["plus-one", "procedural", ([a = 0, b = 0]) => a * b + 1],
      ["wrong-group", "procedural", ([a = 0, b = 0]) => a * b + a],
      ["wrong-factor", "conceptual", ([a = 0]) => (a + 1) * a],
    ],
    extra: ([a = 0, b = 0]) => ({ p: String(a * b), n: String(a + 1) }),
  }),
  a13p({
    id: "A13.properties.04",
    form: "one-group-fewer-from-a-known-product",
    groups: [7, 8],
    draw: (r) => [between(r, 12, 39), between(r, 12, 39)],
    valid: ([a = 0, b = 0]) => a !== b,
    solve: ([a = 0, b = 0]) => a * b - a,
    ref: ([a = 0, b = 0]) => a * (b - 1),
    traps: [
      ["minus-one", "procedural", ([a = 0, b = 0]) => a * b - 1],
      ["minus-other-factor", "procedural", ([a = 0, b = 0]) => a * b - b],
      ["wrong-factor", "conceptual", ([, b = 0]) => (b - 1) * b],
    ],
    extra: ([a = 0, b = 0]) => ({ p: String(a * b), n: String(b - 1) }),
  }),
  a13p({
    id: "A13.properties.05",
    form: "grouping-factors-of-a-product",
    groups: [7, 8],
    draw: (r) => {
      const [b = 0, c = 0] = pick(r, [
        [4, 25],
        [25, 4],
        [5, 20],
        [20, 5],
        [2, 50],
        [50, 2],
        [8, 125],
        [125, 8],
      ]);
      return [between(r, 3, 19), b, c];
    },
    solve: ([x = 0, b = 0, c = 0]) => x * b * c,
    ref: ([x = 0, b = 0, c = 0]) => b * (c * x),
    traps: [
      ["a-factor-forgotten", "procedural", ([x = 0, b = 0]) => x * b],
      ["the-round-pair-only", "procedural", ([, b = 0, c = 0]) => b * c],
      ["factors-added", "conceptual", ([x = 0, b = 0, c = 0]) => x + b + c],
    ],
    extra: ([, b = 0, c = 0]) => ({ g: String(b * c) }),
  }),
  a13p({
    id: "A13.properties.06",
    form: "multiplying-by-one-and-adding-zero",
    groups: [7, 8],
    draw: (r) => [between(r, 12, 99)],
    solve: ([a = 0]) => a,
    ref: ([a = 0]) => a * 1 + a * 0,
    traps: [
      ["doubled", "conceptual", ([a = 0]) => 2 * a],
      ["all-zero", "conceptual", ([]) => 0],
      ["plus-one", "conceptual", ([a = 0]) => a + 1],
    ],
    consts: [0, 1],
  }),
  a13p({
    id: "A13.properties.07",
    form: "subtracting-a-sum-term-by-term",
    groups: [7, 8],
    draw: (r) => [between(r, 60, 120), between(r, 11, 29), between(r, 11, 29)],
    valid: ([, b = 0, c = 0]) => b !== c,
    solve: ([a = 0, b = 0, c = 0]) => a - b - c,
    ref: ([a = 0, b = 0, c = 0]) => a - (b + c),
    traps: [
      ["second-term-added", "procedural", ([a = 0, b = 0, c = 0]) => a - b + c],
      ["first-term-only", "procedural", ([a = 0, b = 0]) => a - b],
      [
        "second-term-only",
        "procedural",
        ([a = 0, b = 0, c = 0]) => (b === 2 * c ? null : a - c),
      ],
    ],
  }),
  a13p({
    id: "A13.properties.08",
    form: "a-sum-that-stays-the-same",
    groups: [7, 8],
    draw: (r) => [between(r, 25, 60), between(r, 25, 60), between(r, 3, 9)],
    solve: ([a = 0, b = 0]) => a + b,
    ref: ([a = 0, b = 0, k = 0]) => a + k + (b - k),
    traps: [
      ["shifted", "conceptual", ([a = 0, b = 0, k = 0]) => a + b + k],
      ["shifted-down", "conceptual", ([a = 0, b = 0, k = 0]) => a + b - k],
    ],
    extra: ([a = 0, b = 0]) => ({ s: String(a + b) }),
  }),
  a13p({
    id: "A13.properties.09",
    form: "a-difference-that-stays-the-same",
    groups: [7, 8],
    draw: (r) => [between(r, 60, 90), between(r, 20, 50), between(r, 3, 9)],
    solve: ([a = 0, b = 0]) => a - b,
    ref: ([a = 0, b = 0, k = 0]) => a + k - (b + k),
    traps: [
      ["shifted", "conceptual", ([a = 0, b = 0, k = 0]) => a - b + k],
      ["shifted-down", "conceptual", ([a = 0, b = 0, k = 0]) => a - b - k],
    ],
    extra: ([a = 0, b = 0]) => ({ d: String(a - b) }),
  }),
  a13p({
    id: "A13.properties.10",
    form: "the-order-of-three-factors",
    groups: [7, 8],
    draw: (r) => [between(r, 3, 9), between(r, 4, 12), between(r, 3, 9)],
    valid: ([a = 0, b = 0, c = 0]) => a !== c && b !== c,
    solve: ([, , c = 0]) => c,
    ref: ([a = 0, b = 0, c = 0]) => (a * b * c) / (a * b),
    traps: [
      ["first-factor", "conceptual", ([a = 0]) => a],
      ["second-factor", "conceptual", ([a = 0, b = 0]) => (a === b ? null : b)],
      ["two-factors-product", "procedural", ([a = 0, b = 0]) => a * b],
    ],
    extra: ([a = 0, b = 0, c = 0]) => ({ p: String(a * b * c) }),
  }),
  a13p({
    id: "A13.properties.11",
    form: "doubling-one-factor-of-a-known-product",
    groups: [7, 8],
    draw: (r) => [between(r, 12, 39), between(r, 12, 39)],
    valid: ([a = 0, b = 0]) => a !== b,
    solve: ([a = 0, b = 0]) => 2 * a * b,
    ref: ([a = 0, b = 0]) => 2 * a * b,
    traps: [
      ["product-plus-factor", "procedural", ([a = 0, b = 0]) => a * b + a],
      [
        "product-plus-other-factor",
        "procedural",
        ([a = 0, b = 0]) => a * b + b,
      ],
      ["new-factor-only", "procedural", ([a = 0]) => 2 * a],
    ],
    extra: ([a = 0, b = 0]) => ({ p: String(a * b), d: String(2 * a) }),
    consts: [2],
  }),
  a13p({
    id: "A13.properties.12",
    form: "a-product-with-zero-inside-a-sum",
    groups: [7, 8],
    draw: (r) => [between(r, 12, 39), between(r, 12, 39), between(r, 12, 99)],
    solve: ([, , c = 0]) => c,
    ref: ([a = 0, b = 0, c = 0]) => a * b * 0 + c,
    traps: [
      ["product-kept", "conceptual", ([a = 0, b = 0, c = 0]) => a * b + c],
      ["all-zero", "conceptual", ([]) => 0],
      [
        "everything-multiplied",
        "procedural",
        ([a = 0, b = 0, c = 0]) => a * b * c,
      ],
    ],
    consts: [0],
  }),
  forChoice(
    "A13",
    "properties",
  )({
    id: "A13.properties.13",
    form: "the-equality-that-follows-the-distributive-law",
    groups: [7, 8],
    kind: "choice",
    draw: (r) => [
      between(r, 3, 9),
      between(r, 3, 9),
      between(r, 3, 9),
      r.int(4),
    ],
    valid: ([x = 0, y = 0, z = 0]) =>
      y !== z &&
      x * y + z !== x * (y + z) &&
      x + y * z !== x * (y + z) &&
      x * y * z !== x * (y + z),
    solve: ([, , , by = 0]) => placeOf(0, by),
    ref: ([x = 0, y = 0, z = 0, by = 0]) =>
      String(
        turn([x * y + x * z, x * y + z, x + y * z, x * y * z], by).findIndex(
          (v) => v === x * (y + z),
        ) + 1,
      ),
    traps: [
      [
        "the-factor-used-once",
        "conceptual",
        ([, , , by = 0]) => placeOf(1, by),
      ],
      ["the-factor-added", "conceptual", ([, , , by = 0]) => placeOf(2, by)],
      [
        "the-numbers-multiplied",
        "conceptual",
        ([, , , by = 0]) => placeOf(3, by),
      ],
    ],
    options: () => FOUR,
    extra: ([x = 0, y = 0, z = 0, by = 0]) => {
      const list = turn(
        [
          `${x} × ${y} + ${x} × ${z}`,
          `${x} × ${y} + ${z}`,
          `${x} + ${y} × ${z}`,
          `${x} × ${y} × ${z}`,
        ],
        by,
      );
      const vals = turn([x * y + x * z, x * y + z, x + y * z, x * y * z], by);
      return {
        o1: list[0] ?? "",
        o2: list[1] ?? "",
        o3: list[2] ?? "",
        o4: list[3] ?? "",
        l: String(x * (y + z)),
        f1: String(x * y + z),
        f2: String(x + y * z),
        f3: String(x * y * z),
        v1: String(vals[0]),
        v2: String(vals[1]),
        v3: String(vals[2]),
        v4: String(vals[3]),
      };
    },
    consts: [1, 2, 3, 4],
  }),
  a13p({
    id: "A13.properties.14",
    form: "the-difference-of-two-products-with-a-common-factor",
    groups: [7, 8],
    draw: (r) => {
      const b = between(r, 40, 60);
      return [between(r, 12, 39), b, b - between(r, 2, 6)];
    },
    valid: ([a = 0, b = 0, c = 0]) => a * (b - c) !== b - c && a !== b - c,
    solve: ([a = 0, b = 0, c = 0]) => a * (b - c),
    ref: ([a = 0, b = 0, c = 0]) => a * b - a * c,
    traps: [
      [
        "the-factors-subtracted-only",
        "conceptual",
        ([, b = 0, c = 0]) => b - c,
      ],
      [
        "the-first-product-less-a-factor",
        "procedural",
        ([a = 0, b = 0, c = 0]) => apartOf(a * b - c, a * (b - c)),
      ],
      ["the-first-product", "conceptual", ([a = 0, b = 0]) => a * b],
    ],
    extra: ([a = 0, b = 0, c = 0]) => ({
      p: String(a * b),
      q: String(a * c),
      d: String(b - c),
    }),
  }),
  a13p({
    id: "A13.properties.15",
    form: "the-largest-product-of-two-numbers-with-a-given-sum",
    groups: [7, 8],
    origin: {
      olympiad: "the product of two numbers with a fixed sum (RES-4283, F14)",
    },
    roles: { a: "sum of two whole numbers" },
    draw: (r) => [between(r, 10, 31)],
    solve: ([s = 0]) => Math.floor(s / 2) * Math.ceil(s / 2),
    ref: ([s = 0]) =>
      Math.max(
        ...Array.from({ length: s - 1 }, (_, i) => (i + 1) * (s - i - 1)),
      ),
    traps: [
      ["the-extreme-numbers", "conceptual", ([s = 0]) => s - 1],
      [
        "numbers-too-far-apart",
        "conceptual",
        ([s = 0]) => (Math.floor(s / 2) - 1) * (Math.ceil(s / 2) + 1),
      ],
      [
        "the-smaller-half-twice",
        "procedural",
        ([s = 0]) => (s % 2 === 1 ? Math.floor(s / 2) ** 2 : null),
      ],
      ["the-sum-itself", "conceptual", ([s = 0]) => s],
    ],
    extra: ([s = 0]) => ({
      lo: String(Math.floor(s / 2)),
      hi: String(Math.ceil(s / 2)),
    }),
    consts: [1],
  }),
];

/** `p` divided by 10 or 100 as a decimal with a comma. */
const decimalOf = (p: number, places: 1 | 2): string => {
  const unit = places === 1 ? 10 : 100;
  return `${digits(Math.floor(p / unit))},${String(p % unit).padStart(places, "0")}`;
};
const roundTen = (n: number): number => Math.round(n / 10) * 10;
/** The first count of doublings after which `a` passes `limit`. */
const doublingsPast = (a: number, limit: number): number => {
  let k = 0;
  let x = a;
  while (x <= limit) {
    x *= 2;
    k += 1;
  }
  return k;
};

const a14 = forSubtype("A14", "calculator");
const calc = [
  a14({
    id: "A14.calculator.01",
    form: "a-large-product-on-the-calculator",
    groups: [8, 8],
    draw: (r) => [between(r, 120, 899), between(r, 12, 89)],
    valid: ([a = 0, b = 0]) => ones(a) > 0 && ones(b) > 0,
    solve: ([a = 0, b = 0]) => a * b,
    ref: ([a = 0, b = 0]) => a * (b - ones(b)) + a * ones(b),
    traps: [
      ["one-more-group", "procedural", ([a = 0, b = 0]) => a * (b + 1)],
      ["tens-only", "procedural", ([a = 0, b = 0]) => a * (b - ones(b))],
      ["ten-times", "procedural", ([a = 0, b = 0]) => 10 * a * b],
    ],
  }),
  a14({
    id: "A14.calculator.02",
    form: "a-sum-of-large-numbers",
    groups: [8, 8],
    draw: (r) => [
      between(r, 1200, 8999),
      between(r, 1200, 8999),
      between(r, 1200, 8999),
    ],
    solve: ([a = 0, b = 0, c = 0]) => a + b + c,
    ref: ([a = 0, b = 0, c = 0]) => c + b + a,
    traps: [
      ["one-addend-missing", "procedural", ([a = 0, b = 0]) => a + b],
      [
        "no-carry",
        "procedural",
        ([a = 0, b = 0, c = 0]) =>
          columns(
            columns(a, b, (x, y) => (x + y) % 10),
            c,
            (x, y) => (x + y) % 10,
          ),
      ],
      [
        "first-addend-missing",
        "procedural",
        ([a = 0, b = 0, c = 0]) => (a === c ? null : b + c),
      ],
    ],
  }),
  a14({
    id: "A14.calculator.03",
    form: "a-difference-of-large-numbers",
    groups: [8, 8],
    draw: (r) => [between(r, 52_000, 98_999), between(r, 12_000, 49_999)],
    solve: ([a = 0, b = 0]) => a - b,
    ref: ([a = 0, b = 0]) => -(b - a),
    traps: [
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
      [
        "smaller-from-larger",
        "procedural",
        ([a = 0, b = 0]) => columns(a, b, (x, y) => Math.abs(x - y)),
      ],
    ],
  }),
  a14({
    id: "A14.calculator.04",
    form: "an-exact-quotient-of-large-numbers",
    groups: [8, 8],
    draw: (r) => [between(r, 12, 89), between(r, 40, 199)],
    valid: ([d = 0, q = 0]) => d * q >= 1000 && d !== q && ones(q) > 0,
    solve: ([, q = 0]) => q,
    ref: ([d = 0, q = 0]) => (d * q) / d,
    traps: [
      ["product-minus-divisor", "procedural", ([d = 0, q = 0]) => d * q - d],
      ["multiplied", "procedural", ([d = 0, q = 0]) => d * q * d],
    ],
    extra: ([d = 0, q = 0]) => ({ n: digits(d * q) }),
  }),
  a14({
    id: "A14.calculator.05",
    form: "whole-parts-from-a-decimal-display",
    groups: [8, 8],
    origin: {
      extension:
        "reading a remainder from a decimal display (concretisering, RES-4283)",
    },
    draw: (r) => [between(r, 100, 999), between(r, 7, 19)],
    valid: ([n = 0, d = 0]) => n % d !== 0 && Math.floor(n / d) >= 5,
    solve: ([n = 0, d = 0]) => Math.floor(n / d),
    ref: ([n = 0, d = 0]) => (n - (n % d)) / d,
    traps: [
      [
        "rounded",
        "procedural",
        ([n = 0, d = 0]) =>
          Math.round(n / d) !== Math.floor(n / d) ? Math.round(n / d) : null,
      ],
      [
        "after-comma",
        "conceptual",
        ([n = 0, d = 0]) =>
          frac3(n, d) === Math.round(n / d) ? null : frac3(n, d),
      ],
      [
        "remainder",
        "conceptual",
        ([n = 0, d = 0]) => {
          const w = n % d;
          return w === Math.round(n / d) || w === frac3(n, d) ? null : w;
        },
      ],
    ],
    extra: ([n = 0, d = 0]) => ({
      shown: `${Math.floor(n / d)},${String(Math.floor(((n % d) * 1000) / d)).padStart(3, "0")}`,
    }),
  }),
  a14({
    id: "A14.calculator.06",
    form: "the-remainder-behind-a-decimal-display",
    groups: [8, 8],
    draw: (r) => [between(r, 100, 999), between(r, 7, 19)],
    valid: ([n = 0, d = 0]) => n % d !== 0 && Math.floor(n / d) !== n % d,
    solve: ([n = 0, d = 0]) => n % d,
    ref: ([n = 0, d = 0]) => n - d * Math.floor(n / d),
    traps: [
      ["whole-part", "conceptual", ([n = 0, d = 0]) => Math.floor(n / d)],
      [
        "after-comma",
        "conceptual",
        ([n = 0, d = 0]) =>
          frac3(n, d) === Math.floor(n / d) ? null : frac3(n, d),
      ],
      [
        "complement",
        "conceptual",
        ([n = 0, d = 0]) => {
          const w = d - (n % d);
          return w === Math.floor(n / d) || w === frac3(n, d) ? null : w;
        },
      ],
    ],
    extra: ([n = 0, d = 0]) => ({
      q: String(Math.floor(n / d)),
      shown: `${Math.floor(n / d)},${String(Math.floor(((n % d) * 1000) / d)).padStart(3, "0")}`,
    }),
  }),
  a14({
    id: "A14.calculator.07",
    form: "a-square-of-a-three-digit-number",
    groups: [8, 8],
    draw: (r) => [between(r, 101, 499)],
    valid: ([a = 0]) => ones(a) > 0 && tens(a) > 0,
    solve: ([a = 0]) => a * a,
    ref: ([a = 0]) => a * (a - ones(a)) + a * ones(a),
    traps: [
      ["doubled", "conceptual", ([a = 0]) => 2 * a],
      ["ones-forgotten", "procedural", ([a = 0]) => a * (a - ones(a))],
      ["ten-times", "procedural", ([a = 0]) => 10 * a * a],
    ],
  }),
  a14({
    id: "A14.calculator.08",
    form: "the-effect-of-two-swapped-digits-on-a-result",
    groups: [8, 8],
    draw: (r) => [between(r, 1000, 9999), between(r, 100, 999)],
    valid: ([n = 0]) => tens(n) !== ones(n),
    solve: ([n = 0]) => 9 * Math.abs(tens(n) - ones(n)),
    ref: ([n = 0]) =>
      Math.abs(n - (n - ones(n) - 10 * tens(n) + 10 * ones(n) + tens(n))),
    traps: [
      [
        "digits-difference",
        "conceptual",
        ([n = 0]) => Math.abs(tens(n) - ones(n)),
      ],
      ["nine-times-sum", "conceptual", ([n = 0]) => 9 * (tens(n) + ones(n))],
      [
        "ten-times-difference",
        "conceptual",
        ([n = 0]) => 10 * Math.abs(tens(n) - ones(n)),
      ],
    ],
    extra: ([n = 0]) => ({
      sw: String(n - ones(n) - 10 * tens(n) + 10 * ones(n) + tens(n)),
    }),
    consts: [9],
  }),
  a14({
    id: "A14.calculator.09",
    form: "a-constant-step-pressed-many-times",
    groups: [8, 8],
    draw: (r) => [between(r, 7, 29), between(r, 12, 48)],
    valid: ([a = 0, b = 0]) => a !== b,
    solve: ([a = 0, b = 0]) => a * b,
    ref: ([a = 0, b = 0]) => sum(b, a),
    traps: [
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
      ["one-press-more", "procedural", ([a = 0, b = 0]) => a * (b + 1)],
      ["one-press-less", "procedural", ([a = 0, b = 0]) => a * (b - 1)],
    ],
  }),
  a14({
    id: "A14.calculator.10",
    form: "the-sum-of-a-column-of-prices",
    groups: [8, 8],
    draw: (r) => [
      between(r, 120, 480),
      between(r, 120, 480),
      between(r, 120, 480),
      between(r, 120, 480),
    ],
    valid: ([a = 0, b = 0, c = 0, d = 0]) => new Set([a, b, c, d]).size === 4,
    solve: ([a = 0, b = 0, c = 0, d = 0]) => a + b + c + d,
    ref: ([a = 0, b = 0, c = 0, d = 0]) => d + c + b + a,
    traps: [
      ["one-price-missing", "procedural", ([a = 0, b = 0, c = 0]) => a + b + c],
      [
        "no-carry",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) =>
          columns(
            columns(
              columns(a, b, (x, y) => (x + y) % 10),
              c,
              (x, y) => (x + y) % 10,
            ),
            d,
            (x, y) => (x + y) % 10,
          ),
      ],
      [
        "first-price-missing",
        "procedural",
        ([, b = 0, c = 0, d = 0]) => b + c + d,
      ],
    ],
  }),
  forChoice(
    "A14",
    "calculator",
  )({
    id: "A14.calculator.11",
    form: "the-plausible-screen-for-a-product",
    groups: [8, 8],
    kind: "choice",
    draw: (r) => [between(r, 21, 79), between(r, 21, 79), r.int(4)],
    valid: ([a = 0, b = 0]) =>
      ones(a) !== 0 &&
      ones(b) !== 0 &&
      ones(a) !== 5 &&
      ones(b) !== 5 &&
      (a * b) % 10 !== 0 &&
      (a * b) % 100 >= 10,
    solve: ([, , by = 0]) => placeOf(0, by),
    ref: ([a = 0, b = 0, by = 0]) => {
      const est = roundTen(a) * roundTen(b);
      const list = turn([a * b, a * b * 10, (a * b) / 10, (a * b) / 100], by);
      return String(list.findIndex((x) => x > est / 3 && x < est * 3) + 1);
    },
    traps: [
      ["a-zero-too-many", "conceptual", ([, , by = 0]) => placeOf(1, by)],
      ["a-comma-one-place-off", "conceptual", ([, , by = 0]) => placeOf(2, by)],
      [
        "a-comma-two-places-off",
        "conceptual",
        ([, , by = 0]) => placeOf(3, by),
      ],
    ],
    options: () => FOUR,
    extra: ([a = 0, b = 0, by = 0]) => {
      const p = a * b;
      const list = turn(
        [digits(p), digits(p * 10), decimalOf(p, 1), decimalOf(p, 2)],
        by,
      );
      return {
        o1: list[0] ?? "",
        o2: list[1] ?? "",
        o3: list[2] ?? "",
        o4: list[3] ?? "",
        ra: String(roundTen(a)),
        rb: String(roundTen(b)),
        est: digits(roundTen(a) * roundTen(b)),
        exact: digits(p),
      };
    },
    consts: [1, 2, 3, 4],
  }),
  a14({
    id: "A14.calculator.12",
    form: "buses-needed-from-a-decimal-display",
    groups: [8, 8],
    roles: { a: "count of people", b: "count of seats in one bus" },
    draw: (r) => [between(r, 100, 999), between(r, 15, 49)],
    valid: ([n = 0, d = 0]) => n % d !== 0 && Math.floor(n / d) >= 3,
    solve: ([n = 0, d = 0]) => Math.floor(n / d) + 1,
    ref: ([n = 0, d = 0]) => Math.ceil(n / d),
    traps: [
      [
        "the-whole-part-only",
        "conceptual",
        ([n = 0, d = 0]) => Math.floor(n / d),
      ],
      [
        "rounded-to-the-nearest",
        "procedural",
        ([n = 0, d = 0]) => apartOf(Math.round(n / d), Math.floor(n / d) + 1),
      ],
      [
        "the-digits-after-the-comma",
        "conceptual",
        ([n = 0, d = 0]) =>
          apartOf(frac3(n, d), Math.floor(n / d), Math.floor(n / d) + 1),
      ],
    ],
    extra: ([n = 0, d = 0]) => ({
      shown: `${Math.floor(n / d)},${String(frac3(n, d)).padStart(3, "0")}`,
      q: String(Math.floor(n / d)),
    }),
    consts: [1],
  }),
  a14({
    id: "A14.calculator.13",
    form: "presses-until-the-display-reaches-a-number",
    groups: [8, 8],
    origin: {
      olympiad: "repeated addition until a bound is reached (RES-4283, F16)",
    },
    roles: { a: "step added each time", b: "target number" },
    draw: (r) => [between(r, 7, 29), between(r, 200, 999)],
    valid: ([a = 0, n = 0]) => n % a !== 0,
    solve: ([a = 0, n = 0]) => Math.floor(n / a) + 1,
    ref: ([a = 0, n = 0]) => {
      let shown = 0;
      let presses = 0;
      while (shown < n) {
        shown += a;
        presses += 1;
      }
      return presses;
    },
    traps: [
      [
        "the-whole-part-only",
        "conceptual",
        ([a = 0, n = 0]) => Math.floor(n / a),
      ],
      [
        "one-press-too-many",
        "procedural",
        ([a = 0, n = 0]) => Math.floor(n / a) + 2,
      ],
      [
        "the-quotient-rounded",
        "procedural",
        ([a = 0, n = 0]) => apartOf(Math.round(n / a), Math.floor(n / a) + 1),
      ],
    ],
    consts: [1],
  }),
];

const a14s = forSubtype("A14", "calculator-1S");
const calcS = [
  a14s({
    id: "A14.calculator-1S.01",
    form: "a-quotient-rounded-to-a-whole-number",
    groups: [8, 8],
    draw: (r) => [between(r, 100, 999), between(r, 7, 19)],
    valid: ([n = 0, d = 0]) =>
      n % d !== 0 &&
      ((n % d) * 2) % d !== 0 &&
      Math.round(n / d) !== Math.floor(n / d),
    solve: ([n = 0, d = 0]) => Math.round(n / d),
    ref: ([n = 0, d = 0]) =>
      (n % d) * 2 > d ? Math.floor(n / d) + 1 : Math.floor(n / d),
    traps: [
      ["cut-off", "procedural", ([n = 0, d = 0]) => Math.floor(n / d)],
      [
        "after-comma",
        "conceptual",
        ([n = 0, d = 0]) =>
          frac3(n, d) === Math.floor(n / d) || frac3(n, d) === Math.round(n / d)
            ? null
            : frac3(n, d),
      ],
      [
        "remainder",
        "conceptual",
        ([n = 0, d = 0]) => {
          const w = n % d;
          return w === frac3(n, d) ||
            w === Math.floor(n / d) ||
            w === Math.round(n / d)
            ? null
            : w;
        },
      ],
    ],
  }),
  a14s({
    id: "A14.calculator-1S.02",
    form: "the-difference-between-a-calculator-chain-and-the-true-value",
    groups: [8, 8],
    draw: (r) => [between(r, 3, 12), between(r, 3, 12), between(r, 3, 9)],
    valid: ([a = 0, b = 0, c = 0]) => (a + b) * c !== a + b * c && a !== b,
    solve: ([a = 0, b = 0, c = 0]) => (a + b) * c - (a + b * c),
    ref: ([a = 0, , c = 0]) => a * (c - 1),
    traps: [
      ["true-value", "conceptual", ([a = 0, b = 0, c = 0]) => a + b * c],
      ["display-value", "conceptual", ([a = 0, b = 0, c = 0]) => (a + b) * c],
      ["wrong-factor", "conceptual", ([, b = 0, c = 0]) => b * (c - 1)],
    ],
    extra: ([a = 0, b = 0, c = 0]) => ({
      x: String((a + b) * c),
      y: String(a + b * c),
    }),
  }),
  a14s({
    id: "A14.calculator-1S.03",
    form: "a-constant-doubling",
    groups: [8, 8],
    draw: (r) => [between(r, 3, 19), between(r, 4, 7)],
    solve: ([a = 0, k = 0]) => a * 2 ** k,
    ref: ([a = 0, k = 0]) =>
      Array.from({ length: k }).reduce<number>((m) => m * 2, a),
    traps: [
      ["multiplied-by-count", "procedural", ([a = 0, k = 0]) => 2 * k * a],
      [
        "one-doubling-less",
        "procedural",
        ([a = 0, k = 0]) => (k === 4 ? null : a * 2 ** (k - 1)),
      ],
      ["one-doubling-more", "procedural", ([a = 0, k = 0]) => a * 2 ** (k + 1)],
    ],
    consts: [2],
  }),
  a14s({
    id: "A14.calculator-1S.04",
    form: "the-mean-of-four-readings",
    groups: [8, 8],
    draw: (r) => [
      between(r, 12, 98),
      between(r, 12, 98),
      between(r, 12, 98),
      between(r, 12, 98),
    ],
    valid: ([a = 0, b = 0, c = 0, d = 0]) =>
      (a + b + c + d) % 4 === 0 && new Set([a, b, c, d]).size > 2,
    solve: ([a = 0, b = 0, c = 0, d = 0]) => (a + b + c + d) / 4,
    ref: ([a = 0, b = 0, c = 0, d = 0]) =>
      Array.from({ length: 400 }, (_, x) => x).find(
        (x) => 4 * x === a + b + c + d,
      ) ?? -1,
    traps: [
      [
        "not-divided",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => a + b + c + d,
      ],
      [
        "divided-by-three",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) =>
          (a + b + c + d) % 3 === 0 ? (a + b + c + d) / 3 : null,
      ],
      [
        "divided-by-five",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) =>
          (a + b + c + d) % 5 === 0 ? (a + b + c + d) / 5 : null,
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => ({ s: String(a + b + c + d) }),
    consts: [4],
  }),
  a14s({
    id: "A14.calculator-1S.05",
    form: "a-product-of-two-sums-with-brackets",
    groups: [8, 8],
    draw: (r) => [
      between(r, 12, 89),
      between(r, 12, 89),
      between(r, 52, 99),
      between(r, 12, 49),
    ],
    valid: ([, , c = 0, d = 0]) => c > d,
    solve: ([a = 0, b = 0, c = 0, d = 0]) => (a + b) * (c - d),
    ref: ([a = 0, b = 0, c = 0, d = 0]) => sum(c - d, a + b),
    traps: [
      [
        "brackets-ignored",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => a + b * c - d,
      ],
      [
        "brackets-added",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => a + b + (c - d),
      ],
      [
        "second-bracket-ignored",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => (a + b) * c - d,
      ],
    ],
  }),
  a14s({
    id: "A14.calculator-1S.06",
    form: "an-average-speed",
    groups: [8, 8],
    draw: (r) => [between(r, 3, 9), between(r, 45, 95)],
    valid: ([t = 0, s = 0]) => t !== s,
    solve: ([, s = 0]) => s,
    ref: ([t = 0, s = 0]) => (t * s) / t,
    traps: [
      ["distance-minus-time", "procedural", ([t = 0, s = 0]) => t * s - t],
      ["distance-itself", "conceptual", ([t = 0, s = 0]) => t * s],
      ["distance-times-time", "procedural", ([t = 0, s = 0]) => t * t * s],
    ],
    extra: ([t = 0, s = 0]) => ({ d: digits(t * s) }),
  }),
  a14s({
    id: "A14.calculator-1S.07",
    form: "a-sum-of-five-large-numbers",
    groups: [8, 8],
    draw: (r) => [
      between(r, 12_000, 49_999),
      between(r, 12_000, 49_999),
      between(r, 12_000, 49_999),
      between(r, 12_000, 49_999),
      between(r, 12_000, 49_999),
    ],
    valid: (v) => new Set(v).size === v.length,
    solve: (v) => v.reduce((p, q) => p + q, 0),
    ref: (v) => [...v].reverse().reduce((p, q) => p + q, 0),
    traps: [
      [
        "four-addends",
        "procedural",
        (v) => v.slice(0, 4).reduce((p, q) => p + q, 0),
      ],
      ["last-four", "procedural", (v) => v.slice(1).reduce((p, q) => p + q, 0)],
      [
        "without-middle",
        "procedural",
        (v) => v.filter((_, i) => i !== 2).reduce((p, q) => p + q, 0),
      ],
    ],
  }),
  a14s({
    id: "A14.calculator-1S.08",
    form: "the-remainder-from-a-rounded-quotient",
    groups: [8, 8],
    draw: (r) => [between(r, 200, 999), between(r, 12, 59)],
    valid: ([n = 0, d = 0]) => n % d !== 0 && Math.floor(n / d) !== n % d,
    solve: ([n = 0, d = 0]) => n - d * Math.floor(n / d),
    ref: ([n = 0, d = 0]) => n % d,
    traps: [
      ["whole-part", "conceptual", ([n = 0, d = 0]) => Math.floor(n / d)],
      [
        "minus-quotient",
        "procedural",
        ([n = 0, d = 0]) => n - Math.floor(n / d),
      ],
      [
        "complement",
        "conceptual",
        ([n = 0, d = 0]) =>
          d - (n % d) === Math.floor(n / d) ? null : d - (n % d),
      ],
    ],
    extra: ([n = 0, d = 0]) => ({ q: String(Math.floor(n / d)) }),
  }),
  a14s({
    id: "A14.calculator-1S.09",
    form: "a-result-below-zero-on-the-display",
    groups: [8, 8],
    draw: (r) => [between(r, 120, 480), between(r, 500, 900)],
    solve: ([a = 0, b = 0]) => a - b,
    ref: ([a = 0, b = 0]) => -(b - a),
    traps: [
      ["sign-lost", "conceptual", ([a = 0, b = 0]) => b - a],
      ["zero", "conceptual", ([]) => 0],
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
    ],
  }),
  a14s({
    id: "A14.calculator-1S.10",
    form: "the-side-of-a-square-from-its-area",
    groups: [8, 8],
    draw: (r) => [2 * between(r, 6, 49)],
    valid: ([s = 0]) => ones(s) > 0 && s !== 25,
    solve: ([s = 0]) => s,
    ref: ([s = 0]) =>
      Array.from({ length: 100 }, (_, x) => x).find((x) => x * x === s * s) ??
      -1,
    traps: [
      ["half-of-area", "conceptual", ([s = 0]) => (s * s) / 2],
      ["quarter-of-area", "conceptual", ([s = 0]) => (s * s) / 4],
      ["area-itself", "conceptual", ([s = 0]) => s * s],
    ],
    extra: ([s = 0]) => ({ area: digits(s * s) }),
  }),
  a14s({
    id: "A14.calculator-1S.11",
    form: "the-missing-reading-from-the-mean",
    groups: [8, 8],
    origin: {
      olympiad: "a missing number from the mean of five (RES-4283, F12)",
    },
    roles: { e: "mean of the five readings" },
    draw: (r) => [
      between(r, 120, 380),
      between(r, 120, 380),
      between(r, 120, 380),
      between(r, 120, 380),
      between(r, 180, 320),
    ],
    valid: ([a = 0, b = 0, c = 0, d = 0, m = 0]) =>
      5 * m - a - b - c - d >= 100 && 5 * m - a - b - c - d <= 500,
    solve: ([a = 0, b = 0, c = 0, d = 0, m = 0]) => 5 * m - (a + b + c + d),
    ref: ([a = 0, b = 0, c = 0, d = 0, m = 0]) =>
      Array.from({ length: 700 }, (_, x) => x).find(
        (x) => (a + b + c + d + x) / 5 === m,
      ) ?? -1,
    traps: [
      [
        "the-mean-less-the-sum",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0, m = 0]) =>
          apartOf(m - (a + b + c + d) / 4, 5 * m - (a + b + c + d)),
      ],
      [
        "the-sum-of-the-four-less-the-mean",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0, m = 0]) =>
          apartOf(a + b + c + d - m, 5 * m - (a + b + c + d)),
      ],
      ["the-total-only", "conceptual", ([, , , , m = 0]) => 5 * m],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0, m = 0]) => ({
      t: digits(5 * m),
      s: digits(a + b + c + d),
    }),
    consts: [5],
  }),
  a14s({
    id: "A14.calculator-1S.12",
    form: "doublings-until-the-display-passes-a-number",
    groups: [8, 8],
    origin: {
      olympiad: "repeated doubling until a bound is passed (RES-4283, F16)",
    },
    roles: { a: "starting number", b: "bound" },
    draw: (r) => [between(r, 3, 9), between(r, 500, 5000)],
    valid: ([a = 0, n = 0]) => a * 2 ** (doublingsPast(a, n) - 1) !== n,
    solve: ([a = 0, n = 0]) => doublingsPast(a, n),
    ref: ([a = 0, n = 0]) => {
      let x = a;
      let k = 0;
      while (x <= n) {
        x = x + x;
        k += 1;
      }
      return k;
    },
    traps: [
      [
        "one-doubling-too-few",
        "procedural",
        ([a = 0, n = 0]) => doublingsPast(a, n) - 1,
      ],
      [
        "one-doubling-too-many",
        "procedural",
        ([a = 0, n = 0]) => doublingsPast(a, n) + 1,
      ],
      [
        "the-quotient",
        "conceptual",
        ([a = 0, n = 0]) => apartOf(Math.floor(n / a), doublingsPast(a, n)),
      ],
    ],
    extra: ([a = 0, n = 0]) => {
      const k = doublingsPast(a, n);
      return {
        before: digits(a * 2 ** (k - 1)),
        after: digits(a * 2 ** k),
        chain: Array.from({ length: k + 1 }, (_, i) => digits(a * 2 ** i)).join(
          ", ",
        ),
      };
    },
    consts: [2],
  }),
  a14s({
    id: "A14.calculator-1S.13",
    form: "the-sum-of-all-numbers-made-from-three-digits",
    groups: [8, 8],
    origin: {
      olympiad: "the sum of all numbers made from given digits (RES-4283, F20)",
    },
    draw: (r) => {
      const all = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const a = pick(r, all);
      const b = pick(
        r,
        all.filter((x) => x !== a),
      );
      return [
        a,
        b,
        pick(
          r,
          all.filter((x) => x !== a && x !== b),
        ),
      ];
    },
    solve: ([a = 0, b = 0, c = 0]) => 222 * (a + b + c),
    ref: ([a = 0, b = 0, c = 0]) => {
      const d = [a, b, c];
      let total = 0;
      for (const i of [0, 1, 2])
        for (const j of [0, 1, 2]) {
          if (j === i) continue;
          const k = 3 - i - j;
          total += 100 * (d[i] ?? 0) + 10 * (d[j] ?? 0) + (d[k] ?? 0);
        }
      return total;
    },
    traps: [
      [
        "one-number-only",
        "procedural",
        ([a = 0, b = 0, c = 0]) => 100 * a + 10 * b + c,
      ],
      [
        "each-digit-once-per-place",
        "conceptual",
        ([a = 0, b = 0, c = 0]) => 111 * (a + b + c),
      ],
      [
        "the-sum-of-the-digits",
        "conceptual",
        ([a = 0, b = 0, c = 0]) => a + b + c,
      ],
    ],
    extra: ([a = 0, b = 0, c = 0]) => ({
      s: String(a + b + c),
      half: digits(111 * (a + b + c)),
    }),
    consts: [111, 222, 2],
  }),
];

/** A linear equation of one unknown: the answer is a whole number. */
const a15 = forSubtype("A15", "one-step-eq");
const EQ = { extension: "equations, Russian grade 5 to 6 (RES-4283)" };
const oneStep = [
  a15({
    id: "A15.one-step-eq.01",
    form: "an-unknown-addend",
    groups: [8, 8],
    origin: EQ,
    draw: (r) => [between(r, 12, 59), between(r, 60, 130)],
    solve: ([a = 0, b = 0]) => b - a,
    ref: ([a = 0, b = 0]) =>
      Array.from({ length: 200 }, (_, x) => x).find((x) => x + a === b) ?? -1,
    traps: [
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
      [
        "smaller-from-larger",
        "procedural",
        ([a = 0, b = 0]) => columns(b, a, (x, y) => Math.abs(x - y)),
      ],
      ["right-side", "conceptual", ([, b = 0]) => b],
    ],
  }),
  a15({
    id: "A15.one-step-eq.02",
    form: "an-unknown-minuend",
    groups: [8, 8],
    origin: EQ,
    draw: (r) => [between(r, 12, 59), between(r, 12, 59)],
    valid: ([a = 0, b = 0]) => a !== b,
    solve: ([a = 0, b = 0]) => a + b,
    ref: ([a = 0, b = 0]) =>
      Array.from({ length: 200 }, (_, x) => x).find((x) => x - a === b) ?? -1,
    traps: [
      ["subtracted", "procedural", ([a = 0, b = 0]) => Math.abs(a - b)],
      [
        "no-carry",
        "procedural",
        ([a = 0, b = 0]) => columns(a, b, (x, y) => (x + y) % 10),
      ],
    ],
  }),
  a15({
    id: "A15.one-step-eq.03",
    form: "an-unknown-subtrahend",
    groups: [8, 8],
    origin: EQ,
    draw: (r) => [between(r, 60, 130), between(r, 12, 59)],
    solve: ([a = 0, b = 0]) => a - b,
    ref: ([a = 0, b = 0]) =>
      Array.from({ length: 200 }, (_, x) => x).find((x) => a - x === b) ?? -1,
    traps: [
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
      [
        "smaller-from-larger",
        "procedural",
        ([a = 0, b = 0]) => columns(a, b, (x, y) => Math.abs(x - y)),
      ],
      ["right-side", "conceptual", ([, b = 0]) => b],
    ],
  }),
  a15({
    id: "A15.one-step-eq.04",
    form: "an-unknown-factor",
    groups: [8, 8],
    origin: EQ,
    draw: (r) => [between(r, 3, 12), between(r, 5, 19)],
    valid: ([a = 0, x = 0]) => a !== x,
    solve: ([, x = 0]) => x,
    ref: ([a = 0, x = 0]) => (a * x) / a,
    traps: [
      ["product-minus-factor", "procedural", ([a = 0, x = 0]) => a * x - a],
      ["product-itself", "conceptual", ([a = 0, x = 0]) => a * x],
      ["multiplied", "procedural", ([a = 0, x = 0]) => a * x * a],
    ],
    extra: ([a = 0, x = 0]) => ({ c: String(a * x) }),
  }),
  a15({
    id: "A15.one-step-eq.05",
    form: "an-unknown-dividend",
    groups: [8, 8],
    origin: EQ,
    draw: (r) => [between(r, 3, 12), between(r, 5, 19)],
    valid: ([a = 0, q = 0]) => a !== q,
    solve: ([a = 0, q = 0]) => a * q,
    ref: ([a = 0, q = 0]) => sum(q, a),
    traps: [
      ["added", "procedural", ([a = 0, q = 0]) => a + q],
      ["right-side", "conceptual", ([, q = 0]) => q],
      [
        "reverse-division",
        "procedural",
        ([a = 0, q = 0]) => (q % a === 0 ? q / a : null),
      ],
    ],
  }),
  a15({
    id: "A15.one-step-eq.06",
    form: "an-unknown-divisor",
    groups: [8, 8],
    origin: EQ,
    draw: (r) => [between(r, 3, 12), between(r, 5, 19)],
    valid: ([d = 0, q = 0]) => d !== q,
    solve: ([d = 0]) => d,
    ref: ([d = 0, q = 0]) =>
      Array.from({ length: 13 }, (_, x) => x).find(
        (x) => x > 0 && (d * q) / x === q,
      ) ?? -1,
    traps: [
      ["quotient", "conceptual", ([, q = 0]) => q],
      ["multiplied", "procedural", ([d = 0, q = 0]) => d * q * q],
    ],
    extra: ([d = 0, q = 0]) => ({ n: String(d * q) }),
  }),
  a15({
    id: "A15.one-step-eq.07",
    form: "an-age-difference",
    groups: [8, 8],
    origin: EQ,
    draw: (r) => [between(r, 22, 34), between(r, 38, 62)],
    valid: ([a = 0, b = 0]) => b > a + 6,
    solve: ([a = 0, b = 0]) => b - a,
    ref: ([a = 0, b = 0]) =>
      Array.from({ length: 100 }, (_, x) => x).find((x) => x + a === b) ?? -1,
    traps: [
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
      [
        "smaller-from-larger",
        "procedural",
        ([a = 0, b = 0]) => columns(b, a, (x, y) => Math.abs(x - y)),
      ],
      ["right-side", "conceptual", ([, b = 0]) => b],
    ],
  }),
  a15({
    id: "A15.one-step-eq.08",
    form: "two-equal-unknowns-in-an-equation",
    groups: [8, 8],
    origin: EQ,
    draw: (r) => [between(r, 6, 49)],
    solve: ([x = 0]) => x,
    ref: ([x = 0]) => (2 * x) / 2,
    traps: [
      ["not-halved", "procedural", ([x = 0]) => 2 * x],
      ["doubled", "procedural", ([x = 0]) => 4 * x],
    ],
    extra: ([x = 0]) => ({ c: String(2 * x) }),
    consts: [2],
  }),
  a15({
    id: "A15.one-step-eq.09",
    form: "an-unknown-in-a-quotient-of-a-large-number",
    groups: [8, 8],
    origin: EQ,
    draw: (r) => [between(r, 4, 12), between(r, 12, 49)],
    valid: ([a = 0, b = 0]) => a !== b,
    solve: ([a = 0, b = 0]) => a * b,
    ref: ([a = 0, b = 0]) => sum(a, b),
    traps: [
      ["quotient-and-divisor-added", "procedural", ([a = 0, b = 0]) => a + b],
      ["right-side", "conceptual", ([, b = 0]) => b],
      [
        "reverse-division",
        "procedural",
        ([a = 0, b = 0]) => (b % a === 0 ? b / a : null),
      ],
    ],
  }),
  a15({
    id: "A15.one-step-eq.10",
    form: "an-unknown-in-a-product-that-equals-a-product",
    groups: [8, 8],
    origin: EQ,
    draw: (r) => [
      pick(r, [4, 6, 8, 12]),
      pick(r, [3, 5, 7, 9]),
      pick(r, [2, 3, 4, 6]),
    ],
    valid: ([a = 0, b = 0, c = 0]) => (a * b) % c === 0 && (a * b) / c !== a,
    solve: ([a = 0, b = 0, c = 0]) => (a * b) / c,
    ref: ([a = 0, b = 0, c = 0]) =>
      Array.from({ length: 200 }, (_, x) => x).find((x) => x * c === a * b) ??
      -1,
    traps: [
      ["not-divided", "procedural", ([a = 0, b = 0]) => a * b],
      ["multiplied", "procedural", ([a = 0, b = 0, c = 0]) => a * b * c],
      [
        "product-minus-factor",
        "procedural",
        ([a = 0, b = 0, c = 0]) => a * b - c,
      ],
    ],
  }),
  forChoice(
    "A15",
    "one-step-eq",
  )({
    id: "A15.one-step-eq.11",
    form: "an-unknown-addend-with-a-decimal",
    groups: [8, 8],
    kind: "decimal",
    origin: EQ,
    draw: (r) => {
      const t = between(r, 11, 49);
      return [t, Math.ceil(t / 10) + between(r, 1, 6)];
    },
    valid: ([t = 0]) => t % 10 !== 0,
    solve: ([t = 0, c = 0]) => q(10 * c - t, 10),
    ref: ([t = 0, c = 0]) =>
      q(
        Array.from({ length: 10 * c + 1 }, (_, k) => k).find(
          (k) => k + t === 10 * c,
        ) ?? -1,
        10,
      ),
    traps: [
      ["added", "procedural", ([t = 0, c = 0]) => q(10 * c + t, 10)],
      [
        "the-tenths-taken-as-ones",
        "procedural",
        ([t = 0, c = 0]) => (10 * c - t > 0 ? q(c - t, 1) : null),
      ],
      [
        "the-whole-parts-only",
        "conceptual",
        ([t = 0, c = 0]) => q(c - Math.floor(t / 10), 1),
      ],
    ],
    extra: ([t = 0]) => ({ p: tenthsText(t) }),
    consts: [],
  }),
  a15({
    id: "A15.one-step-eq.12",
    form: "an-unknown-factor-with-one-half",
    groups: [8, 8],
    origin: EQ,
    draw: (r) => [between(r, 3, 40)],
    solve: ([k = 0]) => 2 * k,
    ref: ([k = 0]) =>
      Array.from({ length: 100 }, (_, x) => x).find((x) => x / 2 === k) ?? -1,
    traps: [
      [
        "half-of-the-result",
        "procedural",
        ([k = 0]) => (k % 2 === 0 ? k / 2 : null),
      ],
      ["the-result-itself", "conceptual", ([k = 0]) => k],
      ["the-result-times-five", "procedural", ([k = 0]) => 5 * k],
    ],
    extra: () => ({ h: "0,5" }),
  }),
  a15({
    id: "A15.one-step-eq.13",
    form: "an-unknown-multiplied-by-itself",
    groups: [8, 8],
    origin: {
      olympiad: "a square found by thinking, not by a formula (RES-4283, F8)",
    },
    draw: (r) => [between(r, 4, 19)],
    solve: ([x = 0]) => x,
    ref: ([x = 0]) =>
      Array.from({ length: 30 }, (_, k) => k).find((k) => k * k === x * x) ??
      -1,
    traps: [
      [
        "half-of-the-product",
        "procedural",
        ([x = 0]) => ((x * x) % 2 === 0 ? (x * x) / 2 : null),
      ],
      ["the-product-itself", "conceptual", ([x = 0]) => x * x],
      ["the-next-number", "procedural", ([x = 0]) => x + 1],
    ],
    extra: ([x = 0]) => ({ s: String(x * x) }),
  }),
  forChoice(
    "A15",
    "one-step-eq",
  )({
    id: "A15.one-step-eq.14",
    form: "an-unknown-dividend-with-a-decimal-quotient",
    groups: [8, 8],
    kind: "decimal",
    origin: EQ,
    draw: (r) => [pick(r, [2, 4, 5, 8]), between(r, 11, 49)],
    valid: ([, t = 0]) => t % 10 !== 0,
    solve: ([a = 0, t = 0]) => q(a * t, 10),
    ref: ([a = 0, t = 0]) =>
      q(
        Array.from({ length: 700 }, (_, k) => k).find((k) => k === a * t) ?? -1,
        10,
      ),
    traps: [
      ["divided-instead", "procedural", ([a = 0, t = 0]) => q(t, 10 * a)],
      ["the-comma-lost", "procedural", ([a = 0, t = 0]) => q(a * t, 1)],
      ["added", "procedural", ([a = 0, t = 0]) => q(10 * a + t, 10)],
    ],
    extra: ([, t = 0]) => ({ p: tenthsText(t) }),
  }),
];

const a16 = forSubtype("A16", "two-step-eq");
const twoStep = [
  a16({
    id: "A16.two-step-eq.01",
    form: "a-multiple-of-the-unknown-plus-a-number",
    groups: [8, 8],
    origin: EQ,
    draw: (r) => [between(r, 2, 9), between(r, 3, 19), between(r, 3, 19)],
    valid: ([a = 0, b = 0, x = 0]) => a !== x && b !== x,
    solve: ([, , x = 0]) => x,
    ref: ([a = 0, b = 0, x = 0]) => (a * x + b - b) / a,
    traps: [
      ["not-divided", "procedural", ([a = 0, , x = 0]) => a * x],
      [
        "order-swapped",
        "procedural",
        ([a = 0, b = 0, x = 0]) => {
          const c = a * x + b;
          return c % a === 0 && c / a - b > 0 ? c / a - b : null;
        },
      ],
      [
        "added",
        "procedural",
        ([a = 0, b = 0, x = 0]) => {
          const c = a * x + b;
          return (c + b) % a === 0 ? (c + b) / a : null;
        },
      ],
    ],
    extra: ([a = 0, b = 0, x = 0]) => ({ c: String(a * x + b) }),
  }),
  a16({
    id: "A16.two-step-eq.02",
    form: "a-multiple-of-the-unknown-minus-a-number",
    groups: [8, 8],
    origin: EQ,
    draw: (r) => [between(r, 2, 9), between(r, 3, 19), between(r, 5, 19)],
    valid: ([a = 0, b = 0, x = 0]) => a !== x && a * x > b && b !== x,
    solve: ([, , x = 0]) => x,
    ref: ([a = 0, b = 0, x = 0]) => (a * x - b + b) / a,
    traps: [
      ["not-divided", "procedural", ([a = 0, , x = 0]) => a * x],
      [
        "subtracted",
        "procedural",
        ([a = 0, b = 0, x = 0]) => {
          const c = a * x - b;
          return (c - b) % a === 0 && c - b > 0 ? (c - b) / a : null;
        },
      ],
      [
        "order-swapped",
        "procedural",
        ([a = 0, b = 0, x = 0]) => {
          const c = a * x - b;
          return c % a === 0 ? c / a + b : null;
        },
      ],
    ],
    extra: ([a = 0, b = 0, x = 0]) => ({ c: String(a * x - b) }),
  }),
  a16({
    id: "A16.two-step-eq.03",
    form: "a-bracketed-unknown-times-a-number",
    groups: [8, 8],
    origin: EQ,
    draw: (r) => [between(r, 3, 19), between(r, 2, 9), between(r, 5, 25)],
    valid: ([a = 0, b = 0, x = 0]) => b !== x && a !== x,
    solve: ([, , x = 0]) => x,
    ref: ([a = 0, b = 0, x = 0]) => (b * (x + a)) / b - a,
    traps: [
      [
        "bracket-skipped",
        "procedural",
        ([a = 0, b = 0, x = 0]) => (b * (x + a)) / b,
      ],
      ["added-a", "procedural", ([a = 0, , x = 0]) => x + 2 * a],
      [
        "subtract-first",
        "procedural",
        ([a = 0, b = 0, x = 0]) => {
          const c = b * (x + a);
          return (c - a) % b === 0 ? (c - a) / b : null;
        },
      ],
    ],
    extra: ([a = 0, b = 0, x = 0]) => ({
      c: String(b * (x + a)),
      s: String(x + a),
    }),
  }),
  a16({
    id: "A16.two-step-eq.04",
    form: "a-quotient-of-the-unknown-plus-a-number",
    groups: [8, 8],
    origin: EQ,
    draw: (r) => [between(r, 2, 9), between(r, 3, 19), between(r, 3, 19)],
    valid: ([a = 0, b = 0, q = 0]) => a !== q && b !== q,
    solve: ([a = 0, , q = 0]) => a * q,
    ref: ([a = 0, b = 0, q = 0]) => (q + b - b) * a,
    traps: [
      [
        "second-step-skipped",
        "procedural",
        ([a = 0, b = 0, q = 0]) => a * (q + b),
      ],
      ["quotient-only", "procedural", ([, , q = 0]) => q],
      ["added-b", "procedural", ([a = 0, b = 0, q = 0]) => a * (q + 2 * b)],
    ],
    extra: ([, b = 0, q = 0]) => ({ c: String(q + b) }),
  }),
  a16({
    id: "A16.two-step-eq.05",
    form: "a-number-minus-a-multiple-of-the-unknown",
    groups: [8, 8],
    origin: EQ,
    draw: (r) => [between(r, 2, 9), between(r, 60, 150), between(r, 3, 15)],
    valid: ([a = 0, b = 0, x = 0]) => b > a * x && a !== x,
    solve: ([, , x = 0]) => x,
    ref: ([a = 0, b = 0, x = 0]) => (b - (b - a * x)) / a,
    traps: [
      ["difference-not-divided", "procedural", ([a = 0, , x = 0]) => a * x],
      ["multiplied", "procedural", ([a = 0, , x = 0]) => a * (a * x)],
      [
        "added-c",
        "procedural",
        ([a = 0, b = 0, x = 0]) => {
          const c = b - a * x;
          return (b + c) % a === 0 ? (b + c) / a : null;
        },
      ],
    ],
    extra: ([a = 0, b = 0, x = 0]) => ({ c: String(b - a * x) }),
  }),
  a16({
    id: "A16.two-step-eq.06",
    form: "a-difference-in-brackets-divided-by-a-number",
    groups: [8, 8],
    origin: EQ,
    draw: (r) => [between(r, 3, 19), between(r, 2, 9), between(r, 4, 19)],
    valid: ([a = 0, b = 0, q = 0]) => b !== q && a !== q,
    solve: ([a = 0, b = 0, q = 0]) => a + b * q,
    ref: ([a = 0, b = 0, q = 0]) => q * b + a,
    traps: [
      ["bracket-skipped", "procedural", ([, b = 0, q = 0]) => b * q],
      [
        "subtracted-a",
        "procedural",
        ([a = 0, b = 0, q = 0]) => (b * q - a > 0 ? b * q - a : null),
      ],
      [
        "not-multiplied",
        "procedural",
        ([a = 0, b = 0, q = 0]) => {
          const w = q + a;
          return w === b * q || w === b * q - a ? null : w;
        },
      ],
    ],
    extra: ([a = 0, b = 0, q = 0]) => ({ c: String(q), n: String(a + b * q) }),
  }),
  a16({
    id: "A16.two-step-eq.07",
    form: "a-word-problem-with-items-and-a-fixed-price",
    groups: [8, 8],
    origin: EQ,
    draw: (r) => [between(r, 3, 9), between(r, 5, 19), between(r, 3, 12)],
    valid: ([a = 0, b = 0, x = 0]) => a !== x && b !== x,
    solve: ([, , x = 0]) => x,
    ref: ([a = 0, b = 0, x = 0]) => (a * x + b - b) / a,
    traps: [
      ["not-divided", "procedural", ([a = 0, , x = 0]) => a * x],
      [
        "order-swapped",
        "procedural",
        ([a = 0, b = 0, x = 0]) => {
          const c = a * x + b;
          return c % a === 0 && c / a - b > 0 ? c / a - b : null;
        },
      ],
      [
        "added",
        "procedural",
        ([a = 0, b = 0, x = 0]) => {
          const c = a * x + b;
          return (c + b) % a === 0 ? (c + b) / a : null;
        },
      ],
    ],
    extra: ([a = 0, b = 0, x = 0]) => ({ c: String(a * x + b) }),
  }),
  a16({
    id: "A16.two-step-eq.08",
    form: "two-equal-parts-and-a-remainder",
    groups: [8, 8],
    origin: EQ,
    draw: (r) => [between(r, 3, 19), between(r, 12, 49)],
    valid: ([a = 0, x = 0]) => a !== x,
    solve: ([, x = 0]) => x,
    ref: ([a = 0, x = 0]) => (2 * x + a - a) / 2,
    traps: [
      ["not-halved", "procedural", ([, x = 0]) => 2 * x],
      [
        "order-swapped",
        "procedural",
        ([a = 0, x = 0]) => {
          const c = 2 * x + a;
          return c % 2 === 0 && c / 2 - a > 0 ? c / 2 - a : null;
        },
      ],
      [
        "no-subtract",
        "procedural",
        ([a = 0, x = 0]) => {
          const c = 2 * x + a;
          return c % 2 === 0 ? c / 2 : null;
        },
      ],
    ],
    extra: ([a = 0, x = 0]) => ({ c: String(2 * x + a) }),
    consts: [2],
  }),
  a16({
    id: "A16.two-step-eq.09",
    form: "a-number-added-to-a-quotient-equal-to-a-number",
    groups: [8, 8],
    origin: EQ,
    draw: (r) => [between(r, 2, 9), between(r, 12, 39), between(r, 3, 19)],
    valid: ([a = 0, b = 0, q = 0]) => b > q && a !== q,
    solve: ([a = 0, b = 0, q = 0]) => a * (b - q),
    ref: ([a = 0, b = 0, q = 0]) => (b - q) * a,
    traps: [
      [
        "added-not-subtracted",
        "procedural",
        ([a = 0, b = 0, q = 0]) => a * (b + q),
      ],
      ["quotient-only", "procedural", ([, b = 0, q = 0]) => b - q],
      ["order-swapped", "procedural", ([a = 0, b = 0, q = 0]) => a * b - q],
    ],
    extra: ([, b = 0, q = 0]) => ({ e: String(b - q) }),
  }),
  a16({
    id: "A16.two-step-eq.10",
    form: "three-parts-of-the-unknown-plus-a-number",
    groups: [8, 8],
    origin: EQ,
    roles: {
      a: "count of boxes",
      b: "count taken out of each box",
      c: "count left in all",
    },
    draw: (r) => [between(r, 3, 9), between(r, 3, 12), between(r, 14, 30)],
    valid: ([a = 0, b = 0, x = 0]) => a !== x && b !== x,
    solve: ([, , x = 0]) => x,
    ref: ([a = 0, b = 0, x = 0]) =>
      Array.from({ length: 100 }, (_, k) => k).find(
        (k) => a * (k - b) === a * (x - b),
      ) ?? -1,
    traps: [
      [
        "the-number-in-each-box-left",
        "conceptual",
        ([, b = 0, x = 0]) => x - b,
      ],
      [
        "the-total-and-the-number-added",
        "procedural",
        ([a = 0, b = 0, x = 0]) => apartOf(a * (x - b) + b, x),
      ],
      [
        "not-divided",
        "procedural",
        ([a = 0, b = 0, x = 0]) => apartOf(a * (x - b) - b, x),
      ],
    ],
    extra: ([a = 0, b = 0, x = 0]) => ({
      c: String(a * (x - b)),
      e: String(x - b),
    }),
  }),
  a16({
    id: "A16.two-step-eq.11",
    form: "three-consecutive-numbers-with-a-given-sum",
    groups: [8, 8],
    origin: {
      olympiad:
        "consecutive numbers and their sum, written as an equation (RES-4283, F12)",
    },
    draw: (r) => [3 * between(r, 6, 40) + 3],
    solve: ([t = 0]) => t / 3 - 1,
    ref: ([t = 0]) =>
      Array.from({ length: t }, (_, x) => x).find(
        (x) => x + (x + 1) + (x + 2) === t,
      ) ?? -1,
    traps: [
      ["the-middle-number", "conceptual", ([t = 0]) => t / 3],
      ["the-largest-number", "conceptual", ([t = 0]) => t / 3 + 1],
      ["the-sum-over-three-less-three", "procedural", ([t = 0]) => t / 3 - 3],
    ],
    consts: [1, 2, 3],
  }),
  a16({
    id: "A16.two-step-eq.12",
    form: "equal-weights-and-a-weight-against-two-weights",
    groups: [8, 8],
    origin: { olympiad: "a balance with equal weights (RES-4283, F11)" },
    roles: {
      a: "extra weight",
      b: "first weight on the other pan",
      c: "second weight on the other pan",
    },
    draw: (r) => {
      const x = between(r, 4, 20);
      const a = between(r, 3, 15);
      const total = 3 * x + a;
      const b = between(r, 5, total - 5);
      return [a, b, total - b];
    },
    valid: ([a = 0, b = 0, c = 0]) => (b + c - a) % 3 === 0 && b !== c,
    solve: ([a = 0, b = 0, c = 0]) => (b + c - a) / 3,
    ref: ([a = 0, b = 0, c = 0]) =>
      Array.from({ length: 80 }, (_, k) => k).find(
        (k) => 3 * k + a === b + c,
      ) ?? -1,
    traps: [
      ["not-divided", "procedural", ([a = 0, b = 0, c = 0]) => b + c - a],
      [
        "the-weight-added",
        "procedural",
        ([a = 0, b = 0, c = 0]) =>
          (b + c + a) % 3 === 0
            ? apartOf((b + c + a) / 3, (b + c - a) / 3)
            : null,
      ],
      [
        "the-weight-not-taken-away",
        "procedural",
        ([a = 0, b = 0, c = 0]) =>
          (b + c) % 3 === 0 ? apartOf((b + c) / 3, (b + c - a) / 3) : null,
      ],
    ],
    extra: ([a = 0, b = 0, c = 0]) => ({
      w: String(b + c),
      z: String(b + c - a),
    }),
    consts: [3],
  }),
  a16({
    id: "A16.two-step-eq.13",
    form: "an-equation-with-a-decimal-number",
    groups: [8, 8],
    origin: EQ,
    draw: (r) => [between(r, 2, 5), between(r, 3, 15), between(r, 1, 9)],
    valid: ([a = 0, x = 0]) => a !== x,
    solve: ([, x = 0]) => x,
    ref: ([a = 0, x = 0]) =>
      Array.from({ length: 40 }, (_, k) => k).find((k) => a * k === a * x) ??
      -1,
    traps: [
      ["not-divided", "procedural", ([a = 0, x = 0]) => a * x],
      [
        "the-decimal-added",
        "procedural",
        ([a = 0, x = 0, t = 0]) => apartOf((a * x + t) / a, x),
      ],
      [
        "the-first-factor",
        "conceptual",
        ([a = 0, x = 0]) => apartOf(a, x, a * x),
      ],
    ],
    extra: ([a = 0, x = 0, t = 0]) => ({
      u: `0,${t}`,
      w: `${a * x},${t}`,
      m: String(a * x),
    }),
  }),
  a16({
    id: "A16.two-step-eq.14",
    form: "a-multiple-that-exceeds-the-number-by-a-given-amount",
    groups: [8, 8],
    origin: {
      olympiad:
        "a number and its multiple, an equation with x on both sides (RES-4283, F12)",
    },
    roles: { a: "how many times larger", b: "excess" },
    draw: (r) => {
      const k = between(r, 3, 6);
      return [k, (k - 1) * between(r, 3, 20)];
    },
    solve: ([k = 0, e = 0]) => e / (k - 1),
    ref: ([k = 0, e = 0]) =>
      Array.from({ length: e + 1 }, (_, x) => x).find((x) => k * x - x === e) ??
      -1,
    traps: [
      [
        "the-excess-over-the-multiple",
        "procedural",
        ([k = 0, e = 0]) => (e % k === 0 ? e / k : null),
      ],
      ["the-excess-itself", "conceptual", ([, e = 0]) => e],
      [
        "the-excess-times-the-multiple",
        "procedural",
        ([k = 0, e = 0]) => e * (k - 1),
      ],
    ],
    extra: ([k = 0]) => ({ d: String(k - 1) }),
    consts: [1],
  }),
];

export const aSpecs4: readonly Spec<never>[] = [
  ...divisible,
  ...efficient,
  ...properties,
  ...calc,
  ...calcS,
  ...oneStep,
  ...twoStep,
];
