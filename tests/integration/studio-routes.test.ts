// ADR-3280: the studio's routes need the parent's session, build and edit the story levels, move a
// node through its statuses, keep the libraries and show the jobs.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Hono } from "hono";
import { createApp } from "../../src/server/app.js";
import { openDatabase } from "../../src/server/database.js";
import type { Db } from "../../src/server/db/index.js";
import { registerDevice } from "../../src/server/devices.js";
import { createParentApp } from "../../src/server/parent.js";
import type { AdventureWriter } from "../../src/server/studio/generate.js";
import {
  proposeVersion,
  startJob,
  StudioRefused,
} from "../../src/server/studio/store.js";
import { dropSchema } from "../../src/server/db/index.js";
import { sandboxSchemaOf } from "../../src/server/sandbox/sandbox.js";
import { onlyOnPostgres, onPostgres } from "../helpers/backend.js";

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

it("lists the adventures that have events and reads one adventure's log in order", async () => {
  const started = await app.request("/api/session/start", {
    method: "POST",
    headers: { ...json, cookie: deviceCookie },
    body: JSON.stringify({ mode: "daily", clientSeq: 1 }),
  });
  const { adventureId } = (await started.json()) as { adventureId: string };
  const list = (await (await call("GET", "/logs/adventures")).json()) as {
    adventures: { adventureId: string; events: number }[];
  };
  expect(list.adventures.map((a) => a.adventureId)).toContain(adventureId);
  const log = (await (
    await call("GET", `/logs/adventures/${adventureId}`)
  ).json()) as {
    events: { seq: number; type: string }[];
  };
  expect(log.events.length).toBeGreaterThan(0);
  expect(log.events.map((e) => e.seq)).toEqual(
    [...log.events.map((e) => e.seq)].sort((a, b) => a - b),
  );
  expect((await call("GET", "/logs/adventures/missing")).status).toBe(404);
  expect(
    (await call("GET", "/logs/adventures", undefined, deviceCookie)).status,
  ).toBe(401);
});

it("gives each node of a level the ids it leads to, for the graph's edges", async () => {
  const campaign = (await (
    await call("POST", "/nodes", {
      level: "campaign",
      parentId: null,
      title: "E",
      body: {},
    })
  ).json()) as { id: string };
  const a = (await (
    await call("POST", "/nodes", {
      level: "arc",
      parentId: campaign.id,
      title: "First",
      body: {},
    })
  ).json()) as { id: string };
  const b = (await (
    await call("POST", "/nodes", {
      level: "arc",
      parentId: campaign.id,
      title: "Second",
      body: { links: [] },
    })
  ).json()) as { id: string };
  await call("PUT", `/nodes/${a.id}`, {
    body: { links: [b.id, { to: "ghost" }, 7] },
  });
  const list = (await (
    await call("GET", `/nodes?parent=${campaign.id}`)
  ).json()) as {
    nodes: { id: string; links: string[] }[];
  };
  expect(list.nodes.find((n) => n.id === a.id)?.links).toEqual([b.id, "ghost"]);
  expect(list.nodes.find((n) => n.id === b.id)?.links).toEqual([]);
});

it("answers 409 for the sandbox where the game runs on SQLite", async () => {
  if (onPostgres) return;
  expect((await call("GET", "/sandbox")).status).toBe(409);
  expect((await call("POST", "/sandbox/reset", { from: "empty" })).status).toBe(
    409,
  );
});

onlyOnPostgres("the sandbox routes", () => {
  it("reads the sandbox, makes it from a copy and from nothing, and refuses a bad body", async () => {
    const before = (await (await call("GET", "/sandbox")).json()) as {
      exists: boolean;
      limitUsd: number;
    };
    expect(before.exists).toBe(false);
    const copied = (await (
      await call("POST", "/sandbox/reset", { from: "copy" })
    ).json()) as { exists: boolean };
    expect(copied.exists).toBe(true);
    const empty = (await (
      await call("POST", "/sandbox/reset", { from: "empty" })
    ).json()) as { events: number };
    expect(empty.events).toBe(0);
    expect(
      (await call("POST", "/sandbox/reset", { from: "elsewhere" })).status,
    ).toBe(400);
    expect(
      (await call("GET", "/sandbox", undefined, deviceCookie)).status,
    ).toBe(401);
    await dropSchema(
      process.env["MEOWTOWER_DATABASE_URL"] as string,
      sandboxSchemaOf(db.name),
    );
  });
});

it("lists the templates and opens one for a seed and a language, for the parent only", async () => {
  const list = (await (await call("GET", "/tasks")).json()) as {
    templates: { id: string }[];
  };
  expect(list.templates.length).toBeGreaterThan(100);
  const id = list.templates[0]?.id ?? "";
  const opened = (await (
    await call("GET", `/tasks/${id}?seed=0a&lang=nl`)
  ).json()) as {
    lang: string;
    text: string;
    answer: string;
    seed: string;
  };
  expect(opened).toMatchObject({ lang: "nl", seed: "0a" });
  expect(opened.text.length).toBeGreaterThan(0);
  expect((await call("GET", "/tasks/missing")).status).toBe(404);
  expect(
    (await call("GET", `/tasks/${id}`, undefined, deviceCookie)).status,
  ).toBe(401);
});

it("REQ-8304: serves the checklist to the parent only", async () => {
  expect(
    (await call("GET", "/checklist", undefined, deviceCookie)).status,
  ).toBe(401);
  const res = await call("GET", "/checklist");
  expect(res.status).toBe(200);
  const body = (await res.json()) as {
    features: { id: string; tests: string[]; untested?: string }[];
  };
  expect(body.features.length).toBeGreaterThan(10);
  // A feature names its tests, or says why it has none.
  expect(
    body.features.every(
      (f) => f.tests.length > 0 || (f.untested?.trim() ?? "") !== "",
    ),
  ).toBe(true);
});

it("REQ-8306, REQ-8600: an edit of an encounter is checked before it is stored, and a fault names its field", async () => {
  const make = async (level: string, parentId: string | null, title: string) =>
    (await (
      await call("POST", "/nodes", { level, parentId, title, body: {} })
    ).json()) as { id: string; version: number };
  const campaign = await make("campaign", null, "form campaign");
  const arc = await make("arc", campaign.id, "form arc");
  const adventure = await make("adventure", arc.id, "form adventure");
  const gate = await make("encounter", adventure.id, "Gate");
  const bridge = await make("encounter", adventure.id, "Bridge");

  const refused = await call("PUT", `/nodes/${gate.id}`, {
    body: { exits: [{ when: "she runs", next: "elsewhere" }] },
  });
  expect(refused.status).toBe(400);
  expect(await refused.json()).toEqual({
    error: "edit_refused",
    fault: {
      field: "exits.0.next",
      code: "unknown_encounter",
      held: "elsewhere",
      need: "an encounter of this adventure",
    },
  });
  const unchanged = (await (await call("GET", `/nodes/${gate.id}`)).json()) as {
    node: { version: number };
  };
  expect(unchanged.node.version).toBe(gate.version);

  const kept = await call("PUT", `/nodes/${gate.id}`, {
    body: {
      situation: "A gate in the fog.",
      exits: [{ when: "she opens it", next: bridge.id }],
    },
  });
  expect(kept.status).toBe(200);
  expect(((await kept.json()) as { version: number }).version).toBe(
    gate.version + 1,
  );

  // The other levels keep the edit they had: a body of any shape is stored.
  const loose = await call("PUT", `/nodes/${adventure.id}`, {
    body: { anything: true },
  });
  expect(loose.status).toBe(200);
});

it("REQ-8602: an earlier version is restored as a new version, and every version stays", async () => {
  const make = async (level: string, parentId: string | null, title: string) =>
    (await (
      await call("POST", "/nodes", { level, parentId, title, body: {} })
    ).json()) as { id: string; version: number };
  const campaign = await make("campaign", null, "restore campaign");
  const arc = await make("arc", campaign.id, "restore arc");
  await call("PUT", `/nodes/${arc.id}`, { body: { note: "first" } });
  await call("PUT", `/nodes/${arc.id}`, { body: { note: "second" } });

  const restored = await call("POST", `/nodes/${arc.id}/versions/2/restore`);
  expect(restored.status).toBe(200);
  expect(((await restored.json()) as { version: number }).version).toBe(4);

  const listed = (await (
    await call("GET", `/nodes/${arc.id}/versions`)
  ).json()) as { versions: { version: number; body: unknown }[] };
  expect(listed.versions.map((v) => v.version)).toEqual([1, 2, 3, 4]);
  expect(listed.versions[3]?.body).toEqual({ note: "first" });
  expect(listed.versions[2]?.body).toEqual({ note: "second" });

  // The current version is not restored over itself, and a missing one is unknown.
  const same = await call("POST", `/nodes/${arc.id}/versions/4/restore`);
  expect(same.status).toBe(400);
  expect(await same.json()).toEqual({
    error: "studio_refused",
    reason: "that is the current version",
  });
  expect(
    (await call("POST", `/nodes/${arc.id}/versions/9/restore`)).status,
  ).toBe(404);
  expect((await call("POST", `/nodes/nope/versions/1/restore`)).status).toBe(
    404,
  );
  expect(
    (
      await call(
        "POST",
        `/nodes/${arc.id}/versions/1/restore`,
        undefined,
        deviceCookie,
      )
    ).status,
  ).toBe(401);
});

describe("a generated version waits for the parent", () => {
  const now = Date.parse("2026-11-10T12:00:00Z");
  const arcOf = async (title: string) => {
    const made = async (level: string, parentId: string | null, name: string) =>
      (await (
        await call("POST", "/nodes", { level, parentId, title: name, body: {} })
      ).json()) as { id: string };
    const campaign = await made("campaign", null, `${title} campaign`);
    const arc = await made("arc", campaign.id, `${title} arc`);
    await call("PUT", `/nodes/${arc.id}`, { body: { note: "mine" } });
    return arc.id;
  };
  const read = async (id: string) =>
    (await (await call("GET", `/nodes/${id}`)).json()) as {
      node: { version: number; status: string };
      body: unknown;
    };
  const states = async (id: string) =>
    (
      (await (await call("GET", `/nodes/${id}/versions`)).json()) as {
        versions: { state: string }[];
      }
    ).versions.map((v) => v.state);

  it("REQ-8604: a proposed version is not the current one, and only one waits", async () => {
    const id = await arcOf("wait");
    const waiting = await proposeVersion(
      db,
      now,
      id,
      { note: "generated" },
      {
        prompt: "make it longer",
      },
    );
    expect(waiting.version).toBe(3);
    const seen = await read(id);
    expect(seen.node.version).toBe(2);
    expect(seen.body).toEqual({ note: "mine" });
    expect(await states(id)).toEqual(["history", "current", "pending"]);
    await expect(
      proposeVersion(db, now, id, { note: "another" }, {}),
    ).rejects.toThrow(StudioRefused);
    await expect(
      proposeVersion(db, now, id, { note: "another" }, {}),
    ).rejects.toMatchObject({ reason: "a version already waits" });
  });

  it("REQ-8604: a hand edit while one waits takes the next number and passes the waiting one", async () => {
    const id = await arcOf("pass");
    await proposeVersion(db, now, id, { note: "generated" }, {});
    const edited = await call("PUT", `/nodes/${id}`, {
      body: { note: "later" },
    });
    expect(((await edited.json()) as { version: number }).version).toBe(4);
    expect(await states(id)).toEqual([
      "history",
      "history",
      "history",
      "current",
    ]);
  });

  it("REQ-8604: keeping makes the waiting version the current one, and none waits then", async () => {
    const id = await arcOf("keep");
    await proposeVersion(db, now, id, { note: "generated" }, {});
    const kept = await call("POST", `/nodes/${id}/pending/keep`);
    expect(kept.status).toBe(200);
    const seen = await read(id);
    expect(seen.node.version).toBe(3);
    expect(seen.body).toEqual({ note: "generated" });
    expect(await states(id)).toEqual(["history", "history", "current"]);
    const again = await call("POST", `/nodes/${id}/pending/keep`);
    expect(again.status).toBe(404);
    expect(await again.json()).toEqual({ error: "no_pending_version" });
  });

  it("REQ-8606: a discarded version stays in the history, and another can wait after it", async () => {
    const id = await arcOf("drop");
    await proposeVersion(db, now, id, { note: "generated" }, {});
    const dropped = await call("POST", `/nodes/${id}/pending/discard`);
    expect(dropped.status).toBe(200);
    const seen = await read(id);
    expect(seen.node.version).toBe(2);
    expect(seen.body).toEqual({ note: "mine" });
    expect(await states(id)).toEqual(["history", "current", "discarded"]);
    const next = await proposeVersion(db, now, id, { note: "second" }, {});
    expect(next.version).toBe(4);
    expect(await states(id)).toEqual([
      "history",
      "current",
      "discarded",
      "pending",
    ]);
  });

  it("needs the parent's session to keep or discard", async () => {
    const id = await arcOf("auth");
    await proposeVersion(db, now, id, { note: "generated" }, {});
    for (const action of ["keep", "discard"])
      expect(
        (
          await call(
            "POST",
            `/nodes/${id}/pending/${action}`,
            undefined,
            deviceCookie,
          )
        ).status,
      ).toBe(401);
  });
});

it("REQ-8614: an encounter's exits from the form are the edges of its graph", async () => {
  const make = async (level: string, parentId: string | null, title: string) =>
    (await (
      await call("POST", "/nodes", { level, parentId, title, body: {} })
    ).json()) as { id: string };
  const campaign = await make("campaign", null, "edge campaign");
  const arc = await make("arc", campaign.id, "edge arc");
  const adventure = await make("adventure", arc.id, "edge adventure");
  const gate = await make("encounter", adventure.id, "Gate");
  const bridge = await make("encounter", adventure.id, "Bridge");
  const tower = await make("encounter", adventure.id, "Tower");
  await call("PUT", `/nodes/${gate.id}`, {
    body: {
      exits: [
        { when: "she crosses", next: bridge.id },
        { when: "she climbs", next: tower.id },
        { when: "she crosses again", next: bridge.id },
      ],
    },
  });
  const listed = (await (
    await call("GET", `/nodes?parent=${adventure.id}`)
  ).json()) as { nodes: { id: string; links: string[] }[] };
  const links = listed.nodes.find((n) => n.id === gate.id)?.links ?? [];
  // Each target once, however many exits lead to it.
  expect([...links].sort()).toEqual([bridge.id, tower.id].sort());
  expect(listed.nodes.find((n) => n.id === bridge.id)?.links).toEqual([]);
});

describe("generating a version of an adventure", () => {
  const now = () => Date.parse("2026-11-10T12:00:00Z");
  let generating: Hono;
  let cookie = "";
  let writer: AdventureWriter;
  let release: () => void = () => undefined;
  const fake = (over: Partial<Awaited<ReturnType<AdventureWriter>>> = {}) => ({
    scenario: {
      id: "s1",
      premise: "A fog over the canal",
      logline: "Free the boats",
      encounters: [],
    },
    revisions: 0,
    unresolved: [],
    minor: [],
    ...over,
  });

  beforeAll(async () => {
    generating = await createApp({
      db,
      now,
      generator: (ask) => writer(ask),
    });
    const login = await generating.request("/api/parent/login", {
      method: "POST",
      headers: { ...json, cookie: deviceCookie },
      body: JSON.stringify({ pin: PIN }),
    });
    cookie = `${deviceCookie}; ${cookieOf(login, "meowtower_parent")}`;
  });

  const via = (method: string, path: string, body?: object, to = generating) =>
    to.request(`/api/parent/studio${path}`, {
      method,
      headers: { ...json, cookie: to === generating ? cookie : parentCookie },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  const adventureOf = async (name: string) => {
    const made = async (
      level: string,
      parentId: string | null,
      title: string,
    ) =>
      (await (
        await via("POST", "/nodes", { level, parentId, title, body: {} })
      ).json()) as { id: string };
    const campaign = await made("campaign", null, `${name} c`);
    const arc = await made("arc", campaign.id, `${name} a`);
    return (await made("adventure", arc.id, `${name} adventure`)).id;
  };
  const job = async (id: string) =>
    (await (await via("GET", `/jobs/${id}`)).json()) as {
      state: string;
      progress: number;
      message: string;
    };
  const finished = async (id: string) => {
    for (let i = 0; i < 100; i += 1) {
      const j = await job(id);
      if (j.state === "done" || j.state === "failed") return j;
      await new Promise((r) => setTimeout(r, 20));
    }
    throw new Error("job_never_finished");
  };
  const start = async (id: string, prompt = "autumn fog") =>
    (await (await via("POST", `/nodes/${id}/generate`, { prompt })).json()) as {
      job: { id: string };
    };

  it("REQ-8608: shows the number of calls and this month's spend before it runs", async () => {
    const id = await adventureOf("estimate");
    const before = (await (
      await via("GET", `/nodes/${id}/generate/estimate`)
    ).json()) as { calls: { min: number; max: number }; spentUsd: number };
    expect(before.calls).toEqual({ min: 4, max: 17 });
    const spent = (n: number) =>
      db
        .prepare(
          `INSERT INTO llm_log (at, role, route, model, tier, bucket, input_tokens, output_tokens,
             cost_usd, latency_ms, outcome, request, response)
           VALUES (?, 'SHOWRUNNER_MODEL', 'r', 'm', 'planning', 'b', 1, 1, ?, 1, 'ok', '{}', '{}')`,
        )
        .run(
          n === 0 ? "2026-10-02T00:00:00.000Z" : "2026-11-03T00:00:00.000Z",
          n === 0 ? 9 : 0.25,
        );
    await spent(0);
    await spent(1);
    const after = (await (
      await via("GET", `/nodes/${id}/generate/estimate`)
    ).json()) as { spentUsd: number };
    expect(after.spentUsd - before.spentUsd).toBeCloseTo(0.25, 5);
  });

  it("answers 409 with no generator, and refuses a node that is no adventure", async () => {
    const id = await adventureOf("refuse");
    const none = await via(
      "POST",
      `/nodes/${id}/generate`,
      { prompt: "x" },
      app,
    );
    expect(none.status).toBe(409);
    expect(((await none.json()) as { error: string }).error).toBe(
      "generator_not_configured",
    );
    const arc = (await (
      await via("POST", "/nodes", {
        level: "campaign",
        parentId: null,
        title: "lone",
        body: {},
      })
    ).json()) as { id: string };
    const wrong = await via("POST", `/nodes/${arc.id}/generate`, {
      prompt: "x",
    });
    expect(wrong.status).toBe(400);
  });

  it("REQ-8318, REQ-8604: runs as a job with a visible step and leaves the result waiting", async () => {
    const id = await adventureOf("run");
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    writer = async ({ report }) => {
      report.step("plan", 0);
      report.step("draft", 1);
      await gate;
      return fake();
    };
    const started = await start(id);
    for (
      let i = 0;
      i < 50 && (await job(started.job.id)).message !== "draft:1";
      i += 1
    )
      await new Promise((r) => setTimeout(r, 20));
    const mid = await job(started.job.id);
    expect(mid.state).toBe("running");
    expect(mid.message).toBe("draft:1");
    expect(mid.progress).toBeGreaterThan(0);
    release();
    const done = await finished(started.job.id);
    expect(done.state).toBe("done");
    const listed = (await (
      await via("GET", `/nodes/${id}/versions`)
    ).json()) as { versions: { state: string; body: { premise?: string } }[] };
    expect(listed.versions.map((v) => v.state)).toEqual(["current", "pending"]);
    expect(listed.versions[1]?.body.premise).toBe("A fog over the canal");
    // The current version is as it was.
    const seen = (await (await via("GET", `/nodes/${id}`)).json()) as {
      body: unknown;
    };
    expect(seen.body).toEqual({});
  });

  it("REQ-8610: names the cause when no draft is written", async () => {
    const id = await adventureOf("cause");
    for (const cause of ["budget_exhausted", "provider_failed"] as const) {
      writer = ({ report }) => {
        report.fault(cause);
        return Promise.resolve(null);
      };
      const failed = await finished((await start(id)).job.id);
      expect(failed).toMatchObject({ state: "failed", message: cause });
    }
    writer = () => Promise.resolve(null);
    expect((await finished((await start(id)).job.id)).message).toBe(
      "check_failed",
    );
    writer = () => Promise.reject(new Error("boom"));
    expect((await finished((await start(id)).job.id)).message).toBe("failed");
  });

  it("REQ-8604: refuses a generation while a version already waits", async () => {
    const id = await adventureOf("waits");
    writer = () => Promise.resolve(fake());
    await finished((await start(id)).job.id);
    const again = await via("POST", `/nodes/${id}/generate`, {
      prompt: "more",
    });
    expect(again.status).toBe(409);
    expect(((await again.json()) as { error: string }).error).toBe(
      "version_waits",
    );
  });
});
