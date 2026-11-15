// REQ-8308 (ADR-3360): a waiting version shows beside the current one with its changes marked. The
// difference is read field by field, so the parent sees what a generator changed and not the whole text.
import { describe, expect, it } from "vitest";
import { diffBodies } from "../../src/client/body-diff.js";

describe("REQ-8308: the changes between two bodies", () => {
  it("lists nothing for equal bodies and leaves an unchanged field out", () => {
    expect(diffBodies({ place: "gate" }, { place: "gate" })).toEqual([]);
    expect(
      diffBodies(
        { place: "gate", goal: "cross" },
        { place: "gate", goal: "run" },
      ),
    ).toEqual([
      { path: "goal", before: "cross", after: "run", change: "changed" },
    ]);
  });

  it("marks a field that was added and one that was removed", () => {
    expect(
      diffBodies({ place: "gate" }, { place: "gate", goal: "run" }),
    ).toEqual([{ path: "goal", before: null, after: "run", change: "added" }]);
    expect(
      diffBodies({ place: "gate", goal: "run" }, { place: "gate" }),
    ).toEqual([
      { path: "goal", before: "run", after: null, change: "removed" },
    ]);
  });

  it("reads inside lists and objects with a path that names the place", () => {
    expect(
      diffBodies(
        { exits: [{ when: "she runs", next: "e2" }] },
        {
          exits: [
            { when: "she waits", next: "e2" },
            { when: "she hides", next: "e3" },
          ],
        },
      ),
    ).toEqual([
      {
        path: "exits.0.when",
        before: "she runs",
        after: "she waits",
        change: "changed",
      },
      {
        path: "exits.1.when",
        before: null,
        after: "she hides",
        change: "added",
      },
      { path: "exits.1.next", before: null, after: "e3", change: "added" },
    ]);
  });

  it("writes numbers and flags as text and treats a missing body as empty", () => {
    expect(diffBodies({ checks: 1 }, { checks: 2 })).toEqual([
      { path: "checks", before: "1", after: "2", change: "changed" },
    ]);
    expect(diffBodies(null, { place: "gate" })).toEqual([
      { path: "place", before: null, after: "gate", change: "added" },
    ]);
  });
});

describe("REQ-8308, REQ-8642: a generated version's scenario and review are not listed leaf by leaf", () => {
  const was = { logline: "a", scenario: { encounters: [{ id: "n0" }] } };
  const now = {
    logline: "b",
    scenario: { encounters: [{ id: "n0" }, { id: "n1" }] },
    review: { unresolved: ["x"] },
  };

  it("shows one row for a collapsed field that changed, with a summary of each side", () => {
    expect(
      diffBodies(was, now, { collapse: ["scenario"], skip: ["review"] }),
    ).toEqual([
      { path: "logline", before: "a", after: "b", change: "changed" },
      {
        path: "scenario",
        before: "1 encounters",
        after: "2 encounters",
        change: "changed",
      },
    ]);
  });

  it("shows no row for a collapsed field that is the same, and leaves a skipped field out", () => {
    expect(
      diffBodies(
        was,
        { ...was, review: { unresolved: [] } },
        {
          collapse: ["scenario"],
          skip: ["review"],
        },
      ),
    ).toEqual([]);
  });
});
