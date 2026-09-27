// Reads of the adventures and sessions projections for the play routes.
import type { Db } from "./database.js";

export type OpenState = "planned" | "active" | "paused";

/** The newest adventure still open, if any (REQ-0226). */
export function openAdventure(
  db: Db,
): { adventureId: string; state: OpenState } | undefined {
  const row = db
    .prepare(
      `SELECT adventure_id, state FROM adventures
       WHERE state IN ('planned', 'active', 'paused')
       ORDER BY planned_seq DESC LIMIT 1`,
    )
    .get() as { adventure_id: string; state: OpenState } | undefined;
  return row && { adventureId: row.adventure_id, state: row.state };
}

export function adventureState(
  db: Db,
  adventureId: string,
): { state: string; changedAt: string } | undefined {
  const row = db
    .prepare("SELECT state, changed_at FROM adventures WHERE adventure_id = ?")
    .get(adventureId) as { state: string; changed_at: string } | undefined;
  return row && { state: row.state, changedAt: row.changed_at };
}

export function sessionRow(
  db: Db,
  sessionId: string,
): { adventureId: string | null; state: string } | undefined {
  const row = db
    .prepare("SELECT adventure_id, state FROM sessions WHERE session_id = ?")
    .get(sessionId) as
    { adventure_id: string | null; state: string } | undefined;
  return row && { adventureId: row.adventure_id, state: row.state };
}
