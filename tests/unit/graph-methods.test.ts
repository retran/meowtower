// TSK-0506: M4, M5 and M7 carry a method on every subtype, a formula is 1S, and a
// 1F subtype is squares or sides on M4 and M5 and cubes on M7; no other node carries
// a method (REQ-0816, REQ-0818). Broken copies are made by editing the parsed file
// and writing it back, so the tests don't depend on how the YAML is laid out.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parse, stringify } from "yaml";
import { GRAPH_FILE, GraphInvalid, openGraph } from "../../src/engine/graph.js";

const text = readFileSync(GRAPH_FILE, "utf8");
const graph = openGraph(text);

type Doc = {
  nodes: Record<
    string,
    { subtypes: { id: string; level: string; method?: string }[] }
  >;
};

/** The file with one edit applied to one subtype of one node, written back as YAML. */
function edit(
  node: string,
  sub: string,
  change: (s: Record<string, unknown>) => void,
  drop?: string,
): string {
  const doc = parse(text) as Doc & Record<string, unknown>;
  const list = doc.nodes[node]?.subtypes;
  const index = list?.findIndex((s) => s.id === sub) ?? -1;
  if (list === undefined || index < 0) throw new Error(`no ${sub} in ${node}`);
  const target: Record<string, unknown> = { ...list[index] };
  change(target);
  const kept =
    drop === undefined
      ? target
      : Object.fromEntries(Object.entries(target).filter(([k]) => k !== drop));
  list[index] = kept as Doc["nodes"][string]["subtypes"][number];
  return stringify(doc);
}

describe("REQ-0816: the measurement subtypes carry their methods, and no other node does", () => {
  it("gives each subtype of M4, M5 and M7 a method, and no other node one", () => {
    for (const n of graph.nodes()) {
      const withMethod = graph
        .subtypes(n.id)
        .filter((s) => s.method !== undefined);
      if (["M4", "M5", "M7"].includes(n.id)) {
        expect(withMethod).toHaveLength(graph.subtypes(n.id).length);
      } else {
        expect(withMethod).toHaveLength(0);
      }
    }
  });
});

describe("REQ-0816: a broken method fails the load and names the subtype", () => {
  it("fails a formula subtype of M5 set to 1F", () => {
    const bad = edit("M5", "formula", (s) => (s["level"] = "1F"));
    expect(() => openGraph(bad)).toThrow(/M5.*formula.*1S/);
  });

  it("fails a 1F subtype of M7 given the method squares", () => {
    const bad = edit("M7", "by-cubes", (s) => (s["method"] = "squares"));
    expect(() => openGraph(bad)).toThrow(/M7.*by-cubes.*squares/);
  });

  it("fails an M4 subtype with no method", () => {
    const bad = edit("M4", "rect-sides", () => undefined, "method");
    expect(() => openGraph(bad)).toThrow(GraphInvalid);
    expect(() => openGraph(bad)).toThrow(/M4.*rect-sides.*missing/);
  });
});

describe("REQ-0818: M4's subtypes are the five the record names, with their levels", () => {
  it("gives rect-squares and rect-sides 1F, and the three others 1S", () => {
    const levels = Object.fromEntries(
      graph.subtypes("M4").map((s) => [s.id, s.level]),
    );
    expect(levels).toEqual({
      "rect-squares": "1F",
      "rect-sides": "1F",
      "not-rect": "1S",
      "side-from-perimeter": "1S",
      "same-area": "1S",
    });
  });
});
