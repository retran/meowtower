// The pictures of domain T added after the first table in `pictures.ts`, by template id; one here replaces one there.
// The drawers below are the strip models of a word problem: a whole cut into parts, two strips compared, equal boxes.
// A strip shows the numbers the task gives and a question mark for the one it asks, never the answer (REQ-7546).
import type { Draw } from "./pictures.js";
import { bars, clock, gallery, lineGraph, pie } from "./svg.js";

const n = (v: number[], i: number): number => v[i] ?? 0;

const PAL = ["#4f8ef7", "#f59e42", "#4caf70"] as const;
const num = (x: number): string => String(Math.round(x * 100) / 100);
const tint = (i: number, o = 0.35): string =>
  `fill="${PAL[i % PAL.length] ?? "#4f8ef7"}" fill-opacity="${o}"`;
const wrap = (w: number, h: number, body: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${num(w)} ${num(h)}" role="img" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">${body}</svg>`;
const text = (x: number, y: number, t: string | number, size = 12): string =>
  `<text x="${num(x)}" y="${num(y)}" font-size="${size}" text-anchor="middle" fill="currentColor" stroke="none">${t}</text>`;

const WIDTH = 260;
const LEFT = 10;

/** A bracket over (`up`) or under a span of a strip, with its label. */
const bracket = (
  x1: number,
  x2: number,
  y: number,
  t: string | number,
  up = true,
): string =>
  up
    ? `<path d="M${num(x1)} ${y + 6} V${y} H${num(x2)} V${y + 6}"/>${text((x1 + x2) / 2, y - 5, t)}`
    : `<path d="M${num(x1)} ${y - 6} V${y} H${num(x2)} V${y - 6}"/>${text((x1 + x2) / 2, y + 15, t)}`;

/** A box of a strip: a dashed outline stands for a number the task asks. */
const box = (
  x: number,
  y: number,
  w: number,
  h: number,
  t: string | number,
  colour: number,
): string =>
  t === "?"
    ? `<rect x="${num(x)}" y="${y}" width="${num(w)}" height="${h}" stroke-dasharray="4 3"/>${text(x + w / 2, y + h / 2 + 4, t, 14)}`
    : `<rect x="${num(x)}" y="${y}" width="${num(w)}" height="${h}" ${tint(colour)}/>${text(x + w / 2, y + h / 2 + 4, t)}`;

/** A whole cut into parts: a bracket with the total over strips that follow one another. */
export function partsStrip(
  parts: readonly (number | string)[],
  total: number | string,
): string {
  const known = parts.filter((p): p is number => typeof p === "number");
  const average = known.length
    ? known.reduce((s, x) => s + x, 0) / known.length
    : 1;
  const weights = parts.map((p) => (typeof p === "number" ? p : average));
  const sum = weights.reduce((s, x) => s + x, 0);
  let x = LEFT;
  const body = parts
    .map((p, i) => {
      const w = ((weights[i] ?? 0) / sum) * WIDTH;
      const out = box(x, 34, w, 30, p, i);
      x += w;
      return out;
    })
    .join("");
  return wrap(
    WIDTH + 2 * LEFT,
    76,
    `${bracket(LEFT, LEFT + WIDTH, 26, total)}${body}`,
  );
}

/** Two strips, one under the other, and a bracket under the part by which the longer one is longer. */
export function compareStrips(
  first: number,
  second: number,
  firstLabel: number | string,
  secondLabel: number | string,
  gap: number | string,
): string {
  const scale = WIDTH / Math.max(first, second);
  const [short, long] = [Math.min(first, second), Math.max(first, second)];
  return wrap(
    WIDTH + 2 * LEFT,
    106,
    `${box(LEFT, 8, first * scale, 26, firstLabel, 0)}${box(LEFT, 42, second * scale, 26, secondLabel, 1)}${bracket(LEFT + short * scale, LEFT + long * scale, 86, gap, false)}`,
  );
}

/** Equal boxes in a row, each with its size, and a bracket with the total over them. */
export function equalBoxes(
  count: number,
  size: number | string,
  total: number | string,
): string {
  const w = Math.min(44, WIDTH / Math.max(count, 1));
  const body = Array.from({ length: count }, (_, i) =>
    box(LEFT + i * w, 34, w, 30, size, 0),
  ).join("");
  return wrap(
    Math.max(count * w + 2 * LEFT, 200),
    76,
    `${bracket(LEFT, LEFT + count * w, 26, total)}${body}`,
  );
}

/** One box, and under it a row of `count` boxes of the same size with a question over the row. */
export function timesBoxes(size: number, count: number): string {
  const w = Math.min(44, WIDTH / Math.max(count, 1));
  const row = Array.from({ length: count }, (_, i) =>
    box(LEFT + i * w, 44, w, 28, size, 1),
  ).join("");
  return wrap(
    Math.max(count * w + 2 * LEFT, 200),
    104,
    `${box(LEFT, 8, w, 28, size, 0)}${row}${bracket(LEFT, LEFT + count * w, 92, "?", false)}`,
  );
}

/** The water level graph: a first level and four rises. */
const levels = (v: number[]): number[] =>
  [n(v, 2), n(v, 3), n(v, 4), n(v, 5)].reduce<number[]>(
    (out, r) => [...out, (out[out.length - 1] ?? 0) + r],
    [n(v, 1)],
  );

/** The finish of a lesson that starts at `h:m` and lasts `dh` hours and `dm` minutes, with the carried hour. */
const finish = (v: number[]): [number, number] => [
  n(v, 0) + n(v, 2) + 1,
  n(v, 1) + n(v, 3) - 60,
];

export const PICTURES_T: Readonly<Record<string, Draw>> = {
  "T1.one-step.01": (v) => partsStrip([n(v, 0), n(v, 1)], "?"),
  "T1.one-step.02": (v) => partsStrip([n(v, 1), "?"], n(v, 0)),
  "T1.one-step.03": (v) =>
    compareStrips(n(v, 0), n(v, 0) + n(v, 1), n(v, 0), "?", n(v, 1)),
  "T1.one-step.04": (v) =>
    compareStrips(n(v, 0), n(v, 0) - n(v, 1), n(v, 0), "?", n(v, 1)),
  "T1.one-step.05": (v) =>
    compareStrips(n(v, 0), n(v, 1), n(v, 0), n(v, 1), "?"),
  "T1.one-step.06": (v) => equalBoxes(n(v, 0), n(v, 1), "?"),
  "T1.one-step.09": (v) => timesBoxes(n(v, 0), n(v, 1)),
  "T1.one-step.11": (v) => equalBoxes(n(v, 1), n(v, 0), "?"),
  "T1.one-step.12": (v) => partsStrip([n(v, 1), "?"], n(v, 0)),
  "T1.one-step.13": (v) => partsStrip([n(v, 0), "?"], n(v, 1)),
  "T1.one-step.14": (v) => partsStrip([n(v, 0), n(v, 1)], "?"),
  "T1.one-step.20": (v) => equalBoxes(n(v, 1), "?", n(v, 0) * n(v, 1)),
  "T2.two-step.10": (v) => partsStrip([n(v, 1), n(v, 2), "?"], n(v, 0)),
  "T2.two-step.18": (v) => {
    const [h, m] = finish(v);
    return gallery([clock(n(v, 0), n(v, 1)), clock(h, m)]);
  },
  "T2.two-step.20": (v) => bars([n(v, 0) + 2 * n(v, 1), n(v, 0)]),
  "T2.two-step.21": (v) => lineGraph(levels(v)),
  "T3.three-step.17": (v) => clock(n(v, 0), n(v, 1)),
  "T4.four-step.13": (v) => bars([n(v, 0), n(v, 1), n(v, 2)]),
  "T4.four-step.20": (v) => pie([n(v, 1), n(v, 2)]),
};
