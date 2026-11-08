// REQ-2226: the migration runner refuses a migration that drops or replaces a
// guarded trigger, and applies nothing of it.
import {
  cpSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { openDatabase } from "../../src/server/database.js";

// The newest migration the repository ships; a refused one leaves it newest.
const LATEST = Math.max(
  ...readdirSync("migrations")
    .filter((f) => /^\d{4}_.+\.sql$/.test(f))
    .map((f) => Number(f.slice(0, 4))),
);

const dirs: string[] = [];
afterEach(() => {
  for (const dir of dirs.splice(0))
    rmSync(dir, { recursive: true, force: true });
});

async function setup(bad: string): Promise<{ path: string; migrations: URL }> {
  const dir = mkdtempSync(join(tmpdir(), "meowtower-migrations-"));
  dirs.push(dir);
  const migrations = join(dir, "migrations");
  cpSync("migrations", migrations, { recursive: true });
  const path = join(dir, "meowtower.sqlite");
  // Bring the database to the current schema before the bad file lands.
  await (
    await openDatabase(path, { migrations: pathToFileURL(`${migrations}/`) })
  ).close();
  writeFileSync(
    join(migrations, "0099_bad.sql"),
    `CREATE TABLE sneaked_in (x INTEGER);\n${bad}\n`,
  );
  return { path, migrations: pathToFileURL(`${migrations}/`) };
}

describe("REQ-2226: the migration runner guards the triggers", () => {
  it.each([
    ["drops a trigger", "DROP TRIGGER events_no_update;"],
    [
      "drops a trigger if it exists",
      "DROP TRIGGER IF EXISTS events_no_delete;",
    ],
    [
      "replaces a trigger",
      "DROP TRIGGER events_no_delete;\nCREATE TRIGGER events_no_delete BEFORE DELETE ON events BEGIN SELECT 1; END;",
    ],
    ["drops the guarded table", "DROP TABLE events;"],
    ["renames the guarded table", "ALTER TABLE events RENAME TO events_old;"],
    ["writes the schema directly", "PRAGMA writable_schema = ON;"],
  ])(
    "refuses a migration that %s and applies nothing of it",
    async (_name, sql) => {
      const { path, migrations } = await setup(sql);
      await expect(openDatabase(path, { migrations })).rejects.toThrow(
        /migration_refused: 0099_bad\.sql/,
      );
      const db = await openDatabase(path);
      const tables = await db
        .prepare("SELECT name FROM sqlite_master WHERE name = 'sneaked_in'")
        .all();
      expect(tables).toEqual([]);
      expect(
        await db
          .prepare("SELECT max(version) AS v FROM schema_migrations")
          .get(),
      ).toEqual({ v: LATEST });
      await db.close();
    },
  );

  it("applies a migration that leaves the triggers alone", async () => {
    const { path, migrations } = await setup(
      "ALTER TABLE events ADD COLUMN note TEXT;",
    );
    const db = await openDatabase(path, { migrations });
    expect(
      await db.prepare("SELECT max(version) AS v FROM schema_migrations").get(),
    ).toEqual({ v: 99 });
    await db.close();
  });
});
