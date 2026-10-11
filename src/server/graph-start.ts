// The graph at server start (ADR-0050, SPC-0050). The server loads
// `content/graph.yaml`, stores each new version's canonical content in
// `graph_versions`, and computes the projections with its version. A file that
// breaks after a good start serves the last stored version and raises
// `graph_invalid` once. A file that breaks with nothing stored stops the start
// as `graph_unloadable`. At 1,000 stored versions it raises `graph_versions_many`
// once and deletes none (REQ-0804, REQ-0808).
import { readFileSync } from "node:fs";
import {
  openCanonical,
  openOverlaid,
  overlaysBeside,
  type Graph,
} from "../engine/graph.js";
import { notGeneratable } from "../engine/catalogue.js";
import { useVersions, VERSIONS } from "../engine/projections/versions.js";
import type { Db } from "./database.js";
import { raise } from "./failures.js";

/** The stored-version count at which the parent is told, once (REQ-0804). */
export const GRAPH_VERSIONS_MANY = 1000;

export interface GraphStart {
  readonly graph: Graph;
  /** The graph of the version stored before this start, for marking new change lines. */
  readonly previous?: Graph | undefined;
  readonly version: string;
  readonly source: "file" | "stored";
}

const storedCount = (db: Db): number =>
  (
    db.prepare("SELECT COUNT(*) AS n FROM graph_versions").get() as {
      n: number;
    }
  ).n;

const latestStored = (
  db: Db,
): { version: string; canonical: string } | undefined =>
  db
    .prepare(
      "SELECT version, canonical FROM graph_versions ORDER BY stored_at DESC, rowid DESC LIMIT 1",
    )
    .get() as { version: string; canonical: string } | undefined;

/** The stored graph, or undefined when none is stored or it can't be read back. */
const readStored = (
  stored: { canonical: string } | undefined,
): Graph | undefined => {
  if (stored === undefined) return undefined;
  try {
    return openCanonical(stored.canonical);
  } catch {
    return undefined;
  }
};

/** Starts the server on the graph in `file`, or on the last stored version of it. */
export function startGraph(
  db: Db,
  file: string,
  now: () => Date = () => new Date(),
): GraphStart {
  let start: GraphStart;
  try {
    const graph = openOverlaid(
      readFileSync(file, "utf8"),
      overlaysBeside(file),
    );
    const version = graph.graphVersion();
    const stored = latestStored(db);
    const previous = readStored(stored);
    const before = storedCount(db);
    db.prepare(
      "INSERT OR IGNORE INTO graph_versions (version, canonical, stored_at) VALUES (?, ?, ?)",
    ).run(version, graph.canonical(), now().toISOString());
    const after = storedCount(db);
    // A new version tells the parent once which subtypes have no template (TSK-0509).
    if (after > before) {
      const missing = notGeneratable(graph, []).length;
      raise(
        "not_generatable",
        `${missing} subtypes of graph ${version} have no template`,
      );
    }
    if (after > before && after >= GRAPH_VERSIONS_MANY)
      raise(
        "graph_versions_many",
        `${after} graph versions are stored; none is deleted`,
      );
    start = { graph, version, source: "file", previous };
  } catch (error) {
    const message = (error as Error).message;
    const stored = latestStored(db);
    if (stored === undefined) {
      raise("graph_unloadable", message);
      throw new Error(`graph_unloadable: ${message}`);
    }
    raise("graph_invalid", message);
    start = {
      graph: openCanonical(stored.canonical),
      version: stored.version,
      source: "stored",
    };
  }
  useVersions({ ...VERSIONS, graph: start.version });
  return start;
}
