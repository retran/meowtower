// The play API (TSK-0300, TSK-0320, SPC-0030): start a session, get the next
// task, answer it, buy a hint or an explanation, take the second attempt. The
// server decides every verdict and outcome; every write goes through
// appendEvents and commits before the reply.
//
// Repeats: each request's events carry the key `<route>:<deviceId>:<clientSeq>`,
// and a key already in the log appends nothing and rebuilds the first reply
// from the log. Charges: a hint per item and rung, an explanation per item and
// a second attempt per item are found in the log whatever the clientSeq. Each
// route reads the log and appends with no await between, so on Node's single
// thread no other request runs between the check and the write.
import { randomUUID } from "node:crypto";
import type { Context, Hono } from "hono";
import type { z } from "zod";
import { getCookie } from "hono/cookie";
import {
  AdventureClosed,
  appendEvents,
  type NewEvent,
} from "../engine/events/append.js";
import {
  adventureEvents,
  itemEvents,
  requestEvents,
  sessionEvents,
  type StoredEvent,
} from "../engine/events/read.js";
import { resumeFromLog } from "../engine/projections/resume.js";
import { isZone } from "../shared/game-day.js";
import {
  AdventureCurrentOut,
  AnswerIn,
  AnswerOut,
  BreakIn,
  BreakOut,
  Chest,
  ChestIn,
  ChestOut,
  End,
  ExplainOut,
  ExtendOut,
  HeartbeatIn,
  HeartbeatOut,
  HintIn,
  HintOut,
  ItemActionIn,
  PauseIn,
  PauseOut,
  ResumeIn,
  ResumeOut,
  RewardsDeliveredIn,
  RewardsDeliveredOut,
  Room,
  Scene,
  SceneInputIn,
  SceneInputOut,
  SessionStartIn,
  SessionStartOut,
  StopOffer,
} from "../shared/api.js";
import { t } from "../shared/i18n.js";
import type { Db } from "./database.js";
import { DEVICE_COOKIE, deviceForToken, deviceInterface } from "./devices.js";
import { createRateCap } from "./rate.js";
import { send } from "./send.js";
import { mountStream, type Stream } from "./stream.js";
import {
  adventureState,
  openAdventure,
  resumePoint,
  sessionRow,
} from "./lifecycle.js";
import { finishedToday } from "./finish-today.js";
import { sessionZone, wrapUpDue } from "./three-day.js";
import {
  ROOM_LENGTH,
  STANDIN_ADVENTURE_TASKS,
  STANDIN_SECRETS,
  standinEnding,
  STANDIN_CHEST_ID,
  STANDIN_CHEST_OPTIONS,
  STANDIN_SCENE_ID,
  STANDIN_SCENE_REWARD,
  STANDIN_ROOMS_PER_FLOOR,
  STANDIN_TASKS,
  standinPurpose,
  standinScene,
  STANDIN_THREADS,
  standinVerdict,
  taskExplanation,
  taskHint,
  taskOf,
  taskSolution,
  taskText,
  type StandinTask,
  type Verdict,
} from "./standin.js";

type Outcome = "clean" | "alt";

/** How long the server waits for a written explanation before the template. */
export const EXPLAIN_TIMEOUT_MS = 10_000;

export interface PlayOptions {
  now: () => number;
  stream: Stream;
  /** Writes an explanation; ADR-0120's epic supplies it, and until then none does. */
  explainer?: (itemId: string) => Promise<string>;
  /** Runs after a session's end is committed; the server takes a snapshot then (REQ-2526). */
  onSessionEnded?: (sessionId: string) => void;
  /** Sweeps for an expired lease this often; without it only a request does. */
  sweepLeasesMs?: number;
}

interface ItemShown {
  itemId: string;
  view: Room["view"];
  attemptNo: 1 | 2;
  correctAnswer: string;
  shortSolution: string[];
  subtype: string;
  seed: string;
  parentItemId?: string;
}

const payloadOf = <T>(e: StoredEvent): T => e.payload as T;

/** Keys a request's events: the first by the key, the rest by `#1`, `#2`. */
const keyed = (events: NewEvent[], key: string): NewEvent[] =>
  events.map((e, i) => ({ ...e, idemKey: i === 0 ? key : `${key}#${i}` }));

function device(db: Db, c: Context): string | Response {
  const found = deviceForToken(db, getCookie(c, DEVICE_COOKIE));
  return found.ok ? found.deviceId : c.json({ error: found.error }, 401);
}

/** The session's thread stock after the events up to `upTo`. */
function stockAt(log: StoredEvent[], upTo = Infinity): number {
  const spent = log
    .filter((e) => e.type === "thread_spent" && e.seq <= upTo)
    .reduce((sum, e) => sum + payloadOf<{ count: number }>(e).count, 0);
  return STANDIN_THREADS - spent;
}

const hintLevels = (log: StoredEvent[], itemId: string): number[] =>
  log
    .filter((e) => e.type === "hint_shown")
    .map((e) => payloadOf<{ itemId: string; level: number }>(e))
    .filter((h) => h.itemId === itemId)
    .map((h) => h.level);

const firstsOf = (log: StoredEvent[]): ItemShown[] =>
  log
    .filter((e) => e.type === "item_shown")
    .map((e) => payloadOf<ItemShown>(e))
    .filter((s) => s.attemptNo === 1);

const answeredIn = (log: StoredEvent[]): Set<string> =>
  new Set(
    log
      .filter((e) => e.type === "verdict")
      .map((e) => payloadOf<{ itemId: string }>(e).itemId),
  );

/** A room packet; `played` is the adventure's log, where the slot counts from. */
function roomFor(
  shown: ItemShown,
  log: StoredEvent[],
  played: StoredEvent[] = log,
): z.input<typeof Room> {
  const first = shown.parentItemId ?? shown.itemId;
  const slot = firstsOf(played).findIndex((s) => s.itemId === first);
  return {
    kind: "room",
    itemId: shown.itemId,
    view: shown.view,
    input: { kind: "integer" },
    slot: Math.max(slot, 0) % ROOM_LENGTH,
    roomLength: ROOM_LENGTH,
    attemptNo: shown.attemptNo,
    threads: stockAt(log),
    // The rungs bought in an earlier session of the adventure stay shown (REQ-0204).
    hintLevels: hintLevels(played, shown.itemId),
  };
}

/** The answer reply as the log stood when its verdict was written. */
function answerReply(
  log: StoredEvent[],
  verdictSeq: number,
  shown: ItemShown,
): z.input<typeof AnswerOut> {
  const upTo = log.filter((e) => e.seq <= verdictSeq);
  const verdicts = upTo
    .filter((e) => e.type === "verdict")
    .map((e) => payloadOf<{ attemptNo: number; outcome: Outcome }>(e));
  const outcome = verdicts[verdicts.length - 1]?.outcome ?? "alt";
  // The streak counts clean first attempts in a row.
  const firsts = verdicts.filter((v) => v.attemptNo === 1);
  let streak = 0;
  for (let i = firsts.length - 1; i >= 0 && firsts[i]?.outcome === "clean"; i--)
    streak++;
  return {
    ...(shown.attemptNo === 1 ? { outcome } : {}),
    streak,
    grants: [],
    threads: stockAt(upTo),
    feedback: { correctAnswer: shown.correctAnswer },
    shortSolution: shown.shortSolution,
    battleLine: t(`battle.${outcome}.1`),
  };
}

/** The lease runs out after this long without a heartbeat or any request from its holder (SPC-0030). */
export const LEASE_MS = 45_000;

interface Lease {
  deviceId: string;
  sessionId: string;
  beatAt: number;
}

export function mountPlay(
  app: Hono,
  db: Db,
  { now, stream, explainer, onSessionEnded, sweepLeasesMs }: PlayOptions,
): void {
  const allowed = createRateCap(now);

  // One device holds the adventure at a time. The lease is kept in memory and
  // taken only by a tap (`session/start`); every change to it is in the log
  // as `device_lease_taken` and the pause and end it causes.
  let lease: Lease | null = null;
  let tick = 0;

  /** Ends a session as the server, the way a leave does, with the reason `lease_expired`. */
  function endSession(sessionId: string): void {
    const session = sessionRow(db, sessionId);
    if (!session || session.state === "ended") return;
    const finished = session.adventureId
      ? ["complete", "wrapped_up"].includes(
          adventureState(db, session.adventureId)?.state ?? "",
        )
      : false;
    const at = session.adventureId ? { adventureId: session.adventureId } : {};
    const events: NewEvent[] = [];
    if (session.adventureId && !finished)
      events.push({
        type: "adventure_paused",
        v: 1,
        payload: { reason: "lease_expired" },
        origin: "server",
        sessionId,
        ...at,
      });
    events.push({
      type: "session_ended",
      v: 1,
      payload: { sessionId, reason: "lease_expired" },
      origin: "server",
      sessionId,
      ...at,
    });
    appendEvents(db, events);
    onSessionEnded?.(sessionId);
  }

  /** Ends the holder's session when 45 seconds have passed without a sign of life. */
  function expireLease(): void {
    if (!lease) return;
    tick = now();
    if (tick - lease.beatAt < LEASE_MS) return;
    const held = lease;
    lease = null;
    endSession(held.sessionId);
  }

  /** True when another device holds the lease; the holder's own request keeps it alive. */
  function displaced(deviceId: string): boolean {
    if (!lease) return false;
    if (lease.deviceId !== deviceId) return true;
    lease.beatAt = tick;
    return false;
  }

  const leaseMoved = (c: Context): Response =>
    c.json({ error: "lease_moved" }, 409);

  if (sweepLeasesMs)
    setInterval(() => {
      try {
        expireLease();
      } catch {
        // The database closed under the timer, at shutdown.
      }
    }, sweepLeasesMs).unref();

  app.use("/api/*", async (_c, next) => {
    expireLease();
    await next();
  });

  /** A session's envelope: the session and, for a daily one, its adventure. */
  function within(sessionId: string): {
    sessionId: string;
    adventureId?: string;
  } {
    const adventureId = sessionRow(db, sessionId)?.adventureId;
    return adventureId ? { sessionId, adventureId } : { sessionId };
  }

  /** The log play counts in: the adventure's, or the session's for Session 0. */
  const playLog = (sessionId: string): StoredEvent[] => {
    const adventureId = sessionRow(db, sessionId)?.adventureId;
    return adventureId
      ? adventureEvents(db, adventureId)
      : sessionEvents(db, sessionId);
  };

  /** A paired device under the rate cap, for a request that changes state. */
  function writer(c: Context): string | Response {
    const deviceId = device(db, c);
    if (deviceId instanceof Response) return deviceId;
    return allowed(deviceId)
      ? deviceId
      : c.json({ error: "rate_limited" }, 429);
  }

  /** The item's shown event and its session's log, or a 404. */
  function item(
    c: Context,
    itemId: string,
  ):
    | {
        shown: ItemShown;
        sessionId: string;
        log: StoredEvent[];
        shownBy: string;
        shownSeq: number;
      }
    | Response {
    const event = itemEvents(db, itemId).find((e) => e.type === "item_shown");
    if (!event?.sessionId) return c.json({ error: "item_unknown" }, 404);
    return {
      shown: payloadOf<ItemShown>(event),
      sessionId: event.sessionId,
      log: sessionEvents(db, event.sessionId),
      shownBy: event.deviceId,
      shownSeq: event.seq,
    };
  }

  async function deliver(
    sessionId: string,
    seq: number,
    itemId: string,
    task: StandinTask,
  ): Promise<void> {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<null>((resolve) => {
      timer = setTimeout(() => resolve(null), EXPLAIN_TIMEOUT_MS);
    });
    const written = explainer
      ? explainer(itemId).catch(() => null)
      : new Promise<null>(() => undefined);
    const text = await Promise.race([written, timeout]);
    clearTimeout(timer);
    stream.publish(sessionId, {
      type: "explanation_ready",
      seq,
      itemId,
      source: text === null ? "template" : "model",
      text: text ?? taskExplanation(task),
    });
  }

  mountStream(app, stream, (c) => {
    const deviceId = device(db, c);
    return deviceId instanceof Response ? deviceId : null;
  });

  /**
   * Opens a session for the device and moves the lease to it: another device's
   * session ends first. A daily session continues the open adventure and plans
   * one only when none is open (REQ-0226); Session 0 belongs to no adventure.
   */
  function openSession(
    deviceId: string,
    mode: "zero" | "daily",
    key: string,
    zone: string | null,
  ): string {
    const sessionId = randomUUID();
    const origin = { deviceId, clientMs: Date.now() };
    // Another device's tap takes the lease: the old session ends first, then
    // the lease moves (SPC-0030).
    const left = lease && lease.deviceId !== deviceId ? lease : null;
    if (left) endSession(left.sessionId);
    // A daily session continues the open adventure and plans one only when
    // none is open (REQ-0226). Session 0 belongs to no adventure.
    const events: NewEvent[] = [];
    let adventureId: string | undefined;
    if (mode === "daily") {
      adventureId = openAdventure(db)?.adventureId;
      if (!adventureId) {
        adventureId = randomUUID();
        events.push({
          type: "adventure_planned",
          v: 1,
          payload: { adventureId },
          origin,
          adventureId,
        });
      }
    }
    events.push({
      type: "session_started",
      v: 2,
      payload: { sessionId, mode: mode, zone },
      origin,
      sessionId,
      ...(adventureId ? { adventureId } : {}),
    });
    events.push({
      type: "device_lease_taken",
      v: 1,
      payload: { previousDeviceId: lease?.deviceId ?? null },
      origin,
      sessionId,
      ...(adventureId ? { adventureId } : {}),
    });
    const written = appendEvents(db, keyed(events, key));
    tick = now();
    lease = { deviceId, sessionId, beatAt: tick };
    const taken = written[written.length - 1];
    if (left && taken)
      stream.publish(left.sessionId, { type: "lease_moved", seq: taken.seq });
    return sessionId;
  }

  app.post("/api/session/start", async (c) => {
    const deviceId = writer(c);
    if (deviceId instanceof Response) return deviceId;
    const body = SessionStartIn.safeParse(await c.req.json());
    if (!body.success) return c.json({ error: "bad_request" }, 400);
    const key = `session-start:${deviceId}:${body.data.clientSeq}`;
    const { zone } = body.data;
    if (zone !== undefined && !isZone(zone))
      return c.json({ error: "bad_request" }, 400);
    const prior = requestEvents(db, key).find(
      (e) => e.type === "session_started",
    );
    const sessionId = prior
      ? payloadOf<{ sessionId: string }>(prior).sessionId
      : openSession(deviceId, body.data.mode, key, zone ?? null);
    return send(c, SessionStartOut, {
      sessionId,
      adventureId: sessionRow(db, sessionId)?.adventureId ?? null,
      wrapUp: wrapUpOf(sessionId),
    });
  });

  /** True when the session's adventure wraps up today (REQ-0228, REQ-0236). */
  function wrapUpOf(sessionId: string): boolean {
    const adventureId = sessionRow(db, sessionId)?.adventureId;
    if (!adventureId) return false;
    const state = adventureState(db, adventureId)?.state;
    if (state === "complete" || state === "wrapped_up") return false;
    return wrapUpDue(db, adventureId, sessionZone(db, sessionId), Date.now());
  }

  /** Where play stopped, as `ResumeOut` carries it (REQ-0204). */
  function resumeOut(sessionId: string): z.input<typeof ResumeOut> | null {
    const adventureId = sessionRow(db, sessionId)?.adventureId;
    if (!adventureId) return null;
    const point = resumePoint(db, adventureId);
    const index = point?.index ?? 0;
    const roomIndex = Math.floor(index / ROOM_LENGTH);
    return {
      sessionId,
      adventureId,
      floor: Math.floor(roomIndex / STANDIN_ROOMS_PER_FLOOR) + 1,
      room: (roomIndex % STANDIN_ROOMS_PER_FLOOR) + 1,
      slot: index % ROOM_LENGTH,
      itemId: point?.open?.itemId ?? null,
      view: point?.open ? { ...point.open.view, locale: "ru" } : null,
      attemptNo: point?.open?.attemptNo ?? null,
      hintLevels: point?.open?.hintLevels ?? [],
      explainedItemIds: (point?.explained ?? []).filter(
        (id) =>
          Math.floor((point?.positions[id] ?? -1) / ROOM_LENGTH) === roomIndex,
      ),
      scene: point?.scene ? { kind: "scene", ...point.scene } : null,
      chest: point?.chest ? { kind: "chest", ...point.chest } : null,
      rewards: point?.rewards ?? [],
      wrapUp: wrapUpOf(sessionId),
    };
  }

  app.post("/api/adventure/resume", async (c) => {
    const deviceId = writer(c);
    if (deviceId instanceof Response) return deviceId;
    const body = ResumeIn.safeParse(await c.req.json());
    if (!body.success) return c.json({ error: "bad_request" }, 400);
    const key = `adventure-resume:${deviceId}:${body.data.clientSeq}`;
    // A repeat opens no second session and gets the point as it stands.
    const prior = requestEvents(db, key).find(
      (e) => e.type === "session_started",
    );
    let sessionId = prior && payloadOf<{ sessionId: string }>(prior).sessionId;
    if (body.data.zone !== undefined && !isZone(body.data.zone))
      return c.json({ error: "bad_request" }, 400);
    if (!sessionId) {
      if (!openAdventure(db))
        return c.json({ error: "no_open_adventure" }, 404);
      sessionId = openSession(deviceId, "daily", key, body.data.zone ?? null);
    }
    const out = resumeOut(sessionId);
    return out
      ? send(c, ResumeOut, out)
      : c.json({ error: "no_open_adventure" }, 404);
  });

  app.post("/api/session/:id/heartbeat", async (c) => {
    const deviceId = writer(c);
    if (deviceId instanceof Response) return deviceId;
    const body = HeartbeatIn.safeParse(await c.req.json());
    if (!body.success) return c.json({ error: "bad_request" }, 400);
    const sessionId = c.req.param("id");
    const session = sessionRow(db, sessionId);
    if (!session) return c.json({ error: "session_unknown" }, 404);
    if (session.state === "ended")
      return c.json({ error: "session_ended" }, 409);
    if (displaced(deviceId)) return leaseMoved(c);
    // After a restart nobody holds the lease, and the first heartbeat of a
    // live session takes it back without a tap.
    lease ??= { deviceId, sessionId, beatAt: tick };
    lease.beatAt = tick;
    return send(c, HeartbeatOut, { status: "ok" });
  });

  app.get("/api/adventure/current", (c) => {
    const deviceId = device(db, c);
    if (deviceId instanceof Response) return deviceId;
    const open = openAdventure(db);
    if (!open) return send(c, AdventureCurrentOut, { adventure: null });
    const played = adventureEvents(db, open.adventureId);
    const firsts = firstsOf(played);
    const answered = answeredIn(played);
    const openAt = firsts.findIndex((s) => !answered.has(s.itemId));
    const index = openAt === -1 ? firsts.length : openAt;
    const room = Math.floor(index / ROOM_LENGTH);
    return send(c, AdventureCurrentOut, {
      adventure: {
        adventureId: open.adventureId,
        state: open.state,
        floor: Math.floor(room / STANDIN_ROOMS_PER_FLOOR) + 1,
        room: (room % STANDIN_ROOMS_PER_FLOOR) + 1,
        slot: index % ROOM_LENGTH,
      },
    });
  });

  app.get("/api/session/:id/next", (c) => {
    const deviceId = device(db, c);
    if (deviceId instanceof Response) return deviceId;
    if (displaced(deviceId)) return leaseMoved(c);
    const sessionId = c.req.param("id");
    const session = sessionRow(db, sessionId);
    if (!session) return c.json({ error: "session_unknown" }, 404);
    if (session.state === "ended")
      return c.json({ error: "session_ended" }, 409);
    const origin = { deviceId, clientMs: Date.now() };
    const adventure = session.adventureId
      ? adventureState(db, session.adventureId)
      : undefined;
    if (adventure?.state === "wrapped_up" && session.adventureId) {
      // The short ending stays on the screen until she leaves it (REQ-0228).
      const ending = resumeFromLog(
        adventureEvents(db, session.adventureId),
      )?.scene;
      if (ending) return send(c, Scene, { kind: "scene", ...ending });
    }
    if (
      adventure &&
      (adventure.state === "complete" || adventure.state === "wrapped_up")
    )
      return send(c, End, { kind: "end" });

    // Play on a planned adventure starts it, and on a paused one resumes it.
    const lifecycle: NewEvent[] = [];
    if (session.adventureId && adventure?.state === "planned")
      lifecycle.push({
        type: "adventure_started",
        v: 1,
        payload: { adventureId: session.adventureId },
        origin,
        adventureId: session.adventureId,
        sessionId,
      });
    if (session.adventureId && adventure?.state === "paused")
      lifecycle.push({
        type: "adventure_resumed",
        v: 1,
        payload: {
          pausedMs: Math.max(0, Date.now() - Date.parse(adventure.changedAt)),
        },
        origin,
        adventureId: session.adventureId,
        sessionId,
      });

    const played = playLog(sessionId);
    const firsts = firstsOf(played);
    const answered = answeredIn(played);
    // An open task is shown again as it was, never replaced: a first attempt
    // and a second attempt left open alike (REQ-0204).
    const open = played
      .filter((e) => e.type === "item_shown")
      .map((e) => payloadOf<ItemShown>(e))
      .find((s) => !answered.has(s.itemId));
    if (open) {
      if (lifecycle.length) appendEvents(db, lifecycle);
      return send(c, Room, roomFor(open, sessionEvents(db, sessionId), played));
    }

    const index = firsts.length;
    // After «Закончить на сегодня» the next boundary is the stop offer, once an
    // open scene or chest is done, and it takes no extension (REQ-2444).
    if (finishedToday(db, Date.now(), sessionZone(db, sessionId))) {
      const point = resumeFromLog(played);
      if (point?.scene)
        return send(c, Scene, { kind: "scene", ...point.scene });
      if (point?.chest)
        return send(c, Chest, { kind: "chest", ...point.chest });
      return send(c, StopOffer, { kind: "stop_offer", canExtend: false });
    }
    // The three-day rule: the open task is done and, with the room finished,
    // the stand-in short ending plays and the adventure wraps up, queueing the
    // secrets she didn't open (REQ-0228, REQ-0232). A room left half done
    // goes on until it is whole.
    if (
      session.adventureId &&
      index % ROOM_LENGTH === 0 &&
      wrapUpOf(sessionId)
    ) {
      const ending = standinEnding();
      appendEvents(db, [
        ...lifecycle,
        {
          type: "scene_prepared",
          v: 1,
          payload: ending,
          origin,
          sessionId,
          adventureId: session.adventureId,
        },
        {
          type: "adventure_wrapped_up",
          v: 1,
          payload: {
            adventureId: session.adventureId,
            unopenedSecrets: [...STANDIN_SECRETS],
          },
          origin,
          sessionId,
          adventureId: session.adventureId,
        },
      ]);
      return send(c, Scene, { kind: "scene", ...ending, draft: null });
    }
    // The stand-in adventure's finale: its scene, then its chest, then the end.
    // An open scene or chest is shown again as it was, never prepared anew
    // (REQ-0216, REQ-0218).
    if (session.adventureId && index >= STANDIN_ADVENTURE_TASKS) {
      const point = resumeFromLog(played);
      if (point?.scene) {
        if (lifecycle.length) appendEvents(db, lifecycle);
        return send(c, Scene, { kind: "scene", ...point.scene });
      }
      if (point?.chest) {
        if (lifecycle.length) appendEvents(db, lifecycle);
        return send(c, Chest, { kind: "chest", ...point.chest });
      }
      const at = { sessionId, adventureId: session.adventureId };
      if (!played.some((e) => e.type === "scene_prepared")) {
        const scene = standinScene();
        appendEvents(db, [
          ...lifecycle,
          {
            type: "scene_prepared",
            v: 1,
            payload: scene,
            origin,
            ...at,
          },
        ]);
        return send(c, Scene, { kind: "scene", ...scene, draft: null });
      }
      if (!played.some((e) => e.type === "chest_offered")) {
        const options = [...STANDIN_CHEST_OPTIONS];
        appendEvents(db, [
          ...lifecycle,
          {
            type: "chest_offered",
            v: 1,
            payload: { chestId: STANDIN_CHEST_ID, options },
            origin,
            ...at,
          },
        ]);
        return send(c, Chest, {
          kind: "chest",
          chestId: STANDIN_CHEST_ID,
          options,
        });
      }
      appendEvents(db, [
        ...lifecycle,
        {
          type: "adventure_completed",
          v: 1,
          payload: { adventureId: session.adventureId },
          origin,
          adventureId: session.adventureId,
          sessionId,
        },
      ]);
      return send(c, End, { kind: "end" });
    }
    const task = STANDIN_TASKS[index % STANDIN_TASKS.length];
    if (!task) return c.json({ error: "no_task" }, 500);
    const shown: ItemShown = {
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
      subtype: `task-${task.n}`,
      seed: `standin-${index}`,
    };
    appendEvents(db, [
      ...lifecycle,
      {
        type: "item_shown",
        v: 1,
        payload: {
          ...shown,
          templateId: "standin",
          templateVersion: 1,
          params: task.params,
          node: "standin",
          purpose: standinPurpose(task),
        },
        origin,
        ...within(sessionId),
      },
    ]);
    return send(
      c,
      Room,
      roomFor(shown, sessionEvents(db, sessionId), playLog(sessionId)),
    );
  });

  app.post("/api/session/:id/pause", async (c) => {
    const deviceId = writer(c);
    if (deviceId instanceof Response) return deviceId;
    const body = PauseIn.safeParse(await c.req.json());
    if (!body.success) return c.json({ error: "bad_request" }, 400);
    if (displaced(deviceId)) return leaseMoved(c);
    const sessionId = c.req.param("id");
    const key = `pause:${deviceId}:${body.data.clientSeq}`;
    if (requestEvents(db, key).length)
      return send(c, PauseOut, { status: "paused" });
    const session = sessionRow(db, sessionId);
    if (!session) return c.json({ error: "session_unknown" }, 404);
    if (session.state === "ended")
      return c.json({ error: "session_ended" }, 409);
    // Every earlier action is already in the log, so leaving logs only the
    // pause and the session's end, at any step (REQ-0200).
    const { reason } = body.data;
    const origin = { deviceId, clientMs: Date.now() };
    const events: NewEvent[] = [];
    // A finished adventure has nothing to pause: leaving it still ends the
    // session, and only an automatic pause meets the guard (REQ-2404).
    const finished = session.adventureId
      ? ["complete", "wrapped_up"].includes(
          adventureState(db, session.adventureId)?.state ?? "",
        )
      : false;
    if (session.adventureId && !(reason === "leave" && finished))
      events.push({
        type: "adventure_paused",
        v: 1,
        payload: { reason },
        origin,
        adventureId: session.adventureId,
        sessionId,
      });
    events.push({
      type: "session_ended",
      v: 1,
      payload: { sessionId, reason },
      origin,
      ...within(sessionId),
    });
    try {
      appendEvents(db, keyed(events, key));
    } catch (err) {
      if (err instanceof AdventureClosed)
        return c.json({ error: "adventure_closed" }, 409);
      throw err;
    }
    onSessionEnded?.(sessionId);
    return send(c, PauseOut, { status: "paused" });
  });

  app.post("/api/session/:id/break", async (c) => {
    const deviceId = writer(c);
    if (deviceId instanceof Response) return deviceId;
    const body = BreakIn.safeParse(await c.req.json());
    if (!body.success) return c.json({ error: "bad_request" }, 400);
    if (displaced(deviceId)) return leaseMoved(c);
    const sessionId = c.req.param("id");
    const { action, clientSeq } = body.data;
    const key = `break:${deviceId}:${clientSeq}`;
    const status = action === "start" ? "resting" : "playing";
    if (requestEvents(db, key).length) return send(c, BreakOut, { status });
    const session = sessionRow(db, sessionId);
    if (!session) return c.json({ error: "session_unknown" }, 404);
    if (session.state === "ended")
      return c.json({ error: "session_ended" }, 409);
    // A rest stop logs its own events and pauses nothing (REQ-2412).
    const stops = sessionEvents(db, sessionId).filter(
      (e) => e.type === "rest_stop_started" || e.type === "rest_stop_ended",
    );
    const last = stops[stops.length - 1];
    const resting = last?.type === "rest_stop_started";
    if (action === "start" ? resting : !resting)
      return send(c, BreakOut, { status });
    const origin = { deviceId, clientMs: Date.now() };
    appendEvents(
      db,
      keyed(
        [
          action === "start"
            ? {
                type: "rest_stop_started",
                v: 1,
                payload: { trigger: "button" },
                origin,
                ...within(sessionId),
              }
            : {
                type: "rest_stop_ended",
                v: 1,
                payload: {
                  durationMs: Math.max(
                    0,
                    Date.now() - Date.parse(last?.ts ?? ""),
                  ),
                },
                origin,
                ...within(sessionId),
              },
        ],
        key,
      ),
    );
    return send(c, BreakOut, { status });
  });

  /** The reply a scene input or a chest pick gets: its grants, as the log holds them. */
  const grantsOf = (events: StoredEvent[]) =>
    events
      .filter((e) => e.type === "reward_granted")
      .map((e) =>
        payloadOf<{ rewardId: string; kind: string; amount: number }>(e),
      )
      .map(({ rewardId, kind, amount }) => ({ rewardId, kind, amount }));

  app.post("/api/session/:id/scene/input", async (c) => {
    const deviceId = writer(c);
    if (deviceId instanceof Response) return deviceId;
    const body = SceneInputIn.safeParse(await c.req.json());
    if (!body.success) return c.json({ error: "bad_request" }, 400);
    if (displaced(deviceId)) return leaseMoved(c);
    const sessionId = c.req.param("id");
    const input = body.data;
    const key = `scene-input:${deviceId}:${input.clientSeq}`;
    const prior = requestEvents(db, key);
    if (prior.length)
      return send(c, SceneInputOut, {
        status: input.kind === "draft" ? "saved" : "done",
        grants: grantsOf(prior),
      });
    const session = sessionRow(db, sessionId);
    if (!session) return c.json({ error: "session_unknown" }, 404);
    if (session.state === "ended")
      return c.json({ error: "session_ended" }, 409);
    const scene = resumeFromLog(playLog(sessionId))?.scene;
    if (!scene || scene.sceneId !== input.sceneId)
      return c.json({ error: "scene_not_open" }, 409);
    const origin = { deviceId, clientMs: Date.now() };
    const at = within(sessionId);
    const events: NewEvent[] = [];
    if (input.kind === "draft") {
      events.push({
        type: "text_draft_saved",
        v: 1,
        payload: { sceneId: scene.sceneId, text: input.text },
        origin,
        ...at,
      });
    } else {
      if (
        input.kind === "choice" &&
        !scene.branches.some((b) => b.choiceId === input.choiceId)
      )
        return c.json({ error: "bad_request" }, 400);
      events.push(
        input.kind === "choice"
          ? {
              type: "choice_made",
              v: 1,
              payload: { sceneId: scene.sceneId, choiceId: input.choiceId },
              origin,
              ...at,
            }
          : {
              type: "free_text",
              v: 1,
              payload: { sceneId: scene.sceneId, cleaned: input.text },
              origin,
              ...at,
            },
      );
      // Only the finale's scene gives the stand-in grant, not the short ending.
      if (scene.sceneId === STANDIN_SCENE_ID)
        events.push({
          type: "reward_granted",
          v: 1,
          payload: {
            source: "scene",
            kind: STANDIN_SCENE_REWARD.kind,
            rewardId: `${STANDIN_SCENE_ID}-reward`,
            amount: STANDIN_SCENE_REWARD.amount,
          },
          origin: "server",
          ...at,
        });
    }
    appendEvents(db, keyed(events, key));
    return send(c, SceneInputOut, {
      status: input.kind === "draft" ? "saved" : "done",
      grants: !events.some((e) => e.type === "reward_granted")
        ? []
        : [
            {
              rewardId: `${STANDIN_SCENE_ID}-reward`,
              ...STANDIN_SCENE_REWARD,
            },
          ],
    });
  });

  app.post("/api/session/:id/chest", async (c) => {
    const deviceId = writer(c);
    if (deviceId instanceof Response) return deviceId;
    const body = ChestIn.safeParse(await c.req.json());
    if (!body.success) return c.json({ error: "bad_request" }, 400);
    if (displaced(deviceId)) return leaseMoved(c);
    const sessionId = c.req.param("id");
    const key = `chest:${deviceId}:${body.data.clientSeq}`;
    const prior = requestEvents(db, key);
    if (prior.length) return send(c, ChestOut, { grants: grantsOf(prior) });
    const session = sessionRow(db, sessionId);
    if (!session) return c.json({ error: "session_unknown" }, 404);
    if (session.state === "ended")
      return c.json({ error: "session_ended" }, 409);
    const chest = resumeFromLog(playLog(sessionId))?.chest;
    if (!chest || chest.chestId !== body.data.chestId)
      return c.json({ error: "chest_not_open" }, 409);
    const picked = chest.options.find((o) => o.rewardId === body.data.rewardId);
    if (!picked) return c.json({ error: "bad_request" }, 400);
    const origin = { deviceId, clientMs: Date.now() };
    const at = within(sessionId);
    appendEvents(
      db,
      keyed(
        [
          {
            type: "chest_chosen",
            v: 1,
            payload: { chestId: chest.chestId, rewardId: picked.rewardId },
            origin,
            ...at,
          },
          {
            type: "reward_granted",
            v: 1,
            payload: {
              source: "chest",
              kind: picked.kind,
              rewardId: picked.rewardId,
              amount: 1,
            },
            origin: "server",
            ...at,
          },
        ],
        key,
      ),
    );
    return send(c, ChestOut, {
      grants: [{ rewardId: picked.rewardId, kind: picked.kind, amount: 1 }],
    });
  });

  app.post("/api/session/:id/rewards/delivered", async (c) => {
    const deviceId = writer(c);
    if (deviceId instanceof Response) return deviceId;
    const body = RewardsDeliveredIn.safeParse(await c.req.json());
    if (!body.success) return c.json({ error: "bad_request" }, 400);
    if (displaced(deviceId)) return leaseMoved(c);
    const sessionId = c.req.param("id");
    const key = `rewards-delivered:${deviceId}:${body.data.clientSeq}`;
    if (requestEvents(db, key).length)
      return send(c, RewardsDeliveredOut, { status: "ok" });
    const session = sessionRow(db, sessionId);
    if (!session) return c.json({ error: "session_unknown" }, 404);
    // Only a grant still pending counts, so a repeat under a new clientSeq
    // appends nothing.
    const pending = new Set(
      (resumeFromLog(playLog(sessionId))?.rewards ?? []).map((r) => r.rewardId),
    );
    const rewardIds = [...new Set(body.data.rewardIds)].filter((id) =>
      pending.has(id),
    );
    if (rewardIds.length)
      appendEvents(
        db,
        keyed(
          [
            {
              type: "rewards_delivered",
              v: 1,
              payload: { rewardIds },
              origin: { deviceId, clientMs: Date.now() },
              ...within(sessionId),
            },
          ],
          key,
        ),
      );
    return send(c, RewardsDeliveredOut, { status: "ok" });
  });

  app.post("/api/session/:id/extend", async (c) => {
    const deviceId = writer(c);
    if (deviceId instanceof Response) return deviceId;
    const body = ItemActionIn.safeParse(await c.req.json());
    if (!body.success) return c.json({ error: "bad_request" }, 400);
    if (displaced(deviceId)) return leaseMoved(c);
    const sessionId = c.req.param("id");
    const key = `extend:${deviceId}:${body.data.clientSeq}`;
    if (requestEvents(db, key).length)
      return send(c, ExtendOut, { status: "extended" });
    const session = sessionRow(db, sessionId);
    if (!session) return c.json({ error: "session_unknown" }, 404);
    if (session.state === "ended")
      return c.json({ error: "session_ended" }, 409);
    if (finishedToday(db, Date.now(), sessionZone(db, sessionId)))
      return c.json({ error: "day_finished" }, 409);
    // Until ADR-0090's epic adds the soft stop, an extension is only logged.
    appendEvents(
      db,
      keyed(
        [
          {
            type: "extension",
            v: 1,
            payload: { minutes: 20 },
            origin: { deviceId, clientMs: Date.now() },
            ...within(sessionId),
          },
        ],
        key,
      ),
    );
    return send(c, ExtendOut, { status: "extended" });
  });

  app.post("/api/session/:id/answer", async (c) => {
    const started = performance.now();
    const deviceId = writer(c);
    if (deviceId instanceof Response) return deviceId;
    const sessionId = c.req.param("id");
    const body = AnswerIn.safeParse(await c.req.json());
    if (!body.success) return c.json({ error: "bad_request" }, 400);
    const a = body.data;
    const key = `answer:${deviceId}:${a.clientSeq}`;

    // A repeat appends nothing and gets the first reply (REQ-2432).
    const prior = requestEvents(db, key).find((e) => e.type === "verdict");
    if (prior?.sessionId) {
      const { itemId } = payloadOf<{ itemId: string }>(prior);
      const found = item(c, itemId);
      if (found instanceof Response) return found;
      return send(
        c,
        AnswerOut,
        answerReply(sessionEvents(db, prior.sessionId), prior.seq, found.shown),
      );
    }

    const found = item(c, a.itemId);
    if (found instanceof Response) return found;
    const { shown } = found;

    // An answer from a device that lost the lease is still logged (REQ-0220):
    // as the attempt when the item has none, otherwise as `attempt_late`,
    // which gets no verdict and no grants. While another device holds the
    // lease the reply is 409; when the lease only expired, the answer gets
    // its outcome as usual (REQ-2434, REQ-2438).
    const lost = displaced(deviceId);
    const expired = !lost && sessionRow(db, found.sessionId)?.state === "ended";
    const earlier = found.log.find(
      (e) =>
        e.type === "verdict" &&
        payloadOf<{ itemId: string }>(e).itemId === a.itemId,
    );
    if ((lost || expired) && earlier) {
      appendEvents(
        db,
        keyed(
          [
            {
              type: "attempt_late",
              v: 1,
              payload: { itemId: a.itemId, raw: a.raw },
              origin: { deviceId, clientMs: Date.now() },
              ...within(found.sessionId),
            },
          ],
          key,
        ),
      );
      return lost
        ? leaseMoved(c)
        : send(c, AnswerOut, answerReply(found.log, earlier.seq, found.shown));
    }

    // The server checks `raw` itself and ignores the client's `parsed`.
    const verdict: Verdict = standinVerdict(
      a.raw,
      a.dontKnow,
      shown.correctAnswer,
    );
    const outcome: Outcome = verdict === "correct" ? "clean" : "alt";
    const hints = hintLevels(found.log, a.itemId);
    // A pause between showing the task and this answer, or a device of another
    // kind than the one that showed it, keeps the attempt's time out of every
    // measure (REQ-0212, REQ-0224). A rest stop pauses nothing (REQ-2412).
    const interrupted = playLog(sessionId).some(
      (e) =>
        e.seq > found.shownSeq &&
        (e.type === "adventure_paused" || e.type === "session_ended"),
    );
    const crossDevice =
      deviceInterface(db, found.shownBy) !== deviceInterface(db, deviceId);
    const origin = { deviceId, clientMs: Date.now() };
    const [, written] = appendEvents(
      db,
      keyed(
        [
          {
            type: "attempt_submitted",
            v: 2,
            payload: {
              itemId: a.itemId,
              attemptNo: shown.attemptNo,
              input: a.input,
              answer: {
                entered: a.raw,
                parsed: a.raw.trim() === "" ? null : a.raw.trim(),
              },
              assisted: hints.length > 0,
              hintLevel: Math.max(0, ...hints),
              interrupted,
              crossDevice,
            },
            origin,
            ...within(sessionId),
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
            ...within(sessionId),
          },
        ],
        key,
      ),
    );

    const reply = answerReply(
      sessionEvents(db, sessionId),
      written?.seq ?? Infinity,
      shown,
    );
    c.header(
      "Server-Timing",
      `app;dur=${(performance.now() - started).toFixed(2)}`,
    );
    return lost ? leaseMoved(c) : send(c, AnswerOut, reply);
  });

  app.post("/api/item/:itemId/hint", async (c) => {
    const deviceId = writer(c);
    if (deviceId instanceof Response) return deviceId;
    const body = HintIn.safeParse(await c.req.json());
    if (!body.success) return c.json({ error: "bad_request" }, 400);
    if (displaced(deviceId)) return leaseMoved(c);
    const { level, clientSeq } = body.data;
    const itemId = c.req.param("itemId");
    const found = item(c, itemId);
    if (found instanceof Response) return found;
    const { shown, sessionId, log } = found;
    const task = taskOf(shown.subtype);
    if (!task) return c.json({ error: "item_unknown" }, 404);
    const key = `hint:${deviceId}:${clientSeq}`;

    // A repeat gets the rung it bought and the stock as it was then.
    const prior = requestEvents(db, key);
    const first = prior.find((e) => e.type === "hint_shown");
    if (first) {
      const bought = payloadOf<{ level: number }>(first).level;
      return send(c, HintOut, {
        level: bought,
        text: taskHint(task, bought),
        threads: stockAt(log, prior[prior.length - 1]?.seq),
      });
    }
    // A rung already paid for, under any clientSeq, is shown again free (REQ-2422).
    const levels = hintLevels(log, itemId);
    if (levels.includes(level))
      return send(c, HintOut, {
        level,
        text: taskHint(task, level),
        threads: stockAt(log),
      });
    if (level !== Math.max(0, ...levels) + 1)
      return c.json({ error: "hint_level_skipped" }, 400);
    if (stockAt(log) < 1) return c.json({ error: "no_threads" }, 409);
    const origin = { deviceId, clientMs: Date.now() };
    appendEvents(
      db,
      keyed(
        [
          {
            type: "hint_shown",
            v: 1,
            payload: { itemId, attemptNo: shown.attemptNo, level },
            origin,
            ...within(sessionId),
          },
          {
            type: "thread_spent",
            v: 1,
            payload: { itemId, reason: "hint", count: 1 },
            origin,
            ...within(sessionId),
          },
        ],
        key,
      ),
    );
    return send(c, HintOut, {
      level,
      text: taskHint(task, level),
      threads: stockAt(sessionEvents(db, sessionId)),
    });
  });

  app.post("/api/item/:itemId/explain", async (c) => {
    const deviceId = writer(c);
    if (deviceId instanceof Response) return deviceId;
    const body = ItemActionIn.safeParse(await c.req.json());
    if (!body.success) return c.json({ error: "bad_request" }, 400);
    if (displaced(deviceId)) return leaseMoved(c);
    const itemId = c.req.param("itemId");
    const found = item(c, itemId);
    if (found instanceof Response) return found;
    const { shown, sessionId, log } = found;
    const task = taskOf(shown.subtype);
    if (!task) return c.json({ error: "item_unknown" }, 404);
    const key = `explain:${deviceId}:${body.data.clientSeq}`;

    const prior = requestEvents(db, key);
    if (prior.length)
      return send(c, ExplainOut, {
        status: "pending",
        threads: stockAt(log, prior[prior.length - 1]?.seq),
      });
    // An explanation is bought once per item, under any clientSeq.
    const bought = log.some(
      (e) =>
        e.type === "explanation_bought" &&
        payloadOf<{ itemId: string }>(e).itemId === itemId,
    );
    if (bought)
      return send(c, ExplainOut, { status: "pending", threads: stockAt(log) });
    if (stockAt(log) < 1) return c.json({ error: "no_threads" }, 409);
    const origin = { deviceId, clientMs: Date.now() };
    const [, written] = appendEvents(
      db,
      keyed(
        [
          {
            type: "thread_spent",
            v: 1,
            payload: { itemId, reason: "explanation", count: 1 },
            origin,
            ...within(sessionId),
          },
          {
            type: "explanation_bought",
            v: 1,
            payload: { itemId, attemptNo: shown.attemptNo },
            origin,
            ...within(sessionId),
          },
        ],
        key,
      ),
    );
    // The reply doesn't wait for the text (REQ-2424); the stream brings it.
    if (written) void deliver(sessionId, written.seq, itemId, task);
    return send(c, ExplainOut, {
      status: "pending",
      threads: stockAt(sessionEvents(db, sessionId)),
    });
  });

  app.post("/api/item/:itemId/second-attempt", async (c) => {
    const deviceId = writer(c);
    if (deviceId instanceof Response) return deviceId;
    const body = ItemActionIn.safeParse(await c.req.json());
    if (!body.success) return c.json({ error: "bad_request" }, 400);
    if (displaced(deviceId)) return leaseMoved(c);
    const itemId = c.req.param("itemId");
    const found = item(c, itemId);
    if (found instanceof Response) return found;
    const { shown, sessionId, log } = found;

    // One second attempt per item: a repeat, under any clientSeq, gets the
    // parallel task created the first time (REQ-2426).
    const created = log
      .filter((e) => e.type === "item_shown")
      .map((e) => payloadOf<ItemShown>(e))
      .find((s) => s.parentItemId === itemId);
    if (created)
      return send(c, Room, roomFor(created, log, playLog(sessionId)));

    if (shown.attemptNo !== 1)
      return c.json({ error: "not_a_first_attempt" }, 409);
    const answered = log.some(
      (e) =>
        e.type === "verdict" &&
        payloadOf<{ itemId: string }>(e).itemId === itemId,
    );
    if (!answered) return c.json({ error: "attempt_open" }, 409);
    const task = taskOf(shown.subtype);
    if (!task) return c.json({ error: "item_unknown" }, 404);
    const twin: ItemShown = {
      itemId: randomUUID(),
      view: { ...shown.view, text: taskText(task, true) },
      attemptNo: 2,
      correctAnswer: task.twin.answer,
      shortSolution: taskSolution(task, true),
      subtype: shown.subtype,
      seed: `${shown.seed}-twin`,
      parentItemId: itemId,
    };
    appendEvents(
      db,
      keyed(
        [
          {
            type: "item_shown",
            v: 1,
            payload: {
              ...twin,
              templateId: "standin",
              templateVersion: 1,
              params: task.twin.params,
              node: "standin",
              purpose: standinPurpose(task),
            },
            origin: { deviceId, clientMs: Date.now() },
            ...within(sessionId),
          },
        ],
        `second-attempt:${deviceId}:${body.data.clientSeq}`,
      ),
    );
    return send(
      c,
      Room,
      roomFor(twin, sessionEvents(db, sessionId), playLog(sessionId)),
    );
  });
}
