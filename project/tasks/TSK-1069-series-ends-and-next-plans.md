---
id: TSK-1069
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0400
closes: [REQ-6868, REQ-6870, REQ-6872, REQ-6876, REQ-6878]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A series ends at 2 of 2 or 3 of 4, and the Director plans the next check by the last result

After this task, `retention_series` ends a series «удержание подтверждено» or «удержание не подтвердилось» by the counts of ADR-0400, and the Director reacts to each observation with the next plan, a review first after a wrong one, a repeat after a void one, and nothing after a confirmed series.

## Acceptance criteria

1. Given series of observations right-right, wrong-wrong, right-wrong-wrong, right-wrong-right-wrong and right-right-wrong-right, when `retention_series` runs on each, then they end confirmed, not confirmed, not confirmed, not confirmed and confirmed, and right-wrong stays pending (REQ-6868). Closed by: the fixtures of REQ-6898 in a projection test.
2. Given a pending series after a right observation, when the Director runs, then it writes the next plan with the same `seriesId`, the next `checkNumber`, `countFrom: latest_meeting` and `holdStarts: now`; given a pending series after a wrong one, then it writes the plan with `holdStarts: after_review` and gives the node its next-day review in the first room slot of its domain floor after any due checks, whatever its expected chance of success (REQ-6870, REQ-6876). Closed by: two Director tests.
3. Given a check attempt that was a rapid guess, one on an excluded task, one after a walkthrough on a direct prerequisite and one shown under 21 days after a meeting that landed late, when the Director runs, then it plans the same `checkNumber` again with the window counted from that attempt; given a third void check in a row, then it cancels the series with `retention_check_cancelled` reason `void_limit` and starts a new series at the first run at least 35 game days later at which the node is «устойчиво» (REQ-6872). Closed by: two Director tests.
4. Given a confirmed series and a later natural observation, when the Director runs, then it plans no further check and the observation stays in the list with no change to the result (REQ-6878). Closed by: a Director test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Extend `retention_series` with the end rule and the Director's planner with the reaction. I chose 3 void checks as the limit because three voids spend about 3 months of windows with no observation, as long as a whole series should take, and a walkthrough on a prerequisite during every hold would otherwise repeat a void check without end. The next-day review is chosen by date: its hold starts once the review is shown and the window counts from it.

## Depends on

- TSK-1066 (blocking): the plan and the series.
- TSK-1068 (blocking): the review owed takes the placement rule's slot.

## Evidence

Not yet.

## Left alone

What happens after a failed series, which TSK-1070 builds, and a lesson mark, which TSK-1071 builds.
