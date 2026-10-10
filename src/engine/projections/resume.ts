// resume_snapshot (SPC-0030, SPC-0020): where an adventure's play stands, kept
// per adventure and folded from its events, so the resume reads one row and
// `resumeFromLog` derives the same point from the log alone (REQ-0206).
import type Database from "better-sqlite3";
import type { StoredEvent } from "../events/read.js";
import type { Projection } from "./registry.js";
import { prepared } from "./statements.js";

type Db = Database.Database;

export interface ResumeView {
  locale: string;
  text: string;
  svg: string | null;
  options: string[] | null;
  terms: string[];
}

/** The task open on the screen, or none between two tasks. */
export interface OpenItem {
  itemId: string;
  attemptNo: 1 | 2;
  view: ResumeView;
  hintLevels: number[];
}

export interface ResumePoint {
  adventureId: string;
  /** How many first-attempt tasks the adventure has shown. */
  firstsShown: number;
  /** The position of the task open, or of the next one when none is open. */
  index: number;
  open: OpenItem | null;
  /** The position of each shown task; a twin takes its parent's. */
  positions: Record<string, number>;
  /** The tasks whose explanation she bought. */
  explained: string[];
  /** The log position of the last event folded in. */
  seq: number;
}

type P = Record<string, unknown>;

/** Folds one event into the point of its adventure; the same for the projection and the derivation. */
export function foldResume(
  point: ResumePoint | null,
  e: StoredEvent,
): ResumePoint | null {
  if (!e.adventureId) return point;
  const p = e.payload as P;
  const base: ResumePoint = point ?? {
    adventureId: e.adventureId,
    firstsShown: 0,
    index: 0,
    open: null,
    positions: {},
    explained: [],
    seq: e.seq,
  };
  const next: ResumePoint = {
    ...base,
    positions: { ...base.positions },
    explained: [...base.explained],
    seq: e.seq,
  };
  const itemId = p["itemId"] as string | undefined;
  switch (e.type) {
    case "item_shown": {
      const attemptNo = p["attemptNo"] as 1 | 2;
      const parent = p["parentItemId"] as string | undefined;
      const view = p["view"] as ResumeView;
      if (attemptNo === 1) {
        next.index = base.firstsShown;
        next.firstsShown = base.firstsShown + 1;
        next.positions[itemId as string] = next.index;
      } else {
        next.positions[itemId as string] =
          (parent && base.positions[parent]) || base.index;
      }
      next.open = {
        itemId: itemId as string,
        attemptNo,
        view,
        hintLevels: [],
      };
      return next;
    }
    case "hint_shown":
      if (base.open && base.open.itemId === itemId)
        next.open = {
          ...base.open,
          hintLevels: [...base.open.hintLevels, p["level"] as number],
        };
      return next;
    case "explanation_bought":
      if (itemId && !next.explained.includes(itemId))
        next.explained.push(itemId);
      return next;
    case "verdict":
      if (base.open && base.open.itemId === itemId) {
        next.open = null;
        // A first attempt answered moves the position to the next task.
        if (base.open.attemptNo === 1) next.index = base.firstsShown;
      }
      return next;
    default:
      return point === null ? null : next;
  }
}

/** The resume point the log alone gives, for the adventure the events belong to. */
export function resumeFromLog(
  events: Iterable<StoredEvent>,
): ResumePoint | null {
  let point: ResumePoint | null = null;
  for (const e of events) point = foldResume(point, e);
  return point;
}

const resumeSnapshot: Projection = {
  name: "resume_snapshot",
  class: "game",
  module: import.meta.url,
  table: "resume_snapshot",
  create: `CREATE TABLE resume_snapshot (
    adventure_id TEXT PRIMARY KEY,
    point TEXT NOT NULL,
    changed_seq INTEGER NOT NULL,
    computed_at TEXT NOT NULL
  ) STRICT`,
  apply(db: Db, e: StoredEvent, computedAt: string, table = "resume_snapshot") {
    if (!e.adventureId) return;
    const row = prepared(
      db,
      `SELECT point FROM ${table} WHERE adventure_id = ?`,
    ).get(e.adventureId) as { point: string } | undefined;
    const before = row ? (JSON.parse(row.point) as ResumePoint) : null;
    const after = foldResume(before, e);
    if (!after) return;
    prepared(
      db,
      `INSERT INTO ${table} (adventure_id, point, changed_seq, computed_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(adventure_id) DO UPDATE SET point = excluded.point,
         changed_seq = excluded.changed_seq, computed_at = excluded.computed_at`,
    ).run(e.adventureId, JSON.stringify(after), e.seq, computedAt);
  },
};

export const resume: Projection[] = [resumeSnapshot];
