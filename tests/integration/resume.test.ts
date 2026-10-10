// TSK-0360: resume returns the exact step from `resume_snapshot` (REQ-0204,
// REQ-0206), a task left unanswered stays the same first attempt (REQ-0210),
// an attempt split by a pause or a change of device kind carries a flag that
// keeps its time out of every measure (REQ-0212, REQ-0224), and a paid action
// repeated after a resume charges nothing (REQ-0214). Each test plays on a
// database of its own, because the open adventure belongs to the whole game.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { adventureEvents } from "../../src/engine/events/read.js";
import { resumeFromLog } from "../../src/engine/projections/resume.js";
import { createApp } from "../../src/server/app.js";
import { openDatabase, type Db } from "../../src/server/database.js";
import { registerDevice } from "../../src/server/devices.js";
import { writeSyntheticLog } from "../helpers/synthetic-log.js";
import { createRegistry } from "../../src/shared/events.js";
import { EVENT_DEFS } from "../../src/shared/events.js";
import {
  AdventureCurrentOut,
  AnswerOut,
  ExplainOut,
  HintOut,
  ResumeOut,
  Room,
} from "../../src/shared/api.js";

const root = mkdtempSync(join(tmpdir(), "meowtower-resume-"));
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
  const tablet = registerDevice(db, "tablet");
  const computer = registerDevice(db, "computer");
  const seqs = { tablet: 0, computer: 0 };
  type Who = "tablet" | "computer";
  const tokens = { tablet, computer };
  const headers = (who: Who) => ({
    cookie: `meowtower_device=${tokens[who]}`,
    "content-type": "application/json",
  });
  const post = async (who: Who, path: string, body: object = {}) =>
    app.request(path, {
      method: "POST",
      headers: headers(who),
      body: JSON.stringify({ ...body, clientSeq: ++seqs[who] }),
    });
  const get = async (who: Who, path: string) =>
    app.request(path, { headers: headers(who) });
  const start = async (who: Who): Promise<string> =>
    (
      (await (
        await post(who, "/api/session/start", { mode: "daily" })
      ).json()) as { sessionId: string }
    ).sessionId;
  const next = async (who: Who, sessionId: string) =>
    Room.parse(await (await get(who, `/api/session/${sessionId}/next`)).json());
  const answer = async (who: Who, sessionId: string, itemId: string) =>
    post(who, `/api/session/${sessionId}/answer`, {
      itemId,
      raw: "7",
      dontKnow: false,
      input,
    });
  const leave = (who: Who, sessionId: string) =>
    post(who, `/api/session/${sessionId}/pause`, { reason: "leave" });
  const resume = async (who: Who) =>
    ResumeOut.parse(await (await post(who, "/api/adventure/resume")).json());
  const events = (type: string) =>
    (
      db
        .prepare("SELECT payload FROM events WHERE type = ? ORDER BY seq")
        .all(type) as { payload: string }[]
    ).map((r) => JSON.parse(r.payload) as Record<string, unknown>);
  const adventureId = (): string =>
    (
      db.prepare("SELECT adventure_id FROM adventures").get() as {
        adventure_id: string;
      }
    ).adventure_id;
  const stored = (): unknown => {
    const row = db
      .prepare("SELECT point FROM resume_snapshot WHERE adventure_id = ?")
      .get(adventureId()) as { point: string } | undefined;
    return row ? JSON.parse(row.point) : null;
  };
  return {
    db,
    post,
    get,
    start,
    next,
    answer,
    leave,
    resume,
    events,
    adventureId,
    stored,
  };
}

describe("REQ-0206: resume_snapshot equals the resume point derived from the log", () => {
  it("matches after every committed request of a played script and after a rebuild", async () => {
    const w = world();
    let compared = 0;
    let differences = 0;
    const compare = (): void => {
      const derived = resumeFromLog(adventureEvents(w.db, w.adventureId()));
      compared++;
      if (JSON.stringify(w.stored()) !== JSON.stringify(derived)) differences++;
    };
    const a = await w.start("tablet");
    compare();
    const first = await w.next("tablet", a);
    compare();
    await w.post("tablet", `/api/item/${first.itemId}/hint`, { level: 1 });
    compare();
    await w.post("tablet", `/api/item/${first.itemId}/explain`);
    compare();
    await w.answer("tablet", a, first.itemId);
    compare();
    const twin = Room.parse(
      await (
        await w.post("tablet", `/api/item/${first.itemId}/second-attempt`)
      ).json(),
    );
    compare();
    await w.answer("tablet", a, twin.itemId);
    compare();
    await w.next("tablet", a);
    compare();
    await w.leave("tablet", a);
    compare();
    const b = await w.resume("computer");
    compare();
    const second = await w.next("computer", b.sessionId);
    compare();
    await w.answer("computer", b.sessionId, second.itemId);
    compare();

    expect(compared).toBe(12);
    expect(differences).toBe(0);

    // A rebuild from the log alone gives the same row.
    const before = w.stored();
    w.db.prepare("DROP TABLE resume_snapshot").run();
    const reopened = openDatabase(w.db.name);
    expect(
      JSON.parse(
        (
          reopened.prepare("SELECT point FROM resume_snapshot").get() as {
            point: string;
          }
        ).point,
      ),
    ).toEqual(before);
    reopened.close();
  });
});

describe("REQ-0206: the 30-day simulation's snapshots equal the log's", () => {
  it("compares every adventure's stored row with the point derived from its events", () => {
    const db = openDatabase(join(root, "sim.sqlite"));
    opened.push(db);
    const written = writeSyntheticLog(db, {
      days: 30,
      tasksPerDay: 20,
      seed: 11,
    });
    const ids = (
      db.prepare("SELECT DISTINCT adventure_id FROM adventures").all() as {
        adventure_id: string;
      }[]
    ).map((r) => r.adventure_id);
    let compared = 0;
    let differences = 0;
    for (const id of ids) {
      const events = adventureEvents(db, id);
      compared += events.length;
      const row = db
        .prepare("SELECT point FROM resume_snapshot WHERE adventure_id = ?")
        .get(id) as { point: string } | undefined;
      const derived = resumeFromLog(events);
      if (
        JSON.stringify(row && JSON.parse(row.point)) !== JSON.stringify(derived)
      )
        differences++;
    }
    expect(written).toBeGreaterThan(1000);
    expect(compared).toBeGreaterThan(1000);
    expect(differences).toBe(0);
  });
});

describe("REQ-0204: resume returns the same step on another device", () => {
  it("carries the floor, room, slot, task, view, attempt step and hint levels", async () => {
    const w = world();
    const a = await w.start("tablet");
    const answered = await w.next("tablet", a);
    await w.answer("tablet", a, answered.itemId);
    const open = await w.next("tablet", a);
    await w.post("tablet", `/api/item/${open.itemId}/hint`, { level: 1 });
    await w.leave("tablet", a);

    const current = AdventureCurrentOut.parse(
      await (await w.get("computer", "/api/adventure/current")).json(),
    ).adventure;
    const resumed = await w.resume("computer");

    expect(resumed.sessionId).not.toBe(a);
    expect(resumed).toMatchObject({
      adventureId: current?.adventureId,
      floor: current?.floor,
      room: current?.room,
      slot: current?.slot,
      itemId: open.itemId,
      view: open.view,
      attemptNo: 1,
      hintLevels: [1],
    });
    // The packet that follows is the same task, never a replacement.
    const again = await w.next("computer", resumed.sessionId);
    expect(again.itemId).toBe(open.itemId);
  });

  it("answers 404 when no adventure is open", async () => {
    const w = world();
    const reply = await w.post("tablet", "/api/adventure/resume");
    expect(reply.status).toBe(404);
  });
});

describe("REQ-0210, REQ-0212: a task left unanswered stays the first attempt", () => {
  it("counts the resumed answer as the first attempt and marks it interrupted", async () => {
    const w = world();
    const a = await w.start("tablet");
    const shown = await w.next("tablet", a);
    await w.leave("tablet", a);
    const b = await w.resume("tablet");
    const reply = AnswerOut.parse(
      await (await w.answer("tablet", b.sessionId, shown.itemId)).json(),
    );

    expect(reply.outcome).toBe("clean");
    const [attempt] = w.events("attempt_submitted");
    expect(attempt).toMatchObject({
      itemId: shown.itemId,
      attemptNo: 1,
      interrupted: true,
      crossDevice: false,
    });
    expect(w.events("verdict")[0]).toMatchObject({
      itemId: shown.itemId,
      attemptNo: 1,
      outcome: "clean",
    });
  });

  it("marks an uninterrupted attempt not interrupted", async () => {
    const w = world();
    const a = await w.start("tablet");
    const shown = await w.next("tablet", a);
    await w.answer("tablet", a, shown.itemId);
    expect(w.events("attempt_submitted")[0]).toMatchObject({
      interrupted: false,
      crossDevice: false,
    });
  });

  it("marks an attempt split by a rest stop as not interrupted (REQ-2412)", async () => {
    const w = world();
    const a = await w.start("tablet");
    const shown = await w.next("tablet", a);
    await w.post("tablet", `/api/session/${a}/break`, { action: "start" });
    await w.post("tablet", `/api/session/${a}/break`, { action: "end" });
    await w.answer("tablet", a, shown.itemId);
    expect(w.events("attempt_submitted")[0]).toMatchObject({
      interrupted: false,
    });
  });
});

describe("REQ-0214: a paid action repeated after a resume charges nothing", () => {
  it("spends no thread and returns the same result for a hint, an explanation and a second attempt", async () => {
    const w = world();
    const a = await w.start("tablet");
    const shown = await w.next("tablet", a);
    const hint = HintOut.parse(
      await (
        await w.post("tablet", `/api/item/${shown.itemId}/hint`, { level: 1 })
      ).json(),
    );
    const explained = ExplainOut.parse(
      await (
        await w.post("tablet", `/api/item/${shown.itemId}/explain`)
      ).json(),
    );
    await w.answer("tablet", a, shown.itemId);
    const twin = Room.parse(
      await (
        await w.post("tablet", `/api/item/${shown.itemId}/second-attempt`)
      ).json(),
    );
    await w.leave("tablet", a);
    const spent = w.events("thread_spent").length;

    const b = await w.resume("computer");
    expect(b.sessionId).toBeTruthy();
    const hintAgain = HintOut.parse(
      await (
        await w.post("computer", `/api/item/${shown.itemId}/hint`, { level: 1 })
      ).json(),
    );
    const explainAgain = ExplainOut.parse(
      await (
        await w.post("computer", `/api/item/${shown.itemId}/explain`)
      ).json(),
    );
    const twinAgain = Room.parse(
      await (
        await w.post("computer", `/api/item/${shown.itemId}/second-attempt`)
      ).json(),
    );

    expect(w.events("thread_spent").length).toBe(spent);
    expect(w.events("hint_shown")).toHaveLength(1);
    // The same rung and text, and the stock as it stands after both payments.
    expect(hintAgain).toEqual({ ...hint, threads: explained.threads });
    expect(explainAgain.threads).toBe(explained.threads);
    expect(twinAgain.itemId).toBe(twin.itemId);
  });
});

describe("REQ-0224: an attempt from another kind of device is flagged", () => {
  it("sets crossDevice when a computer submits a task a tablet showed", async () => {
    const w = world();
    const a = await w.start("tablet");
    const shown = await w.next("tablet", a);
    await w.leave("tablet", a);
    const b = await w.resume("computer");
    await w.answer("computer", b.sessionId, shown.itemId);
    expect(w.events("attempt_submitted")[0]).toMatchObject({
      crossDevice: true,
    });
  });

  it("leaves crossDevice false on the device that showed the task", async () => {
    const w = world();
    const a = await w.start("computer");
    const shown = await w.next("computer", a);
    await w.answer("computer", a, shown.itemId);
    expect(w.events("attempt_submitted")[0]).toMatchObject({
      crossDevice: false,
    });
  });
});

describe("ADR-0020: attempt_submitted gains a version with the two flags", () => {
  it("lifts a version 1 payload with both flags false", () => {
    const registry = createRegistry(EVENT_DEFS);
    const v1 = {
      itemId: "i",
      attemptNo: 1,
      input,
      answer: { entered: "7", parsed: "7" },
      assisted: false,
      hintLevel: 0,
    };
    registry.validate("attempt_submitted", 1, v1);
    const lifted = registry.upcast("attempt_submitted", 1, v1);
    expect(lifted.v).toBe(2);
    expect(lifted.payload).toMatchObject({
      interrupted: false,
      crossDevice: false,
    });
    registry.validate("attempt_submitted", 2, lifted.payload);
  });
});
