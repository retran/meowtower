import { Hono } from "hono";
import { isOpen, type Db } from "./database.js";
import { mountPairing } from "./pairing.js";
import { mountPlay } from "./play.js";
import { mountShell } from "./shell.js";
import { mountStage0 } from "./stage0.js";

export function createApp({
  db,
  now = Date.now,
}: {
  db: Db;
  now?: () => number;
}): Hono {
  const app = new Hono();
  mountPairing(app, db, now);
  app.get("/health", (c) =>
    isOpen(db)
      ? c.json({ status: "ok", database: "ok" })
      : c.json({ status: "unavailable", database: "closed" }, 503),
  );
  mountShell(app);
  mountStage0(app, db);
  mountPlay(app, db);
  return app;
}
