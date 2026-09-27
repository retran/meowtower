import { serve } from "@hono/node-server";
import { createApp } from "./app.js";
import { openDatabase, type Db } from "./database.js";
import { createParentApp } from "./parent.js";
import { snapshotNow } from "./snapshots.js";
import { backupAfterSession } from "./backups.js";
import { checkLogSize } from "./recompute.js";
import { dirname } from "node:path";

const dbPath =
  process.env["MEOWTOWER_DB"] ?? "/var/lib/meowtower/meowtower.sqlite";
const port = Number(process.env["PORT"] ?? 3000);
const parentPort = Number(process.env["PARENT_PORT"] ?? 3001);
const snapshots = process.env["MEOWTOWER_SNAPSHOTS"] ?? "/data/snapshots";
const exports = process.env["MEOWTOWER_EXPORTS"] ?? "/data/exports";

let db: Db;
try {
  // A snapshot before any pending migration (REQ-2528).
  db = openDatabase(dbPath, {
    beforeMigrate: (d) => snapshotNow(d, snapshots, new Date()),
  });
} catch (err) {
  // A missing guard or a refused migration stops the start (SPC-0020).
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}
// A snapshot after each session (REQ-2526); data/ is the snapshots folder's parent.
const onSessionEnded = (): void => {
  checkLogSize(db, snapshots, Date.now);
  void backupAfterSession({
    live: dbPath,
    dir: snapshots,
    dataRoot: dirname(snapshots),
    now: Date.now,
  });
};
const game = serve({ fetch: createApp({ db, onSessionEnded }).fetch, port });
const parent = serve({
  fetch: createParentApp({ db, dbPath, snapshots, exports }).fetch,
  port: parentPort,
});

const stop = (): void => {
  parent.close();
  game.close(() => {
    db.close();
    process.exit(0);
  });
};
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
