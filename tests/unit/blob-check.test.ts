// TSK-0240, REQ-2210: the verify check shows whether a stored image changed.
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { storeScratch } from "../../src/engine/blobs/store.js";
import { verifyBlobs } from "../../src/engine/blobs/verify.js";
import { openDatabase } from "../../src/server/database.js";
import { webp } from "../helpers/webp.js";

const dir = mkdtempSync(join(tmpdir(), "meowtower-blobcheck-"));
const blobs = join(dir, "blobs");
const db = openDatabase(join(dir, "meowtower.sqlite"));
afterAll(() => {
  db.close();
  rmSync(dir, { recursive: true, force: true });
});
const ctx = { itemId: "i-9", attemptNo: 1 as const, origin: "server" as const };

describe("verifyBlobs", () => {
  it("passes when every file hashes to its name and every event's file exists", () => {
    storeScratch(db, blobs, webp("kept"), ctx);
    expect(verifyBlobs(db, blobs)).toEqual([]);
  });

  it("reports blob_changed for a file whose bytes changed", () => {
    const hash = storeScratch(db, blobs, webp("tampered"), ctx);
    writeFileSync(join(blobs, `${hash}.webp`), webp("something else"));
    expect(verifyBlobs(db, blobs)).toEqual([
      { failure: "blob_changed", file: `${hash}.webp` },
    ]);
  });
});
