// ADR-0470: a node is taught no earlier than its prerequisites, so its typical
// group is never below the group of any prerequisite.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GRAPH_FILE, openGraph } from "../../src/engine/graph.js";

const small = readFileSync(
  new URL("../fixtures/graph-small.yaml", import.meta.url),
  "utf8",
);

describe("ADR-0470: no node is taught before its prerequisite", () => {
  it("refuses N2 in group 2 when its prerequisite N1 is in group 3", () => {
    const bad = small.replace("    typicalGroup: 4", "    typicalGroup: 2");
    expect(() => openGraph(bad)).toThrow(/N2.*typicalGroup 2.*N1/);
  });

  it("accepts a node in the same group as its prerequisite", () => {
    const same = small.replace("    typicalGroup: 4", "    typicalGroup: 3");
    expect(() => openGraph(same)).not.toThrow();
  });

  it("holds on the real file", () => {
    expect(() => openGraph(readFileSync(GRAPH_FILE, "utf8"))).not.toThrow();
  });
});
