---
id: TSK-0450
artifact: task
status: draft
revised: 2026-09-29
epic: EPC-0010
closes: []
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# `storage_ceiling` counts the live database and its write-ahead log

After this task, the size `storage_ceiling` checks is `data/` together with `meowtower.sqlite` and `meowtower.sqlite-wal` in `/var/lib/meowtower`, and the notice rises past 20 GB and again at each further 10 GB. ADR-0370 entry 1 amended ADR-0010 this way after TSK-0080 was done, because the volume grows with every event on the same disk, so a ceiling that leaves it out lets the disk fill unannounced; ADR-0010 as amended isn't realised until this task is done. It closes no requirement of its own: REQ-2530 asks for the retention TSK-0080 closed with its evidence, and that closure stands.

## Acceptance criteria

1. Given `data/` at 15 GB and the live database with its write-ahead log at 6 GB, when the next snapshot finishes and runs the size check, then `storage_ceiling` rises with the threshold 20; when the counted size then reads 29 GB it doesn't rise again, and at 31 GB it rises with 30. A jump across two thresholds at once, 28 to 41 GB, raises one notice with 40. Closed by: the ceiling test in `tests/integration/backups.test.ts`, extended to stub the size of `data/` and of each database file apart.
2. Given a raised notice at 30, when `./meowtower status` runs on a sample `notices.json`, then it prints `storage_ceiling: data/ and the database hold more than 30 GB.`, and the Mac's Parent Room page shows «Папка data/ и база данных заняли больше 30 ГБ.». Closed by: a test of the status command's line, which this task adds, and the page test in `tests/integration/backups.test.ts`, changed to assert the whole string.

## What to do

In `src/server/backups.ts`, add the two database files to the size the check counts, and keep the notice holding the threshold crossed, as TSK-0080 built it. Change the status line in `meowtower`, the string `parent.notice.storageCeiling` in `content/i18n/ru.json` and the log line in `backupAfterSession` so none says `data/` alone, and add a test for the status line. Update the `storage_ceiling` row in `docs/reference/parent-notices.md`: its condition, its cause, now that the live database grows with every event, and its remedy. The shared-memory file `meowtower.sqlite-shm` stays uncounted, because ADR-0370 entry 1 names only the database and its write-ahead log and the file stays a few megabytes.

## Depends on

TSK-0080, because it raises the notice and holds its thresholds.

## Evidence

Not yet.

## Left alone

The other notices, which TSK-0080 built.
