// TSK-0410: «Закончить на сегодня». The parent's route logs `finish_today`, the
// next boundary returns `stop_offer` with `canExtend: false`, and `extend` gets
// `409 day_finished` until the game day ends at 04:00 (REQ-2444). Each test
// plays on a database of its own and sets the clock with fake timers.
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
import { createApp } from "../../src/server/app.js";
import { openDatabase, type Db } from "../../src/server/database.js";
import { registerDevice } from "../../src/server/devices.js";
import { createParentApp } from "../../src/server/parent.js";
import { STANDIN_ADVENTURE_TASKS } from "../../src/server/standin.js";
import { Room, Scene, StopOffer } from "../../src/shared/api.js";

const root = mkdtempSync(join(tmpdir(), "meowtower-finish-today-"));
const opened: Db[] = [];
afterAll(() => {
  for (const db of opened) db.close();
  rmSync(root, { recursive: true, force: true });
});
beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(Date.parse("2026-03-02T10:00:00Z"));
});
afterEach(() => {
  vi.useRealTimers();
});

const PIN = "4821";
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
async function world() {
  const db = openDatabase(join(root, `w${++worlds}.sqlite`));
  opened.push(db);
  const now = () => Date.now();
  const app = createApp({ db, now });
  const mac = createParentApp({ db, now });
  await mac.request("/pin", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ pin: PIN }),
  });
  const device = `meowtower_device=${registerDevice(db, "tablet")}`;
  const json = { "content-type": "application/json" };
  let seq = 0;
  const post = async (path: string, body: object = {}, cookie = device) =>
    app.request(path, {
      method: "POST",
      headers: { ...json, cookie },
      body: JSON.stringify({ ...body, clientSeq: ++seq }),
    });
  const get = async (path: string) =>
    app.request(path, { headers: { cookie: device } });
  /** The parent's cookie beside the device's, after the PIN login. */
  const parentCookie = async (): Promise<string> => {
    const login = await app.request("/api/parent/login", {
      method: "POST",
      headers: { ...json, cookie: device },
      body: JSON.stringify({ pin: PIN }),
    });
    const parent = (login.headers.get("set-cookie") ?? "").split(";")[0] ?? "";
    return `${device}; ${parent}`;
  };
  const finishToday = async (cookie?: string) =>
    app.request("/api/parent/finish-today", {
      method: "POST",
      headers: { ...json, cookie: cookie ?? (await parentCookie()) },
      body: "{}",
    });
  const start = async (): Promise<string> =>
    (
      (await (
        await post("/api/session/start", { mode: "daily", zone: "UTC" })
      ).json()) as { sessionId: string }
    ).sessionId;
  const next = async (sessionId: string): Promise<unknown> =>
    (await get(`/api/session/${sessionId}/next`)).json();
  const answer = (sessionId: string, itemId: string) =>
    post(`/api/session/${sessionId}/answer`, {
      itemId,
      raw: "7",
      dontKnow: false,
      input,
    });
  const extend = (sessionId: string) =>
    post(`/api/session/${sessionId}/extend`);
  const types = (): string[] =>
    (
      db.prepare("SELECT type FROM events ORDER BY seq").all() as {
        type: string;
      }[]
    ).map((r) => r.type);
  return {
    db,
    post,
    start,
    next,
    answer,
    extend,
    finishToday,
    parentCookie,
    types,
  };
}

describe("REQ-2444: finishing the day brings a stop offer at the next boundary", () => {
  it("logs finish_today and keeps the open task until its answer", async () => {
    const w = await world();
    const s = await w.start();
    const open = Room.parse(await w.next(s));
    const res = await w.finishToday();
    expect(res.status).toBe(200);
    expect(w.types().filter((t) => t === "finish_today")).toHaveLength(1);
    // Mid-task, the task comes back first.
    expect(Room.parse(await w.next(s)).itemId).toBe(open.itemId);
    await w.answer(s, open.itemId);
    expect(StopOffer.parse(await w.next(s))).toEqual({
      kind: "stop_offer",
      canExtend: false,
    });
    // The offer stays until the day ends.
    expect(await w.next(s)).toEqual({ kind: "stop_offer", canExtend: false });
  });

  it("finishes an open scene before the offer", async () => {
    const w = await world();
    const s = await w.start();
    for (let i = 0; i < STANDIN_ADVENTURE_TASKS; i++) {
      const room = Room.parse(await w.next(s));
      await w.answer(s, room.itemId);
    }
    const scene = Scene.parse(await w.next(s));
    await w.finishToday();
    expect(Scene.parse(await w.next(s)).sceneId).toBe(scene.sceneId);
    await w.post(`/api/session/${s}/scene/input`, {
      kind: "choice",
      sceneId: scene.sceneId,
      choiceId: scene.branches[0]?.choiceId,
    });
    expect(await w.next(s)).toEqual({ kind: "stop_offer", canExtend: false });
  });

  it("refuses the route without a parent session", async () => {
    const w = await world();
    const res = await w.finishToday(
      `meowtower_device=${registerDevice(w.db, "computer")}`,
    );
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "parent_session_missing" });
    expect(w.types()).not.toContain("finish_today");
  });
});

describe("REQ-2444: extend gets 409 day_finished until 04:00", () => {
  it("refuses extend for the rest of the game day and allows it at 04:00", async () => {
    const w = await world();
    const s = await w.start();
    await w.finishToday();
    const refused = await w.extend(s);
    expect(refused.status).toBe(409);
    expect(await refused.json()).toEqual({ error: "day_finished" });
    expect(w.types()).not.toContain("extension");

    // 03:59 the next calendar day is still the same game day.
    vi.setSystemTime(Date.parse("2026-03-03T03:59:00Z"));
    const late = await w.start();
    expect((await w.extend(late)).status).toBe(409);
    expect(await w.next(late)).toEqual({
      kind: "stop_offer",
      canExtend: false,
    });

    vi.setSystemTime(Date.parse("2026-03-03T04:00:00Z"));
    const morning = await w.start();
    expect((await w.extend(morning)).status).toBe(200);
    expect(w.types().filter((t) => t === "extension")).toHaveLength(1);
    Room.parse(await w.next(morning));
  });

  it("logs extension and changes nothing else on a day not finished", async () => {
    const w = await world();
    const s = await w.start();
    const before = w.types().length;
    const res = await w.extend(s);
    expect(res.status).toBe(200);
    expect(w.types().slice(before)).toEqual(["extension"]);
  });
});
