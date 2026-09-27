// REQ-2528: the real server start takes a snapshot before a pending migration.
import { spawn } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, expect, it } from "vitest";
import Database from "better-sqlite3";

const dir = mkdtempSync(join(tmpdir(), "meowtower-mainsnap-"));
afterAll(() => rmSync(dir, { recursive: true, force: true }));

it("main.ts snapshots into MEOWTOWER_SNAPSHOTS before migrating", async () => {
  const live = join(dir, "live.sqlite");
  const snaps = join(dir, "snaps");
  // A database one migration behind the code, built without the start-up checks.
  const files = readdirSync("migrations")
    .filter((f) => f.endsWith(".sql"))
    .sort();
  const raw = new Database(live);
  raw.exec(
    "CREATE TABLE schema_migrations (version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL) STRICT",
  );
  for (const f of files.slice(0, -1)) {
    raw.exec(readFileSync(join("migrations", f), "utf8"));
    raw
      .prepare("INSERT INTO schema_migrations VALUES (?, ?)")
      .run(Number(f.slice(0, 4)), "then");
  }
  raw.close();

  const child = spawn(
    process.execPath,
    ["--import", "tsx", "src/server/main.ts"],
    {
      env: {
        ...process.env,
        MEOWTOWER_DB: live,
        MEOWTOWER_SNAPSHOTS: snaps,
        PORT: "3926",
        PARENT_PORT: "3927",
      },
      stdio: "ignore",
    },
  );
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch("http://127.0.0.1:3926/health")).ok) break;
    } catch {
      // not listening yet
    }
    await new Promise((r) => setTimeout(r, 50));
  }
  child.kill("SIGKILL");
  expect(readdirSync(snaps).filter((f) => f.endsWith(".sqlite"))).toHaveLength(
    1,
  );
}, 20000);
