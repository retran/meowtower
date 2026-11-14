// REQ-8174, REQ-8176 (ADR-3270): a task the Director chose for a check waits until the child's
// screen draws it, once, and it is drawn from a template of the node and subtype the Director named.
import { describe, expect, it } from "vitest";
import {
  directedTask,
  pendingCheck,
} from "../../src/server/sandbox/director.js";
import { templates } from "../../src/templates/index.js";

const chosen = (seq: number, node = "N1", purpose = "frontier") => ({
  seq,
  type: "check_task_chosen",
  payload: {
    encounter: "e",
    node,
    subtype: "a",
    purpose,
    corridor: true,
    tried: "pick the lock",
    hard: "it is stiff",
  },
});
const shown = (seq: number, purpose: string) => ({
  seq,
  type: "item_shown",
  payload: { itemId: `i${String(seq)}`, purpose },
});

describe("REQ-8174: the Director's choice waits for the child's screen", () => {
  it("is pending after it is chosen and until a task of its purpose is shown", () => {
    expect(pendingCheck([])).toBeNull();
    expect(pendingCheck([chosen(1)])).toMatchObject({
      seq: 1,
      node: "N1",
      subtype: "a",
      purpose: "frontier",
    });
    expect(pendingCheck([chosen(1), shown(2, "frontier")])).toBeNull();
  });

  it("holds what she tried and why it is hard", () => {
    expect(pendingCheck([chosen(1)])?.situation).toEqual({
      tried: "pick the lock",
      hard: "it is stiff",
    });
  });

  it("is not met by a task the ladder drew", () => {
    expect(pendingCheck([chosen(1), shown(2, "ladder")])).not.toBeNull();
  });

  it("holds the latest choice where two are made before a task shows", () => {
    expect(pendingCheck([chosen(1, "N1"), chosen(3, "N2")])?.node).toBe("N2");
  });
});

describe("REQ-8174: a directed task is drawn from the node the Director named", () => {
  const node = templates[0]?.node ?? "";
  const pending = {
    seq: 5,
    node,
    subtype: templates[0]?.subtype ?? "",
    purpose: "review" as const,
    situation: { tried: "pick the lock", hard: "it is stiff" },
  };

  it("draws a template of the node, with the Director's purpose, the same way each time", () => {
    const a = directedTask(pending);
    expect(a?.template.node).toBe(node);
    expect(a?.purpose).toBe("review");
    expect(a?.situation).toEqual(pending.situation);
    expect(directedTask(pending)?.template.id).toBe(a?.template.id);
    expect(Buffer.from(directedTask(pending)?.base ?? []).toString("hex")).toBe(
      Buffer.from(a?.base ?? []).toString("hex"),
    );
  });

  it("falls back to any template of the node when none has the subtype", () => {
    expect(
      directedTask({ ...pending, subtype: "no-such-subtype" })?.template.node,
    ).toBe(node);
  });

  it("draws nothing for a node with no template", () => {
    expect(directedTask({ ...pending, node: "NONE" })).toBeNull();
  });
});
