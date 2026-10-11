// TSK-0492: an entry the engine can't parse, such as «3,,5», is returned to the
// player as unparsed input to correct. It is not an attempt: the log holds no
// verdict and no attempt for it, nothing pauses the task's clock, and the next
// parseable answer is the attempt (REQ-0734, REQ-0736, REQ-0740).
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, expect, it } from "vitest";
import { itemEvents } from "../../src/engine/events/read.js";
import { createApp } from "../../src/server/app.js";
import { openDatabase } from "../../src/server/database.js";
import { registerDevice } from "../../src/server/devices.js";

const dir = mkdtempSync(join(tmpdir(), "meowtower-unparsed-"));
const db = openDatabase(join(dir, "live.sqlite"));
afterAll(() => {
  db.close();
  rmSync(dir, { recursive: true, force: true });
});

it("refuses 3,,5 without logging an attempt, then logs the next parseable answer", async () => {
  let clock = 0;
  const app = createApp({
    db,
    now: () => (clock += 100),
    explainer: () => Promise.resolve("Объяснение."),
  });
  const cookie = `meowtower_device=${registerDevice(db, "tablet")}`;
  const call = (path: string, init: RequestInit = {}) =>
    app.request(path, {
      ...init,
      headers: { cookie, "content-type": "application/json" },
    });
  const input = {
    firstKeyMs: 400,
    submittedMs: 1200,
    edits: 0,
    erasures: 0,
    keyPresses: 1,
    focusLosses: { count: 0, totalMs: 0 },
    method: "keypad",
  };

  const started = (await (
    await call("/api/session/start", {
      method: "POST",
      body: JSON.stringify({ mode: "daily", clientSeq: 1 }),
    })
  ).json()) as { sessionId: string };
  const room = (await (
    await call(`/api/session/${started.sessionId}/next`)
  ).json()) as { itemId: string };
  const shownBefore = itemEvents(db, room.itemId).map((e) => e.type);
  expect(shownBefore).toEqual(["item_shown"]);

  const refused = await call(`/api/session/${started.sessionId}/answer`, {
    method: "POST",
    body: JSON.stringify({
      itemId: room.itemId,
      raw: "3,,5",
      dontKnow: false,
      input,
      clientSeq: 2,
    }),
  });
  expect(refused.status).toBe(422);
  expect(await refused.json()).toEqual({ error: "unparsed_input" });
  const afterRefusal = itemEvents(db, room.itemId).map((e) => e.type);
  expect(afterRefusal).toEqual(["item_shown"]);
  expect(afterRefusal).not.toContain("attempt_submitted");
  expect(afterRefusal).not.toContain("verdict");

  const shown = itemEvents(db, room.itemId)[0];
  const correct = (shown?.payload as { correctAnswer: string }).correctAnswer;
  const accepted = await call(`/api/session/${started.sessionId}/answer`, {
    method: "POST",
    body: JSON.stringify({
      itemId: room.itemId,
      raw: correct,
      dontKnow: false,
      input,
      clientSeq: 3,
    }),
  });
  expect(accepted.status).toBe(200);
  const afterAnswer = itemEvents(db, room.itemId).map((e) => e.type);
  expect(
    afterAnswer.filter((type) => type === "attempt_submitted"),
  ).toHaveLength(1);
  expect(afterAnswer).not.toContain("adventure_paused");
});
