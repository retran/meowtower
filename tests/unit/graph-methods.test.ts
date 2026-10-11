// TSK-0506: M4, M5 and M7 carry a method on every subtype, a formula is 1S, and a
// 1F subtype is squares or sides on M4 and M5 and cubes on M7; no other node
// carries a method (REQ-0816, REQ-0818).
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GRAPH_FILE, GraphInvalid, openGraph } from "../../src/engine/graph.js";

const text = readFileSync(GRAPH_FILE, "utf8");
const graph = openGraph(text);

/** Replaces the first `from` inside the block of `node`, up to the next node key. */
function inNode(
  source: string,
  node: string,
  from: string,
  to: string,
): string {
  const head = `\n  ${node}:\n`;
  const start = source.indexOf(head);
  if (start < 0) throw new Error(`no node ${node}`);
  const rest = source.slice(start + head.length);
  const next = rest.search(/\n {2}\S/);
  const stop = next < 0 ? source.length : start + head.length + next;
  const block = source.slice(start, stop);
  if (!block.includes(from)) throw new Error(`no ${from} in ${node}`);
  return source.slice(0, start) + block.replace(from, to) + source.slice(stop);
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
    const bad = inNode(
      text,
      "M5",
      'id: formula, level: "1S"',
      'id: formula, level: "1F"',
    );
    expect(() => openGraph(bad)).toThrow(/M5.*formula.*1S/);
  });

  it("fails a 1F subtype of M7 given the method squares", () => {
    const bad = inNode(text, "M7", "method: cubes", "method: squares");
    expect(() => openGraph(bad)).toThrow(/M7.*by-cubes.*squares/);
  });

  it("fails an M4 subtype with no method", () => {
    const bad = inNode(
      text,
      "M4",
      'id: rect-sides, level: "1F", weight: 0.2, method: sides',
      'id: rect-sides, level: "1F", weight: 0.2',
    );
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
