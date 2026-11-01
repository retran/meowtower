// REQ-7982, REQ-7984, REQ-8386: the rank of a log, from the levels of its nodes, and the reset.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GRAPH_FILE, openGraph } from "../../src/engine/graph.js";
import type { LogEvent } from "../../src/engine/model/observations.js";
import { validateParams } from "../../src/engine/model/params.js";
import { rankOf } from "../../src/engine/model/project.js";

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
  const itemId = `${node}-${String(n)}-${String(day)}`;
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

const rankFor = (log: LogEvent[]) => rankOf(graph, log, params, none, "UTC");

describe("the rank of a log", () => {
  it("is E for a log with no answers", () => {
    expect(rankFor([]).rank).toBe("E");
  });

  it("rises to D when groups 1 to 4 are mastered", () => {
    const got = rankFor(masteryUpTo(4));
    expect(got.rank).toBe("D");
    expect(got.changes.some((c) => c.to === "D" && !c.fell)).toBe(true);
  });

  it("is E again after a statistics reset", () => {
    const log = [
      ...masteryUpTo(4),
      { type: "stats_reset", ts: "2026-06-01T00:00:00.000Z", payload: {} },
    ];
    expect(rankFor(log).rank).toBe("E");
  });
});
