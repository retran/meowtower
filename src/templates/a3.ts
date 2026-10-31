// Domain A, part 3: multiplying by two digits, remainders, dividing by one and two digits, the order of
// operations and unknown numbers (RES-4283). The Dutch goals multiply two digits by two digits at group
// 7, divide by one digit with a remainder at group 6 and by two digits at group 7. Texts are plain
// blanks in `content/tasks-a.ru.json`, keyed by the template id.
import { between, pick } from "./draw.js";
import { forSubtype } from "./kit.js";
import type { Spec } from "./spec.js";

const sum = (n: number, x: number): number =>
  Array.from({ length: n }, () => x).reduce((p, q) => p + q, 0);
const ones = (n: number): number => n % 10;
const tens = (n: number): number => Math.floor(n / 10) % 10;
const hundreds = (n: number): number => Math.floor(n / 100);
const countDigits = (n: number): number => String(n).length;

const a7 = forSubtype("A7", "by-two-digit");
const byTwo = [
  a7({
    id: "A7.by-two-digit.01",
    form: "two-digits-by-two-digits-with-small-numbers",
    groups: [7, 7],
    draw: (r) => [between(r, 12, 29), between(r, 12, 29)],
    valid: ([a = 0, b = 0]) => a !== b && ones(b) > 1,
    solve: ([a = 0, b = 0]) => a * b,
    ref: ([a = 0, b = 0]) => a * 10 * tens(b) + a * ones(b),
    traps: [
      ["tens-part-only", "procedural", ([a = 0, b = 0]) => a * 10 * tens(b)],
    ],
  }),
  a7({
    id: "A7.by-two-digit.02",
    form: "one-digit-by-three-digits",
    groups: [6, 7],
    draw: (r) => [between(r, 3, 9), between(r, 201, 899)],
    valid: ([, n = 0]) => tens(n) > 0 && ones(n) > 0,
    solve: ([d = 0, n = 0]) => d * n,
    ref: ([d = 0, n = 0]) =>
      d * 100 * hundreds(n) + d * 10 * tens(n) + d * ones(n),
    traps: [["hundreds-lost", "procedural", ([d = 0, n = 0]) => d * (n % 100)]],
  }),
  a7({
    id: "A7.by-two-digit.03",
    form: "two-digits-by-a-round-ten",
    groups: [7, 7],
    draw: (r) => [between(r, 12, 49), 10 * between(r, 2, 9)],
    valid: ([a = 0]) => ones(a) > 1,
    solve: ([a = 0, b = 0]) => a * b,
    ref: ([a = 0, b = 0]) => a * (b / 10) * 10,
    traps: [["zero-dropped", "procedural", ([a = 0, b = 0]) => a * (b / 10)]],
  }),
  a7({
    id: "A7.by-two-digit.04",
    form: "two-digits-by-two-digits-with-large-numbers",
    groups: [7, 7],
    draw: (r) => [between(r, 31, 99), between(r, 31, 99)],
    valid: ([a = 0, b = 0]) => a !== b && ones(a) > 1 && ones(b) > 1,
    solve: ([a = 0, b = 0]) => a * b,
    ref: ([a = 0, b = 0]) => a * (b - ones(b)) + a * ones(b),
    traps: [
      [
        "parts-only",
        "procedural",
        ([a = 0, b = 0]) => 100 * tens(a) * tens(b) + ones(a) * ones(b),
      ],
    ],
  }),
  a7({
    id: "A7.by-two-digit.05",
    form: "the-price-of-many-items",
    groups: [7, 7],
    draw: (r) => [between(r, 12, 39), between(r, 21, 49)],
    valid: ([a = 0, b = 0]) => a !== b && ones(a) > 1 && ones(b) > 1,
    solve: ([a = 0, b = 0]) => a * b,
    ref: ([a = 0, b = 0]) => sum(a, b),
    traps: [["added", "procedural", ([a = 0, b = 0]) => a + b]],
  }),
  a7({
    id: "A7.by-two-digit.06",
    form: "the-area-of-a-large-rectangle",
    groups: [7, 7],
    draw: (r) => [between(r, 21, 49), between(r, 21, 49)],
    valid: ([a = 0, b = 0]) => a !== b && ones(a) > 1 && ones(b) > 1,
    solve: ([a = 0, b = 0]) => a * b,
    ref: ([a = 0, b = 0]) => b * a,
    traps: [["perimeter", "conceptual", ([a = 0, b = 0]) => 2 * (a + b)]],
  }),
  a7({
    id: "A7.by-two-digit.07",
    form: "multiplying-by-99-with-a-hundred",
    groups: [7, 8],
    origin: { extension: "rounding trick for a factor near 100 (RES-4283)" },
    draw: (r) => [between(r, 12, 60)],
    solve: ([a = 0]) => 99 * a,
    ref: ([a = 0]) => 100 * a - a,
    traps: [["hundred-only", "conceptual", ([a = 0]) => 100 * a]],
    consts: [100, 99],
  }),
  a7({
    id: "A7.by-two-digit.08",
    form: "multiplying-by-11",
    groups: [7, 8],
    origin: { extension: "multiplying by 11, Russian grade 5 (RES-4283)" },
    draw: (r) => [between(r, 12, 89)],
    valid: ([a = 0]) => ones(a) > 0,
    solve: ([a = 0]) => 11 * a,
    ref: ([a = 0]) => 10 * a + a,
    traps: [["ten-only", "conceptual", ([a = 0]) => 10 * a]],
    consts: [11, 10],
  }),
  a7({
    id: "A7.by-two-digit.09",
    form: "multiplying-by-25-through-a-quarter-of-a-hundred",
    groups: [7, 8],
    origin: { extension: "multiplying by 25 through 100 and 4 (RES-4283)" },
    draw: (r) => [between(r, 3, 24)],
    solve: ([q = 0]) => 100 * q,
    ref: ([q = 0]) => 25 * (4 * q),
    traps: [["quarter-lost", "procedural", ([q = 0]) => 25 * q]],
    extra: ([q = 0]) => ({ n: String(4 * q) }),
    consts: [25, 4, 100],
  }),
  a7({
    id: "A7.by-two-digit.10",
    form: "a-missing-two-digit-factor",
    groups: [7, 7],
    draw: (r) => [between(r, 12, 39), between(r, 12, 39)],
    valid: ([a = 0, b = 0]) => a !== b && ones(a) > 1 && ones(b) > 1,
    solve: ([a = 0]) => a,
    ref: ([a = 0, b = 0]) => (a * b) / b,
    traps: [
      ["product-minus-factor", "procedural", ([a = 0, b = 0]) => a * b - b],
    ],
    extra: ([a = 0, b = 0]) => ({ p: String(a * b) }),
  }),
  a7({
    id: "A7.by-two-digit.11",
    form: "doubling-one-factor-and-halving-the-other",
    groups: [7, 8],
    origin: { extension: "doubling and halving, Russian grade 5 (RES-4283)" },
    draw: (r) => [between(r, 12, 49), 2 * between(r, 5, 18)],
    valid: ([a = 0, b = 0]) => ones(a) > 1 && a !== b,
    solve: ([a = 0, b = 0]) => a * b,
    ref: ([a = 0, b = 0]) => 2 * a * (b / 2),
    traps: [["halved-only", "procedural", ([a = 0, b = 0]) => a * (b / 2)]],
    extra: ([a = 0, b = 0]) => ({ da: String(2 * a), hb: String(b / 2) }),
    consts: [2],
  }),
];

const a8 = forSubtype("A8", "remainder");
const withRemainder = (d: number, q: number, r: number): number => d * q + r;
const remainder = [
  a8({
    id: "A8.remainder.01",
    form: "a-quotient-and-a-remainder-with-small-numbers",
    groups: [5, 5],
    draw: (r) => [between(r, 3, 9), between(r, 3, 9), between(r, 1, 8)],
    valid: ([d = 0, q = 0, rem = 0]) => rem < d && q !== d,
    solve: ([, q = 0, rem = 0]) => [q, rem],
    ref: ([d = 0, q = 0, rem = 0]) => {
      const n = withRemainder(d, q, rem);
      let k = 0;
      while ((k + 1) * d <= n) k += 1;
      return [k, n - k * d];
    },
    traps: [
      [
        "remainder-from-divisor",
        "procedural",
        ([d = 0, q = 0, rem = 0]) => [q, d - rem],
      ],
    ],
    extra: ([d = 0, q = 0, rem = 0]) => ({
      n: String(withRemainder(d, q, rem)),
    }),
  }),
  a8({
    id: "A8.remainder.02",
    form: "a-quotient-and-a-remainder-of-a-three-digit-number",
    groups: [5, 6],
    draw: (r) => [between(r, 101, 999), between(r, 3, 9)],
    valid: ([n = 0, d = 0]) => n % d !== 0 && Math.floor(n / d) !== n % d,
    solve: ([n = 0, d = 0]) => [Math.floor(n / d), n % d],
    ref: ([n = 0, d = 0]) => {
      let m = n;
      let k = 0;
      while (m >= d) {
        m -= d;
        k += 1;
      }
      return [k, m];
    },
    traps: [
      [
        "rounded-up",
        "procedural",
        ([n = 0, d = 0]) => [Math.floor(n / d) + 1, d - (n % d)],
      ],
    ],
  }),
  a8({
    id: "A8.remainder.03",
    form: "full-boxes-and-what-is-left",
    groups: [5, 6],
    draw: (r) => [between(r, 31, 98), between(r, 4, 9)],
    valid: ([n = 0, d = 0]) => n % d !== 0 && Math.floor(n / d) !== n % d,
    solve: ([n = 0, d = 0]) => [Math.floor(n / d), n % d],
    ref: ([n = 0, d = 0]) => [(n - (n % d)) / d, n - d * Math.floor(n / d)],
    traps: [
      ["swapped", "conceptual", ([n = 0, d = 0]) => [n % d, Math.floor(n / d)]],
    ],
  }),
  a8({
    id: "A8.remainder.04",
    form: "the-remainder-only",
    groups: [5, 5],
    draw: (r) => [between(r, 20, 99), between(r, 3, 9)],
    valid: ([n = 0, d = 0]) => n % d !== 0 && Math.floor(n / d) !== n % d,
    solve: ([n = 0, d = 0]) => n % d,
    ref: ([n = 0, d = 0]) => n - d * Math.floor(n / d),
    traps: [["quotient", "conceptual", ([n = 0, d = 0]) => Math.floor(n / d)]],
  }),
  a8({
    id: "A8.remainder.05",
    form: "the-whole-quotient-only",
    groups: [5, 5],
    draw: (r) => [between(r, 20, 99), between(r, 3, 9)],
    valid: ([n = 0, d = 0]) => n % d !== 0 && Math.floor(n / d) !== n % d,
    solve: ([n = 0, d = 0]) => Math.floor(n / d),
    ref: ([n = 0, d = 0]) => (n - (n % d)) / d,
    traps: [["remainder", "conceptual", ([n = 0, d = 0]) => n % d]],
  }),
  a8({
    id: "A8.remainder.06",
    form: "how-many-are-needed-so-that-all-fit",
    groups: [5, 6],
    draw: (r) => [between(r, 31, 98), between(r, 4, 9)],
    valid: ([n = 0, d = 0]) => n % d !== 0,
    solve: ([n = 0, d = 0]) => Math.floor(n / d) + 1,
    ref: ([n = 0, d = 0]) => Math.ceil(n / d),
    traps: [
      ["whole-only", "conceptual", ([n = 0, d = 0]) => Math.floor(n / d)],
    ],
  }),
  a8({
    id: "A8.remainder.07",
    form: "the-largest-possible-remainder",
    groups: [5, 6],
    draw: (r) => [between(r, 4, 12)],
    solve: ([d = 0]) => d - 1,
    ref: ([d = 0]) =>
      Array.from({ length: 4 * d }, (_, n) => n % d).reduce(
        (m, x) => Math.max(m, x),
        0,
      ),
    traps: [["divisor-itself", "conceptual", ([d = 0]) => d]],
    consts: [1],
  }),
  a8({
    id: "A8.remainder.08",
    form: "the-number-from-a-quotient-and-a-remainder",
    groups: [5, 6],
    draw: (r) => [between(r, 4, 9), between(r, 3, 9), between(r, 1, 3)],
    valid: ([d = 0, q = 0, rem = 0]) => rem < d && d !== q,
    solve: ([d = 0, q = 0, rem = 0]) => d * q + rem,
    ref: ([d = 0, q = 0, rem = 0]) => sum(q, d) + rem,
    traps: [["remainder-forgotten", "procedural", ([d = 0, q = 0]) => d * q]],
  }),
  a8({
    id: "A8.remainder.09",
    form: "the-remainder-on-division-by-ten",
    groups: [5, 6],
    draw: (r) => [between(r, 123, 987)],
    valid: ([n = 0]) => ones(n) !== tens(n) && ones(n) > 0,
    solve: ([n = 0]) => n % 10,
    ref: ([n = 0]) => Number(String(n).slice(-1)),
    traps: [["tens-digit", "conceptual", ([n = 0]) => tens(n)]],
    consts: [10],
  }),
  a8({
    id: "A8.remainder.10",
    form: "which-day-of-the-week-after-many-days",
    groups: [5, 6],
    origin: {
      olympiad: "cyclic remainders in a calendar, Kangaroo style (RES-4283)",
    },
    draw: (r) => [between(r, 1, 7), between(r, 20, 80)],
    valid: ([a = 0, b = 0]) => b % 7 !== 0 && ((a - 1 + b) % 7) + 1 !== b % 7,
    solve: ([a = 0, b = 0]) => ((a - 1 + b) % 7) + 1,
    ref: ([a = 0, b = 0]) => {
      let day = a;
      for (let i = 0; i < b; i += 1) day = day === 7 ? 1 : day + 1;
      return day;
    },
    traps: [["start-forgotten", "procedural", ([, b = 0]) => b % 7]],
    consts: [1, 7],
  }),
  a8({
    id: "A8.remainder.11",
    form: "the-smallest-number-above-a-bound-with-a-given-remainder",
    groups: [6, 6],
    origin: {
      olympiad: "numbers with a given remainder, Kangaroo style (RES-4283)",
    },
    draw: (r) => [between(r, 20, 80), between(r, 4, 9), between(r, 1, 3)],
    valid: ([n = 0, d = 0, rem = 0]) => rem < d && n - (n % d) + rem !== n + 1,
    solve: ([n = 0, d = 0, rem = 0]) => {
      let m = n + 1;
      while (m % d !== rem) m += 1;
      return m;
    },
    ref: ([n = 0, d = 0, rem = 0]) =>
      n - (n % d) + rem > n ? n - (n % d) + rem : n - (n % d) + rem + d,
    traps: [
      [
        "same-block",
        "procedural",
        ([n = 0, d = 0, rem = 0]) =>
          n - (n % d) + rem > n ? null : n - (n % d) + rem,
      ],
    ],
  }),
];

const a9 = forSubtype("A9", "long-one-digit");
const longOne = [
  a9({
    id: "A9.long-one-digit.01",
    form: "an-exact-two-digit-quotient",
    groups: [6, 6],
    draw: (r) => [between(r, 3, 9), between(r, 12, 49)],
    valid: ([d = 0, q = 0]) => d !== q && ones(q) > 0,
    solve: ([, q = 0]) => q,
    ref: ([d = 0, q = 0]) => (d * q) / d,
    traps: [["subtracted", "procedural", ([d = 0, q = 0]) => d * q - d]],
    extra: ([d = 0, q = 0]) => ({ n: String(d * q) }),
  }),
  a9({
    id: "A9.long-one-digit.02",
    form: "an-exact-three-digit-dividend",
    groups: [6, 6],
    draw: (r) => [between(r, 3, 9), between(r, 31, 129)],
    valid: ([d = 0, q = 0]) => d * q >= 100 && ones(q) > 0 && d !== q,
    solve: ([, q = 0]) => q,
    ref: ([d = 0, q = 0]) =>
      Array.from({ length: 140 }, (_, x) => x).find((x) => x * d === d * q) ??
      -1,
    traps: [["subtracted", "procedural", ([d = 0, q = 0]) => d * q - d]],
    extra: ([d = 0, q = 0]) => ({ n: String(d * q) }),
  }),
  a9({
    id: "A9.long-one-digit.03",
    form: "a-quotient-with-a-zero-inside",
    groups: [6, 6],
    draw: (r) => [between(r, 3, 9), between(r, 1, 9), between(r, 1, 9)],
    valid: ([d = 0, x = 0, y = 0]) => d * (100 * x + y) < 1000,
    solve: ([, x = 0, y = 0]) => 100 * x + y,
    ref: ([d = 0, x = 0, y = 0]) => (d * (100 * x + y)) / d,
    traps: [["zero-dropped", "procedural", ([, x = 0, y = 0]) => 10 * x + y]],
    extra: ([d = 0, x = 0, y = 0]) => ({ n: String(d * (100 * x + y)) }),
  }),
  a9({
    id: "A9.long-one-digit.04",
    form: "a-three-digit-quotient-with-a-remainder",
    groups: [6, 6],
    draw: (r) => [between(r, 101, 999), between(r, 3, 9)],
    valid: ([n = 0, d = 0]) =>
      n % d !== 0 && Math.floor(n / d) !== n % d && Math.floor(n / d) >= 10,
    solve: ([n = 0, d = 0]) => [Math.floor(n / d), n % d],
    ref: ([n = 0, d = 0]) => {
      let m = n;
      let k = 0;
      while (m >= d) {
        m -= d;
        k += 1;
      }
      return [k, m];
    },
    traps: [
      [
        "rounded-up",
        "procedural",
        ([n = 0, d = 0]) => [Math.floor(n / d) + 1, d - (n % d)],
      ],
    ],
  }),
  a9({
    id: "A9.long-one-digit.05",
    form: "sharing-money-equally",
    groups: [6, 6],
    draw: (r) => [between(r, 3, 9), between(r, 21, 99)],
    valid: ([d = 0, q = 0]) => d !== q && ones(q) > 0,
    solve: ([, q = 0]) => q,
    ref: ([d = 0, q = 0]) => sum(d, q) / d,
    traps: [["subtracted", "procedural", ([d = 0, q = 0]) => d * q - d]],
    extra: ([d = 0, q = 0]) => ({ n: String(d * q) }),
  }),
  a9({
    id: "A9.long-one-digit.06",
    form: "the-whole-part-of-a-quotient",
    groups: [6, 6],
    draw: (r) => [between(r, 101, 999), between(r, 3, 9)],
    valid: ([n = 0, d = 0]) => n % d !== 0 && Math.floor(n / d) >= 10,
    solve: ([n = 0, d = 0]) => Math.floor(n / d),
    ref: ([n = 0, d = 0]) => (n - (n % d)) / d,
    traps: [
      ["rounded-up", "procedural", ([n = 0, d = 0]) => Math.floor(n / d) + 1],
    ],
  }),
  a9({
    id: "A9.long-one-digit.07",
    form: "the-dividend-from-a-quotient",
    groups: [6, 6],
    draw: (r) => [between(r, 12, 99), between(r, 3, 9)],
    valid: ([q = 0, d = 0]) => ones(q) > 0 && q !== d,
    solve: ([q = 0, d = 0]) => q * d,
    ref: ([q = 0, d = 0]) => sum(d, q),
    traps: [["added", "procedural", ([q = 0, d = 0]) => q + d]],
  }),
  a9({
    id: "A9.long-one-digit.08",
    form: "a-missing-one-digit-divisor",
    groups: [6, 6],
    draw: (r) => [between(r, 3, 9), between(r, 31, 129)],
    valid: ([d = 0, q = 0]) => d * q >= 100 && d !== q,
    solve: ([d = 0]) => d,
    ref: ([d = 0, q = 0]) =>
      Array.from({ length: 10 }, (_, x) => x).find((x) => x * q === d * q) ??
      -1,
    traps: [["quotient", "conceptual", ([, q = 0]) => q]],
    extra: ([d = 0, q = 0]) => ({ n: String(d * q) }),
  }),
  a9({
    id: "A9.long-one-digit.09",
    form: "how-many-digits-the-quotient-has",
    groups: [6, 6],
    draw: (r) => [between(r, 3, 9), between(r, 12, 199)],
    valid: ([d = 0, q = 0]) => d * q >= 100 && d * q <= 999,
    solve: ([, q = 0]) => countDigits(q),
    ref: ([, q = 0]) => Math.floor(Math.log10(q)) + 1,
    traps: [
      ["dividend-digits", "conceptual", ([d = 0, q = 0]) => countDigits(d * q)],
    ],
    extra: ([d = 0, q = 0]) => ({ n: String(d * q) }),
  }),
  a9({
    id: "A9.long-one-digit.10",
    form: "a-sum-shared-equally",
    groups: [6, 6],
    draw: (r) => [between(r, 21, 99), between(r, 21, 99), between(r, 3, 9)],
    valid: ([a = 0, b = 0, d = 0]) => (a + b) % d === 0 && (a + b) / d >= 10,
    solve: ([a = 0, b = 0, d = 0]) => (a + b) / d,
    ref: ([a = 0, b = 0, d = 0]) =>
      Array.from({ length: 200 }, (_, x) => x).find((x) => x * d === a + b) ??
      -1,
    traps: [["not-divided", "procedural", ([a = 0, b = 0]) => a + b]],
    extra: ([a = 0, b = 0]) => ({ s: String(a + b) }),
  }),
  a9({
    id: "A9.long-one-digit.11",
    form: "halving-twice",
    groups: [6, 6],
    draw: (r) => [4 * between(r, 12, 99)],
    solve: ([n = 0]) => n / 4,
    ref: ([n = 0]) => n / 2 / 2,
    traps: [["halved-once", "procedural", ([n = 0]) => n / 2]],
    consts: [2],
  }),
];

const a10 = forSubtype("A10", "by-two-digit-div");
const longTwo = [
  a10({
    id: "A10.by-two-digit-div.01",
    form: "an-exact-division-by-a-two-digit-number",
    groups: [7, 7],
    draw: (r) => [between(r, 11, 35), between(r, 3, 19)],
    valid: ([d = 0, q = 0]) => d * q >= 100 && d * q <= 999 && d !== q,
    solve: ([, q = 0]) => q,
    ref: ([d = 0, q = 0]) => (d * q) / d,
    traps: [["subtracted", "procedural", ([d = 0, q = 0]) => d * q - d]],
    extra: ([d = 0, q = 0]) => ({ n: String(d * q) }),
  }),
  a10({
    id: "A10.by-two-digit-div.02",
    form: "a-division-by-a-two-digit-number-with-a-remainder",
    groups: [7, 7],
    draw: (r) => [between(r, 100, 999), between(r, 11, 60)],
    valid: ([n = 0, d = 0]) =>
      n % d !== 0 && Math.floor(n / d) !== n % d && Math.floor(n / d) >= 2,
    solve: ([n = 0, d = 0]) => [Math.floor(n / d), n % d],
    ref: ([n = 0, d = 0]) => {
      let m = n;
      let k = 0;
      while (m >= d) {
        m -= d;
        k += 1;
      }
      return [k, m];
    },
    traps: [
      [
        "rounded-up",
        "procedural",
        ([n = 0, d = 0]) => [Math.floor(n / d) + 1, d - (n % d)],
      ],
    ],
  }),
  a10({
    id: "A10.by-two-digit-div.03",
    form: "the-whole-part-of-a-quotient-by-two-digits",
    groups: [7, 7],
    draw: (r) => [between(r, 100, 999), between(r, 11, 60)],
    valid: ([n = 0, d = 0]) => n % d !== 0 && Math.floor(n / d) >= 2,
    solve: ([n = 0, d = 0]) => Math.floor(n / d),
    ref: ([n = 0, d = 0]) => (n - (n % d)) / d,
    traps: [
      ["rounded-up", "procedural", ([n = 0, d = 0]) => Math.floor(n / d) + 1],
    ],
  }),
  a10({
    id: "A10.by-two-digit-div.04",
    form: "the-remainder-of-a-division-by-two-digits",
    groups: [7, 7],
    draw: (r) => [between(r, 100, 999), between(r, 11, 60)],
    valid: ([n = 0, d = 0]) => n % d !== 0 && Math.floor(n / d) !== n % d,
    solve: ([n = 0, d = 0]) => n % d,
    ref: ([n = 0, d = 0]) => n - d * Math.floor(n / d),
    traps: [["quotient", "conceptual", ([n = 0, d = 0]) => Math.floor(n / d)]],
  }),
  a10({
    id: "A10.by-two-digit-div.05",
    form: "how-many-trips-are-needed",
    groups: [7, 8],
    draw: (r) => [between(r, 100, 500), between(r, 12, 45)],
    valid: ([n = 0, d = 0]) => n % d !== 0,
    solve: ([n = 0, d = 0]) => Math.floor(n / d) + 1,
    ref: ([n = 0, d = 0]) => Math.ceil(n / d),
    traps: [
      ["whole-only", "conceptual", ([n = 0, d = 0]) => Math.floor(n / d)],
    ],
  }),
  a10({
    id: "A10.by-two-digit-div.06",
    form: "the-dividend-from-a-quotient-and-a-remainder",
    groups: [7, 8],
    draw: (r) => [between(r, 12, 35), between(r, 5, 25), between(r, 1, 9)],
    valid: ([d = 0, q = 0, rem = 0]) =>
      rem < d && d * q + rem <= 999 && d !== q,
    solve: ([d = 0, q = 0, rem = 0]) => d * q + rem,
    ref: ([d = 0, q = 0, rem = 0]) => sum(q, d) + rem,
    traps: [["remainder-forgotten", "procedural", ([d = 0, q = 0]) => d * q]],
  }),
  a10({
    id: "A10.by-two-digit-div.07",
    form: "how-many-times-a-size-fits-in-a-total",
    groups: [7, 7],
    draw: (r) => [between(r, 200, 900), between(r, 12, 48)],
    valid: ([n = 0, d = 0]) => n % d !== 0,
    solve: ([n = 0, d = 0]) => Math.floor(n / d),
    ref: ([n = 0, d = 0]) => {
      let m = n;
      let k = 0;
      while (m >= d) {
        m -= d;
        k += 1;
      }
      return k;
    },
    traps: [
      ["rounded-up", "procedural", ([n = 0, d = 0]) => Math.floor(n / d) + 1],
    ],
  }),
  a10({
    id: "A10.by-two-digit-div.08",
    form: "a-missing-two-digit-divisor",
    groups: [7, 7],
    draw: (r) => [between(r, 12, 35), between(r, 5, 19)],
    valid: ([d = 0, q = 0]) => d * q >= 100 && d * q <= 999 && d !== q,
    solve: ([d = 0]) => d,
    ref: ([d = 0, q = 0]) =>
      Array.from({ length: 100 }, (_, x) => x).find((x) => x * q === d * q) ??
      -1,
    traps: [["quotient", "conceptual", ([, q = 0]) => q]],
    extra: ([d = 0, q = 0]) => ({ n: String(d * q) }),
  }),
  a10({
    id: "A10.by-two-digit-div.09",
    form: "a-quotient-plus-a-number",
    groups: [7, 8],
    draw: (r) => [between(r, 12, 35), between(r, 5, 19), between(r, 12, 50)],
    valid: ([d = 0, q = 0]) => d * q >= 100 && d * q <= 999 && d !== q,
    solve: ([, q = 0, k = 0]) => q + k,
    ref: ([d = 0, q = 0, k = 0]) => (d * q) / d + k,
    traps: [
      ["not-divided", "procedural", ([d = 0, q = 0, k = 0]) => d * q + k],
    ],
    extra: ([d = 0, q = 0]) => ({ n: String(d * q) }),
  }),
  a10({
    id: "A10.by-two-digit-div.10",
    form: "minutes-in-full-hours-and-the-rest",
    groups: [7, 8],
    draw: (r) => [between(r, 130, 599)],
    valid: ([n = 0]) => n % 60 !== 0 && Math.floor(n / 60) !== n % 60,
    solve: ([n = 0]) => [Math.floor(n / 60), n % 60],
    ref: ([n = 0]) => {
      let m = n;
      let h = 0;
      while (m >= 60) {
        m -= 60;
        h += 1;
      }
      return [h, m];
    },
    traps: [
      [
        "rounded-up",
        "procedural",
        ([n = 0]) => [Math.floor(n / 60) + 1, 60 - (n % 60)],
      ],
    ],
    consts: [60],
  }),
  a10({
    id: "A10.by-two-digit-div.11",
    form: "dividing-by-25",
    groups: [7, 8],
    origin: { extension: "dividing by 25 through 100 and 4 (RES-4283)" },
    draw: (r) => [between(r, 4, 39)],
    solve: ([q = 0]) => q,
    ref: ([q = 0]) => (25 * q) / 25,
    traps: [["quartered", "procedural", ([q = 0]) => 4 * q]],
    extra: ([q = 0]) => ({ n: String(25 * q) }),
    consts: [25],
  }),
];

const a11 = forSubtype("A11", "order-brackets");
const brackets = [
  a11({
    id: "A11.order-brackets.01",
    form: "a-product-added-to-a-number",
    groups: [6, 6],
    draw: (r) => [between(r, 5, 40), between(r, 2, 9), between(r, 2, 9)],
    valid: ([a = 0, b = 0, c = 0]) => (a + b) * c !== a + b * c,
    solve: ([a = 0, b = 0, c = 0]) => a + b * c,
    ref: ([a = 0, b = 0, c = 0]) => sum(c, b) + a,
    traps: [
      ["left-to-right", "procedural", ([a = 0, b = 0, c = 0]) => (a + b) * c],
    ],
    extra: ([, b = 0, c = 0]) => ({ m: String(b * c) }),
  }),
  a11({
    id: "A11.order-brackets.02",
    form: "a-sum-in-brackets-times-a-number",
    groups: [6, 6],
    draw: (r) => [between(r, 5, 40), between(r, 2, 9), between(r, 2, 9)],
    valid: ([a = 0, b = 0, c = 0]) => (a + b) * c !== a + b * c,
    solve: ([a = 0, b = 0, c = 0]) => (a + b) * c,
    ref: ([a = 0, b = 0, c = 0]) => a * c + b * c,
    traps: [
      ["brackets-ignored", "procedural", ([a = 0, b = 0, c = 0]) => a + b * c],
    ],
    extra: ([a = 0, b = 0]) => ({ s: String(a + b) }),
  }),
  a11({
    id: "A11.order-brackets.03",
    form: "a-subtraction-and-an-addition-from-left-to-right",
    groups: [6, 6],
    draw: (r) => [between(r, 30, 90), between(r, 5, 25), between(r, 5, 25)],
    valid: ([a = 0, b = 0, c = 0]) => b !== c && a - b + c !== a - (b + c),
    solve: ([a = 0, b = 0, c = 0]) => a - b + c,
    ref: ([a = 0, b = 0, c = 0]) => a + c - b,
    traps: [
      ["addition-first", "procedural", ([a = 0, b = 0, c = 0]) => a - (b + c)],
    ],
  }),
  a11({
    id: "A11.order-brackets.04",
    form: "a-division-then-a-multiplication",
    groups: [6, 6],
    draw: (r) => [
      pick(r, [2, 3, 4, 5, 6]),
      pick(r, [2, 3, 4, 5, 6]),
      between(r, 2, 9),
    ],
    valid: ([b = 0, q = 0, c = 0]) => b !== q && b * q * c !== 0 && q !== c,
    solve: ([, q = 0, c = 0]) => q * c,
    ref: ([b = 0, q = 0, c = 0]) => ((b * q) / b) * c,
    traps: [["multiplication-forgotten", "procedural", ([, q = 0]) => q]],
    extra: ([b = 0, q = 0]) => ({ n: String(b * q) }),
  }),
  a11({
    id: "A11.order-brackets.05",
    form: "a-number-plus-a-quotient",
    groups: [6, 6],
    draw: (r) => [between(r, 5, 40), between(r, 2, 9), between(r, 2, 9)],
    valid: ([, b = 0, q = 0]) => b !== q,
    solve: ([a = 0, , q = 0]) => a + q,
    ref: ([a = 0, b = 0, q = 0]) => a + (b * q) / b,
    traps: [
      [
        "division-forgotten",
        "procedural",
        ([a = 0, b = 0, q = 0]) => a + b * q,
      ],
    ],
    extra: ([, b = 0, q = 0]) => ({ n: String(b * q) }),
  }),
  a11({
    id: "A11.order-brackets.06",
    form: "two-bracketed-parts-multiplied",
    groups: [6, 7],
    draw: (r) => [
      between(r, 2, 9),
      between(r, 2, 9),
      between(r, 10, 19),
      between(r, 2, 9),
    ],
    valid: ([a = 0, b = 0, c = 0, d = 0]) => c - d > 1 && a !== b,
    solve: ([a = 0, b = 0, c = 0, d = 0]) => (a + b) * (c - d),
    ref: ([a = 0, b = 0, c = 0, d = 0]) => sum(c - d, a + b),
    traps: [
      [
        "first-bracket-only",
        "procedural",
        ([a = 0, b = 0, c = 0]) => (a + b) * c,
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => ({
      s: String(a + b),
      t: String(c - d),
    }),
  }),
  a11({
    id: "A11.order-brackets.07",
    form: "nested-brackets",
    groups: [6, 7],
    draw: (r) => [
      between(r, 5, 20),
      between(r, 10, 30),
      between(r, 2, 9),
      between(r, 2, 6),
    ],
    valid: ([, b = 0, c = 0, d = 0]) => b > c && d > 1,
    solve: ([a = 0, b = 0, c = 0, d = 0]) => (a + (b - c)) * d,
    ref: ([a = 0, b = 0, c = 0, d = 0]) => (a + b - c) * d,
    traps: [
      [
        "inner-bracket-ignored",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => (a + b) * d - c,
      ],
    ],
    extra: ([a = 0, b = 0, c = 0]) => ({
      i: String(b - c),
      o: String(a + (b - c)),
    }),
  }),
  a11({
    id: "A11.order-brackets.08",
    form: "the-difference-between-two-placements-of-brackets",
    groups: [6, 7],
    draw: (r) => [between(r, 2, 9), between(r, 2, 9), between(r, 3, 9)],
    valid: ([a = 0, b = 0, c = 0]) => a * (c - 1) !== 0 && a !== b,
    solve: ([a = 0, b = 0, c = 0]) => (a + b) * c - (a + b * c),
    ref: ([a = 0, , c = 0]) => a * (c - 1),
    traps: [["brackets-ignored", "conceptual", () => 0]],
    extra: ([a = 0, b = 0, c = 0]) => ({
      x: String((a + b) * c),
      y: String(a + b * c),
    }),
    consts: [0],
  }),
  a11({
    id: "A11.order-brackets.09",
    form: "a-difference-of-two-products",
    groups: [6, 6],
    draw: (r) => [
      between(r, 4, 9),
      between(r, 4, 9),
      between(r, 2, 6),
      between(r, 2, 6),
    ],
    valid: ([a = 0, b = 0, c = 0, d = 0]) =>
      a * b > c * d && a !== b && c !== d,
    solve: ([a = 0, b = 0, c = 0, d = 0]) => a * b - c * d,
    ref: ([a = 0, b = 0, c = 0, d = 0]) => sum(a, b) - sum(c, d),
    traps: [
      [
        "left-to-right",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => (a * b - c) * d,
      ],
    ],
  }),
  a11({
    id: "A11.order-brackets.10",
    form: "a-word-problem-with-two-purchases",
    groups: [6, 6],
    draw: (r) => [
      between(r, 3, 9),
      between(r, 5, 15),
      between(r, 3, 9),
      between(r, 5, 15),
    ],
    valid: ([a = 0, b = 0, c = 0, d = 0]) => a !== c && b !== d,
    solve: ([a = 0, b = 0, c = 0, d = 0]) => a * b + c * d,
    ref: ([a = 0, b = 0, c = 0, d = 0]) => sum(a, b) + sum(c, d),
    traps: [
      [
        "counts-added-first",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => (a + c) * (b + d),
      ],
    ],
  }),
  a11({
    id: "A11.order-brackets.11",
    form: "a-subtraction-of-a-bracketed-difference",
    groups: [6, 6],
    draw: (r) => [between(r, 40, 90), between(r, 20, 39), between(r, 5, 19)],
    valid: ([, b = 0, c = 0]) => b > c && c > 1,
    solve: ([a = 0, b = 0, c = 0]) => a - (b - c),
    ref: ([a = 0, b = 0, c = 0]) => a - b + c,
    traps: [
      ["brackets-ignored", "procedural", ([a = 0, b = 0, c = 0]) => a - b - c],
    ],
    extra: ([, b = 0, c = 0]) => ({ i: String(b - c) }),
  }),
];

const au = forSubtype("A11", "unknown");
const unknown = [
  au({
    id: "A11.unknown.01",
    form: "a-missing-addend-in-an-equation",
    groups: [6, 7],
    draw: (r) => [between(r, 11, 85), between(r, 40, 120)],
    valid: ([a = 0, b = 0]) => b > a + 3,
    solve: ([a = 0, b = 0]) => b - a,
    ref: ([a = 0, b = 0]) =>
      Array.from({ length: 200 }, (_, x) => x).find((x) => a + x === b) ?? -1,
    traps: [["added", "procedural", ([a = 0, b = 0]) => a + b]],
  }),
  au({
    id: "A11.unknown.02",
    form: "a-missing-subtrahend-in-an-equation",
    groups: [6, 7],
    draw: (r) => [between(r, 40, 120), between(r, 11, 39)],
    solve: ([a = 0, b = 0]) => a - b,
    ref: ([a = 0, b = 0]) =>
      Array.from({ length: 200 }, (_, x) => x).find((x) => a - x === b) ?? -1,
    traps: [["added", "procedural", ([a = 0, b = 0]) => a + b]],
  }),
  au({
    id: "A11.unknown.03",
    form: "a-missing-factor-in-an-equation",
    groups: [6, 7],
    draw: (r) => [between(r, 3, 9), between(r, 5, 19)],
    valid: ([a = 0, x = 0]) => a !== x,
    solve: ([, x = 0]) => x,
    ref: ([a = 0, x = 0]) => (a * x) / a,
    traps: [
      ["product-minus-factor", "procedural", ([a = 0, x = 0]) => a * x - a],
    ],
    extra: ([a = 0, x = 0]) => ({ c: String(a * x) }),
  }),
  au({
    id: "A11.unknown.04",
    form: "a-missing-dividend",
    groups: [6, 7],
    draw: (r) => [between(r, 3, 9), between(r, 5, 19)],
    valid: ([a = 0, q = 0]) => a !== q,
    solve: ([a = 0, q = 0]) => a * q,
    ref: ([a = 0, q = 0]) => sum(q, a),
    traps: [["added", "procedural", ([a = 0, q = 0]) => a + q]],
  }),
  au({
    id: "A11.unknown.05",
    form: "a-missing-divisor-in-an-equation",
    groups: [6, 7],
    draw: (r) => [between(r, 3, 9), between(r, 5, 19)],
    valid: ([d = 0, q = 0]) => d !== q,
    solve: ([d = 0]) => d,
    ref: ([d = 0, q = 0]) =>
      Array.from({ length: 12 }, (_, x) => x).find(
        (x) => x > 0 && (d * q) / x === q,
      ) ?? -1,
    traps: [["quotient", "conceptual", ([, q = 0]) => q]],
    extra: ([d = 0, q = 0]) => ({ n: String(d * q) }),
  }),
  au({
    id: "A11.unknown.06",
    form: "a-missing-minuend",
    groups: [6, 7],
    draw: (r) => [between(r, 11, 59), between(r, 11, 59)],
    valid: ([a = 0, b = 0]) => a !== b,
    solve: ([a = 0, b = 0]) => a + b,
    ref: ([a = 0, b = 0]) => b + a,
    traps: [["subtracted", "procedural", ([a = 0, b = 0]) => Math.abs(a - b)]],
  }),
  au({
    id: "A11.unknown.07",
    form: "a-thought-of-number-after-adding",
    groups: [6, 7],
    draw: (r) => [between(r, 11, 49), between(r, 52, 99)],
    solve: ([a = 0, b = 0]) => b - a,
    ref: ([a = 0, b = 0]) =>
      Array.from({ length: 150 }, (_, x) => x).find((x) => x + a === b) ?? -1,
    traps: [["added", "procedural", ([a = 0, b = 0]) => a + b]],
  }),
  au({
    id: "A11.unknown.08",
    form: "the-same-unknown-twice",
    groups: [6, 7],
    draw: (r) => [between(r, 3, 29), between(r, 5, 25)],
    solve: ([, x = 0]) => x,
    ref: ([a = 0, x = 0]) => (2 * x + a - a) / 2,
    traps: [["halved-forgotten", "procedural", ([, x = 0]) => 2 * x]],
    extra: ([a = 0, x = 0]) => ({ c: String(2 * x + a) }),
    consts: [2],
  }),
  au({
    id: "A11.unknown.09",
    form: "an-unknown-on-one-side-and-two-numbers-on-the-other",
    groups: [6, 7],
    draw: (r) => [between(r, 11, 39), between(r, 22, 60), between(r, 11, 29)],
    valid: ([a = 0, b = 0, c = 0]) => b + c > a + 2,
    solve: ([a = 0, b = 0, c = 0]) => b + c - a,
    ref: ([a = 0, b = 0, c = 0]) =>
      Array.from({ length: 200 }, (_, x) => x).find((x) => x + a === b + c) ??
      -1,
    traps: [["wrong-side", "procedural", ([a = 0, b = 0, c = 0]) => a + b + c]],
  }),
  au({
    id: "A11.unknown.10",
    form: "an-unknown-product-equal-to-a-sum",
    groups: [6, 7],
    draw: (r) => [between(r, 3, 9), between(r, 5, 12), between(r, 5, 15)],
    valid: ([a = 0, b = 0, c = 0]) => (b + c) % a === 0 && (b + c) / a !== a,
    solve: ([a = 0, b = 0, c = 0]) => (b + c) / a,
    ref: ([a = 0, b = 0, c = 0]) =>
      Array.from({ length: 60 }, (_, x) => x).find((x) => a * x === b + c) ??
      -1,
    traps: [["not-divided", "procedural", ([, b = 0, c = 0]) => b + c]],
  }),
  au({
    id: "A11.unknown.11",
    form: "an-unknown-in-a-difference-equal-to-a-difference",
    groups: [6, 7],
    draw: (r) => [between(r, 11, 30), between(r, 40, 80), between(r, 11, 39)],
    valid: ([a = 0, b = 0, c = 0]) => b - c > 1 && a + (b - c) !== b + c,
    solve: ([a = 0, b = 0, c = 0]) => a + b - c,
    ref: ([a = 0, b = 0, c = 0]) =>
      Array.from({ length: 200 }, (_, x) => x).find((x) => x - a === b - c) ??
      -1,
    traps: [["wrong-sign", "procedural", ([a = 0, b = 0, c = 0]) => b - c - a]],
  }),
];

export const aSpecs3: readonly Spec<never>[] = [
  ...byTwo,
  ...remainder,
  ...longOne,
  ...longTwo,
  ...brackets,
  ...unknown,
];
