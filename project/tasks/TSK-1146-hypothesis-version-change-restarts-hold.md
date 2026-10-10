---
id: TSK-1146
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0450
closes: [REQ-7340, REQ-7342, REQ-7344]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A version change restarts every hold and marks the label change it causes

After this task, a change of the model, threshold, rules or graph version restarts the hold of every hypothesis, open or closed, the report marks a label change that a version caused «пересчитано по новой версии», and the count of changes from play leaves it out together with every reset a change of criteria caused.

## Acceptance criteria

1. Given a hypothesis whose computed label has held for 5 days, when a version changes on day 6, then the hold counts only the days after day 6, the shown label carries over from the old version set, and rows of the earlier version stay beside the new ones (REQ-7340). Closed by: a projection test over the version change and the rows of both version sets.
2. Given a closed hypothesis, when a version changes and the parent reopens it, then its hold has also restarted (REQ-7340). Closed by: a projection test over a closed and reopened hypothesis.
3. Given a version change after which the computed label under the new versions already differed from the shown label on the day of the change, when the shown label moves, then the move reads «пересчитано по новой версии» and the count of changes from play is the same as before; given a move with no version change, then the count rises by 1 (REQ-7344, REQ-7342). Closed by: a projection test and a report line test over both moves.
4. Given a reset to «мало данных» that a `criteria` change caused, when the count is computed, then the reset is left out (REQ-7342). Closed by: a projection test over a criteria change.
5. Given a fixture of a year of play with 20 open hypotheses, when an adventure ends, then the rebuild takes at most 5 seconds, and a full recompute after a version change takes at most 60, the budgets of ADR-0180 (ADR-0450's twelfth criterion). Closed by: a performance test that reports the measured seconds.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Make the full recompute of ADR-0060 rewrite `hypothesis_days` under the new versions and keep the earlier version's rows. The day of the change doesn't count towards the hold, because part of it ran under the old versions. Show the mark and the count on the line TSK-1147 builds. Report the row count once in `./meowtower status` when `hypothesis_days` passes 500,000 rows (`hypothesis_days_large`); no automatic drain deletes rows.

## Depends on

- TSK-1145 (blocking): it rewrites and compares the rows of the projection.
- TSK-1147 (blocking): the count and the mark show on its line.

The epic realising ADR-0060 supplies the recompute's trigger on a version change; a fixture version bump stands in until then.

## Evidence

Not yet.

## Left alone

Which version changes happen and when, which ADR-0060, ADR-0390 and ADR-0050 own.
