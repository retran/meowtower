// REQ-8290 (ADR-3280): the parent forces the next check's outcome, a fall or a rise in the sandbox.
// The force holds for one answer, and her game never takes it.
import { afterAll, beforeAll, expect, it } from "vitest";
import type { Hono } from "hono";
import { createApp } from "../../src/server/app.js";
import { openProfile } from "../../src/server/database.js";
import { dropSchema, type Db } from "../../src/server/db/index.js";
import { registerDevice } from "../../src/server/devices.js";
import { createParentApp } from "../../src/server/parent.js";
import {
  openPostgresIfExists,
  sandboxSchemaOf,
} from "../../src/server/sandbox/sandbox.js";
import { onlyOnPostgres } from "../helpers/backend.js";

const URL =
  process.env["MEOWTOWER_TEST_DATABASE_URL"] ??
  "postgres://postgres@127.0.0.1:55432/postgres";
const schema = `t_${String(process.pid)}_sbxfrc`;
const PIN = "4821";
const json = { "content-type": "application/json" };
let db: Db;
let app: Hono;
let parentCookie = "";
let deviceCookie = "";
let seq = 0;
const previous = process.env["MEOWTOWER_DATABASE_URL"];
const input = {
  firstKeyMs: 800,
  submittedMs: 2400,
  edits: 0,
  erasures: 0,
  keyPresses: 1,
  focusLosses: { count: 0, totalMs: 0 },
  method: "keypad",
};

const cookieOf = (res: Response, name: string): string =>
  (res.headers.get("set-cookie") ?? "")
    .split(/,(?=\s*\w+=)/)
    .map((c) => c.trim().split(";")[0] ?? "")
    .find((c) => c.startsWith(`${name}=`)) ?? "";

beforeAll(async () => {
  process.env["MEOWTOWER_DATABASE_URL"] = URL;
  db = await openProfile(URL, schema);
  const now = () => Date.parse("2026-11-10T12:00:00Z");
  app = await createApp({ db, now, tasks: "registry" });
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

const studio = (
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

const node = async (level: string, parentId: string | null, title: string) =>
  (
    (await (
      await studio("POST", "/nodes", { level, parentId, title, body: {} })
    ).json()) as { id: string }
  ).id;

/** Opens the sandbox on a fresh session with one task waiting, and answers it after the force. */
async function playOne(force?: object): Promise<{
  outcome: string;
  node: string;
  sandbox: Db;
}> {
  await studio("POST", "/sandbox/reset", { from: "empty" });
  const campaign = await node("campaign", null, "c");
  const arc = await node("arc", campaign, "a");
  const adventure = await node("adventure", arc, "v");
  const encounter = await node("encounter", adventure, "e");
  const started = await studio("POST", "/sandbox/play/start", {
    adventureId: adventure,
    encounterId: encounter,
  });
  const out = (await started.json()) as {
    sessionId: string;
    scene: { sceneId: string };
  };
  const sandboxCookie = cookieOf(started, "meowtower_sandbox_device");
  const child = (path: string, init: RequestInit = {}) =>
    app.request(`/api/parent/studio/sandbox/play/child${path}`, {
      ...init,
      headers: { ...json, cookie: `${parentCookie}; ${sandboxCookie}` },
    });
  await child(`/api/session/${out.sessionId}/scene/input`, {
    method: "POST",
    body: JSON.stringify({
      clientSeq: ++seq,
      kind: "text",
      sceneId: out.scene.sceneId,
      text: "ok",
    }),
  });
  const room = (await (
    await child(`/api/session/${out.sessionId}/next`)
  ).json()) as {
    itemId: string;
  };
  if (force)
    expect((await studio("POST", "/sandbox/force", force)).status).toBe(200);
  // The task is drawn at random, and some kinds refuse every typed entry with 422. "I don't know"
  // always has a verdict, so the answer is that, and the force is the only thing that sets the outcome.
  const answered = await child(`/api/session/${out.sessionId}/answer`, {
    method: "POST",
    body: JSON.stringify({
      itemId: room.itemId,
      raw: "",
      dontKnow: true,
      input,
      clientSeq: ++seq,
    }),
  });
  expect(answered.status).toBe(200);
  const sandbox = await openPostgresIfExists(URL, sandboxSchemaOf(schema));
  if (!sandbox) throw new Error("no sandbox");
  const shown = (await sandbox
    .prepare("SELECT payload FROM events WHERE type = 'item_shown' LIMIT 1")
    .get()) as { payload: string };
  return {
    outcome: ((await answered.json()) as { outcome: string }).outcome,
    node: (JSON.parse(shown.payload) as { node: string }).node,
    sandbox,
  };
}

onlyOnPostgres("the sandbox's forced outcomes", () => {
  it("refuses a force with no sandbox, without the parent, for a gate or for a bad body", async () => {
    await dropSchema(URL, sandboxSchemaOf(schema));
    expect(
      (await studio("POST", "/sandbox/force", { next: "alt" })).status,
    ).toBe(409);
    await studio("POST", "/sandbox/reset", { from: "empty" });
    expect(
      (await studio("POST", "/sandbox/force", { next: "alt" }, deviceCookie))
        .status,
    ).toBe(401);
    const gate = await studio("POST", "/sandbox/force", { next: "gate" });
    expect(gate.status).toBe(400);
    expect(((await gate.json()) as { error: string }).error).toBe(
      "gates_not_built",
    );
    expect(
      (await studio("POST", "/sandbox/force", { next: "win" })).status,
    ).toBe(400);
  });

  it("forces the outcome of the next answer only, and her game never takes it", async () => {
    const events = Number(
      (
        (await db.prepare("SELECT count(*) AS n FROM events").get()) as {
          n: number;
        }
      ).n,
    );
    const forced = await playOne({ next: "partial" });
    try {
      // No task is answered `partial` by itself, so the force is what the reply shows.
      expect(forced.outcome).toBe("partial");
      const verdicts = (await forced.sandbox
        .prepare("SELECT payload FROM events WHERE type = 'verdict'")
        .all()) as { payload: string }[];
      expect(
        verdicts.map(
          (v) => (JSON.parse(v.payload) as { outcome: string }).outcome,
        ),
      ).toEqual(["partial"]);
    } finally {
      await forced.sandbox.close();
    }
    const plain = await playOne();
    try {
      expect(plain.outcome).not.toBe("partial");
    } finally {
      await plain.sandbox.close();
    }
    expect(
      Number(
        (
          (await db.prepare("SELECT count(*) AS n FROM events").get()) as {
            n: number;
          }
        ).n,
      ),
    ).toBe(events);
  });

  it("moves the answered node's level up or down by one, within one to five", async () => {
    const rose = await playOne({ next: "rise" });
    try {
      const row = (await rose.sandbox
        .prepare("SELECT level FROM node_levels WHERE node = ?")
        .get(rose.node)) as { level: number };
      expect(row.level).toBe(2);
    } finally {
      await rose.sandbox.close();
    }
    const fell = await playOne({ next: "fall" });
    try {
      const row = (await fell.sandbox
        .prepare("SELECT level FROM node_levels WHERE node = ?")
        .get(fell.node)) as { level: number } | undefined;
      expect(row?.level ?? 1).toBe(1);
    } finally {
      await fell.sandbox.close();
    }
  });
});
