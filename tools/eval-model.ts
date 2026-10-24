// Held-out figures of a candidate model file (ADR-0510, REQ-7506).
//   tsx tools/eval-model.ts <candidate.json> <database>   figures of the candidate over a database
//   tsx tools/eval-model.ts report                        formats the server's activation reply on stdin
import { readFileSync } from "node:fs";
import Database from "better-sqlite3";
import { allEvents } from "../src/engine/events/read.js";
import { GRAPH_FILE, openGraph } from "../src/engine/graph.js";
import { evaluateModel, type Figures } from "../src/engine/model/evaluate.js";
import { loadParams } from "../src/engine/model/params.js";
import type { Activation } from "../src/server/model-activate.js";

const fmt = (f: Figures | null): string =>
  f === null
    ? "none"
    : `log-loss ${f.logLoss.toFixed(4)}, calibration error ${f.ece.toFixed(4)}, over ${f.n} attempts`;

/** The lines the parent reads after `./meowtower model activate`. */
export function reportOf(a: Activation): string[] {
  return [
    `model ${a.modelVersion} over ${a.previous ?? "no earlier model"}: ${a.accepted ? "activated" : "refused"}`,
    `  active:    ${fmt(a.figures.active)}`,
    `  candidate: ${fmt(a.figures.candidate)}`,
    ...a.reasons.map((r) => `  ${r}`),
    ...(a.accepted
      ? ["Restart the server to recompute under it: ./meowtower up"]
      : []),
  ];
}

async function main(): Promise<number> {
  const [first, second] = process.argv.slice(2);
  if (first === "report") {
    const input = readFileSync(0, "utf8");
    const reply = JSON.parse(input) as Activation & {
      error?: string;
      reason?: string;
    };
    if (reply.error) {
      console.log(`${reply.error}: ${reply.reason ?? ""}`);
      return 1;
    }
    console.log(reportOf(reply).join("\n"));
    return reply.accepted ? 0 : 1;
  }
  if (!first || !second) {
    console.error(
      "usage: tsx tools/eval-model.ts <candidate.json> <database> | report",
    );
    return 2;
  }
  const params = loadParams(readFileSync(first, "utf8"));
  const db = new Database(second, { readonly: true });
  const figures = evaluateModel(
    openGraph(readFileSync(GRAPH_FILE, "utf8")),
    [...allEvents(db)],
    params,
    process.env["MEOWTOWER_ZONE"] ?? "UTC",
  );
  db.close();
  console.log(`model ${params.version}: ${fmt(figures)}`);
  return 0;
}

if (process.argv[1]?.endsWith("eval-model.ts")) process.exit(await main());
