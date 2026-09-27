import { Hono } from "hono";
import { isOpen, type Db } from "./database.js";

export function createApp({ db }: { db: Db }): Hono {
  const app = new Hono();
  app.get("/health", (c) =>
    isOpen(db)
      ? c.json({ status: "ok", database: "ok" })
      : c.json({ status: "unavailable", database: "closed" }, 503),
  );
  return app;
}
