import { Hono } from "hono";
import { isOpen, type Db } from "./database.js";
import { mountPairing } from "./pairing.js";
import { mountParentRoom } from "./parent-room.js";
import { mountPlay } from "./play.js";
import { mountShell } from "./shell.js";
import { mountStage0 } from "./stage0.js";
import { createStream, type Stream } from "./stream.js";

export function createApp({
  db,
  now = Date.now,
  stream = createStream(),
  explainer,
  onSessionEnded,
}: {
  db: Db;
  now?: () => number;
  stream?: Stream;
  explainer?: (itemId: string) => Promise<string>;
  onSessionEnded?: (sessionId: string) => void;
}): Hono {
  const app = new Hono();
  mountPairing(app, db, now);
  mountParentRoom(app, db, now);
  app.get("/health", (c) =>
    isOpen(db)
      ? c.json({ status: "ok", database: "ok" })
      : c.json({ status: "unavailable", database: "closed" }, 503),
  );
  mountShell(app);
  mountStage0(app, db);
  mountPlay(app, db, {
    now,
    stream,
    ...(explainer ? { explainer } : {}),
    ...(onSessionEnded ? { onSessionEnded } : {}),
  });
  return app;
}
