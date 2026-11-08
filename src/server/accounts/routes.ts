// The sign-in routes and the profile list (ADR-3320, REQ-8500, REQ-8502, REQ-8504). A parent asks
// for a code by email, signs in with it, and then lists and adds the profiles her account owns. A
// profile of another account answers 404, as if it did not exist.
import { randomUUID } from "node:crypto";
import type { Context, Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import { z } from "zod";
import { openProfile } from "../database.js";
import type { Db } from "../db/index.js";
import type { Mailer } from "./mailer.js";
import {
  ACCOUNT_COOKIE,
  accountForToken,
  createSession,
  revokeSession,
  SESSION_IDLE_MS,
} from "./session.js";
import { type Account, checkCode, issueCode } from "./store.js";

/** What the account routes need: the accounts' database, the Postgres to open profiles in, a mailer. */
export interface AccountsEnv {
  readonly db: Db;
  readonly url: string;
  readonly mailer: Mailer;
}

export interface ProfileRow {
  readonly id: string;
  readonly label: string;
  readonly schema: string;
}

const CodeIn = z.object({ email: z.string().max(254) }).strict();
const LoginIn = z
  .object({ email: z.string().max(254), code: z.string().regex(/^\d{6}$/) })
  .strict();
const ProfileIn = z
  .object({ label: z.string().trim().min(1).max(40) })
  .strict();

/** The profiles an account owns, oldest first. */
export async function profilesOf(
  db: Db,
  accountId: string,
): Promise<ProfileRow[]> {
  return (
    (await db
      .prepare(
        "SELECT id, label, schema_name AS schema FROM profiles WHERE account_id = ? ORDER BY created_at, id",
      )
      .all(accountId)) as ProfileRow[]
  ).map((r) => ({ id: r.id, label: r.label, schema: r.schema }));
}

/** A profile of this account, or null: another account's profile is not found either. */
export async function ownedProfile(
  db: Db,
  accountId: string,
  profileId: string,
): Promise<ProfileRow | null> {
  const row = (await db
    .prepare(
      "SELECT id, label, schema_name AS schema FROM profiles WHERE id = ? AND account_id = ?",
    )
    .get(profileId, accountId)) as ProfileRow | undefined;
  return row ?? null;
}

export function mountAccounts(
  app: Hono,
  env: AccountsEnv,
  now: () => number,
): void {
  /** The signed-in account, or a 401 reply. */
  const signedIn = async (c: Context): Promise<Account | Response> => {
    const account = await accountForToken(
      env.db,
      getCookie(c, ACCOUNT_COOKIE),
      now(),
    );
    return account ?? c.json({ error: "account_session_missing" }, 401);
  };

  app.post("/api/account/code", async (c) => {
    const body = CodeIn.safeParse(await c.req.json().catch(() => null));
    if (!body.success) return c.json({ error: "bad_request" }, 400);
    const sent = await issueCode(env.db, env.mailer, body.data.email, now());
    switch (sent.result) {
      case "sent":
        return c.json({ status: "sent" });
      case "invalid":
        return c.json({ error: "email_invalid" }, 400);
      case "too_soon":
        return c.json({ error: "code_too_soon", retryAt: sent.retryAt }, 429);
      case "locked":
        return c.json({ error: "code_locked", retryAt: sent.retryAt }, 429);
    }
  });

  app.post("/api/account/login", async (c) => {
    const body = LoginIn.safeParse(await c.req.json().catch(() => null));
    if (!body.success) return c.json({ error: "bad_request" }, 400);
    const checked = await checkCode(
      env.db,
      body.data.email,
      body.data.code,
      now(),
    );
    if (checked.result !== "ok") {
      if (checked.result === "locked")
        return c.json({ error: "code_locked", retryAt: checked.retryAt }, 429);
      if (checked.result === "invalid")
        return c.json({ error: "email_invalid" }, 400);
      return c.json(
        { error: checked.result === "wrong" ? "code_invalid" : "code_expired" },
        403,
      );
    }
    setCookie(
      c,
      ACCOUNT_COOKIE,
      await createSession(env.db, checked.account.id, now()),
      {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        path: "/",
        maxAge: SESSION_IDLE_MS / 1000,
      },
    );
    return c.json({ email: checked.account.email });
  });

  app.post("/api/account/logout", async (c) => {
    await revokeSession(env.db, getCookie(c, ACCOUNT_COOKIE));
    deleteCookie(c, ACCOUNT_COOKIE, { path: "/" });
    return c.json({ status: "ok" });
  });

  app.get("/api/account/me", async (c) => {
    const account = await signedIn(c);
    if (account instanceof Response) return account;
    return c.json({
      email: account.email,
      profiles: (await profilesOf(env.db, account.id)).map((p) => ({
        id: p.id,
        label: p.label,
      })),
    });
  });

  // A new profile is a new schema in the game's database, with the game's tables in it.
  app.post("/api/account/profiles", async (c) => {
    const account = await signedIn(c);
    if (account instanceof Response) return account;
    const body = ProfileIn.safeParse(await c.req.json().catch(() => null));
    if (!body.success) return c.json({ error: "bad_request" }, 400);
    const id = randomUUID();
    const schema = `p_${id.replace(/-/g, "").slice(0, 20)}`;
    const profile = await openProfile(env.url, schema);
    await profile.close();
    await env.db
      .prepare(
        "INSERT INTO profiles (id, account_id, label, schema_name, created_at) VALUES (?, ?, ?, ?, ?)",
      )
      .run(
        id,
        account.id,
        body.data.label,
        schema,
        new Date(now()).toISOString(),
      );
    return c.json({ id, label: body.data.label }, 201);
  });

  app.get("/api/account/profiles/:id", async (c) => {
    const account = await signedIn(c);
    if (account instanceof Response) return account;
    const found = await ownedProfile(env.db, account.id, c.req.param("id"));
    return found
      ? c.json({ id: found.id, label: found.label })
      : c.json({ error: "profile_unknown" }, 404);
  });
}
