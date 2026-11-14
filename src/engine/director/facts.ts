// What the Director reads of each node (ADR-0070, REQ-8174): the knowledge model over the log, one
// `NodeFacts` for each node of the graph. It reads the log and never a stored table, so a sandbox
// whose rows were set by hand and one that was played give the same reading of the same log.
// Two facts have no source yet and read as zero: the stretch gate's admission and the lesson marks.
import type { Graph } from "../graph.js";
import type { LogEvent } from "../model/observations.js";
import type { ModelParamsT } from "../model/params.js";
import { type EstimateRow, knowledgeOf } from "../model/project.js";
import type { StateName } from "../states/rules.js";
import type { DirectorConfig, NodeFacts } from "./nextTask.js";

const DAY_MS = 86_400_000;

export interface FactsInput {
  readonly graph: Graph;
  readonly log: readonly LogEvent[];
  readonly params: ModelParamsT;
  readonly now: number;
  readonly config: DirectorConfig;
}

const stateOf = (row: EstimateRow | undefined, stretch: boolean): StateName =>
  row?.state?.state ?? (stretch ? "stretch: not checked" : "not checked");

/** Shows of each node inside the window that ends at `now`. */
function showsOf(
  log: readonly LogEvent[],
  now: number,
  days: number,
): Map<string, number> {
  const from = now - days * DAY_MS;
  const shows = new Map<string, number>();
  for (const e of log) {
    if (e.type !== "item_shown" || e.ts === undefined) continue;
    const at = Date.parse(e.ts);
    if (at < from || at > now) continue;
    const node = (e.payload as { node?: unknown }).node;
    if (typeof node === "string") shows.set(node, (shows.get(node) ?? 0) + 1);
  }
  return shows;
}

/** The facts of every node of the graph, in the graph's order. */
export function nodeFactsOf(input: FactsInput): NodeFacts[] {
  const { graph, log, params, now, config } = input;
  const known = knowledgeOf(graph, log, params);
  const nodeRows = new Map<string, EstimateRow>();
  const subtypeRows = new Map<string, EstimateRow>();
  for (const row of known.estimates)
    if (row.subtype === null) nodeRows.set(row.node, row);
    else subtypeRows.set(`${row.node}|${row.subtype}`, row);
  const shows = showsOf(log, now, config.recentShowsDays);
  const stretchOf = new Map(
    graph.nodes().map((n) => [n.id, n.level === "stretch"]),
  );
  return graph.nodes().map((n) => {
    const row = nodeRows.get(n.id);
    const stretch = n.level === "stretch";
    return {
      node: n.id,
      stretch,
      admitted: false,
      state: stateOf(row, stretch),
      inferredState: row?.inferredState ?? null,
      cutBy: row?.cutBy ?? null,
      uncertainty: row?.uncertainty ?? 1,
      lastSeen: row?.lastSeen ?? null,
      obligations: known.obligations
        .filter((o) => o.node === n.id)
        .map((o) => o.kind),
      recheckDue: 0,
      freshMark: 0,
      recentShows: shows.get(n.id) ?? 0,
      prereqs: graph.prereqs(n.id).map((p) => {
        const pr = nodeRows.get(p.node);
        return {
          state: stateOf(pr, stretchOf.get(p.node) ?? false),
          inferredState: pr?.inferredState ?? null,
          cutBy: pr?.cutBy ?? null,
        };
      }),
      subtypes: graph.subtypes(n.id).map((s) => {
        const sr = subtypeRows.get(`${n.id}|${s.id}`);
        return { id: s.id, pKnow: sr?.pKnow ?? 0, nEff: sr?.nEff ?? 0 };
      }),
    };
  });
}
