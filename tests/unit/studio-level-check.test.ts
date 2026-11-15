// REQ-8306 (ADR-3280): an edit of a campaign, an arc or an adventure passes the code's check before it
// is stored, as an encounter's does. The check reads the fields the form shows and lets every other field
// through, so what a generator wrote, such as the whole scenario, is kept as it is.
import { describe, expect, it } from "vitest";
import { checkLevelBody } from "../../src/server/studio/level-check.js";

describe("REQ-8306: what a body above the encounters may hold", () => {
  it("accepts an empty body, a body of the form's fields and a body with fields it does not know", () => {
    expect(checkLevelBody("campaign", {})).toBeNull();
    expect(checkLevelBody("arc", { logline: "A year of fog" })).toBeNull();
    expect(
      checkLevelBody("adventure", {
        logline: "l",
        premise: "p",
        question: "q",
        kind: "case",
        conflict: { wants: "w", against: "a", stakes: "s" },
        scenario: { encounters: [] },
        extra: true,
      }),
    ).toBeNull();
  });

  it("refuses a body that is not an object", () => {
    expect(checkLevelBody("arc", "text")).toMatchObject({
      field: "body",
      code: "not_object",
    });
  });

  it("names a field that is not text, and one that is too long", () => {
    expect(checkLevelBody("campaign", { logline: 5 })).toEqual({
      field: "logline",
      code: "not_text",
      held: "5",
      need: "text",
    });
    expect(checkLevelBody("campaign", { theme: "T".repeat(4001) })).toEqual({
      field: "theme",
      code: "too_long",
      held: "4001",
      need: "4000",
    });
  });

  it("does not refuse a long text again where it is as stored", () => {
    const stored = { premise: "P".repeat(5000) };
    expect(
      checkLevelBody("adventure", { ...stored, logline: "new" }, stored),
    ).toBeNull();
    expect(
      checkLevelBody("adventure", { premise: "P".repeat(5001) }, stored),
    ).toMatchObject({ field: "premise", code: "too_long" });
  });

  it("names a kind that is none of the four, and a conflict that is not an object", () => {
    expect(checkLevelBody("adventure", { kind: "nope" })).toEqual({
      field: "kind",
      code: "unknown_kind",
      held: "nope",
      need: "mythology, case, character or filler",
    });
    expect(checkLevelBody("adventure", { conflict: "x" })).toMatchObject({
      field: "conflict",
      code: "not_object",
    });
    expect(
      checkLevelBody("adventure", { conflict: { wants: 3 } }),
    ).toMatchObject({ field: "conflict.wants", code: "not_text" });
  });

  it("reads each level's own fields only", () => {
    expect(checkLevelBody("campaign", { kind: "nope" })).toBeNull();
    expect(checkLevelBody("arc", { closingQuestion: 7 })).toMatchObject({
      field: "closingQuestion",
    });
  });
});

describe("REQ-8258, REQ-8306: the links of an arc or an adventure lead to the nodes beside it", () => {
  const around = { self: "a1", siblings: ["a1", "a2", "a3"] };
  const check = (body: unknown) =>
    checkLevelBody("arc", body, undefined, around);

  it("accepts links to siblings, written as ids or as objects with `to`", () => {
    expect(check({ links: ["a2", { to: "a3" }] })).toBeNull();
    expect(check({ links: [] })).toBeNull();
  });

  it("names a link that leads nowhere on this level, and one that leads to the node itself", () => {
    expect(check({ links: ["a2", "zz"] })).toEqual({
      field: "links.1",
      code: "unknown_sibling",
      held: "zz",
      need: "a node of this level",
    });
    expect(check({ links: ["a1"] })).toMatchObject({
      field: "links.0",
      code: "own_link",
    });
  });

  it("names links that are not a list, and an entry that is not an id", () => {
    expect(check({ links: "a2" })).toMatchObject({
      field: "links",
      code: "not_object",
      need: "a list",
    });
    expect(check({ links: [5] })).toMatchObject({
      field: "links.0",
      code: "not_text",
    });
  });

  it("does not check links where no siblings are given", () => {
    expect(checkLevelBody("arc", { links: ["zz"] })).toBeNull();
  });
});
