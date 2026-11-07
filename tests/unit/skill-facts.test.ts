// REQ-8408, REQ-8416: the scenario writer is told what the player can do and what she is still
// learning as facts without numbers, and the plan's skills by name, purpose and checks.
import { describe, expect, it } from "vitest";
import type { SkillScore } from "../../src/engine/model/skills.js";
import {
  openedSteps,
  practiseText,
  skillFacts,
} from "../../src/story/skill-facts.js";

const scores: SkillScore[] = [
  { skill: "marks", shown: true, level: 4, percent: 37 },
  { skill: "trade", shown: true, level: 1, percent: 80 },
  { skill: "sharing", shown: false },
];

describe("what the writer is told about the player", () => {
  it("lists what she can do and what she is learning, by skill names and steps", () => {
    const { can, learning } = skillFacts(scores, "en");
    expect(can.join(" ")).toContain("Marks");
    expect(can.join(" ")).toContain("code locks");
    expect(learning.join(" ")).toContain("Trade");
    expect(learning.join(" ")).toContain("Sharing");
  });

  it("holds no digit, so no level, percentage or estimate reaches the writer", () => {
    for (const lang of ["ru", "en", "nl"] as const) {
      const { can, learning } = skillFacts(scores, lang);
      expect([...can, ...learning].join(" ")).not.toMatch(/\d/);
    }
  });

  it("states the plan with each skill's code, name, purpose and checks", () => {
    const text = practiseText(
      [{ skill: "trade", purpose: "learn", checks: 4 }],
      "en",
    );
    expect(text).toContain("trade");
    expect(text).toContain("Trade");
    expect(text).toContain("4");
  });
});

describe("what the Master is told she can do", () => {
  it("lists every step she has opened in each skill and none she has not", () => {
    const steps = openedSteps(scores, "en");
    const marks = steps.find((s) => s.startsWith("Marks"));
    expect(marks).toContain("read a label");
    expect(marks).toContain("code locks");
    expect(marks).not.toContain("forgery");
    expect(steps.find((s) => s.startsWith("Sharing"))).toBeUndefined();
  });

  it("holds no digit, so no level, node or estimate reaches the Master", () => {
    for (const lang of ["ru", "en", "nl"] as const)
      expect(openedSteps(scores, lang).join(" ")).not.toMatch(/\d/);
  });
});
