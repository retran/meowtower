// TSK-0487: entered steps are matched against every valid solution path, each is
// labelled, an unrecognised step adds no error, and a step-by-step answer's
// credit comes from its final answer and its steps (REQ-0705 to REQ-0848).
import { describe, expect, it } from "vitest";
import {
  matchSteps,
  resultMark,
  stepCredit,
  type ValidPath,
} from "../../src/engine/tasks/steps.js";

/** The problem: 3 · 5 + 3 · 7 and 3 · (5 + 7), with adding in place of multiplying as a trap. */
const paths: ValidPath[] = [
  { steps: ["3 · 5", "3 · 7", "15 + 21"] },
  { steps: ["5 + 7", "3 · 12"] },
];
const structureTraps = ["3 + 5"];

describe("REQ-0705: entered steps match every valid path of the problem", () => {
  it("matches 3 · 5, 3 · 7 and 15 + 21 to the first path", () => {
    const result = matchSteps(
      ["3 · 5", "3 · 7", "15 + 21"],
      paths,
      structureTraps,
    );
    expect(result.path).toBe(0);
  });

  it("matches 5 + 7 and 3 · 12 to the second path", () => {
    const result = matchSteps(["5 + 7", "3 · 12"], paths, structureTraps);
    expect(result.path).toBe(1);
  });
});

describe("REQ-0707, REQ-0709: each step is labelled, and an unrecognised step adds no error", () => {
  it("labels a correct step as correct", () => {
    expect(matchSteps(["3 · 5"], paths, structureTraps).labels).toEqual([
      "correct",
    ]);
  });

  it("labels the right operation with a wrong result as a calculation error", () => {
    expect(matchSteps(["3 · 5 = 16"], paths, structureTraps).labels).toEqual([
      "calculation",
    ]);
  });

  it("labels the wrong operation that matches a structure trap as structure", () => {
    expect(matchSteps(["3 + 5"], paths, structureTraps).labels).toEqual([
      "structure",
    ]);
  });

  it("labels any other step unclassified, and counts it as no error", () => {
    const result = matchSteps(["2 · 9", "hello"], paths, structureTraps);
    expect(result.labels).toEqual(["unclassified", "unclassified"]);
    expect(result.errors).toBe(0);
  });
});

describe("REQ-0774, REQ-0776, REQ-0848: credit is set by the final answer and the steps", () => {
  it("gives full step credit when the steps match one valid path", () => {
    expect(
      stepCredit(true, ["3 · 5", "3 · 7", "15 + 21"], paths, structureTraps),
    ).toBe(1);
  });

  it("gives half step credit when the final answer is right but the steps aren't recognised", () => {
    expect(stepCredit(true, ["hello"], paths, structureTraps)).toBe(0.5);
  });

  it("gives no step credit when the final answer is wrong", () => {
    expect(
      stepCredit(false, ["3 · 5", "3 · 7", "15 + 21"], paths, structureTraps),
    ).toBe(0);
  });

  it("marks the same final answer the same, however the player reached it", () => {
    expect(resultMark(true)).toBe(resultMark(true));
    expect(resultMark(true)).toBe(1);
    expect(resultMark(false)).toBe(0);
  });
});
