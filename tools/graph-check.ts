// `./meowtower graph check [file]` (SPC-0050, rule 1): loads the skill graph and
// reports its version, or the failing rule with the node and field it names.
import { existsSync, readFileSync } from "node:fs";
import { notGeneratable } from "../src/engine/catalogue.js";
import {
  checkCounts,
  checkSlo,
  GRAPH_FILE,
  GraphInvalid,
  openOverlaid,
  overlaysBeside,
} from "../src/engine/graph.js";

const file = process.argv[2] ?? GRAPH_FILE;
// Rule 3 compares the base file with the RES-0800 fixture (REQ-0806), when it exists.
const FIXTURE = "tests/fixtures/res-0800.yaml";
try {
  const fixture = existsSync(FIXTURE)
    ? readFileSync(FIXTURE, "utf8")
    : undefined;
  const graph = openOverlaid(
    readFileSync(file, "utf8"),
    overlaysBeside(file),
    fixture,
  );
  checkCounts(graph.baseOnly());
  checkSlo(graph);
  // Until the real templates exist every subtype is listed as not_generatable (TSK-0509).
  const missing = notGeneratable(graph, []);
  console.log(`not_generatable: ${missing.length} subtypes without a template`);
  console.log(
    `graph check: ${graph.graphVersion()} passes rules 1${fixture === undefined ? "" : ", 2 and 3"} and 5 (schema, field checks, levels and prerequisites${fixture === undefined ? "" : ", and the RES-0800 fixture"}) with ${graph.nodes().length} nodes`,
  );
  process.exit(0);
} catch (error) {
  if (error instanceof GraphInvalid) {
    console.error(`graph check: rule 1 fails: ${error.message}`);
    process.exit(1);
  }
  throw error;
}
