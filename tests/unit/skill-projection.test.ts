// REQ-8394, REQ-8398, REQ-8400: the skills of a log, from the levels and estimates of the nodes of each domain.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GRAPH_FILE, openGraph } from "../../src/engine/graph.js";
import type { LogEvent } from "../../src/engine/model/observations.js";
import { validateParams } from "../../src/engine/model/params.js";
import { skillsOf } from "../../src/engine/model/project.js";

const graph = openGraph(readFileSync(GRAPH_FILE, "utf8"));
const params = validateParams(
  JSON.parse(readFileSync("content/model.v1.json", "utf8")),
);
const none = { templates: new Set<string>(), nodes: new Set<string>() };

const answer = (
  node: string,
  subtype: string,
  n: number,
  day: number,
  verdict: string,
): LogEvent[] => {
  const itemId = `${node}-${subtype}-${String(n)}-${String(day)}`;
  const ts = new Date(Date.UTC(2026, 0, 1 + day, 12)).toISOString();
  return [
    {
      type: "item_shown",
      ts,
      payload: {
        itemId,
        node,
        subtype,
        purpose: "frontier",
        answerForm: "free",
        options: 0,
        steps: 2,
      },
    },
    {
      type: "attempt_submitted",
      ts,
      payload: { itemId, attemptNo: 1, input: { submittedMs: 2000 } },
    },
    { type: "verdict", ts, payload: { itemId, verdict } },
  ];
};

/** Twelve right answers on every subtype of every node up to a group, over twelve days. */
const masteryUpTo = (group: number, from = 0): LogEvent[] =>
  graph
    .nodes()
    .filter((n) => n.typicalGroup <= group)
    .flatMap((n) =>
      graph
        .subtypes(n.id)
        .flatMap((s) =>
          Array.from({ length: 12 }, (_, i) =>
            answer(n.id, s.id, i, from + i, "correct"),
          ).flat(),
        ),
    );

const skillsFor = (log: LogEvent[]) => skillsOf(graph, log, params, none);

describe("the skills of a log", () => {
  it("shows no skill for a log with no answers, whatever the priors say", () => {
    const got = skillsFor([]);
    expect(got).toHaveLength(9);
    expect(got.every((s) => !s.shown)).toBe(true);
  });

  it("shows only the skill whose domain has an answer, from level 1", () => {
    const got = skillsFor(
      answer("N1", graph.subtypes("N1")[0]?.id ?? "", 0, 0, "correct"),
    );
    expect(got.filter((s) => s.shown).map((s) => s.skill)).toEqual(["marks"]);
    expect(got.find((s) => s.skill === "marks")).toMatchObject({ level: 1 });
  });

  it("reaches a high level in a domain whose nodes are all mastered", () => {
    const got = skillsFor(masteryUpTo(8)).find((s) => s.skill === "mechanics");
    expect(got).toMatchObject({ shown: true });
    expect(got && "level" in got ? got.level : 0).toBeGreaterThanOrEqual(4);
  });

  it("is not shown again after a statistics reset", () => {
    const log = [
      ...masteryUpTo(3),
      { type: "stats_reset", ts: "2026-02-01T00:00:00.000Z", payload: {} },
    ];
    expect(skillsFor(log).every((s) => !s.shown)).toBe(true);
  });
});
