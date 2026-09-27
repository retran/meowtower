---
id: TSK-0080
artifact: task
status: approved
revised: 2026-09-27
epic: EPC-0010
closes: [REQ-2526, REQ-2530]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A snapshot after each session, retention, and the backup and storage notices

After this task, `tower` takes a snapshot when a session ends, keeps the newest 30 and the first of every calendar month, and raises `backup_failed` and `storage_ceiling` for the parent.

## Acceptance criteria

1. Given a session ends, when the session end reaches the server, then a new snapshot appears in `data/snapshots/`. Closed by: an integration test.
2. Given 40 simulated sessions spread over three months with a fake clock, when the last one ends, then `data/snapshots/` holds the newest 30 plus the first of each month, and each snapshot opens in a SQLite client and lists its events. Closed by: the retention test's report.
3. Given a snapshot fails, when the parent opens the Parent Room or runs `./tower status`, then `backup_failed` shows once, and the next good snapshot clears it. Closed by: an integration test.
4. Given `data/` passes 20 GB, when the next snapshot finishes, then `storage_ceiling` shows once, and again only at each further 10 GB. Closed by: an integration test with a simulated size.

## What to do

Take a snapshot on the session end ADR-0030 defines, prune after each snapshot, and raise the two notices, as SPC-0010 states them. Monthly snapshots have no end date.

## Depends on

TSK-0070, because it reuses the snapshot worker. TSK-0050, because the notices show in the Parent Room. Criterion 2 lists events, which needs the `events` table from the epic realising ADR-0020.

## Evidence

Not yet.

## Left alone

A copy off the Mac, which no decision makes.
