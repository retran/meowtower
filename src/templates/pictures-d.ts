// The pictures of domain D added after the first table in `pictures.ts`, by template id; one here replaces one there.
// Each draws only what its task gives: the ends of a segment, the sides of a rectangle, the lines of a receipt.
import type { Draw } from "./pictures.js";

const num = (x: number): string => String(Math.round(x * 100) / 100);
const n = (v: number[], i: number): number => v[i] ?? 0;

const wrap = (w: number, h: number, body: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${num(w)} ${num(h)}" role="img" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">${body}</svg>`;
const text = (
  x: number,
  y: number,
  t: string,
  size = 12,
  anchor: "start" | "middle" | "end" = "middle",
): string =>
  `<text x="${num(x)}" y="${num(y)}" font-size="${size}" text-anchor="${anchor}" fill="currentColor" stroke="none">${t}</text>`;
const line = (x1: number, y1: number, x2: number, y2: number): string =>
  `<line x1="${num(x1)}" y1="${num(y1)}" x2="${num(x2)}" y2="${num(y2)}"/>`;
const dot = (x: number, y: number): string =>
  `<circle cx="${num(x)}" cy="${num(y)}" r="5" fill="#e5534b" stroke="none"/>`;

/** `h` hundredths as a decimal with a comma, such as 305 as 3,05. */
const dec = (h: number, places: number): string => {
  const unit = 10 ** places;
  return `${Math.floor(h / unit)},${String(h % unit).padStart(places, "0")}`;
};

/** A segment cut into equal parts, its ends written; a dot sits on one tick and a "?" on a tick that the task asks about. */
function segment(
  left: string,
  right: string,
  parts: number,
  dotAt: number | null,
  askAt: number | null = null,
): string {
  const x0 = 24;
  const x1 = 276;
  const y = 40;
  const at = (i: number): number => x0 + ((x1 - x0) * i) / parts;
  const ticks = Array.from({ length: parts + 1 }, (_, i) =>
    line(
      at(i),
      y - (i === 0 || i === parts ? 9 : 5),
      at(i),
      y + (i === 0 || i === parts ? 9 : 5),
    ),
  ).join("");
  return wrap(
    300,
    74,
    `${line(x0, y, x1, y)}${ticks}${text(x0, y + 26, left)}${text(x1, y + 26, right)}${dotAt === null ? "" : dot(at(dotAt), y)}${askAt === null ? "" : text(at(askAt), y - 16, "?", 16)}`,
  );
}

/** Amounts one under another as on a till receipt, a rule under them and a "?" where the total goes. */
function receipt(amounts: readonly string[]): string {
  const row = 20;
  const top = 22;
  const rows = amounts
    .map((a, i) => text(120, top + i * row, a, 14, "end"))
    .join("");
  const y = top + (amounts.length - 1) * row + 8;
  return wrap(
    150,
    y + 34,
    `<rect x="14" y="4" width="122" height="${num(y + 26)}" rx="4" stroke-dasharray="3 3"/>${rows}${text(30, top + (amounts.length - 1) * row, "+", 14)}${line(28, y, 124, y)}${text(120, y + 20, "?", 14, "end")}`,
  );
}

/** A rectangle with its two sides written, longer side along the bottom. */
function sides(first: string, second: string, wide: boolean): string {
  const w = wide ? 150 : 100;
  const h = wide ? 100 : 150;
  return wrap(
    w + 60,
    h + 44,
    `<rect x="30" y="12" width="${w}" height="${h}" fill="currentColor" fill-opacity="0.08"/>${text(30 + w / 2, h + 34, first, 14)}${text(18, 12 + h / 2 + 5, second, 14, "end")}`,
  );
}

/** A long bar for the whole length and a short bar for one piece, both written. */
function ribbon(total: string, piece: string, ratio: number): string {
  const full = 252;
  const short = Math.max(14, Math.min(full - 20, full * ratio));
  return wrap(
    300,
    96,
    `<rect x="24" y="14" width="${full}" height="18" fill="currentColor" fill-opacity="0.1"/>${text(150, 12, total, 13)}<rect x="24" y="52" width="${num(short)}" height="18" fill="#4f8ef7" fill-opacity="0.45"/>${text(24 + short / 2, 88, piece, 13)}`,
  );
}

export const PICTURES_D: Readonly<Record<string, Draw>> = {
  // D1: a point between two neighbouring marks
  "D1.place-value.13": (v) =>
    segment(
      dec(10 * n(v, 0) + n(v, 1), 1),
      dec(10 * n(v, 0) + n(v, 1) + 1, 1),
      10,
      null,
      5,
    ),
  "D1.place-value.14": (v) =>
    segment(String(n(v, 0)), String(n(v, 0) + 1), 10, n(v, 1)),
  // D2: the amounts of a receipt
  "D2.add-sub.03": (v) =>
    receipt([n(v, 0), n(v, 1), n(v, 2)].map((h) => dec(h, 2))),
  "D2.add-sub.07": (v) =>
    receipt(
      [
        100 * n(v, 0) + n(v, 2),
        100 * n(v, 1) + 100 - n(v, 2),
        100 * n(v, 3) + n(v, 5),
        100 * n(v, 4) + 100 - n(v, 5),
      ].map((h) => dec(h, 2)),
    ),
  "D2.add-sub.13": (v) =>
    receipt([0, 2, 4].map((i) => dec(100 * n(v, i) + n(v, i + 1), 2))),
  // D4: the sides of a rectangle
  "D4.multiply-1S.04": (v) =>
    sides(dec(n(v, 0), 1), dec(n(v, 1), 1), n(v, 0) >= n(v, 1)),
  "D4.multiply-1S.05": (v) => sides(dec(n(v, 0), 1), dec(n(v, 0), 1), true),
  "D4.multiply-1S.06": (v) => sides(dec(n(v, 0), 1), dec(n(v, 0), 1), true),
  // D5: a ribbon and one piece cut from it
  "D5.divide.15": (v) => {
    const total = n(v, 0) * n(v, 1) + n(v, 2);
    return ribbon(
      dec(total, 1).replace(/,0$/, ""),
      dec(n(v, 0), 1),
      n(v, 0) / total,
    );
  },
  // D6: a segment from 0 to 1, and one between a fraction and a decimal
  "D6.convert.14": (v) => segment("0", "1", n(v, 1), n(v, 0)),
  "D6.convert-1S.16": (v) => {
    const fraction = `${n(v, 0)}⁄${n(v, 1)}`;
    const decimal = dec(n(v, 2), 1);
    return n(v, 0) * 10 < n(v, 2) * n(v, 1)
      ? segment(fraction, decimal, 2, null, 1)
      : segment(decimal, fraction, 2, null, 1);
  },
  "D1.place-value.15": (v) =>
    segment(
      dec(10 * n(v, 0) + n(v, 1), 1),
      dec(10 * n(v, 0) + n(v, 1) + 1, 1),
      10,
      n(v, 2),
    ),
};
