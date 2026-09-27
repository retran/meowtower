// The Parent Room's routes on the game listener (TSK-0050): the PIN login
// and the devices page, where the parent revokes a device and issues a
// pairing code. Every route needs a paired device, which the /api middleware
// checks, and all but the login need a parent session opened on that device.
import type { Context, Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { z } from "zod";
import type { Db } from "./database.js";
import {
  CODE_LIFETIME_MS,
  DEVICE_COOKIE,
  deviceForToken,
  issuePairingCode,
  listDevices,
  revokeDevice,
} from "./devices.js";
import {
  attempt,
  ParentSessions,
  pinIsSet,
  pinMatches,
} from "./parent-access.js";

export const PARENT_COOKIE = "meowtower_parent";

const LoginIn = z.object({ pin: z.string() }).strict();

export function mountParentRoom(
  app: Hono,
  db: Db,
  now: () => number,
  sessions = new ParentSessions(),
): void {
  const deviceOf = (c: Context): string | null => {
    const found = deviceForToken(db, getCookie(c, DEVICE_COOKIE));
    return found.ok ? found.deviceId : null;
  };
  /** The calling device when it holds a parent session, or a 401 reply. */
  const parent = (c: Context): string | Response => {
    const deviceId = deviceOf(c);
    if (!deviceId) return c.json({ error: "device_token_missing" }, 401);
    return sessions.holds(getCookie(c, PARENT_COOKIE), deviceId)
      ? deviceId
      : c.json({ error: "parent_session_missing" }, 401);
  };

  app.post("/api/parent/login", async (c) => {
    const deviceId = deviceOf(c);
    if (!deviceId) return c.json({ error: "device_token_missing" }, 401);
    if (!pinIsSet(db)) return c.json({ error: "pin_not_set" }, 409);
    const body = LoginIn.safeParse(await c.req.json().catch(() => null));
    const tried = attempt(
      db,
      "pin",
      now(),
      () => body.success && pinMatches(db, body.data.pin),
    );
    if (tried.result === "locked")
      return c.json(
        { error: "pin_locked", retryAt: new Date(tried.retryAt).toISOString() },
        429,
      );
    if (tried.result === "wrong") return c.json({ error: "pin_invalid" }, 403);
    setCookie(c, PARENT_COOKIE, sessions.open(deviceId), {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      path: "/",
    });
    return c.json({ ok: true });
  });

  app.get("/api/parent/devices", (c) => {
    const deviceId = parent(c);
    if (deviceId instanceof Response) return deviceId;
    return c.json({
      devices: listDevices(db).map((d) => ({
        ...d,
        current: d.id === deviceId,
      })),
    });
  });

  app.post("/api/parent/devices/:id/revoke", (c) => {
    const deviceId = parent(c);
    if (deviceId instanceof Response) return deviceId;
    return revokeDevice(db, c.req.param("id"))
      ? c.json({ revoked: true })
      : c.json({ error: "device_unknown" }, 404);
  });

  // The Parent Room's entry point for a pairing code, beside ./meowtower pair.
  app.post("/api/parent/pair-code", (c) => {
    const deviceId = parent(c);
    if (deviceId instanceof Response) return deviceId;
    const issued = now();
    return c.json({
      code: issuePairingCode(db, issued),
      expiresAt: new Date(issued + CODE_LIFETIME_MS).toISOString(),
    });
  });
}
