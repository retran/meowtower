// TSK-0330: the adventure and session lifecycle. A daily start continues the
// open adventure (REQ-0226), no request reopens a finished one (REQ-2404),
// «Сохранить и уйти» works at any step (REQ-0200), and a rest stop pauses
// nothing (REQ-2412). Each test plays on a database of its own, because the
// open adventure belongs to the whole game.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { appendEvents } from "../../src/engine/events/append.js";
import { createApp } from "../../src/server/app.js";
import { openDatabase, type Db } from "../../src/server/database.js";
import { registerDevice } from "../../src/server/devices.js";
import { STANDIN_ADVENTURE_TASKS } from "../../src/server/standin.js";
import {
  AdventureCurrentOut,
  Chest,
  Room,
  Scene,
} from "../../src/shared/api.js";

const root = mkdtempSync(join(tmpdir(), "meowtower-lifecycle-"));
const opened: Db[] = [];
afterAll(() => {
  for (const db of opened) db.close();
  rmSync(root, { recursive: true, force: true });
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

let worlds = 0;
function world() {
  const db = openDatabase(join(root, `w${++worlds}.sqlite`));
  opened.push(db);
  let clock = 0;
  const app = createApp({ db, now: () => (clock += 100) });
  const headers = {
    cookie: `meowtower_device=${registerDevice(db, "tablet")}`,
    "content-type": "application/json",
  };
  let seq = 0;
  const post = async (path: string, body: object = {}) =>
    app.request(path, {
      method: "POST",
      headers,
      body: JSON.stringify({ ...body, clientSeq: ++seq }),
    });
  /** A request with the body as given, clientSeq included. */
  const resend = async (path: string, body: object) =>
    app.request(path, { method: "POST", headers, body: JSON.stringify(body) });
  const get = async (path: string) => app.request(path, { headers });
  const start = async (): Promise<string> =>
    (
      (await (await post("/api/session/start", { mode: "daily" })).json()) as {
        sessionId: string;
      }
    ).sessionId;
  const next = async (sessionId: string): Promise<unknown> =>
    (await get(`/api/session/${sessionId}/next`)).json();
  const answer = (sessionId: string, itemId: string, raw = "7") =>
    post(`/api/session/${sessionId}/answer`, {
      itemId,
      raw,
      dontKnow: false,
      input,
    });
  const types = (): string[] =>
    (
      db.prepare("SELECT type FROM events ORDER BY seq").all() as {
        type: string;
      }[]
    ).map((r) => r.type);
  const adventures = (): { adventure_id: string; state: string }[] =>
    db
      .prepare(
        "SELECT adventure_id, state FROM adventures ORDER BY planned_seq",
      )
      .all() as { adventure_id: string; state: string }[];
  const sessionState = (sessionId: string): string | undefined =>
    (
      db
        .prepare("SELECT state FROM sessions WHERE session_id = ?")
        .get(sessionId) as { state: string } | undefined
    )?.state;
  const current = async () =>
    AdventureCurrentOut.parse(
      await (await get("/api/adventure/current")).json(),
    ).adventure;
  return {
    db,
    post,
    resend,
    get,
    start,
    next,
    answer,
    types,
    adventures,
    sessionState,
    current,
  };
}

const count = (list: string[], type: string): number =>
  list.filter((t) => t === type).length;

describe("REQ-0226: a daily start continues the open adventure", () => {
  it("plans one adventure when none is open", async () => {
    const w = world();
    expect(await w.current()).toBeNull();
    await w.start();
    expect(count(w.types(), "adventure_planned")).toBe(1);
    expect(await w.current()).toMatchObject({
      state: "planned",
      floor: 1,
      room: 1,
      slot: 0,
    });
  });

  it("continues a planned, an active and a paused adventure without planning one", async () => {
    const w = world();
    const first = await w.start();
    const [planned] = w.adventures();

    // planned: the second start continues it.
    const second = await w.start();
    expect(w.adventures()).toEqual([planned]);

    // active: the first next starts it.
    const room = Room.parse(await w.next(second));
    expect(count(w.types(), "adventure_started")).toBe(1);
    expect(w.adventures()[0]?.state).toBe("active");
    await w.answer(second, room.itemId);
    const third = await w.start();
    expect(w.adventures()).toHaveLength(1);

    // paused: leaving pauses it, the next start continues it, and play resumes it.
    await w.post(`/api/session/${third}/pause`, { reason: "leave" });
    expect(w.adventures()[0]?.state).toBe("paused");
    const fourth = await w.start();
    expect(w.adventures()).toHaveLength(1);
    const again = Room.parse(await w.next(fourth));
    expect(again.slot).toBe(1);
    expect(w.adventures()[0]?.state).toBe("active");
    expect(count(w.types(), "adventure_resumed")).toBe(1);
    expect(count(w.types(), "adventure_planned")).toBe(1);
    expect(await w.current()).toMatchObject({ state: "active", slot: 1 });
    expect(first).not.toBe(fourth);
  });

  it("plans a new adventure once the open one reaches its finale", async () => {
    const w = world();
    const sessionId = await w.start();
    for (let i = 0; i < STANDIN_ADVENTURE_TASKS; i++) {
      const room = Room.parse(await w.next(sessionId));
      await w.answer(sessionId, room.itemId);
    }
    // The finale shows the scene and then the chest before the end.
    const scene = Scene.parse(await w.next(sessionId));
    await w.post(`/api/session/${sessionId}/scene/input`, {
      kind: "choice",
      sceneId: scene.sceneId,
      choiceId: scene.branches[0]?.choiceId,
    });
    const chest = Chest.parse(await w.next(sessionId));
    await w.post(`/api/session/${sessionId}/chest`, {
      chestId: chest.chestId,
      rewardId: chest.options[0]?.rewardId,
    });
    expect(await w.next(sessionId)).toEqual({ kind: "end" });
    expect(w.adventures()[0]?.state).toBe("complete");
    expect(await w.current()).toBeNull();
    const after = await w.start();
    expect(w.adventures().map((a) => a.state)).toEqual(["complete", "planned"]);
    expect(Room.parse(await w.next(after)).slot).toBe(0);
  });
});

describe("REQ-2404: no request reopens a finished adventure", () => {
  function finish(w: ReturnType<typeof world>, type: string): void {
    const id = w.adventures()[0]?.adventure_id ?? "";
    appendEvents(w.db, [
      {
        type,
        v: 1,
        payload:
          type === "adventure_wrapped_up"
            ? { adventureId: id, unopenedSecrets: [] }
            : { adventureId: id },
        origin: "server",
        adventureId: id,
      },
    ]);
  }

  it("answers 409 to an automatic pause after the finale and logs nothing", async () => {
    const w = world();
    const sessionId = await w.start();
    Room.parse(await w.next(sessionId));
    finish(w, "adventure_completed");
    const before = w.types().length;
    const res = await w.post(`/api/session/${sessionId}/pause`, {
      reason: "background",
    });
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ error: "adventure_closed" });
    // The refused pause rolled back with the session's end in its batch.
    expect(w.types().length).toBe(before);
    expect(w.adventures()[0]?.state).toBe("complete");
    expect(w.sessionState(sessionId)).toBe("active");
    expect(await w.next(sessionId)).toEqual({ kind: "end" });
  });

  it("lets her leave after the finale, ending the session and pausing nothing (REQ-0200)", async () => {
    const w = world();
    const sessionId = await w.start();
    Room.parse(await w.next(sessionId));
    finish(w, "adventure_completed");
    const before = w.types();
    const res = await w.post(`/api/session/${sessionId}/pause`, {
      reason: "leave",
    });
    expect(res.status).toBe(200);
    expect(w.types().slice(before.length)).toEqual(["session_ended"]);
    expect(w.adventures()[0]?.state).toBe("complete");
    expect(w.sessionState(sessionId)).toBe("ended");
  });

  it("plans a new adventure after the three-day rule's short ending (REQ-0226)", async () => {
    const w = world();
    const sessionId = await w.start();
    Room.parse(await w.next(sessionId));
    finish(w, "adventure_wrapped_up");
    expect(await w.next(sessionId)).toEqual({ kind: "end" });
    await w.start();
    expect(w.adventures().map((a) => a.state)).toEqual([
      "wrapped_up",
      "planned",
    ]);
  });
});

describe("REQ-0200: «Сохранить и уйти» at any step", () => {
  const steps: [
    string,
    (w: ReturnType<typeof world>, s: string) => Promise<void>,
  ][] = [
    ["before the first task", async () => undefined],
    [
      "before an answer",
      async (w, s) => {
        Room.parse(await w.next(s));
      },
    ],
    [
      "after an answer, mid-review",
      async (w, s) => {
        const room = Room.parse(await w.next(s));
        await w.answer(s, room.itemId, "5");
      },
    ],
    [
      "in a scene",
      async (w, s) => {
        Room.parse(await w.next(s));
        appendEvents(w.db, [
          {
            type: "scene_shown",
            v: 1,
            payload: {
              sceneId: "standin-scene",
              lines: [{ speaker: "familiar", text: "…" }],
            },
            origin: "server",
            sessionId: s,
          },
        ]);
      },
    ],
    [
      "at a chest",
      async (w, s) => {
        Room.parse(await w.next(s));
        appendEvents(w.db, [
          {
            type: "chest_offered",
            v: 1,
            payload: {
              chestId: "standin-chest",
              options: ["a", "b", "c"].map((rewardId) => ({
                kind: "item",
                rewardId,
                quality: "common",
              })),
            },
            origin: "server",
            sessionId: s,
          },
        ]);
      },
    ],
  ];
  for (const [step, reach] of steps) {
    it(`logs adventure_paused with leave and session_ended and nothing else ${step}`, async () => {
      const w = world();
      const sessionId = await w.start();
      await reach(w, sessionId);
      const before = w.types();
      const res = await w.post(`/api/session/${sessionId}/pause`, {
        reason: "leave",
      });
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ status: "paused" });
      expect(w.types().slice(before.length)).toEqual([
        "adventure_paused",
        "session_ended",
      ]);
      const reasons = w.db
        .prepare(
          "SELECT json_extract(payload, '$.reason') AS reason FROM events WHERE type IN ('adventure_paused', 'session_ended')",
        )
        .all() as { reason: string }[];
      expect(reasons.map((r) => r.reason)).toEqual(["leave", "leave"]);
      expect(w.sessionState(sessionId)).toBe("ended");
      expect(w.adventures()[0]?.state).toBe("paused");
      // The ended session plays no more; a new start continues the adventure.
      expect((await w.get(`/api/session/${sessionId}/next`)).status).toBe(409);
    });
  }

  it("records a repeated leave once, and refuses a new one on an ended session", async () => {
    const w = world();
    const sessionId = await w.start();
    const path = `/api/session/${sessionId}/pause`;
    const leave = { reason: "leave", clientSeq: 99 };
    expect((await w.resend(path, leave)).status).toBe(200);
    const before = w.types().length;
    const again = await w.resend(path, leave);
    expect(again.status).toBe(200);
    expect(await again.json()).toEqual({ status: "paused" });
    expect(w.types().length).toBe(before);
    const fresh = await w.post(path, { reason: "leave" });
    expect(fresh.status).toBe(409);
    expect(await fresh.json()).toEqual({ error: "session_ended" });
    expect(w.types().length).toBe(before);
  });
});

describe("REQ-2412: a rest stop pauses nothing", () => {
  it("logs the rest stop and leaves the session active and the adventure unpaused", async () => {
    const w = world();
    const sessionId = await w.start();
    Room.parse(await w.next(sessionId));
    const rest = await w.post(`/api/session/${sessionId}/break`, {
      action: "start",
    });
    expect(await rest.json()).toEqual({ status: "resting" });
    expect(w.sessionState(sessionId)).toBe("active");
    expect(w.adventures()[0]?.state).toBe("active");
    const back = await w.post(`/api/session/${sessionId}/break`, {
      action: "end",
    });
    expect(await back.json()).toEqual({ status: "playing" });
    const log = w.types();
    expect(log.slice(-2)).toEqual(["rest_stop_started", "rest_stop_ended"]);
    expect(count(log, "adventure_paused")).toBe(0);
    expect(count(log, "session_ended")).toBe(0);
    expect(w.sessionState(sessionId)).toBe("active");
    expect(w.adventures()[0]?.state).toBe("active");
    expect(Room.parse(await w.next(sessionId)).kind).toBe("room");
  });

  it("leaves both active when an eye exercise is logged", async () => {
    const w = world();
    const sessionId = await w.start();
    Room.parse(await w.next(sessionId));
    const adventureId = w.adventures()[0]?.adventure_id ?? "";
    appendEvents(w.db, [
      {
        type: "eye_exercise",
        v: 1,
        payload: { exerciseId: "standin-eyes", completed: true },
        origin: "server",
        sessionId,
        adventureId,
      },
    ]);
    expect(w.sessionState(sessionId)).toBe("active");
    expect(w.adventures()[0]?.state).toBe("active");
  });
});
