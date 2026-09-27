// A synthetic log written through appendEvents from a fixed seed (TSK-0260):
// one daily session a day on a run of adventures, each with tasks shown,
// attempted and judged, some hints and second attempts, and now and then a
// flag from the parent. The same seed writes the same log.
import { appendEvents, type NewEvent } from "../../src/engine/events/append.js";
import type { Db } from "../../src/server/database.js";

/** mulberry32: a small seeded generator, so a run is the same every time. */
function random(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const input = (r: () => number) => ({
  firstKeyMs: Math.floor(r() * 4000),
  submittedMs: 4000 + Math.floor(r() * 30000),
  edits: Math.floor(r() * 3),
  erasures: Math.floor(r() * 2),
  keyPresses: 1 + Math.floor(r() * 5),
  focusLosses: { count: 0, totalMs: 0 },
  method: "keypad" as const,
});

export interface SyntheticLog {
  days: number;
  tasksPerDay: number;
  seed: number;
  /** Events appended in one call, which only speeds the writing. */
  batch?: number;
  /** Adds a bought and shown explanation after a quarter of the wrong answers. */
  explanations?: boolean;
}

/** Writes the log and returns how many events it appended. */
export function writeSyntheticLog(
  db: Db,
  { days, tasksPerDay, seed, batch = 200, explanations = false }: SyntheticLog,
): number {
  const r = random(seed);
  let pending: NewEvent[] = [];
  let written = 0;
  const push = (e: NewEvent): void => {
    pending.push(e);
    if (pending.length >= batch) flush();
  };
  const flush = (): void => {
    if (!pending.length) return;
    appendEvents(db, pending);
    written += pending.length;
    pending = [];
  };
  const origin = { deviceId: "synthetic-tablet", clientMs: 0 };
  let adventure = 0;
  let adventureId = "";
  let tasksInAdventure = 0;
  for (let day = 0; day < days; day++) {
    if (!adventureId) {
      adventureId = `adv-${seed}-${++adventure}`;
      push({
        type: "adventure_planned",
        v: 1,
        payload: { adventureId },
        origin,
        adventureId,
      });
      push({
        type: "adventure_started",
        v: 1,
        payload: { adventureId },
        origin,
        adventureId,
      });
    } else {
      push({
        type: "adventure_resumed",
        v: 1,
        payload: { pausedMs: 20 * 60 * 60 * 1000 },
        origin,
        adventureId,
      });
    }
    const sessionId = `ses-${seed}-${day}`;
    push({
      type: "session_started",
      v: 1,
      payload: { sessionId, mode: "daily" },
      origin,
      sessionId,
      adventureId,
    });
    for (let t = 0; t < tasksPerDay; t++) {
      const itemId = `item-${seed}-${day}-${t}`;
      const a = 1 + Math.floor(r() * 9);
      const b = 1 + Math.floor(r() * 9);
      const envelope = { origin, sessionId, adventureId };
      push({
        type: "item_shown",
        v: 1,
        payload: {
          itemId,
          view: {
            locale: "ru",
            text: `${a} + ${b}`,
            svg: null,
            options: null,
            terms: [],
          },
          templateId: "A1.sum",
          templateVersion: 1,
          seed: `${seed}-${day}-${t}`,
          params: { a, b },
          node: "A1",
          subtype: "sum",
          purpose: r() < 0.2 ? "review" : "frontier",
          attemptNo: 1,
          correctAnswer: String(a + b),
          shortSolution: [`${a} + ${b} = ${a + b}`],
        },
        ...envelope,
      });
      const hinted = r() < 0.1;
      if (hinted) {
        push({
          type: "hint_shown",
          v: 1,
          payload: { itemId, attemptNo: 1, level: 1 },
          ...envelope,
        });
        push({
          type: "thread_spent",
          v: 1,
          payload: { itemId, reason: "hint", count: 1 },
          ...envelope,
        });
      }
      const right = r() < 0.75;
      push({
        type: "attempt_submitted",
        v: 1,
        payload: {
          itemId,
          attemptNo: 1,
          input: input(r),
          answer: {
            entered: String(right ? a + b : a + b + 1),
            parsed: String(right ? a + b : a + b + 1),
          },
          assisted: hinted,
          hintLevel: hinted ? 1 : 0,
        },
        ...envelope,
      });
      push({
        type: "verdict",
        v: 1,
        payload: {
          itemId,
          attemptNo: 1,
          verdict: right ? "correct" : "wrong",
          outcome: right ? "clean" : "alt",
          trapId: null,
          errorClass: null,
          steps: [],
        },
        ...envelope,
      });
      if (explanations && !right && r() < 0.25) {
        push({
          type: "thread_spent",
          v: 1,
          payload: { itemId, reason: "explanation", count: 1 },
          ...envelope,
        });
        push({
          type: "explanation_bought",
          v: 1,
          payload: { itemId, attemptNo: 1 },
          ...envelope,
        });
        push({
          type: "explanation_shown",
          v: 1,
          payload: {
            itemId,
            attemptNo: 1,
            dwellMs: 5000 + Math.floor(r() * 20000),
            source: r() < 0.5 ? "cache" : "template",
          },
          ...envelope,
        });
      }
      if (r() < 0.01)
        push({
          type: "item_flagged",
          v: 1,
          payload: { itemId, note: null },
          ...envelope,
        });
      tasksInAdventure++;
    }
    push({
      type: "session_ended",
      v: 1,
      payload: { sessionId, reason: "leave" },
      origin,
      sessionId,
      adventureId,
    });
    // An adventure ends after about 60 tasks; otherwise it pauses overnight.
    if (tasksInAdventure >= 60) {
      push({
        type: "adventure_completed",
        v: 1,
        payload: { adventureId },
        origin,
        adventureId,
      });
      adventureId = "";
      tasksInAdventure = 0;
    } else {
      push({
        type: "adventure_paused",
        v: 1,
        payload: { reason: "leave" },
        origin,
        adventureId,
      });
    }
  }
  flush();
  return written;
}
