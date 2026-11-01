// The pictures of domain A added after the first table in `pictures.ts`, by template id; one here replaces one there.
// A picture shows what the task gives and never writes what it asks: a number line marks only the given numbers,
// and the ticks between them stay unnumbered.
import type { Draw } from "./pictures.js";
import { beads } from "./svg.js";

const wrap = (w: number, h: number, body: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">${body}</svg>`;
const text = (x: number, y: number, t: string | number, size = 11): string =>
  `<text x="${x}" y="${y}" font-size="${size}" text-anchor="middle" fill="currentColor" stroke="none">${t}</text>`;
const seg = (x1: number, y1: number, x2: number, y2: number): string =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
const rnd = (x: number): number => Math.round(x * 10) / 10;
const PAL = ["#4f8ef7", "#f59e42", "#4caf70", "#e5534b", "#a66bd9"] as const;
const tint = (i: number, o = 0.35): string =>
  `fill="${PAL[i % PAL.length] ?? "#4f8ef7"}" fill-opacity="${o}"`;

/** An arc over a number line from one value to another, with a short text on top of it. */
export interface Hop {
  readonly from: number;
  readonly to: number;
  readonly note: string;
}

/**
 * A number line from `lo` to `hi` with a tick at every whole number. Only the numbers in `named` carry a
 * label; `dots` are the marked points; a hop is an arc with a note such as "?" or "+3".
 */
export function lineOf(
  lo: number,
  hi: number,
  named: readonly number[],
  dots: readonly number[] = named,
  hops: readonly Hop[] = [],
  every = 1,
): string {
  const step = Math.min(18, 300 / (hi - lo));
  const x = (v: number): number => rnd(16 + (v - lo) * step);
  const base = hops.length > 0 ? 54 : 34;
  const ticks = Array.from({ length: hi - lo + 1 }, (_, i) => i)
    .filter((i) => i % every === 0 || i === hi - lo)
    .map((i) => seg(x(lo + i), base - 4, x(lo + i), base + 4))
    .join("");
  const names = named.map((v) => text(x(v), base + 20, v, 11)).join("");
  const marks = dots
    .map((v) => `<circle cx="${x(v)}" cy="${base}" r="4" fill="currentColor"/>`)
    .join("");
  const arcs = hops
    .map((h) => {
      const mid = rnd((x(h.from) + x(h.to)) / 2);
      const top =
        base - 12 - Math.min(26, Math.abs(h.to - h.from) * step * 0.35);
      return `<path d="M ${x(h.from)} ${base - 6} Q ${mid} ${rnd(top - 12)} ${x(h.to)} ${base - 6}"/>${text(mid, rnd(top - 2), h.note, 12)}`;
    })
    .join("");
  return wrap(
    rnd(x(hi) + 16),
    base + 30,
    `${seg(x(lo), base, x(hi), base)}${ticks}${arcs}${marks}${names}`,
  );
}

/** Two horizontal bars drawn to scale, each with the number it stands for written at its end. */
export function barPair(
  first: number,
  second: number,
  names: readonly [string, string] = ["", ""],
): string {
  const top = Math.max(first, second);
  const w = (n: number): number => rnd((n / top) * 240);
  const row = (n: number, y: number, i: number): string =>
    `<rect x="10" y="${y}" width="${w(n)}" height="22" ${tint(i, 0.55)}/>${text(rnd(10 + w(n) + 14), y + 15, n, 12)}${
      names[i] ? text(5, y - 3, names[i] ?? "", 9) : ""
    }`;
  return wrap(290, 70, `${row(first, 10, 0)}${row(second, 40, 1)}`);
}

/** The hundred chart, ten rows of ten cells, with one cell marked and numbered; no other cell carries a number. */
export function hundredChart(start: number): string {
  const c = 22;
  const row = Math.floor((start - 1) / 10);
  const col = (start - 1) % 10;
  const cells = Array.from({ length: 10 }, (_, j) =>
    Array.from(
      { length: 10 },
      (_, i) =>
        `<rect x="${10 + i * c}" y="${10 + j * c}" width="${c}" height="${c}" ${i === col && j === row ? tint(1, 0.6) : ""}/>`,
    ).join(""),
  ).join("");
  return wrap(
    20 + 10 * c,
    20 + 10 * c,
    `${cells}${text(10 + col * c + c / 2, 10 + row * c + c / 2 + 4, start, 11)}`,
  );
}

/** `count` equal boxes, each with the number it holds written inside. */
export function boxesOf(count: number, each: number | string): string {
  const w = 40;
  const body = Array.from(
    { length: count },
    (_, i) =>
      `<rect x="${10 + i * (w + 6)}" y="10" width="${w}" height="30" rx="4" ${tint(i, 0.3)}/>${text(10 + i * (w + 6) + w / 2, 30, each, 12)}`,
  ).join("");
  return wrap(20 + count * (w + 6), 50, body);
}

/** A rectangle with only its two side lengths written. */
export function sidesOf(across: number, down: number): string {
  const w = Math.min(200, 24 * Math.max(across, down));
  const h = rnd((w * Math.min(down, across * 2)) / Math.max(across, down, 1));
  const ww = rnd((w * across) / Math.max(across, down));
  return wrap(
    ww + 50,
    h + 40,
    `<rect x="30" y="10" width="${ww}" height="${h}" ${tint(0, 0.2)}/>${text(30 + ww / 2, h + 28, across, 12)}${text(14, 10 + h / 2 + 4, down, 12)}`,
  );
}

/** One bar cut into `parts` equal cells, the first cell shaded, with the whole bar's number written above it. */
export function partsBar(parts: number, whole: number): string {
  const w = Math.min(36, 260 / parts);
  const body = Array.from(
    { length: parts },
    (_, i) =>
      `<rect x="${10 + i * w}" y="26" width="${w}" height="26" ${i === 0 ? tint(1, 0.6) : tint(0, 0.3)}/>`,
  ).join("");
  return wrap(
    20 + parts * w,
    62,
    `${body}${seg(10, 18, 10 + parts * w, 18)}${text(10 + (parts * w) / 2, 12, whole, 12)}`,
  );
}

/** A long strip with its full length written above it. */
export function stripOf(total: number): string {
  return wrap(
    240,
    56,
    `<rect x="10" y="26" width="220" height="22" ${tint(1, 0.35)}/>${seg(10, 18, 230, 18)}${text(120, 12, total, 12)}`,
  );
}

/** One bar for a whole with its number above; a known part shaded and written, the rest marked "?". */
export function wholeBar(
  whole: number,
  known: number,
  firstIsKnown = true,
): string {
  const w = 240;
  const kw = Math.max(20, rnd((known / whole) * w));
  const rest = `<rect x="${10 + (firstIsKnown ? kw : 0)}" y="26" width="${w - kw}" height="26" ${tint(0, 0.2)}/>${text(10 + (firstIsKnown ? kw : 0) + (w - kw) / 2, 44, "?", 13)}`;
  const part = `<rect x="${10 + (firstIsKnown ? 0 : w - kw)}" y="26" width="${kw}" height="26" ${tint(1, 0.55)}/>${text(10 + (firstIsKnown ? 0 : w - kw) + kw / 2, 44, known, 12)}`;
  return wrap(
    w + 20,
    62,
    `${part}${rest}${seg(10, 18, 10 + w, 18)}${text(10 + w / 2, 12, whole, 12)}`,
  );
}

/** A rectangle of height `down` cut into two parts across, the two part widths written on top. */
export function splitRect(down: number, first: number, second: number): string {
  const total = first + second;
  const w = 220;
  const w1 = rnd((first / total) * w);
  const h = rnd(Math.min(80, 14 * down));
  return wrap(
    w + 50,
    h + 44,
    `<rect x="30" y="26" width="${w1}" height="${h}" ${tint(0, 0.3)}/><rect x="${30 + w1}" y="26" width="${rnd(w - w1)}" height="${h}" ${tint(1, 0.3)}/>${text(30 + w1 / 2, 18, first, 12)}${text(30 + w1 + (w - w1) / 2, 18, second, 12)}${text(14, 26 + h / 2 + 4, down, 12)}`,
  );
}

/** A rectangle cut by the tens and ones of both factors into four parts, the cuts written on two sides. */
export function areaModel(a: number, b: number): string {
  const ta = a - (a % 10);
  const oa = a % 10;
  const tb = b - (b % 10);
  const ob = b % 10;
  const W = 220;
  const H = 120;
  const wa = rnd((ta / a) * W);
  const hb = rnd((tb / b) * H);
  const rect = (
    x: number,
    y: number,
    w: number,
    h: number,
    i: number,
  ): string =>
    `<rect x="${rnd(x)}" y="${rnd(y)}" width="${rnd(w)}" height="${rnd(h)}" ${tint(i, 0.3)}/>`;
  return wrap(
    W + 60,
    H + 40,
    `${rect(40, 26, wa, hb, 0)}${rect(40 + wa, 26, W - wa, hb, 1)}${rect(40, 26 + hb, wa, H - hb, 2)}${rect(40 + wa, 26 + hb, W - wa, H - hb, 3)}${text(40 + wa / 2, 18, ta, 12)}${text(40 + wa + (W - wa) / 2, 18, oa, 12)}${text(22, 26 + hb / 2 + 4, tb, 12)}${text(22, 26 + hb + (H - hb) / 2 + 4, ob, 12)}`,
  );
}

/** One bar cut into `parts` equal cells, the whole bar's number above it and "?" in the first cell. */
export function shareBar(parts: number, whole: number): string {
  const w = Math.min(36, 260 / parts);
  const body = Array.from(
    { length: parts },
    (_, i) =>
      `<rect x="${10 + i * w}" y="26" width="${w}" height="26" ${tint(i, 0.3)}/>`,
  ).join("");
  return wrap(
    20 + parts * w,
    62,
    `${body}${text(10 + w / 2, 44, "?", 13)}${seg(10, 18, 10 + parts * w, 18)}${text(10 + (parts * w) / 2, 12, whole, 12)}`,
  );
}

/** A balance in equilibrium: the left and the right pan each carry a short expression. */
export function balance(left: string, right: string): string {
  const pan = (x: number, t: string, i: number): string =>
    `<rect x="${x - 55}" y="66" width="110" height="28" rx="6" ${tint(i, 0.3)}/>${text(x, 85, t, 13)}${seg(x - 40, 66, x, 30)}${seg(x + 40, 66, x, 30)}`;
  return wrap(
    260,
    108,
    `${seg(70, 30, 190, 30)}${seg(130, 30, 130, 100)}${seg(100, 100, 160, 100)}${pan(70, left, 0)}${pan(190, right, 1)}`,
  );
}

/** A three by three square of empty cells with "?" in the middle one. */
export function magicSquare(): string {
  const c = 34;
  const cells = Array.from({ length: 9 }, (_, i) => {
    const x = 10 + (i % 3) * c;
    const y = 10 + Math.floor(i / 3) * c;
    return `<rect x="${x}" y="${y}" width="${c}" height="${c}" ${i === 4 ? tint(1, 0.5) : ""}/>`;
  }).join("");
  return wrap(
    20 + 3 * c,
    20 + 3 * c,
    `${cells}${text(10 + 1.5 * c, 10 + 1.5 * c + 5, "?", 16)}`,
  );
}

/** A calculator screen with a short text right-aligned on it. */
export function screen(shown: string): string {
  return wrap(
    190,
    56,
    `<rect x="10" y="10" width="170" height="36" rx="6" ${tint(2, 0.2)}/>${`<text x="172" y="36" font-size="20" text-anchor="end" font-family="monospace" fill="currentColor" stroke="none">${shown}</text>`}`,
  );
}

export const PICTURES_A: Readonly<Record<string, Draw>> = {
  "A1.add-sub-20.05": ([a = 0, b = 0]) =>
    lineOf(0, 20, [a, b], [a, b], [{ from: a, to: b, note: "?" }]),
  "A1.add-sub-20.06": ([a = 0, b = 0]) =>
    lineOf(0, 20, [a, b], [a, b], [{ from: a, to: b, note: "?" }]),
  "A1.add-sub-20.09": ([a = 0, b = 0]) => barPair(a, b),
  "A1.add-sub-20.12": ([a = 0]) =>
    lineOf(0, 20, [a, 20], [a, 20], [{ from: a, to: 20, note: "?" }]),
  "A1.add-sub-20.13": ([a = 0, b = 0]) => lineOf(a - 1, b + 1, [a, b], [a, b]),
  "A3.table.06": ([a = 0, b = 0]) => boxesOf(a, b),
  "A3.table.11": ([a = 0, b = 0]) => sidesOf(b, a),
  "A4.divide-table.06": ([a = 0]) => boxesOf(a, "?"),
  "A4.divide-table.14": ([a = 0, q = 0]) => barPair(a * q, a),
  "A4.divide-table.15": ([a = 0, m = 0]) => stripOf(a * m),
  "A4.divide-table.16": ([q = 0, s = 0]) => partsBar(q + 1, s),
  "A5.column.07": ([a = 0]) =>
    lineOf(
      0,
      1000,
      [a, 1000],
      [a, 1000],
      [{ from: a, to: 1000, note: "?" }],
      100,
    ),
  "A5.column.08": ([a = 0, b = 0]) => wholeBar(a + b, b, false),
  "A5.column.10": ([a = 0, b = 0]) => wholeBar(a, b),
  "A6.by-one-digit.04": ([d = 0, n = 0]) => splitRect(d, n - (n % 10), n % 10),
  "A7.by-two-digit.01": ([a = 0, b = 0]) => areaModel(a, b),
  "A7.by-two-digit.04": ([a = 0, b = 0]) => areaModel(a, b),
  "A7.by-two-digit.06": ([a = 0, b = 0]) => sidesOf(a, b),
  "A8.remainder.13": ([a = 0]) => beads(a, 12),
  "A9.long-one-digit.05": ([a = 0, q = 0]) => shareBar(a, a * q),
  "A11.unknown.09": ([a = 0, b = 0, c = 0]) =>
    balance(`? + ${a}`, `${b} + ${c}`),
  "A11.unknown.10": ([a = 0, b = 0, c = 0]) =>
    balance(`${a} × ?`, `${b} + ${c}`),
  "A11.unknown.11": ([a = 0, b = 0, c = 0]) =>
    balance(`? − ${a}`, `${b} − ${c}`),
  "A11.unknown.12": () => magicSquare(),
  "A14.calculator.05": ([n = 0, d = 0]) =>
    screen(
      `${Math.floor(n / d)},${String(Math.floor(((n % d) * 1000) / d)).padStart(3, "0")}`,
    ),
  "A14.calculator.06": ([n = 0, d = 0]) =>
    screen(
      `${Math.floor(n / d)},${String(Math.floor(((n % d) * 1000) / d)).padStart(3, "0")}`,
    ),
  "A14.calculator.12": ([n = 0, d = 0]) =>
    screen(
      `${Math.floor(n / d)},${String(Math.floor(((n % d) * 1000) / d)).padStart(3, "0")}`,
    ),
  "A16.two-step-eq.12": ([a = 0, b = 0, c = 0]) =>
    balance(`x + x + x + ${a}`, `${b} + ${c}`),
  "A2.mental-100.08": ([a = 0]) =>
    lineOf(0, 100, [a, 100], [a, 100], [{ from: a, to: 100, note: "?" }], 10),
  "A2.mental-100.09": ([a = 0, b = 0]) =>
    lineOf(0, 100, [a, b], [a, b], [{ from: a, to: b, note: "?" }], 10),
  "A2.mental-100.13": ([a = 0, b = 0]) => lineOf(a - 1, b + 1, [a, b], [a, b]),
  "A2.mental-100.15": ([a = 0]) => hundredChart(a),
};
