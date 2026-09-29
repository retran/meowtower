import { Hono } from "hono";
import { LogWriteFailed } from "../engine/events/append.js";
import { isOpen, type Db } from "./database.js";
import { mountPairing } from "./pairing.js";
import { mountParentRoom } from "./parent-room.js";
import { mountPlay } from "./play.js";
import { mountShell } from "./shell.js";
import { createStream, type Stream } from "./stream.js";
import { raise, writeSucceeded } from "./failures.js";

export function createApp({
  db,
  now = Date.now,
  stream = createStream(),
  explainer,
  onSessionEnded,
  sweepLeasesMs,
}: {
  db: Db;
  now?: () => number;
  stream?: Stream;
  explainer?: (itemId: string) => Promise<string>;
  onSessionEnded?: (sessionId: string) => void;
  /** Checks the lease this often, so a silent holder's pause reaches the log with no request; tests leave it off. */
  sweepLeasesMs?: number;
}): Hono {
  const app = new Hono();
  // A failed log write replies 503 on every route and reaches the parent
  // (ADR-0020); a later state-changing request that succeeds clears it.
  app.onError((err, c) => {
    if (!(err instanceof LogWriteFailed)) throw err;
    raise("log_write_failed", err.message, now);
    return c.json({ error: "log_write_failed" }, 503);
  });
  app.use("/api/*", async (c, next) => {
    await next();
    if (c.req.method !== "GET" && c.res.status < 500) writeSucceeded();
  });
  mountPairing(app, db, now);
  mountParentRoom(app, db, now);
  app.get("/health", (c) =>
    isOpen(db)
      ? c.json({ status: "ok", database: "ok" })
      : c.json({ status: "unavailable", database: "closed" }, 503),
  );
  mountShell(app);
  mountPlay(app, db, {
    now,
    stream,
    ...(explainer ? { explainer } : {}),
    ...(onSessionEnded ? { onSessionEnded } : {}),
    ...(sweepLeasesMs ? { sweepLeasesMs } : {}),
  });
  return app;
}
