// Pictures drawn by code from a task's drawn numbers alone (RES-1200): charts, grids, figures, clocks and
// instrument scales. Every function is pure and returns one self-contained SVG string with no script and no
// link. The letters on a picture (the compass points) come in as arguments from `content/pictures.<language>.json`,
// so a picture follows the language the player chose. Colours come from the page.

/** The colours of the pictures: drawn translucent they read on a light page and on a dark one. */
const PAL = [
  "#4f8ef7",
  "#f59e42",
  "#4caf70",
  "#e5534b",
  "#a66bd9",
  "#e0b83a",
] as const;
const pal = (i: number): string =>
  PAL[((i % PAL.length) + PAL.length) % PAL.length] ?? "#4f8ef7";
/** A translucent fill of palette colour `i`. */
const tint = (i: number, o = 0.35): string =>
  `fill="${pal(i)}" fill-opacity="${o}"`;

const num = (x: number): string => String(Math.round(x * 100) / 100);

const wrap = (w: number, h: number, body: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${num(w)} ${num(h)}" role="img" fill="none" stroke="currentColor" stroke-width="1.5">${body}</svg>`;

const label = (x: number, y: number, t: string | number, size = 11): string =>
  `<text x="${num(x)}" y="${num(y)}" font-size="${size}" text-anchor="middle" fill="currentColor" stroke="none">${t}</text>`;

const line = (x1: number, y1: number, x2: number, y2: number): string =>
  `<line x1="${num(x1)}" y1="${num(y1)}" x2="${num(x2)}" y2="${num(y2)}"/>`;

const dot = (x: number, y: number, r = 3, colour = "currentColor"): string =>
  `<circle cx="${num(x)}" cy="${num(y)}" r="${r}" fill="${colour}"/>`;

const poly = (pts: readonly (readonly [number, number])[], fill = ""): string =>
  `<polygon points="${pts.map(([x, y]) => `${num(x)},${num(y)}`).join(" ")}" ${fill}/>`;

/** A bar chart: one bar for each value, its value above it. */
export function bars(values: readonly number[]): string {
  const max = Math.max(1, ...values);
  const w = 40 * values.length + 20;
  const body = values
    .map((v, i) => {
      const h = (v / max) * 100;
      const x = 20 + i * 40;
      return `<rect x="${x}" y="${num(125 - h)}" width="28" height="${num(h)}" ${tint(i, 0.6)}/>${label(x + 14, 120 - h, v)}`;
    })
    .join("");
  return wrap(
    w,
    140,
    `${line(10, 125, w - 5, 125)}${line(10, 10, 10, 125)}${body}`,
  );
}

/** A line graph through the values, equally spaced; `marks` are the texts under the points. */
export function lineGraph(
  values: readonly number[],
  marks: readonly (string | number)[] = [],
): string {
  const max = Math.max(1, ...values);
  const min = Math.min(0, ...values);
  const w = 50 * values.length + 20;
  const y = (v: number): number => 115 - ((v - min) / (max - min || 1)) * 95;
  const pts = values.map((v, i) => [30 + i * 50, y(v)] as const);
  const path = pts.map(([px, py]) => `${num(px)},${num(py)}`).join(" ");
  const dots = pts
    .map(
      ([px, py], i) =>
        `${dot(px, py, 3, pal(1))}${label(px, py - 8, values[i] ?? 0)}`,
    )
    .join("");
  const under = marks.map((m, i) => label(30 + i * 50, 135, m)).join("");
  return wrap(
    w,
    145,
    `${line(10, 118, w - 5, 118)}${line(10, 10, 10, 118)}<polyline points="${path}" stroke="${pal(0)}" stroke-width="2.5"/>${dots}${under}`,
  );
}

/** A circle cut into sectors by percentages; what is left of 100 is one more sector without a label. */
export function pie(percents: readonly number[]): string {
  const rest = 100 - percents.reduce((s, p) => s + p, 0);
  const all = rest > 0 ? [...percents, rest] : [...percents];
  let at = -Math.PI / 2;
  const cx = 70;
  const cy = 70;
  const r = 60;
  const sectors = all
    .map((p, i) => {
      const next = at + (p / 100) * 2 * Math.PI;
      const x1 = cx + r * Math.cos(at);
      const y1 = cy + r * Math.sin(at);
      const x2 = cx + r * Math.cos(next);
      const y2 = cy + r * Math.sin(next);
      const mid = (at + next) / 2;
      const big = p > 50 ? 1 : 0;
      const d =
        p >= 100
          ? `<circle cx="${cx}" cy="${cy}" r="${r}" ${tint(i, 0.5)}/>`
          : `<path d="M${cx},${cy} L${num(x1)},${num(y1)} A${r},${r} 0 ${big} 1 ${num(x2)},${num(y2)} Z" ${tint(i, 0.5)}/>`;
      const t =
        i < percents.length
          ? label(cx + 38 * Math.cos(mid), cy + 38 * Math.sin(mid) + 4, p)
          : "";
      at = next;
      return d + t;
    })
    .join("");
  return wrap(140, 140, sectors);
}

export interface GridMark {
  readonly x: number;
  readonly y: number;
  readonly text?: string | number;
}

/** A coordinate grid from 0 to `cols` and `rows`, with points and segments given in grid units. */
export function grid(
  cols: number,
  rows: number,
  points: readonly GridMark[] = [],
  segments: readonly (readonly [number, number, number, number])[] = [],
): string {
  const s = 20;
  const ox = 24;
  const oy = rows * s + 8;
  const px = (x: number): number => ox + x * s;
  const py = (y: number): number => oy - y * s;
  let body = "";
  for (let i = 0; i <= cols; i += 1)
    body += `<line x1="${px(i)}" y1="${py(0)}" x2="${px(i)}" y2="${py(rows)}" stroke-opacity="0.25"/>${label(px(i), py(0) + 13, i, 9)}`;
  for (let j = 0; j <= rows; j += 1)
    body += `<line x1="${px(0)}" y1="${py(j)}" x2="${px(cols)}" y2="${py(j)}" stroke-opacity="0.25"/>${label(px(0) - 10, py(j) + 3, j, 9)}`;
  body += segments
    .map(([a, b, c, d]) =>
      line(px(a), py(b), px(c), py(d)).replace(
        "/>",
        ` stroke="${pal(0)}" stroke-width="2.5"/>`,
      ),
    )
    .join("");
  body += points
    .map(
      (p) =>
        dot(px(p.x), py(p.y), 4, pal(3)) +
        (p.text === undefined
          ? ""
          : label(px(p.x) + 9, py(p.y) - 6, p.text, 10)),
    )
    .join("");
  return wrap(px(cols) + 14, py(0) + 22, body);
}

/** A regular polygon with its axes of symmetry drawn dashed. */
export function polygon(n: number, axes = true): string {
  const c = 70;
  const r = 55;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [c + r * Math.cos(a), c + r * Math.sin(a)] as const;
  });
  const ax = axes
    ? Array.from({ length: n }, (_, i) => {
        const a = -Math.PI / 2 + (i * Math.PI) / n;
        return `<line x1="${num(c - 62 * Math.cos(a))}" y1="${num(c - 62 * Math.sin(a))}" x2="${num(c + 62 * Math.cos(a))}" y2="${num(c + 62 * Math.sin(a))}" stroke-dasharray="4 3"/>`;
      }).join("")
    : "";
  return wrap(140, 140, poly(pts, tint(0, 0.2)) + ax);
}

/** A rectangle drawn to the proportions of `w` and `h`, with optional dashed axes. */
export function rectangle(w: number, h: number, axes = false): string {
  const k = 100 / Math.max(w, h);
  const rw = w * k;
  const rh = h * k;
  const ox = 20;
  const oy = 20;
  const ax = axes
    ? `<line x1="${num(ox + rw / 2)}" y1="${oy - 8}" x2="${num(ox + rw / 2)}" y2="${num(oy + rh + 8)}" stroke-dasharray="4 3"/><line x1="${ox - 8}" y1="${num(oy + rh / 2)}" x2="${num(ox + rw + 8)}" y2="${num(oy + rh / 2)}" stroke-dasharray="4 3"/>${w === h ? `<line x1="${ox}" y1="${oy}" x2="${num(ox + rw)}" y2="${num(oy + rh)}" stroke-dasharray="4 3"/><line x1="${num(ox + rw)}" y1="${oy}" x2="${ox}" y2="${num(oy + rh)}" stroke-dasharray="4 3"/>` : ""}`
    : "";
  return wrap(
    rw + 40,
    rh + 40,
    `<rect x="${ox}" y="${oy}" width="${num(rw)}" height="${num(rh)}" ${tint(0, 0.2)}/>${ax}`,
  );
}

/** A triangle with the angles at its first two corners given in degrees (the third follows), fitted to its box. */
export function triangle(
  a: number,
  b: number,
  texts: readonly (string | number)[] = [],
): string {
  const c = 180 - a - b;
  const ra = (a * Math.PI) / 180;
  const side = Math.sin((b * Math.PI) / 180) / Math.sin((c * Math.PI) / 180);
  // The corners with the base on the x axis and y pointing up, in units of the base.
  const top: readonly [number, number] = [
    side * Math.cos(ra),
    side * Math.sin(ra),
  ];
  const minX = Math.min(0, top[0]);
  const maxX = Math.max(1, top[0]);
  const k = 150 / Math.max(maxX - minX, top[1], 0.2);
  const px = (x: number): number => 20 + (x - minX) * k;
  const py = (y: number): number => 20 + (top[1] - y) * k;
  const A = [px(0), py(0)] as const;
  const B = [px(1), py(0)] as const;
  const C = [px(top[0]), py(top[1])] as const;
  const body = `${poly([A, B, C], tint(2, 0.25))}${label(A[0] + (A[0] <= C[0] ? 26 : 12), A[1] - 6, texts[0] ?? "")}${label(B[0] - 26, B[1] - 6, texts[1] ?? "")}${label(C[0], C[1] + (C[1] < A[1] - 30 ? 26 : -8), texts[2] ?? "")}`;
  return wrap((maxX - minX) * k + 40, top[1] * k + 40, body);
}

/** An angle of `deg` degrees drawn from a horizontal ray, with an arc and its measure. */
export function angle(deg: number, text: string | number = deg): string {
  const r = (deg * Math.PI) / 180;
  const o = [20 + Math.max(0, -100 * Math.cos(r)), 110] as const;
  const end = [o[0] + 100 * Math.cos(r), o[1] - 100 * Math.sin(r)] as const;
  const arc = `<path d="M${o[0]},${o[1]} L${o[0] + 30},${o[1]} A30,30 0 ${deg > 180 ? 1 : 0} 0 ${num(o[0] + 30 * Math.cos(r))},${num(o[1] - 30 * Math.sin(r))} Z" ${tint(1, 0.35)}/>`;
  return wrap(
    o[0] + 130,
    130,
    `${line(o[0], o[1], o[0] + 110, o[1])}${line(o[0], o[1], end[0], end[1])}${arc}${label(o[0] + 50, o[1] - 8, text)}`,
  );
}

/** An analogue clock face with the hour and minute hands set to `h`:`m`. */
export function clock(h: number, m: number): string {
  const c = 70;
  const tick = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6;
    return line(
      c + 56 * Math.sin(a),
      c - 56 * Math.cos(a),
      c + 62 * Math.sin(a),
      c - 62 * Math.cos(a),
    );
  }).join("");
  const hand = (turn: number, len: number): string =>
    line(
      c,
      c,
      c + len * Math.sin(turn * 2 * Math.PI),
      c - len * Math.cos(turn * 2 * Math.PI),
    );
  return wrap(
    140,
    140,
    `<circle cx="${c}" cy="${c}" r="64" ${tint(5, 0.18)}/>${tick}${hand(((h % 12) + m / 60) / 12, 36)}${hand(m / 60, 52).replace("/>", ` stroke="${pal(3)}"/>`)}${dot(c, c, 2)}`,
  );
}

/** Columns of unit squares, one column for each height, as seen from the front or the side. */
export function columns(heights: readonly number[]): string {
  const s = 20;
  const max = Math.max(1, ...heights);
  const body = heights
    .map((h, i) =>
      Array.from(
        { length: h },
        (_, j) =>
          `<rect x="${10 + i * s}" y="${10 + (max - 1 - j) * s}" width="${s}" height="${s}" ${tint(2, 0.4)}/>`,
      ).join(""),
    )
    .join("");
  return wrap(heights.length * s + 20, max * s + 20, body);
}

/** A plan of cells, each holding its number (a height, or a count). */
export function plan(rows: readonly (readonly number[])[]): string {
  const s = 28;
  const body = rows
    .map((r, j) =>
      r
        .map(
          (v, i) =>
            `<rect x="${10 + i * s}" y="${10 + j * s}" width="${s}" height="${s}" ${tint(2, 0.3)}/>${label(10 + i * s + s / 2, 10 + j * s + s / 2 + 4, v, 13)}`,
        )
        .join(""),
    )
    .join("");
  return wrap(
    Math.max(...rows.map((r) => r.length)) * s + 20,
    rows.length * s + 20,
    body,
  );
}

/** A table: a row of texts for each row, drawn in cells. */
export function table(rows: readonly (readonly (string | number)[])[]): string {
  const cw = 46;
  const ch = 24;
  const body = rows
    .map((r, j) =>
      r
        .map(
          (v, i) =>
            `<rect x="${10 + i * cw}" y="${10 + j * ch}" width="${cw}" height="${ch}" ${tint(0, 0.15)}/>${label(10 + i * cw + cw / 2, 10 + j * ch + 16, v, 12)}`,
        )
        .join(""),
    )
    .join("");
  return wrap(
    Math.max(...rows.map((r) => r.length)) * cw + 20,
    rows.length * ch + 20,
    body,
  );
}

/** A block of `cols` by `rows` unit squares (the top or front of a build). */
export function block(cols: number, rows: number): string {
  return plan(
    Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0)),
  ).replace(/<text[^>]*>0<\/text>/g, "");
}

/** The cross-shaped net of a cube. */
export function cubeNet(): string {
  const s = 26;
  const cells: readonly (readonly [number, number])[] = [
    [1, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [3, 1],
    [1, 2],
  ];
  return wrap(
    4 * s + 20,
    3 * s + 20,
    cells
      .map(
        ([i, j], k) =>
          `<rect x="${10 + i * s}" y="${10 + j * s}" width="${s}" height="${s}" ${tint(k, 0.4)}/>`,
      )
      .join(""),
  );
}

/** A ruler of `len` centimetres with a bracket from `from` to `to`. */
export function ruler(from: number, to: number, len = 12): string {
  const s = 24;
  const ticks = Array.from(
    { length: len + 1 },
    (_, i) =>
      `${line(10 + i * s, 30, 10 + i * s, 42)}${label(10 + i * s, 56, i, 10)}`,
  ).join("");
  return wrap(
    len * s + 20,
    80,
    `<rect x="10" y="30" width="${len * s}" height="30" ${tint(5, 0.3)}/>${ticks}${line(10 + from * s, 20, 10 + to * s, 20)}${line(10 + from * s, 14, 10 + from * s, 26)}${line(10 + to * s, 14, 10 + to * s, 26)}`,
  );
}

/** A thermometer scale from `lo` to `hi` with the column at `value`. */
export function thermometer(value: number, lo = -10, hi = 40): string {
  const y = (v: number): number => 120 - ((v - lo) / (hi - lo)) * 100;
  const ticks = Array.from(
    { length: Math.floor((hi - lo) / 10) + 1 },
    (_, i) => lo + i * 10,
  )
    .map((v) => `${line(34, y(v), 44, y(v))}${label(22, y(v) + 4, v, 10)}`)
    .join("");
  return wrap(
    80,
    140,
    `<rect x="44" y="${y(hi)}" width="12" height="${num(y(lo) - y(hi))}" rx="6" stroke-opacity="0.5"/><rect x="47" y="${num(y(value))}" width="6" height="${num(y(lo) - y(value))}" fill="${pal(3)}"/>${ticks}`,
  );
}

/** The names of the four compass points in one language. */
export interface CompassLabels {
  readonly n: string;
  readonly e: string;
  readonly s: string;
  readonly w: string;
}

/** A compass rose with the four directions marked by the given letters. */
export function compass(l: CompassLabels): string {
  return wrap(
    140,
    140,
    `<circle cx="70" cy="70" r="50" ${tint(0, 0.1)}/><polygon points="70,20 63,70 77,70" fill="${pal(3)}" stroke="none"/>${line(70, 14, 70, 126)}${line(14, 70, 126, 70)}${label(70, 12, l.n)}${label(132, 74, l.e)}${label(70, 138, l.s)}${label(8, 74, l.w)}`,
  );
}

/** A walk drawn on a grid: a polyline through the points, each leg a grid step. */
export function path(points: readonly (readonly [number, number])[]): string {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const cols = Math.max(1, ...xs);
  const rows = Math.max(1, ...ys);
  const segs = points.slice(1).map((p, i) => {
    const q = points[i] ?? p;
    return [q[0], q[1], p[0], p[1]] as const;
  });
  const first = points[0];
  const last = points[points.length - 1];
  return grid(
    cols,
    rows,
    [
      first ? { x: first[0], y: first[1] } : { x: 0, y: 0 },
      last ? { x: last[0], y: last[1] } : { x: 0, y: 0 },
    ],
    segs,
  );
}

/** A scale bar: `len` segments of one centimetre. */
export function scaleBar(len: number): string {
  const s = 24;
  return wrap(
    len * s + 20,
    40,
    `${Array.from({ length: len }, (_, i) => `<rect x="${10 + i * s}" y="14" width="${s}" height="10"${i % 2 === 0 ? ' fill="currentColor"' : ""}/>`).join("")}${label(10, 38, 0, 10)}${label(10 + len * s, 38, len, 10)}`,
  );
}

const cell = (
  x: number,
  y: number,
  w: number,
  h: number,
  t: string | number,
  size = 12,
): string =>
  `<rect x="${num(x)}" y="${num(y)}" width="${num(w)}" height="${num(h)}" ${tint(0, 0.15)}/>${label(x + w / 2, y + h / 2 + 4, t, size)}`;

/** A row of number tiles; a text such as "?" stands for a number the task asks for. */
export function numberRow(values: readonly (string | number)[]): string {
  const w = 38;
  return wrap(
    values.length * w + 20,
    50,
    values.map((v, i) => cell(10 + i * w, 10, w, 30, v)).join(""),
  );
}

/** Rows of cells, each row centred, as a pyramid of numbers. */
export function stackRows(
  rows: readonly (readonly (string | number)[])[],
): string {
  const w = 38;
  const widest = Math.max(...rows.map((r) => r.length)) * w;
  const body = rows
    .map((r, j) =>
      r
        .map((v, i) =>
          cell(10 + (widest - r.length * w) / 2 + i * w, 10 + j * 30, w, 30, v),
        )
        .join(""),
    )
    .join("");
  return wrap(widest + 20, rows.length * 30 + 20, body);
}

export type Figure = "circle" | "square" | "triangle" | "rectangle";

const figure = (kind: Figure, x: number, y: number, s: number): string =>
  kind === "circle"
    ? `<circle cx="${num(x + s / 2)}" cy="${num(y + s / 2)}" r="${num(s / 2)}" ${tint(1, 0.45)}/>`
    : kind === "square"
      ? `<rect x="${num(x)}" y="${num(y)}" width="${s}" height="${s}" ${tint(0, 0.45)}/>`
      : kind === "rectangle"
        ? `<rect x="${num(x)}" y="${num(y + s * 0.2)}" width="${s}" height="${num(s * 0.6)}" ${tint(4, 0.45)}/>`
        : poly(
            [
              [x + s / 2, y],
              [x, y + s],
              [x + s, y + s],
            ],
            tint(2, 0.45),
          );

/** A row of figures; with `numbered`, each one carries its number under it. */
export function figures(kinds: readonly Figure[], numbered = false): string {
  const s = 34;
  const per = Math.min(kinds.length, 8);
  const rows = Math.ceil(kinds.length / per);
  const body = kinds
    .map((k, i) => {
      const x = 10 + (i % per) * (s + 12);
      const y = 8 + Math.floor(i / per) * (s + (numbered ? 26 : 12));
      return (
        figure(k, x, y, s) +
        (numbered ? label(x + s / 2, y + s + 14, i + 1) : "")
      );
    })
    .join("");
  return wrap(
    per * (s + 12) + 12,
    rows * (s + (numbered ? 26 : 12)) + 12,
    body,
  );
}

/** `count` separate regular polygons with `sides` sides. */
export function polygons(count: number, sides: number): string {
  const r = 20;
  const body = Array.from({ length: count }, (_, k) => {
    const cx = 26 + k * 50;
    const pts = Array.from({ length: sides }, (_, i) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / sides;
      return [cx + r * Math.cos(a), 28 + r * Math.sin(a)] as const;
    });
    return poly(pts);
  }).join("");
  return wrap(count * 50 + 6, 56, body);
}

/** A number line with the mirror point drawn and the number to reflect marked. */
export function numberLine(
  hi: number,
  marks: readonly number[],
  mirror: number,
): string {
  const s = Math.min(24, 300 / hi);
  const x = (v: number): number => 14 + v * s;
  const ticks = Array.from(
    { length: hi + 1 },
    (_, i) => line(x(i), 30, x(i), 38) + label(x(i), 52, i, 9),
  ).join("");
  return wrap(
    x(hi) + 14,
    62,
    `${line(x(0), 34, x(hi), 34)}${ticks}${marks.map((m) => dot(x(m), 34, 4)).join("")}${line(x(mirror), 16, x(mirror), 44)}`,
  );
}

/** A sheet folded `n` times: dashed fold lines cut it into 2^n layers. */
export function foldedSheet(n: number): string {
  const w = 120;
  const parts = 2 ** n;
  const folds = Array.from(
    { length: parts - 1 },
    (_, i) =>
      `<line x1="${num(10 + ((i + 1) * w) / parts)}" y1="10" x2="${num(10 + ((i + 1) * w) / parts)}" y2="70" stroke-dasharray="4 3"/>`,
  ).join("");
  return wrap(
    w + 20,
    80,
    `<rect x="10" y="10" width="${w}" height="60"/>${folds}`,
  );
}

/** A staircase route of `steps` steps, each up then right. */
export function staircase(steps: number): string {
  const pts: [number, number][] = [[0, 0]];
  for (let i = 0; i < steps; i += 1) {
    pts.push([i, i + 1]);
    pts.push([i + 1, i + 1]);
  }
  return path(pts);
}

/** `count` icons in rows, one small house for each; a legend mark repeated. */
export function pictogram(count: number): string {
  const body = Array.from({ length: count }, (_, i) => {
    const x = 10 + (i % 6) * 30;
    const y = 8 + Math.floor(i / 6) * 30;
    return (
      poly([
        [x, y + 12],
        [x + 11, y],
        [x + 22, y + 12],
      ]) + `<rect x="${x + 3}" y="${y + 12}" width="16" height="12"/>`
    );
  }).join("");
  return wrap(
    Math.min(count, 6) * 30 + 20,
    Math.ceil(count / 6) * 30 + 14,
    body,
  );
}

/** A row of matchstick triangles or squares, `n` of them sharing sides. */
export function matchsticks(n: number, sides: 3 | 4): string {
  const s = 30;
  const body = Array.from({ length: n }, (_, i) =>
    sides === 4
      ? `<rect x="${10 + i * s}" y="10" width="${s}" height="${s}"/>`
      : poly(
          i % 2 === 0
            ? [
                [10 + (i * s) / 2, 40],
                [10 + ((i + 2) * s) / 2, 40],
                [10 + ((i + 1) * s) / 2, 10],
              ]
            : [
                [10 + ((i - 1) * s) / 2 + s / 2, 10],
                [10 + ((i + 1) * s) / 2 + s / 2, 10],
                [10 + (i * s) / 2 + s / 2, 40],
              ],
        ),
  ).join("");
  return wrap(n * (sides === 4 ? s : s / 2) + s / 2 + 20, 50, body);
}

/** Beads on a string: a pattern of `colours` shades repeated; the first `count` are drawn (up to 12). */
export function beads(colours: number, count: number): string {
  const shown = Math.min(count, 12);
  const body = Array.from(
    { length: shown },
    (_, i) =>
      `<circle cx="${18 + i * 26}" cy="24" r="10" ${tint(i % colours, 0.8)}/>`,
  ).join("");
  return wrap(
    shown * 26 + 20,
    48,
    `${line(6, 24, shown * 26 + 14, 24)}${body}${count > shown ? label(shown * 26 + 12, 44, "…") : ""}`,
  );
}

/** Dice faces with their dots, left to right. */
export function dice(faces: readonly number[]): string {
  const spots: Record<number, readonly (readonly [number, number])[]> = {
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
  const w = 50;
  const body = faces
    .map(
      (f, i) =>
        `<rect x="${10 + i * w}" y="10" width="40" height="40" rx="5"/>${(spots[f] ?? []).map(([x, y]) => dot(10 + i * w + 8 + x * 12, 18 + y * 12, 3)).join("")}`,
    )
    .join("");
  return wrap(faces.length * w + 20, 60, body);
}

const iso = (x: number, y: number, w: number, h: number, d: number): string => {
  const k = d * 0.5;
  return `<rect x="${num(x)}" y="${num(y + k)}" width="${num(w)}" height="${num(h)}" ${tint(0, 0.3)}/>${poly(
    [
      [x, y + k],
      [x + k, y],
      [x + w + k, y],
      [x + w, y + k],
    ],
    tint(0, 0.12),
  )}${poly(
    [
      [x + w, y + k],
      [x + w + k, y],
      [x + w + k, y + h],
      [x + w, y + h + k],
    ],
    tint(0, 0.5),
  )}`;
};

/** A box in oblique view with sides `w`, `h` and `d` (units are scaled to fit). */
export function box(w: number, h: number, d: number): string {
  const k = 110 / Math.max(w, h, d, 1);
  return wrap(
    w * k + d * k * 0.5 + 20,
    h * k + d * k * 0.5 + 20,
    iso(10, 10, w * k, h * k, d * k),
  );
}

/** A cube with edge `a`: the same box, with unit squares on its front face. */
export function cube(a: number): string {
  const u = Math.min(a, 6);
  const k = 100 / u;
  const gridLines = Array.from(
    { length: u - 1 },
    (_, i) =>
      line(
        10 + (i + 1) * k,
        10 + k * 0.5 * u,
        10 + (i + 1) * k,
        10 + k * 0.5 * u + 100,
      ) +
      line(
        10,
        10 + k * 0.5 * u + (i + 1) * k,
        110,
        10 + k * 0.5 * u + (i + 1) * k,
      ),
  ).join("");
  return wrap(170, 175, iso(10, 10, 100, 100, 100) + gridLines);
}

/** A ball: a circle with a shaded highlight. */
export function ball(): string {
  return wrap(
    120,
    120,
    `<circle cx="60" cy="60" r="45"/><path d="M30,45 Q45,25 70,22" stroke-opacity="0.5"/>`,
  );
}

/** A pyramid or a prism on an `n`-gon base, in oblique view; hidden edges are dashed. */
export function solid(kind: "pyramid" | "prism", n: number): string {
  const cx = 70;
  const rx = 45;
  const ry = 14;
  const ring = (cy: number): readonly (readonly [number, number])[] =>
    Array.from({ length: n }, (_, i) => {
      const a = (i * 2 * Math.PI) / n + Math.PI / 2;
      return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)] as const;
    });
  const edges = (
    pts: readonly (readonly [number, number])[],
    cy: number,
  ): string =>
    pts
      .map((p, i) => {
        const q = pts[(i + 1) % n] ?? p;
        const back = (p[1] + q[1]) / 2 < cy;
        return `<line x1="${num(p[0])}" y1="${num(p[1])}" x2="${num(q[0])}" y2="${num(q[1])}"${back ? ' stroke-dasharray="4 3"' : ""}/>`;
      })
      .join("");
  const bottom = ring(120);
  if (kind === "pyramid")
    return wrap(
      140,
      140,
      edges(bottom, 120) +
        bottom
          .map(
            (p) =>
              `<line x1="${cx}" y1="15" x2="${num(p[0])}" y2="${num(p[1])}"${p[1] < 120 ? ' stroke-dasharray="4 3"' : ""}/>`,
          )
          .join(""),
    );
  const top = ring(30);
  return wrap(
    140,
    140,
    edges(bottom, 120) +
      edges(top, 30) +
      bottom
        .map(
          (p, i) =>
            `<line x1="${num((top[i] ?? p)[0])}" y1="${num((top[i] ?? p)[1])}" x2="${num(p[0])}" y2="${num(p[1])}"${p[1] < 120 ? ' stroke-dasharray="4 3"' : ""}/>`,
        )
        .join(""),
  );
}

/** A pyramid of cubes in layers: the bottom layer `a` wide, each one above a cube narrower. */
export function layers(a: number): string {
  const s = 22;
  const body = Array.from({ length: a }, (_, j) => {
    const w = a - j;
    return Array.from(
      { length: w },
      (_, i) =>
        `<rect x="${10 + (j * s) / 2 + i * s}" y="${10 + (a - 1 - j) * s}" width="${s}" height="${s}"/>`,
    ).join("");
  }).join("");
  return wrap(a * s + 20, a * s + 20, body);
}
