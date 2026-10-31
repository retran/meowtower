// EPC-0480: the game draws its tasks from the template registry. Each task is shown with its picture, checked
// by its own template's checker, given hints from the template, and met again as a parallel task.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import Database from "better-sqlite3";
import { afterAll, describe, expect, it } from "vitest";
import { createApp } from "../../src/server/app.js";
import { openDatabase } from "../../src/server/database.js";
import { registerDevice } from "../../src/server/devices.js";
import { rebuild } from "../../src/server/task-source.js";
import { AnswerOut, HintOut, Room } from "../../src/shared/api.js";

const dir = mkdtempSync(join(tmpdir(), "meowtower-registry-"));
const path = join(dir, "meowtower.sqlite");
const db = openDatabase(path);
let clock = 0;
const app = createApp({ db, now: () => (clock += 100), tasks: "registry" });
let seq = 0;
const token = registerDevice(db, "tablet");
const cookie = { cookie: `meowtower_device=${token}` };
const second = new Database(path, { readonly: true });
afterAll(() => {
  second.close();
  db.close();
  rmSync(dir, { recursive: true, force: true });
});

const input = {
  firstKeyMs: 800,
  submittedMs: 2400,
  edits: 0,
  erasures: 0,
  keyPresses: 1,
  focusLosses: { count: 0, totalMs: 0 },
  method: "keypad" as const,
};
const json = { ...cookie, "content-type": "application/json" };

async function start(): Promise<string> {
  const res = await app.request("/api/session/start", {
    method: "POST",
    headers: json,
    body: JSON.stringify({ mode: "zero", clientSeq: ++seq }),
  });
  return ((await res.json()) as { sessionId: string }).sessionId;
}

async function next(sessionId: string): Promise<Room> {
  const res = await app.request(`/api/session/${sessionId}/next`, {
    headers: cookie,
  });
  expect(res.status).toBe(200);
  return Room.parse(await res.json());
}

const shownOf = (
  itemId: string,
): { correctAnswer: string; templateId: string; seed: string } =>
  JSON.parse(
    (
      second
        .prepare(
          "SELECT payload FROM events WHERE type = 'item_shown' AND json_extract(payload, '$.itemId') = ?",
        )
        .get(itemId) as { payload: string }
    ).payload,
  ) as { correctAnswer: string; templateId: string; seed: string };

async function answer(
  sessionId: string,
  itemId: string,
  raw: string,
): Promise<Response> {
  return app.request(`/api/session/${sessionId}/answer`, {
    method: "POST",
    headers: json,
    body: JSON.stringify({
      itemId,
      raw,
      dontKnow: false,
      input,
      clientSeq: ++seq,
    }),
  });
}

describe("the registry as the source of tasks", () => {
  it("shows tasks of many templates and takes each one's own answer as clean", async () => {
    const sessionId = await start();
    const templates = new Set<string>();
    let pictures = 0;
    for (let i = 0; i < 30; i += 1) {
      const room = await next(sessionId);
      const shown = shownOf(room.itemId);
      templates.add(shown.templateId);
      if (room.view.svg) pictures += 1;
      expect(room.view.text.length).toBeGreaterThan(0);
      const entry = rebuild(shown.templateId, shown.seed)?.made.entry ?? "";
      const res = await answer(sessionId, room.itemId, entry);
      expect(res.status, shown.templateId).toBe(200);
      expect(AnswerOut.parse(await res.json()).outcome).toBe("clean");
    }
    expect(templates.size).toBeGreaterThan(20);
    expect(pictures).toBeGreaterThan(0);
  });

  it("gives a template hint, then a parallel task of the same template after a wrong answer", async () => {
    const sessionId = await start();
    const room = await next(sessionId);
    const first = shownOf(room.itemId);
    const hint = await app.request(`/api/item/${room.itemId}/hint`, {
      method: "POST",
      headers: json,
      body: JSON.stringify({ level: 1, clientSeq: ++seq }),
    });
    expect(hint.status).toBe(200);
    expect(HintOut.parse(await hint.json()).text.length).toBeGreaterThan(0);
    const wrong = await app.request(`/api/session/${sessionId}/answer`, {
      method: "POST",
      headers: json,
      body: JSON.stringify({
        itemId: room.itemId,
        raw: "",
        dontKnow: true,
        input,
        clientSeq: ++seq,
      }),
    });
    expect(AnswerOut.parse(await wrong.json()).outcome).toBe("alt");
    const again = await app.request(`/api/item/${room.itemId}/second-attempt`, {
      method: "POST",
      headers: json,
      body: JSON.stringify({ clientSeq: ++seq }),
    });
    const twin = Room.parse(await again.json());
    expect(twin.attemptNo).toBe(2);
    const shown = shownOf(twin.itemId);
    expect(shown.templateId).toBe(first.templateId);
    expect(shown.seed).not.toBe(first.seed);
  });
});
