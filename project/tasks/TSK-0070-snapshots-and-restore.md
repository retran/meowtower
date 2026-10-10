---
id: TSK-0070
artifact: task
status: done
revised: 2026-09-27
epic: EPC-0010
closes: [REQ-2524, REQ-2528, REQ-2532]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# Snapshots on demand and before migrations, and `./tower restore`

After this task, a worker thread takes `VACUUM INTO` snapshots into `data/snapshots/` on `./tower db-snapshot` and before any pending migration, `./tower restore` loads the newest one, and `data/blobs/` is write-once.

## Acceptance criteria

1. Given the server runs, when the parent runs `./tower db-snapshot`, then `data/snapshots/tower-<UTC timestamp>.sqlite` appears and opens in a SQLite client with every table the live database holds. Closed by: the command's output and an integration test.
2. Given a pending migration, when the server starts, then a snapshot exists from before the migration ran. Closed by: an integration test.
3. Given a snapshot runs during a write load, when the test measures write latency, then no write waits for the snapshot. Closed by: an integration test.
4. Given a file in `data/blobs/`, when any server code tries to overwrite or delete it, then the attempt fails. Closed by: an integration test.
5. Given a 1 GB database, when a snapshot runs, then it finishes within 60 seconds and `./tower status` shows the time. Closed by: the measurement against ADR-0190's Baselines table.
6. Given snapshots exist, when the parent runs `./tower restore`, then the live database equals the newest snapshot. Closed by: an integration test.

## What to do

Add the snapshot worker with its own connection, `./tower db-snapshot`, the hook the migration runner calls before a pending migration, `./tower restore`, and the write-once rule on `data/blobs/`, as SPC-0010 states them. Every Mac program reads only snapshots and exports, because the live database sits in `tower-db`.

## Depends on

TSK-0030, because a snapshot copies the database it opens.

## Evidence

Collected on 2026-09-27 on the Mac. Every criterion holds.

- Verbs: `meow-verbs run format lint check test build` exited 0; 24 test files, 262 Vitest tests and 2 Playwright tests passed. The lint verb now also runs `blob_write`.
- Seen failing first: `tests/unit/snapshots.test.ts` couldn't load before `src/server/snapshots.ts` existed, and the overwrite case of `tests/unit/blob-write-once.test.ts` failed before stored files were made read-only. `tests/unit/main-snapshot.test.ts` failed with the start-up hook replaced by a no-op and passed once restored; it caught that my first wiring of the hook into `main.ts` hadn't applied.
- Criterion 1, REQ-2532 and REQ-2524: `./meowtower db-snapshot` printed `Snapshot: meowtower-2026-09-27T15-30-03Z.sqlite in 34 ms`; the file opens in SQLite with every table of the live database (`blobs`, `devices`, `events`, `pairing_codes`, `schema_migrations`, `sqlite_sequence`), and the test finds the same tables and rows, the log and one `blobs` row included.
- Criterion 2, REQ-2528: a database holding data, started with a pending migration, gets a snapshot without the migration's table while the live file gains it; a fresh database gets none. The real start (`main.ts`) snapshots into `MEOWTOWER_SNAPSHOTS` before migrating.
- Criterion 3: during a 384 ms snapshot on its worker thread, 2,458 writes ran and the slowest took 19 ms. A write that waited for the snapshot would take about as long as it does, so the test fails when the slowest write reaches half the snapshot's time.
- Criterion 4, REQ-2532: the blob store writes each file with mode 0444, so an overwrite fails with `EACCES`; the lint check `blob_write` finds no code outside the blob store that writes into or deletes from `data/blobs`, and names a fixture that calls `rmSync` on a blob.
- Criterion 5: `node --import tsx tests/perf/snapshot-1gb.ts` built a 1.00 GB database and snapshotted it in 1,798 ms, against the 60 s budget in ADR-0190's Baselines table; `./meowtower status` printed `last snapshot: 2026-09-27T15:30:03.427Z, took 34 ms`.
- Criterion 6: the restore test leaves the live database equal to the newest of two snapshots; on the Mac, `./meowtower restore` printed `restored /data/snapshots/meowtower-2026-09-27T15-30-03Z.sqlite` and the server answered `/health` with `ok` afterwards.

## Left alone

The snapshot after a session, retention and the notices (TSK-0080); the `events` and `blobs` tables, which ADR-0020 defines.
