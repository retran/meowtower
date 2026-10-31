// The pictures of domain S added after the first table in `pictures.ts`, by template id; one here replaces one there.
// The drawers below are the ones domain S needs beyond `svg.ts`: charts read against a scale, tally marks, dice tables,
// sectors, graphs to choose among. A picture shows what the task gives and never writes what it asks (REQ-7546).
import { tm } from "./kitf.js";
import type { Draw } from "./pictures.js";
import {
  barBetween,
  beads,
  matchsticks,
  numberRow,
  bars,
  gallery,
  lineGraph,
  pictogram,
  pie,
  table,
} from "./svg.js";

const n = (v: number[], i: number): number => v[i] ?? 0;

const PAL = [
  "#4f8ef7",
  "#f59e42",
  "#4caf70",
  "#e5534b",
  "#a66bd9",
  "#e0b83a",
] as const;
const pal = (i: number): string => PAL[i % PAL.length] ?? "#4f8ef7";
const tint = (i: number, o = 0.35): string =>
  `fill="${pal(i)}" fill-opacity="${o}"`;
const num = (x: number): string => String(Math.round(x * 100) / 100);
const wrap = (w: number, h: number, body: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${num(w)} ${num(h)}" role="img" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">${body}</svg>`;
const line = (x1: number, y1: number, x2: number, y2: number): string =>
  `<line x1="${num(x1)}" y1="${num(y1)}" x2="${num(x2)}" y2="${num(y2)}"/>`;
const dot = (x: number, y: number, r = 3, colour = "currentColor"): string =>
  `<circle cx="${num(x)}" cy="${num(y)}" r="${r}" fill="${colour}"/>`;

/** Rows of tally marks: strokes in bundles of five, four upright and one slanting across them. */
export function tally(counts: readonly number[]): string {
  const rowH = 30;
  const x0 = 30;
  const widest = Math.max(1, ...counts.map((c) => Math.ceil(c / 5) * 34));
  const body = counts
    .map((c, i) => {
      const y = 10 + i * rowH;
      let strokes = `<rect x="8" y="${y + 6}" width="12" height="12" ${tint(i, 0.6)}/>`;
      for (let g = 0; g * 5 < c; g += 1) {
        const x = x0 + g * 34;
        const k = Math.min(5, c - g * 5);
        for (let j = 0; j < Math.min(4, k); j += 1)
          strokes += line(x + j * 6, y + 3, x + j * 6, y + 22);
        if (k === 5) strokes += line(x - 4, y + 19, x + 22, y + 6);
      }
      return strokes;
    })
    .join("");
  return wrap(x0 + widest + 10, counts.length * rowH + 20, body);
}

const PIPS: Readonly<Record<number, readonly (readonly [number, number])[]>> = {
  1: [[1, 1]],
  2: [
    [0, 0],
    [2, 2],
  ],
  3: [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  4: [
    [0, 0],
    [2, 0],
    [0, 2],
    [2, 2],
  ],
  5: [
    [0, 0],
    [2, 0],
    [1, 1],
    [0, 2],
    [2, 2],
  ],
  6: [
    [0, 0],
    [2, 0],
    [0, 1],
    [2, 1],
    [0, 2],
    [2, 2],
  ],
};

/** A table of all pairs of two dice: the faces along the top and down the left, the cells empty. */
export function diceTable(): string {
  const s = 24;
  const face = (k: number, x: number, y: number): string =>
    (PIPS[k] ?? [])
      .map(([i, j]) => dot(x + s / 2 + (i - 1) * 7, y + s / 2 + (j - 1) * 7, 2))
      .join("");
  let body = "";
  for (let r = 0; r <= 6; r += 1)
    for (let c = 0; c <= 6; c += 1) {
      const x = 10 + c * s;
      const y = 10 + r * s;
      body += `<rect x="${x}" y="${y}" width="${s}" height="${s}" ${tint(r === 0 || c === 0 ? 1 : 0, r === 0 || c === 0 ? 0.3 : 0.1)}/>`;
      if (r === 0 && c > 0) body += face(c, x, y);
      if (c === 0 && r > 0) body += face(r, x, y);
    }
  return wrap(7 * s + 20, 7 * s + 20, body);
}

const labelEnd = (x: number, y: number, t: string | number): string =>
  `<text x="${num(x)}" y="${num(y)}" font-size="10" text-anchor="end" fill="currentColor" stroke="none">${t}</text>`;

interface ScaleOptions {
  /** A line graph through the values instead of bars. */
  readonly line?: boolean;
  /** Every how many grid lines the scale is labelled. */
  readonly every?: number;
  /** A dashed level at this many grid lines, labelled at its right end with its value. */
  readonly level?: number;
}

/**
 * A chart read against a scale: grid lines one `unit` apart, every `every`-th labelled with its value, and bars or a
 * line whose heights are given in grid lines. The heights themselves are never written.
 */
export function scaled(
  heights: readonly number[],
  unit: number,
  o: ScaleOptions = {},
): string {
  const every = o.every ?? 2;
  const top = Math.ceil(Math.max(1, o.level ?? 0, ...heights)) + 1;
  const ly = Math.min(16, 150 / top);
  const x0 = 38;
  const step = 40;
  const base = 12 + top * ly;
  const w = x0 + heights.length * step + 14 + (o.level === undefined ? 0 : 24);
  let body = "";
  for (let k = 0; k <= top; k += 1) {
    const y = base - k * ly;
    body += `<line x1="${x0}" y1="${num(y)}" x2="${num(w - 8)}" y2="${num(y)}" stroke-opacity="0.2"/>`;
    if (k % every === 0) body += labelEnd(x0 - 6, y + 3.5, k * unit);
  }
  body += line(x0, base - top * ly, x0, base) + line(x0, base, w - 8, base);
  if (o.line) {
    const pts = heights.map((h, i) => [x0 + 20 + i * step, base - h * ly]);
    body += `<polyline points="${pts.map(([x, y]) => `${num(x ?? 0)},${num(y ?? 0)}`).join(" ")}" stroke="${pal(0)}" stroke-width="2.5"/>`;
    body += pts.map(([x, y]) => dot(x ?? 0, y ?? 0, 3.5, pal(1))).join("");
  } else {
    body += heights
      .map(
        (h, i) =>
          `<rect x="${x0 + 8 + i * step}" y="${num(base - h * ly)}" width="26" height="${num(h * ly)}" ${tint(i, 0.6)}/>`,
      )
      .join("");
  }
  if (o.level !== undefined) {
    const y = base - (o.level / unit) * ly;
    body += `<line x1="${x0}" y1="${num(y)}" x2="${num(w - 28)}" y2="${num(y)}" stroke="${pal(3)}" stroke-width="2" stroke-dasharray="5 3"/>`;
    body += `<text x="${num(w - 14)}" y="${num(y + 4)}" font-size="11" text-anchor="middle" fill="currentColor" stroke="none">${o.level}</text>`;
  }
  return wrap(w, base + 10, body);
}

/** Bars that rise in equal steps, with no numbers: the shape of an evenly growing row. */
export function stepBars(count: number): string {
  const body = Array.from({ length: count }, (_, i) => {
    const h = 20 + i * 14;
    return `<rect x="${12 + i * 34}" y="${num(100 - h)}" width="26" height="${h}" ${tint(i, 0.55)}/>`;
  }).join("");
  return wrap(count * 34 + 20, 110, line(8, 100, count * 34 + 10, 100) + body);
}

const house = (x: number, y: number, half: boolean): string => {
  const w = half ? 11 : 22;
  const roof = half
    ? `<polygon points="${x},${y + 12} ${x + 11},${y} ${x + 11},${y + 12}" ${tint(1, 0.4)}/>`
    : `<polygon points="${x},${y + 12} ${x + 11},${y} ${x + 22},${y + 12}" ${tint(1, 0.4)}/>`;
  const rest = half
    ? `<path d="M${x + 11},${y} L${x + 22},${y + 12} L${x + 22},${y + 24} L${x + 11},${y + 24}" stroke-dasharray="3 3" stroke-opacity="0.5"/>`
    : "";
  return `${roof}<rect x="${x}" y="${y + 12}" width="${w}" height="12" ${tint(1, 0.4)}/>${rest}`;
};

/** Houses in rows of six, `full` whole ones and then one half house. */
export function halfPictogram(full: number): string {
  const total = full + 1;
  const body = Array.from({ length: total }, (_, i) =>
    house(10 + (i % 6) * 30, 8 + Math.floor(i / 6) * 32, i === full),
  ).join("");
  return wrap(
    Math.min(total, 6) * 30 + 20,
    Math.ceil(total / 6) * 32 + 14,
    body,
  );
}

/** Seven empty cells with a bracket under the first four and another under the last four, which share one cell. */
export function overlapping(): string {
  const w = 34;
  const cells = Array.from(
    { length: 7 },
    (_, i) =>
      `<rect x="${10 + i * w}" y="10" width="${w}" height="28" ${tint(0, i === 3 ? 0.45 : 0.15)}/>`,
  ).join("");
  const bracket = (from: number, y: number, colour: string): string =>
    `<path d="M${10 + from * w + 3},${y - 6} L${10 + from * w + 3},${y} L${10 + (from + 4) * w - 3},${y} L${10 + (from + 4) * w - 3},${y - 6}" stroke="${colour}" stroke-width="2.5"/>`;
  return wrap(
    7 * w + 20,
    74,
    cells + bracket(0, 52, pal(0)) + bracket(3, 64, pal(3)),
  );
}

/** A circle of `parts` equal sectors, the first `shaded` of them filled. */
export function sliced(parts: number, shaded: number): string {
  const cx = 70;
  const cy = 70;
  const r = 60;
  const point = (turn: number): [number, number] => [
    cx + r * Math.cos(-Math.PI / 2 + turn * 2 * Math.PI),
    cy + r * Math.sin(-Math.PI / 2 + turn * 2 * Math.PI),
  ];
  const body = Array.from({ length: parts }, (_, i) => {
    const [x1, y1] = point(i / parts);
    const [x2, y2] = point((i + 1) / parts);
    const fill = i < shaded ? tint(1, 0.55) : 'fill="none"';
    return `<path d="M${cx},${cy} L${num(x1)},${num(y1)} A${r},${r} 0 0 1 ${num(x2)},${num(y2)} Z" ${fill}/>`;
  }).join("");
  return wrap(140, 140, body);
}

/** The shape of a graph with no numbers on it: the values joined by a line, scaled to the frame. */
export function shape(
  values: readonly number[],
  range?: readonly [number, number],
): string {
  const lo = range?.[0] ?? Math.min(...values);
  const hi = range?.[1] ?? Math.max(...values);
  const pts = values.map(
    (v, i) =>
      [
        14 + (i * 92) / Math.max(1, values.length - 1),
        98 - ((v - lo) / (hi - lo || 1)) * 80,
      ] as const,
  );
  return wrap(
    120,
    110,
    `${line(10, 102, 112, 102)}${line(10, 8, 10, 102)}<polyline points="${pts.map(([x, y]) => `${num(x)},${num(y)}`).join(" ")}" stroke="${pal(0)}" stroke-width="2.5"/>`,
  );
}

/** The order in which `n` pictures stand when the draw is `k`: place by place, the index of the picture shown there. */
export function arrangement(k: number, n: number): number[] {
  const pool = Array.from({ length: n }, (_, i) => i);
  const out: number[] = [];
  let rest = k;
  for (let m = n; m >= 1; m -= 1) {
    let f = 1;
    for (let i = 2; i < m; i += 1) f *= i;
    const at = Math.floor(rest / f) % m;
    rest %= f;
    out.push(pool.splice(at, 1)[0] ?? 0);
  }
  return out;
}

/** Lines from the corner of a chart, one for each slope, each numbered at its far end. */
export function rays(slopes: readonly number[]): string {
  const top = Math.max(...slopes, 1);
  const body = slopes
    .map((s, i) => {
      const y = 106 - (s / top) * 90;
      return `<line x1="14" y1="106" x2="112" y2="${num(y)}" stroke="${pal(i)}" stroke-width="2.5"/><text x="122" y="${num(y + 4)}" font-size="12" text-anchor="middle" fill="currentColor" stroke="none">${i + 1}</text>`;
    })
    .join("");
  return wrap(
    136,
    120,
    `${line(10, 108, 128, 108)}${line(14, 6, 14, 108)}${body}`,
  );
}

const SHAPES: Readonly<Record<string, readonly (readonly number[])[]>> = {
  fall: [
    [10, 8, 6, 4, 2],
    [2, 4, 6, 8, 10],
    [6, 6, 6, 6, 6],
    [10, 9, 7, 4, 0],
  ],
  stop: [
    [6, 6, 6, 6, 6],
    [2, 4, 6, 8, 10],
    [10, 8, 6, 4, 2],
    [2, 6, 10, 6, 2],
  ],
  trip: [
    [0, 4, 8, 4, 0],
    [0, 3, 6, 9, 12],
    [12, 9, 6, 3, 0],
    [6, 6, 6, 6, 6],
  ],
  walk: [
    [0, 3, 6, 6, 6, 3, 0],
    [0, 3, 6, 3, 0],
    [0, 3, 6, 6, 6, 6, 6],
    [0, 0, 0, 3, 6],
  ],
  pour: [
    [0, 5, 8, 10, 11],
    [0, 3, 6, 9, 12],
    [0, 1, 3, 7, 12],
    [12, 9, 6, 3, 0],
  ],
};

/** The graphs of one family side by side, in the order the draw `k` gives, numbered from 1. */
const graphs = (family: string, k: number): string => {
  const set = SHAPES[family] ?? [];
  return gallery(
    arrangement(k, set.length).map((i) => shape(set[i] ?? [], [0, 12])),
  );
};

/** Diamonds of unit squares, sizes one up to `top`, side by side. */
export function diamonds(top: number): string {
  const s = 12;
  let x0 = 10;
  let body = "";
  for (let k = 1; k <= top; k += 1) {
    const r = k - 1;
    for (let i = -r; i <= r; i += 1)
      for (let j = -r; j <= r; j += 1)
        if (Math.abs(i) + Math.abs(j) <= r)
          body += `<rect x="${x0 + (r + i) * s}" y="${10 + (top - 1 + j) * s}" width="${s}" height="${s}" ${tint(k, 0.4)}/>`;
    x0 += (2 * r + 1) * s + 12;
  }
  return wrap(x0, (2 * top - 1) * s + 20, body);
}

export const PICTURES_S: Readonly<Record<string, Draw>> = {
  "S1.tables.06": (v) => table([[tm(8, n(v, 0)), tm(9, n(v, 1))]]),
  "S1.tables.13": (v) =>
    table([
      ["?", "?", "?", n(v, 0)],
      ["?", "?", "?", n(v, 1)],
      [n(v, 2), n(v, 3), "?", ""],
    ]),
  "S1.tables.14": (v) => {
    const start = n(v, 0) * 60 + n(v, 1);
    const at = (k: number): string => {
      const t = start + k * n(v, 2);
      return tm(Math.floor(t / 60), t % 60);
    };
    return table([[at(0), at(1), at(2), "…"]]);
  },
  "S1.tables.15": () => diceTable(),
  "S1.tables.16": (v) =>
    table([
      ["×", n(v, 2), n(v, 3)],
      [n(v, 0), n(v, 0) * n(v, 2), n(v, 0) * n(v, 3)],
      [n(v, 1), n(v, 1) * n(v, 2), "?"],
    ]),
  "S1.tables.17": (v) => tally([n(v, 0), n(v, 1), n(v, 2)]),
  "S2.bar-line.07": (v) =>
    scaled(
      [n(v, 0), n(v, 1), n(v, 2), n(v, 3)].map((h) => h / 5),
      5,
      { level: n(v, 4) },
    ),
  "S2.bar-line.04": (v) =>
    barBetween(n(v, 0), n(v, 0) + n(v, 1), n(v, 0) + n(v, 1) / 2),
  "S2.bar-line.13": (v) => {
    const a = n(v, 0);
    const first = n(v, 4) === 1 ? n(v, 1) : n(v, 2);
    const second = n(v, 4) === 2 ? n(v, 1) : n(v, 2);
    const third = n(v, 4) === 3 ? n(v, 1) : n(v, 3);
    return lineGraph([
      a,
      a + first,
      a + first + second,
      a + first + second + third,
    ]);
  },
  "S2.bar-line.14": (v) => {
    const others = [n(v, 2), n(v, 3)];
    const list = [...others];
    list.splice(n(v, 4), 0, n(v, 1));
    return scaled(list, n(v, 0));
  },
  "S2.bar-line.15": (v) =>
    scaled(
      [1, 2, 3, 4, 5].map((i) => n(v, i)),
      n(v, 0),
      { line: true },
    ),
  "S2.bar-line.16": () => stepBars(5),
  "S2.bar-line.17": (v) => halfPictogram(n(v, 1)),
  "S2.bar-line.18": (v) => bars([n(v, 0), n(v, 1)]),
  "S4.pie.11": (v) => sliced(n(v, 1), n(v, 2)),
  "S4.pie.12": (v) => sliced(n(v, 0), n(v, 1)),
  "S4.pie.13": () =>
    gallery([shape([3, 5, 4, 8]), pie([40, 25, 20], false), pictogram(5)]),
  "S4.pie.14": (v) => {
    const total = n(v, 0) + n(v, 1) + n(v, 2);
    return pie([(100 * n(v, 0)) / total, (100 * n(v, 1)) / total], false);
  },
  "S4.pie.15": (v) => pie([(2 * n(v, 0)) / 3, n(v, 0) / 3], false),
  "S5.global.08": (v) => graphs("fall", n(v, 0)),
  "S5.global.09": (v) => graphs("stop", n(v, 0)),
  "S5.global.10": (v) => graphs("trip", n(v, 0)),
  "S5.global.13": (v) =>
    rays(
      arrangement(n(v, 0), 3).map((i) => [n(v, 1), n(v, 2), n(v, 3)][i] ?? 1),
    ),
  "S5.global.14": () =>
    gallery([pie([40, 25, 20], false), pictogram(5), shape([3, 5, 4, 8])]),
  "S5.global.15": (v) => graphs("walk", n(v, 0)),
  "S5.global.16": (v) => graphs("pour", n(v, 0)),
  "S5.global.17": (v) =>
    lineGraph(
      [n(v, 2), n(v, 2) + n(v, 1) * n(v, 3)],
      [n(v, 0), n(v, 0) + n(v, 1)],
    ),
  "S5.global-1S.06": (v) =>
    lineGraph([
      n(v, 0),
      n(v, 0) + n(v, 1),
      n(v, 0) + n(v, 1) + n(v, 2),
      n(v, 0) + n(v, 1) + n(v, 2) + n(v, 3),
    ]),
  "S5.global-1S.07": (v) =>
    lineGraph([
      n(v, 0),
      n(v, 0) - n(v, 1),
      n(v, 0) - n(v, 1) - n(v, 2),
      n(v, 0) - n(v, 1) - n(v, 2) - n(v, 3),
    ]),
  "S5.global-1S.08": (v) =>
    lineGraph([
      n(v, 0),
      n(v, 0) + n(v, 1),
      n(v, 0) + n(v, 1) + n(v, 2),
      n(v, 0) + n(v, 1) + n(v, 2) - n(v, 3),
      n(v, 0) + n(v, 1) + n(v, 2) - n(v, 3) - n(v, 4),
    ]),
  "S5.global-1S.11": (v) =>
    lineGraph([
      n(v, 0),
      n(v, 0) + n(v, 1),
      n(v, 0) + n(v, 1) + n(v, 2),
      n(v, 0) + n(v, 1) + n(v, 2) + n(v, 3),
    ]),
  "S5.global-1S.13": (v) =>
    lineGraph([
      n(v, 0),
      n(v, 0) + n(v, 1),
      n(v, 0) + 2 * n(v, 1) - n(v, 2),
      n(v, 0) + 3 * n(v, 1) - 3 * n(v, 2),
    ]),
  "S5.global-1S.14": (v) => {
    const row = [n(v, 0), n(v, 1), n(v, 2), n(v, 3)];
    const rows = [
      row,
      [...row].reverse(),
      [...row].sort((x, y) => x - y),
      [...row].sort((x, y) => y - x),
    ];
    return gallery(arrangement(n(v, 4), 4).map((i) => shape(rows[i] ?? [])));
  },
  "S6.patterns.05": (v) => beads(n(v, 0), n(v, 1)),
  "S6.patterns.13": (v) => beads(n(v, 0), n(v, 1)),
  "S6.patterns.16": (v) => matchsticks(Math.min(5, n(v, 0)), 3),
  "S6.patterns-1S.14": () => diamonds(3),
  "S7.median-mode.13": (v) =>
    table([
      [n(v, 0), n(v, 0) + 1, n(v, 0) + 2],
      [n(v, 1), n(v, 2), n(v, 3)],
    ]),
  "S7.median-mode.14": (v) => numberRow([n(v, 0), n(v, 1), n(v, 2), n(v, 3)]),
  "S7.median-mode.15": (v) => numberRow([0, 1, 2, 3, 4, 5].map((i) => n(v, i))),
  "S7.median-mode.18": () => numberRow(["?", "?", "?", "?", "?"]),
  "S3.mean.11": (v) => bars([n(v, 0), n(v, 1), n(v, 2), n(v, 3)]),
  "S3.mean.15": (v) => lineGraph([n(v, 0), n(v, 1), n(v, 2), n(v, 3)]),
  "S3.missing.11": () => overlapping(),
};
