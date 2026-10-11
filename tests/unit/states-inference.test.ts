// TSK-0526: inferred and cut-off states sit beside the tested state, a cut-off node is no
// gap, and node_obligations is one set keyed by node and kind (SPC-0060, REQ-0960 to REQ-0976).
import { describe, expect, it } from "vitest";
import {
  gapCountOf,
  inferredOf,
  obligationsOf,
} from "../../src/engine/states/inference.js";
import { statesOf } from "../../src/engine/states/rules.js";
import { DAY, logOf, type Try } from "./states-log.js";

const NOW = 100 * DAY;
const SUBTYPES = [
  { id: "a", weight: 0.5 },
  { id: "b", weight: 0.5 },
];
type Pre = { node: string; subtype: string | undefined };
/** A graph stub: the nodes, their levels and their prerequisites, with the subtypes above. */
const graphOf = (ids: string[], prereqs: Record<string, Pre[]> = {}) => ({
  nodes: () => ids.map((id) => ({ id, level: "1F" })),
  subtypes: () => SUBTYPES.map((s) => ({ ...s, level: "1F" })),
  prereqs: (id: string) => prereqs[id] ?? [],
});
const run = (
  node: string,
  from: number,
  verdicts: NonNullable<Try["verdict"]>[],
  fast = true,
): Try[] =>
  verdicts.map((verdict, k) => ({
    id: `${node}-${from}-${k}`,
    node,
    subtype: k % 2 === 0 ? "a" : "b",
    day: from + k,
    verdict,
    ms: fast ? 1000 : 1_000_000,
  }));
const fluentBlock = (node: string, from: number) =>
  run(node, from, ["correct", "correct", "correct", "correct", "correct"]);
const failedBlock = (node: string, from: number) =>
  run(node, from, ["wrong", "wrong", "wrong", "wrong", "wrong"]);

describe("REQ-0962: a fluent block gives each untested ancestor fluent (inferred), and a tagged prerequisite stops the walk", () => {
  it("infers the prerequisite and the one behind it", () => {
    const graph = graphOf(["X", "P", "Q"], {
      X: [{ node: "P", subtype: undefined }],
      P: [{ node: "Q", subtype: undefined }],
    });
    const states = statesOf(graph, logOf(fluentBlock("X", 0)));
    const rows = inferredOf(graph, states, NOW);
    expect(rows.find((r) => r.node === "P")?.inferredState).toBe(
      "fluent (inferred)",
    );
    expect(rows.find((r) => r.node === "Q")?.inferredState).toBe(
      "fluent (inferred)",
    );
  });

  it("gives a subtype's own tagged prerequisite the inference alone", () => {
    const graph = graphOf(["X", "P", "Q"], {
      X: [{ node: "P", subtype: "a" }],
      P: [{ node: "Q", subtype: undefined }],
    });
    const rows = inferredOf(
      graph,
      statesOf(graph, logOf(fluentBlock("X", 0))),
      NOW,
    );
    expect(rows.find((r) => r.node === "P")?.inferredState).toBe(
      "fluent (inferred)",
    );
    expect(rows.find((r) => r.node === "Q")?.inferredState).toBeNull();
  });

  it("does not infer a node tested within 30 days", () => {
    const graph = graphOf(["X", "P"], {
      X: [{ node: "P", subtype: undefined }],
    });
    const log = logOf([...fluentBlock("X", 0), ...run("P", 90, ["correct"])]);
    const rows = inferredOf(graph, statesOf(graph, log), NOW);
    expect(rows.find((r) => r.node === "P")?.inferredState).toBeNull();
  });
});

describe("REQ-0960: a choice-only probe gives no inference", () => {
  it("leaves the prerequisite uninferred when the fluent evidence is a choice probe", () => {
    const graph = graphOf(["X", "P"], {
      X: [{ node: "P", subtype: undefined }],
    });
    const choice: Try[] = [0, 1, 2].map((k) => ({
      id: `c${k}`,
      node: "X",
      subtype: "a",
      day: k,
      purpose: "probe",
      form: "choice",
      options: 4,
      ms: 1000,
    }));
    const states = statesOf(graph, logOf(choice));
    expect(states.find((s) => s.node === "X")?.state).toBe("fluent (probe)");
    expect(
      inferredOf(graph, states, NOW).find((r) => r.node === "P")?.inferredState,
    ).toBeNull();
  });
});

describe("REQ-0964, REQ-0968: a failed block cuts off its untested descendants, and a cut-off node is no gap", () => {
  const graph = graphOf(["X", "D"], { D: [{ node: "X", subtype: undefined }] });
  const log = logOf(failedBlock("X", 0));
  const states = statesOf(graph, log);
  const rows = inferredOf(graph, states, NOW);

  it("marks the untested descendant cut off by X, with isGap false", () => {
    const d = rows.find((r) => r.node === "D");
    expect(d?.inferredState).toBe("not tested, cut off by node X");
    expect(d?.cutBy).toBe("X");
    expect(d?.isGap).toBe(false);
  });

  it("counts the one tested gap and not the cut-off node", () => {
    expect(gapCountOf(rows)).toBe(1);
    expect(rows.filter((r) => r.isGap).map((r) => r.node)).toEqual(["X"]);
  });
});

describe("REQ-0976: the inferred state sits in no estimate or count of tested nodes", () => {
  it("leaves the tested state and the rule of an inferred ancestor unchanged", () => {
    const graph = graphOf(["X", "P"], {
      X: [{ node: "P", subtype: undefined }],
    });
    const states = statesOf(graph, logOf(fluentBlock("X", 0)));
    const p = states.find((s) => s.node === "P");
    expect(p?.state).toBe("not checked");
    expect(p?.rule).toBe("none");
    expect(
      inferredOf(graph, states, NOW).find((r) => r.node === "P")?.inferredState,
    ).toBe("fluent (inferred)");
  });
});

describe("REQ-0970: node_obligations holds one row per node and kind for the Director", () => {
  it("holds a probe owed for each direct descendant of an understands node", () => {
    const graph = graphOf(["X", "D1", "D2"], {
      D1: [{ node: "X", subtype: undefined }],
      D2: [{ node: "X", subtype: undefined }],
    });
    const understands = run(
      "X",
      0,
      ["correct", "correct", "correct", "wrong", "wrong"],
      false,
    );
    const states = statesOf(graph, logOf(understands));
    const rows = obligationsOf(
      graph,
      states,
      inferredOf(graph, states, NOW),
      NOW,
    );
    expect(
      rows.filter((r) => r.kind === "probe_owed").map((r) => r.node),
    ).toEqual(["D1", "D2"]);
  });

  it("holds the node and its prerequisites after a failed island check", () => {
    const graph = graphOf(["Y", "Z"]);
    const states = statesOf(graph, []);
    const rows = obligationsOf(
      graph,
      states,
      inferredOf(graph, states, NOW),
      NOW,
      [{ node: "Y", prereqs: ["Z"] }],
    );
    expect(rows.filter((r) => r.kind === "island").map((r) => r.node)).toEqual([
      "Y",
      "Z",
    ]);
  });

  it("holds a block owed after a probe of 0 out of 2", () => {
    const graph = graphOf(["W"]);
    const probes: Try[] = [
      {
        id: "p1",
        node: "W",
        subtype: "a",
        day: 0,
        purpose: "probe",
        verdict: "wrong",
        ms: 1000,
      },
      {
        id: "p2",
        node: "W",
        subtype: "b",
        day: 1,
        purpose: "probe",
        verdict: "wrong",
        ms: 1000,
      },
    ];
    const states = statesOf(graph, logOf(probes));
    const rows = obligationsOf(
      graph,
      states,
      inferredOf(graph, states, NOW),
      NOW,
    );
    expect(rows.some((r) => r.node === "W" && r.kind === "block_owed")).toBe(
      true,
    );
    expect(rows.some((r) => r.node === "W" && r.kind === "escalation")).toBe(
      true,
    );
  });

  it("holds a stale node and a due review, each once", () => {
    const graph = graphOf(["S"]);
    const states = statesOf(graph, logOf(run("S", 0, ["correct"])));
    const rows = obligationsOf(
      graph,
      states,
      inferredOf(graph, states, NOW),
      NOW,
    );
    expect(
      rows.filter((r) => r.node === "S" && r.kind === "stale"),
    ).toHaveLength(1);
    expect(
      rows.filter((r) => r.node === "S" && r.kind === "review_due"),
    ).toHaveLength(1);
  });

  it("holds at most seven rows per node, one for each kind", () => {
    const graph = graphOf(["X", "P", "D"], {
      X: [{ node: "P", subtype: undefined }],
      D: [{ node: "X", subtype: undefined }],
    });
    const states = statesOf(
      graph,
      logOf([...failedBlock("X", 0), ...run("P", 0, ["wrong"])]),
    );
    const rows = obligationsOf(
      graph,
      states,
      inferredOf(graph, states, NOW),
      NOW,
      [{ node: "X", prereqs: ["P"] }],
    );
    const keys = rows.map((r) => `${r.node}|${r.kind}`);
    expect(new Set(keys).size).toBe(keys.length);
    for (const id of ["X", "P", "D"])
      expect(rows.filter((r) => r.node === id).length).toBeLessThanOrEqual(7);
  });
});
