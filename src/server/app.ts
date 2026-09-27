import { Hono } from "hono";
import { isOpen, type Db } from "./database.js";
import { mountPlay } from "./play.js";
import { mountShell } from "./shell.js";
import { mountStage0 } from "./stage0.js";

export function createApp({ db }: { db: Db }): Hono {
  const app = new Hono();
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
