// inventory and reward_queue (SPC-0020, SPC-0030): what she holds, and the
// secrets the three-day rule queued to return later. Both only fold what the
// log holds, so a rebuild gives the same rows; ADR-0140's epic gives the
// inventory its rules for forging, spending and returning queued secrets.
import type Database from "better-sqlite3";
import type { StoredEvent } from "../events/read.js";
import type { Projection } from "./registry.js";
import { prepared } from "./statements.js";

type Db = Database.Database;

/** One row per grant, never removed: a wrap-up keeps everything she earned (REQ-0230). */
const inventory: Projection = {
  name: "inventory",
  class: "game",
  module: import.meta.url,
  table: "inventory",
  create: `CREATE TABLE inventory (
    seq INTEGER PRIMARY KEY,
    adventure_id TEXT,
    reward_id TEXT NOT NULL,
    kind TEXT NOT NULL,
    amount INTEGER NOT NULL,
    source TEXT NOT NULL,
    computed_at TEXT NOT NULL
  ) STRICT`,
  apply(db: Db, e: StoredEvent, computedAt: string, table = "inventory") {
    if (e.type !== "reward_granted") return;
    const p = e.payload as {
      rewardId: string;
      kind: string;
      amount: number;
      source: string;
    };
    prepared(
      db,
      `INSERT INTO ${table} (seq, adventure_id, reward_id, kind, amount, source, computed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(seq) DO NOTHING`,
    ).run(
      e.seq,
      e.adventureId,
      p.rewardId,
      p.kind,
      p.amount,
      p.source,
      computedAt,
    );
  },
};

/** The secrets an adventure's wrap-up queued, one row each (REQ-0232). */
const rewardQueue: Projection = {
  name: "reward_queue",
  class: "game",
  module: import.meta.url,
  table: "reward_queue",
  create: `CREATE TABLE reward_queue (
    adventure_id TEXT NOT NULL,
    secret_id TEXT NOT NULL,
    queued_seq INTEGER NOT NULL,
    computed_at TEXT NOT NULL,
    PRIMARY KEY (adventure_id, secret_id)
  ) STRICT`,
  apply(db: Db, e: StoredEvent, computedAt: string, table = "reward_queue") {
    if (e.type !== "adventure_wrapped_up") return;
    const p = e.payload as { adventureId: string; unopenedSecrets: string[] };
    for (const secret of p.unopenedSecrets)
      prepared(
        db,
        `INSERT INTO ${table} (adventure_id, secret_id, queued_seq, computed_at)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(adventure_id, secret_id) DO NOTHING`,
      ).run(p.adventureId, secret, e.seq, computedAt);
  },
};

export const rewards: Projection[] = [inventory, rewardQueue];
