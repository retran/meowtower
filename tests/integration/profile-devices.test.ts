// REQ-8508, REQ-8512: a child's device pairs through a code the profile issued, reaches that profile
// and no other, and takes no email or password.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, expect, it } from "vitest";
import type { Hono } from "hono";
import type { Mailer } from "../../src/server/accounts/mailer.js";
import { createRoot } from "../../src/server/accounts/router.js";
import { openAccounts } from "../../src/server/accounts/store.js";
import { createApp } from "../../src/server/app.js";
import { openDatabase, openProfile } from "../../src/server/database.js";
import { dropSchema, type Db } from "../../src/server/db/index.js";
import { registerDevice } from "../../src/server/devices.js";
import { oncePerRun } from "../helpers/backend.js";

const URL =
  process.env["MEOWTOWER_TEST_DATABASE_URL"] ??
  "postgres://postgres@127.0.0.1:55432/postgres";
const root = mkdtempSync(join(tmpdir(), "meowtower-devices-"));
const schema = `t_${String(process.pid)}_dev`;
const opened: Db[] = [];
const made: string[] = [];
let accounts: Db;
let first: Db;
let app: Hono;
let clock = Date.UTC(2026, 10, 8, 12, 0, 0);
let lastCode = "";
const mailer: Mailer = {
  send: (_to, _s, text) => {
    lastCode = /\b(\d{6})\b/.exec(text)?.[1] ?? "";
    return Promise.resolve();
  },
};

beforeAll(async () => {
  accounts = await openAccounts(URL, schema);
  first = await openDatabase(join(root, "first.sqlite"));
  const firstApp = await createApp({ db: first, now: () => clock });
  app = createRoot({
    first: firstApp,
    accounts: { db: accounts, url: URL, mailer },
    appFor: (d) => {
      opened.push(d);
      return createApp({ db: d, now: () => clock });
    },
    now: () => clock,
  });
});
afterAll(async () => {
  for (const d of opened) await d.close();
  for (const s of made) await dropSchema(URL, s);
  await accounts.close();
  await first.close();
  await dropSchema(URL, schema);
  rmSync(root, { recursive: true, force: true });
});

const call = (
  method: string,
  path: string,
  body: object | null = null,
  cookie = "",
) =>
  app.request(path, {
    method,
    headers: { "content-type": "application/json", cookie },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

async function parentCookie(email: string): Promise<string> {
  clock += 60_000;
  await call("POST", "/api/account/code", { email });
  const res = await call("POST", "/api/account/login", {
    email,
    code: lastCode,
  });
  return (res.headers.get("set-cookie") ?? "").split(";")[0] ?? "";
}
async function addProfile(cookie: string, label: string): Promise<string> {
  const res = await call("POST", "/api/account/profiles", { label }, cookie);
  const { id } = (await res.json()) as { id: string };
  const row = (await accounts
    .prepare("SELECT schema_name AS schema FROM profiles WHERE id = ?")
    .get(id)) as { schema: string };
  made.push(row.schema);
  return id;
}
/** Pairs a device to a profile through the code its Parent Room issued; returns the device cookie. */
async function pair(cookie: string, profileId: string): Promise<string> {
  const issued = await call(
    "POST",
    `/api/account/profiles/${profileId}/pair-code`,
    {},
    cookie,
  );
  expect(issued.status).toBe(200);
  const { code } = (await issued.json()) as { code: string };
  const paired = await call("POST", "/api/pair", { code, kind: "tablet" });
  expect(paired.status).toBe(200);
  return (paired.headers.get("set-cookie") ?? "").split(";")[0] ?? "";
}

oncePerRun("a child's device and the profile it belongs to", () => {
  it("pairs through a profile's code, and the cookie names that profile", async () => {
    const parent = await parentCookie("devices@example.org");
    const a = await addProfile(parent, "A");
    const device = await pair(parent, a);
    expect(device).toMatch(new RegExp(`^meowtower_device=${a}\\.`));
    const me = await call("GET", "/api/device", null, device);
    expect(me.status).toBe(200);
    expect(await me.json()).toEqual({ kind: "tablet" });
  });

  it("keeps a device out of another profile, even with a prefix that names it", async () => {
    const parent = await parentCookie("two@example.org");
    const a = await addProfile(parent, "A");
    const b = await addProfile(parent, "B");
    const deviceA = await pair(parent, a);
    const token = deviceA.split(".").slice(1).join(".");
    const forged = `meowtower_device=${b}.${token}`;
    expect((await call("GET", "/api/device", null, forged)).status).toBe(401);
    // And the play route of B answers 401 to A's device, while A's own answers.
    expect(
      (
        await call(
          "POST",
          "/api/session/start",
          { mode: "daily", clientSeq: 1 },
          forged,
        )
      ).status,
    ).toBe(401);
    const own = await call(
      "POST",
      "/api/session/start",
      { mode: "daily", clientSeq: 1 },
      deviceA,
    );
    expect(own.status).toBe(200);
    // Only A's schema holds the session.
    const count = async (id: string): Promise<number> => {
      const row = (await accounts
        .prepare("SELECT schema_name AS schema FROM profiles WHERE id = ?")
        .get(id)) as { schema: string };
      const db = await openProfile(URL, row.schema);
      try {
        return Number(
          (
            (await db.prepare("SELECT count(*) AS n FROM events").get()) as {
              n: number;
            }
          ).n,
        );
      } finally {
        await db.close();
      }
    };
    expect(await count(a)).toBeGreaterThan(0);
    expect(await count(b)).toBe(0);
  });

  it("keeps a device of the first profile as it was", async () => {
    const token = await registerDevice(first, "tablet");
    const res = await call(
      "GET",
      "/api/device",
      null,
      `meowtower_device=${token}`,
    );
    expect(res.status).toBe(200);
  });

  it("accepts no email, no password and no used or unknown code from a device", async () => {
    expect(
      (
        await call("POST", "/api/pair", {
          code: "123456",
          kind: "tablet",
          email: "x@y.org",
        })
      ).status,
    ).toBe(403);
    expect(
      (
        await call("POST", "/api/pair", {
          code: "123456",
          kind: "tablet",
          password: "x",
        })
      ).status,
    ).toBe(403);
    const parent = await parentCookie("once@example.org");
    const id = await addProfile(parent, "Once");
    const issued = await call(
      "POST",
      `/api/account/profiles/${id}/pair-code`,
      {},
      parent,
    );
    const { code } = (await issued.json()) as { code: string };
    expect(
      (await call("POST", "/api/pair", { code, kind: "tablet" })).status,
    ).toBe(200);
    expect(
      (await call("POST", "/api/pair", { code, kind: "tablet" })).status,
    ).toBe(403);
  });

  it("refuses a pairing code to a parent who does not own the profile", async () => {
    const owner = await parentCookie("owner2@example.org");
    const id = await addProfile(owner, "Owned");
    const other = await parentCookie("other2@example.org");
    expect(
      (await call("POST", `/api/account/profiles/${id}/pair-code`, {}, other))
        .status,
    ).toBe(404);
  });
});
