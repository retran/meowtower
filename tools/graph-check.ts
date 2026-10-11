// `./meowtower graph check [file]` (SPC-0050, rule 1): loads the skill graph and
// reports its version, or the failing rule with the node and field it names.
import { readFileSync } from "node:fs";
import { GRAPH_FILE, GraphInvalid, openGraph } from "../src/engine/graph.js";

const file = process.argv[2] ?? GRAPH_FILE;
try {
  const graph = openGraph(readFileSync(file, "utf8"));
  console.log(
    `graph check: ${graph.graphVersion()} passes rule 1 (schema, field checks, levels and prerequisites) with ${graph.nodes().length} nodes`,
  );
  process.exit(0);
} catch (error) {
  if (error instanceof GraphInvalid) {
    console.error(`graph check: rule 1 fails: ${error.message}`);
    process.exit(1);
  }
  throw error;
}
