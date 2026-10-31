// The live frame queue (ADR-3100): it prepares a task's frame ahead of the room, so the player never
// waits, and keeps every frame with its status. A task with no ready frame shows its template text.
import { z } from "zod";
import { appendEvents } from "../../engine/events/append.js";
import type { Compiled, Lang } from "../../templates/spec.js";
import type { Db } from "../database.js";
import type { Gateway } from "../gateway/gateway.js";
import { gameDayOf } from "../../shared/game-day.js";
import { present } from "../task-source.js";
import { codeFault, judged, SOFT_FAULTS } from "./check.js";
import {
  type Creepiness,
  FRAME_SCHEMA,
  type Gender,
  frameSystem,
  frameUser,
  NO_SLOTS,
  VARIANTS,
} from "./request.js";

export interface FrameTask {
  readonly template: Compiled;
  /** The task's base seed. */
  readonly base: Uint8Array;
  /** What the calls spend from. */
  readonly bucket: string;
  readonly lang: Lang;
  /** The story a second attempt continues. */
  readonly previous?: string;
}

export interface TakenFrame {
  readonly id: number;
  readonly text: string;
}

export interface FrameQueue {
  /** Starts preparing a frame in the background; returns its promise for tests. */
  prepare(task: FrameTask): Promise<void>;
  /** Waits for the task's frame, starting it if nobody has, for at most `ms`. */
  ready(task: FrameTask, ms: number): Promise<void>;
  /** The task's ready frame, which turns `used`, or null. */
  take(task: Omit<FrameTask, "bucket">): TakenFrame | null;
}

const Reply = z.object({ story: z.string() });
const ROUNDS = 3;
/** A low bar from 112 live scores (median 0.43): it stops plain failures and little else. */
const PASS_SCORE = 0.1;

interface Written {
  readonly text: string;
  readonly score: number;
}

const TOLD = 8;
const PAUSE_FROM = 10;
const PAUSE_SHARE = 0.3;

export function createFrameQueue({
  db,
  gateway,
  zone,
  now = Date.now,
  pauses = true,
  level = () => 2,
  gender = () => "f",
}: {
  db: Db;
  gateway: Gateway;
  zone: string;
  now?: () => number;
  /** A live evaluation sets this false, so one bad language can't hide the others. */
  pauses?: boolean;
  /** The parent's creepiness level, read for each frame so a change takes effect at once. */
  level?: () => Creepiness;
  gender?: () => Gender;
}): FrameQueue {
  const running = new Map<string, Promise<void>>();
  const hex = (b: Uint8Array): string => Buffer.from(b).toString("hex");
  const keep = (
    task: Omit<FrameTask, "bucket">,
    text: string,
    status: string,
    step: string | null,
  ): void => {
    db.prepare(
      `INSERT INTO frames (template_id, seed, lang, text, status, step, game_day, at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      task.template.id,
      hex(task.base),
      task.lang,
      text,
      status,
      step,
      gameDayOf(now(), zone),
      new Date(now()).toISOString(),
    );
  };
  let pausedDay: number | null = null;
  const paused = (): boolean => {
    const day = gameDayOf(now(), zone);
    const row = db
      .prepare(
        `SELECT COUNT(*) AS checked, COALESCE(SUM(status = 'rejected'), 0) AS rejected
         FROM frames WHERE game_day = ?`,
      )
      .get(day) as { checked: number; rejected: number };
    const pause =
      row.checked >= PAUSE_FROM && row.rejected / row.checked > PAUSE_SHARE;
    if (pause && pausedDay !== day) {
      pausedDay = day;
      appendEvents(db, [
        {
          type: "live_frames_paused",
          v: 1,
          payload: { gameDay: day },
          origin: { deviceId: "server", clientMs: now() },
        },
      ]);
    }
    return pause;
  };
  const hasFrame = (task: Omit<FrameTask, "bucket">): boolean =>
    db
      .prepare(
        `SELECT 1 FROM frames WHERE template_id = ? AND seed = ? AND lang = ?
         AND status IN ('ready', 'used') LIMIT 1`,
      )
      .get(task.template.id, hex(task.base), task.lang) !== undefined;

  const told = (lang: Lang): string[] =>
    (
      db
        .prepare(
          `SELECT text FROM frames WHERE lang = ? AND status IN ('ready', 'used')
           ORDER BY id DESC LIMIT ?`,
        )
        .all(lang, TOLD) as { text: string }[]
    ).map((row) => row.text);

  /** One author call and its checks; false when nothing passed, null when a model failed. */
  async function attempt(task: FrameTask): Promise<Written | false | null> {
    const { template, bucket, lang } = task;
    const plain = template.make(task.base, lang);
    const filled = template.make(task.base, lang, template.blank(lang)).text;
    const answers = present({ template, made: plain }).options ?? [];
    const reply = await gateway.call({
      role: "TASK_TEXT_MODEL",
      bucket,
      system: frameSystem(lang, level(), gender()),
      user: frameUser({
        task: filled,
        roles: template.roles,
        lang,
        slots: NO_SLOTS,
        answers,
        kind: template.answer,
        picture: plain.svg,
        ...(task.previous ? { previous: task.previous } : {}),
        told: told(lang),
      }),
      schema: FRAME_SCHEMA,
    });
    if (!reply.ok) return null;
    let variants: string[];
    try {
      variants = [Reply.parse(JSON.parse(reply.text)).story];
    } catch {
      for (let k = 0; k < VARIANTS; k += 1)
        keep(task, reply.text, "rejected", "schema");
      return false;
    }
    const clean = variants.flatMap((text) => {
      const fault = codeFault(text, filled, lang);
      if (fault && !SOFT_FAULTS.includes(fault)) {
        keep(task, text, "rejected", fault);
        return [];
      }
      return [{ text, soft: fault !== null }];
    });
    if (clean.length === 0) return false;
    const verdict = await judged(
      gateway,
      bucket,
      clean,
      { template, made: plain },
      answers,
      lang,
      level(),
    );
    if (!verdict) return null;
    for (const frame of verdict.rejected)
      keep(task, frame, "rejected", "judge");
    return verdict.best === null
      ? false
      : { text: verdict.best, score: verdict.score ?? 0 };
  }

  /** Writes until a story clears the bar, and shows the best after the last round; a failed model stops. */
  async function run(task: FrameTask): Promise<void> {
    let best: Written | null = null;
    for (let round = 0; round < ROUNDS; round += 1) {
      const written = await attempt(task);
      if (written === null) break;
      if (!written) continue;
      if (best && written.score <= best.score) {
        keep(task, written.text, "unused", null);
        continue;
      }
      if (best) keep(task, best.text, "unused", null);
      best = written;
      if (best.score >= PASS_SCORE) break;
    }
    if (best) keep(task, best.text, "ready", null);
  }

  /** One run a task: a second caller waits on the first. */
  const start = (task: FrameTask): Promise<void> => {
    const key = `${task.template.id}/${hex(task.base)}/${task.lang}`;
    const under = running.get(key);
    if (under) return under;
    if (hasFrame(task) || (pauses && paused())) return Promise.resolve();
    const done = run(task).finally(() => running.delete(key));
    running.set(key, done);
    return done;
  };

  return {
    prepare: start,
    async ready(task, ms) {
      let timer: NodeJS.Timeout | undefined;
      await Promise.race([
        start(task),
        new Promise<void>((resolve) => {
          timer = setTimeout(resolve, ms);
        }),
      ]);
      clearTimeout(timer);
    },
    take({ template, base, lang }) {
      const row = db
        .prepare(
          `SELECT id, text FROM frames WHERE template_id = ? AND seed = ? AND lang = ?
           AND status = 'ready' ORDER BY id LIMIT 1`,
        )
        .get(template.id, hex(base), lang) as TakenFrame | undefined;
      if (!row) return null;
      db.prepare("UPDATE frames SET status = 'used' WHERE id = ?").run(row.id);
      return row;
    },
  };
}
