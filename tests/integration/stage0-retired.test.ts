// TSK-0440: the stage 0 write routes are gone (ADR-0360 entry 3), because a
// write route that bypasses the play API puts events in the log that no play
// rule checked; the version 0 events they wrote stay readable.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { appendEvents } from "../../src/engine/events/append.js";
import { allEvents, eventByIdemKey } from "../../src/engine/events/read.js";
import {
  PROJECTIONS,
  rebuildMissing,
} from "../../src/engine/projections/registry.js";
import { createApp } from "../../src/server/app.js";
import { openDatabase, type Db } from "../../src/server/database.js";
import { registerDevice } from "../../src/server/devices.js";

const root = mkdtempSync(join(tmpdir(), "meowtower-stage0-retired-"));
const opened: Db[] = [];
afterAll(() => {
  for (const db of opened) db.close();
  rmSync(root, { recursive: true, force: true });
});

function database(name: string): Db {
  const db = openDatabase(join(root, `${name}.sqlite`));
  opened.push(db);
  return db;
}

describe("TSK-0440 criterion 1: the stage 0 write routes answer 404", () => {
  it("answers a paired device 404 on both routes", async () => {
    const db = database("routes");
    const app = createApp({ db });
    const cookie = `meowtower_device=${registerDevice(db, "tablet")}`;
    const post = await app.request("/api/stage0/write", {
      method: "POST",
      headers: { "content-type": "application/json", cookie },
      body: JSON.stringify({ id: "w1", answer: "7" }),
    });
    expect(post.status).toBe(404);
    const get = await app.request("/api/stage0/write/w1", {
      headers: { cookie },
    });
    expect(get.status).toBe(404);
    expect(eventByIdemKey(db, "w1")).toBeUndefined();
  });
});

describe("TSK-0440 criterion 2: version 0 events the routes wrote stay readable", () => {
  it("reads each one back unchanged after the projections rebuild", () => {
    const db = database("fixture");
    // As the routes wrote them: attempt_submitted at version 0 with the raw answer.
    for (const [id, raw] of [
      ["s0-1", "12"],
      ["s0-2", ""],
      ["s0-3", "3/4"],
    ] as const)
      appendEvents(db, [
        {
          type: "attempt_submitted",
          v: 0,
          payload: { raw },
          origin: { deviceId: "unpaired", clientMs: 1_700_000_000_000 },
          idemKey: id,
        },
      ]);
    const before = ["s0-1", "s0-2", "s0-3"].map((id) => eventByIdemKey(db, id));
    // A start-up with every projection table missing rebuilds them from the log.
    for (const p of PROJECTIONS) db.exec(`DROP TABLE IF EXISTS ${p.table}`);
    const rebuilt = rebuildMissing(
      db,
      () => allEvents(db),
      new Date().toISOString(),
    );
    expect(rebuilt.length).toBe(PROJECTIONS.length);
    const after = ["s0-1", "s0-2", "s0-3"].map((id) => eventByIdemKey(db, id));
    expect(after).toEqual(before);
    expect(after.map((e) => e?.payload)).toEqual([
      { raw: "12" },
      { raw: "" },
      { raw: "3/4" },
    ]);
    expect(
      after.every((e) => e?.type === "attempt_submitted" && e.v === 0),
    ).toBe(true);
  });
});
