// TSK-0070: snapshots on demand and before migrations (REQ-2528), holding the
// log and the blobs table (REQ-2532), read by Mac programs instead of the live
// file (REQ-2524), and restore.
import {
  cpSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import Database from "better-sqlite3";
import { afterAll, describe, expect, it } from "vitest";
import { appendEvents } from "../../src/engine/events/append.js";
import { storeScratch } from "../../src/engine/blobs/store.js";
import { openDatabase } from "../../src/server/database.js";
import {
  restoreNewest,
  snapshotNow,
  takeSnapshot,
} from "../../src/server/snapshots.js";
import { webp } from "../helpers/webp.js";

const dir = mkdtempSync(join(tmpdir(), "meowtower-snap-"));
afterAll(() => rmSync(dir, { recursive: true, force: true }));
const tables = (path: string): string[] => {
  const d = new Database(path, { readonly: true });
  const names = (
    d
      .prepare(
        "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name",
      )
      .all() as {
      name: string;
    }[]
  ).map((r) => r.name);
  d.close();
  return names;
};
const count = (path: string, table: string): number => {
  const d = new Database(path, { readonly: true });
  const n = (
    d.prepare(`SELECT count(*) AS n FROM ${table}`).get() as { n: number }
  ).n;
  d.close();
  return n;
};

describe("REQ-2532, REQ-2524: a snapshot is a readable copy holding the log and blobs", () => {
  it("writes meowtower-<UTC timestamp>.sqlite with every table and the rows", async () => {
    const live = join(dir, "a.sqlite");
    const snaps = join(dir, "snaps-a");
    const db = openDatabase(live);
    appendEvents(db, [
      {
        type: "attempt_submitted",
        v: 0,
        payload: { raw: "1" },
        origin: "server",
      },
    ]);
    storeScratch(db, join(dir, "blobs-a"), webp("pad"), {
      itemId: "i",
      attemptNo: 1,
      origin: "server",
    });
    const taken = await takeSnapshot(
      live,
      snaps,
      new Date("2026-09-27T12:00:00Z"),
    );
    expect(taken.file).toBe(
      join(snaps, "meowtower-2026-09-27T12-00-00Z.sqlite"),
    );
    expect(taken.ms).toBeGreaterThanOrEqual(0);
    expect(tables(taken.file)).toEqual(tables(live));
    expect(count(taken.file, "events")).toBe(count(live, "events"));
    expect(count(taken.file, "blobs")).toBe(1);
    db.close();
  });
});

describe("REQ-2528: a snapshot before a pending migration", () => {
  it("snapshots a database that holds data before the migration runs", () => {
    const live = join(dir, "b.sqlite");
    const snaps = join(dir, "snaps-b");
    const migrations = join(dir, "migrations-b");
    cpSync("migrations", migrations, { recursive: true });
    const url = new URL(`file://${migrations}/`);
    const db = openDatabase(live, { migrations: url });
    appendEvents(db, [
      {
        type: "attempt_submitted",
        v: 0,
        payload: { raw: "2" },
        origin: "server",
      },
    ]);
    db.close();
    writeFileSync(
      join(migrations, "0099_add_note.sql"),
      "CREATE TABLE note (x INTEGER) STRICT;",
    );
    const reopened = openDatabase(live, {
      migrations: url,
      beforeMigrate: (d) =>
        snapshotNow(d, snaps, new Date("2026-09-27T13:00:00Z")),
    });
    reopened.close();
    const [file] = readdirSync(snaps);
    expect(file).toBe("meowtower-2026-09-27T13-00-00Z.sqlite");
    const before = tables(join(snaps, file ?? ""));
    expect(before).not.toContain("note");
    expect(tables(live)).toContain("note");
  });

  it("takes no snapshot of a fresh database", () => {
    const snaps = join(dir, "snaps-c");
    openDatabase(join(dir, "c.sqlite"), {
      beforeMigrate: (d) => snapshotNow(d, snaps, new Date()),
    }).close();
    expect(() => readdirSync(snaps)).toThrow();
  });
});

describe("snapshots don't hold up writes", () => {
  it("lets writes run while a snapshot runs, none waiting for it", async () => {
    const live = join(dir, "d.sqlite");
    const db = openDatabase(live);
    const filler = Array.from({ length: 2000 }, (_, i) => ({
      type: "attempt_submitted",
      v: 0,
      payload: { raw: "x".repeat(2000) + i },
      origin: "server" as const,
    }));
    for (let i = 0; i < 20; i++) appendEvents(db, filler);
    const snapshot = takeSnapshot(live, join(dir, "snaps-d"), new Date());
    let worst = 0;
    let writes = 0;
    let done = false;
    let snapshotMs = 0;
    void snapshot.then((t) => {
      snapshotMs = t.ms;
      done = true;
    });
    while (!done) {
      const t0 = performance.now();
      appendEvents(db, [
        {
          type: "attempt_submitted",
          v: 0,
          payload: { raw: "w" },
          origin: "server",
        },
      ]);
      worst = Math.max(worst, performance.now() - t0);
      writes++;
      await new Promise((r) => setImmediate(r));
    }
    console.log(
      `writes during snapshot: ${writes}, worst ${worst.toFixed(2)} ms, snapshot ${snapshotMs} ms`,
    );
    // A write that waited for the snapshot would take about as long as it does.
    expect(writes).toBeGreaterThan(1);
    expect(worst).toBeLessThan(snapshotMs / 2);
    db.close();
  }, 60000);
});

describe("restore", () => {
  it("makes the live database equal the newest snapshot", async () => {
    const live = join(dir, "e.sqlite");
    const snaps = join(dir, "snaps-e");
    const db = openDatabase(live);
    appendEvents(db, [
      {
        type: "attempt_submitted",
        v: 0,
        payload: { raw: "kept" },
        origin: "server",
      },
    ]);
    await takeSnapshot(live, snaps, new Date("2026-09-27T10:00:00Z"));
    appendEvents(db, [
      {
        type: "attempt_submitted",
        v: 0,
        payload: { raw: "after" },
        origin: "server",
      },
    ]);
    await takeSnapshot(live, snaps, new Date("2026-09-27T11:00:00Z"));
    appendEvents(db, [
      {
        type: "attempt_submitted",
        v: 0,
        payload: { raw: "lost" },
        origin: "server",
      },
    ]);
    db.close();
    const used = restoreNewest(snaps, live);
    expect(used).toBe(join(snaps, "meowtower-2026-09-27T11-00-00Z.sqlite"));
    expect(count(live, "events")).toBe(2);
  });
});
