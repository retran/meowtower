// TSK-0300: the answer request. REQ-2416, REQ-2418, REQ-2442, and the answer
// committed to the log before the reply.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import Database from "better-sqlite3";
import { afterAll, describe, expect, it } from "vitest";
import { createApp } from "../../src/server/app.js";
import { openDatabase } from "../../src/server/database.js";
import { registerDevice } from "../../src/server/devices.js";
import { AnswerOut, Room } from "../../src/shared/api.js";

const dir = mkdtempSync(join(tmpdir(), "meowtower-answer-"));
const path = join(dir, "meowtower.sqlite");
const db = openDatabase(path);
// A clock that moves 100 ms a request keeps the long runs under the rate cap.
let clock = 0;
const app = createApp({ db, now: () => (clock += 100) });
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

// Session 0 belongs to no adventure, so each test's session starts on the
// first stand-in task and the long run never reaches a finale.
async function start(): Promise<string> {
  const res = await app.request("/api/session/start", {
    method: "POST",
    headers: { ...cookie, "content-type": "application/json" },
    body: JSON.stringify({ mode: "zero", clientSeq: ++seq }),
  });
  expect(res.status).toBe(200);
  return ((await res.json()) as { sessionId: string }).sessionId;
}

async function next(sessionId: string): Promise<Room> {
  const res = await app.request(`/api/session/${sessionId}/next`, {
    headers: cookie,
  });
  expect(res.status).toBe(200);
  return Room.parse(await res.json());
}

async function answer(sessionId: string, body: object): Promise<Response> {
  return app.request(`/api/session/${sessionId}/answer`, {
    method: "POST",
    headers: { ...cookie, "content-type": "application/json" },
    body: JSON.stringify({ dontKnow: false, input, clientSeq: ++seq, ...body }),
  });
}

const logged = (itemId: string): { type: string; payload: string }[] =>
  second
    .prepare(
      "SELECT type, payload FROM events WHERE json_extract(payload, '$.itemId') = ? ORDER BY seq",
    )
    .all(itemId) as { type: string; payload: string }[];

describe("every route needs a device token", () => {
  it("answers 401 without one", async () => {
    const res = await app.request("/api/session/start", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ mode: "daily" }),
    });
    expect(res.status).toBe(401);
  });
});

describe("REQ-2508: the answer is committed before the reply", () => {
  it("holds attempt_submitted and verdict when the reply arrives", async () => {
    const sessionId = await start();
    const room = await next(sessionId);
    const res = await answer(sessionId, { itemId: room.itemId, raw: "7" });
    expect(res.status).toBe(200);
    expect(logged(room.itemId).map((e) => e.type)).toEqual([
      "item_shown",
      "attempt_submitted",
      "verdict",
    ]);
  });
});

describe("REQ-2416, REQ-2418: what the reply carries", () => {
  it("a first attempt carries the outcome, streak, grants, short solution and correct answer", async () => {
    const sessionId = await start();
    const room = await next(sessionId);
    const out = AnswerOut.parse(
      await (await answer(sessionId, { itemId: room.itemId, raw: "7" })).json(),
    );
    expect(out.outcome).toBe("clean");
    expect(out.streak).toBeGreaterThanOrEqual(1);
    expect(out.grants).toEqual([]);
    expect(out.shortSolution.length).toBeGreaterThan(0);
    expect(out.feedback.correctAnswer).toBe("7");
    expect(out.battleLine.length).toBeGreaterThan(0);
  });

  it("a second attempt carries the same without the outcome", async () => {
    const sessionId = await start();
    const first = await next(sessionId);
    await answer(sessionId, { itemId: first.itemId, raw: "5" });
    const twin = Room.parse(
      await (
        await app.request(`/api/item/${first.itemId}/second-attempt`, {
          method: "POST",
          headers: { ...cookie, "content-type": "application/json" },
          body: JSON.stringify({ clientSeq: ++seq }),
        })
      ).json(),
    );
    const twinId = twin.itemId;
    expect(twin.attemptNo).toBe(2);
    const out = AnswerOut.parse(
      await (await answer(sessionId, { itemId: twinId, raw: "8" })).json(),
    );
    expect(out.outcome).toBeUndefined();
    expect(out.feedback.correctAnswer).toBe("8");
    expect(out.shortSolution).toEqual(["2 + 6 = 8"]);
  });
});

describe("REQ-2442: «Не знаю» is its own verdict", () => {
  it("logs dont_know apart from an empty answer and a wrong one", async () => {
    const sessionId = await start();
    const verdicts: string[] = [];
    for (const body of [
      { raw: "", dontKnow: true },
      { raw: "", dontKnow: false },
      { raw: "99", dontKnow: false },
    ]) {
      const room = await next(sessionId);
      await answer(sessionId, { itemId: room.itemId, ...body });
      const verdict = logged(room.itemId).find((e) => e.type === "verdict");
      verdicts.push(
        (JSON.parse(verdict?.payload ?? "{}") as { verdict: string }).verdict,
      );
    }
    expect(verdicts[0]).toBe("dont_know");
    expect(verdicts[1]).not.toBe("dont_know");
    expect(verdicts[2]).not.toBe("dont_know");
    expect(new Set(verdicts).size).toBe(3);
  });
});

describe("the answer's latency (criterion 4)", () => {
  it("keeps the 95th percentile at or under 300 ms over 1,000 answers", async () => {
    const sessionId = await start();
    const durations: number[] = [];
    for (let i = 0; i < 1000; i++) {
      const room = await next(sessionId);
      const res = await answer(sessionId, { itemId: room.itemId, raw: "1" });
      const dur = /app;dur=([\d.]+)/.exec(
        res.headers.get("server-timing") ?? "",
      )?.[1];
      durations.push(Number(dur));
    }
    durations.sort((a, b) => a - b);
    const p95 = durations[Math.floor(durations.length * 0.95)] ?? Infinity;
    console.log(
      `answer p95: ${p95.toFixed(2)} ms over ${durations.length} answers`,
    );
    expect(p95).toBeLessThanOrEqual(300);
  }, 120000);
});
