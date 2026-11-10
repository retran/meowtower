// REQ-8500: the first profile joins an account when someone at the Mac claims it, and only then;
// after the claim the account lists it, pairs devices to it, and its devices keep their one app.
import { afterAll, beforeAll, expect, it } from "vitest";
import type { Hono } from "hono";
import {
  ClaimRefused,
  claimFirstProfile,
} from "../../src/server/accounts/claim.js";
import type { Mailer } from "../../src/server/accounts/mailer.js";
import { createRoot } from "../../src/server/accounts/router.js";
import { openAccounts } from "../../src/server/accounts/store.js";
import { createApp } from "../../src/server/app.js";
import { openProfile } from "../../src/server/database.js";
import { dropSchema, type Db } from "../../src/server/db/index.js";
import { oncePerRun } from "../helpers/backend.js";

const URL =
  process.env["MEOWTOWER_TEST_DATABASE_URL"] ??
  "postgres://postgres@127.0.0.1:55432/postgres";
const tag = String(process.pid);
const acct = `t_${tag}_cl0`;
const firstSchema = `t_${tag}_cl1`;
let accounts: Db;
let first: Db;
let app: Hono;
let clock = Date.UTC(2026, 10, 8, 12, 0, 0);
let lastCode = "";
let built = 0;
const mailer: Mailer = {
  send: (_to, _s, text) => {
    lastCode = /\b(\d{6})\b/.exec(text)?.[1] ?? "";
    return Promise.resolve();
  },
};

beforeAll(async () => {
  accounts = await openAccounts(URL, acct);
  first = await openProfile(URL, firstSchema);
  app = createRoot({
    first: await createApp({ db: first, now: () => clock }),
    firstSchema,
    accounts: { db: accounts, url: URL, mailer },
    appFor: async () => {
      built++;
      return await createApp({ db: first, now: () => clock });
    },
    now: () => clock,
  });
});
afterAll(async () => {
  await accounts.close();
  await first.close();
  await dropSchema(URL, acct);
  await dropSchema(URL, firstSchema);
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

oncePerRun("the claim of the first profile", () => {
  it("gives the first profile to an account, which then lists it", async () => {
    const claimed = await claimFirstProfile(
      accounts,
      "Parent@Example.org",
      "Первый",
      firstSchema,
      clock,
    );
    clock += 60_000;
    await call("POST", "/api/account/code", { email: "parent@example.org" });
    const login = await call("POST", "/api/account/login", {
      email: "parent@example.org",
      code: lastCode,
    });
    const cookie = (login.headers.get("set-cookie") ?? "").split(";")[0] ?? "";
    const me = (await (
      await call("GET", "/api/account/me", null, cookie)
    ).json()) as {
      profiles: { id: string; label: string }[];
    };
    expect(me.profiles).toEqual([{ id: claimed.profileId, label: "Первый" }]);
    // The address was made at the claim and verified at this first sign-in.
    const row = (await accounts
      .prepare("SELECT verified_at AS v FROM accounts WHERE id = ?")
      .get(claimed.accountId)) as { v: string | null };
    expect(row.v).not.toBeNull();
  });

  it("returns the same profile for the same address and refuses another address", async () => {
    const again = await claimFirstProfile(
      accounts,
      "parent@example.org",
      "Другое имя",
      firstSchema,
      clock,
    );
    const rows = (await accounts
      .prepare("SELECT count(*) AS n FROM profiles WHERE schema_name = ?")
      .get(firstSchema)) as { n: number };
    expect(rows.n).toBe(1);
    expect(again.profileId).toBeTruthy();
    await expect(
      claimFirstProfile(accounts, "thief@example.org", "X", firstSchema, clock),
    ).rejects.toThrow(ClaimRefused);
    await expect(
      claimFirstProfile(accounts, "no address", "X", firstSchema, clock),
    ).rejects.toThrow("not an email");
  });

  it("pairs a device to the claimed profile through the app that already runs it", async () => {
    clock += 60_000;
    await call("POST", "/api/account/code", { email: "parent@example.org" });
    const login = await call("POST", "/api/account/login", {
      email: "parent@example.org",
      code: lastCode,
    });
    const cookie = (login.headers.get("set-cookie") ?? "").split(";")[0] ?? "";
    const me = (await (
      await call("GET", "/api/account/me", null, cookie)
    ).json()) as {
      profiles: { id: string }[];
    };
    const id = me.profiles[0]?.id ?? "";
    const issued = await call(
      "POST",
      `/api/account/profiles/${id}/pair-code`,
      {},
      cookie,
    );
    const { code } = (await issued.json()) as { code: string };
    const paired = await call("POST", "/api/pair", { code, kind: "tablet" });
    expect(paired.status).toBe(200);
    const device = (paired.headers.get("set-cookie") ?? "").split(";")[0] ?? "";
    expect((await call("GET", "/api/device", null, device)).status).toBe(200);
    // No second app was made for the first profile.
    expect(built).toBe(0);
  });
});
