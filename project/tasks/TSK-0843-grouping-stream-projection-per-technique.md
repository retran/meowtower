---
id: TSK-0843
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0260
closes: [REQ-5542, REQ-5544, REQ-5574, REQ-5576]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The `grouping_stream` projection holds one row per grouping attempt and marks assisted attempts apart

After this task, the registered projection `grouping_stream` holds, for each grouping attempt, its technique, host node, template, attempt number, score and `assisted` flag, a recompute rebuilds it from the log alone, and an assisted row stays out of every unassisted figure.

## Acceptance criteria

1. Given a fixture log with grouping attempts of each technique, when the projection runs, then it holds one row for each attempt with the six fields, taking the score from the last `grouping_submitted` before the `attempt_submitted` (REQ-5542). Closed by: a projection test.
2. Given the projection, when it is dropped and the log replayed, then the rows equal those held before, and `projection_diverged` finds no difference (REQ-5544). Closed by: a recompute test.
3. Given a rung bought on a grouping task before the answer or a second attempt, when the attempt is logged, then its `assisted` is true (REQ-5574). Closed by: an integration test over both cases.
4. Given assisted and unassisted rows, when an unassisted figure is computed, then the assisted rows are left out (REQ-5576). Closed by: a projection test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Register the projection with ADR-0020's registry. It folds each `attempt_submitted` whose `item_shown.forms` holds `grouping`, takes `assisted` from the attempt's own flag and attempt number, and takes the technique and host node from the template version its `item_shown` names. Any rung marks the grouping assisted, because a rung built from the plan hands her the grouping.

## Depends on

- TSK-0839 (blocking): the projection reads `grouping_submitted`.

The epics realising ADR-0020 and ADR-0210 supply the projection registry, `projection_diverged` and the `forms` field.

## Evidence

Not yet.

## Left alone

The report's block, which TSK-0848 draws, and the stream's admission to the model, which ADR-0060's activation rule decides after the MVP.
