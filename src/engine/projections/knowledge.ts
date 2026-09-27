// The knowledge projections' storage (SPC-0020, TSK-0270). `node_snapshots`
// keeps a row per node and event under each set of versions, so a new model
// adds its rows beside the old ones. What a node's value is comes from the
// knowledge model of ADR-0060; until that exists no model is set and the
// table stays empty.
import type Database from "better-sqlite3";
import type { StoredEvent } from "../events/read.js";
import type { Projection } from "./registry.js";
import { VERSIONS } from "./versions.js";
import { prepared } from "./statements.js";

type Db = Database.Database;

export interface NodeValue {
  node: string;
  value: number;
}

/** A pure function of the event and the versions; ADR-0060's model is one. */
export type KnowledgeModel = (
  event: StoredEvent,
  versions: typeof VERSIONS,
) => NodeValue[];

let model: KnowledgeModel | null = null;

/** Sets the knowledge model the snapshots fold with; `null` clears it. */
export function useKnowledgeModel(next: KnowledgeModel | null): void {
  model = next;
}

const nodeSnapshots: Projection = {
  name: "node_snapshots",
  table: "node_snapshots",
  versioned: true,
  create: `CREATE TABLE node_snapshots (
    node TEXT NOT NULL,
    seq INTEGER NOT NULL,
    value REAL NOT NULL,
    model_version TEXT NOT NULL,
    threshold_version TEXT NOT NULL,
    graph_version TEXT NOT NULL,
    computed_at TEXT NOT NULL,
    PRIMARY KEY (node, seq, model_version, threshold_version, graph_version)
  ) STRICT`,
  apply(db: Db, e: StoredEvent, computedAt: string, table = "node_snapshots") {
    if (!model) return;
    for (const { node, value } of model(e, VERSIONS)) {
      prepared(
        db,
        `INSERT OR REPLACE INTO ${table} (node, seq, value, model_version, threshold_version, graph_version, computed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ).run(
        node,
        e.seq,
        value,
        VERSIONS.model,
        VERSIONS.thresholds,
        VERSIONS.graph,
        computedAt,
      );
    }
  },
};

export const knowledge: Projection[] = [nodeSnapshots];
