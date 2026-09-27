---
id: TSK-0030
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0010
closes: [REQ-2508]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The server commits each write before it replies, proven by the crash test

After this task, `tower` opens SQLite in the volume `tower-db` through `better-sqlite3` in WAL mode with `synchronous=FULL`, commits a write's transaction before it replies, and a crash test proves that no committed write is lost when the process dies.

## Acceptance criteria

1. Given `tower` runs, when the database opens, then `PRAGMA journal_mode` returns `wal` and `PRAGMA synchronous` returns `2` (FULL). Closed by: a unit test.
2. Given a write route that replies after a commit, when a test kills the `tower` process right after the reply is sent and restarts it, 100 times, then the write is in the database 100 times out of 100. Closed by: the crash test's report. The prediction is 0 lost writes; any loss is the first reversal condition of ADR-0010.
3. Given the answer request of ADR-0030 exists, when the crash test runs against it, then the answer's events are in the log 100 times out of 100. Closed by: the same crash test's report, run against the answer request.

## What to do

Add the storage module that opens the database and applies migrations at start-up, and the crash test, as SPC-0010 states them. The crash test kills the process after the reply is on the wire, and a variant also restarts the Docker virtual machine, as ADR-0010's reversal condition names. At stage 0 the write under test is the one event ADR-0190's stage 0 logs; criterion 3 runs once the epic realising ADR-0030 provides the answer request.

## Depends on

TSK-0010, because the database lives in the volume `tower-db` it creates.

## Evidence

Not yet.

## Left alone

The event log's tables and triggers and the answer request, which ADR-0020 and ADR-0030 define.
