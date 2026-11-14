// REQ-8174 (ADR-3270, ADR-0070): what the Director reads of each node for a check the Master asks
// for comes from the log through the knowledge model, never from a stored table, so a sandbox
// that was changed by hand and one that was played give the same reading of the same log.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { DirectorConfig } from "../../src/engine/director/nextTask.js";
import { nodeFactsOf } from "../../src/engine/director/facts.js";
import { GRAPH_FILE, openGraph } from "../../src/engine/graph.js";
import type { LogEvent } from "../../src/engine/model/observations.js";
import { validateParams } from "../../src/engine/model/params.js";

const DAY = 86_400_000;
const NOW = Date.UTC(2026, 0, 20, 12);
const graph = openGraph(readFileSync(GRAPH_FILE, "utf8"));
const params = validateParams(
  JSON.parse(readFileSync("content/model.v1.json", "utf8")),
);
const config = JSON.parse(
  readFileSync("content/director.v1.json", "utf8"),
) as DirectorConfig;

const plain = graph.nodes().find((n) => n.level !== "stretch");
const stretch = graph.nodes().find((n) => n.level === "stretch");
if (!plain || !stretch)
  throw new Error("the graph has no plain and stretch node");
const subtype = graph.subtypes(plain.id)[0]?.id ?? "";

const shown = (node: string, id: string, daysAgo: number): LogEvent[] => {
  const ts = new Date(NOW - daysAgo * DAY).toISOString();
  return [
    {
      type: "item_shown",
      ts,
      payload: {
        itemId: id,
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
      payload: { itemId: id, attemptNo: 1, input: { submittedMs: 2000 } },
    },
    { type: "verdict", ts, payload: { itemId: id, verdict: "correct" } },
  ];
};

const factsOf = (log: LogEvent[]) =>
  nodeFactsOf({ graph, log, params, now: NOW, config });

describe("REQ-8174: the Director's reading of each node, from the log", () => {
  it("lists every node of the graph, with its subtypes and prerequisites", () => {
    const facts = factsOf([]);
    expect(facts.map((f) => f.node)).toEqual(graph.nodes().map((n) => n.id));
    for (const f of facts) {
      expect(f.subtypes.map((s) => s.id)).toEqual(
        graph.subtypes(f.node).map((s) => s.id),
      );
      expect(f.prereqs).toHaveLength(graph.prereqs(f.node).length);
    }
  });

  it("reads a node with no answers as not checked, and a stretch node as not admitted", () => {
    const facts = factsOf([]);
    const p = facts.find((f) => f.node === plain.id);
    const s = facts.find((f) => f.node === stretch.id);
    expect(p).toMatchObject({
      stretch: false,
      state: "not checked",
      lastSeen: null,
      recentShows: 0,
    });
    expect(s).toMatchObject({
      stretch: true,
      admitted: false,
      state: "stretch: not checked",
    });
  });

  it("counts a node's shows inside the window and leaves older ones out", () => {
    const log = [
      ...shown(plain.id, "a", 1),
      ...shown(plain.id, "b", 3),
      ...shown(plain.id, "c", config.recentShowsDays + 5),
    ];
    const f = factsOf(log).find((x) => x.node === plain.id);
    expect(f?.recentShows).toBe(2);
    expect(f?.lastSeen).not.toBeNull();
    expect(f?.lastSeen ?? 0).toBeLessThanOrEqual(NOW);
  });

  it("gives the same reading for the same log", () => {
    const log = shown(plain.id, "a", 2);
    expect(factsOf(log)).toEqual(factsOf(log));
  });
});
