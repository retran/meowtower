// The parent's audits (ADR-3100): every model call as it left and came back, and the game as it was
// played, task by task. Both read stored rows and write nothing.
import { eventsOfType, itemEvents } from "../engine/events/read.js";
import type { Db } from "./database.js";

export interface LlmRow {
  readonly id: number;
  readonly at: string;
  readonly role: string;
  readonly route: string;
  readonly model: string;
  readonly tier: string;
  readonly input_tokens: number;
  readonly output_tokens: number;
  readonly cost_usd: number;
  readonly latency_ms: number;
  readonly outcome: string;
  readonly request: string;
  readonly response: string;
}

export const llmAudit = (db: Db, limit: number): LlmRow[] =>
  db
    .prepare("SELECT * FROM llm_log ORDER BY id DESC LIMIT ?")
    .all(limit) as LlmRow[];

export interface PlayRow {
  readonly at: string;
  readonly itemId: string;
  readonly sessionId: string | null;
  readonly templateId: string;
  readonly node: string;
  readonly attemptNo: number;
  readonly source: string;
  readonly text: string;
  readonly correctAnswer: string;
  readonly answer: string | null;
  readonly verdict: string | null;
  readonly hints: number;
}

interface Shown {
  itemId: string;
  templateId?: string;
  node?: string;
  attemptNo: number;
  frameSource?: string;
  view: { text: string };
  correctAnswer: string;
}

/** The latest tasks, newest first, each with what was answered and how it was judged. */
export function playAudit(db: Db, limit: number): PlayRow[] {
  return eventsOfType(db, "item_shown")
    .slice(-limit)
    .reverse()
    .map((event) => {
      const shown = event.payload as Shown;
      const later = itemEvents(db, shown.itemId);
      const payloadOf = (type: string): unknown =>
        later.find((e) => e.type === type)?.payload;
      const answer = payloadOf("attempt_submitted") as
        { raw?: string } | undefined;
      const verdict = payloadOf("verdict") as { verdict?: string } | undefined;
      return {
        at: event.ts,
        itemId: shown.itemId,
        sessionId: event.sessionId,
        templateId: shown.templateId ?? "",
        node: shown.node ?? "",
        attemptNo: shown.attemptNo,
        source: shown.frameSource ?? "template",
        text: shown.view.text,
        correctAnswer: shown.correctAnswer,
        answer: answer?.raw ?? null,
        verdict: verdict?.verdict ?? null,
        hints: later.filter((e) => e.type === "hint_shown").length,
      };
    });
}

export interface Dashboard {
  readonly tasks: number;
  readonly answered: number;
  readonly correct: number;
  readonly live: number;
  readonly calls: number;
  readonly failed: number;
  readonly monthUsd: number;
  readonly frames: readonly { status: string; step: string; count: number }[];
}

export function dashboard(db: Db, now: Date): Dashboard {
  const rows = playAudit(db, Number.MAX_SAFE_INTEGER);
  const judged = rows.filter((r) => r.verdict !== null);
  const calls = db
    .prepare(
      `SELECT COUNT(*) AS calls, COALESCE(SUM(outcome != 'ok'), 0) AS failed,
         COALESCE(SUM(CASE WHEN at >= ? THEN cost_usd ELSE 0 END), 0) AS month
       FROM llm_log`,
    )
    .get(`${now.toISOString().slice(0, 7)}-01`) as {
    calls: number;
    failed: number;
    month: number;
  };
  return {
    tasks: rows.length,
    answered: judged.length,
    correct: judged.filter((r) => r.verdict === "correct").length,
    live: rows.filter((r) => r.source === "live").length,
    calls: calls.calls,
    failed: calls.failed,
    monthUsd: calls.month,
    frames: db
      .prepare(
        `SELECT status, COALESCE(step, '') AS step, COUNT(*) AS count FROM frames
         GROUP BY status, step ORDER BY count DESC`,
      )
      .all() as Dashboard["frames"],
  };
}
