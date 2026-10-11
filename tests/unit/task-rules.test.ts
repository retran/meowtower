// TSK-0485: the build fails a template whose scored choice, comparison or inputs
// break a rule: a choice takes at least four options, a comparison asks for the
// largest of four or an order of three or four numbers, the sign form is for
// warm-ups, easy unscored tasks and the tutorial only, and a choice never takes
// free input (REQ-0700, REQ-0706, REQ-0708, REQ-0710).
import { describe, expect, it } from "vitest";
import { checkTaskRules, type TaskFacts } from "../../tools/task-rules.js";

const choice = (options: number): TaskFacts => ({
  template: "fixture.choice",
  inputClass: "structured",
  answer: "choice",
  scored: true,
  options,
});

describe("REQ-0700: a choice never takes free input", () => {
  it("fails a free-input template with a choice answer and names it", () => {
    const findings = checkTaskRules([
      {
        template: "fixture.free-choice",
        inputClass: "free",
        answer: "choice",
        scored: true,
        options: 4,
      },
    ]);
    expect(findings).toEqual([
      expect.objectContaining({
        check: "choice_free_input",
        file: "fixture.free-choice",
      }),
    ]);
  });
});

describe("REQ-0706: a scored choice task offers at least four options", () => {
  it("fails three options", () => {
    expect(checkTaskRules([choice(3)])).toEqual([
      expect.objectContaining({ check: "choice_options" }),
    ]);
  });
  it("passes four options", () => {
    expect(checkTaskRules([choice(4)])).toEqual([]);
  });
});

describe("REQ-0708, REQ-0710: a scored comparison asks for the largest of four or an order", () => {
  const comparison = (
    comparisonForm: NonNullable<TaskFacts["comparison"]>,
    extra: Partial<TaskFacts> = {},
  ): TaskFacts => ({
    template: "fixture.compare",
    inputClass: "structured",
    answer: "comparison",
    scored: true,
    comparison: comparisonForm,
    ...extra,
  });

  it("fails a scored sign comparison outside the warm-up tiers", () => {
    expect(checkTaskRules([comparison("sign", { tier: "core" })])).toEqual([
      expect.objectContaining({ check: "comparison_sign" }),
    ]);
  });

  it("passes the sign form under warmup, easy or tutorial", () => {
    for (const tier of ["warmup", "easy", "tutorial"] as const)
      expect(checkTaskRules([comparison("sign", { tier })])).toEqual([]);
  });

  it("passes the largest of four", () => {
    expect(checkTaskRules([comparison("largest", { tier: "core" })])).toEqual(
      [],
    );
  });

  it("passes an order of three or four numbers and fails five", () => {
    expect(
      checkTaskRules([comparison("order", { tier: "core", orderSize: 3 })]),
    ).toEqual([]);
    expect(
      checkTaskRules([comparison("order", { tier: "core", orderSize: 4 })]),
    ).toEqual([]);
    expect(
      checkTaskRules([comparison("order", { tier: "core", orderSize: 5 })]),
    ).toEqual([expect.objectContaining({ check: "comparison_order" })]);
  });
});

describe("Unscored tasks are exempt from the scored rules", () => {
  it("passes an unscored three-option choice", () => {
    expect(checkTaskRules([{ ...choice(3), scored: false }])).toEqual([]);
  });
});
