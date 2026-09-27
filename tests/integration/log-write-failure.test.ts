// TSK-0295: a failed log write replies 503 on every route and reaches the
// parent as `log_write_failed`, which a later successful write clears
// (ADR-0020, SPC-0020).
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, expect, it, vi } from "vitest";
import { readNotices } from "../../src/server/backups.js";
import { createApp } from "../../src/server/app.js";
import { openDatabase } from "../../src/server/database.js";
import { registerDevice } from "../../src/server/devices.js";
import { useNoticesDir } from "../../src/server/failures.js";
import { createParentApp } from "../../src/server/parent.js";

const dir = mkdtempSync(join(tmpdir(), "meowtower-log-write-"));
const notices = join(dir, "snapshots");
const db = openDatabase(join(dir, "live.sqlite"));
afterAll(() => {
  useNoticesDir(null);
  db.close();
  rmSync(dir, { recursive: true, force: true });
});

it("replies 503, raises log_write_failed for the parent, and clears it after a later write", async () => {
  useNoticesDir(notices);
  const errors = vi.spyOn(console, "error").mockImplementation(() => undefined);
  const app = createApp({ db, now: () => Date.parse("2026-09-27T23:40:00Z") });
  const headers = {
    cookie: `meowtower_device=${registerDevice(db, "tablet")}`,
    "content-type": "application/json",
  };
  const start = (clientSeq: number) =>
    app.request("/api/session/start", {
      method: "POST",
      headers,
      body: JSON.stringify({ mode: "zero", clientSeq }),
    });
  const count = () =>
    (db.prepare("SELECT count(*) AS n FROM events").get() as { n: number }).n;
  const page = async () =>
    (await createParentApp({ db, snapshots: notices }).request("/")).text();

  // A database that refuses writes makes appendEvents fail, as a full disk would.
  const before = count();
  db.pragma("query_only = ON");
  const failed = await start(1);
  db.pragma("query_only = OFF");
  expect(failed.status).toBe(503);
  expect(await failed.json()).toEqual({ error: "log_write_failed" });
  expect(count()).toBe(before);
  expect(readNotices(notices).log_write_failed?.at).toBe(
    "2026-09-27T23:40:00.000Z",
  );
  const shown = await page();
  expect(shown.match(/role="alert"/g)).toHaveLength(1);
  expect(shown).toContain("Игра не смогла записать событие");

  const ok = await start(2);
  expect(ok.status).toBe(200);
  expect(readNotices(notices).log_write_failed).toBeNull();
  expect(await page()).not.toContain('role="alert"');
  errors.mockRestore();
});
