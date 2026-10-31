// Node N8, arithmetic with negative numbers (stretch) (RES-4281). The Dutch goals keep negative
// numbers to reading, placing and comparing, so these templates are an extension from the Russian
// programme (grade 6) and stay at stretch. Texts are plain blanks in `content/tasks-n.ru.json`.
import { Q } from "../math/q.js";
import { between, qi, signed } from "./draw.js";
import { formatQ } from "../math/format.js";
import { defineSpec, type Spec } from "./spec.js";

const s = String;

const keyOf = (a: unknown): string =>
  a instanceof Q
    ? a.toString()
    : Array.isArray(a)
      ? a.map(String).join("|")
      : String(a);

/**
 * Builds a spec whose later traps give way to an earlier one with the same wrong answer, and whose
 * texts can name each trap's wrong answer as `w_<trap_id_with_underscores>`.
 */
const define = <P>(sp: Spec<P>): Spec<never> => {
  const traps = (sp.traps ?? []).map((t, i, all) => ({
    ...t,
    wrong: (p: P) => {
      const w = t.wrong(p);
      if (w === null) return null;
      for (const e of all.slice(0, i)) {
        const o = e.wrong(p);
        if (o !== null && keyOf(o) === keyOf(w)) return null;
      }
      return w;
    },
  }));
  return defineSpec<P>({
    ...sp,
    traps,
    vars: (p) => ({
      ...sp.vars(p),
      ...Object.fromEntries(
        traps.flatMap((t) => {
          const w = t.wrong(p);
          const key = `w_${t.id.replace(/-/g, "_")}`;
          return w instanceof Q
            ? [[key, formatQ(w)]]
            : typeof w === "string"
              ? [[key, w]]
              : [];
        }),
      ),
    }),
  });
};
const EXTENSION = {
  extension: "negative-number arithmetic, Russian grade 6 (RES-4281)",
};

const op = <P>(o: {
  id: string;
  subtype: "operate" | "scale-operate";
  form: string;
  draw: Spec<P>["draw"];
  valid?: Spec<P>["valid"];
  solve: Spec<P>["solve"];
  reference: Spec<P>["reference"];
  traps: Spec<P>["traps"];
  roles?: Spec<P>["roles"];
  origin?: { olympiad: string } | { extension: string };
  vars: Spec<P>["vars"];
  constants?: readonly number[];
}) =>
  define<P>({
    id: o.id,
    node: "N8",
    subtype: o.subtype,
    form: o.form,
    groups: [8, 8],
    origin: o.origin ?? EXTENSION,
    ...(o.roles ? { roles: o.roles } : {}),
    answer: "integer",
    draw: o.draw,
    ...(o.valid ? { valid: o.valid } : {}),
    solve: o.solve,
    reference: o.reference,
    ...(o.traps ? { traps: o.traps } : {}),
    vars: o.vars,
    constants: o.constants ?? [0],
  });

interface AB {
  a: number;
  b: number;
}
const ab = (p: AB) => ({ a: s(p.a), b: s(p.b) });

const operate = [
  op<AB>({
    id: "N8.operate.01",
    subtype: "operate",
    form: "negative-plus-a-larger-positive",
    draw: (r) => ({ a: between(r, 1, 20), b: between(r, 21, 40) }),
    solve: (p) => qi(-p.a + p.b),
    reference: (p) => qi(p.b - p.a),
    traps: [
      {
        id: "all-negative",
        kind: "conceptual",
        wrong: (p) => qi(-(p.a + p.b)),
      },
      { id: "sign-of-first", kind: "conceptual", wrong: (p) => qi(p.a - p.b) },
      { id: "sign-lost", kind: "conceptual", wrong: (p) => qi(p.a + p.b) },
    ],
    vars: (p) => ({ ...ab(p), r: s(p.b - p.a), w: signed(-(p.a + p.b)) }),
  }),
  op<AB>({
    id: "N8.operate.02",
    subtype: "operate",
    form: "negative-minus-a-positive",
    draw: (r) => ({ a: between(r, 1, 30), b: between(r, 1, 30) }),
    solve: (p) => qi(-p.a - p.b),
    reference: (p) => qi(-(p.a + p.b)),
    traps: [
      {
        id: "positive-result",
        kind: "conceptual",
        wrong: (p) => qi(p.a + p.b),
      },
      {
        id: "minus-became-plus",
        kind: "conceptual",
        wrong: (p) => qi(p.b - p.a),
      },
    ],
    vars: (p) => ({ ...ab(p), r: signed(-(p.a + p.b)), w: s(p.a + p.b) }),
  }),
  op<AB>({
    id: "N8.operate.03",
    subtype: "operate",
    form: "a-smaller-number-minus-a-larger",
    draw: (r) => ({ a: between(r, 1, 30), b: between(r, 1, 40) }),
    valid: (p) => p.b > p.a,
    solve: (p) => qi(p.a - p.b),
    reference: (p) => qi(-(p.b - p.a)),
    traps: [
      {
        id: "positive-result",
        kind: "conceptual",
        wrong: (p) => qi(p.b - p.a),
      },
      { id: "added", kind: "procedural", wrong: (p) => qi(p.a + p.b) },
      {
        id: "negative-sum",
        kind: "procedural",
        wrong: (p) => qi(-(p.a + p.b)),
      },
    ],
    vars: (p) => ({ ...ab(p), r: signed(p.a - p.b), w: s(p.b - p.a) }),
  }),
  op<AB>({
    id: "N8.operate.04",
    subtype: "operate",
    form: "negative-times-positive",
    draw: (r) => ({ a: between(r, 2, 12), b: between(r, 2, 12) }),
    solve: (p) => qi(-p.a * p.b),
    reference: (p) => qi(-(p.a * p.b)),
    traps: [
      {
        id: "positive-result",
        kind: "conceptual",
        wrong: (p) => qi(p.a * p.b),
      },
      {
        id: "added-instead",
        kind: "procedural",
        wrong: (p) => qi(-(p.a + p.b)),
      },
    ],
    vars: (p) => ({ ...ab(p), r: signed(-p.a * p.b), w: s(p.a * p.b) }),
  }),
  op<AB>({
    id: "N8.operate.05",
    subtype: "operate",
    form: "negative-times-negative",
    draw: (r) => ({ a: between(r, 2, 12), b: between(r, 2, 12) }),
    solve: (p) => qi(p.a * p.b),
    reference: (p) => qi(-p.a * -p.b),
    traps: [
      {
        id: "negative-result",
        kind: "conceptual",
        wrong: (p) => qi(-p.a * p.b),
      },
      { id: "added-instead", kind: "procedural", wrong: (p) => qi(p.a + p.b) },
    ],
    vars: (p) => ({ ...ab(p), r: s(p.a * p.b), w: signed(-p.a * p.b) }),
  }),
  op<{ b: number; q: number }>({
    id: "N8.operate.06",
    subtype: "operate",
    form: "negative-divided-by-positive",
    draw: (r) => ({ b: between(r, 2, 9), q: between(r, 2, 12) }),
    solve: (p) => qi(-p.q),
    reference: (p) => qi(-(p.b * p.q) / p.b),
    traps: [
      { id: "positive-result", kind: "conceptual", wrong: (p) => qi(p.q) },
    ],
    vars: (p) => ({ n: s(p.b * p.q), b: s(p.b), r: signed(-p.q), w: s(p.q) }),
  }),
  op<AB>({
    id: "N8.operate.07",
    subtype: "operate",
    form: "subtract-a-negative-number",
    draw: (r) => ({ a: between(r, 1, 30), b: between(r, 1, 30) }),
    valid: (p) => p.a !== p.b,
    solve: (p) => qi(p.a + p.b),
    reference: (p) => qi(p.a - -p.b),
    traps: [
      {
        id: "plain-subtraction",
        kind: "procedural",
        wrong: (p) => qi(p.a - p.b),
      },
      {
        id: "negative-sum",
        kind: "conceptual",
        wrong: (p) => qi(-(p.a + p.b)),
      },
      { id: "swapped", kind: "procedural", wrong: (p) => qi(p.b - p.a) },
    ],
    vars: (p) => ({ ...ab(p), r: s(p.a + p.b), w: signed(p.a - p.b) }),
  }),
  op<AB>({
    id: "N8.operate.08",
    subtype: "operate",
    form: "negative-minus-a-negative",
    draw: (r) => ({ a: between(r, 1, 30), b: between(r, 1, 30) }),
    valid: (p) => p.a !== p.b,
    solve: (p) => qi(-p.a + p.b),
    reference: (p) => qi(-p.a - -p.b),
    traps: [
      {
        id: "both-subtracted",
        kind: "procedural",
        wrong: (p) => qi(-(p.a + p.b)),
      },
      { id: "swapped-sign", kind: "conceptual", wrong: (p) => qi(p.a - p.b) },
      {
        id: "added-magnitudes",
        kind: "conceptual",
        wrong: (p) => qi(p.a + p.b),
      },
    ],
    vars: (p) => ({ ...ab(p), r: signed(p.b - p.a), w: signed(-(p.a + p.b)) }),
  }),
  op<{ st: number; x: number; y: number; z: number }>({
    id: "N8.operate.09",
    subtype: "operate",
    form: "a-chain-of-additions-and-subtractions",
    draw: (r) => ({
      st: between(r, 1, 10),
      x: between(r, 1, 10),
      y: between(r, 5, 20),
      z: between(r, 5, 20),
    }),
    solve: (p) => qi(p.st + p.x - p.y - p.z),
    reference: (p) => qi([p.x, -p.y, -p.z].reduce((a, b) => a + b, p.st)),
    traps: [
      {
        id: "last-sign-lost",
        kind: "procedural",
        wrong: (p) => qi(p.st + p.x - p.y + p.z),
      },
      {
        id: "all-plus",
        kind: "conceptual",
        wrong: (p) => qi(p.st + p.x + p.y + p.z),
      },
      {
        id: "second-sign-lost",
        kind: "procedural",
        wrong: (p) => qi(p.st + p.x + p.y - p.z),
      },
    ],
    vars: (p) => ({
      st: s(p.st),
      x: s(p.x),
      y: s(p.y),
      z: s(p.z),
      r: signed(p.st + p.x - p.y - p.z),
      w: signed(p.st + p.x - p.y + p.z),
    }),
  }),
  op<{ a: number; b: number; c: number }>({
    id: "N8.operate.10",
    subtype: "operate",
    form: "order-of-operations-with-a-negative-start",
    draw: (r) => ({
      a: between(r, 1, 20),
      b: between(r, 2, 9),
      c: between(r, 2, 9),
    }),
    valid: (p) => p.a !== p.b,
    solve: (p) => qi(-p.a + p.b * p.c),
    reference: (p) => qi(p.b * p.c - p.a),
    traps: [
      {
        id: "left-to-right",
        kind: "procedural",
        wrong: (p) => qi((-p.a + p.b) * p.c),
      },
      {
        id: "minus-lost",
        kind: "conceptual",
        wrong: (p) => qi(p.a + p.b * p.c),
      },
      {
        id: "all-negative",
        kind: "conceptual",
        wrong: (p) => qi(-p.a - p.b * p.c),
      },
    ],
    vars: (p) => ({
      a: s(p.a),
      b: s(p.b),
      c: s(p.c),
      m: s(p.b * p.c),
      r: signed(-p.a + p.b * p.c),
      w: signed((-p.a + p.b) * p.c),
    }),
  }),
  op<AB>({
    id: "N8.operate.11",
    subtype: "operate",
    form: "absolute-value-of-a-sum-of-negatives",
    draw: (r) => ({ a: between(r, 1, 30), b: between(r, 1, 30) }),
    solve: (p) => qi(p.a + p.b),
    reference: (p) => qi(Math.abs(-p.a - p.b)),
    traps: [
      {
        id: "keeps-the-sign",
        kind: "conceptual",
        wrong: (p) => qi(-(p.a + p.b)),
      },
      {
        id: "abs-difference",
        kind: "conceptual",
        wrong: (p) => qi(Math.abs(p.a - p.b)),
      },
    ],
    vars: (p) => ({ ...ab(p), r: s(p.a + p.b), w: signed(-(p.a + p.b)) }),
  }),
  op<{ n: number }>({
    id: "N8.operate.12",
    subtype: "operate",
    form: "an-alternating-sum-taken-in-pairs",
    origin: {
      olympiad:
        "the alternating sum 1 - 2 + 3 - 4 grouped in pairs; RES-4281 (MCCME school stage style)",
    },
    draw: (r) => ({ n: 2 * between(r, 4, 25) }),
    solve: (p) => qi(-p.n / 2),
    reference: (p) => {
      let sum = 0;
      for (let k = 1; k <= p.n; k += 1) sum += k % 2 === 1 ? k : -k;
      return qi(sum);
    },
    traps: [
      { id: "positive-pairs", kind: "conceptual", wrong: (p) => qi(p.n / 2) },
      { id: "last-term-only", kind: "conceptual", wrong: (p) => qi(-p.n) },
    ],
    vars: (p) => ({
      m: s(p.n - 1),
      n: s(p.n),
      pairs: s(p.n / 2),
      r: signed(-p.n / 2),
    }),
    constants: [1, 2, 3, 4],
  }),
  op<AB>({
    id: "N8.operate.13",
    subtype: "operate",
    form: "a-double-minus-and-a-modulus",
    draw: (r) => ({ a: between(r, 2, 15), b: between(r, 2, 15) }),
    valid: (p) => p.a !== p.b,
    solve: (p) => qi(p.a + p.b),
    reference: (p) => qi(-(-p.a) + Math.abs(-p.b)),
    traps: [
      {
        id: "double-minus-lost",
        kind: "conceptual",
        wrong: (p) => qi(-p.a + p.b),
      },
      {
        id: "modulus-kept-sign",
        kind: "conceptual",
        wrong: (p) => qi(p.a - p.b),
      },
    ],
    vars: (p) => ({
      ...ab(p),
      r: s(p.a + p.b),
      w_double_minus_lost: signed(-p.a + p.b),
      w_modulus_kept_sign: signed(p.a - p.b),
    }),
  }),
  op<{ x: number; y: number }>({
    id: "N8.operate.14",
    subtype: "operate",
    form: "the-missing-addend-across-zero",
    draw: (r) => ({ x: -between(r, 2, 15), y: between(r, -10, 20) }),
    valid: (p) => p.y > p.x && Math.abs(p.y) !== Math.abs(p.x) && p.y !== 0,
    solve: (p) => qi(p.y - p.x),
    reference: (p) => qi(p.y + Math.abs(p.x)),
    traps: [
      {
        id: "magnitudes-subtracted",
        kind: "conceptual",
        wrong: (p) => qi(Math.abs(p.y) - Math.abs(p.x)),
      },
      { id: "target-only", kind: "conceptual", wrong: (p) => qi(p.y) },
    ],
    vars: (p) => ({
      x: signed(p.x),
      y: signed(p.y),
      r: s(p.y - p.x),
      w_magnitudes_subtracted: signed(Math.abs(p.y) - Math.abs(p.x)),
      w_target_only: signed(p.y),
    }),
  }),
  op<{ f: number[] }>({
    id: "N8.operate.15",
    subtype: "operate",
    form: "the-product-of-several-signed-numbers",
    draw: (r) => ({
      f: Array.from(
        { length: 4 },
        () => (r.int(2) === 0 ? 1 : -1) * between(r, 1, 5),
      ),
    }),
    valid: (p) =>
      p.f.filter((x) => x < 0).length >= 2 &&
      Math.abs(p.f.reduce((a, b) => a * b, 1)) <= 240,
    solve: (p) => qi(p.f.reduce((a, b) => a * b, 1)),
    reference: (p) => {
      const negatives = p.f.filter((x) => x < 0).length;
      const size = p.f.map(Math.abs).reduce((a, b) => a * b, 1);
      return qi(negatives % 2 === 0 ? size : -size);
    },
    traps: [
      {
        id: "signs-ignored",
        kind: "conceptual",
        wrong: (p) => qi(p.f.map(Math.abs).reduce((a, b) => a * b, 1)),
      },
      {
        id: "opposite-sign",
        kind: "conceptual",
        wrong: (p) => qi(-p.f.reduce((a, b) => a * b, 1)),
      },
    ],
    vars: (p) => {
      const product = p.f.reduce((a, b) => a * b, 1);
      const size = Math.abs(product);
      return {
        expr: p.f
          .map((x, i) => (x < 0 && i > 0 ? `(${signed(x)})` : signed(x)))
          .join(" × "),
        neg: s(p.f.filter((x) => x < 0).length),
        chain: p.f.map((x) => s(Math.abs(x))).join(" × "),
        abs: s(size),
        r: signed(product),
        w_signs_ignored: s(size),
        w_opposite_sign: signed(-product),
      };
    },
    constants: [],
  }),
];

const scale = [
  op<AB>({
    id: "N8.scale-operate.01",
    subtype: "scale-operate",
    form: "average-of-a-cold-and-a-warm-temperature",
    roles: { a: "degrees below zero at night", b: "degrees above zero by day" },
    draw: (r) => ({ a: between(r, 1, 15), b: between(r, 1, 15) }),
    valid: (p) => (p.b - p.a) % 2 === 0 && p.a !== p.b,
    solve: (p) => qi((p.b - p.a) / 2),
    reference: (p) => qi((-p.a + p.b) / 2),
    traps: [
      {
        id: "magnitudes-added",
        kind: "conceptual",
        wrong: (p) => qi((p.a + p.b) / 2),
      },
      { id: "not-halved", kind: "procedural", wrong: (p) => qi(p.b - p.a) },
      {
        id: "all-negative",
        kind: "conceptual",
        wrong: (p) => qi(-(p.a + p.b) / 2),
      },
    ],
    vars: (p) => ({
      ...ab(p),
      r: signed((p.b - p.a) / 2),
      sum: signed(p.b - p.a),
      w: s((p.a + p.b) / 2),
    }),
    constants: [0, 2],
  }),
  op<{ x: number; y: number; m: number }>({
    id: "N8.scale-operate.02",
    subtype: "scale-operate",
    form: "average-of-three-temperatures",
    roles: {
      x: "temperature in the first city",
      y: "temperature in the second city",
      z: "temperature in the third city",
    },
    draw: (r) => ({
      x: between(r, -12, 12),
      y: between(r, -12, 12),
      m: between(r, -5, 5),
    }),
    valid: (p) =>
      Math.abs(3 * p.m - p.x - p.y) <= 20 && p.m !== 0 && 3 * p.m !== 0,
    solve: (p) => qi(p.m),
    reference: (p) => qi((p.x + p.y + (3 * p.m - p.x - p.y)) / 3),
    traps: [
      { id: "not-divided", kind: "procedural", wrong: (p) => qi(3 * p.m) },
      {
        id: "middle-value",
        kind: "conceptual",
        wrong: (p) =>
          qi([p.x, p.y, 3 * p.m - p.x - p.y].sort((a, b) => a - b)[1] ?? 0),
      },
      {
        id: "signs-ignored",
        kind: "conceptual",
        wrong: (p) => {
          const sum =
            Math.abs(p.x) + Math.abs(p.y) + Math.abs(3 * p.m - p.x - p.y);
          return sum % 3 === 0 ? qi(sum / 3) : null;
        },
      },
    ],
    vars: (p) => ({
      x: signed(p.x),
      y: signed(p.y),
      z: signed(3 * p.m - p.x - p.y),
      sum: signed(3 * p.m),
      r: signed(p.m),
    }),
    constants: [0, 3],
  }),
  op<{ d: number; u: number }>({
    id: "N8.scale-operate.03",
    subtype: "scale-operate",
    form: "a-diver-rises-towards-the-surface",
    roles: { d: "depth of the diver in metres", u: "metres the diver rose" },
    draw: (r) => ({ d: between(r, 10, 60), u: between(r, 1, 9) }),
    solve: (p) => qi(-p.d + p.u),
    reference: (p) => qi(-(p.d - p.u)),
    traps: [
      { id: "went-deeper", kind: "conceptual", wrong: (p) => qi(-(p.d + p.u)) },
      {
        id: "positive-difference",
        kind: "conceptual",
        wrong: (p) => qi(p.d - p.u),
      },
      { id: "added", kind: "procedural", wrong: (p) => qi(p.d + p.u) },
    ],
    vars: (p) => ({
      d: s(p.d),
      u: s(p.u),
      r: signed(-p.d + p.u),
      w: signed(-(p.d + p.u)),
    }),
  }),
  op<AB>({
    id: "N8.scale-operate.04",
    subtype: "scale-operate",
    form: "floors-between-a-basement-and-an-upper-floor",
    roles: {
      a: "floor of the car park below ground",
      b: "floor of the office above ground",
    },
    draw: (r) => ({ a: between(r, 1, 4), b: between(r, 2, 12) }),
    solve: (p) => qi(p.a + p.b),
    reference: (p) => qi(p.b - -p.a),
    traps: [
      {
        id: "difference-of-numbers",
        kind: "conceptual",
        wrong: (p) => qi(p.b - p.a),
      },
      {
        id: "counted-floors",
        kind: "conceptual",
        wrong: (p) => qi(p.a + p.b + 1),
      },
      { id: "above-ground-only", kind: "conceptual", wrong: (p) => qi(p.b) },
    ],
    vars: (p) => ({ ...ab(p), r: s(p.a + p.b), w: s(p.b - p.a) }),
  }),
  op<{ a: number; b: number; c: number }>({
    id: "N8.scale-operate.05",
    subtype: "scale-operate",
    form: "a-balance-after-a-payment-and-a-purchase",
    roles: {
      a: "debt on the account in euro",
      b: "euro paid in",
      c: "euro spent",
    },
    draw: (r) => ({
      a: between(r, 10, 50),
      b: between(r, 20, 80),
      c: between(r, 5, 40),
    }),
    valid: (p) => -p.a + p.b - p.c !== -p.a + p.b + p.c,
    solve: (p) => qi(-p.a + p.b - p.c),
    reference: (p) => qi(p.b - p.a - p.c),
    traps: [
      {
        id: "purchase-added",
        kind: "procedural",
        wrong: (p) => qi(-p.a + p.b + p.c),
      },
      { id: "debt-forgotten", kind: "conceptual", wrong: (p) => qi(p.b - p.c) },
      {
        id: "debt-as-money",
        kind: "conceptual",
        wrong: (p) => qi(p.a + p.b - p.c),
      },
    ],
    vars: (p) => ({
      a: s(p.a),
      b: s(p.b),
      c: s(p.c),
      r: signed(-p.a + p.b - p.c),
      w: signed(-p.a + p.b + p.c),
    }),
  }),
  op<{ t: number; d: number; h: number }>({
    id: "N8.scale-operate.06",
    subtype: "scale-operate",
    form: "a-fall-of-the-same-size-every-hour",
    roles: {
      t: "starting temperature",
      d: "degrees the temperature falls each hour",
      h: "number of hours",
    },
    draw: (r) => ({
      t: between(r, -5, 5),
      d: between(r, 2, 6),
      h: between(r, 3, 7),
    }),
    valid: (p) => p.t !== 0 && p.t - p.d !== p.t - p.d * p.h,
    solve: (p) => qi(p.t - p.d * p.h),
    reference: (p) =>
      qi(Array.from({ length: p.h }, () => -p.d).reduce((a, b) => a + b, p.t)),
    traps: [
      { id: "one-hour", kind: "procedural", wrong: (p) => qi(p.t - p.d) },
      { id: "start-ignored", kind: "conceptual", wrong: (p) => qi(-p.d * p.h) },
      {
        id: "fall-added",
        kind: "procedural",
        wrong: (p) => qi(p.t + p.d * p.h),
      },
    ],
    vars: (p) => ({
      t: signed(p.t),
      d: s(p.d),
      h: s(p.h),
      f: s(p.d * p.h),
      r: signed(p.t - p.d * p.h),
      w: signed(p.t - p.d),
    }),
  }),
  op<AB>({
    id: "N8.scale-operate.07",
    subtype: "scale-operate",
    form: "net-weight-from-gross-weight-and-tare",
    roles: {
      a: "weight of the goods with the package in grams",
      b: "weight of the package in grams",
    },
    draw: (r) => ({ a: between(r, 200, 900), b: between(r, 20, 150) }),
    solve: (p) => qi(p.a - p.b),
    reference: (p) => qi(p.a + -p.b),
    traps: [
      { id: "tare-added", kind: "procedural", wrong: (p) => qi(p.a + p.b) },
      { id: "swapped", kind: "procedural", wrong: (p) => qi(p.b - p.a) },
      { id: "gross-weight", kind: "conceptual", wrong: (p) => qi(p.a) },
    ],
    vars: (p) => ({ ...ab(p), r: s(p.a - p.b), w: s(p.a + p.b) }),
  }),
  op<AB>({
    id: "N8.scale-operate.08",
    subtype: "scale-operate",
    form: "height-of-a-mountain-above-the-depth-of-a-trench",
    roles: {
      a: "height of the summit above sea level in metres",
      b: "depth of the trench below sea level in metres",
    },
    draw: (r) => ({ a: between(r, 2, 9) * 100, b: between(r, 1, 9) * 100 }),
    solve: (p) => qi(p.a + p.b),
    reference: (p) => qi(p.a - -p.b),
    traps: [
      {
        id: "difference-of-numbers",
        kind: "conceptual",
        wrong: (p) => qi(Math.abs(p.a - p.b)),
      },
      { id: "mountain-only", kind: "conceptual", wrong: (p) => qi(p.a) },
      { id: "trench-only", kind: "conceptual", wrong: (p) => qi(p.b) },
    ],
    vars: (p) => ({ ...ab(p), r: s(p.a + p.b), w: s(Math.abs(p.a - p.b)) }),
    constants: [0, 100],
  }),
  op<{ r: number; k: number }>({
    id: "N8.scale-operate.09",
    subtype: "scale-operate",
    form: "hours-to-warm-up-to-zero",
    roles: {
      a: "degrees below zero now",
      u: "degrees the temperature rises each hour",
    },
    draw: (r) => ({ r: between(r, 2, 5), k: between(r, 2, 8) }),
    solve: (p) => qi(p.k),
    reference: (p) => qi((p.r * p.k) / p.r),
    traps: [
      { id: "multiplied", kind: "procedural", wrong: (p) => qi(p.r * p.k) },
      {
        id: "subtracted",
        kind: "procedural",
        wrong: (p) => qi(p.r * p.k - p.r),
      },
      { id: "added", kind: "procedural", wrong: (p) => qi(p.r * p.k + p.r) },
    ],
    vars: (p) => ({ a: s(p.r * p.k), u: s(p.r), r: s(p.k), w: s(p.r * p.k) }),
  }),
  op<{ d: number; r: number }>({
    id: "N8.scale-operate.10",
    subtype: "scale-operate",
    form: "the-starting-temperature-before-a-fall",
    roles: {
      d: "degrees of the fall",
      r: "temperature after the fall (below zero)",
    },
    draw: (r) => ({ d: between(r, 3, 15), r: between(r, 1, 25) }),
    valid: (p) => p.d !== p.r,
    solve: (p) => qi(-p.r + p.d),
    reference: (p) => qi(p.d - p.r),
    traps: [
      {
        id: "fall-subtracted-again",
        kind: "conceptual",
        wrong: (p) => qi(-p.r - p.d),
      },
      { id: "sign-flipped", kind: "conceptual", wrong: (p) => qi(p.r - p.d) },
      {
        id: "magnitudes-added",
        kind: "conceptual",
        wrong: (p) => qi(p.r + p.d),
      },
    ],
    vars: (p) => ({
      d: s(p.d),
      r: s(p.r),
      x: signed(-p.r + p.d),
      w: signed(-p.r - p.d),
    }),
  }),
  op<{ a: number; j: number }>({
    id: "N8.scale-operate.11",
    subtype: "scale-operate",
    form: "a-jump-on-a-number-line-read-from-a-picture",
    roles: { a: "number on which the point stands" },
    draw: (r) => ({
      a: between(r, -8, 8),
      j: (r.int(2) === 0 ? 1 : -1) * between(r, 2, 9),
    }),
    valid: (p) => {
      const end = p.a + p.j;
      return (
        Math.abs(end) <= 12 &&
        end % 4 !== 0 &&
        p.a % 4 !== 0 &&
        end !== p.j &&
        end !== p.a
      );
    },
    solve: (p) => qi(p.a + p.j),
    reference: (p) => qi(p.j + p.a),
    traps: [
      {
        id: "wrong-direction",
        kind: "conceptual",
        wrong: (p) => qi(p.a - p.j),
      },
      { id: "arrow-only", kind: "conceptual", wrong: (p) => qi(p.j) },
    ],
    vars: (p) => ({
      a: signed(p.a),
      j: p.j > 0 ? `+${p.j}` : signed(p.j),
      op: p.j > 0 ? "+" : "−",
      jabs: s(Math.abs(p.j)),
      r: signed(p.a + p.j),
      w_wrong_direction: signed(p.a - p.j),
      w_arrow_only: signed(p.j),
    }),
  }),
  op<{ g: number; q: number; w: number; l: number }>({
    id: "N8.scale-operate.12",
    subtype: "scale-operate",
    form: "a-game-score-with-gains-and-penalties",
    draw: (r) => ({
      g: between(r, 2, 5),
      q: between(r, 1, 4),
      w: between(r, 2, 8),
      l: between(r, 2, 9),
    }),
    valid: (p) =>
      p.g !== p.q &&
      p.w !== p.l &&
      p.g * p.w - p.q * p.l !== 0 &&
      p.g * p.l - p.q * p.w !== p.g * p.w - p.q * p.l,
    solve: (p) => qi(p.g * p.w - p.q * p.l),
    reference: (p) => qi(p.w * p.g + -(p.l * p.q)),
    traps: [
      {
        id: "losses-added",
        kind: "procedural",
        wrong: (p) => qi(p.g * p.w + p.q * p.l),
      },
      { id: "ignored-losses", kind: "conceptual", wrong: (p) => qi(p.g * p.w) },
      {
        id: "swapped-counts",
        kind: "procedural",
        wrong: (p) => qi(p.g * p.l - p.q * p.w),
      },
    ],
    roles: {
      g: "points for a won round",
      q: "points taken for a lost round",
      w: "rounds won",
      l: "rounds lost",
    },
    vars: (p) => ({
      g: s(p.g),
      q: s(p.q),
      w: s(p.w),
      l: s(p.l),
      gain: s(p.g * p.w),
      loss: s(p.q * p.l),
      r: signed(p.g * p.w - p.q * p.l),
      w_losses_added: s(p.g * p.w + p.q * p.l),
      w_ignored_losses: s(p.g * p.w),
      w_swapped_counts: signed(p.g * p.l - p.q * p.w),
    }),
  }),
  op<{ n: number; s: number }>({
    id: "N8.scale-operate.13",
    subtype: "scale-operate",
    form: "how-many-questions-were-solved-from-the-score",
    roles: { n: "number of questions", p: "score of the quiz" },
    origin: {
      olympiad:
        "working backwards from a score with penalties, the Kangaroo scoring of RES-4281 (3 points for a right answer, a point taken for a wrong one)",
    },
    draw: (r) => {
      const n = between(r, 8, 20);
      return { n, s: between(r, 2, n - 2) };
    },
    solve: (p) => qi(p.s),
    reference: (p) => {
      for (let k = 0; k <= p.n; k += 1)
        if (3 * k - (p.n - k) === 4 * p.s - p.n) return qi(k);
      return qi(-1);
    },
    traps: [
      {
        id: "unsolved-count",
        kind: "conceptual",
        wrong: (p) => qi(p.n - p.s),
      },
      {
        id: "points-over-three",
        kind: "procedural",
        wrong: (p) => qi(Math.round((4 * p.s - p.n) / 3)),
      },
    ],
    vars: (p) => ({
      n: s(p.n),
      p: signed(4 * p.s - p.n),
      full: s(3 * p.n),
      gap: s(4 * (p.n - p.s)),
      u: s(p.n - p.s),
      r: s(p.s),
      w_unsolved_count: s(p.n - p.s),
      w_points_over_three: signed(Math.round((4 * p.s - p.n) / 3)),
    }),
    constants: [1, 3, 4],
  }),
  op<{ na: number; b: number }>({
    id: "N8.scale-operate.14",
    subtype: "scale-operate",
    form: "the-distance-between-two-points-across-zero",
    draw: (r) => ({ na: between(r, 2, 11), b: between(r, 2, 11) }),
    valid: (p) => p.na !== p.b,
    solve: (p) => qi(p.na + p.b),
    reference: (p) => qi(p.b - -p.na),
    traps: [
      {
        id: "magnitudes-subtracted",
        kind: "conceptual",
        wrong: (p) => qi(Math.abs(p.na - p.b)),
      },
      {
        id: "farther-point-only",
        kind: "conceptual",
        wrong: (p) => qi(Math.max(p.na, p.b)),
      },
    ],
    vars: (p) => ({
      a: signed(-p.na),
      na: s(p.na),
      b: s(p.b),
      r: s(p.na + p.b),
      w_magnitudes_subtracted: s(Math.abs(p.na - p.b)),
      w_farther_point_only: s(Math.max(p.na, p.b)),
    }),
  }),
];

export const n8Specs: readonly Spec<never>[] = [...operate, ...scale];
