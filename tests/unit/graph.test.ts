// TSK-0486: one computation graph gives the solution, the three hints and the
// explanation of every trap. Every number written in them is a graph value or a
// given, and every trap the template lists has an explanation (REQ-1214,
// REQ-1234).
import { describe, expect, it } from "vitest";
import { Q } from "../../src/math/q.js";
import {
  type Graph,
  type Trap,
  valueOf,
  evaluate,
  explanation,
  hints,
  solution,
  strayNumbers,
  wrongAnswer,
} from "../../src/engine/tasks/graph.js";
import { checkExplainCoverage } from "../../tools/task-rules.js";

const q = (n: number, d = 1): Q => Q.of(BigInt(n), BigInt(d));

/** 12 · 5 = 60, then 60 + 1 = 61 is the answer. */
const graph: Graph = {
  givens: [
    { id: "a", value: q(12) },
    { id: "b", value: q(5) },
    { id: "one", value: q(1) },
  ],
  steps: [
    { id: "p", op: "mul", args: ["a", "b"] },
    { id: "s", op: "add", args: ["p", "one"] },
  ],
  answer: "s",
};

const skip: Trap = {
  id: "skip",
  apply: (values) => valueOf(values, "p"),
};

describe("REQ-1234: a trap's apply computes its wrong answer in Q", () => {
  it("gives the skip trap its wrong answer from the graph's values", () => {
    const values = evaluate(graph);
    expect(wrongAnswer(skip, values).toString()).toBe("60");
    expect(valueOf(values, graph.answer).toString()).toBe("61");
  });
});

describe("REQ-1214: every number in the solution, hints and explanation is a graph value or a given", () => {
  const values = evaluate(graph);
  const allowed = [...values.values(), wrongAnswer(skip, values)];

  it("writes no stray number in a solution built from the graph", () => {
    expect(strayNumbers(solution(graph, values), allowed)).toEqual([]);
  });

  it("writes no stray number in the three hints", () => {
    const texts = hints(graph, values, [
      "Start with {a} and {b}.",
      "Multiply {a} {op} {b}, which is {p}.",
      "Add {one} to get {answer}.",
    ]);
    expect(strayNumbers(texts, allowed)).toEqual([]);
  });

  it("writes no stray number in an explanation of a trap", () => {
    const text = explanation(
      graph,
      values,
      "A skip gives {p} instead of {answer}.",
    );
    expect(strayNumbers([text], allowed)).toEqual([]);
  });

  it("flags a fixture that writes a number from neither the graph nor the givens", () => {
    const text = explanation(graph, values, "The answer is 99 here.");
    expect(strayNumbers([text], allowed)).toEqual(["99"]);
  });
});

describe("REQ-1214: a template lists an explanation for each trap", () => {
  it("fails a trap with no explanation and names the template and the trap", () => {
    const findings = checkExplainCoverage([
      { template: "fixture.graph", traps: ["skip"], explain: {} },
    ]);
    expect(findings).toEqual([
      expect.objectContaining({
        check: "explain_missing",
        file: "fixture.graph",
        match: "skip",
      }),
    ]);
  });

  it("passes when every trap has an explanation", () => {
    expect(
      checkExplainCoverage([
        {
          template: "fixture.graph",
          traps: ["skip"],
          explain: { skip: "A skip gives {p}." },
        },
      ]),
    ).toEqual([]);
  });
});
