// TSK-0070, REQ-2532: no server code overwrites or deletes a stored image.
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { storeScratch } from "../../src/engine/blobs/store.js";
import { openDatabase } from "../../src/server/database.js";
import { checkBlobWritesConfined } from "../../tools/static-checks.js";
import { webp } from "../helpers/webp.js";

const dir = mkdtempSync(join(tmpdir(), "meowtower-once-"));
const db = openDatabase(join(dir, "meowtower.sqlite"));
afterAll(() => {
  db.close();
  rmSync(dir, { recursive: true, force: true });
});

describe("data/blobs is write-once", () => {
  it("refuses an overwrite of a stored image", () => {
    const blobs = join(dir, "blobs");
    const hash = storeScratch(db, blobs, webp("once"), {
      itemId: "i",
      attemptNo: 1,
      origin: "server",
    });
    expect(() => writeFileSync(join(blobs, `${hash}.webp`), "changed")).toThrow(
      /EACCES|EPERM/,
    );
  });

  it("finds no code outside the blob store that deletes or writes into data/blobs", () => {
    expect(checkBlobWritesConfined(process.cwd())).toEqual([]);
  });

  it("names code that deletes a blob", () => {
    const root = mkdtempSync(join(tmpdir(), "meowtower-once-src-"));
    writeFileSync(
      join(root, "rogue.ts"),
      'import { rmSync } from "node:fs"; rmSync("data/blobs/x.webp");',
    );
    expect(checkBlobWritesConfined(root)).toEqual([
      {
        check: "blob_write",
        file: "rogue.ts",
        match: expect.stringContaining("rmSync"),
      },
    ]);
    rmSync(root, { recursive: true, force: true });
  });
});
