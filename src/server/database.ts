import { readdirSync, readFileSync } from "node:fs";
import Database from "better-sqlite3";

export type Db = Database.Database;

const MIGRATIONS = new URL("../../migrations/", import.meta.url);

/**
 * Opens the live database durably (REQ-2508): WAL with synchronous FULL, so a
 * transaction that has committed survives the process dying. Then applies
 * each numbered migration that hasn't run, in order.
 */
export function openDatabase(path: string): Db {
  const db = new Database(path);
  db.pragma("journal_mode = WAL");
  db.pragma("synchronous = FULL");
  db.pragma("busy_timeout = 5000");
  migrate(db);
  return db;
}

function migrate(db: Db): void {
  db.exec(
    "CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL) STRICT",
  );
  const applied = new Set(
    db
      .prepare("SELECT version FROM schema_migrations")
      .all()
      .map((row) => (row as { version: number }).version),
  );
  const files = readdirSync(MIGRATIONS)
    .filter((f) => /^\d{4}_.+\.sql$/.test(f))
    .sort();
  for (const file of files) {
    const version = Number(file.slice(0, 4));
    if (applied.has(version)) continue;
    const sql = readFileSync(new URL(file, MIGRATIONS), "utf8");
    db.transaction(() => {
      db.exec(sql);
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
