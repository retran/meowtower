// The picture of each template that has one, by template id (RES-1200). A picture is drawn by code from the
// numbers the template drew, in the order of its `p` list, so it never differs from the text.
import type { PictureLabels } from "./spec.js";
import {
  angle,
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
