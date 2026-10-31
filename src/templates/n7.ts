// Node N7, temperatures below zero (level 1F) and ordering numbers (level 1S) (RES-4281). The Dutch
// goals meet negative numbers as temperatures and on the number line from group 7 and order whole
// numbers under 100,000 and decimals from group 6. An order task lists the items; the player's entry
// is the list of their positions, so the answer is a sequence of positions. Texts are plain blanks in
// `content/tasks-n.ru.json`.
import { Q } from "../math/q.js";
import {
  between,
  digits,
  hundredthsText,
  pick,
  qi,
  signed,
  signOf,
  tenthsText,
} from "./draw.js";
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
const flip = (sign: "<" | "=" | ">"): "<" | "=" | ">" =>
  sign === "<" ? ">" : sign === ">" ? "<" : "=";

/** Walks a number line one degree at a time: a second route for the thermometer sums. */
const walk = (from: number, steps: number): number => {
  let at = from;
  for (let i = 0; i < Math.abs(steps); i += 1) at += Math.sign(steps);
  return at;
};

interface T {
  a: number;
  b: number;
  c: number;
}

const temp = <P>(o: {
  id: string;
  form: string;
  groups?: readonly [number, number];
  origin?: { olympiad: string } | { extension: string };
  roles?: Spec<P>["roles"];
  answer?: "integer" | "compare";
  draw: Spec<P>["draw"];
  valid?: Spec<P>["valid"];
  solve: Spec<P>["solve"];
  reference: Spec<P>["reference"];
  traps: Spec<P>["traps"];
  vars: Spec<P>["vars"];
  constants?: readonly number[];
}) =>
  define<P>({
    id: o.id,
    node: "N7",
    subtype: "thermometer",
    form: o.form,
    groups: o.groups ?? [6, 7],
    ...(o.origin ? { origin: o.origin } : {}),
    ...(o.roles ? { roles: o.roles } : {}),
    answer: o.answer ?? "integer",
    draw: o.draw,
    ...(o.valid ? { valid: o.valid } : {}),
    solve: o.solve,
    reference: o.reference,
    ...(o.traps ? { traps: o.traps } : {}),
    vars: o.vars,
    constants: o.constants ?? [0],
  });

const thermometer = [
  temp<{ a: number }>({
    id: "N7.thermometer.01",
    form: "a-temperature-below-zero-as-a-number",
    roles: { a: "degrees below zero" },
    draw: (r) => ({ a: between(r, 1, 25) }),
    solve: (p) => qi(-p.a),
    reference: (p) => qi(0 - p.a),
    traps: [{ id: "no-sign", kind: "conceptual", wrong: (p) => qi(p.a) }],
    vars: (p) => ({ a: s(p.a), r: signed(-p.a) }),
  }),
  temp<{ a: number; d: number }>({
    id: "N7.thermometer.02",
    form: "warmer-than-a-temperature-below-zero",
    roles: { a: "degrees below zero at the start", d: "degrees of warming" },
    draw: (r) => ({ a: between(r, 1, 15), d: between(r, 1, 25) }),
    valid: (p) => p.a !== p.d,
    solve: (p) => qi(p.d - p.a),
    reference: (p) => qi(walk(-p.a, p.d)),
    traps: [
      {
        id: "added-magnitudes",
        kind: "procedural",
        wrong: (p) => qi(-(p.a + p.d)),
      },
      { id: "positive-sum", kind: "procedural", wrong: (p) => qi(p.a + p.d) },
      { id: "sign-flipped", kind: "conceptual", wrong: (p) => qi(p.a - p.d) },
    ],
    vars: (p) => ({
      a: s(p.a),
      d: s(p.d),
      r: signed(p.d - p.a),
      w: signed(-(p.a + p.d)),
    }),
  }),
  temp<{ t: number; d: number }>({
    id: "N7.thermometer.03",
    form: "colder-than-a-positive-temperature",
    roles: { t: "degrees above zero at the start", d: "degrees of cooling" },
    draw: (r) => ({ t: between(r, 1, 15), d: between(r, 2, 30) }),
    valid: (p) => p.d > p.t,
    solve: (p) => qi(p.t - p.d),
    reference: (p) => qi(walk(p.t, -p.d)),
    traps: [
      {
        id: "positive-result",
        kind: "conceptual",
        wrong: (p) => qi(p.d - p.t),
      },
      { id: "start-ignored", kind: "conceptual", wrong: (p) => qi(-p.d) },
      {
        id: "negative-sum",
        kind: "procedural",
        wrong: (p) => qi(-(p.t + p.d)),
      },
    ],
    vars: (p) => ({
      t: s(p.t),
      d: s(p.d),
      r: signed(p.t - p.d),
      w: s(p.d - p.t),
    }),
  }),
  temp<{ a: number; b: number }>({
    id: "N7.thermometer.04",
    form: "rise-from-below-zero-to-above-zero",
    roles: { a: "degrees below zero at night", b: "degrees above zero by day" },
    draw: (r) => ({ a: between(r, 1, 20), b: between(r, 1, 20) }),
    valid: (p) => p.a !== p.b,
    solve: (p) => qi(p.a + p.b),
    reference: (p) => qi(walk(0, p.b) - walk(0, -p.a)),
    traps: [
      {
        id: "difference-of-numbers",
        kind: "conceptual",
        wrong: (p) => qi(Math.abs(p.b - p.a)),
      },
      { id: "above-zero-only", kind: "conceptual", wrong: (p) => qi(p.b) },
      { id: "below-zero-only", kind: "conceptual", wrong: (p) => qi(p.a) },
    ],
    vars: (p) => ({
      a: s(p.a),
      b: s(p.b),
      r: s(p.a + p.b),
      w: s(Math.abs(p.b - p.a)),
    }),
  }),
  temp<{ a: number; b: number }>({
    id: "N7.thermometer.05",
    form: "compare-two-temperatures-below-zero",
    answer: "compare",
    draw: (r) => ({ a: between(r, 1, 30), b: between(r, 1, 30) }),
    valid: (p) => p.a !== p.b,
    solve: (p) => signOf(-p.a, -p.b),
    reference: (p) => (p.a > p.b ? "<" : ">"),
    traps: [
      {
        id: "bigger-number-wins",
        kind: "conceptual",
        wrong: (p) => signOf(p.a, p.b),
      },
    ],
    vars: (p) => ({
      a: s(p.a),
      b: s(p.b),
      sign: signOf(-p.a, -p.b),
      w: flip(signOf(-p.a, -p.b)),
    }),
  }),
  temp<{ v: number[] }>({
    id: "N7.thermometer.06",
    form: "the-coldest-of-four-temperatures",
    draw: (r) => {
      const v = new Set<number>();
      while (v.size < 4) v.add(between(r, -9, 9));
      return { v: [...v] };
    },
    valid: (p) => {
      const min = Math.min(...p.v);
      const far = [...p.v].sort((x, y) => Math.abs(y) - Math.abs(x))[0];
      return min < 0 && far !== min && Math.abs(far ?? 0) !== Math.abs(min);
    },
    solve: (p) => qi(Math.min(...p.v)),
    reference: (p) => qi([...p.v].sort((x, y) => x - y)[0] ?? 0),
    traps: [
      {
        id: "largest-number",
        kind: "conceptual",
        wrong: (p) =>
          qi([...p.v].sort((x, y) => Math.abs(y) - Math.abs(x))[0] ?? 0),
      },
      {
        id: "smallest-magnitude",
        kind: "conceptual",
        wrong: (p) =>
          qi([...p.v].sort((x, y) => Math.abs(x) - Math.abs(y))[0] ?? 0),
      },
      { id: "warmest", kind: "conceptual", wrong: (p) => qi(Math.max(...p.v)) },
    ],
    vars: (p) => ({
      list: p.v.map(signed).join("; "),
      r: signed(Math.min(...p.v)),
      w: signed([...p.v].sort((x, y) => Math.abs(y) - Math.abs(x))[0] ?? 0),
    }),
  }),
  temp<{ s: number; f: number; u: number }>({
    id: "N7.thermometer.07",
    form: "falls-then-rises",
    roles: {
      s: "morning temperature in degrees",
      f: "degrees of the fall by evening",
      u: "degrees of the warming at night",
    },
    draw: (r) => ({
      s: between(r, 1, 10),
      f: between(r, 8, 25),
      u: between(r, 1, 10),
    }),
    valid: (p) => p.s - p.f + p.u !== 0 && p.s - p.f - p.u !== p.s - p.f + p.u,
    solve: (p) => qi(p.s - p.f + p.u),
    reference: (p) => qi(walk(walk(p.s, -p.f), p.u)),
    traps: [
      {
        id: "both-down",
        kind: "procedural",
        wrong: (p) => qi(p.s - p.f - p.u),
      },
      {
        id: "swapped-moves",
        kind: "procedural",
        wrong: (p) => qi(p.s + p.f - p.u),
      },
      { id: "ignored-start", kind: "conceptual", wrong: (p) => qi(p.u - p.f) },
    ],
    vars: (p) => ({
      s: s(p.s),
      f: s(p.f),
      u: s(p.u),
      r: signed(p.s - p.f + p.u),
      w: signed(p.s - p.f - p.u),
      mid: signed(p.s - p.f),
    }),
  }),
  temp<{ a: number; b: number }>({
    id: "N7.thermometer.08",
    form: "difference-of-two-temperatures-below-zero",
    roles: {
      a: "degrees below zero in the morning",
      b: "degrees below zero by day",
    },
    draw: (r) => ({ a: between(r, 5, 30), b: between(r, 1, 25) }),
    valid: (p) => p.a > p.b,
    solve: (p) => qi(p.a - p.b),
    reference: (p) => {
      let steps = 0;
      for (let x = -p.a; x < -p.b; x += 1) steps += 1;
      return qi(steps);
    },
    traps: [
      {
        id: "added-magnitudes",
        kind: "procedural",
        wrong: (p) => qi(p.a + p.b),
      },
      { id: "sign-flipped", kind: "conceptual", wrong: (p) => qi(p.b - p.a) },
    ],
    vars: (p) => ({ a: s(p.a), b: s(p.b), r: s(p.a - p.b), w: s(p.a + p.b) }),
  }),
  temp<{ a: number }>({
    id: "N7.thermometer.09",
    form: "degrees-to-rise-to-zero",
    roles: { a: "degrees below zero now" },
    draw: (r) => ({ a: between(r, 1, 30) }),
    solve: (p) => qi(p.a),
    reference: (p) => {
      let steps = 0;
      for (let x = -p.a; x < 0; x += 1) steps += 1;
      return qi(steps);
    },
    traps: [
      { id: "negative-answer", kind: "conceptual", wrong: (p) => qi(-p.a) },
    ],
    vars: (p) => ({ a: s(p.a), r: s(p.a), w: signed(-p.a) }),
  }),
  temp<T>({
    id: "N7.thermometer.10",
    form: "range-of-three-temperatures",
    roles: {
      a: "temperature on the first day",
      b: "temperature on the second day",
      c: "temperature on the third day",
    },
    draw: (r) => ({
      a: between(r, -15, -1),
      b: between(r, -5, 12),
      c: between(r, 1, 15),
    }),
    valid: (p) =>
      p.b !== p.a &&
      p.b !== p.c &&
      Math.max(p.b, p.c) + p.a !== Math.max(p.b, p.c) - p.a,
    solve: (p) => qi(Math.max(p.a, p.b, p.c) - Math.min(p.a, p.b, p.c)),
    reference: (p) => {
      const l = [p.a, p.b, p.c].sort((x, y) => x - y);
      return qi((l[2] ?? 0) - (l[0] ?? 0));
    },
    traps: [
      {
        id: "sum-of-extremes",
        kind: "conceptual",
        wrong: (p) => qi(Math.max(p.a, p.b, p.c) + Math.min(p.a, p.b, p.c)),
      },
      {
        id: "from-zero",
        kind: "conceptual",
        wrong: (p) => qi(-Math.min(p.a, p.b, p.c)),
      },
      {
        id: "above-zero-only",
        kind: "conceptual",
        wrong: (p) => qi(Math.max(p.a, p.b, p.c)),
      },
    ],
    vars: (p) => ({
      a: signed(p.a),
      b: signed(p.b),
      c: signed(p.c),
      r: s(Math.max(p.a, p.b, p.c) - Math.min(p.a, p.b, p.c)),
      w: signed(Math.max(p.a, p.b, p.c) + Math.min(p.a, p.b, p.c)),
      hi: signed(Math.max(p.a, p.b, p.c)),
      lo: signed(Math.min(p.a, p.b, p.c)),
    }),
  }),
  temp<{ t: number; d: number; h: number }>({
    id: "N7.thermometer.11",
    form: "temperature-after-hours-of-falling",
    roles: {
      t: "starting temperature",
      d: "degrees the temperature falls each hour",
      h: "number of hours",
    },
    draw: (r) => ({
      t: between(r, 5, 12),
      d: between(r, 2, 5),
      h: between(r, 3, 6),
    }),
    valid: (p) => p.t - p.d * p.h < 0 && p.t - p.d !== p.t - p.d * p.h,
    solve: (p) => qi(p.t - p.d * p.h),
    reference: (p) =>
      qi(Array.from({ length: p.h }, () => -p.d).reduce((a, b) => a + b, p.t)),
    traps: [
      { id: "one-hour", kind: "procedural", wrong: (p) => qi(p.t - p.d) },
      {
        id: "start-ignored",
        kind: "conceptual",
        wrong: (p) => qi(-p.d * p.h),
      },
      {
        id: "fall-added",
        kind: "procedural",
        wrong: (p) => qi(p.t + p.d * p.h),
      },
    ],
    vars: (p) => ({
      t: s(p.t),
      d: s(p.d),
      h: s(p.h),
      r: signed(p.t - p.d * p.h),
      w: signed(p.t - p.d),
      f: s(p.d * p.h),
    }),
  }),
  temp<{ v: number }>({
    id: "N7.thermometer.12",
    form: "read-a-thermometer-with-tick-marks",
    groups: [7, 8],
    draw: (r) => ({ v: between(r, -19, 19) }),
    valid: (p) => p.v % 5 !== 0,
    solve: (p) => qi(p.v),
    reference: (p) => qi(Number(`${p.v}`)),
    traps: [
      {
        id: "sign-lost",
        kind: "conceptual",
        wrong: (p) => (p.v < 0 ? qi(-p.v) : null),
      },
      {
        id: "wrong-direction",
        kind: "conceptual",
        wrong: (p) => qi(2 * Math.ceil(p.v / 5) * 5 - p.v),
      },
      {
        id: "label-only",
        kind: "conceptual",
        wrong: (p) => qi(Math.ceil(p.v / 5) * 5),
      },
    ],
    vars: (p) => {
      const top = Math.ceil(p.v / 5) * 5;
      return {
        L: signed(top),
        k: s(top - p.v),
        r: signed(p.v),
      };
    },
    constants: [0, 1, 5],
  }),
  temp<{ q: number; step: number; k: number }>({
    id: "N7.thermometer.13",
    form: "read-a-point-on-a-line-that-crosses-zero",
    groups: [7, 8],
    draw: (r) => {
      const step = pick(r, [1, 2, 5, 10]);
      const q = r.int(3) === 0 ? between(r, 11, 15) : between(r, 4, 8);
      return { step, q, k: between(r, 1, 9) };
    },
    valid: (p) => p.k !== p.q && p.k * 2 !== 10,
    solve: (p) => qi(p.step * (p.k - p.q)),
    reference: (p) =>
      qi(-p.step * p.q + ((p.step * (10 - p.q) - -p.step * p.q) * p.k) / 10),
    traps: [
      {
        id: "sign-lost",
        kind: "conceptual",
        wrong: (p) => (p.k < p.q ? qi(p.step * (p.q - p.k)) : null),
      },
      {
        id: "wrong-direction",
        kind: "conceptual",
        wrong: (p) => qi(-p.step * (p.q + p.k)),
      },
      {
        id: "mirror",
        kind: "conceptual",
        wrong: (p) => qi(p.step * (10 - p.q - p.k)),
      },
    ],
    vars: (p) => ({
      lo: signed(-p.step * p.q),
      hi: signed(p.step * (10 - p.q)),
      gap: s(10 * p.step),
      step: s(p.step),
      k: s(p.k),
      r: signed(p.step * (p.k - p.q)),
    }),
    constants: [0, 10],
  }),
  temp<{ s: number; a: number; b: number }>({
    id: "N7.thermometer.14",
    form: "a-snail-climbs-a-thermometer-and-slides-back",
    roles: {
      s: "degrees below zero where the snail starts",
      a: "degrees it climbs by day",
      b: "degrees it slides by night",
    },
    groups: [7, 8],
    origin: {
      olympiad:
        "the snail that climbs by day and slides back by night, with the last day without a slide; RES-4281 (MCCME school stage style)",
    },
    draw: (r) => {
      const a = between(r, 3, 7);
      const b = between(r, 1, a - 2);
      return { a, b, s: between(r, a + 2, a + 5 * (a - b)) };
    },
    valid: (p) => (p.s - p.a) % (p.a - p.b) !== 0 || p.s % p.a !== 0,
    solve: (p) => qi(Math.ceil((p.s - p.a) / (p.a - p.b)) + 1),
    reference: (p) => {
      let at = -p.s;
      for (let day = 1; day < 100; day += 1) {
        at += p.a;
        if (at >= 0) return qi(day);
        at -= p.b;
      }
      return qi(-1);
    },
    traps: [
      {
        id: "no-slide",
        kind: "conceptual",
        wrong: (p) => qi(Math.ceil(p.s / p.a)),
      },
      {
        id: "forgot-last-day",
        kind: "procedural",
        wrong: (p) => qi(Math.ceil((p.s - p.a) / (p.a - p.b))),
      },
      {
        id: "slide-in-last-day",
        kind: "conceptual",
        wrong: (p) => qi(Math.ceil(p.s / (p.a - p.b))),
      },
    ],
    vars: (p) => {
      const g = p.a - p.b;
      const c = Math.ceil((p.s - p.a) / g);
      return {
        s: s(p.s),
        a: s(p.a),
        b: s(p.b),
        g: s(g),
        m: s(p.s - p.a),
        c: s(c),
        cg: s(c * g),
        r: s(c + 1),
      };
    },
    constants: [0, 1],
  }),
];

/** An order task over drawn values; the answer lists the positions in the right order. */
interface V {
  v: number[];
}

const ordering = (o: {
  id: string;
  form: string;
  groups: readonly [number, number];
  origin?: { olympiad: string };
  items: (r: Parameters<Spec<V>["draw"]>[0]) => number[];
  label: (v: number, i: number, all: readonly number[]) => string;
  dir: "asc" | "desc";
  trap: { id: string; order: (v: readonly number[]) => number[] };
  more?: { id: string; order: (v: readonly number[]) => number[] }[];
  constants?: readonly number[];
}) => {
  const sortIdx = (v: readonly number[], key: (i: number) => number) =>
    v.map((_, i) => i).sort((a, b) => key(a) - key(b) || a - b);
  const correct = (v: readonly number[]): string[] =>
    sortIdx(v, (i) => (o.dir === "asc" ? 1 : -1) * (v[i] ?? 0)).map((i) =>
      s(i + 1),
    );
  return define<V>({
    id: o.id,
    node: "N7",
    subtype: "order",
    form: o.form,
    groups: o.groups,
    ...(o.origin ? { origin: o.origin } : {}),
    answer: "order",
    draw: (r) => ({ v: o.items(r) }),
    valid: (p) => new Set(p.v).size === p.v.length,
    solve: (p) => correct(p.v),
    reference: (p) => {
      // Insertion sort, a route that shares no code with the key sort above.
      const out: number[] = [];
      p.v.forEach((x, i) => {
        let at = out.length;
        while (
          at > 0 &&
          (o.dir === "asc"
            ? (p.v[out[at - 1] ?? 0] ?? 0) > x
            : (p.v[out[at - 1] ?? 0] ?? 0) < x)
        )
          at -= 1;
        out.splice(at, 0, i);
      });
      return out.map((i) => s(i + 1));
    },
    traps: [o.trap, ...(o.more ?? [])].map((tr) => ({
      id: tr.id,
      kind: "conceptual" as const,
      wrong: (p: V) => tr.order(p.v).map((i) => s(i + 1)),
    })),
    vars: (p) => {
      const labels = p.v.map((x, i) => o.label(x, i, p.v));
      const order = sortIdx(
        p.v,
        (i) => (o.dir === "asc" ? 1 : -1) * (p.v[i] ?? 0),
      );
      const wrong = o.trap.order(p.v);
      const join = o.dir === "asc" ? " < " : " > ";
      return {
        list: labels.join("; "),
        sorted: order.map((i) => labels[i] ?? "").join(join),
        wrongList: wrong.map((i) => labels[i] ?? "").join(join),
        first: labels[order[0] ?? 0] ?? "",
        last: labels[order[order.length - 1] ?? 0] ?? "",
        ...Object.fromEntries(
          [o.trap, ...(o.more ?? [])].map((tr) => [
            `w_${tr.id.replace(/-/g, "_")}`,
            tr
              .order(p.v)
              .map((i) => labels[i] ?? "")
              .join(join),
          ]),
        ),
      };
    },
    constants: o.constants ?? [],
  });
};

const idx = (
  v: readonly number[],
  key: (x: number, i: number) => number | string,
) =>
  v
    .map((_, i) => i)
    .sort((a, b) => {
      const ka = key(v[a] ?? 0, a);
      const kb = key(v[b] ?? 0, b);
      return ka < kb ? -1 : ka > kb ? 1 : a - b;
    });
const draw4 = (
  r: Parameters<Spec<V>["draw"]>[0],
  lo: number,
  hi: number,
  n = 4,
) => {
  const v = new Set<number>();
  while (v.size < n) v.add(between(r, lo, hi));
  return [...v];
};
const reversed = {
  id: "descending-instead",
  order: (v: readonly number[]) => idx(v, (x) => -x),
};
/** The order of a child who thinks that, of two negative numbers, the one with the bigger digit is bigger. */
const negativesBySize = (sign: 1 | -1) => ({
  id: "negatives-by-size",
  order: (v: readonly number[]) =>
    idx(v, (x) => sign * (x < 0 ? -1_000_000 + Math.abs(x) : x)),
});
const decLabel = (h: number): string =>
  h % 10 === 0 ? tenthsText(h / 10) : hundredthsText(h);

const orderSpecs = [
  ordering({
    id: "N7.order.01",
    form: "whole-numbers-from-smallest-to-largest",
    groups: [5, 6],
    items: (r) => draw4(r, 11, 999, 5),
    label: (x) => s(x),
    dir: "asc",
    trap: { id: "largest-first", order: (v) => idx(v, (x) => -x) },
    more: [
      {
        id: "by-first-digit-as-text",
        order: (v) => idx(v, (x) => String(x)),
      },
    ],
  }),
  ordering({
    id: "N7.order.02",
    form: "numbers-of-both-signs-from-smallest-to-largest",
    groups: [7, 7],
    items: (r) => draw4(r, -20, 20, 5),
    label: (x) => signed(x),
    dir: "asc",
    trap: {
      id: "by-size-without-sign",
      order: (v) => idx(v, (x) => Math.abs(x)),
    },
    more: [negativesBySize(1), reversed],
  }),
  ordering({
    id: "N7.order.03",
    form: "tenths-and-hundredths-from-smallest-to-largest",
    groups: [6, 7],
    items: (r) => {
      const v = new Set<number>();
      while (v.size < 4)
        v.add(r.int(2) === 0 ? 10 * between(r, 1, 9) : between(r, 11, 99));
      return [...v];
    },
    label: (h) => decLabel(h),
    dir: "asc",
    trap: {
      id: "longer-is-bigger",
      order: (v) => idx(v, (h) => Number(decLabel(h).split(",")[1] ?? "0")),
    },
    more: [reversed],
  }),
  ordering({
    id: "N7.order.04",
    form: "numbers-with-different-digit-counts",
    groups: [6, 7],
    items: (r) => {
      const v = [
        between(r, 1000, 9999),
        between(r, 10_000, 99_999),
        between(r, 100, 999),
        between(r, 100_000, 999_999),
      ];
      const k = r.int(4);
      return [...v.slice(k), ...v.slice(0, k)];
    },
    label: (x) => digits(x),
    dir: "asc",
    trap: {
      id: "by-first-digit-as-text",
      order: (v) => idx(v, (x) => String(x)),
    },
    more: [reversed],
  }),
  ordering({
    id: "N7.order.05",
    form: "numbers-of-both-signs-from-largest-to-smallest",
    groups: [7, 7],
    items: (r) => draw4(r, -30, 30, 5),
    label: (x) => signed(x),
    dir: "desc",
    trap: { id: "smallest-first", order: (v) => idx(v, (x) => x) },
    more: [
      {
        id: "by-size-without-sign",
        order: (v) => idx(v, (x) => -Math.abs(x)),
      },
      negativesBySize(-1),
    ],
  }),
  ordering({
    id: "N7.order.06",
    form: "wholes-and-tenths-mixed",
    groups: [6, 7],
    items: (r) => {
      const v = new Set<number>();
      while (v.size < 5) v.add(between(r, 5, 60));
      return [...v];
    },
    label: (t) => (t % 10 === 0 ? s(t / 10) : tenthsText(t)),
    dir: "asc",
    trap: {
      id: "comma-ignored",
      order: (v) =>
        idx(v, (t) =>
          Number((t % 10 === 0 ? s(t / 10) : tenthsText(t)).replace(",", "")),
        ),
    },
    more: [reversed],
  }),
  ordering({
    id: "N7.order.07",
    form: "numbers-with-the-same-hundreds",
    groups: [5, 6],
    items: (r) => {
      const h = between(r, 1, 9) * 100;
      const v = new Set<number>();
      while (v.size < 5) v.add(h + between(r, 1, 99));
      return [...v];
    },
    label: (x) => s(x),
    dir: "asc",
    trap: { id: "by-last-digit", order: (v) => idx(v, (x) => x % 10) },
    more: [reversed],
  }),
  ordering({
    id: "N7.order.08",
    form: "temperatures-from-coldest-to-warmest",
    groups: [7, 7],
    items: (r) => draw4(r, -25, 15, 5),
    label: (x) => signed(x),
    dir: "asc",
    trap: {
      id: "by-size-without-sign",
      order: (v) => idx(v, (x) => Math.abs(x)),
    },
    more: [negativesBySize(1), reversed],
  }),
  ordering({
    id: "N7.order.09",
    form: "sums-from-smallest-to-largest",
    groups: [5, 6],
    items: (r) => draw4(r, 40, 180, 4),
    label: (x, i, all) => {
      const first = 10 + ((x * 7 + i * 13) % (x - 19));
      void all;
      return `${first} + ${x - first}`;
    },
    dir: "asc",
    trap: {
      id: "by-first-addend",
      order: (v) =>
        idx(v, (x, i) => Number(`${10 + ((x * 7 + i * 13) % (x - 19))}`)),
    },
    more: [
      {
        id: "by-second-addend",
        order: (v) =>
          idx(v, (x, i) => x - (10 + ((x * 7 + i * 13) % (x - 19)))),
      },
      reversed,
    ],
  }),
  ordering({
    id: "N7.order.10",
    form: "numbers-made-of-the-same-three-digits",
    groups: [5, 6],
    origin: { olympiad: "digit-arrangement ordering, RES-4281" },
    items: (r) => {
      const d = [pick(r, [1, 2, 3]), pick(r, [4, 5, 6]), pick(r, [7, 8, 9])];
      const perms = [
        [0, 1, 2],
        [0, 2, 1],
        [1, 0, 2],
        [1, 2, 0],
        [2, 0, 1],
        [2, 1, 0],
      ].map(
        ([a = 0, b = 0, c = 0]) =>
          100 * (d[a] ?? 0) + 10 * (d[b] ?? 0) + (d[c] ?? 0),
      );
      const skip = r.int(6);
      const kept = perms.filter((_, i) => i !== skip);
      // Shuffled, so that the list is not already in order.
      for (let i = kept.length - 1; i > 0; i -= 1) {
        const j = r.int(i + 1);
        const t = kept[i] ?? 0;
        kept[i] = kept[j] ?? 0;
        kept[j] = t;
      }
      return kept;
    },
    label: (x) => s(x),
    dir: "asc",
    trap: { id: "by-last-digit", order: (v) => idx(v, (x) => x % 10) },
    more: [reversed],
  }),
  ordering({
    id: "N7.order.11",
    form: "decimals-from-largest-to-smallest",
    groups: [6, 7],
    items: (r) => {
      const v = new Set<number>();
      while (v.size < 4) v.add(between(r, 101, 999));
      return [...v];
    },
    label: (h) => hundredthsText(h),
    dir: "desc",
    trap: { id: "smallest-first", order: (v) => idx(v, (x) => x) },
    more: [
      {
        id: "by-digits-after-comma",
        order: (v) => idx(v, (h) => -(h % 100)),
      },
    ],
  }),
  define<{ v: number[]; by: number }>({
    id: "N7.order.12",
    node: "N7",
    subtype: "order",
    form: "the-greatest-of-four-numbers-of-both-signs",
    groups: [7, 8],
    answer: "choice",
    draw: (r) => {
      const v = new Set<number>();
      while (v.size < 4) v.add(between(r, -15, 15));
      return { v: [...v], by: r.int(4) };
    },
    valid: (p) => {
      const far = [...p.v].sort((x, y) => Math.abs(y) - Math.abs(x))[0] ?? 0;
      const near = [...p.v].sort((x, y) => Math.abs(x) - Math.abs(y))[0] ?? 0;
      const top = Math.max(...p.v);
      return (
        Math.min(...p.v) < 0 &&
        top > 0 &&
        far !== top &&
        near !== top &&
        new Set(p.v.map(Math.abs)).size === 4
      );
    },
    options: (p) =>
      p.v.map((_, i) => p.v[(i + p.by) % 4] ?? 0).map((x) => signed(x)),
    solve: (p) => signed(Math.max(...p.v)),
    reference: (p) => signed([...p.v].sort((x, y) => y - x)[0] ?? 0),
    traps: [
      {
        id: "largest-magnitude",
        kind: "conceptual",
        wrong: (p) =>
          signed([...p.v].sort((x, y) => Math.abs(y) - Math.abs(x))[0] ?? 0),
      },
      {
        id: "smallest-magnitude",
        kind: "conceptual",
        wrong: (p) =>
          signed([...p.v].sort((x, y) => Math.abs(x) - Math.abs(y))[0] ?? 0),
      },
    ],
    vars: (p) => ({
      r: signed(Math.max(...p.v)),
      w_largest_magnitude: signed(
        [...p.v].sort((x, y) => Math.abs(y) - Math.abs(x))[0] ?? 0,
      ),
      w_smallest_magnitude: signed(
        [...p.v].sort((x, y) => Math.abs(x) - Math.abs(y))[0] ?? 0,
      ),
    }),
    constants: [0],
  }),
  define<{ na: number; b: number }>({
    id: "N7.order.13",
    node: "N7",
    subtype: "order",
    form: "how-many-whole-numbers-lie-across-zero",
    groups: [7, 8],
    origin: {
      olympiad:
        "counting the whole numbers across zero, the zero itself included; RES-4281 (Kangaroo-style count)",
    },
    answer: "integer",
    draw: (r) => ({ na: between(r, 2, 9), b: between(r, 2, 9) }),
    solve: (p) => qi(p.na + p.b - 1),
    reference: (p) => {
      let c = 0;
      for (let x = -p.na + 1; x < p.b; x += 1) c += 1;
      return qi(c);
    },
    traps: [
      {
        id: "forgot-zero",
        kind: "conceptual",
        wrong: (p) => qi(p.na + p.b - 2),
      },
      {
        id: "ends-included",
        kind: "conceptual",
        wrong: (p) => qi(p.na + p.b + 1),
      },
      { id: "distance", kind: "conceptual", wrong: (p) => qi(p.na + p.b) },
    ],
    vars: (p) => ({
      a: signed(-p.na),
      na: s(p.na),
      b: s(p.b),
      r: s(p.na + p.b - 1),
      w_forgot_zero: s(p.na + p.b - 2),
      w_ends_included: s(p.na + p.b + 1),
      w_distance: s(p.na + p.b),
    }),
    constants: [1],
  }),
  define<{ t: number }>({
    id: "N7.order.14",
    node: "N7",
    subtype: "order",
    form: "the-largest-whole-number-below-a-decimal",
    groups: [7, 8],
    origin: {
      extension:
        "negative decimals on the number line, Russian grade 6 (RES-4281)",
    },
    answer: "integer",
    draw: (r) => ({ t: (r.int(4) === 0 ? 1 : -1) * between(r, 11, 99) }),
    valid: (p) => p.t % 10 !== 0 && Math.abs(p.t) > 10,
    solve: (p) => qi(Math.floor(p.t / 10)),
    reference: (p) => {
      let x = Math.floor(p.t / 10) + 2;
      while (x * 10 >= p.t) x -= 1;
      return qi(x);
    },
    traps: [
      {
        id: "toward-zero",
        kind: "conceptual",
        wrong: (p) => qi(Math.trunc(p.t / 10)),
      },
      {
        id: "nearest",
        kind: "conceptual",
        wrong: (p) => qi(Math.sign(p.t) * Math.round(Math.abs(p.t) / 10)),
      },
    ],
    vars: (p) => ({
      x: tenthsText(p.t),
      lo: signed(Math.floor(p.t / 10)),
      hi: signed(Math.floor(p.t / 10) + 1),
      r: signed(Math.floor(p.t / 10)),
      w_toward_zero: signed(Math.trunc(p.t / 10)),
      w_nearest: signed(Math.sign(p.t) * Math.round(Math.abs(p.t) / 10)),
    }),
    constants: [],
  }),
  define<{ w: number; ta: number; hb: number }>({
    id: "N7.order.15",
    node: "N7",
    subtype: "order",
    form: "compare-two-negative-decimals",
    groups: [8, 8],
    answer: "compare",
    draw: (r) => ({
      w: between(r, 1, 9),
      ta: between(r, 1, 9),
      hb: between(r, 1, 99),
    }),
    valid: (p) => p.hb % 10 !== 0,
    solve: (p) => signOf(-(100 * p.w + 10 * p.ta), -(100 * p.w + p.hb)),
    reference: (p) => (p.ta * 10 > p.hb ? "<" : ">"),
    traps: [
      {
        id: "magnitude-wins",
        kind: "conceptual",
        wrong: (p) => signOf(100 * p.w + 10 * p.ta, 100 * p.w + p.hb),
      },
    ],
    vars: (p) => {
      const ma = 100 * p.w + 10 * p.ta;
      const mb = 100 * p.w + p.hb;
      return {
        a: `−${tenthsText(10 * p.w + p.ta)}`,
        b: `−${hundredthsText(mb)}`,
        ma: tenthsText(10 * p.w + p.ta),
        mb: hundredthsText(mb),
        ms: signOf(ma, mb),
        sign: signOf(-ma, -mb),
        w_magnitude_wins: signOf(ma, mb),
      };
    },
    constants: [0],
  }),
];

export const n7Specs: readonly Spec<never>[] = [...thermometer, ...orderSpecs];
