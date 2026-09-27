// items_view and attempts_view (SPC-0020): one row per task shown and one per
// attempt, with the parent's corrections applied as flags, never as edits to
// the events (REQ-2228).
import type Database from "better-sqlite3";
import type { StoredEvent } from "../events/read.js";
import type { Projection } from "./registry.js";
import { prepared } from "./statements.js";

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
  apply(db: Db, e: StoredEvent, computedAt: string, table = "items_view") {
    const p = e.payload as P;
    if (e.type === "item_shown") {
      prepared(
        db,
        `INSERT INTO ${table} (item_id, session_id, template_id, template_version, node, subtype,
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
      prepared(
        db,
        `UPDATE ${table} SET ${column} = 1, computed_at = ? WHERE item_id = ?`,
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
  apply(db: Db, e: StoredEvent, computedAt: string, table = "attempts_view") {
    const p = e.payload as P;
    if (e.type === "attempt_submitted" && e.v >= 1) {
      const input = p["input"] as P;
      const answer = p["answer"] as P;
      prepared(
        db,
        `INSERT INTO ${table} (item_id, attempt_no, session_id, entered, assisted, hint_level,
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
      prepared(
        db,
        `INSERT INTO ${table} (item_id, attempt_no, session_id, verdict, outcome, trap_id, computed_at)
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
      prepared(
        db,
        `UPDATE ${table} SET ${column} = 1, computed_at = ? WHERE item_id = ?`,
      ).run(computedAt, p["itemId"]);
    }
  },
};

export const flatViews: readonly Projection[] = [itemsView, attemptsView];

/** What each column of the flat views means: the export's field dictionary. */
export const VIEW_COLUMNS: Record<string, Record<string, string>> = {
  items_view: {
    item_id: "the opaque identifier of the task shown",
    session_id: "the session it was shown in",
    template_id: "the template that generated it",
    template_version: "the template's version",
    node: "the skill-graph node",
    subtype: "the node's subtype",
    purpose: "why the Director chose it",
    attempt_no: "1 for a first attempt's task, 2 for a second attempt's twin",
    parent_item_id: "for a twin, the task it follows",
    correct_answer: "the correct answer as shown",
    shown_seq: "the log sequence number of its item_shown event",
    excluded: "1 when the parent excluded the task",
    flagged: "1 when the parent flagged the task",
    computed_at: "when the row was last computed",
  },
  attempts_view: {
    item_id: "the task answered",
    attempt_no: "1 or 2",
    session_id: "the session",
    entered: "the answer as entered",
    assisted: "1 when help came before the answer",
    hint_level: "the highest hint rung shown before the answer",
    submitted_ms: "time from showing the task to submission",
    input_method: "how the answer was entered",
    verdict: "the checker's verdict",
    outcome: "the game outcome",
    trap_id: "the misconception the answer matched, if any",
    excluded: "1 when the parent excluded the task",
    flagged: "1 when the parent flagged the task",
    computed_at: "when the row was last computed",
  },
};
