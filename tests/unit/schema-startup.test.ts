// ADR-0020: meowtower won't start on a log holding a type or version that has
// no schema, because a projection couldn't read it.
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import Database from "better-sqlite3";
import { afterAll, expect, it } from "vitest";
import { openDatabase } from "../../src/server/database.js";

const dir = mkdtempSync(join(tmpdir(), "meowtower-schema-start-"));
afterAll(() => rmSync(dir, { recursive: true, force: true }));

it("exits with event_schema_unknown, naming the type and version", async () => {
  const path = join(dir, "meowtower.sqlite");
  openDatabase(path).close();
  // Bypass appendEvents, as a log written by another version of the code would.
  const raw = new Database(path);
  raw
    .prepare(
      `INSERT INTO events (id, ts, client_ms, device_id, type, v, payload)
       VALUES ('01TEST', '2026-09-27T00:00:00.000Z', 0, 'server', 'from_the_future', 7, '{}')`,
    )
    .run();
  raw.close();

  const child = spawn(
    process.execPath,
    ["--import", "tsx", "src/server/main.ts"],
    {
      env: {
        ...process.env,
        MEOWTOWER_DB: path,
        PORT: "3923",
        PARENT_PORT: "3924",
      },
      stdio: ["ignore", "ignore", "pipe"],
    },
  );
  let stderr = "";
  child.stderr.on("data", (d: Buffer) => (stderr += d.toString()));
  const timer = setTimeout(() => child.kill("SIGKILL"), 10000);
  const code = await new Promise<number | null>((r) => child.once("exit", r));
  clearTimeout(timer);
  expect(code).not.toBe(0);
  expect(code).not.toBeNull();
  expect(stderr).toContain("event_schema_unknown: from_the_future v7");
}, 15000);
