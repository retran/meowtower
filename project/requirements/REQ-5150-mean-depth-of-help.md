---
id: REQ-5150
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4010
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5150

The report MUST show, for each node beside «решает с подсказкой» (solves with a hint), the mean depth of help over the node's attempts in the last 30 days, counting a first attempt as 0 with no hint or as its deepest rung from 1 to 3, and a second attempt as 4 whatever hint it used.

Scoring the second attempt as 4, and each first attempt by its own rung, is a default I chose, because the research names the top value both "the walkthrough" and "the second attempt". 30 days is the window of «почти готово», so the figures beside each other cover the same days. The depth isn't divided by the ladder's length, because the research decided a raw depth.

## Open review findings

A reviewer found that one node's templates can have ladders of different lengths under REQ-5106, so a raw depth of 2 is the full ladder on one template and not on another; I kept the raw depth, because dividing by the length changes the research decision, which only RES-4010 can revisit.

Written from RES-4010 on the owner's instruction of 2026-09-28.

Imposed by the owner's addendum 1 of 2026-09-28.
