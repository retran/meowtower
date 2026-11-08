import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import Database from "better-sqlite3";
import { type Db, openPostgres, SqliteDb } from "./db/index.js";
import { allEvents, storedTypeVersions } from "../engine/events/read.js";
import { rebuildMissing } from "../engine/projections/registry.js";
import { events } from "../shared/events.js";

export type { Db } from "./db/index.js";

const MIGRATIONS = new URL("../../migrations/", import.meta.url);
const PG_MIGRATIONS = new URL("../../migrations/postgres/", import.meta.url);

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

const GUARD_MESSAGE = {
  sqlite: "RAISE(ABORT, 'events are append-only')",
  postgres: "RAISE EXCEPTION 'events are append-only'",
} as const;

/**
 * Opens the live database durably (REQ-2508): WAL with synchronous FULL, so a
 * transaction that has committed survives the process dying. Then applies
 * each numbered migration that hasn't run, in order, and refuses to go on
 * without the log's guard.
 */
export async function openDatabase(
  path: string,
  {
    migrations = MIGRATIONS,
    beforeMigrate,
  }: {
    migrations?: URL;
    /** Called once before pending migrations run on a database that holds data (REQ-2528). */
    beforeMigrate?: (db: Db) => void;
  } = {},
): Promise<Db> {
  // The tests run the whole suite on Postgres by naming a database here; each file path becomes one
  // schema, so a test that reopens a path finds its data again.
  const url = process.env["MEOWTOWER_DATABASE_URL"];
  if (url) {
    // `Db.name` of a Postgres database is its schema, so reopening by that name finds the same data.
    const schema = /^p_[0-9a-f]{20}$/.test(path)
      ? path
      : `p_${createHash("sha1").update(path).digest("hex").slice(0, 20)}`;
    return openProfile(url, schema, beforeMigrate ? { beforeMigrate } : {});
  }
  const native = new Database(path);
  native.pragma("journal_mode = WAL");
  native.pragma("synchronous = FULL");
  native.pragma("busy_timeout = 5000");
  const db = new SqliteDb(native);
  try {
    await migrate(db, migrations, beforeMigrate);
    await checkGuard(db);
    await checkSchemas(db);
    // REQ-2232: a missing projection table is rebuilt before any request.
    await rebuildMissing(
      db,
      async () => await allEvents(db),
      new Date().toISOString(),
    );
  } catch (err) {
    await db.close();
    throw err;
  }
  return db;
}

async function triggerSql(db: Db): Promise<Map<string, string>> {
  if (db.dialect === "postgres") {
    // The definition of the trigger and the body of its function, with the schema left out of the
    // table name, so one check reads both dialects. A disabled trigger does not count.
    const found = (await db
      .prepare(
        `SELECT t.tgname AS name, c.relname AS tbl,
                pg_get_triggerdef(t.oid) || E'\\n' || pg_get_functiondef(t.tgfoid) AS sql
           FROM pg_trigger t
           JOIN pg_class c ON c.oid = t.tgrelid
           JOIN pg_namespace n ON n.oid = c.relnamespace
          WHERE NOT t.tgisinternal AND t.tgenabled = 'O' AND n.nspname = current_schema()`,
      )
      .all()) as { name: string; tbl: string; sql: string }[];
    return new Map(
      found.map((r) => [
        r.name,
        `${r.tbl}\n${r.sql.replace(/\bON\s+\w+\.(\w+)/i, "ON $1")}`,
      ]),
    );
  }
  const rows = (await db
    .prepare(
      "SELECT name, tbl_name AS tbl, sql FROM sqlite_master WHERE type = 'trigger'",
    )
    .all()) as { name: string; tbl: string; sql: string }[];
  return new Map(rows.map((r) => [r.name, `${r.tbl}\n${r.sql}`]));
}

/** Every type and version in the log must have a schema (ADR-0020). */
async function checkSchemas(db: Db): Promise<void> {
  const unknown = (await storedTypeVersions(db)).filter(
    (e) => !events.has(e.type, e.v),
  );
  if (unknown.length) {
    const list = unknown.map((e) => `${e.type} v${e.v}`).join(", ");
    throw new Error(`event_schema_unknown: ${list}`);
  }
}

async function checkGuard(db: Db): Promise<void> {
  const found = await triggerSql(db);
  for (const g of GUARDED_TRIGGERS) {
    const sql = found.get(g.name) ?? "";
    const guards =
      sql.startsWith(`${g.table}\n`) &&
      new RegExp(`BEFORE\\s+${g.on}\\s+ON\\s+${g.table}\\b`, "i").test(sql) &&
      sql.includes(GUARD_MESSAGE[db.dialect]);
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

async function migrate(
  db: Db,
  dir: URL,
  beforeMigrate?: (db: Db) => void,
): Promise<void> {
  await db.exec(
    `CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL)${db.dialect === "sqlite" ? " STRICT" : ""}`,
  );
  const applied = new Set(
    (await db.prepare("SELECT version FROM schema_migrations").all()).map(
      (row) => (row as { version: number }).version,
    ),
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
    const before = await triggerSql(db);
    const breach = guardBreach(sql, new Set(before.keys()));
    if (breach) throw new Error(`migration_refused: ${file} ${breach}`);
    await db.transaction(async () => {
      await db.exec(sql);
      // Catches what the text check can't see, and rolls the file back.
      const after = await triggerSql(db);
      for (const g of GUARDED_TRIGGERS)
        if (before.has(g.name) && before.get(g.name) !== after.get(g.name))
          throw new Error(
            `migration_refused: ${file} changes trigger ${g.name}`,
          );
      await db
        .prepare("INSERT INTO schema_migrations VALUES (?, ?)")
        .run(version, new Date().toISOString());
    })();
  }
}

/**
 * Opens the schema of one profile in Postgres (ADR-3310): creates it when it is missing, applies
 * the numbered migrations of `migrations/postgres/` that have not run, and refuses to go on without
 * the log's guard. The projections join in the next step of the plan.
 */
export async function openProfile(
  url: string,
  schema: string,
  {
    migrations = PG_MIGRATIONS,
    beforeMigrate,
  }: { migrations?: URL; beforeMigrate?: (db: Db) => void } = {},
): Promise<Db> {
  const db = await openPostgres(url, schema);
  try {
    await migrate(db, migrations, beforeMigrate);
    await checkGuard(db);
    await checkSchemas(db);
    // REQ-2232: a missing projection table is rebuilt before any request.
    await rebuildMissing(db, () => allEvents(db), new Date().toISOString());
  } catch (err) {
    await db.close();
    throw err;
  }
  return db;
}

export function isOpen(db: Db): boolean {
  return db.open;
}
