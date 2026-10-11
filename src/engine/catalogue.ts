// The build checks that tie templates and catalogue rows to the graph (ADR-0040,
// REQ-1244). A template or a catalogue row names a node and a subtype; a name the
// graph lacks fails the build, and a subtype with no template is `not_generatable`.
import type { Graph } from "./graph.js";

/** A template names the one node and subtype it generates for. */
export interface TemplateRef {
  readonly id: string;
  readonly node: string;
  readonly subtype: string;
}

/** A catalogue row names a node and the subtypes its row lists. */
export interface CatalogueRow {
  readonly node: string;
  readonly subtypes: readonly string[];
}

/** Fails the build when a template or a row names a node or subtype the graph lacks. */
export function checkCatalogue(
  graph: Graph,
  templates: readonly TemplateRef[],
  rows: readonly CatalogueRow[],
): void {
  const problems: string[] = [];
  const known = new Map(
    graph
      .nodes()
      .map((n) => [n.id, new Set(graph.subtypes(n.id).map((s) => s.id))]),
  );
  for (const t of templates) {
    const subs = known.get(t.node);
    if (subs === undefined)
      problems.push(`template ${t.id}: node ${t.node} is not in the graph`);
    else if (!subs.has(t.subtype))
      problems.push(
        `template ${t.id}: subtype ${t.subtype} is not in node ${t.node}`,
      );
  }
  for (const row of rows) {
    const subs = known.get(row.node);
    if (subs === undefined) {
      problems.push(
        `catalogue row ${row.node}: node ${row.node} is not in the graph`,
      );
      continue;
    }
    for (const s of row.subtypes)
      if (!subs.has(s))
        problems.push(
          `catalogue row ${row.node}: subtype ${s} is not in node ${row.node}`,
        );
  }
  if (problems.length > 0) throw new Error(`catalogue: ${problems.join("; ")}`);
}

/** Every subtype of the graph that no template generates: `not_generatable` (TSK-0509). */
export function notGeneratable(
  graph: Graph,
  templates: readonly TemplateRef[],
): string[] {
  const covered = new Set(templates.map((t) => `${t.node}.${t.subtype}`));
  return graph
    .nodes()
    .flatMap((n) => graph.subtypes(n.id).map((s) => `${n.id}.${s.id}`))
    .filter((key) => !covered.has(key));
}
