// The Director's choice for a check in the sandbox (ADR-3270, REQ-8174): the graph, the model's
// parameters and the Director's weights are read once, and the choice is made over the sandbox's own
// log and written back to it as `check_task_chosen`, so the next choice counts it.
import { readFileSync } from "node:fs";
import { appendEvents } from "../../engine/events/append.js";
import { allEvents, eventsOfTypes } from "../../engine/events/read.js";
import type { DirectorConfig } from "../../engine/director/nextTask.js";
import { GRAPH_FILE, type Graph, openGraph } from "../../engine/graph.js";
import { loadParams, type ModelParamsT } from "../../engine/model/params.js";
import { baseSeed } from "../../math/rng.js";
import { templates } from "../../templates/index.js";
import { type ChosenTask, chooseCheckTask } from "../../story/check-task.js";
import type { Db } from "../db/index.js";
import { type Directed } from "../play.js";
import { atLevel } from "../task-source.js";

interface Setup {
  readonly graph: Graph;
  readonly params: ModelParamsT;
  readonly config: DirectorConfig;
}

let setup: Setup | null = null;

const content = (name: string): string =>
  readFileSync(new URL(`../../../content/${name}`, import.meta.url), "utf8");

function setupOf(): Setup {
  return (setup ??= {
    graph: openGraph(readFileSync(GRAPH_FILE, "utf8")),
    params: loadParams(content("model.v1.json")),
    config: JSON.parse(content("director.v1.json")) as DirectorConfig,
  });
}

const drawable = new Set(templates.map((t) => t.node));

/** The task the Director sets for a check asked for in an encounter, written to the log; none where no node has a template. */
export async function setCheckTask(
  db: Db,
  encounter: string,
  now: number,
  action: { readonly tried: string; readonly hard: string },
): Promise<ChosenTask | null> {
  const chosen = chooseCheckTask({
    ...setupOf(),
    log: await allEvents(db),
    now,
    canGenerate: (node) => drawable.has(node),
  });
  if (!chosen) return null;
  await appendEvents(db, [
    {
      type: "check_task_chosen",
      v: 2,
      origin: "server",
      payload: {
        tried: action.tried,
        hard: action.hard,
        encounter,
        node: chosen.node,
        subtype: chosen.subtype,
        purpose: chosen.purpose,
        corridor: chosen.corridor,
      },
    },
  ]);
  return chosen;
}

/** A choice of the Director that no task has met yet. */
export interface Pending {
  readonly seq: number;
  readonly node: string;
  readonly subtype: string;
  readonly purpose: "review" | "frontier";
  /** What she tried and why it is hard; empty for a choice written before the action was kept. */
  readonly situation: { readonly tried: string; readonly hard: string };
}

/**
 * The Director's latest choice that no task has met: a task shown with the purpose `review` or
 * `frontier` meets it, and a ladder task does not, so a ladder task shown meanwhile leaves it waiting.
 */
export function pendingCheck(
  events: readonly { seq: number; type: string; payload: unknown }[],
): Pending | null {
  let waiting: Pending | null = null;
  for (const e of events) {
    const p = e.payload as {
      node?: string;
      subtype?: string;
      purpose?: string;
      tried?: string;
      hard?: string;
    };
    if (e.type === "check_task_chosen")
      waiting = {
        seq: e.seq,
        node: p.node ?? "",
        subtype: p.subtype ?? "",
        purpose: p.purpose === "review" ? "review" : "frontier",
        situation: { tried: p.tried ?? "", hard: p.hard ?? "" },
      };
    else if (
      e.type === "item_shown" &&
      (p.purpose === "review" || p.purpose === "frontier")
    )
      waiting = null;
  }
  return waiting;
}

/**
 * The task a pending choice draws: a template of its node and subtype, or of the node where none
 * has the subtype, picked and seeded from the choice's own number so a replay draws the same one.
 * None where the node has no template.
 */
export function directedTask(pending: Pending): Directed | null {
  const ofNode = templates.filter((t) => t.node === pending.node);
  const exact = ofNode.filter((t) => t.subtype === pending.subtype);
  const pool = [...(exact.length > 0 ? exact : ofNode)].sort((a, b) =>
    a.id < b.id ? -1 : 1,
  );
  const key = `check/${String(pending.seq)}`;
  const at = baseSeed(key, "directed", 0)[0] ?? 0;
  const template = pool[at % Math.max(1, pool.length)];
  if (!template) return null;
  return {
    template,
    base: baseSeed(key, template.id, 0),
    purpose: pending.purpose,
    situation: pending.situation,
  };
}

/** The directed task the sandbox's child screen draws next, at the node's level where one is set. */
export async function directedFor(db: Db): Promise<Directed | null> {
  const pending = pendingCheck(
    await eventsOfTypes(db, ["check_task_chosen", "item_shown"]),
  );
  const drawn = pending ? directedTask(pending) : null;
  if (!drawn) return null;
  const level = (
    (await db
      .prepare("SELECT level FROM node_levels WHERE node = ?")
      .get(drawn.template.node)) as { level: number } | undefined
  )?.level;
  return level === undefined
    ? drawn
    : { ...drawn, template: atLevel(drawn.template, level, drawn.base) };
}
