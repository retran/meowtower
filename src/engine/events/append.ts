import type Database from "better-sqlite3";
import { ulid } from "./ulid.js";

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

/**
 * The only writer of the log (ADR-0020). Inserts every event in one
 * transaction and returns once it has committed.
 */
export function appendEvents(db: Db, events: readonly NewEvent[]): Appended[] {
  const insert = db.prepare(
    `INSERT INTO events
       (id, ts, client_ms, device_id, session_id, adventure_id, type, v, payload, idem_key)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const write = db.transaction((batch: readonly NewEvent[]) =>
    batch.map((e) => {
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
      return { seq: Number(lastInsertRowid), id };
    }),
  );
  try {
    return write(events);
  } catch (err) {
    throw new LogWriteFailed(err);
  }
}
