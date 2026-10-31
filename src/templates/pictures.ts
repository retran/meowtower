// The picture of each template that has one, by template id (RES-1200). A picture is drawn by code from the
// numbers the template drew, in the order of its `p` list, so it never differs from the text.
import type { PictureLabels } from "./spec.js";
import {
  angle,
  based,
  circle,
  crossOf,
  cuboid,
  fig,
  framed,
  joined,
  notched,
  regular,
  rhombus,
  sized,
  slanted,
  stairs,
  ball,
  gallery,
  letters,
  pencil,
  beads,
  box,
  cube,
  dice,
  figures,
  foldedSheet,
  layers,
  matchsticks,
  numberLine,
  numberRow,
  pictogram,
  polygons,
  solid,
  stackRows,
  staircase,
  bars,
  block,
  clock,
  columns,
  compass,
  cubeNet,
  grid,
  lineGraph,
  path,
  pie,
  plan,
  polygon,
  rectangle,
  ruler,
  scaleBar,
  table,
  thermometer,
  triangle,
} from "./svg.js";

type Draw = (v: number[], labels: PictureLabels) => string;
const n = (v: number[], i: number): number => v[i] ?? 0;
const box4 = (
  x: number,
  y: number,
  w: number,
  h: number,
): [number, number][] => [
  [x, y],
  [x + w, y],
  [x + w, y + h],
  [x, y + h],
];
const pts = (...xy: [number, number][]) => xy.map(([x, y]) => ({ x, y }));
const dims = (xy: [number, number][]): [number, number] => [
  Math.max(1, ...xy.map((p) => p[0])) + 1,
  Math.max(1, ...xy.map((p) => p[1])) + 1,
];
const onGrid = (
  xy: [number, number][],
  segs: [number, number, number, number][] = [],
): string => {
  const [c, r] = dims(xy);
  return grid(c, r, pts(...xy), segs);
};

export const PICTURES: Readonly<Record<string, Draw>> = {
  // S1: the data of a table
  "S1.tables.01": (v) => table([[n(v, 0), n(v, 1), n(v, 2)]]),
  "S1.tables.02": (v) => table([[n(v, 0), n(v, 1), n(v, 2)]]),
  "S1.tables.03": (v) => table([[n(v, 0), n(v, 1), n(v, 2)]]),
  "S1.tables.07": (v) => table([[n(v, 0), n(v, 1), n(v, 2), n(v, 3)]]),
  "S1.tables.08": (v) => table([[n(v, 0), n(v, 1), n(v, 2), n(v, 3)]]),
  "S1.tables.09": (v) =>
    table([
      [n(v, 0), n(v, 1)],
      [n(v, 2), n(v, 3)],
    ]),
  // S2: bars and lines
  "S2.bar-line.02": (v) => bars([n(v, 0), n(v, 1)]),
  "S2.bar-line.03": (v) => bars([n(v, 0), n(v, 1), n(v, 2)]),
  "S2.bar-line.05": (v) => lineGraph([n(v, 0), n(v, 1)], [8, 12]),
  "S2.bar-line.06": (v) =>
    lineGraph([n(v, 0), n(v, 0) + n(v, 1) * n(v, 2)], [0, n(v, 2)]),
  "S2.bar-line.07": (v) => bars([n(v, 0), n(v, 1), n(v, 2), n(v, 3)]),
  "S2.bar-line.08": (v) => bars([n(v, 0), n(v, 1), n(v, 2)]),
  "S2.bar-line.09": (v) =>
    lineGraph([n(v, 0), n(v, 0) + n(v, 1), n(v, 0) + n(v, 1) - n(v, 2)]),
  "S2.bar-line.11": (v) => bars([n(v, 1), n(v, 2)]),
  "S2.bar-line.12": (v) => bars([n(v, 1), n(v, 2)]),
  // S4: sectors
  "S4.pie.01": (v) => pie([n(v, 1)]),
  "S4.pie.02": (v) => pie(Array.from({ length: n(v, 0) }, () => 100 / n(v, 0))),
  "S4.pie.03": (v) => pie([n(v, 0), n(v, 1), n(v, 2)]),
  "S4.pie.04": (v) => pie([n(v, 0)]),
  "S4.pie.05": (v) => pie([(100 * n(v, 1)) / n(v, 0)]),
  "S4.pie.06": (v) => pie([n(v, 0)]),
  "S4.pie.07": (v) => pie([n(v, 1), n(v, 2)]),
  "S4.pie.08": (v) => pie([n(v, 1), n(v, 2)]),
  "S4.pie.10": (v) => pie([n(v, 0), n(v, 1), n(v, 2)]),
  "S4.pie.11": (v) => pie([n(v, 0), n(v, 1)]),
  // S5: graphs
  "S5.global.01": (v) =>
    lineGraph([n(v, 0), n(v, 1), n(v, 2), n(v, 3)], [6, 9, 12, 15]),
  "S5.global.02": (v) => lineGraph([n(v, 0), n(v, 1)], [9, 12]),
  "S5.global.03": (v) =>
    lineGraph([n(v, 2) + n(v, 0) * n(v, 1), n(v, 2)], [12, 12 + n(v, 1)]),
  "S5.global.04": (v) => lineGraph([n(v, 0), n(v, 1)], [10, 12]),
  "S5.global.07": (v) => lineGraph([n(v, 0), n(v, 1), n(v, 2), n(v, 3)]),
  "S5.global.11": (v) => bars([n(v, 0), n(v, 1), n(v, 2)]),
  "S5.global.12": (v) => bars([n(v, 0), n(v, 1), n(v, 2)]),
  "S5.global-1S.01": (v) =>
    lineGraph([n(v, 0), n(v, 0) + n(v, 1), n(v, 0) + 2 * n(v, 1)]),
  "S5.global-1S.05": (v) => lineGraph([n(v, 0), n(v, 1), n(v, 2), n(v, 3)]),
  "S5.global-1S.06": () => lineGraph([3, 5, 8, 12]),
  "S5.global-1S.07": () => lineGraph([20, 15, 11, 8]),
  "S5.global-1S.08": () => lineGraph([4, 9, 14, 8, 3]),
  // G1 and G2: figures and angles
  "G1.shapes.04": () => rectangle(2, 1),
  "G1.shapes.05": () => block(2, 2),
  "G1.shapes.07": (v) => polygon(n(v, 0), false),
  "G1.shapes.08": (v) => block(n(v, 0), n(v, 0)),
  "G1.shapes.09": (v) => polygon(n(v, 0), false),
  "G2.angles.01": (v) => triangle(n(v, 0), n(v, 1), [n(v, 0), n(v, 1), "?"]),
  "G2.angles.02": (v) => angle(n(v, 0)),
  "G2.angles.03": (v) => angle(90, n(v, 0)),
  "G2.angles.04": (v) =>
    triangle((180 - n(v, 0)) / 2, (180 - n(v, 0)) / 2, ["?", "?", n(v, 0)]),
  "G2.angles.05": (v) => clock(n(v, 0), 0),
  "G2.angles.06": (v) => clock(0, n(v, 0)),
  "G2.angles.07": (v) => polygon(n(v, 0), false),
  "G2.angles.08": (v) => polygon(n(v, 0), false),
  "G2.angles.12": (v) => angle(n(v, 0)),
  "G2.angles.13": (v) => angle(n(v, 1) - n(v, 0), "?"),
  // G3 and G4: symmetry and coordinates
  "G3.symmetry.01": (v) => polygon(n(v, 0)),
  "G3.symmetry.03": (v) =>
    grid(8, 7, pts([n(v, 0), n(v, 1)]), [[n(v, 2), 0, n(v, 2), 7]]),
  "G3.symmetry.04": (v) =>
    grid(8, 8, pts([n(v, 0), n(v, 1)], [n(v, 2), n(v, 3)])),
  "G3.symmetry.08": (v) => rectangle(n(v, 0), n(v, 1), true),
  "G3.symmetry.09": (v) => {
    const base = (Math.acos(n(v, 1) / (2 * n(v, 0))) * 180) / Math.PI;
    return triangle(base, base, []);
  },
  "G3.symmetry.12": () => rectangle(1, 1, true),
  "G4.coordinates.01": (v) =>
    onGrid(
      [
        [n(v, 0), n(v, 2)],
        [n(v, 1), n(v, 2)],
      ],
      [[n(v, 0), n(v, 2), n(v, 1), n(v, 2)]],
    ),
  "G4.coordinates.02": (v) =>
    onGrid(
      [
        [n(v, 0), n(v, 1)],
        [n(v, 0), n(v, 2)],
      ],
      [[n(v, 0), n(v, 1), n(v, 0), n(v, 2)]],
    ),
  "G4.coordinates.03": (v) =>
    onGrid(
      [
        [n(v, 0), n(v, 1)],
        [n(v, 2), n(v, 1)],
        [n(v, 2), n(v, 3)],
      ],
      [
        [n(v, 0), n(v, 1), n(v, 2), n(v, 1)],
        [n(v, 2), n(v, 1), n(v, 2), n(v, 3)],
      ],
    ),
  "G4.coordinates.04": (v) =>
    onGrid([
      [n(v, 0), n(v, 1)],
      [n(v, 0) + n(v, 2), n(v, 1) + n(v, 3)],
    ]),
  "G4.coordinates.05": (v) =>
    onGrid(
      [
        [n(v, 0), n(v, 2)],
        [n(v, 1), n(v, 2)],
      ],
      [[n(v, 0), n(v, 2), n(v, 1), n(v, 2)]],
    ),
  "G4.coordinates.06": (v) =>
    onGrid([
      [n(v, 0), n(v, 1)],
      [n(v, 2), n(v, 3)],
    ]),
  "G4.coordinates.07": (v) =>
    path([
      [n(v, 0), n(v, 1)],
      [n(v, 2), n(v, 1)],
      [n(v, 2), n(v, 3)],
    ]),
  "G4.coordinates.08": (v) => grid(n(v, 0), n(v, 0)),
  "G4.coordinates.09": (v) => onGrid([[n(v, 0), n(v, 1)]]),
  "G4.coordinates.10": (v) =>
    path([
      [0, 0],
      [n(v, 0), 0],
      [n(v, 0), n(v, 1)],
      [n(v, 0) - n(v, 2), n(v, 1)],
      [n(v, 0) - n(v, 2), n(v, 1) - n(v, 3)],
    ]),
  // G5 and G6: solids, views and builds
  "G5.solids-nets.09": (v) => block(n(v, 0), n(v, 0)),
  "G5.solids-nets.11": () => cubeNet(),
  "G5.solids-nets.12": (v) => block(n(v, 0), 1),
  "G6.views.01": (v) => columns([n(v, 0), n(v, 1), n(v, 2)]),
  "G6.views.02": (v) => columns([n(v, 0), n(v, 1), n(v, 2)]),
  "G6.views.03": (v) => block(n(v, 0), n(v, 1)),
  "G6.views.06": (v) => columns([n(v, 0), n(v, 1), n(v, 2)]),
  "G6.blocks.01": (v) =>
    plan([
      [n(v, 0), n(v, 1)],
      [n(v, 2), n(v, 3)],
    ]),
  "G6.blocks.02": (v) =>
    plan([
      [n(v, 0), n(v, 1)],
      [n(v, 2), n(v, 3)],
    ]),
  "G6.blocks.03": (v) => columns([n(v, 0), n(v, 1), n(v, 2)]),
  "G6.blocks.04": (v) => columns([n(v, 0)]),
  "G6.blocks.05": (v) =>
    columns(Array.from({ length: n(v, 0) }, (_, i) => i + 1)),
  "G6.blocks.07": (v) =>
    columns(Array.from({ length: n(v, 0) }, () => n(v, 1))),
  "G6.blocks.08": (v) => block(n(v, 0), n(v, 1)),
  "G6.blocks.09": (v) =>
    plan(
      Array.from({ length: n(v, 0) }, () =>
        Array.from({ length: n(v, 1) }, () => n(v, 2)),
      ),
    ),
  // G7: compass, routes and scale
  "G7.plan.01": (_v, l) => compass(l.compass),
  "G7.plan.02": (_v, l) => compass(l.compass),
  "G7.plan.03": (_v, l) => compass(l.compass),
  "G7.plan.04": (_v, l) => compass(l.compass),
  "G7.plan.05": (_v, l) => compass(l.compass),
  "G7.plan.06": (_v, l) => compass(l.compass),
  "G7.plan.07": (v) =>
    path([
      [0, 0],
      [0, n(v, 0)],
      [n(v, 1), n(v, 0)],
    ]),
  "G7.plan.09": (v) =>
    path([
      [0, 0],
      [n(v, 0), 0],
      [n(v, 0), n(v, 1)],
      [0, n(v, 1)],
    ]),
  "G7.plan-1S.01": (v) => scaleBar(Math.min(12, n(v, 1))),
  "G7.plan-1S.02": (v) => scaleBar(Math.min(12, n(v, 1))),
  "G7.plan-1S.03": (v) => rectangle(n(v, 1), n(v, 2)),
  "G7.plan-1S.05": (v) =>
    path([
      [0, 0],
      [n(v, 0), 0],
      [n(v, 0), n(v, 1)],
      [n(v, 0) + n(v, 2), n(v, 1)],
    ]),
  "G7.plan-1S.07": () => rectangle(3, 4),
  "G7.plan-1S.09": (v) =>
    onGrid([
      [n(v, 0), n(v, 1)],
      [n(v, 2), n(v, 3)],
    ]),

  // G1 to G7: the figures and solids the texts name
  "G1.shapes.01": (v) => polygons(n(v, 0), n(v, 1)),
  "G1.shapes.02": (v) =>
    figures([
      ...Array<"square">(n(v, 0)).fill("square"),
      ...Array<"circle">(n(v, 1)).fill("circle"),
    ]),
  "G1.shapes.03": (v) =>
    figures([
      ...Array<"triangle">(n(v, 0)).fill("triangle"),
      ...Array<"rectangle">(n(v, 1)).fill("rectangle"),
    ]),
  "G1.shapes.06": (v) => rectangle(n(v, 0), n(v, 1)),
  "G1.shapes.12": () =>
    figures(["square", "triangle", "rectangle", "circle"], true),
  "G2.angles.10": (v) => staircase(n(v, 0)),
  "G2.angles.11": (v) => figures(Array<"rectangle">(n(v, 0)).fill("rectangle")),
  "G3.symmetry.02": (v) =>
    numberLine(
      n(v, 1) * 2 - n(v, 0) + 1,
      [n(v, 0), 2 * n(v, 1) - n(v, 0)].slice(0, 1),
      n(v, 1),
    ),
  "G3.symmetry.10": (v) => foldedSheet(n(v, 0)),
  "G4.coordinates.11": (v) =>
    grid(4, Math.max(n(v, 0), n(v, 1)) + 1, pts([1, n(v, 0)], [3, n(v, 1)])),
  "G5.solids-nets.01": (v) => cube(Math.min(3, n(v, 0))),
  "G5.solids-nets.02": () => box(3, 2, 2),
  "G5.solids-nets.03": (v) => solid("pyramid", n(v, 0)),
  "G5.solids-nets.04": (v) => solid("pyramid", n(v, 0)),
  "G5.solids-nets.05": (v) => solid("prism", n(v, 0)),
  "G5.solids-nets.06": (v) => solid("prism", n(v, 0)),
  "G5.solids-nets.08": (v) => dice([n(v, 0), n(v, 1), n(v, 2)]),
  "G5.solids-nets.10": (v) => cube(n(v, 0)),
  "G6.views.04": (v) => box(n(v, 0), n(v, 1), n(v, 2)),
  "G6.views.07": (_v, l) => compass(l.compass),
  "G6.views.10": (v) => box(n(v, 0), n(v, 1), n(v, 2)),
  "G6.blocks.06": (v) => cube(n(v, 0)),
  "G6.blocks.10": (v) => layers(n(v, 0)),
  "G7.plan.08": (v) =>
    path([
      [0, 0],
      [0, n(v, 0)],
      [0, n(v, 0) - n(v, 1)],
    ]),
  "G7.plan.10": (v) =>
    path([
      [n(v, 1), n(v, 0)],
      [n(v, 1), 0],
      [0, 0],
    ]),
  "G7.plan-1S.04": (v) => pictogram(n(v, 1)),
  "G7.plan-1S.06": (v) => scaleBar(Math.min(12, n(v, 1))),
  "G7.plan-1S.08": (v) => block(n(v, 1), 1),
  "G7.plan-1S.10": (v) => scaleBar(Math.min(12, n(v, 1))),
  // S1 and S2: more tables, pictograms and bars
  "S1.tables.04": (v) => table([[n(v, 1), n(v, 2), "?"]]),
  "S1.tables.05": (v) => table([[n(v, 0), n(v, 1)]]),
  "S1.tables.10": (v) =>
    table([
      [n(v, 0), n(v, 1), n(v, 2)],
      ["?", "?", "?"],
    ]),
  "S1.tables.11": (v) => table([[n(v, 0), n(v, 1)]]),
  "S1.tables.12": (v) => table([[n(v, 0), n(v, 1)]]),
  "S2.bar-line.01": (v) => pictogram(n(v, 1)),
  "S2.bar-line.04": (v) => bars([n(v, 0) + 5]),
  "S2.bar-line.10": (v) => bars([n(v, 0)]),
  // S3 and S7: the numbers of a set
  "S3.mean.01": (v) => numberRow([n(v, 0), n(v, 1)]),
  "S3.mean.02": (v) => numberRow([n(v, 0), n(v, 1), n(v, 2)]),
  "S3.mean.03": (v) => numberRow([n(v, 0), n(v, 1), n(v, 2), n(v, 3)]),
  "S3.mean.04": (v) =>
    bars([
      ...Array<number>(n(v, 2)).fill(n(v, 0)),
      ...Array<number>(n(v, 3)).fill(n(v, 1)),
    ]),
  "S3.mean.07": (v) =>
    numberRow([n(v, 0), n(v, 0) + 1, n(v, 0) + 2, n(v, 0) + 3, n(v, 0) + 4]),
  "S3.mean.08": (v) => bars([n(v, 0), n(v, 1), 0]),
  "S3.mean.09": (v) => bars([n(v, 0), n(v, 1), n(v, 2)]),
  "S3.missing.01": (v) => numberRow([n(v, 1), n(v, 2), "?"]),
  "S3.missing.02": (v) => numberRow([n(v, 1), "?"]),
  "S3.missing.03": (v) => numberRow([n(v, 1), n(v, 2), n(v, 3), "?"]),
  "S3.missing.04": (v) => numberRow([n(v, 0), n(v, 1), n(v, 2), "?"]),
  "S3.missing.06": (v) => numberRow([n(v, 0), n(v, 1), "?"]),
  "S3.missing.07": (v) =>
    stackRows([[n(v, 0), n(v, 1), n(v, 2)], ["?", "?"], ["?"]]),
  "S4.pie.09": (v) => pie([100 / n(v, 1)]),
  "S5.global.05": (v) =>
    lineGraph(
      Array.from({ length: n(v, 2) + 1 }, (_, i) => n(v, 1) + n(v, 0) * i),
    ),
  "S5.global.06": (v) => lineGraph([n(v, 1), n(v, 1) + n(v, 0) * n(v, 2)]),
  "S5.global-1S.02": (v) => lineGraph([n(v, 0), n(v, 0) + n(v, 1)]),
  "S5.global-1S.03": (v) => lineGraph([n(v, 0), n(v, 0) + n(v, 1)]),
  "S5.global-1S.04": (v) => lineGraph([n(v, 0), n(v, 0) + n(v, 1) * n(v, 2)]),
  "S5.global-1S.09": (v) =>
    bars([n(v, 0), n(v, 0) + (n(v, 0) * n(v, 1)) / 100]),
  "S5.global-1S.10": (v) => lineGraph([n(v, 0), n(v, 0) + 2 * n(v, 1)]),
  // S6: rows, beads and matchsticks
  "S6.patterns.01": (v) =>
    numberRow([
      n(v, 0),
      n(v, 0) + n(v, 1),
      n(v, 0) + 2 * n(v, 1),
      n(v, 0) + 3 * n(v, 1),
      "?",
    ]),
  "S6.patterns.02": (v) =>
    numberRow([
      n(v, 0),
      n(v, 0) - n(v, 1),
      n(v, 0) - 2 * n(v, 1),
      n(v, 0) - 3 * n(v, 1),
      "?",
    ]),
  "S6.patterns.03": (v) =>
    numberRow([n(v, 0), n(v, 0) + n(v, 1), n(v, 0) + 2 * n(v, 1), "…"]),
  "S6.patterns.04": (v) =>
    numberRow([n(v, 0), 2 * n(v, 0), 4 * n(v, 0), 8 * n(v, 0), "?"]),
  "S6.patterns.05": (v) => beads(n(v, 0), n(v, 1)),
  "S6.patterns.06": (v) =>
    numberRow([
      n(v, 0),
      n(v, 0) + n(v, 1),
      "?",
      n(v, 0) + 3 * n(v, 1),
      n(v, 0) + 4 * n(v, 1),
    ]),
  "S6.patterns.07": () => numberRow([1, 4, 9, "?"]),
  "S6.patterns.08": (v) => matchsticks(Math.min(5, n(v, 0)), 3),
  "S6.patterns.10": (v) =>
    numberRow([
      n(v, 0),
      n(v, 0) + n(v, 1),
      n(v, 0) + 2 * n(v, 1),
      n(v, 0) + 3 * n(v, 1),
    ]),
  "S6.patterns-1S.01": (v) =>
    numberRow([
      n(v, 0),
      n(v, 0) + 1,
      n(v, 0) + 3,
      n(v, 0) + 6,
      n(v, 0) + 10,
      "?",
    ]),
  "S6.patterns-1S.02": (v) =>
    numberRow([
      n(v, 0),
      n(v, 1),
      n(v, 0) + n(v, 1),
      n(v, 0) + 2 * n(v, 1),
      "?",
    ]),
  "S6.patterns-1S.04": () => numberRow([2, 5, 10, 17, "?"]),
  "S6.patterns-1S.05": (v) => matchsticks(Math.min(5, n(v, 0)), 4),
  "S6.patterns-1S.06": (v) =>
    numberRow([n(v, 0), n(v, 0) + n(v, 1), n(v, 0) + 2 * n(v, 1), "…"]),
  "S6.patterns-1S.08": () => numberRow([1, 8, 27, "?"]),
  "S7.median-mode.01": (v) => numberRow(v.slice(0, 5)),
  "S7.median-mode.02": (v) => numberRow(v.slice(0, 3)),
  "S7.median-mode.03": (v) => numberRow(v.slice(0, 4)),
  "S7.median-mode.04": (v) =>
    numberRow([n(v, 1), n(v, 0), n(v, 2), n(v, 0), n(v, 3), n(v, 0)]),
  "S7.median-mode.05": (v) => numberRow(v.slice(0, 4)),
  "S7.median-mode.07": (v) => numberRow(v.slice(0, 3)),
  "S7.median-mode.09": (v) => numberRow(v.slice(0, 4)),
  "S7.median-mode.10": (v) => numberRow([n(v, 0), n(v, 1), n(v, 2), n(v, 3)]),
  "S7.median-mode.11": (v) =>
    numberRow([n(v, 0), n(v, 1), n(v, 2), n(v, 1), n(v, 0), n(v, 1), n(v, 2)]),
  "S7.median-mode.12": (v) => numberRow(v.slice(0, 7)),
  "G1.shapes.10": () => figures(["square"]),
  "G1.shapes.11": () =>
    figures(["square", "circle", "triangle", "rectangle"], true),
  "G2.angles.09": (v) =>
    path(
      [
        [0, 2],
        [2, 2],
        [2, 0],
        [0, 0],
        [0, 2],
        [2, 2],
        [2, 0],
        [0, 0],
        [0, 2],
        [2, 2],
      ].slice(0, n(v, 0) + 1) as [number, number][],
    ),
  "G3.symmetry.05": (_v, l) => letters(l.letters["G3.symmetry.05"] ?? []),
  "G3.symmetry.06": (_v, l) => letters(l.letters["G3.symmetry.06"] ?? []),
  "G3.symmetry.07": (_v, l) => letters(l.letters["G3.symmetry.07"] ?? []),
  "G3.symmetry.11": () => rectangle(3, 2, true),
  "G5.solids-nets.07": (v) => dice([n(v, 0)]),
  "G5.solids-nets.13": () => gallery([ball(), cube(1), box(3, 2, 2), pencil()]),
  "G6.views.05": (v) => block(n(v, 1), 1),
  "G6.views.08": () => ball(),
  "G6.views.09": () => box(3, 2, 2),
  // M4 to M7 and M11: areas, volumes and circles
  "M4.rect-squares.01": (v) =>
    sized(n(v, 0), n(v, 1), [n(v, 0), n(v, 1)], true),
  "M4.rect-squares.02": (v) =>
    sized(n(v, 0), n(v, 1), [n(v, 0), n(v, 1)], true),
  "M4.rect-squares.03": (v) =>
    sized(n(v, 0), n(v, 0), [n(v, 0), n(v, 0)], true),
  "M4.rect-squares.04": (v) =>
    sized(n(v, 0), n(v, 1), [n(v, 0), n(v, 1)], true),
  "M4.rect-squares.05": (v) =>
    sized(n(v, 0), n(v, 1), [n(v, 0), n(v, 1)], true),
  "M4.rect-squares.06": (v) =>
    sized(n(v, 0), n(v, 1), [n(v, 0), n(v, 1)], true),
  "M4.rect-squares.07": (v) =>
    sized(n(v, 0), n(v, 1), [n(v, 0), n(v, 1)], true),
  "M4.rect-squares.08": (v) => joined([n(v, 0), n(v, 1)], [n(v, 0), n(v, 1)]),
  "M4.rect-squares.09": (v) =>
    sized(n(v, 0), n(v, 0), [n(v, 0), n(v, 0)], true),
  "M4.rect-squares.10": (v) => notched(n(v, 0), n(v, 1), 1, 1),
  "M4.rect-squares.11": (v) => stairs(n(v, 0)),
  "M4.rect-sides.01": (v) => sized(n(v, 0), n(v, 1)),
  "M4.rect-sides.02": (v) => sized(n(v, 0), n(v, 1)),
  "M4.rect-sides.03": (v) => sized(n(v, 0), n(v, 0), [n(v, 0), n(v, 0)]),
  "M4.rect-sides.04": (v) => sized(n(v, 0), n(v, 1), [n(v, 0), "?"]),
  "M4.rect-sides.05": (v) => sized(n(v, 0), n(v, 1)),
  "M4.rect-sides.06": (v) => sized(n(v, 0), n(v, 1)),
  "M4.rect-sides.07": (v) => joined([n(v, 0), n(v, 1)], [n(v, 2), n(v, 3)]),
  "M4.rect-sides.08": (v) => sized(n(v, 0), n(v, 1) / 10, [n(v, 0), n(v, 1)]),
  "M4.rect-sides.09": (v) => sized(n(v, 0), n(v, 1), [n(v, 0), "?"]),
  "M4.rect-sides.10": (v) => joined([n(v, 0), n(v, 1)], [n(v, 2), n(v, 3)]),
  "M4.rect-sides.11": (v) =>
    sized(n(v, 0) * 2, n(v, 1) * 2, [n(v, 0) * 2, n(v, 1) * 2], true),
  "M4.not-rect.01": (v) => joined([n(v, 0), n(v, 1)], [n(v, 2), n(v, 3)]),
  "M4.not-rect.02": (v) => notched(n(v, 0), n(v, 1), n(v, 2), n(v, 3)),
  "M4.not-rect.03": (v) => notched(n(v, 0), n(v, 1), n(v, 2), n(v, 3)),
  "M4.not-rect.04": (v) => framed(n(v, 0), n(v, 1), n(v, 2), n(v, 3)),
  "M4.not-rect.05": (v) => crossOf(n(v, 0)),
  "M4.not-rect.06": (v) =>
    fig([
      [
        [
          [0, 0],
          [n(v, 0), 0],
          [n(v, 0), n(v, 1)],
          [0, n(v, 1)],
        ],
      ],
      [
        [
          [n(v, 0), 0],
          [n(v, 0) + n(v, 2), 0],
          [n(v, 0) + n(v, 2), n(v, 3)],
          [n(v, 0), n(v, 3)],
        ],
      ],
      [
        [
          [n(v, 0) + n(v, 2), 0],
          [n(v, 0) + n(v, 2) + n(v, 4), 0],
          [n(v, 0) + n(v, 2) + n(v, 4), n(v, 5)],
          [n(v, 0) + n(v, 2), n(v, 5)],
        ],
      ],
    ]),
  "M4.not-rect.07": (v) => stairs(n(v, 1), n(v, 0)),
  "M4.not-rect.08": (v) =>
    framed(n(v, 0) + 2 * n(v, 2), n(v, 1) + 2 * n(v, 2), n(v, 0), n(v, 1)),
  "M4.not-rect.09": (v) => joined([n(v, 0), n(v, 1)], [n(v, 2), n(v, 1)]),
  "M4.not-rect.10": (v) => notched(n(v, 0), n(v, 1), n(v, 2), n(v, 2), true),
  "M4.not-rect.11": (v) =>
    fig(
      [
        [
          [
            [0, 0],
            [n(v, 0), 0],
            [n(v, 0), n(v, 0)],
            [0, n(v, 0)],
          ],
        ],
        [
          [
            [n(v, 0), 0],
            [n(v, 0) + n(v, 1), 0],
            [n(v, 0) + n(v, 1), n(v, 1)],
            [n(v, 0), n(v, 1)],
          ],
        ],
      ],
      {
        labels: [
          { x: n(v, 0) / 2, y: n(v, 0) / 2, t: n(v, 0) },
          { x: n(v, 0) + n(v, 1) / 2, y: n(v, 1) / 2, t: n(v, 1) },
        ],
      },
    ),
  "M4.side-from-perimeter.01": () => sized(1, 1, ["?", "?"]),
  "M4.side-from-perimeter.02": (v) => sized(n(v, 0), n(v, 1), [n(v, 0), "?"]),
  "M4.side-from-perimeter.03": () => regular(3),
  "M4.side-from-perimeter.04": () => regular(5),
  "M4.side-from-perimeter.05": (v) => sized(2 * n(v, 0), n(v, 0), ["2×?", "?"]),
  "M4.side-from-perimeter.06": () => regular(6),
  "M4.side-from-perimeter.07": (v) =>
    fig(
      [
        [
          [
            [0, 0],
            [n(v, 1), 0],
            [n(v, 1) / 2, n(v, 0) * 0.9],
          ],
        ],
      ],
      {
        labels: [
          { x: n(v, 1) * 0.2, y: n(v, 0) * 0.5, t: n(v, 0) },
          { x: n(v, 1) / 2, y: -0.4, t: "?" },
        ],
      },
    ),
  "M4.side-from-perimeter.08": () => sized(1, 1, ["?", "?"]),
  "M4.side-from-perimeter.09": (v) => sized(n(v, 0), n(v, 1), [n(v, 0), "?"]),
  "M4.side-from-perimeter.10": () => regular(8),
  "M4.side-from-perimeter.11": () => sized(3, 2, ["3", "2"]),
  "M4.same-area.02": (v) => sized(n(v, 0), n(v, 1), [n(v, 0), "?"]),
  "M4.same-area.06": (v) => sized(n(v, 0), n(v, 1)),
  "M4.same-area.07": (v) => sized(n(v, 0), n(v, 1)),
  "M4.same-area.11": (v) => sized(n(v, 0), n(v, 1)),
  "M5.grid.01": (v) =>
    sized(
      Math.max(3, Math.ceil((n(v, 0) + n(v, 1) / 2) / 3)),
      3,
      ["", ""],
      true,
    ),
  "M5.grid.02": (v) => based(n(v, 0), n(v, 1), true),
  "M5.grid.03": (v) => sized(n(v, 1), n(v, 0), [n(v, 1), n(v, 0)], true),
  "M5.grid.04": (v) =>
    fig(
      [
        [
          [
            [0, 0],
            [n(v, 1), 0],
            [n(v, 1), n(v, 0)],
            [n(v, 3), n(v, 0)],
            [n(v, 3), n(v, 0) + n(v, 2)],
            [0, n(v, 0) + n(v, 2)],
          ],
        ],
      ],
      { grid: true },
    ),
  "M5.grid.05": (v) => notched(n(v, 0), n(v, 1), n(v, 2), 1),
  "M5.grid.07": (v) => sized(n(v, 0), n(v, 1), [n(v, 0), n(v, 1)], true),
  "M5.grid.08": (v) => joined([n(v, 0), n(v, 1)], [n(v, 2), n(v, 3)]),
  "M5.grid.09": (v) => sized(n(v, 0), n(v, 0), ["", ""], true),
  "M5.grid.10": (v) => slanted(n(v, 0), n(v, 1)),
  "M5.grid.11": (v) => stairs(n(v, 0)),
  "M5.sides.01": (v) => sized(n(v, 0), n(v, 1)),
  "M5.sides.02": (v) => sized(n(v, 0), n(v, 1)),
  "M5.sides.03": (v) => sized(n(v, 0), n(v, 0), [n(v, 0), n(v, 0)]),
  "M5.sides.04": (v) => sized(n(v, 0), n(v, 1), [n(v, 0), "?"]),
  "M5.sides.05": (v) => joined([n(v, 0), n(v, 1)], [n(v, 2), n(v, 3)]),
  "M5.sides.06": (v) => notched(n(v, 0), n(v, 1), n(v, 2), n(v, 3), true),
  "M5.sides.07": (v) => sized(n(v, 0), n(v, 1), [n(v, 0), n(v, 1)], true),
  "M5.sides.08": (v) => joined([n(v, 0), n(v, 1)], [n(v, 2), n(v, 3)]),
  "M5.sides.09": (v) => sized(n(v, 0), n(v, 1)),
  "M5.sides.10": () => sized(1, 1, ["?", "?"]),
  "M5.sides.11": (v) => sized(n(v, 0), n(v, 1)),
  "M5.formula.01": (v) => sized(n(v, 0), n(v, 1)),
  "M5.formula.02": (v) => sized(n(v, 0), n(v, 1) / 100, [n(v, 0), n(v, 1)]),
  "M5.formula.03": (v) => sized(n(v, 0), n(v, 1)),
  "M5.formula.04": () => sized(3, 2, ["?", "?"]),
  "M5.formula.05": (v) => slanted(n(v, 0), n(v, 1)),
  "M5.formula.06": (v) => rhombus(n(v, 0), n(v, 1)),
  "M5.formula.07": (v) => sized(n(v, 0), n(v, 1), ["?", n(v, 1)]),
  "M5.formula.08": (v) => notched(n(v, 0), n(v, 1), n(v, 2), n(v, 1)),
  "M5.formula.10": (v) =>
    fig([[box4(0, 0, 1, 1)]], {
      dashed: [[0, 0, 1, 1]],
      labels: [{ x: 0.6, y: 0.35, t: n(v, 0) }],
    }),
  "M5.formula.11": (v) => joined([n(v, 0), n(v, 0)], [n(v, 0), n(v, 0)]),
  "M6.triangle.01": (v) => based(n(v, 0), n(v, 1), true),
  "M6.triangle.02": (v) => based(n(v, 0), n(v, 1)),
  "M6.triangle.03": (v) => based(n(v, 0), n(v, 1), false),
  "M6.triangle.04": (v) =>
    fig([[box4(0, 0, n(v, 0), n(v, 1))]], {
      dashed: [[0, 0, n(v, 0), n(v, 1)]],
      labels: [
        { x: n(v, 0) / 2, y: -0.4, t: n(v, 0) },
        { x: n(v, 0) + 0.6, y: n(v, 1) / 2, t: n(v, 1) },
      ],
    }),
  "M6.triangle.05": (v) =>
    fig(
      [
        [box4(0, 0, n(v, 0), n(v, 1))],
        [
          [
            [0, n(v, 1)],
            [n(v, 0), n(v, 1)],
            [n(v, 0) / 2, n(v, 1) + n(v, 2)],
          ],
        ],
      ],
      {
        labels: [
          { x: n(v, 0) / 2, y: -0.4, t: n(v, 0) },
          { x: -0.6, y: n(v, 1) / 2, t: n(v, 1) },
          { x: n(v, 0) / 2, y: n(v, 1) + n(v, 2) / 3, t: n(v, 2) },
        ],
      },
    ),
  "M6.triangle.06": (v) =>
    fig(
      [
        [
          [
            [0, 0],
            [n(v, 0), 0],
            [n(v, 0) * 0.4, n(v, 1)],
          ],
        ],
        [
          [
            [0, 0],
            [n(v, 0), 0],
            [n(v, 0) * 0.6, -n(v, 2)],
          ],
        ],
      ],
      { labels: [{ x: n(v, 0) / 2, y: 0.4, t: n(v, 0) }] },
    ),
  "M6.triangle.07": (v) =>
    fig(
      [
        [
          [
            [0, 0],
            [n(v, 1), 0],
            [n(v, 1) * 0.3, n(v, 0) * 0.8],
          ],
        ],
      ],
      {
        labels: [
          { x: n(v, 1) / 2, y: -0.4, t: n(v, 1) },
          { x: n(v, 1) * 0.1, y: n(v, 0) * 0.4, t: n(v, 0) },
          { x: n(v, 1) * 0.75, y: n(v, 0) * 0.4, t: n(v, 2) },
        ],
      },
    ),
  "M6.triangle.08": (v) => based(n(v, 0), n(v, 1)),
  "M6.triangle.09": (v) => based(n(v, 0), n(v, 1)),
  "M6.triangle.10": (v) =>
    fig(
      [
        [
          [
            [0, 0],
            [n(v, 0), 0],
            [0, n(v, 1)],
          ],
        ],
      ],
      { grid: true },
    ),
  "M6.triangle.11": (v) => slanted(n(v, 0), n(v, 1), true),
  "M7.by-cubes.01": (v) => cuboid(n(v, 0), n(v, 1), n(v, 2), true),
  "M7.by-cubes.02": (v) => cuboid(n(v, 1), 1, n(v, 0), true),
  "M7.by-cubes.03": (v) => cuboid(n(v, 1), n(v, 0), n(v, 2), true),
  "M7.by-cubes.04": (v) => cuboid(n(v, 0), n(v, 0), n(v, 0), true),
  "M7.by-cubes.05": (v) => cuboid(2, 2, n(v, 0), true),
  "M7.by-cubes.06": (v) => cuboid(n(v, 0), n(v, 1), n(v, 2), true),
  "M7.by-cubes.07": (v) =>
    columns(Array.from({ length: n(v, 0) }, (_, i) => i + 1)),
  "M7.by-cubes.08": (v) => cuboid(n(v, 0), n(v, 0), n(v, 0), true),
  "M7.by-cubes.09": (v) => cuboid(n(v, 0), n(v, 1), n(v, 2), true),
  "M7.by-cubes.10": (v) =>
    columns(
      Array.from({ length: Math.min(n(v, 0), 9) }, () => Math.min(n(v, 1), 12)),
    ),
  "M7.by-cubes.11": (v) => cuboid(n(v, 0), n(v, 1), n(v, 2), true),
  "M7.formula.01": (v) => cuboid(n(v, 0), n(v, 1), n(v, 2)),
  "M7.formula.02": (v) => cuboid(n(v, 0), n(v, 1), n(v, 2)),
  "M7.formula.03": (v) => cuboid(n(v, 0), n(v, 0), n(v, 0)),
  "M7.formula.04": (v) => cuboid(n(v, 0), n(v, 1), n(v, 2)),
  "M7.formula.05": (v) => cuboid(n(v, 0), n(v, 1), n(v, 2)),
  "M7.formula.08": (v) => cuboid(4, 3, n(v, 1)),
  "M7.formula.09": () => cuboid(3, 2, 2),
  "M7.formula.10": (v) => cuboid(n(v, 0), n(v, 1), n(v, 2)),
  "M7.formula.11": (v) => cuboid(n(v, 0), n(v, 1), n(v, 2), true),
  "M11.circle.01": (v) => circle("radius", n(v, 0)),
  "M11.circle.02": (v) => circle("diameter", 2 * n(v, 0)),
  "M11.circle.03": (v) => circle("diameter", n(v, 0)),
  "M11.circle.04": (v) => circle("radius", n(v, 0)),
  "M11.circle.05": (v) => circle("radius", n(v, 0)),
  "M11.circle.06": (v) => circle("diameter", 2 * n(v, 0)),
  "M11.circle.07": () => circle("radius", "?"),
  "M11.circle.08": () => circle("diameter", "?"),
  "M11.circle.09": (v) => circle("semicircle", n(v, 0)),
  "M11.circle.10": (v) => circle("wheel", n(v, 0)),
  "M11.circle.11": (v) => circle("diameter", n(v, 0)),
  "M11.circle.12": (v) => circle("ring", n(v, 0), n(v, 1)),
  "M4.same-area.01": (v) => sized(n(v, 0), n(v, 1), [n(v, 0), "?"]),
  "M4.same-area.03": () => fig([[box4(0, 0, 3, 2)], [box4(4, 0, 2.45, 2.45)]]),
  "M4.same-area.04": () => fig([[box4(0, 0, 4, 3)]], { grid: true }),
  "M4.same-area.05": () => fig([[box4(0, 0, 3, 2)], [box4(4, 0, 2.45, 2.45)]]),
  "M4.same-area.08": () => fig([[box4(0, 0, 4, 3)]], { grid: true }),
  "M4.same-area.09": () => fig([[box4(0, 0, 4, 3)]], { grid: true }),
  "M4.same-area.10": () => fig([[box4(0, 0, 3, 2)], [box4(4, 0, 2.45, 2.45)]]),
  "M5.grid.06": (v) => sized(Math.ceil(n(v, 0) / 3), 3, ["", ""], true),
  "M5.formula.09": () => sized(3, 2, ["?", "?"]),
  "M7.formula.06": () => cuboid(1, 1, 1),
  "M7.formula.07": () => cuboid(1, 1, 1),
  // M: clocks and instruments
  "M2.clock.01": (v) => clock(n(v, 0), n(v, 1)),
  "M2.clock.02": (v) => clock(n(v, 0), n(v, 1)),
  "M2.clock.03": (v) => clock(n(v, 0), n(v, 1)),
  "M2.clock.04": (v) => clock(n(v, 0), n(v, 1)),
  "M13.instruments.01": (v) => ruler(n(v, 0), n(v, 1)),
  "M13.instruments.02": (v) => ruler(0, n(v, 0) + n(v, 1) / 10),
  "M13.instruments.05": (v) => thermometer(2 * n(v, 0)),
  "M13.instruments.06": (v) => thermometer(-n(v, 0)),
  "M13.instruments.07": (v) => thermometer(36 + n(v, 0) / 10, 30, 40),
};
