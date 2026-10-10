---
id: TSK-0964
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0340
closes: [REQ-6300, REQ-6302, REQ-6304]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The sandbox keeps its game in a file of its own in the database volume, opened with a role

After this task, `openDatabase(path, { role })` opens `sandbox.sqlite` in the volume `meowtower-db` with the same migrations and append-only triggers as the player's file, and a `db_role` row names what each file is, so a sandbox run can't add an event to the log her estimates and report are computed from.

## Acceptance criteria

1. Given a sandbox run that appends 100 events, when the player's file is read, then its `events` table and every projection hold the rows they held before the run (REQ-6300). Closed by: an integration test that hashes each table's rows in her file before and after.
2. Given the compose file and the server's configuration, when the paths of the three sandbox files are read, then each lies under `/var/lib/meowtower/` in the volume and none lies on the `data/` bind mount (REQ-6302). Closed by: a static test over `compose.yaml` and the path constants.
3. Given a sandbox file opened with role `sandbox`, when a test runs `UPDATE events` or `DELETE FROM events` through a second connection, then both fail with the message the player's file gives (REQ-6304). Closed by: an integration test.
4. Given a file first opened with role `sandbox`, when it is opened again with role `main`, then the opener refuses with `database_role_mismatch`, and at start-up the server exits (the failure state in ADR-0340). Closed by: an integration test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the `role` option to `openDatabase` in `src/server/`, and a migration that creates `db_role (id INTEGER PRIMARY KEY CHECK (id = 1), role TEXT NOT NULL CHECK (role IN ('main', 'sandbox')))` empty, with triggers that refuse an `UPDATE` or `DELETE` on it. The opener inserts the role on the first open of a file and exits with `database_role_mismatch` when the stored role differs; `main.ts` passes `main`. Name the three sandbox files `sandbox.sqlite`, `sandbox-snapshot.sqlite` and `sandbox-spend.sqlite` and give them one path module, so later tasks never spell a path. Add the one-way import rule that only `main.ts` opens her file's path, as a first check in group 1; TSK-0967 completes it. The ledger and the snapshot file are filled by TSK-0970 and TSK-0968; this task only names and opens them.

## Depends on

Nothing. The epic realising ADR-0020 supplies `openDatabase`, the append-only triggers and the migration runner; until its epic exists, this task works on the stand-in opener in `src/server/` and leaves the guarded-trigger list to the task that adds the guard.

## Evidence

Not yet.

## Left alone

The `profile` column and its guard, which TSK-0965 adds, and the snapshot's contents, which TSK-0968 builds.
