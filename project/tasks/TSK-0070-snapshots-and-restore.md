---
id: TSK-0070
artifact: task
status: approved
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

Not yet.

## Left alone

The snapshot after a session, retention and the notices (TSK-0080); the `events` and `blobs` tables, which ADR-0020 defines.
