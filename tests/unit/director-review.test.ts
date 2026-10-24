// TSK-0533: a review task comes from a fluent or stable node the player will probably solve, and
// looks like any other task (ADR-0070, REQ-1012, REQ-1016, REQ-1018).
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  chooseReview,
  expectedChance,
  fillReviewSlot,
  type ReviewNode,
  reviewCandidates,
} from "../../src/engine/director/review.js";
import { pKnowAt, freshPair } from "../../src/engine/model/bkt.js";
import { observationsOf } from "../../src/engine/model/observations.js";
import { loadParams } from "../../src/engine/model/params.js";
import * as api from "../../src/shared/api.js";
import { DAY, logOf } from "./states-log.js";

const params = loadParams(
  readFileSync(new URL("../../content/model.v1.json", import.meta.url), "utf8"),
);
const node = (
  id: string,
  state: ReviewNode["state"],
  pKnow = 0.97,
  lastSeen: number | null = 0,
): ReviewNode => ({
  node: id,
  state,
  lastSeen,
  subtypes: [{ id: "a", pKnow }],
});

describe("REQ-1012: only fluent and stable nodes with a chance of 0.85 qualify", () => {
  const nodes = [
    node("N1", "fluent"),
    node("N2", "stable"),
    // An inferred state sits beside the tested one, so the tested state of N3 is still "not checked".
    node("N3", "not checked"),
    node("N4", "understands"),
  ];

  it("lists the first two and no others", () => {
    expect(reviewCandidates(nodes, params).map((c) => c.node)).toEqual([
      "N1",
      "N2",
    ]);
  });

  it("drops a node whose pKnow has decayed below the chance at a later time", () => {
    const state = { p: 0.97, halfLifeDays: 60, last: 0 };
    const at = (days: number) =>
      node("N1", "fluent", pKnowAt(state, days * DAY));
    expect(reviewCandidates([at(1)], params)).toHaveLength(1);
    expect(reviewCandidates([at(60)], params)).toHaveLength(0);
    expect(expectedChance(0.97, params)).toBeGreaterThanOrEqual(0.85);
    expect(freshPair(0.97, params).p).toBe(0.97);
  });
});

describe("REQ-1012: the review node is the one unchecked for longest", () => {
  it("picks the oldest lastSeen and breaks a tie by the lower identifier", () => {
    const picks = reviewCandidates(
      [
        node("N5", "fluent", 0.97, 30),
        node("N3", "fluent", 0.97, 10),
        node("N2", "stable", 0.97, 10),
        node("N4", "stable", 0.97, 20),
        node("N1", "fluent", 0.97, 25),
      ],
      params,
    );
    expect(chooseReview(picks)?.node).toBe("N2");
  });
});

describe("TSK-0533: with no eligible node a fallback fills the slot and the reason is kept", () => {
  const cold = { node: "C1", subtype: "a", chance: 0.9, lastSeen: null };
  const frontier = { node: "F1", subtype: "a", chance: 0.8, lastSeen: null };

  it("takes the cold-start node first, then the frontier node", () => {
    expect(fillReviewSlot([], { coldStart: cold, frontier })).toEqual({
      pick: cold,
      why: "no_review_candidate",
    });
    expect(fillReviewSlot([], { frontier })).toEqual({
      pick: frontier,
      why: "no_review_candidate",
    });
  });

  it("gives no reason when a review candidate exists", () => {
    const [pick] = reviewCandidates([node("N1", "fluent")], params);
    expect(
      fillReviewSlot(pick ? [pick] : [], { frontier }).why,
    ).toBeUndefined();
  });
});

describe("REQ-1018: a review task is an observation like any other", () => {
  it("enters the model's own list as a graded first attempt", () => {
    const log = logOf([
      { id: "r1", day: 1, purpose: "review" },
      { id: "f1", day: 2, purpose: "frontier" },
    ]);
    expect(observationsOf(log).own.map((o) => o.itemId)).toEqual(["r1", "f1"]);
  });
});

describe("REQ-1016: no play route response carries purpose, flowSlot or why", () => {
  const hidden = ["purpose", "flowSlot", "why"];
  const keysOf = (value: unknown, found = new Set<string>()): Set<string> => {
    if (Array.isArray(value)) value.forEach((v) => keysOf(v, found));
    else if (value && typeof value === "object")
      for (const [k, v] of Object.entries(value)) {
        found.add(k);
        keysOf(v, found);
      }
    return found;
  };

  it("finds none of them in any schema the API module exports", () => {
    const schemas = Object.values(api).filter(
      (v) => v instanceof z.ZodType,
    ) as z.ZodType[];
    expect(schemas.length).toBeGreaterThan(10);
    for (const schema of schemas) {
      const keys = keysOf(z.toJSONSchema(schema, { unrepresentable: "any" }));
      for (const key of hidden) expect(keys.has(key)).toBe(false);
    }
  });
});
