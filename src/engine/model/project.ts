// The knowledge projections of one log (ADR-0060, SPC-0060, TSK-0527, TSK-0528): the node and
// subtype rows of the estimates, the states beside them, the obligations, and one snapshot per
// game day of play. Pure: the log, the graph and the parameter file are arguments, and the
// forgetting is evaluated at the newest event's time, so the same log gives the same rows at
// any later clock (ADR-0370).
import { gameDayOf } from "../../shared/game-day.js";
import { rowsOf, type Row } from "./aggregate.js";
import { estimatePairs } from "./bkt.js";
import { fluencyOf, type Beta, withHelpOf } from "./beta.js";
import { type LogEvent, observationsOf } from "./observations.js";
import { type ModelParamsT } from "./params.js";
import { priorOf, rowOf } from "./priors.js";
import { marksOf } from "../states/checks.js";
import {
  inferredOf,
  type Obligation,
  obligationsOf,
} from "../states/inference.js";
import {
  groupByNode,
  type NodeState,
  statesOfObservations,
} from "../states/rules.js";

export interface KnowledgeGraph {
  nodes(): { id: string; level: string }[];
  subtypes(id: string): { id: string; level: string; weight: number }[];
  prereqs(id: string): { node: string; subtype: string | undefined }[];
}

type Level = "1F" | "1S" | "stretch";

/** One row of the estimates: a node (subtype null) or one of its subtypes. */
export interface EstimateRow {
  readonly node: string;
  readonly subtype: string | null;
  readonly pKnow: number;
  readonly nEff: number;
  readonly uncertainty: number;
  readonly lastSeen: number | null;
  readonly stale: boolean;
  readonly nextReview: number | null;
  readonly confidence: Row["confidence"];
  /** Node rows only: the tested state, its rule and the items it read. */
  readonly state: NodeState | null;
  /** Node rows only: the inferred state, the node that cut it off, and whether it is a gap. */
  readonly inferredState: string | null;
  readonly cutBy: string | null;
  readonly isGap: boolean;
  /** Node rows only: the "with help" and fluency beta estimates (TSK-0521). */
  readonly withHelp: Beta | null;
  readonly fluency: Beta | null;
}

export interface Knowledge {
  readonly estimates: EstimateRow[];
  readonly obligations: Obligation[];
  /** The newest event's time in milliseconds, the time every forgetting step is read at. */
  readonly now: number;
}

const newestTime = (log: readonly LogEvent[]): number => {
  let now = 0;
  for (const e of log) {
    const t = e.ts === undefined ? 0 : Date.parse(e.ts);
    if (t > now) now = t;
  }
  return now;
};

/** The knowledge of a log: estimates, states, inference and obligations, all in one pass. */
export function knowledgeOf(
  graph: KnowledgeGraph,
  log: readonly LogEvent[],
  params: ModelParamsT,
): Knowledge {
  const { own, help } = observationsOf(log);
  const now = newestTime(log);
  const group = rowOf(log);
  const levelOf = new Map<string, Level>();
  for (const n of graph.nodes()) {
    for (const s of graph.subtypes(n.id))
      levelOf.set(`${n.id}|${s.id}`, s.level as Level);
  }
  const levelFor = (node: string, subtype: string): Level =>
    levelOf.get(`${node}|${subtype}`) ?? "1F";
  const prior = (node: string, subtype: string): number =>
    priorOf(params, group, levelFor(node, subtype));
  const pairs = estimatePairs(own, params, prior);
  const rows = rowsOf(
    graph,
    own,
    pairs,
    (node, subtype, level) => priorOf(params, group, level as Level),
    now,
  );
  const states = statesOfObservations(graph, own, marksOf(log));
  const stateOf = new Map(states.map((s) => [s.node, s]));
  const inferred = inferredOf(graph, states, now);
  const inferredOf_ = new Map(inferred.map((r) => [r.node, r]));
  const ownByNode = groupByNode(own);
  const helpByNode = groupByNode(help);

  const estimates = rows.map((row): EstimateRow => {
    const node = row.node;
    const isNode = row.subtype === null;
    const state = isNode ? (stateOf.get(node) ?? null) : null;
    const inf = isNode ? inferredOf_.get(node) : undefined;
    return {
      node,
      subtype: row.subtype,
      pKnow: row.pKnow,
      nEff: row.nEff,
      uncertainty: row.uncertainty,
      lastSeen: row.lastSeen,
      stale: row.stale,
      nextReview: row.nextReview,
      confidence: row.confidence,
      state,
      inferredState: inf?.inferredState ?? null,
      cutBy: inf?.cutBy ?? null,
      isGap: inf?.isGap ?? false,
      withHelp: isNode ? withHelpOf(helpByNode.get(node) ?? [], now) : null,
      fluency: isNode ? fluencyOf(ownByNode.get(node) ?? [], now) : null,
    };
  });
  return {
    estimates,
    obligations: obligationsOf(graph, states, inferred, now),
    now,
  };
}

export interface SnapshotRow {
  /** The game day of play, as `gameDayOf` counts it. */
  readonly day: number;
  readonly node: string;
  readonly pKnow: number;
  readonly uncertainty: number;
  readonly state: string;
  readonly rule: string;
}

/**
 * One snapshot of every node per game day of play: the knowledge of the log up to the end of
 * that day, read at its newest event (TSK-0528). A day with no play has no rows.
 */
export function snapshotsOf(
  graph: KnowledgeGraph,
  log: readonly LogEvent[],
  params: ModelParamsT,
  zone: string,
): SnapshotRow[] {
  const dayOf = (e: LogEvent): number =>
    gameDayOf(e.ts === undefined ? 0 : Date.parse(e.ts), zone);
  const days = [...new Set(log.map(dayOf))].sort((a, b) => a - b);
  const out: SnapshotRow[] = [];
  for (const day of days) {
    const upTo = log.filter((e) => dayOf(e) <= day);
    for (const row of knowledgeOf(graph, upTo, params).estimates) {
      if (row.subtype !== null || row.state === null) continue;
      out.push({
        day,
        node: row.node,
        pKnow: row.pKnow,
        uncertainty: row.uncertainty,
        state: row.state.state,
        rule: row.state.rule,
      });
    }
  }
  return out;
}
