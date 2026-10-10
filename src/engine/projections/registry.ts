// The projection registry (ADR-0020, SPC-0020). A projection is a pure fold:
// given an event and the time the caller passes in, it changes only its own
// table. It imports no clock, random source or network (the lint verb checks).
import type Database from "better-sqlite3";
import type { StoredEvent } from "../events/read.js";
import { flatViews } from "./flat-views.js";
import { knowledge } from "./knowledge.js";
import { lifecycle } from "./lifecycle.js";
import { resume } from "./resume.js";
import { settings } from "./settings.js";
import { prepared } from "./statements.js";

type Db = Database.Database;

export interface Projection {
  name: string;
  /**
   * `game` projections may not reach the knowledge model, the Director or the
   * answer check; the lint verb reads this field (REQ-2224, ADR-0020).
   */
  class: "game" | "knowledge";
  /** The URL of the file that defines this entry: `import.meta.url`. */
  module: string;
  table: string;
  /** The table's definition, used to create it and to rebuild it when missing. */
  create: string;
  /**
   * The table keeps rows of earlier versions: it has `model_version`,
   * `threshold_version` and `graph_version` columns, and a recompute rebuilds
   * only the current versions' rows (SPC-0020).
   */
  versioned?: boolean;
  /** Folds one event into `table`, the projection's own or a shadow copy of it. */
  apply: (
    db: Db,
    event: StoredEvent,
    computedAt: string,
    table?: string,
  ) => void;
}

export {
  VERSIONS,
  useVersions,
  versionLabel,
  type Versions,
} from "./versions.js";
import { VERSIONS } from "./versions.js";

/**
 * REQ-2230: true when a projection was computed under another model or
 * threshold version than the content files name now.
 */
export function versionsChanged(db: Db): boolean {
  return (
    prepared(
      db,
      "SELECT 1 FROM derived_meta WHERE model_version <> ? OR threshold_version <> ? LIMIT 1",
    ).get(VERSIONS.model, VERSIONS.thresholds) !== undefined
  );
}

const registered: Projection[] = [
  ...flatViews,
  ...lifecycle,
  ...resume,
  ...settings,
  ...knowledge,
];

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
    prepared(
      db,
      "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?",
    ).get(table) !== undefined
  );
}

/** Applies one stored event to every projection; runs inside appendEvents' transaction. */
export function applyProjections(
  db: Db,
  event: StoredEvent,
  computedAt: string,
): void {
  const meta = prepared(
    db,
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
    const meta = prepared(
      db,
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
