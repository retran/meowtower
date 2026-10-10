---
id: TSK-1095
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0420
closes: [REQ-7016, REQ-7018, REQ-7020, REQ-7022]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A goal's school side reads its status against its target level

After this task, the quadrant function reads a goal's status as high or low only against a target level of a middle band or beyond, and places a goal the school didn't place in no quadrant with its reason.

## Acceptance criteria

1. Given the status `reached` on a target level of 3 or above, when the function reads the school side, then it is high; given `reached` on target level 2, then the goal has no school reading and shows `school_target_low` (REQ-7016). Closed by: a unit test at levels 2 and 3.
2. Given `needs_help` on a target level of 3 or below, then it is low; given `needs_help` on level 4, then the goal shows `school_target_high` (REQ-7018). Closed by: a unit test at levels 3 and 4.
3. Given the status `developing`, an empty target level, a goal level of 0 or a status the parser couldn't place, when the function reads the goal, then it is in no quadrant under `school_unplaced` (REQ-7020). Closed by: a unit test, one fixture each.
4. Given a status that comes from a pair that `school_snapshot_changes` marks `target_moved`, then the row keeps its quadrant and carries ADR-0310's target mark (REQ-7022). Closed by: a unit test that finds both the quadrant and the mark.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the school side to `quadrants.ts`. Read `school_values` of the latest snapshot by document date, as SPC-0310's screen already does. Level 3 is the national 40th to 59th percentile band (RES-4100), and the vendor sets the target at or just above her own percentile, so a reached low target says nothing about mastery and a missed high target can leave her well above the middle. A `developing` status and a missing target level both reach `school_unplaced` on purpose, because the parent's next step is the same: wait for the next snapshot.

## Depends on

Nothing within this epic. The epic realising ADR-0310 supplies `school_values`, `school_snapshot_changes` and the target mark; the task runs on fixture snapshots.

## Evidence

Not yet.

## Left alone

The home side, which TSK-1094 reads, the order of reasons, which TSK-1098 sets, and the Cito row's school side, which TSK-1096 reads from a category's signal.
