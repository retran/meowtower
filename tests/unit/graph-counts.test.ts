// TSK-0505: the counts rule holds the file to 79 nodes in nine domains, and the 17
// split nodes are 1F/1S (REQ-0800, REQ-0814, REQ-0850). A copy that adds, removes
// or moves a node fails the counts rule, whatever a changes line says.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  checkCounts,
  GRAPH_FILE,
  GraphInvalid,
  openGraph,
  type Graph,
} from "../../src/engine/graph.js";

const text = readFileSync(GRAPH_FILE, "utf8");
const graph = openGraph(text);
const list = graph.nodes();

/** A graph whose nodes() differs from the file's, for mutation tests. */
const mutated = (nodes: ReturnType<Graph["nodes"]>): Graph =>
  ({ ...graph, nodes: () => nodes }) as unknown as Graph;

describe("REQ-0800: the real file passes the counts rule", () => {
  it("holds 79 nodes in the nine domains", () => {
    expect(() => checkCounts(graph)).not.toThrow();
  });

  it("loads in under one second", () => {
    const started = performance.now();
    openGraph(text);
    expect(performance.now() - started).toBeLessThan(1000);
  });
});

describe("REQ-0800: a copy that adds, removes or moves a node fails the counts rule", () => {
  it("fails a copy with one node added", () => {
    const first = list[0] as (typeof list)[number];
    const added = [...list, { ...first, id: "N99" }];
    expect(() => checkCounts(mutated(added))).toThrow(GraphInvalid);
  });

  it("fails a copy with one node removed", () => {
    expect(() => checkCounts(mutated(list.slice(1)))).toThrow(/counts/);
  });

  it("fails a copy with one node moved into stretch", () => {
    const moved = list.map((n) =>
      n.id === "N2" ? { ...n, level: "stretch" } : n,
    );
    expect(() => checkCounts(mutated(moved))).toThrow(/counts/);
  });
});

describe("REQ-0814, REQ-0850: the 17 split nodes are 1F/1S, each with a 1F and a 1S subtype", () => {
  const seventeen = [
    "N3",
    "N6",
    "N7",
    "A11",
    "A13",
    "A14",
    "F3",
    "F4",
    "F5",
    "F6",
    "F7",
    "D4",
    "D6",
    "P5",
    "P6",
    "M4",
    "S5",
  ];

  it("lists the 17 nodes at 1F/1S", () => {
    for (const id of seventeen) {
      expect(graph.node(id).level).toBe("1F/1S");
      const levels = new Set(graph.subtypes(id).map((s) => s.level));
      expect(levels.has("1F") && levels.has("1S")).toBe(true);
    }
  });
});
