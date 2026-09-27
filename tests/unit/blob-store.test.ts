// TSK-0240, REQ-2210: a draft-pad image is stored once by its hash, and the
// log refers to it only after the file is safely on disk.
import {
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { BlobRefused, storeScratch } from "../../src/engine/blobs/store.js";
import { eventsOfType } from "../../src/engine/events/read.js";
import { openDatabase } from "../../src/server/database.js";
import { webp } from "../helpers/webp.js";

const dir = mkdtempSync(join(tmpdir(), "meowtower-blobs-"));
const blobs = join(dir, "blobs");
const db = openDatabase(join(dir, "meowtower.sqlite"));
afterAll(() => {
  db.close();
  rmSync(dir, { recursive: true, force: true });
});

const sha = (b: Buffer): string => createHash("sha256").update(b).digest("hex");
const ctx = { itemId: "i-1", attemptNo: 1 as const, origin: "server" as const };

describe("REQ-2210: storing a draft-pad image", () => {
  it("writes the file, then the row, then the event naming the hash", () => {
    const image = webp("first draft");
    const hash = storeScratch(db, blobs, image, ctx);
    expect(hash).toBe(sha(image));
    expect(readFileSync(join(blobs, `${hash}.webp`))).toEqual(image);
    expect(
      db.prepare("SELECT sha256 FROM blobs WHERE sha256 = ?").get(hash),
    ).toEqual({ sha256: hash });
    const events = eventsOfType(db, "scratch_snapshot").map((e) => e.payload);
    expect(events).toContainEqual({
      itemId: "i-1",
      attemptNo: 1,
      sha256: hash,
    });
  });

  it("keeps an existing file's bytes and time when the same image comes again", async () => {
    const image = webp("same draft");
    const hash = storeScratch(db, blobs, image, ctx);
    const file = join(blobs, `${hash}.webp`);
    const before = statSync(file).mtimeMs;
    await new Promise((r) => setTimeout(r, 20));
    storeScratch(db, blobs, image, ctx);
    expect(statSync(file).mtimeMs).toBe(before);
    expect(readFileSync(file)).toEqual(image);
  });

  it("refuses an image over 512 KB and writes nothing", () => {
    const files = readdirSync(blobs).length;
    const events = eventsOfType(db, "scratch_snapshot").length;
    expect(() => storeScratch(db, blobs, webp("x", 512 * 1024), ctx)).toThrow(
      BlobRefused,
    );
    expect(readdirSync(blobs).length).toBe(files);
    expect(eventsOfType(db, "scratch_snapshot").length).toBe(events);
  });

  it("refuses bytes that aren't a WebP image", () => {
    expect(() =>
      storeScratch(db, blobs, Buffer.from("not an image"), ctx),
    ).toThrow(BlobRefused);
  });

  it("logs no event when the process dies after the file is synced", () => {
    const events = eventsOfType(db, "scratch_snapshot").length;
    const image = webp("crash between sync and commit");
    expect(() =>
      storeScratch(db, blobs, image, ctx, {
        afterFileSynced: () => {
          throw new Error("process killed");
        },
      }),
    ).toThrow("process killed");
    expect(eventsOfType(db, "scratch_snapshot").length).toBe(events);
    // The file may stay behind, unreferenced; no event names a missing file.
    for (const e of eventsOfType(db, "scratch_snapshot")) {
      const hash = (e.payload as { sha256: string }).sha256;
      expect(statSync(join(blobs, `${hash}.webp`)).isFile()).toBe(true);
    }
  });
});

describe("REQ-2210: a stored row's hash can't change", () => {
  it("refuses UPDATE and DELETE on blobs", () => {
    const hash = storeScratch(db, blobs, webp("guarded"), ctx);
    expect(() =>
      db.prepare("UPDATE blobs SET sha256 = 'x' WHERE sha256 = ?").run(hash),
    ).toThrow("events are append-only");
    expect(() =>
      db.prepare("DELETE FROM blobs WHERE sha256 = ?").run(hash),
    ).toThrow("events are append-only");
  });
});
