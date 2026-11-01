// `npm run levels -- <database file>` (REQ-7970): replays rule level.v1 over a copy of the log and
// prints each played node's level, its changes and how often it fell.
import { readFileSync } from "node:fs";
import Database from "better-sqlite3";
import { allEvents } from "../src/engine/events/read.js";
import { GRAPH_FILE, openGraph } from "../src/engine/graph.js";
import { levelsOf } from "../src/engine/model/project.js";
import { validateParams } from "../src/engine/model/params.js";

const [file] = process.argv.slice(2);
if (!file) throw new Error("usage: npm run levels -- <database file>");
const db = new Database(file, { readonly: true, fileMustExist: true });
const graph = openGraph(readFileSync(GRAPH_FILE, "utf8"));
const params = validateParams(
  JSON.parse(readFileSync("content/model.v1.json", "utf8")),
);
const levels = levelsOf(graph, [...allEvents(db)], params, {
  templates: new Set(),
  nodes: new Set(),
});
for (const { node, level, changes, warning } of levels) {
  if (changes.length === 0) continue;
  const falls = changes.filter((c) => c.fell).length;
  const mark = warning ? " (warning)" : "";
  console.log(
    `${node}: level ${String(level)}, ${String(changes.length)} changes, ${String(falls)} falls${mark}`,
  );
}
