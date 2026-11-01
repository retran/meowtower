// REQ-8244, REQ-8246, REQ-8204: a scenario is a graph of encounters whose exits are consequences,
// and code refuses one that can't be played.
import { describe, expect, it } from "vitest";
import {
  type Beat,
  checkScenario,
  type Scenario,
  Scenario as Schema,
} from "../../src/story/scenario.js";

const beatOf = (i: number, n: number): Beat => {
  if (i === 0) return "catalyst";
  if (i === 1) return "break_into_two";
  if (i === Math.floor(n / 2)) return "midpoint";
  if (i === n - 3) return "all_is_lost";
  if (i === n - 2) return "finale";
  if (i === n - 1) return "final_image";
  return "fun_and_games";
};
const craft = (i: number, n: number) => ({
  act: (i < 2 ? 1 : i < n - 3 ? 2 : 3) as 1 | 2 | 3,
  beat: beatOf(i, n),
  tension: i === n - 2 ? 5 : Math.min(4, 1 + Math.floor((i * 4) / n)),
  value: { from: "safe", to: "at risk" },
  line: "a" as const,
  subtext: "Tobias hides what he saw",
});

const chain = (n: number): Scenario => ({
  id: "s1",
  premise: "Boats tied together on the Canal",
  conflict: {
    wants: "free the boats",
    against: "the Tangle",
    stakes: "the Fair",
  },
  question: "Will the boats reach the Fair?",
  logline:
    "When the boats tie together, a young hunter must free them, or the Fair starves.",
  kind: "case",
  lines: {
    a: "free the boats",
    b: "trust the boatman",
    c: "a clue to the knitter",
  },
  clock: { what: "the Fair opens at noon", shortens: "the fog comes early" },
  opposition: { who: "the Tangle", why: "it thinks the boats are safer tied" },
  setups: [{ id: "bell", plant: "n1", pays: "n5", what: "the ferry bell" }],
  cliffhanger: {
    kind: "close_a_open_c",
    question: "Who tied the first knot?",
    prepared: "the clue in n5",
    exit: "she reads the thread she saved",
  },
  start: "n0",
  encounters: Array.from({ length: n }, (_, i) => {
    const next = i === n - 1 ? "e0" : `n${String(i + 1)}`;
    const other = i >= n - 2 ? "e1" : `n${String(Math.min(i + 2, n - 2))}`;
    return {
      id: `n${String(i)}`,
      place: "the Canal",
      situation: `Encounter ${String(i)}`,
      goal: "free the boat",
      people: [{ name: "Tobias", aim: "keep quiet" }],
      pressure: "the water rises",
      checks: 2,
      ...craft(i, n),
      exits: [
        { when: "she frees it", next },
        { when: "the rope wins", next: other },
      ],
      attached: ["character:tobias"],
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

  it("needs all three acts and their turning points", () => {
    const s = chain(10);
    const noMidpoint = {
      ...s,
      encounters: s.encounters.map((e) =>
        e.beat === "midpoint" ? { ...e, beat: "fun_and_games" as const } : e,
      ),
    };
    expect(checkScenario(noMidpoint, { minChecks: 0 })).toContain(
      "missing_beat:midpoint",
    );
    const noThird = {
      ...s,
      encounters: s.encounters.map((e) => ({ ...e, act: 1 as const })),
    };
    expect(checkScenario(noThird, { minChecks: 0 })).toContain("missing_act:3");
  });

  it("refuses an act that goes backwards along an exit", () => {
    const s = chain(10);
    const backwards = {
      ...s,
      encounters: s.encounters.map((e, i) =>
        i === 3 ? { ...e, act: 3 as const } : e,
      ),
    };
    expect(checkScenario(backwards, { minChecks: 0 })).toContain(
      "act_backwards:n3",
    );
  });

  it("refuses an encounter that changes no value", () => {
    const s = chain(10);
    const flat = {
      ...s,
      encounters: s.encounters.map((e, i) =>
        i === 2 ? { ...e, value: { from: "safe", to: "safe" } } : e,
      ),
    };
    expect(checkScenario(flat, { minChecks: 0 })).toContain("no_turn:n2");
  });

  it("needs the climax to be the peak and on every path", () => {
    const s = chain(10);
    const low = {
      ...s,
      encounters: s.encounters.map((e) =>
        e.beat === "finale" ? { ...e, tension: 1 } : e,
      ),
    };
    expect(checkScenario(low, { minChecks: 0 })).toContain("finale_not_peak");
    const first = s.encounters[0];
    if (!first) throw new Error("no encounter");
    const skip = {
      ...s,
      encounters: [
        { ...first, exits: [...first.exits, { when: "gives up", next: "e1" }] },
        ...s.encounters.slice(1),
      ],
    };
    expect(checkScenario(skip, { minChecks: 0 })).toContain(
      "path_without_finale",
    );
  });

  it("carries library entries attached to it", () => {
    const s = { ...chain(10), attached: ["place:canal", "fact:tide"] };
    const parsed = Schema.parse(s);
    expect(parsed.attached).toEqual(["place:canal", "fact:tide"]);
    expect(parsed.encounters[0]?.attached).toEqual(["character:tobias"]);
  });

  it("needs a clock unless the adventure is filler", () => {
    const none: Scenario = chain(10);
    delete none.clock;
    expect(checkScenario(none, { minChecks: 0 })).toContain("no_clock");
    expect(
      checkScenario({ ...none, kind: "filler" }, { minChecks: 0 }),
    ).not.toContain("no_clock");
  });

  it("needs each setup planted before it pays", () => {
    const s = chain(10);
    expect(
      checkScenario(
        { ...s, setups: [{ id: "x", plant: "n5", pays: "n1", what: "w" }] },
        { minChecks: 0 },
      ),
    ).toContain("setup_order:x");
    expect(
      checkScenario(
        { ...s, setups: [{ id: "x", plant: "gone", pays: "n1", what: "w" }] },
        { minChecks: 0 },
      ),
    ).toContain("setup_unknown:x");
  });

  it("refuses a logline that names a known name", () => {
    expect(
      checkScenario(
        { ...chain(10), logline: "Tobias frees the boats" },
        { minChecks: 0, names: ["Tobias"] },
      ),
    ).toContain("logline_names:Tobias");
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
