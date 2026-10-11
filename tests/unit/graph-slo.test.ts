// TSK-0507 (rule 5, REQ-0812): every SLO goal is named by a subtype, and every `slo`
// reference names a goal. Checked on the real file and on two broken copies.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  checkSlo,
  GRAPH_FILE,
  openGraph,
  type Graph,
} from "../../src/engine/graph.js";

const text = readFileSync(GRAPH_FILE, "utf8");
const graph = openGraph(text);

describe("REQ-0812: the real file's goals and references agree", () => {
  it("passes rule 5 on the real file", () => {
    expect(() => checkSlo(graph)).not.toThrow();
  });
});

describe("REQ-0812: a goal no subtype names, or a reference to a missing goal, fails", () => {
  it("fails a copy with one extra goal that no subtype names", () => {
    const extra = {
      ...graph,
      sloGoals: () => [
        ...graph.sloGoals(),
        { id: "slo-extra", level: "1F", text: "лишняя" },
      ],
    } as unknown as Graph;
    expect(() => checkSlo(extra)).toThrow(/slo-extra/);
  });

  it("fails a copy where a subtype names slo-999, which is not a goal", () => {
    const first =
      graph.nodes()[0] as typeof graph.nodes extends () => (infer T)[]
        ? T
        : never;
    const sub = graph.subtypes(first.id)[0] as typeof graph.subtypes extends (
      id: string,
    ) => (infer S)[]
      ? S
      : never;
    const bad = {
      ...graph,
      subtypes: (id: string) =>
        graph
          .subtypes(id)
          .map((s) =>
            id === first.id && s.id === sub.id ? { ...s, slo: ["slo-999"] } : s,
          ),
    } as unknown as Graph;
    expect(() => checkSlo(bad)).toThrow(/slo-999/);
  });
});
