// REQ-8280, REQ-8282 (ADR-3420): the parent writes the child's profile in the settings, a name she listed for
// the egress guard is refused, and the writer and the Master receive the profile.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, expect, it } from "vitest";
import type { Hono } from "hono";
import { createApp } from "../../src/server/app.js";
import { openDatabase } from "../../src/server/database.js";
import type { Db } from "../../src/server/db/index.js";
import { registerDevice } from "../../src/server/devices.js";
import { createParentApp } from "../../src/server/parent.js";
import type { AdventureWriter } from "../../src/server/studio/generate.js";

const root = mkdtempSync(join(tmpdir(), "meowtower-profile-"));
const PIN = "4821";
const json = { "content-type": "application/json" };
let db: Db;
let app: Hono;
let cookie = "";
const previous = process.env["MEOWTOWER_EGRESS_NAMES"];
let asked: Parameters<AdventureWriter>[0] | null = null;

const cookieOf = (res: Response, name: string): string =>
  (res.headers.get("set-cookie") ?? "")
    .split(/,(?=\s*\w+=)/)
    .map((c) => c.trim().split(";")[0] ?? "")
    .find((c) => c.startsWith(`${name}=`)) ?? "";

beforeAll(async () => {
  db = await openDatabase(join(root, "profile.sqlite"));
  const now = () => Date.parse("2026-11-10T12:00:00Z");
  app = await createApp({
    db,
    now,
    generator: (ask) => {
      asked = ask;
      return Promise.resolve({
        plan: { logline: "l", synopsis: "s", treatment: "t", beats: [] },
      });
    },
  });
  await createParentApp({ db, now }).request("/pin", {
    method: "POST",
    headers: json,
    body: JSON.stringify({ pin: PIN }),
  });
  const device = `meowtower_device=${await registerDevice(db, "computer")}`;
  const login = await app.request("/api/parent/login", {
    method: "POST",
    headers: { ...json, cookie: device },
    body: JSON.stringify({ pin: PIN }),
  });
  cookie = `${device}; ${cookieOf(login, "meowtower_parent")}`;
});
afterAll(async () => {
  await db.close();
  rmSync(root, { recursive: true, force: true });
  if (previous === undefined) delete process.env["MEOWTOWER_EGRESS_NAMES"];
  else process.env["MEOWTOWER_EGRESS_NAMES"] = previous;
});

const put = (body: object) =>
  app.request("/api/parent/settings", {
    method: "PUT",
    headers: { ...json, cookie },
    body: JSON.stringify(body),
  });
const settings = async () =>
  (await (
    await app.request("/api/parent/settings", { headers: { cookie } })
  ).json()) as { profile: string };

it("REQ-8280: keeps the profile the parent writes, and starts with none", async () => {
  expect((await settings()).profile).toBe("");
  const saved = await put({ profile: "Loves cats, the canal and riddles." });
  expect(saved.status).toBe(200);
  expect((await settings()).profile).toBe("Loves cats, the canal and riddles.");
});

it("REQ-8282: refuses a profile with a name she listed, and one that is too long", async () => {
  process.env["MEOWTOWER_EGRESS_NAMES"] = "Marta, Springfield School";
  const named = await put({ profile: "Her friend Marta lives nearby." });
  expect(named.status).toBe(400);
  expect(await named.json()).toEqual({
    error: "profile_refused",
    reason: "name",
    held: "Marta",
  });
  const long = await put({ profile: "x".repeat(2001) });
  expect(long.status).toBe(400);
  expect(((await long.json()) as { reason: string }).reason).toBe("too_long");
  // What was saved before stays.
  expect((await settings()).profile).toBe("Loves cats, the canal and riddles.");
});

it("REQ-8280: gives the profile to the writer of a generation", async () => {
  const made = async (level: string, parentId: string | null, title: string) =>
    (await (
      await app.request("/api/parent/studio/nodes", {
        method: "POST",
        headers: { ...json, cookie },
        body: JSON.stringify({ level, parentId, title, body: {} }),
      })
    ).json()) as { id: string };
  const campaign = await made("campaign", null, "profile campaign");
  const arc = await made("arc", campaign.id, "profile arc");
  const adventure = await made("adventure", arc.id, "profile adventure");
  const res = await app.request(
    `/api/parent/studio/nodes/${adventure.id}/generate`,
    {
      method: "POST",
      headers: { ...json, cookie },
      body: JSON.stringify({ prompt: "autumn fog" }),
    },
  );
  expect(res.status).toBe(202);
  for (let i = 0; i < 100 && asked === null; i += 1)
    await new Promise((r) => setTimeout(r, 20));
  expect(asked?.profile).toBe("Loves cats, the canal and riddles.");
});
