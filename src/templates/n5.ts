// Node N5, the number line and reading scales (RES-4281). The Dutch goals place numbers on a line
// to 20 at group 3, to 1,000 at group 5 and "ongeveer" at group 6, and read scales as measuring
// goals. The line and the scale are described in words here; the client draws them. Texts are plain
// blanks in `content/tasks-n.ru.json`, keyed by the template id.
import { Q } from "../math/q.js";
import { between, digits, pick, qi } from "./draw.js";
import { defineSpec as define, type Spec } from "./spec.js";
import { formatQ } from "../math/format.js";

const s = String;
const dec = (x: Q): string => {
  const whole = x.n / x.d;
  const frac = ((x.n % x.d) * 10n) / x.d;
  return `${whole.toString()},${frac.toString()}`;
};

/**
 * A spec whose traps are named in the strings by `{w_<trap id>}`. A trap that repeats an
 * earlier trap of the same task gives null, so two traps never share an entry.
 */
const defineSpec = <P>(spec: Spec<P>) => {
  const traps = spec.traps ?? [];
  const wrongOf = (i: number, p: P) => {
    const w = traps[i]?.wrong(p) ?? null;
    if (w === null) return null;
    for (let j = 0; j < i; j += 1) {
      const e = traps[j]?.wrong(p);
      if (e instanceof Q && w instanceof Q && e.eq(w)) return null;
    }
    return w;
  };
  return define<P>({
    ...spec,
    traps: traps.map((t, i) => ({ ...t, wrong: (p: P) => wrongOf(i, p) })),
    vars: (p) => ({
      ...spec.vars(p),
      ...Object.fromEntries(
        traps.flatMap((t, i) => {
          const w = wrongOf(i, p);
          return w instanceof Q
            ? [
                [
                  `w_${t.id.replace(/-/g, "_")}`,
                  formatQ(w, {
                    decimal: ",",
                    group: "\u00A0",
                    mul: "",
                    div: "",
                    minus: "−",
                  }),
                ],
              ]
            : [];
        }),
      ),
    }),
  });
};

interface K {
  k: number;
}
interface KB extends K {
  b: number;
}

const pointSpecs = [
  defineSpec<K>({
    id: "N5.point.01",
    node: "N5",
    subtype: "point",
    form: "mark-on-a-line-from-0-to-100",
    groups: [3, 4],
    answer: "integer",
    draw: (r) => ({ k: between(r, 2, 9) }),
    solve: (p) => qi(10 * p.k),
    reference: (p) =>
      qi(Array.from({ length: p.k }, () => 10).reduce((a, b) => a + b, 0)),
    traps: [
      { id: "mark-number", kind: "conceptual", wrong: (p) => qi(p.k) },
      {
        id: "zero-counted",
        kind: "conceptual",
        wrong: (p) => qi(10 * (p.k - 1)),
      },
      {
        id: "extra-mark",
        kind: "conceptual",
        wrong: (p) => qi(10 * (p.k + 1)),
      },
    ],
    vars: (p) => ({ k: s(p.k), r: s(10 * p.k), z: s(10 * (p.k - 1)) }),
    constants: [0, 10, 100],
  }),
  defineSpec<K>({
    id: "N5.point.02",
    node: "N5",
    subtype: "point",
    form: "mark-on-a-line-from-0-to-1000",
    groups: [5, 5],
    answer: "integer",
    draw: (r) => ({ k: between(r, 2, 9) }),
    solve: (p) => qi(100 * p.k),
    reference: (p) => qi(Number(`${p.k}00`)),
    traps: [
      { id: "step-of-ten", kind: "conceptual", wrong: (p) => qi(10 * p.k) },
      {
        id: "zero-counted",
        kind: "conceptual",
        wrong: (p) => qi(100 * (p.k - 1)),
      },
      { id: "mark-number", kind: "conceptual", wrong: (p) => qi(p.k) },
      {
        id: "extra-mark",
        kind: "conceptual",
        wrong: (p) => qi(100 * (p.k + 1)),
      },
    ],
    vars: (p) => ({
      k: s(p.k),
      r: s(100 * p.k),
      t: s(10 * p.k),
      z: s(100 * (p.k - 1)),
    }),
    constants: [0, 10, 100, 1000],
  }),
  defineSpec<KB>({
    id: "N5.point.03",
    node: "N5",
    subtype: "point",
    form: "mark-on-a-line-that-does-not-start-at-zero",
    groups: [5, 5],
    answer: "integer",
    draw: (r) => ({ b: between(r, 2, 9) * 100, k: between(r, 2, 9) }),
    solve: (p) => qi(p.b + 10 * p.k),
    reference: (p) =>
      qi(
        p.b + Array.from({ length: p.k }, () => 10).reduce((a, c) => a + c, 0),
      ),
    traps: [
      { id: "from-zero", kind: "conceptual", wrong: (p) => qi(10 * p.k) },
      { id: "mark-number", kind: "conceptual", wrong: (p) => qi(p.b + p.k) },
      {
        id: "zero-counted",
        kind: "conceptual",
        wrong: (p) => qi(p.b + 10 * (p.k - 1)),
      },
    ],
    vars: (p) => ({
      b: s(p.b),
      e: s(p.b + 100),
      k: s(p.k),
      r: s(p.b + 10 * p.k),
      z: s(10 * p.k),
      m: s(p.b + p.k),
    }),
    constants: [10],
  }),
  defineSpec<{ a: number; d: number }>({
    id: "N5.point.04",
    node: "N5",
    subtype: "point",
    form: "the-number-half-way-between-two-marks",
    groups: [5, 6],
    answer: "integer",
    draw: (r) => ({ a: 10 * between(r, 1, 19), d: 5 * between(r, 1, 10) }),
    solve: (p) => qi(p.a + p.d),
    reference: (p) => qi((p.a + (p.a + 2 * p.d)) / 2),
    traps: [
      { id: "half-the-gap", kind: "conceptual", wrong: (p) => qi(p.d) },
      { id: "right-mark", kind: "conceptual", wrong: (p) => qi(p.a + 2 * p.d) },
      { id: "left-mark", kind: "conceptual", wrong: (p) => qi(p.a) },
      { id: "whole-gap", kind: "conceptual", wrong: (p) => qi(2 * p.d) },
    ],
    vars: (p) => ({
      a: s(p.a),
      b: s(p.a + 2 * p.d),
      r: s(p.a + p.d),
      g: s(2 * p.d),
      d: s(p.d),
    }),
    constants: [2],
  }),
  defineSpec<{ t: number; parts: number; k: number }>({
    id: "N5.point.05",
    node: "N5",
    subtype: "point",
    form: "mark-when-the-line-is-split-into-equal-parts",
    groups: [4, 5],
    answer: "integer",
    draw: (r) => {
      const parts = pick(r, [4, 5, 8, 10]);
      return {
        parts,
        t: parts * pick(r, [5, 10, 20, 25, 50]),
        k: between(r, 2, parts - 1),
      };
    },
    solve: (p) => qi((p.t / p.parts) * p.k),
    reference: (p) => qi((p.t * p.k) / p.parts),
    traps: [
      { id: "one-part", kind: "conceptual", wrong: (p) => qi(p.t / p.parts) },
      { id: "mark-number", kind: "conceptual", wrong: (p) => qi(p.k) },
      {
        id: "zero-counted",
        kind: "conceptual",
        wrong: (p) => qi((p.t / p.parts) * (p.k - 1)),
      },
      {
        id: "divided-by-mark",
        kind: "conceptual",
        wrong: (p) => (p.t % p.k === 0 ? qi(p.t / p.k) : null),
      },
    ],
    vars: (p) => ({
      t: digits(p.t),
      parts: s(p.parts),
      k: s(p.k),
      step: digits(p.t / p.parts),
      r: digits((p.t / p.parts) * p.k),
    }),
    constants: [0],
  }),
  defineSpec<{ a: number; b: number; q: number }>({
    id: "N5.point.06",
    node: "N5",
    subtype: "point",
    form: "a-point-about-a-quarter-of-the-way",
    groups: [6, 6],
    answer: "line",
    draw: (r) => {
      const a = 100 * between(r, 1, 6);
      return { a, b: a + 400, q: pick(r, [1, 3]) };
    },
    solve: (p) => qi(p.a + 100 * p.q),
    reference: (p) => qi(p.a + ((p.b - p.a) * p.q) / 4),
    within: () => qi(40),
    traps: [
      {
        id: "mirrored",
        kind: "conceptual",
        wrong: (p) => qi(p.a + 100 * (4 - p.q)),
      },
      { id: "mark-number", kind: "conceptual", wrong: (p) => qi(p.a + p.q) },
      { id: "from-zero", kind: "conceptual", wrong: (p) => qi(100 * p.q) },
      {
        id: "zero-counted",
        kind: "conceptual",
        wrong: (p) => qi(p.a + 100 * (p.q - 1)),
      },
    ],
    vars: (p) => ({
      a: s(p.a),
      b: s(p.b),
      q: s(p.q),
      r: s(p.a + 100 * p.q),
      w: s(p.a + 100 * (4 - p.q)),
    }),
    constants: [4, 40, 100],
  }),
  defineSpec<{ n: number }>({
    id: "N5.point.07",
    node: "N5",
    subtype: "point",
    form: "the-round-thousand-below-a-point",
    groups: [6, 6],
    answer: "integer",
    draw: (r) => ({ n: between(r, 1001, 9999) }),
    valid: (p) => p.n % 1000 !== 0,
    solve: (p) => qi(Math.floor(p.n / 1000) * 1000),
    reference: (p) => qi(p.n - (p.n % 1000)),
    traps: [
      {
        id: "upper-mark",
        kind: "conceptual",
        wrong: (p) => qi((Math.floor(p.n / 1000) + 1) * 1000),
      },
      {
        id: "left-hundred",
        kind: "conceptual",
        wrong: (p) => qi(Math.floor(p.n / 100) * 100),
      },
      {
        id: "forgot-zeros",
        kind: "conceptual",
        wrong: (p) => qi(Math.floor(p.n / 1000)),
      },
    ],
    vars: (p) => ({
      n: digits(p.n),
      r: digits(Math.floor(p.n / 1000) * 1000),
      u: digits((Math.floor(p.n / 1000) + 1) * 1000),
    }),
    constants: [1000],
  }),
  defineSpec<{ a: number; b: number }>({
    id: "N5.point.08",
    node: "N5",
    subtype: "point",
    form: "distance-between-two-marks",
    groups: [5, 5],
    answer: "integer",
    draw: (r) => {
      const a = 10 * between(r, 1, 50);
      return { a, b: a + 10 * between(r, 2, 40) };
    },
    solve: (p) => qi(p.b - p.a),
    reference: (p) =>
      qi(
        Array.from({ length: (p.b - p.a) / 10 }, () => 10).reduce(
          (x, y) => x + y,
          0,
        ),
      ),
    traps: [
      { id: "sum", kind: "procedural", wrong: (p) => qi(p.a + p.b) },
      { id: "right-mark", kind: "conceptual", wrong: (p) => qi(p.b) },
      { id: "left-mark", kind: "conceptual", wrong: (p) => qi(p.a) },
    ],
    vars: (p) => ({ a: s(p.a), b: s(p.b), r: s(p.b - p.a), sum: s(p.a + p.b) }),
  }),
  defineSpec<K>({
    id: "N5.point.09",
    node: "N5",
    subtype: "point",
    form: "mark-on-a-line-from-0-to-1",
    groups: [6, 6],
    answer: "decimal",
    draw: (r) => ({ k: between(r, 1, 9) }),
    solve: (p) => Q.of(BigInt(p.k), 10n),
    reference: (p) => Q.fromDecimal(`0,${p.k}`),
    traps: [
      { id: "whole-number", kind: "conceptual", wrong: (p) => qi(p.k) },
      {
        id: "hundredths",
        kind: "conceptual",
        wrong: (p) => Q.of(BigInt(p.k), 100n),
      },
      {
        id: "zero-counted",
        kind: "conceptual",
        wrong: (p) => (p.k === 1 ? null : Q.of(BigInt(p.k - 1), 10n)),
      },
      {
        id: "above-one",
        kind: "conceptual",
        wrong: (p) => Q.of(BigInt(10 + p.k), 10n),
      },
    ],
    vars: (p) => ({
      k: s(p.k),
      r: dec(Q.of(BigInt(p.k), 10n)),
      h: `0,0${p.k}`,
    }),
    constants: [0, 1, 10],
  }),
  defineSpec<{ step: number; k: number }>({
    id: "N5.point.10",
    node: "N5",
    subtype: "point",
    form: "mark-when-the-step-is-given",
    groups: [4, 5],
    answer: "integer",
    draw: (r) => ({ step: pick(r, [5, 20, 25, 50]), k: between(r, 2, 9) }),
    solve: (p) => qi(p.step * p.k),
    reference: (p) =>
      qi(Array.from({ length: p.k }, () => p.step).reduce((a, b) => a + b, 0)),
    traps: [
      {
        id: "step-plus-count",
        kind: "procedural",
        wrong: (p) => qi(p.step + p.k),
      },
      { id: "mark-number", kind: "conceptual", wrong: (p) => qi(p.k) },
      {
        id: "zero-counted",
        kind: "conceptual",
        wrong: (p) => qi(p.step * (p.k - 1)),
      },
    ],
    vars: (p) => ({
      step: s(p.step),
      k: s(p.k),
      r: s(p.step * p.k),
      w: s(p.step + p.k),
    }),
    constants: [0],
  }),
  defineSpec<{ a: number; step: number; n: number }>({
    id: "N5.point.11",
    node: "N5",
    subtype: "point",
    form: "how-many-steps-between-two-marks",
    groups: [5, 6],
    answer: "integer",
    draw: (r) => {
      const step = pick(r, [5, 10, 25, 50]);
      return { step, a: step * between(r, 0, 10), n: between(r, 3, 12) };
    },
    solve: (p) => qi(p.n),
    reference: (p) => qi((p.a + p.n * p.step - p.a) / p.step),
    traps: [
      { id: "marks-counted", kind: "conceptual", wrong: (p) => qi(p.n + 1) },
      { id: "inner-marks", kind: "conceptual", wrong: (p) => qi(p.n - 1) },
      {
        id: "whole-distance",
        kind: "procedural",
        wrong: (p) => qi(p.n * p.step),
      },
      {
        id: "forgot-first-mark",
        kind: "procedural",
        wrong: (p) => qi((p.a + p.n * p.step) / p.step),
      },
    ],
    vars: (p) => ({
      a: s(p.a),
      b: s(p.a + p.n * p.step),
      step: s(p.step),
      r: s(p.n),
      m: s(p.n + 1),
    }),
    constants: [1],
  }),
];

const scaleSpecs = [
  defineSpec<{ c: number; m: number }>({
    id: "N5.scale.01",
    node: "N5",
    subtype: "scale",
    form: "ruler-in-centimetres-and-millimetres",
    groups: [4, 5],
    answer: "integer",
    draw: (r) => ({ c: between(r, 2, 30), m: between(r, 1, 9) }),
    solve: (p) => qi(10 * p.c + p.m),
    reference: (p) => qi(p.c * 10 + p.m),
    traps: [
      { id: "added-units", kind: "procedural", wrong: (p) => qi(p.c + p.m) },
      {
        id: "factor-hundred",
        kind: "conceptual",
        wrong: (p) => qi(100 * p.c + p.m),
      },
      { id: "mm-dropped", kind: "procedural", wrong: (p) => qi(10 * p.c) },
      { id: "multiplied", kind: "procedural", wrong: (p) => qi(p.c * p.m) },
    ],
    vars: (p) => ({
      c: s(p.c),
      m: s(p.m),
      r: s(10 * p.c + p.m),
      w: s(p.c + p.m),
    }),
    constants: [1, 10],
  }),
  defineSpec<{ base: number; step: number; k: number }>({
    id: "N5.scale.02",
    node: "N5",
    subtype: "scale",
    form: "level-in-a-measuring-cup",
    groups: [4, 5],
    answer: "integer",
    draw: (r) => ({
      base: between(r, 1, 8) * 100,
      step: pick(r, [25, 50]),
      k: between(r, 1, 3),
    }),
    solve: (p) => qi(p.base + p.step * p.k),
    reference: (p) =>
      qi(
        p.base +
          Array.from({ length: p.k }, () => p.step).reduce((a, b) => a + b, 0),
      ),
    traps: [
      {
        id: "marks-as-millilitres",
        kind: "conceptual",
        wrong: (p) => qi(p.base + p.k),
      },
      { id: "forgot-base", kind: "procedural", wrong: (p) => qi(p.step * p.k) },
      { id: "one-step", kind: "conceptual", wrong: (p) => qi(p.base + p.step) },
      {
        id: "zero-counted",
        kind: "conceptual",
        wrong: (p) => qi(p.base + p.step * (p.k - 1)),
      },
    ],
    vars: (p) => ({
      base: s(p.base),
      step: s(p.step),
      k: s(p.k),
      r: s(p.base + p.step * p.k),
      w: s(p.base + p.k),
    }),
  }),
  defineSpec<{ lo: number }>({
    id: "N5.scale.03",
    node: "N5",
    subtype: "scale",
    form: "pointer-half-way-between-two-labels",
    groups: [5, 5],
    answer: "integer",
    draw: (r) => ({ lo: between(r, 1, 9) * 100 }),
    solve: (p) => qi(p.lo + 50),
    reference: (p) => qi((p.lo + (p.lo + 100)) / 2),
    traps: [
      { id: "next-label", kind: "conceptual", wrong: (p) => qi(p.lo + 100) },
      { id: "lower-label", kind: "conceptual", wrong: (p) => qi(p.lo) },
      { id: "half-the-gap", kind: "conceptual", wrong: () => qi(50) },
      {
        id: "half-of-upper",
        kind: "conceptual",
        wrong: (p) => qi((p.lo + 100) / 2),
      },
    ],
    vars: (p) => ({ lo: s(p.lo), hi: s(p.lo + 100), r: s(p.lo + 50) }),
    constants: [50, 100],
  }),
  defineSpec<{ step: number; k: number }>({
    id: "N5.scale.04",
    node: "N5",
    subtype: "scale",
    form: "speedometer-pointer-on-a-mark",
    groups: [5, 5],
    answer: "integer",
    draw: (r) => ({ step: pick(r, [10, 20]), k: between(r, 2, 9) }),
    solve: (p) => qi(p.step * p.k),
    reference: (p) =>
      qi(Array.from({ length: p.k }, () => p.step).reduce((a, b) => a + b, 0)),
    traps: [
      {
        id: "step-plus-count",
        kind: "procedural",
        wrong: (p) => qi(p.step + p.k),
      },
      { id: "mark-number", kind: "conceptual", wrong: (p) => qi(p.k) },
      {
        id: "zero-counted",
        kind: "conceptual",
        wrong: (p) => qi(p.step * (p.k - 1)),
      },
    ],
    vars: (p) => ({
      step: s(p.step),
      k: s(p.k),
      r: s(p.step * p.k),
      w: s(p.step + p.k),
    }),
    constants: [0],
  }),
  defineSpec<{ a: number; g: number; p: number }>({
    id: "N5.scale.05",
    node: "N5",
    subtype: "scale",
    form: "value-of-one-division",
    groups: [5, 5],
    answer: "integer",
    draw: (r) => {
      const parts = pick(r, [2, 4, 5, 10]);
      return {
        a: between(r, 0, 20) * 10,
        p: parts,
        g: parts * pick(r, [1, 2, 5, 10]),
      };
    },
    solve: (p) => qi(p.g / p.p),
    reference: (p) => qi((p.a + p.g - p.a) / p.p),
    traps: [
      { id: "whole-gap", kind: "conceptual", wrong: (p) => qi(p.g) },
      { id: "multiplied", kind: "procedural", wrong: (p) => qi(p.g * p.p) },
      { id: "division-count", kind: "conceptual", wrong: (p) => qi(p.p) },
      {
        id: "marks-counted",
        kind: "conceptual",
        wrong: (p) => (p.g % (p.p + 1) === 0 ? qi(p.g / (p.p + 1)) : null),
      },
    ],
    vars: (p) => ({
      a: s(p.a),
      b: s(p.a + p.g),
      p: s(p.p),
      r: s(p.g / p.p),
      g: s(p.g),
    }),
  }),
  defineSpec<{ a: number; g: number; p: number; k: number }>({
    id: "N5.scale.06",
    node: "N5",
    subtype: "scale",
    form: "an-unlabelled-mark-between-two-labels",
    groups: [5, 6],
    answer: "integer",
    draw: (r) => {
      const parts = pick(r, [4, 5, 10]);
      return {
        a: between(r, 1, 9) * 100,
        p: parts,
        g: 100,
        k: between(r, 1, parts - 1),
      };
    },
    valid: (p) => p.g % p.p === 0,
    solve: (p) => qi(p.a + (p.g / p.p) * p.k),
    reference: (p) => qi(p.a + (p.g * p.k) / p.p),
    traps: [
      { id: "mark-number", kind: "conceptual", wrong: (p) => qi(p.a + p.k) },
      {
        id: "forgot-base",
        kind: "procedural",
        wrong: (p) => qi((p.g / p.p) * p.k),
      },
      {
        id: "zero-counted",
        kind: "conceptual",
        wrong: (p) => qi(p.a + (p.g / p.p) * (p.k - 1)),
      },
      {
        id: "one-part",
        kind: "conceptual",
        wrong: (p) => qi(p.a + p.g / p.p),
      },
    ],
    vars: (p) => ({
      a: s(p.a),
      b: s(p.a + p.g),
      p: s(p.p),
      k: s(p.k),
      r: s(p.a + (p.g / p.p) * p.k),
      w: s(p.a + p.k),
    }),
    constants: [100],
  }),
  defineSpec<{ w: number; k: number }>({
    id: "N5.scale.07",
    node: "N5",
    subtype: "scale",
    form: "kilograms-with-tenths-on-a-scale",
    groups: [6, 7],
    answer: "decimal",
    draw: (r) => ({ w: between(r, 1, 9), k: between(r, 1, 9) }),
    solve: (p) => Q.of(BigInt(10 * p.w + p.k), 10n),
    reference: (p) => Q.fromDecimal(`${p.w},${p.k}`),
    traps: [
      {
        id: "tenths-as-wholes",
        kind: "conceptual",
        wrong: (p) => qi(p.w + p.k),
      },
      {
        id: "forgot-comma",
        kind: "conceptual",
        wrong: (p) => qi(10 * p.w + p.k),
      },
      {
        id: "tenths-as-hundredths",
        kind: "conceptual",
        wrong: (p) => Q.of(BigInt(100 * p.w + p.k), 100n),
      },
      {
        id: "reversed",
        kind: "conceptual",
        wrong: (p) => Q.of(BigInt(10 * p.k + p.w), 10n),
      },
    ],
    vars: (p) => ({
      w: s(p.w),
      k: s(p.k),
      r: `${p.w},${p.k}`,
      sum: s(p.w + p.k),
    }),
    constants: [0, 1],
  }),
  defineSpec<{ b: number; k: number }>({
    id: "N5.scale.08",
    node: "N5",
    subtype: "scale",
    form: "thermometer-marks-every-two-degrees",
    groups: [5, 6],
    answer: "integer",
    draw: (r) => ({ b: 2 * between(r, 0, 12), k: between(r, 1, 6) }),
    solve: (p) => qi(p.b + 2 * p.k),
    reference: (p) =>
      qi(p.b + Array.from({ length: p.k }, () => 2).reduce((a, c) => a + c, 0)),
    traps: [
      {
        id: "marks-as-degrees",
        kind: "conceptual",
        wrong: (p) => qi(p.b + p.k),
      },
      { id: "forgot-start", kind: "procedural", wrong: (p) => qi(2 * p.k) },
      {
        id: "zero-counted",
        kind: "conceptual",
        wrong: (p) => qi(p.b + 2 * (p.k - 1)),
      },
    ],
    vars: (p) => ({
      b: s(p.b),
      k: s(p.k),
      r: s(p.b + 2 * p.k),
      w: s(p.b + p.k),
    }),
    constants: [2],
  }),
  defineSpec<{ u: number; k: number }>({
    id: "N5.scale.09",
    node: "N5",
    subtype: "scale",
    form: "bar-height-on-an-axis-with-a-unit-cell",
    groups: [5, 6],
    answer: "integer",
    draw: (r) => ({ u: pick(r, [2, 5, 10, 20]), k: between(r, 6, 19) }),
    solve: (p) => qi(p.u * p.k),
    reference: (p) =>
      qi(Array.from({ length: p.k }, () => p.u).reduce((a, b) => a + b, 0)),
    traps: [
      { id: "cells-only", kind: "conceptual", wrong: (p) => qi(p.k) },
      {
        id: "unit-plus-cells",
        kind: "procedural",
        wrong: (p) => qi(p.u + p.k),
      },
      {
        id: "extra-cell",
        kind: "conceptual",
        wrong: (p) => qi(p.u * (p.k + 1)),
      },
      {
        id: "missing-cell",
        kind: "conceptual",
        wrong: (p) => qi(p.u * (p.k - 1)),
      },
    ],
    vars: (p) => ({ u: s(p.u), k: s(p.k), r: s(p.u * p.k) }),
  }),
  defineSpec<{ a: number; b: number }>({
    id: "N5.scale.10",
    node: "N5",
    subtype: "scale",
    form: "difference-of-two-readings",
    groups: [5, 5],
    answer: "integer",
    draw: (r) => {
      const a = between(r, 100, 800);
      return { a, b: a + between(r, 50, 700) };
    },
    solve: (p) => qi(p.b - p.a),
    reference: (p) => qi(p.b + -p.a),
    traps: [
      { id: "sum", kind: "procedural", wrong: (p) => qi(p.a + p.b) },
      { id: "later-reading", kind: "conceptual", wrong: (p) => qi(p.b) },
      { id: "first-reading", kind: "conceptual", wrong: (p) => qi(p.a) },
    ],
    vars: (p) => ({ a: s(p.a), b: s(p.b), r: s(p.b - p.a), sum: s(p.a + p.b) }),
  }),
  defineSpec<{ m: number; c: number }>({
    id: "N5.scale.11",
    node: "N5",
    subtype: "scale",
    form: "length-on-a-map-with-a-scale",
    groups: [6, 7],
    answer: "integer",
    origin: { extension: "map scale, Russian grade 5 to 6 (RES-4281)" },
    draw: (r) => ({ m: pick(r, [10, 20, 50, 100, 200]), c: between(r, 3, 20) }),
    solve: (p) => qi(p.m * p.c),
    reference: (p) =>
      qi(Array.from({ length: p.c }, () => p.m).reduce((a, b) => a + b, 0)),
    traps: [
      { id: "added", kind: "procedural", wrong: (p) => qi(p.m + p.c) },
      { id: "length-only", kind: "conceptual", wrong: (p) => qi(p.c) },
      { id: "scale-only", kind: "conceptual", wrong: (p) => qi(p.m) },
      {
        id: "divided",
        kind: "procedural",
        wrong: (p) => (p.m % p.c === 0 ? qi(p.m / p.c) : null),
      },
    ],
    vars: (p) => ({
      m: s(p.m),
      c: s(p.c),
      r: digits(p.m * p.c),
      w: s(p.m + p.c),
    }),
    constants: [1],
  }),
];

export const n5Specs: readonly Spec<never>[] = [...pointSpecs, ...scaleSpecs];
