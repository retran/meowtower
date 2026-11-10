// REQ-8506, REQ-8520, REQ-2226: a profile's schema in Postgres holds the tables of the game and the
// log's guard, refuses to start without the guard, and shows no row to another profile.
import { afterAll, describe, expect, it } from "vitest";
import { openProfile } from "../../src/server/database.js";
import { dropSchema, type Db } from "../../src/server/db/index.js";

const URL =
  process.env["MEOWTOWER_TEST_DATABASE_URL"] ??
  "postgres://postgres@127.0.0.1:55432/postgres";
const opened: Db[] = [];
const schemas: string[] = [];
let n = 0;
afterAll(async () => {
  for (const db of opened) await db.close();
  for (const s of schemas) await dropSchema(URL, s);
});

const schemaName = (): string => {
  const s = `p_${String(process.pid)}_${String(++n)}`;
  schemas.push(s);
  return s;
};
const open = async (schema: string): Promise<Db> => {
  const db = await openProfile(URL, schema);
  opened.push(db);
  return db;
};
const event = (id: string) =>
  [id, "2026-11-08T00:00:00Z", 1, "d", "session_started", 1, "{}"] as const;
const append = async (db: Db, id: string): Promise<void> => {
  await db
    .prepare(
      "INSERT INTO events (id, ts, client_ms, device_id, type, v, payload) VALUES (?, ?, ?, ?, ?, ?, ?)",
    )
    .run(...event(id));
};

describe("a profile's schema in Postgres", () => {
  it("applies the fourteen migrations once and keeps them across a reopen", async () => {
    const schema = schemaName();
    const first = await open(schema);
    const versions = async (db: Db) =>
      (
        (await db
          .prepare("SELECT version FROM schema_migrations ORDER BY version")
          .all()) as { version: number }[]
      ).map((r) => r.version);
    expect(await versions(first)).toEqual(
      Array.from({ length: 14 }, (_, i) => i + 1),
    );
    await first.close();
    const again = await open(schema);
    expect(await versions(again)).toHaveLength(14);
  });

  it("refuses to change or remove an event or a blob", async () => {
    const db = await open(schemaName());
    await append(db, "e1");
    for (const sql of [
      "UPDATE events SET type = 'x'",
      "DELETE FROM events",
      "TRUNCATE events",
    ])
      await expect(db.exec(sql)).rejects.toThrow("events are append-only");
    await db
      .prepare(
        "INSERT INTO blobs (sha256, bytes, created_at) VALUES (?, 1, 'x')",
      )
      .run("a".repeat(64));
    await expect(db.exec("DELETE FROM blobs")).rejects.toThrow(
      "events are append-only",
    );
    expect(
      (
        (await db.prepare("SELECT COUNT(*) AS n FROM events").get()) as {
          n: number;
        }
      ).n,
    ).toBe(1);
  });

  it("numbers events in one rising sequence", async () => {
    const db = await open(schemaName());
    await append(db, "a");
    await append(db, "b");
    expect(
      (
        (await db.prepare("SELECT seq FROM events ORDER BY seq").all()) as {
          seq: number;
        }[]
      ).map((r) => r.seq),
    ).toEqual([1, 2]);
  });

  it("refuses to start when a guard trigger is gone or disabled", async () => {
    const dropped = schemaName();
    const db = await open(dropped);
    await db.exec("DROP TRIGGER events_no_update ON events");
    await db.close();
    await expect(openProfile(URL, dropped)).rejects.toThrow(
      "log_guard_missing: events_no_update",
    );

    const disabled = schemaName();
    const other = await open(disabled);
    await other.exec("ALTER TABLE events DISABLE TRIGGER events_no_delete");
    await other.close();
    await expect(openProfile(URL, disabled)).rejects.toThrow(
      "log_guard_missing: events_no_delete",
    );
  });

  it("shows another profile none of a profile's rows", async () => {
    const first = await open(schemaName());
    const second = await open(schemaName());
    await append(first, "mine");
    const count = async (db: Db) =>
      (
        (await db.prepare("SELECT COUNT(*) AS n FROM events").get()) as {
          n: number;
        }
      ).n;
    expect(await count(first)).toBe(1);
    expect(await count(second)).toBe(0);
  });
});
