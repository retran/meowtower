import { EventInvalid, events as registry } from "../../shared/events.js";
import { ADVENTURE_STATE, FINISHED } from "../projections/lifecycle.js";
import {
  applyProjections,
  ensureProjectionTables,
  recordFolded,
} from "../projections/registry.js";
import { ulid } from "./ulid.js";
import { prepared } from "../projections/statements.js";
import type { Db } from "../../server/db/index.js";

export { EventInvalid };

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
export async function appendEvents(
  db: Db,
  events: readonly NewEvent[],
): Promise<Appended[]> {
  const insert = prepared(
    db,
    `INSERT INTO events
       (id, ts, client_ms, device_id, session_id, adventure_id, type, v, payload, idem_key)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING seq`,
  );
  const stateOf = async (adventureId: string): Promise<string | undefined> => {
    const row = (await prepared(
      db,
      "SELECT state FROM adventures WHERE adventure_id = ?",
    ).get(adventureId)) as { state: string } | undefined;
    return row?.state;
  };
  const write = db.transaction(async (batch: readonly NewEvent[]) => {
    // Every event of the batch is checked before any is written (ADR-0020).
    for (const e of batch) registry.validate(e.type, e.v, e.payload);
    // A projection's table is created on the first append that needs it (SPC-0020).
    await ensureProjectionTables(db);
    const appended: { seq: number; id: string }[] = [];
    let lastTs = "";
    for (const e of batch) {
      // No event reopens a finished adventure (REQ-2404). Checked per event,
      // after the batch's earlier events have folded, so a batch that
      // completes an adventure and then pauses it is refused too.
      const next = ADVENTURE_STATE[e.type];
      if (next && e.adventureId && !finished(next)) {
        const now = await stateOf(e.adventureId);
        if (now && finished(now))
          throw new AdventureClosed(e.adventureId, now, e.type);
      }
      const now = Date.now();
      const id = ulid(now);
      const [deviceId, clientMs] =
        e.origin === "server"
          ? [SERVER_DEVICE, now]
          : [e.origin.deviceId, e.origin.clientMs];
      const inserted = (await insert.get(
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
      )) as { seq: number };
      const seq = Number(inserted.seq);
      const ts = new Date(now).toISOString();
      // Every projection folds the event in this same transaction (SPC-0020).
      await applyProjections(
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
      lastTs = ts;
      appended.push({ seq, id });
    }
    const last = appended[appended.length - 1];
    if (last) await recordFolded(db, last.seq, lastTs);
    return appended;
  });
  try {
    return await write(events);
  } catch (err) {
    if (err instanceof EventInvalid || err instanceof AdventureClosed)
      throw err;
    throw new LogWriteFailed(err);
  }
}
