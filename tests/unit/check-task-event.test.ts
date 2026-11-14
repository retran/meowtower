// REQ-8176 (ADR-3270): the Director's choice carries what she tried and why it is hard, so the frame
// author can set the task in her action. A choice written before it has both empty.
import { describe, expect, it } from "vitest";
import { events } from "../../src/shared/events.js";

const v1 = {
  encounter: "e-1",
  node: "N1",
  subtype: "a",
  purpose: "frontier",
  corridor: true,
};

describe("REQ-8176: the version of a choice that carries her action", () => {
  it("upcasts a first-version choice with an empty action", () => {
    expect(events.upcast("check_task_chosen", 1, v1)).toEqual({
      v: 2,
      payload: { ...v1, tried: "", hard: "" },
    });
  });

  it("accepts a second-version choice and refuses one without its action", () => {
    const v2 = { ...v1, tried: "pick the lock", hard: "it is stiff" };
    expect(() => {
      events.validate("check_task_chosen", 2, v2);
    }).not.toThrow();
    expect(() => {
      events.validate("check_task_chosen", 2, v1);
    }).toThrow();
  });
});
