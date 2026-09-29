---
id: TSK-0450
artifact: task
status: approved
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

Collected on 2026-09-29 on the Mac. Every criterion holds.

- Verbs: `meow-verbs run format lint check test build` exited 0 at tree `1e5deb62e941`: 40 test files and 358 Vitest tests passed, 15 Playwright tests passed, and the build made both images. `meow-verbs evidence --keep` kept the records: format `b506bbaf8c95`, lint `d4b6aa50145a`, check `d60a89582c84`, test `5d0af05a4495`, build `36ad390d1b58`, under `project/evidence/`.
- Seen failing first: before the change, the ceiling test read `[null, null, 20, 20, 30]` where `[null, 20, 20, 30, 40]` was expected, and the jump test read `[null, null]` where `[20, 40]` was expected, because only `data/` counted. The status test failed on `storage_ceiling: data/ holds more than 30 GB.`
- Criterion 1: `tests/integration/backups.test.ts` stubs the size of `data/`, the database and its write-ahead log apart, over five snapshots: 14 + 5.9 + 0 stays under; 15 + 5 + 1 raises 20 and logs `storage_ceiling: data/ and the database hold 21.0 GB`; 29 doesn't rise again; 31 raises 30; 41 raises 40; three notices in all, and each session still takes its snapshot. A jump from 28 to 41 GB raises one notice, with 40. A database inside `data/` is counted once: 12 GB of `data/` holding an 11 GB database raises nothing.
- Criterion 2: `tests/smoke/status-notices.test.ts`, new, runs a copy of `./meowtower status` beside a sample `notices.json` holding 30, with a stub `docker`, and gets `storage_ceiling: data/ and the database hold more than 30 GB.` The ceiling test reads the Mac's Parent Room page right after the 31 GB snapshot raises 30 and finds the whole string «Папка data/ и база данных заняли больше 30 ГБ.»; with 3 in place of 30 that assertion failed. After the 41 GB snapshot the page reads «…больше 40 ГБ.».
- Also: the log line in `backupAfterSession`, the string `parent.notice.storageCeiling` and the `storage_ceiling` row in `docs/reference/parent-notices.md` now name `data/` and the database. `meowtower.sqlite-shm` stays uncounted, as What to do says.

### Open review findings

An agent reviewed this record after the work. These findings stay open, with the reason. They sit under Evidence because the frozen check lets an approved task change only this section.

- The count skips the database when it sits inside `data/`, which no criterion or What to do states. On the Mac it never does, since the database lives in the volume at `/var/lib/meowtower`, but a development run with `MEOWTOWER_DB` pointing under `data/` would otherwise count it twice and raise the notice early. The test "counts a database inside data/ once" keeps the rule from being dropped as dead code. Not added to What to do: that section is frozen.
- No criterion covers the `storage_ceiling` row in `docs/reference/parent-notices.md` that What to do asks for; the Also line above records it, and the row now names `data/` with the database as the condition, the database's growth with every event as the cause, and moving exports while keeping snapshots and the database as the remedy. Not added as a criterion: the criteria are frozen.

## Left alone

The other notices, which TSK-0080 built.
