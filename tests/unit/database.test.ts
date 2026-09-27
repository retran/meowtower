import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { openDatabase } from "../../src/server/database.js";

const dirs: string[] = [];
afterEach(() => {
  for (const dir of dirs.splice(0))
    rmSync(dir, { recursive: true, force: true });
});
const fresh = (): string => {
  const dir = mkdtempSync(join(tmpdir(), "meowtower-"));
  dirs.push(dir);
  return join(dir, "meowtower.sqlite");
};

describe("REQ-2508: the database is durable before any reply", () => {
  it("opens in WAL mode with synchronous FULL", () => {
    const db = openDatabase(fresh());
    expect(db.pragma("journal_mode", { simple: true })).toBe("wal");
    expect(db.pragma("synchronous", { simple: true })).toBe(2);
    db.close();
  });
});

describe("migrations", () => {
  it("applies each migration once and records it", () => {
    const path = fresh();
    openDatabase(path).close();
    const db = openDatabase(path);
    const applied = db
      .prepare("SELECT version FROM schema_migrations ORDER BY version")
      .all();
    const shipped = readdirSync("migrations")
      .filter((f) => /^\d{4}_.+\.sql$/.test(f))
      .map((f) => ({ version: Number(f.slice(0, 4)) }));
    expect(applied).toEqual(shipped);
    expect(db.prepare("SELECT count(*) AS n FROM events").get()).toEqual({
      n: 0,
    });
    db.close();
  });
});
