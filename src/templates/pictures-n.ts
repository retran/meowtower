// The pictures of domain N added after the first table in `pictures.ts`, by template id; one here replaces one there.
// A picture shows what its task gives and never writes what it asks (REQ-7546). `v` holds the drawn numbers of the
// template, which the domain N specs keep as small records, so each picture reads the record it needs.
import type { Draw } from "./pictures.js";
import { digits, signed } from "./draw.js";
import { numberRow } from "./svg.js";

const PAL = ["#4f8ef7", "#f59e42", "#4caf70", "#e5534b", "#a66bd9", "#e0b83a"];
const num = (x: number): string => String(Math.round(x * 100) / 100);
const wrap = (w: number, h: number, body: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${num(w)} ${num(h)}" role="img" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">${body}</svg>`;
const rect = (x: number, y: number, w: number, h: number, c: number, o = 0.4) =>
  `<rect x="${num(x)}" y="${num(y)}" width="${num(w)}" height="${num(h)}" fill="${PAL[c % PAL.length]}" fill-opacity="${o}"/>`;
const disc = (x: number, y: number, r: number, c: number) =>
  `<circle cx="${num(x)}" cy="${num(y)}" r="${r}" fill="${PAL[c % PAL.length]}" fill-opacity="0.75"/>`;

/** The record a template of domain N drew, read by name. */
const rec = <T>(v: unknown): T => v as T;

/** A group of `count` discs in rows of five. */
const discs = (count: number, x0: number, c: number): string =>
  Array.from({ length: count }, (_, i) =>
    disc(x0 + 8 + (i % 5) * 16, 14 + Math.floor(i / 5) * 16, 6, c),
  ).join("");

/** Two groups of discs side by side, in rows of five. */
export function twoGroups(a: number, b: number): string {
  const rows = Math.ceil(Math.max(a, b) / 5);
  const gap = 96;
  return wrap(
    2 * gap + 8,
    rows * 16 + 12,
    `${discs(a, 0, 0)}${discs(b, gap, 1)}`,
  );
}

/** Base-ten blocks: flats of a hundred, rods of ten and single cubes. */
export function baseTen(h: number, t: number, o: number): string {
  const u = 5;
  const thin = 'stroke-opacity="0.5" stroke-width="0.6"';
  let x = 4;
  let body = "";
  const flatRows = Math.ceil(h / 5);
  for (let i = 0; i < h; i += 1) {
    const fx = x + (i % 5) * (10 * u + 6);
    const fy = 4 + Math.floor(i / 5) * (10 * u + 6);
    let grid = "";
    for (let k = 1; k < 10; k += 1)
      grid += `M${fx + k * u} ${fy}v${10 * u}M${fx} ${fy + k * u}h${10 * u}`;
    body += `${rect(fx, fy, 10 * u, 10 * u, 0, 0.3)}<path d="${grid}" ${thin}/>`;
  }
  if (h > 0) x += Math.min(h, 5) * (10 * u + 6) + 10;
  for (let i = 0; i < t; i += 1) {
    const rx = x + i * (u + 3);
    let ticks = "";
    for (let k = 1; k < 10; k += 1) ticks += `M${rx} ${4 + k * u}h${u}`;
    body += `${rect(rx, 4, u, 10 * u, 2, 0.5)}<path d="${ticks}" ${thin}/>`;
  }
  if (t > 0) x += t * (u + 3) + 10;
  for (let i = 0; i < o; i += 1)
    body += rect(
      x + (i % 5) * (u + 3),
      4 + Math.floor(i / 5) * (u + 3),
      u,
      u,
      1,
      0.6,
    );
  if (o > 0) x += Math.min(o, 5) * (u + 3);
  const height = Math.max(
    flatRows > 0 ? flatRows * (10 * u + 6) : 0,
    t > 0 ? 10 * u + 4 : 0,
    Math.ceil(o / 5) * (u + 3) + 4,
  );
  return wrap(x + 4, height + 8, body);
}

/** Two numbers written one under the other, the places lined up from the right and the thousands set apart. */
export function digitRows(a: number, b: number): string {
  const rows = [String(a), String(b)];
  const width = Math.max(...rows.map((r) => r.length));
  const w = 24;
  const gap = 10;
  let body = "";
  rows.forEach((row, y) => {
    for (let i = 0; i < row.length; i += 1) {
      const col = width - row.length + i;
      const fromRight = width - 1 - col;
      const x =
        8 +
        col * w +
        gap * (Math.floor((width - 1) / 3) - Math.floor(fromRight / 3));
      body += `<rect x="${x}" y="${6 + y * 34}" width="${w - 3}" height="30" fill="${PAL[y]}" fill-opacity="0.2"/><text x="${x + (w - 3) / 2}" y="${27 + y * 34}" font-size="17" text-anchor="middle" fill="currentColor" stroke="none">${row[i]}</text>`;
    }
  });
  return wrap(16 + width * w + gap * Math.floor((width - 1) / 3), 78, body);
}

/** A picture cut into four equal parts, each part holding `m` circles at places that look scattered. */
export function scatter(m: number): string {
  const w = 120;
  const h = 84;
  let body = "";
  for (let part = 0; part < 4; part += 1) {
    const ox = 4 + (part % 2) * (w + 8);
    const oy = 4 + Math.floor(part / 2) * (h + 8);
    body += `<rect x="${ox}" y="${oy}" width="${w}" height="${h}" fill="none" stroke-opacity="0.5"/>`;
    // cells of a 6 by 5 grid, taken in an order the part and the count decide, each circle jittered inside its cell
    let seed = 7 * part + 13 * m + 1;
    const cells = Array.from({ length: 30 }, (_, i) => i);
    for (let i = cells.length - 1; i > 0; i -= 1) {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      const j = seed % (i + 1);
      [cells[i], cells[j]] = [cells[j] ?? 0, cells[i] ?? 0];
    }
    for (let k = 0; k < m; k += 1) {
      const cell = cells[k] ?? 0;
      seed = (seed * 1103515245 + 12345) % 2147483648;
      const jx = (seed % 7) - 3;
      seed = (seed * 1103515245 + 12345) % 2147483648;
      const jy = (seed % 7) - 3;
      body += disc(
        ox + 10 + (cell % 6) * 20 + jx,
        oy + 10 + Math.floor(cell / 6) * 16 + jy,
        5,
        (cell + part) % 3,
      );
    }
  }
  return wrap(2 * w + 20, 2 * h + 20, body);
}

const text = (x: number, y: number, t: string | number, size = 11): string =>
  `<text x="${num(x)}" y="${num(y)}" font-size="${size}" text-anchor="middle" fill="currentColor" stroke="none">${t}</text>`;

/**
 * A number line cut into `parts` equal parts. `labels` names some of the marks by their index from the left,
 * `dot` puts one point above a mark and `points` puts several numbered points above marks.
 */
export function scaleLine(
  parts: number,
  labels: Readonly<Record<number, string>>,
  o: {
    dot?: number;
    dots?: readonly number[];
    points?: readonly number[];
    major?: number;
    jump?: { from: number; to: number; label: string };
  } = {},
): string {
  const w = 340;
  const x0 = 28;
  const unit = (w - 2 * x0) / parts;
  const at = (i: number): number => x0 + i * unit;
  let body = `<line x1="${num(at(0))}" y1="50" x2="${num(at(parts))}" y2="50"/>`;
  for (let i = 0; i <= parts; i += 1) {
    const tall = i % (o.major ?? parts + 1) === 0 || i === parts;
    body += `<line x1="${num(at(i))}" y1="${tall ? 42 : 45}" x2="${num(at(i))}" y2="${tall ? 58 : 55}"/>`;
  }
  for (const [i, t] of Object.entries(labels))
    body += text(at(Number(i)), 76, t);
  if (o.dot !== undefined)
    body += `<line x1="${num(at(o.dot))}" y1="30" x2="${num(at(o.dot))}" y2="48" stroke-opacity="0.5"/><circle cx="${num(at(o.dot))}" cy="24" r="6" fill="${PAL[3]}" fill-opacity="0.85"/>`;
  for (const k of o.dots ?? [])
    body += `<line x1="${num(at(k))}" y1="30" x2="${num(at(k))}" y2="48" stroke-opacity="0.5"/><circle cx="${num(at(k))}" cy="24" r="6" fill="${PAL[3]}" fill-opacity="0.85"/>`;
  if (o.jump) {
    const a = at(o.jump.from);
    const b = at(o.jump.to);
    const mid = (a + b) / 2;
    const head = b > a ? -6 : 6;
    body += `<path d="M${num(a)} 18 Q${num(mid)} -6 ${num(b)} 18" stroke="${PAL[0]}" stroke-width="2"/><path d="M${num(b + head)} 10 L${num(b)} 18 L${num(b + head)} 25" stroke="${PAL[0]}" stroke-width="2"/>${text(mid, 8, o.jump.label, 13)}`;
  }
  (o.points ?? []).forEach((k, n) => {
    body += `<line x1="${num(at(k))}" y1="30" x2="${num(at(k))}" y2="48" stroke-opacity="0.5"/><circle cx="${num(at(k))}" cy="20" r="10" fill="${PAL[n % PAL.length]}" fill-opacity="0.6"/>${text(at(k), 24, n + 1, 12)}`;
  });
  return wrap(
    w,
    88,
    o.jump ? `<g transform="translate(0 14)">${body}</g>` : body,
  );
}

/** A ruler marked in centimetres, numbered at every fifth mark, with a pencil lying along it from `a` to `b`. */
export function rulerBar(a: number, b: number): string {
  const top = Math.max(b + 1, 16);
  const unit = 18;
  const x = (i: number): number => 14 + i * unit;
  let body = rect(x(0), 44, top * unit, 26, 5, 0.25);
  for (let i = 0; i <= top; i += 1)
    body += `<line x1="${x(i)}" y1="44" x2="${x(i)}" y2="${i % 5 === 0 ? 62 : 56}"/>`;
  for (let i = 0; i <= top; i += 5) body += text(x(i), 82, i);
  body += `<rect x="${x(a)}" y="20" width="${(b - a) * unit - 8}" height="14" fill="${PAL[1]}" fill-opacity="0.7"/><polygon points="${x(b) - 8},20 ${x(b)},27 ${x(b) - 8},34" fill="${PAL[0]}" fill-opacity="0.7"/>`;
  return wrap(x(top) + 14, 92, body);
}

/** `m` trees in a row at equal distances, standing on a path. */
export function trees(m: number): string {
  const unit = 28;
  let body = `<line x1="8" y1="58" x2="${num(8 + (m + 1) * unit)}" y2="58"/>`;
  for (let i = 1; i <= m; i += 1) {
    const x = 8 + i * unit;
    body += `<line x1="${x}" y1="58" x2="${x}" y2="40"/>${disc(x, 30, 11, 2)}`;
  }
  return wrap(16 + (m + 1) * unit, 70, body);
}

/** A square cut into 100 equal cells. `k` cells are shaded row by row, or `k` whole columns of ten when `columns` is set. */
export function hundredGrid(k: number, columns = false): string {
  const u = 14;
  let body = "";
  for (let i = 0; i < 100; i += 1) {
    const row = Math.floor(i / 10);
    const col = i % 10;
    const on = columns ? col < k : i < k;
    body += rect(8 + col * u, 8 + row * u, u, u, 0, on ? 0.55 : 0.06);
  }
  body += `<rect x="8" y="8" width="${10 * u}" height="${10 * u}" fill="none"/>`;
  return wrap(16 + 10 * u, 16 + 10 * u, body);
}

/** A vertical thermometer from -20 to 20 with a mark for every degree, numbered at every fifth, the column up to `v`. */
export function thermoScale(v: number): string {
  const lo = -20;
  const hi = 20;
  const top = 12;
  const h = 150;
  const y = (t: number): number => top + ((hi - t) / (hi - lo)) * h;
  let body = `<rect x="50" y="${num(y(hi) - 4)}" width="16" height="${num(h + 8)}" rx="8" fill="none" stroke-opacity="0.6"/>`;
  body += `<rect x="55" y="${num(y(v))}" width="6" height="${num(y(lo) - y(v))}" fill="${PAL[3]}" fill-opacity="0.85" stroke="none"/>`;
  for (let t = lo; t <= hi; t += 1) {
    const long = t % 5 === 0;
    body += `<line x1="${long ? 38 : 42}" y1="${num(y(t))}" x2="48" y2="${num(y(t))}"/>`;
    if (long) body += text(24, y(t) + 4, signed(t), 10);
  }
  return wrap(90, h + 2 * top + 4, body);
}

export const PICTURES_N: Readonly<Record<string, Draw>> = {
  // N1: the tens and ones of a number, and groups of discs to compare
  "N1.compare.06": (v) => {
    const p = rec<{ t: number; o: number }>(v);
    return baseTen(0, p.t, p.o);
  },
  "N1.compare.15": (v) => baseTen(0, rec<{ t: number }>(v).t, 0),
  "N1.compare.19": (v) => {
    const p = rec<{ a: number; b: number }>(v);
    return twoGroups(p.a, p.b);
  },
  // N1: the numbers a row gives, with a tile for the one that is asked
  "N1.before-after.08": (v) => {
    const p = rec<{ a: number }>(v);
    return numberRow([p.a, "?", p.a + 2]);
  },
  "N1.before-after.09": (v) => {
    const p = rec<{ a: number }>(v);
    return numberRow([p.a, p.a + 1, p.a + 2, "?"]);
  },
  "N1.before-after.10": (v) => {
    const p = rec<{ a: number }>(v);
    return numberRow([p.a + 2, p.a + 1, p.a, "?"]);
  },
  // N2: blocks of hundreds, tens and ones
  "N2.compose.01": (v) => {
    const p = rec<{ t: number; o: number }>(v);
    return baseTen(0, p.t, p.o);
  },
  "N2.compose.05": (v) => {
    const p = rec<{ h: number; t: number; o: number }>(v);
    return baseTen(p.h, p.t, p.o);
  },
  "N2.compose.14": (v) => {
    const p = rec<{ h: number; o: number }>(v);
    return baseTen(p.h, 0, p.o);
  },
  "N2.compose.23": (v) => {
    const p = rec<{ h: number; t: number; o: number }>(v);
    return baseTen(p.h, p.t, p.o);
  },
  "N2.compose.24": (v) => {
    const p = rec<{ t: number; o: number }>(v);
    return baseTen(0, p.t, p.o);
  },
  // N3: two numbers under each other, places lined up
  "N3.compare-six.01": (v) => {
    const p = rec<{ a: number; b: number }>(v);
    return digitRows(p.a, p.b);
  },
  "N3.compare-six.02": (v) => {
    const p = rec<{ a: number; b: number }>(v);
    return digitRows(p.a, p.b);
  },
  "N3.compare-six.03": (v) => {
    const p = rec<{ a: number; b: number }>(v);
    return digitRows(p.a, p.b);
  },
  "N3.compare-six.05": (v) => {
    const p = rec<{ a: number; b: number }>(v);
    return digitRows(p.a, p.b);
  },
  "N3.compare-six.06": (v) => {
    const p = rec<{ a: number; b: number }>(v);
    return digitRows(p.a, p.b);
  },
  "N3.compare-six.10": (v) => {
    const p = rec<{ a: number; b: number }>(v);
    return digitRows(p.a, p.b);
  },
  // N4: a count to estimate from a picture
  "N4.estimate.15": (v) => scatter(rec<{ a: number }>(v).a),
  // N5: the line, with its marks, and the scales
  "N5.point.01": (v) =>
    scaleLine(10, { 0: "0", 10: "100" }, { dot: rec<{ k: number }>(v).k }),
  "N5.point.02": (v) =>
    scaleLine(
      10,
      { 0: "0", 10: digits(1000) },
      { dot: 10 - rec<{ k: number }>(v).k },
    ),
  "N5.point.03": (v) => {
    const p = rec<{ b: number; k: number }>(v);
    return scaleLine(
      10,
      { 0: digits(p.b), 10: digits(p.b + 100) },
      { dot: p.k },
    );
  },
  "N5.point.04": (v) => {
    const p = rec<{ a: number; d: number }>(v);
    return scaleLine(
      2,
      { 0: digits(p.a), 2: digits(p.a + 2 * p.d) },
      { dot: 1 },
    );
  },
  "N5.point.05": (v) => {
    const p = rec<{ t: number; parts: number; k: number }>(v);
    return scaleLine(p.parts, { 0: "0", [p.parts]: digits(p.t) }, { dot: p.k });
  },
  "N5.point.06": (v) => {
    const p = rec<{ a: number; b: number; q: number }>(v);
    return scaleLine(4, { 0: digits(p.a), 4: digits(p.b) }, { dot: p.q });
  },
  "N5.point.09": (v) =>
    scaleLine(10, { 0: "0", 10: "1" }, { dot: rec<{ k: number }>(v).k }),
  "N5.point.10": (v) => {
    const p = rec<{ step: number; k: number; base: number }>(v);
    return scaleLine(p.k + 3, { [p.k + 2]: digits(p.base) }, { dot: 2 });
  },
  "N5.point.12": (v) => {
    const p = rec<{ step: number; parts: number; lo: number; k: number }>(v);
    return scaleLine(
      p.parts,
      { 0: digits(p.lo), [p.parts]: digits(p.lo + p.parts * p.step) },
      { dot: p.k },
    );
  },
  "N5.point.13": (v) => {
    const p = rec<{
      maj: number;
      sub: number;
      labels: number;
      t: number;
      lo: number;
    }>(v);
    const named: Record<number, string> = {};
    for (let i = 0; i < p.labels; i += 1)
      named[i * p.sub] = digits(p.lo + i * p.maj);
    return scaleLine((p.labels - 1) * p.sub, named, { dot: p.t, major: p.sub });
  },
  "N5.point.14": (v) => {
    const p = rec<{ step: number; lo: number; ks: number[] }>(v);
    return scaleLine(
      10,
      { 0: digits(p.lo), 10: digits(p.lo + 10 * p.step) },
      { points: p.ks },
    );
  },
  "N5.point.16": (v) => {
    const p = rec<{ w: number; k: number }>(v);
    return scaleLine(10, { 0: String(p.w), 10: String(p.w + 1) }, { dot: p.k });
  },
  "N5.scale.03": (v) => {
    const lo = rec<{ lo: number }>(v).lo;
    return scaleLine(2, { 0: digits(lo), 2: digits(lo + 100) }, { dot: 1 });
  },
  "N5.scale.05": (v) => {
    const p = rec<{ a: number; g: number; p: number }>(v);
    return scaleLine(p.p, { 0: digits(p.a), [p.p]: digits(p.a + p.g) });
  },
  "N5.scale.06": (v) => {
    const p = rec<{ a: number; p: number; k: number }>(v);
    return scaleLine(
      p.p,
      { 0: digits(p.a), [p.p]: digits(p.a + 100) },
      { dot: p.k },
    );
  },
  "N5.scale.08": (v) => {
    const p = rec<{ b: number; k: number }>(v);
    return scaleLine(p.k + 2, { 0: digits(p.b) }, { dot: p.k });
  },
  "N5.scale.12": (v) => {
    const p = rec<{ a: number; len: number }>(v);
    return rulerBar(p.a, p.a + p.len);
  },
  "N5.scale.13": (v) => trees(rec<{ m: number }>(v).m),
  "N5.scale.14": (v) => {
    const p = rec<{ lo: number; g: number; p: number }>(v);
    return scaleLine(p.p, { 0: digits(p.lo), [p.p]: digits(p.lo + p.g) });
  },
  // N6: a square of a hundred cells for tenths and hundredths
  "N6.million-decimal.05": (v) => hundredGrid(rec<{ k: number }>(v).k, true),
  "N6.million-decimal.06": (v) => hundredGrid(rec<{ k: number }>(v).k),
  "N6.million-decimal.21": (v) => hundredGrid(rec<{ k: number }>(v).k),
  // N7: a thermometer and a line that crosses zero
  "N7.thermometer.12": (v) => thermoScale(rec<{ v: number }>(v).v),
  "N7.thermometer.13": (v) => {
    const p = rec<{ q: number; step: number; k: number }>(v);
    return scaleLine(
      10,
      {
        0: signed(-p.step * p.q),
        10: signed(p.step * (10 - p.q)),
      },
      { dot: p.k },
    );
  },
  // N8: jumps and distances on a line that crosses zero
  "N8.scale-operate.11": (v) => {
    const p = rec<{ a: number; j: number }>(v);
    const named: Record<number, string> = {};
    for (let i = 0; i <= 24; i += 4) named[i] = signed(i - 12);
    return scaleLine(24, named, {
      jump: {
        from: p.a + 12,
        to: p.a + p.j + 12,
        label: p.j > 0 ? `+${p.j}` : signed(p.j),
      },
      dots: [p.a + 12],
    });
  },
  "N8.scale-operate.14": (v) => {
    const p = rec<{ na: number; b: number }>(v);
    return scaleLine(
      24,
      { 12: "0", [12 - p.na]: signed(-p.na), [12 + p.b]: signed(p.b) },
      { dots: [12 - p.na, 12 + p.b] },
    );
  },
};
