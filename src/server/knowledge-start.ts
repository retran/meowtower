// Starts the knowledge model on a database (ADR-0050, ADR-0510, SPC-0060): the model in use, the
// skill graph and the knowledge projections' setup. The server runs it at start-up, and the move
// from SQLite runs it before it rebuilds the projections, so both fill the knowledge tables.
import { existsSync, readFileSync } from "node:fs";
import { GRAPH_FILE } from "../engine/graph.js";
import { latestEvent } from "../engine/events/read.js";
import { loadParams } from "../engine/model/params.js";
import {
  activeKnowledgeParams,
  useKnowledge,
} from "../engine/projections/knowledge.js";
import { useVersions, VERSIONS } from "../engine/projections/registry.js";
import { templates } from "../templates/index.js";
import type { Db } from "./database.js";
import { startGraph } from "./graph-start.js";
import type { ActivationContext } from "./model-activate.js";

/**
 * The latest model_activated event names the model in use; the content file names it only while
 * the log holds none (ADR-0510). The skill graph starts the server: a broken file with no stored
 * version stops the start as graph_unloadable, and otherwise the last valid version is served
 * (TSK-0500). The knowledge model runs once a model version is named; until then its tables stay
 * empty. The game-day zone is the family's, set in the environment.
 */
export async function startKnowledge(db: Db): Promise<ActivationContext> {
  const activated = await latestEvent(db, "model_activated");
  if (activated)
    useVersions({
      ...VERSIONS,
      model: (activated.payload as { modelVersion: string }).modelVersion,
    });
  const started = await startGraph(
    db,
    process.env["MEOWTOWER_GRAPH"] ?? GRAPH_FILE,
  );
  const model = VERSIONS.model;
  const zone = process.env["MEOWTOWER_ZONE"] ?? "UTC";
  const activation: ActivationContext = {
    graph: started.graph,
    zone,
    active: activeKnowledgeParams,
  };
  const modelFile = new URL(
    `../../content/model.${model}.json`,
    import.meta.url,
  );
  if (model !== "none" && !existsSync(modelFile))
    console.error(`model_unloadable: no file for model version ${model}`);
  else if (model !== "none")
    useKnowledge({
      params: loadParams(readFileSync(modelFile, "utf8")),
      graph: started.graph,
      zone,
      olympiad: {
        templates: new Set(
          templates
            .filter((t) => t.origin && "olympiad" in t.origin)
            .map((t) => t.id),
        ),
        nodes: new Set(
          templates
            .filter((t) => t.origin && "olympiad" in t.origin)
            .map((t) => t.node),
        ),
      },
    });
  return activation;
}
