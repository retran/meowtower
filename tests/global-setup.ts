// Starts the Postgres the tests run against (ADR-3310). The service keeps its data in memory and
// stays up between runs, so a second run finds it ready at once.
import { execFileSync } from "node:child_process";
import pg from "pg";

export const TEST_DATABASE_URL =
  process.env["MEOWTOWER_TEST_DATABASE_URL"] ??
  "postgres://postgres@127.0.0.1:55432/postgres";

/** Drops the schemas the suite made, so the service stays small between runs. */
async function clean(): Promise<void> {
  const pool = new pg.Pool({ connectionString: TEST_DATABASE_URL, max: 1 });
  try {
    const found = await pool.query(
      "SELECT nspname FROM pg_namespace WHERE nspname ~ '^(p|t|s)_[0-9a-f_]+$'",
    );
    for (const row of found.rows as { nspname: string }[])
      await pool.query(`DROP SCHEMA IF EXISTS ${row.nspname} CASCADE`);
  } finally {
    await pool.end();
  }
}

export default function setup(): () => Promise<void> {
  process.env["MEOWTOWER_TEST_DATABASE_URL"] = TEST_DATABASE_URL;
  // `MEOWTOWER_TEST_BACKEND=postgres` runs every test on Postgres instead of SQLite.
  if (process.env["MEOWTOWER_TEST_BACKEND"] === "postgres")
    process.env["MEOWTOWER_DATABASE_URL"] = TEST_DATABASE_URL;
  if (process.env["MEOWTOWER_TEST_DATABASE_URL_EXTERNAL"]) return clean;
  try {
    execFileSync(
      "docker",
      ["compose", "--profile", "test", "up", "-d", "--wait", "postgres-test"],
      { stdio: "pipe", timeout: 120_000 },
    );
  } catch (err) {
    throw new Error(
      `test_database_unavailable: docker compose could not start postgres-test (is Docker running?): ${err instanceof Error ? err.message : String(err)}`,
    );
  }
  return clean;
}
