// Holds appends off the log for the rest of the transaction (ADR-3310). SQLite lets no other
// statement into an open transaction, so it needs nothing; Postgres needs this lock, so that no
// event lands between a recompute's catch-up and its swap.
import type { Db } from "../../server/db/index.js";

export async function holdAppends(db: Db): Promise<void> {
  if (db.dialect === "postgres")
    await db.exec("LOCK TABLE events IN SHARE ROW EXCLUSIVE MODE");
}
