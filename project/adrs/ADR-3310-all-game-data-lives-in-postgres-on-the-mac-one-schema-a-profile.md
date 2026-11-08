---
id: ADR-3310
artifact: adr
status: done
pr: 103
revised: 2026-11-08
addresses: [REQ-8506, REQ-8520, REQ-8522, REQ-8524, REQ-8526, REQ-8528]
supersedes: []
concerns: [privacy]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# 3310. All game data lives in Postgres on the Mac, one schema a profile, and the log's rules stay as ADR-0020 wrote them

## Decision

All game data moves from one SQLite file into one Postgres database that runs as a service of the compose stack on the parent's Mac. The owner asked for this on 2026-11-08 and said it is cheaper while the surface is small. This record amends ADR-0020 and ADR-0010 and does not supersede them: every rule of ADR-0020 about the log still holds (append-only, projections rebuilt from the log, versions on every derived table, one `appendEvents`), and only the clauses that name SQLite change as listed below.

- Postgres 18 runs in a service `postgres` of `compose.yaml`, on the internal network only, with its data in a named volume `meowtower-pg`. The data stays on the Mac, so the rule that all game data lives on the Mac holds (RES-4319).
- One database `meowtower` holds a schema `public` for the accounts of ADR-3320 and one schema `p_<profile id>` for each profile. A profile's schema holds exactly the tables SQLite held: `events`, the projections, `blobs`, `explain_cache`, `devices`, `parent_pin`, `parent_settings`, `lockouts`, `llm_log` and the rest. A request opens a transaction, runs `SET LOCAL search_path TO p_<id>, public`, and the existing SQL runs unchanged. A profile's data is reachable only through its schema, and a test proves that a second profile sees none of the first one's rows (REQ-8506).
- The code reaches the database through one asynchronous interface `Db` in `src/server/db/`, with `query`, `one`, `many`, `exec` and `transaction`, and the `pg` driver behind it. Raw SQL stays; no object mapper is added. Every caller that held a synchronous `better-sqlite3` handle awaits it. The SQLite implementation stays beside the Postgres one until the switch, so each step lands with the whole suite green on both.
- The append-only rule moves into the database. `BEFORE UPDATE` and `BEFORE DELETE` triggers on `events` and on the `sha256` column of `blobs` call a function that raises `events are append-only`. At start-up the server reads `pg_trigger` and refuses to start if one is missing, as ADR-0020 required for `sqlite_master`. `seq` becomes `bigint GENERATED ALWAYS AS IDENTITY`, so the order stays one increasing sequence per profile. Types the model wrote as SQLite `STRICT` columns map to `bigint`, `double precision`, `text`, `boolean` and `jsonb` for payloads.
- `appendEvents` keeps its one transaction: validate, insert, apply every projection. A full recompute builds `<name>__next` tables in the same schema and swaps them in one transaction with `ALTER TABLE ... RENAME`, which Postgres runs transactionally, so the `setImmediate` yielding that better-sqlite3 needed goes.
- Backups are `pg_dump --schema p_<id>` files in `data/snapshots/`, kept as before (the newest 30 and the first of each month), taken by a one-shot job of the compose stack. A restore loads a dump into a new schema, checks it with `checkProjections`, and renames it into place in one transaction. The export reads the events through `Db`, writes `events.jsonl` and the CSV files, and DuckDB turns them into the Parquet files, so the five files of ADR-0020 come out as before.
- The sandbox of ADR-0340 copies a profile with `CREATE SCHEMA` and a table-by-table `INSERT ... SELECT` into a schema `s_<id>`, without the credential tables (REQ-6322 still holds), and opens it read-only.
- The existing player's log moves with `tools/move-to-postgres.ts`: it reads the SQLite file read-only, writes every event with its `seq`, `id` and `ts` into the schema of profile 1, rebuilds the projections, and compares the event count and `checkProjections` against the original. It changes nothing in the SQLite file, which stays until the parent deletes it (REQ-8522, REQ-8526).
- Tests use a Postgres service `postgres-test` that the vitest global set-up starts with `docker compose up --wait`, one schema per test file. `./meowtower` commands run through `psql` and `pg_dump` inside the stack.

What works once this is accepted: nothing changes for the player until the switch. After the plan, the game runs on Postgres with the same behaviour, the old log lives in profile 1, backups, restore and export work, and the SQLite code is gone. What doesn't work yet: accounts and a second profile, which ADR-3320 adds.

## Why

The owner chose Postgres and asked for it now. RES-4319 measured the cost: 16 source files import better-sqlite3, 87 `.prepare(` calls sit in 21 files, 29 `STRICT` declarations and 13 migrations carry SQLite types, and every write path is synchronous. A schema per profile keeps all of that SQL as it is and gives each child the isolation that one file gave, so ADR-3320 needs no `profile_id` column in any table and no row-level policy to get wrong. Postgres on the same Mac keeps the data where the privacy rules put it, and it removes the one-writer limit that ADR-0020 named as the reason to reopen the choice.

## Alternatives

| Option | Better at | Why it lost |
| --- | --- | --- |
| Do nothing: keep SQLite | No work, one file to copy | The owner asked for Postgres, and a second writer or remote access needs it later |
| One shared schema with a `profile_id` column and row-level security | One set of tables, plain tenancy | Every table, projection and shadow table gains a column and a policy, and a missed `FORCE` leaks one child's rows into another's |
| Postgres hosted outside the Mac | Access from anywhere, managed backups | It breaks the rule that data stays on the Mac and makes the host a processor (RES-4319) |
| PGlite in the process | No service to run | It is not the Postgres the owner asked for, and its limits are unverified |

## What it costs

An extra service runs on the Mac, and the Mac needs its volume backed up as well as `data/`. Every caller becomes asynchronous, which touches about 35 files and most of the 53 test files that open a database. `pg_dump` replaces a one-file copy, so a backup is a set of files, not one. The test run needs the Docker service up, which lengthens it by seconds and adds one failure mode. A schema per profile means a migration runs once per profile, and a hundred profiles would be a hundred migrations; the household here has a handful.

## What would reverse it

- The full recompute of a year's log takes more than 60 seconds on Postgres where SQLite met it, or a profile's dump of a 1 GB schema takes more than 180 seconds. The move then returns to SQLite, and the SQLite code is kept until the plan is done for exactly this.
- The test run on Postgres fails at random more than once in twenty runs for a reason in the database setup. The tests then move to PGlite while the product stays on Postgres.

## Consequences

- ADR-0020 and ADR-0010: the clauses that name SQLite, `sqlite_master`, `VACUUM INTO`, `synchronous=FULL` and the named volume `tower-db` now read as this record says. ADR-0340: the sandbox copies a schema. `compose.yaml`, the Dockerfile, `src/server/database.ts`, `snapshots.ts`, `backups.ts`, `restore.ts`, `export.ts` and `migrations/` change.
- `better-sqlite3` leaves the dependencies at the end of the plan; `pg` joins them.
- A later record decides erasure of a log fact, which the append-only trigger forbids and which a hosted store would force.

## How I will know it was realised

1. The whole suite passes on Postgres with the same tests as on SQLite, and a static check finds no import of `better-sqlite3` in `src/`.
2. `tools/move-to-postgres.ts` run on a copy of the player's file reports the same event count and the same derived rows, and the SQLite file's hash is unchanged afterwards.
3. A test creates two profiles, appends events to the first, and finds none of them through the second.
4. A test takes a backup, empties the schema, restores, and finds the same derived tables as before.
5. The export writes `events.jsonl`, `events.parquet`, the two CSV files and `fields.csv` from Postgres.
6. The server refuses to start when the append-only trigger is dropped.

## What this does not settle

- Accounts, profiles as a thing a parent creates, and sign-in, which ADR-3320 settles.
- Hosting the database outside the Mac, and erasure of a log fact.
- The choice of a mail provider.

## Plan

1. The asynchronous `Db` interface in `src/server/db/` and a SQLite implementation of it, with every caller awaiting it and the whole suite green (REQ-8520).
2. A Postgres service in `compose.yaml`, the test service, the vitest global set-up, and a Postgres implementation of `Db` that passes the same suite one schema per test file (REQ-8520, REQ-8506).
3. The schema in Postgres: migrations 0001 to 0013 ported with Postgres types, the append-only triggers and their start-up check (REQ-8520).
4. `appendEvents`, the projections and the recompute on Postgres, with the transactional swap (REQ-8520).
5. `tools/move-to-postgres.ts` with its count and projection comparison, and the tests on a copy of a log (REQ-8522, REQ-8526).
6. Backups, restore and export on Postgres, and the sandbox copy of a schema (REQ-8524, REQ-8528).
7. The switch: the server starts on Postgres, `better-sqlite3` leaves `src/`, and the docs and `./meowtower` commands change.
