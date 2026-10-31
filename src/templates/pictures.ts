// The picture of each template that has one, by template id (RES-1200). A picture is drawn by code from the
// numbers the template drew, in the order of its `p` list, so it never differs from the text.
import {
  angle,
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

type Draw = (v: number[]) => string;
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
  "G7.plan.01": () => compass(),
  "G7.plan.02": () => compass(),
  "G7.plan.03": () => compass(),
  "G7.plan.04": () => compass(),
  "G7.plan.05": () => compass(),
  "G7.plan.06": () => compass(),
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
