// The server's gate on outgoing text (ADR-0160, SPC-0160, TSK-0683, REQ-3326): every line passes
// `textGate` before it leaves, a blocked line leaves one `text_blocked` row and is replaced by the
// fallback line, and the counters per source and game day feed the `text_blocked_high` notice. The
// player's own words are exempt. The client holds no copy of the check.
import { mkdirSync } from "node:fs";
import type Database from "better-sqlite3";
import { gameDayOf } from "../shared/game-day.js";
import { t } from "../shared/i18n.js";
import { lang } from "../shared/i18n.js";
import { type Kind, textGate } from "../shared/voice/gate.js";
import { readNotices, writeNotices } from "./backups.js";
import type { Db } from "./database.js";
import { noticesDirectory } from "./failures.js";

export type Source =
  "master" | "pool" | "explainer" | "template" | "fixed" | "player";

/** The table keeps at most this many blocked lines; the oldest goes first. */
export const KEEP_ROWS = 1000;
/** A source above this share of a day's lines blocked raises `text_blocked_high`. */
export const HIGH_SHARE = 0.05;

/** The body fields that hold text the player reads. */
const TEXT_KEYS = new Set([
  "text",
  "battleLine",
  "shortSolution",
  "line",
  "lines",
]);

declare module "hono" {
  interface ContextVariableMap {
    outgoing: Outgoing;
  }
}

export interface LineContext {
  readonly source: Source;
  readonly kind?: Kind;
  readonly key?: string;
}

export interface Outgoing {
  /** The line itself when it passes, and the fallback line when it is blocked. */
  line(text: string, context: LineContext): string;
  /** A copy of `body` with every text field gated. */
  body<T>(body: T, source?: Source): T;
}

export function createOutgoing(
  db: Db,
  now: () => number = Date.now,
  zone = "UTC",
): Outgoing {
  // The statements are prepared on first use, so an app built on a closed database still starts
  // and /health can say so.
  let statements:
    | {
        count: Database.Statement<unknown[]>;
        share: Database.Statement<unknown[]>;
        insert: Database.Statement<unknown[]>;
        trim: Database.Statement<unknown[]>;
      }
    | undefined;
  const sql = () =>
    (statements ??= {
      count: db.prepare(
        `INSERT INTO text_counters (game_day, source, checked, blocked) VALUES (?, ?, 1, ?)
         ON CONFLICT (game_day, source) DO UPDATE SET checked = checked + 1, blocked = blocked + excluded.blocked`,
      ),
      share: db.prepare(
        "SELECT checked, blocked FROM text_counters WHERE game_day = ? AND source = ?",
      ),
      insert: db.prepare(
        "INSERT INTO text_blocked (at, source, kind, rule, match, line) VALUES (?, ?, ?, ?, ?, ?)",
      ),
      trim: db.prepare(
        "DELETE FROM text_blocked WHERE id <= (SELECT max(id) FROM text_blocked) - ?",
      ),
    });

  /** Raises `text_blocked_high` for a source once, and again when its share moved by over half. */
  const report = (source: string, current: number): void => {
    const dir = noticesDirectory();
    console.error(
      `text_blocked_high: ${source} has ${(current * 100).toFixed(1)} % blocked today`,
    );
    if (!dir) return;
    // A notice that can't be written stays in the log, and the line still goes out blocked.
    try {
      mkdirSync(dir, { recursive: true });
      const notices = readNotices(dir);
      const high = { ...(notices.text_blocked_high ?? {}) };
      const last = high[source];
      if (last && Math.abs(current - last.share) <= last.share / 2) return;
      high[source] = { at: new Date(now()).toISOString(), share: current };
      notices.text_blocked_high = high;
      writeNotices(dir, notices);
    } catch (error) {
      console.error(
        `notice_unwritable: text_blocked_high: ${(error as Error).message}`,
      );
    }
  };

  const line = (text: string, context: LineContext): string => {
    if (context.source === "player") return text;
    const kind = context.kind ?? "story";
    const result = textGate(text, {
      lang,
      kind,
      source: context.source,
      ...(context.key ? { key: context.key } : {}),
    });
    const day = gameDayOf(now(), zone);
    try {
      db.transaction(() => {
        sql().count.run(day, context.source, result.ok ? 0 : 1);
        if (!result.ok) {
          sql().insert.run(
            new Date(now()).toISOString(),
            context.source,
            kind,
            result.rule,
            result.match,
            text,
          );
          sql().trim.run(KEEP_ROWS);
        }
      })();
    } catch (error) {
      // The line is gated whether or not it could be counted.
      console.error(`text_counter_failed: ${(error as Error).message}`);
    }
    if (result.ok) return text;
    try {
      const row = sql().share.get(day, context.source) as
        { checked: number; blocked: number } | undefined;
      if (row && row.blocked / row.checked > HIGH_SHARE)
        report(context.source, row.blocked / row.checked);
    } catch (error) {
      console.error(`text_counter_failed: ${(error as Error).message}`);
    }
    return t("system.fallback.line");
  };

  const walk = (value: unknown, source: Source, key?: string): unknown => {
    if (typeof value === "string")
      return key !== undefined && TEXT_KEYS.has(key)
        ? line(value, { source })
        : value;
    if (Array.isArray(value)) return value.map((v) => walk(v, source, key));
    if (value && typeof value === "object")
      return Object.fromEntries(
        Object.entries(value).map(([k, v]) => [k, walk(v, source, k)]),
      );
    return value;
  };

  return {
    line,
    body: <T>(body: T, source: Source = "fixed") => walk(body, source) as T,
  };
}
