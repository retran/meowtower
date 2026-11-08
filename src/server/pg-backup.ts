// Snapshots, restore and export for a profile in Postgres (ADR-3310, REQ-8524, REQ-8528). A
// snapshot is a SQLite file holding the log, the service tables and the rebuilt projections, so a
// Mac program reads it as it reads one today (REQ-2524, REQ-2532) and the export reads it unchanged.
// A restore loads the newest snapshot into a fresh schema and swaps it for the live one.
import { mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { openSqlite } from "./database.js";
import { type Db, swapSchema } from "./db/index.js";
import { moveToPostgres, transfer } from "./move.js";
import { snapshotName, type Snapshot } from "./snapshots.js";

/** Writes the profile in `db` to a new SQLite file, compared with the profile before it returns. */
export async function snapshotProfileTo(db: Db, file: string): Promise<void> {
  const target = await openSqlite(file);
  try {
    await transfer(db, target);
    // The file must stand alone, with no write-ahead log beside it.
    await target.pragma("wal_checkpoint(TRUNCATE)");
  } finally {
    await target.close();
  }
}

export async function snapshotProfile(
  db: Db,
  dir: string,
  at: Date,
): Promise<Snapshot> {
  mkdirSync(dir, { recursive: true });
  const file = join(dir, snapshotName(at));
  const started = performance.now();
  await snapshotProfileTo(db, file);
  return { file, ms: Math.round(performance.now() - started) };
}

/**
 * Replaces the profile `schema` with the newest snapshot in `dir`, and returns its path. The
 * server must be stopped. The snapshot loads into a schema of its own first, and the old profile
 * goes only when that load has passed its comparisons.
 */
export async function restoreNewestProfile(
  url: string,
  schema: string,
  dir: string,
): Promise<string> {
  const newest = readdirSync(dir)
    .filter((f) => /^meowtower-.+\.sqlite$/.test(f))
    .sort()
    .at(-1);
  if (!newest) throw new Error(`restore_failed: no snapshot in ${dir}`);
  const fresh = `${schema}_restore`;
  await moveToPostgres(join(dir, newest), url, fresh);
  await swapSchema(url, schema, fresh);
  return join(dir, newest);
}
