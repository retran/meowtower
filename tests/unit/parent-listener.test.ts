// REQ-7684, REQ-7678, REQ-7682 (ADR-3470): the Mac's loopback listener serves no page, and the
// figures, notices and logs it showed are the Parent Room's, behind the PIN.
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { createApp } from "../../src/server/app.js";
import { writeNotices } from "../../src/server/backups.js";
import { openDatabase } from "../../src/server/database.js";
import { registerDevice } from "../../src/server/devices.js";
import { useNoticesDir } from "../../src/server/failures.js";
import { createParentApp } from "../../src/server/parent.js";

const dir = mkdtempSync(join(tmpdir(), "meowtower-"));
const notices = join(dir, "snapshots");
const db = await openDatabase(join(dir, "meowtower.sqlite"));
afterAll(async () => {
  useNoticesDir(null);
  await db.close();
  rmSync(dir, { recursive: true, force: true });
});

const PIN = "4821";
const json = { "content-type": "application/json" };

describe("REQ-7684: the loopback listener serves the operator's routes and no page", () => {
  it("answers 404 where the admin page and its audits were", async () => {
    const mac = createParentApp({ db });
    for (const path of ["/", "/audit/llm", "/audit/play"])
      expect((await mac.request(path)).status, path).toBe(404);
    const pin = await mac.request("/pin", {
      method: "POST",
      headers: json,
      body: JSON.stringify({ pin: PIN }),
    });
    expect(pin.status).toBe(200);
  });
});

describe("REQ-7678, REQ-7682: the overview and the logs sit behind the PIN", () => {
  it("refuses them without a parent session and shows them with one", async () => {
    mkdirSync(notices, { recursive: true });
    await createParentApp({ db }).request("/pin", {
      method: "POST",
      headers: json,
      body: JSON.stringify({ pin: PIN }),
    });
    writeNotices(notices, {
      backup_failed: { at: "2026-11-15T10:00:00Z", reason: "disk" },
      storage_ceiling: null,
    });
    useNoticesDir(notices);
    await db
      .prepare(
        `INSERT INTO llm_log (at, role, route, model, tier, bucket, input_tokens, output_tokens,
           cost_usd, latency_ms, outcome, request, response)
         VALUES ('2026-11-15', 'MASTER_MODEL', 'openrouter', 'm', 'player', 'b', 1, 2, 0.25, 3, 'ok', 'asked', 'answered')`,
      )
      .run();
    const app = await createApp({
      db,
      now: () => Date.parse("2026-11-15T12:00:00Z"),
    });
    const device = `meowtower_device=${await registerDevice(db, "tablet")}`;
    for (const path of [
      "/api/parent/overview",
      "/api/parent/audit/play",
      "/api/parent/audit/llm",
    ])
      expect(
        (await app.request(path, { headers: { cookie: device } })).status,
        path,
      ).toBe(401);

    const login = await app.request("/api/parent/login", {
      method: "POST",
      headers: { ...json, cookie: device },
      body: JSON.stringify({ pin: PIN }),
    });
    expect(login.status).toBe(200);
    const parent = (login.headers.get("set-cookie") ?? "").split(";")[0] ?? "";
    const cookie = `${device}; ${parent}`;

    const overview = (await (
      await app.request("/api/parent/overview", { headers: { cookie } })
    ).json()) as { calls: number; monthUsd: number; notices: string[] };
    expect(overview.calls).toBe(1);
    expect(overview.monthUsd).toBe(0.25);
    expect(overview.notices).toHaveLength(1);
    expect(overview.notices[0]).toContain("Резервная копия не получилась");

    const calls = (await (
      await app.request("/api/parent/audit/llm", { headers: { cookie } })
    ).json()) as { request: string; response: string }[];
    expect(calls).toHaveLength(1);
    expect(calls[0]?.request).toBe("asked");
    expect(calls[0]?.response).toBe("answered");
    const played = await app.request("/api/parent/audit/play", {
      headers: { cookie },
    });
    expect(played.status).toBe(200);
    expect(await played.json()).toEqual([]);
  });
});
