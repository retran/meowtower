// adventures and sessions (SPC-0030): each adventure's state and each
// session's, folded from the lifecycle events.
import type Database from "better-sqlite3";
import type { StoredEvent } from "../events/read.js";
import type { Projection } from "./registry.js";
import { prepared } from "./statements.js";

type Db = Database.Database;

/** The state each lifecycle event moves an adventure to. */
export const ADVENTURE_STATE: Readonly<Record<string, string>> = {
  adventure_planned: "planned",
  adventure_started: "active",
  adventure_resumed: "active",
  adventure_paused: "paused",
  adventure_completed: "complete",
  adventure_wrapped_up: "wrapped_up",
};

/** The states no event may move an adventure out of (REQ-2404). */
export const FINISHED = ["complete", "wrapped_up"] as const;

const adventures: Projection = {
  name: "adventures",
  class: "game",
  module: import.meta.url,
  table: "adventures",
  create: `CREATE TABLE adventures (
    adventure_id TEXT PRIMARY KEY,
    state TEXT NOT NULL,
    planned_seq INTEGER NOT NULL,
    changed_seq INTEGER NOT NULL,
    changed_at TEXT NOT NULL,
    computed_at TEXT NOT NULL
  ) STRICT`,
  apply(db: Db, e: StoredEvent, computedAt: string, table = "adventures") {
    const state = ADVENTURE_STATE[e.type];
    if (!state || !e.adventureId) return;
    prepared(
      db,
      `INSERT INTO ${table} (adventure_id, state, planned_seq, changed_seq, changed_at, computed_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(adventure_id) DO UPDATE SET state = excluded.state,
         changed_seq = excluded.changed_seq, changed_at = excluded.changed_at,
         computed_at = excluded.computed_at`,
    ).run(e.adventureId, state, e.seq, e.seq, e.ts, computedAt);
  },
};

const sessions: Projection = {
  name: "sessions",
  class: "game",
  module: import.meta.url,
  table: "sessions",
  create: `CREATE TABLE sessions (
    session_id TEXT PRIMARY KEY,
    adventure_id TEXT,
    mode TEXT NOT NULL,
    device_id TEXT NOT NULL,
    state TEXT NOT NULL,
    started_seq INTEGER NOT NULL,
    ended_seq INTEGER,
    computed_at TEXT NOT NULL
  ) STRICT`,
  apply(db: Db, e: StoredEvent, computedAt: string, table = "sessions") {
    if (e.type === "session_started") {
      const p = e.payload as { sessionId: string; mode: string };
      prepared(
        db,
        `INSERT INTO ${table} (session_id, adventure_id, mode, device_id, state, started_seq, computed_at)
         VALUES (?, ?, ?, ?, 'active', ?, ?)`,
      ).run(p.sessionId, e.adventureId, p.mode, e.deviceId, e.seq, computedAt);
    } else if (e.type === "session_ended") {
      const p = e.payload as { sessionId: string };
      prepared(
        db,
        `UPDATE ${table} SET state = 'ended', ended_seq = ?, computed_at = ? WHERE session_id = ?`,
      ).run(e.seq, computedAt, p.sessionId);
    }
  },
};

export const lifecycle: Projection[] = [adventures, sessions];
