// The projection registry (ADR-0020, SPC-0020). A projection is a pure fold:
// given an event and the time the caller passes in, it changes only its own
// table. It imports no clock, random source or network (the lint verb checks).
import type { StoredEvent } from "../events/read.js";
import { flatViews } from "./flat-views.js";
import { knowledge } from "./knowledge.js";
import { lifecycle } from "./lifecycle.js";
import { resume } from "./resume.js";
import { rewards } from "./rewards.js";
import { settings } from "./settings.js";
import { prepared } from "./statements.js";

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
  /**
   * Writes the rows that need the whole log, into `target`: the projection's own table or a
   * shadow copy of it. Run after the events are folded, in the same transaction as the swap
   * (TSK-0527).
   */
  fullPass?: (db: Db, target: string, computedAt: string) => Promise<void>;
  /** Folds one event into `table`, the projection's own or a shadow copy of it. */
  apply: (
    db: Db,
    event: StoredEvent,
    computedAt: string,
    table?: string,
  ) => Promise<void>;
}

export {
  VERSIONS,
  useVersions,
  versionLabel,
  type Versions,
} from "./versions.js";
import { VERSIONS } from "./versions.js";
import type { Db } from "../../server/db/index.js";

/**
 * REQ-2230: true when a projection was computed under another model or
 * threshold version than the content files name now.
 */
export async function versionsChanged(db: Db): Promise<boolean> {
  return (
    (await prepared(
      db,
      "SELECT 1 FROM derived_meta WHERE model_version <> ? OR threshold_version <> ? OR graph_version <> ? OR rules_version <> ? LIMIT 1",
    ).get(
      VERSIONS.model,
      VERSIONS.thresholds,
      VERSIONS.graph,
      VERSIONS.rules,
    )) !== undefined
  );
}

const registered: Projection[] = [
  ...flatViews,
  ...lifecycle,
  ...resume,
  ...rewards,
  ...settings,
  ...knowledge,
];

export const PROJECTIONS: readonly Projection[] = registered;

/** Runs `body` with one more projection registered, for tests. */
export async function withProjection<T>(
  p: Projection,
  body: () => Promise<T> | T,
): Promise<T> {
  registered.push(p);
  try {
    return await body();
  } finally {
    registered.splice(registered.indexOf(p), 1);
  }
}

async function tableExists(db: Db, table: string): Promise<boolean> {
  return await db.tableExists(table);
}

/**
 * Creates the tables of the registered projections that are missing: one catalogue read for all of
 * them, made once at the start of an append, not once for every event.
 */
export async function ensureProjectionTables(db: Db): Promise<void> {
  const existing = new Set(await db.tableNames());
  for (const p of registered)
    if (!existing.has(p.table)) await db.exec(p.create);
}

/** Applies one stored event to every projection; runs inside appendEvents' transaction. */
export async function applyProjections(
  db: Db,
  event: StoredEvent,
  computedAt: string,
): Promise<void> {
  for (const p of registered) await p.apply(db, event, computedAt);
}

/**
 * Records, for every registered projection, the versions it was folded under and the last event it
 * took in (REQ-3802): one statement for the whole batch of an append.
 */
export async function recordFolded(
  db: Db,
  lastSeq: number,
  computedAt: string,
): Promise<void> {
  const row = "(?, ?, ?, ?, ?, ?, ?)";
  const values = registered.flatMap((p) => [
    p.name,
    VERSIONS.model,
    VERSIONS.thresholds,
    VERSIONS.graph,
    VERSIONS.rules,
    lastSeq,
    computedAt,
  ]);
  await db
    .prepare(
      `INSERT INTO derived_meta (name, model_version, threshold_version, graph_version, rules_version, last_seq, computed_at)
       VALUES ${registered.map(() => row).join(", ")}
       ON CONFLICT(name) DO UPDATE SET model_version = excluded.model_version,
         threshold_version = excluded.threshold_version, graph_version = excluded.graph_version,
         rules_version = excluded.rules_version, last_seq = excluded.last_seq, computed_at = excluded.computed_at`,
    )
    .run(...values);
}

/**
 * REQ-2232: at start-up, a registered table that's missing is created and
 * rebuilt by replaying the log, before the server accepts a request.
 */
export async function rebuildMissing(
  db: Db,
  allEvents: () => Promise<Iterable<StoredEvent>>,
  computedAt: string,
): Promise<string[]> {
  const missing: Projection[] = [];
  for (const p of registered)
    if (!(await tableExists(db, p.table))) missing.push(p);
  if (!missing.length) return [];
  await db.transaction(async () => {
    for (const p of missing) await db.exec(p.create);
    let last = 0;
    for (const e of await allEvents()) {
      for (const p of missing) await p.apply(db, e, computedAt, p.table);
      last = e.seq;
    }
    const meta = prepared(
      db,
      `INSERT INTO derived_meta (name, model_version, threshold_version, graph_version, rules_version, last_seq, computed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (name) DO UPDATE SET model_version = excluded.model_version,
         threshold_version = excluded.threshold_version, graph_version = excluded.graph_version,
         rules_version = excluded.rules_version, last_seq = excluded.last_seq,
         computed_at = excluded.computed_at`,
    );
    for (const p of missing) await p.fullPass?.(db, p.table, computedAt);
    for (const p of missing)
      await meta.run(
        p.name,
        VERSIONS.model,
        VERSIONS.thresholds,
        VERSIONS.graph,
        VERSIONS.rules,
        last,
        computedAt,
      );
  })();
  return missing.map((p) => p.name);
}
