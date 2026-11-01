---
id: REQ-8392
artifact: requirement
topic: progression
class: functional
status: approved
revised: 2026-11-01
elaborates: RES-4312
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-8392

A domain's ability level MUST be the rounded mean of the levels of its nodes that have answers, and a domain with no answered node MUST show as not yet shown, with no level.

Nodes without answers sit on level 1 and would drag the mean down, so they stay out of it.
