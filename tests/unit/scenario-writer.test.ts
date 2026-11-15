// REQ-8100, REQ-8254, REQ-8198, REQ-8236: the scenario comes from an agentic loop that plans, writes,
// checks by code, critiques and revises, each step a structured reply.
import { describe, expect, it } from "vitest";
import type { Gateway } from "../../src/server/gateway/gateway.js";
import { writePlan, writeScenario } from "../../src/story/writer.js";

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
    call: async (request: { user: string }) => {
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

describe("the plan of practice in the loop", () => {
  const practising = {
    ...ask,
    lang: "en" as const,
    practise: [
      { skill: "trade" as const, purpose: "learn" as const, checks: 2 },
    ],
    facts: { can: ["Marks: opens code locks"], learning: ["Trade"] },
  };

  it("tells the writer the plan and the facts before it plans", async () => {
    const { gateway, users } = replies(PLAN, OK);
    await writeScenario(gateway, practising);
    expect(users[0]).toContain("trade");
    expect(users[0]).toContain("Marks: opens code locks");
    expect(users[0]).toContain("Trade");
  });

  it("revises a scenario that no encounter accepts a skill of the plan", async () => {
    const { gateway, users } = replies(PLAN, OK, scenario(10), scenario(10));
    await writeScenario(gateway, practising);
    expect(users[3]).toContain("skill_unaccepted:trade");
  });
});

describe("REQ-8318, REQ-8610: the loop reports its steps and the cause of a failure", () => {
  const reporting = () => {
    const steps: [string, number][] = [];
    const faults: string[] = [];
    return {
      steps,
      faults,
      report: {
        step: (name: string, n: number) => {
          steps.push([name, n]);
        },
        fault: (cause: string) => {
          faults.push(cause);
        },
      },
    };
  };

  it("reports each step in order, with the draft's number", async () => {
    const r = reporting();
    const { gateway } = replies(PLAN, OK, scenario(10), GOOD);
    await writeScenario(gateway, { ...ask, report: r.report });
    expect(r.steps).toEqual([
      ["plan", 0],
      ["review", 0],
      ["draft", 1],
      ["critic", 1],
    ]);
    expect(r.faults).toEqual([]);
  });

  it("names a provider failure", async () => {
    const r = reporting();
    await writeScenario(replies().gateway, { ...ask, report: r.report });
    expect(r.faults).toEqual(["provider_failed"]);
  });

  it("names an exhausted budget", async () => {
    const r = reporting();
    const gateway = {
      call: () => Promise.resolve({ ok: false, reason: "budget_exhausted" }),
    } as unknown as Gateway;
    await writeScenario(gateway, { ...ask, report: r.report });
    expect(r.faults).toEqual(["budget_exhausted"]);
  });

  it("names a failed code check when no version passed it", async () => {
    const r = reporting();
    const { gateway } = replies(
      PLAN,
      OK,
      ...Array.from({ length: 7 }, () => scenario(9)),
    );
    await writeScenario(gateway, { ...ask, report: r.report });
    expect(r.faults).toEqual(["check_failed"]);
  });
});

describe("REQ-8310: a prompt on a node reworks its level with one call", () => {
  it("asks for the plan alone and returns it, and reports the step", async () => {
    const { gateway, users } = replies(PLAN);
    const steps: string[] = [];
    const plan = await writePlan(gateway, {
      ...ask,
      report: {
        step: (name) => {
          steps.push(name);
        },
        fault: () => undefined,
      },
    });
    expect(plan?.logline).toBe("l");
    expect(plan?.synopsis).toBe("free the boats");
    expect(users).toHaveLength(1);
    expect(users[0]).toContain("autumn");
    expect(steps).toEqual(["plan"]);
  });

  it("names the cause when the model fails or the reply is not a plan", async () => {
    const faults: string[] = [];
    const report = {
      step: () => undefined,
      fault: (c: string) => {
        faults.push(c);
      },
    };
    expect(await writePlan(replies().gateway, { ...ask, report })).toBeNull();
    expect(
      await writePlan(replies("not json").gateway, { ...ask, report }),
    ).toBeNull();
    expect(faults).toEqual(["provider_failed", "check_failed"]);
  });
});

describe("REQ-8280: the writer reads the child's profile", () => {
  it("puts the profile in the brief of a plan and of a scenario, and nothing where there is none", async () => {
    const withProfile = replies(PLAN);
    await writePlan(withProfile.gateway, {
      ...ask,
      profile: "loves cats and boats",
    });
    expect(withProfile.users[0]).toContain("loves cats and boats");

    const full = replies(PLAN, OK, scenario(10), GOOD);
    await writeScenario(full.gateway, {
      ...ask,
      profile: "loves cats and boats",
    });
    expect(full.users[0]).toContain("loves cats and boats");
    expect(full.users[2]).toContain("loves cats and boats");

    const none = replies(PLAN);
    await writePlan(none.gateway, ask);
    expect(none.users[0]).not.toContain("loves cats");
  });
});
