// TSK-0050: the PIN guards the Parent Room, the parent revokes a device
// (REQ-2520), and 5 wrong entries in a row of either kind lock that kind for
// 15 minutes, a correct entry included, while the other kind's count stays
// as it was (REQ-2522). Each test runs on its own database and fake clock.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { createApp } from "../../src/server/app.js";
import { openDatabase, type Db } from "../../src/server/database.js";
import { issuePairingCode, registerDevice } from "../../src/server/devices.js";
import { createParentApp } from "../../src/server/parent.js";
import { LOCK_MS } from "../../src/server/parent-access.js";

const root = mkdtempSync(join(tmpdir(), "meowtower-parent-"));
const opened: Db[] = [];
afterAll(() => {
  for (const db of opened) db.close();
  rmSync(root, { recursive: true, force: true });
});

const PIN = "4821";
let worlds = 0;

async function world() {
  const db = openDatabase(join(root, `w${++worlds}.sqlite`));
  opened.push(db);
  const clock = { ms: Date.parse("2026-09-27T12:00:00Z") };
  const now = () => clock.ms;
  const app = createApp({ db, now });
  const mac = createParentApp({ db, now });
  const json = { "content-type": "application/json" };
  const setPin = (pin: string) =>
    mac.request("/pin", {
      method: "POST",
      headers: json,
      body: JSON.stringify({ pin }),
    });
  const cookieOf = (res: Response, name: string): string =>
    (res.headers.get("set-cookie") ?? "")
      .split(/,(?=\s*\w+=)/)
      .map((c) => c.trim().split(";")[0] ?? "")
      .find((c) => c.startsWith(`${name}=`)) ?? "";
  const pair = (code: string) =>
    app.request("/api/pair", {
      method: "POST",
      headers: json,
      body: JSON.stringify({ code, kind: "tablet" }),
    });
  const login = (device: string, pin: string) =>
    app.request("/api/parent/login", {
      method: "POST",
      headers: { ...json, cookie: device },
      body: JSON.stringify({ pin }),
    });
  const lockout = (kind: string) =>
    (db
      .prepare("SELECT wrong, locked_until_ms FROM lockouts WHERE kind = ?")
      .get(kind) as { wrong: number; locked_until_ms: number } | undefined) ?? {
      wrong: 0,
      locked_until_ms: 0,
    };
  const device = () => `meowtower_device=${registerDevice(db, "computer")}`;
  return { db, clock, app, setPin, cookieOf, pair, login, lockout, device };
}

describe("the PIN guards the Parent Room", () => {
  it("sets the PIN only over the Mac's listener, with 4 to 8 digits", async () => {
    const w = await world();
    const phone = w.device();
    expect((await w.login(phone, PIN)).status).toBe(409);
    expect((await w.setPin("12a4")).status).toBe(400);
    expect((await w.setPin(PIN)).status).toBe(200);
    expect(
      (w.db.prepare("SELECT hash FROM parent_pin").get() as { hash: string })
        .hash,
    ).not.toContain(PIN);
    expect((await w.login(phone, PIN)).status).toBe(200);
  });

  it("opens the devices page only with a parent session of the same device", async () => {
    const w = await world();
    await w.setPin(PIN);
    const mine = w.device();
    const other = w.device();
    const page = (cookie: string) =>
      w.app.request("/api/parent/devices", { headers: { cookie } });
    expect(await (await page(mine)).json()).toEqual({
      error: "parent_session_missing",
    });
    const session = w.cookieOf(await w.login(mine, PIN), "meowtower_parent");
    const listed = (await (await page(`${mine}; ${session}`)).json()) as {
      devices: { current: boolean }[];
    };
    expect(listed.devices).toHaveLength(2);
    expect(listed.devices.filter((d) => d.current)).toHaveLength(1);
    // The session belongs to the device that opened it.
    expect((await page(`${other}; ${session}`)).status).toBe(401);
  });
});

describe("REQ-2520: a revoked device gets 401 device_revoked on every request", () => {
  it("refuses the revoked device and keeps the parent's device", async () => {
    const w = await world();
    await w.setPin(PIN);
    const parent = w.device();
    const tablet = w.device();
    const session = w.cookieOf(await w.login(parent, PIN), "meowtower_parent");
    const { devices } = (await (
      await w.app.request("/api/parent/devices", {
        headers: { cookie: `${parent}; ${session}` },
      })
    ).json()) as { devices: { id: string; current: boolean }[] };
    const target = devices.find((d) => !d.current);
    const res = await w.app.request(
      `/api/parent/devices/${target?.id ?? ""}/revoke`,
      { method: "POST", headers: { cookie: `${parent}; ${session}` } },
    );
    expect(await res.json()).toEqual({ revoked: true });

    for (const [method, path] of [
      ["GET", "/api/device"],
      ["POST", "/api/session/start"],
      ["GET", "/api/session/x/next"],
      ["POST", "/api/parent/login"],
      ["GET", "/api/adventure/current"],
    ] as const) {
      const refused = await w.app.request(path, {
        method,
        headers: { cookie: tablet, "content-type": "application/json" },
        ...(method === "POST" ? { body: "{}" } : {}),
      });
      expect(refused.status, `${method} ${path}`).toBe(401);
      expect(await refused.json()).toEqual({ error: "device_revoked" });
    }
    expect(
      (await w.app.request("/api/device", { headers: { cookie: parent } }))
        .status,
    ).toBe(200);
    expect(
      (
        w.db
          .prepare("SELECT revoked FROM devices WHERE id = ?")
          .get(target?.id) as { revoked: number }
      ).revoked,
    ).toBe(1);
  });

  it("refuses the revoked device on every /api route the app registers", async () => {
    const w = await world();
    const tablet = w.device();
    const id = (
      w.db
        .prepare("SELECT id FROM devices ORDER BY created_at DESC LIMIT 1")
        .get() as { id: string }
    ).id;
    w.db.prepare("UPDATE devices SET revoked = 1 WHERE id = ?").run(id);
    // Every route the app has, read from the router, so a route added later
    // is covered too; pairing is the one /api route that needs no token.
    const routes = w.app.routes.filter(
      (r) =>
        r.path.startsWith("/api/") &&
        r.path !== "/api/*" &&
        r.path !== "/api/pair" &&
        r.method !== "ALL",
    );
    const names = routes.map((r) => `${r.method} ${r.path}`);
    for (const known of [
      "POST /api/session/:id/answer",
      "GET /api/parent/devices",
      "PUT /api/device",
      "GET /api/session/:id/events",
    ])
      expect(names).toContain(known);
    for (const r of routes) {
      const path = r.path.replace(/:\w+/g, "x");
      const refused = await w.app.request(path, {
        method: r.method,
        headers: { cookie: tablet, "content-type": "application/json" },
        ...(r.method === "GET" ? {} : { body: "{}" }),
      });
      expect(refused.status, `${r.method} ${r.path}`).toBe(401);
      expect(await refused.json()).toEqual({ error: "device_revoked" });
    }
    console.log(`revoked: ${routes.length} /api routes refused`);
  });

  it("issues a pairing code from the Parent Room that pairs a device", async () => {
    const w = await world();
    await w.setPin(PIN);
    const parent = w.device();
    const session = w.cookieOf(await w.login(parent, PIN), "meowtower_parent");
    const issued = (await (
      await w.app.request("/api/parent/pair-code", {
        method: "POST",
        headers: { cookie: `${parent}; ${session}` },
      })
    ).json()) as { code: string; expiresAt: string };
    expect(issued.code).toMatch(/^\d{6}$/);
    expect(Date.parse(issued.expiresAt) - w.clock.ms).toBe(5 * 60 * 1000);
    expect((await w.pair(issued.code)).status).toBe(200);
  });
});

describe("REQ-2522: 5 wrong entries in a row lock that kind for 15 minutes", () => {
  it("refuses the sixth pairing attempt, a correct code included, and names when attempts resume", async () => {
    const w = await world();
    await w.setPin(PIN);
    for (let i = 0; i < 5; i++) {
      const res = await w.pair("000000");
      expect(res.status).toBe(403);
    }
    const lockedAt = w.clock.ms;
    const code = issuePairingCode(w.db, w.clock.ms);
    const sixth = await w.pair(code);
    expect(sixth.status).toBe(429);
    expect(await sixth.json()).toEqual({
      error: "pairing_locked",
      retryAt: new Date(lockedAt + LOCK_MS).toISOString(),
    });
    // The PIN's count is untouched: a login still works.
    expect(w.lockout("pin")).toEqual({ wrong: 0, locked_until_ms: 0 });
    expect((await w.login(w.device(), PIN)).status).toBe(200);

    w.clock.ms = lockedAt + LOCK_MS - 1;
    expect((await w.pair(code)).status).toBe(429);
    w.clock.ms = lockedAt + LOCK_MS;
    expect((await w.pair(issuePairingCode(w.db, w.clock.ms))).status).toBe(200);
  });

  it("refuses the sixth PIN, a correct one included, and leaves the pairing count unchanged", async () => {
    const w = await world();
    await w.setPin(PIN);
    const parent = w.device();
    await w.pair("000000");
    const pairing = w.lockout("pairing");
    expect(pairing.wrong).toBe(1);
    for (let i = 0; i < 5; i++)
      expect((await w.login(parent, "0000")).status).toBe(403);
    const lockedAt = w.clock.ms;
    const sixth = await w.login(parent, PIN);
    expect(sixth.status).toBe(429);
    expect(await sixth.json()).toEqual({
      error: "pin_locked",
      retryAt: new Date(lockedAt + LOCK_MS).toISOString(),
    });
    expect(w.lockout("pairing")).toEqual(pairing);
    w.clock.ms = lockedAt + LOCK_MS;
    expect((await w.login(parent, PIN)).status).toBe(200);
  });

  it("returns a kind's count to 0 on a correct entry after 4 wrong ones", async () => {
    const w = await world();
    await w.setPin(PIN);
    const parent = w.device();
    for (let round = 0; round < 2; round++) {
      for (let i = 0; i < 4; i++) await w.login(parent, "0000");
      expect(w.lockout("pin").wrong).toBe(4);
      expect((await w.login(parent, PIN)).status).toBe(200);
      expect(w.lockout("pin").wrong).toBe(0);

      for (let i = 0; i < 4; i++) await w.pair("000000");
      expect(w.lockout("pairing").wrong).toBe(4);
      expect((await w.pair(issuePairingCode(w.db, w.clock.ms))).status).toBe(
        200,
      );
      expect(w.lockout("pairing").wrong).toBe(0);
    }
  });
});

describe("REQ-2440: a parent session ends 30 minutes after its last request", () => {
  it("expires at 30 and 31 minutes, and a request at 29 minutes restarts the 30", async () => {
    const w = await world();
    await w.setPin(PIN);
    const parent = w.device();
    const session = w.cookieOf(await w.login(parent, PIN), "meowtower_parent");
    const page = () =>
      w.app.request("/api/parent/devices", {
        headers: { cookie: `${parent}; ${session}` },
      });
    const minute = 60 * 1000;
    w.clock.ms += 29 * minute;
    expect((await page()).status).toBe(200);
    // 29 + 29 minutes after login, but 29 after the last request.
    w.clock.ms += 29 * minute;
    expect((await page()).status).toBe(200);
    w.clock.ms += 31 * minute;
    const late = await page();
    expect(late.status).toBe(401);
    expect(await late.json()).toEqual({ error: "parent_session_expired" });
    // SPC-0030 puts the end at 30 minutes exactly: 29:59.999 still holds.
    const again0 = w.cookieOf(await w.login(parent, PIN), "meowtower_parent");
    const at = (cookie: string) =>
      w.app.request("/api/parent/devices", {
        headers: { cookie: `${parent}; ${cookie}` },
      });
    w.clock.ms += 30 * minute - 1;
    expect((await at(again0)).status).toBe(200);
    w.clock.ms += 30 * minute;
    expect(await (await at(again0)).json()).toEqual({
      error: "parent_session_expired",
    });
    // The session is gone; a new PIN entry opens another.
    expect(await (await page()).json()).toEqual({
      error: "parent_session_missing",
    });
    const again = w.cookieOf(await w.login(parent, PIN), "meowtower_parent");
    expect(
      (
        await w.app.request("/api/parent/devices", {
          headers: { cookie: `${parent}; ${again}` },
        })
      ).status,
    ).toBe(200);
  });
});

describe("TSK-0390 criterion 2: a parent session cookie on an unpaired device opens nothing", () => {
  it("refuses every parent route with 401", async () => {
    const w = await world();
    await w.setPin(PIN);
    const session = w.cookieOf(
      await w.login(w.device(), PIN),
      "meowtower_parent",
    );
    for (const device of ["", "meowtower_device=not-a-paired-token; "])
      for (const [method, path] of [
        ["GET", "/api/parent/devices"],
        ["GET", "/api/parent/settings"],
        ["PUT", "/api/parent/settings"],
        ["POST", "/api/parent/pair-code"],
      ] as const) {
        const res = await w.app.request(path, {
          method,
          headers: {
            "content-type": "application/json",
            cookie: `${device}${session}`,
          },
          ...(method === "PUT"
            ? { body: JSON.stringify({ threeDayLimit: 5 }) }
            : {}),
        });
        expect(res.status, `${device || "no device"} ${method} ${path}`).toBe(
          401,
        );
      }
    expect(
      w.db
        .prepare(
          "SELECT COUNT(*) AS n FROM events WHERE type = 'settings_changed'",
        )
        .get(),
    ).toEqual({ n: 0 });
  });
});

describe("REQ-0234: the parent sets the three-day limit", () => {
  it("reads 3 by default, and logs each change that the next read returns", async () => {
    const w = await world();
    await w.setPin(PIN);
    const parent = w.device();
    const session = w.cookieOf(await w.login(parent, PIN), "meowtower_parent");
    const cookie = `${parent}; ${session}`;
    const read = async () =>
      (await (
        await w.app.request("/api/parent/settings", { headers: { cookie } })
      ).json()) as { threeDayLimit: number | null };
    const save = (threeDayLimit: unknown) =>
      w.app.request("/api/parent/settings", {
        method: "PUT",
        headers: { "content-type": "application/json", cookie },
        body: JSON.stringify({ threeDayLimit }),
      });
    const logged = () =>
      (
        w.db
          .prepare(
            "SELECT payload FROM events WHERE type = 'settings_changed' ORDER BY seq",
          )
          .all() as { payload: string }[]
      ).map((r) => JSON.parse(r.payload));

    expect(await read()).toEqual({ threeDayLimit: 3 });
    expect((await save(5)).status).toBe(200);
    expect(await read()).toEqual({ threeDayLimit: 5 });
    expect((await save(null)).status).toBe(200);
    expect(await read()).toEqual({ threeDayLimit: null });
    expect(logged()).toEqual([
      { key: "threeDayLimit", value: 5 },
      { key: "threeDayLimit", value: null },
    ]);
    // Anything but a whole number of days from 1 to 7, or off, is refused unlogged.
    for (const bad of [0, 8, 2.5, "5"])
      expect((await save(bad)).status).toBe(400);
    expect(logged()).toHaveLength(2);
    // Without a parent session the settings stay shut.
    expect(
      (
        await w.app.request("/api/parent/settings", {
          headers: { cookie: parent },
        })
      ).status,
    ).toBe(401);
  });
});
