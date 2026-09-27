// The write-once blob store (SPC-0020): a draft-pad image becomes
// data/blobs/<sha256>.webp, synced to disk before the log refers to it.
import { createHash } from "node:crypto";
import {
  closeSync,
  fchmodSync,
  fsyncSync,
  mkdirSync,
  openSync,
  writeSync,
} from "node:fs";
import { join } from "node:path";
import type Database from "better-sqlite3";
import { appendEvents, type NewEvent } from "../events/append.js";

type Db = Database.Database;

export const BLOB_LIMIT_BYTES = 512 * 1024;

export class BlobRefused extends Error {
  constructor(reason: "blob_too_large" | "blob_not_webp") {
    super(reason);
    this.name = "BlobRefused";
  }
}

const isWebp = (b: Buffer): boolean =>
  b.length > 12 &&
  b.toString("ascii", 0, 4) === "RIFF" &&
  b.toString("ascii", 8, 12) === "WEBP";

export interface ScratchContext {
  itemId: string;
  attemptNo: 1 | 2;
  origin: NewEvent["origin"];
  sessionId?: string;
}

/**
 * Stores the image and logs `scratch_snapshot` naming its hash (REQ-2210).
 * The order is the guarantee: the file is created exclusively and synced, the
 * row inserted, and only then is the event committed, so no event can name a
 * file that isn't on disk. An existing file for the hash is never rewritten.
 */
export function storeScratch(
  db: Db,
  dir: string,
  image: Buffer,
  ctx: ScratchContext,
  hooks: { afterFileSynced?: () => void } = {},
): string {
  if (image.length > BLOB_LIMIT_BYTES) throw new BlobRefused("blob_too_large");
  if (!isWebp(image)) throw new BlobRefused("blob_not_webp");
  const sha256 = createHash("sha256").update(image).digest("hex");
  mkdirSync(dir, { recursive: true });
  let fd: number | undefined;
  try {
    fd = openSync(join(dir, `${sha256}.webp`), "wx");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "EEXIST") throw err;
  }
  if (fd !== undefined) {
    try {
      writeSync(fd, image);
      // Read-only once written: an overwrite by any server code fails (REQ-2532).
      fchmodSync(fd, 0o444);
      fsyncSync(fd);
    } finally {
      closeSync(fd);
    }
    const dirFd = openSync(dir, "r");
    try {
      fsyncSync(dirFd);
    } finally {
      closeSync(dirFd);
    }
  }
  hooks.afterFileSynced?.();
  db.prepare(
    "INSERT OR IGNORE INTO blobs (sha256, bytes, created_at) VALUES (?, ?, ?)",
  ).run(sha256, image.length, new Date().toISOString());
  appendEvents(db, [
    {
      type: "scratch_snapshot",
      v: 1,
      payload: { itemId: ctx.itemId, attemptNo: ctx.attemptNo, sha256 },
      origin: ctx.origin,
      ...(ctx.sessionId ? { sessionId: ctx.sessionId } : {}),
    },
  ]);
  return sha256;
}
