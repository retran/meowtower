// The projection registry (ADR-0020, SPC-0020). A projection is a pure fold:
// given an event and the time the caller passes in, it changes only its own
// table. It imports no clock, random source or network (the lint verb checks).
import type Database from "better-sqlite3";
import type { StoredEvent } from "../events/read.js";
import { flatViews } from "./flat-views.js";

type Db = Database.Database;

export interface Projection {
  name: string;
  table: string;
  /** The table's definition, used to create it and to rebuild it when missing. */
  create: string;
  apply: (db: Db, event: StoredEvent, computedAt: string) => void;
}

/**
 * The versions the projections were computed with. The model, threshold and
 * graph files arrive with the epics realising ADR-0060, ADR-0140 and ADR-0050;
 * until then each is recorded as "none".
 */
export const VERSIONS = {
  model: "none",
  thresholds: "none",
  graph: "none",
} as const;

const registered: Projection[] = [...flatViews];

export const PROJECTIONS: readonly Projection[] = registered;

/** Runs `body` with one more projection registered, for tests. */
export function withProjection<T>(p: Projection, body: () => T): T {
  registered.push(p);
  try {
    return body();
  } finally {
    registered.splice(registered.indexOf(p), 1);
  }
}

function tableExists(db: Db, table: string): boolean {
  return (
    db
      .prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?")
      .get(table) !== undefined
  );
}

/** Applies one stored event to every projection; runs inside appendEvents' transaction. */
export function applyProjections(
  db: Db,
  event: StoredEvent,
  computedAt: string,
): void {
  const meta = db.prepare(
    `INSERT INTO derived_meta (name, model_version, threshold_version, graph_version, last_seq, computed_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(name) DO UPDATE SET model_version = excluded.model_version,
       threshold_version = excluded.threshold_version, graph_version = excluded.graph_version,
       last_seq = excluded.last_seq, computed_at = excluded.computed_at`,
  );
  for (const p of registered) {
    if (!tableExists(db, p.table)) db.exec(p.create);
    p.apply(db, event, computedAt);
    meta.run(
      p.name,
      VERSIONS.model,
      VERSIONS.thresholds,
      VERSIONS.graph,
      event.seq,
      computedAt,
    );
  }
}

/**
 * REQ-2232: at start-up, a registered table that's missing is created and
 * rebuilt by replaying the log, before the server accepts a request.
 */
export function rebuildMissing(
  db: Db,
  allEvents: () => Iterable<StoredEvent>,
  computedAt: string,
): string[] {
  const missing = registered.filter((p) => !tableExists(db, p.table));
  if (!missing.length) return [];
  db.transaction(() => {
    for (const p of missing) db.exec(p.create);
    let last = 0;
    for (const e of allEvents()) {
      for (const p of missing) p.apply(db, e, computedAt);
      last = e.seq;
    }
    const meta = db.prepare(
      `INSERT OR REPLACE INTO derived_meta VALUES (?, ?, ?, ?, ?, ?)`,
    );
    for (const p of missing)
      meta.run(
        p.name,
        VERSIONS.model,
        VERSIONS.thresholds,
        VERSIONS.graph,
        last,
        computedAt,
      );
  })();
  return missing.map((p) => p.name);
}
