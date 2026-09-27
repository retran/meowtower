import { serve } from "@hono/node-server";
import { createApp } from "./app.js";
import { openDatabase } from "./database.js";

const dbPath =
  process.env["MEOWTOWER_DB"] ?? "/var/lib/meowtower/meowtower.sqlite";
const port = Number(process.env["PORT"] ?? 3000);

const db = openDatabase(dbPath);
const server = serve({ fetch: createApp({ db }).fetch, port });

const stop = (): void => {
  server.close(() => {
    db.close();
    process.exit(0);
  });
};
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
