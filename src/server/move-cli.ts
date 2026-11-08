// ./meowtower move runs this in a one-off container: it copies the log of the SQLite file in the
// volume into the Postgres profile, rebuilds the projections and compares them (REQ-8522).
import { moveToPostgres } from "./move.js";

const file =
  process.env["MEOWTOWER_DB"] ?? "/var/lib/meowtower/meowtower.sqlite";
const url = process.env["MEOWTOWER_DATABASE_URL"];
const schema = process.env["MEOWTOWER_SCHEMA"] ?? "p_1";
if (!url) throw new Error("move_refused: MEOWTOWER_DATABASE_URL is unset");
const report = await moveToPostgres(file, url, schema);
console.log(
  `moved ${String(report.events)} events and ${String(report.derivedTables)} derived tables from ${file} into ${schema}`,
);
for (const [table, rows] of Object.entries(report.tables))
  console.log(`  ${table}: ${String(rows)} rows`);
