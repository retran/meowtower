// The verify check of the blob store (REQ-2210): every file hashes to its name,
// and every scratch_snapshot event's file exists.
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Db } from "../../server/db/index.js";
import { eventsOfType } from "../events/read.js";

export interface BlobFailure {
  failure: "blob_changed" | "blob_missing";
  file: string;
}

export async function verifyBlobs(db: Db, dir: string): Promise<BlobFailure[]> {
  const failures: BlobFailure[] = [];
  const files = existsSync(dir)
    ? readdirSync(dir).filter((f) => f.endsWith(".webp"))
    : [];
  for (const file of files.sort()) {
    const hash = createHash("sha256")
      .update(readFileSync(join(dir, file)))
      .digest("hex");
    if (`${hash}.webp` !== file)
      failures.push({ failure: "blob_changed", file });
  }
  const present = new Set(files);
  for (const e of await eventsOfType(db, "scratch_snapshot")) {
    const file = `${(e.payload as { sha256: string }).sha256}.webp`;
    if (!present.has(file)) failures.push({ failure: "blob_missing", file });
  }
  return failures;
}
