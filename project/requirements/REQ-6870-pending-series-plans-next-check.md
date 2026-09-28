---
id: REQ-6870
artifact: requirement
topic: selection
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4220
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6870

When an observation leaves a retention series neither confirmed nor not confirmed, the Director MUST log the series' next planned check, with the next check number, due 28 to 35 game days after the node's latest meeting before the hold for the next check starts, and hold the node from the plan's logging, or from after the next-day review when the observation was wrong.

The series can't end until it has a result, and each observation needs its own gap. The series marker tells a follow-up check from a new series.

Written from RES-4220 on the owner's instruction of 2026-09-28 to process addendum 2.
