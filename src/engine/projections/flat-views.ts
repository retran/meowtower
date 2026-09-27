// items_view and attempts_view (SPC-0020): one row per task shown and one per
// attempt, with the parent's corrections applied as flags, never as edits to
// the events (REQ-2228).
import type Database from "better-sqlite3";
import type { StoredEvent } from "../events/read.js";
import type { Projection } from "./registry.js";

type Db = Database.Database;
type P = Record<string, unknown>;

const itemsView: Projection = {
  name: "items_view",
  table: "items_view",
  create: `CREATE TABLE items_view (
    item_id TEXT PRIMARY KEY,
    session_id TEXT,
    template_id TEXT NOT NULL,
    template_version INTEGER NOT NULL,
    node TEXT NOT NULL,
    subtype TEXT NOT NULL,
    purpose TEXT NOT NULL,
    attempt_no INTEGER NOT NULL,
    parent_item_id TEXT,
    correct_answer TEXT NOT NULL,
    shown_seq INTEGER NOT NULL,
    excluded INTEGER NOT NULL DEFAULT 0,
    flagged INTEGER NOT NULL DEFAULT 0,
    computed_at TEXT NOT NULL
  ) STRICT`,
  apply(db: Db, e: StoredEvent, computedAt: string) {
    const p = e.payload as P;
    if (e.type === "item_shown") {
      db.prepare(
        `INSERT INTO items_view (item_id, session_id, template_id, template_version, node, subtype,
           purpose, attempt_no, parent_item_id, correct_answer, shown_seq, computed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        p["itemId"],
        e.sessionId,
        p["templateId"],
        p["templateVersion"],
        p["node"],
        p["subtype"],
        p["purpose"],
        p["attemptNo"],
        p["parentItemId"] ?? null,
        p["correctAnswer"],
        e.seq,
        computedAt,
      );
    } else if (e.type === "item_flagged" || e.type === "item_excluded") {
      const column = e.type === "item_flagged" ? "flagged" : "excluded";
      db.prepare(
        `UPDATE items_view SET ${column} = 1, computed_at = ? WHERE item_id = ?`,
      ).run(computedAt, p["itemId"]);
    }
  },
};

const attemptsView: Projection = {
  name: "attempts_view",
  table: "attempts_view",
  create: `CREATE TABLE attempts_view (
    item_id TEXT NOT NULL,
    attempt_no INTEGER NOT NULL,
    session_id TEXT,
    entered TEXT,
    assisted INTEGER,
    hint_level INTEGER,
    submitted_ms INTEGER,
    input_method TEXT,
    verdict TEXT,
    outcome TEXT,
    trap_id TEXT,
    excluded INTEGER NOT NULL DEFAULT 0,
    flagged INTEGER NOT NULL DEFAULT 0,
    computed_at TEXT NOT NULL,
    PRIMARY KEY (item_id, attempt_no)
  ) STRICT`,
  apply(db: Db, e: StoredEvent, computedAt: string) {
    const p = e.payload as P;
    if (e.type === "attempt_submitted" && e.v >= 1) {
      const input = p["input"] as P;
      const answer = p["answer"] as P;
      db.prepare(
        `INSERT INTO attempts_view (item_id, attempt_no, session_id, entered, assisted, hint_level,
           submitted_ms, input_method, computed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(item_id, attempt_no) DO UPDATE SET entered = excluded.entered,
           assisted = excluded.assisted, hint_level = excluded.hint_level,
           submitted_ms = excluded.submitted_ms, input_method = excluded.input_method,
           computed_at = excluded.computed_at`,
      ).run(
        p["itemId"],
        p["attemptNo"],
        e.sessionId,
        answer["entered"],
        p["assisted"] ? 1 : 0,
        p["hintLevel"],
        input["submittedMs"],
        input["method"],
        computedAt,
      );
    } else if (e.type === "verdict") {
      db.prepare(
        `INSERT INTO attempts_view (item_id, attempt_no, session_id, verdict, outcome, trap_id, computed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(item_id, attempt_no) DO UPDATE SET verdict = excluded.verdict,
           outcome = excluded.outcome, trap_id = excluded.trap_id, computed_at = excluded.computed_at`,
      ).run(
        p["itemId"],
        p["attemptNo"],
        e.sessionId,
        p["verdict"],
        p["outcome"],
        p["trapId"],
        computedAt,
      );
    } else if (e.type === "item_flagged" || e.type === "item_excluded") {
      const column = e.type === "item_flagged" ? "flagged" : "excluded";
      db.prepare(
        `UPDATE attempts_view SET ${column} = 1, computed_at = ? WHERE item_id = ?`,
      ).run(computedAt, p["itemId"]);
    }
  },
};

export const flatViews: readonly Projection[] = [itemsView, attemptsView];
