---
id: TSK-0786
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0220
closes: [REQ-5150]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The node card and the help row show the mean depth of help over 30 days, with the count of attempts

After this task, the report shows beside «решает с подсказкой» (solves with a hint) the mean depth of help over the node's attempts in the last 30 days, counting a first attempt as 0 with no hint or as its deepest rung from 1 to 3 and a second attempt as 4, with one decimal and the count of attempts, and «нет данных» (no data) with no attempt.

## Acceptance criteria

1. Given a node with a first attempt at rung 0, one at rung 2 and a second attempt, when the figure is built, then the mean is 2.0 over 3 attempts (REQ-5150). Closed by: a report test.
2. Given a node with no attempt in the last 30 days, when the figure is built, then it reads «нет данных» and never 0 (REQ-5150). Closed by: the report test.
3. Given attempts that ADR-0060 drops, when the figure is built, then they don't count, and the figure is computed from `attempt_submitted` alone (REQ-5150). Closed by: the report test with a dropped attempt.
4. Given a node within 30 days of this decision's code shipping, when its card is built, then it carries the note that the figure mixes attempts upcast from the old three-rung ladders with new ladders (REQ-5150). Closed by: the report test with an upcast fixture.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the figure to the node card and the help row of ADR-0180, with a window of 30 days, the window of «почти готово», so the two figures beside each other cover the same days. The depth isn't divided by the ladder's length, because the research decided a raw depth, and scoring a second attempt as 4 is a default REQ-5150 records. The count of attempts sits beside the figure because it tells the parent how much evidence the figure rests on.

Draw the note for the first 30 days from the date the code shipped, which the rules version of the log gives.

## Depends on

- TSK-0784 (not blocking): both read the attempts' depth; either task can land first, because this figure needs only `attempt_submitted`.

The epic realising ADR-0180 supplies the node card and the help row.

## Evidence

Not yet.

## Left alone

The shares by depth, which TSK-0784 holds, and the mark «на пороге», which TSK-0785 holds.
