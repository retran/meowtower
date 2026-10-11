// TSK-0520: a node's estimate is the weighted mean of its subtypes', its uncertainty
// is H(pKnow) * 3 / (3 + nEff), and every node of the graph has a row (ADR-0060,
// REQ-0910, REQ-0988, REQ-0994).
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { type PairState, freshPair } from "../../src/engine/model/bkt.js";
import {
  binaryEntropy,
  nEffOf,
  nodeEstimate,
  rowsOf,
  uncertaintyOf,
} from "../../src/engine/model/aggregate.js";
import { GRAPH_FILE, openGraph } from "../../src/engine/graph.js";
import type { Observation } from "../../src/engine/model/observations.js";
import { loadParams } from "../../src/engine/model/params.js";
import { priorOf, rowOf } from "../../src/engine/model/priors.js";

const params = loadParams(
  readFileSync(new URL("../../content/model.v1.json", import.meta.url), "utf8"),
);
const DAY = 86_400_000;
const obs = (over: Partial<Observation>): Observation => ({
  itemId: "i",
  node: "N1",
  subtype: "a",
  c: 1,
  w: 1,
  timeMs: 0,
  at: 0,
  form: "free",
  options: 0,
  steps: 1,
  postFeedback: false,
  timeCounts: true,
  control: false,
  ...over,
});

describe("REQ-0910: a node's estimate is the weighted mean of its subtypes'", () => {
  it("gives 0,54 for weights 0,5 0,3 0,2 and estimates 0,8 0,4 0,1", () => {
    expect(
      nodeEstimate([
        { weight: 0.5, p: 0.8 },
        { weight: 0.3, p: 0.4 },
        { weight: 0.2, p: 0.1 },
      ]),
    ).toBeCloseTo(0.54, 12);
  });
});

describe("REQ-0988: the uncertainty", () => {
  it("is the full entropy of the prior with no evidence, half of it after three fresh observations", () => {
    const full = binaryEntropy(0.55);
    expect(uncertaintyOf(0.55, 0)).toBeCloseTo(full, 12);
    expect(uncertaintyOf(0.55, 3)).toBeCloseTo(full / 2, 12);
  });

  it("is higher again when the same observations are one half-life old", () => {
    const fresh = uncertaintyOf(0.55, 3);
    const aged = uncertaintyOf(0.55, 3 * 0.5);
    expect(aged).toBeGreaterThan(fresh);
  });
});

describe("REQ-0988: nEff on a node row and on a subtype row", () => {
  it("sums the node's observation weights, each aged by its pair's half-life", () => {
    const halfLife = () => 60;
    const now = 60 * DAY;
    const log = [
      obs({ subtype: "a", at: 0 }),
      obs({ subtype: "b", at: 0, w: 0.5 }),
    ];
    expect(nEffOf(log, halfLife, now)).toBeCloseTo(0.5 + 0.25, 12);
    expect(
      nEffOf(
        log.filter((o) => o.subtype === "a"),
        halfLife,
        now,
      ),
    ).toBeCloseTo(0.5, 12);
  });
});

describe("REQ-0994: every node and subtype of the real graph has a row, for either school group", () => {
  const graph = openGraph(readFileSync(GRAPH_FILE, "utf8"));
  const now = 1_000 * DAY;
  const rowsFor = (group: number) => {
    const log =
      group === 7
        ? []
        : [
            {
              type: "settings_changed",
              payload: { key: "schoolGroup", value: 8 },
            },
          ];
    const row = rowOf(log);
    return rowsOf(
      graph,
      [],
      new Map<string, PairState>(),
      (_n, _s, level) => priorOf(params, row, level as "1F" | "1S" | "stretch"),
      now,
    );
  };

  it.each([7, 8])(
    "gives a node row for each of the 79 nodes, the stretch ones marked, for group %i",
    (group) => {
      const rows = rowsFor(group);
      const nodeRows = rows.filter((r) => r.subtype === null);
      expect(nodeRows).toHaveLength(79);
      expect(
        nodeRows.filter((r) => r.state === "stretch: not checked"),
      ).toHaveLength(10);
      expect(nodeRows.filter((r) => r.state === "not checked")).toHaveLength(
        69,
      );
    },
  );

  it("gives every node its prior with the full uncertainty", () => {
    const row = rowsFor(7).find((r) => r.node === "N1" && r.subtype === null);
    expect(row?.nEff).toBe(0);
    expect(row?.uncertainty).toBeCloseTo(binaryEntropy(row?.pKnow ?? 0), 12);
  });
});

describe("REQ-0988: a pair's state is its prior when it has no observation", () => {
  it("keeps a fresh pair at its prior", () => {
    expect(freshPair(0.25, params).p).toBe(0.25);
  });
});
