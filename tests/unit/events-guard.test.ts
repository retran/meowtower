// REQ-2226: the log refuses every change or removal of a stored event, at the
// level of the database, and meowtower won't start without that guard.
import { spawn } from "node:child_process";
import { copyFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import Database from "better-sqlite3";
import { afterEach, describe, expect, it } from "vitest";
import { appendEvents } from "../../src/engine/events/append.js";
import {
  GUARDED_TRIGGERS,
  openDatabase,
  type Db,
} from "../../src/server/database.js";

const dirs: string[] = [];
afterEach(() => {
  for (const dir of dirs.splice(0))
    rmSync(dir, { recursive: true, force: true });
});
const fresh = (): string => {
  const dir = mkdtempSync(join(tmpdir(), "meowtower-guard-"));
  dirs.push(dir);
  return join(dir, "meowtower.sqlite");
};

function seeded(): { path: string; db: Db } {
  const path = fresh();
  const db = openDatabase(path);
  appendEvents(db, [
    {
      type: "attempt_submitted",
      v: 0,
      payload: { raw: "7" },
      origin: "server",
    },
    {
      type: "attempt_submitted",
      v: 0,
      payload: { raw: "8" },
      origin: "server",
    },
  ]);
  return { path, db };
}

const rows = (db: Db): unknown[] =>
  db.prepare("SELECT * FROM events ORDER BY seq").all();

function refusesChange(db: Db): void {
  const before = rows(db);
  expect(before).toHaveLength(2);
  expect(() => db.exec("UPDATE events SET type = type")).toThrow(
    "events are append-only",
  );
  expect(() => db.exec("DELETE FROM events")).toThrow("events are append-only");
  expect(rows(db)).toEqual(before);
}

describe("REQ-2226: the log is append-only at the database", () => {
  it("refuses UPDATE and DELETE and leaves every row unchanged", () => {
    const { db } = seeded();
    refusesChange(db);
    db.close();
  });

  it("refuses them from a second connection that skips meowtower's code", () => {
    const { path, db } = seeded();
    const raw = new Database(path);
    expect(() => raw.exec("DELETE FROM events WHERE seq = 1")).toThrow(
      "events are append-only",
    );
    raw.close();
    db.close();
  });

  // ADR-0020's third reversal condition: a VACUUM or a schema change the
  // runner allows must not strip the triggers.
  it.each([
    ["VACUUM", "VACUUM"],
    ["ADD COLUMN", "ALTER TABLE events ADD COLUMN note TEXT"],
    ["DROP COLUMN", "ALTER TABLE events DROP COLUMN note"],
    ["CREATE INDEX", "CREATE INDEX events_type ON events (type)"],
    ["DROP INDEX", "DROP INDEX events_type"],
    ["another table", "CREATE TABLE other (x INTEGER) STRICT"],
    ["rename another table", "ALTER TABLE other RENAME TO other2"],
    ["REINDEX", "REINDEX"],
    ["ANALYZE", "ANALYZE"],
  ])("keeps both triggers after %s", (_name, sql) => {
    const { db } = seeded();
    if (sql.includes("DROP COLUMN"))
      db.exec("ALTER TABLE events ADD COLUMN note TEXT");
    if (sql.includes("DROP INDEX"))
      db.exec("CREATE INDEX events_type ON events (type)");
    if (sql.includes("RENAME")) db.exec("CREATE TABLE other (x INTEGER)");
    db.exec(sql);
    refusesChange(db);
    db.close();
  });

  it("keeps both triggers in a VACUUM INTO copy", () => {
    const { db } = seeded();
    const copy = fresh();
    db.prepare("VACUUM INTO ?").run(copy);
    db.close();
    const reopened = openDatabase(copy);
    refusesChange(reopened);
    reopened.close();
  });
});

describe("REQ-2226: meowtower refuses to start without the guard", () => {
  it.each(GUARDED_TRIGGERS.map((g) => g.name))(
    "exits with log_guard_missing when %s is dropped",
    async (trigger) => {
      const { path, db } = seeded();
      db.close();
      const copy = fresh();
      copyFileSync(path, copy);
      const raw = new Database(copy);
      raw.exec(`DROP TRIGGER ${trigger}`);
      raw.close();

      const child = spawn(
        process.execPath,
        ["--import", "tsx", "src/server/main.ts"],
        {
          env: {
            ...process.env,
            MEOWTOWER_DB: copy,
            PORT: "3921",
            PARENT_PORT: "3922",
          },
          stdio: ["ignore", "ignore", "pipe"],
        },
      );
      let stderr = "";
      child.stderr.on("data", (d: Buffer) => (stderr += d.toString()));
      const timer = setTimeout(() => child.kill("SIGKILL"), 10000);
      const code = await new Promise<number | null>((r) =>
        child.once("exit", r),
      );
      clearTimeout(timer);
      expect(code).not.toBe(0);
      expect(code).not.toBeNull();
      expect(stderr).toContain(`log_guard_missing: ${trigger}`);
    },
    15000,
  );
});
