// TSK-0470, REQ-2210: a file in data/blobs/ with no `blobs` row is recovered
// when its content hashes to its name, and refused when it doesn't.
import {
  chmodSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import {
  BlobRefused,
  recoverBlobs,
  storeScratch,
} from "../../src/engine/blobs/store.js";
import { eventsOfType } from "../../src/engine/events/read.js";
import { openDatabase } from "../../src/server/database.js";
import { webp } from "../helpers/webp.js";

const root = mkdtempSync(join(tmpdir(), "meowtower-recovery-"));
afterAll(() => rmSync(root, { recursive: true, force: true }));

const sha = (b: Buffer): string => createHash("sha256").update(b).digest("hex");
const ctx = { itemId: "i-1", attemptNo: 1 as const, origin: "server" as const };
let worlds = 0;
function world() {
  const base = join(root, `w${++worlds}`);
  const blobs = join(base, "blobs");
  mkdirSync(blobs, { recursive: true });
  const db = openDatabase(join(base, "meowtower.sqlite"));
  return { db, blobs };
}
const rowCount = (db: ReturnType<typeof world>["db"], hash: string): number =>
  (
    db
      .prepare("SELECT COUNT(*) AS n FROM blobs WHERE sha256 = ?")
      .get(hash) as {
      n: number;
    }
  ).n;

describe("REQ-2210: a write recovers a file that has no row", () => {
  it("inserts the missing row, appends the event and leaves the file as it was", () => {
    const { db, blobs } = world();
    const image = webp("crash between sync and insert");
    const hash = sha(image);
    const file = join(blobs, `${hash}.webp`);
    writeFileSync(file, image);
    chmodSync(file, 0o444);
    const before = statSync(file).mtimeMs;

    expect(storeScratch(db, blobs, image, ctx)).toBe(hash);

    expect(
      db.prepare("SELECT sha256, bytes FROM blobs WHERE sha256 = ?").get(hash),
    ).toEqual({ sha256: hash, bytes: image.length });
    expect(eventsOfType(db, "scratch_snapshot").map((e) => e.payload)).toEqual([
      { itemId: "i-1", attemptNo: 1, sha256: hash },
    ]);
    expect(statSync(file).mtimeMs).toBe(before);
    expect(readFileSync(file)).toEqual(image);
    db.close();
  });

  it("refuses with blob_changed when the file no longer hashes to its name", () => {
    const { db, blobs } = world();
    const image = webp("the image the client sent");
    const hash = sha(image);
    // The file on disk differs from the image it is named for.
    writeFileSync(join(blobs, `${hash}.webp`), webp("damaged on disk"));

    let refused: unknown;
    try {
      storeScratch(db, blobs, image, ctx);
    } catch (err) {
      refused = err;
    }
    expect(refused).toBeInstanceOf(BlobRefused);
    expect((refused as Error).message).toBe("blob_changed");
    expect(rowCount(db, hash)).toBe(0);
    expect(eventsOfType(db, "scratch_snapshot")).toEqual([]);
    db.close();
  });
});

describe("REQ-2210: start-up recovers every file that has no row", () => {
  it("inserts the matching file's row, names the damaged one once and leaves a .pdf", () => {
    const { db, blobs } = world();
    const good = webp("good file");
    const goodHash = sha(good);
    writeFileSync(join(blobs, `${goodHash}.webp`), good);
    const badHash = sha(webp("what the name promised"));
    writeFileSync(join(blobs, `${badHash}.webp`), webp("what is there now"));
    const pdf = Buffer.from("%PDF-1.4 school snapshot");
    const pdfFile = `${sha(Buffer.from("something else"))}.pdf`;
    writeFileSync(join(blobs, pdfFile), pdf);

    const named: string[] = [];
    const done = recoverBlobs(db, blobs, (file) => named.push(file));

    expect(rowCount(db, goodHash)).toBe(1);
    expect(rowCount(db, badHash)).toBe(0);
    expect(named).toEqual([`${badHash}.webp`]);
    expect(done).toEqual({ inserted: [`${goodHash}.webp`], changed: named });
    expect(db.prepare("SELECT COUNT(*) AS n FROM blobs").get()).toEqual({
      n: 1,
    });
    expect(readFileSync(join(blobs, pdfFile))).toEqual(pdf);
    db.close();
  });

  it("starts on a folder that doesn't exist yet", () => {
    const { db, blobs } = world();
    expect(recoverBlobs(db, join(blobs, "absent"), () => undefined)).toEqual({
      inserted: [],
      changed: [],
    });
    db.close();
  });

  it("runs in main.ts before the first request is accepted", () => {
    const main = readFileSync("src/server/main.ts", "utf8");
    const recover = main.indexOf("recoverBlobs(");
    expect(recover).toBeGreaterThan(-1);
    expect(recover).toBeLessThan(main.indexOf("serve({"));
  });
});
