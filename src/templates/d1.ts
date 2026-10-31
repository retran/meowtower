// Domain D, part 1: the meaning of a decimal, adding and subtracting decimals, and moving the comma
// (RES-4282). The Dutch goals start decimals with money at group 5, add money amounts at group 6, and multiply
// and divide by 10 and 100 at group 7. A decimal is written with a comma in a text. Texts are plain blanks in
// `content/tasks-d.ru.json`.
import { Q } from "../math/q.js";
import { between, pick } from "./draw.js";
import { dec, forFraction, q, qd } from "./kitf.js";
import { SIGNS, type Spec } from "./spec.js";

const sign = (x: Q, y: Q): (typeof SIGNS)[number] => SIGNS[x.cmp(y) + 1] ?? "=";
const num = (w: number, t: number, h: number): number => 100 * w + 10 * t + h;

/** The numbers combined digit by digit, as a child does who carries or borrows nothing. */
const byColumn = (
  x: number,
  y: number,
  op: (p: number, s: number, top: boolean) => number,
): number => {
  let out = 0;
  for (
    let n = x, m = y, place = 1;
    n > 0 || m > 0;
    n = Math.floor(n / 10), m = Math.floor(m / 10), place *= 10
  )
    out += op(n % 10, m % 10, n < 10 && m < 10) * place;
  return out;
};
const noCarry = (x: number, y: number): number =>
  byColumn(x, y, (p, s, top) => (top ? p + s : (p + s) % 10));
const noBorrow = (x: number, y: number): number =>
  byColumn(x, y, (p, s) => Math.abs(p - s));

/** The positions 1 to n of the values, ordered by a key and, for equal keys, as listed. */
const ranked = (
  v: readonly number[],
  key: (x: number) => number,
  descending = false,
): string[] =>
  v
    .map((x, i) => [x, i] as const)
    .sort((p, s) =>
      descending ? key(s[0]) - key(p[0]) : key(p[0]) - key(s[0]) || p[1] - s[1],
    )
    .map(([, i]) => String(i + 1));

const d1 = forFraction("D1", "place-value");
const placeValue = [
  d1({
    id: "D1.place-value.01",
    form: "how-many-cents-in-an-amount-of-euros",
    groups: [5, 5],
    kind: "integer",
    draw: (r) => [between(r, 1, 9), between(r, 11, 99)],
    valid: ([, c = 0]) => c % 10 !== 0,
    solve: ([e = 0, c = 0]) => q(100 * e + c),
    ref: ([e = 0, c = 0]) => qd(100 * e + c, 2).mul(q(100)),
    traps: [
      ["cents-part-only", "conceptual", ([, c = 0]) => q(c)],
      ["cents-forgotten", "conceptual", ([e = 0]) => q(100 * e)],
      [
        "euros-added-to-cents",
        "procedural",
        ([e = 0, c = 0]) => (e + c === 100 * e ? null : q(e + c)),
      ],
    ],
    extra: ([e = 0, c = 0]) => ({ m: dec(100 * e + c, 2) }),
    consts: [1, 100],
  }),
  d1({
    id: "D1.place-value.02",
    form: "the-digit-in-the-tenths-place",
    groups: [5, 6],
    kind: "integer",
    draw: (r) => [between(r, 1, 9), between(r, 1, 9), between(r, 1, 9)],
    valid: ([w = 0, t = 0, h = 0]) => new Set([w, t, h]).size === 3,
    solve: ([, t = 0]) => q(t),
    ref: ([w = 0, t = 0, h = 0]) => q(Number(String(num(w, t, h)).slice(1, 2))),
    traps: [
      ["hundredths-digit", "conceptual", ([, , h = 0]) => q(h)],
      ["whole-digit", "conceptual", ([w = 0]) => q(w)],
    ],
    extra: ([w = 0, t = 0, h = 0]) => ({ n: dec(num(w, t, h), 2) }),
  }),
  d1({
    id: "D1.place-value.03",
    form: "the-digit-in-the-hundredths-place",
    groups: [5, 6],
    kind: "integer",
    draw: (r) => [between(r, 1, 9), between(r, 1, 9), between(r, 1, 9)],
    valid: ([w = 0, t = 0, h = 0]) => new Set([w, t, h]).size === 3,
    solve: ([, , h = 0]) => q(h),
    ref: ([w = 0, t = 0, h = 0]) => q(Number(String(num(w, t, h)).slice(-1))),
    traps: [
      ["tenths-digit", "conceptual", ([, t = 0]) => q(t)],
      ["whole-digit", "conceptual", ([w = 0]) => q(w)],
    ],
    extra: ([w = 0, t = 0, h = 0]) => ({ n: dec(num(w, t, h), 2) }),
  }),
  d1({
    id: "D1.place-value.04",
    form: "how-many-tenths-a-number-holds",
    groups: [5, 6],
    kind: "integer",
    draw: (r) => [between(r, 1, 30), between(r, 1, 9)],
    solve: ([w = 0, t = 0]) => q(10 * w + t),
    ref: ([w = 0, t = 0]) => qd(10 * w + t, 1).mul(q(10)),
    traps: [
      ["wholes-only", "conceptual", ([w = 0]) => q(w)],
      [
        "tenths-digit-only",
        "conceptual",
        ([w = 0, t = 0]) => (t === w ? null : q(t)),
      ],
      [
        "hundredths-counted",
        "conceptual",
        ([w = 0, t = 0]) => q(100 * w + 10 * t),
      ],
    ],
    extra: ([w = 0, t = 0]) => ({ n: dec(10 * w + t, 1) }),
    consts: [10],
  }),
  d1({
    id: "D1.place-value.05",
    form: "how-many-hundredths-a-number-holds",
    groups: [5, 6],
    kind: "integer",
    draw: (r) => [between(r, 1, 9), between(r, 1, 9), between(r, 1, 9)],
    solve: ([w = 0, t = 0, h = 0]) => q(num(w, t, h)),
    ref: ([w = 0, t = 0, h = 0]) => qd(num(w, t, h), 2).mul(q(100)),
    traps: [
      ["decimal-part-only", "conceptual", ([, t = 0, h = 0]) => q(10 * t + h)],
      [
        "tenths-counted",
        "conceptual",
        ([w = 0, t = 0, h = 0]) => (w === t && t === h ? null : q(10 * w + t)),
      ],
      ["hundredths-digit-only", "conceptual", ([, , h = 0]) => q(h)],
    ],
    extra: ([w = 0, t = 0, h = 0]) => ({ n: dec(num(w, t, h), 2) }),
    consts: [100],
  }),
  d1({
    id: "D1.place-value.06",
    form: "compose-a-decimal-from-wholes-tenths-and-hundredths",
    groups: [5, 6],
    kind: "decimal",
    draw: (r) => [between(r, 1, 9), between(r, 1, 9), between(r, 1, 9)],
    valid: ([, t = 0, h = 0]) => t !== h,
    solve: ([w = 0, t = 0, h = 0]) => qd(num(w, t, h), 2),
    ref: ([w = 0, t = 0, h = 0]) => Q.fromDecimal(`${w},${t}${h}`),
    traps: [
      [
        "tenths-and-hundredths-swapped",
        "conceptual",
        ([w = 0, t = 0, h = 0]) => qd(num(w, h, t), 2),
      ],
      [
        "hundredths-forgotten",
        "conceptual",
        ([w = 0, t = 0]) => qd(10 * w + t, 1),
      ],
      [
        "tenths-skipped",
        "conceptual",
        ([w = 0, , h = 0]) => qd(100 * w + h, 2),
      ],
    ],
  }),
  d1({
    id: "D1.place-value.07",
    form: "euros-and-a-few-cents-as-a-decimal",
    groups: [5, 5],
    kind: "decimal",
    draw: (r) => [between(r, 1, 20), between(r, 1, 9)],
    solve: ([e = 0, c = 0]) => qd(100 * e + c, 2),
    ref: ([e = 0, c = 0]) => Q.fromDecimal(`${e},0${c}`),
    traps: [
      ["cents-as-tenths", "conceptual", ([e = 0, c = 0]) => qd(10 * e + c, 1)],
      [
        "places-swapped",
        "conceptual",
        ([e = 0, c = 0]) => (e === c || e > 9 ? null : qd(10 * c + e, 1)),
      ],
    ],
  }),
  d1({
    id: "D1.place-value.08",
    form: "compare-tenths-with-hundredths",
    groups: [5, 6],
    kind: "compare",
    // Three cases: the short number is larger, the long one is larger (also with the same tenths), and equal ones.
    draw: (r) => {
      const mode = pick(r, [0, 0, 1, 1, 2]);
      const w = between(r, 1, 9);
      const flip = r.int(2);
      if (mode === 0) {
        const t = between(r, 2, 9);
        return [w, t, between(r, 0, t - 1), between(r, 1, 9), flip];
      }
      const t = between(r, 1, 9);
      return mode === 1
        ? [w, t, between(r, t, 9), between(r, 1, 9), flip]
        : [w, t, t, 0, flip];
    },
    solve: ([w = 0, t = 0, u = 0, x = 0, flip = 0]) => {
      const short = 100 * w + 10 * t;
      const long = 100 * w + 10 * u + x;
      return flip
        ? sign(qd(long, 2), qd(short, 2))
        : sign(qd(short, 2), qd(long, 2));
    },
    ref: ([, t = 0, u = 0, x = 0, flip = 0]) => {
      const [left, right] = flip ? [10 * u + x, 10 * t] : [10 * t, 10 * u + x];
      return left > right ? ">" : left < right ? "<" : "=";
    },
    traps: [
      [
        "longer-is-bigger",
        "conceptual",
        ([, , , , flip = 0]) => (flip ? ">" : "<"),
      ],
      ["wholes-only-compared", "conceptual", () => "="],
    ],
    extra: ([w = 0, t = 0, u = 0, x = 0, flip = 0]) => ({
      f: flip ? dec(100 * w + 10 * u + x, 2) : dec(10 * w + t, 1),
      g: flip ? dec(10 * w + t, 1) : dec(100 * w + 10 * u + x, 2),
      sh: dec(10 * w + t, 1),
      sh0: dec(100 * w + 10 * t, 2),
      p: String(flip ? 10 * u + x : 10 * t),
      q: String(flip ? 10 * t : 10 * u + x),
    }),
  }),
  d1({
    id: "D1.place-value.09",
    form: "order-three-decimals",
    groups: [5, 6],
    kind: "order",
    draw: (r) => [between(r, 11, 99), between(r, 11, 99), between(r, 11, 99)],
    valid: ([a = 0, b = 0, c = 0]) =>
      new Set([a, b, c]).size === 3 &&
      [a, b, c].some((x) => x % 10 === 0) &&
      [a, b, c].some((x) => x % 10 !== 0),
    solve: ([a = 0, b = 0, c = 0]) =>
      [a, b, c]
        .map((x, i) => [x, i] as const)
        .sort((p, s) => p[0] - s[0])
        .map(([, i]) => String(i + 1)),
    ref: ([a = 0, b = 0, c = 0]) => {
      const v = [a, b, c];
      return ["1", "2", "3"].sort(
        (x, y) => (v[Number(x) - 1] ?? 0) - (v[Number(y) - 1] ?? 0),
      );
    },
    traps: [
      [
        "largest-first",
        "conceptual",
        ([a = 0, b = 0, c = 0]) => ranked([a, b, c], (x) => x, true),
      ],
      [
        "hundredths-digit-first",
        "conceptual",
        ([a = 0, b = 0, c = 0]) => {
          const wrong = ranked([a, b, c], (x) => x % 10);
          return wrong.join() === ranked([a, b, c], (x) => x, true).join()
            ? null
            : wrong;
        },
      ],
      [
        "digits-as-whole-numbers",
        "conceptual",
        ([a = 0, b = 0, c = 0]) => {
          const wrong = ranked([a, b, c], (x) => (x % 10 === 0 ? x / 10 : x));
          return wrong.join() === ranked([a, b, c], (x) => x).join()
            ? null
            : wrong;
        },
      ],
    ],
    extra: ([a = 0, b = 0, c = 0]) => ({
      list: [a, b, c].map((x) => dec(x, 2, true)).join("; "),
      list0: [a, b, c].map((x) => dec(x, 2)).join("; "),
      sorted: [a, b, c]
        .map((x, i) => [x, i] as const)
        .sort((p, s) => p[0] - s[0])
        .map(([x]) => dec(x, 2, true))
        .join(" < "),
    }),
  }),
  d1({
    id: "D1.place-value.10",
    form: "write-hundredths-as-a-decimal",
    groups: [5, 6],
    kind: "decimal",
    draw: (r) => [between(r, 2, 99)],
    valid: ([a = 0]) => a % 10 !== 0,
    solve: ([a = 0]) => qd(a, 2),
    ref: ([a = 0]) => Q.fromDecimal(`0,${String(a).padStart(2, "0")}`),
    traps: [
      ["tenths", "conceptual", ([a = 0]) => qd(a, 1)],
      ["whole-number", "conceptual", ([a = 0]) => q(a)],
      ["thousandths", "conceptual", ([a = 0]) => qd(a, 3)],
    ],
  }),
  d1({
    id: "D1.place-value.11",
    form: "the-value-of-a-digit-in-the-tenths-place",
    groups: [5, 6],
    kind: "decimal",
    draw: (r) => [between(r, 1, 9), between(r, 1, 9), between(r, 1, 9)],
    valid: ([w = 0, t = 0, h = 0]) => new Set([w, t, h]).size === 3,
    solve: ([, t = 0]) => qd(t, 1),
    ref: ([, t = 0]) => Q.fromDecimal(`0,${t}`),
    traps: [
      ["face-value", "conceptual", ([, t = 0]) => q(t)],
      ["hundredths-value", "conceptual", ([, t = 0]) => qd(t, 2)],
    ],
    extra: ([w = 0, t = 0, h = 0]) => ({ n: dec(num(w, t, h), 2) }),
  }),
  d1({
    id: "D1.place-value.12",
    form: "round-an-amount-to-whole-euros",
    groups: [5, 6],
    kind: "integer",
    draw: (r) => [between(r, 1, 30), between(r, 11, 99)],
    valid: ([, c = 0]) => c % 10 !== 0 && c !== 50,
    solve: ([e = 0, c = 0]) => q(c > 50 ? e + 1 : e),
    ref: ([e = 0, c = 0]) => q(Math.round(e + c / 100 - 1e-9)),
    traps: [
      ["cut-off", "procedural", ([e = 0]) => q(e)],
      ["always-up", "procedural", ([e = 0]) => q(e + 1)],
    ],
    extra: ([e = 0, c = 0]) => ({ m: dec(100 * e + c, 2) }),
  }),
  d1({
    id: "D1.place-value.13",
    form: "the-hundredths-number-half-way-between-two-tenths",
    groups: [5, 6],
    kind: "decimal",
    draw: (r) => [between(r, 0, 9), between(r, 0, 8)],
    solve: ([w = 0, t = 0]) => qd(100 * w + 10 * t + 5, 2),
    ref: ([w = 0, t = 0]) =>
      qd(10 * w + t, 1)
        .add(qd(10 * w + t + 1, 1))
        .div(q(2)),
    traps: [
      ["right-tenth", "conceptual", ([w = 0, t = 0]) => qd(10 * w + t + 1, 1)],
      ["left-tenth", "conceptual", ([w = 0, t = 0]) => qd(10 * w + t, 1)],
      ["half-added", "conceptual", ([w = 0, t = 0]) => qd(10 * w + t + 5, 1)],
    ],
    extra: ([w = 0, t = 0]) => ({
      f: dec(10 * w + t, 1),
      g: dec(10 * w + t + 1, 1),
    }),
    consts: [0],
  }),
  d1({
    id: "D1.place-value.14",
    form: "read-a-tenths-point-on-a-number-line",
    groups: [5, 6],
    kind: "decimal",
    draw: (r) => [between(r, 1, 19), between(r, 1, 9)],
    solve: ([w = 0, k = 0]) => qd(10 * w + k, 1),
    ref: ([w = 0, k = 0]) => q(w).add(q(k).mul(qd(1, 1))),
    traps: [
      [
        "hundredths-instead-of-tenths",
        "conceptual",
        ([w = 0, k = 0]) => qd(100 * w + k, 2),
      ],
      [
        "digits-swapped",
        "procedural",
        ([w = 0, k = 0]) =>
          w > 9 || w === k ? null : Q.fromDecimal(`${k},${w}`),
      ],
      [
        "counted-from-the-right",
        "procedural",
        ([w = 0, k = 0]) => (k === 5 ? null : qd(10 * (w + 1) - k, 1)),
      ],
    ],
    extra: ([w = 0]) => ({ n: String(w + 1) }),
  }),
  d1({
    id: "D1.place-value.15",
    form: "read-a-hundredths-point-on-a-number-line",
    groups: [6, 6],
    kind: "decimal",
    draw: (r) => [between(r, 0, 9), between(r, 0, 8), between(r, 1, 9)],
    solve: ([w = 0, t = 0, j = 0]) => qd(100 * w + 10 * t + j, 2),
    ref: ([w = 0, t = 0, j = 0]) => qd(10 * w + t, 1).add(qd(j, 2)),
    traps: [
      [
        "counted-from-the-right",
        "procedural",
        ([w = 0, t = 0, j = 0]) =>
          j === 5 ? null : qd(10 * (10 * w + t + 1) - j, 2),
      ],
      [
        "steps-as-tenths",
        "conceptual",
        ([w = 0, t = 0, j = 0]) => qd(10 * w + t + j, 1),
      ],
    ],
    extra: ([w = 0, t = 0]) => ({
      f: dec(10 * w + t, 1),
      g: dec(10 * w + t + 1, 1),
    }),
  }),
  d1({
    id: "D1.place-value.16",
    form: "the-largest-of-four-decimals-of-different-length",
    groups: [5, 6],
    kind: "choice",
    draw: (r) => [
      between(r, 1, 9),
      between(r, 11, 99),
      between(r, 11, 99),
      between(r, 11, 99),
      between(r, 11, 99),
    ],
    valid: ([, ...h]) =>
      new Set(h).size === 4 &&
      h.some((x) => x % 10 === 0) &&
      h.some((x) => x % 10 !== 0),
    options: () => ["1", "2", "3", "4"],
    solve: ([, ...h]) => String(h.indexOf(Math.max(...h)) + 1),
    ref: ([, ...h]) =>
      String(
        h
          .map((x, i) => [x, i] as const)
          .sort((p, s) => s[0] - p[0])
          .map(([, i]) => i + 1)[0],
      ),
    traps: [
      [
        "digits-as-whole-numbers",
        "conceptual",
        ([, ...h]) => {
          const shown = h.map((x) => (x % 10 === 0 ? x / 10 : x));
          return String(shown.indexOf(Math.max(...shown)) + 1);
        },
      ],
      [
        "shortest-wins",
        "conceptual",
        ([, ...h]) => {
          const tenths = h.filter((x) => x % 10 === 0);
          const wrong = String(h.indexOf(Math.max(...tenths)) + 1);
          const shown = h.map((x) => (x % 10 === 0 ? x / 10 : x));
          return wrong === String(shown.indexOf(Math.max(...shown)) + 1) ||
            wrong === String(h.indexOf(Math.max(...h)) + 1)
            ? null
            : wrong;
        },
      ],
      [
        "tenths-tie",
        "conceptual",
        ([, ...h]) => {
          const tenths = h.map((x) => Math.floor(x / 10));
          const wrong = String(tenths.indexOf(Math.max(...tenths)) + 1);
          return wrong === String(h.indexOf(Math.max(...h)) + 1) ? null : wrong;
        },
      ],
    ],
    extra: ([w = 0, ...h]) => {
      const best = Math.max(...h);
      return {
        f1: dec(100 * w + (h[0] ?? 0), 2, true),
        f2: dec(100 * w + (h[1] ?? 0), 2, true),
        f3: dec(100 * w + (h[2] ?? 0), 2, true),
        f4: dec(100 * w + (h[3] ?? 0), 2, true),
        list0: h.map((x) => dec(100 * w + x, 2)).join("; "),
        mx: String(best),
        big: dec(100 * w + best, 2, true),
      };
    },
    consts: [1, 2, 3, 4],
  }),
  d1({
    id: "D1.place-value.17",
    form: "select-every-number-less-than-a-bound",
    groups: [5, 6],
    kind: "set",
    draw: (r) => {
      const w = between(r, 1, 9);
      const t = between(r, 1, 9);
      const centre = 100 * w + 10 * t;
      return [
        w,
        t,
        ...Array.from({ length: 4 }, () => centre + between(r, -40, 40)),
      ];
    },
    valid: ([w = 0, t = 0, ...x]) => {
      const bound = 100 * w + 10 * t;
      const less = x.filter((v) => v < bound).length;
      return (
        new Set(x).size === 4 && !x.includes(bound) && less >= 1 && less <= 3
      );
    },
    options: () => ["1", "2", "3", "4"],
    solve: ([w = 0, t = 0, ...x]) =>
      x.flatMap((v, i) => (v < 100 * w + 10 * t ? [String(i + 1)] : [])),
    ref: ([w = 0, t = 0, ...x]) =>
      ["1", "2", "3", "4"].filter(
        (_, i) => qd(x[i] ?? 0, 2).cmp(qd(10 * w + t, 1)) < 0,
      ),
    traps: [
      [
        "digits-as-whole-numbers",
        "conceptual",
        ([w = 0, t = 0, ...x]) => {
          const frac = (v: number): number =>
            Number(dec(v, 2, true).split(",")[1] ?? 0);
          const bound = 100 * w + 10 * t;
          const wrong = x.flatMap((v, i) =>
            Math.floor(v / 100) < w ||
            (Math.floor(v / 100) === w && frac(v) < frac(bound))
              ? [String(i + 1)]
              : [],
          );
          return wrong.length === 0 ? null : wrong;
        },
      ],
      [
        "the-greater-ones",
        "conceptual",
        ([w = 0, t = 0, ...x]) => {
          const frac = (v: number): number =>
            Number(dec(v, 2, true).split(",")[1] ?? 0);
          const bound = 100 * w + 10 * t;
          const first = x.flatMap((v, i) =>
            Math.floor(v / 100) < w ||
            (Math.floor(v / 100) === w && frac(v) < frac(bound))
              ? [String(i + 1)]
              : [],
          );
          const wrong = x.flatMap((v, i) => (v > bound ? [String(i + 1)] : []));
          return wrong.join() === first.join() ? null : wrong;
        },
      ],
    ],
    extra: ([w = 0, t = 0, ...x]) => ({
      bound: dec(10 * w + t, 1),
      bound0: dec(100 * w + 10 * t, 2),
      f1: dec(x[0] ?? 0, 2, true),
      f2: dec(x[1] ?? 0, 2, true),
      f3: dec(x[2] ?? 0, 2, true),
      f4: dec(x[3] ?? 0, 2, true),
      list0: x.map((v) => dec(v, 2)).join("; "),
    }),
    consts: [1, 2, 3, 4],
  }),
  d1({
    id: "D1.place-value.18",
    form: "round-a-decimal-to-tenths",
    groups: [8, 8],
    kind: "decimal",
    draw: (r) => [between(r, 1, 19), between(r, 1, 9), between(r, 1, 9)],
    solve: ([w = 0, t = 0, h = 0]) => qd(10 * w + t + (h >= 5 ? 1 : 0), 1),
    ref: ([w = 0, t = 0, h = 0]) =>
      Q.of(BigInt(Math.floor((100 * w + 10 * t + h + 5) / 10)), 10n),
    traps: [
      [
        "cut-off",
        "procedural",
        ([w = 0, t = 0, h = 0]) => (h >= 5 ? qd(10 * w + t, 1) : null),
      ],
      [
        "always-up",
        "procedural",
        ([w = 0, t = 0, h = 0]) => (h < 5 ? qd(10 * w + t + 1, 1) : null),
      ],
      [
        "rounded-to-whole",
        "conceptual",
        ([w = 0, t = 0, h = 0]) => {
          const whole = Math.floor((100 * w + 10 * t + h + 50) / 100);
          const x = q(whole);
          return x.eq(qd(10 * w + t + (h >= 5 ? 1 : 0), 1)) ||
            x.eq(qd(10 * w + t, 1)) ||
            x.eq(qd(10 * w + t + 1, 1))
            ? null
            : x;
        },
      ],
      [
        "carry-lost",
        "procedural",
        ([w = 0, t = 0, h = 0]) =>
          t === 9 && h >= 5 ? qd(10 * w + 1, 1) : null,
      ],
    ],
    extra: ([w = 0, t = 0, h = 0]) => ({
      n: dec(100 * w + 10 * t + h, 2),
      t: dec(10 * w + t, 1),
      up: h >= 5 ? dec(1, 1) : "0",
    }),
  }),
  d1({
    id: "D1.place-value.19",
    form: "how-many-hundredths-lie-between-two-tenths",
    groups: [6, 8],
    origin: {
      olympiad:
        "counting the numbers strictly between two ends, a fence-post count in the style of Kangaroo (RES-4282)",
    },
    kind: "integer",
    draw: (r) => [between(r, 0, 9), between(r, 1, 9), between(r, 1, 6)],
    solve: ([, , g = 0]) => q(10 * g - 1),
    ref: ([w = 0, t = 0, g = 0]) => {
      const lo = 10 * (10 * w + t);
      let count = 0;
      for (let x = lo + 1; x < lo + 10 * g; x += 1) count += 1;
      return q(count);
    },
    traps: [
      ["count-of-steps", "conceptual", ([, , g = 0]) => q(10 * g)],
      ["ends-included", "conceptual", ([, , g = 0]) => q(10 * g + 1)],
      ["tenths-only", "conceptual", ([, , g = 0]) => q(g - 1)],
    ],
    extra: ([w = 0, t = 0, g = 0]) => ({
      f: dec(10 * w + t, 1),
      g: dec(10 * w + t + g, 1),
      lo: String(10 * (10 * w + t)),
      hi: String(10 * (10 * w + t) + 10 * g),
    }),
    consts: [1],
  }),
  d1({
    id: "D1.place-value.20",
    form: "the-largest-minus-the-smallest-decimal-from-three-digits",
    groups: [6, 8],
    origin: {
      olympiad:
        "largest minus smallest number made of the same digits, the middle digit cancels (RES-4282)",
    },
    kind: "decimal",
    draw: (r) => {
      const a = between(r, 1, 7);
      const b = between(r, a + 1, 8);
      return [a, b, between(r, b + 1, 9)];
    },
    solve: ([a = 0, , c = 0]) => qd(99 * (c - a), 2),
    ref: ([a = 0, b = 0, c = 0]) =>
      qd(100 * c + 10 * b + a, 2).sub(qd(100 * a + 10 * b + c, 2)),
    traps: [
      [
        "tails-both-descending",
        "procedural",
        ([a = 0, b = 0, c = 0]) =>
          qd(100 * c + 10 * b + a - (100 * a + 10 * c + b), 2),
      ],
      ["wholes-only", "conceptual", ([a = 0, , c = 0]) => q(c - a)],
      [
        "smaller-from-larger-column",
        "procedural",
        ([a = 0, , c = 0]) => qd(101 * (c - a), 2),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0]) => ({
      hi: dec(100 * c + 10 * b + a, 2),
      lo: dec(100 * a + 10 * b + c, 2),
    }),
  }),
];

/** The pairs of four listed items, by position. */
const PAIRS: readonly (readonly [number, number])[] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 2],
  [1, 3],
  [2, 3],
];

const d2 = forFraction("D2", "add-sub");
const addSub = [
  d2({
    id: "D2.add-sub.01",
    form: "the-sum-of-two-prices",
    groups: [6, 6],
    kind: "decimal",
    draw: (r) => [between(r, 111, 899), between(r, 111, 899)],
    valid: ([a = 0, b = 0]) => a % 10 !== 0 && b % 10 !== 0,
    solve: ([a = 0, b = 0]) => qd(a + b, 2),
    ref: ([a = 0, b = 0]) => qd(a, 2).add(qd(b, 2)),
    traps: [
      ["comma-ignored", "procedural", ([a = 0, b = 0]) => q(a + b)],
      [
        "carry-forgotten",
        "procedural",
        ([a = 0, b = 0]) => qd(noCarry(a, b), 2),
      ],
      [
        "cents-written-whole",
        "conceptual",
        ([a = 0, b = 0]) =>
          (a % 100) + (b % 100) < 100
            ? null
            : qd(
                1000 * (Math.floor(a / 100) + Math.floor(b / 100)) +
                  (a % 100) +
                  (b % 100),
                3,
              ),
      ],
    ],
    extra: ([a = 0, b = 0]) => ({ x: dec(a, 2), y: dec(b, 2) }),
  }),
  d2({
    id: "D2.add-sub.02",
    form: "the-difference-of-two-prices",
    groups: [6, 6],
    kind: "decimal",
    draw: (r) => [between(r, 411, 999), between(r, 111, 399)],
    valid: ([a = 0, b = 0]) => a % 10 !== 0 && b % 10 !== 0,
    solve: ([a = 0, b = 0]) => qd(a - b, 2),
    ref: ([a = 0, b = 0]) => qd(a, 2).sub(qd(b, 2)),
    traps: [
      ["added", "procedural", ([a = 0, b = 0]) => qd(a + b, 2)],
      [
        "column-smaller-from-larger",
        "procedural",
        ([a = 0, b = 0]) => qd(noBorrow(a, b), 2),
      ],
      ["comma-ignored", "procedural", ([a = 0, b = 0]) => q(a - b)],
    ],
    extra: ([a = 0, b = 0]) => ({ x: dec(a, 2), y: dec(b, 2) }),
  }),
  d2({
    id: "D2.add-sub.03",
    form: "a-till-receipt-with-three-amounts",
    groups: [6, 6],
    kind: "decimal",
    draw: (r) => [
      between(r, 111, 599),
      between(r, 111, 599),
      between(r, 111, 599),
    ],
    valid: ([a = 0, b = 0, c = 0]) =>
      a % 10 !== 0 && b % 10 !== 0 && c % 10 !== 0,
    solve: ([a = 0, b = 0, c = 0]) => qd(a + b + c, 2),
    ref: ([a = 0, b = 0, c = 0]) => qd(c, 2).add(qd(b, 2)).add(qd(a, 2)),
    traps: [
      ["two-amounts-only", "procedural", ([a = 0, b = 0]) => qd(a + b, 2)],
      ["comma-ignored", "procedural", ([a = 0, b = 0, c = 0]) => q(a + b + c)],
      [
        "carry-forgotten",
        "procedural",
        ([a = 0, b = 0, c = 0]) => qd(noCarry(noCarry(a, b), c), 2),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0]) => ({
      x: dec(a, 2),
      y: dec(b, 2),
      z: dec(c, 2),
    }),
  }),
  d2({
    id: "D2.add-sub.04",
    form: "the-change-from-a-banknote",
    groups: [6, 6],
    kind: "decimal",
    draw: (r) => [pick(r, [10, 20, 50]), between(r, 111, 999)],
    valid: ([, c = 0]) => c % 10 !== 0,
    solve: ([p = 0, c = 0]) => qd(100 * p - c, 2),
    ref: ([p = 0, c = 0]) => q(p).sub(qd(c, 2)),
    traps: [
      ["the-price-itself", "conceptual", ([, c = 0]) => qd(c, 2)],
      [
        "no-borrowing",
        "procedural",
        ([p = 0, c = 0]) => qd(100 * (p - Math.floor(c / 100)) + (c % 100), 2),
      ],
      ["added", "procedural", ([p = 0, c = 0]) => qd(100 * p + c, 2)],
    ],
    roles: { a: "banknote in euros", b: "price in cents" },
    extra: ([, c = 0]) => ({ x: dec(c, 2) }),
  }),
  d2({
    id: "D2.add-sub.05",
    form: "a-whole-number-plus-a-decimal",
    groups: [6, 6],
    kind: "decimal",
    draw: (r) => [between(r, 2, 20), between(r, 111, 499)],
    valid: ([, c = 0]) => c % 10 !== 0,
    solve: ([w = 0, c = 0]) => qd(100 * w + c, 2),
    ref: ([w = 0, c = 0]) => q(w).add(qd(c, 2)),
    traps: [
      [
        "wholes-added-to-hundredths",
        "procedural",
        ([w = 0, c = 0]) => qd(w + c, 2),
      ],
      [
        "wholes-added-to-tenths",
        "procedural",
        ([w = 0, c = 0]) => qd(10 * w + c, 2),
      ],
      ["whole-forgotten", "procedural", ([, c = 0]) => qd(c, 2)],
    ],
    extra: ([, c = 0]) => ({ y: dec(c, 2) }),
  }),
  d2({
    id: "D2.add-sub.06",
    form: "a-whole-number-minus-a-decimal",
    groups: [6, 6],
    kind: "decimal",
    draw: (r) => [between(r, 4, 9), between(r, 111, 399)],
    valid: ([w = 0, c = 0]) => c % 10 !== 0 && c % 100 !== 0 && 100 * w > c,
    solve: ([w = 0, c = 0]) => qd(100 * w - c, 2),
    ref: ([w = 0, c = 0]) => q(w).sub(qd(c, 2)),
    traps: [
      [
        "no-borrowing",
        "procedural",
        ([w = 0, c = 0]) => qd(100 * (w - Math.floor(c / 100)) + (c % 100), 2),
      ],
      [
        "borrow-not-taken-off",
        "procedural",
        ([w = 0, c = 0]) =>
          qd(100 * (w - Math.floor(c / 100)) + 100 - (c % 100), 2),
      ],
      ["added", "procedural", ([w = 0, c = 0]) => qd(100 * w + c, 2)],
    ],
    extra: ([, c = 0]) => ({ y: dec(c, 2) }),
  }),
  d2({
    id: "D2.add-sub.07",
    form: "amounts-that-make-a-round-sum",
    groups: [6, 6],
    kind: "decimal",
    draw: (r) => [
      between(r, 1, 8),
      between(r, 1, 8),
      between(r, 11, 89),
      between(r, 1, 8),
      between(r, 1, 8),
      between(r, 11, 89),
    ],
    valid: ([, , c1 = 0, , , c2 = 0]) =>
      c1 % 10 !== 0 && c2 % 10 !== 0 && c1 !== c2,
    solve: ([k1 = 0, k2 = 0, , k3 = 0, k4 = 0]) => q(k1 + k2 + k3 + k4 + 2),
    ref: ([k1 = 0, k2 = 0, c1 = 0, k3 = 0, k4 = 0, c2 = 0]) =>
      qd(100 * k1 + c1, 2)
        .add(qd(100 * k2 + 100 - c1, 2))
        .add(qd(100 * k3 + c2, 2))
        .add(qd(100 * k4 + 100 - c2, 2)),
    traps: [
      [
        "cents-dropped",
        "procedural",
        ([k1 = 0, k2 = 0, , k3 = 0, k4 = 0]) => q(k1 + k2 + k3 + k4),
      ],
      [
        "one-carry-forgotten",
        "procedural",
        ([k1 = 0, k2 = 0, , k3 = 0, k4 = 0]) => q(k1 + k2 + k3 + k4 + 1),
      ],
      [
        "comma-ignored",
        "procedural",
        ([k1 = 0, k2 = 0, , k3 = 0, k4 = 0]) =>
          q(100 * (k1 + k2 + k3 + k4 + 2)),
      ],
    ],
    extra: ([k1 = 0, k2 = 0, c1 = 0, k3 = 0, k4 = 0, c2 = 0]) => ({
      w: dec(100 * k1 + c1, 2),
      x: dec(100 * k2 + 100 - c1, 2),
      y: dec(100 * k3 + c2, 2),
      z: dec(100 * k4 + 100 - c2, 2),
    }),
  }),
  d2({
    id: "D2.add-sub.08",
    form: "two-tenths-with-a-sum-above-one",
    groups: [6, 6],
    kind: "decimal",
    draw: (r) => [between(r, 5, 9), between(r, 5, 9)],
    valid: ([a = 0, b = 0]) => a + b > 10,
    solve: ([a = 0, b = 0]) => qd(a + b, 1),
    ref: ([a = 0, b = 0]) => qd(a, 1).add(qd(b, 1)),
    traps: [
      [
        "digits-side-by-side",
        "conceptual",
        ([a = 0, b = 0]) => qd(10 * a + b, 2),
      ],
      ["carry-lost", "procedural", ([a = 0, b = 0]) => qd((a + b) % 10, 1)],
      ["sum-as-hundredths", "conceptual", ([a = 0, b = 0]) => qd(a + b, 2)],
    ],
    extra: ([a = 0, b = 0]) => ({ x: dec(a, 1), y: dec(b, 1) }),
  }),
  d2({
    id: "D2.add-sub.09",
    form: "decimals-with-different-numbers-of-places",
    groups: [6, 6],
    kind: "decimal",
    draw: (r) => [between(r, 11, 49), between(r, 11, 99)],
    valid: ([a = 0, b = 0]) => a % 10 !== 0 && b % 10 !== 0,
    solve: ([a = 0, b = 0]) => qd(10 * a + b, 2),
    ref: ([a = 0, b = 0]) => qd(a, 1).add(qd(b, 2)),
    traps: [
      ["places-not-aligned", "procedural", ([a = 0, b = 0]) => qd(a + b, 2)],
      [
        "zero-inserted",
        "procedural",
        ([a = 0, b = 0]) => qd(100 * Math.floor(a / 10) + (a % 10) + b, 2),
      ],
      [
        "hundredths-ignored",
        "procedural",
        ([a = 0, b = 0]) => qd(a + Math.floor(b / 10), 1),
      ],
    ],
    extra: ([a = 0, b = 0]) => ({ x: dec(a, 1), y: dec(b, 2) }),
  }),
  d2({
    id: "D2.add-sub.10",
    form: "a-missing-decimal-addend",
    groups: [6, 6],
    kind: "decimal",
    draw: (r) => [between(r, 111, 399), between(r, 111, 399)],
    valid: ([a = 0, b = 0]) => a % 10 !== 0 && b % 10 !== 0,
    solve: ([, b = 0]) => qd(b, 2),
    ref: ([a = 0, b = 0]) => qd(a + b, 2).sub(qd(a, 2)),
    traps: [
      ["added", "procedural", ([a = 0, b = 0]) => qd(a + b, 2)],
      [
        "both-numbers-added",
        "procedural",
        ([a = 0, b = 0]) => qd(2 * a + b, 2),
      ],
      [
        "column-smaller-from-larger",
        "procedural",
        ([a = 0, b = 0]) => qd(noBorrow(a + b, a), 2),
      ],
    ],
    extra: ([a = 0, b = 0]) => ({ x: dec(a, 2), s: dec(a + b, 2) }),
  }),
  d2({
    id: "D2.add-sub.11",
    form: "how-much-dearer-is-one-item",
    groups: [6, 6],
    kind: "decimal",
    draw: (r) => [
      between(r, 111, 999),
      between(r, 111, 999),
      between(r, 111, 999),
    ],
    valid: ([a = 0, b = 0, c = 0]) =>
      new Set([a, b, c]).size === 3 &&
      a % 10 !== 0 &&
      b % 10 !== 0 &&
      c % 10 !== 0,
    solve: (v) => qd(Math.max(...v) - Math.min(...v), 2),
    ref: (v) => {
      const [lo = 0, , hi = 0] = [...v].sort((x, y) => x - y);
      return qd(hi, 2).sub(qd(lo, 2));
    },
    traps: [
      [
        "the-first-two-only",
        "conceptual",
        ([a = 0, b = 0, c = 0]) => {
          const mid = [a, b, c].sort((x, y) => x - y)[1] ?? 0;
          const wrong = Math.abs(a - b);
          return wrong === Math.max(a, b, c) - Math.min(a, b, c) ||
            wrong === Math.max(a, b, c) - mid
            ? null
            : qd(wrong, 2);
        },
      ],
      [
        "dearest-plus-cheapest",
        "procedural",
        (v) => qd(Math.max(...v) + Math.min(...v), 2),
      ],
      [
        "the-middle-price-used",
        "conceptual",
        ([a = 0, b = 0, c = 0]) =>
          qd(Math.max(a, b, c) - ([a, b, c].sort((x, y) => x - y)[1] ?? 0), 2),
      ],
    ],
    roles: { a: "first price", b: "second price", c: "third price" },
    extra: ([a = 0, b = 0, c = 0]) => ({
      x: dec(a, 2),
      y: dec(b, 2),
      z: dec(c, 2),
      big: dec(Math.max(a, b, c), 2),
      small: dec(Math.min(a, b, c), 2),
      bc: String(Math.max(a, b, c)),
      sc: String(Math.min(a, b, c)),
    }),
  }),
  d2({
    id: "D2.add-sub.12",
    form: "the-total-weight-of-three-parcels",
    groups: [6, 6],
    kind: "decimal",
    draw: (r) => [between(r, 2, 9), between(r, 111, 499), between(r, 1, 9)],
    valid: ([, h = 0]) => h % 10 !== 0,
    solve: ([w = 0, h = 0, t = 0]) => qd(100 * w + h + 10 * t, 2),
    ref: ([w = 0, h = 0, t = 0]) => qd(t, 1).add(qd(h, 2)).add(q(w)),
    traps: [
      [
        "two-parcels-only",
        "procedural",
        ([w = 0, h = 0]) => qd(100 * w + h, 2),
      ],
      [
        "tenths-as-hundredths",
        "conceptual",
        ([w = 0, h = 0, t = 0]) => qd(100 * w + h + t, 2),
      ],
      ["comma-ignored", "procedural", ([w = 0, h = 0, t = 0]) => q(w + h + t)],
    ],
    roles: {
      a: "weight of the first parcel in kilograms",
      b: "weight of the second parcel in hundredths of a kilogram",
      c: "weight of the third parcel in tenths of a kilogram",
    },
    extra: ([w = 0, h = 0, t = 0]) => ({
      x: String(w),
      y: dec(h, 2),
      z: dec(t, 1),
      x0: dec(100 * w, 2),
      z0: dec(10 * t, 2),
    }),
  }),
  d2({
    id: "D2.add-sub.13",
    form: "round-each-price-to-whole-euros-and-add",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [
      between(r, 3, 60),
      between(r, 11, 99),
      between(r, 3, 60),
      between(r, 11, 99),
      between(r, 3, 60),
      between(r, 11, 99),
    ],
    valid: ([, c1 = 0, , c2 = 0, , c3 = 0]) =>
      [c1, c2, c3].every((c) => c !== 50 && c % 10 !== 0) &&
      [c1, c2, c3].some((c) => c > 50) &&
      [c1, c2, c3].some((c) => c < 50),
    solve: ([e1 = 0, c1 = 0, e2 = 0, c2 = 0, e3 = 0, c3 = 0]) =>
      q(e1 + e2 + e3 + [c1, c2, c3].filter((c) => c > 50).length),
    ref: ([e1 = 0, c1 = 0, e2 = 0, c2 = 0, e3 = 0, c3 = 0]) =>
      [100 * e1 + c1, 100 * e2 + c2, 100 * e3 + c3]
        .map((h) => q(Math.floor((h + 50) / 100)))
        .reduce((x, y) => x.add(y), q(0)),
    traps: [
      [
        "cut-each",
        "procedural",
        ([e1 = 0, , e2 = 0, , e3 = 0]) => q(e1 + e2 + e3),
      ],
      [
        "rounded-up-each",
        "procedural",
        ([e1 = 0, , e2 = 0, , e3 = 0]) => q(e1 + e2 + e3 + 3),
      ],
      [
        "rounded-the-total",
        "conceptual",
        ([e1 = 0, c1 = 0, e2 = 0, c2 = 0, e3 = 0, c3 = 0]) => {
          const total = 100 * (e1 + e2 + e3) + c1 + c2 + c3;
          const wrong = Math.floor((total + 50) / 100);
          const right =
            e1 + e2 + e3 + [c1, c2, c3].filter((c) => c > 50).length;
          return wrong === right || wrong === e1 + e2 + e3 ? null : q(wrong);
        },
      ],
    ],
    roles: {
      a: "euros of the first price",
      c: "euros of the second price",
      e: "euros of the third price",
    },
    extra: ([e1 = 0, c1 = 0, e2 = 0, c2 = 0, e3 = 0, c3 = 0]) => ({
      x: dec(100 * e1 + c1, 2),
      y: dec(100 * e2 + c2, 2),
      z: dec(100 * e3 + c3, 2),
      x1: String(e1 + (c1 > 50 ? 1 : 0)),
      y1: String(e2 + (c2 > 50 ? 1 : 0)),
      z1: String(e3 + (c3 > 50 ? 1 : 0)),
    }),
  }),
  d2({
    id: "D2.add-sub.14",
    form: "money-left-after-two-purchases",
    groups: [6, 6],
    kind: "decimal",
    draw: (r) => [
      pick(r, [20, 30, 50, 100]),
      between(r, 211, 899),
      between(r, 211, 899),
    ],
    valid: ([, p1 = 0, p2 = 0]) => p1 % 10 !== 0 && p2 % 10 !== 0,
    solve: ([a = 0, p1 = 0, p2 = 0]) => qd(100 * a - p1 - p2, 2),
    ref: ([a = 0, p1 = 0, p2 = 0]) => q(a).sub(qd(p1, 2)).sub(qd(p2, 2)),
    traps: [
      [
        "second-purchase-forgotten",
        "procedural",
        ([a = 0, p1 = 0]) => qd(100 * a - p1, 2),
      ],
      ["spent-only", "conceptual", ([, p1 = 0, p2 = 0]) => qd(p1 + p2, 2)],
      [
        "added",
        "procedural",
        ([a = 0, p1 = 0, p2 = 0]) => qd(100 * a + p1 + p2, 2),
      ],
      [
        "no-borrowing",
        "procedural",
        ([a = 0, p1 = 0, p2 = 0]) =>
          qd(100 * (a - Math.floor((p1 + p2) / 100)) + ((p1 + p2) % 100), 2),
      ],
    ],
    roles: {
      a: "money on the account in euros",
      b: "first purchase in cents",
      c: "second purchase in cents",
    },
    extra: ([, p1 = 0, p2 = 0]) => ({
      x: dec(p1, 2),
      y: dec(p2, 2),
      s: dec(p1 + p2, 2),
    }),
  }),
  d2({
    id: "D2.add-sub.15",
    form: "the-hidden-tenths-digit-of-an-addend",
    groups: [6, 8],
    origin: {
      olympiad:
        "a hidden digit in a decimal sum, after MCCME 2023 task 7.1 (RES-4282)",
    },
    kind: "integer",
    draw: (r) => [
      between(r, 1, 4),
      between(r, 1, 9),
      between(r, 1, 9),
      between(r, 1, 4),
      between(r, 0, 9),
      between(r, 1, 9),
    ],
    solve: ([, t = 0]) => q(t),
    ref: ([w1 = 0, t1 = 0, h1 = 0, w2 = 0, t2 = 0, h2 = 0]) => {
      const first = 100 * w1 + 10 * t1 + h1;
      const total = first + 100 * w2 + 10 * t2 + h2;
      return q(Math.floor(((total - (100 * w2 + 10 * t2 + h2)) % 100) / 10));
    },
    traps: [
      [
        "tenths-of-the-sum",
        "conceptual",
        ([w1 = 0, t1 = 0, h1 = 0, w2 = 0, t2 = 0, h2 = 0]) => {
          const total = 100 * (w1 + w2) + 10 * (t1 + t2) + h1 + h2;
          const wrong = Math.floor((total % 100) / 10);
          return wrong === t1 || wrong === (t1 + 1) % 10 ? null : q(wrong);
        },
      ],
      [
        "borrow-forgotten",
        "procedural",
        ([, t1 = 0, h1 = 0, , , h2 = 0]) =>
          h1 + h2 >= 10 ? q((t1 + 1) % 10) : null,
      ],
      [
        "tenths-of-the-other-addend",
        "conceptual",
        ([w1 = 0, t1 = 0, h1 = 0, w2 = 0, t2 = 0, h2 = 0]) => {
          const total = 100 * (w1 + w2) + 10 * (t1 + t2) + h1 + h2;
          const sumTenths = Math.floor((total % 100) / 10);
          return t2 === t1 ||
            t2 === sumTenths ||
            (h1 + h2 >= 10 && t2 === (t1 + 1) % 10)
            ? null
            : q(t2);
        },
      ],
    ],
    extra: ([w1 = 0, t1 = 0, h1 = 0, w2 = 0, t2 = 0, h2 = 0]) => {
      const first = 100 * w1 + 10 * t1 + h1;
      const second = 100 * w2 + 10 * t2 + h2;
      return {
        x: `${w1},?${h1}`,
        y: dec(second, 2),
        s: dec(first + second, 2),
        full: dec(first, 2),
      };
    },
  }),
  d2({
    id: "D2.add-sub.16",
    form: "the-sum-of-tenths-in-a-row",
    groups: [6, 8],
    origin: {
      olympiad:
        "pairing the first and the last term, a Gauss sum with decimals (RES-4282)",
    },
    kind: "decimal",
    draw: (r) => [between(r, 8, 29)],
    solve: ([k = 0]) => qd((k * (k + 1)) / 2, 1),
    ref: ([k = 0]) =>
      Array.from({ length: k }, (_, i) => qd(i + 1, 1)).reduce(
        (x, y) => x.add(y),
        q(0),
      ),
    traps: [
      ["forgot-to-halve", "procedural", ([k = 0]) => qd(k * (k + 1), 1)],
      ["count-times-last", "conceptual", ([k = 0]) => qd(k * k, 1)],
    ],
    extra: ([k = 0]) => ({
      f1: dec(1, 1),
      f2: dec(2, 1),
      f3: dec(3, 1),
      last: dec(k, 1),
      pair: dec(k + 1, 1, true),
      k: String(k),
    }),
  }),
  d2({
    id: "D2.add-sub.17",
    form: "choose-the-two-prices-with-a-given-total",
    groups: [6, 7],
    kind: "set",
    draw: (r) => [
      between(r, 150, 600),
      between(r, 150, 600),
      between(r, 150, 600),
      between(r, 150, 600),
      r.int(PAIRS.length),
    ],
    valid: ([a = 0, b = 0, c = 0, d = 0]) => {
      const x = [a, b, c, d];
      const sums = PAIRS.map(([i = 0, j = 0]) => (x[i] ?? 0) + (x[j] ?? 0));
      return (
        x.every((v) => v % 10 !== 0) &&
        new Set(x).size === 4 &&
        new Set(sums).size === 6
      );
    },
    options: () => ["1", "2", "3", "4"],
    solve: ([, , , , k = 0]) => (PAIRS[k] ?? [0, 1]).map((i) => String(i + 1)),
    ref: ([a = 0, b = 0, c = 0, d = 0, k = 0]) => {
      const x = [a, b, c, d];
      const [i = 0, j = 0] = PAIRS[k] ?? [0, 1];
      const target = (x[i] ?? 0) + (x[j] ?? 0);
      const found = PAIRS.filter(
        ([m = 0, n = 0]) => (x[m] ?? 0) + (x[n] ?? 0) === target,
      )[0];
      return (found ?? [0, 1]).map((m) => String(m + 1));
    },
    traps: [
      [
        "the-two-largest",
        "conceptual",
        ([a = 0, b = 0, c = 0, d = 0, k = 0]) => {
          const x = [a, b, c, d];
          const order = [0, 1, 2, 3].sort((m, n) => (x[n] ?? 0) - (x[m] ?? 0));
          const wrong = order
            .slice(0, 2)
            .sort((m, n) => m - n)
            .map((m) => String(m + 1));
          return wrong.join() ===
            (PAIRS[k] ?? []).map((m) => String(m + 1)).join()
            ? null
            : wrong;
        },
      ],
      [
        "euros-only-match",
        "conceptual",
        ([a = 0, b = 0, c = 0, d = 0, k = 0]) => {
          const x = [a, b, c, d];
          const [i = 0, j = 0] = PAIRS[k] ?? [0, 1];
          const target = Math.floor(((x[i] ?? 0) + (x[j] ?? 0)) / 100);
          const order = [0, 1, 2, 3].sort((m, n) => (x[n] ?? 0) - (x[m] ?? 0));
          const largest = order
            .slice(0, 2)
            .sort((m, n) => m - n)
            .join();
          const found = PAIRS.find(
            ([m = 0, n = 0]) =>
              (m !== i || n !== j) &&
              Math.floor(((x[m] ?? 0) + (x[n] ?? 0)) / 100) === target &&
              [m, n].join() !== largest,
          );
          return found ? found.map((m) => String(m + 1)) : null;
        },
      ],
    ],
    roles: {
      a: "first price in cents",
      b: "second price in cents",
      c: "third price in cents",
      d: "fourth price in cents",
    },
    extra: ([a = 0, b = 0, c = 0, d = 0, k = 0]) => {
      const x = [a, b, c, d];
      const [i = 0, j = 0] = PAIRS[k] ?? [0, 1];
      return {
        s: dec((x[i] ?? 0) + (x[j] ?? 0), 2),
        f1: dec(a, 2),
        f2: dec(b, 2),
        f3: dec(c, 2),
        f4: dec(d, 2),
        fi: dec(x[i] ?? 0, 2),
        fj: dec(x[j] ?? 0, 2),
      };
    },
    consts: [1, 2, 3, 4],
  }),
];

const d3 = forFraction("D3", "shift-10");
const shift = [
  d3({
    id: "D3.shift-10.01",
    form: "a-tenths-decimal-times-ten",
    groups: [6, 7],
    kind: "decimal",
    draw: (r) => [between(r, 11, 99)],
    valid: ([t = 0]) => t % 10 !== 0,
    solve: ([t = 0]) => q(t),
    ref: ([t = 0]) => qd(t, 1).mul(q(10)),
    traps: [
      ["comma-not-moved", "procedural", ([t = 0]) => qd(t, 1)],
      ["moved-the-wrong-way", "procedural", ([t = 0]) => qd(t, 2)],
      ["moved-two-places", "procedural", ([t = 0]) => q(10 * t)],
      ["ten-added", "procedural", ([t = 0]) => qd(t + 100, 1)],
    ],
    extra: ([t = 0]) => ({ x: dec(t, 1) }),
    consts: [10],
  }),
  d3({
    id: "D3.shift-10.02",
    form: "a-hundredths-decimal-times-a-hundred",
    groups: [6, 7],
    kind: "decimal",
    draw: (r) => [between(r, 111, 999)],
    valid: ([h = 0]) => h % 10 !== 0,
    solve: ([h = 0]) => q(h),
    ref: ([h = 0]) => qd(h, 2).mul(q(100)),
    traps: [
      ["moved-one-place", "procedural", ([h = 0]) => qd(h, 1)],
      ["comma-not-moved", "procedural", ([h = 0]) => qd(h, 2)],
      ["moved-three-places", "procedural", ([h = 0]) => q(10 * h)],
    ],
    extra: ([h = 0]) => ({ x: dec(h, 2) }),
    consts: [100],
  }),
  d3({
    id: "D3.shift-10.03",
    form: "a-hundredths-decimal-times-a-thousand",
    groups: [6, 7],
    kind: "decimal",
    draw: (r) => [between(r, 111, 999)],
    valid: ([h = 0]) => h % 10 !== 0,
    solve: ([h = 0]) => q(10 * h),
    ref: ([h = 0]) => qd(h, 2).mul(q(1000)),
    traps: [
      ["moved-two-places", "procedural", ([h = 0]) => q(h)],
      ["comma-not-moved", "procedural", ([h = 0]) => qd(h, 2)],
      ["moved-one-place", "procedural", ([h = 0]) => qd(h, 1)],
    ],
    extra: ([h = 0]) => ({ x: dec(h, 2) }),
    consts: [1000],
  }),
  d3({
    id: "D3.shift-10.04",
    form: "a-whole-number-divided-by-ten",
    groups: [6, 7],
    kind: "decimal",
    draw: (r) => [between(r, 11, 99)],
    valid: ([n = 0]) => n % 10 !== 0,
    solve: ([n = 0]) => qd(n, 1),
    ref: ([n = 0]) => q(n).div(q(10)),
    traps: [
      ["moved-the-wrong-way", "procedural", ([n = 0]) => q(10 * n)],
      ["comma-not-moved", "procedural", ([n = 0]) => q(n)],
      ["moved-two-places", "procedural", ([n = 0]) => qd(n, 2)],
    ],
    consts: [10],
  }),
  d3({
    id: "D3.shift-10.05",
    form: "a-whole-number-divided-by-a-hundred",
    groups: [6, 7],
    kind: "decimal",
    draw: (r) => [between(r, 111, 999)],
    valid: ([n = 0]) => n % 10 !== 0,
    solve: ([n = 0]) => qd(n, 2),
    ref: ([n = 0]) => q(n).div(q(100)),
    traps: [
      ["moved-one-place", "procedural", ([n = 0]) => qd(n, 1)],
      ["comma-not-moved", "procedural", ([n = 0]) => q(n)],
      ["moved-three-places", "procedural", ([n = 0]) => qd(n, 3)],
    ],
    consts: [100],
  }),
  d3({
    id: "D3.shift-10.06",
    form: "a-hundredths-decimal-times-ten",
    groups: [6, 7],
    kind: "decimal",
    draw: (r) => [between(r, 111, 999)],
    valid: ([h = 0]) => h % 10 !== 0,
    solve: ([h = 0]) => qd(h, 1),
    ref: ([h = 0]) => qd(h, 2).mul(q(10)),
    traps: [
      ["moved-two-places", "procedural", ([h = 0]) => q(h)],
      ["comma-not-moved", "procedural", ([h = 0]) => qd(h, 2)],
      ["moved-the-wrong-way", "procedural", ([h = 0]) => qd(h, 3)],
    ],
    extra: ([h = 0]) => ({ x: dec(h, 2) }),
    consts: [10],
  }),
  d3({
    id: "D3.shift-10.07",
    form: "centimetres-as-metres",
    groups: [6, 7],
    roles: { a: "length in centimetres" },
    kind: "decimal",
    draw: (r) => [between(r, 105, 950)],
    valid: ([n = 0]) => n % 10 !== 0,
    solve: ([n = 0]) => qd(n, 2),
    ref: ([n = 0]) => q(n).div(q(100)),
    traps: [
      ["moved-one-place", "procedural", ([n = 0]) => qd(n, 1)],
      ["moved-three-places", "procedural", ([n = 0]) => qd(n, 3)],
      ["multiplied", "procedural", ([n = 0]) => q(100 * n)],
    ],
    consts: [100],
  }),
  d3({
    id: "D3.shift-10.08",
    form: "kilometres-as-metres",
    groups: [6, 7],
    roles: { a: "distance in hundredths of a kilometre" },
    kind: "integer",
    draw: (r) => [between(r, 11, 99)],
    valid: ([h = 0]) => h % 10 !== 0,
    solve: ([h = 0]) => q(10 * h),
    ref: ([h = 0]) => qd(h, 2).mul(q(1000)),
    traps: [
      ["moved-two-places", "procedural", ([h = 0]) => q(h)],
      ["comma-ignored", "procedural", ([h = 0]) => q(1000 * h)],
      ["moved-four-places", "procedural", ([h = 0]) => q(100 * h)],
    ],
    extra: ([h = 0]) => ({ x: dec(h, 2) }),
    consts: [1000],
  }),
  d3({
    id: "D3.shift-10.09",
    form: "a-decimal-divided-by-ten",
    groups: [6, 7],
    kind: "decimal",
    draw: (r) => [between(r, 11, 99)],
    valid: ([t = 0]) => t % 10 !== 0,
    solve: ([t = 0]) => qd(t, 2),
    ref: ([t = 0]) => qd(t, 1).div(q(10)),
    traps: [
      ["comma-not-moved", "procedural", ([t = 0]) => qd(t, 1)],
      ["moved-the-wrong-way", "procedural", ([t = 0]) => q(t)],
      ["moved-two-places", "procedural", ([t = 0]) => qd(t, 3)],
    ],
    extra: ([t = 0]) => ({ x: dec(t, 1) }),
    consts: [10],
  }),
  d3({
    id: "D3.shift-10.10",
    form: "how-many-times-bigger",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [between(r, 11, 99), between(r, 1, 3)],
    valid: ([h = 0]) => h % 10 !== 0,
    solve: ([, k = 0]) => q(10 ** k),
    ref: ([, k = 0]) => qd(1, 0).mul(q(10 ** k)),
    traps: [
      ["one-zero-too-few", "conceptual", ([, k = 0]) => q(10 ** (k - 1))],
      ["one-zero-too-many", "conceptual", ([, k = 0]) => q(10 ** (k + 1))],
      [
        "number-of-places",
        "conceptual",
        ([, k = 0]) => (k === 1 ? null : q(k)),
      ],
    ],
    extra: ([h = 0, k = 0]) => ({ x: dec(h, 1), y: String(h * 10 ** (k - 1)) }),
    consts: [1, 10, 100, 1000],
  }),
  d3({
    id: "D3.shift-10.11",
    form: "the-missing-factor-that-moves-the-comma",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [between(r, 111, 999), between(r, 1, 2), between(r, 1, 3)],
    valid: ([n = 0]) => n % 10 !== 0,
    solve: ([, , k = 0]) => q(10 ** k),
    ref: ([n = 0, p = 0, k = 0]) => qd(n * 10 ** k, p).div(qd(n, p)),
    traps: [
      [
        "one-zero-too-few",
        "conceptual",
        ([, , k = 0]) => (k === 1 ? null : q(10 ** (k - 1))),
      ],
      ["one-zero-too-many", "conceptual", ([, , k = 0]) => q(10 ** (k + 1))],
      [
        "number-of-places",
        "conceptual",
        ([, , k = 0]) => (k === 1 ? null : q(k)),
      ],
    ],
    extra: ([n = 0, p = 0, k = 0]) => ({
      x: dec(n, p),
      y: dec(n * 10 ** k, p, true),
    }),
    consts: [10],
  }),
  d3({
    id: "D3.shift-10.12",
    form: "multiply-by-ten-then-divide-by-a-hundred",
    groups: [6, 7],
    kind: "decimal",
    draw: (r) => [between(r, 11, 99)],
    valid: ([t = 0]) => t % 10 !== 0,
    solve: ([t = 0]) => qd(t, 2),
    ref: ([t = 0]) => qd(t, 1).mul(q(10)).div(q(100)),
    traps: [
      ["only-the-last-step", "procedural", ([t = 0]) => qd(t, 3)],
      ["only-the-first-step", "procedural", ([t = 0]) => q(t)],
      ["shifted-the-same-way", "procedural", ([t = 0]) => q(100 * t)],
    ],
    extra: ([t = 0]) => ({ x: dec(t, 1) }),
    consts: [10, 100],
  }),
  d3({
    id: "D3.shift-10.13",
    form: "the-number-before-the-comma-was-moved",
    groups: [6, 7],
    kind: "decimal",
    draw: (r) => [between(r, 11, 999), between(r, 1, 3), between(r, 1, 2)],
    valid: ([n = 0]) => n % 10 !== 0,
    solve: ([n = 0, , p = 0]) => qd(n, p),
    ref: ([n = 0, k = 0, p = 0]) => qd(n * 10 ** k, p).div(q(10 ** k)),
    traps: [
      [
        "comma-not-moved",
        "procedural",
        ([n = 0, k = 0, p = 0]) => qd(n * 10 ** k, p),
      ],
      [
        "moved-the-wrong-way",
        "procedural",
        ([n = 0, k = 0, p = 0]) => qd(n * 10 ** (2 * k), p),
      ],
      ["one-place-too-many", "procedural", ([n = 0, , p = 0]) => qd(n, p + 1)],
      [
        "one-place-too-few",
        "procedural",
        ([n = 0, k = 0, p = 0]) => (k === 1 ? null : qd(n * 10, p)),
      ],
    ],
    roles: { a: "digits of the original number", b: "places the comma moved" },
    extra: ([n = 0, k = 0, p = 0]) => ({ y: dec(n * 10 ** k, p, true) }),
  }),
  d3({
    id: "D3.shift-10.14",
    form: "compare-two-products-by-powers-of-ten",
    groups: [6, 7],
    kind: "compare",
    draw: (r) => [
      between(r, 11, 99),
      between(r, 0, 2),
      between(r, 1, 3),
      between(r, 0, 2),
      between(r, 1, 3),
    ],
    valid: ([n = 0, a = 0, b = 0, c = 0, d = 0]) =>
      n % 10 !== 0 && (a !== c || b !== d),
    solve: ([n = 0, a = 0, b = 0, c = 0, d = 0]) =>
      sign(qd(n, a).mul(q(10 ** b)), qd(n, c).mul(q(10 ** d))),
    ref: ([, a = 0, b = 0, c = 0, d = 0]) => {
      const [left, right] = [b - a, d - c];
      return left > right ? ">" : left < right ? "<" : "=";
    },
    traps: [
      [
        "multipliers-only",
        "conceptual",
        ([n = 0, a = 0, b = 0, c = 0, d = 0]) => {
          const wrong = sign(q(10 ** b), q(10 ** d));
          return wrong ===
            sign(qd(n, a).mul(q(10 ** b)), qd(n, c).mul(q(10 ** d)))
            ? null
            : wrong;
        },
      ],
      [
        "numbers-only",
        "conceptual",
        ([n = 0, a = 0, b = 0, c = 0, d = 0]) => {
          const wrong = sign(qd(n, a), qd(n, c));
          const right = sign(
            qd(n, a).mul(q(10 ** b)),
            qd(n, c).mul(q(10 ** d)),
          );
          return wrong === right || wrong === sign(q(10 ** b), q(10 ** d))
            ? null
            : wrong;
        },
      ],
    ],
    extra: ([n = 0, a = 0, b = 0, c = 0, d = 0]) => ({
      f: `${dec(n, a, true)} × ${10 ** b}`,
      g: `${dec(n, c, true)} × ${10 ** d}`,
      u: dec(n * 10 ** b, a, true),
      w: dec(n * 10 ** d, c, true),
    }),
    consts: [10, 100, 1000],
  }),
  d3({
    id: "D3.shift-10.15",
    form: "the-price-of-a-kilogram-from-a-hundred-grams",
    groups: [6, 7],
    kind: "decimal",
    draw: (r) => [between(r, 111, 499)],
    valid: ([h = 0]) => h % 10 !== 0,
    solve: ([h = 0]) => qd(h, 1),
    ref: ([h = 0]) => qd(h, 2).mul(q(10)),
    traps: [
      ["moved-the-wrong-way", "procedural", ([h = 0]) => qd(h, 3)],
      ["moved-two-places", "procedural", ([h = 0]) => q(h)],
      ["comma-not-moved", "procedural", ([h = 0]) => qd(h, 2)],
    ],
    roles: { a: "price of 100 grams in cents" },
    extra: ([h = 0]) => ({ x: dec(h, 2) }),
    consts: [1, 100],
  }),
  d3({
    id: "D3.shift-10.16",
    form: "the-number-that-grows-when-the-comma-moves",
    groups: [7, 8],
    origin: {
      olympiad:
        "the increase when a comma moves is nine times the number, a classic of the MCCME school stage (RES-4282)",
    },
    kind: "decimal",
    draw: (r) => [between(r, 11, 99), between(r, 1, 2)],
    valid: ([n = 0]) => n % 10 !== 0,
    solve: ([n = 0, p = 0]) => qd(n, p),
    ref: ([n = 0, p = 0]) => qd(9 * n, p).div(q(9)),
    traps: [
      ["divided-by-ten", "conceptual", ([n = 0, p = 0]) => qd(9 * n, p + 1)],
      ["the-increase-itself", "conceptual", ([n = 0, p = 0]) => qd(9 * n, p)],
    ],
    extra: ([n = 0, p = 0]) => ({ y: dec(9 * n, p, true) }),
    consts: [9],
  }),
  d3({
    id: "D3.shift-10.17",
    form: "a-number-and-its-copy-with-the-comma-moved-left",
    groups: [7, 8],
    origin: {
      olympiad:
        "a sum of a number and a tenth of it, parts of a whole, MCCME style (RES-4282)",
    },
    kind: "decimal",
    draw: (r) => [between(r, 11, 99)],
    valid: ([n = 0]) => n % 10 !== 0,
    solve: ([n = 0]) => qd(n, 1),
    ref: ([n = 0]) => qd(11 * n, 2).div(qd(11, 1)),
    traps: [
      ["half-of-the-sum", "conceptual", ([n = 0]) => qd(11 * n, 2).div(q(2))],
      ["the-new-number", "conceptual", ([n = 0]) => qd(n, 2)],
    ],
    extra: ([n = 0]) => ({ y: dec(11 * n, 2), u: dec(n, 2) }),
  }),
];

export const dSpecs1: readonly Spec<never>[] = [
  ...placeValue,
  ...addSub,
  ...shift,
];
