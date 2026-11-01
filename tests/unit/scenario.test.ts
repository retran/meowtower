// REQ-8200, REQ-8204: a scenario is a graph of scenes, and code refuses one that can't be played.
import { describe, expect, it } from "vitest";
import {
  checkScenario,
  type Scenario,
  Scenario as Schema,
} from "../../src/story/scenario.js";

const chain = (n: number): Scenario => ({
  id: "s1",
  premise: "Boats tied together on the Canal",
  start: "s0",
  scenes: Array.from({ length: n }, (_, i) => {
    const next = i === n - 1 ? "e0" : `s${String(i + 1)}`;
    return {
      id: `s${String(i)}`,
      text: `Scene ${String(i)}`,
      options: [{ label: "Go on", next }],
      check: {
        why: "the rope is tight",
        clean: next,
        partial: next,
        alt: i === n - 1 ? "e1" : next,
      },
    };
  }),
  endings: [
    { id: "e0", outcome: "the boats are free" },
    { id: "e1", outcome: "the boats drift away" },
  ],
});

describe("a scenario", () => {
  it("parses as data", () => {
    expect(Schema.safeParse(chain(15)).success).toBe(true);
  });

  it("passes when every path ends and holds the checks asked for", () => {
    expect(checkScenario(chain(15), { minChecks: 10 })).toEqual([]);
  });

  it("holds 15 to 30 scenes and at least two endings", () => {
    expect(checkScenario(chain(14), { minChecks: 0 })).toContain("scene_count");
    expect(checkScenario(chain(31), { minChecks: 0 })).toContain("scene_count");
    expect(
      checkScenario(
        { ...chain(15), endings: chain(15).endings.slice(0, 1) },
        { minChecks: 0 },
      ),
    ).toContain("too_few_endings");
  });

  it("refuses a target that doesn't exist", () => {
    const s = chain(15);
    const first = s.scenes[0];
    if (!first) throw new Error("no scene");
    const broken = {
      ...s,
      scenes: [
        { ...first, options: [{ label: "x", next: "nowhere" }] },
        ...s.scenes.slice(1),
      ],
    };
    expect(checkScenario(broken, { minChecks: 0 })).toContain(
      "unknown_target:s0:nowhere",
    );
  });

  it("refuses a loop, because a path must end", () => {
    const s = chain(15);
    const last = s.scenes[14];
    if (!last) throw new Error("no scene");
    const looped = {
      ...s,
      scenes: [
        ...s.scenes.slice(0, 14),
        { ...last, options: [{ label: "back", next: "s0" }], check: undefined },
      ],
    };
    expect(checkScenario(looped, { minChecks: 0 })).toContain("loop");
  });

  it("refuses a scene no path reaches", () => {
    const s = chain(15);
    const lost = {
      ...s,
      scenes: [
        ...s.scenes,
        {
          id: "lost",
          text: "Nobody comes here",
          options: [{ label: "End", next: "e0" }],
        },
      ],
    };
    expect(checkScenario(lost, { minChecks: 0 })).toContain("unreachable:lost");
  });

  it("refuses a path with too few checks for the Director's plan", () => {
    expect(checkScenario(chain(15), { minChecks: 16 })).toContain(
      "too_few_checks",
    );
  });
});
