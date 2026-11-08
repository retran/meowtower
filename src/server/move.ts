// The move of the existing player's log from SQLite into the schema of a profile in Postgres
// (ADR-3310, REQ-8522, REQ-8526). The SQLite file is opened read-only and never written. Every
// event keeps its sequence number, id and time; the projections are rebuilt from the copied log,
// and the move reports a difference instead of finishing when the counts, the log or a derived
// table do not match.
import Database from "better-sqlite3";
import { copyEvents, eventCount, logHash } from "../engine/events/transfer.js";
import { checkProjections, recompute } from "../engine/recompute.js";
import { PROJECTIONS, useVersions } from "../engine/projections/registry.js";
import { type Db, SqliteDb } from "./db/index.js";
import { openProfile } from "./database.js";
import { startKnowledge } from "./knowledge-start.js";
import { readContentVersions } from "./versions.js";

const BATCH = 500;

/** Tables outside the log that the move carries over, because the game reads them (SPC-0470). */
const SERVICE_TABLES = [
  "devices",
  "parent_pin",
  "lockouts",
  "blobs",
  "graph_versions",
  "llm_log",
  "frames",
  "text_blocked",
  "text_counters",
] as const;

export interface MoveReport {
  readonly events: number;
  readonly tables: Readonly<Record<string, number>>;
  readonly derivedTables: number;
}

export class MoveRefused extends Error {
  constructor(reason: string) {
    super(`move_refused: ${reason}`);
    this.name = "MoveRefused";
  }
}

/** Copies every row of `table` that both sides have columns for, in batches. */
async function copyTable(from: Db, to: Db, table: string): Promise<number> {
  if (!(await from.tableExists(table)) || !(await to.tableExists(table)))
    return 0;
  const target = new Set(await to.columnsOf(table));
  const columns = (await from.columnsOf(table)).filter((c) => target.has(c));
  const rows = (await from
    .prepare(`SELECT ${columns.join(", ")} FROM ${table}`)
    .all()) as Record<string, unknown>[];
  const one = `(${columns.map(() => "?").join(", ")})`;
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH);
    await to
      .prepare(
        `INSERT INTO ${table} (${columns.join(", ")})${to.dialect === "postgres" ? " OVERRIDING SYSTEM VALUE" : ""} VALUES ${batch.map(() => one).join(", ")}`,
      )
      .run(...batch.flatMap((r) => columns.map((c) => r[c])));
  }
  if (columns.includes("id") && rows.length > 0 && to.dialect === "postgres")
    await to
      .prepare(
        `SELECT setval(pg_get_serial_sequence('${table}', 'id'), (SELECT max(id) FROM ${table}))`,
      )
      .get()
      .catch(() => undefined);
  return rows.length;
}

/** The rows of a derived table without `computed_at`, as one string to compare. */
async function derivedRows(db: Db, table: string): Promise<string> {
  if (!(await db.tableExists(table))) return "absent";
  const columns = (await db.columnsOf(table)).filter(
    (c) => c !== "computed_at",
  );
  const rows = (await db
    .prepare(
      `SELECT ${columns.join(", ")} FROM ${table} ORDER BY ${columns.join(", ")}`,
    )
    .all()) as Record<string, unknown>[];
  return JSON.stringify(rows);
}

/**
 * Copies the log and the service tables from `source` into `target`, an empty database of either
 * dialect, rebuilds the target's projections from the copied log, and compares the two: the event
 * count, one hash over the log, the projections against a fresh rebuild, and each derived table.
 */
export async function transfer(
  source: Db,
  target: Db,
  beforeRebuild?: () => Promise<void>,
): Promise<MoveReport> {
  if ((await eventCount(target)) > 0)
    throw new MoveRefused("the target already holds events");
  const events = await eventCount(source);
  await copyEvents(source, target);

  const tables: Record<string, number> = {};
  for (const t of SERVICE_TABLES)
    tables[t] = await copyTable(source, target, t);

  await beforeRebuild?.();
  await recompute(target, { computedAt: new Date().toISOString() });

  if ((await eventCount(target)) !== events)
    throw new MoveRefused("the event count differs");
  if ((await logHash(source)) !== (await logHash(target)))
    throw new MoveRefused("the log differs");
  const diverged = await checkProjections(target);
  if (diverged.length > 0)
    throw new MoveRefused(
      `a derived table differs from the log: ${diverged.map((d) => d.table).join(", ")}`,
    );
  let derivedTables = 0;
  for (const p of PROJECTIONS) {
    // The knowledge tables are computed by the model in use from the whole log, so the file's copy
    // can be a pass behind; the target's are rebuilt, and checkProjections has compared them above.
    if (p.class === "knowledge") continue;
    if (
      (await derivedRows(source, p.table)) !==
      (await derivedRows(target, p.table))
    )
      throw new MoveRefused(`the table ${p.table} differs from the source`);
    derivedTables++;
  }
  return { events, tables, derivedTables };
}

/**
 * Moves the log of the SQLite file at `sqlitePath` into `schema` of the database at `url`. The
 * file is opened read-only. The target must hold no event yet.
 */
export async function moveToPostgres(
  sqlitePath: string,
  url: string,
  schema: string,
): Promise<MoveReport> {
  const source: Db = new SqliteDb(
    new Database(sqlitePath, { readonly: true, fileMustExist: true }),
  );
  useVersions(readContentVersions());
  const target = await openProfile(url, schema);
  try {
    // The model starts after the copy, so the graph versions it stores meet the copied ones.
    return await transfer(source, target, async () => {
      await startKnowledge(target);
    });
  } catch (err) {
    if (err instanceof MoveRefused && /already holds events/.test(err.message))
      throw new MoveRefused(`${schema} already holds events`);
    throw err;
  } finally {
    await target.close();
    await source.close();
  }
}
