// TSK-0400: the three-day rule. The server counts an adventure's adventure
// days, the game days on which a task or a scene of it was shown (REQ-0236);
// on the first session of a new game day past `threeDayLimit` it finishes the
// open task and room (REQ-0228), plays the stand-in short ending, keeps every
// grant (REQ-0230) and queues the secrets she didn't open (REQ-0232). Each
// test plays on a database of its own and sets the clock with fake timers.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { appendEvents } from "../../src/engine/events/append.js";
import { createApp } from "../../src/server/app.js";
import { openDatabase, type Db } from "../../src/server/database.js";
import { registerDevice } from "../../src/server/devices.js";
import { STANDIN_SECRETS } from "../../src/server/standin.js";
import { ResumeOut, Room, Scene } from "../../src/shared/api.js";

const root = mkdtempSync(join(tmpdir(), "meowtower-three-day-"));
const opened: Db[] = [];
afterAll(() => {
  for (const db of opened) db.close();
  rmSync(root, { recursive: true, force: true });
});
beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
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

const DAY = 24 * 60 * 60 * 1000;
const EPOCH = Date.parse("2026-03-02T10:00:00Z");
/** Sets the clock to 10:00 UTC on day `n` of the test, or to `hour` on it. */
const day = (n: number, hour = 10): void => {
  vi.setSystemTime(EPOCH + (n - 1) * DAY + (hour - 10) * 60 * 60 * 1000);
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
  const get = async (path: string) => app.request(path, { headers });
  /** Starts a session in UTC and returns it with the reply's wrapUp. */
  const start = async (): Promise<{ sessionId: string; wrapUp: boolean }> =>
    (await (
      await post("/api/session/start", { mode: "daily", zone: "UTC" })
    ).json()) as { sessionId: string; wrapUp: boolean };
  const next = async (sessionId: string): Promise<unknown> =>
    (await get(`/api/session/${sessionId}/next`)).json();
  /** Shows the next task and answers it. */
  const play = async (sessionId: string): Promise<Room> => {
    const room = Room.parse(await next(sessionId));
    await post(`/api/session/${sessionId}/answer`, {
      itemId: room.itemId,
      raw: "7",
      dontKnow: false,
      input,
    });
    return room;
  };
  const leave = (sessionId: string) =>
    post(`/api/session/${sessionId}/pause`, { reason: "leave" });
  const events = (type: string) =>
    (
      db
        .prepare("SELECT seq, payload FROM events WHERE type = ? ORDER BY seq")
        .all(type) as { seq: number; payload: string }[]
    ).map((r) => ({ seq: r.seq, ...(JSON.parse(r.payload) as object) }));
  const setLimit = (value: number | null): void => {
    appendEvents(db, [
      {
        type: "settings_changed",
        v: 1,
        payload: { key: "threeDayLimit", value },
        origin: "server",
      },
    ]);
  };
  const adventureState = (): string =>
    (db.prepare("SELECT state FROM adventures").get() as { state: string })
      .state;
  return {
    db,
    app,
    post,
    get,
    start,
    next,
    play,
    leave,
    events,
    setLimit,
    adventureState,
  };
}

type World = ReturnType<typeof world>;

/** Plays `tasks` tasks on game day `n` and leaves. */
async function playDay(w: World, n: number, tasks: number, hour = 10) {
  day(n, hour);
  const { sessionId, wrapUp } = await w.start();
  for (let i = 0; i < tasks; i++) await w.play(sessionId);
  await w.leave(sessionId);
  return wrapUp;
}

describe("REQ-0236: only game days with play count towards the limit", () => {
  it("sets wrapUp on the first session after three adventure days, gaps not counted", async () => {
    const w = world();
    expect(await playDay(w, 1, 1)).toBe(false);
    expect(await playDay(w, 3, 1)).toBe(false);
    expect(await playDay(w, 6, 1)).toBe(false);
    // Day 7 is the first game day after three adventure days.
    day(7);
    expect((await w.start()).wrapUp).toBe(true);
  });

  it("counts no game day on which only a session started", async () => {
    const w = world();
    await playDay(w, 1, 1);
    await playDay(w, 2, 0);
    await playDay(w, 3, 0);
    await playDay(w, 4, 1);
    day(5);
    // Two adventure days so far: days 1 and 4.
    expect((await w.start()).wrapUp).toBe(false);
  });

  it("ends a game day at 04:00, so one calendar day can hold two", async () => {
    const w = world();
    await playDay(w, 1, 1, 3);
    await playDay(w, 1, 1, 5);
    await playDay(w, 2, 1, 5);
    // 03:00 and 05:00 on day 1 are two game days, and day 2 is the third.
    day(2, 12);
    expect((await w.start()).wrapUp).toBe(false);
    day(3, 5);
    expect((await w.start()).wrapUp).toBe(true);
  });

  it("returns wrapUp on resume too", async () => {
    const w = world();
    await playDay(w, 1, 1);
    await playDay(w, 2, 1);
    await playDay(w, 3, 1);
    day(4);
    const out = ResumeOut.parse(
      await (await w.post("/api/adventure/resume")).json(),
    );
    expect(out.wrapUp).toBe(true);
  });

  it("wraps up at the next new game day after the parent lowers the limit", async () => {
    const w = world();
    await playDay(w, 1, 1);
    await playDay(w, 2, 1);
    day(3);
    expect((await w.start()).wrapUp).toBe(false);
    w.setLimit(2);
    day(4);
    expect((await w.start()).wrapUp).toBe(true);
  });

  it("never wraps up with the limit off", async () => {
    const w = world();
    w.setLimit(null);
    for (let d = 1; d <= 6; d++) await playDay(w, d, 1);
    day(7);
    const { sessionId, wrapUp } = await w.start();
    expect(wrapUp).toBe(false);
    Room.parse(await w.next(sessionId));
    expect(w.events("adventure_wrapped_up")).toHaveLength(0);
  });
});

describe("REQ-0228: the open task and room finish, then the short ending plays", () => {
  it("shows the rest of the room, then the ending, then the end", async () => {
    const w = world();
    await playDay(w, 1, 2); // tasks 0 and 1 of room 1
    await playDay(w, 3, 1); // task 2 closes room 1
    await playDay(w, 5, 1); // task 3 opens room 2
    day(7);
    const { sessionId, wrapUp } = await w.start();
    expect(wrapUp).toBe(true);
    // Room 2 holds tasks 3, 4 and 5, and task 3 is answered.
    const a = await w.play(sessionId);
    const b = await w.play(sessionId);
    expect(a.slot).toBe(1);
    expect(b.slot).toBe(2);
    const ending = Scene.parse(await w.next(sessionId));
    expect(ending.lines.length).toBeGreaterThan(0);
    expect(w.events("adventure_wrapped_up")).toHaveLength(1);
    expect(w.adventureState()).toBe("wrapped_up");
    expect(await w.next(sessionId)).toEqual({ kind: "end" });
  });

  it("shows an open task again before the ending", async () => {
    const w = world();
    await playDay(w, 1, 1);
    await playDay(w, 2, 1);
    await playDay(w, 3, 1);
    day(4);
    const { sessionId } = await w.start();
    const open = Room.parse(await w.next(sessionId));
    expect(Room.parse(await w.next(sessionId)).itemId).toBe(open.itemId);
    expect(w.events("adventure_wrapped_up")).toHaveLength(0);
  });

  it("plays the ending at once when the room is already complete", async () => {
    const w = world();
    await playDay(w, 1, 1);
    await playDay(w, 2, 1);
    await playDay(w, 3, 1); // three tasks: room 1 complete
    day(4);
    const { sessionId } = await w.start();
    expect(Scene.parse(await w.next(sessionId)).sceneId).toBeTruthy();
    expect(w.events("adventure_wrapped_up")).toHaveLength(1);
  });
});

describe("REQ-0230, REQ-0232: the ending keeps every grant and queues the secrets", () => {
  it("holds each earlier grant, removes no event and queues the unopened secrets", async () => {
    const w = world();
    await playDay(w, 1, 1);
    appendEvents(w.db, [
      {
        type: "reward_granted",
        v: 1,
        payload: {
          source: "test",
          kind: "star",
          rewardId: "earned-1",
          amount: 2,
        },
        origin: "server",
        adventureId: (
          w.db.prepare("SELECT adventure_id FROM adventures").get() as {
            adventure_id: string;
          }
        ).adventure_id,
      },
    ]);
    await playDay(w, 2, 1);
    await playDay(w, 3, 1);
    const before = (
      w.db
        .prepare("SELECT seq, type, payload FROM events ORDER BY seq")
        .all() as {
        seq: number;
        type: string;
        payload: string;
      }[]
    ).map((e) => JSON.stringify(e));
    const inventoryBefore = w.db
      .prepare("SELECT reward_id, kind, amount FROM inventory ORDER BY seq")
      .all();
    expect(inventoryBefore).toEqual([
      { reward_id: "earned-1", kind: "star", amount: 2 },
    ]);

    day(4);
    const { sessionId } = await w.start();
    Scene.parse(await w.next(sessionId));

    const after = (
      w.db
        .prepare("SELECT seq, type, payload FROM events ORDER BY seq")
        .all() as {
        seq: number;
        type: string;
        payload: string;
      }[]
    ).map((e) => JSON.stringify(e));
    // Nothing earlier was removed or changed; the log only grew.
    expect(after.slice(0, before.length)).toEqual(before);
    expect(
      w.db
        .prepare("SELECT reward_id, kind, amount FROM inventory ORDER BY seq")
        .all(),
    ).toEqual(inventoryBefore);
    expect(w.events("adventure_wrapped_up")).toMatchObject([
      { unopenedSecrets: [...STANDIN_SECRETS] },
    ]);
    expect(
      (
        w.db
          .prepare("SELECT secret_id FROM reward_queue ORDER BY secret_id")
          .all() as { secret_id: string }[]
      ).map((r) => r.secret_id),
    ).toEqual([...STANDIN_SECRETS].sort());
  });

  it("rebuilds inventory and reward_queue from the log alone", async () => {
    const w = world();
    await playDay(w, 1, 1);
    await playDay(w, 2, 1);
    await playDay(w, 3, 1);
    day(4);
    const { sessionId } = await w.start();
    Scene.parse(await w.next(sessionId));
    const queue = w.db
      .prepare("SELECT secret_id FROM reward_queue ORDER BY secret_id")
      .all();
    w.db.prepare("DROP TABLE reward_queue").run();
    w.db.prepare("DROP TABLE inventory").run();
    const reopened = openDatabase(w.db.name);
    expect(
      reopened
        .prepare("SELECT secret_id FROM reward_queue ORDER BY secret_id")
        .all(),
    ).toEqual(queue);
    reopened.close();
  });
});
