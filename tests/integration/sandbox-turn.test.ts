// REQ-8168, REQ-8292 (ADR-3270, ADR-3280): the parent takes a turn of the Master in the sandbox with her
// words, the turn is logged in the sandbox only, and the inspector shows each turn with its model
// calls. The route answers 409 while no Master is configured.
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, expect, it } from "vitest";
import type { Hono } from "hono";
import { createApp } from "../../src/server/app.js";
import { appendEvents } from "../../src/engine/events/append.js";
import { openProfile } from "../../src/server/database.js";
import { proposeVersion } from "../../src/server/studio/store.js";
import { dropSchema, type Db } from "../../src/server/db/index.js";
import { registerDevice } from "../../src/server/devices.js";
import { createParentApp } from "../../src/server/parent.js";
import {
  openPostgresIfExists,
  sandboxSchemaOf,
} from "../../src/server/sandbox/sandbox.js";
import { MasterFailed } from "../../src/story/master-gateway.js";
import type { MasterModel, MasterRequest } from "../../src/story/turn.js";
import type { FrameQueue, FrameTask } from "../../src/server/frames/queue.js";
import { onlyOnPostgres } from "../helpers/backend.js";

const DB_URL =
  process.env["MEOWTOWER_TEST_DATABASE_URL"] ??
  "postgres://postgres@127.0.0.1:55432/postgres";
const schema = `t_${String(process.pid)}_sbxturn`;
const PIN = "4821";
const json = { "content-type": "application/json" };
const forbidden = (
  JSON.parse(
    readFileSync(
      new URL("../../content/shaming.ru.json", import.meta.url),
      "utf8",
    ),
  ) as { forms: { forms: string[] }[] }
).forms[0]?.forms[0] as string;

let db: Db;
let app: Hono;
let bare: Hono;
let parentCookie = "";
let deviceCookie = "";
const previous = process.env["MEOWTOWER_DATABASE_URL"];
/** What the fake Master is asked, and what it says next. */
const seen: MasterRequest[] = [];
let next: () => Promise<{
  text: string;
  calls: { tool: string; input: unknown }[];
}> = () => Promise.resolve({ text: "The gate creaks.", calls: [] });
/** The tasks the frame author was asked to set a story for. */
const framed: FrameTask[] = [];
const sandboxFrames = (): FrameQueue => ({
  prepare: () => Promise.resolve(),
  ready: (task) => {
    framed.push(task);
    return Promise.resolve();
  },
  take: () => Promise.resolve(null),
});
const master = (): MasterModel => (request) => {
  seen.push(request);
  return next();
};

const cookieOf = (res: Response, name: string): string =>
  (res.headers.get("set-cookie") ?? "")
    .split(/,(?=\s*\w+=)/)
    .map((c) => c.trim().split(";")[0] ?? "")
    .find((c) => c.startsWith(`${name}=`)) ?? "";

beforeAll(async () => {
  process.env["MEOWTOWER_DATABASE_URL"] = DB_URL;
  db = await openProfile(DB_URL, schema);
  const now = () => Date.parse("2026-11-10T12:00:00Z");
  app = await createApp({
    db,
    now,
    tasks: "registry",
    master,
    sandboxFrames,
  });
  bare = await createApp({ db, now, tasks: "registry" });
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
  await dropSchema(DB_URL, schema);
  await dropSchema(DB_URL, sandboxSchemaOf(schema));
  if (previous === undefined) delete process.env["MEOWTOWER_DATABASE_URL"];
  else process.env["MEOWTOWER_DATABASE_URL"] = previous;
});

const studio = (
  method: string,
  path: string,
  body?: object,
  cookie = parentCookie,
  to: Hono = app,
) =>
  to.request(`/api/parent/studio${path}`, {
    method,
    headers: { ...json, cookie },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

const node = async (
  level: string,
  parentId: string | null,
  title: string,
  body: object = {},
) =>
  (
    (await (
      await studio("POST", "/nodes", { level, parentId, title, body })
    ).json()) as { id: string }
  ).id;

const count = async (d: Db, table: string): Promise<number> =>
  Number(
    (
      (await d.prepare(`SELECT count(*) AS n FROM ${table}`).get()) as {
        n: number;
      }
    ).n,
  );

onlyOnPostgres("a turn of the Master in the sandbox", () => {
  it("answers 409 with no Master, 401 without the parent, and 409 with no sandbox", async () => {
    const campaign = await node("campaign", null, "c");
    const arc = await node("arc", campaign, "a");
    const adventure = await node("adventure", arc, "The fog adventure");
    const encounter = await node("encounter", adventure, "The gate", {
      situation: "A gate in the fog.",
    });
    const ask = { adventureId: adventure, encounterId: encounter, said: "x" };
    await dropSchema(DB_URL, sandboxSchemaOf(schema));
    expect((await studio("POST", "/sandbox/play/turn", ask)).status).toBe(409);
    await studio("POST", "/sandbox/reset", { from: "empty" });
    expect(
      (await studio("POST", "/sandbox/play/turn", ask, deviceCookie)).status,
    ).toBe(401);
    const loginBare = await bare.request("/api/parent/login", {
      method: "POST",
      headers: { ...json, cookie: deviceCookie },
      body: JSON.stringify({ pin: PIN }),
    });
    const bareCookie = `${deviceCookie}; ${cookieOf(loginBare, "meowtower_parent")}`;
    const none = await studio(
      "POST",
      "/sandbox/play/turn",
      ask,
      bareCookie,
      bare,
    );
    expect(none.status).toBe(409);
    expect(((await none.json()) as { error: string }).error).toBe(
      "master_not_configured",
    );
  });

  it("takes a turn with the scenario in the prompt, logs it in the sandbox and shows it in the inspector", async () => {
    const campaign = await node("campaign", null, "c2");
    const arc = await node("arc", campaign, "a2");
    const adventure = await node("adventure", arc, "The marsh adventure");
    const encounter = await node("encounter", adventure, "The bridge", {
      situation: "A rope bridge.",
    });
    await studio("POST", "/sandbox/reset", { from: "empty" });
    const events = await count(db, "events");
    seen.length = 0;
    next = () =>
      Promise.resolve({
        text: "The bridge sways under her feet.",
        calls: [
          {
            tool: "change_world",
            input: { kind: "place", name: "bridge", note: "it sways" },
          },
          { tool: "set_level", input: { level: 9 } },
        ],
      });
    const res = await studio("POST", "/sandbox/play/turn", {
      adventureId: adventure,
      encounterId: encounter,
      said: "I step onto the bridge",
    });
    expect(res.status).toBe(200);
    const out = (await res.json()) as {
      reply: string;
      blocked: boolean;
      calls: { tool: string }[];
      refused: { tool: string; fault: string }[];
    };
    expect(out.reply).toBe("The bridge sways under her feet.");
    expect(out.blocked).toBe(false);
    expect(out.calls.map((c) => c.tool)).toEqual(["change_world"]);
    expect(out.refused).toEqual([{ tool: "set_level", fault: "tool_unknown" }]);
    expect(seen[0]?.system).toContain("The marsh adventure");
    expect(seen[0]?.system).toContain("A rope bridge.");
    expect(seen[0]?.said).toBe("I step onto the bridge");
    expect(seen[0]?.encounter).toBe(encounter);

    const sandbox = await openPostgresIfExists(DB_URL, sandboxSchemaOf(schema));
    if (!sandbox) throw new Error("no sandbox");
    try {
      await sandbox
        .prepare(
          `INSERT INTO llm_log (at, role, route, model, tier, bucket, input_tokens, output_tokens,
             cost_usd, latency_ms, outcome, request, response)
           VALUES (?, 'MASTER_MODEL', 'anthropic', 'm', 'player', 'b', 100, 20, 0.0123, 456, 'ok', ?, ?)`,
        )
        .run(new Date().toISOString(), '{"user":"x"}', '{"text":"y"}');
    } finally {
      await sandbox.close();
    }
    const listed = (await (
      await studio("GET", "/sandbox/play/turns")
    ).json()) as {
      turns: {
        encounter: string;
        said: string;
        reply: string;
        changes: { name: string }[];
      }[];
      modelCalls: {
        costUsd: number;
        latencyMs: number;
        request: string;
        response: string;
      }[];
    };
    expect(listed.turns).toHaveLength(1);
    expect(listed.turns[0]).toMatchObject({
      encounter,
      said: "I step onto the bridge",
      reply: "The bridge sways under her feet.",
    });
    expect(listed.turns[0]?.changes.map((c) => c.name)).toEqual(["bridge"]);
    expect(listed.modelCalls).toEqual([
      {
        at: expect.any(String) as string,
        costUsd: 0.0123,
        latencyMs: 456,
        request: '{"user":"x"}',
        response: '{"text":"y"}',
      },
    ]);
    expect(await count(db, "events")).toBe(events);
    expect(
      (await studio("GET", "/sandbox/play/turns", undefined, deviceCookie))
        .status,
    ).toBe(401);
  });

  it("shows story text for a reply with a forbidden word, and 502 when the Master fails", async () => {
    const campaign = await node("campaign", null, "c3");
    const arc = await node("arc", campaign, "a3");
    const adventure = await node("adventure", arc, "Dune");
    const encounter = await node("encounter", adventure, "Top");
    await studio("POST", "/sandbox/reset", { from: "empty" });
    next = () => Promise.resolve({ text: `He says ${forbidden}.`, calls: [] });
    const blocked = (await (
      await studio("POST", "/sandbox/play/turn", {
        adventureId: adventure,
        encounterId: encounter,
        said: "hello",
      })
    ).json()) as { reply: string; blocked: boolean };
    expect(blocked.blocked).toBe(true);
    expect(blocked.reply).not.toContain(forbidden);
    expect(blocked.reply.length).toBeGreaterThan(0);

    next = () => Promise.reject(new MasterFailed("budget_exhausted"));
    const failed = await studio("POST", "/sandbox/play/turn", {
      adventureId: adventure,
      encounterId: encounter,
      said: "hello",
    });
    expect(failed.status).toBe(502);
    expect(await failed.json()).toEqual({
      error: "master_failed",
      reason: "budget_exhausted",
    });
  });

  it("REQ-8180: takes the engine outcome of a check on the ladder, and refuses an outcome that is none", async () => {
    const campaign = await node("campaign", null, "c4");
    const arc = await node("arc", campaign, "a4");
    const adventure = await node("adventure", arc, "Cliff");
    const encounter = await node("encounter", adventure, "Edge");
    await studio("POST", "/sandbox/reset", { from: "empty" });
    seen.length = 0;
    next = () =>
      Promise.resolve({ text: "She slips, but a ledge holds.", calls: [] });
    const ask = {
      adventureId: adventure,
      encounterId: encounter,
      said: "I jump",
    };
    expect(
      (await studio("POST", "/sandbox/play/turn", { ...ask, outcome: "alt" }))
        .status,
    ).toBe(200);
    expect(seen[0]?.checkResult).toBe("twist");
    expect(
      (await studio("POST", "/sandbox/play/turn", { ...ask, outcome: "win" }))
        .status,
    ).toBe(400);
    await studio("POST", "/sandbox/play/turn", ask);
    expect(seen[1]?.checkResult).toBeUndefined();
  });

  it("REQ-8172: takes the outcome of the engine's latest verdict, once, and says when none is waiting", async () => {
    const campaign = await node("campaign", null, "c5");
    const arc = await node("arc", campaign, "a5");
    const adventure = await node("adventure", arc, "Lock");
    const encounter = await node("encounter", adventure, "Door");
    await studio("POST", "/sandbox/reset", { from: "empty" });
    next = () => Promise.resolve({ text: "The lock clicks.", calls: [] });
    const ask = {
      adventureId: adventure,
      encounterId: encounter,
      said: "I pick the lock",
      outcome: "engine",
    };
    const none = await studio("POST", "/sandbox/play/turn", ask);
    expect(none.status).toBe(409);
    expect(((await none.json()) as { error: string }).error).toBe(
      "no_check_answered",
    );

    const sandbox = await openPostgresIfExists(DB_URL, sandboxSchemaOf(schema));
    if (!sandbox) throw new Error("no sandbox");
    try {
      await appendEvents(sandbox, [
        {
          type: "verdict",
          v: 1,
          payload: {
            itemId: "i1",
            attemptNo: 1,
            verdict: "correct",
            outcome: "partial",
            trapId: null,
            errorClass: null,
            steps: [],
          },
          origin: "server",
          sessionId: "s1",
        },
      ]);
    } finally {
      await sandbox.close();
    }
    seen.length = 0;
    expect((await studio("POST", "/sandbox/play/turn", ask)).status).toBe(200);
    expect(seen[0]?.checkResult).toBe("cost");
    // The turn used the verdict, so the next one has none waiting.
    expect((await studio("POST", "/sandbox/play/turn", ask)).status).toBe(409);
  });
  it("REQ-8174: a request_check call gets its task from the Director, and the choice is logged and shown", async () => {
    const campaign = await node("campaign", null, "c6");
    const arc = await node("arc", campaign, "a6");
    const adventure = await node("adventure", arc, "Ford");
    const encounter = await node("encounter", adventure, "Stones");
    await studio("POST", "/sandbox/reset", { from: "empty" });
    next = () =>
      Promise.resolve({
        text: "The stones are slick.",
        calls: [
          {
            tool: "request_check",
            input: { tried: "hop across", hard: "the stones are slick" },
          },
        ],
      });
    const ask = {
      adventureId: adventure,
      encounterId: encounter,
      said: "I hop across",
    };
    const out = (await (
      await studio("POST", "/sandbox/play/turn", ask)
    ).json()) as {
      check: { node: string; subtype: string; purpose: string } | null;
    };
    expect(out.check).toMatchObject({
      node: expect.any(String) as string,
      subtype: expect.any(String) as string,
      purpose: expect.stringMatching(/^(review|frontier)$/) as string,
    });
    const sandbox = await openPostgresIfExists(DB_URL, sandboxSchemaOf(schema));
    if (!sandbox) throw new Error("no sandbox");
    try {
      const rows = (await sandbox
        .prepare("SELECT payload FROM events WHERE type = 'check_task_chosen'")
        .all()) as { payload: string | object }[];
      expect(rows).toHaveLength(1);
      const logged =
        typeof rows[0]?.payload === "string"
          ? (JSON.parse(rows[0].payload) as object)
          : rows[0]?.payload;
      expect(logged).toMatchObject({ encounter, ...out.check });
    } finally {
      await sandbox.close();
    }
    next = () => Promise.resolve({ text: "She hops.", calls: [] });
    const plain = (await (
      await studio("POST", "/sandbox/play/turn", ask)
    ).json()) as { check: unknown };
    expect(plain.check).toBeNull();
  });
  it("REQ-8174: the task the Director chose is the next one on the child's screen, with its purpose", async () => {
    const campaign = await node("campaign", null, "c7");
    const arc = await node("arc", campaign, "a7");
    const adventure = await node("adventure", arc, "Gate");
    const encounter = await node("encounter", adventure, "Lock", {
      situation: "A lock.",
    });
    await studio("POST", "/sandbox/reset", { from: "empty" });
    const started = await studio("POST", "/sandbox/play/start", {
      adventureId: adventure,
      encounterId: encounter,
    });
    const { sessionId } = (await started.json()) as { sessionId: string };
    const sandboxCookie = cookieOf(started, "meowtower_sandbox_device");
    const child = (path: string) =>
      app.request(`/api/parent/studio/sandbox/play/child${path}`, {
        headers: { ...json, cookie: `${parentCookie}; ${sandboxCookie}` },
      });
    next = () =>
      Promise.resolve({
        text: "The lock is stiff.",
        calls: [
          {
            tool: "request_check",
            input: { tried: "pick it", hard: "it is stiff" },
          },
        ],
      });
    const turn = (await (
      await studio("POST", "/sandbox/play/turn", {
        adventureId: adventure,
        encounterId: encounter,
        said: "I pick the lock",
      })
    ).json()) as { check: { node: string; purpose: string } };
    const shown = (await (
      await child(`/api/session/${sessionId}/next`)
    ).json()) as { kind: string; itemId?: string };
    expect(shown.kind).not.toBe("scene");
    const again = (await (
      await child(`/api/session/${sessionId}/next`)
    ).json()) as { itemId?: string };
    expect(again.itemId).toBe(shown.itemId);

    const sandbox = await openPostgresIfExists(DB_URL, sandboxSchemaOf(schema));
    if (!sandbox) throw new Error("no sandbox");
    try {
      const rows = (await sandbox
        .prepare("SELECT payload FROM events WHERE type = 'item_shown'")
        .all()) as { payload: string | object }[];
      expect(rows).toHaveLength(1);
      const logged = (
        typeof rows[0]?.payload === "string"
          ? JSON.parse(rows[0].payload)
          : rows[0]?.payload
      ) as { node: string; purpose: string; itemId: string };
      expect(logged).toMatchObject({
        node: turn.check.node,
        purpose: turn.check.purpose,
        itemId: shown.itemId,
      });
    } finally {
      await sandbox.close();
    }
  });
  it("REQ-8176: the frame author is given what she tried, and a forbidden word keeps it out", async () => {
    const campaign = await node("campaign", null, "c8");
    const arc = await node("arc", campaign, "a8");
    const adventure = await node("adventure", arc, "Well");
    const encounter = await node("encounter", adventure, "Rope");
    const tryOnce = async (tried: string) => {
      await studio("POST", "/sandbox/reset", { from: "empty" });
      const started = await studio("POST", "/sandbox/play/start", {
        adventureId: adventure,
        encounterId: encounter,
      });
      const { sessionId } = (await started.json()) as { sessionId: string };
      const cookie = cookieOf(started, "meowtower_sandbox_device");
      next = () =>
        Promise.resolve({
          text: "The rope is wet.",
          calls: [
            { tool: "request_check", input: { tried, hard: "it is wet" } },
          ],
        });
      await studio("POST", "/sandbox/play/turn", {
        adventureId: adventure,
        encounterId: encounter,
        said: "I climb",
      });
      framed.length = 0;
      await app.request(
        `/api/parent/studio/sandbox/play/child/api/session/${sessionId}/next`,
        { headers: { ...json, cookie: `${parentCookie}; ${cookie}` } },
      );
      return framed[0];
    };
    expect((await tryOnce("climb the rope"))?.situation).toEqual({
      tried: "climb the rope",
      hard: "it is wet",
    });
    expect((await tryOnce(`climb, ${forbidden}`))?.situation).toBeUndefined();
  });
  it("REQ-8604: the Master and the scene read the current version and never a waiting one", async () => {
    const campaign = await node("campaign", null, "c9");
    const arc = await node("arc", campaign, "a9");
    const adventure = await node("adventure", arc, "Mill");
    const encounter = await node("encounter", adventure, "Wheel", {
      situation: "The wheel turns.",
    });
    await proposeVersion(
      db,
      Date.parse("2026-11-10T12:00:00Z"),
      encounter,
      { situation: "A GENERATED SITUATION" },
      {},
    );
    await studio("POST", "/sandbox/reset", { from: "empty" });
    seen.length = 0;
    next = () => Promise.resolve({ text: "It creaks.", calls: [] });
    await studio("POST", "/sandbox/play/turn", {
      adventureId: adventure,
      encounterId: encounter,
      said: "I look",
    });
    expect(seen[0]?.system).toContain("The wheel turns.");
    expect(seen[0]?.system).not.toContain("A GENERATED SITUATION");
    const started = (await (
      await studio("POST", "/sandbox/play/start", {
        adventureId: adventure,
        encounterId: encounter,
      })
    ).json()) as { scene: { lines: { text: string }[] } };
    expect(started.scene.lines.map((l) => l.text)).toEqual([
      "The wheel turns.",
    ]);
  });
  it("REQ-8292: the inspector shows the Director's task beside the turn that asked for the check", async () => {
    const campaign = await node("campaign", null, "c10");
    const arc = await node("arc", campaign, "a10");
    const adventure = await node("adventure", arc, "Barn");
    const encounter = await node("encounter", adventure, "Loft");
    await studio("POST", "/sandbox/reset", { from: "empty" });
    const ask = {
      adventureId: adventure,
      encounterId: encounter,
      said: "I climb",
    };
    next = () =>
      Promise.resolve({
        text: "The ladder shakes.",
        calls: [
          {
            tool: "request_check",
            input: { tried: "climb the ladder", hard: "it shakes" },
          },
        ],
      });
    const asked = (await (
      await studio("POST", "/sandbox/play/turn", ask)
    ).json()) as { check: { node: string; subtype: string; purpose: string } };
    next = () => Promise.resolve({ text: "She reaches the top.", calls: [] });
    await studio("POST", "/sandbox/play/turn", { ...ask, said: "I look" });
    const listed = (await (
      await studio("GET", "/sandbox/play/turns")
    ).json()) as {
      turns: {
        said: string;
        check: { node: string; subtype: string; purpose: string } | null;
      }[];
    };
    expect(listed.turns.map((t) => t.said)).toEqual(["I climb", "I look"]);
    expect(listed.turns[0]?.check).toEqual(asked.check);
    expect(listed.turns[1]?.check).toBeNull();
  });
});
