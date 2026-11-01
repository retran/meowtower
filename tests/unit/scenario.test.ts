// REQ-8244, REQ-8246, REQ-8204: a scenario is a graph of encounters whose exits are consequences,
// and code refuses one that can't be played.
import { describe, expect, it } from "vitest";
import {
  checkScenario,
  type Scenario,
  Scenario as Schema,
} from "../../src/story/scenario.js";

const chain = (n: number): Scenario => ({
  id: "s1",
  premise: "Boats tied together on the Canal",
  start: "n0",
  encounters: Array.from({ length: n }, (_, i) => {
    const next = i === n - 1 ? "e0" : `n${String(i + 1)}`;
    const other = i === n - 1 ? "e1" : `n${String(Math.min(i + 2, n - 1))}`;
    return {
      id: `n${String(i)}`,
      place: "the Canal",
      situation: `Encounter ${String(i)}`,
      goal: "free the boat",
      people: [{ name: "Tobias", aim: "keep quiet" }],
      pressure: "the water rises",
      checks: 2,
      exits: [
        { when: "she frees it", next },
        { when: "the rope wins", next: other },
      ],
    };
  }),
  endings: [
    { id: "e0", outcome: "the boats are free" },
    { id: "e1", outcome: "the boats drift away" },
  ],
});

describe("a scenario", () => {
  it("parses as data", () => {
    expect(Schema.safeParse(chain(10)).success).toBe(true);
  });

  it("passes when every path ends and holds the checks asked for", () => {
    expect(checkScenario(chain(10), { minChecks: 10 })).toEqual([]);
  });

  it("holds 10 to 20 encounters and at least two endings", () => {
    expect(checkScenario(chain(9), { minChecks: 0 })).toContain(
      "encounter_count",
    );
    expect(checkScenario(chain(21), { minChecks: 0 })).toContain(
      "encounter_count",
    );
    expect(
      checkScenario(
        { ...chain(10), endings: chain(10).endings.slice(0, 1) },
        { minChecks: 0 },
      ),
    ).toContain("too_few_endings");
  });

  it("refuses a target that doesn't exist", () => {
    const s = chain(10);
    const first = s.encounters[0];
    if (!first) throw new Error("no encounter");
    const broken = {
      ...s,
      encounters: [
        { ...first, exits: [{ when: "x", next: "nowhere" }] },
        ...s.encounters.slice(1),
      ],
    };
    expect(checkScenario(broken, { minChecks: 0 })).toContain(
      "unknown_target:n0:nowhere",
    );
  });

  it("refuses a loop, because a path must end", () => {
    const s = chain(10);
    const last = s.encounters[9];
    if (!last) throw new Error("no encounter");
    const looped = {
      ...s,
      encounters: [
        ...s.encounters.slice(0, 9),
        { ...last, exits: [{ when: "back", next: "n0" }] },
      ],
    };
    expect(checkScenario(looped, { minChecks: 0 })).toContain("loop");
  });

  it("refuses an encounter no path reaches", () => {
    const s = chain(10);
    const first = s.encounters[0];
    if (!first) throw new Error("no encounter");
    const lost = {
      ...s,
      encounters: [...s.encounters, { ...first, id: "lost" }],
    };
    expect(checkScenario(lost, { minChecks: 0 })).toContain("unreachable:lost");
  });

  it("refuses a path with too few checks for the Director's plan", () => {
    expect(checkScenario(chain(10), { minChecks: 99 })).toContain(
      "too_few_checks",
    );
  });

  it("refuses a graph where outcomes rarely change anything", () => {
    const s = chain(10);
    const flat = {
      ...s,
      encounters: s.encounters.map((e) => ({
        ...e,
        exits: [e.exits[0] ?? { when: "x", next: "e0" }],
      })),
    };
    expect(checkScenario(flat, { minChecks: 0 })).toContain("few_branches");
  });
});
