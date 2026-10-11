// TSK-0503 to TSK-0505: the 79 maths nodes of RES-0800 load from content/graph.yaml
// with the counts, stretch gates, subtype weights and tagged prerequisites the
// record states (REQ-0800, REQ-0802, REQ-0804).
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GRAPH_FILE, openGraph } from "../../src/engine/graph.js";

const graph = openGraph(readFileSync(GRAPH_FILE, "utf8"));
const all = graph.nodes();
const byDomain = (d: string) => all.filter((n) => n.domain === d);

describe("REQ-0800: the nine domains hold the counts RES-0800 gives", () => {
  it("counts 79 nodes, 69 at 1F, 1S or 1F/1S and 10 at stretch", () => {
    expect(all).toHaveLength(79);
    expect(all.filter((n) => n.level === "stretch")).toHaveLength(10);
    expect(all.filter((n) => n.level !== "stretch")).toHaveLength(69);
  });

  it.each([
    ["N", 8, 1],
    ["A", 17, 3],
    ["F", 8, 0],
    ["D", 7, 1],
    ["P", 7, 1],
    ["M", 14, 2],
    ["G", 7, 1],
    ["S", 7, 1],
    ["T", 4, 0],
  ])(
    "domain %s holds %i nodes of which %i are stretch",
    (d, total, stretch) => {
      expect(byDomain(d)).toHaveLength(total);
      expect(byDomain(d).filter((n) => n.level === "stretch")).toHaveLength(
        stretch,
      );
    },
  );

  it("gives each stretch node a non-empty gate", () => {
    for (const n of all.filter((x) => x.level === "stretch"))
      expect(graph.stretchGate(n.id).length).toBeGreaterThan(0);
  });
});

describe("REQ-0800, REQ-0850: subtypes carry levels and equal weights summing to 1", () => {
  it("makes each 1F/1S node hold a 1F and a 1S subtype", () => {
    for (const n of all.filter((x) => x.level === "1F/1S")) {
      const levels = new Set(graph.subtypes(n.id).map((s) => s.level));
      expect(levels.has("1F") && levels.has("1S")).toBe(true);
    }
  });

  it("sums the ordinary subtype weights of each node to 1", () => {
    for (const n of all) {
      const subs = graph.subtypes(n.id);
      // A stretch node's own subtypes are its ordinary ones; elsewhere the stretch
      // subtypes sit outside the sum (SPC-0050).
      const ordinary =
        n.level === "stretch"
          ? subs
          : subs.filter((s) => s.level !== "stretch");
      const sum = ordinary.reduce((acc, s) => acc + s.weight, 0);
      expect(Math.abs(sum - 1)).toBeLessThan(1e-4);
    }
  });
});

describe("REQ-0802: the five topics have an id and a name and no prerequisite", () => {
  it("lists E1 to E5", () => {
    expect(graph.topics().map((t) => t.id)).toEqual([
      "E1",
      "E2",
      "E3",
      "E4",
      "E5",
    ]);
    expect(graph.topics().every((t) => !("prereqs" in t))).toBe(true);
  });
});

describe("REQ-0806: subtype-tagged prerequisites carry their tag, untagged ones none", () => {
  it("tags F3's same-den and line links and leaves the rest untagged", () => {
    const f3 = graph.prereqs("F3");
    expect(f3).toEqual([
      { node: "F1", subtype: "same-den" },
      { node: "N5", subtype: "line" },
    ]);
    expect(graph.prereqs("N2")).toEqual([{ node: "N1", subtype: undefined }]);
  });
});
