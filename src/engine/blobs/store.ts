// The write-once blob store (SPC-0020): a draft-pad image becomes
// data/blobs/<sha256>.webp, synced to disk before the log refers to it.
import { createHash } from "node:crypto";
import {
  closeSync,
  fchmodSync,
  fsyncSync,
  mkdirSync,
  existsSync,
  openSync,
  readdirSync,
  readFileSync,
  writeSync,
} from "node:fs";
import { join } from "node:path";
import type Database from "better-sqlite3";
import { appendEvents, type NewEvent } from "../events/append.js";

type Db = Database.Database;

export const BLOB_LIMIT_BYTES = 512 * 1024;

export class BlobRefused extends Error {
  constructor(reason: "blob_too_large" | "blob_not_webp" | "blob_changed") {
    super(reason);
    this.name = "BlobRefused";
  }
}

const isWebp = (b: Buffer): boolean =>
  b.length > 12 &&
  b.toString("ascii", 0, 4) === "RIFF" &&
  b.toString("ascii", 8, 12) === "WEBP";

const hasRow = (db: Db, sha256: string): boolean =>
  db.prepare("SELECT 1 FROM blobs WHERE sha256 = ?").get(sha256) !== undefined;

/**
 * At start-up, inserts the row of every `.webp` file in `dir` that has none
 * and hashes to its name, and reports the one that doesn't through `onChanged`
 * without a row. A file of another extension is left as it is.
 */
export function recoverBlobs(
  db: Db,
  dir: string,
  onChanged: (file: string) => void,
): { inserted: string[]; changed: string[] } {
  const done = { inserted: [] as string[], changed: [] as string[] };
  if (!existsSync(dir)) return done;
  const insert = db.prepare(
    "INSERT INTO blobs (sha256, bytes, created_at) VALUES (?, ?, ?)",
  );
  for (const file of readdirSync(dir).sort()) {
    if (!file.endsWith(".webp")) continue;
    const name = file.slice(0, -".webp".length);
    if (hasRow(db, name)) continue;
    const bytes = readFileSync(join(dir, file));
    if (createHash("sha256").update(bytes).digest("hex") === name) {
      insert.run(name, bytes.length, new Date().toISOString());
      done.inserted.push(file);
    } else {
      done.changed.push(file);
      onChanged(file);
    }
  }
  return done;
}

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
 * file that isn't on disk. An existing file for the hash is never rewritten;
 * one with no row is hashed, and refused with `blob_changed` when it no longer
 * hashes to its name (a crash between sync and insert leaves such a file).
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
  if (fd === undefined && !hasRow(db, sha256)) {
    const onDisk = createHash("sha256")
      .update(readFileSync(join(dir, `${sha256}.webp`)))
      .digest("hex");
    if (onDisk !== sha256) throw new BlobRefused("blob_changed");
  }
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
