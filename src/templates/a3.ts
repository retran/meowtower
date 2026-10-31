// Domain A, part 3: multiplying by two digits, remainders, dividing by one and two digits, the order of
// operations and unknown numbers (RES-4283). The Dutch goals multiply two digits by two digits at group
// 7, divide by one digit with a remainder at group 6 and by two digits at group 7. Texts are plain
// blanks in `content/tasks-a.ru.json`, keyed by the template id.
import { between, pick } from "./draw.js";
import { FOUR, forChoice, forSubtype, placeOf, turn } from "./a1.js";
import type { Spec } from "./spec.js";

const sum = (n: number, x: number): number =>
  Array.from({ length: n }, () => x).reduce((p, q) => p + q, 0);
const ones = (n: number): number => n % 10;
const tens = (n: number): number => Math.floor(n / 10) % 10;
const hundreds = (n: number): number => Math.floor(n / 100);
const countDigits = (n: number): number => String(n).length;
const nat = (x: number): number | null =>
  Number.isInteger(x) && x >= 0 ? x : null;
/** A wrong answer that is a whole number and differs from the other traps' answers. */
const apart = (x: number, ...others: number[]): number | null =>
  nat(x) !== null && !others.includes(x) ? x : null;
/** Every divisor of `n`, in order. */
const divisorsOf = (n: number): number[] =>
  Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
/** The smallest divisor of `n` that is larger than `bound`, or null. */
const smallestAbove = (n: number, bound: number): number | null =>
  divisorsOf(n).find((d) => d > bound) ?? null;
const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const flip = (n: number): number => Number([...String(n)].reverse().join(""));
/** Subtracting without borrowing: the smaller digit is taken from the larger one in the units. */
const noBorrow = (big: number, small: number): number | null => {
  const r =
    big - ones(big) - (small - ones(small)) + Math.abs(ones(big) - ones(small));
  return r === big - small ? null : nat(r);
};

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
      [
        "tens-not-shifted",
        "procedural",
        ([a = 0, b = 0]) => a * tens(b) + a * ones(b),
      ],
      [
        "parts-only",
        "procedural",
        ([a = 0, b = 0]) => 100 * tens(a) * tens(b) + ones(a) * ones(b),
      ],
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
    traps: [
      ["hundreds-lost", "procedural", ([d = 0, n = 0]) => d * (n % 100)],
      [
        "parts-not-shifted",
        "procedural",
        ([d = 0, n = 0]) => d * (hundreds(n) + tens(n) + ones(n)),
      ],
      [
        "tens-lost",
        "procedural",
        ([d = 0, n = 0]) => d * (100 * hundreds(n) + ones(n)),
      ],
    ],
  }),
  a7({
    id: "A7.by-two-digit.03",
    form: "two-digits-by-a-round-ten",
    groups: [7, 7],
    draw: (r) => [between(r, 12, 49), 10 * between(r, 2, 9)],
    valid: ([a = 0]) => ones(a) > 1,
    solve: ([a = 0, b = 0]) => a * b,
    ref: ([a = 0, b = 0]) => a * (b / 10) * 10,
    traps: [
      ["zero-dropped", "procedural", ([a = 0, b = 0]) => a * (b / 10)],
      ["zero-twice", "procedural", ([a = 0, b = 0]) => a * b * 10],
    ],
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
      ["tens-part-only", "procedural", ([a = 0, b = 0]) => a * 10 * tens(b)],
      [
        "tens-not-shifted",
        "procedural",
        ([a = 0, b = 0]) => a * tens(b) + a * ones(b),
      ],
    ],
  }),
  a7({
    id: "A7.by-two-digit.05",
    form: "the-price-of-many-items",
    groups: [7, 7],
    roles: { a: "price of one item", b: "count of items" },
    draw: (r) => [between(r, 12, 39), between(r, 21, 49)],
    valid: ([a = 0, b = 0]) => a !== b && ones(a) > 1 && ones(b) > 1,
    solve: ([a = 0, b = 0]) => a * b,
    ref: ([a = 0, b = 0]) => sum(a, b),
    traps: [
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
      [
        "tens-not-shifted",
        "procedural",
        ([a = 0, b = 0]) => a * tens(b) + a * ones(b),
      ],
      [
        "parts-only",
        "procedural",
        ([a = 0, b = 0]) => 100 * tens(a) * tens(b) + ones(a) * ones(b),
      ],
    ],
  }),
  a7({
    id: "A7.by-two-digit.06",
    form: "the-area-of-a-large-rectangle",
    groups: [7, 7],
    draw: (r) => [between(r, 21, 49), between(r, 21, 49)],
    valid: ([a = 0, b = 0]) => a !== b && ones(a) > 1 && ones(b) > 1,
    solve: ([a = 0, b = 0]) => a * b,
    ref: ([a = 0, b = 0]) => ((a + b) ** 2 - (a - b) ** 2) / 4,
    traps: [
      ["perimeter", "conceptual", ([a = 0, b = 0]) => 2 * (a + b)],
      [
        "tens-not-shifted",
        "procedural",
        ([a = 0, b = 0]) => a * tens(b) + a * ones(b),
      ],
      [
        "parts-only",
        "procedural",
        ([a = 0, b = 0]) => 100 * tens(a) * tens(b) + ones(a) * ones(b),
      ],
    ],
  }),
  a7({
    id: "A7.by-two-digit.07",
    form: "multiplying-by-99-with-a-hundred",
    groups: [7, 8],
    origin: { extension: "rounding trick for a factor near 100 (RES-4283)" },
    draw: (r) => [between(r, 12, 60)],
    solve: ([a = 0]) => 99 * a,
    ref: ([a = 0]) => 100 * a - a,
    traps: [
      ["hundred-only", "conceptual", ([a = 0]) => 100 * a],
      ["one-subtracted", "procedural", ([a = 0]) => 100 * a - 1],
      ["hundred-plus", "procedural", ([a = 0]) => 101 * a],
    ],
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
    traps: [
      ["ten-only", "conceptual", ([a = 0]) => 10 * a],
      ["one-added", "procedural", ([a = 0]) => 10 * a + 1],
      ["digits-repeated", "procedural", ([a = 0]) => Number(`${a}${a}`)],
    ],
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
    traps: [
      ["quarter-lost", "procedural", ([q = 0]) => 25 * q],
      ["hundred-times-n", "procedural", ([q = 0]) => 400 * q],
      ["only-divided", "procedural", ([q = 0]) => q],
    ],
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
    ref: ([a = 0, b = 0]) =>
      Array.from({ length: 60 }, (_, x) => x).find((x) => x * b === a * b) ??
      -1,
    traps: [
      ["product-minus-factor", "procedural", ([a = 0, b = 0]) => a * b - b],
      ["multiplied", "procedural", ([a = 0, b = 0]) => a * b * b],
      ["added", "procedural", ([a = 0, b = 0]) => a * b + b],
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
    ref: ([a = 0, b = 0]) => sum(b, a),
    traps: [
      ["halved-only", "procedural", ([a = 0, b = 0]) => a * (b / 2)],
      ["doubled-only", "procedural", ([a = 0, b = 0]) => 2 * a * b],
      ["both-doubled", "procedural", ([a = 0, b = 0]) => 4 * a * b],
    ],
    extra: ([a = 0, b = 0]) => ({ da: String(2 * a), hb: String(b / 2) }),
    consts: [2],
  }),
  a7({
    id: "A7.by-two-digit.12",
    form: "how-much-more-is-a-square-than-a-nearby-product",
    groups: [7, 8],
    origin: {
      olympiad:
        "a square against the product of its neighbours at equal distance (RES-4283, F14)",
    },
    draw: (r) => [
      pick(r, [15, 20, 25, 30, 35, 40, 45, 50, 60]),
      between(r, 2, 6),
    ],
    solve: ([c = 0, d = 0]) => c * c - (c - d) * (c + d),
    ref: ([, d = 0]) => sum(d, d),
    traps: [
      ["the-distance-itself", "conceptual", ([, d = 0]) => d],
      ["the-whole-difference-of-factors", "conceptual", ([, d = 0]) => 2 * d],
      [
        "the-sum-of-the-two-products",
        "procedural",
        ([c = 0, d = 0]) => apart(c * c + (c - d) * (c + d), d * d),
      ],
    ],
    extra: ([c = 0, d = 0]) => ({
      x: String(c - d),
      y: String(c + d),
      sq: String(c * c),
      pr: String((c - d) * (c + d)),
    }),
  }),
  a7({
    id: "A7.by-two-digit.13",
    form: "the-hidden-ones-digit-of-a-two-digit-factor",
    groups: [7, 7],
    origin: { olympiad: "a hidden digit in a product (RES-4283, F10)" },
    draw: (r) => [between(r, 12, 29), between(r, 2, 4), between(r, 1, 9)],
    valid: ([a = 0]) => ones(a) > 1,
    solve: ([, , o = 0]) => o,
    ref: ([a = 0, t = 0, o = 0]) =>
      Array.from({ length: 10 }, (_, k) => k).find(
        (k) => a * (10 * t + k) === a * (10 * t + o),
      ) ?? -1,
    traps: [
      ["the-whole-factor", "conceptual", ([, t = 0, o = 0]) => 10 * t + o],
      [
        "the-last-digit-of-the-product",
        "conceptual",
        ([a = 0, t = 0, o = 0]) => apart((a * (10 * t + o)) % 10, o),
      ],
      ["the-tens-digit", "conceptual", ([, t = 0]) => t],
    ],
    extra: ([a = 0, t = 0, o = 0]) => ({
      p: String(a * (10 * t + o)),
      n: String(10 * t + o),
    }),
    consts: [10],
  }),
  a7({
    id: "A7.by-two-digit.14",
    form: "three-digits-by-two-digits",
    groups: [7, 8],
    draw: (r) => [between(r, 121, 349), between(r, 12, 29)],
    valid: ([n = 0, d = 0]) => ones(n) > 1 && tens(n) > 0 && ones(d) > 1,
    solve: ([n = 0, d = 0]) => n * d,
    ref: ([n = 0, d = 0]) => n * 10 * tens(d) + n * ones(d),
    traps: [
      [
        "the-tens-part-only",
        "procedural",
        ([n = 0, d = 0]) => n * 10 * tens(d),
      ],
      [
        "the-tens-not-shifted",
        "procedural",
        ([n = 0, d = 0]) => n * tens(d) + n * ones(d),
      ],
      ["the-hundreds-lost", "procedural", ([n = 0, d = 0]) => (n % 100) * d],
    ],
    extra: ([n = 0, d = 0]) => ({
      u: String(n * 10 * tens(d)),
      v: String(n * ones(d)),
    }),
    consts: [],
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
      [
        "remainder-too-big",
        "procedural",
        ([d = 0, q = 0, rem = 0]) => [q - 1, rem + d],
      ],
      [
        "rounded-up",
        "procedural",
        ([d = 0, q = 0, rem = 0]) => [q + 1, d - rem],
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
      [
        "remainder-too-big",
        "procedural",
        ([n = 0, d = 0]) => [Math.floor(n / d) - 1, (n % d) + d],
      ],
      ["swapped", "conceptual", ([n = 0, d = 0]) => [n % d, Math.floor(n / d)]],
    ],
  }),
  a8({
    id: "A8.remainder.03",
    form: "full-boxes-and-what-is-left",
    groups: [5, 6],
    roles: { a: "count of apples", b: "count in one box" },
    draw: (r) => [between(r, 31, 98), between(r, 4, 9)],
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
      ["swapped", "conceptual", ([n = 0, d = 0]) => [n % d, Math.floor(n / d)]],
      [
        "rounded-up",
        "procedural",
        ([n = 0, d = 0]) => [Math.floor(n / d) + 1, d - (n % d)],
      ],
      [
        "remainder-too-big",
        "procedural",
        ([n = 0, d = 0]) => [Math.floor(n / d) - 1, (n % d) + d],
      ],
    ],
  }),
  a8({
    id: "A8.remainder.04",
    form: "the-remainder-only",
    groups: [5, 5],
    draw: (r) => [between(r, 20, 99), between(r, 3, 9)],
    valid: ([n = 0, d = 0]) => n % d !== 0 && Math.floor(n / d) !== n % d,
    solve: ([n = 0, d = 0]) => n % d,
    ref: ([n = 0, d = 0]) => {
      let m = n;
      while (m >= d) m -= d;
      return m;
    },
    traps: [
      ["quotient", "conceptual", ([n = 0, d = 0]) => Math.floor(n / d)],
      [
        "to-next-multiple",
        "conceptual",
        ([n = 0, d = 0]) => apart(d - (n % d), Math.floor(n / d)),
      ],
      [
        "remainder-too-big",
        "procedural",
        ([n = 0, d = 0]) => apart((n % d) + d, Math.floor(n / d)),
      ],
    ],
  }),
  a8({
    id: "A8.remainder.05",
    form: "the-whole-quotient-only",
    groups: [5, 5],
    draw: (r) => [between(r, 20, 99), between(r, 3, 9)],
    valid: ([n = 0, d = 0]) => n % d !== 0 && Math.floor(n / d) !== n % d,
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
      [
        "remainder",
        "conceptual",
        ([n = 0, d = 0]) =>
          apart(n % d, Math.floor(n / d) + 1, Math.floor(n / d) - 1),
      ],
      ["rounded-up", "procedural", ([n = 0, d = 0]) => Math.floor(n / d) + 1],
      [
        "one-too-small",
        "procedural",
        ([n = 0, d = 0]) => Math.floor(n / d) - 1,
      ],
    ],
  }),
  a8({
    id: "A8.remainder.06",
    form: "how-many-are-needed-so-that-all-fit",
    groups: [5, 6],
    roles: { a: "count of people", b: "count of seats in one bus" },
    draw: (r) => [between(r, 31, 98), between(r, 4, 9)],
    valid: ([n = 0, d = 0]) => n % d !== 0,
    solve: ([n = 0, d = 0]) => Math.floor(n / d) + 1,
    ref: ([n = 0, d = 0]) => Math.ceil(n / d),
    traps: [
      ["whole-only", "conceptual", ([n = 0, d = 0]) => Math.floor(n / d)],
      [
        "remainder",
        "conceptual",
        ([n = 0, d = 0]) => apart(n % d, Math.floor(n / d)),
      ],
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
    traps: [
      ["divisor-itself", "conceptual", ([d = 0]) => d],
      ["one-less-than-needed", "conceptual", ([d = 0]) => d - 2],
    ],
    consts: [1],
  }),
  a8({
    id: "A8.remainder.08",
    form: "the-number-from-a-quotient-and-a-remainder",
    groups: [5, 6],
    roles: { a: "divisor", b: "quotient", c: "remainder" },
    draw: (r) => [between(r, 4, 9), between(r, 3, 9), between(r, 1, 3)],
    valid: ([d = 0, q = 0, rem = 0]) => rem < d && d !== q,
    solve: ([d = 0, q = 0, rem = 0]) => d * q + rem,
    ref: ([d = 0, q = 0, rem = 0]) => sum(q, d) + rem,
    traps: [
      ["remainder-forgotten", "procedural", ([d = 0, q = 0]) => d * q],
      ["all-added", "procedural", ([d = 0, q = 0, rem = 0]) => d + q + rem],
      [
        "remainder-subtracted",
        "procedural",
        ([d = 0, q = 0, rem = 0]) => d * q - rem,
      ],
    ],
  }),
  a8({
    id: "A8.remainder.09",
    form: "the-remainder-on-division-by-ten",
    groups: [5, 6],
    draw: (r) => [between(r, 123, 987)],
    valid: ([n = 0]) => ones(n) !== tens(n) && ones(n) > 0,
    solve: ([n = 0]) => n % 10,
    ref: ([n = 0]) => Number(String(n).slice(-1)),
    traps: [
      ["tens-digit", "conceptual", ([n = 0]) => tens(n)],
      ["quotient", "conceptual", ([n = 0]) => Math.floor(n / 10)],
      ["last-two-digits", "conceptual", ([n = 0]) => n % 100],
    ],
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
    traps: [
      ["start-forgotten", "procedural", ([, b = 0]) => b % 7],
      [
        "no-wrap",
        "procedural",
        ([a = 0, b = 0]) => (a + (b % 7) > 7 ? a + (b % 7) : null),
      ],
      [
        "start-counted",
        "procedural",
        ([a = 0, b = 0]) => apart(((a - 1 + b - 1) % 7) + 1, b % 7),
      ],
    ],
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
      ["remainder-added", "procedural", ([n = 0, , rem = 0]) => n + rem],
      [
        "block-skipped",
        "procedural",
        ([n = 0, d = 0, rem = 0]) =>
          n - (n % d) + rem > n ? n - (n % d) + rem + d : null,
      ],
    ],
  }),
  a8({
    id: "A8.remainder.12",
    form: "the-least-number-with-two-given-remainders",
    groups: [6, 6],
    origin: { olympiad: "a number with two given remainders (RES-4283, F12)" },
    draw: (r) => {
      const k = between(r, 1, 2);
      const [a = 0, b = 0] = pick(r, [
        [3, 4],
        [4, 5],
        [3, 5],
        [4, 6],
        [5, 6],
        [3, 7],
        [5, 7],
        [4, 7],
        [6, 7],
        [5, 8],
      ]);
      return [a, a - k, b, b - k];
    },
    valid: ([a = 0, c = 0, b = 0, d = 0]) => c >= 1 && d >= 1 && a !== b,
    solve: ([a = 0, c = 0, b = 0]) => (a * b) / gcd(a, b) - (a - c),
    ref: ([a = 0, c = 0, b = 0, d = 0]) =>
      Array.from({ length: 200 }, (_, x) => x + 1).find(
        (x) => x % a === c && x % b === d,
      ) ?? -1,
    traps: [
      [
        "the-common-multiple",
        "conceptual",
        ([a = 0, , b = 0]) => (a * b) / gcd(a, b),
      ],
      [
        "the-product-less",
        "procedural",
        ([a = 0, c = 0, b = 0]) =>
          apart(
            a * b - (a - c),
            (a * b) / gcd(a, b) - (a - c),
            (a * b) / gcd(a, b),
          ),
      ],
      ["the-remainder-itself", "conceptual", ([, c = 0]) => c],
    ],
    extra: ([a = 0, c = 0, b = 0, d = 0]) => {
      const first = Array.from({ length: 60 }, (_, x) => x + 1).find(
        (x) => x % a === c && x % b === d,
      );
      return {
        l1: Array.from({ length: 60 }, (_, x) => x + 1)
          .filter((x) => x % a === c && x <= (first ?? 0))
          .join(", "),
        q: String(Math.floor((first ?? 0) / b)),
      };
    },
  }),
  a8({
    id: "A8.remainder.13",
    form: "the-place-of-a-bead-in-a-repeating-pattern",
    groups: [5, 6],
    draw: (r) => [between(r, 3, 5), between(r, 14, 60)],
    valid: ([a = 0, b = 0]) => b % a !== 0 && Math.floor(b / a) !== b % a,
    solve: ([a = 0, b = 0]) => ((b - 1) % a) + 1,
    ref: ([a = 0, b = 0]) => {
      let place = 0;
      for (let i = 1; i <= b; i += 1) place = place === a ? 1 : place + 1;
      return place;
    },
    traps: [
      [
        "the-number-of-whole-patterns",
        "conceptual",
        ([a = 0, b = 0]) => Math.floor(b / a),
      ],
      [
        "the-pattern-not-closed",
        "procedural",
        ([a = 0, b = 0]) =>
          apart(a - (b % a) + 1, ((b - 1) % a) + 1, Math.floor(b / a)),
      ],
      [
        "the-pattern-length",
        "conceptual",
        ([a = 0, b = 0]) => apart(a, ((b - 1) % a) + 1, Math.floor(b / a)),
      ],
    ],
    consts: [1],
  }),
  a8({
    id: "A8.remainder.14",
    form: "the-sum-of-all-possible-remainders",
    groups: [5, 6],
    origin: {
      olympiad: "all remainders of a division, a clever count (RES-4283, F15)",
    },
    draw: (r) => [between(r, 4, 10)],
    solve: ([a = 0]) => (a * (a - 1)) / 2,
    ref: ([a = 0]) =>
      Array.from({ length: 6 * a }, (_, n) => n % a)
        .filter((x, i, list) => list.indexOf(x) === i)
        .reduce((p, q) => p + q, 0),
    traps: [
      [
        "the-divisor-counted-as-a-remainder",
        "conceptual",
        ([a = 0]) => (a * (a + 1)) / 2,
      ],
      ["the-largest-remainder", "conceptual", ([a = 0]) => a - 1],
      [
        "the-divisor-times-the-largest",
        "conceptual",
        ([a = 0]) => apart(a * a - a, (a * (a - 1)) / 2),
      ],
    ],
    extra: ([a = 0]) => ({
      plus: Array.from({ length: a }, (_, i) => i).join(" + "),
      list: Array.from({ length: a }, (_, i) => i).join(", "),
    }),
    consts: [0],
  }),
];

const a9 = forSubtype("A9", "long-one-digit");
const longOne = [
  a9({
    id: "A9.long-one-digit.01",
    form: "an-exact-two-digit-quotient",
    groups: [6, 6],
    draw: (r) => [between(r, 3, 9), between(r, 12, 33)],
    valid: ([d = 0, q = 0]) => d !== q && ones(q) > 0 && d * q <= 99,
    solve: ([, q = 0]) => q,
    ref: ([d = 0, q = 0]) => {
      let m = d * q;
      let k = 0;
      while (m >= d) {
        m -= d;
        k += 1;
      }
      return k;
    },
    traps: [
      ["subtracted", "procedural", ([d = 0, q = 0]) => d * q - d],
      ["digits-swapped", "procedural", ([, q = 0]) => flip(q)],
      ["tens-too-small", "procedural", ([, q = 0]) => q - 10],
    ],
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
    traps: [
      ["subtracted", "procedural", ([d = 0, q = 0]) => d * q - d],
      ["digits-swapped", "procedural", ([, q = 0]) => flip(q)],
      ["tens-too-big", "procedural", ([, q = 0]) => q + 10],
    ],
    extra: ([d = 0, q = 0]) => ({ n: String(d * q) }),
  }),
  a9({
    id: "A9.long-one-digit.03",
    form: "a-quotient-with-a-zero-inside",
    groups: [6, 6],
    draw: (r) => [between(r, 3, 9), between(r, 1, 9), between(r, 1, 9)],
    valid: ([d = 0, x = 0, y = 0]) => d * (100 * x + y) < 1000,
    solve: ([, x = 0, y = 0]) => 100 * x + y,
    ref: ([d = 0, x = 0, y = 0]) =>
      Array.from({ length: 1000 }, (_, k) => k).find(
        (k) => k * d === d * (100 * x + y),
      ) ?? -1,
    traps: [
      ["zero-dropped", "procedural", ([, x = 0, y = 0]) => 10 * x + y],
      ["zero-misplaced", "procedural", ([, x = 0, y = 0]) => 100 * x + 10 * y],
      ["digits-swapped", "procedural", ([, x = 0, y = 0]) => 100 * y + x],
    ],
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
      [
        "remainder-too-big",
        "procedural",
        ([n = 0, d = 0]) => [Math.floor(n / d) - 1, (n % d) + d],
      ],
      ["swapped", "conceptual", ([n = 0, d = 0]) => [n % d, Math.floor(n / d)]],
    ],
  }),
  a9({
    id: "A9.long-one-digit.05",
    form: "sharing-money-equally",
    groups: [6, 6],
    draw: (r) => [between(r, 3, 9), between(r, 21, 99)],
    valid: ([d = 0, q = 0]) => d !== q && ones(q) > 0,
    solve: ([, q = 0]) => q,
    ref: ([d = 0, q = 0]) => {
      let left = d * q;
      let each = 0;
      while (left >= d) {
        left -= d;
        each += 1;
      }
      return each;
    },
    traps: [
      ["subtracted", "procedural", ([d = 0, q = 0]) => d * q - d],
      ["digits-swapped", "procedural", ([, q = 0]) => flip(q)],
      ["tens-too-small", "procedural", ([, q = 0]) => q - 10],
    ],
    extra: ([d = 0, q = 0]) => ({ n: String(d * q) }),
  }),
  a9({
    id: "A9.long-one-digit.06",
    form: "the-whole-part-of-a-quotient",
    groups: [6, 6],
    draw: (r) => [between(r, 101, 999), between(r, 3, 9)],
    valid: ([n = 0, d = 0]) => n % d !== 0 && Math.floor(n / d) >= 10,
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
      [
        "remainder",
        "conceptual",
        ([n = 0, d = 0]) =>
          apart(n % d, Math.floor(n / d) + 1, Math.floor(n / d) - 1),
      ],
      [
        "one-too-small",
        "procedural",
        ([n = 0, d = 0]) => Math.floor(n / d) - 1,
      ],
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
    traps: [
      ["added", "procedural", ([q = 0, d = 0]) => q + d],
      ["units-forgotten", "procedural", ([q = 0, d = 0]) => d * 10 * tens(q)],
      [
        "tens-not-shifted",
        "procedural",
        ([q = 0, d = 0]) => apart(d * (tens(q) + ones(q)), d * 10 * tens(q)),
      ],
    ],
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
    traps: [
      ["quotient", "conceptual", ([, q = 0]) => q],
      ["subtracted", "procedural", ([d = 0, q = 0]) => d * q - q],
    ],
    extra: ([d = 0, q = 0]) => ({ n: String(d * q) }),
  }),
  a9({
    id: "A9.long-one-digit.09",
    form: "how-many-digits-the-quotient-has",
    groups: [6, 6],
    draw: (r) => {
      const digitsOfQ = between(r, 2, 4);
      const q =
        digitsOfQ === 2
          ? between(r, 12, 99)
          : digitsOfQ === 3
            ? between(r, 100, 999)
            : between(r, 1000, 1999);
      return [between(r, 3, 9), q];
    },
    valid: ([d = 0, q = 0]) => d * q >= 100 && d * q <= 9999,
    solve: ([, q = 0]) => countDigits(q),
    ref: ([, q = 0]) => Math.floor(Math.log10(q)) + 1,
    traps: [
      ["dividend-digits", "conceptual", ([d = 0, q = 0]) => countDigits(d * q)],
      [
        "one-fewer-digit",
        "conceptual",
        ([d = 0, q = 0]) => countDigits(d * q) - 1,
      ],
      ["quotient-itself", "conceptual", ([, q = 0]) => q],
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
    traps: [
      ["not-divided", "procedural", ([a = 0, b = 0]) => a + b],
      ["subtracted", "procedural", ([a = 0, b = 0, d = 0]) => a + b - d],
      [
        "one-addend-only",
        "procedural",
        ([a = 0, b = 0, d = 0]) =>
          a % d === 0 ? a / d + b : b % d === 0 ? b / d + a : null,
      ],
    ],
    extra: ([a = 0, b = 0]) => ({ s: String(a + b) }),
  }),
  a9({
    id: "A9.long-one-digit.11",
    form: "halving-twice",
    groups: [6, 6],
    draw: (r) => [4 * between(r, 12, 99)],
    solve: ([n = 0]) => n / 4,
    ref: ([n = 0]) => n / 2 / 2,
    traps: [
      ["halved-once", "procedural", ([n = 0]) => n / 2],
      [
        "halved-three-times",
        "procedural",
        ([n = 0]) => (n % 8 === 0 ? n / 8 : null),
      ],
      ["two-taken-away-twice", "procedural", ([n = 0]) => n - 4],
    ],
    consts: [2],
  }),
  a9({
    id: "A9.long-one-digit.12",
    form: "a-four-digit-dividend",
    groups: [6, 6],
    draw: (r) => [between(r, 3, 9), between(r, 201, 999)],
    valid: ([d = 0, q = 0]) => d !== q && ones(q) > 0 && d * q >= 1000,
    solve: ([, q = 0]) => q,
    ref: ([d = 0, q = 0]) =>
      Array.from({ length: 1000 }, (_, x) => x).find((x) => x * d === d * q) ??
      -1,
    traps: [
      ["subtracted", "procedural", ([d = 0, q = 0]) => d * q - d],
      ["digits-swapped", "procedural", ([, q = 0]) => flip(q)],
      ["a-hundred-short", "procedural", ([, q = 0]) => q - 100],
    ],
    extra: ([d = 0, q = 0]) => ({
      n: String(d * q),
      u: String(d * 100 * hundreds(q)),
      v: String(d * (q % 100)),
    }),
  }),
  a9({
    id: "A9.long-one-digit.13",
    form: "the-remainder-after-adding-to-the-number",
    groups: [6, 7],
    origin: { olympiad: "remainders and addition (RES-4283, F12)" },
    roles: { a: "divisor", b: "remainder", c: "amount added" },
    draw: (r) => {
      const d = between(r, 5, 9);
      return [d, between(r, 1, d - 1), between(r, 2, d + 3)];
    },
    valid: ([d = 0, rem = 0, k = 0]) =>
      (rem + k) % d !== rem && (rem + k) % d !== 0 && rem + k >= d,
    solve: ([d = 0, rem = 0, k = 0]) => (rem + k) % d,
    ref: ([d = 0, rem = 0, k = 0]) => (d * 10 + rem + k) % d,
    traps: [
      [
        "the-remainders-added-without-reducing",
        "procedural",
        ([, rem = 0, k = 0]) => rem + k,
      ],
      ["the-old-remainder", "conceptual", ([, rem = 0]) => rem],
      [
        "the-added-number-only",
        "conceptual",
        ([d = 0, rem = 0, k = 0]) => apart(k % d, (rem + k) % d, rem),
      ],
    ],
    extra: ([, rem = 0, k = 0]) => ({ s: String(rem + k) }),
  }),
  a9({
    id: "A9.long-one-digit.14",
    form: "how-many-times-a-number-halves-evenly",
    groups: [6, 7],
    origin: { olympiad: "halving until the number is odd (RES-4283, F16)" },
    draw: (r) => [pick(r, [3, 5, 7, 9, 11, 13, 15]), between(r, 2, 5)],
    valid: ([odd = 0, k = 0]) => odd * 2 ** k <= 400,
    solve: ([, k = 0]) => k,
    ref: ([odd = 0, k = 0]) => {
      let n = odd * 2 ** k;
      let times = 0;
      while (n % 2 === 0) {
        n /= 2;
        times += 1;
      }
      return times;
    },
    traps: [
      ["the-last-number", "conceptual", ([odd = 0]) => odd],
      ["one-step-too-many", "procedural", ([, k = 0]) => k + 1],
      ["one-step-too-few", "procedural", ([, k = 0]) => k - 1],
    ],
    extra: ([odd = 0, k = 0]) => ({
      n: String(odd * 2 ** k),
      chain: Array.from({ length: k + 1 }, (_, i) => odd * 2 ** (k - i)).join(
        ", ",
      ),
      q: String(odd * 2 ** k),
    }),
    consts: [2],
  }),
];

const a10 = forSubtype("A10", "by-two-digit-div");
const longTwo = [
  a10({
    id: "A10.by-two-digit-div.01",
    form: "an-exact-division-by-a-two-digit-number",
    groups: [7, 7],
    draw: (r) => [between(r, 11, 35), between(r, 12, 29)],
    valid: ([d = 0, q = 0]) =>
      d * q >= 100 && d * q <= 999 && d !== q && ones(q) > 0,
    solve: ([, q = 0]) => q,
    ref: ([d = 0, q = 0]) => {
      let m = d * q;
      let k = 0;
      while (m >= d) {
        m -= d;
        k += 1;
      }
      return k;
    },
    traps: [
      ["subtracted", "procedural", ([d = 0, q = 0]) => d * q - d],
      ["one-too-big", "procedural", ([, q = 0]) => q + 1],
      ["one-too-small", "procedural", ([, q = 0]) => q - 1],
    ],
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
      [
        "remainder-too-big",
        "procedural",
        ([n = 0, d = 0]) => [Math.floor(n / d) - 1, (n % d) + d],
      ],
      ["swapped", "conceptual", ([n = 0, d = 0]) => [n % d, Math.floor(n / d)]],
    ],
  }),
  a10({
    id: "A10.by-two-digit-div.03",
    form: "the-whole-part-of-a-quotient-by-two-digits",
    groups: [7, 7],
    draw: (r) => [between(r, 100, 999), between(r, 11, 60)],
    valid: ([n = 0, d = 0]) => n % d !== 0 && Math.floor(n / d) >= 2,
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
      [
        "one-too-small",
        "procedural",
        ([n = 0, d = 0]) => Math.floor(n / d) - 1,
      ],
      [
        "remainder",
        "conceptual",
        ([n = 0, d = 0]) =>
          apart(n % d, Math.floor(n / d) + 1, Math.floor(n / d) - 1),
      ],
    ],
  }),
  a10({
    id: "A10.by-two-digit-div.04",
    form: "the-remainder-of-a-division-by-two-digits",
    groups: [7, 7],
    draw: (r) => [between(r, 100, 999), between(r, 11, 60)],
    valid: ([n = 0, d = 0]) => n % d !== 0 && Math.floor(n / d) !== n % d,
    solve: ([n = 0, d = 0]) => n % d,
    ref: ([n = 0, d = 0]) => {
      let m = n;
      while (m >= d) m -= d;
      return m;
    },
    traps: [
      ["quotient", "conceptual", ([n = 0, d = 0]) => Math.floor(n / d)],
      [
        "remainder-too-big",
        "procedural",
        ([n = 0, d = 0]) => apart((n % d) + d, Math.floor(n / d)),
      ],
      [
        "to-next-multiple",
        "conceptual",
        ([n = 0, d = 0]) => apart(d - (n % d), Math.floor(n / d)),
      ],
    ],
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
      [
        "remainder",
        "conceptual",
        ([n = 0, d = 0]) => apart(n % d, Math.floor(n / d)),
      ],
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
    traps: [
      ["remainder-forgotten", "procedural", ([d = 0, q = 0]) => d * q],
      ["all-added", "procedural", ([d = 0, q = 0, rem = 0]) => d + q + rem],
      [
        "remainder-subtracted",
        "procedural",
        ([d = 0, q = 0, rem = 0]) => d * q - rem,
      ],
    ],
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
      [
        "one-too-small",
        "procedural",
        ([n = 0, d = 0]) => Math.floor(n / d) - 1,
      ],
      [
        "remainder",
        "conceptual",
        ([n = 0, d = 0]) =>
          apart(n % d, Math.floor(n / d) + 1, Math.floor(n / d) - 1),
      ],
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
    traps: [
      ["quotient", "conceptual", ([, q = 0]) => q],
      ["subtracted", "procedural", ([d = 0, q = 0]) => d * q - q],
      ["digits-swapped", "procedural", ([d = 0, q = 0]) => apart(flip(d), q)],
    ],
    extra: ([d = 0, q = 0]) => ({ n: String(d * q) }),
  }),
  a10({
    id: "A10.by-two-digit-div.09",
    form: "a-quotient-plus-a-number",
    groups: [7, 8],
    draw: (r) => [between(r, 12, 35), between(r, 5, 19), between(r, 12, 50)],
    valid: ([d = 0, q = 0]) => d * q >= 100 && d * q <= 999 && d !== q,
    solve: ([, q = 0, k = 0]) => q + k,
    ref: ([d = 0, q = 0, k = 0]) =>
      (Array.from({ length: 40 }, (_, x) => x).find((x) => x * d === d * q) ??
        -1) + k,
    traps: [
      ["not-divided", "procedural", ([d = 0, q = 0, k = 0]) => d * q + k],
      ["addend-forgotten", "procedural", ([, q = 0]) => q],
      [
        "whole-divided",
        "procedural",
        ([d = 0, q = 0, k = 0]) =>
          (d * q + k) % d === 0 ? (d * q + k) / d : null,
      ],
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
      [
        "hundred-base",
        "conceptual",
        ([n = 0]) => [Math.floor(n / 100), n % 100],
      ],
      ["swapped", "conceptual", ([n = 0]) => [n % 60, Math.floor(n / 60)]],
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
    ref: ([q = 0]) =>
      Array.from({ length: 60 }, (_, x) => x).find((x) => 25 * x === 25 * q) ??
      -1,
    traps: [
      ["quartered", "procedural", ([q = 0]) => 4 * q],
      ["times-four", "procedural", ([q = 0]) => 100 * q],
      [
        "divided-by-four",
        "procedural",
        ([q = 0]) => ((25 * q) % 4 === 0 ? (25 * q) / 4 : null),
      ],
    ],
    extra: ([q = 0]) => ({ n: String(25 * q) }),
    consts: [25],
  }),
  a10({
    id: "A10.by-two-digit-div.12",
    form: "a-quotient-that-ends-in-a-zero",
    groups: [7, 7],
    draw: (r) => [between(r, 12, 49), 10 * between(r, 2, 9)],
    valid: ([d = 0, q = 0]) =>
      d * q >= 100 && d * q <= 999 && d !== q && ones(d) > 0,
    solve: ([, q = 0]) => q,
    ref: ([d = 0, q = 0]) =>
      Array.from({ length: 100 }, (_, x) => x).find((x) => x * d === d * q) ??
      -1,
    traps: [
      ["the-zero-lost", "procedural", ([, q = 0]) => q / 10],
      ["an-extra-zero", "procedural", ([, q = 0]) => q * 10],
      ["subtracted", "procedural", ([d = 0, q = 0]) => d * q - d],
    ],
    extra: ([d = 0, q = 0]) => ({ n: String(d * q) }),
  }),
  a10({
    id: "A10.by-two-digit-div.13",
    form: "the-least-divisor-with-a-given-remainder",
    groups: [7, 8],
    origin: { olympiad: "a divisor larger than the remainder (RES-4283, F12)" },
    roles: { a: "number divided", b: "remainder" },
    draw: (r) => {
      const d = between(r, 12, 30);
      const q = between(r, 3, 9);
      const rem = between(r, 4, 9);
      return [d * q + rem, rem];
    },
    valid: ([n = 0, rem = 0]) => {
      const m = n - rem;
      const small = smallestAbove(m, rem);
      const first = divisorsOf(m).find((x) => x > 1);
      return (
        small !== null && first !== undefined && first <= rem && small !== m
      );
    },
    solve: ([n = 0, rem = 0]) => smallestAbove(n - rem, rem) ?? -1,
    ref: ([n = 0, rem = 0]) => {
      let x = rem + 1;
      while ((n - rem) % x !== 0) x += 1;
      return x;
    },
    traps: [
      [
        "a-divisor-not-above-the-remainder",
        "conceptual",
        ([n = 0, rem = 0]) => divisorsOf(n - rem).find((x) => x > 1) ?? null,
      ],
      [
        "the-whole-number-less-the-remainder",
        "conceptual",
        ([n = 0, rem = 0]) => n - rem,
      ],
      ["the-remainder-itself", "conceptual", ([, rem = 0]) => rem],
    ],
    extra: ([n = 0, rem = 0]) => ({
      m: String(n - rem),
      divs: divisorsOf(n - rem).join(", "),
      k: String((n - rem) / (smallestAbove(n - rem, rem) ?? 1)),
    }),
  }),
  a10({
    id: "A10.by-two-digit-div.14",
    form: "the-remainder-after-doubling-both-numbers",
    groups: [7, 8],
    origin: {
      olympiad: "the remainder when both numbers are doubled (RES-4283, F12)",
    },
    roles: { a: "divisor", b: "quotient", c: "remainder" },
    draw: (r) => {
      const d = between(r, 12, 30);
      return [d, between(r, 3, 9), between(r, 2, d - 1)];
    },
    valid: ([, q = 0, rem = 0]) => q !== rem,
    solve: ([, , rem = 0]) => 2 * rem,
    ref: ([d = 0, q = 0, rem = 0]) => (2 * (d * q + rem)) % (2 * d),
    traps: [
      ["the-same-remainder", "conceptual", ([, , rem = 0]) => rem],
      [
        "the-quotient",
        "conceptual",
        ([, q = 0, rem = 0]) => apart(q, 2 * rem, rem),
      ],
      [
        "the-divisor-less-the-remainder",
        "procedural",
        ([d = 0, , rem = 0]) => apart(d - rem, 2 * rem, rem),
      ],
    ],
    extra: ([d = 0, q = 0, rem = 0]) => ({
      n: String(d * q + rem),
      n2: String(2 * (d * q + rem)),
      d2: String(2 * d),
    }),
    consts: [2],
  }),
];

const SIGNS = ["+", "−", "×", ":"] as const;
/** `a ? b ? c` with the signs numbered 0 to 15, worked out in the usual order; null if it is not a whole number. */
const withSigns = (
  a: number,
  b: number,
  c: number,
  i: number,
): number | null => {
  const first = SIGNS[Math.floor(i / 4)];
  const second = SIGNS[i % 4];
  const op = (
    x: number | null,
    sign: string | undefined,
    y: number,
  ): number | null => {
    if (x === null) return null;
    if (sign === "+") return x + y;
    if (sign === "−") return x - y;
    if (sign === "×") return x * y;
    return y !== 0 && x % y === 0 ? x / y : null;
  };
  const weak = first === "+" || first === "−";
  const strong = second === "×" || second === ":";
  const value =
    weak && strong
      ? op(a, first, op(b, second, c) ?? Number.NaN)
      : op(op(a, first, b), second, c);
  return value !== null && Number.isInteger(value) && value >= 0 ? value : null;
};
const signsText = (i: number): string =>
  `${SIGNS[Math.floor(i / 4)]} ${SIGNS[i % 4]}`;
/** The four ways to put brackets in `a + b × c − d`, as a text and a value each. */
const bracketings = (
  a: number,
  b: number,
  c: number,
  d: number,
): readonly (readonly [string, number])[] => [
  [`(${a} + ${b}) × ${c} − ${d}`, (a + b) * c - d],
  [`${a} + ${b} × ${c} − ${d}`, a + b * c - d],
  [`(${a} + ${b}) × (${c} − ${d})`, (a + b) * (c - d)],
  [`${a} + ${b} × (${c} − ${d})`, a + b * (c - d)],
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
      ["added-all", "procedural", ([a = 0, b = 0, c = 0]) => a + b + c],
      ["multiplied-all", "procedural", ([a = 0, b = 0, c = 0]) => a * b * c],
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
      [
        "one-term-multiplied",
        "procedural",
        ([a = 0, b = 0, c = 0]) => apart(a * c + b, a + b * c),
      ],
      ["sum-only", "procedural", ([a = 0, b = 0]) => a + b],
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
      ["added-all", "procedural", ([a = 0, b = 0, c = 0]) => a + b + c],
      ["last-number-forgotten", "procedural", ([a = 0, b = 0]) => a - b],
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
    ref: ([b = 0, q = 0, c = 0]) => (b * q * c) / b,
    traps: [
      ["multiplication-forgotten", "procedural", ([, q = 0]) => q],
      [
        "division-forgotten",
        "procedural",
        ([b = 0, q = 0, c = 0]) => b * q * c,
      ],
      [
        "multiplication-first",
        "procedural",
        ([, q = 0, c = 0]) => (q % c === 0 ? q / c : null),
      ],
    ],
    extra: ([b = 0, q = 0]) => ({ n: String(b * q) }),
  }),
  a11({
    id: "A11.order-brackets.05",
    form: "a-number-plus-a-quotient",
    groups: [6, 6],
    draw: (r) => [between(r, 5, 40), between(r, 2, 9), between(r, 2, 9)],
    valid: ([, b = 0, q = 0]) => b !== q,
    solve: ([a = 0, , q = 0]) => a + q,
    ref: ([a = 0, b = 0, q = 0]) => (a * b + b * q) / b,
    traps: [
      [
        "division-forgotten",
        "procedural",
        ([a = 0, b = 0, q = 0]) => a + b * q,
      ],
      ["addend-forgotten", "procedural", ([, , q = 0]) => q],
      [
        "sum-divided",
        "procedural",
        ([a = 0, b = 0, q = 0]) =>
          (a + b * q) % b === 0 ? (a + b * q) / b : null,
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
      [
        "brackets-ignored",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => nat(a + b * c - d),
      ],
      [
        "brackets-added",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => a + b + (c - d),
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
    ref: ([a = 0, b = 0, c = 0, d = 0]) => a * d + (b - c) * d,
    traps: [
      [
        "inner-bracket-ignored",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => (a + b) * d - c,
      ],
      [
        "outer-bracket-ignored",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => a + (b - c) * d,
      ],
      [
        "brackets-ignored",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => nat(a + b - c * d),
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
    traps: [
      ["brackets-ignored", "conceptual", ([]) => 0],
      [
        "first-value-only",
        "procedural",
        ([a = 0, b = 0, c = 0]) => (a + b) * c,
      ],
      [
        "sum-of-values",
        "procedural",
        ([a = 0, b = 0, c = 0]) => (a + b) * c + a + b * c,
      ],
    ],
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
      [
        "added-products",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => a * b + c * d,
      ],
      [
        "second-product-lost",
        "procedural",
        ([a = 0, b = 0, c = 0]) => a * b - c,
      ],
    ],
  }),
  a11({
    id: "A11.order-brackets.10",
    form: "a-word-problem-with-two-purchases",
    groups: [6, 6],
    roles: {
      a: "count of notebooks",
      b: "price of a notebook",
      c: "count of pens",
      d: "price of a pen",
    },
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
      [
        "all-added",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => a + b + c + d,
      ],
      ["first-purchase-only", "procedural", ([a = 0, b = 0]) => a * b],
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
      [
        "brackets-ignored",
        "procedural",
        ([a = 0, b = 0, c = 0]) => nat(a - b - c),
      ],
      ["bracket-only", "procedural", ([, b = 0, c = 0]) => b - c],
      ["bracket-added", "procedural", ([a = 0, b = 0, c = 0]) => a + b - c],
    ],
    extra: ([, b = 0, c = 0]) => ({ i: String(b - c) }),
  }),
  forChoice(
    "A11",
    "order-brackets",
  )({
    id: "A11.order-brackets.12",
    form: "the-signs-that-make-an-equality-true",
    groups: [6, 6],
    kind: "choice",
    origin: {
      extension: "inserting the missing signs, Moro grade 2 (RES-4283, F9)",
    },
    draw: (r) => {
      const a = between(r, 2, 9);
      const b = between(r, 2, 9);
      const c = between(r, 2, 9);
      const p0 = r.int(16);
      const p1 = r.int(16);
      const p2 = r.int(16);
      const p3 = r.int(16);
      return [a, b, c, p0, p1, p2, p3, r.int(4)];
    },
    valid: ([a = 0, b = 0, c = 0, p0 = 0, p1 = 0, p2 = 0, p3 = 0]) => {
      const list = [p0, p1, p2, p3];
      if (new Set(list).size !== 4) return false;
      const values = list.map((i) => withSigns(a, b, c, i));
      if (values.some((v) => v === null)) return false;
      return (
        values.slice(1).every((v) => v !== values[0]) && (values[0] ?? 0) <= 90
      );
    },
    solve: ([, , , , , , , by = 0]) => placeOf(0, by),
    ref: ([a = 0, b = 0, c = 0, p0 = 0, p1 = 0, p2 = 0, p3 = 0, by = 0]) => {
      const target = withSigns(a, b, c, p0);
      return String(
        turn([p0, p1, p2, p3], by).findIndex(
          (i) => withSigns(a, b, c, i) === target,
        ) + 1,
      );
    },
    traps: [
      [
        "the-first-wrong-pair",
        "procedural",
        ([, , , , , , , by = 0]) => placeOf(1, by),
      ],
      [
        "the-second-wrong-pair",
        "procedural",
        ([, , , , , , , by = 0]) => placeOf(2, by),
      ],
      [
        "the-third-wrong-pair",
        "procedural",
        ([, , , , , , , by = 0]) => placeOf(3, by),
      ],
    ],
    options: () => FOUR,
    extra: ([a = 0, b = 0, c = 0, p0 = 0, p1 = 0, p2 = 0, p3 = 0, by = 0]) => {
      const list = turn([p0, p1, p2, p3], by).map(signsText);
      return {
        o1: list[0] ?? "",
        o2: list[1] ?? "",
        o3: list[2] ?? "",
        o4: list[3] ?? "",
        t: String(withSigns(a, b, c, p0)),
        x0: `${a} ${signsText(p0).replace(" ", ` ${b} `)} ${c}`,
        x1: `${a} ${signsText(p1).replace(" ", ` ${b} `)} ${c}`,
        x2: `${a} ${signsText(p2).replace(" ", ` ${b} `)} ${c}`,
        x3: `${a} ${signsText(p3).replace(" ", ` ${b} `)} ${c}`,
        y1: String(withSigns(a, b, c, p1)),
        y2: String(withSigns(a, b, c, p2)),
        y3: String(withSigns(a, b, c, p3)),
      };
    },
    consts: [1, 2, 3, 4],
  }),
  a11({
    id: "A11.order-brackets.13",
    form: "the-largest-value-with-brackets-placed-freely",
    groups: [6, 7],
    origin: {
      olympiad:
        "the largest value under a condition, brackets placed freely (RES-4283, F14)",
    },
    draw: (r) => [
      between(r, 2, 9),
      between(r, 2, 9),
      between(r, 4, 9),
      between(r, 2, 3),
    ],
    valid: ([a = 0, b = 0, c = 0, d = 0]) => {
      const values = bracketings(a, b, c, d).map(([, v]) => v);
      const top = Math.max(...values);
      return (
        c > d &&
        values.filter((v) => v === top).length === 1 &&
        new Set(values).size === 4
      );
    },
    solve: ([a = 0, b = 0, c = 0, d = 0]) =>
      Math.max(...bracketings(a, b, c, d).map(([, v]) => v)),
    ref: ([a = 0, b = 0, c = 0, d = 0]) =>
      Math.max(
        (a + b) * c - d,
        a + b * c - d,
        (a + b) * (c - d),
        a + b * (c - d),
      ),
    traps: [
      [
        "no-brackets-at-all",
        "conceptual",
        ([a = 0, b = 0, c = 0, d = 0]) => a + b * c - d,
      ],
      [
        "brackets-only-round-the-sum",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => (a + b) * c - d,
      ],
      [
        "brackets-only-round-the-difference",
        "procedural",
        ([a = 0, b = 0, c = 0, d = 0]) => a + b * (c - d),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0, d = 0]) => {
      const list = bracketings(a, b, c, d);
      return {
        e1: list[0]?.[0] ?? "",
        v1: String(list[0]?.[1]),
        e2: list[1]?.[0] ?? "",
        v2: String(list[1]?.[1]),
        e3: list[2]?.[0] ?? "",
        v3: String(list[2]?.[1]),
        e4: list[3]?.[0] ?? "",
        v4: String(list[3]?.[1]),
      };
    },
  }),
  a11({
    id: "A11.order-brackets.14",
    form: "how-much-brackets-change-a-difference",
    groups: [6, 7],
    origin: { olympiad: "a bracket after a minus sign (RES-4283, F13)" },
    draw: (r) => [between(r, 40, 90), between(r, 20, 39), between(r, 3, 19)],
    valid: ([a = 0, b = 0, c = 0]) => b > c + 1 && a - b - c > 0,
    solve: ([, , c = 0]) => 2 * c,
    ref: ([a = 0, b = 0, c = 0]) => a - (b - c) - (a - b - c),
    traps: [
      ["the-number-itself", "conceptual", ([, , c = 0]) => c],
      [
        "the-difference-of-the-numbers",
        "procedural",
        ([, b = 0, c = 0]) => apart(b - c, 2 * c, c),
      ],
      [
        "the-first-expression",
        "conceptual",
        ([a = 0, b = 0, c = 0]) => apart(a - b + c, 2 * c),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0]) => ({
      x: String(a - (b - c)),
      y: String(a - b - c),
    }),
    consts: [2],
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
    traps: [
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
      ["smaller-from-larger", "procedural", ([a = 0, b = 0]) => noBorrow(b, a)],
      [
        "borrowed-ten-kept",
        "procedural",
        ([a = 0, b = 0]) => (ones(b) < ones(a) ? b - a + 10 : null),
      ],
    ],
  }),
  au({
    id: "A11.unknown.02",
    form: "a-missing-subtrahend-in-an-equation",
    groups: [6, 7],
    draw: (r) => [between(r, 40, 120), between(r, 11, 39)],
    solve: ([a = 0, b = 0]) => a - b,
    ref: ([a = 0, b = 0]) =>
      Array.from({ length: 200 }, (_, x) => x).find((x) => a - x === b) ?? -1,
    traps: [
      ["added", "procedural", ([a = 0, b = 0]) => a + b],
      ["smaller-from-larger", "procedural", ([a = 0, b = 0]) => noBorrow(a, b)],
      [
        "borrowed-ten-kept",
        "procedural",
        ([a = 0, b = 0]) => (ones(a) < ones(b) ? a - b + 10 : null),
      ],
    ],
  }),
  au({
    id: "A11.unknown.03",
    form: "a-missing-factor-in-an-equation",
    groups: [6, 7],
    draw: (r) => [between(r, 3, 9), between(r, 5, 19)],
    valid: ([a = 0, x = 0]) => a !== x,
    solve: ([, x = 0]) => x,
    ref: ([a = 0, x = 0]) =>
      Array.from({ length: 30 }, (_, k) => k).find((k) => a * k === a * x) ??
      -1,
    traps: [
      ["product-minus-factor", "procedural", ([a = 0, x = 0]) => a * x - a],
      ["multiplied", "procedural", ([a = 0, x = 0]) => a * a * x],
      ["added", "procedural", ([a = 0, x = 0]) => a + a * x],
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
    traps: [
      ["added", "procedural", ([a = 0, q = 0]) => a + q],
      [
        "divided",
        "procedural",
        ([a = 0, q = 0]) => (q % a === 0 ? q / a : null),
      ],
      ["subtracted", "procedural", ([a = 0, q = 0]) => nat(q - a)],
    ],
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
    traps: [
      ["quotient", "conceptual", ([, q = 0]) => q],
      ["subtracted", "procedural", ([d = 0, q = 0]) => d * q - q],
    ],
    extra: ([d = 0, q = 0]) => ({ n: String(d * q) }),
  }),
  au({
    id: "A11.unknown.06",
    form: "a-missing-minuend",
    groups: [6, 7],
    draw: (r) => [between(r, 11, 59), between(r, 11, 59)],
    valid: ([a = 0, b = 0]) => a !== b,
    solve: ([a = 0, b = 0]) => a + b,
    ref: ([a = 0, b = 0]) =>
      Array.from({ length: 150 }, (_, x) => x).find((x) => x - a === b) ?? -1,
    traps: [
      ["subtracted", "procedural", ([a = 0, b = 0]) => Math.abs(a - b)],
      [
        "carry-forgotten",
        "procedural",
        ([a = 0, b = 0]) =>
          ones(a) + ones(b) >= 10
            ? (tens(a) + tens(b)) * 10 + ones(a) + ones(b) - 10
            : null,
      ],
    ],
  }),
  au({
    id: "A11.unknown.07",
    form: "a-thought-of-number-after-adding",
    groups: [6, 7],
    roles: { a: "first amount added", b: "second amount added", c: "result" },
    draw: (r) => {
      const a = between(r, 11, 39);
      const b = between(r, 11, 39);
      return [a, b, a + b + between(r, 12, 49)];
    },
    valid: ([a = 0, b = 0]) => a !== b,
    solve: ([a = 0, b = 0, c = 0]) => c - a - b,
    ref: ([a = 0, b = 0, c = 0]) =>
      Array.from({ length: 150 }, (_, x) => x).find((x) => x + a + b === c) ??
      -1,
    traps: [
      ["one-addition-undone", "procedural", ([a = 0, , c = 0]) => c - a],
      ["added-instead", "procedural", ([a = 0, b = 0, c = 0]) => c + a + b],
      [
        "smaller-from-larger",
        "procedural",
        ([a = 0, b = 0, c = 0]) => noBorrow(c - a, b),
      ],
    ],
    extra: ([a = 0, , c = 0]) => ({ s: String(c - a) }),
  }),
  au({
    id: "A11.unknown.08",
    form: "the-same-unknown-twice",
    groups: [6, 7],
    draw: (r) => [between(r, 3, 29), between(r, 5, 25)],
    solve: ([, x = 0]) => x,
    ref: ([a = 0, x = 0]) =>
      Array.from({ length: 60 }, (_, y) => y).find(
        (y) => y + y + a === 2 * x + a,
      ) ?? -1,
    traps: [
      ["halved-forgotten", "procedural", ([, x = 0]) => 2 * x],
      [
        "total-halved",
        "procedural",
        ([a = 0, x = 0]) => ((2 * x + a) % 2 === 0 ? (2 * x + a) / 2 : null),
      ],
      ["added", "procedural", ([a = 0, x = 0]) => 2 * x + 2 * a],
    ],
    extra: ([a = 0, x = 0]) => ({ c: String(2 * x + a) }),
    consts: [2],
  }),
  au({
    id: "A11.unknown.09",
    form: "an-unknown-on-one-side-and-two-numbers-on-the-other",
    groups: [6, 7],
    roles: {
      a: "addend",
      b: "first part of the right side",
      c: "second part of the right side",
    },
    draw: (r) => [between(r, 11, 39), between(r, 22, 60), between(r, 11, 29)],
    valid: ([a = 0, b = 0, c = 0]) =>
      b + c > a + 2 && a !== b && a !== c && b !== c,
    solve: ([a = 0, b = 0, c = 0]) => b + c - a,
    ref: ([a = 0, b = 0, c = 0]) =>
      Array.from({ length: 200 }, (_, x) => x).find((x) => x + a === b + c) ??
      -1,
    traps: [
      ["wrong-side", "procedural", ([a = 0, b = 0, c = 0]) => a + b + c],
      ["sum-only", "procedural", ([, b = 0, c = 0]) => b + c],
      ["one-addend-lost", "procedural", ([a = 0, b = 0]) => nat(b - a)],
    ],
  }),
  au({
    id: "A11.unknown.10",
    form: "an-unknown-product-equal-to-a-sum",
    groups: [6, 7],
    draw: (r) => [between(r, 3, 9), between(r, 6, 28), between(r, 6, 28)],
    valid: ([a = 0, b = 0, c = 0]) =>
      (b + c) % a === 0 && (b + c) / a !== a && b !== c,
    solve: ([a = 0, b = 0, c = 0]) => (b + c) / a,
    ref: ([a = 0, b = 0, c = 0]) =>
      Array.from({ length: 60 }, (_, x) => x).find((x) => a * x === b + c) ??
      -1,
    traps: [
      ["not-divided", "procedural", ([, b = 0, c = 0]) => b + c],
      ["subtracted", "procedural", ([a = 0, b = 0, c = 0]) => nat(b + c - a)],
      ["multiplied", "procedural", ([a = 0, b = 0, c = 0]) => (b + c) * a],
    ],
  }),
  au({
    id: "A11.unknown.11",
    form: "an-unknown-in-a-difference-equal-to-a-difference",
    groups: [6, 7],
    draw: (r) => [between(r, 11, 30), between(r, 40, 80), between(r, 11, 39)],
    valid: ([a = 0, b = 0, c = 0]) =>
      b - c > 1 && a + (b - c) !== b + c && b - c !== c && b - c !== a,
    solve: ([a = 0, b = 0, c = 0]) => a + b - c,
    ref: ([a = 0, b = 0, c = 0]) =>
      Array.from({ length: 200 }, (_, x) => x).find((x) => x - a === b - c) ??
      -1,
    traps: [
      ["wrong-sign", "procedural", ([a = 0, b = 0, c = 0]) => nat(b - c - a)],
      ["difference-only", "procedural", ([, b = 0, c = 0]) => b - c],
      ["c-sign-flipped", "procedural", ([a = 0, b = 0, c = 0]) => a + b + c],
    ],
  }),
  au({
    id: "A11.unknown.12",
    form: "the-centre-of-a-magic-square",
    groups: [6, 7],
    origin: { olympiad: "a magic square and its centre (RES-4283, F11)" },
    roles: { a: "sum in each line" },
    draw: (r) => [3 * between(r, 4, 20)],
    solve: ([s = 0]) => s / 3,
    ref: ([s = 0]) =>
      Array.from({ length: s }, (_, x) => x).find((x) => 3 * x === s) ?? -1,
    traps: [
      [
        "half-of-the-sum",
        "conceptual",
        ([s = 0]) => (s % 2 === 0 ? s / 2 : null),
      ],
      ["the-sum-itself", "conceptual", ([s = 0]) => s],
      ["a-fourth", "conceptual", ([s = 0]) => (s % 4 === 0 ? s / 4 : null)],
      ["a-ninth", "conceptual", ([s = 0]) => (s % 9 === 0 ? s / 9 : null)],
    ],
    extra: ([s = 0]) => ({ t: String(3 * s), q: String(4 * s) }),
    consts: [3, 4],
  }),
  au({
    id: "A11.unknown.13",
    form: "a-number-far-down-a-row-with-equal-triple-sums",
    groups: [6, 8],
    origin: {
      olympiad: "a period in a row with equal sums of three (RES-4283, F16)",
    },
    draw: (r) => {
      const a = between(r, 3, 15);
      const b = between(r, 3, 15);
      return [
        a,
        b,
        a + b + between(r, 3, 15),
        pick(r, [7, 8, 9, 10, 11, 12, 13, 14, 15, 16]),
      ];
    },
    valid: ([a = 0, b = 0, c = 0]) =>
      a !== b && c - a - b !== a && c - a - b !== b,
    solve: ([a = 0, b = 0, c = 0, k = 0]) => [c - a - b, a, b][k % 3] ?? 0,
    ref: ([a = 0, b = 0, c = 0, k = 0]) => {
      const row = [a, b, c - a - b];
      for (let i = 3; i < k; i += 1) row.push(row[i - 3] ?? 0);
      return row[k - 1] ?? 0;
    },
    traps: [
      [
        "the-first-number",
        "conceptual",
        ([a = 0, b = 0, c = 0, k = 0]) =>
          [c - a - b, a, b][k % 3] === a ? null : a,
      ],
      [
        "the-second-number",
        "conceptual",
        ([a = 0, b = 0, c = 0, k = 0]) =>
          [c - a - b, a, b][k % 3] === b ? null : b,
      ],
      [
        "the-third-number",
        "conceptual",
        ([a = 0, b = 0, c = 0, k = 0]) =>
          [c - a - b, a, b][k % 3] === c - a - b ? null : c - a - b,
      ],
    ],
    extra: ([a = 0, b = 0, c = 0]) => ({ t: String(c - a - b) }),
  }),
  au({
    id: "A11.unknown.14",
    form: "the-other-number-from-the-mean",
    groups: [7, 8],
    origin: { olympiad: "the mean of two numbers (RES-4283, F12)" },
    roles: { a: "mean of two numbers", b: "one of the numbers" },
    draw: (r) => {
      const m = between(r, 20, 60);
      return [m, m + between(r, 5, 18)];
    },
    valid: ([m = 0, a = 0]) => a < 2 * m,
    solve: ([m = 0, a = 0]) => 2 * m - a,
    ref: ([m = 0, a = 0]) =>
      Array.from({ length: 200 }, (_, x) => x).find((x) => (x + a) / 2 === m) ??
      -1,
    traps: [
      [
        "the-mean-less-the-number",
        "procedural",
        ([m = 0, a = 0]) => apart(a - m, 2 * m - a),
      ],
      [
        "the-mean-and-the-number-added",
        "procedural",
        ([m = 0, a = 0]) => m + a,
      ],
      ["the-double-of-the-mean", "conceptual", ([m = 0]) => 2 * m],
    ],
    extra: ([m = 0]) => ({ s: String(2 * m) }),
    consts: [2],
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
