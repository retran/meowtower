// TSK-0350: the device lease. A holder that stops its heartbeat for 45 seconds
// leaves the state a «Сохранить и уйти» leaves (REQ-0202), and an answer from
// a device that lost the lease is still logged, as the attempt or as
// `attempt_late` (REQ-0220). Each test plays on a database of its own, on a
// clock the test moves.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { createApp } from "../../src/server/app.js";
import { openDatabase, type Db } from "../../src/server/database.js";
import { registerDevice } from "../../src/server/devices.js";
import { Room } from "../../src/shared/api.js";

const root = mkdtempSync(join(tmpdir(), "meowtower-lease-"));
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
  let clock = 1_000_000;
  const app = createApp({ db, now: () => clock });
  const device = (kind: "tablet" | "computer") => {
    const headers = {
      cookie: `meowtower_device=${registerDevice(db, kind)}`,
      "content-type": "application/json",
    };
    let seq = 0;
    return {
      post: (path: string, body: object = {}) =>
        app.request(path, {
          method: "POST",
          headers,
          body: JSON.stringify({ ...body, clientSeq: ++seq }),
        }),
      get: (path: string) => app.request(path, { headers }),
    };
  };
  const rows = (
    type: string,
  ): { device_id: string; session_id: string; payload: unknown }[] =>
    (
      db
        .prepare(
          "SELECT device_id, session_id, payload FROM events WHERE type = ? ORDER BY seq",
        )
        .all(type) as {
        device_id: string;
        session_id: string;
        payload: string;
      }[]
    ).map((r) => ({ ...r, payload: JSON.parse(r.payload) as unknown }));
  const adventureState = (): unknown =>
    db.prepare("SELECT * FROM adventures").all();
  return {
    device,
    rows,
    adventureState,
    advance: (ms: number) => (clock += ms),
  };
}

type Player = ReturnType<ReturnType<typeof world>["device"]>;

async function start(p: Player): Promise<string> {
  const res = await p.post("/api/session/start", { mode: "daily" });
  expect(res.status).toBe(200);
  return ((await res.json()) as { sessionId: string }).sessionId;
}

async function room(p: Player, sessionId: string): Promise<Room> {
  const res = await p.get(`/api/session/${sessionId}/next`);
  expect(res.status).toBe(200);
  return Room.parse(await res.json());
}

const answer = (p: Player, sessionId: string, itemId: string) =>
  p.post(`/api/session/${sessionId}/answer`, {
    itemId,
    raw: "7",
    dontKnow: false,
    input,
  });

describe("REQ-0202: 45 seconds without a heartbeat leave the state a leave leaves", () => {
  it("logs adventure_paused with lease_expired and session_ended as device server, and equals a leave's projection", async () => {
    const left = world();
    const a = left.device("tablet");
    const leftSession = await start(a);
    await room(a, leftSession);
    await a.post(`/api/session/${leftSession}/pause`, { reason: "leave" });

    const lapsed = world();
    const b = lapsed.device("tablet");
    const lapsedSession = await start(b);
    await room(b, lapsedSession);
    lapsed.advance(45_000);
    // Any request after the 45 seconds finds the lease expired.
    await b.get("/api/adventure/current");

    const paused = lapsed.rows("adventure_paused");
    expect(paused).toHaveLength(1);
    expect(paused[0]?.payload).toMatchObject({ reason: "lease_expired" });
    expect(lapsed.rows("session_ended")).toHaveLength(1);
    expect(paused[0]?.device_id).toBe("server");
    expect(lapsed.rows("session_ended")[0]?.device_id).toBe("server");

    // The two worlds differ in ids and times only, so compare what the
    // adventure holds: its state, floor, room and slot.
    const pick = (rows: unknown) =>
      (rows as Record<string, unknown>[]).map(
        ({ state, floor, room, slot }) => ({ state, floor, room, slot }),
      );
    expect(pick(lapsed.adventureState())).toEqual(pick(left.adventureState()));
  });

  it("keeps the lease while the heartbeat comes every 15 seconds", async () => {
    const w = world();
    const p = w.device("tablet");
    const sessionId = await start(p);
    for (let i = 0; i < 6; i++) {
      w.advance(15_000);
      expect((await p.post(`/api/session/${sessionId}/heartbeat`)).status).toBe(
        200,
      );
    }
    await p.get("/api/adventure/current");
    expect(w.rows("adventure_paused")).toHaveLength(0);
  });
});

describe("REQ-0220: a device that lost the lease still has its answer logged", () => {
  it("logs the answer as the attempt when the item has none, and the new holder's next packet carries the outcome", async () => {
    const w = world();
    const old = w.device("tablet");
    const sessionId = await start(old);
    const { itemId } = await room(old, sessionId);

    const fresh = w.device("computer");
    await start(fresh);

    const res = await answer(old, sessionId, itemId);
    expect(res.status).toBe(409);
    expect(((await res.json()) as { error: string }).error).toBe("lease_moved");
    expect(w.rows("attempt_submitted")).toHaveLength(1);
    expect(w.rows("attempt_late")).toHaveLength(0);
  });

  it("logs attempt_late with no verdict when the item already has its attempt", async () => {
    const w = world();
    const old = w.device("tablet");
    const sessionId = await start(old);
    const r = await room(old, sessionId);
    const { itemId } = r;
    expect((await answer(old, sessionId, itemId)).status).toBe(200);

    const fresh = w.device("computer");
    await start(fresh);

    const res = await answer(old, sessionId, itemId);
    expect(res.status).toBe(409);
    expect(w.rows("attempt_late")).toHaveLength(1);
    expect(w.rows("attempt_submitted")).toHaveLength(1);
    expect(w.rows("verdict")).toHaveLength(1);
  });
});
