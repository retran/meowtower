// Starts the Postgres the tests run against (ADR-3310). The service keeps its data in memory and
// stays up between runs, so a second run finds it ready at once.
import { execFileSync } from "node:child_process";

export const TEST_DATABASE_URL =
  process.env["MEOWTOWER_TEST_DATABASE_URL"] ??
  "postgres://postgres@127.0.0.1:55432/postgres";

export default function setup(): void {
  process.env["MEOWTOWER_TEST_DATABASE_URL"] = TEST_DATABASE_URL;
  if (process.env["MEOWTOWER_TEST_DATABASE_URL_EXTERNAL"]) return;
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
}
