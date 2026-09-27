// The stage-0 write appends one event through appendEvents (TSK-0200), and a
// failed commit gives 503 and log_write_failed (REQ-2226's failure path).
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../../src/server/app.js";
import { openDatabase, type Db } from "../../src/server/database.js";

const dirs: string[] = [];
afterEach(() => {
  vi.restoreAllMocks();
  for (const dir of dirs.splice(0))
    rmSync(dir, { recursive: true, force: true });
});
function db(): Db {
  const dir = mkdtempSync(join(tmpdir(), "meowtower-stage0-"));
  dirs.push(dir);
  return openDatabase(join(dir, "meowtower.sqlite"));
}
const write = (app: ReturnType<typeof createApp>, body: object) =>
  app.request("/api/stage0/write", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

describe("POST /api/stage0/write appends to the log", () => {
  it("appends one attempt_submitted event keyed by the request id, once", async () => {
    const d = db();
    const app = createApp({ db: d });
    const body = { id: "w1", answer: "3/4", deviceId: "ipad-1", clientMs: 5 };
    expect((await write(app, body)).status).toBe(201);
    expect((await write(app, body)).status).toBe(201);
    expect(
      d
        .prepare(
          "SELECT type, v, device_id, client_ms, payload, idem_key FROM events",
        )
        .all(),
    ).toEqual([
      {
        type: "attempt_submitted",
        v: 0,
        device_id: "ipad-1",
        client_ms: 5,
        payload: '{"raw":"3/4"}',
        idem_key: "w1",
      },
    ]);
    expect((await app.request("/api/stage0/write/w1")).status).toBe(200);
    expect((await app.request("/api/stage0/write/w2")).status).toBe(404);
    d.close();
  });

  it("replies 503 and raises log_write_failed when the commit fails", async () => {
    const d = db();
    d.exec(
      "CREATE TRIGGER full_disk BEFORE INSERT ON events BEGIN SELECT RAISE(ABORT, 'disk full'); END",
    );
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await write(createApp({ db: d }), { id: "w1" });
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "log_write_failed" });
    expect(errors).toHaveBeenCalledWith(
      expect.stringContaining("log_write_failed"),
    );
    expect(d.prepare("SELECT count(*) AS n FROM events").get()).toEqual({
      n: 0,
    });
    d.close();
  });
});
