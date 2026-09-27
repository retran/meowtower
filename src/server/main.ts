import { serve } from "@hono/node-server";
import { createApp } from "./app.js";
import { openDatabase, type Db } from "./database.js";
import { createParentApp } from "./parent.js";

const dbPath =
  process.env["MEOWTOWER_DB"] ?? "/var/lib/meowtower/meowtower.sqlite";
const port = Number(process.env["PORT"] ?? 3000);
const parentPort = Number(process.env["PARENT_PORT"] ?? 3001);

let db: Db;
try {
  db = openDatabase(dbPath);
} catch (err) {
  // A missing guard or a refused migration stops the start (SPC-0020).
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}
const game = serve({ fetch: createApp({ db }).fetch, port });
const parent = serve({
  fetch: createParentApp({ db }).fetch,
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
