// The pictures of domain G added after the first table in `pictures.ts`, by template id; one here replaces one there.
// The drawers below are for tasks that no drawer of `svg.ts` fits. They follow its style: one self-contained SVG
// with no script, colours that read on a light and on a dark page, and no number that the task asks for.
import { RATIOS } from "./g1.js";
import { GRID_PATHS as LEGS } from "./g2.js";
import { type Cell, CUBE_NETS, netChoices, permutation } from "./g3.js";
import type { Draw } from "./pictures.js";
import {
  angle,
  block,
  figures,
  fig,
  gallery,
  polygon,
  triangle,
  clock,
  grid,
  cube,
  columns,
  plan,
  compass,
  scaleBar,
  rectangle,
} from "./svg.js";

const COLOURS = [
  "#4f8ef7",
  "#f59e42",
  "#4caf70",
  "#e5534b",
  "#a66bd9",
  "#e0b83a",
] as const;
const colour = (i: number): string => COLOURS[i % COLOURS.length] ?? "#4f8ef7";
const tint = (i: number, o = 0.3): string =>
  `fill="${colour(i)}" fill-opacity="${o}"`;
const num = (x: number): string => String(Math.round(x * 100) / 100);
const n = (v: number[], i: number): number => v[i] ?? 0;

const wrap = (w: number, h: number, body: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${num(w)} ${num(h)}" role="img" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">${body}</svg>`;
const text = (x: number, y: number, t: string | number, size = 11): string =>
  `<text x="${num(x)}" y="${num(y)}" font-size="${size}" text-anchor="middle" fill="currentColor" stroke="none">${t}</text>`;
const seg = (x1: number, y1: number, x2: number, y2: number): string =>
  `<line x1="${num(x1)}" y1="${num(y1)}" x2="${num(x2)}" y2="${num(y2)}"/>`;
const dashed = (x1: number, y1: number, x2: number, y2: number): string =>
  seg(x1, y1, x2, y2).replace("/>", ' stroke-dasharray="4 3"/>');
const dot = (x: number, y: number, r = 3, fill = "currentColor"): string =>
  `<circle cx="${num(x)}" cy="${num(y)}" r="${r}" fill="${fill}"/>`;
const poly = (pts: readonly (readonly [number, number])[], fill = ""): string =>
  `<polygon points="${pts.map(([x, y]) => `${num(x)},${num(y)}`).join(" ")}" ${fill}/>`;

/** A triangle with `k` segments from its top vertex to points of its base. */
function fan(k: number): string {
  const w = 180;
  const h = 110;
  const top: [number, number] = [90, 12];
  const left: [number, number] = [10, 12 + h];
  const right: [number, number] = [10 + w, 12 + h];
  const cuts = Array.from({ length: k }, (_, i) =>
    seg(top[0], top[1], 10 + ((i + 1) * w) / (k + 1), 12 + h),
  ).join("");
  return wrap(w + 20, h + 24, poly([top, left, right], tint(0, 0.18)) + cuts);
}

/** `count` equal rectangles in a row; the first one carries its two sides. */
function rectangles(count: number, a: number, b: number): string {
  const k = Math.min(70 / b, 90 / a, 40 / Math.min(a, b) + 8);
  const w = a * k;
  const h = b * k;
  const gap = 12;
  const left = 28;
  const rects = Array.from(
    { length: count },
    (_, i) =>
      `<rect x="${num(left + i * (w + gap))}" y="12" width="${num(w)}" height="${num(h)}" ${tint(i)}/>`,
  ).join("");
  return wrap(
    left + count * (w + gap) + 8,
    h + 36,
    rects + text(left + w / 2, h + 28, a) + text(14, 12 + h / 2 + 4, b),
  );
}

/** A square of side `a` cut by one dashed line parallel to a side. */
function cutSquare(a: number): string {
  return fig(
    [
      [
        [
          [0, 0],
          [a, 0],
          [a, a],
          [0, a],
        ],
      ],
    ],
    {
      dashed: [[a / 3, 0, a / 3, a]],
      labels: [{ x: a / 2, y: -a * 0.14, t: a }],
    },
  );
}

const rad = (deg: number): number => (deg * Math.PI) / 180;

/** An angle of `total` degrees with one more ray inside it at `part`; the texts stand in the two parts. */
function angleSplit(
  total: number,
  part: number,
  names: readonly [string | number, string | number],
): string {
  const len = 90;
  const xs = [0, part, total].map((a) => len * Math.cos(rad(a)));
  const ys = [0, part, total].map((a) => len * Math.sin(rad(a)));
  const ox = 14 - Math.min(0, ...xs);
  const oy = 14 + Math.max(...ys);
  const ray = (a: number): string =>
    seg(ox, oy, ox + len * Math.cos(rad(a)), oy - len * Math.sin(rad(a)));
  const at = (a: number): [number, number] => [
    ox + 42 * Math.cos(rad(a)),
    oy - 42 * Math.sin(rad(a)) + 4,
  ];
  const [x1, y1] = at(part / 2);
  const [x2, y2] = at((part + total) / 2);
  return wrap(
    ox + Math.max(0, ...xs) + 14,
    oy + 14,
    ray(0) +
      ray(part) +
      ray(total) +
      dot(ox, oy, 2) +
      text(x1, y1, names[0]) +
      text(x2, y2, names[1]),
  );
}

/** Two crossing lines; the two vertical angles of `deg` degrees are shaded and not written. */
function crossing(deg: number): string {
  const c = 70;
  const r = 56;
  const wedge = (from: number): string => {
    const [x0, y0] = [c + r * Math.cos(rad(from)), c - r * Math.sin(rad(from))];
    const [x1, y1] = [
      c + r * Math.cos(rad(from + deg)),
      c - r * Math.sin(rad(from + deg)),
    ];
    return `<path d="M${c},${c} L${num(x0)},${num(y0)} A${r},${r} 0 ${deg > 180 ? 1 : 0} 0 ${num(x1)},${num(y1)} Z" ${tint(1, 0.4)}/>`;
  };
  return wrap(
    140,
    140,
    wedge(0) +
      wedge(180) +
      seg(c - r, c, c + r, c) +
      seg(
        c - r * Math.cos(rad(deg)),
        c + r * Math.sin(rad(deg)),
        c + r * Math.cos(rad(deg)),
        c - r * Math.sin(rad(deg)),
      ) +
      dot(c, c, 2),
  );
}

/** A dial with a bold arrow at the top: the starting position of a hand. */
function dial(): string {
  const c = 70;
  const r = 52;
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6;
    return seg(
      c + (r - 6) * Math.sin(a),
      c - (r - 6) * Math.cos(a),
      c + r * Math.sin(a),
      c - r * Math.cos(a),
    );
  }).join("");
  return wrap(
    140,
    140,
    `<circle cx="${c}" cy="${c}" r="${r}" ${tint(0, 0.1)}/>${ticks}` +
      `<g stroke="${colour(3)}" stroke-width="3">${seg(c, c, c, c - r + 10)}${seg(c, c - r + 10, c - 5, c - r + 20)}${seg(c, c - r + 10, c + 5, c - r + 20)}</g>${dot(c, c, 3)}`,
  );
}

/** A protractor with scales every 30 degrees and ticks every 10; one ray stands at `deg` and is not written. */
function protractor(deg: number): string {
  const c = 110;
  const r = 100;
  const at = (a: number, k: number): [number, number] => [
    c + k * Math.cos(rad(a)),
    c - k * Math.sin(rad(a)),
  ];
  let body = `<path d="M${c - r},${c} A${r},${r} 0 0 1 ${c + r},${c} Z" ${tint(5, 0.15)}/>${seg(c - r - 6, c, c + r + 6, c)}`;
  for (let a = 0; a <= 180; a += 10) {
    const long = a % 30 === 0;
    const [x0, y0] = at(a, r);
    const [x1, y1] = at(a, r - (long ? 12 : 6));
    body += seg(x0, y0, x1, y1);
    if (long) {
      const [ox, oy] = at(a, r - 21);
      const [ix, iy] = at(a, r - 36);
      body += text(ox, oy + 3, a, 9) + text(ix, iy + 3, 180 - a, 9);
    }
  }
  const [ex, ey] = at(deg, r + 4);
  body += `<g stroke="${colour(3)}" stroke-width="2.5">${seg(c, c, ex, ey)}</g>${dot(c, c, 2.5)}`;
  return wrap(2 * r + 20, r + 16, body);
}

const pts = (...xy: [number, number, string?][]) =>
  xy.map(([x, y, t]) => (t === undefined ? { x, y } : { x, y, text: t }));

/** `a` isosceles, `b` equilateral and `c` scalene triangles in rows of six, none of them marked. */
function triangleKinds(a: number, b: number, c: number): string {
  const kinds = [
    ...Array<number>(a).fill(0),
    ...Array<number>(b).fill(1),
    ...Array<number>(c).fill(2),
  ];
  const w = 40;
  const body = kinds
    .map((k, i) => {
      const x = 10 + (i % 6) * (w + 12);
      const y = 10 + Math.floor(i / 6) * 58;
      const apex: [number, number] =
        k === 0 ? [x + w / 2, y] : k === 1 ? [x + w / 2, y + 6] : [x + 6, y];
      return poly(
        [apex, [x, y + 46], [x + w, y + 46]],
        tint(k === 0 ? 0 : k === 1 ? 2 : 1, 0.4),
      );
    })
    .join("");
  return wrap(
    Math.min(kinds.length, 6) * (w + 12) + 12,
    Math.ceil(kinds.length / 6) * 58 + 12,
    body,
  );
}

/** A sheet of paper with one punched hole. */
function sheetWithHole(): string {
  return wrap(
    150,
    90,
    `<rect x="10" y="10" width="130" height="70" ${tint(0, 0.15)}/>${dot(50, 42, 4)}`,
  );
}

/** A card whose face is not symmetric: a triangle in one corner and a dot in another. */
function card(): string {
  return wrap(
    120,
    90,
    `<rect x="10" y="10" width="100" height="70" ${tint(5, 0.2)}/>${poly(
      [
        [10, 10],
        [50, 10],
        [10, 40],
      ],
      tint(3, 0.5),
    )}${dot(92, 64, 5, colour(0))}`,
  );
}

/** A rectangle and its mirror image side by side, the mirror line dashed; only the two sides are written. */
function mirrored(a: number, b: number): string {
  return fig(
    [
      [
        [
          [0, 0],
          [a, 0],
          [a, b],
          [0, b],
        ],
      ],
      [
        [
          [a, 0],
          [2 * a, 0],
          [2 * a, b],
          [a, b],
        ],
      ],
    ],
    {
      dashed: [[a, -b * 0.12, a, b * 1.12]],
      labels: [
        { x: a / 2, y: -b * 0.12 - 0.15, t: a },
        { x: -0.2 - a * 0.06, y: b / 2, t: b },
      ],
    },
  );
}

/** A row of `n` empty cells with a dashed vertical axis through the middle. */
function strip(n: number): string {
  const s = 28;
  const width = Math.max(n * s + 20, 170);
  const x0 = (width - n * s) / 2;
  const cells = Array.from(
    { length: n },
    (_, i) =>
      `<rect x="${num(x0 + i * s)}" y="14" width="${s}" height="${s}" ${tint(0, 0.12)}/>`,
  ).join("");
  return wrap(width, s + 38, cells + dashed(width / 2, 6, width / 2, s + 22));
}

const SPOTS: Readonly<Record<number, readonly (readonly [number, number])[]>> =
  {
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

/** A net of squares; `dots` puts a die face of that many dots on each square, in the order of the cells. */
function netSvg(cells: readonly Cell[], dots: readonly number[] = []): string {
  const s = 30;
  const w = Math.max(...cells.map((c) => c[0])) + 1;
  const h = Math.max(...cells.map((c) => c[1])) + 1;
  const body = cells
    .map(([x, y], i) => {
      const x0 = 10 + x * s;
      const y0 = 10 + y * s;
      const spots = (SPOTS[dots[i] ?? 0] ?? [])
        .map(([cx, cy]) =>
          dot(x0 + (cx + 1) * (s / 4), y0 + (cy + 1) * (s / 4), 2.6),
        )
        .join("");
      return `<rect x="${x0}" y="${y0}" width="${s}" height="${s}" ${tint(0, 0.18)}/>${spots}`;
    })
    .join("");
  return wrap(w * s + 20, h * s + 20, body);
}

/** Several nets side by side on one scale, each under its number. */
function netsRow(nets: readonly (readonly Cell[])[]): string {
  const s = 15;
  const slot = 6 * s + 18;
  const body = nets
    .map((cells, i) => {
      const squares = cells
        .map(
          ([x, y]) =>
            `<rect x="${10 + i * slot + x * s}" y="${10 + y * s}" width="${s}" height="${s}" ${tint(0, 0.18)}/>`,
        )
        .join("");
      return squares + text(10 + i * slot + 3 * s, 10 + 5 * s + 20, i + 1, 13);
    })
    .join("");
  return wrap(nets.length * slot + 16, 5 * s + 36, body);
}

/** A map in squares, columns lettered from A and rows numbered from 1; nothing on it is marked. */
function lettered(cols: number, rows: number): string {
  const s = 30;
  let body = "";
  for (let i = 0; i < cols; i += 1)
    for (let j = 0; j < rows; j += 1)
      body += `<rect x="${24 + i * s}" y="${10 + (rows - 1 - j) * s}" width="${s}" height="${s}" ${tint(2, 0.12)}/>`;
  for (let i = 0; i < cols; i += 1)
    body += text(
      24 + i * s + s / 2,
      10 + rows * s + 16,
      String.fromCharCode(65 + i),
      13,
    );
  for (let j = 0; j < rows; j += 1)
    body += text(12, 10 + (rows - 1 - j) * s + s / 2 + 5, j + 1, 13);
  return wrap(24 + cols * s + 12, rows * s + 30, body);
}

export const PICTURES_G: Readonly<Record<string, Draw>> = {
  // G7: plans
  "G7.plan.11": (_v, l) => compass(l.compass),
  "G7.plan.12": (_v, l) => compass(l.compass),
  "G7.plan.13": () => grid(10, 10, pts([5, 5]), [], false),
  "G7.plan-1S.11": (v) => scaleBar(n(v, 1)),
  "G7.plan-1S.12": (v) => scaleBar(n(v, 2)),
  "G7.plan-1S.13": (v) => scaleBar(n(v, 1)),
  "G7.plan-1S.07": (v) => rectangle(n(v, 1), n(v, 2)),
  // G6: views and blocks
  "G6.views.11": (v) => columns([n(v, 0), n(v, 1), n(v, 2)]),
  "G6.views.12": (v) =>
    plan([
      [n(v, 0), n(v, 1)],
      [n(v, 2), n(v, 3)],
    ]),
  "G6.views.13": (v) =>
    gallery([
      columns([n(v, 0), n(v, 1), n(v, 2)]),
      columns([n(v, 3), n(v, 4), n(v, 5)]),
    ]),
  "G6.blocks.11": (v) =>
    plan([
      [n(v, 0), n(v, 1)],
      [n(v, 2), n(v, 3)],
    ]),
  "G6.blocks.12": (v) =>
    columns(Array.from({ length: n(v, 0) }, (_, i) => 1 + i * n(v, 1))),
  "G6.blocks.13": (v) => cube(n(v, 0)),
  // G5: solids and nets
  "G5.solids-nets.14": (v) => netsRow(netChoices(v).nets),
  "G5.solids-nets.15": (v) =>
    netSvg(CUBE_NETS[n(v, 0)] ?? [], permutation(n(v, 1))),
  "G5.solids-nets.16": (v) => cube(n(v, 0)),
  "G5.solids-nets.17": (v) => cube(n(v, 0)),
  "G5.solids-nets.18": () =>
    gallery([polygon(3, false), polygon(4, false), polygon(5, false)]),
  "G5.solids-nets.19": () => cube(1),
  // G4: coordinates
  "G4.coordinates.18": () => lettered(5, 5),
  "G4.coordinates.12": (v) => grid(10, 8, pts([n(v, 0), n(v, 1), "P"])),
  "G4.coordinates.13": (v) =>
    grid(n(v, 2) + 1, n(v, 3) + 1, pts([n(v, 0), n(v, 1)], [n(v, 2), n(v, 3)])),
  "G4.coordinates.14": (v) => {
    const [u, w] = LEGS[n(v, 0)] ?? [2, 2];
    return grid(u, w, pts([0, 0], [u, w]));
  },
  "G4.coordinates.15": () => grid(6, 6, pts([3, 3])),
  "G4.coordinates.16": (v) =>
    grid(
      n(v, 2) + 1,
      n(v, 3) + 1,
      pts([n(v, 0), n(v, 1)], [n(v, 2), n(v, 1)], [n(v, 2), n(v, 3)]),
      [
        [n(v, 0), n(v, 1), n(v, 2), n(v, 1)],
        [n(v, 2), n(v, 1), n(v, 2), n(v, 3)],
        [n(v, 2), n(v, 3), n(v, 0), n(v, 1)],
      ],
    ),
  "G4.coordinates.17": (v) => grid(n(v, 0), n(v, 0)),
  // G3: symmetry
  "G3.symmetry.01": (v) => polygon(n(v, 0), false),
  "G3.symmetry.03": (v) =>
    grid(2 * n(v, 2), 7, pts([n(v, 0), n(v, 1)]), [[n(v, 2), 0, n(v, 2), 7]]),
  "G3.symmetry.08": (v) => rectangles(n(v, 2), n(v, 0), n(v, 1)),
  "G3.symmetry.09": (v) => triangleKinds(n(v, 0), n(v, 1), n(v, 2)),
  "G3.symmetry.10": () => sheetWithHole(),
  "G3.symmetry.11": () => card(),
  "G3.symmetry.12": (v) =>
    figures([
      ...Array<"square">(n(v, 0)).fill("square"),
      ...Array<"rectangle">(n(v, 1)).fill("rectangle"),
    ]),
  "G3.symmetry.13": (v) => clock(n(v, 0), n(v, 1)),
  "G3.symmetry.14": (v) => mirrored(n(v, 0), n(v, 1)),
  "G3.symmetry.15": (v) => strip(n(v, 0)),
  "G3.symmetry.16": (v) => strip(n(v, 0)),
  "G3.symmetry.17": (v) =>
    grid(
      Math.max(n(v, 0), n(v, 2)) + 1,
      Math.max(n(v, 1), n(v, 3)) + 1,
      pts([n(v, 0), n(v, 1), "A"], [n(v, 2), n(v, 3), "B"]),
    ),
  "G3.symmetry.18": (v) =>
    grid(8, 2 * n(v, 2), pts([n(v, 0), n(v, 1)]), [[0, n(v, 2), 8, n(v, 2)]]),
  // G2: angles
  "G2.angles.02": (v) => angleSplit(180, n(v, 0), [n(v, 0), "?"]),
  "G2.angles.03": (v) => angleSplit(90, n(v, 0), [n(v, 0), "?"]),
  "G2.angles.15": (v) => angle(n(v, 0)),
  "G2.angles.16": (v) => protractor(n(v, 0)),
  "G2.angles.17": (v) => clock(n(v, 0), 30),
  "G2.angles.18": (v) => {
    const [u = 1, w = 1, t = 1] = RATIOS[n(v, 0)] ?? [];
    const k = 180 / (u + w + t);
    return triangle(u * k, w * k, [u, w, t]);
  },
  "G2.angles.19": (v) => crossing(n(v, 0) / 2),
  "G2.angles.20": (v) => angleSplit(180, (180 - n(v, 0)) / 2, ["", ""]),
  "G2.angles.21": () => dial(),
  // G1: shapes
  "G1.shapes.06": (v) => rectangles(n(v, 2), n(v, 0), n(v, 1)),
  "G1.shapes.10": () =>
    gallery([
      figures(["square"]),
      figures(["triangle"]),
      figures(["circle"]),
      polygon(5, false),
    ]),
  "G1.shapes.14": (v) => fan(n(v, 0)),
  "G1.shapes.15": (v) => block(n(v, 1), n(v, 0)),
  "G1.shapes.16": (v) => polygon(n(v, 0), false),
  "G1.shapes.17": (v) => cutSquare(n(v, 0)),
  "G1.shapes.18": (v) =>
    figures([
      ...Array<"square">(n(v, 0)).fill("square"),
      ...Array<"rectangle">(n(v, 1)).fill("rectangle"),
      ...Array<"triangle">(n(v, 2)).fill("triangle"),
      ...Array<"circle">(n(v, 3)).fill("circle"),
    ]),
  "G1.shapes.19": (v) => polygon(n(v, 0), false),
};
