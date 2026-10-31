// The live frame queue (ADR-3100): it prepares a task's frame ahead of the room, so the player never
// waits, and keeps every frame with its status. A task with no ready frame shows its template text.
import { z } from "zod";
import { appendEvents } from "../../engine/events/append.js";
import { baseSeed } from "../../math/rng.js";
import type { Compiled, Lang } from "../../templates/spec.js";
import type { Db } from "../database.js";
import type { Gateway } from "../gateway/gateway.js";
import { gameDayOf } from "../../shared/game-day.js";
import { codeFault, safe, solvesBlind } from "./check.js";
import {
  FRAME_SCHEMA,
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
}

export interface TakenFrame {
  readonly id: number;
  readonly text: string;
}

export interface FrameQueue {
  /** Starts preparing a frame in the background; returns its promise for tests. */
  prepare(task: FrameTask): Promise<void>;
  /** The task's ready frame, which turns `used`, or null. */
  take(task: Omit<FrameTask, "bucket">): TakenFrame | null;
  /** The text of a frame shown, which a second attempt reuses with its own numbers. */
  textOf(id: number): string | null;
}

const Reply = z.object({ frames: z.array(z.string()) });
const PAUSE_FROM = 10;
const PAUSE_SHARE = 0.3;

export function createFrameQueue({
  db,
  gateway,
  zone,
  now = Date.now,
}: {
  db: Db;
  gateway: Gateway;
  zone: string;
  now?: () => number;
}): FrameQueue {
  const running = new Set<string>();
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

  async function run(task: FrameTask): Promise<void> {
    const { template, base, bucket, lang } = task;
    const blank = template.blank(lang);
    const reply = await gateway.call({
      role: "TASK_TEXT_MODEL",
      bucket,
      system: frameSystem(lang),
      user: frameUser({ blank, roles: template.roles, lang, slots: NO_SLOTS }),
      schema: FRAME_SCHEMA,
    });
    if (!reply.ok) return;
    let variants: string[];
    try {
      variants = Reply.parse(JSON.parse(reply.text)).frames;
    } catch {
      for (let k = 0; k < VARIANTS; k += 1)
        keep(task, reply.text, "rejected", "schema");
      return;
    }
    for (const frame of variants) {
      const fault = codeFault(frame, blank, lang);
      if (fault) {
        keep(task, frame, "rejected", fault);
        continue;
      }
      if (!(await safe(gateway, bucket, frame, lang))) {
        keep(task, frame, "rejected", "safety");
        continue;
      }
      // The task's own numbers and two other draws of the same template (REQ-3630, REQ-3632).
      const seeds = [
        base,
        baseSeed(hex(base), template.id, 1),
        baseSeed(hex(base), template.id, 2),
      ];
      const solved = await Promise.all(
        seeds.map((s) =>
          solvesBlind(gateway, bucket, template, s, lang, frame),
        ),
      );
      if (!solved.every(Boolean)) {
        keep(task, frame, "rejected", "blind_solve");
        continue;
      }
      keep(task, frame, "ready", null);
      return;
    }
  }

  return {
    async prepare(task) {
      const key = `${task.template.id}/${hex(task.base)}/${task.lang}`;
      if (running.has(key) || hasFrame(task) || paused()) return;
      running.add(key);
      try {
        await run(task);
      } finally {
        running.delete(key);
      }
    },
    textOf(id) {
      const row = db.prepare("SELECT text FROM frames WHERE id = ?").get(id) as
        { text: string } | undefined;
      return row?.text ?? null;
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
