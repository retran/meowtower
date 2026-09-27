---
id: TSK-0200
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0020
closes: [REQ-2226, REQ-3800, REQ-2202]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The append-only `events` table and `appendEvents` replace the stage-0 write

After this task, the database holds the table `events` with ADR-0020's full envelope, two triggers refuse every `UPDATE` and `DELETE` on it, `meowtower` refuses to start without them, and `appendEvents` is the one writer. The stage-0 write route appends an event through `appendEvents` in place of its row in `stage0_writes`, so TSK-0030's crash test and every later task write the real log.

## Acceptance criteria

1. Given a database migrated to this task's schema, when a test runs `UPDATE events SET type = type` and then `DELETE FROM events`, then both fail with `events are append-only` and every row is unchanged. Closed by: `tests/unit/events-guard.test.ts`.
2. Given a copy of the database with one trigger dropped, when the test starts `meowtower` on it, then the process exits non-zero with `log_guard_missing` and the trigger's name. Closed by: the same test, once for each trigger.
3. Given a migration file whose SQL drops or replaces a guarded trigger, when the runner meets it, then it applies nothing of it and `meowtower` doesn't start. Closed by: a unit test of the runner.
4. Given the guarded database, when the test runs `VACUUM`, `VACUUM INTO` and each schema change the runner allows, then the triggers are still present and still refuse a change. Closed by: the guard test's report. The prediction is no bypass; a bypass is ADR-0020's third reversal condition.
5. Given 1,000 events appended in batches, when the test reads them back, then each has a unique ULID `id`, a `seq` one greater than the previous event's, a `type`, a `v`, a `ts` in UTC, a `client_ms` and a `device_id`, and an event the server writes on its own carries `device_id = 'server'` and `client_ms` equal to its server time. Closed by: `tests/unit/append-events.test.ts`.
6. Given the stage-0 write route, when the crash test of TSK-0030 kills the process right after each reply, 100 times, then the event is in `events` 100 times out of 100. Closed by: the crash test's report.
7. Given SQL that names `events` outside `src/engine/events/` and `migrations/`, when the lint verb runs, then it fails naming the file. Closed by: `tests/unit/static-checks.test.ts` with a failing fixture.
8. Given `appendEvents` fails to commit, when the stage-0 route calls it, then the route replies 503 and `meowtower` raises `log_write_failed`. Closed by: a unit test that makes the insert fail.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the migration that creates `events` with SPC-0020's envelope (`seq INTEGER PRIMARY KEY AUTOINCREMENT`, `id` unique, `ts`, `client_ms`, `device_id`, `session_id`, `adventure_id`, `type`, `v`, `payload` as JSON, `idem_key` unique where present) and the triggers `events_no_update` and `events_no_delete`, and drops `stage0_writes`. Make `openDatabase` in `src/server/database.ts` check `sqlite_master` for both triggers after migrating, and make its runner refuse a migration whose SQL drops or replaces a guarded trigger; keep the list of guarded triggers in one place, so TSK-0240 adds the `blobs` triggers to it.

Add `appendEvents` in `src/engine/events/`, which fills `seq`, `id` and `ts`, inserts the rows in one transaction and returns once it commits. TSK-0210 adds schema validation to it and TSK-0250 the projections, inside the same transaction. Until TSK-0210 lands, the stage-0 event's payload is stored as given.

Change `POST /api/stage0/write` in `src/server/stage0.ts` to append one event with the request's `id` as its `idem_key`, and `GET /api/stage0/write/:id` to read it back by `idem_key`, so `tests/crash/crash.test.ts` runs unchanged against the log, and change `tests/unit/database.test.ts` to count `events`. The event's type is an open question that blocks only this choice: ADR-0020's catalogue has no stage-0 type, and each type it holds belongs to a decision that defines its payload. The default is `attempt_submitted` carrying the raw answer, as the answer of ADR-0190's stage-0 checklist, at a payload version the epic realising ADR-0080 upcasts from; the owner may name another type. Until TSK-0040 pairs devices, the route takes the device identifier from its request body.

Add the lint rule to `tools/static-checks.ts`, as ADR-0190's verify group 1 check.

## Depends on

TSK-0010, because the database lives in the volume it creates. It builds on the storage module and the `stage0_writes` table already in the code, from the durable-writes task, but doesn't wait for that task to close: it closes only against the answer request, which needs this task first.

## Evidence

Not yet.

## Left alone

The event schemas (TSK-0210, TSK-0220), the `blobs` table (TSK-0240) and the projections (TSK-0250). SPC-0010 still describes the stage-0 route as the one write; its next revision follows this task and isn't changed here, because only this epic's files are in its scope.
