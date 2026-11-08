// Moves the log between two databases (ADR-3310, REQ-8522). SQL that names `events` lives in this
// folder, so the move reads and writes the log here and nowhere else.
import { createHash } from "node:crypto";
import type { Db } from "../../server/db/index.js";

const BATCH = 500;

const COLUMNS = [
  "seq",
  "id",
  "ts",
  "client_ms",
  "device_id",
  "session_id",
  "adventure_id",
  "type",
  "v",
  "payload",
  "idem_key",
] as const;

export async function eventCount(db: Db): Promise<number> {
  return Number(
    (
      (await db.prepare("SELECT count(*) AS n FROM events").get()) as {
        n: number;
      }
    ).n,
  );
}

/** Copies every event with its sequence number, id and time, and returns how many. */
export async function copyEvents(from: Db, to: Db): Promise<number> {
  const one = `(${COLUMNS.map(() => "?").join(", ")})`;
  let after = 0;
  let copied = 0;
  for (;;) {
    const rows = (await from
      .prepare(
        `SELECT ${COLUMNS.join(", ")} FROM events WHERE seq > ? ORDER BY seq LIMIT ${String(BATCH)}`,
      )
      .all(after)) as Record<string, unknown>[];
    if (rows.length === 0) break;
    await to
      .prepare(
        `INSERT INTO events (${COLUMNS.join(", ")}) OVERRIDING SYSTEM VALUE VALUES ${rows.map(() => one).join(", ")}`,
      )
      .run(...rows.flatMap((r) => COLUMNS.map((c) => r[c])));
    after = rows[rows.length - 1]?.["seq"] as number;
    copied += rows.length;
  }
  if (copied > 0)
    await to
      .prepare(
        "SELECT setval(pg_get_serial_sequence('events', 'seq'), (SELECT max(seq) FROM events))",
      )
      .get();
  return copied;
}

/** One hash over every event in log order, so two logs compare with one string. */
export async function logHash(db: Db): Promise<string> {
  const hash = createHash("sha256");
  let after = 0;
  for (;;) {
    const rows = (await db
      .prepare(
        `SELECT ${COLUMNS.join(", ")} FROM events WHERE seq > ? ORDER BY seq LIMIT 1000`,
      )
      .all(after)) as { seq: number }[];
    if (rows.length === 0) return hash.digest("hex");
    for (const row of rows) hash.update(JSON.stringify(row));
    after = (rows[rows.length - 1] as { seq: number }).seq;
  }
}
