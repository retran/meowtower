// TSK-0508: a failed subtype descends to the prerequisites tagged for it, or to the
// untagged ones when none is tagged, and never to all of a node's prerequisites
// (REQ-0810).
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GRAPH_FILE, openGraph } from "../../src/engine/graph.js";

const graph = openGraph(readFileSync(GRAPH_FILE, "utf8"));
const small = openGraph(
  readFileSync(
    new URL("../fixtures/graph-small.yaml", import.meta.url),
    "utf8",
  ),
);

describe("REQ-0810: descent on the real file", () => {
  it("sends M1.decimal to D3 and not to N3", () => {
    expect(graph.descentTargets("M1", "decimal")).toEqual(["D3"]);
  });

  it("sends M5.grid to A3 and not to another prerequisite of M5", () => {
    expect(graph.descentTargets("M5", "grid")).toEqual(["A3"]);
  });
});

describe("REQ-0810: tagged and untagged prerequisites on the small fixture", () => {
  it("gives an untagged subtype the untagged prerequisites only", () => {
    expect(small.descentTargets("N2", "compose")).toEqual(["N1"]);
  });

  it("gives a tagged subtype the tagged prerequisites only", () => {
    expect(small.descentTargets("N3", "blocks")).toEqual([]);
    expect(small.descentTargets("N3", "fraction")).toEqual(["N2"]);
  });
});

describe("REQ-0810: a node with no prerequisites descends to nothing", () => {
  it("returns an empty list for N1", () => {
    expect(small.descentTargets("N1", "whole")).toEqual([]);
  });
});
