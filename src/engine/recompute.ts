// The full recompute (SPC-0020, TSK-0260): every registered projection is
// built into `<name>__next` from seq 1 while play goes on, caught up to the
// head of the log, and swapped in, with the last events, in one short
// transaction (REQ-2200). Only registered tables are touched, so the seven
// service tables stay as they were (REQ-2242).
//
// The build runs on the server's connection in chunks, each its own
// transaction, and yields to the event loop between chunks: better-sqlite3 is
// synchronous, so a second connection in the same thread would block play
// just the same, and an append waits at most for one chunk.
import type Database from "better-sqlite3";
import { eventsAfter, headSeq } from "./events/read.js";
import {
  PROJECTIONS,
  VERSIONS,
  versionLabel,
  type Projection,
} from "./projections/registry.js";

type Db = Database.Database;

export const shadowOf = (table: string): string => `${table}__next`;
const checkOf = (table: string): string => `${table}__check`;

/** The projection's CREATE TABLE, for another table name. */
function createAs(p: Projection, target: string): string {
  const created = p.create.replace(
    new RegExp(`CREATE TABLE ${p.table}\\b`),
    `CREATE TABLE ${target}`,
  );
  if (created === p.create)
    throw new Error(
      `recompute_failed: ${p.name} has no CREATE TABLE ${p.table}`,
    );
  return created;
}

/** Folds the events after `after` into `target` of each projection; returns the last seq. */
function foldInto(
  db: Db,
  projections: readonly Projection[],
  target: (p: Projection) => string,
  after: number,
  limit: number,
  computedAt: string,
): number {
  let last = after;
  for (const e of eventsAfter(db, after, limit)) {
    for (const p of projections) p.apply(db, e, computedAt, target(p));
    last = e.seq;
  }
  return last;
}

export interface RecomputeOptions {
  computedAt: string;
  /** Events a chunk folds before the build yields; also the most an append waits for. */
  chunk?: number;
  /** Awaited between chunks, so appends run while the build goes on. */
  pause?: () => Promise<void>;
  /** Called after each chunk with the last seq built; a throw here fails the recompute. */
  onChunk?: (seq: number) => void;
}

export interface RecomputeResult {
  tables: string[];
  lastSeq: number;
  ms: number;
}

export { versionLabel };

/** The rows of a versioned table that another set of versions computed. */
const OTHER_VERSIONS =
  "NOT (model_version = ? AND threshold_version = ? AND graph_version = ?)";
const CURRENT_VERSIONS =
  "model_version = ? AND threshold_version = ? AND graph_version = ?";
const versionArgs = (): string[] => [
  VERSIONS.model,
  VERSIONS.thresholds,
  VERSIONS.graph,
];

/**
 * Rebuilds every registered projection and swaps it in. On a failure the
 * shadow tables are dropped and the old projections stay as they were.
 */
export async function recompute(
  db: Db,
  {
    computedAt,
    chunk = 500,
    pause = () => new Promise((resolve) => setImmediate(resolve)),
    onChunk,
  }: RecomputeOptions,
): Promise<RecomputeResult> {
  const started = performance.now();
  const projections = [...PROJECTIONS];
  const shadow = (p: Projection): string => shadowOf(p.table);
  try {
    for (const p of projections) {
      db.exec(`DROP TABLE IF EXISTS ${shadow(p)}`);
      db.exec(createAs(p, shadow(p)));
      // A versioned table keeps the rows earlier versions computed.
      const live = db
        .prepare(
          "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?",
        )
        .get(p.table);
      if (p.versioned && live)
        db.prepare(
          `INSERT INTO ${shadow(p)} SELECT * FROM ${p.table} WHERE ${OTHER_VERSIONS}`,
        ).run(...versionArgs());
    }
    // The build runs up to the head as it stood at the start, since appends
    // go on meanwhile; the swap's transaction catches up the rest.
    const target = headSeq(db);
    let after = 0;
    while (after < target) {
      const last = db.transaction(() =>
        foldInto(
          db,
          projections,
          shadow,
          after,
          Math.min(chunk, target - after),
          computedAt,
        ),
      )();
      if (last === after) break;
      after = last;
      onChunk?.(after);
      await pause();
    }
    // Catch up and swap in one transaction: no append lands between them.
    db.transaction(() => {
      for (;;) {
        const last = foldInto(
          db,
          projections,
          shadow,
          after,
          chunk,
          computedAt,
        );
        if (last === after) break;
        after = last;
      }
      const meta = db.prepare(
        `INSERT INTO derived_meta (name, model_version, threshold_version, graph_version, last_seq, computed_at)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(name) DO UPDATE SET model_version = excluded.model_version,
           threshold_version = excluded.threshold_version, graph_version = excluded.graph_version,
           last_seq = excluded.last_seq, computed_at = excluded.computed_at`,
      );
      for (const p of projections) {
        db.exec(`DROP TABLE IF EXISTS ${p.table}`);
        db.exec(`ALTER TABLE ${shadow(p)} RENAME TO ${p.table}`);
        meta.run(
          p.name,
          VERSIONS.model,
          VERSIONS.thresholds,
          VERSIONS.graph,
          after,
          computedAt,
        );
      }
    })();
    return {
      tables: projections.map((p) => p.table),
      lastSeq: after,
      ms: Math.round(performance.now() - started),
    };
  } catch (err) {
    for (const p of projections) db.exec(`DROP TABLE IF EXISTS ${shadow(p)}`);
    throw err;
  }
}

export interface Divergence {
  check: "projection_diverged";
  table: string;
  /** The first row that differs, as stored, or null where the stored table lacks it. */
  stored: Record<string, unknown> | null;
  derived: Record<string, unknown> | null;
}

/** The columns a comparison reads: all but `computed_at`, which a rebuild renews. */
function comparedColumns(db: Db, table: string): string[] {
  return (
    db.prepare(`SELECT name FROM pragma_table_info(?)`).all(table) as {
      name: string;
    }[]
  )
    .map((c) => c.name)
    .filter((c) => c !== "computed_at");
}

/**
 * The verify check `projection_diverged`: derives each projection afresh from
 * the log and reports the first row where the stored table differs.
 */
export function checkProjections(db: Db): Divergence[] {
  const found: Divergence[] = [];
  for (const p of PROJECTIONS) {
    const fresh = checkOf(p.table);
    db.exec(`DROP TABLE IF EXISTS ${fresh}`);
    db.exec(createAs(p, fresh));
    try {
      db.transaction(() => {
        let after = 0;
        for (;;) {
          const last = foldInto(db, [p], () => fresh, after, 5000, "check");
          if (last === after) break;
          after = last;
        }
      })();
      const columns = comparedColumns(db, p.table);
      const list = columns.join(", ");
      // A versioned table is compared on the current versions' rows only.
      const where = p.versioned ? ` WHERE ${CURRENT_VERSIONS}` : "";
      const rows = (table: string) =>
        db
          .prepare(`SELECT ${list} FROM ${table}${where} ORDER BY ${list}`)
          .all(...(p.versioned ? versionArgs() : [])) as Record<
          string,
          unknown
        >[];
      const stored = rows(p.table);
      const derived = rows(fresh);
      const n = Math.max(stored.length, derived.length);
      for (let i = 0; i < n; i++) {
        if (JSON.stringify(stored[i]) !== JSON.stringify(derived[i])) {
          found.push({
            check: "projection_diverged",
            table: p.table,
            stored: stored[i] ?? null,
            derived: derived[i] ?? null,
          });
          break;
        }
      }
    } finally {
      db.exec(`DROP TABLE IF EXISTS ${fresh}`);
    }
  }
  return found;
}
