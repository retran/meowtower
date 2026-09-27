// The recompute as the parent runs it (TSK-0260, SPC-0020): `./meowtower
// recompute` through the Mac's listener, and the three notices it raises
// beside the backup notices: `recompute_failed` with the version and time,
// `recompute_slow` once past the 60-second budget, and `log_large` once the
// log passes 1 GB.
import { mkdirSync } from "node:fs";
import { eventsBytes } from "../engine/events/read.js";
import {
  recompute,
  versionLabel,
  type RecomputeOptions,
  type RecomputeResult,
} from "../engine/recompute.js";
import { readNotices, writeNotices } from "./backups.js";
import type { Db } from "./database.js";

/** ADR-0190's Baselines budget for a full recompute of one year's log. */
export const RECOMPUTE_BUDGET_MS = 60_000;
export const LOG_LARGE_BYTES = 1024 ** 3;

export async function runRecompute(
  db: Db,
  {
    dir,
    now,
    budgetMs = RECOMPUTE_BUDGET_MS,
    ...options
  }: { dir: string; now: () => number; budgetMs?: number } & Omit<
    RecomputeOptions,
    "computedAt"
  >,
): Promise<RecomputeResult> {
  const at = new Date(now()).toISOString();
  mkdirSync(dir, { recursive: true });
  try {
    const result = await recompute(db, { computedAt: at, ...options });
    const notices = readNotices(dir);
    notices.recompute_failed = null;
    if (result.ms > budgetMs && !notices.recompute_slow) {
      console.error(`recompute_slow: ${result.ms} ms`);
      notices.recompute_slow = { at, ms: result.ms };
    }
    writeNotices(dir, notices);
    return result;
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.error(`recompute_failed: ${versionLabel()}: ${reason}`);
    const notices = readNotices(dir);
    notices.recompute_failed = { at, version: versionLabel(), reason };
    writeNotices(dir, notices);
    throw err;
  }
}

/** Raises `log_large` once, when the log's table passes the limit. */
export function checkLogSize(
  db: Db,
  dir: string,
  now: () => number,
  limit = LOG_LARGE_BYTES,
): boolean {
  const bytes = eventsBytes(db);
  if (bytes <= limit) return false;
  mkdirSync(dir, { recursive: true });
  const notices = readNotices(dir);
  if (notices.log_large) return false;
  console.error(`log_large: the log holds ${bytes} bytes`);
  notices.log_large = { at: new Date(now()).toISOString(), bytes };
  writeNotices(dir, notices);
  return true;
}
