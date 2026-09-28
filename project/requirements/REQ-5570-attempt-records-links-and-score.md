---
id: REQ-5570
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4050
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5570

When the player submits an attempt on a grouping task, the event log MUST record the submitted links and their grouping score.

The rational calculation stream must be recomputable from the log, as REQ-5544 requires, so the attempt event has to carry what the stream holds. I chose to state this beside REQ-2208 and leave that requirement standing, because it adds fields and removes none.

Written from RES-4050 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
