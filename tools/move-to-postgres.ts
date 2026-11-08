// `npm run move -- <sqlite file> <schema>` (REQ-8522): copies the player's log into the schema of
// a profile in Postgres, rebuilds the projections and compares them with the file. The file is
// opened read-only. The database is named by MEOWTOWER_DATABASE_URL.
import { moveToPostgres } from "../src/server/move.js";

const [file, schema] = process.argv.slice(2);
const url = process.env["MEOWTOWER_DATABASE_URL"];
if (!file || !schema || !url)
  throw new Error(
    "usage: MEOWTOWER_DATABASE_URL=postgres://… npm run move -- <sqlite file> <schema>",
  );
const report = await moveToPostgres(file, url, schema);
console.log(
  `moved ${String(report.events)} events and ${String(report.derivedTables)} derived tables into ${schema}`,
);
for (const [table, rows] of Object.entries(report.tables))
  console.log(`  ${table}: ${String(rows)} rows`);
