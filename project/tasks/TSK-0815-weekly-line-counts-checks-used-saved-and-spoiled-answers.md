---
id: TSK-0815
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0240
closes: [REQ-5360, REQ-5362, REQ-5364]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The summary shows each week the share of checks used and the numbers of answers saved and spoiled

After this task, the summary screen shows one line for each week with the share of first attempts on tasks offering the check on which she used it, the number of answers saved by the check, wrong to right, and the number spoiled, right to wrong, and any other change counts as neither.

## Acceptance criteria

1. Given a week of checks, when the line is built, then a change from wrong to right counts as saved, a change from right to wrong as spoiled and a wrong-to-wrong change as neither (REQ-5360, REQ-5362). Closed by: a report test over fixtures.
2. Given a first attempt after a check, when saved or spoiled is decided, then the preliminary answer at the task's first check is compared with the first attempt as ADR-0040's checker judges it after that attempt, and the route itself never judged the preliminary answer (REQ-5360, REQ-5362). Closed by: the report test and a code search.
3. Given a week with 10 first attempts on tasks offering the check and 4 of them using it, when the line is built, then the share reads 40 % beside the saved and spoiled numbers (REQ-5364). Closed by: the report test.
4. Given the `check_week` projection, when the log is recomputed, then it equals the live projection (REQ-5364). Closed by: a recompute test.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the `check_week` projection from `self_check_used` and the attempt that follows, and add the weekly line to ADR-0180's summary screen. Read beside the saves and spoils, the share tells the parent whether she has the checking habit and whether the habit helps her. The weekly period is a default REQ-5364 records. A count that only meant "changed" would report a wrong check calculation that turns a right answer wrong as a save, so the two are split.

## Depends on

- TSK-0813 (blocking): the `self_check_used` events and the attempt fields the projection reads.
- TSK-0811 (not blocking): the route that writes the events; this task's tests use fixture events.

The epic realising ADR-0180 supplies the summary screen.

## Evidence

Not yet.

## Left alone

The wording of the line, which ADR-0160's strings hold, and the matrix, which TSK-0814 holds.
