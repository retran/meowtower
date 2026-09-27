import { serve } from "@hono/node-server";
import { createApp } from "./app.js";
import { openDatabase } from "./database.js";
import { createParentApp } from "./parent.js";

const dbPath =
  process.env["MEOWTOWER_DB"] ?? "/var/lib/meowtower/meowtower.sqlite";
const port = Number(process.env["PORT"] ?? 3000);
const parentPort = Number(process.env["PARENT_PORT"] ?? 3001);

const db = openDatabase(dbPath);
const game = serve({ fetch: createApp({ db }).fetch, port });
const parent = serve({
  fetch: createParentApp().fetch,
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
