// The pictures of domain F added after the first table in `pictures.ts`, by template id; one here replaces one there.
// A picture draws what the task gives and never what it asks: cells, parts and marks carry no label of the answer.
import type { Draw } from "./pictures.js";

const BLUE = "#4f8ef7";
const ORANGE = "#f59e42";
const num = (x: number): string => String(Math.round(x * 100) / 100);
const n = (v: number[], i: number): number => v[i] ?? 0;

const wrap = (w: number, h: number, body: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${num(w)} ${num(h)}" role="img" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">${body}</svg>`;

const text = (x: number, y: number, t: string | number, size = 11): string =>
  `<text x="${num(x)}" y="${num(y)}" font-size="${size}" text-anchor="middle" fill="currentColor" stroke="none">${t}</text>`;

const stroke = (x1: number, y1: number, x2: number, y2: number): string =>
  `<line x1="${num(x1)}" y1="${num(y1)}" x2="${num(x2)}" y2="${num(y2)}"/>`;

const rect = (
  x: number,
  y: number,
  w: number,
  h: number,
  colour = "",
): string =>
  `<rect x="${num(x)}" y="${num(y)}" width="${num(w)}" height="${num(h)}" ${
    colour === "" ? 'fill="none"' : `fill="${colour}" fill-opacity="0.5"`
  }/>`;

/** One row of `parts` equal cells; cell `i` takes the colour `fills[i]` (0 is empty, 1 blue, 2 orange). */
function cells(
  x: number,
  y: number,
  w: number,
  h: number,
  parts: number,
  fills: readonly number[],
): string {
  const step = w / parts;
  return Array.from({ length: parts }, (_, i) =>
    rect(
      x + i * step,
      y,
      step,
      h,
      fills[i] === 1 ? BLUE : fills[i] === 2 ? ORANGE : "",
    ),
  ).join("");
}

/** The first `shaded` of `parts` cells in blue, then `second` more in orange. */
const filled = (shaded: number, second = 0): number[] => [
  ...Array.from({ length: shaded }, () => 1),
  ...Array.from({ length: second }, () => 2),
];

/** A strip of `parts` equal cells with the first `shaded` coloured. */
export function strip(parts: number, shaded: number, second = 0): string {
  return wrap(300, 44, cells(10, 10, 280, 24, parts, filled(shaded, second)));
}

/** Rows of strips of the same length: each row is `[parts, shaded, second]`. */
export function strips(
  rows: readonly (readonly [number, number, number?])[],
): string {
  const body = rows
    .map(([p, s, t], j) =>
      cells(10, 10 + j * 34, 280, 24, p, filled(s, t ?? 0)),
    )
    .join("");
  return wrap(300, rows.length * 34 + 10, body);
}

/** A circle cut into `parts` equal sectors with the first `shaded` coloured. */
export function sectors(parts: number, shaded: number): string {
  const cx = 60;
  const cy = 60;
  const r = 52;
  const point = (k: number): [number, number] => {
    const t = -Math.PI / 2 + (k / parts) * 2 * Math.PI;
    return [cx + r * Math.cos(t), cy + r * Math.sin(t)];
  };
  const body = Array.from({ length: parts }, (_, i) => {
    const [x1, y1] = point(i);
    const [x2, y2] = point(i + 1);
    const fill =
      i < shaded ? `fill="${BLUE}" fill-opacity="0.5"` : 'fill="none"';
    return `<path d="M${num(cx)},${num(cy)} L${num(x1)},${num(y1)} A${r},${r} 0 0 1 ${num(x2)},${num(y2)} Z" ${fill}/>`;
  }).join("");
  return wrap(
    120,
    120,
    parts === 1 ? `<circle cx="60" cy="60" r="52"/>` : body,
  );
}

/** A row of `total` small circles, the first `marked` coloured; they wrap after `perRow`. */
export function dots(total: number, marked: number, perRow = 8): string {
  const body = Array.from({ length: total }, (_, i) => {
    const col = i % perRow;
    const row = Math.floor(i / perRow);
    const fill =
      i < marked ? `fill="${BLUE}" fill-opacity="0.6"` : 'fill="none"';
    return `<circle cx="${num(20 + col * 30)}" cy="${num(20 + row * 30)}" r="11" ${fill}/>`;
  }).join("");
  const rows = Math.ceil(total / perRow);
  return wrap(Math.min(total, perRow) * 30 + 10, rows * 30 + 10, body);
}

/** A strip of `parts` cells where the cell `at` is `width` wide and every other one is two wide. */
export function uneven(parts: number, at: number, width: number): string {
  const widths = Array.from({ length: parts }, (_, i) =>
    i === at ? width : 2,
  );
  const total = widths.reduce((s, w) => s + w, 0);
  const unit = 280 / total;
  let x = 10;
  const body = widths
    .map((w, i) => {
      const cell = rect(x, 10, w * unit, 24, i === at ? BLUE : "");
      x += w * unit;
      return cell;
    })
    .join("");
  return wrap(300, 44, body);
}

/**
 * A number line from 0 to `units` with `per` equal parts in each unit and a point on tick `mark`.
 * Only the whole numbers are labelled.
 */
export function ticks(units: number, per: number, mark: number): string {
  const w = 280;
  const x = (k: number): number => 10 + (k / (units * per)) * w;
  const body = Array.from({ length: units * per + 1 }, (_, k) => {
    const whole = k % per === 0;
    return (
      stroke(x(k), whole ? 26 : 30, x(k), 42) +
      (whole ? text(x(k), 58, k / per) : "")
    );
  }).join("");
  return wrap(
    300,
    66,
    `${stroke(x(0), 36, x(units * per), 36)}${body}${
      mark < 0
        ? ""
        : `<circle cx="${num(x(mark))}" cy="36" r="5" fill="currentColor" stroke="none"/>`
    }`,
  );
}

/** `wholes` full strips and one more strip with `n` of `d` cells coloured. */
export function mixedStrips(wholes: number, n: number, d: number): string {
  const rows: [number, number][] = [
    ...Array.from({ length: wholes }, (): [number, number] => [d, d]),
    [d, n],
  ];
  return strips(rows);
}

/** A rectangle inside a unit square, its sides taken as parts of the sides of the square. */
export function insideSquare(w: number, h: number): string {
  const s = 120;
  return wrap(
    s + 20,
    s + 20,
    `${rect(10, 10, s, s)}${rect(10, 10 + s * (1 - h), s * w, s * h, BLUE)}`,
  );
}

export const PICTURES_F: Readonly<Record<string, Draw>> = {
  // F1: the shaded part, the written fraction, the part left over, objects in a set, uneven parts.
  "F1.share.01": (v) => sectors(n(v, 1), n(v, 0)),
  "F1.share.02": (v) => sectors(n(v, 1), n(v, 0)),
  "F1.share.04": (v) => strip(n(v, 1), n(v, 0)),
  "F1.share.11": (v) => sectors(n(v, 1), n(v, 0)),
  "F1.share.13": (v) => dots(n(v, 0), n(v, 1)),
  "F1.share.14": (v) => uneven(n(v, 0), 0, n(v, 1)),
  // F2: the whole cut into equal parts, some of them taken.
  "F2.fraction-of.06": (v) => strip(n(v, 1), n(v, 0)),
  "F2.fraction-of.07": (v) => strip(n(v, 1), n(v, 0)),
  "F2.fraction-of.09": (v) => strip(n(v, 1), n(v, 0)),
  // F4: a fraction and an empty row cut into the parts of the equal fraction.
  "F4.equivalent.01": (v) =>
    strips([
      [n(v, 1), n(v, 0)],
      [n(v, 1) * n(v, 2), 0],
    ]),
  "F4.equivalent.07": (v) => sectors(n(v, 0), 0),
  // F5: a strip with one or two colours, strips of a mixed number.
  "F5.add-same-den.04": (v) => strip(n(v, 1), n(v, 0)),
  "F5.add-same-den.10": (v) => strip(n(v, 1), n(v, 0)),
  "F5.add-same-den.13": (v) => strip(n(v, 2), n(v, 0), n(v, 1)),
  "F5.mixed.12": (v) => mixedStrips(n(v, 0), n(v, 1), n(v, 2)),
  // F6: two strips of the same length, cut into the parts of the two denominators.
  "F6.add-unlike.01": (v) =>
    strips([
      [n(v, 1), n(v, 0)],
      [n(v, 1) * n(v, 3), n(v, 2)],
    ]),
  "F6.add-unlike.04": (v) =>
    strips([
      [n(v, 1), n(v, 0)],
      [n(v, 3), n(v, 2)],
    ]),
  "F6.add-unlike.11": (v) =>
    strips([
      [n(v, 1), n(v, 0)],
      [n(v, 3), n(v, 2)],
    ]),
  // F7: a rectangle inside the unit square.
  "F7.times-fraction-1S.04": (v) =>
    insideSquare(n(v, 0) / n(v, 1), n(v, 2) / n(v, 3)),
  // F3: a mark on the number line.
  "F3.line.02": (v) => ticks(1, n(v, 0), n(v, 1)),
  "F3.line.03": (v) => ticks(2, n(v, 0), n(v, 0) + n(v, 1)),
  "F3.line.15": (v) => ticks(1, n(v, 1) * n(v, 2), -1),
};
