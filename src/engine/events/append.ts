import type Database from "better-sqlite3";
import { EventInvalid, events as registry } from "../../shared/events.js";
import { ADVENTURE_STATE, FINISHED } from "../projections/lifecycle.js";
import { applyProjections } from "../projections/registry.js";
import { ulid } from "./ulid.js";
import { prepared } from "../projections/statements.js";

export { EventInvalid };

type Db = Database.Database;

/** The device identifier of an event the server writes on its own (REQ-2202). */
export const SERVER_DEVICE = "server";

export interface NewEvent {
  type: string;
  v: number;
  payload: unknown;
  /** A device with its own clock, or the server acting on its own. */
  origin: { deviceId: string; clientMs: number } | "server";
  sessionId?: string;
  adventureId?: string;
  idemKey?: string;
}

export interface Appended {
  seq: number;
  id: string;
}

/** The transaction that writes the log failed; the caller replies 503. */
export class LogWriteFailed extends Error {
  constructor(cause: unknown) {
    super(cause instanceof Error ? cause.message : String(cause), { cause });
    this.name = "LogWriteFailed";
  }
}

/** An event would move a complete or wrapped-up adventure; the caller replies 409. */
export class AdventureClosed extends Error {
  constructor(
    readonly adventureId: string,
    readonly state: string,
    readonly type: string,
  ) {
    super(`adventure_closed: ${type} on ${state} adventure ${adventureId}`);
    this.name = "AdventureClosed";
  }
}

const finished = (s: string): boolean =>
  (FINISHED as readonly string[]).includes(s);

/**
 * The only writer of the log (ADR-0020). Inserts every event in one
 * transaction and returns once it has committed.
 */
export function appendEvents(db: Db, events: readonly NewEvent[]): Appended[] {
  const insert = prepared(
    db,
    `INSERT INTO events
       (id, ts, client_ms, device_id, session_id, adventure_id, type, v, payload, idem_key)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  // The adventures projection is created on its first fold, so an empty log
  // has no table yet, and then no adventure to guard.
  const stateOf = (adventureId: string): string | undefined => {
    const table = prepared(
      db,
      "SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'adventures'",
    ).get();
    if (!table) return undefined;
    const row = prepared(
      db,
      "SELECT state FROM adventures WHERE adventure_id = ?",
    ).get(adventureId) as { state: string } | undefined;
    return row?.state;
  };
  const write = db.transaction((batch: readonly NewEvent[]) => {
    // Every event of the batch is checked before any is written (ADR-0020).
    for (const e of batch) registry.validate(e.type, e.v, e.payload);
    return batch.map((e) => {
      // No event reopens a finished adventure (REQ-2404). Checked per event,
      // after the batch's earlier events have folded, so a batch that
      // completes an adventure and then pauses it is refused too.
      const next = ADVENTURE_STATE[e.type];
      if (next && e.adventureId && !finished(next)) {
        const now = stateOf(e.adventureId);
        if (now && finished(now))
          throw new AdventureClosed(e.adventureId, now, e.type);
      }
      const now = Date.now();
      const id = ulid(now);
      const [deviceId, clientMs] =
        e.origin === "server"
          ? [SERVER_DEVICE, now]
          : [e.origin.deviceId, e.origin.clientMs];
      const { lastInsertRowid } = insert.run(
        id,
        new Date(now).toISOString(),
        clientMs,
        deviceId,
        e.sessionId ?? null,
        e.adventureId ?? null,
        e.type,
        e.v,
        JSON.stringify(e.payload),
        e.idemKey ?? null,
      );
      const seq = Number(lastInsertRowid);
      const ts = new Date(now).toISOString();
      // Every projection folds the event in this same transaction (SPC-0020).
      applyProjections(
        db,
        {
          seq,
          id,
          ts,
          clientMs,
          deviceId,
          sessionId: e.sessionId ?? null,
          adventureId: e.adventureId ?? null,
          type: e.type,
          v: e.v,
          payload: e.payload,
          idemKey: e.idemKey ?? null,
        },
        ts,
      );
      return { seq, id };
    });
  });
  try {
    return write(events);
  } catch (err) {
    if (err instanceof EventInvalid || err instanceof AdventureClosed)
      throw err;
    throw new LogWriteFailed(err);
  }
}
