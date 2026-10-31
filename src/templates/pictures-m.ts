// The pictures of domain M added after the first table in `pictures.ts`, by template id; one here replaces one there.
import type { Draw } from "./pictures.js";
import { levelOf } from "./m4.js";
import { equalArea } from "./m2.js";
import {
  based,
  circle,
  clock,
  cuboid,
  fig,
  gallery,
  lineGraph,
  notched,
  sized,
  type Ring,
} from "./svg.js";

const n = (v: number[], i: number): number => v[i] ?? 0;

/** The frame of a picture, drawn like the pictures of `svg.ts`: one self-contained SVG with no script and no link. */
const wrap = (w: number, h: number, body: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round">${body}</svg>`;

/** A page of a calendar: seven columns of dates, four rows, and a block of 2 by 2 dates marked; no date is written. */
function calendarBlock(): string {
  const s = 24;
  const cells = Array.from({ length: 28 }, (_, i) => {
    const [col, row] = [i % 7, Math.floor(i / 7)];
    const marked = col >= 2 && col <= 3 && row >= 1 && row <= 2;
    const fill = marked ? ` fill="#f59e42" fill-opacity="0.45"` : "";
    return `<rect x="${10 + col * s}" y="${10 + row * s}" width="${s}" height="${s}"${fill} stroke-opacity="${marked ? 1 : 0.4}"/>`;
  }).join("");
  return wrap(7 * s + 20, 4 * s + 20, cells);
}

/** A rectangle of `w` by `h` with its lower left corner at `x`, `y`. */
const box = (x: number, y: number, w: number, h: number): Ring => [
  [x, y],
  [x + w, y],
  [x + w, y + h],
  [x, y + h],
];

/** A rectangle of a fixed shape with one side written and the other asked: the picture never shows the answer by its proportions. */
const askedSide = (known: number): string => sized(3, 2, [known, "?"]);

/** Squares in a chain that bends at every step, each touching the previous one by a side. */
const chain = (cells: number): string =>
  fig([
    Array.from({ length: cells }, (_, i) =>
      box(Math.ceil(i / 2), Math.floor(i / 2), 1, 1),
    ),
  ]);

/** Two figures of the same kind side by side, as a rectangle and a square. */
const wall = (w: number, h: number): string =>
  fig([[box(0, 0, w, h)], [box(-0.3, h, w + 0.6, 0.45)]], {
    labels: [
      { x: w / 2, y: -h * 0.12 - 0.15, t: w },
      { x: w + w * 0.1 + 0.2, y: h / 2, t: h },
    ],
  });

/** Whole cells as squares and half cells as triangles, laid out in rows of six, as a figure on squared paper. */
const cellFigure = (whole: number, halves: number): string => {
  const cols = 6;
  const rows = Math.ceil((whole + halves) / cols);
  const place = (i: number): [number, number] => [
    i % cols,
    rows - 1 - Math.floor(i / cols),
  ];
  const squares = Array.from({ length: whole }, (_, i) => {
    const [x, y] = place(i);
    return box(x, y, 1, 1);
  });
  const triangles = Array.from({ length: halves }, (_, i) => {
    const [x, y] = place(whole + i);
    return [
      [x, y],
      [x + 1, y],
      [x, y + 1],
    ] as Ring;
  });
  return fig(
    [squares, triangles].filter((shape) => shape.length > 0),
    {
      grid: false,
    },
  );
};

/** A chessboard of `cols` by `rows` cells with the corner cells dark. */
function chessboard(cols: number, rows: number): string {
  const s = 22;
  const cells = Array.from({ length: cols * rows }, (_, i) => {
    const [col, row] = [i % cols, Math.floor(i / cols)];
    const dark = (col + row) % 2 === 0;
    return `<rect x="${10 + col * s}" y="${10 + row * s}" width="${s}" height="${s}"${dark ? ` fill="currentColor" fill-opacity="0.65"` : ""}/>`;
  }).join("");
  return wrap(cols * s + 20, rows * s + 20, cells);
}

/** A square with the circle that touches all four of its sides, no number written. */
const squareAroundCircle = (): string =>
  wrap(
    140,
    140,
    `<rect x="20" y="20" width="100" height="100" fill="#f59e42" fill-opacity="0.3"/><circle cx="70" cy="70" r="50" fill="#4f8ef7" fill-opacity="0.35"/>`,
  );

/** Two touching round pipes seen from the end, with a rope pulled tight round both. */
const ropeAroundPipes = (): string =>
  wrap(
    150,
    120,
    `<circle cx="45" cy="60" r="30" fill="#4f8ef7" fill-opacity="0.35"/><circle cx="105" cy="60" r="30" fill="#4f8ef7" fill-opacity="0.35"/><path d="M45,30 L105,30 A30,30 0 0 1 105,90 L45,90 A30,30 0 0 1 45,30 Z" stroke="#e5534b" stroke-width="2.5"/>`,
  );

/** A text on a picture, drawn like the labels of `svg.ts`. */
const note = (x: number, y: number, t: string | number, size = 10): string =>
  `<text x="${x}" y="${y}" font-size="${size}" text-anchor="middle" fill="currentColor" stroke="none">${t}</text>`;

/**
 * A tube with a scale from `lo` to `hi`: a mark every `step`, the marks at multiples of `major` written, and a column of
 * liquid that rises to `value`. A jug, a rain gauge and a thermometer are all drawn this way.
 */
function scale(
  lo: number,
  hi: number,
  step: number,
  major: number,
  value: number,
  colour = "#4f8ef7",
): string {
  const [bottom, top] = [125, 15];
  const y = (v: number): number =>
    bottom - ((v - lo) / (hi - lo)) * (bottom - top);
  const ticks = Array.from(
    { length: Math.floor((hi - lo) / step) + 1 },
    (_, i) => lo + i * step,
  )
    .map((v) => {
      const long = major > 0 && v % major === 0;
      return `<line x1="60" y1="${y(v)}" x2="${long ? 74 : 68}" y2="${y(v)}"/>${long ? note(88, y(v) + 3, v) : ""}`;
    })
    .join("");
  return wrap(
    110,
    140,
    `<rect x="40" y="${top - 4}" width="20" height="${bottom - top + 8}" rx="4" stroke-opacity="0.6"/><rect x="44" y="${y(value)}" width="12" height="${bottom - y(value)}" fill="${colour}" fill-opacity="0.6" stroke="none"/>${ticks}`,
  );
}

/** A dial with `ticks` equal steps from the left end to the right end; the pointer stands `pos` steps from the left. */
function dial(
  ticks: number,
  pos: number,
  ends: readonly [string | number, string | number],
): string {
  const [cx, cy, r] = [70, 80, 56];
  const at = (k: number, len: number): [number, number] => {
    const a = Math.PI - (k * Math.PI) / ticks;
    return [cx + len * Math.cos(a), cy - len * Math.sin(a)];
  };
  const marks = Array.from({ length: ticks + 1 }, (_, k) => {
    const [x1, y1] = at(k, r);
    const [x2, y2] = at(k, r - 9);
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
  }).join("");
  const [px, py] = at(pos, r - 14);
  return wrap(
    140,
    100,
    `<path d="M${cx - r},${cy} A${r},${r} 0 0 1 ${cx + r},${cy}" stroke-opacity="0.6"/>${marks}<line x1="${cx}" y1="${cy}" x2="${px.toFixed(1)}" y2="${py.toFixed(1)}" stroke="#e5534b" stroke-width="2.5"/><circle cx="${cx}" cy="${cy}" r="3" fill="currentColor"/>${note(cx - r + 4, cy + 14, ends[0])}${note(cx + r - 4, cy + 14, ends[1])}`,
  );
}

/** A balance in equilibrium: the weights lying on the left pan and on the right pan, each as a labelled block. */
function balance(
  left: readonly (string | number)[],
  right: readonly (string | number)[],
): string {
  const pan = (cx: number, items: readonly (string | number)[]): string =>
    `<line x1="${cx - 28}" y1="90" x2="${cx + 28}" y2="90"/>` +
    items
      .map(
        (t, i) =>
          `<rect x="${cx - 12 + (i % 2) * 0}" y="${72 - i * 18}" width="24" height="16" fill="#f59e42" fill-opacity="0.4"/>${note(cx, 84 - i * 18, t, 10)}`,
      )
      .join("");
  return wrap(
    200,
    120,
    `<path d="M100,112 L84,112 M100,112 L116,112 M100,112 L100,34"/><line x1="40" y1="34" x2="160" y2="34"/>${pan(55, left)}${pan(145, right)}<line x1="40" y1="34" x2="40" y2="90" stroke-opacity="0.4"/><line x1="160" y1="34" x2="160" y2="90" stroke-opacity="0.4"/>`,
  );
}

export const PICTURES_M: Readonly<Record<string, Draw>> = {
  "M2.clock.08": (v) => clock(n(v, 0), n(v, 1)),
  "M2.clock.11": (v) => clock(n(v, 0), n(v, 1)),
  "M2.clock.12": (v) => clock(n(v, 0), n(v, 1)),
  "M2.clock.13": (v) => clock(n(v, 0), n(v, 1)),
  "M2.clock.14": (v) => clock(n(v, 0), n(v, 1)),
  "M2.clock.15": (v) => clock(n(v, 0), n(v, 1)),
  "M2.clock.19": (v) => clock(n(v, 0), n(v, 1)),
  "M2.calendar.17": () => calendarBlock(),
  // M5: the area of rectangles and of other figures
  "M5.grid.01": (v) => cellFigure(n(v, 0), n(v, 1) / 2),
  "M5.grid.12": (v) => cellFigure(n(v, 0), 0),
  "M5.grid.13": (v) =>
    fig([
      [box(0, 0, n(v, 0), n(v, 1))],
      [box(n(v, 0) - n(v, 4), n(v, 1) - n(v, 5), n(v, 2), n(v, 3))],
    ]),
  "M5.grid.14": (v) => chessboard(n(v, 0), n(v, 1)),
  "M5.sides.12": (v) => {
    const [w, k, len] = [n(v, 0), n(v, 1), n(v, 2)];
    return fig([[box(0, 0, w * k, len)]], {
      dashed: Array.from({ length: k - 1 }, (_, i) => [
        (i + 1) * w,
        0,
        (i + 1) * w,
        len,
      ]),
      labels: [
        { x: (w * k) / 2, y: -len * 0.12 - 0.15, t: w * k },
        { x: w * k * 1.1 + 0.2, y: len / 2, t: len },
      ],
    });
  },
  "M5.sides.13": (v) => sized(n(v, 0), n(v, 1)),
  "M5.sides.14": (v) => sized(n(v, 0), n(v, 1)),
  "M5.sides.15": (v) =>
    sized(n(v, 0) * n(v, 1), n(v, 0) * n(v, 2), [
      n(v, 0) * n(v, 1),
      n(v, 0) * n(v, 2),
    ]),
  "M5.formula.12": () => fig([[box(0, 0, 2, 2)]], { dashed: [[1, 0, 1, 2]] }),
  "M5.formula.13": (v) => sized(n(v, 1), n(v, 0), ["?", "?"]),
  "M5.formula.14": (v) =>
    fig([[box(0, 0, 3, 2)], [box(3, 0, 0.8, 2)]], {
      labels: [{ x: 3.4, y: -0.4, t: n(v, 0) }],
    }),
  // M13: instruments
  "M13.instruments.03": (v) => scale(0, 300, 50, 0, 50 * n(v, 0)),
  "M13.instruments.04": (v) => dial(10, n(v, 0) + 0.5, [0, "1000"]),
  "M13.instruments.09": (v) => dial(12, n(v, 0), [0, 120]),
  "M13.instruments.11": (v) => scale(0, 20, 2, 0, 2 * n(v, 0)),
  "M13.instruments.12": (v) => balance([n(v, 0)], ["?", n(v, 1)]),
  "M13.instruments.13": () => balance(["•••"], ["•••"]),
  "M13.instruments.14": (v) =>
    scale(0, 300, 100 / n(v, 1), 100, n(v, 0) + (n(v, 2) * 100) / n(v, 1)),
  "M13.instruments.15": (v) =>
    scale(-20, 40, 2, 10, n(v, 0) + 2 * n(v, 1), "#e5534b"),
  // M11: the circle
  "M11.circle.13": (v) => circle("semicircle", n(v, 0)),
  "M11.circle.14": (v) => circle("semicircle", n(v, 0)),
  "M11.circle.15": () => squareAroundCircle(),
  "M11.circle.16": () => ropeAroundPipes(),
  "M11.circle.17": (v) => circle("radius", n(v, 0)),
  // M10: capacity
  "M10.capacity-1S.14": (v) => {
    const [e, b, c] = levelOf(n(v, 0));
    return gallery([
      cuboid(e, e, e, false, ["", "", ""]),
      cuboid(b, c, 4, false, ["", "", "?"]),
    ]);
  },
  // M8: speed
  "M8.speed.14": (v) => lineGraph([0, 2 * n(v, 0), 4 * n(v, 0)], [0, 2, 4]),
  "M8.speed.16": (v) =>
    wrap(
      200,
      90,
      `<rect x="10" y="50" width="180" height="8" fill="#a66bd9" fill-opacity="0.4"/><rect x="10" y="30" width="50" height="20" fill="#4f8ef7" fill-opacity="0.45"/>${note(35, 24, n(v, 1))}${note(100, 78, n(v, 2))}<line x1="64" y1="40" x2="82" y2="40"/>`,
    ),
  // M7: volume
  "M7.by-cubes.11": (v) =>
    gallery([
      cuboid(n(v, 0), n(v, 1), n(v, 2), true),
      cuboid(n(v, 3), n(v, 4), n(v, 5), true),
    ]),
  "M7.by-cubes.12": (v) => cuboid(n(v, 0), n(v, 0), n(v, 0), true),
  "M7.by-cubes.13": (v) => cuboid(n(v, 0), n(v, 0), n(v, 0), true),
  "M7.by-cubes.14": (v) => cuboid(n(v, 0), n(v, 0), n(v, 0), true),
  "M7.formula.12": (v) =>
    cuboid(100 * n(v, 0), n(v, 1), n(v, 2), false, [n(v, 0), n(v, 1), n(v, 2)]),
  "M7.formula.13": () => cuboid(3, 3, 3, false, ["", "", ""]),
  "M7.formula.14": (v) => cuboid(n(v, 0), n(v, 1), n(v, 2)),
  "M7.formula.15": () => cuboid(3, 2, 2, false, ["", "", ""]),
  // M6: the area of triangles
  "M6.triangle.03": (v) => based(4, 3, false, [n(v, 1), "?"]),
  "M6.triangle.08": (v) => based(4, 3, false, ["?", n(v, 1)]),
  "M6.triangle.12": (v) =>
    fig(
      [
        [box(0, 0, n(v, 0), n(v, 1))],
        [
          [
            [0, 0],
            [n(v, 0), 0],
            [n(v, 0) * 0.3, n(v, 1)],
          ],
        ],
      ],
      {
        labels: [
          { x: n(v, 0) / 2, y: -n(v, 1) * 0.12 - 0.15, t: n(v, 0) },
          { x: n(v, 0) * 1.1 + 0.2, y: n(v, 1) / 2, t: n(v, 1) },
        ],
      },
    ),
  "M6.triangle.13": (v) => {
    const [s, t] = [n(v, 0), n(v, 1)];
    return fig(
      [
        [
          [
            [t, 0],
            [s - t, 0],
            [s, t],
            [s, s - t],
            [s - t, s],
            [t, s],
            [0, s - t],
            [0, t],
          ],
        ],
      ],
      {
        dashed: [
          [0, 0, 0, t],
          [0, 0, t, 0],
        ],
        labels: [
          { x: s / 2, y: -0.6, t: s },
          { x: t / 2 - 0.2, y: -0.55, t: t },
        ],
      },
    );
  },
  "M6.triangle.14": (v) => {
    const [a, b] = [n(v, 0), n(v, 1)];
    const apex = (a + b) * 0.35;
    const h = (a + b) * 0.7;
    return fig(
      [
        [
          [
            [0, 0],
            [a + b, 0],
            [apex, h],
          ],
        ],
      ],
      {
        dashed: [[apex, h, a, 0]],
        labels: [
          { x: apex, y: h + 0.5, t: "A" },
          { x: -0.3, y: -0.6, t: "B" },
          { x: a, y: -0.6, t: "D" },
          { x: a + b + 0.3, y: -0.6, t: "C" },
        ],
      },
    );
  },
  "M6.triangle.15": (v) => {
    const a = n(v, 0);
    return fig(
      [
        [box(0, 0, a, a)],
        [
          [
            [a, a],
            [a / 2, 0],
            [0, a / 2],
          ],
        ],
      ],
      {
        labels: [
          { x: -0.5, y: -0.6, t: "A" },
          { x: a + 0.5, y: -0.6, t: "B" },
          { x: a + 0.5, y: a + 0.3, t: "C" },
          { x: -0.5, y: a + 0.3, t: "D" },
          { x: a / 2, y: -0.6, t: "M" },
          { x: -0.5, y: a / 2, t: "N" },
        ],
      },
    );
  },
  // M4: rectangles, perimeters and equal areas
  "M4.rect-squares.12": (v) => chain(n(v, 0)),
  "M4.rect-squares.13": (v) =>
    notched(n(v, 0), n(v, 1), n(v, 2), n(v, 2), true),
  "M4.rect-squares.14": (v) =>
    fig([[box(0, 0, n(v, 0) + 2, n(v, 1) + 2), box(1, 1, n(v, 0), n(v, 1))]], {
      grid: true,
      labels: [
        {
          x: (n(v, 0) + 2) / 2,
          y: (n(v, 1) + 2) / 2,
          t: `${n(v, 0)}\u00d7${n(v, 1)}`,
        },
      ],
    }),
  "M4.rect-sides.04": (v) => askedSide(n(v, 0)),
  "M4.rect-sides.09": (v) => askedSide(n(v, 0)),
  "M4.rect-sides.12": (v) => sized(n(v, 0), n(v, 1)),
  "M4.rect-sides.13": (v) => sized(100 * n(v, 0), n(v, 1), [n(v, 0), n(v, 1)]),
  "M4.rect-sides.14": (v) => wall(n(v, 1), n(v, 0)),
  "M4.rect-sides.15": (v) =>
    fig([[box(0, 0, n(v, 0), n(v, 1))]], {
      dashed: [[n(v, 0) * 0.4, 0, n(v, 0) * 0.4, n(v, 1)]],
      labels: [
        { x: n(v, 0) / 2, y: -n(v, 1) * 0.12 - 0.15, t: n(v, 0) },
        { x: n(v, 0) * 1.1 + 0.2, y: n(v, 1) / 2, t: n(v, 1) },
      ],
    }),
  "M4.not-rect.12": (v) =>
    fig(
      [
        [
          [
            [0, 0],
            [n(v, 0), 0],
            [n(v, 0), n(v, 2)],
            [n(v, 2), n(v, 2)],
            [n(v, 2), n(v, 1)],
            [0, n(v, 1)],
          ],
        ],
      ],
      {
        labels: [
          { x: n(v, 0) / 2, y: -0.5, t: n(v, 0) },
          { x: -0.7, y: n(v, 1) / 2, t: n(v, 1) },
          { x: n(v, 0) * 0.6, y: n(v, 2) / 2 - 0.15, t: n(v, 2) },
        ],
      },
    ),
  "M4.not-rect.13": (v) => {
    const [a, b, c] = [n(v, 0), n(v, 1), n(v, 2)];
    const [x, y] = [(a - c) / 2, (b - c) / 2];
    return fig(
      [
        [box(0, 0, x, y)],
        [box(x + c, 0, a - x - c, y)],
        [box(0, y + c, x, b - y - c)],
        [box(x + c, y + c, a - x - c, b - y - c)],
      ],
      {
        labels: [
          { x: a / 2, y: -0.5, t: a },
          { x: a + 0.7, y: b / 2, t: b },
          { x: x + c / 2, y: y / 2, t: c },
        ],
      },
    );
  },
  "M4.not-rect.14": (v) => {
    const [a, b, c, d] = [n(v, 0), n(v, 1), n(v, 2), n(v, 3)];
    const x = (a - c) / 2;
    return fig(
      [
        [
          [
            [0, 0],
            [a, 0],
            [a, b],
            [x + c, b],
            [x + c, b - d],
            [x, b - d],
            [x, b],
            [0, b],
          ],
        ],
      ],
      {
        labels: [
          { x: a / 2, y: -0.5, t: a },
          { x: a + 0.7, y: b / 2, t: b },
          { x: a / 2, y: b - d / 2 + 0.2, t: `${c}\u00d7${d}` },
        ],
      },
    );
  },
  "M4.side-from-perimeter.02": (v) => askedSide(n(v, 1)),
  "M4.side-from-perimeter.09": (v) => askedSide(n(v, 0)),
  "M4.side-from-perimeter.12": () => sized(3, 2, ["?", "?"]),
  "M4.side-from-perimeter.13": () => sized(3, 2, ["?", "?"]),
  "M4.side-from-perimeter.14": (v) => sized(n(v, 0), 1, ["", ""], true),
  "M4.side-from-perimeter.15": (v) =>
    fig([[box(0, 0, 3, 3)], [box(4, 0, 4, 2)]], {
      labels: [
        { x: 1.5, y: -0.5, t: n(v, 0) },
        { x: 6, y: -0.5, t: n(v, 1) },
        { x: 8.7, y: 1, t: "?" },
      ],
    }),
  "M4.same-area.01": (v) =>
    fig([[box(0, 0, 3, 2)], [box(4, 0, 2, 3)]], {
      labels: [
        { x: 1.5, y: -0.5, t: n(v, 0) },
        { x: 3.5, y: 1, t: n(v, 1) * n(v, 2) },
        { x: 5, y: -0.5, t: n(v, 0) * n(v, 1) },
        { x: 6.7, y: 1.5, t: "?" },
      ],
    }),
  "M4.same-area.02": (v) => askedSide(n(v, 0)),
  "M4.same-area.03": (v) => {
    const [m, k, p, q] = equalArea(n(v, 0));
    return fig([[box(0, 0, m, k)], [box(m + 1, 0, p, q)]]);
  },
  "M4.same-area.07": (v) =>
    sized(n(v, 0) * n(v, 1) * n(v, 1), n(v, 0), [
      n(v, 0) * n(v, 1) * n(v, 1),
      n(v, 0),
    ]),
  "M4.same-area.12": (v) => {
    const s = n(v, 0);
    return fig([
      [box(0, 0, s, s)],
      [
        [
          [s, 0],
          [s + 1, 0],
          [s + 1, s + 1],
          [0, s + 1],
          [0, s],
          [s, s],
        ],
      ],
    ]);
  },
  "M4.same-area.13": (v) =>
    fig([
      [box(0, 0, n(v, 0), n(v, 0))],
      [box(0, 0, n(v, 0) + n(v, 1), n(v, 0) - n(v, 1))],
    ]),
  "M4.same-area.14": (v) =>
    fig([[box(0, 0, 4, 2)], [box(5, 0, 3, 3)]], {
      labels: [
        { x: 2, y: -0.5, t: n(v, 0) + n(v, 1) },
        { x: 4.5, y: 1, t: n(v, 0) - n(v, 1) },
        { x: 6.5, y: -0.5, t: "?" },
        { x: 8.7, y: 1.5, t: "?" },
      ],
    }),
};
