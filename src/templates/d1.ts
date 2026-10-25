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
    traps: [["cents-part-only", "conceptual", ([, c = 0]) => q(c)]],
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
    traps: [["hundredths-digit", "conceptual", ([, , h = 0]) => q(h)]],
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
    traps: [["tenths-digit", "conceptual", ([, t = 0]) => q(t)]],
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
    traps: [["wholes-only", "conceptual", ([w = 0]) => q(w)]],
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
    ],
  }),
  d1({
    id: "D1.place-value.08",
    form: "compare-tenths-with-hundredths",
    groups: [5, 6],
    kind: "compare",
    draw: (r) => [
      between(r, 1, 9),
      between(r, 2, 9),
      between(r, 1, 9),
      between(r, 1, 9),
    ],
    valid: ([, t = 0, u = 0]) => u < t,
    solve: ([w = 0, t = 0, u = 0, x = 0]) =>
      sign(qd(10 * w + t, 1), qd(100 * w + 10 * u + x, 2)),
    ref: ([, t = 0, u = 0, x = 0]) =>
      10 * t > 10 * u + x ? ">" : 10 * t < 10 * u + x ? "<" : "=",
    traps: [
      [
        "longer-is-bigger",
        "conceptual",
        ([, t = 0, u = 0, x = 0]) => (t > 10 * u + x ? ">" : "<"),
      ],
    ],
    extra: ([w = 0, t = 0, u = 0, x = 0]) => ({
      f: dec(10 * w + t, 1),
      g: dec(100 * w + 10 * u + x, 2),
      sign: sign(qd(10 * w + t, 1), qd(100 * w + 10 * u + x, 2)),
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
      a % 10 !== 0 &&
      b % 10 !== 0 &&
      c % 10 !== 0,
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
        ([a = 0, b = 0, c = 0]) =>
          [a, b, c]
            .map((x, i) => [x, i] as const)
            .sort((p, s) => s[0] - p[0])
            .map(([, i]) => String(i + 1)),
      ],
    ],
    extra: ([a = 0, b = 0, c = 0]) => ({
      list: [dec(a, 2), dec(b, 2), dec(c, 2)].join("; "),
      sorted: [a, b, c]
        .map((x, i) => [x, i] as const)
        .sort((p, s) => p[0] - s[0])
        .map(([x]) => dec(x, 2))
        .join(" < "),
    }),
  }),
  d1({
    id: "D1.place-value.10",
    form: "write-hundredths-as-a-decimal",
    groups: [5, 6],
    kind: "decimal",
    draw: (r) => [between(r, 11, 99)],
    valid: ([a = 0]) => a % 10 !== 0,
    solve: ([a = 0]) => qd(a, 2),
    ref: ([a = 0]) => Q.fromDecimal(`0,${a}`),
    traps: [["tenths", "conceptual", ([a = 0]) => qd(a, 1)]],
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
    traps: [["face-value", "conceptual", ([, t = 0]) => q(t)]],
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
    traps: [["cut-off", "procedural", ([e = 0]) => q(e)]],
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
    ],
    extra: ([w = 0, t = 0]) => ({
      f: dec(10 * w + t, 1),
      g: dec(10 * w + t + 1, 1),
    }),
    consts: [0],
  }),
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
    traps: [["comma-ignored", "procedural", ([a = 0, b = 0]) => q(a + b)]],
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
    traps: [["added", "procedural", ([a = 0, b = 0]) => qd(a + b, 2)]],
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
    traps: [["the-price-itself", "conceptual", ([, c = 0]) => qd(c, 2)]],
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
    traps: [["added", "procedural", ([a = 0, b = 0]) => qd(a + b, 2)]],
    extra: ([a = 0, b = 0]) => ({ x: dec(a, 2), s: dec(a + b, 2) }),
  }),
  d2({
    id: "D2.add-sub.11",
    form: "how-much-dearer-is-one-item",
    groups: [6, 6],
    kind: "decimal",
    draw: (r) => [between(r, 411, 899), between(r, 111, 399)],
    valid: ([a = 0, b = 0]) => a % 10 !== 0 && b % 10 !== 0,
    solve: ([a = 0, b = 0]) => qd(a - b, 2),
    ref: ([a = 0, b = 0]) => qd(a, 2).sub(qd(b, 2)),
    traps: [["added", "procedural", ([a = 0, b = 0]) => qd(a + b, 2)]],
    extra: ([a = 0, b = 0]) => ({ x: dec(a, 2), y: dec(b, 2) }),
  }),
  d2({
    id: "D2.add-sub.12",
    form: "the-total-weight-of-three-parcels",
    groups: [6, 6],
    kind: "decimal",
    draw: (r) => [between(r, 11, 49), between(r, 11, 49), between(r, 11, 49)],
    valid: ([a = 0, b = 0, c = 0]) =>
      a % 10 !== 0 && b % 10 !== 0 && c % 10 !== 0,
    solve: ([a = 0, b = 0, c = 0]) => qd(a + b + c, 1),
    ref: ([a = 0, b = 0, c = 0]) => qd(c, 1).add(qd(a, 1)).add(qd(b, 1)),
    traps: [
      ["two-parcels-only", "procedural", ([a = 0, b = 0]) => qd(a + b, 1)],
    ],
    extra: ([a = 0, b = 0, c = 0]) => ({
      x: dec(a, 1),
      y: dec(b, 1),
      z: dec(c, 1),
    }),
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
    traps: [["moved-one-place", "procedural", ([h = 0]) => qd(h, 1)]],
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
    traps: [["moved-two-places", "procedural", ([h = 0]) => q(h)]],
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
    traps: [["moved-the-wrong-way", "procedural", ([n = 0]) => q(10 * n)]],
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
    traps: [["moved-one-place", "procedural", ([n = 0]) => qd(n, 1)]],
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
    traps: [["moved-two-places", "procedural", ([h = 0]) => q(h)]],
    extra: ([h = 0]) => ({ x: dec(h, 2) }),
    consts: [10],
  }),
  d3({
    id: "D3.shift-10.07",
    form: "centimetres-as-metres",
    groups: [6, 7],
    kind: "decimal",
    draw: (r) => [between(r, 105, 950)],
    valid: ([n = 0]) => n % 10 !== 0,
    solve: ([n = 0]) => qd(n, 2),
    ref: ([n = 0]) => q(n).div(q(100)),
    traps: [["moved-one-place", "procedural", ([n = 0]) => qd(n, 1)]],
    consts: [100],
  }),
  d3({
    id: "D3.shift-10.08",
    form: "kilometres-as-metres",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [between(r, 11, 99)],
    valid: ([h = 0]) => h % 10 !== 0,
    solve: ([h = 0]) => q(10 * h),
    ref: ([h = 0]) => qd(h, 2).mul(q(1000)),
    traps: [["moved-two-places", "procedural", ([h = 0]) => q(h)]],
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
    traps: [["comma-not-moved", "procedural", ([t = 0]) => qd(t, 1)]],
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
    ],
    extra: ([h = 0, k = 0]) => ({ x: dec(h, 1), y: String(h * 10 ** (k - 1)) }),
    consts: [1, 10, 100, 1000],
  }),
  d3({
    id: "D3.shift-10.11",
    form: "the-missing-factor-that-moves-the-comma",
    groups: [6, 7],
    kind: "integer",
    draw: (r) => [between(r, 111, 999)],
    valid: ([h = 0]) => h % 10 !== 0,
    solve: () => q(100),
    ref: ([h = 0]) => q(h).div(qd(h, 2)),
    traps: [["ten", "conceptual", () => q(10)]],
    extra: ([h = 0]) => ({ x: dec(h, 2) }),
    consts: [10, 100],
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
    traps: [["only-the-last-step", "procedural", ([t = 0]) => qd(t, 3)]],
    extra: ([t = 0]) => ({ x: dec(t, 1) }),
    consts: [10, 100],
  }),
];

export const dSpecs1: readonly Spec<never>[] = [
  ...placeValue,
  ...addSub,
  ...shift,
];
