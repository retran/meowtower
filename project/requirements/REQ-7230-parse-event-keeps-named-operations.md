---
id: REQ-7230
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4260
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7230

The `compose_parsed` event MUST hold the graph with its operations as the parser named them, before the expansion of REQ-7222.

The expansion merges "three quarters of 20" with "divide by 4, then multiply by 3", which is the distinction the addendum wants to see, so a later report can count operator stories only from the named graph.

Written from RES-4260 on the owner's instruction of 2026-09-28 to process addendum 2.
