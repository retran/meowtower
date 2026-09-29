// TSK-0450: `./meowtower status` names what the storage notice counts, data/
// and the database together (ADR-0370 entry 1). The script runs from a copy in
// a scratch folder, beside a sample notices.json, with a stub docker on PATH.
import { spawnSync } from "node:child_process";
import {
  chmodSync,
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";

const dir = mkdtempSync(join(tmpdir(), "meowtower-status-"));
afterAll(() => rmSync(dir, { recursive: true, force: true }));

describe("TSK-0450: the status line names data/ and the database", () => {
  it("prints the storage notice with the threshold it reached", () => {
    copyFileSync("meowtower", join(dir, "meowtower"));
    chmodSync(join(dir, "meowtower"), 0o755);
    mkdirSync(join(dir, "data", "snapshots"), { recursive: true });
    writeFileSync(
      join(dir, "data", "snapshots", "notices.json"),
      JSON.stringify({
        backup_failed: null,
        storage_ceiling: { at: "2026-09-29T10:00:00.000Z", gb: 30 },
      }),
    );
    const bin = join(dir, "bin");
    mkdirSync(bin);
    // `docker info` succeeds, and `docker compose ps` reports nothing.
    writeFileSync(join(bin, "docker"), "#!/bin/sh\nexit 0\n");
    chmodSync(join(bin, "docker"), 0o755);
    const res = spawnSync(join(dir, "meowtower"), ["status"], {
      encoding: "utf8",
      env: { ...process.env, PATH: `${bin}:${process.env["PATH"] ?? ""}` },
    });
    expect(res.stdout).toContain(
      "storage_ceiling: data/ and the database hold more than 30 GB.",
    );
  });
});
