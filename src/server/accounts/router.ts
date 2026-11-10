// One listener, many profiles (ADR-3320, REQ-8508, REQ-8512). The first profile keeps its device
// cookie as it is; a device paired to another profile carries `<profile id>.<token>`, and the root
// strips the prefix before the profile's own app sees the cookie and puts it back on the cookie the
// app sets. A device reaches its profile's app and no other: a prefix naming another profile finds
// no such token there.
import type { Hono } from "hono";
import { Hono as HonoApp } from "hono";
import { openProfile } from "../database.js";
import type { Db } from "../db/index.js";
import { CODE_LIFETIME_MS } from "../devices.js";
import { DEVICE_COOKIE } from "../devices.js";
import { type AccountsEnv, mountAccounts } from "./routes.js";

export interface RootOptions {
  /** The first profile's app, which serves a device whose cookie has no prefix. */
  readonly first: Hono;
  /** The schema of the first profile, so a claim of it keeps one app and one lease. */
  readonly firstSchema?: string;
  readonly accounts: AccountsEnv;
  /** Builds the app of a profile from its database. */
  readonly appFor: (db: Db) => Promise<Hono>;
  readonly now: () => number;
}

const PREFIXED = /^([0-9a-f-]{36})\.(.+)$/;

/** The profile id and the token a device cookie value carries; no prefix is the first profile. */
export function splitCookie(value: string | undefined): {
  profileId: string | null;
  token: string | undefined;
} {
  const m = value ? PREFIXED.exec(value) : null;
  return m
    ? { profileId: m[1] as string, token: m[2] as string }
    : { profileId: null, token: value };
}

function cookieValue(header: string | null, name: string): string | undefined {
  for (const part of (header ?? "").split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return undefined;
}

/** The request with its device cookie rewritten to the bare token. */
function withToken(req: Request, token: string | undefined): Request {
  const headers = new Headers(req.headers);
  const rest = (headers.get("cookie") ?? "")
    .split(";")
    .map((p) => p.trim())
    .filter((p) => p !== "" && !p.startsWith(`${DEVICE_COOKIE}=`));
  if (token !== undefined) rest.push(`${DEVICE_COOKIE}=${token}`);
  if (rest.length > 0) headers.set("cookie", rest.join("; "));
  else headers.delete("cookie");
  return new Request(req, { headers });
}

/** The response with the device cookie it sets prefixed by the profile, so the browser keeps it. */
function withPrefix(res: Response, profileId: string): Response {
  const cookies = res.headers.getSetCookie();
  if (!cookies.some((c) => c.startsWith(`${DEVICE_COOKIE}=`))) return res;
  const headers = new Headers(res.headers);
  headers.delete("set-cookie");
  for (const c of cookies)
    headers.append(
      "set-cookie",
      c.startsWith(`${DEVICE_COOKIE}=`)
        ? `${DEVICE_COOKIE}=${profileId}.${c.slice(DEVICE_COOKIE.length + 1)}`
        : c,
    );
  return new Response(res.body, { status: res.status, headers });
}

export function createRoot(o: RootOptions): Hono {
  const root = new HonoApp();
  mountAccounts(root, o.accounts, o.now);
  const apps = new Map<string, Promise<Hono | null>>();

  /** The app of a profile, opened once; null for an id no account owns. */
  const appOf = (profileId: string): Promise<Hono | null> => {
    let found = apps.get(profileId);
    if (!found) {
      found = (async () => {
        const row = (await o.accounts.db
          .prepare("SELECT schema_name AS schema FROM profiles WHERE id = ?")
          .get(profileId)) as { schema: string } | undefined;
        if (!row) return null;
        // The claimed first profile is served by the app that already runs it.
        if (row.schema === o.firstSchema) return o.first;
        return await o.appFor(await openProfile(o.accounts.url, row.schema));
      })();
      apps.set(profileId, found);
    }
    return found;
  };

  const unknown = (): Response =>
    Response.json({ error: "device_token_missing" }, { status: 401 });

  root.all("*", async (c) => {
    const req = c.req.raw;
    let profileId: string | null;
    let token: string | undefined;
    if (c.req.path === "/api/pair" && c.req.method === "POST") {
      // A code names its profile; a code no profile issued goes to the first, which refuses it.
      const body = (await req
        .clone()
        .json()
        .catch(() => null)) as {
        code?: unknown;
      } | null;
      const code = typeof body?.code === "string" ? body.code : "";
      const row = (await o.accounts.db
        .prepare(
          "SELECT profile_id AS id FROM device_codes WHERE code = ? AND issued_at_ms > ?",
        )
        .get(code, o.now() - CODE_LIFETIME_MS)) as { id: string } | undefined;
      profileId = row?.id ?? null;
      token = undefined;
    } else {
      ({ profileId, token } = splitCookie(
        cookieValue(req.headers.get("cookie"), DEVICE_COOKIE),
      ));
    }
    if (profileId === null) return await o.first.fetch(withToken(req, token));
    const app = await appOf(profileId);
    if (!app) return unknown();
    return withPrefix(await app.fetch(withToken(req, token)), profileId);
  });
  return root;
}
