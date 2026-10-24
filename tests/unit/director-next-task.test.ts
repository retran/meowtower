// TSK-0534: a frontier slot takes the candidate node of highest value (ADR-0070, SPC-0070,
// REQ-1002). The terms, the candidate set, the parent-topic cap and the replay of a whole run.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  candidatesOf,
  chooseFrontier,
  type DirectorConfig,
  type NodeFacts,
  nextTask,
  onFrontier,
  parentTopicAllowed,
  staleness,
  valueOf,
} from "../../src/engine/director/nextTask.js";
import { loadParams } from "../../src/engine/model/params.js";

const DAY = 86_400_000;
const NOW = 100 * DAY;
const config = JSON.parse(
  readFileSync(
    new URL("../../content/director.v1.json", import.meta.url),
    "utf8",
  ),
) as DirectorConfig;
const params = loadParams(
  readFileSync(new URL("../../content/model.v1.json", import.meta.url), "utf8"),
);
/** A node that scores on no term: fluent, fresh, certain, with nothing owed. */
const quiet = (over: Partial<NodeFacts> = {}): NodeFacts => ({
  node: "N1",
  stretch: false,
  admitted: false,
  state: "fluent",
  inferredState: null,
  cutBy: null,
  uncertainty: 0,
  lastSeen: NOW,
  obligations: [],
  recheckDue: 0,
  freshMark: 0,
  recentShows: 0,
  prereqs: [],
  subtypes: [{ id: "a", pKnow: 0.97, nEff: 5 }],
  ...over,
});
const value = (n: NodeFacts) => valueOf(n, NOW, config).value;

describe("REQ-1002: each term raises or lowers the value on its own", () => {
  const base = value(quiet());
  it.each([
    ["uncertainty", quiet({ uncertainty: 0.6 })],
    ["time since last seen", quiet({ lastSeen: NOW - 10 * DAY })],
    ["a place on the frontier", quiet({ state: "not checked", lastSeen: NOW })],
    ["an open escalation", quiet({ obligations: ["escalation"] })],
    ["a due review", quiet({ obligations: ["review_due"] })],
    ["an admitted stretch node", quiet({ stretch: true, admitted: true })],
    ["a due lesson recheck", quiet({ recheckDue: 1 })],
    ["a fresh lesson mark", quiet({ freshMark: 1 })],
  ])("raises the value for %s", (_, node) => {
    expect(value(node)).toBeGreaterThan(base);
  });

  it("lowers the value for more shows in the last 3 days", () => {
    expect(value(quiet({ recentShows: 3 }))).toBeLessThan(base);
  });
});

describe("REQ-1002: staleness divides by 7 on the frontier and by 14 elsewhere, at most 1", () => {
  const frontier = quiet({ state: "not checked", lastSeen: NOW - 7 * DAY });
  const other = quiet({ lastSeen: NOW - 7 * DAY });

  it("is 1 for a frontier node and 0.5 for another at 7 days", () => {
    expect(onFrontier(frontier)).toBe(true);
    expect(onFrontier(other)).toBe(false);
    expect(staleness(frontier, NOW, config)).toBe(1);
    expect(staleness(other, NOW, config)).toBe(0.5);
  });

  it("caps both at 1 at 14 days", () => {
    expect(
      staleness({ ...frontier, lastSeen: NOW - 14 * DAY }, NOW, config),
    ).toBe(1);
    expect(staleness({ ...other, lastSeen: NOW - 14 * DAY }, NOW, config)).toBe(
      1,
    );
  });
});

describe("ADR-0070: a node with a lesson mark scores the larger term and never both", () => {
  it("takes recheck over parent topic when both apply", () => {
    const v = valueOf(quiet({ recheckDue: 1, freshMark: 1 }), NOW, config);
    expect(v.terms["mark"]).toBe(config.weights.recheck);
    expect(v.value - valueOf(quiet(), NOW, config).value).toBeCloseTo(
      config.weights.recheck,
      12,
    );
  });
});

describe("REQ-1002: the candidate set", () => {
  const nodes: NodeFacts[] = [
    quiet({ node: "FRONT", state: "not checked" }),
    quiet({ node: "UNSURE", uncertainty: 0.8 }),
    quiet({ node: "OWED", obligations: ["probe_owed"] }),
    quiet({
      node: "STRETCH",
      stretch: true,
      admitted: true,
      state: "stretch: not checked",
    }),
    quiet({ node: "STALE", lastSeen: NOW - 40 * DAY }),
    quiet({ node: "FRESH" }),
    quiet({ node: "CUT", state: "not checked", cutBy: "X" }),
    quiet({
      node: "LOCKED",
      stretch: true,
      admitted: false,
      state: "stretch: not checked",
    }),
  ];

  it("holds the five kinds and leaves out a fresh node, a cut-off node and a locked stretch node", () => {
    expect(candidatesOf(nodes, NOW, config).map((n) => n.node)).toEqual([
      "FRONT",
      "UNSURE",
      "OWED",
      "STRETCH",
      "STALE",
    ]);
  });

  it("lets an island check ask for a cut-off node", () => {
    const cut = quiet({
      node: "CUT",
      state: "not checked",
      cutBy: "X",
      obligations: ["island"],
    });
    expect(candidatesOf([cut], NOW, config)).toHaveLength(1);
  });

  it("leaves out a node with no template", () => {
    expect(
      candidatesOf(nodes, NOW, config, (n) => n !== "FRONT").map((n) => n.node),
    ).not.toContain("FRONT");
  });
});

describe("REQ-1002: among equal values a stale node goes first, oldest first", () => {
  it("breaks a tie by the older last-seen, then the lower identifier", () => {
    const a = quiet({ node: "B", lastSeen: NOW - 50 * DAY });
    const b = quiet({ node: "A", lastSeen: NOW - 60 * DAY });
    expect(chooseFrontier([a, b], NOW, config)?.facts.node).toBe("A");
  });
});

describe("ADR-0070: the parent-topic cap", () => {
  it("allows four tasks a day inside the first days after the mark and no fifth", () => {
    expect(parentTopicAllowed(3, 0, config)).toBe(true);
    expect(parentTopicAllowed(4, 0, config)).toBe(false);
  });

  it("allows none once the days after the mark have passed", () => {
    expect(parentTopicAllowed(0, config.parentTopicDays, config)).toBe(false);
  });
});

describe("TSK-0534: a replay of the same facts gives the same slots", () => {
  const nodes = [
    quiet({
      node: "F1",
      state: "not checked",
      uncertainty: 0.9,
      subtypes: [
        { id: "a", pKnow: 0.5, nEff: 0 },
        { id: "b", pKnow: 0.5, nEff: 2 },
      ],
    }),
    quiet({ node: "F2", state: "understands", uncertainty: 0.5 }),
    quiet({ node: "R1" }),
    quiet({ node: "R2", state: "stable", lastSeen: NOW - 20 * DAY }),
  ];
  const run = () => {
    const slots = [];
    let inCorridor = 0;
    let review = 0;
    for (let i = 0; i < 12; i += 1) {
      const slot = nextTask({
        nodes,
        now: NOW,
        share: 0.75,
        inCorridor,
        reviewAmong: review,
        params,
        config,
      });
      slots.push(slot);
      inCorridor += 1;
      if (slot?.purpose === "review") review += 1;
    }
    return slots;
  };

  it("repeats node, subtype, purpose and reason for every slot", () => {
    expect(run()).toEqual(run());
  });

  it("picks the least-evidenced subtype of the chosen frontier node", () => {
    const slot = nextTask({
      nodes: [nodes[0] as NodeFacts],
      now: NOW,
      share: 0.9,
      inCorridor: 0,
      reviewAmong: 0,
      params,
      config,
    });
    expect(slot).toMatchObject({
      node: "F1",
      subtype: "a",
      purpose: "frontier",
    });
  });

  it("keeps review near a third of the corridor slots and fills them from fluent nodes", () => {
    const slots = run();
    const reviews = slots.filter((s) => s?.purpose === "review");
    expect(reviews.length).toBeGreaterThanOrEqual(3);
    expect(reviews.length).toBeLessThanOrEqual(5);
    expect(reviews.every((s) => s?.node === "R2" || s?.node === "R1")).toBe(
      true,
    );
  });

  it("falls back to the frontier and records the reason when nothing is fit for review", () => {
    const slot = nextTask({
      nodes: [nodes[0] as NodeFacts],
      now: NOW,
      share: 0.5,
      inCorridor: 0,
      reviewAmong: 0,
      params,
      config,
    });
    expect(slot).toMatchObject({
      purpose: "frontier",
      why: "no_review_candidate",
    });
  });
});
