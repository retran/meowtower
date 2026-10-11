// TSK-0487: the event log keeps a word problem's chosen model apart from the
// answer. An attempt appended at version 3 reads back with both, unchanged
// (REQ-0713).
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { appendEvents } from "../../src/engine/events/append.js";
import { eventByIdemKey } from "../../src/engine/events/read.js";
import { openDatabase } from "../../src/server/database.js";

const dir = mkdtempSync(join(tmpdir(), "meowtower-model-choice-"));
afterAll(() => rmSync(dir, { recursive: true, force: true }));
const db = openDatabase(join(dir, "live.sqlite"));

describe("REQ-0713: the event log records the model choice apart from the answer", () => {
  it("reads a version 3 attempt back with the model choice and the answer both kept", () => {
    appendEvents(db, [
      {
        type: "attempt_submitted",
        v: 3,
        origin: "server",
        sessionId: "s-model",
        idemKey: "model-choice-1",
        payload: {
          itemId: "01J0000000000000000000000B",
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
          modelChoice: "plan-first",
        },
      },
    ]);
    const stored = eventByIdemKey(db, "model-choice-1");
    expect(stored).toBeDefined();
    expect(stored?.v).toBe(3);
    expect(stored?.payload).toMatchObject({
      answer: { entered: "7", parsed: 7 },
      modelChoice: "plan-first",
    });
  });
});
