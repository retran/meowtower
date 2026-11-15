import { Hono } from "hono";
import { LogWriteFailed } from "../engine/events/append.js";
import { isOpen, type Db } from "./database.js";
import type { FrameQueue } from "./frames/queue.js";
import { type AccountsEnv, mountAccounts } from "./accounts/routes.js";
import { mountPairing } from "./pairing.js";
import { mountParentRoom } from "./parent-room.js";
import { createOutgoing } from "./outgoing.js";
import { mountPlay } from "./play.js";
import { createMasterGame } from "./master-game.js";
import { directedFor } from "./sandbox/director.js";
import type { MasterFactory, SandboxFrames } from "./sandbox/play.js";
import type { LabGateway } from "./studio/extras.js";
import type { AdventureWriter } from "./studio/generate.js";
import { mountShell } from "./shell.js";
import { createStream, type Stream } from "./stream.js";
import { raise, writeSucceeded } from "./failures.js";

export async function createApp({
  db,
  now = Date.now,
  stream = createStream(),
  explainer,
  onSessionEnded,
  sweepLeasesMs,
  tasks,
  frames,
  accounts,
  master,
  sandboxFrames,
  generator,
  lab,
}: {
  db: Db;
  now?: () => number;
  stream?: Stream;
  explainer?: (itemId: string) => Promise<string>;
  onSessionEnded?: (sessionId: string) => void;
  /** Checks the lease this often, so a silent holder's pause reaches the log with no request; tests leave it off. */
  sweepLeasesMs?: number;
  /** Where the tasks come from; the stand-in tasks unless the server says the registry. */
  tasks?: "standin" | "registry";
  /** The live story frames (ADR-3100); absent while no model is configured. */
  frames?: FrameQueue;
  /** The parents' accounts (ADR-3320); absent where the game runs on SQLite. */
  accounts?: AccountsEnv;
  /** Makes the Master for a turn in the sandbox (ADR-3270); absent while no Master is configured or switched on. */
  master?: MasterFactory;
  /** Makes the frame queue of the sandbox, over its own database (ADR-3270); absent while no model is configured. */
  sandboxFrames?: SandboxFrames;
  /** Writes a scenario for an adventure in the studio (ADR-3360); absent while no model is configured. */
  generator?: AdventureWriter;
  /** Makes the gateway of the prompt lab over the sandbox's database (REQ-8302); absent while no model is configured. */
  lab?: LabGateway;
}): Promise<Hono> {
  const app = new Hono();
  // Every body leaves through `send`, which reads this gate from the context (ADR-0160).
  const outgoing = createOutgoing(
    db,
    now,
    process.env["MEOWTOWER_ZONE"] ?? "UTC",
  );
  app.use("*", async (c, next) => {
    c.set("outgoing", outgoing);
    await next();
  });
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
  if (accounts) mountAccounts(app, accounts, now);
  await mountParentRoom(app, db, now, undefined, {
    ...(master ? { master } : {}),
    ...(sandboxFrames ? { sandboxFrames } : {}),
    ...(generator ? { generator } : {}),
    ...(lab ? { lab } : {}),
  });
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
    ...(tasks ? { tasks } : {}),
    ...(frames ? { frames } : {}),
    // The child's game plays approved adventures with the Master where one is configured (REQ-8266).
    ...(master && tasks === "registry"
      ? {
          masterGame: createMasterGame({ db, master, now }),
          directed: () => directedFor(db),
        }
      : {}),
  });
  return app;
}
