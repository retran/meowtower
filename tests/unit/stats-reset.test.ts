// REQ-8386: a reset starts the knowledge model from nothing, and nothing before it counts.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GRAPH_FILE, openGraph } from "../../src/engine/graph.js";
import { validateParams } from "../../src/engine/model/params.js";
import { knowledgeOf, levelsOf } from "../../src/engine/model/project.js";
import type { LogEvent } from "../../src/engine/model/observations.js";

const graph = openGraph(readFileSync(GRAPH_FILE, "utf8"));
const params = validateParams(
  JSON.parse(readFileSync("content/model.v1.json", "utf8")),
);
const node = graph.nodes()[0];
const subtype = node ? graph.subtypes(node.id)[0] : undefined;
if (!node || !subtype) throw new Error("graph has no node");
const none = { templates: new Set<string>(), nodes: new Set<string>() };

const answer = (i: number, verdict: string): LogEvent[] => {
  const itemId = `i${String(i)}`;
  const ts = new Date(Date.UTC(2026, 0, 1 + i)).toISOString();
  return [
    {
      type: "item_shown",
      ts,
      payload: {
        itemId,
        node: node.id,
        subtype: subtype.id,
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
const rights = Array.from({ length: 14 }, (_, i) =>
  answer(i, "correct"),
).flat();
const reset: LogEvent = {
  type: "stats_reset",
  ts: "2026-02-01T00:00:00.000Z",
  payload: {},
};
const pKnowOf = (log: LogEvent[]): number | undefined =>
  knowledgeOf(graph, log, params).estimates.find(
    (e) => e.node === node.id && e.subtype === subtype.id,
  )?.pKnow;
const levelOfNode = (log: LogEvent[]): number | undefined =>
  levelsOf(graph, log, params, none).find((l) => l.node === node.id)?.level;

describe("a statistics reset", () => {
  it("lets the answers before it count until it is logged", () => {
    expect(pKnowOf(rights)).not.toBe(pKnowOf([]));
  });

  it("returns every ability to where an empty log puts it", () => {
    expect(levelOfNode([...rights, reset])).toBe(levelOfNode([]));
    expect(pKnowOf([...rights, reset])).toBe(pKnowOf([]));
  });

  it("returns the estimates to the prior, with no evidence behind them", () => {
    const after = knowledgeOf(graph, [...rights, reset], params).estimates;
    const empty = knowledgeOf(graph, [], params).estimates;
    expect(after.map((e) => [e.node, e.subtype, e.pKnow, e.nEff])).toEqual(
      empty.map((e) => [e.node, e.subtype, e.pKnow, e.nEff]),
    );
  });

  it("counts the answers after it and none before it", () => {
    const later = answer(40, "wrong").map((e) => ({
      ...e,
      ts: "2026-03-01T00:00:00.000Z",
    }));
    expect(pKnowOf([...rights, reset, ...later])).toBe(pKnowOf(later));
    expect(pKnowOf(later)).not.toBe(pKnowOf([]));
  });

  it("uses only the last reset", () => {
    const again: LogEvent = { ...reset, ts: "2026-02-10T00:00:00.000Z" };
    const mid = answer(20, "correct").map((e) => ({
      ...e,
      ts: "2026-02-05T00:00:00.000Z",
    }));
    expect(pKnowOf([...rights, reset, ...mid, again])).toBe(pKnowOf([]));
  });
});
