// REQ-8288 (ADR-3280): the parent sets any game state in the sandbox through the studio's lever route,
// each lever lands in the sandbox and never in her game, and the route needs the parent.
import { afterAll, beforeAll, expect, it } from "vitest";
import type { Hono } from "hono";
import { createApp } from "../../src/server/app.js";
import { openProfile } from "../../src/server/database.js";
import { dropSchema, type Db } from "../../src/server/db/index.js";
import { registerDevice } from "../../src/server/devices.js";
import { createParentApp } from "../../src/server/parent.js";
import { parentSettings } from "../../src/server/parent-room.js";
import {
  openPostgresIfExists,
  sandboxSchemaOf,
} from "../../src/server/sandbox/sandbox.js";
import { onlyOnPostgres } from "../helpers/backend.js";

const URL =
  process.env["MEOWTOWER_TEST_DATABASE_URL"] ??
  "postgres://postgres@127.0.0.1:55432/postgres";
const schema = `t_${String(process.pid)}_sbxlev`;
const PIN = "4821";
const json = { "content-type": "application/json" };
let db: Db;
let app: Hono;
let parentCookie = "";
let deviceCookie = "";
const previous = process.env["MEOWTOWER_DATABASE_URL"];

const cookieOf = (res: Response, name: string): string =>
  (res.headers.get("set-cookie") ?? "")
    .split(/,(?=\s*\w+=)/)
    .map((c) => c.trim().split(";")[0] ?? "")
    .find((c) => c.startsWith(`${name}=`)) ?? "";

beforeAll(async () => {
  process.env["MEOWTOWER_DATABASE_URL"] = URL;
  db = await openProfile(URL, schema);
  const now = () => Date.parse("2026-11-10T12:00:00Z");
  app = await createApp({ db, now });
  await createParentApp({ db, now }).request("/pin", {
    method: "POST",
    headers: json,
    body: JSON.stringify({ pin: PIN }),
  });
  deviceCookie = `meowtower_device=${await registerDevice(db, "computer")}`;
  const login = await app.request("/api/parent/login", {
    method: "POST",
    headers: { ...json, cookie: deviceCookie },
    body: JSON.stringify({ pin: PIN }),
  });
  parentCookie = `${deviceCookie}; ${cookieOf(login, "meowtower_parent")}`;
});
afterAll(async () => {
  await db.close();
  await dropSchema(URL, schema);
  await dropSchema(URL, sandboxSchemaOf(schema));
  if (previous === undefined) delete process.env["MEOWTOWER_DATABASE_URL"];
  else process.env["MEOWTOWER_DATABASE_URL"] = previous;
});

const lever = (body: object, cookie = parentCookie) =>
  app.request("/api/parent/studio/sandbox/levers", {
    method: "POST",
    headers: { ...json, cookie },
    body: JSON.stringify(body),
  });

const one = async (d: Db, sql: string, ...args: unknown[]) =>
  (await d.prepare(sql).get(...args)) as Record<string, unknown> | undefined;

onlyOnPostgres("the sandbox's state levers", () => {
  it("answers 409 with no sandbox, 401 without the parent and 400 for a bad lever", async () => {
    await dropSchema(URL, sandboxSchemaOf(schema));
    expect((await lever({ kind: "rank", rank: "B" })).status).toBe(409);
    await app.request("/api/parent/studio/sandbox/reset", {
      method: "POST",
      headers: { ...json, cookie: parentCookie },
      body: JSON.stringify({ from: "empty" }),
    });
    expect(
      (await lever({ kind: "rank", rank: "B" }, deviceCookie)).status,
    ).toBe(401);
    expect((await lever({ kind: "rank", rank: "Z" })).status).toBe(400);
    expect((await lever({ kind: "nope" })).status).toBe(400);
  });

  it("sets each state in the sandbox and leaves her game as it was", async () => {
    await app.request("/api/parent/studio/sandbox/reset", {
      method: "POST",
      headers: { ...json, cookie: parentCookie },
      body: JSON.stringify({ from: "empty" }),
    });
    const before = await parentSettings(db);
    const events = Number(
      (await one(db, "SELECT count(*) AS n FROM events"))?.["n"],
    );
    for (const body of [
      { kind: "language", value: "nl" },
      { kind: "gender", value: "m" },
      { kind: "creepiness", value: 2 },
      { kind: "friendship", familiarId: "f1", points: 12, level: 3 },
      { kind: "item", rewardId: "star", rewardKind: "star", amount: 5 },
      { kind: "nodeLevel", node: "N1", level: 4 },
      { kind: "rank", rank: "B" },
    ])
      expect((await lever(body)).status, JSON.stringify(body)).toBe(200);

    const sandbox = await openPostgresIfExists(URL, sandboxSchemaOf(schema));
    if (!sandbox) throw new Error("no sandbox");
    try {
      expect(await parentSettings(sandbox)).toMatchObject({
        language: "nl",
        gender: "m",
        creepiness: 2,
      });
      const types = (await sandbox
        .prepare("SELECT type FROM events ORDER BY seq")
        .all()) as { type: string }[];
      expect(types.map((t) => t.type)).toEqual(
        expect.arrayContaining(["familiar_friendship", "reward_granted"]),
      );
      expect(
        (
          await one(
            sandbox,
            "SELECT level FROM node_levels WHERE node = ?",
            "N1",
          )
        )?.["level"],
      ).toBe(4);
      expect(
        (await one(sandbox, "SELECT rank FROM rank_state"))?.["rank"],
      ).toBe("B");
    } finally {
      await sandbox.close();
    }
    expect(await parentSettings(db)).toEqual(before);
    expect(
      Number((await one(db, "SELECT count(*) AS n FROM events"))?.["n"]),
    ).toBe(events);
  });
});
