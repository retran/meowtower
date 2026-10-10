// TSK-0370: scenes, free-text drafts, chests and pending rewards come from the
// log alone (REQ-0208), a resumed scene makes no new request to the storyteller
// (REQ-0216), and a chest reopens with its three options (REQ-0218). The
// stand-in adventure shows its scene and its chest at the finale, after the
// 60th task. Each test plays on a database of its own, because the open
// adventure belongs to the whole game.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { adventureEvents } from "../../src/engine/events/read.js";
import { resumeFromLog } from "../../src/engine/projections/resume.js";
import { createApp } from "../../src/server/app.js";
import { openDatabase, type Db } from "../../src/server/database.js";
import { registerDevice } from "../../src/server/devices.js";
import { STANDIN_ADVENTURE_TASKS } from "../../src/server/standin.js";
import { Chest, ResumeOut, Room, Scene } from "../../src/shared/api.js";

const root = mkdtempSync(join(tmpdir(), "meowtower-scene-resume-"));
const opened: Db[] = [];
afterAll(() => {
  for (const db of opened) db.close();
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

type Who = "tablet" | "computer";

let worlds = 0;
function world() {
  const db = openDatabase(join(root, `w${++worlds}.sqlite`));
  opened.push(db);
  let clock = 0;
  const app = createApp({ db, now: () => (clock += 100) });
  const tokens = {
    tablet: registerDevice(db, "tablet"),
    computer: registerDevice(db, "computer"),
  };
  const seqs = { tablet: 0, computer: 0 };
  const headers = (who: Who) => ({
    cookie: `meowtower_device=${tokens[who]}`,
    "content-type": "application/json",
  });
  const post = async (who: Who, path: string, body: object = {}) =>
    app.request(path, {
      method: "POST",
      headers: headers(who),
      body: JSON.stringify({ ...body, clientSeq: ++seqs[who] }),
    });
  /** A request with the body as given, clientSeq included, to repeat one. */
  const resend = async (who: Who, path: string, body: object) =>
    app.request(path, {
      method: "POST",
      headers: headers(who),
      body: JSON.stringify(body),
    });
  const get = async (who: Who, path: string) =>
    app.request(path, { headers: headers(who) });
  const start = async (who: Who): Promise<string> =>
    (
      (await (
        await post(who, "/api/session/start", { mode: "daily" })
      ).json()) as { sessionId: string }
    ).sessionId;
  const next = async (who: Who, sessionId: string): Promise<unknown> =>
    (await get(who, `/api/session/${sessionId}/next`)).json();
  const resume = async (who: Who) =>
    ResumeOut.parse(await (await post(who, "/api/adventure/resume")).json());
  const events = (type: string) =>
    (
      db
        .prepare("SELECT payload FROM events WHERE type = ? ORDER BY seq")
        .all(type) as { payload: string }[]
    ).map((r) => JSON.parse(r.payload) as Record<string, unknown>);
  const adventureId = (): string =>
    (
      db.prepare("SELECT adventure_id FROM adventures").get() as {
        adventure_id: string;
      }
    ).adventure_id;
  const stored = (): unknown => {
    const row = db
      .prepare("SELECT point FROM resume_snapshot WHERE adventure_id = ?")
      .get(adventureId()) as { point: string } | undefined;
    return row ? JSON.parse(row.point) : null;
  };
  /** Plays the stand-in adventure's 60 tasks and returns the session. */
  const toFinale = async (who: Who): Promise<string> => {
    const sessionId = await start(who);
    for (let i = 0; i < STANDIN_ADVENTURE_TASKS; i++) {
      const room = Room.parse(await next(who, sessionId));
      await post(who, `/api/session/${sessionId}/answer`, {
        itemId: room.itemId,
        raw: "7",
        dontKnow: false,
        input,
      });
    }
    return sessionId;
  };
  return {
    db,
    post,
    resend,
    get,
    start,
    next,
    resume,
    events,
    adventureId,
    stored,
    toFinale,
  };
}

const sceneOf = async (
  w: ReturnType<typeof world>,
  who: Who,
  sessionId: string,
) => Scene.parse(await w.next(who, sessionId));

describe("REQ-0208, REQ-0216: a scene resumes from the log with no new storyteller request", () => {
  it("shows the scene after the last task and the same scene again on the next request", async () => {
    const w = world();
    const s = await w.toFinale("tablet");
    const scene = await sceneOf(w, "tablet", s);
    expect(scene.lines.length).toBeGreaterThan(0);
    expect(scene.branches.length).toBeGreaterThan(1);
    expect(scene.draft).toBeNull();
    expect(await w.next("tablet", s)).toEqual(scene);
    expect(w.events("scene_prepared")).toHaveLength(1);
  });

  it("returns the prepared scene to a device that resumes, and logs no llm_call", async () => {
    const w = world();
    const s = await w.toFinale("tablet");
    const scene = await sceneOf(w, "tablet", s);
    await w.post("tablet", `/api/session/${s}/pause`, { reason: "leave" });
    const before = w.events("llm_call").length;
    const out = await w.resume("computer");
    expect(out.scene).toEqual(scene);
    expect(out.chest).toBeNull();
    expect(await w.next("computer", out.sessionId)).toEqual(scene);
    expect(w.events("scene_prepared")).toHaveLength(1);
    expect(w.events("llm_call")).toHaveLength(before);
  });

  it("keeps the scene's lines and branches in scene_prepared, as the packet shows them", async () => {
    const w = world();
    const s = await w.toFinale("tablet");
    const scene = await sceneOf(w, "tablet", s);
    expect(w.events("scene_prepared")).toEqual([
      {
        sceneId: scene.sceneId,
        lines: scene.lines,
        branches: scene.branches,
      },
    ]);
  });
});

describe("REQ-0208: a free-text draft returns as text_draft_saved last held it", () => {
  it("logs each draft and returns the latest to a device that resumes", async () => {
    const w = world();
    const s = await w.toFinale("tablet");
    const scene = await sceneOf(w, "tablet", s);
    for (const text of ["Я", "Я иду", "Я иду налево"]) {
      const res = await w.post("tablet", `/api/session/${s}/scene/input`, {
        kind: "draft",
        sceneId: scene.sceneId,
        text,
      });
      expect(res.status).toBe(200);
    }
    expect(w.events("text_draft_saved").map((e) => e["text"])).toEqual([
      "Я",
      "Я иду",
      "Я иду налево",
    ]);
    await w.post("tablet", `/api/session/${s}/pause`, { reason: "leave" });
    const out = await w.resume("computer");
    expect(out.scene?.draft).toBe("Я иду налево");
    expect(Scene.parse(await w.next("computer", out.sessionId)).draft).toBe(
      "Я иду налево",
    );
  });

  it("appends a repeated draft request once", async () => {
    const w = world();
    const s = await w.toFinale("tablet");
    const scene = await sceneOf(w, "tablet", s);
    const body = {
      kind: "draft",
      sceneId: scene.sceneId,
      text: "Я иду",
      clientSeq: 9001,
    };
    const first = await w.resend(
      "tablet",
      `/api/session/${s}/scene/input`,
      body,
    );
    const again = await w.resend(
      "tablet",
      `/api/session/${s}/scene/input`,
      body,
    );
    expect(again.status).toBe(200);
    expect(await again.json()).toEqual(await first.json());
    expect(w.events("text_draft_saved")).toHaveLength(1);
  });

  it("refuses a draft for a scene that is not open", async () => {
    const w = world();
    const s = await w.toFinale("tablet");
    await sceneOf(w, "tablet", s);
    const res = await w.post("tablet", `/api/session/${s}/scene/input`, {
      kind: "draft",
      sceneId: "no-such-scene",
      text: "x",
    });
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ error: "scene_not_open" });
    expect(w.events("text_draft_saved")).toHaveLength(0);
  });

  it("clears the draft once the scene is answered, and shows the chest next", async () => {
    const w = world();
    const s = await w.toFinale("tablet");
    const scene = await sceneOf(w, "tablet", s);
    await w.post("tablet", `/api/session/${s}/scene/input`, {
      kind: "draft",
      sceneId: scene.sceneId,
      text: "Я иду",
    });
    const done = await w.post("tablet", `/api/session/${s}/scene/input`, {
      kind: "choice",
      sceneId: scene.sceneId,
      choiceId: scene.branches[0]?.choiceId,
    });
    expect(done.status).toBe(200);
    expect(w.events("choice_made")).toHaveLength(1);
    const out = await w.resume("computer");
    expect(out.scene).toBeNull();
    expect(
      Chest.parse(await w.next("computer", out.sessionId)).options,
    ).toHaveLength(3);
  });
});

describe("REQ-0218: a chest reopens with the same three options", () => {
  it("offers the chest once and returns its options to a device that resumes", async () => {
    const w = world();
    const s = await w.toFinale("tablet");
    const scene = await sceneOf(w, "tablet", s);
    await w.post("tablet", `/api/session/${s}/scene/input`, {
      kind: "choice",
      sceneId: scene.sceneId,
      choiceId: scene.branches[0]?.choiceId,
    });
    const chest = Chest.parse(await w.next("tablet", s));
    expect(chest.options).toHaveLength(3);
    await w.post("tablet", `/api/session/${s}/pause`, { reason: "leave" });
    const out = await w.resume("computer");
    expect(out.chest).toEqual(chest);
    expect(await w.next("computer", out.sessionId)).toEqual(chest);
    expect(w.events("chest_offered")).toHaveLength(1);
    expect(w.events("chest_chosen")).toHaveLength(0);
  });

  it("ends the adventure after the pick", async () => {
    const w = world();
    const s = await w.toFinale("tablet");
    const scene = await sceneOf(w, "tablet", s);
    await w.post("tablet", `/api/session/${s}/scene/input`, {
      kind: "choice",
      sceneId: scene.sceneId,
      choiceId: scene.branches[0]?.choiceId,
    });
    const chest = Chest.parse(await w.next("tablet", s));
    const picked = chest.options[1];
    const res = await w.post("tablet", `/api/session/${s}/chest`, {
      chestId: chest.chestId,
      rewardId: picked?.rewardId,
    });
    expect(res.status).toBe(200);
    expect(w.events("chest_chosen")).toEqual([
      { chestId: chest.chestId, rewardId: picked?.rewardId },
    ]);
    expect(await w.next("tablet", s)).toEqual({ kind: "end" });
  });

  it("refuses a pick that is not among the three options", async () => {
    const w = world();
    const s = await w.toFinale("tablet");
    const scene = await sceneOf(w, "tablet", s);
    await w.post("tablet", `/api/session/${s}/scene/input`, {
      kind: "choice",
      sceneId: scene.sceneId,
      choiceId: scene.branches[0]?.choiceId,
    });
    const chest = Chest.parse(await w.next("tablet", s));
    const res = await w.post("tablet", `/api/session/${s}/chest`, {
      chestId: chest.chestId,
      rewardId: "not-offered",
    });
    expect(res.status).toBe(400);
    expect(w.events("chest_chosen")).toHaveLength(0);
  });
});

describe("REQ-0208: ResumeOut lists only the rewards not yet shown", () => {
  it("drops a grant once the client acknowledged it", async () => {
    const w = world();
    const s = await w.toFinale("tablet");
    const scene = await sceneOf(w, "tablet", s);
    const sceneDone = await w.post("tablet", `/api/session/${s}/scene/input`, {
      kind: "choice",
      sceneId: scene.sceneId,
      choiceId: scene.branches[0]?.choiceId,
    });
    const first = (
      (await sceneDone.json()) as { grants: { rewardId: string }[] }
    ).grants;
    expect(first).toHaveLength(1);
    const ack = await w.post("tablet", `/api/session/${s}/rewards/delivered`, {
      rewardIds: first.map((g) => g.rewardId),
    });
    expect(ack.status).toBe(200);
    const chest = Chest.parse(await w.next("tablet", s));
    const pick = await w.post("tablet", `/api/session/${s}/chest`, {
      chestId: chest.chestId,
      rewardId: chest.options[0]?.rewardId,
    });
    const second = ((await pick.json()) as { grants: { rewardId: string }[] })
      .grants;
    expect(second).toHaveLength(1);
    expect(w.events("rewards_delivered")).toEqual([
      { rewardIds: first.map((g) => g.rewardId) },
    ]);
    await w.post("tablet", `/api/session/${s}/pause`, { reason: "leave" });
    const out = await w.resume("computer");
    expect(out.rewards.map((g) => g.rewardId)).toEqual(
      second.map((g) => g.rewardId),
    );
  });

  it("lists a grant no acknowledgement reached", async () => {
    const w = world();
    const s = await w.toFinale("tablet");
    const scene = await sceneOf(w, "tablet", s);
    await w.post("tablet", `/api/session/${s}/scene/input`, {
      kind: "choice",
      sceneId: scene.sceneId,
      choiceId: scene.branches[0]?.choiceId,
    });
    await w.post("tablet", `/api/session/${s}/pause`, { reason: "leave" });
    const out = await w.resume("computer");
    expect(out.rewards).toHaveLength(1);
    expect(out.rewards[0]?.amount).toBeGreaterThan(0);
  });

  it("appends a repeated acknowledgement once", async () => {
    const w = world();
    const s = await w.toFinale("tablet");
    const scene = await sceneOf(w, "tablet", s);
    const done = await w.post("tablet", `/api/session/${s}/scene/input`, {
      kind: "choice",
      sceneId: scene.sceneId,
      choiceId: scene.branches[0]?.choiceId,
    });
    const ids = (
      (await done.json()) as { grants: { rewardId: string }[] }
    ).grants.map((g) => g.rewardId);
    const body = { rewardIds: ids, clientSeq: 9002 };
    await w.resend("tablet", `/api/session/${s}/rewards/delivered`, body);
    const again = await w.resend(
      "tablet",
      `/api/session/${s}/rewards/delivered`,
      body,
    );
    expect(again.status).toBe(200);
    expect(w.events("rewards_delivered")).toHaveLength(1);
  });
});

describe("REQ-0208: the snapshot's scene, draft, chest and rewards are in the log alone", () => {
  it("equals the point derived from the log after each step and after a rebuild", async () => {
    const w = world();
    let differences = 0;
    let compared = 0;
    const compare = (): void => {
      compared++;
      const derived = resumeFromLog(adventureEvents(w.db, w.adventureId()));
      if (JSON.stringify(w.stored()) !== JSON.stringify(derived)) differences++;
    };
    const s = await w.toFinale("tablet");
    compare();
    const scene = await sceneOf(w, "tablet", s);
    compare();
    await w.post("tablet", `/api/session/${s}/scene/input`, {
      kind: "draft",
      sceneId: scene.sceneId,
      text: "Я иду",
    });
    compare();
    const done = await w.post("tablet", `/api/session/${s}/scene/input`, {
      kind: "choice",
      sceneId: scene.sceneId,
      choiceId: scene.branches[0]?.choiceId,
    });
    compare();
    const granted = (
      (await done.json()) as { grants: { rewardId: string }[] }
    ).grants.map((g) => g.rewardId);
    const chest = Chest.parse(await w.next("tablet", s));
    compare();
    await w.post("tablet", `/api/session/${s}/rewards/delivered`, {
      rewardIds: granted,
    });
    compare();
    await w.post("tablet", `/api/session/${s}/chest`, {
      chestId: chest.chestId,
      rewardId: chest.options[2]?.rewardId,
    });
    compare();
    expect(compared).toBe(7);
    expect(differences).toBe(0);

    // The point holds the scene, the chest and the rewards the log gave.
    const point = w.stored() as {
      scene: unknown;
      chest: unknown;
      rewards: unknown[];
    };
    expect(point.scene).toBeNull();
    expect(point.chest).toBeNull();
    expect(point.rewards).toHaveLength(1);

    const before = w.stored();
    w.db.prepare("DROP TABLE resume_snapshot").run();
    const reopened = openDatabase(w.db.name);
    expect(
      JSON.parse(
        (
          reopened.prepare("SELECT point FROM resume_snapshot").get() as {
            point: string;
          }
        ).point,
      ),
    ).toEqual(before);
    reopened.close();
  });

  it("holds the open scene with its draft and the open chest in a point derived from the log", async () => {
    const w = world();
    const s = await w.toFinale("tablet");
    const scene = await sceneOf(w, "tablet", s);
    await w.post("tablet", `/api/session/${s}/scene/input`, {
      kind: "draft",
      sceneId: scene.sceneId,
      text: "Я иду",
    });
    const point = resumeFromLog(adventureEvents(w.db, w.adventureId()));
    expect(point).toMatchObject({
      scene: { sceneId: scene.sceneId, draft: "Я иду" },
      chest: null,
      rewards: [],
    });
  });
});
