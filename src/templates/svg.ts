// Pictures drawn by code from a task's drawn numbers alone (RES-1200): charts, grids, figures, clocks and
// instrument scales. Every function is pure and returns one self-contained SVG string with no script, no
// link and no letters of a language, so a picture never needs translating. Colours come from the page.

const num = (x: number): string => String(Math.round(x * 100) / 100);

const wrap = (w: number, h: number, body: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${num(w)} ${num(h)}" role="img" fill="none" stroke="currentColor" stroke-width="1.5">${body}</svg>`;

const label = (x: number, y: number, t: string | number, size = 11): string =>
  `<text x="${num(x)}" y="${num(y)}" font-size="${size}" text-anchor="middle" fill="currentColor" stroke="none">${t}</text>`;

const line = (x1: number, y1: number, x2: number, y2: number): string =>
  `<line x1="${num(x1)}" y1="${num(y1)}" x2="${num(x2)}" y2="${num(y2)}"/>`;

const dot = (x: number, y: number, r = 3): string =>
  `<circle cx="${num(x)}" cy="${num(y)}" r="${r}" fill="currentColor"/>`;

const poly = (pts: readonly (readonly [number, number])[]): string =>
  `<polygon points="${pts.map(([x, y]) => `${num(x)},${num(y)}`).join(" ")}"/>`;

/** A bar chart: one bar for each value, its value above it. */
export function bars(values: readonly number[]): string {
  const max = Math.max(1, ...values);
  const w = 40 * values.length + 20;
  const body = values
    .map((v, i) => {
      const h = (v / max) * 100;
      const x = 20 + i * 40;
      return `<rect x="${x}" y="${num(125 - h)}" width="28" height="${num(h)}"/>${label(x + 14, 120 - h, v)}`;
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
    .map(([px, py], i) => `${dot(px, py)}${label(px, py - 8, values[i] ?? 0)}`)
    .join("");
  const under = marks.map((m, i) => label(30 + i * 50, 135, m)).join("");
  return wrap(
    w,
    145,
    `${line(10, 118, w - 5, 118)}${line(10, 10, 10, 118)}<polyline points="${path}"/>${dots}${under}`,
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
          ? `<circle cx="${cx}" cy="${cy}" r="${r}"/>`
          : `<path d="M${cx},${cy} L${num(x1)},${num(y1)} A${r},${r} 0 ${big} 1 ${num(x2)},${num(y2)} Z"/>`;
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
    .map(([a, b, c, d]) => line(px(a), py(b), px(c), py(d)))
    .join("");
  body += points
    .map(
      (p) =>
        dot(px(p.x), py(p.y), 4) +
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
  return wrap(140, 140, poly(pts) + ax);
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
    `<rect x="${ox}" y="${oy}" width="${num(rw)}" height="${num(rh)}"/>${ax}`,
  );
}

/** A triangle with the angles at its first two corners given in degrees (the third follows). */
export function triangle(
  a: number,
  b: number,
  texts: readonly (string | number)[] = [],
): string {
  const c = 180 - a - b;
  const ra = (a * Math.PI) / 180;
  const rb = (b * Math.PI) / 180;
  const base = 150;
  const side = (base * Math.sin(rb)) / Math.sin((c * Math.PI) / 180);
  const top: readonly [number, number] = [
    10 + side * Math.cos(ra),
    120 - side * Math.sin(ra),
  ];
  const body = `${poly([[10, 120], [10 + base, 120], top])}${label(30, 115, texts[0] ?? "")}${label(10 + base - 22, 115, texts[1] ?? "")}${label(top[0], top[1] + 22, texts[2] ?? "")}`;
  return wrap(base + 20, 135, body);
}

/** An angle of `deg` degrees drawn from a horizontal ray, with an arc and its measure. */
export function angle(deg: number, text: string | number = deg): string {
  const r = (deg * Math.PI) / 180;
  const o = [20, 110] as const;
  const end = [o[0] + 100 * Math.cos(r), o[1] - 100 * Math.sin(r)] as const;
  const arc = `<path d="M${o[0] + 30},${o[1]} A30,30 0 ${deg > 180 ? 1 : 0} 0 ${num(o[0] + 30 * Math.cos(r))},${num(o[1] - 30 * Math.sin(r))}"/>`;
  return wrap(
    140,
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
    `<circle cx="${c}" cy="${c}" r="64"/>${tick}${hand(((h % 12) + m / 60) / 12, 36)}${hand(m / 60, 52)}${dot(c, c, 2)}`,
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
          `<rect x="${10 + i * s}" y="${10 + (max - 1 - j) * s}" width="${s}" height="${s}"/>`,
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
            `<rect x="${10 + i * s}" y="${10 + j * s}" width="${s}" height="${s}"/>${label(10 + i * s + s / 2, 10 + j * s + s / 2 + 4, v, 13)}`,
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
            `<rect x="${10 + i * cw}" y="${10 + j * ch}" width="${cw}" height="${ch}"/>${label(10 + i * cw + cw / 2, 10 + j * ch + 16, v, 12)}`,
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
        ([i, j]) =>
          `<rect x="${10 + i * s}" y="${10 + j * s}" width="${s}" height="${s}"/>`,
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
    `<rect x="10" y="30" width="${len * s}" height="30" stroke-opacity="0.4"/>${ticks}${line(10 + from * s, 20, 10 + to * s, 20)}${line(10 + from * s, 14, 10 + from * s, 26)}${line(10 + to * s, 14, 10 + to * s, 26)}`,
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
    `<rect x="44" y="${y(hi)}" width="12" height="${num(y(lo) - y(hi))}" rx="6" stroke-opacity="0.5"/><rect x="47" y="${num(y(value))}" width="6" height="${num(y(lo) - y(value))}" fill="currentColor"/>${ticks}`,
  );
}

/** A compass rose with the four directions marked N, E, S and W. */
export function compass(): string {
  return wrap(
    140,
    140,
    `<circle cx="70" cy="70" r="50"/>${line(70, 14, 70, 126)}${line(14, 70, 126, 70)}${label(70, 12, "N")}${label(132, 74, "E")}${label(70, 138, "S")}${label(8, 74, "W")}`,
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
