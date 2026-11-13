// REQ-8168, REQ-8292 (ADR-3270, ADR-3280): the parent takes a turn of the Master in the sandbox with her
// words, the turn is logged in the sandbox only, and the inspector shows each turn with its model
// calls. The route answers 409 while no Master is configured.
import { readFileSync } from "node:fs";
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
import { MasterFailed } from "../../src/story/master-gateway.js";
import type { MasterModel, MasterRequest } from "../../src/story/turn.js";
import { onlyOnPostgres } from "../helpers/backend.js";

const URL =
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
  process.env["MEOWTOWER_DATABASE_URL"] = URL;
  db = await openProfile(URL, schema);
  const now = () => Date.parse("2026-11-10T12:00:00Z");
  app = await createApp({ db, now, tasks: "registry", master });
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
    await dropSchema(URL, sandboxSchemaOf(schema));
    expect((await studio("POST", "/sandbox/play/turn", ask)).status).toBe(409);
    await studio("POST", "/sandbox/reset", { from: "empty" });
    expect(
      (await studio("POST", "/sandbox/play/turn", ask, deviceCookie)).status,
    ).toBe(401);
    const none = await studio(
      "POST",
      "/sandbox/play/turn",
      ask,
      parentCookie,
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

    const sandbox = await openPostgresIfExists(URL, sandboxSchemaOf(schema));
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
});
