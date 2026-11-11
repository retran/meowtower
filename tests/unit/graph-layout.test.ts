// REQ-8258: the layered layout puts a node right of what leads to it, keeps a loop from hiding the
// graph, and places every node once.
import { describe, expect, it } from "vitest";
import { DEFAULT_SIZE, layoutGraph } from "../../src/client/graph-layout.js";

const at = (l: ReturnType<typeof layoutGraph>, id: string) =>
  l.nodes.find((n) => n.id === id);

describe("the studio's graph layout", () => {
  it("gives an empty graph no size and a single node the origin", () => {
    expect(layoutGraph([])).toMatchObject({ nodes: [], width: 0, height: 0 });
    const one = layoutGraph([{ id: "a", links: [] }]);
    expect(at(one, "a")).toMatchObject({ layer: 0, x: 0, y: 0 });
    expect(one.width).toBe(DEFAULT_SIZE.nodeWidth);
  });

  it("puts a node one layer right of the deepest node that leads to it", () => {
    const l = layoutGraph([
      { id: "a", links: ["b", "d"] },
      { id: "b", links: ["c"] },
      { id: "c", links: ["d"] },
      { id: "d", links: [] },
    ]);
    expect(["a", "b", "c", "d"].map((id) => at(l, id)?.layer)).toEqual([
      0, 1, 2, 3,
    ]);
  });

  it("stacks the nodes of a layer in the order given", () => {
    const l = layoutGraph([
      { id: "root", links: ["x", "y", "z"] },
      { id: "x", links: [] },
      { id: "y", links: [] },
      { id: "z", links: [] },
    ]);
    expect(["x", "y", "z"].map((id) => at(l, id)?.y)).toEqual([0, 88, 176]);
    expect(l.height).toBe(3 * 64 + 2 * 24);
  });

  it("draws a graph that has a loop, leaving the closing edge out of the layering", () => {
    const l = layoutGraph([
      { id: "a", links: ["b"] },
      { id: "b", links: ["a"] },
    ]);
    expect(at(l, "a")?.layer).toBe(0);
    expect(at(l, "b")?.layer).toBe(1);
    expect(l.edges).toHaveLength(2);
  });

  it("ignores a link to a node that does not exist and a link to itself", () => {
    const l = layoutGraph([{ id: "a", links: ["ghost", "a"] }]);
    expect(l.edges).toEqual([]);
  });

  it("places every node exactly once", () => {
    const ids = Array.from({ length: 20 }, (_, i) => `n${String(i)}`);
    const l = layoutGraph(
      ids.map((id, i) => ({ id, links: ids.slice(i + 1, i + 3) })),
    );
    expect(l.nodes.map((n) => n.id).sort()).toEqual([...ids].sort());
  });
});
