// parent_settings (SPC-0030): the latest value of each parent setting, folded
// from `settings_changed`. A setting with no row holds its default, which the
// reader supplies.
import type Database from "better-sqlite3";
import type { StoredEvent } from "../events/read.js";
import type { Projection } from "./registry.js";
import { prepared } from "./statements.js";

type Db = Database.Database;

const parentSettings: Projection = {
  name: "parent_settings",
  class: "game",
  module: import.meta.url,
  table: "parent_settings",
  create: `CREATE TABLE parent_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    changed_seq INTEGER NOT NULL,
    computed_at TEXT NOT NULL
  ) STRICT`,
  apply(db: Db, e: StoredEvent, computedAt: string, table = "parent_settings") {
    if (e.type !== "settings_changed") return;
    const p = e.payload as { key: string; value: unknown };
    prepared(
      db,
      `INSERT INTO ${table} (key, value, changed_seq, computed_at) VALUES (?, ?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value,
         changed_seq = excluded.changed_seq, computed_at = excluded.computed_at`,
    ).run(p.key, JSON.stringify(p.value ?? null), e.seq, computedAt);
  },
};

export const settings: Projection[] = [parentSettings];
