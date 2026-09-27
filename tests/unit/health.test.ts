import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { createApp } from "../../src/server/app.js";
import { openDatabase } from "../../src/server/database.js";

const dirs: string[] = [];
afterEach(() => {
  for (const dir of dirs.splice(0))
    rmSync(dir, { recursive: true, force: true });
});

describe("health page (TSK-0010)", () => {
  it("answers 200 with the database open", async () => {
    const dir = mkdtempSync(join(tmpdir(), "meowtower-"));
    dirs.push(dir);
    const db = openDatabase(join(dir, "meowmeowtower.sqlite"));
    const res = await createApp({ db }).request("/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: "ok", database: "ok" });
    db.close();
  });

  it("answers 503 when the database is closed", async () => {
    const dir = mkdtempSync(join(tmpdir(), "meowtower-"));
    dirs.push(dir);
    const db = openDatabase(join(dir, "meowmeowtower.sqlite"));
    db.close();
    const res = await createApp({ db }).request("/health");
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({
      status: "unavailable",
      database: "closed",
    });
  });
});
