// Snapshots (SPC-0010): VACUUM INTO a new file under data/snapshots, on
// demand from a worker thread with its own connection so play goes on, and
// before a pending migration. A Mac program reads a snapshot, never the live
// file (REQ-2524); each holds the log and the blobs table (REQ-2532).
import { copyFileSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { Worker } from "node:worker_threads";
import type { Db } from "./database.js";

export const snapshotName = (at: Date): string =>
  `meowtower-${at
    .toISOString()
    .replace(/\.\d{3}Z$/, "Z")
    .replace(/:/g, "-")}.sqlite`;

const sqlitePath = createRequire(import.meta.url).resolve("better-sqlite3");

// The worker opens the live file read-only and copies it; WAL lets writes go on.
const WORKER = `
const { parentPort, workerData } = require("node:worker_threads");
const Database = require(workerData.sqlitePath);
const db = new Database(workerData.live, { readonly: true });
db.prepare("VACUUM INTO ?").run(workerData.file);
db.close();
parentPort.postMessage("done");
`;

export interface Snapshot {
  file: string;
  ms: number;
}

export function takeSnapshot(
  live: string,
  dir: string,
  at: Date,
): Promise<Snapshot> {
  mkdirSync(dir, { recursive: true });
  const file = join(dir, snapshotName(at));
  const started = performance.now();
  return new Promise((resolve, reject) => {
    const worker = new Worker(WORKER, {
      eval: true,
      workerData: { live, file, sqlitePath },
    });
    worker.once("message", () =>
      resolve({ file, ms: Math.round(performance.now() - started) }),
    );
    worker.once("error", reject);
    worker.once("exit", (code) => {
      if (code !== 0)
        reject(new Error(`backup_failed: snapshot worker exited ${code}`));
    });
  });
}

/** A snapshot taken on the given connection, for the migration hook at start-up. */
export function snapshotNow(db: Db, dir: string, at: Date): string {
  mkdirSync(dir, { recursive: true });
  const file = join(dir, snapshotName(at));
  db.prepare("VACUUM INTO ?").run(file);
  return file;
}

/** Replaces the live database with the newest snapshot; the server must be stopped. */
export function restoreNewest(dir: string, live: string): string {
  const newest = readdirSync(dir)
    .filter((f) => /^meowtower-.+\.sqlite$/.test(f))
    .sort()
    .at(-1);
  if (!newest) throw new Error(`restore_failed: no snapshot in ${dir}`);
  for (const suffix of ["-wal", "-shm"])
    rmSync(`${live}${suffix}`, { force: true });
  copyFileSync(join(dir, newest), live);
  return join(dir, newest);
}
