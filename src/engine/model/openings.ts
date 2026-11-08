// What an ability level opens (REQ-8030, REQ-8032, ADR-3220): a table ties a node and a level to
// a possibility in the game, and an opening stays open after the level falls because it is read
// from the highest level the node ever reached, never from the level now.
import { readFileSync } from "node:fs";
import { z } from "zod";
import type { LevelChange } from "./levels.js";

const Opening = z.object({
  id: z.string().min(1),
  node: z.string().min(1),
  level: z.number().int().min(2).max(5),
});

export const OpeningsFile = z.object({ openings: z.array(Opening) });
export type OpeningT = z.infer<typeof Opening>;

/** The table in `content/openings.json`. */
export function loadOpenings(): OpeningT[] {
  const raw: unknown = JSON.parse(
    readFileSync(
      new URL("../../../content/openings.json", import.meta.url),
      "utf8",
    ),
  );
  return OpeningsFile.parse(raw).openings;
}

/** The faults of a table: a repeated id or a node the graph lacks. */
export function checkOpenings(
  openings: readonly OpeningT[],
  nodes: ReadonlySet<string>,
): string[] {
  const faults: string[] = [];
  const seen = new Set<string>();
  for (const o of openings) {
    if (seen.has(o.id)) faults.push(`opening_repeated:${o.id}`);
    seen.add(o.id);
    if (!nodes.has(o.node)) faults.push(`opening_node_unknown:${o.id}`);
  }
  return faults;
}

export interface NodeHistory {
  readonly node: string;
  readonly start: number;
  readonly changes: readonly Pick<LevelChange, "to">[];
}

/** The ids of the openings whose node ever reached the stated level, in table order. */
export function openedBy(
  openings: readonly OpeningT[],
  histories: readonly NodeHistory[],
): string[] {
  const peak = new Map(
    histories.map((h) => [
      h.node,
      Math.max(h.start, ...h.changes.map((c) => c.to)),
    ]),
  );
  return openings
    .filter((o) => (peak.get(o.node) ?? 0) >= o.level)
    .map((o) => o.id);
}
