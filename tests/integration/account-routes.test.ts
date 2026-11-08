// REQ-8500, REQ-8502, REQ-8504: a parent signs in with the code from her email, lists and adds the
// profiles of her account, and finds no profile of another account.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, expect, it } from "vitest";
import type { Hono } from "hono";
import type { Mailer } from "../../src/server/accounts/mailer.js";
import { SESSION_IDLE_MS } from "../../src/server/accounts/session.js";
import { openAccounts } from "../../src/server/accounts/store.js";
import { createApp } from "../../src/server/app.js";
import { openDatabase } from "../../src/server/database.js";
import { dropSchema, type Db } from "../../src/server/db/index.js";
import { oncePerRun } from "../helpers/backend.js";

const URL =
  process.env["MEOWTOWER_TEST_DATABASE_URL"] ??
  "postgres://postgres@127.0.0.1:55432/postgres";
const root = mkdtempSync(join(tmpdir(), "meowtower-accounts-"));
const schema = `t_${String(process.pid)}_acr`;
let accounts: Db;
let game: Db;
let app: Hono;
let clock = Date.UTC(2026, 10, 8, 12, 0, 0);
let lastCode = "";
const mailer: Mailer = {
  send: (_to, _subject, text) => {
    lastCode = /\b(\d{6})\b/.exec(text)?.[1] ?? "";
    return Promise.resolve();
  },
};
const created: string[] = [];

beforeAll(async () => {
  accounts = await openAccounts(URL, schema);
  game = await openDatabase(join(root, "game.sqlite"));
  app = await createApp({
    db: game,
    now: () => clock,
    accounts: { db: accounts, url: URL, mailer },
  });
});
afterAll(async () => {
  for (const s of created) await dropSchema(URL, s);
  await accounts.close();
  await game.close();
  await dropSchema(URL, schema);
  rmSync(root, { recursive: true, force: true });
});

const post = (path: string, body: object, cookie = "") =>
  app.request(path, {
    method: "POST",
    headers: { "content-type": "application/json", cookie },
    body: JSON.stringify(body),
  });
const get = (path: string, cookie = "") =>
  app.request(path, { headers: { cookie } });

/** Signs in an address and returns the session cookie. */
async function signIn(email: string): Promise<string> {
  clock += 60_000;
  expect((await post("/api/account/code", { email })).status).toBe(200);
  const res = await post("/api/account/login", { email, code: lastCode });
  expect(res.status).toBe(200);
  const set = res.headers.get("set-cookie") ?? "";
  return set.split(";")[0] ?? "";
}

oncePerRun("the parent's account routes", () => {
  it("needs no paired device, and refuses a request with no session", async () => {
    expect((await get("/api/account/me")).status).toBe(401);
    expect((await post("/api/account/profiles", { label: "x" })).status).toBe(
      401,
    );
  });

  it("signs a parent in with the emailed code and lists her profiles", async () => {
    const cookie = await signIn("mother@example.org");
    const res = await get("/api/account/me", cookie);
    expect(await res.json()).toEqual({
      email: "mother@example.org",
      profiles: [],
    });
  });

  it("refuses a wrong code and locks the address after five", async () => {
    clock += 60_000;
    await post("/api/account/code", { email: "wrong@example.org" });
    const wrong = lastCode === "000000" ? "111111" : "000000";
    for (let i = 0; i < 4; i++)
      expect(
        (
          await post("/api/account/login", {
            email: "wrong@example.org",
            code: wrong,
          })
        ).status,
      ).toBe(403);
    const fifth = await post("/api/account/login", {
      email: "wrong@example.org",
      code: wrong,
    });
    expect(fifth.status).toBe(429);
    expect(await fifth.json()).toMatchObject({ error: "code_locked" });
  });

  it("adds a profile as a new schema with the game's tables, and lists it", async () => {
    const cookie = await signIn("owner@example.org");
    const made = await post(
      "/api/account/profiles",
      { label: "First" },
      cookie,
    );
    expect(made.status).toBe(201);
    const { id } = (await made.json()) as { id: string };
    const row = (await accounts
      .prepare("SELECT schema_name AS schema FROM profiles WHERE id = ?")
      .get(id)) as { schema: string };
    created.push(row.schema);
    const found = (await accounts
      .prepare(
        "SELECT 1 AS yes FROM information_schema.tables WHERE table_schema = ? AND table_name = 'events'",
      )
      .get(row.schema)) as { yes: number } | undefined;
    expect(found?.yes).toBe(1);
    const me = await (await get("/api/account/me", cookie)).json();
    expect(me).toEqual({
      email: "owner@example.org",
      profiles: [{ id, label: "First" }],
    });
    expect((await get(`/api/account/profiles/${id}`, cookie)).status).toBe(200);
  });

  it("answers 404 for the profile of another account", async () => {
    const first = await signIn("alpha@example.org");
    const made = await post("/api/account/profiles", { label: "Alpha" }, first);
    const { id } = (await made.json()) as { id: string };
    const row = (await accounts
      .prepare("SELECT schema_name AS schema FROM profiles WHERE id = ?")
      .get(id)) as { schema: string };
    created.push(row.schema);
    const second = await signIn("beta@example.org");
    expect((await get(`/api/account/profiles/${id}`, second)).status).toBe(404);
    expect(
      (
        (await (await get("/api/account/me", second)).json()) as {
          profiles: unknown[];
        }
      ).profiles,
    ).toEqual([]);
  });

  it("ends a session on sign-out and after 30 idle days", async () => {
    const cookie = await signIn("gone@example.org");
    expect((await post("/api/account/logout", {}, cookie)).status).toBe(200);
    expect((await get("/api/account/me", cookie)).status).toBe(401);

    const idle = await signIn("idle@example.org");
    clock += SESSION_IDLE_MS;
    expect((await get("/api/account/me", idle)).status).toBe(401);
  });

  it("refuses a malformed request without a code", async () => {
    expect(
      (await post("/api/account/code", { email: "no address" })).status,
    ).toBe(400);
    expect(
      (await post("/api/account/login", { email: "a@b.org", code: "12" }))
        .status,
    ).toBe(400);
  });
});
