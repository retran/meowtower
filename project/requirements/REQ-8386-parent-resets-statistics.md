---
id: REQ-8386
artifact: requirement
topic: progression
class: functional
status: approved
revised: 2026-11-01
elaborates: RES-4311
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-8386

The parent MUST be able to reset the statistics from the Parent Room after a confirmation, and after a reset the knowledge model MUST read nothing that came before it.

The owner decided on 2026-11-01 that the player starts from nothing once testing is over. The log stays append-only, so a reset is an event, and nothing is deleted.
