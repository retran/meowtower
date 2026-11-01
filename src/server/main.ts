import { templates } from "../templates/index.js";
import { serve } from "@hono/node-server";
import { parentSettings } from "./parent-room.js";
import { createFrameQueue, type FrameQueue } from "./frames/queue.js";
import { ConfigInvalid, readConfig } from "./gateway/config.js";
import { createGateway, verifyModels } from "./gateway/gateway.js";
import { liveRoutes } from "./gateway/routes.js";
import { createApp } from "./app.js";
import { openDatabase, type Db } from "./database.js";
import { createParentApp } from "./parent.js";
import { snapshotNow } from "./snapshots.js";
import { backupAfterSession } from "./backups.js";
import {
  checkLogSize,
  checkSnapshotCeiling,
  runRecompute,
} from "./recompute.js";
import { readContentVersions } from "./versions.js";
import { startGraph } from "./graph-start.js";
import {
  activeKnowledgeParams,
  refreshKnowledge,
  useKnowledge,
} from "../engine/projections/knowledge.js";
import { loadParams } from "../engine/model/params.js";
import { latestEvent } from "../engine/events/read.js";
import { type ActivationContext } from "./model-activate.js";
import { GRAPH_FILE } from "../engine/graph.js";
import { raise, useNoticesDir } from "./failures.js";
import { recoverBlobs } from "../engine/blobs/store.js";
import {
  useVersions,
  VERSIONS,
  versionLabel,
  versionsChanged,
} from "../engine/projections/registry.js";
import { existsSync, readFileSync } from "node:fs";
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
  db = openDatabase(dbPath, {
    beforeMigrate: (d) => snapshotNow(d, snapshots, new Date()),
  });
} catch (err) {
  // A missing guard or a refused migration stops the start (SPC-0020).
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}
// The latest model_activated event names the model in use; the content file names it only
// while the log holds none (ADR-0510).
const activated = latestEvent(db, "model_activated");
if (activated)
  useVersions({
    ...VERSIONS,
    model: (activated.payload as { modelVersion: string }).modelVersion,
  });
// The skill graph starts the server (ADR-0050): a broken file with no stored
// version stops the start as graph_unloadable, and otherwise the last valid
// version is served (TSK-0500).
let activation: ActivationContext | undefined;
try {
  const started = startGraph(db, process.env["MEOWTOWER_GRAPH"] ?? GRAPH_FILE);
  // The knowledge model runs once a model version is named (SPC-0060); until then its
  // tables stay empty. The game-day zone is the family's, set in the environment.
  const model = VERSIONS.model;
  const zone = process.env["MEOWTOWER_ZONE"] ?? "UTC";
  activation = { graph: started.graph, zone, active: activeKnowledgeParams };
  const modelFile = new URL(
    `../../content/model.${model}.json`,
    import.meta.url,
  );
  if (model !== "none" && !existsSync(modelFile))
    console.error(`model_unloadable: no file for model version ${model}`);
  else if (model !== "none")
    useKnowledge({
      params: loadParams(readFileSync(modelFile, "utf8")),
      graph: started.graph,
      zone,
      olympiad: {
        templates: new Set(
          templates
            .filter((t) => t.origin && "olympiad" in t.origin)
            .map((t) => t.id),
        ),
        nodes: new Set(
          templates
            .filter((t) => t.origin && "olympiad" in t.origin)
            .map((t) => t.node),
        ),
      },
    });
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}
// A new model or threshold version recomputes every projection before the
// first request (REQ-2230); a failure leaves the old projections and play
// goes on, with recompute_failed for the parent.
if (versionsChanged(db)) {
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
recoverBlobs(db, join(dirname(snapshots), "blobs"), (file) =>
  raise("blob_changed", file),
);

// A snapshot after each session (REQ-2526); data/ is the snapshots folder's parent.
const onSessionEnded = (): void => {
  // The end of an adventure recomputes the knowledge rows from the whole log; a failure
  // keeps the earlier rows and the next end retries it (TSK-0527).
  try {
    refreshKnowledge(db, new Date().toISOString());
  } catch (err) {
    raise("recompute_failed", err instanceof Error ? err.message : String(err));
  }
  checkLogSize(db, snapshots, Date.now);
  checkSnapshotCeiling(db, snapshots, Date.now);
  void backupAfterSession({
    live: dbPath,
    dir: snapshots,
    dataRoot: dirname(snapshots),
    now: Date.now,
  });
};
// Live frames run once the roles are set (ADR-3100). A bad value or a missing model stops the start;
// an unreachable service leaves frames off, and the check retries every 10 minutes.
let frames: FrameQueue | undefined;
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
    const queue = createFrameQueue({
      db,
      gateway: createGateway({
        db,
        config,
        routes,
        names: (process.env["MEOWTOWER_EGRESS_NAMES"] ?? "")
          .split(",")
          .filter((n) => n !== ""),
      }),
      zone,
      level: () => parentSettings(db).creepiness,
      gender: () => parentSettings(db).gender,
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
const game = serve({
  fetch: createApp({
    db,
    onSessionEnded,
    sweepLeasesMs: 5000,
    tasks:
      process.env["MEOWTOWER_TASKS"] === "standin" ? "standin" : "registry",
    frames: {
      prepare: (task) => live.current?.prepare(task) ?? Promise.resolve(),
      ready: (task, ms) => live.current?.ready(task, ms) ?? Promise.resolve(),
      take: (task) => live.current?.take(task) ?? null,
    },
  }).fetch,
  port,
});
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
  game.close(() => {
    db.close();
    process.exit(0);
  });
};
process.on("SIGTERM", stop);
process.on("SIGINT", stop);
