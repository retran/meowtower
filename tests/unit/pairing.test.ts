// TSK-0040: a device pairs by a 6-digit code (REQ-2516) and keeps its access
// (REQ-2518); every API route except pairing needs its token.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { createApp } from "../../src/server/app.js";
import { openDatabase } from "../../src/server/database.js";
import { hashToken } from "../../src/server/devices.js";
import { createParentApp } from "../../src/server/parent.js";

const dir = mkdtempSync(join(tmpdir(), "meowtower-pair-"));
const path = join(dir, "meowtower.sqlite");
afterAll(() => rmSync(dir, { recursive: true, force: true }));

let now = Date.UTC(2026, 8, 27, 12, 0, 0);
const clock = (): number => now;

async function issueCode(db: ReturnType<typeof openDatabase>): Promise<string> {
  const res = await createParentApp({ db, now: clock }).request("/pair-code", {
    method: "POST",
  });
  expect(res.status).toBe(200);
  return ((await res.json()) as { code: string }).code;
}

async function pair(
  app: ReturnType<typeof createApp>,
  code: string,
): Promise<Response> {
  return app.request("/api/pair", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ code, kind: "tablet" }),
  });
}

describe("REQ-2516: pairing by a 6-digit code that lives 5 minutes", () => {
  const db = openDatabase(path);
  const app = createApp({ db, now: clock });

  it("pairs within 5 minutes and sets a lasting cookie holding a token whose hash alone is stored", async () => {
    const code = await issueCode(db);
    expect(code).toMatch(/^\d{6}$/);
    now += 4 * 60 * 1000;
    const res = await pair(app, code);
    expect(res.status).toBe(200);
    const cookie = res.headers.get("set-cookie") ?? "";
    expect(cookie).toMatch(/^meowtower_device=[A-Za-z0-9_-]{43};/);
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("Secure");
    expect(cookie).toContain("SameSite=Strict");
    expect(cookie).not.toMatch(/Expires|Max-Age/i);
    const token = /^meowtower_device=([^;]+)/.exec(cookie)?.[1] ?? "";
    const hashes = db.prepare("SELECT token_hash FROM devices").all() as {
      token_hash: string;
    }[];
    expect(hashes.map((h) => h.token_hash)).toContain(hashToken(token));
    expect(hashes.map((h) => h.token_hash)).not.toContain(token);
  });

  it("refuses a code issued more than 5 minutes ago", async () => {
    const code = await issueCode(db);
    now += 5 * 60 * 1000 + 1;
    const res = await pair(app, code);
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: "pairing_code_invalid" });
  });

  it("refuses a code used once already", async () => {
    const code = await issueCode(db);
    expect((await pair(app, code)).status).toBe(200);
    expect((await pair(app, code)).status).toBe(403);
  });

  it("refuses a wrong code", async () => {
    await issueCode(db);
    expect((await pair(app, "000000")).status).toBe(403);
  });

  it("answers 401 on every API route but pairing without a token", async () => {
    for (const [method, route] of [
      ["POST", "/api/session/start"],
      ["GET", "/api/session/x/next"],
      ["POST", "/api/session/x/answer"],
      ["POST", "/api/item/x/hint"],
      ["POST", "/api/item/x/explain"],
      ["POST", "/api/item/x/second-attempt"],
      ["GET", "/api/session/x/events"],
      ["GET", "/api/session/x/poll"],
      ["POST", "/api/stage0/write"],
      ["GET", "/api/stage0/write/x"],
    ] as const) {
      const res = await app.request(route, {
        method,
        headers: { "content-type": "application/json" },
        ...(method === "POST" ? { body: "{}" } : {}),
      });
      expect(res.status, `${method} ${route}`).toBe(401);
    }
  });

  it("keeps the page, manifest, icon and health public, so a new device can load the app", async () => {
    for (const route of [
      "/",
      "/manifest.webmanifest",
      "/icon-512.png",
      "/health",
    ]) {
      expect((await app.request(route)).status, route).toBe(200);
    }
  });

  it("REQ-2518: a paired device keeps its access after the server restarts", async () => {
    const code = await issueCode(db);
    const cookie =
      ((await pair(app, code)).headers.get("set-cookie") ?? "").split(";")[0] ??
      "";
    db.close();
    const reopened = openDatabase(path);
    const res = await createApp({ db: reopened, now: clock }).request(
      "/api/session/start",
      {
        method: "POST",
        headers: { cookie, "content-type": "application/json" },
        body: JSON.stringify({ mode: "daily", clientSeq: 1 }),
      },
    );
    expect(res.status).toBe(200);
    reopened.close();
  });
});
