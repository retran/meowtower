// Raises a named failure state (SPC-0010, SPC-0020): to the server's log,
// which `docker compose logs meowtower` shows, and, for `log_write_failed`,
// into the parent's notices once the server names their folder (TSK-0295).
import { mkdirSync } from "node:fs";
import { readNotices, writeNotices } from "./backups.js";

let noticesDir: string | null = null;
let writeFailed = false;

/** Sends `log_write_failed` into the notices in `dir`; `null` keeps it in the log only. */
export function useNoticesDir(dir: string | null): void {
  noticesDir = dir;
  writeFailed = false;
}

export function raise(state: string, detail: string, now = Date.now): void {
  console.error(`${state}: ${detail}`);
  if (state !== "log_write_failed" || !noticesDir) return;
  mkdirSync(noticesDir, { recursive: true });
  const notices = readNotices(noticesDir);
  notices.log_write_failed = {
    at: new Date(now()).toISOString(),
    reason: detail,
  };
  writeNotices(noticesDir, notices);
  writeFailed = true;
}

/** A later write succeeded, so a raised `log_write_failed` clears. */
export function writeSucceeded(): void {
  if (!writeFailed || !noticesDir) return;
  const notices = readNotices(noticesDir);
  notices.log_write_failed = null;
  writeNotices(noticesDir, notices);
  writeFailed = false;
}
