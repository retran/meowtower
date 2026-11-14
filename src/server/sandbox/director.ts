// The Director's choice for a check in the sandbox (ADR-3270, REQ-8174): the graph, the model's
// parameters and the Director's weights are read once, and the choice is made over the sandbox's own
// log and written back to it as `check_task_chosen`, so the next choice counts it.
import { readFileSync } from "node:fs";
import { appendEvents } from "../../engine/events/append.js";
import { allEvents } from "../../engine/events/read.js";
import type { DirectorConfig } from "../../engine/director/nextTask.js";
import { GRAPH_FILE, type Graph, openGraph } from "../../engine/graph.js";
import { loadParams, type ModelParamsT } from "../../engine/model/params.js";
import { templates } from "../../templates/index.js";
import { type ChosenTask, chooseCheckTask } from "../../story/check-task.js";
import type { Db } from "../db/index.js";

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
      v: 1,
      origin: "server",
      payload: {
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
