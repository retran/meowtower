---
id: TSK-0923
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0310
closes: [REQ-6032, REQ-6034]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The view of changes between snapshots derives from the four snapshot events and marks a moved target

After this task, the projection `school_snapshot_changes` pairs each snapshot with the one before it and lists the changes per goal, and a pair whose target changed marks its status changes `target_moved`.

## Acceptance criteria

1. Given three snapshots with document dates, when the projection is read, then each snapshot after the first is paired with the one before it by document date, with ties broken by import order, and each pair lists per goal the change of level, of status and of target and the goals that appear or disappear (ADR-0310). Closed by: a projection test.
2. Given a pair in which the target changed from 3 to 4 and the status of two goals changed, when the projection is read, then the target change and both status changes are marked `target_moved`; given a pair with no target change, then no change is marked (REQ-6034). Closed by: a projection test with both pairs.
3. Given the log, when the full recompute rebuilds the projection, then it equals the stored rows, and the fold reads only `school_snapshot_imported`, `school_snapshot_parsed`, `school_snapshot_corrected` and `school_snapshot_withdrawn` (REQ-6032). Closed by: a recompute test and a test that lists the event types the fold subscribes to.
4. Given a file in `src/engine/school/projections/`, when it imports the knowledge model or the Director, then the lint check fails (REQ-6032). Closed by: the lint verb's output on a fixture.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the projection in `src/engine/school/projections/` and register it with the projection registry of ADR-0020. It is a pure fold under the registry's existing rule. The vendor can move the target each month by its own rule, so a status that changes with the target says nothing about the player; the view marks it so a screen can show that.

## Depends on

- TSK-0916 (blocking): the event schemas the fold reads.

## Evidence

Not yet.

## Left alone

The mark on the timeline, which TSK-0928 draws from this view. Hiding a withdrawn snapshot, which TSK-0924 adds.
