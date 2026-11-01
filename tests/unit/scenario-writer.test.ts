// REQ-8100, REQ-8102, REQ-8198, REQ-8236: the scenario comes from an agentic loop that plans, writes,
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
const GOOD = JSON.stringify({ pass: true, faults: [] });
const BAD = JSON.stringify({ pass: false, faults: ["no turn in encounter 3"] });

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

  it("revises at most twice and keeps the last playable scenario", async () => {
    const { gateway, users } = replies(
      PLAN,
      scenario(10),
      BAD,
      scenario(11),
      BAD,
      scenario(12),
      BAD,
    );
    const done = await writeScenario(gateway, ask);
    expect(done?.scenario.encounters).toHaveLength(12);
    expect(done?.revisions).toBe(2);
    expect(done?.unresolved).toEqual(["no turn in encounter 3"]);
    expect(users).toHaveLength(7);
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
