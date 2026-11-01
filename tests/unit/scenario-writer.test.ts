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
      ? "catalyst"
      : i === 1
        ? "break_into_two"
        : i === Math.floor(n / 2)
          ? "midpoint"
          : i === n - 3
            ? "all_is_lost"
            : i === n - 2
              ? "finale"
              : i === n - 1
                ? "final_image"
                : "fun_and_games",
  tension: i === n - 2 ? 5 : 2,
  value: { from: "safe", to: "at risk" },
  line: "a",
  subtext: "s",
  exits: [
    { when: "she wins", next: i === n - 1 ? "e0" : `n${String(i + 1)}` },
    {
      when: "she pays",
      next: i >= n - 2 ? "e1" : `n${String(Math.min(i + 2, n - 2))}`,
    },
  ],
});
const scenario = (n: number) =>
  JSON.stringify({
    id: "s1",
    premise: "p",
    conflict: { wants: "w", against: "a", stakes: "s" },
    question: "q",
    logline: "l",
    kind: "case",
    lines: { a: "a", b: "b", c: "c" },
    clock: { what: "w", shortens: "s" },
    opposition: { who: "w", why: "y" },
    setups: [],
    cliffhanger: { kind: "new_clue", question: "q", prepared: "p", exit: "e" },
    start: "n0",
    encounters: Array.from({ length: n }, (_, i) => encounter(i, n)),
    endings: [
      { id: "e0", outcome: "free" },
      { id: "e1", outcome: "lost" },
    ],
  });
const PLAN = JSON.stringify({
  logline: "l",
  synopsis: "free the boats",
  treatment: "the whole treatment",
  beats: ["catalyst"],
});
const GOOD = JSON.stringify({ major: [], minor: ["a small thing"] });
const BAD = JSON.stringify({ major: ["no turn in encounter 3"], minor: [] });

const OK = JSON.stringify({ major: [], minor: [] });
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
    const { gateway, users } = replies(PLAN, OK, scenario(10), GOOD);
    const done = await writeScenario(gateway, ask);
    expect(done?.scenario.id).toBe("s1");
    expect(done?.revisions).toBe(0);
    expect(users).toHaveLength(4);
    expect(users[1]).toContain("the whole treatment");
    expect(users[2]).toContain("free the boats");
    expect(users[3]).toContain("Encounter 0");
  });

  it("revises with the code's faults before any critique", async () => {
    const { gateway, users } = replies(
      PLAN,
      OK,
      scenario(9),
      scenario(10),
      GOOD,
    );
    const done = await writeScenario(gateway, ask);
    expect(done?.revisions).toBe(1);
    expect(users[3]).toContain("encounter_count");
  });

  it("revises with the critic's faults", async () => {
    const { gateway, users } = replies(
      PLAN,
      OK,
      scenario(10),
      BAD,
      scenario(11),
      GOOD,
    );
    const done = await writeScenario(gateway, ask);
    expect(done?.scenario.encounters).toHaveLength(11);
    expect(users[4]).toContain("no turn in encounter 3");
  });

  it("keeps revising until no major fault is left", async () => {
    const { gateway, users } = replies(
      PLAN,
      OK,
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
    expect(users).toHaveLength(10);
  });

  it("stops at its ceiling and names what is left", async () => {
    const texts = [PLAN, OK, scenario(10)];
    for (let i = 0; i < 12; i += 1) texts.push(BAD, scenario(10));
    const { gateway, users } = replies(...texts);
    const done = await writeScenario(gateway, ask);
    expect(done?.revisions).toBe(6);
    expect(done?.unresolved).toEqual(["no turn in encounter 3"]);
    expect(users).toHaveLength(3 + 6 * 2 + 1);
  });

  it("does not revise for minor faults alone", async () => {
    const { gateway, users } = replies(PLAN, OK, scenario(10), GOOD);
    expect((await writeScenario(gateway, ask))?.revisions).toBe(0);
    expect(users).toHaveLength(4);
  });

  it("rewrites the treatment when the critic finds a major fault", async () => {
    const { gateway, users } = replies(PLAN, BAD, PLAN, OK, scenario(10), GOOD);
    expect((await writeScenario(gateway, ask))?.scenario.id).toBe("s1");
    expect(users[2]).toContain("no turn in encounter 3");
  });

  it("gives up when no version is playable", async () => {
    const { gateway } = replies(PLAN, OK, "not json", scenario(9), scenario(9));
    expect(await writeScenario(gateway, ask)).toBeNull();
  });

  it("gives up when the model fails at any step", async () => {
    expect(await writeScenario(replies().gateway, ask)).toBeNull();
    expect(await writeScenario(replies(PLAN, OK).gateway, ask)).toBeNull();
  });

  it("keeps a playable version when the critic fails", async () => {
    const { gateway } = replies(PLAN, OK, scenario(10));
    expect((await writeScenario(gateway, ask))?.scenario.id).toBe("s1");
  });
});
