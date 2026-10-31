// Domain G, part 3: solids, nets, views and blocks (RES-4285). The Dutch goals match nets and pictures from group 2 to 5
// and ask for views at group 4 and a plan with heights at group 6; counting faces, edges and vertices is a Russian
// extension. Texts are plain blanks in `content/tasks-g.ru.json`. Generated from one table with the strings.
import { calc, rg } from "./kitc.js";
import { q } from "./kitf.js";
import { type Spec } from "./spec.js";

/** A cell of a net: its column and row. */
export type Cell = readonly [number, number];

const normalise = (cells: readonly Cell[]): Cell[] => {
  const x0 = Math.min(...cells.map((c) => c[0]));
  const y0 = Math.min(...cells.map((c) => c[1]));
  return cells
    .map((c): Cell => [c[0] - x0, c[1] - y0])
    .sort((u, v) => u[1] - v[1] || u[0] - v[0]);
};
const keyOf = (cells: readonly Cell[]): string =>
  cells.map((c) => `${c[0]},${c[1]}`).join(";");
/** The cells under the eight turns and flips of the plane, each moved to the corner. */
const variants = (cells: readonly Cell[]): Cell[][] =>
  [0, 1, 2, 3, 4, 5, 6, 7].map((k) =>
    normalise(
      cells.map((c): Cell => {
        const [x, y] = k >= 4 ? [c[1], c[0]] : c;
        return [k % 2 === 0 ? x : -x, k % 4 < 2 ? y : -y];
      }),
    ),
  );
const canonical = (cells: readonly Cell[]): string =>
  variants(cells).map(keyOf).sort()[0] ?? "";

/** All free polyominoes of `n` cells, in the order of their canonical keys. */
function polyominoes(n: number): Cell[][] {
  let level: Cell[][] = [[[0, 0]]];
  for (let size = 1; size < n; size += 1) {
    const seen = new Map<string, Cell[]>();
    for (const shape of level) {
      const taken = new Set(shape.map((c) => `${c[0]},${c[1]}`));
      for (const [x, y] of shape)
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ] as const) {
          const next: Cell = [x + dx, y + dy];
          if (taken.has(`${next[0]},${next[1]}`)) continue;
          const grown = normalise([...shape, next]);
          const key = canonical(grown);
          if (!seen.has(key)) seen.set(key, grown);
        }
    }
    level = [...seen.keys()].sort().map((k) => seen.get(k) ?? []);
  }
  return level;
}

/**
 * The face of a cube that lies on each cell of a net of six squares when the net is rolled up: faces are
 * 0 bottom, 1 top, 2 north, 3 south, 4 east, 5 west of the cube standing on the first cell.
 */
export function facesOf(cells: readonly Cell[]): number[] {
  const faces: number[] = Array<number>(cells.length).fill(-1);
  type Pose = readonly [number, number, number, number, number, number];
  const roll = (p: Pose, dx: number, dy: number): Pose => {
    const [b, t, n, s, e, w] = p;
    if (dx === 1) return [e, w, n, s, t, b];
    if (dx === -1) return [w, e, n, s, b, t];
    if (dy === 1) return [n, s, t, b, e, w];
    return [s, n, b, t, e, w];
  };
  const visit = (i: number, pose: Pose): void => {
    faces[i] = pose[0];
    const [x, y] = cells[i] ?? [0, 0];
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const j = cells.findIndex((c) => c[0] === x + dx && c[1] === y + dy);
      if (j >= 0 && faces[j] === -1) visit(j, roll(pose, dx, dy));
    }
  };
  visit(0, [0, 1, 2, 3, 4, 5]);
  return faces;
}

const HEXOMINOES = polyominoes(6);
const folds = (cells: readonly Cell[]): boolean =>
  new Set(facesOf(cells)).size === 6;
/** The eleven nets of a cube and the twenty-four other shapes of six squares. */
export const CUBE_NETS: readonly Cell[][] = HEXOMINOES.filter(folds);
export const NOT_NETS: readonly Cell[][] = HEXOMINOES.filter((h) => !folds(h));

/** The permutation of 1 to 6 that the number `m` below 720 stands for. */
export const permutation = (m: number): number[] => {
  const pool = [1, 2, 3, 4, 5, 6];
  const out: number[] = [];
  let rest = m;
  for (let size = 6; size >= 1; size -= 1) {
    out.push(pool.splice(rest % size, 1)[0] ?? 1);
    rest = Math.floor(rest / size);
  }
  return out;
};

/** For a net of a cube with dots on its squares: the dots on the question square and on the one opposite it. */
export function oppositeDots(
  net: number,
  perm: number,
  asked: number,
): {
  readonly dots: readonly number[];
  readonly asked: number;
  readonly opposite: number;
  readonly neighbour: number;
} {
  const cells = CUBE_NETS[net] ?? [];
  const dots = permutation(perm);
  const faces = facesOf(cells);
  const opp = faces.indexOf((faces[asked] ?? 0) ^ 1);
  const [x, y] = cells[asked] ?? [0, 0];
  const near = cells.findIndex(
    (c) => Math.abs(c[0] - x) + Math.abs(c[1] - y) === 1,
  );
  return {
    dots,
    asked: dots[asked] ?? 1,
    opposite: dots[opp] ?? 1,
    neighbour: dots[near] ?? 1,
  };
}

/** The four nets of a task: the one that folds at `pos` and three that do not around it. */
export function netChoices(v: readonly number[]): {
  readonly nets: readonly (readonly Cell[])[];
  readonly wrong: readonly number[];
  readonly distinct: boolean;
} {
  const [pos = 0, good = 0, ...bad] = v;
  const nets: (readonly Cell[])[] = [];
  const wrong: number[] = [];
  let k = 0;
  for (let i = 0; i < 4; i += 1) {
    if (i === pos) nets.push(CUBE_NETS[good] ?? []);
    else {
      nets.push(NOT_NETS[bad[k] ?? 0] ?? []);
      wrong.push(i + 1);
      k += 1;
    }
  }
  return {
    nets,
    wrong,
    distinct: new Set(bad.slice(0, 3)).size === 3,
  };
}

/** The solids with their counts of triangles, quadrilaterals and pentagons among their faces. */
const FACE_KINDS: readonly (readonly [number, number, number])[] = [
  [4, 0, 0],
  [8, 0, 0],
  [0, 6, 0],
  [2, 3, 0],
  [4, 1, 0],
  [0, 5, 2],
  [5, 0, 1],
  [8, 2, 0],
  [10, 0, 2],
];
export const faceKinds = (i: number): readonly [number, number, number] =>
  FACE_KINDS[i] ?? [4, 0, 0];

/** The orders of three things, by the number of the order. */
export const TRIPLES: readonly (readonly [number, number, number])[] = [
  [0, 1, 2],
  [0, 2, 1],
  [1, 0, 2],
  [1, 2, 0],
  [2, 0, 1],
  [2, 1, 0],
];
/** The place, from 1, of the item `index` of `items` when they are shown in order number `order`. */
const placeOf = (
  index: number,
  items: readonly number[],
  order: number,
): number => (TRIPLES[order] ?? [0, 1, 2]).indexOf(index) + 1 || items.length;

/** The area of the steps between four towers of a two by two plan. */
const steps = (a: number, b: number, c: number, d: number): number =>
  Math.abs(a - b) + Math.abs(c - d) + Math.abs(a - c) + Math.abs(b - d);

const G5_solids_nets = calc("G5", "solids-nets");
const G5_solids_nets_specs: readonly Spec<never>[] = [
  G5_solids_nets({
    id: "G5.solids-nets.01",
    form: "the-edges-of-separate-cubes",
    g: [4, 5],
    kind: "integer",
    p: [rg(2, 7)],
    f: (a) => q(12 * a),
    t: {
      "faces-instead": (a) => q(6 * a),
      "cubes-only": (a) => q(a),
      "visible-edges": (a) => q(9 * a),
    },
    c: [6, 12],
  }),
  G5_solids_nets({
    id: "G5.solids-nets.02",
    form: "the-faces-of-separate-boxes",
    g: [5, 8],
    kind: "integer",
    p: [rg(2, 9)],
    f: (a) => q(6 * a),
    t: {
      "edges-instead": (a) => q(12 * a),
      "boxes-only": (a) => q(a),
      "visible-faces": (a) => q(3 * a),
    },
    c: [6, 12],
    origin: {
      extension:
        "the faces, edges and vertices of solids, Russian programme (RES-4285)",
    },
  }),
  G5_solids_nets({
    id: "G5.solids-nets.03",
    form: "the-faces-of-a-pyramid",
    g: [5, 8],
    kind: "integer",
    p: [rg(3, 9)],
    f: (a) => q(a + 1),
    t: { "base-forgotten": (a) => q(a), edges: (a) => q(2 * a) },
    c: [1, 2],
    origin: {
      extension:
        "the faces, edges and vertices of solids, Russian programme (RES-4285)",
    },
  }),
  G5_solids_nets({
    id: "G5.solids-nets.04",
    form: "the-edges-of-a-pyramid",
    g: [5, 8],
    kind: "integer",
    p: [rg(3, 9)],
    f: (a) => q(2 * a),
    t: { "base-only": (a) => q(a), faces: (a) => q(a + 1) },
    c: [1, 2],
    origin: {
      extension:
        "the faces, edges and vertices of solids, Russian programme (RES-4285)",
    },
  }),
  G5_solids_nets({
    id: "G5.solids-nets.05",
    form: "the-vertices-of-a-prism",
    g: [5, 8],
    kind: "integer",
    p: [rg(3, 9)],
    f: (a) => q(2 * a),
    t: { "one-base": (a) => q(a), edges: (a) => q(3 * a) },
    c: [2, 3],
    origin: {
      extension:
        "the faces, edges and vertices of solids, Russian programme (RES-4285)",
    },
  }),
  G5_solids_nets({
    id: "G5.solids-nets.06",
    form: "the-side-faces-of-a-prism",
    g: [5, 8],
    kind: "integer",
    p: [rg(3, 9)],
    f: (a) => q(a),
    t: { "all-faces": (a) => q(a + 2), edges: (a) => q(3 * a) },
    c: [2, 3],
    origin: {
      extension:
        "the faces, edges and vertices of solids, Russian programme (RES-4285)",
    },
  }),
  G5_solids_nets({
    id: "G5.solids-nets.07",
    form: "the-dots-on-the-opposite-face",
    g: [3, 4],
    kind: "integer",
    p: [rg(1, 6)],
    f: (a) => q(7 - a),
    t: { "same-face": (a) => q(a), "from-six": (a) => q(6 - a) },
    c: [6, 7],
  }),
  G5_solids_nets({
    id: "G5.solids-nets.08",
    form: "the-hidden-dots",
    g: [3, 5],
    kind: "integer",
    p: [rg(1, 6), rg(1, 6), rg(1, 6)],
    ok: (a, b, c) => a + b + c < 15 && a + b + c > 7,
    f: (a, b, c) => q(21 - a - b - c),
    t: {
      "visible-sum": (a, b, c) => q(a + b + c),
      "from-seven": (a, b, c) => q(7 - a - b - c),
    },
    c: [7, 21],
  }),
  G5_solids_nets({
    id: "G5.solids-nets.09",
    form: "the-cubes-with-one-painted-face",
    g: [5, 8],
    kind: "integer",
    p: [rg(3, 7)],
    f: (a) => q(6 * (a - 2) * (a - 2)),
    t: {
      "all-surface-cubes": (a) => q(6 * a * a),
      "one-face-only": (a) => q((a - 2) * (a - 2)),
    },
    c: [2, 6],
  }),
  G5_solids_nets({
    id: "G5.solids-nets.10",
    form: "the-wire-for-the-edges-of-a-cube",
    g: [5, 6],
    kind: "integer",
    p: [rg(2, 12)],
    f: (a) => q(12 * a),
    t: { "face-edges": (a) => q(4 * a), faces: (a) => q(6 * a) },
    c: [4, 6, 12],
  }),
  G5_solids_nets({
    id: "G5.solids-nets.11",
    form: "the-area-of-the-net-of-a-cube",
    g: [5, 6],
    kind: "integer",
    p: [rg(2, 9)],
    f: (a) => q(6 * a * a),
    t: { "one-face": (a) => q(a * a), "edge-times-six": (a) => q(6 * a) },
    c: [6],
  }),
  G5_solids_nets({
    id: "G5.solids-nets.12",
    form: "the-visible-faces-of-cubes-in-a-row",
    g: [3, 5],
    kind: "integer",
    p: [rg(2, 9)],
    f: (a) => q(4 * a + 2),
    t: { "all-faces": (a) => q(6 * a), "four-per-cube": (a) => q(4 * a) },
    c: [2, 4, 6],
  }),
  G5_solids_nets({
    id: "G5.solids-nets.13",
    form: "the-solid-shaped-like-a-ball",
    g: [2, 3],
    kind: "choice",
    p: [rg(0, 19)],
    f: () => "1",
    t: { cube: () => "2", box: () => "3", pencil: () => "4" },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
  }),
  G5_solids_nets({
    id: "G5.solids-nets.14",
    form: "the-net-that-folds-into-a-cube",
    g: [4, 8],
    kind: "choice",
    p: [
      rg(0, 3),
      rg(0, CUBE_NETS.length - 1),
      rg(0, NOT_NETS.length - 1),
      rg(0, NOT_NETS.length - 1),
      rg(0, NOT_NETS.length - 1),
    ],
    ok: (...v) => netChoices(v).distinct,
    f: (pos) => String(pos + 1),
    t: {
      "the-first-wrong-net": (...v) => String(netChoices(v).wrong[0] ?? 1),
      "the-second-wrong-net": (...v) => String(netChoices(v).wrong[1] ?? 1),
      "the-third-wrong-net": (...v) => String(netChoices(v).wrong[2] ?? 1),
    },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
    origin: {
      olympiad:
        "which of four nets folds into a cube (RES-4285, Kangoeroe 2002 report 396)",
    },
  }),
  G5_solids_nets({
    id: "G5.solids-nets.15",
    form: "the-dots-opposite-on-a-net",
    g: [4, 8],
    kind: "choice",
    p: [rg(0, CUBE_NETS.length - 1), rg(0, 719), rg(0, 5)],
    f: (net, perm, asked) => String(oppositeDots(net, perm, asked).opposite),
    t: {
      "a-neighbour-face": (net, perm, asked) =>
        String(oppositeDots(net, perm, asked).neighbour),
      "seven-minus": (net, perm, asked) =>
        String(7 - oppositeDots(net, perm, asked).asked),
    },
    x: (net, perm, asked) => ({
      k: String(oppositeDots(net, perm, asked).asked),
    }),
    options: () => ["1", "2", "3", "4", "5", "6"],
    c: [1, 2, 3, 4, 5, 6, 7],
    origin: {
      olympiad:
        "opposite faces on a net of a cube (RES-4285, Tartu ecolier cube items)",
    },
  }),
  G5_solids_nets({
    id: "G5.solids-nets.16",
    form: "the-cubes-with-two-painted-faces",
    g: [5, 8],
    kind: "integer",
    p: [rg(3, 7)],
    f: (a) => q(12 * (a - 2)),
    t: {
      "all-edge-cubes": (a) => q(12 * a),
      "one-edge": (a) => q(a - 2),
      "one-face-answer": (a) => (a === 4 ? null : q(6 * (a - 2) * (a - 2))),
    },
    c: [2, 12],
    origin: {
      olympiad:
        "the painted cube: cubes on the edges but not in the corners (RES-4285, Kangoeroe 2002 report 397)",
    },
  }),
  G5_solids_nets({
    id: "G5.solids-nets.17",
    form: "the-cubes-without-paint",
    g: [5, 8],
    kind: "integer",
    p: [rg(3, 7)],
    f: (a) => q((a - 2) ** 3),
    t: {
      "all-cubes": (a) => q(a ** 3),
      "one-layer": (a) => (a === 3 ? null : q((a - 2) * (a - 2))),
    },
    c: [2],
    origin: {
      olympiad:
        "the painted cube: the cubes inside form a smaller cube (RES-4285, Kangoeroe 2002 report 397)",
    },
  }),
  G5_solids_nets({
    id: "G5.solids-nets.18",
    form: "the-edges-from-the-faces-counted-twice",
    g: [5, 8],
    kind: "integer",
    p: [rg(0, FACE_KINDS.length - 1)],
    f: (i) => {
      const [t, s, f] = faceKinds(i);
      return q((3 * t + 4 * s + 5 * f) / 2);
    },
    alt: (i) => {
      const [t, s, f] = faceKinds(i);
      return q((3 * t) / 2 + 2 * s + (5 * f) / 2);
    },
    t: {
      "sides-counted-once": (i) => {
        const [t, s, f] = faceKinds(i);
        return q(3 * t + 4 * s + 5 * f);
      },
      "faces-count": (i) => {
        const [t, s, f] = faceKinds(i);
        return q(t + s + f);
      },
    },
    x: (i) => {
      const [t, s, f] = faceKinds(i);
      return { t: String(t), s: String(s), f: String(f) };
    },
    c: [2, 3, 4, 5],
    origin: {
      olympiad:
        "counting the edges of a solid by the sides of its faces, each edge twice (RES-4285, MCCME counting items)",
    },
  }),
  G5_solids_nets({
    id: "G5.solids-nets.19",
    form: "the-pieces-of-a-sawn-cube",
    g: [5, 8],
    kind: "integer",
    p: [rg(1, 3), rg(1, 3), rg(1, 3)],
    f: (a, b, c) => q((a + 1) * (b + 1) * (c + 1)),
    t: {
      "sum-plus-one": (a, b, c) => q(a + b + c + 1),
      "product-of-cuts": (a, b, c) => q(a * b * c),
    },
    c: [1],
    roles: {
      a: "cuts in the first direction",
      b: "cuts in the second direction",
      c: "cuts in the third direction",
    },
    origin: {
      olympiad:
        "cutting a cube by planes parallel to its faces: the layers multiply (RES-4285, MCCME cutting items)",
    },
  }),
];

const G6_views = calc("G6", "views");
const G6_views_specs: readonly Spec<never>[] = [
  G6_views({
    id: "G6.views.01",
    form: "the-squares-seen-from-the-front",
    g: [3, 4],
    kind: "integer",
    p: [rg(1, 5), rg(1, 5), rg(1, 5)],
    ok: (a, b, c) => a + b + c > 3,
    f: (a, b, c) => q(a + b + c),
    t: {
      "highest-only": (a, b, c) => q(Math.max(a, b, c)),
      columns: () => q(3),
    },
    c: [3],
  }),
  G6_views({
    id: "G6.views.02",
    form: "the-height-seen-from-the-side",
    g: [3, 4],
    kind: "integer",
    p: [rg(1, 6), rg(1, 6), rg(1, 6)],
    ok: (a, b, c) => a !== b && b !== c && a !== c,
    f: (a, b, c) => q(Math.max(a, b, c)),
    t: {
      sum: (a, b, c) => q(a + b + c),
      lowest: (a, b, c) => q(Math.min(a, b, c)),
    },
  }),
  G6_views({
    id: "G6.views.03",
    form: "the-squares-seen-from-above",
    g: [3, 4],
    kind: "integer",
    p: [rg(2, 6), rg(2, 6)],
    ok: (a, b) => a !== b,
    f: (a, b) => q(a * b),
    t: {
      "sides-added": (a, b) => q(a + b),
      perimeter: (a, b) => q(2 * (a + b)),
      "front-row": (a) => q(a),
    },
  }),
  G6_views({
    id: "G6.views.04",
    form: "the-hidden-cubes",
    g: [4, 6],
    kind: "integer",
    p: [rg(2, 4), rg(2, 4), rg(2, 4)],
    f: (a, b, c) => q((a - 1) * (b - 1) * (c - 1)),
    t: {
      "visible-cubes": (a, b, c) => q(a * b * c - (a - 1) * (b - 1) * (c - 1)),
      "all-cubes": (a, b, c) => q(a * b * c),
    },
    c: [1],
    roles: { a: "length", b: "width", c: "height" },
  }),
  G6_views({
    id: "G6.views.05",
    form: "the-stacked-cubes-from-the-top-view",
    g: [3, 4],
    kind: "integer",
    p: [rg(8, 15), rg(4, 7)],
    ok: (a, b) => a - b !== b,
    f: (a, b) => q(a - b),
    t: { visible: (a, b) => q(b), all: (a) => q(a) },
  }),
  G6_views({
    id: "G6.views.06",
    form: "the-columns-of-at-least-a-given-height",
    g: [3, 4],
    kind: "integer",
    p: [rg(1, 5), rg(1, 5), rg(1, 5), rg(2, 4)],
    ok: (a, b, c, d) =>
      [a, b, c].filter((z) => z >= d).length > 0 &&
      [a, b, c].filter((z) => z >= d).length < 3 &&
      [a, b, c].filter((z) => z === d).length !==
        [a, b, c].filter((z) => z >= d).length,
    f: (a, b, c, d) => q([a, b, c].filter((z) => z >= d).length),
    t: {
      all: () => q(3),
      exact: (a, b, c, d) => q([a, b, c].filter((z) => z === d).length),
    },
    c: [3],
  }),
  G6_views({
    id: "G6.views.07",
    form: "the-right-hand-when-facing-north",
    g: [3, 4],
    kind: "choice",
    p: [rg(0, 19)],
    f: () => "2",
    t: { west: () => "1", south: () => "3", north: () => "4" },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
  }),
  G6_views({
    id: "G6.views.08",
    form: "the-view-of-a-ball",
    g: [3, 4],
    kind: "choice",
    p: [rg(0, 19)],
    f: () => "3",
    t: {
      "circle-and-square": () => "1",
      "square-everywhere": () => "2",
      "square-and-circle": () => "4",
    },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
  }),
  G6_views({
    id: "G6.views.09",
    form: "the-top-view-of-a-box",
    g: [4, 5],
    kind: "choice",
    p: [rg(0, 19)],
    f: () => "4",
    t: { circle: () => "1", triangle: () => "2", pentagon: () => "3" },
    options: () => ["1", "2", "3", "4"],
    c: [1, 2, 3, 4],
  }),
  G6_views({
    id: "G6.views.10",
    form: "the-cubes-removed-from-a-box",
    g: [3, 4],
    kind: "integer",
    p: [rg(2, 4), rg(2, 4), rg(2, 4), rg(1, 3)],
    ok: (a, b, c) => a * b * c > 12,
    f: (a, b, c, d) => q(a * b * c - d),
    t: { removed: (a, b, c, d) => q(d), sum: (a, b, c, d) => q(a + b + c - d) },
  }),
  G6_views({
    id: "G6.views.11",
    form: "the-column-on-the-left-from-behind",
    g: [3, 4],
    kind: "choice",
    p: [rg(1, 5), rg(1, 5), rg(1, 5), rg(0, 5)],
    ok: (a, b, c) => a !== b && b !== c && a !== c,
    f: (a, b, c, k) => String(placeOf(2, [a, b, c], k)),
    t: {
      "the-old-left": (a, b, c, k) => String(placeOf(0, [a, b, c], k)),
      "the-middle": (a, b, c, k) => String(placeOf(1, [a, b, c], k)),
    },
    x: (a, b, c, k) => {
      const order = TRIPLES[k] ?? [0, 1, 2];
      const all = [a, b, c];
      return Object.fromEntries(
        order.map((index, i) => [`o${i + 1}`, String(all[index] ?? 0)]),
      );
    },
    options: () => ["1", "2", "3"],
    c: [1, 2, 3],
  }),
  G6_views({
    id: "G6.views.12",
    form: "the-squares-seen-from-the-front-of-a-plan",
    g: [4, 6],
    kind: "integer",
    p: [rg(1, 5), rg(1, 5), rg(1, 5), rg(1, 5)],
    ok: (a, b, c, d) => a !== c && b !== d,
    f: (a, b, c, d) => q(Math.max(a, c) + Math.max(b, d)),
    t: {
      "all-cubes": (a, b, c, d) => q(a + b + c + d),
      "near-row": (a, b) => q(a + b),
    },
    roles: {
      a: "height of the near left tower",
      b: "height of the near right tower",
      c: "height of the far left tower",
      d: "height of the far right tower",
    },
  }),
  G6_views({
    id: "G6.views.13",
    form: "the-greatest-building-from-two-views",
    g: [6, 8],
    kind: "integer",
    p: [rg(1, 4), rg(1, 4), rg(1, 4), rg(1, 4), rg(1, 4), rg(1, 4)],
    ok: (a, b, c, d, e, f) => Math.max(a, b, c) === Math.max(d, e, f),
    f: (a, b, c, d, e, f) =>
      q(
        [d, e, f].reduce(
          (sum, row) =>
            sum + Math.min(a, row) + Math.min(b, row) + Math.min(c, row),
          0,
        ),
      ),
    t: {
      "front-times-three": (a, b, c) => q(3 * (a + b + c)),
      "views-added": (a, b, c, d, e, f) => q(a + b + c + d + e + f),
    },
    c: [3],
    origin: {
      olympiad:
        "the greatest building that fits two views: the smaller of two heights in each cell (RES-4285, MCCME building items)",
    },
  }),
];

const G6_blocks = calc("G6", "blocks");
const G6_blocks_specs: readonly Spec<never>[] = [
  G6_blocks({
    id: "G6.blocks.01",
    form: "the-cubes-in-a-plan-with-heights",
    g: [6, 7],
    kind: "integer",
    p: [rg(1, 5), rg(1, 5), rg(1, 5), rg(1, 5)],
    ok: (a, b, c, d) =>
      a + b + c + d > 4 &&
      (a !== b || b !== c || c !== d) &&
      a + b + c + d !== 4 * Math.max(a, b, c, d),
    f: (a, b, c, d) => q(a + b + c + d),
    t: {
      cells: () => q(4),
      "highest-times-four": (a, b, c, d) => q(4 * Math.max(a, b, c, d)),
    },
    c: [4],
  }),
  G6_blocks({
    id: "G6.blocks.02",
    form: "the-highest-tower-in-a-plan",
    g: [6, 7],
    kind: "integer",
    p: [rg(1, 6), rg(1, 6), rg(1, 6), rg(1, 6)],
    ok: (a, b, c, d) => new Set([a, b, c, d]).size === 4,
    f: (a, b, c, d) => q(Math.max(a, b, c, d)),
    t: {
      sum: (a, b, c, d) => q(a + b + c + d),
      lowest: (a, b, c, d) => q(Math.min(a, b, c, d)),
    },
  }),
  G6_blocks({
    id: "G6.blocks.03",
    form: "the-cubes-to-add-for-an-even-height",
    g: [6, 7],
    kind: "integer",
    p: [rg(1, 4), rg(1, 4), rg(1, 4), rg(5, 6)],
    ok: (a, b, c, d) => d - a !== 3 * d - a - b - c,
    f: (a, b, c, d) => q(3 * d - a - b - c),
    t: {
      "one-column": (a, b, c, d) => q(d - a),
      built: (a, b, c) => q(a + b + c),
    },
    c: [3],
  }),
  G6_blocks({
    id: "G6.blocks.04",
    form: "the-surface-of-a-tower",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 9)],
    f: (a) => q(4 * a + 1),
    t: { "with-bottom": (a) => q(4 * a + 2), "sides-only": (a) => q(4 * a) },
    c: [1, 2, 4],
  }),
  G6_blocks({
    id: "G6.blocks.05",
    form: "the-cubes-in-three-staircases",
    g: [6, 7],
    kind: "integer",
    p: [rg(3, 8)],
    f: (a) => q((3 * a * (a + 1)) / 2),
    t: {
      "one-staircase": (a) => q((a * (a + 1)) / 2),
      "by-the-top": (a) => q(3 * a),
    },
    c: [1, 2, 3],
  }),
  G6_blocks({
    id: "G6.blocks.06",
    form: "the-surface-after-removing-a-corner-cube",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 6)],
    f: (a) => q(6 * a * a),
    t: {
      "minus-three": (a) => q(6 * a * a - 3),
      "plus-three": (a) => q(6 * a * a + 3),
    },
    c: [1, 3, 6],
  }),
  G6_blocks({
    id: "G6.blocks.07",
    form: "the-cubes-left-after-removing-top-ones",
    g: [6, 7],
    kind: "integer",
    p: [rg(3, 6), rg(3, 6), rg(1, 3)],
    ok: (a, b, c) => c !== a,
    f: (a, b, c) => q(a * b - c),
    t: {
      "removed-all-tops": (a, b) => q(a * b - a),
      sum: (a, b, c) => q(a + b - c),
    },
  }),
  G6_blocks({
    id: "G6.blocks.08",
    form: "the-cubes-of-the-second-layer",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 5), rg(2, 5), rg(2, 4)],
    ok: (a, b) => a !== b,
    f: (a, b, c) => q(a * b * (c - 1)),
    t: {
      "one-layer": (a, b) => q(a * b),
      "all-layers": (a, b, c) => q(a * b * c),
    },
    c: [1],
  }),
  G6_blocks({
    id: "G6.blocks.09",
    form: "the-rows-of-a-tower-plan",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 5), rg(2, 5), rg(2, 4)],
    ok: (a, b) => a !== b,
    f: (a, b, c) => q(a * b * c),
    t: { cells: (a, b) => q(a * b), sum: (a, b, c) => q(a + b + c) },
  }),
  G6_blocks({
    id: "G6.blocks.10",
    form: "the-cubes-in-a-pyramid-of-layers",
    g: [6, 7],
    kind: "integer",
    p: [rg(2, 5)],
    f: (a) => q((a * (a + 1) * (2 * a + 1)) / 6),
    t: {
      "bottom-layer": (a) => q(a * a),
      "sides-added": (a) => q((a * (a + 1)) / 2),
      "one-layer-short": (a) => q(((a - 1) * a * (2 * a - 1)) / 6),
    },
    c: [1, 2, 4, 9],
  }),
  G6_blocks({
    id: "G6.blocks.11",
    form: "the-surface-of-a-building-from-its-plan",
    g: [6, 8],
    kind: "integer",
    p: [rg(1, 4), rg(1, 4), rg(1, 4), rg(1, 4)],
    ok: (a, b, c, d) => !(a === b && b === c && c === d),
    f: (a, b, c, d) => q(4 + 2 * (a + b + c + d) + steps(a, b, c, d)),
    alt: (a, b, c, d) =>
      q(
        4 +
          (a + b + c + d) * 2 +
          Math.abs(a - b) +
          Math.abs(c - d) +
          Math.abs(a - c) +
          Math.abs(b - d),
      ),
    t: {
      "no-inner-steps": (a, b, c, d) => q(4 + 2 * (a + b + c + d)),
      "with-the-bottom": (a, b, c, d) =>
        q(8 + 2 * (a + b + c + d) + steps(a, b, c, d)),
    },
    x: (a, b, c, d) => ({ s: String(steps(a, b, c, d)) }),
    c: [1, 2, 4],
    roles: {
      a: "height of the first tower of the first row",
      b: "height of the second tower of the first row",
      c: "height of the first tower of the second row",
      d: "height of the second tower of the second row",
    },
    origin: {
      olympiad:
        "the surface of a building: the tops, the outer walls and the steps between towers (RES-4285, MCCME building items)",
    },
  }),
  G6_blocks({
    id: "G6.blocks.12",
    form: "the-staircase-with-a-jump",
    g: [6, 8],
    kind: "integer",
    p: [rg(3, 5), rg(2, 3)],
    f: (a, b) => q((a * (2 + (a - 1) * b)) / 2),
    alt: (a, b) => {
      let total = 0;
      for (let i = 0; i < a; i += 1) total += 1 + i * b;
      return q(total);
    },
    t: {
      "last-times-count": (a, b) => q(a * (1 + (a - 1) * b)),
      "pairs-not-halved": (a, b) => q(a * (2 + (a - 1) * b)),
    },
    c: [1, 2],
    roles: { a: "count of towers", b: "step in height" },
  }),
  G6_blocks({
    id: "G6.blocks.13",
    form: "the-shell-of-a-cube",
    g: [6, 8],
    kind: "integer",
    p: [rg(3, 7)],
    f: (a) => q(a ** 3 - (a - 2) ** 3),
    alt: (a) => q(6 * a * a - 12 * a + 8),
    t: {
      "faces-times-six": (a) => q(6 * a * a),
      "one-layer-removed": (a) => q(a ** 3 - (a - 1) ** 3),
    },
    c: [2],
    origin: {
      olympiad:
        "the shell of a cube: the whole minus the cube inside (RES-4285, Kangoeroe cube items)",
    },
  }),
];

export const gSpecs3: readonly Spec<never>[] = [
  ...G5_solids_nets_specs,
  ...G6_views_specs,
  ...G6_blocks_specs,
];
