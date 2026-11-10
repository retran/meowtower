// ADR-3280: the studio's routes need the parent's session, build and edit the story levels, move a
// node through its statuses, keep the libraries and show the jobs.
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
import { startJob } from "../../src/server/studio/store.js";

const root = mkdtempSync(join(tmpdir(), "meowtower-studio-routes-"));
const PIN = "4821";
const json = { "content-type": "application/json" };
let db: Db;
let app: Hono;
let parentCookie = "";
let deviceCookie = "";

const cookieOf = (res: Response, name: string): string =>
  (res.headers.get("set-cookie") ?? "")
    .split(/,(?=\s*\w+=)/)
    .map((c) => c.trim().split(";")[0] ?? "")
    .find((c) => c.startsWith(`${name}=`)) ?? "";

beforeAll(async () => {
  db = await openDatabase(join(root, "studio-routes.sqlite"));
  const now = () => Date.parse("2026-11-10T12:00:00Z");
  app = await createApp({ db, now });
  const mac = createParentApp({ db, now });
  await mac.request("/pin", {
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
  rmSync(root, { recursive: true, force: true });
});

const call = (
  method: string,
  path: string,
  body?: object,
  cookie = parentCookie,
) =>
  app.request(`/api/parent/studio${path}`, {
    method,
    headers: { ...json, cookie },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

it("needs the parent's session for every route", async () => {
  expect((await call("GET", "/nodes", undefined, deviceCookie)).status).toBe(
    401,
  );
  expect(
    (
      await call(
        "POST",
        "/library",
        { kind: "fact", name: "x", body: "y" },
        deviceCookie,
      )
    ).status,
  ).toBe(401);
  expect((await call("GET", "/jobs", undefined, "")).status).toBe(401);
});

it("builds a campaign and an arc, edits the arc and reads its versions", async () => {
  const made = await call("POST", "/nodes", {
    level: "campaign",
    parentId: null,
    title: "The year",
    body: {},
  });
  expect(made.status).toBe(201);
  const campaign = (await made.json()) as { id: string };
  const arcRes = await call("POST", "/nodes", {
    level: "arc",
    parentId: campaign.id,
    title: "Bridge",
    body: { n: 1 },
  });
  const arc = (await arcRes.json()) as { id: string };
  expect(
    (await (await call("GET", `/nodes?parent=${campaign.id}`)).json()) as {
      nodes: { id: string }[];
    },
  ).toMatchObject({ nodes: [{ id: arc.id }] });
  const edit = await call("PUT", `/nodes/${arc.id}`, {
    body: { n: 2 },
    prompt: "again",
  });
  expect(((await edit.json()) as { version: number }).version).toBe(2);
  const versions = (await (
    await call("GET", `/nodes/${arc.id}/versions`)
  ).json()) as { versions: { version: number }[] };
  expect(versions.versions.map((v) => v.version)).toEqual([1, 2]);
  expect(
    (
      (await (await call("GET", `/nodes/${arc.id}/versions/1`)).json()) as {
        body: unknown;
      }
    ).body,
  ).toEqual({ n: 1 });
  expect((await call("GET", `/nodes/${arc.id}/versions/9`)).status).toBe(404);
  const shown = (await (await call("GET", `/nodes/${arc.id}`)).json()) as {
    node: { status: string };
    body: unknown;
  };
  expect(shown).toMatchObject({ node: { status: "draft" }, body: { n: 2 } });
});

it("refuses a node in the wrong place and a status that may not follow", async () => {
  const bad = await call("POST", "/nodes", {
    level: "adventure",
    parentId: null,
    title: "x",
    body: {},
  });
  expect(bad.status).toBe(400);
  expect(await bad.json()).toMatchObject({ error: "studio_refused" });
  expect(
    (await call("POST", "/nodes", { level: "arc", extra: 1 })).status,
  ).toBe(400);
  const campaign = (await (
    await call("POST", "/nodes", {
      level: "campaign",
      parentId: null,
      title: "S",
      body: {},
    })
  ).json()) as { id: string };
  const arc = (await (
    await call("POST", "/nodes", {
      level: "arc",
      parentId: campaign.id,
      title: "A",
      body: {},
    })
  ).json()) as { id: string };
  expect(
    (await call("POST", `/nodes/${arc.id}/status`, { status: "played" }))
      .status,
  ).toBe(400);
  const approved = await call("POST", `/nodes/${arc.id}/status`, {
    status: "approved",
  });
  expect(((await approved.json()) as { status: string }).status).toBe(
    "approved",
  );
  expect((await call("GET", "/nodes/missing")).status).toBe(404);
});

it("keeps a library, shows where an entry is used, and lists the jobs", async () => {
  const campaign = (await (
    await call("POST", "/nodes", {
      level: "campaign",
      parentId: null,
      title: "L",
      body: {},
    })
  ).json()) as { id: string };
  const entry = (await (
    await call("POST", "/library", {
      kind: "character",
      name: "Keeper",
      body: "old",
    })
  ).json()) as { id: string };
  expect(
    (
      await call("PUT", `/library/${entry.id}`, {
        name: "Keeper",
        body: "older",
      })
    ).status,
  ).toBe(200);
  await call("POST", `/library/${entry.id}/uses`, { nodeId: campaign.id });
  const shown = (await (await call("GET", `/library/${entry.id}`)).json()) as {
    entry: { version: number };
    uses: { title: string }[];
  };
  expect(shown.entry.version).toBe(2);
  expect(shown.uses.map((u) => u.title)).toEqual(["L"]);
  const list = (await (
    await call("GET", "/library?kind=character")
  ).json()) as { entries: { id: string }[] };
  expect(list.entries.map((e) => e.id)).toContain(entry.id);
  const gone = (await (
    await call("DELETE", `/library/${entry.id}/uses/${campaign.id}`)
  ).json()) as { uses: unknown[] };
  expect(gone.uses).toEqual([]);

  const job = await startJob(
    db,
    Date.parse("2026-11-10T12:00:00Z"),
    "generate_arcs",
    campaign.id,
  );
  const jobs = (await (
    await call("GET", `/jobs?node=${campaign.id}`)
  ).json()) as { jobs: { id: string; state: string }[] };
  expect(jobs.jobs).toEqual([
    expect.objectContaining({ id: job.id, state: "queued" }),
  ]);
  expect(
    (
      (await (await call("GET", `/jobs/${job.id}`)).json()) as {
        progress: number;
      }
    ).progress,
  ).toBe(0);
});
