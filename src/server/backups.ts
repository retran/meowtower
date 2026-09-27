// The backup after each session (TSK-0080, SPC-0010): a snapshot when a
// session ends (REQ-2526), retention of the newest 30 and the first of each
// month (REQ-2530), and the parent's two notices, `backup_failed` and
// `storage_ceiling`, kept beside the snapshots where `./meowtower status`
// and the Parent Room read them.
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { snapshotName, takeSnapshot } from "./snapshots.js";

export const KEEP_NEWEST = 30;
const GB = 1024 ** 3;
export const STORAGE_FIRST_GB = 20;
export const STORAGE_STEP_GB = 10;

export interface Notices {
  backup_failed: { at: string; reason: string } | null;
  storage_ceiling: { at: string; gb: number } | null;
}

const NOTICES = "notices.json";

export function readNotices(dir: string): Notices {
  const path = join(dir, NOTICES);
  if (!existsSync(path)) return { backup_failed: null, storage_ceiling: null };
  return JSON.parse(readFileSync(path, "utf8")) as Notices;
}

function writeNotices(dir: string, notices: Notices): void {
  writeFileSync(join(dir, NOTICES), JSON.stringify(notices));
}

/** The snapshot files, oldest first: their names sort by their UTC time. */
export function snapshotFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /^meowtower-.+\.sqlite$/.test(f))
    .sort();
}

/** Keeps the newest 30 and the first of every calendar month; returns what it deleted. */
export function prune(dir: string): string[] {
  const files = snapshotFiles(dir);
  const keep = new Set(files.slice(-KEEP_NEWEST));
  const months = new Set<string>();
  for (const f of files) {
    const month = f.slice("meowtower-".length, "meowtower-".length + 7);
    if (!months.has(month)) {
      months.add(month);
      keep.add(f);
    }
  }
  const removed = files.filter((f) => !keep.has(f));
  for (const f of removed) rmSync(join(dir, f), { force: true });
  return removed;
}

/** The bytes under a folder, every file counted. */
export function folderSize(root: string): number {
  if (!existsSync(root)) return 0;
  const stat = statSync(root);
  if (!stat.isDirectory()) return stat.size;
  return readdirSync(root).reduce(
    (sum, name) => sum + folderSize(join(root, name)),
    0,
  );
}

export interface BackupOptions {
  live: string;
  dir: string;
  /** The data folder whose size the storage notice watches. */
  dataRoot: string;
  now: () => number;
  sizeOf?: (root: string) => number;
}

/**
 * Takes the snapshot, prunes, and updates both notices. A failure raises
 * `backup_failed` once and the next good snapshot clears it; the storage
 * notice rises at 20 GB and again at each further 10 GB.
 */
export async function backupAfterSession(o: BackupOptions): Promise<void> {
  const at = new Date(o.now());
  mkdirSync(o.dir, { recursive: true });
  const notices = readNotices(o.dir);
  try {
    // Names have one-second resolution: a second session ending in the same
    // second takes the next free second's name rather than failing.
    let named = at;
    while (existsSync(join(o.dir, snapshotName(named))))
      named = new Date(named.getTime() + 1000);
    const taken = await takeSnapshot(o.live, o.dir, named);
    writeFileSync(
      join(o.dir, "last.json"),
      JSON.stringify({ file: taken.file, ms: taken.ms, at: at.toISOString() }),
    );
    prune(o.dir);
    notices.backup_failed = null;
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    if (!notices.backup_failed) console.error(`backup_failed: ${reason}`);
    notices.backup_failed = { at: at.toISOString(), reason };
  }
  const gb = (o.sizeOf ?? folderSize)(o.dataRoot) / GB;
  const reached =
    gb < STORAGE_FIRST_GB
      ? 0
      : STORAGE_FIRST_GB +
        Math.floor((gb - STORAGE_FIRST_GB) / STORAGE_STEP_GB) * STORAGE_STEP_GB;
  if (reached > (notices.storage_ceiling?.gb ?? 0)) {
    console.error(`storage_ceiling: data/ holds ${gb.toFixed(1)} GB`);
    notices.storage_ceiling = { at: at.toISOString(), gb: reached };
  }
  writeNotices(o.dir, notices);
}
