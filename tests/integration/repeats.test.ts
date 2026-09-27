// TSK-0320: a repeated request is recorded and charged once (REQ-2432,
// REQ-2422, REQ-2426), the explanation is confirmed at once and arrives on the
// stream (REQ-2424), and a runaway device gets 429.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { sessionEvents } from "../../src/engine/events/read.js";
import { createApp } from "../../src/server/app.js";
import { openDatabase } from "../../src/server/database.js";
import { registerDevice } from "../../src/server/devices.js";
import { EXPLAIN_TIMEOUT_MS } from "../../src/server/play.js";
import { STANDIN_THREADS } from "../../src/server/standin.js";
import {
  AnswerOut,
  ExplainOut,
  ExplanationReady,
  HintOut,
  PollOut,
  Room,
} from "../../src/shared/api.js";

const dir = mkdtempSync(join(tmpdir(), "meowtower-repeats-"));
const db = openDatabase(join(dir, "live.sqlite"));
afterAll(() => {
  db.close();
  rmSync(dir, { recursive: true, force: true });
});
afterEach(() => {
  vi.useRealTimers();
});

const input = {
  firstKeyMs: 500,
  submittedMs: 1500,
  edits: 0,
  erasures: 0,
  keyPresses: 1,
  focusLosses: { count: 0, totalMs: 0 },
  method: "keypad" as const,
};

/** A fresh device on an app whose clock moves 100 ms a request unless set. */
function player(options: Partial<Parameters<typeof createApp>[0]> = {}) {
  let clock = 0;
  const app = createApp({ db, now: () => (clock += 100), ...options });
  const cookie = `meowtower_device=${registerDevice(db, "tablet")}`;
  const headers = { cookie, "content-type": "application/json" };
  const post = (path: string, body: object): Promise<Response> =>
    Promise.resolve(
      app.request(path, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      }),
    );
  const get = (path: string): Promise<Response> =>
    Promise.resolve(app.request(path, { headers }));
  async function session(): Promise<{ sessionId: string; room: Room }> {
    // Session 0 belongs to no adventure, so each player's session is its own.
    const res = await post("/api/session/start", {
      mode: "zero",
      clientSeq: 0,
    });
    const { sessionId } = (await res.json()) as { sessionId: string };
    const room = Room.parse(
      await (await get(`/api/session/${sessionId}/next`)).json(),
    );
    return { sessionId, room };
  }
  return { post, get, session };
}

const count = (sessionId: string, type: string): number =>
  sessionEvents(db, sessionId).filter((e) => e.type === type).length;

describe("REQ-2432: the same answer twice is recorded once", () => {
  it("appends nothing on the repeat and replies as the first time", async () => {
    const p = player();
    const { sessionId, room } = await p.session();
    const body = { itemId: room.itemId, raw: "7", dontKnow: false, input };
    const first = await p.post(`/api/session/${sessionId}/answer`, {
      ...body,
      clientSeq: 1,
    });
    const logged = sessionEvents(db, sessionId).length;
    const again = await p.post(`/api/session/${sessionId}/answer`, {
      ...body,
      clientSeq: 1,
    });
    expect(again.status).toBe(200);
    expect(sessionEvents(db, sessionId).length).toBe(logged);
    expect(count(sessionId, "attempt_submitted")).toBe(1);
    expect(AnswerOut.parse(await again.json())).toEqual(
      AnswerOut.parse(await first.json()),
    );
  });

  it("rebuilds the first reply even after later answers changed the streak", async () => {
    const p = player();
    const { sessionId, room } = await p.session();
    const answer = (itemId: string, raw: string, clientSeq: number) =>
      p.post(`/api/session/${sessionId}/answer`, {
        itemId,
        raw,
        dontKnow: false,
        input,
        clientSeq,
      });
    const first = AnswerOut.parse(
      await (await answer(room.itemId, "7", 1)).json(),
    );
    const next = Room.parse(
      await (await p.get(`/api/session/${sessionId}/next`)).json(),
    );
    await answer(next.itemId, "3", 2);
    const again = AnswerOut.parse(
      await (await answer(room.itemId, "7", 1)).json(),
    );
    expect(again).toEqual(first);
    expect(again.streak).toBe(1);
  });
});

describe("REQ-2422: the same hint twice spends one thread", () => {
  it("logs one thread_spent and drops the stock by one, whatever the clientSeq", async () => {
    const p = player();
    const { sessionId, room } = await p.session();
    const hint = (clientSeq: number) =>
      p.post(`/api/item/${room.itemId}/hint`, { level: 1, clientSeq });
    const first = HintOut.parse(await (await hint(1)).json());
    const same = HintOut.parse(await (await hint(1)).json());
    const resent = HintOut.parse(await (await hint(2)).json());
    expect(count(sessionId, "thread_spent")).toBe(1);
    expect(count(sessionId, "hint_shown")).toBe(1);
    expect(first.threads).toBe(STANDIN_THREADS - 1);
    expect(same).toEqual(first);
    expect(resent).toEqual(first);
    const shown = Room.parse(
      await (await p.get(`/api/session/${sessionId}/next`)).json(),
    );
    expect(shown.threads).toBe(STANDIN_THREADS - 1);
    expect(shown.hintLevels).toEqual([1]);
  });

  it("refuses a rung that skips one and a hint with no thread left", async () => {
    const p = player();
    const { sessionId, room } = await p.session();
    const skipped = await p.post(`/api/item/${room.itemId}/hint`, {
      level: 2,
      clientSeq: 1,
    });
    expect(skipped.status).toBe(400);
    expect(await skipped.json()).toEqual({ error: "hint_level_skipped" });
    for (let level = 1; level <= 3; level++)
      await p.post(`/api/item/${room.itemId}/hint`, {
        level,
        clientSeq: 1 + level,
      });
    await p.post(`/api/session/${sessionId}/answer`, {
      itemId: room.itemId,
      raw: "7",
      dontKnow: false,
      input,
      clientSeq: 10,
    });
    const next = Room.parse(
      await (await p.get(`/api/session/${sessionId}/next`)).json(),
    );
    for (let level = 1; level <= 2; level++)
      await p.post(`/api/item/${next.itemId}/hint`, {
        level,
        clientSeq: 20 + level,
      });
    const broke = await p.post(`/api/item/${next.itemId}/hint`, {
      level: 3,
      clientSeq: 30,
    });
    expect(broke.status).toBe(409);
    expect(await broke.json()).toEqual({ error: "no_threads" });
    expect(count(sessionId, "thread_spent")).toBe(STANDIN_THREADS);
  });
});

describe("REQ-2426: the same second-attempt request returns the same parallel task", () => {
  it("replies with the same itemId and task and creates it once", async () => {
    const p = player();
    const { sessionId, room } = await p.session();
    const early = await p.post(`/api/item/${room.itemId}/second-attempt`, {
      clientSeq: 1,
    });
    expect(early.status).toBe(409);
    await p.post(`/api/session/${sessionId}/answer`, {
      itemId: room.itemId,
      raw: "5",
      dontKnow: false,
      input,
      clientSeq: 2,
    });
    const ask = (clientSeq: number) =>
      p.post(`/api/item/${room.itemId}/second-attempt`, { clientSeq });
    const first = Room.parse(await (await ask(3)).json());
    const same = Room.parse(await (await ask(3)).json());
    const resent = Room.parse(await (await ask(4)).json());
    expect(first.attemptNo).toBe(2);
    expect(first.itemId).not.toBe(room.itemId);
    expect(first.view.text).not.toBe(room.view.text);
    expect(same).toEqual(first);
    expect(resent).toEqual(first);
    const twins = sessionEvents(db, sessionId).filter(
      (e) =>
        e.type === "item_shown" &&
        (e.payload as { attemptNo: number }).attemptNo === 2,
    );
    expect(twins).toHaveLength(1);
  });
});

describe("REQ-2424: a bought explanation is confirmed at once and arrives on the stream", () => {
  async function bought(p: ReturnType<typeof player>) {
    const { sessionId, room } = await p.session();
    await p.post(`/api/session/${sessionId}/answer`, {
      itemId: room.itemId,
      raw: "5",
      dontKnow: false,
      input,
      clientSeq: 1,
    });
    return { sessionId, itemId: room.itemId };
  }

  it("replies pending before any text, then sends the template after 10 seconds", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const p = player();
    const { sessionId, itemId } = await bought(p);
    const events = await p.get(`/api/session/${sessionId}/events`);
    expect(events.headers.get("content-type")).toContain("text/event-stream");
    const body = events.body;
    if (!body) throw new Error("the stream has no body");
    const reader = body.getReader();

    const res = await p.post(`/api/item/${itemId}/explain`, { clientSeq: 2 });
    expect(res.status).toBe(200);
    const out = ExplainOut.parse(await res.json());
    expect(out).toEqual({ status: "pending", threads: STANDIN_THREADS - 1 });
    const types = sessionEvents(db, sessionId).map((e) => e.type);
    expect(types.slice(-2)).toEqual(["thread_spent", "explanation_bought"]);
    const poll = async () =>
      PollOut.parse(
        await (await p.get(`/api/session/${sessionId}/poll?after=0`)).json(),
      ).messages;
    // No text exists yet: the reply didn't wait for one.
    expect(await poll()).toEqual([]);

    await vi.advanceTimersByTimeAsync(EXPLAIN_TIMEOUT_MS - 1);
    expect(await poll()).toEqual([]);
    await vi.advanceTimersByTimeAsync(1);
    const boughtSeq = sessionEvents(db, sessionId).find(
      (e) => e.type === "explanation_bought",
    )?.seq;
    const [message] = await poll();
    expect(message).toMatchObject({
      type: "explanation_ready",
      seq: boughtSeq,
      itemId,
      source: "template",
    });

    // The SSE stream carried the same message.
    let text = "";
    while (!text.includes("\n\n")) {
      const chunk = await reader.read();
      text += new TextDecoder().decode(chunk.value);
    }
    await reader.cancel();
    expect(text).toContain("event: explanation_ready");
    expect(text).toContain(`id: ${boughtSeq}`);
    const data = /data: (.*)/.exec(text)?.[1] ?? "{}";
    expect(ExplanationReady.parse(JSON.parse(data))).toEqual(message);
    expect(
      (await p.get(`/api/session/${sessionId}/poll?after=${boughtSeq ?? 0}`))
        .status,
    ).toBe(200);
  });

  it("sends a written explanation as soon as it exists, and charges a repeat nothing", async () => {
    const p = player({ explainer: () => Promise.resolve("Разбор задачи.") });
    const { sessionId, itemId } = await bought(p);
    await p.post(`/api/item/${itemId}/explain`, { clientSeq: 2 });
    await p.post(`/api/item/${itemId}/explain`, { clientSeq: 2 });
    const resent = ExplainOut.parse(
      await (
        await p.post(`/api/item/${itemId}/explain`, { clientSeq: 3 })
      ).json(),
    );
    expect(resent.threads).toBe(STANDIN_THREADS - 1);
    expect(count(sessionId, "thread_spent")).toBe(1);
    expect(count(sessionId, "explanation_bought")).toBe(1);
    const { messages } = PollOut.parse(
      await (await p.get(`/api/session/${sessionId}/poll?after=0`)).json(),
    );
    expect(messages).toMatchObject([
      { source: "model", text: "Разбор задачи.", itemId },
    ]);
  });
});

describe("the rate cap: 20 state-changing requests a second per device", () => {
  it("answers the 21st within one second with 429, and lets the next second through", async () => {
    const p = player();
    const clockless = player({ now: () => 50_000 });
    const statuses: number[] = [];
    for (let i = 0; i < 21; i++)
      statuses.push(
        (
          await clockless.post("/api/session/start", {
            mode: "daily",
            clientSeq: i,
          })
        ).status,
      );
    expect(statuses.slice(0, 20).every((s) => s === 200)).toBe(true);
    expect(statuses[20]).toBe(429);
    // Reads don't count, and another device has its own cap.
    const { sessionId } = await p.session();
    expect(
      (await clockless.get(`/api/session/${sessionId}/poll?after=0`)).status,
    ).toBe(200);
  });

  it("lets a request through once the second has passed", async () => {
    let clock = 0;
    const p = player({ now: () => clock });
    for (let i = 0; i < 20; i++)
      await p.post("/api/session/start", { mode: "daily", clientSeq: i });
    expect(
      (await p.post("/api/session/start", { mode: "daily", clientSeq: 20 }))
        .status,
    ).toBe(429);
    clock = 1000;
    expect(
      (await p.post("/api/session/start", { mode: "daily", clientSeq: 21 }))
        .status,
    ).toBe(200);
  });

  it("counts every state-changing route together, per device", async () => {
    const p = player({ now: () => 0 });
    const { sessionId, room } = await p.session();
    const statuses: number[] = [];
    for (let level = 1; level <= 3; level++)
      statuses.push(
        (
          await p.post(`/api/item/${room.itemId}/hint`, {
            level,
            clientSeq: level,
          })
        ).status,
      );
    for (let i = 0; i < 16; i++)
      statuses.push(
        (
          await p.post(`/api/session/${sessionId}/answer`, {
            itemId: room.itemId,
            raw: "7",
            dontKnow: false,
            input,
            clientSeq: 10 + i,
          })
        ).status,
      );
    // The start, 3 hints and 16 answers make 20; the 21st is refused.
    expect(statuses.every((s) => s === 200)).toBe(true);
    const third = await p.post(`/api/item/${room.itemId}/second-attempt`, {
      clientSeq: 30,
    });
    expect(third.status).toBe(429);
  });
});
