import type Database from "better-sqlite3";

type Db = Database.Database;

export interface StoredEvent {
  seq: number;
  id: string;
  ts: string;
  clientMs: number;
  deviceId: string;
  sessionId: string | null;
  adventureId: string | null;
  type: string;
  v: number;
  payload: unknown;
  idemKey: string | null;
}

interface Row {
  seq: number;
  id: string;
  ts: string;
  client_ms: number;
  device_id: string;
  session_id: string | null;
  adventure_id: string | null;
  type: string;
  v: number;
  payload: string;
  idem_key: string | null;
}

const toEvent = (r: Row): StoredEvent => ({
  seq: r.seq,
  id: r.id,
  ts: r.ts,
  clientMs: r.client_ms,
  deviceId: r.device_id,
  sessionId: r.session_id,
  adventureId: r.adventure_id,
  type: r.type,
  v: r.v,
  payload: JSON.parse(r.payload) as unknown,
  idemKey: r.idem_key,
});

export function eventByIdemKey(
  db: Db,
  idemKey: string,
): StoredEvent | undefined {
  const row = db
    .prepare("SELECT * FROM events WHERE idem_key = ?")
    .get(idemKey) as Row | undefined;
  return row && toEvent(row);
}

/** Each distinct type and payload version in the log, for the start-up schema check. */
export function storedTypeVersions(db: Db): { type: string; v: number }[] {
  return db.prepare("SELECT DISTINCT type, v FROM events").all() as {
    type: string;
    v: number;
  }[];
}

/** Every event of a session, in log order. */
export function sessionEvents(db: Db, sessionId: string): StoredEvent[] {
  return (
    db
      .prepare("SELECT * FROM events WHERE session_id = ? ORDER BY seq")
      .all(sessionId) as Row[]
  ).map(toEvent);
}

/** Every event naming a task by its itemId, in log order. */
export function itemEvents(db: Db, itemId: string): StoredEvent[] {
  return (
    db
      .prepare(
        "SELECT * FROM events WHERE json_extract(payload, '$.itemId') = ? ORDER BY seq",
      )
      .all(itemId) as Row[]
  ).map(toEvent);
}

/** Every event of one type, in log order. */
export function eventsOfType(db: Db, type: string): StoredEvent[] {
  return (
    db
      .prepare("SELECT * FROM events WHERE type = ? ORDER BY seq")
      .all(type) as Row[]
  ).map(toEvent);
}

/**
 * Every event in log order, for a replay. Pages of 1,000 rows, because a
 * replay writes between reads and better-sqlite3 allows no other statement
 * while a query is being iterated.
 */
export function* allEvents(db: Db): Generator<StoredEvent> {
  const page = db.prepare(
    "SELECT * FROM events WHERE seq > ? ORDER BY seq LIMIT 1000",
  );
  let after = 0;
  for (;;) {
    const rows = page.all(after) as Row[];
    if (!rows.length) return;
    for (const row of rows) yield toEvent(row);
    after = rows[rows.length - 1]?.seq ?? after;
  }
}

/** Every event row as stored, in log order, for the export. */
export function eventRows(db: Db): Record<string, unknown>[] {
  return db.prepare("SELECT * FROM events ORDER BY seq").all() as Record<
    string,
    unknown
  >[];
}
