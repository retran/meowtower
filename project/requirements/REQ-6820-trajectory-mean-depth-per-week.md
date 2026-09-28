---
id: REQ-6820
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4220
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6820

The trajectory MUST show at each point the mean depth of help over that week's counted first attempts, scoring a first attempt that ends `clean` as 0 with no hint and as its deepest rung from 1 to 3 after hints, and a first attempt that ends `partial` or `alt` as 4.

The report's mean depth beside «решает с подсказкой» (solves with a hint) averages 30 days; the trajectory keeps its scoring and takes one week, so each point shows that week.

## Open review findings

The score of 4 for a wrong first attempt is a default I chose; a person approving this record should confirm it or send it back to research. A second reviewer noted that a right answer after rung 1 on a one-rung ladder scores depth 1 here while REQ-6806 puts it in «с опорой»; I kept the approved mean depth's raw rung, because only RES-4010 can change that scoring.

Written from RES-4220 on the owner's instruction of 2026-09-28 to process addendum 2.

Imposed by the owner's addendum 2 of 2026-09-28.
