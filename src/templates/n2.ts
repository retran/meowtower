// Node N2, place value: composing a number from its tens and ones, then hundreds and thousands
// (RES-4281). The Dutch goals split numbers into tens and ones at group 4, reach 1,000 at group 5 and
// 100,000 at group 6. Texts are plain blanks in `content/tasks-n.ru.json`, keyed by the template id.
import { between, digits, qi } from "./draw.js";
import { withWrongAnswers } from "./n1.js";
import type { Spec } from "./spec.js";

interface TO {
  t: number;
  o: number;
}
interface HTO {
  h: number;
  t: number;
  o: number;
}
interface N {
  n: number;
}

const s = String;
const digitsOf = (n: number): number[] => [...s(n)].map(Number);

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
const tensOf = (n: number): number => Math.floor(n / 10);

const specs = [
  {
    id: "N2.compose.01",
    node: "N2",
    subtype: "compose",
    form: "tens-and-ones-to-a-number",
    groups: [3, 4],
    answer: "integer",
    draw: (r): TO => ({ t: between(r, 1, 9), o: between(r, 1, 9) }),
    solve: (p: TO) => qi(10 * p.t + p.o),
    reference: (p: TO) => qi(Number(`${p.t}${p.o}`)),
    traps: numberTraps<TO>([
      ["swapped", "conceptual", (p) => 10 * p.o + p.t],
      ["added", "procedural", (p) => p.t + p.o],
      ["only-tens", "procedural", (p) => 10 * p.t],
    ]),
    roles: { t: "count of tens", o: "count of ones" },
    vars: (p: TO) => ({
      t: s(p.t),
      o: s(p.o),
      r: s(10 * p.t + p.o),
      sw: s(10 * p.o + p.t),
      sum: s(p.t + p.o),
    }),
    constants: [10],
  } satisfies Spec<TO>,
  {
    id: "N2.compose.02",
    node: "N2",
    subtype: "compose",
    form: "how-many-tens-in-a-two-digit-number",
    groups: [3, 4],
    answer: "integer",
    draw: (r): N => ({ n: between(r, 20, 99) }),
    valid: (p: N) => p.n % 10 !== 0 && Math.floor(p.n / 10) !== p.n % 10,
    solve: (p: N) => qi(Math.floor(p.n / 10)),
    reference: (p: N) => qi(digitsOf(p.n)[0] ?? 0),
    traps: numberTraps<N>([
      ["ones-digit", "conceptual", (p) => p.n % 10],
      ["tens-value", "conceptual", (p) => 10 * tensOf(p.n)],
    ]),
    vars: (p: N) => ({
      n: s(p.n),
      r: s(Math.floor(p.n / 10)),
      o: s(p.n % 10),
    }),
    constants: [10],
  } satisfies Spec<N>,
  {
    id: "N2.compose.03",
    node: "N2",
    subtype: "compose",
    form: "ones-digit-of-a-three-digit-number",
    groups: [5, 5],
    answer: "integer",
    draw: (r): N => ({ n: between(r, 101, 999) }),
    valid: (p: N) => {
      const [h, t, o] = digitsOf(p.n);
      return t !== o && h !== o && o !== 0;
    },
    solve: (p: N) => qi(p.n % 10),
    reference: (p: N) => qi(digitsOf(p.n).at(-1) ?? 0),
    traps: [
      {
        id: "tens-digit",
        kind: "conceptual",
        wrong: (p: N) => qi(Math.floor(p.n / 10) % 10),
      },
      {
        id: "hundreds-digit",
        kind: "conceptual",
        wrong: (p: N) => qi(Math.floor(p.n / 100)),
      },
    ],
    vars: (p: N) => ({
      n: s(p.n),
      r: s(p.n % 10),
      t: s(Math.floor(p.n / 10) % 10),
      h: s(Math.floor(p.n / 100)),
    }),
    constants: [10],
  } satisfies Spec<N>,
  {
    id: "N2.compose.04",
    node: "N2",
    subtype: "compose",
    form: "sum-of-a-round-number-and-ones",
    groups: [4, 4],
    answer: "integer",
    draw: (r): TO => ({ t: between(r, 2, 9), o: between(r, 1, 9) }),
    solve: (p: TO) => qi(10 * p.t + p.o),
    reference: (p: TO) => qi(Number(`${p.t}${p.o}`)),
    traps: numberTraps<TO>([
      ["added-digits", "procedural", (p) => p.t + p.o],
      ["glued", "procedural", (p) => Number(`${10 * p.t}${p.o}`)],
      ["swapped", "conceptual", (p) => 10 * p.o + p.t],
    ]),
    vars: (p: TO) => ({
      tv: s(10 * p.t),
      o: s(p.o),
      r: s(10 * p.t + p.o),
      sum: s(p.t + p.o),
    }),
    constants: [10],
  } satisfies Spec<TO>,
  {
    id: "N2.compose.05",
    node: "N2",
    subtype: "compose",
    form: "hundreds-tens-and-ones-to-a-number",
    groups: [5, 5],
    answer: "integer",
    draw: (r): HTO => ({
      h: between(r, 1, 9),
      t: between(r, 1, 9),
      o: between(r, 1, 9),
    }),
    solve: (p: HTO) => qi(100 * p.h + 10 * p.t + p.o),
    reference: (p: HTO) => qi(Number(`${p.h}${p.t}${p.o}`)),
    traps: numberTraps<HTO>([
      ["added", "procedural", (p) => p.h + p.t + p.o],
      ["reversed", "conceptual", (p) => 100 * p.o + 10 * p.t + p.h],
      ["tens-as-ones", "procedural", (p) => 100 * p.h + p.t + p.o],
      ["each-in-full", "conceptual", (p) => Number(`${p.h}${10 * p.t}${p.o}`)],
    ]),
    vars: (p: HTO) => ({
      h: s(p.h),
      t: s(p.t),
      o: s(p.o),
      r: s(100 * p.h + 10 * p.t + p.o),
      sum: s(p.h + p.t + p.o),
      rev: s(100 * p.o + 10 * p.t + p.h),
    }),
    constants: [10, 100],
  } satisfies Spec<HTO>,
  {
    id: "N2.compose.06",
    node: "N2",
    subtype: "compose",
    form: "how-many-tens-in-a-three-digit-number",
    groups: [5, 5],
    answer: "integer",
    draw: (r): N => ({ n: between(r, 110, 999) }),
    valid: (p: N) => p.n % 10 !== 0 && Math.floor(p.n / 10) % 10 !== 0,
    solve: (p: N) => qi(Math.floor(p.n / 10)),
    reference: (p: N) => qi(Number(s(p.n).slice(0, -1))),
    traps: numberTraps<N>([
      ["tens-digit", "conceptual", (p) => tensOf(p.n) % 10],
      ["hundreds-only-tens", "conceptual", (p) => 10 * Math.floor(p.n / 100)],
      ["hundreds-digit", "conceptual", (p) => Math.floor(p.n / 100)],
    ]),
    vars: (p: N) => ({
      n: s(p.n),
      r: s(Math.floor(p.n / 10)),
      td: s(Math.floor(p.n / 10) % 10),
    }),
    constants: [10],
  } satisfies Spec<N>,
  {
    id: "N2.compose.07",
    node: "N2",
    subtype: "compose",
    form: "coins-of-ten-and-one",
    groups: [3, 4],
    answer: "integer",
    draw: (r): TO => ({ t: between(r, 1, 9), o: between(r, 1, 9) }),
    solve: (p: TO) => qi(10 * p.t + p.o),
    reference: (p: TO) =>
      qi(
        Array(p.t)
          .fill(10)
          .concat(Array(p.o).fill(1))
          .reduce((a: number, b: number) => a + b, 0),
      ),
    traps: numberTraps<TO>([
      ["counted-coins", "conceptual", (p) => p.t + p.o],
      ["all-as-tens", "conceptual", (p) => 10 * (p.t + p.o)],
      ["swapped-counts", "conceptual", (p) => 10 * p.o + p.t],
    ]),
    roles: { t: "count of ten-euro notes", o: "count of one-euro coins" },
    vars: (p: TO) => ({
      t: s(p.t),
      o: s(p.o),
      r: s(10 * p.t + p.o),
      cnt: s(p.t + p.o),
    }),
    constants: [1, 10],
  } satisfies Spec<TO>,
  {
    id: "N2.compose.08",
    node: "N2",
    subtype: "compose",
    form: "value-of-a-digit-in-a-three-digit-number",
    groups: [5, 5],
    answer: "integer",
    draw: (r): HTO => ({
      h: between(r, 1, 9),
      t: between(r, 1, 9),
      o: between(r, 0, 9),
    }),
    valid: (p: HTO) => new Set([p.h, p.t, p.o]).size === 3,
    solve: (p: HTO) => qi(10 * p.t),
    reference: (p: HTO) => qi(Number(`${p.t}0`)),
    traps: numberTraps<HTO>([
      ["face-value", "conceptual", (p) => p.t],
      ["digit-with-ones", "conceptual", (p) => 10 * p.t + p.o],
      ["hundreds-value", "conceptual", (p) => 100 * p.t],
    ]),
    vars: (p: HTO) => ({
      n: s(100 * p.h + 10 * p.t + p.o),
      d: s(p.t),
      r: s(10 * p.t),
    }),
    constants: [10],
  } satisfies Spec<HTO>,
  {
    id: "N2.compose.09",
    node: "N2",
    subtype: "compose",
    form: "missing-ones-after-some-tens",
    groups: [4, 4],
    answer: "integer",
    draw: (r) => {
      const n = between(r, 30, 99);
      return { n, t: between(r, 1, Math.floor(n / 10) - 1) };
    },
    valid: (p: { n: number; t: number }) => p.n % 10 !== 0,
    solve: (p: { n: number; t: number }) => qi(p.n - 10 * p.t),
    reference: (p: { n: number; t: number }) =>
      qi((Math.floor(p.n / 10) - p.t) * 10 + (p.n % 10)),
    traps: numberTraps<{ n: number; t: number }>([
      ["ones-digit-only", "conceptual", (p) => p.n % 10],
      ["tens-subtracted", "procedural", (p) => p.n - p.t],
      ["remaining-tens", "conceptual", (p) => tensOf(p.n) - p.t],
    ]),
    vars: (p: { n: number; t: number }) => ({
      n: s(p.n),
      t: s(p.t),
      r: s(p.n - 10 * p.t),
      o: s(p.n % 10),
      rest: s(Math.floor(p.n / 10) - p.t),
    }),
    constants: [10],
  } satisfies Spec<{ n: number; t: number }>,
  {
    id: "N2.compose.10",
    node: "N2",
    subtype: "compose",
    form: "swap-the-digits",
    groups: [4, 4],
    answer: "integer",
    draw: (r): TO => ({ t: between(r, 1, 9), o: between(r, 1, 9) }),
    valid: (p: TO) => p.t !== p.o,
    solve: (p: TO) => qi(10 * p.o + p.t),
    reference: (p: TO) => qi(Number([...`${p.t}${p.o}`].reverse().join(""))),
    traps: numberTraps<TO>([
      ["unchanged", "conceptual", (p) => 10 * p.t + p.o],
      ["added-digits", "procedural", (p) => p.t + p.o],
    ]),
    vars: (p: TO) => ({
      n: s(10 * p.t + p.o),
      r: s(10 * p.o + p.t),
      t: s(p.t),
      o: s(p.o),
    }),
    constants: [10],
  } satisfies Spec<TO>,
  {
    id: "N2.compose.11",
    node: "N2",
    subtype: "compose",
    form: "thousands-hundreds-tens-ones-with-an-empty-place",
    groups: [6, 6],
    answer: "integer",
    draw: (r) => ({
      k: between(r, 1, 9),
      h: r.int(2) === 0 ? 0 : between(r, 1, 9),
      t: between(r, 1, 9),
      o: between(r, 1, 9),
    }),
    solve: (p: { k: number; h: number; t: number; o: number }) =>
      qi(1000 * p.k + 100 * p.h + 10 * p.t + p.o),
    reference: (p: { k: number; h: number; t: number; o: number }) =>
      qi(Number(`${p.k}${p.h}${p.t}${p.o}`)),
    traps: numberTraps<{ k: number; h: number; t: number; o: number }>([
      [
        "dropped-place",
        "conceptual",
        (p) => (p.h === 0 ? Number(`${p.k}${p.t}${p.o}`) : null),
      ],
      [
        "zero-at-end",
        "conceptual",
        (p) => (p.h === 0 ? Number(`${p.k}${p.t}${p.o}0`) : null),
      ],
      ["digits-added", "procedural", (p) => p.k + p.h + p.t + p.o],
      [
        "unscaled-places",
        "procedural",
        (p) => 1000 * p.k + 100 * p.h + p.t + p.o,
      ],
    ]),
    vars: (p: { k: number; h: number; t: number; o: number }) => ({
      k: s(p.k),
      h: s(p.h),
      t: s(p.t),
      o: s(p.o),
      r: s(1000 * p.k + 100 * p.h + 10 * p.t + p.o),
      short: s(Number(`${p.k}${p.t}${p.o}`)),
    }),
    constants: [0, 10, 100, 1000],
  } satisfies Spec<{ k: number; h: number; t: number; o: number }>,
  {
    id: "N2.compose.12",
    node: "N2",
    subtype: "compose",
    form: "smallest-two-digit-number-from-two-digits",
    groups: [4, 5],
    answer: "integer",
    draw: (r): TO => ({ t: between(r, 0, 9), o: between(r, 1, 9) }),
    valid: (p: TO) => p.t !== p.o,
    solve: (p: TO) =>
      qi(Math.min(...[10 * p.t + p.o, 10 * p.o + p.t].filter((x) => x >= 10))),
    reference: (p: TO) => {
      const all = [`${p.t}${p.o}`, `${p.o}${p.t}`]
        .filter((x) => !x.startsWith("0"))
        .map(Number)
        .sort((a, b) => a - b);
      return qi(all[0] ?? -1);
    },
    traps: numberTraps<TO>([
      [
        "largest",
        "conceptual",
        (p) => Math.max(10 * p.t + p.o, 10 * p.o + p.t),
      ],
      ["leading-zero", "conceptual", (p) => (p.t === 0 ? p.o : null)],
      ["single-digit", "conceptual", (p) => Math.min(p.t, p.o)],
    ]),
    vars: (p: TO) => ({
      a: s(p.t),
      b: s(p.o),
      r: s(
        Math.min(...[10 * p.t + p.o, 10 * p.o + p.t].filter((x) => x >= 10)),
      ),
      big: s(Math.max(10 * p.t + p.o, 10 * p.o + p.t)),
    }),
    constants: [10],
  } satisfies Spec<TO>,
  {
    id: "N2.compose.13",
    node: "N2",
    subtype: "compose",
    form: "count-two-digit-numbers-with-a-given-digit-sum",
    groups: [5, 6],
    origin: {
      olympiad:
        "counting the numbers with a given digit sum, a Kangaroo-style count; RES-4281 (Kangoeroe 2003)",
    },
    answer: "integer",
    draw: (r) => ({ sum: between(r, 2, 9) }),
    solve: (p: { sum: number }) => qi(p.sum),
    reference: (p: { sum: number }) => {
      let c = 0;
      for (let n = 10; n <= 99; n += 1) {
        const [t, o] = digitsOf(n);
        if ((t ?? 0) + (o ?? 0) === p.sum) c += 1;
      }
      return qi(c);
    },
    traps: numberTraps<{ sum: number }>([
      ["count-single-digit", "conceptual", (p) => p.sum + 1],
      ["zero-ones-forgotten", "conceptual", (p) => p.sum - 1],
      [
        "ignored-order",
        "conceptual",
        (p) => {
          let c = 0;
          for (let y = 0; y <= 9; y += 1) {
            const x = p.sum - y;
            if (x >= Math.max(y, 1) && x <= 9) c += 1;
          }
          return c;
        },
      ],
    ]),
    vars: (p: { sum: number }) => ({
      sum: s(p.sum),
      r: s(p.sum),
    }),
    constants: [1],
  } satisfies Spec<{ sum: number }>,
  {
    id: "N2.compose.14",
    node: "N2",
    subtype: "compose",
    form: "hundreds-and-ones-with-no-tens",
    groups: [5, 5],
    answer: "integer",
    draw: (r) => ({ h: between(r, 1, 9), o: between(r, 1, 9) }),
    solve: (p: { h: number; o: number }) => qi(100 * p.h + p.o),
    reference: (p: { h: number; o: number }) => qi(Number(`${p.h}0${p.o}`)),
    traps: numberTraps<{ h: number; o: number }>([
      ["no-empty-place", "conceptual", (p) => 10 * p.h + p.o],
      ["zero-at-end", "conceptual", (p) => Number(`${p.h}${p.o}0`)],
      ["added-digits", "procedural", (p) => p.h + p.o],
    ]),
    vars: (p: { h: number; o: number }) => ({
      h: s(p.h),
      o: s(p.o),
      r: s(100 * p.h + p.o),
      short: s(10 * p.h + p.o),
    }),
    constants: [10, 100],
  } satisfies Spec<{ h: number; o: number }>,
  {
    id: "N2.compose.15",
    node: "N2",
    subtype: "compose",
    form: "the-place-of-a-multiplier-in-a-split-number",
    groups: [5, 6],
    answer: "integer",
    draw: (r) => ({
      a: between(r, 1, 9),
      b: between(r, 1, 9),
      k: between(r, 1, 3),
    }),
    solve: (p: { a: number; b: number; k: number }) => qi(10 ** p.k),
    // The second route tries every place until the whole sum gives the number.
    reference: (p: { a: number; b: number; k: number }) => {
      const n = Number(`${p.a}${p.b}${"0".repeat(p.k)}`);
      return qi(
        [10, 100, 1000, 10000].find(
          (c) => p.a * 10 ** (p.k + 1) + p.b * c === n,
        ) ?? -1,
      );
    },
    traps: numberTraps<{ a: number; b: number; k: number }>([
      ["place-above", "conceptual", (p) => 10 ** (p.k + 1)],
      ["place-below", "conceptual", (p) => 10 ** (p.k - 1)],
      ["digit-as-place", "conceptual", (p) => p.b],
    ]),
    vars: (p: { a: number; b: number; k: number }) => ({
      a: s(p.a),
      b: s(p.b),
      n: digits(10 ** (p.k + 1) * p.a + 10 ** p.k * p.b),
      big: digits(10 ** (p.k + 1)),
      bigv: s(10 ** (p.k + 1)),
      unitv: s(10 ** p.k),
      r: digits(10 ** p.k),
    }),
    constants: [10, 100, 1000, 10000],
  } satisfies Spec<{ a: number; b: number; k: number }>,
  {
    id: "N2.compose.16",
    node: "N2",
    subtype: "compose",
    form: "ten-more-across-a-hundred",
    groups: [5, 5],
    answer: "integer",
    draw: (r) => ({ h: between(r, 1, 8), o: between(r, 1, 9) }),
    solve: (p: { h: number; o: number }) => qi(100 * p.h + 90 + p.o + 10),
    reference: (p: { h: number; o: number }) =>
      qi(Number(`${p.h}9${p.o}`) + 10),
    traps: numberTraps<{ h: number; o: number }>([
      [
        "ten-written-in-the-tens-place",
        "conceptual",
        (p) => Number(`${p.h}10${p.o}`),
      ],
      ["plus-one", "conceptual", (p) => 100 * p.h + 90 + p.o + 1],
      ["plus-a-hundred", "conceptual", (p) => 100 * p.h + 90 + p.o + 100],
    ]),
    vars: (p: { h: number; o: number }) => ({
      n: s(100 * p.h + 90 + p.o),
      h: s(p.h),
      o: s(p.o),
      r: s(100 * p.h + 100 + p.o),
      next: s(p.h + 1),
    }),
    constants: [1, 10, 100],
  } satisfies Spec<{ h: number; o: number }>,
  {
    id: "N2.compose.17",
    node: "N2",
    subtype: "compose",
    form: "smallest-three-digit-number-with-a-zero-card",
    groups: [5, 6],
    answer: "integer",
    draw: (r): TO => ({ t: between(r, 1, 9), o: between(r, 1, 9) }),
    valid: (p: TO) => p.t !== p.o,
    solve: (p: TO) => qi(100 * Math.min(p.t, p.o) + Math.max(p.t, p.o)),
    reference: (p: TO) => {
      const perms = [
        [0, p.t, p.o],
        [0, p.o, p.t],
        [p.t, 0, p.o],
        [p.o, 0, p.t],
        [p.t, p.o, 0],
        [p.o, p.t, 0],
      ]
        .filter((x) => x[0] !== 0)
        .map((x) => Number(x.join("")))
        .sort((x, y) => x - y);
      return qi(perms[0] ?? -1);
    },
    traps: numberTraps<TO>([
      [
        "zero-first",
        "conceptual",
        (p) => 10 * Math.min(p.t, p.o) + Math.max(p.t, p.o),
      ],
      [
        "zero-last",
        "conceptual",
        (p) => 100 * Math.min(p.t, p.o) + 10 * Math.max(p.t, p.o),
      ],
      [
        "larger-digit-first",
        "conceptual",
        (p) => 100 * Math.max(p.t, p.o) + Math.min(p.t, p.o),
      ],
    ]),
    vars: (p: TO) => ({
      z: "0",
      a: s(p.t),
      b: s(p.o),
      lo: s(Math.min(p.t, p.o)),
      hi: s(Math.max(p.t, p.o)),
      r: s(100 * Math.min(p.t, p.o) + Math.max(p.t, p.o)),
      two: s(10 * Math.min(p.t, p.o) + Math.max(p.t, p.o)),
    }),
    constants: [10, 100],
  } satisfies Spec<TO>,
  {
    id: "N2.compose.18",
    node: "N2",
    subtype: "compose",
    form: "largest-four-digit-number-from-four-cards",
    groups: [5, 6],
    answer: "integer",
    draw: (r) => {
      const pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      const v: number[] = [];
      while (v.length < 4) {
        const x = pool.splice(r.int(pool.length), 1)[0] ?? 0;
        v.push(x);
      }
      return { v };
    },
    valid: (p: { v: number[] }) =>
      p.v.join("") !== [...p.v].sort((x, y) => y - x).join("") &&
      p.v.join("") !== [...p.v].sort((x, y) => x - y).join(""),
    solve: (p: { v: number[] }) =>
      qi(Number([...p.v].sort((x, y) => y - x).join(""))),
    reference: (p: { v: number[] }) => {
      let best = -1;
      const go = (left: number[], acc: string): void => {
        if (left.length === 0) {
          best = Math.max(best, Number(acc));
          return;
        }
        left.forEach((d, i) =>
          go([...left.slice(0, i), ...left.slice(i + 1)], acc + d),
        );
      };
      go(p.v, "");
      return qi(best);
    },
    traps: numberTraps<{ v: number[] }>([
      ["in-the-given-order", "conceptual", (p) => Number(p.v.join(""))],
      [
        "smallest-first",
        "conceptual",
        (p) => Number([...p.v].sort((x, y) => x - y).join("")),
      ],
      [
        "only-the-first-largest",
        "procedural",
        (p) => {
          const top = Math.max(...p.v);
          const rest = p.v.filter((x, i) => i !== p.v.indexOf(top));
          return Number([top, ...rest].join(""));
        },
      ],
    ]),
    vars: (p: { v: number[] }) => ({
      a: s(p.v[0]),
      b: s(p.v[1]),
      c: s(p.v[2]),
      d: s(p.v[3]),
      e1: s([...p.v].sort((x, y) => y - x)[0]),
      e2: s([...p.v].sort((x, y) => y - x)[1]),
      e3: s([...p.v].sort((x, y) => y - x)[2]),
      e4: s([...p.v].sort((x, y) => y - x)[3]),
      r: s(Number([...p.v].sort((x, y) => y - x).join(""))),
    }),
    constants: [10, 100, 1000],
  } satisfies Spec<{ v: number[] }>,
  {
    id: "N2.compose.19",
    node: "N2",
    subtype: "compose",
    form: "name-of-the-place-of-a-digit",
    groups: [5, 6],
    answer: "choice",
    draw: (r) => {
      const pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      const v: number[] = [];
      while (v.length < 4) {
        const x = pool.splice(r.int(pool.length), 1)[0] ?? 0;
        if (v.length === 0 && x === 0) pool.push(0);
        else v.push(x);
      }
      return { v, at: r.int(4) };
    },
    options: () => ["1", "2", "3", "4"],
    solve: (p: { v: number[]; at: number }) => s(4 - p.at),
    reference: (p: { v: number[]; at: number }) => s(p.v.slice(p.at).length),
    traps: [
      {
        id: "counted-from-the-left",
        kind: "conceptual" as const,
        wrong: (p: { v: number[]; at: number }) => s(p.at + 1),
      },
    ],
    vars: (p: { v: number[]; at: number }) => ({
      n: digits(Number(p.v.join(""))),
      d: s(p.v[p.at]),
      r: s(4 - p.at),
      left: s(p.at + 1),
    }),
    constants: [1, 2, 3, 4],
  } satisfies Spec<{ v: number[]; at: number }>,
  {
    id: "N2.compose.20",
    node: "N2",
    subtype: "compose",
    form: "how-many-numbers-from-digit-cards-with-a-zero",
    groups: [5, 6],
    origin: {
      olympiad:
        "counting arrangements of digit cards with a leading-zero rule; RES-4281 (MCCME school stage 2021 grade 4 style)",
    },
    answer: "integer",
    draw: (r) => {
      const k = between(r, 3, 4);
      const pool = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const v: number[] = [];
      while (v.length < k - 1)
        v.push(pool.splice(r.int(pool.length), 1)[0] ?? 1);
      return { v: [...v].sort((x, y) => x - y), k };
    },
    solve: (p: { v: number[]; k: number }) =>
      qi((p.k - 1) * (p.k === 3 ? 2 : 6)),
    reference: (p: { v: number[]; k: number }) => {
      const all = [0, ...p.v];
      const seen = new Set<string>();
      const go = (left: number[], acc: string): void => {
        if (left.length === 0) {
          if (!acc.startsWith("0")) seen.add(acc);
          return;
        }
        left.forEach((d, i) =>
          go([...left.slice(0, i), ...left.slice(i + 1)], acc + d),
        );
      };
      go(all, "");
      return qi(seen.size);
    },
    traps: numberTraps<{ v: number[]; k: number }>([
      ["zero-may-start", "conceptual", (p) => (p.k === 3 ? 6 : 24)],
      ["only-rotations", "procedural", (p) => p.k],
    ]),
    vars: (p: { v: number[]; k: number }) => ({
      list: ["0", ...p.v.map(s)].join(", "),
      k: s(p.k),
      f: s(p.k - 1),
      rest: s(p.k === 3 ? 2 : 6),
      all: s(p.k === 3 ? 6 : 24),
      r: s((p.k - 1) * (p.k === 3 ? 2 : 6)),
    }),
    constants: [1, 2, 6],
  } satisfies Spec<{ v: number[]; k: number }>,
  {
    id: "N2.compose.21",
    node: "N2",
    subtype: "compose",
    form: "largest-three-digit-number-with-a-digit-sum",
    groups: [5, 6],
    origin: {
      olympiad:
        "building the largest number greedily under a digit-sum limit; RES-4281 (MCCME school stage 2021 grade 4 style)",
    },
    answer: "integer",
    draw: (r) => ({ sum: between(r, 10, 26) }),
    solve: (p: { sum: number }) => {
      const a = 9;
      const b = Math.min(9, p.sum - a);
      return qi(100 * a + 10 * b + (p.sum - a - b));
    },
    reference: (p: { sum: number }) => {
      for (let n = 999; n >= 100; n -= 1)
        if (digitsOf(n).reduce((x, y) => x + y, 0) === p.sum) return qi(n);
      return qi(-1);
    },
    traps: numberTraps<{ sum: number }>([
      [
        "digits-spread-evenly",
        "conceptual",
        (p) => {
          const a = Math.ceil(p.sum / 3);
          const b = Math.ceil((p.sum - a) / 2);
          return 100 * a + 10 * b + (p.sum - a - b);
        },
      ],
      [
        "the-smallest-number",
        "conceptual",
        (p) => {
          for (let n = 100; n <= 999; n += 1)
            if (digitsOf(n).reduce((x, y) => x + y, 0) === p.sum) return n;
          return null;
        },
      ],
    ]),
    vars: (p: { sum: number }) => {
      const b = Math.min(9, p.sum - 9);
      return {
        sum: s(p.sum),
        left: s(p.sum - 9),
        tens: s(b),
        left2: s(p.sum - 9 - b),
        r: s(100 * 9 + 10 * b + (p.sum - 9 - b)),
      };
    },
    constants: [9, 10, 100],
  } satisfies Spec<{ sum: number }>,
  {
    id: "N2.compose.22",
    node: "N2",
    subtype: "compose",
    form: "count-two-digit-numbers-with-a-large-digit-sum",
    groups: [5, 6],
    origin: {
      olympiad:
        "counting the numbers with a digit sum above nine, where the units limit shrinks the range; RES-4281 (Kangoeroe 2003)",
    },
    answer: "integer",
    draw: (r) => ({ sum: between(r, 10, 17) }),
    solve: (p: { sum: number }) => qi(19 - p.sum),
    reference: (p: { sum: number }) => {
      let c = 0;
      for (let n = 10; n <= 99; n += 1) {
        const [t, o] = digitsOf(n);
        if ((t ?? 0) + (o ?? 0) === p.sum) c += 1;
      }
      return qi(c);
    },
    traps: numberTraps<{ sum: number }>([
      ["last-digit-forgotten", "procedural", (p) => 18 - p.sum],
      ["lowest-tens-digit", "conceptual", (p) => p.sum - 9],
    ]),
    vars: (p: { sum: number }) => ({
      sum: s(p.sum),
      low: s(p.sum - 9),
      r: s(19 - p.sum),
    }),
    constants: [1, 9],
  } satisfies Spec<{ sum: number }>,
  {
    id: "N2.compose.23",
    node: "N2",
    subtype: "compose",
    form: "number-shown-by-flats-rods-and-cubes",
    groups: [5, 5],
    answer: "integer",
    draw: (r): HTO => ({
      h: between(r, 1, 3),
      t: r.int(4) === 0 ? 0 : between(r, 1, 9),
      o: between(r, 1, 9),
    }),
    solve: (p: HTO) => qi(100 * p.h + 10 * p.t + p.o),
    reference: (p: HTO) => qi(Number(`${p.h}${p.t}${p.o}`)),
    traps: numberTraps<HTO>([
      ["pieces-counted", "procedural", (p) => p.h + p.t + p.o],
      [
        "empty-place-dropped",
        "conceptual",
        (p) => (p.t === 0 ? Number(`${p.h}${p.o}`) : null),
      ],
      ["places-reversed", "conceptual", (p) => 100 * p.o + 10 * p.t + p.h],
      ["rods-as-cubes", "procedural", (p) => 100 * p.h + p.t + p.o],
    ]),
    vars: (p: HTO) => ({
      h: s(p.h),
      t: s(p.t),
      o: s(p.o),
      r: s(100 * p.h + 10 * p.t + p.o),
      short: s(10 * p.h + p.o),
    }),
    constants: [1, 10, 100],
  } satisfies Spec<HTO>,
  {
    id: "N2.compose.24",
    node: "N2",
    subtype: "compose",
    form: "number-shown-by-rods-and-cubes",
    groups: [3, 4],
    answer: "integer",
    draw: (r): TO => ({ t: between(r, 1, 9), o: between(r, 1, 9) }),
    valid: (p: TO) => p.t !== p.o,
    solve: (p: TO) => qi(10 * p.t + p.o),
    reference: (p: TO) => qi(Number(`${p.t}${p.o}`)),
    traps: numberTraps<TO>([
      ["pieces-counted", "procedural", (p) => p.t + p.o],
      ["places-swapped", "conceptual", (p) => 10 * p.o + p.t],
      ["rods-only", "procedural", (p) => 10 * p.t],
    ]),
    vars: (p: TO) => ({
      t: s(p.t),
      o: s(p.o),
      r: s(10 * p.t + p.o),
    }),
    constants: [1, 10],
  } satisfies Spec<TO>,
] as const;

export const n2Specs = withWrongAnswers(
  specs as unknown as readonly Spec<never>[],
);
