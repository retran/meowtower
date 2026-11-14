// REQ-8286 (ADR-3280): the parent plays any adventure, a draft included, from any encounter in the
// sandbox as the child sees it, and nothing of it reaches her game (ADR-3280 outcome 1a).
import { afterAll, beforeAll, expect, it } from "vitest";
import type { Hono } from "hono";
import { createApp } from "../../src/server/app.js";
import { openProfile } from "../../src/server/database.js";
import { dropSchema, type Db } from "../../src/server/db/index.js";
import { registerDevice } from "../../src/server/devices.js";
import { createParentApp } from "../../src/server/parent.js";
import { sandboxSchemaOf } from "../../src/server/sandbox/sandbox.js";
import { onlyOnPostgres } from "../helpers/backend.js";

const URL =
  process.env["MEOWTOWER_TEST_DATABASE_URL"] ??
  "postgres://postgres@127.0.0.1:55432/postgres";
const schema = `t_${String(process.pid)}_sbxplay`;
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

const node = async (
  level: string,
  parentId: string | null,
  title: string,
  body: object,
): Promise<string> =>
  (
    (await (
      await call("POST", "/nodes", { level, parentId, title, body })
    ).json()) as { id: string }
  ).id;

const count = async (table: string): Promise<number> =>
  Number(
    (
      (await db.prepare(`SELECT count(*) AS n FROM ${table}`).get()) as {
        n: number;
      }
    ).n,
  );

onlyOnPostgres("the sandbox play surface", () => {
  it("lists the encounters of a draft adventure, refuses a node that is not one, and needs the parent", async () => {
    const campaign = await node("campaign", null, "Year", {});
    const arc = await node("arc", campaign, "Arc", {});
    const adventure = await node("adventure", arc, "Fog", {});
    await node("encounter", adventure, "Gate", { situation: "A gate." });
    const listed = (await (
      await call("GET", `/sandbox/play/adventures/${adventure}/encounters`)
    ).json()) as { encounters: { title: string; status: string }[] };
    expect(listed.encounters.map((e) => [e.title, e.status])).toEqual([
      ["Gate", "draft"],
    ]);
    expect(
      (await call("GET", `/sandbox/play/adventures/${arc}/encounters`)).status,
    ).toBe(404);
    expect(
      (
        await call(
          "GET",
          `/sandbox/play/adventures/${adventure}/encounters`,
          undefined,
          deviceCookie,
        )
      ).status,
    ).toBe(401);
  });

  it("starts from a chosen encounter, shows its scene as the child sees it and goes on to the tasks", async () => {
    const campaign = await node("campaign", null, "Year 2", {});
    const arc = await node("arc", campaign, "Arc 2", {});
    const adventure = await node("adventure", arc, "Marsh", {});
    const first = await node("encounter", adventure, "Reeds", {
      situation: "Reeds sway.",
    });
    const second = await node("encounter", adventure, "Bridge", {
      place: "A rope bridge",
      situation: "It sways.",
      exits: [{ when: "She crosses", next: first }],
    });
    const other = await node("adventure", arc, "Elsewhere", {});
    const strange = await node("encounter", other, "Strange", {});

    // No sandbox yet: nothing starts.
    await dropSchema(URL, sandboxSchemaOf(schema));
    const noSandbox = await call("POST", "/sandbox/play/start", {
      adventureId: adventure,
      encounterId: second,
    });
    expect(noSandbox.status).toBe(409);

    await call("POST", "/sandbox/reset", { from: "empty" });
    const refused = await call("POST", "/sandbox/play/start", {
      adventureId: adventure,
      encounterId: strange,
    });
    expect(refused.status).toBe(400);
    expect(
      (
        await call(
          "POST",
          "/sandbox/play/start",
          {
            adventureId: adventure,
            encounterId: second,
          },
          deviceCookie,
        )
      ).status,
    ).toBe(401);

    const gameEvents = await count("events");
    const started = await call("POST", "/sandbox/play/start", {
      adventureId: adventure,
      encounterId: second,
    });
    expect(started.status).toBe(200);
    const out = (await started.json()) as {
      sessionId: string;
      scene: { sceneId: string; branches: { choiceId: string }[] };
    };
    expect(out.scene.sceneId).toBe(second);
    expect(out.scene.branches).toEqual([
      { choiceId: first, text: "She crosses" },
    ]);
    const sandboxCookie = cookieOf(started, "meowtower_sandbox_device");
    expect(sandboxCookie).not.toBe("");

    const child = (path: string, init: RequestInit = {}) =>
      app.request(`/api/parent/studio/sandbox/play/child${path}`, {
        ...init,
        headers: {
          ...json,
          cookie: `${parentCookie}; ${sandboxCookie}`,
        },
      });
    const next = (await (
      await child(`/api/session/${out.sessionId}/next`)
    ).json()) as { kind: string; sceneId?: string };
    expect(next).toMatchObject({ kind: "scene", sceneId: second });

    const chosen = await child(`/api/session/${out.sessionId}/scene/input`, {
      method: "POST",
      body: JSON.stringify({
        clientSeq: 1,
        kind: "choice",
        sceneId: second,
        choiceId: first,
      }),
    });
    expect(chosen.status).toBe(200);
    const after = (await (
      await child(`/api/session/${out.sessionId}/next`)
    ).json()) as { kind: string };
    expect(after.kind).not.toBe("scene");

    // The child's routes answer the parent only, and her game stays as it was.
    const bare = await app.request(
      `/api/parent/studio/sandbox/play/child/api/session/${out.sessionId}/next`,
      { headers: { cookie: sandboxCookie } },
    );
    expect(bare.status).toBe(401);
    expect(await count("events")).toBe(gameEvents);
  });
});
