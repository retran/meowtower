---
id: REQ-5754
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4070
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5754

The event log MUST record each puzzle approval with a hash of the exact content the parent approved.

The hash proves which content the parent approved, so the game can tell an edited puzzle from an approved one (REQ-5752).

Written from RES-4070 on the owner's instruction of 2026-09-28.
