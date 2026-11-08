// REQ-8030, REQ-8032: reaching a level opens what the table ties to it, and a fall of the level
// leaves it open.
import { describe, expect, it } from "vitest";
import {
  checkOpenings,
  loadOpenings,
  openedBy,
} from "../../src/engine/model/openings.js";

const table = [
  { id: "hatch-a", node: "N3", level: 3 },
  { id: "portal-b", node: "N3", level: 5 },
  { id: "door-c", node: "A1", level: 2 },
];

describe("openings", () => {
  it("opens what a reached level ties to, and nothing above it", () => {
    const got = openedBy(table, [
      { node: "N3", start: 1, changes: [{ to: 2 }, { to: 3 }] },
      { node: "A1", start: 1, changes: [] },
    ]);
    expect(got).toEqual(["hatch-a"]);
  });

  it("keeps an opening open after the level falls", () => {
    const got = openedBy(table, [
      {
        node: "N3",
        start: 1,
        changes: [{ to: 2 }, { to: 3 }, { to: 2 }, { to: 1 }],
      },
    ]);
    expect(got).toEqual(["hatch-a"]);
  });

  it("opens nothing for a node with no history", () => {
    expect(openedBy(table, [])).toEqual([]);
  });

  it("reports a repeated id and an unknown node", () => {
    const faults = checkOpenings(
      [...table, { id: "hatch-a", node: "Z9", level: 2 }],
      new Set(["N3", "A1"]),
    );
    expect(faults).toEqual([
      "opening_repeated:hatch-a",
      "opening_node_unknown:hatch-a",
    ]);
  });

  it("reads the shipped table with no fault", () => {
    expect(checkOpenings(loadOpenings(), new Set(["N3", "A1"]))).toEqual([]);
  });
});
