import { readdirSync, readFileSync } from "node:fs";
import Database from "better-sqlite3";
import { storedTypeVersions } from "../engine/events/read.js";
import { events } from "../shared/events.js";

export type Db = Database.Database;

const MIGRATIONS = new URL("../../migrations/", import.meta.url);

/**
 * The triggers that keep the log append-only (REQ-2226). The start-up check
 * and the migration runner both read this one list.
 */
export const GUARDED_TRIGGERS = [
  { name: "events_no_update", table: "events", on: "UPDATE" },
  { name: "events_no_delete", table: "events", on: "DELETE" },
  { name: "blobs_no_update", table: "blobs", on: "UPDATE" },
  { name: "blobs_no_delete", table: "blobs", on: "DELETE" },
] as const;

const GUARD_MESSAGE = "RAISE(ABORT, 'events are append-only')";

/**
 * Opens the live database durably (REQ-2508): WAL with synchronous FULL, so a
 * transaction that has committed survives the process dying. Then applies
 * each numbered migration that hasn't run, in order, and refuses to go on
 * without the log's guard.
 */
export function openDatabase(
  path: string,
  {
    migrations = MIGRATIONS,
    beforeMigrate,
  }: {
    migrations?: URL;
    /** Called once before pending migrations run on a database that holds data (REQ-2528). */
    beforeMigrate?: (db: Db) => void;
  } = {},
): Db {
  const db = new Database(path);
  db.pragma("journal_mode = WAL");
  db.pragma("synchronous = FULL");
  db.pragma("busy_timeout = 5000");
  try {
    migrate(db, migrations, beforeMigrate);
    checkGuard(db);
    checkSchemas(db);
  } catch (err) {
    db.close();
    throw err;
  }
  return db;
}

function triggerSql(db: Db): Map<string, string> {
  const rows = db
    .prepare(
      "SELECT name, tbl_name AS tbl, sql FROM sqlite_master WHERE type = 'trigger'",
    )
    .all() as { name: string; tbl: string; sql: string }[];
  return new Map(rows.map((r) => [r.name, `${r.tbl}\n${r.sql}`]));
}

/** Every type and version in the log must have a schema (ADR-0020). */
function checkSchemas(db: Db): void {
  const unknown = storedTypeVersions(db).filter(
    (e) => !events.has(e.type, e.v),
  );
  if (unknown.length) {
    const list = unknown.map((e) => `${e.type} v${e.v}`).join(", ");
    throw new Error(`event_schema_unknown: ${list}`);
  }
}

function checkGuard(db: Db): void {
  const found = triggerSql(db);
  for (const g of GUARDED_TRIGGERS) {
    const sql = found.get(g.name) ?? "";
    const guards =
      sql.startsWith(`${g.table}\n`) &&
      new RegExp(`BEFORE\\s+${g.on}\\s+ON\\s+${g.table}\\b`, "i").test(sql) &&
      sql.includes(GUARD_MESSAGE);
    if (!guards) throw new Error(`log_guard_missing: ${g.name}`);
  }
}

/** Why a migration's SQL would weaken the guard, or undefined. */
function guardBreach(sql: string, existing: Set<string>): string | undefined {
  if (/writable_schema/i.test(sql)) return "writes sqlite_master directly";
  for (const g of GUARDED_TRIGGERS) {
    const name = `["\`]?(?:main\\.)?${g.name}\\b`;
    if (
      new RegExp(`DROP\\s+TRIGGER\\s+(?:IF\\s+EXISTS\\s+)?${name}`, "i").test(
        sql,
      )
    )
      return `drops trigger ${g.name}`;
    if (
      existing.has(g.name) &&
      new RegExp(
        `CREATE\\s+(?:TEMP\\s+|TEMPORARY\\s+)?TRIGGER\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?${name}`,
        "i",
      ).test(sql)
    )
      return `replaces trigger ${g.name}`;
    const table = `["\`]?(?:main\\.)?${g.table}["\`]?`;
    if (
      new RegExp(
        `DROP\\s+TABLE\\s+(?:IF\\s+EXISTS\\s+)?${table}(?![\\w])`,
        "i",
      ).test(sql)
    )
      return `drops table ${g.table}, and its triggers with it`;
    if (
      new RegExp(`ALTER\\s+TABLE\\s+${table}\\s+RENAME\\s+TO\\b`, "i").test(sql)
    )
      return `renames table ${g.table} away from its triggers`;
  }
  return undefined;
}

function migrate(db: Db, dir: URL, beforeMigrate?: (db: Db) => void): void {
  db.exec(
    "CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL) STRICT",
  );
  const applied = new Set(
    db
      .prepare("SELECT version FROM schema_migrations")
      .all()
      .map((row) => (row as { version: number }).version),
  );
  const files = readdirSync(dir)
    .filter((f) => /^\d{4}_.+\.sql$/.test(f))
    .sort();
  const pending = files.some((f) => !applied.has(Number(f.slice(0, 4))));
  if (pending && applied.size > 0) beforeMigrate?.(db);
  for (const file of files) {
    const version = Number(file.slice(0, 4));
    if (applied.has(version)) continue;
    const sql = readFileSync(new URL(file, dir), "utf8");
    const before = triggerSql(db);
    const breach = guardBreach(sql, new Set(before.keys()));
    if (breach) throw new Error(`migration_refused: ${file} ${breach}`);
    db.transaction(() => {
      db.exec(sql);
      // Catches what the text check can't see, and rolls the file back.
      const after = triggerSql(db);
      for (const g of GUARDED_TRIGGERS)
        if (before.has(g.name) && before.get(g.name) !== after.get(g.name))
          throw new Error(
            `migration_refused: ${file} changes trigger ${g.name}`,
          );
      db.prepare("INSERT INTO schema_migrations VALUES (?, ?)").run(
        version,
        new Date().toISOString(),
      );
    })();
  }
}

export function isOpen(db: Db): boolean {
  return db.open;
}
