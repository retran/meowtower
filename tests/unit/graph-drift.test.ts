// TSK-0502: the base graph equals the RES-0800 fixture field by field, except
// where a `changes` line names the node and the field (REQ-0806). A line excuses
// only the field it names, and a new line is marked new against the previous
// version.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GraphInvalid, openGraph } from "../../src/engine/graph.js";

const base = readFileSync(
  new URL("../fixtures/graph-small.yaml", import.meta.url),
  "utf8",
);
const fixture = readFileSync(
  new URL("../fixtures/res-0800.yaml", import.meta.url),
  "utf8",
);
const withChanges = (lines: string): string =>
  base.replace("changes: []", `changes:\n${lines}`);
const LEVEL_CHANGE =
  '  - { node: N2, field: level, reason: "moved to 1F/1S after the correction" }';

describe("REQ-0806: a level changed without a changes line is graph_drift", () => {
  const drifted = base.replace(
    "    level: 1S\n    typicalGroup: 4",
    "    level: 1F\n    typicalGroup: 4",
  );
  const drifted1F = drifted.replace(
    "{ id: fraction, level: 1S, weight: 1 }",
    "{ id: fraction, level: 1F, weight: 1 }",
  );

  it("refuses the drifted copy and names the node and the field", () => {
    expect(() => openGraph(drifted1F, fixture)).toThrow(GraphInvalid);
    expect(() => openGraph(drifted1F, fixture)).toThrow(
      /graph_drift.*N2.*level/,
    );
  });

  it("passes the same copy with a line naming the node and field and a reason", () => {
    const excused = openGraph(
      withChanges(LEVEL_CHANGE)
        .replace(
          "    level: 1S\n    typicalGroup: 4",
          "    level: 1F\n    typicalGroup: 4",
        )
        .replace(
          "{ id: fraction, level: 1S, weight: 1 }",
          "{ id: fraction, level: 1F, weight: 1 }",
        ),
      fixture,
    );
    expect(excused.graphVersion()).not.toBe(
      openGraph(base, fixture).graphVersion(),
    );
  });

  it("passes the base file equal to the fixture", () => {
    expect(openGraph(base, fixture).graphVersion()).toMatch(/^g-/);
  });
});

describe("REQ-0806: a changes line excuses only the field it names", () => {
  it("refuses a copy that edits another field of the node named in the line", () => {
    const otherField = base
      .replace("    prereqs:\n      - { node: N1 }", "    prereqs: []")
      .replace("    level: 1S", "    level: 1S");
    const bad = withChanges(LEVEL_CHANGE).replace(
      "    typicalGroup: 4\n    subtypes:\n      - { id: fraction, level: 1S, weight: 1 }\n    prereqs:\n      - { node: N1 }",
      "    typicalGroup: 4\n    subtypes:\n      - { id: fraction, level: 1S, weight: 1 }\n    prereqs: []",
    );
    expect(otherField).not.toBe(base);
    expect(() => openGraph(bad, fixture)).toThrow(/graph_drift.*N2.*prereqs/);
  });
});
