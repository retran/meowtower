---
id: TSK-0921
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0310
closes: [REQ-6016]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A new parser version rereads every kept file that isn't withdrawn and leaves earlier parses unchanged

After this task, a background worker appends one new parse event for each kept, non-withdrawn file that has no parse under the current parser version, one file at a time, and never blocks play or the Parent Room.

## Acceptance criteria

1. Given three kept files, one of them withdrawn, when the parser version changes, then the worker appends one `school_snapshot_parsed` with `reason: reparse` for each of the two others and none for the withdrawn file, and every earlier parse event is unchanged (REQ-6016). Closed by: a worker test over the log.
2. Given a parse that fails on a reparse, when the worker finishes, then it appended `outcome: failed` with its cause and no goals, a restart under the same version appends no second parse for that file, and the next version tries it again (REQ-6016). Closed by: a worker test with a failing fixture and a restart.
3. Given a reparse in progress, when the player's answer route and the Parent Room's routes are called, then they reply within their budgets, and the worker handles one file at a time (ADR-0310). Closed by: a test that times the answer route during a reparse of 5 files.
4. Given a failed reparse, when `./meowtower status` runs, then it shows `snapshot_reparse_failed` once for that parser version (ADR-0310). Closed by: a command test that runs it twice.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the worker in `src/parent/school/`. It starts after start-up, reads the list of kept files from the log, and skips a file that has a withdrawal, a file that has a parse under the current version, including a failed one, and a file whose bytes no longer match its hash. Earlier parse events stay as they are, because the log erases nothing. A reparse writes the same event the import wrote, with `reason: reparse`.

A reparse of a kept file is one per file per parser version, so nothing accumulates beyond that.

## Depends on

- TSK-0919 (blocking): the parser and its version.
- TSK-0918 (blocking): the kept files the worker reads.

## Evidence

Not yet.

## Left alone

What a reparse does to a correction, which TSK-0922 builds in the projection. The notice «snapshot_reparse_disagrees», which that task raises.
