// REQ-8522, REQ-8526: the player's log moves into a Postgres schema with every event, the same
// derived tables and the same service rows, and the SQLite file stays as it was.
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import Database from "better-sqlite3";
import { afterAll, expect, it } from "vitest";
import { openDatabase, openProfile } from "../../src/server/database.js";
import { dropSchema } from "../../src/server/db/index.js";
import { registerDevice } from "../../src/server/devices.js";
import { MoveRefused, moveToPostgres } from "../../src/server/move.js";
import { sqliteOnly } from "../helpers/backend.js";
import { writeSyntheticLog } from "../helpers/synthetic-log.js";

const URL =
  process.env["MEOWTOWER_TEST_DATABASE_URL"] ??
  "postgres://postgres@127.0.0.1:55432/postgres";
const root = mkdtempSync(join(tmpdir(), "meowtower-move-"));
const schemas: string[] = [];
afterAll(async () => {
  for (const s of schemas) await dropSchema(URL, s);
  rmSync(root, { recursive: true, force: true });
});
let n = 0;
const schemaName = (): string => {
  const s = `p_${String(process.pid)}_mv${String(++n)}`;
  schemas.push(s);
  return s;
};
const hashOf = (file: string): string =>
  createHash("sha256").update(readFileSync(file)).digest("hex");

/** A SQLite file holding a played log and a paired device, closed and flushed. */
async function played(name: string): Promise<{ file: string; events: number }> {
  const file = join(root, name);
  const db = await openDatabase(file);
  const events = await writeSyntheticLog(db, {
    days: 12,
    tasksPerDay: 10,
    seed: 3,
  });
  await registerDevice(db, "tablet");
  await db.close();
  new Database(file).pragma("wal_checkpoint(TRUNCATE)");
  return { file, events };
}

// The move reads a SQLite file, so the suite runs it on SQLite only; it opens Postgres itself.
sqliteOnly("the move of the log into Postgres", () => {
  it("copies every event, rebuilds the derived tables and leaves the file as it was", async () => {
    const { file, events } = await played("a.sqlite");
    const before = hashOf(file);
    const schema = schemaName();
    const report = await moveToPostgres(file, URL, schema);
    expect(report.events).toBe(events);
    expect(report.tables["devices"]).toBe(1);
    expect(report.derivedTables).toBeGreaterThan(5);
    expect(hashOf(file)).toBe(before);

    const target = await openProfile(URL, schema);
    const count = (await target
      .prepare("SELECT count(*) AS n, max(seq) AS last FROM events")
      .get()) as { n: number; last: number };
    expect(count.n).toBe(events);
    expect(count.last).toBe(events);
    // The next event takes the next number, not one already used.
    await target
      .prepare(
        "INSERT INTO events (id, ts, client_ms, device_id, type, v, payload) VALUES ('after', 'x', 1, 'server', 'session_started', 1, '{}')",
      )
      .run();
    expect(
      (
        (await target.prepare("SELECT max(seq) AS last FROM events").get()) as {
          last: number;
        }
      ).last,
    ).toBe(events + 1);
    await target.close();
  });

  it("refuses a schema that already holds events", async () => {
    const { file } = await played("b.sqlite");
    const schema = schemaName();
    await moveToPostgres(file, URL, schema);
    await expect(moveToPostgres(file, URL, schema)).rejects.toThrow(
      MoveRefused,
    );
  });

  it("moves an empty log", async () => {
    const file = join(root, "empty.sqlite");
    const db = await openDatabase(file);
    await db.close();
    const report = await moveToPostgres(file, URL, schemaName());
    expect(report.events).toBe(0);
  });
});
