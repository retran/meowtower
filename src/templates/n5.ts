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

interface Reading {
  step: number;
  parts: number;
  lo: number;
  k: number;
}
interface Between {
  maj: number;
  sub: number;
  labels: number;
  t: number;
  lo: number;
}
interface Choose {
  step: number;
  lo: number;
  idx: number;
  ks: number[];
}
interface Pencil {
  a: number;
  len: number;
}
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
    solve: (p) => qi(1000 - 100 * p.k),
    reference: (p) => {
      let at = 1000;
      for (let j = 0; j < p.k; j += 1) at -= 100;
      return qi(at);
    },
    traps: [
      { id: "from-zero", kind: "conceptual", wrong: (p) => qi(100 * p.k) },
      {
        id: "end-counted",
        kind: "conceptual",
        wrong: (p) => qi(1000 - 100 * (p.k - 1)),
      },
      {
        id: "step-of-ten",
        kind: "conceptual",
        wrong: (p) => qi(1000 - 10 * p.k),
      },
    ],
    vars: (p) => ({ k: s(p.k), r: s(1000 - 100 * p.k) }),
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
      b: digits(p.b),
      e: digits(p.b + 100),
      k: s(p.k),
      r: digits(p.b + 10 * p.k),
      z: digits(10 * p.k),
      m: digits(p.b + p.k),
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
    reference: (p) => {
      let at = 0;
      for (let j = 0; j < p.k; j += 1) at += p.t / p.parts;
      return qi(at);
    },
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
  defineSpec<{ a: number; b: number; q: number; step: number }>({
    id: "N5.point.06",
    node: "N5",
    subtype: "point",
    form: "a-point-about-a-quarter-of-the-way",
    groups: [6, 6],
    answer: "line",
    draw: (r) => {
      const step = pick(r, [50, 100, 200, 250]);
      const a = step * between(r, 1, 6);
      return { a, b: a + 4 * step, q: pick(r, [1, 3]), step };
    },
    solve: (p) => qi(p.a + p.step * p.q),
    reference: (p) => qi(p.a + ((p.b - p.a) * p.q) / 4),
    within: (p) => qi(Math.round(0.4 * p.step)),
    traps: [
      {
        id: "mirrored",
        kind: "conceptual",
        wrong: (p) => qi(p.a + p.step * (4 - p.q)),
      },
      { id: "mark-number", kind: "conceptual", wrong: (p) => qi(p.a + p.q) },
      { id: "from-zero", kind: "conceptual", wrong: (p) => qi(p.step * p.q) },
      {
        id: "zero-counted",
        kind: "conceptual",
        wrong: (p) => qi(p.a + p.step * (p.q - 1)),
      },
    ],
    vars: (p) => ({
      a: digits(p.a),
      b: digits(p.b),
      q: s(p.q),
      step: digits(p.step),
      r: digits(p.a + p.step * p.q),
      w: digits(p.a + p.step * (4 - p.q)),
    }),
    constants: [4],
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
    reference: (p) => qi(Number(`${String(p.n).slice(0, -3)}000`)),
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
    vars: (p) => ({
      a: digits(p.a),
      b: digits(p.b),
      r: digits(p.b - p.a),
      sum: digits(p.a + p.b),
    }),
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
  defineSpec<{ step: number; k: number; base: number }>({
    id: "N5.point.10",
    node: "N5",
    subtype: "point",
    form: "mark-when-the-step-is-given",
    groups: [4, 5],
    answer: "integer",
    draw: (r) => {
      const step = pick(r, [5, 20, 25, 50]);
      const k = between(r, 2, 6);
      return { step, k, base: step * (k + 2 + between(r, 0, 3)) };
    },
    solve: (p) => qi(p.base - p.step * p.k),
    reference: (p) =>
      qi(
        Array.from({ length: p.k }, () => p.step).reduce(
          (a, b) => a - b,
          p.base,
        ),
      ),
    traps: [
      {
        id: "right-instead",
        kind: "conceptual",
        wrong: (p) => qi(p.base + p.step * p.k),
      },
      {
        id: "base-counted",
        kind: "conceptual",
        wrong: (p) => qi(p.base - p.step * (p.k - 1)),
      },
      {
        id: "number-of-marks",
        kind: "conceptual",
        wrong: (p) => qi(p.base - p.k),
      },
    ],
    vars: (p) => ({
      step: s(p.step),
      k: s(p.k),
      base: s(p.base),
      r: s(p.base - p.step * p.k),
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
    reference: (p) => {
      let at = p.a;
      let count = 0;
      while (at < p.a + p.n * p.step) {
        at += p.step;
        count += 1;
      }
      return qi(count);
    },
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
      a: digits(p.a),
      b: digits(p.a + p.n * p.step),
      step: s(p.step),
      r: s(p.n),
      m: s(p.n + 1),
    }),
    constants: [1],
  }),
  defineSpec<Reading>({
    id: "N5.point.12",
    node: "N5",
    subtype: "point",
    form: "read-a-point-from-a-line-labelled-at-its-ends",
    groups: [5, 6],
    answer: "integer",
    draw: (r) => {
      const step = pick(r, [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]);
      const parts = pick(r, [5, 8, 10]);
      return {
        step,
        parts,
        lo: r.int(3) === 0 ? 0 : step * parts * between(r, 1, 4),
        k: between(r, 1, parts - 1),
      };
    },
    valid: (p) => p.k * 2 !== p.parts,
    solve: (p) => qi(p.lo + p.k * p.step),
    reference: (p) =>
      qi(
        Array.from({ length: p.k }, () => p.step).reduce((a, b) => a + b, p.lo),
      ),
    traps: [
      { id: "mark-number", kind: "conceptual", wrong: (p) => qi(p.lo + p.k) },
      {
        id: "zero-counted",
        kind: "conceptual",
        wrong: (p) => qi(p.lo + (p.k - 1) * p.step),
      },
      {
        id: "mirror",
        kind: "conceptual",
        wrong: (p) => qi(p.lo + p.parts * p.step - p.k * p.step),
      },
    ],
    vars: (p) => ({
      lo: digits(p.lo),
      hi: digits(p.lo + p.parts * p.step),
      gap: digits(p.parts * p.step),
      parts: s(p.parts),
      step: digits(p.step),
      k: s(p.k),
      r: digits(p.lo + p.k * p.step),
    }),
    constants: [],
  }),
  defineSpec<Between>({
    id: "N5.point.13",
    node: "N5",
    subtype: "point",
    form: "read-a-point-between-two-labelled-marks",
    groups: [5, 6],
    answer: "integer",
    draw: (r) => {
      const maj = pick(r, [20, 50, 100, 200]);
      const sub = pick(r, [4, 5, 10]);
      const labels = between(r, 2, 4);
      const t = between(r, 1, (labels - 1) * sub - 1);
      return {
        maj,
        sub,
        labels,
        t,
        lo: maj * between(r, 0, 5),
      };
    },
    valid: (p) => p.maj % p.sub === 0 && p.t % p.sub !== 0,
    solve: (p) =>
      qi(
        p.lo +
          Math.floor(p.t / p.sub) * p.maj +
          (p.t % p.sub) * (p.maj / p.sub),
      ),
    reference: (p) => qi(p.lo + (p.t * p.maj) / p.sub),
    traps: [
      {
        id: "label-only",
        kind: "conceptual",
        wrong: (p) => qi(p.lo + Math.floor(p.t / p.sub) * p.maj),
      },
      {
        id: "next-label",
        kind: "conceptual",
        wrong: (p) => qi(p.lo + (Math.floor(p.t / p.sub) + 1) * p.maj),
      },
      {
        id: "unit-forgotten",
        kind: "conceptual",
        wrong: (p) =>
          qi(p.lo + Math.floor(p.t / p.sub) * p.maj + (p.t % p.sub)),
      },
    ],
    vars: (p) => {
      const l1 = p.lo + Math.floor(p.t / p.sub) * p.maj;
      const e = p.t % p.sub;
      return {
        l1: digits(l1),
        l2: digits(l1 + p.maj),
        maj: digits(p.maj),
        sub: s(p.sub),
        unit: digits(p.maj / p.sub),
        e: s(e),
        add: digits(e * (p.maj / p.sub)),
        r: digits(l1 + e * (p.maj / p.sub)),
      };
    },
    constants: [],
  }),
  defineSpec<Choose>({
    id: "N5.point.14",
    node: "N5",
    subtype: "point",
    form: "which-numbered-point-shows-the-number",
    groups: [5, 6],
    answer: "choice",
    draw: (r) => {
      const step = pick(r, [10, 20, 25, 50, 100]);
      const idx = pick(r, [2, 3, 4, 6, 7, 8]);
      const mirror = 10 - idx;
      const near =
        idx + (idx < 5 ? 1 : -1) === mirror
          ? idx - (idx < 5 ? 1 : -1)
          : idx + (idx < 5 ? 1 : -1);
      const set = new Set([idx, mirror, near]);
      while (set.size < 4) set.add(between(r, 1, 9));
      return {
        step,
        lo: r.int(2) === 0 ? 0 : step * between(r, 1, 9),
        idx,
        ks: [...set].sort((a, b) => a - b),
      };
    },
    valid: (p) => p.idx !== 10 - p.idx && p.ks.length === 4,
    options: () => ["1", "2", "3", "4"],
    solve: (p) => s(p.ks.indexOf(p.idx) + 1),
    reference: (p) => s(p.ks.filter((k) => k <= p.idx).length),
    traps: [
      {
        id: "mirror",
        kind: "conceptual",
        wrong: (p) => s(p.ks.indexOf(10 - p.idx) + 1),
      },
      {
        id: "neighbour",
        kind: "conceptual",
        wrong: (p) => {
          const near = p.idx + (p.idx < 5 ? 1 : -1);
          const at = p.ks.indexOf(
            near === 10 - p.idx ? p.idx - (p.idx < 5 ? 1 : -1) : near,
          );
          return at < 0 ? null : s(at + 1);
        },
      },
    ],
    vars: (p) => {
      const near = p.idx + (p.idx < 5 ? 1 : -1);
      const nt = near === 10 - p.idx ? p.idx - (p.idx < 5 ? 1 : -1) : near;
      return {
        x: digits(p.lo + p.idx * p.step),
        lo: digits(p.lo),
        hi: digits(p.lo + 10 * p.step),
        step: digits(p.step),
        t: s(p.idx),
        mt: s(10 - p.idx),
        nt: s(nt),
        r: s(p.ks.indexOf(p.idx) + 1),
        w_mirror: s(p.ks.indexOf(10 - p.idx) + 1),
        w_neighbour: s(p.ks.indexOf(nt) + 1),
      };
    },
    constants: [1, 2, 3, 4, 10],
  }),
  defineSpec<{ a: number; b: number; n: number }>({
    id: "N5.point.15",
    node: "N5",
    subtype: "point",
    form: "a-grasshopper-jumps-right-then-left",
    roles: {
      a: "length of a jump to the right",
      b: "length of a jump to the left",
      n: "number of jumps",
    },
    groups: [5, 6],
    origin: {
      olympiad:
        "alternating jumps taken as pairs on a number line; the grasshopper task of Kangaroo 2020, grades 3 and 4 (RES-4281)",
    },
    answer: "integer",
    draw: (r) => {
      const a = between(r, 4, 9);
      return { a, b: between(r, 1, a - 2), n: pick(r, [5, 7, 9, 11, 13]) };
    },
    solve: (p) => qi(((p.n - 1) / 2) * (p.a - p.b) + p.a),
    reference: (p) => {
      let at = 0;
      for (let j = 1; j <= p.n; j += 1) at += j % 2 === 1 ? p.a : -p.b;
      return qi(at);
    },
    traps: [
      {
        id: "last-jump-forgotten",
        kind: "procedural",
        wrong: (p) => qi(((p.n - 1) / 2) * (p.a - p.b)),
      },
      {
        id: "forgot-back",
        kind: "conceptual",
        wrong: (p) => qi(((p.n + 1) / 2) * p.a),
      },
      {
        id: "every-jump-right",
        kind: "conceptual",
        wrong: (p) => qi(p.n * p.a),
      },
      {
        id: "last-pair-complete",
        kind: "conceptual",
        wrong: (p) => qi(((p.n + 1) / 2) * (p.a - p.b)),
      },
    ],
    vars: (p) => ({
      a: s(p.a),
      b: s(p.b),
      n: s(p.n),
      d: s(p.a - p.b),
      pairs: s((p.n - 1) / 2),
      m: s(((p.n - 1) / 2) * (p.a - p.b)),
      r: s(((p.n - 1) / 2) * (p.a - p.b) + p.a),
    }),
    constants: [1],
  }),
  defineSpec<{ w: number; k: number }>({
    id: "N5.point.16",
    node: "N5",
    subtype: "point",
    form: "read-a-decimal-point-from-a-line",
    groups: [6, 7],
    answer: "decimal",
    draw: (r) => ({ w: between(r, 0, 9), k: between(r, 1, 9) }),
    solve: (p) => Q.of(BigInt(10 * p.w + p.k), 10n),
    reference: (p) => Q.fromDecimal(`${p.w},${p.k}`),
    traps: [
      {
        id: "tenths-as-wholes",
        kind: "conceptual",
        wrong: (p) => qi(p.w + p.k),
      },
      {
        id: "hundredths",
        kind: "conceptual",
        wrong: (p) => Q.of(BigInt(100 * p.w + p.k), 100n),
      },
      {
        id: "zero-counted",
        kind: "conceptual",
        wrong: (p) =>
          p.k === 1 ? null : Q.of(BigInt(10 * p.w + p.k - 1), 10n),
      },
    ],
    vars: (p) => ({
      w: s(p.w),
      w1: s(p.w + 1),
      k: s(p.k),
      t: `0,${p.k}`,
      r: `${p.w},${p.k}`,
    }),
    constants: [0.1, 1, 10],
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
    reference: (p) => {
      let mm = p.m;
      for (let j = 0; j < p.c; j += 1) mm += 10;
      return qi(mm);
    },
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
    roles: {
      base: "millilitre mark the water level rose above",
      step: "millilitres between two marks",
      k: "marks the level rose",
    },
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
    roles: {
      lo: "lower mark of the kitchen scale in grams",
      hi: "upper mark in grams",
    },
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
    vars: (p) => ({
      lo: digits(p.lo),
      hi: digits(p.lo + 100),
      r: digits(p.lo + 50),
    }),
    constants: [50, 100],
  }),
  defineSpec<{ step: number; k: number }>({
    id: "N5.scale.04",
    node: "N5",
    subtype: "scale",
    form: "speedometer-pointer-on-a-mark",
    roles: {
      step: "km/h between two marks",
      v: "speed the pointer shows in km/h",
    },
    groups: [5, 5],
    answer: "integer",
    draw: (r) => ({ step: pick(r, [10, 20]), k: between(r, 2, 9) }),
    solve: (p) => qi(p.k),
    reference: (p) => {
      let at = 0;
      let marks = 0;
      while (at < p.step * p.k) {
        at += p.step;
        marks += 1;
      }
      return qi(marks);
    },
    traps: [
      {
        id: "speed-as-mark",
        kind: "conceptual",
        wrong: (p) => qi(p.step * p.k),
      },
      {
        id: "multiplied",
        kind: "procedural",
        wrong: (p) => qi(p.step * p.step * p.k),
      },
      { id: "zero-counted", kind: "conceptual", wrong: (p) => qi(p.k + 1) },
    ],
    vars: (p) => ({
      step: s(p.step),
      v: s(p.step * p.k),
      r: s(p.k),
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
    reference: (p) => {
      let one = 1;
      while (one * p.p < p.g) one += 1;
      return qi(one);
    },
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
    reference: (p) => {
      let at = p.a;
      for (let j = 0; j < p.k; j += 1) at += p.g / p.p;
      return qi(at);
    },
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
      a: digits(p.a),
      b: digits(p.a + p.g),
      p: s(p.p),
      k: s(p.k),
      r: digits(p.a + (p.g / p.p) * p.k),
      w: digits(p.a + p.k),
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
    roles: {
      b: "degrees of the mark the column rose above",
      k: "marks the column rose",
    },
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
    roles: {
      u: "value of one cell on the axis",
      k: "height of the bar in cells",
    },
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
    roles: {
      a: "first reading of the scale",
      b: "second reading of the scale",
    },
    groups: [5, 5],
    answer: "integer",
    draw: (r) => {
      const a = between(r, 100, 800);
      return { a, b: a + between(r, 50, 700) };
    },
    solve: (p) => qi(p.b - p.a),
    reference: (p) => {
      let at = p.a;
      let steps = 0;
      while (at < p.b) {
        at += 1;
        steps += 1;
      }
      return qi(steps);
    },
    traps: [
      { id: "sum", kind: "procedural", wrong: (p) => qi(p.a + p.b) },
      { id: "later-reading", kind: "conceptual", wrong: (p) => qi(p.b) },
      { id: "first-reading", kind: "conceptual", wrong: (p) => qi(p.a) },
    ],
    vars: (p) => ({
      a: digits(p.a),
      b: digits(p.b),
      r: digits(p.b - p.a),
      sum: digits(p.a + p.b),
    }),
  }),
  defineSpec<{ m: number; c: number }>({
    id: "N5.scale.11",
    node: "N5",
    subtype: "scale",
    form: "length-on-a-map-with-a-scale",
    roles: {
      m: "metres on the ground for one centimetre of the map",
      c: "length of the road on the map in centimetres",
    },
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
  defineSpec<Pencil>({
    id: "N5.scale.12",
    node: "N5",
    subtype: "scale",
    form: "length-of-an-object-on-a-ruler-that-starts-after-zero",
    groups: [4, 5],
    answer: "integer",
    draw: (r) => {
      const a = between(r, 2, 8);
      return { a, len: between(r, 3, 9) };
    },
    valid: (p) =>
      ![5, 10, 15].includes(p.len) &&
      ![p.a, p.a + p.len].includes(p.len) &&
      p.a + p.len <= 17,
    solve: (p) => qi(p.len),
    reference: (p) => {
      let cm = 0;
      for (let at = p.a; at < p.a + p.len; at += 1) cm += 1;
      return qi(cm);
    },
    traps: [
      { id: "right-end", kind: "conceptual", wrong: (p) => qi(p.a + p.len) },
      { id: "left-end", kind: "conceptual", wrong: (p) => qi(p.a) },
      { id: "marks-counted", kind: "conceptual", wrong: (p) => qi(p.len + 1) },
    ],
    vars: (p) => ({
      a: s(p.a),
      b: s(p.a + p.len),
      r: s(p.len),
    }),
    constants: [],
  }),
  defineSpec<{ m: number; d: number }>({
    id: "N5.scale.13",
    node: "N5",
    subtype: "scale",
    form: "trees-in-an-alley-marks-and-gaps",
    roles: {
      m: "number of trees in the alley",
      d: "distance between neighbouring trees in metres",
    },
    groups: [5, 6],
    origin: {
      olympiad:
        "marks against intervals: n marks have n - 1 gaps; the tick-counting trap of RES-1200 and a Kangaroo staple",
    },
    answer: "integer",
    draw: (r) => ({ m: between(r, 5, 12), d: pick(r, [2, 3, 4, 5, 6, 8, 10]) }),
    solve: (p) => qi((p.m - 1) * p.d),
    reference: (p) =>
      qi(Array.from({ length: p.m - 1 }, () => p.d).reduce((a, b) => a + b, 0)),
    traps: [
      { id: "trees-counted", kind: "conceptual", wrong: (p) => qi(p.m * p.d) },
      {
        id: "one-gap-too-many",
        kind: "conceptual",
        wrong: (p) => qi((p.m + 1) * p.d),
      },
      { id: "gaps-only", kind: "conceptual", wrong: (p) => qi(p.m - 1) },
    ],
    vars: (p) => ({
      m: s(p.m),
      d: s(p.d),
      gaps: s(p.m - 1),
      r: s((p.m - 1) * p.d),
    }),
    constants: [1],
  }),
  defineSpec<{ lo: number; g: number; p: number }>({
    id: "N5.scale.14",
    node: "N5",
    subtype: "scale",
    form: "value-of-one-part-counted-in-a-picture",
    groups: [5, 6],
    answer: "integer",
    draw: (r) => {
      const parts = pick(r, [4, 5, 8, 10]);
      const unit = pick(r, [2, 5, 10, 20, 25]);
      return { lo: unit * parts * between(r, 0, 3), g: parts * unit, p: parts };
    },
    solve: (p) => qi(p.g / p.p),
    reference: (p) => {
      let one = 1;
      while (one * p.p < p.g) one += 1;
      return qi(one);
    },
    traps: [
      { id: "whole-gap", kind: "conceptual", wrong: (p) => qi(p.g) },
      { id: "division-count", kind: "conceptual", wrong: (p) => qi(p.p) },
      {
        id: "marks-counted",
        kind: "conceptual",
        wrong: (p) => (p.g % (p.p + 1) === 0 ? qi(p.g / (p.p + 1)) : null),
      },
    ],
    vars: (p) => ({
      lo: digits(p.lo),
      hi: digits(p.lo + p.g),
      g: digits(p.g),
      p: s(p.p),
      r: s(p.g / p.p),
    }),
    constants: [],
  }),
];

export const n5Specs: readonly Spec<never>[] = [...pointSpecs, ...scaleSpecs];
