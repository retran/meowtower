// A kept generated adventure makes its encounters nodes of the studio (ADR-3360, REQ-8260): each
// encounter of the scenario, then its endings as encounters of their own, so every exit leads to a node
// the parent can read, edit and play. The bodies are cut to what a save of the form accepts.
import { randomUUID } from "node:crypto";
import type { Db } from "../db/index.js";
import { CHECKS_MAX, TEXT_MAX } from "./body-check.js";
import { createNode, currentBodyOf } from "./store.js";

export interface PlannedNode {
  readonly id: string;
  readonly title: string;
  readonly body: Record<string, unknown>;
}

/** Fields the scenario writer adds besides the form's own; they pass through as they are. */
const WRITERS_OWN = [
  "act",
  "beat",
  "tension",
  "value",
  "line",
  "subtext",
  "accepts",
] as const;

const TITLE_MAX = 120;

const objectOf = (v: unknown): Record<string, unknown> | null =>
  typeof v === "object" && v !== null && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : null;

const textOf = (v: unknown, max = TEXT_MAX): string | null =>
  typeof v === "string" && v.trim() !== "" ? v.trim().slice(0, max) : null;

/**
 * The nodes a scenario makes, in the order they are made: its start, its other encounters in their
 * order, then its endings. `newId` gives each node its id, so exits can name the nodes they lead to.
 */
export function planEncounters(
  scenario: unknown,
  newId: () => string,
): PlannedNode[] {
  const s = objectOf(scenario);
  if (!s || !Array.isArray(s["encounters"])) return [];
  const encounters = (s["encounters"] as unknown[]).flatMap((raw) => {
    const e = objectOf(raw);
    const id = textOf(e?.["id"]);
    return e && id ? [{ id, e }] : [];
  });
  if (encounters.length === 0) return [];
  const endings = (
    Array.isArray(s["endings"]) ? (s["endings"] as unknown[]) : []
  ).flatMap((raw) => {
    const e = objectOf(raw);
    const id = textOf(e?.["id"]);
    const outcome = textOf(e?.["outcome"]);
    return id && outcome ? [{ id, outcome }] : [];
  });
  const start = encounters.findIndex((x) => x.id === s["start"]);
  const ordered =
    start > 0
      ? [
          encounters[start],
          ...encounters.filter((_, i) => i !== start),
        ].flatMap((x) => (x ? [x] : []))
      : encounters;
  const ids = new Map<string, string>();
  for (const x of ordered) ids.set(x.id, newId());
  for (const x of endings) if (!ids.has(x.id)) ids.set(x.id, newId());

  const made = ordered.map(({ id, e }): PlannedNode => {
    const body: Record<string, unknown> = {};
    for (const field of ["place", "situation", "goal", "pressure"] as const) {
      const v = textOf(e[field]);
      if (v) body[field] = v;
    }
    if (typeof e["checks"] === "number" && Number.isFinite(e["checks"]))
      body["checks"] = Math.min(
        CHECKS_MAX,
        Math.max(0, Math.trunc(e["checks"])),
      );
    const people = (
      Array.isArray(e["people"]) ? (e["people"] as unknown[]) : []
    ).flatMap((raw) => {
      const p = objectOf(raw);
      const name = textOf(p?.["name"]);
      return p && name ? [{ name, aim: textOf(p["aim"]) ?? "" }] : [];
    });
    if (people.length > 0) body["people"] = people;
    const exits = (
      Array.isArray(e["exits"]) ? (e["exits"] as unknown[]) : []
    ).flatMap((raw) => {
      const x = objectOf(raw);
      const when = textOf(x?.["when"]);
      const next =
        typeof x?.["next"] === "string" ? ids.get(x["next"]) : undefined;
      return when && next && next !== ids.get(id) ? [{ when, next }] : [];
    });
    if (exits.length > 0) body["exits"] = exits;
    for (const field of WRITERS_OWN)
      if (e[field] !== undefined) body[field] = e[field];
    const title =
      textOf(e["place"], TITLE_MAX) ?? textOf(e["situation"], TITLE_MAX) ?? id;
    return { id: ids.get(id) ?? newId(), title, body };
  });
  const closing = endings.map((x): PlannedNode => ({
    id: ids.get(x.id) ?? newId(),
    title: x.outcome.slice(0, TITLE_MAX),
    body: { situation: x.outcome },
  }));
  return [...made, ...closing];
}

/** Makes the encounters of the scenario an adventure's current version holds; how many it made. */
export async function materializeScenario(
  db: Db,
  now: number,
  adventureId: string,
): Promise<number> {
  const body = objectOf(await currentBodyOf(db, adventureId));
  const planned = planEncounters(body?.["scenario"], randomUUID);
  // One millisecond apart, so the list of children, ordered by when each was made, keeps the plan's order.
  for (const [i, p] of planned.entries())
    await createNode(db, now + i, {
      id: p.id,
      level: "encounter",
      parentId: adventureId,
      title: p.title,
      body: p.body,
      author: "generator",
    });
  return planned.length;
}
