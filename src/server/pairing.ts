// Pairing and the device token check (TSK-0040, SPC-0010). Every /api route
// except pairing needs a paired device's token; the page, manifest, icon and
// health stay public, so a new device can load the app and pair.
import type { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { z } from "zod";
import type { Db } from "./database.js";
import { DEVICE_COOKIE, deviceForToken, pairDevice } from "./devices.js";

const PairIn = z
  .object({
    code: z.string().regex(/^\d{6}$/),
    kind: z.enum(["tablet", "computer"]),
  })
  .strict();

export function mountPairing(app: Hono, db: Db, now: () => number): void {
  app.use("/api/*", async (c, next) => {
    if (c.req.path === "/api/pair") return next();
    const found = deviceForToken(db, getCookie(c, DEVICE_COOKIE));
    if (!found.ok) return c.json({ error: found.error }, 401);
    return next();
  });

  app.post("/api/pair", async (c) => {
    const body = PairIn.safeParse(await c.req.json().catch(() => null));
    if (!body.success) return c.json({ error: "pairing_code_invalid" }, 403);
    const token = pairDevice(db, body.data.code, body.data.kind, now());
    if (!token) return c.json({ error: "pairing_code_invalid" }, 403);
    // No Expires or Max-Age: the device keeps its access until revoked (REQ-2518).
    setCookie(c, DEVICE_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      path: "/",
    });
    return c.json({ paired: true });
  });
}
