// `npm run scenario -- <ru|en|nl> "<the idea>"` (ADR-3270): one scenario through the real loop,
// saved under data/scenarios/ and printed for reading. It spends at most SCENARIO_BUDGET_USD.
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { openDatabase } from "../src/server/database.js";
import { readConfig } from "../src/server/gateway/config.js";
import { createGateway } from "../src/server/gateway/gateway.js";
import { liveRoutes } from "../src/server/gateway/routes.js";
import { isShipped } from "../src/shared/i18n.js";
import { writeScenario } from "../src/story/writer.js";

const [language = "ru", brief = "Осень. Узлы на Канале связали все лодки."] =
  process.argv.slice(2);
if (!isShipped(language)) throw new Error(`unknown language: ${language}`);
const config = readConfig(process.env);
if (!config) throw new Error("model_config_invalid: a role is unset");
if (!config.roles.SHOWRUNNER_MODEL)
  throw new Error("SHOWRUNNER_MODEL is unset in .env");
const budget = Number(process.env["SCENARIO_BUDGET_USD"] ?? 2);
const db = openDatabase(
  join(mkdtempSync(join(tmpdir(), "meowtower-scenario-")), "scenario.sqlite"),
);
const gateway = createGateway({
  db,
  config,
  routes: liveRoutes(config),
  limits: { adventure: budget, month: budget },
});
const done = await writeScenario(gateway, {
  bucket: "scenario",
  lang: language,
  brief,
  minChecks: 20,
});
interface Row {
  readonly role: string;
  readonly costUsd: number;
}
const spent = (
  db.prepare("SELECT role, cost_usd AS costUsd FROM llm_log").all() as Row[]
).reduce((sum, row) => sum + row.costUsd, 0);
console.log(`spent: $${spent.toFixed(3)}`);
if (!done) {
  console.log("no playable scenario after the loop");
  process.exit(1);
}
mkdirSync("data/scenarios", { recursive: true });
const file = `data/scenarios/${String(Date.now())}.json`;
writeFileSync(file, JSON.stringify(done, null, 2));
for (const encounter of done.scenario.encounters) {
  console.log(`\n[${encounter.id}] ${encounter.place}: ${encounter.situation}`);
  console.log(`  goal: ${encounter.goal}`);
  console.log(`  pressure: ${encounter.pressure}`);
  for (const person of encounter.people)
    console.log(`  ${person.name}: ${person.aim}`);
  console.log(`  checks: ${String(encounter.checks)}`);
  for (const exit of encounter.exits)
    console.log(`  - ${exit.when} -> ${exit.next}`);
}
for (const ending of done.scenario.endings)
  console.log(`\n[${ending.id}] ${ending.outcome}`);
console.log(`\nrevisions: ${String(done.revisions)}`);
console.log(`major left: ${done.unresolved.join("; ") || "nothing"}`);
console.log(`minor: ${done.minor.join("; ") || "nothing"}`);
console.log(`saved: ${file}`);
