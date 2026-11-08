// The falls the Parent Room lists (REQ-8006): each fall of a node's level and of the rank, from
// the `node_levels` and `rank_state` projections. The parent sees raw nodes and the rank; the
// player's sheet never does.
import { SKILLS } from "../engine/model/skills.js";
import type { Db } from "./database.js";

export type Fall =
  | {
      kind: "skill";
      skill: string;
      node: string;
      from: number;
      to: number;
      at: string;
    }
  | { kind: "rank"; from: string; to: string; day: number };

interface Changes {
  from: number | string;
  to: number | string;
  fell: boolean;
  at?: number;
  day?: number;
}

const skillOf = (node: string): string =>
  SKILLS.find((s) => s.domain === node.slice(0, 1))?.skill ?? node;

/** Every fall in the projections, the newest first: skills by time, then rank by game day. */
export async function fallsRead(db: Db): Promise<Fall[]> {
  const skills: Fall[] = [];
  for (const row of (await db
    .prepare("SELECT node, changes FROM node_levels")
    .all()) as { node: string; changes: string }[])
    for (const c of JSON.parse(row.changes) as Changes[])
      if (c.fell && c.at !== undefined)
        skills.push({
          kind: "skill",
          skill: skillOf(row.node),
          node: row.node,
          from: c.from as number,
          to: c.to as number,
          at: new Date(c.at).toISOString(),
        });
  skills.sort((a, b) =>
    a.kind === "skill" && b.kind === "skill" ? b.at.localeCompare(a.at) : 0,
  );
  const rank = (await db
    .prepare("SELECT changes FROM rank_state WHERE id = 1")
    .get()) as { changes: string } | undefined;
  const ranks: Fall[] = rank
    ? (JSON.parse(rank.changes) as Changes[])
        .filter((c) => c.fell && c.day !== undefined)
        .map((c) => ({
          kind: "rank" as const,
          from: c.from as string,
          to: c.to as string,
          day: c.day as number,
        }))
        .reverse()
    : [];
  return [...ranks, ...skills];
}
