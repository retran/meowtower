// The pictures of domain P added after the first table in `pictures.ts`, by template id; one here replaces one there.
import type { Draw } from "./pictures.js";
import { bars, pie, scaleBar, table } from "./svg.js";

const BLUE = "#4f8ef7";
const wrap = (w: number, h: number, body: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">${body}</svg>`;
const at = (v: number[], i: number): number => v[i] ?? 0;

/** A square of 100 small squares in ten rows, the first `shaded` of them filled, row by row from the top left. */
export function hundredSquares(shaded: number): string {
  const s = 14;
  let body = "";
  for (let i = 0; i < 100; i += 1) {
    const x = 6 + (i % 10) * s;
    const y = 6 + Math.floor(i / 10) * s;
    body += `<rect x="${x}" y="${y}" width="${s}" height="${s}"${i < shaded ? ` fill="${BLUE}" fill-opacity="0.55"` : ""} stroke-opacity="0.6"/>`;
  }
  return wrap(12 + 10 * s, 12 + 10 * s, body);
}

/** `count` parts of `parts` equal parts, in as many strips of `parts` parts as they fill, from the top. */
export function fractionStrips(parts: number, count: number): string {
  const w = 200;
  const h = 26;
  const s = w / parts;
  const rows = Math.max(1, Math.ceil(count / parts));
  let body = "";
  for (let row = 0; row < rows; row += 1)
    for (let i = 0; i < parts; i += 1)
      body += `<rect x="${6 + i * s}" y="${6 + row * (h + 8)}" width="${s}" height="${h}"${row * parts + i < count ? ` fill="${BLUE}" fill-opacity="0.55"` : ""}/>`;
  return wrap(w + 12, 12 + rows * (h + 8) - 8, body);
}

/** Two rows of circles, `red` of them red above and `blue` of them blue below. */
export function counters(red: number, blue: number): string {
  const s = 15;
  const row = (count: number, y: number, colour: string): string =>
    Array.from(
      { length: count },
      (_, i) =>
        `<circle cx="${12 + i * s}" cy="${y}" r="6" fill="${colour}" fill-opacity="0.7"/>`,
    ).join("");
  return wrap(
    16 + Math.max(red, blue) * s,
    56,
    row(red, 16, "#e5534b") + row(blue, 40, BLUE),
  );
}

/** A strip of `parts` equal parts, the first `shaded` of them filled. */
export function strip(parts: number, shaded: number): string {
  const w = 240;
  const h = 34;
  const s = w / parts;
  let body = "";
  for (let i = 0; i < parts; i += 1)
    body += `<rect x="${6 + i * s}" y="6" width="${s}" height="${h}"${i < shaded ? ` fill="${BLUE}" fill-opacity="0.55"` : ""}/>`;
  return wrap(w + 12, h + 12, body);
}

export const PICTURES_P: Readonly<Record<string, Draw>> = {
  "P1.half-tenth.13": (v) => hundredSquares(10 * at(v, 0) + at(v, 1)),
  "P1.half-tenth.14": (v) => strip(at(v, 1), at(v, 0)),
  "P3.share-of.13": (v) => pie([at(v, 0), at(v, 1)]),
  "P3.share-of.16": (v) => table([[at(v, 0), at(v, 1), at(v, 2)]]),
  "P3.vat.15": (v) => table([[at(v, 0), at(v, 1), at(v, 2)]]),
  "P4.ratio.07": (v) =>
    table([
      [at(v, 0), at(v, 1)],
      ["?", at(v, 1) * at(v, 2)],
    ]),
  "P4.ratio.15": (v) => counters(at(v, 0) * at(v, 2), at(v, 1) * at(v, 2)),
  "P5.map-scale.12": (v) => scaleBar(at(v, 1)),
  "P5.map-scale-1S.09": (v) => scaleBar(at(v, 0)),
  "P6.relative.03": (v) =>
    bars([at(v, 0), at(v, 0) + (at(v, 0) * at(v, 1)) / 100]),
  "P6.relative.04": (v) =>
    bars([at(v, 0), at(v, 0) - (at(v, 0) * at(v, 1)) / 100]),
  "P7.successive.15": (v) => bars([at(v, 0), at(v, 1), at(v, 2)]),
  "P1.half-tenth.08": (v) => fractionStrips(4, at(v, 0)),
  "P1.half-tenth.09": (v) => fractionStrips(10, at(v, 0)),
  "P1.half-tenth.10": (v) => fractionStrips(5, at(v, 0)),
  "P4.ratio.03": (v) => strip(at(v, 0) + at(v, 1), at(v, 0)),
  "P4.ratio.09": (v) => strip(at(v, 0) + 1, at(v, 0)),
  "P4.ratio.11": (v) => strip(at(v, 0) + at(v, 1), at(v, 0)),
  "P2.percent-of.15": (v) => strip(10, at(v, 0) / 10),
};
