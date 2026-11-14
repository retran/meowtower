// REQ-8174, REQ-8176 (ADR-3270, ADR-0070): the Director, and not the Master or her words, chooses
// the task of a check. The choice is `nextTask` over the log, so one log gives one answer; the
// slots it has already decided in this log come from the `check_task_chosen` events.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { DirectorConfig } from "../../src/engine/director/nextTask.js";
import { GRAPH_FILE, openGraph } from "../../src/engine/graph.js";
import type { LogEvent } from "../../src/engine/model/observations.js";
import { validateParams } from "../../src/engine/model/params.js";
import { chooseCheckTask } from "../../src/story/check-task.js";

const NOW = Date.UTC(2026, 0, 20, 12);
const graph = openGraph(readFileSync(GRAPH_FILE, "utf8"));
const params = validateParams(
  JSON.parse(readFileSync("content/model.v1.json", "utf8")),
);
const config = JSON.parse(
  readFileSync("content/director.v1.json", "utf8"),
) as DirectorConfig;

const choose = (log: LogEvent[], canGenerate?: (node: string) => boolean) =>
  chooseCheckTask({
    graph,
    params,
    config,
    log,
    now: NOW,
    ...(canGenerate ? { canGenerate } : {}),
  });

const chosen = (
  purpose: "review" | "frontier",
  corridor: boolean,
): LogEvent => ({
  type: "check_task_chosen",
  payload: { encounter: "e", node: "N1", subtype: "a", purpose, corridor },
});

const failed = (n: number): LogEvent[] =>
  Array.from({ length: n }, (_, i) => ({
    type: "verdict",
    payload: {
      itemId: `i${String(i)}`,
      attemptNo: 1,
      verdict: "wrong",
      outcome: "alt",
    },
  }));

describe("REQ-8174: the Director chooses the task of a check", () => {
  it("fills a slot with a node, a subtype and a purpose from the graph", () => {
    const slot = choose([]);
    expect(slot).toBeDefined();
    expect(graph.nodes().map((n) => n.id)).toContain(slot?.node);
    expect(graph.subtypes(slot?.node ?? "").map((s) => s.id)).toContain(
      slot?.subtype,
    );
    expect(["review", "frontier"]).toContain(slot?.purpose);
  });

  it("gives the same slot for the same log", () => {
    expect(choose([])).toEqual(choose([]));
  });

  it("falls back to a frontier slot when a review one has no candidate", () => {
    expect(choose([])).toMatchObject({
      purpose: "frontier",
      why: "no_review_candidate",
    });
  });

  it("counts the review slots this log has decided inside the corridor", () => {
    const after = choose([chosen("review", true)]);
    expect(after?.purpose).toBe("frontier");
    expect(typeof after?.why).toBe("object");
  });

  it("leaves a slot decided outside the corridor out of the counts", () => {
    expect(choose([chosen("review", false)])).toEqual(choose([]));
  });

  it("marks a slot as inside the corridor only where the share is", () => {
    expect(choose([])?.corridor).toBe(true);
    expect(choose(failed(10))?.corridor).toBe(false);
  });

  it("gives no slot where no node has a template to draw from", () => {
    expect(choose([], () => false)).toBeUndefined();
  });
});
