// REQ-8100, REQ-8254, REQ-8198, REQ-8236: the scenario comes from an agentic loop that plans, writes,
// checks by code, critiques and revises, each step a structured reply.
import { describe, expect, it } from "vitest";
import type { Gateway } from "../../src/server/gateway/gateway.js";
import { writeScenario } from "../../src/story/writer.js";

const encounter = (i: number, n: number) => ({
  id: `n${String(i)}`,
  place: "the Canal",
  situation: `Encounter ${String(i)}`,
  goal: "go on",
  people: [{ name: "Tobias", aim: "keep quiet" }],
  pressure: "the water rises",
  checks: 2,
  act: (i < 2 ? 1 : i < n - 3 ? 2 : 3) as 1 | 2 | 3,
  beat:
    i === 0
      ? "inciting"
      : i === 1
        ? "first_turn"
        : i === Math.floor(n / 2)
          ? "midpoint"
          : i === n - 3
            ? "low_point"
            : i === n - 2
              ? "climax"
              : i === n - 1
                ? "resolution"
                : "rising",
  tension: i === n - 2 ? 5 : 2,
  value: { from: "safe", to: "at risk" },
  exits: [
    { when: "she wins", next: i === n - 1 ? "e0" : `n${String(i + 1)}` },
    {
      when: "she pays",
      next: i === n - 1 ? "e1" : `n${String(Math.min(i + 2, n - 1))}`,
    },
  ],
});
const scenario = (n: number) =>
  JSON.stringify({
    id: "s1",
    premise: "p",
    conflict: { wants: "w", against: "a", stakes: "s" },
    question: "q",
    start: "n0",
    encounters: Array.from({ length: n }, (_, i) => encounter(i, n)),
    endings: [
      { id: "e0", outcome: "free" },
      { id: "e1", outcome: "lost" },
    ],
  });
const PLAN = JSON.stringify({
  premise: "p",
  want: "free the boats",
  stakes: "the Fair starves",
  twist: "the Tangle hides",
  endings: ["free", "lost"],
});
const GOOD = JSON.stringify({ major: [], minor: ["a small thing"] });
const BAD = JSON.stringify({ major: ["no turn in encounter 3"], minor: [] });

const replies = (...texts: (string | undefined)[]) => {
  const users: string[] = [];
  let i = 0;
  const gateway = {
    call: (request: { user: string }) => {
      users.push(request.user);
      const text = texts[i++];
      return Promise.resolve(
        text === undefined
          ? { ok: false, reason: "provider_failed" }
          : { ok: true, text },
      );
    },
  } as unknown as Gateway;
  return { gateway, users };
};
const ask = {
  bucket: "a1",
  lang: "ru" as const,
  brief: "autumn",
  minChecks: 5,
};

describe("the scenario loop", () => {
  it("plans, writes and critiques, in that order", async () => {
    const { gateway, users } = replies(PLAN, scenario(10), GOOD);
    const done = await writeScenario(gateway, ask);
    expect(done?.scenario.id).toBe("s1");
    expect(done?.revisions).toBe(0);
    expect(users).toHaveLength(3);
    expect(users[1]).toContain("free the boats");
    expect(users[2]).toContain("Encounter 0");
  });

  it("revises with the code's faults before any critique", async () => {
    const { gateway, users } = replies(PLAN, scenario(9), scenario(10), GOOD);
    const done = await writeScenario(gateway, ask);
    expect(done?.revisions).toBe(1);
    expect(users[2]).toContain("encounter_count");
  });

  it("revises with the critic's faults", async () => {
    const { gateway, users } = replies(
      PLAN,
      scenario(10),
      BAD,
      scenario(11),
      GOOD,
    );
    const done = await writeScenario(gateway, ask);
    expect(done?.scenario.encounters).toHaveLength(11);
    expect(users[3]).toContain("no turn in encounter 3");
  });

  it("keeps revising until no major fault is left", async () => {
    const { gateway, users } = replies(
      PLAN,
      scenario(10),
      BAD,
      scenario(11),
      BAD,
      scenario(12),
      BAD,
      scenario(13),
      GOOD,
    );
    const done = await writeScenario(gateway, ask);
    expect(done?.scenario.encounters).toHaveLength(13);
    expect(done?.revisions).toBe(3);
    expect(done?.unresolved).toEqual([]);
    expect(done?.minor).toEqual(["a small thing"]);
    expect(users).toHaveLength(9);
  });

  it("stops at its ceiling and names what is left", async () => {
    const texts = [PLAN, scenario(10)];
    for (let i = 0; i < 12; i += 1) texts.push(BAD, scenario(10));
    const { gateway, users } = replies(...texts);
    const done = await writeScenario(gateway, ask);
    expect(done?.revisions).toBe(6);
    expect(done?.unresolved).toEqual(["no turn in encounter 3"]);
    expect(users).toHaveLength(2 + 6 * 2 + 1);
  });

  it("does not revise for minor faults alone", async () => {
    const { gateway, users } = replies(PLAN, scenario(10), GOOD);
    expect((await writeScenario(gateway, ask))?.revisions).toBe(0);
    expect(users).toHaveLength(3);
  });

  it("gives up when no version is playable", async () => {
    const { gateway } = replies(PLAN, "not json", scenario(9), scenario(9));
    expect(await writeScenario(gateway, ask)).toBeNull();
  });

  it("gives up when the model fails at any step", async () => {
    expect(await writeScenario(replies().gateway, ask)).toBeNull();
    expect(await writeScenario(replies(PLAN).gateway, ask)).toBeNull();
  });

  it("keeps a playable version when the critic fails", async () => {
    const { gateway } = replies(PLAN, scenario(10));
    expect((await writeScenario(gateway, ask))?.scenario.id).toBe("s1");
  });
});
