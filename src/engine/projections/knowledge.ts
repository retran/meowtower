// The knowledge projections' storage (SPC-0020, TSK-0527, TSK-0528). The estimates, the states
// and the obligations need the whole log, so no single event folds into them: each is written
// by `fullPass` from the log, at the end of an adventure, at a recompute and at a rebuild.
// `node_snapshots` keeps one row per node and game day of play under each set of the four
// versions, so a new model or rules version adds its rows beside the old ones. Until a model
// is set (`useKnowledge`) the tables stay empty.
import type Database from "better-sqlite3";
import { allEvents, itemEvents, type StoredEvent } from "../events/read.js";
import type { ModelParamsT } from "../model/params.js";
import {
  type KnowledgeGraph,
  knowledgeOf,
  levelsOf,
  type OlympiadFacts,
  snapshotsOf,
} from "../model/project.js";
import type { Projection } from "./registry.js";
import { VERSIONS } from "./versions.js";

type Db = Database.Database;

/** What the knowledge model reads besides the log: its parameters, the graph and the game-day zone. */
export interface KnowledgeSetup {
  readonly params: ModelParamsT;
  readonly graph: KnowledgeGraph;
  readonly zone: string;
  readonly olympiad?: OlympiadFacts;
}

let setup: KnowledgeSetup | null = null;

/** Sets the model the knowledge tables are written with; `null` clears it. */
export function useKnowledge(next: KnowledgeSetup | null): void {
  setup = next;
}

type Estimates = ReturnType<typeof knowledgeOf>["estimates"];

/** The node an item belongs to, from the event that showed it. */
function nodeOfVerdict(db: Db, verdict: StoredEvent): string | undefined {
  const itemId = (verdict.payload as { itemId?: string }).itemId;
  if (itemId === undefined) return undefined;
  const shown = itemEvents(db, itemId).find((e) => e.type === "item_shown");
  return (shown?.payload as { node?: string } | undefined)?.node;
}

function writeEstimates(
  db: Db,
  target: string,
  estimates: Estimates,
  computedAt: string,
): void {
  const insert = db.prepare(
    `INSERT OR REPLACE INTO ${target} VALUES (@node, @subtype, @pKnow, @nEff, @uncertainty, @lastSeen,
      @stale, @nextReview, @confidence, @state, @rule, @items, @inferredState, @cutBy,
      @isGap, @helpA, @helpB, @fluentA, @fluentB, @computedAt)`,
  );
  for (const e of estimates)
    insert.run({
      node: e.node,
      subtype: e.subtype ?? "",
      pKnow: e.pKnow,
      nEff: e.nEff,
      uncertainty: e.uncertainty,
      lastSeen: e.lastSeen,
      stale: e.stale ? 1 : 0,
      nextReview: e.nextReview,
      confidence: e.confidence,
      state: e.state?.state ?? null,
      rule: e.state?.rule ?? null,
      items: e.state ? JSON.stringify(e.state.items) : null,
      inferredState: e.inferredState,
      cutBy: e.cutBy,
      isGap: e.isGap ? 1 : 0,
      helpA: e.withHelp?.alpha ?? null,
      helpB: e.withHelp?.beta ?? null,
      fluentA: e.fluency?.alpha ?? null,
      fluentB: e.fluency?.beta ?? null,
      computedAt,
    });
}

/** The parameters of the model in use, or null before any model is set. */
export const activeKnowledgeParams = (): ModelParamsT | null =>
  setup?.params ?? null;

const noFold = (): void => {};

const NO_OLYMPIAD: OlympiadFacts = { templates: new Set(), nodes: new Set() };

const nodeLevels: Projection = {
  name: "node_levels",
  class: "knowledge",
  module: import.meta.url,
  table: "node_levels",
  create: `CREATE TABLE node_levels (
    node TEXT PRIMARY KEY,
    level INTEGER NOT NULL,
    rule TEXT NOT NULL,
    warning INTEGER NOT NULL,
    changes TEXT NOT NULL,
    computed_at TEXT NOT NULL
  ) STRICT`,
  fullPass(db: Db, target: string, computedAt: string) {
    if (!setup) return;
    const levels = levelsOf(
      setup.graph,
      [...allEvents(db)],
      setup.params,
      setup.olympiad ?? NO_OLYMPIAD,
    );
    db.prepare(`DELETE FROM ${target}`).run();
    const insert = db.prepare(
      `INSERT INTO ${target} VALUES (?, ?, ?, ?, ?, ?)`,
    );
    for (const l of levels)
      insert.run(
        l.node,
        l.level,
        l.rule,
        l.warning ? 1 : 0,
        JSON.stringify(l.changes),
        computedAt,
      );
  },
  apply: noFold,
};

const nodeEstimates: Projection = {
  name: "node_estimates",
  class: "knowledge",
  module: import.meta.url,
  table: "node_estimates",
  create: `CREATE TABLE node_estimates (
    node TEXT NOT NULL,
    subtype TEXT NOT NULL,
    p_know REAL NOT NULL,
    n_eff REAL NOT NULL,
    uncertainty REAL NOT NULL,
    last_seen INTEGER,
    stale INTEGER NOT NULL,
    next_review INTEGER,
    confidence TEXT NOT NULL,
    state TEXT,
    rule TEXT,
    items TEXT,
    inferred_state TEXT,
    cut_by TEXT,
    is_gap INTEGER NOT NULL,
    with_help_alpha REAL,
    with_help_beta REAL,
    fluency_alpha REAL,
    fluency_beta REAL,
    computed_at TEXT NOT NULL,
    PRIMARY KEY (node, subtype)
  ) STRICT`,
  fullPass(db: Db, target: string, computedAt: string) {
    if (!setup) return;
    const log = [...allEvents(db)];
    const { estimates } = knowledgeOf(setup.graph, log, setup.params);
    db.prepare(`DELETE FROM ${target}`).run();
    writeEstimates(db, target, estimates, computedAt);
  },
  /**
   * After a verdict, the node's own rows are rewritten from the log, so the Director sees its
   * new estimate at once. The end-of-adventure pass replaces every row (REQ-0900), and a
   * failure here is logged and leaves the node's last rows, never the event (TSK-0527).
   */
  apply(db: Db, event: StoredEvent, computedAt: string, table?: string) {
    if (table !== undefined || !setup || event.type !== "verdict") return;
    try {
      const node = nodeOfVerdict(db, event);
      if (node === undefined) return;
      const { estimates } = knowledgeOf(
        setup.graph,
        [...allEvents(db)],
        setup.params,
      );
      db.prepare("DELETE FROM node_estimates WHERE node = ?").run(node);
      writeEstimates(
        db,
        "node_estimates",
        estimates.filter((e) => e.node === node),
        computedAt,
      );
    } catch (err) {
      console.error(
        `knowledge_update_failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  },
};

const nodeObligations: Projection = {
  name: "node_obligations",
  class: "knowledge",
  module: import.meta.url,
  table: "node_obligations",
  create: `CREATE TABLE node_obligations (
    node TEXT NOT NULL,
    kind TEXT NOT NULL,
    cut_by TEXT,
    computed_at TEXT NOT NULL,
    PRIMARY KEY (node, kind)
  ) STRICT`,
  apply: noFold,
  fullPass(db: Db, target: string, computedAt: string) {
    if (!setup) return;
    const log = [...allEvents(db)];
    const { obligations } = knowledgeOf(setup.graph, log, setup.params);
    db.prepare(`DELETE FROM ${target}`).run();
    const insert = db.prepare(`INSERT INTO ${target} VALUES (?, ?, ?, ?)`);
    for (const o of obligations)
      insert.run(o.node, o.kind, o.cutBy ?? null, computedAt);
  },
};

const nodeSnapshots: Projection = {
  name: "node_snapshots",
  class: "knowledge",
  module: import.meta.url,
  table: "node_snapshots",
  versioned: true,
  create: `CREATE TABLE node_snapshots (
    game_day INTEGER NOT NULL,
    node TEXT NOT NULL,
    p_know REAL NOT NULL,
    uncertainty REAL NOT NULL,
    state TEXT NOT NULL,
    rule TEXT NOT NULL,
    model_version TEXT NOT NULL,
    threshold_version TEXT NOT NULL,
    graph_version TEXT NOT NULL,
    rules_version TEXT NOT NULL,
    computed_at TEXT NOT NULL,
    PRIMARY KEY (game_day, node, model_version, threshold_version, graph_version, rules_version)
  ) STRICT`,
  apply: noFold,
  fullPass(db: Db, target: string, computedAt: string) {
    if (!setup) return;
    const log = [...allEvents(db)];
    const rows = snapshotsOf(setup.graph, log, setup.params, setup.zone);
    // Only the rows of the active versions are rewritten; earlier versions stay (REQ-0904).
    db.prepare(
      `DELETE FROM ${target} WHERE model_version = ? AND threshold_version = ? AND graph_version = ? AND rules_version = ?`,
    ).run(VERSIONS.model, VERSIONS.thresholds, VERSIONS.graph, VERSIONS.rules);
    const insert = db.prepare(
      `INSERT INTO ${target} VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    for (const r of rows)
      insert.run(
        r.day,
        r.node,
        r.pKnow,
        r.uncertainty,
        r.state,
        r.rule,
        VERSIONS.model,
        VERSIONS.thresholds,
        VERSIONS.graph,
        VERSIONS.rules,
        computedAt,
      );
  },
};

export const knowledge: Projection[] = [
  nodeEstimates,
  nodeLevels,
  nodeObligations,
  nodeSnapshots,
];

/**
 * The full pass over the live knowledge tables, in one transaction: the end of an adventure
 * runs it (TSK-0527). A failure leaves the tables as they were and throws.
 */
export function refreshKnowledge(db: Db, computedAt: string): void {
  db.transaction(() => {
    for (const p of knowledge) p.fullPass?.(db, p.table, computedAt);
  })();
}
