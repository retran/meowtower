// REQ-8260 (ADR-3360): keeping a generated adventure makes its encounters nodes of the studio, so the
// parent can read, edit and play each one. The scenario's endings become encounters too, so every
// exit leads to a node; each body passes the check that a save of the form passes.
import { describe, expect, it } from "vitest";
import { checkEncounterBody } from "../../src/server/studio/body-check.js";
import { planEncounters } from "../../src/server/studio/materialize.js";

const encounter = (id: string, over: Record<string, unknown> = {}) => ({
  id,
  place: `Place of ${id}`,
  situation: `Situation of ${id}`,
  goal: "go on",
  people: [{ name: "Tobias", aim: "keep quiet" }],
  pressure: "the water rises",
  checks: 2,
  act: 1,
  beat: "catalyst",
  tension: 2,
  value: { from: "safe", to: "at risk" },
  line: "a",
  subtext: "hidden",
  exits: [] as { when: string; next: string }[],
  ...over,
});

const scenario = {
  start: "n1",
  encounters: [
    encounter("n0", {
      exits: [
        { when: "she wins", next: "n1" },
        { when: "she pays", next: "e1" },
      ],
    }),
    encounter("n1", { exits: [{ when: "she runs", next: "missing" }] }),
  ],
  endings: [
    { id: "e0", outcome: "free" },
    { id: "e1", outcome: "lost" },
  ],
};

const counter = () => {
  let n = 0;
  return () => `id-${String((n += 1))}`;
};

describe("REQ-8260: the nodes a generated scenario makes", () => {
  it("makes the start first, then the other encounters, then the endings", () => {
    const planned = planEncounters(scenario, counter());
    expect(planned.map((p) => p.title)).toEqual([
      "Place of n1",
      "Place of n0",
      "free",
      "lost",
    ]);
  });

  it("points each exit at the node made for its target, and drops one with no target", () => {
    const planned = planEncounters(scenario, counter());
    const byTitle = new Map(planned.map((p) => [p.title, p]));
    const lock = byTitle.get("Place of n1");
    const canal = byTitle.get("Place of n0");
    expect(canal?.body["exits"]).toEqual([
      { when: "she wins", next: lock?.id },
      { when: "she pays", next: byTitle.get("lost")?.id },
    ]);
    expect(lock?.body["exits"]).toBeUndefined();
  });

  it("keeps the writer's own fields and gives an ending its outcome as its situation", () => {
    const planned = planEncounters(scenario, counter());
    const canal = planned.find((p) => p.title === "Place of n0");
    expect(canal?.body).toMatchObject({
      place: "Place of n0",
      situation: "Situation of n0",
      goal: "go on",
      pressure: "the water rises",
      checks: 2,
      people: [{ name: "Tobias", aim: "keep quiet" }],
      act: 1,
      beat: "catalyst",
      tension: 2,
      value: { from: "safe", to: "at risk" },
      line: "a",
      subtext: "hidden",
    });
    expect(planned.find((p) => p.title === "free")?.body).toEqual({
      situation: "free",
    });
  });

  it("makes bodies that pass the check a save of the form passes", () => {
    const planned = planEncounters(
      {
        ...scenario,
        start: "n0",
        encounters: [
          encounter("n0", {
            place: "P".repeat(300),
            situation: "S".repeat(900),
            checks: 9,
            exits: [{ when: "x".repeat(900), next: "n1" }],
          }),
          encounter("n1"),
        ],
      },
      counter(),
    );
    const ids = planned.map((p) => p.id);
    for (const p of planned)
      expect(
        checkEncounterBody(p.body, { self: p.id, siblings: ids }),
        p.title,
      ).toBeNull();
    expect(planned[0]?.title.length).toBeLessThanOrEqual(120);
    expect(planned[0]?.body["checks"]).toBe(6);
  });

  it("makes nothing from a scenario that is not one", () => {
    expect(planEncounters(null, counter())).toEqual([]);
    expect(planEncounters({ encounters: "no" }, counter())).toEqual([]);
    expect(
      planEncounters(
        { encounters: [{ place: "no id" }], endings: [] },
        counter(),
      ),
    ).toEqual([]);
  });
});
