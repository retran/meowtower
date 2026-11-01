---
id: REQ-8392
artifact: requirement
topic: progression
class: functional
status: withdrawn
revised: 2026-11-01
elaborates: RES-4312
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-8392

Withdrawn by ADR-3300 and replaced by REQ-8398: the owner decided on 2026-11-01 that a score is continuous and its level is the whole part.

Withdrawn by ADR-3300 and replaced by REQ-8398 to REQ-8402 as the owner decided on 2026-11-01: a score is continuous and its level is the whole part.

A domain's ability level MUST be the rounded mean of the levels of its nodes that have answers, and a domain with no answered node MUST show as not yet shown, with no level.

Nodes without answers sit on level 1 and would drag the mean down, so they stay out of it.
