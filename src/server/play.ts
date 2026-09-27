// The play API's first slice (TSK-0300, SPC-0030): start a session, get the
// next task, answer it. The server decides every verdict and outcome; every
// write goes through appendEvents and commits before the reply.
import { randomUUID } from "node:crypto";
import type { Context, Hono } from "hono";
import type { z } from "zod";
import { getCookie } from "hono/cookie";
import { appendEvents } from "../engine/events/append.js";
import {
  itemEvents,
  sessionEvents,
  type StoredEvent,
} from "../engine/events/read.js";
import {
  AnswerIn,
  AnswerOut,
  Room,
  SessionStartIn,
  SessionStartOut,
} from "../shared/api.js";
import { t } from "../shared/i18n.js";
import type { Db } from "./database.js";
import { DEVICE_COOKIE, deviceForToken } from "./devices.js";
import { send } from "./send.js";
import {
  ROOM_LENGTH,
  STANDIN_TASKS,
  standinVerdict,
  taskSolution,
  taskText,
  type Verdict,
} from "./standin.js";

type Outcome = "clean" | "alt";

interface ItemShown {
  itemId: string;
  view: Room["view"];
  attemptNo: 1 | 2;
  correctAnswer: string;
  shortSolution: string[];
}

const payloadOf = <T>(e: StoredEvent): T => e.payload as T;

function device(db: Db, c: Context): string | Response {
  const found = deviceForToken(db, getCookie(c, DEVICE_COOKIE));
  return found.ok ? found.deviceId : c.json({ error: found.error }, 401);
}

function roomFor(shown: ItemShown, slot: number): z.input<typeof Room> {
  return {
    kind: "room",
    itemId: shown.itemId,
    view: shown.view,
    input: { kind: "integer" },
    slot,
    roomLength: ROOM_LENGTH,
    attemptNo: shown.attemptNo,
    threads: 0,
    hintLevels: [],
  };
}

export function mountPlay(app: Hono, db: Db): void {
  app.post("/api/session/start", async (c) => {
    const deviceId = device(db, c);
    if (deviceId instanceof Response) return deviceId;
    const body = SessionStartIn.safeParse(await c.req.json());
    if (!body.success) return c.json({ error: "bad_request" }, 400);
    const sessionId = randomUUID();
    appendEvents(db, [
      {
        type: "session_started",
        v: 1,
        payload: { sessionId, mode: body.data.mode },
        origin: { deviceId, clientMs: Date.now() },
        sessionId,
      },
    ]);
    return send(c, SessionStartOut, { sessionId });
  });

  app.get("/api/session/:id/next", (c) => {
    const deviceId = device(db, c);
    if (deviceId instanceof Response) return deviceId;
    const sessionId = c.req.param("id");
    const log = sessionEvents(db, sessionId);
    if (!log.some((e) => e.type === "session_started")) {
      return c.json({ error: "session_unknown" }, 404);
    }
    const shown = log
      .filter((e) => e.type === "item_shown")
      .map((e) => payloadOf<ItemShown>(e));
    const firsts = shown.filter((s) => s.attemptNo === 1);
    const answered = new Set(
      log
        .filter((e) => e.type === "verdict")
        .map((e) => payloadOf<{ itemId: string }>(e).itemId),
    );
    // An open task is shown again as it was, never replaced.
    const open = firsts.find((s) => !answered.has(s.itemId));
    if (open)
      return send(c, Room, roomFor(open, firsts.indexOf(open) % ROOM_LENGTH));

    const index = firsts.length;
    const task = STANDIN_TASKS[index % STANDIN_TASKS.length];
    if (!task) return c.json({ error: "no_task" }, 500);
    const item: ItemShown = {
      itemId: randomUUID(),
      view: {
        locale: "ru",
        text: taskText(task),
        svg: null,
        options: null,
        terms: [],
      },
      attemptNo: 1,
      correctAnswer: task.answer,
      shortSolution: taskSolution(task),
    };
    appendEvents(db, [
      {
        type: "item_shown",
        v: 1,
        payload: {
          ...item,
          templateId: "standin",
          templateVersion: 1,
          seed: `standin-${index}`,
          params: task.params,
          node: "standin",
          subtype: `task-${task.n}`,
          purpose: "standin",
        },
        origin: { deviceId, clientMs: Date.now() },
        sessionId,
      },
    ]);
    return send(c, Room, roomFor(item, index % ROOM_LENGTH));
  });

  app.post("/api/session/:id/answer", async (c) => {
    const started = performance.now();
    const deviceId = device(db, c);
    if (deviceId instanceof Response) return deviceId;
    const sessionId = c.req.param("id");
    const body = AnswerIn.safeParse(await c.req.json());
    if (!body.success) return c.json({ error: "bad_request" }, 400);
    const a = body.data;

    const shownEvent = itemEvents(db, a.itemId).find(
      (e) => e.type === "item_shown",
    );
    if (!shownEvent) return c.json({ error: "item_unknown" }, 404);
    const shown = payloadOf<ItemShown>(shownEvent);

    // The server checks `raw` itself and ignores the client's `parsed`.
    const verdict: Verdict = standinVerdict(
      a.raw,
      a.dontKnow,
      shown.correctAnswer,
    );
    const outcome: Outcome = verdict === "correct" ? "clean" : "alt";

    // The streak counts clean first attempts in a row, this one included.
    const firstOutcomes = sessionEvents(db, sessionId)
      .filter((e) => e.type === "verdict")
      .map((e) => payloadOf<{ attemptNo: number; outcome: Outcome }>(e))
      .filter((v) => v.attemptNo === 1)
      .map((v) => v.outcome);
    if (shown.attemptNo === 1) firstOutcomes.push(outcome);
    let streak = 0;
    for (
      let i = firstOutcomes.length - 1;
      i >= 0 && firstOutcomes[i] === "clean";
      i--
    )
      streak++;

    const origin = { deviceId, clientMs: Date.now() };
    appendEvents(db, [
      {
        type: "attempt_submitted",
        v: 1,
        payload: {
          itemId: a.itemId,
          attemptNo: shown.attemptNo,
          input: a.input,
          answer: {
            entered: a.raw,
            parsed: a.raw.trim() === "" ? null : a.raw.trim(),
          },
          assisted: false,
          hintLevel: 0,
        },
        origin,
        sessionId,
      },
      {
        type: "verdict",
        v: 1,
        payload: {
          itemId: a.itemId,
          attemptNo: shown.attemptNo,
          verdict,
          outcome,
          trapId: null,
          errorClass: null,
          steps: [],
        },
        origin,
        sessionId,
      },
    ]);

    const reply: z.input<typeof AnswerOut> = {
      ...(shown.attemptNo === 1 ? { outcome } : {}),
      streak,
      grants: [],
      threads: 0,
      feedback: { correctAnswer: shown.correctAnswer },
      shortSolution: shown.shortSolution,
      battleLine: t(`battle.${outcome}.1`),
    };
    c.header(
      "Server-Timing",
      `app;dur=${(performance.now() - started).toFixed(2)}`,
    );
    return send(c, AnswerOut, reply);
  });
}
