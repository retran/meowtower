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

/** The scene on the screen: as prepared, with the draft she last typed. */
export interface OpenScene {
  sceneId: string;
  lines: { speaker: string; text: string }[];
  branches: { choiceId: string; text: string }[];
  draft: string | null;
}

/** The chest she has not yet picked from, with the three options it offered. */
export interface OpenChest {
  chestId: string;
  options: { kind: string; rewardId: string; quality: string }[];
}

/** A grant the client has not yet shown. */
export interface PendingReward {
  rewardId: string;
  kind: string;
  amount: number;
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
  /** The scene prepared and not yet answered, or none. */
  scene: OpenScene | null;
  /** The chest offered and not yet picked from, or none. */
  chest: OpenChest | null;
  /** The grants no `rewards_delivered` has covered, in the order granted. */
  rewards: PendingReward[];
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
  // A row written before the scene, chest and rewards joined the point has
  // none of the three; the defaults come first so a stored value overrides them.
  const base: ResumePoint = {
    scene: null,
    chest: null,
    rewards: [],
    ...(point ?? {
      adventureId: e.adventureId,
      firstsShown: 0,
      index: 0,
      open: null,
      positions: {},
      explained: [],
      seq: e.seq,
    }),
  };
  const next: ResumePoint = {
    ...base,
    positions: { ...base.positions },
    explained: [...base.explained],
    rewards: [...base.rewards],
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
    case "scene_prepared":
      next.scene = {
        sceneId: p["sceneId"] as string,
        lines: p["lines"] as OpenScene["lines"],
        branches: p["branches"] as OpenScene["branches"],
        draft: null,
      };
      return next;
    case "text_draft_saved":
      if (base.scene && base.scene.sceneId === p["sceneId"])
        next.scene = { ...base.scene, draft: p["text"] as string };
      return next;
    case "choice_made":
    case "free_text":
      if (base.scene && base.scene.sceneId === p["sceneId"]) next.scene = null;
      return next;
    case "chest_offered":
      next.chest = {
        chestId: p["chestId"] as string,
        options: p["options"] as OpenChest["options"],
      };
      return next;
    case "chest_chosen":
      if (base.chest && base.chest.chestId === p["chestId"]) next.chest = null;
      return next;
    case "reward_granted":
      next.rewards.push({
        rewardId: p["rewardId"] as string,
        kind: p["kind"] as string,
        amount: p["amount"] as number,
      });
      return next;
    case "rewards_delivered": {
      const shown = new Set(p["rewardIds"] as string[]);
      next.rewards = base.rewards.filter((r) => !shown.has(r.rewardId));
      return next;
    }
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
