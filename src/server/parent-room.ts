// The Parent Room's routes on the game listener (TSK-0050, TSK-0390): the PIN
// login, the devices page, where the parent revokes a device and issues a
// pairing code, and the settings. Every route needs a paired device, which the
// /api middleware checks, and all but the login need a parent session opened
// on that device and used within the last 30 minutes (REQ-2440).
import type { StudioExtras } from "./studio/extras.js";
import { mountStudio } from "./studio/routes.js";
import { refreshKnowledge } from "../engine/projections/knowledge.js";
import type { Context, Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { z } from "zod";
import { egressNames, profileFault } from "./profile.js";
import { type Lang, setLang, SHIPPED } from "../shared/i18n.js";
import { appendEvents } from "../engine/events/append.js";
import type { Db } from "./database.js";
import { fallsRead } from "./falls.js";
import { dashboard, llmAudit, playAudit } from "./audit.js";
import { noticesDirectory } from "./failures.js";
import { noticeLines } from "./notices.js";
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

/** The rows a log shows unless the parent asks for more, up to 1000. */
const AUDIT_ROWS = 200;

const LoginIn = z.object({ pin: z.string() }).strict();

/**
 * The three-day rule's limit in adventure days, 1 to 7, or null when it is off
 * (REQ-0234). The week's cap is a choice TSK-0390 records.
 */
export const THREE_DAY_DEFAULT = 3;

/** The Parent Room's themes; `auto` follows the device's light or dark setting (REQ-7692). */
export const ROOM_THEMES = ["auto", "light", "dark"] as const;

/** The highest level until the parent chooses another (REQ-7850). */
export const CREEPINESS_DEFAULT = 2;

const SettingsIn = z
  .object({
    threeDayLimit: z
      .union([z.number().int().min(1).max(7), z.null()])
      .optional(),
    language: z.enum(SHIPPED).optional(),
    creepiness: z.union([z.literal(0), z.literal(1), z.literal(2)]).optional(),
    gender: z.enum(["f", "m"]).optional(),
    hideRankFalls: z.boolean().optional(),
    /** The Parent Room's theme: the device's, or the one the parent chose (REQ-7692). */
    roomTheme: z.enum(ROOM_THEMES).optional(),
    /** The child's profile; its length and its names are checked below (REQ-8280, REQ-8282). */
    profile: z.string().optional(),
  })
  .strict();

/** The parent settings as they stand: each setting's latest value, or its default. */
export async function parentSettings(db: Db): Promise<{
  threeDayLimit: number | null;
  language: Lang;
  creepiness: 0 | 1 | 2;
  gender: "f" | "m";
  hideRankFalls: boolean;
  roomTheme: (typeof ROOM_THEMES)[number];
  profile: string;
}> {
  const stored = async (key: string): Promise<{ value: string } | undefined> =>
    (await db.tableExists("parent_settings"))
      ? ((await db
          .prepare("SELECT value FROM parent_settings WHERE key = ?")
          .get(key)) as { value: string } | undefined)
      : undefined;
  const limit = await stored("threeDayLimit");
  const language = await stored("language");
  const creepiness = await stored("creepiness");
  const gender = await stored("gender");
  const hideRankFalls = await stored("hideRankFalls");
  const roomTheme = await stored("roomTheme");
  const profile = await stored("profile");
  return {
    threeDayLimit: limit
      ? (JSON.parse(limit.value) as number | null)
      : THREE_DAY_DEFAULT,
    // Russian until the parent chooses another language.
    language: language ? (JSON.parse(language.value) as Lang) : "ru",
    creepiness: creepiness
      ? (JSON.parse(creepiness.value) as 0 | 1 | 2)
      : CREEPINESS_DEFAULT,
    gender: gender ? (JSON.parse(gender.value) as "f" | "m") : "f",
    // A fall of rank shows to the player until the parent hides it (REQ-8004).
    hideRankFalls: hideRankFalls
      ? (JSON.parse(hideRankFalls.value) as boolean)
      : false,
    // The room follows the device until the parent picks a theme.
    roomTheme: roomTheme
      ? (JSON.parse(roomTheme.value) as (typeof ROOM_THEMES)[number])
      : "auto",
    // The child's profile, which the writer and the Master read; none until the parent writes one.
    profile: profile ? (JSON.parse(profile.value) as string) : "",
  };
}

export async function mountParentRoom(
  app: Hono,
  db: Db,
  now: () => number,
  sessions = new ParentSessions(),
  extras: StudioExtras = {},
): Promise<void> {
  // A closed database still has to answer the health page, so the language stays as it was.
  if (db.open) setLang((await parentSettings(db)).language);
  const deviceOf = async (c: Context): Promise<string | null> => {
    const found = await deviceForToken(db, getCookie(c, DEVICE_COOKIE));
    return found.ok ? found.deviceId : null;
  };
  /** The calling device when it holds a parent session, or a 401 reply. */
  const parent = async (c: Context): Promise<string | Response> => {
    const deviceId = await deviceOf(c);
    if (!deviceId) return c.json({ error: "device_token_missing" }, 401);
    const held = sessions.hold(getCookie(c, PARENT_COOKIE), deviceId, now());
    if (held === "ok") return deviceId;
    return c.json(
      {
        error:
          held === "expired"
            ? "parent_session_expired"
            : "parent_session_missing",
      },
      401,
    );
  };

  app.post("/api/parent/login", async (c) => {
    const deviceId = await deviceOf(c);
    if (!deviceId) return c.json({ error: "device_token_missing" }, 401);
    if (!(await pinIsSet(db))) return c.json({ error: "pin_not_set" }, 409);
    const body = LoginIn.safeParse(await c.req.json().catch(() => null));
    const tried = await attempt(
      db,
      "pin",
      now(),
      async () => body.success && (await pinMatches(db, body.data.pin)),
    );
    if (tried.result === "locked")
      return c.json(
        { error: "pin_locked", retryAt: new Date(tried.retryAt).toISOString() },
        429,
      );
    if (tried.result === "wrong") return c.json({ error: "pin_invalid" }, 403);
    setCookie(c, PARENT_COOKIE, sessions.open(deviceId, now()), {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      path: "/",
    });
    return c.json({ ok: true });
  });

  app.get("/api/parent/devices", async (c) => {
    const deviceId = await parent(c);
    if (deviceId instanceof Response) return deviceId;
    return c.json({
      devices: (await listDevices(db)).map((d) => ({
        ...d,
        current: d.id === deviceId,
      })),
    });
  });

  app.post("/api/parent/devices/:id/revoke", async (c) => {
    const deviceId = await parent(c);
    if (deviceId instanceof Response) return deviceId;
    return (await revokeDevice(db, c.req.param("id")))
      ? c.json({ revoked: true })
      : c.json({ error: "device_unknown" }, 404);
  });

  app.get("/api/parent/settings", async (c) => {
    const deviceId = await parent(c);
    if (deviceId instanceof Response) return deviceId;
    return c.json(await parentSettings(db));
  });

  // Each change logs settings_changed, and the next read returns it (REQ-0234).
  app.get("/api/parent/falls", async (c) => {
    const deviceId = await parent(c);
    if (deviceId instanceof Response) return deviceId;
    return c.json({ falls: await fallsRead(db) });
  });

  app.put("/api/parent/settings", async (c) => {
    const deviceId = await parent(c);
    if (deviceId instanceof Response) return deviceId;
    const body = SettingsIn.safeParse(await c.req.json().catch(() => null));
    if (!body.success) return c.json({ error: "settings_invalid" }, 400);
    // The profile holds no real name or school, and is no longer than its limit (REQ-8282).
    if (body.data.profile !== undefined) {
      const fault = profileFault(body.data.profile, egressNames());
      if (fault)
        return c.json(
          { error: "profile_refused", reason: fault.code, held: fault.held },
          400,
        );
    }
    const origin = { deviceId, clientMs: now() };
    await appendEvents(
      db,
      Object.entries(body.data).map(([key, value]) => ({
        type: "settings_changed",
        v: 1,
        payload: { key, value },
        origin,
      })),
    );
    const settings = await parentSettings(db);
    setLang(settings.language);
    return c.json(settings);
  });

  // the finish-today action: the rest of the game day plays no further task
  // and takes no extension (REQ-2444).
  app.post("/api/parent/finish-today", async (c) => {
    const deviceId = await parent(c);
    if (deviceId instanceof Response) return deviceId;
    await appendEvents(db, [
      {
        type: "finish_today",
        v: 1,
        payload: {},
        origin: { deviceId, clientMs: now() },
      },
    ]);
    return c.json({ status: "ok" });
  });
  // The overview's figures and the parent's notices, which the Mac's loopback page showed before
  // (ADR-3470, REQ-7678).
  app.get("/api/parent/overview", async (c) => {
    const deviceId = await parent(c);
    if (deviceId instanceof Response) return deviceId;
    const d = await dashboard(db, new Date(now()));
    return c.json({
      tasks: d.tasks,
      answered: d.answered,
      correct: d.correct,
      live: d.live,
      calls: d.calls,
      failed: d.failed,
      monthUsd: d.monthUsd,
      notices: noticeLines(noticesDirectory()),
    });
  });
  // The logs: each task played and each model call in full, newest first (REQ-7682, REQ-7650).
  const rows = (raw: string | undefined): number => {
    const n = Number(raw ?? AUDIT_ROWS);
    return Number.isInteger(n) && n > 0 ? Math.min(n, 1000) : AUDIT_ROWS;
  };
  app.get("/api/parent/audit/play", async (c) => {
    const deviceId = await parent(c);
    if (deviceId instanceof Response) return deviceId;
    return c.json(await playAudit(db, rows(c.req.query("limit"))));
  });
  app.get("/api/parent/audit/llm", async (c) => {
    const deviceId = await parent(c);
    if (deviceId instanceof Response) return deviceId;
    return c.json(await llmAudit(db, rows(c.req.query("limit"))));
  });

  // The reset of the statistics (REQ-8386): the log stays append-only, so a reset is an event,
  // and it needs a second press, which the body's `confirm` carries.
  app.post("/api/parent/reset-stats", async (c) => {
    const deviceId = await parent(c);
    if (deviceId instanceof Response) return deviceId;
    const body = (await c.req.json().catch(() => ({}))) as {
      confirm?: unknown;
    };
    if (body.confirm !== true) return c.json({ error: "confirm_needed" }, 400);
    await appendEvents(db, [
      {
        type: "stats_reset",
        v: 1,
        payload: {},
        origin: { deviceId, clientMs: now() },
      },
    ]);
    await refreshKnowledge(db, new Date(now()).toISOString());
    return c.json({ status: "ok" });
  });

  mountStudio(app, db, now, parent, extras);

  // The Parent Room's entry point for a pairing code, beside ./meowtower pair.
  app.post("/api/parent/pair-code", async (c) => {
    const deviceId = await parent(c);
    if (deviceId instanceof Response) return deviceId;
    const issued = now();
    return c.json({
      code: await issuePairingCode(db, issued),
      expiresAt: new Date(issued + CODE_LIFETIME_MS).toISOString(),
    });
  });
}
