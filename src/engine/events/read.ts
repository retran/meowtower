import type { Db } from "../../server/db/index.js";

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

export async function eventByIdemKey(
  db: Db,
  idemKey: string,
): Promise<StoredEvent | undefined> {
  const row = (await db
    .prepare("SELECT * FROM events WHERE idem_key = ?")
    .get(idemKey)) as Row | undefined;
  return row && toEvent(row);
}

/**
 * The events one request logged: the first carries the request's key, the
 * rest the key and `#1`, `#2` and so on, because idem_key is unique per event.
 */
export async function requestEvents(
  db: Db,
  idemKey: string,
): Promise<StoredEvent[]> {
  return (
    (await db
      .prepare(
        "SELECT * FROM events WHERE idem_key = ? OR (idem_key >= ? AND idem_key < ?) ORDER BY seq",
      )
      .all(idemKey, `${idemKey}#`, `${idemKey}$`)) as Row[]
  ).map(toEvent);
}

/** Each distinct type and payload version in the log, for the start-up schema check. */
export async function storedTypeVersions(
  db: Db,
): Promise<{ type: string; v: number }[]> {
  return (await db.prepare("SELECT DISTINCT type, v FROM events").all()) as {
    type: string;
    v: number;
  }[];
}

/** Every event of a session, in log order. */
export async function sessionEvents(
  db: Db,
  sessionId: string,
): Promise<StoredEvent[]> {
  return (
    (await db
      .prepare("SELECT * FROM events WHERE session_id = ? ORDER BY seq")
      .all(sessionId)) as Row[]
  ).map(toEvent);
}

/** Every event of an adventure, across its sessions, in log order. */
export async function adventureEvents(
  db: Db,
  adventureId: string,
): Promise<StoredEvent[]> {
  return (
    (await db
      .prepare("SELECT * FROM events WHERE adventure_id = ? ORDER BY seq")
      .all(adventureId)) as Row[]
  ).map(toEvent);
}

/** Every event naming a task by its itemId, in log order. */
export async function itemEvents(
  db: Db,
  itemId: string,
): Promise<StoredEvent[]> {
  return (
    (await db
      .prepare(
        `SELECT * FROM events WHERE ${db.jsonField("payload", "itemId")} = ? ORDER BY seq`,
      )
      .all(itemId)) as Row[]
  ).map(toEvent);
}

/** Every event of one type, in log order. */
export async function eventsOfType(
  db: Db,
  type: string,
): Promise<StoredEvent[]> {
  return (
    (await db
      .prepare("SELECT * FROM events WHERE type = ? ORDER BY seq")
      .all(type)) as Row[]
  ).map(toEvent);
}

/** Every event in log order, for a replay, read in pages of 1,000 rows. */
export async function allEvents(db: Db): Promise<StoredEvent[]> {
  const page = db.prepare(
    "SELECT * FROM events WHERE seq > ? ORDER BY seq LIMIT 1000",
  );
  const out: StoredEvent[] = [];
  let after = 0;
  for (;;) {
    const rows = (await page.all(after)) as Row[];
    if (!rows.length) return out;
    for (const row of rows) out.push(toEvent(row));
    after = rows[rows.length - 1]?.seq ?? after;
  }
}

/** Up to `limit` events after `after`, in log order. */
export async function eventsAfter(
  db: Db,
  after: number,
  limit: number,
): Promise<StoredEvent[]> {
  return (
    (await db
      .prepare("SELECT * FROM events WHERE seq > ? ORDER BY seq LIMIT ?")
      .all(after, limit)) as Row[]
  ).map(toEvent);
}

/** The log's last seq, 0 when it's empty. */
export async function headSeq(db: Db): Promise<number> {
  return (
    (await db
      .prepare("SELECT coalesce(max(seq), 0) AS seq FROM events")
      .get()) as {
      seq: number;
    }
  ).seq;
}

/** The bytes the log's table takes in the file, for the `log_large` notice. */
export async function eventsBytes(db: Db): Promise<number> {
  const sql =
    db.dialect === "postgres"
      ? "SELECT pg_total_relation_size('events') AS bytes"
      : "SELECT coalesce(sum(pgsize), 0) AS bytes FROM dbstat WHERE name = 'events'";
  return ((await db.prepare(sql).get()) as { bytes: number }).bytes;
}

/** Every event row as stored, in log order, for the export. */
export async function eventRows(db: Db): Promise<Record<string, unknown>[]> {
  return (await db
    .prepare("SELECT * FROM events ORDER BY seq")
    .all()) as Record<string, unknown>[];
}

/** The newest event of a type, or undefined where the log holds none. */
export async function latestEvent(
  db: Db,
  type: string,
): Promise<StoredEvent | undefined> {
  const row = (await db
    .prepare("SELECT * FROM events WHERE type = ? ORDER BY seq DESC LIMIT 1")
    .get(type)) as Row | undefined;
  return row && toEvent(row);
}

/** The adventures that have events, each with how many, newest first: the list of the played games. */
export async function adventureEventCounts(
  db: Db,
): Promise<{ adventureId: string; events: number; lastSeq: number }[]> {
  const rows = (await db
    .prepare(
      `SELECT adventure_id AS id, COUNT(*) AS n, MAX(seq) AS last
         FROM events WHERE adventure_id IS NOT NULL
        GROUP BY adventure_id ORDER BY MAX(seq) DESC`,
    )
    .all()) as { id: string; n: number; last: number }[];
  return rows.map((r) => ({
    adventureId: r.id,
    events: Number(r.n),
    lastSeq: Number(r.last),
  }));
}

/** The events of one adventure in log order, at most `limit`, for its own log beside the general one. */
export async function eventsOfAdventure(
  db: Db,
  adventureId: string,
  limit = 500,
): Promise<StoredEvent[]> {
  return (
    (await db
      .prepare(
        "SELECT * FROM events WHERE adventure_id = ? ORDER BY seq LIMIT ?",
      )
      .all(adventureId, limit)) as Row[]
  ).map(toEvent);
}
