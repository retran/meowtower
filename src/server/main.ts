import { serve } from "@hono/node-server";
import { parentSettings } from "./parent-room.js";
import { createFrameQueue, type FrameQueue } from "./frames/queue.js";
import { ConfigInvalid, readConfig } from "./gateway/config.js";
import { createGateway, verifyModels } from "./gateway/gateway.js";
import { createLedger } from "./gateway/household.js";
import { liveRoutes } from "./gateway/routes.js";
import { createApp } from "./app.js";
import type { MasterFactory } from "./sandbox/play.js";
import { createSandboxGateway } from "./sandbox/sandbox.js";
import { gatewayMaster } from "../story/master-gateway.js";
import { openDatabase, type Db } from "./database.js";
import { createParentApp } from "./parent.js";
import { logMailer } from "./accounts/mailer.js";
import { createRoot } from "./accounts/router.js";
import { openAccounts } from "./accounts/store.js";
import { snapshotNow } from "./snapshots.js";
import { snapshotProfile } from "./pg-backup.js";
import { backupAfterSession } from "./backups.js";
import {
  checkLogSize,
  checkSnapshotCeiling,
  runRecompute,
} from "./recompute.js";
import { readContentVersions } from "./versions.js";
import { startKnowledge } from "./knowledge-start.js";
import { refreshKnowledge } from "../engine/projections/knowledge.js";
import { type ActivationContext } from "./model-activate.js";
import { raise, useNoticesDir } from "./failures.js";
import { recoverBlobs } from "../engine/blobs/store.js";
import {
  useVersions,
  versionLabel,
  versionsChanged,
} from "../engine/projections/registry.js";
import { dirname, join } from "node:path";

const dbPath =
  process.env["MEOWTOWER_DB"] ?? "/var/lib/meowtower/meowtower.sqlite";
const port = Number(process.env["PORT"] ?? 3000);
const parentPort = Number(process.env["PARENT_PORT"] ?? 3001);
const snapshots = process.env["MEOWTOWER_SNAPSHOTS"] ?? "/data/snapshots";
const exports = process.env["MEOWTOWER_EXPORTS"] ?? "/data/exports";

useNoticesDir(snapshots);
let db: Db;
try {
  // The versions come first: a table rebuilt at open records them.
  useVersions(readContentVersions());
  // A snapshot before any pending migration (REQ-2528).
  db = await openDatabase(dbPath, {
    beforeMigrate: async (d) => await snapshotNow(d, snapshots, new Date()),
  });
} catch (err) {
  // A missing guard or a refused migration stops the start (SPC-0020).
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}
let activation: ActivationContext | undefined;
try {
  activation = await startKnowledge(db);
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}
// A new model or threshold version recomputes every projection before the
// first request (REQ-2230); a failure leaves the old projections and play
// goes on, with recompute_failed for the parent.
if (await versionsChanged(db)) {
  console.log(`startup_recompute: now ${versionLabel()}`);
  try {
    const done = await runRecompute(db, { dir: snapshots, now: Date.now });
    console.log(
      `startup_recompute: ${done.tables.length} tables in ${done.ms} ms`,
    );
  } catch {
    // runRecompute has raised recompute_failed.
  }
}

// A file in data/blobs/ with no row gets its row, or `blob_changed` in the log;
// the start goes on either way (REQ-2210).
await recoverBlobs(db, join(dirname(snapshots), "blobs"), (file) =>
  raise("blob_changed", file),
);

// A snapshot after each session (REQ-2526); data/ is the snapshots folder's parent.
const onSessionEnded = async (): Promise<void> => {
  // The end of an adventure recomputes the knowledge rows from the whole log; a failure
  // keeps the earlier rows and the next end retries it (TSK-0527).
  try {
    await refreshKnowledge(db, new Date().toISOString());
  } catch (err) {
    raise("recompute_failed", err instanceof Error ? err.message : String(err));
  }
  await checkLogSize(db, snapshots, Date.now);
  await checkSnapshotCeiling(db, snapshots, Date.now);
  void backupAfterSession({
    live: dbPath,
    dir: snapshots,
    dataRoot: dirname(snapshots),
    now: Date.now,
    ...(db.dialect === "postgres"
      ? { take: (dir: string, at: Date) => snapshotProfile(db, dir, at) }
      : {}),
  });
};
// The parents' accounts live beside the profiles in Postgres (ADR-3320); until a mail provider is
// chosen, the sign-in code goes to the server's output.
const databaseUrl = process.env["MEOWTOWER_DATABASE_URL"];
const accounts = databaseUrl
  ? {
      db: await openAccounts(databaseUrl),
      url: databaseUrl,
      mailer: logMailer(),
    }
  : undefined;
// One key serves every profile, so the gateway counts the month's spend of all of them (REQ-8510).
const ledger = accounts ? createLedger(accounts.db) : undefined;
// Live frames run once the roles are set (ADR-3100). A bad value or a missing model stops the start;
// an unreachable service leaves frames off, and the check retries every 10 minutes.
let frames: FrameQueue | undefined;
/** Makes the Master of a sandbox turn; set once the role is configured and the switch is on (ADR-3270). */
let master: MasterFactory | undefined;
try {
  const config = readConfig(process.env);
  // The game runs only in `play`: the tools start the other modes (ADR-3200).
  if (config && config.mode !== "play")
    throw new ConfigInvalid("GATEWAY_MODE", "the server runs only in play");
  if (config) {
    const routes = liveRoutes(config);
    const zone = process.env["MEOWTOWER_ZONE"] ?? "UTC";
    const turnOn = async (): Promise<boolean> => {
      const check = await verifyModels(config, routes);
      if (check.state === "missing")
        throw new ConfigInvalid(check.role, "the model is not on its route");
      return check.state === "ok";
    };
    // The Master plays in the sandbox only for now, and only with MEOWTOWER_MASTER=on and its role set.
    if (process.env["MEOWTOWER_MASTER"] === "on" && config.roles.MASTER_MODEL)
      master = (sandbox, bucket) =>
        gatewayMaster(
          createSandboxGateway({
            db: sandbox,
            config,
            routes,
            names: (process.env["MEOWTOWER_EGRESS_NAMES"] ?? "")
              .split(",")
              .filter((n) => n !== ""),
          }),
          bucket,
        );
    const queue = createFrameQueue({
      db,
      gateway: createGateway({
        ...(ledger ? { household: ledger.forProfile(db.name) } : {}),
        db,
        config,
        routes,
        names: (process.env["MEOWTOWER_EGRESS_NAMES"] ?? "")
          .split(",")
          .filter((n) => n !== ""),
      }),
      zone,
      level: async () => (await parentSettings(db)).creepiness,
      gender: async () => (await parentSettings(db)).gender,
    });
    if (await turnOn()) frames = queue;
    else {
      console.error("models_unverified: live frames are off");
      const retry = setInterval(() => {
        void turnOn()
          .then((ok) => {
            if (!ok) return;
            live.current = queue;
            clearInterval(retry);
          })
          .catch((err: unknown) => {
            console.error(err instanceof Error ? err.message : String(err));
          });
      }, 600_000);
      retry.unref();
    }
  }
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}
const live: { current: FrameQueue | undefined } = { current: frames };
const tasks =
  process.env["MEOWTOWER_TASKS"] === "standin" ? "standin" : "registry";
const firstApp = await createApp({
  db,
  ...(master ? { master } : {}),
  onSessionEnded,
  sweepLeasesMs: 5000,
  tasks,
  frames: {
    prepare: async (task) => {
      await live.current?.prepare(task);
    },
    ready: async (task, ms) => {
      await live.current?.ready(task, ms);
    },
    take: async (task) => (await live.current?.take(task)) ?? null,
  },
});
// With accounts, a root app sends each request to the app of the profile its device belongs to
// (ADR-3320). The profiles after the first have no live frames yet.
const gameApp = accounts
  ? createRoot({
      first: firstApp,
      firstSchema: db.name,
      accounts,
      appFor: (d) => createApp({ db: d, sweepLeasesMs: 5000, tasks }),
      now: Date.now,
    })
  : firstApp;
const game = serve({ fetch: gameApp.fetch, port });
const parent = serve({
  fetch: createParentApp({
    db,
    dbPath,
    snapshots,
    exports,
    ...(activation ? { model: activation } : {}),
  }).fetch,
  port: parentPort,
});

const stop = (): void => {
  parent.close();
  game.close(async () => {
    await db.close();
    await accounts?.db.close();
    process.exit(0);
  });
};
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
