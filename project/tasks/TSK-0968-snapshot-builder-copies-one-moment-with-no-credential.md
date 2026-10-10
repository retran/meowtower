---
id: TSK-0968
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0340
closes: [REQ-6320, REQ-6322]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A sandbox snapshot shows the player's state at one moment and holds no credential

After this task, the snapshot builder writes `sandbox-snapshot.sqlite` from a `VACUUM INTO` copy of her file, with her events marked `sandbox`, her PIN hash, lockouts and device tokens left out, and projections rebuilt, so the sandbox can start from "a copy of the player".

## Acceptance criteria

1. Given a writer appending 1,000 events while a snapshot runs, when the snapshot is read, then it holds a prefix of her log and every projection equals the fold of that prefix (REQ-6320). Closed by: an integration test.
2. Given the snapshot, when its tables are read, then `parent_pin`, `lockouts`, `devices`, `llm_log`, `art_jobs`, `bakeoff` and `local_judge_files` hold no row, and every event has `profile = 'sandbox'` (REQ-6322). Closed by: an integration test.
3. Given a free-space figure below 3 x (the live file plus its `-wal` file), when a snapshot is asked for, then it fails as `sandbox_snapshot_failed`, the old snapshot and the sandbox file stay byte for byte, and the sandbox shows «Снимок не получился, песочница осталась прежней» (REQ-6320). Closed by: an integration test with `fs.statfs` stubbed, and a test that fills a small volume.
4. Given a table in the schema that is on none of the copy, empty or rebuilt lists, when group 1 runs, then it fails and names the table; given a table a migration adds after the last group 1 run, when the builder meets it, then it creates it in the snapshot and leaves it empty (REQ-6322). Closed by: a planted-table test of the check and of the builder.
5. Given a synthetic 1 GB file on the family Mac, when the full verify runs, then a snapshot that takes more than 180 seconds is recorded as a baseline finding in the verify report and the verify still passes. Closed by: the verify run's output.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Build the snapshot in a worker thread on its own `openReadOnly` connection. Check free space first. Run `VACUUM INTO` a temporary file, which is one statement and so one read transaction. Create a fresh file with role `sandbox`, attach the copy, copy `events` with `profile` set to `'sandbox'` and `blobs`, `explain_cache` and `frames` as they are, leave the seven tables of criterion 2 empty, rebuild the projections, rename the result over `sandbox-snapshot.sqlite` and delete the temporary copy. Keep the three lists (copy, empty, rebuilt) in one module that the group 1 check reads. Show «Снимаю снимок…» with the stage reached, copy, scrub or rebuild. No projection may read `llm_log`, so a copied `llm_call` event changes no projection; the lint of ADR-0020's epic fails projection code that names it.

## Depends on

- TSK-0964 (blocking): the builder opens its output file with role `sandbox`.
- TSK-0965 (blocking): the copied events carry `profile = 'sandbox'`, which the guard accepts only in a sandbox file.
- TSK-0967 (blocking): the worker reads her file through `openReadOnly`.

## Evidence

Not yet.

## Left alone

The reset, which TSK-0969 builds on this snapshot, and the Parent Room's button «Снять снимок заново», which that task wires.
