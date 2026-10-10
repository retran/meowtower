// TSK-0370 on screen: a second browser context that resumes finds the same
// task, step, scene line and chest options with no new request to the
// storyteller (REQ-0208, REQ-0216, REQ-0218), and the client sends a typed
// draft at most once every 10 seconds (REQ-0208). The stand-in adventure shows
// its scene and its chest after the 60th task, so each test reaches them
// through the API of the first context and ends the adventure afterwards,
// because the e2e server's one open adventure belongs to every later test.
import Database from "better-sqlite3";
import type { APIRequestContext, Browser, Page } from "@playwright/test";
import { expect, test } from "./fixtures.js";

const DB = "/tmp/meowtower-e2e.sqlite";
const PARENT = "http://127.0.0.1:3925";

async function ready(page: Page, route: string): Promise<void> {
  await page.goto("about:blank");
  await page.goto(`/#${route}`);
  await expect(page.locator("body")).toHaveAttribute("data-screen", route);
  await expect(page.locator("[data-busy]")).toHaveCount(0);
}

async function pairDevice(page: Page): Promise<void> {
  const { code } = (await (
    await page.request.post(`${PARENT}/pair-code`)
  ).json()) as { code: string };
  await ready(page, "/pair");
  await page.locator("#pair-code").fill(code);
  await page.locator('[data-action="pair-submit"]').click();
  await expect(page.getByRole("status")).toHaveText(/Готово/);
}

/** Every field a reply of the play API can carry, as the tests read them. */
interface Packet {
  kind: string;
  sessionId: string;
  itemId: string;
  sceneId: string;
  chestId: string;
  attemptNo: number;
  hintLevels: number[];
  view: { text: string };
  lines: { speaker: string; text: string }[];
  branches: { choiceId: string }[];
  options: { rewardId: string }[];
}

let counter = Date.now();
const input = {
  firstKeyMs: 500,
  submittedMs: 1500,
  edits: 0,
  erasures: 0,
  keyPresses: 1,
  focusLosses: { count: 0, totalMs: 0 },
  method: "keypad",
};

/** The play API as the first context calls it, with the context's device cookie. */
function api(request: APIRequestContext) {
  const post = async (path: string, body: object = {}): Promise<Packet> => {
    const res = await request.post(path, {
      data: { ...body, clientSeq: ++counter },
    });
    return res.json();
  };
  const get = async (path: string): Promise<Packet> =>
    (await request.get(path)).json();
  return {
    post,
    get,
    /** A new session: the tap that takes the lease back. */
    start: async (): Promise<string> =>
      (await post("/api/session/start", { mode: "daily" })).sessionId,
    next: (s: string) => get(`/api/session/${s}/next`),
    answer: (s: string, itemId: string) =>
      post(`/api/session/${s}/answer`, {
        itemId,
        raw: "7",
        dontKnow: false,
        input,
      }),
    /** Answers tasks until the scene arrives. */
    toScene: async (s: string): Promise<Packet> => {
      for (;;) {
        const packet = await get(`/api/session/${s}/next`);
        if (packet.kind !== "room") return packet;
        await post(`/api/session/${s}/answer`, {
          itemId: packet.itemId,
          raw: "7",
          dontKnow: false,
          input,
        });
      }
    },
    /** Ends the adventure the way a player would: a choice, a pick, the end. */
    finish: async (s: string): Promise<void> => {
      for (let i = 0; i < 200; i++) {
        const packet = await get(`/api/session/${s}/next`);
        if (packet.kind === "end") return;
        if (packet.kind === "room")
          await post(`/api/session/${s}/answer`, {
            itemId: packet.itemId,
            raw: "7",
            dontKnow: false,
            input,
          });
        else if (packet.kind === "scene")
          await post(`/api/session/${s}/scene/input`, {
            kind: "choice",
            sceneId: packet.sceneId,
            choiceId: packet.branches[0]?.choiceId,
          });
        else if (packet.kind === "chest")
          await post(`/api/session/${s}/chest`, {
            chestId: packet.chestId,
            rewardId: packet.options[0]?.rewardId,
          });
      }
      throw new Error("the adventure did not end");
    },
  };
}

const count = (type: string): number => {
  const db = new Database(DB, { readonly: true });
  const row = db
    .prepare("SELECT COUNT(*) AS n FROM events WHERE type = ?")
    .get(type) as { n: number };
  db.close();
  return row.n;
};

const draftsOf = (sessionId: string): string[] => {
  const db = new Database(DB, { readonly: true });
  const rows = db
    .prepare(
      "SELECT payload FROM events WHERE session_id = ? AND type = 'text_draft_saved' ORDER BY seq",
    )
    .all(sessionId) as { payload: string }[];
  db.close();
  return rows.map((r) => (JSON.parse(r.payload) as { text: string }).text);
};

/** A second browser context on its own paired device, resuming the adventure. */
async function secondDevice(browser: Browser): Promise<Page> {
  const context = await browser.newContext();
  const second = await context.newPage();
  await pairDevice(second);
  return second;
}

test("REQ-0208: a second context resumes each attempt state on the same task and step", async ({
  page,
  browser,
}) => {
  await pairDevice(page);
  const a = api(page.request);
  const second = await secondDevice(browser);
  const llm = count("llm_call");

  let s = await a.start();
  const first = await a.next(s);
  expect(first.kind).toBe("room");

  /** The first context's packet for the step, then the second context's. */
  const resumed = async (): Promise<{ packet: Packet; text: string }> => {
    const reply = second.waitForResponse("**/api/session/*/next");
    await ready(second, "/play");
    const packet = await (await reply).json();
    const text = await second.locator(".play .task").innerText();
    return { packet, text };
  };

  // shown
  let there = await resumed();
  expect(there.packet).toEqual(first);
  expect(there.text).toBe(first.view.text);

  // hint_shown
  s = await a.start();
  await a.post(`/api/item/${first.itemId}/hint`, { level: 1 });
  const hinted = await a.next(s);
  there = await resumed();
  expect(there.packet).toEqual(hinted);
  expect(there.packet.hintLevels).toEqual([1]);

  // explanation_pending
  s = await a.start();
  await a.post(`/api/item/${first.itemId}/explain`);
  there = await resumed();
  expect(there.packet.itemId).toBe(first.itemId);

  // answered_feedback_pending and solution_shown: the verdict is in the log
  s = await a.start();
  await a.answer(s, first.itemId);
  const afterAnswer = await a.next(s);
  there = await resumed();
  expect(there.packet).toEqual(afterAnswer);
  expect(there.packet.itemId).not.toBe(first.itemId);

  // second_attempt_shown
  s = await a.start();
  const twin = await a.post(`/api/item/${first.itemId}/second-attempt`);
  expect(twin.attemptNo).toBe(2);
  there = await resumed();
  expect(there.packet).toEqual(await a.next(s));
  expect(there.packet.itemId).toBe(twin.itemId);

  expect(count("llm_call")).toBe(llm);
  await a.finish(await a.start());
});

test("REQ-0216: a second context resumes the scene on the same line and branches", async ({
  page,
  browser,
}) => {
  await pairDevice(page);
  const a = api(page.request);
  const second = await secondDevice(browser);
  const llm = count("llm_call");
  const prepared = count("scene_prepared");

  const s = await a.start();
  const scene = await a.toScene(s);
  expect(scene.kind).toBe("scene");
  expect(count("scene_prepared")).toBe(prepared + 1);

  const reply = second.waitForResponse("**/api/session/*/next");
  await ready(second, "/play");
  expect(await (await reply).json()).toEqual(scene);
  for (const line of scene.lines)
    await expect(second.locator(".play .scene")).toContainText(line.text);
  await expect(second.locator("[data-choice-id]")).toHaveCount(
    scene.branches.length,
  );

  // The second context asked for no new scene and no model call.
  expect(count("scene_prepared")).toBe(prepared + 1);
  expect(count("llm_call")).toBe(llm);
  await a.finish(await a.start());
});

test("REQ-0218: a second context resumes the chest with the same three options", async ({
  page,
  browser,
}) => {
  await pairDevice(page);
  const a = api(page.request);
  const second = await secondDevice(browser);
  const offered = count("chest_offered");

  const s = await a.start();
  const scene = await a.toScene(s);
  await a.post(`/api/session/${s}/scene/input`, {
    kind: "choice",
    sceneId: scene.sceneId,
    choiceId: scene.branches[0]?.choiceId,
  });
  const chest = await a.next(s);
  expect(chest.kind).toBe("chest");
  expect(chest.options).toHaveLength(3);

  const reply = second.waitForResponse("**/api/session/*/next");
  await ready(second, "/play");
  expect(await (await reply).json()).toEqual(chest);
  const shown = await second
    .locator("[data-reward-id]")
    .evaluateAll((nodes) =>
      nodes.map((n) => (n as HTMLElement).dataset["rewardId"]),
    );
  expect(shown).toEqual(
    chest.options.map((o: { rewardId: string }) => o.rewardId),
  );
  expect(count("chest_offered")).toBe(offered + 1);
  await a.finish(await a.start());
});

test("REQ-0208: the draft typed in a scene returns as last held and is sent at most once every 10 seconds", async ({
  page,
}) => {
  await pairDevice(page);
  const a = api(page.request);
  const s0 = await a.start();
  const scene = await a.toScene(s0);
  expect(scene.kind).toBe("scene");

  const sent: string[] = [];
  page.on("request", (r) => {
    if (!r.url().endsWith("/scene/input")) return;
    const body = r.postDataJSON() as { kind: string; text?: string };
    if (body.kind === "draft") sent.push(body.text ?? "");
  });
  await page.clock.install({ time: Date.now() });
  const resumedOut = page.waitForResponse("**/api/adventure/resume");
  await ready(page, "/play");
  const { sessionId } = (await (await resumedOut).json()) as {
    sessionId: string;
  };
  const field = page.locator("#scene-draft");
  await expect(field).toBeVisible();

  await field.pressSequentially("Я");
  await expect.poll(() => sent.length).toBe(1);
  await field.pressSequentially(" иду");
  await page.clock.fastForward(9_000);
  expect(sent).toEqual(["Я"]);
  await page.clock.fastForward(1_500);
  await expect.poll(() => sent.length).toBe(2);
  expect(sent[1]).toBe("Я иду");
  expect(draftsOf(sessionId)).toEqual(["Я", "Я иду"]);

  // Leave and come back: the draft is the one the log last held.
  await page.goto("about:blank");
  await ready(page, "/play");
  await expect(page.locator("#scene-draft")).toHaveValue("Я иду");
  await a.finish(await a.start());
});
