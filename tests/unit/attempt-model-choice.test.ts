// TSK-0487: a word problem that opens with a model choice logs the chosen model
// as its own field, apart from the answer, in version 3 of the attempt event. A
// version 2 event lifts to version 3 with no model choice (REQ-0713, ADR-0020's
// rule for a changed schema).
import { describe, expect, it } from "vitest";
import { createRegistry, EVENT_DEFS } from "../../src/shared/events.js";

const registry = createRegistry(EVENT_DEFS);

const v2 = {
  itemId: "01J0000000000000000000000A",
  attemptNo: 1,
  input: {
    firstKeyMs: 100,
    submittedMs: 2000,
    edits: 0,
    erasures: 0,
    keyPresses: 1,
    focusLosses: { count: 0, totalMs: 0 },
    method: "keypad",
  },
  answer: { entered: "7", parsed: 7 },
  assisted: false,
  hintLevel: 0,
  interrupted: false,
  crossDevice: false,
};

describe("REQ-0713: the chosen model is a field apart from the answer", () => {
  it("lifts a version 2 attempt to version 3 with no model choice", () => {
    const lifted = registry.upcast("attempt_submitted", 2, v2);
    expect(lifted.v).toBe(3);
    expect(lifted.payload).toEqual({ ...v2, modelChoice: null });
  });

  it("validates a version 3 attempt that keeps the model choice apart from the answer", () => {
    const payload = { ...v2, modelChoice: "plan-first" };
    expect(() =>
      registry.validate("attempt_submitted", 3, payload),
    ).not.toThrow();
    expect(payload.answer.entered).toBe("7");
    expect(payload.modelChoice).toBe("plan-first");
  });
});
