// Which database the suite runs on (ADR-3310). `MEOWTOWER_TEST_BACKEND=postgres` points every
// `openDatabase` at Postgres; a test that reads a SQLite file with its own handle, or that tests
// SQLite's triggers, snapshots or pragmas, runs on SQLite only, and Postgres has its own tests of
// the same guarantees.
import { describe, it } from "vitest";

export const onPostgres = Boolean(process.env["MEOWTOWER_DATABASE_URL"]);

export const sqliteOnly = onPostgres ? describe.skip : describe;
export const sqliteOnlyIt = onPostgres ? it.skip : it;
