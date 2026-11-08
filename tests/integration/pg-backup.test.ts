// REQ-8524, REQ-8528: a profile in Postgres backs up to a SQLite file that holds the same log and
// derived tables, restores from the newest one in a swap, and exports the seven files.
import { existsSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import Database from "better-sqlite3";
import { afterAll, expect, it } from "vitest";
import { appendEvents } from "../../src/engine/events/append.js";
import { backupAfterSession, readNotices } from "../../src/server/backups.js";
import { openProfile } from "../../src/server/database.js";
import { dropSchema, type Db } from "../../src/server/db/index.js";
import { EXPORT_FILES, exportProfile } from "../../src/server/export.js";
import {
  restoreNewestProfile,
  snapshotProfile,
} from "../../src/server/pg-backup.js";
import { sqliteOnly } from "../helpers/backend.js";
import { writeSyntheticLog } from "../helpers/synthetic-log.js";

const URL =
  process.env["MEOWTOWER_TEST_DATABASE_URL"] ??
  "postgres://postgres@127.0.0.1:55432/postgres";
const root = mkdtempSync(join(tmpdir(), "meowtower-pgbackup-"));
const opened: Db[] = [];
const schemas: string[] = [];
let n = 0;
afterAll(async () => {
  for (const db of opened) await db.close();
  for (const s of schemas) await dropSchema(URL, s);
  rmSync(root, { recursive: true, force: true });
});

async function profile(): Promise<{ db: Db; schema: string; events: number }> {
  const schema = `p_${String(process.pid)}_bk${String(++n)}`;
  schemas.push(schema, `${schema}_restore`, `${schema}_old`);
  const db = await openProfile(URL, schema);
  opened.push(db);
  const events = await writeSyntheticLog(db, {
    days: 8,
    tasksPerDay: 10,
    seed: 4,
  });
  return { db, schema, events };
}
const countOf = async (db: Db): Promise<number> =>
  Number(
    (
      (await db.prepare("SELECT count(*) AS n FROM events").get()) as {
        n: number;
      }
    ).n,
  );

sqliteOnly("backups of a profile in Postgres", () => {
  it("writes a SQLite file with the same log and the rebuilt tables", async () => {
    const { db, events } = await profile();
    const dir = join(root, "snaps-a");
    const snap = await snapshotProfile(
      db,
      dir,
      new Date("2026-11-08T10:00:00Z"),
    );
    expect(snap.file).toMatch(/meowtower-2026-11-08T10-00-00Z\.sqlite$/);
    expect(existsSync(`${snap.file}-wal`)).toBe(false);
    const copy = new Database(snap.file, { readonly: true });
    expect(
      (copy.prepare("SELECT count(*) AS n FROM events").get() as { n: number })
        .n,
    ).toBe(events);
    expect(
      (
        copy.prepare("SELECT count(*) AS n FROM items_view").get() as {
          n: number;
        }
      ).n,
    ).toBeGreaterThan(0);
    copy.close();
  });

  it("restores the newest snapshot over the live profile and leaves no side schema", async () => {
    const { db, schema, events } = await profile();
    const dir = join(root, "snaps-b");
    await snapshotProfile(db, dir, new Date("2026-11-08T11:00:00Z"));
    // Play goes on after the backup; the restore must drop it.
    await appendEvents(db, [
      {
        type: "free_text",
        v: 1,
        origin: "server",
        payload: { sceneId: "later", cleaned: "after the backup" },
      },
    ]);
    expect(await countOf(db)).toBe(events + 1);
    await db.close();
    await restoreNewestProfile(URL, schema, dir);

    const back = await openProfile(URL, schema);
    opened.push(back);
    expect(await countOf(back)).toBe(events);
    const rest = await openProfile(URL, `${schema}_probe`);
    schemas.push(`${schema}_probe`);
    opened.push(rest);
    const names = (await rest
      .prepare("SELECT nspname FROM pg_namespace WHERE nspname IN (?, ?)")
      .all(`${schema}_restore`, `${schema}_old`)) as unknown[];
    expect(names).toEqual([]);
  });

  it("takes a backup after a session through the snapshot function and prunes", async () => {
    const { db } = await profile();
    const dir = join(root, "snaps-c");
    await backupAfterSession({
      live: "",
      dir,
      dataRoot: root,
      now: () => Date.parse("2026-11-08T12:00:00Z"),
      sizeOf: () => 0,
      take: (d, at) => snapshotProfile(db, d, at),
    });
    expect(readdirSync(dir).some((f) => f.endsWith(".sqlite"))).toBe(true);
    expect(readNotices(dir).backup_failed).toBeNull();
  });

  it("exports the files of the export from the profile", async () => {
    const { db, events } = await profile();
    const out = join(root, "exports");
    const { dir, counts } = await exportProfile(
      db,
      out,
      new Date("2026-11-08T13:00:00Z"),
    );
    expect(counts.events).toBe(events);
    for (const f of EXPORT_FILES) expect(existsSync(join(dir, f))).toBe(true);
    expect(existsSync(join(dir, ".copy.sqlite"))).toBe(false);
  });
});
