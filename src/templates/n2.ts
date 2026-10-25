// Node N2, place value: composing a number from its tens and ones, then hundreds and thousands
// (RES-4281). The Dutch goals split numbers into tens and ones at group 4, reach 1,000 at group 5 and
// 100,000 at group 6. Texts are plain blanks in `content/tasks-n.ru.json`, keyed by the template id.
import { between, qi } from "./draw.js";
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
    traps: [
      {
        id: "swapped",
        kind: "conceptual",
        wrong: (p: TO) => qi(10 * p.o + p.t),
      },
      { id: "added", kind: "procedural", wrong: (p: TO) => qi(p.t + p.o) },
    ],
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
    traps: [
      { id: "ones-digit", kind: "conceptual", wrong: (p: N) => qi(p.n % 10) },
    ],
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
    traps: [
      {
        id: "added-digits",
        kind: "procedural",
        wrong: (p: TO) => qi(p.t + p.o),
      },
    ],
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
    traps: [
      {
        id: "added",
        kind: "procedural",
        wrong: (p: HTO) => qi(p.h + p.t + p.o),
      },
      {
        id: "reversed",
        kind: "conceptual",
        wrong: (p: HTO) => qi(100 * p.o + 10 * p.t + p.h),
      },
    ],
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
    traps: [
      {
        id: "tens-digit",
        kind: "conceptual",
        wrong: (p: N) => qi(Math.floor(p.n / 10) % 10),
      },
    ],
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
    traps: [
      {
        id: "counted-coins",
        kind: "conceptual",
        wrong: (p: TO) => qi(p.t + p.o),
      },
    ],
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
    traps: [
      { id: "face-value", kind: "conceptual", wrong: (p: HTO) => qi(p.t) },
    ],
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
    traps: [
      {
        id: "ones-digit-only",
        kind: "conceptual",
        wrong: (p: { n: number; t: number }) => qi(p.n % 10),
      },
    ],
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
    traps: [
      {
        id: "unchanged",
        kind: "conceptual",
        wrong: (p: TO) => qi(10 * p.t + p.o),
      },
    ],
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
    traps: [
      {
        id: "dropped-place",
        kind: "conceptual",
        wrong: (p: { k: number; h: number; t: number; o: number }) =>
          qi(Number(`${p.k}${p.t}${p.o}`)),
      },
    ],
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
    traps: [
      {
        id: "largest",
        kind: "conceptual",
        wrong: (p: TO) => qi(Math.max(10 * p.t + p.o, 10 * p.o + p.t)),
      },
    ],
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
    origin: { olympiad: "Kangaroo-style digit-sum counting (RES-4281)" },
    answer: "integer",
    draw: (r) => ({ sum: between(r, 3, 17) }),
    solve: (p: { sum: number }) => qi(p.sum <= 9 ? p.sum : 19 - p.sum),
    reference: (p: { sum: number }) => {
      let c = 0;
      for (let n = 10; n <= 99; n += 1) {
        const [t, o] = digitsOf(n);
        if ((t ?? 0) + (o ?? 0) === p.sum) c += 1;
      }
      return qi(c);
    },
    traps: [
      {
        id: "count-single-digit",
        kind: "conceptual",
        wrong: (p: { sum: number }) => (p.sum <= 9 ? qi(p.sum + 1) : null),
      },
      {
        id: "small-case-formula",
        kind: "procedural",
        wrong: (p: { sum: number }) => (p.sum > 9 ? qi(p.sum) : null),
      },
    ],
    vars: (p: { sum: number }) => ({
      sum: s(p.sum),
      r: s(p.sum <= 9 ? p.sum : 19 - p.sum),
      more: s(p.sum + 1),
    }),
    constants: [1, 9, 10, 19],
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
    traps: [
      {
        id: "no-empty-place",
        kind: "conceptual",
        wrong: (p: { h: number; o: number }) => qi(10 * p.h + p.o),
      },
    ],
    vars: (p: { h: number; o: number }) => ({
      h: s(p.h),
      o: s(p.o),
      r: s(100 * p.h + p.o),
      short: s(10 * p.h + p.o),
    }),
    constants: [10, 100],
  } satisfies Spec<{ h: number; o: number }>,
] as const;

export const n2Specs = specs as unknown as readonly Spec<never>[];
