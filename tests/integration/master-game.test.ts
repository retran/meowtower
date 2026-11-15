// REQ-8266, REQ-8268, REQ-8272 (ADR-3270, ADR-3280): the child's game plays an adventure the parent approved with
// the Master, with no scenario it plays plain tasks, and every step comes from the log. A fake Master stands in
// for the model. Each test plays on a database of its own, because the open adventure belongs to the whole game.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { createApp } from "../../src/server/app.js";
import { openDatabase, type Db } from "../../src/server/database.js";
import { registerDevice } from "../../src/server/devices.js";
import {
  createNode,
  getNode,
  setStatus,
} from "../../src/server/studio/store.js";
import { End, Room, Scene } from "../../src/shared/api.js";
import { MasterFailed } from "../../src/story/master-gateway.js";
import type { MasterReply, MasterRequest } from "../../src/story/turn.js";

const root = mkdtempSync(join(tmpdir(), "meowtower-master-game-"));
const opened: Db[] = [];
afterAll(async () => {
  for (const db of opened) await db.close();
  rmSync(root, { recursive: true, force: true });
});

const input = {
  firstKeyMs: 500,
  submittedMs: 1500,
  edits: 0,
  erasures: 0,
  keyPresses: 1,
  focusLosses: { count: 0, totalMs: 0 },
  method: "keypad" as const,
};

let worlds = 0;
async function world(approve: boolean) {
  const db = await openDatabase(join(root, `w${++worlds}.sqlite`));
  opened.push(db);
  let clock = Date.parse("2026-11-10T12:00:00Z");
  const now = () => (clock += 100);
  const asked: MasterRequest[] = [];
  const replies: (MasterReply | "fail")[] = [];
  const app = await createApp({
    db,
    now,
    tasks: "registry",
    master: () => (request) => {
      asked.push(request);
      const reply = replies.shift();
      if (!reply) throw new Error("the fake Master has no reply left");
      if (reply === "fail") throw new MasterFailed("provider_failed");
      return Promise.resolve(reply);
    },
  });
  const campaign = await createNode(db, now(), {
    level: "campaign",
    parentId: null,
    title: "c",
    body: {},
  });
  const arc = await createNode(db, now(), {
    level: "arc",
    parentId: campaign.id,
    title: "a",
    body: {},
  });
  const adventure = await createNode(db, now(), {
    level: "adventure",
    parentId: arc.id,
    title: "The fog adventure",
    body: { premise: "Fog took the boats." },
  });
  const quayId = "quay-encounter";
  const gate = await createNode(db, now(), {
    level: "encounter",
    parentId: adventure.id,
    title: "The gate",
    body: {
      situation: "A gate in the fog.",
      exits: [{ when: "Go to the quay", next: quayId }],
    },
  });
  const quay = await createNode(db, now(), {
    level: "encounter",
    parentId: adventure.id,
    title: "The quay",
    body: { situation: "The quay is empty.", exits: [] },
    id: quayId,
  });
  if (approve) await setStatus(db, now(), adventure.id, "approved");
  const token = await registerDevice(db, "tablet");
  let seq = 0;
  const headers = {
    cookie: `meowtower_device=${token}`,
    "content-type": "application/json",
  };
  const post = (path: string, body: object = {}) =>
    app.request(path, {
      method: "POST",
      headers,
      body: JSON.stringify({ ...body, clientSeq: ++seq }),
    });
  const sessionId = (
    (await (await post("/api/session/start", { mode: "daily" })).json()) as {
      sessionId: string;
    }
  ).sessionId;
  const next = async (): Promise<unknown> =>
    await (
      await app.request(`/api/session/${sessionId}/next`, { headers })
    ).json();
  const say = (sceneId: string, text: string) =>
    post(`/api/session/${sessionId}/scene/input`, {
      kind: "text",
      sceneId,
      text,
    });
  const pick = (sceneId: string, choiceId: string) =>
    post(`/api/session/${sessionId}/scene/input`, {
      kind: "choice",
      sceneId,
      choiceId,
    });
  const count = async (type: string): Promise<number> =>
    Number(
      (
        (await db
          .prepare("SELECT count(*) AS n FROM events WHERE type = ?")
          .get(type)) as { n: number }
      ).n,
    );
  return {
    db,
    adventure,
    gate,
    quay,
    asked,
    replies,
    post,
    next,
    say,
    pick,
    count,
    sessionId,
  };
}

describe("REQ-8272: with no approved scenario the game plays plain tasks", () => {
  it("shows a task, starts no scenario and leaves the draft adventure alone", async () => {
    const w = await world(false);
    Room.parse(await w.next());
    expect(await w.count("scenario_started")).toBe(0);
    expect((await getNode(w.db, w.adventure.id))?.status).toBe("draft");
  });
});

describe("REQ-8266, REQ-8268: an approved adventure plays with the Master", () => {
  it("opens at the first encounter and marks the adventure as playing", async () => {
    const w = await world(true);
    const scene = Scene.parse(await w.next());
    expect(scene.sceneId).toBe(w.gate.id);
    expect(scene.lines[0]?.text).toBe("A gate in the fog.");
    expect(scene.branches.map((b) => b.text)).toEqual(["Go to the quay"]);
    expect(await w.count("scenario_started")).toBe(1);
    expect((await getNode(w.db, w.adventure.id))?.status).toBe("playing");
  });

  it("takes her words as a turn and offers the starters for the field", async () => {
    const w = await world(true);
    const first = Scene.parse(await w.next());
    w.replies.push({
      text: "The gate creaks and a lantern swings behind it.",
      calls: [],
      starters: ["Lift the lantern", "Knock twice"],
    });
    expect((await w.say(first.sceneId, "I look at the gate")).status).toBe(200);
    const scene = Scene.parse(await w.next());
    expect(w.asked).toHaveLength(1);
    expect(w.asked[0]?.said).toBe("I look at the gate");
    expect(w.asked[0]?.encounter).toBe(w.gate.id);
    expect(scene.lines[0]?.text).toBe(
      "The gate creaks and a lantern swings behind it.",
    );
    // The starters go to the field and never send (REQ-6210); the buttons are the plot's exits.
    expect(scene.starters).toEqual(["Lift the lantern", "Knock twice"]);
    expect(scene.branches.map((b) => b.text)).toEqual(["Go to the quay"]);
    // The same scene shows again with no new turn.
    expect(Scene.parse(await w.next())).toEqual(scene);
    expect(w.asked).toHaveLength(1);
  });

  it("goes on to the next encounter through an exit with no turn", async () => {
    const w = await world(true);
    const first = Scene.parse(await w.next());
    await w.pick(first.sceneId, w.quay.id);
    const scene = Scene.parse(await w.next());
    expect(scene.sceneId).toBe(w.quay.id);
    expect(w.asked).toHaveLength(0);
  });

  it("shows a check's scene first, then the task, then tells the outcome", async () => {
    const w = await world(true);
    const first = Scene.parse(await w.next());
    w.replies.push({
      text: "The rope is wet. Can she cross it?",
      calls: [
        {
          tool: "request_check",
          input: { tried: "crosses the rope", hard: "it is slippery" },
        },
      ],
    });
    await w.say(first.sceneId, "I cross the rope");
    const scene = Scene.parse(await w.next());
    expect(scene.branches.map((b) => b.choiceId)).toEqual(["continue"]);
    await w.pick(scene.sceneId, "continue");
    const room = Room.parse(await w.next());
    expect(w.asked).toHaveLength(1);
    await w.post(`/api/session/${w.sessionId}/answer`, {
      itemId: room.itemId,
      raw: "7",
      dontKnow: false,
      input,
    });
    w.replies.push({ text: "She is across.", calls: [] });
    const told = Scene.parse(await w.next());
    expect(told.lines[0]?.text).toBe("She is across.");
    expect(w.asked).toHaveLength(2);
    expect(["success", "cost", "twist"]).toContain(w.asked[1]?.checkResult);
    expect(w.asked[1]?.said).toBe("I cross the rope");
  });

  it("asks her to go on when the Master fails, and takes the same turn again", async () => {
    const w = await world(true);
    const first = Scene.parse(await w.next());
    w.replies.push("fail");
    await w.say(first.sceneId, "I wave");
    const retry = Scene.parse(await w.next());
    expect(retry.branches.map((b) => b.choiceId)).toEqual(["continue"]);
    await w.pick(retry.sceneId, "continue");
    w.replies.push({ text: "Someone waves back.", calls: [] });
    const scene = Scene.parse(await w.next());
    expect(scene.lines[0]?.text).toBe("Someone waves back.");
    expect(w.asked.map((r) => r.said)).toEqual(["I wave", "I wave"]);
  });

  it("ends the adventure at a leaf encounter and marks it played", async () => {
    const w = await world(true);
    const first = Scene.parse(await w.next());
    await w.pick(first.sceneId, w.quay.id);
    const quay = Scene.parse(await w.next());
    w.replies.push({
      text: "The boats come home out of the fog.",
      calls: [{ tool: "end_scene", input: {} }],
    });
    await w.say(quay.sceneId, "I wait");
    const finale = Scene.parse(await w.next());
    expect(finale.branches.map((b) => b.choiceId)).toEqual(["continue"]);
    await w.pick(finale.sceneId, "continue");
    End.parse(await w.next());
    expect(await w.count("adventure_completed")).toBe(1);
    expect((await getNode(w.db, w.adventure.id))?.status).toBe("played");
  });
});
