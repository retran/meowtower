---
id: REQ-6316
artifact: requirement
topic: event-log
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4130
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6316

The migration runner MUST refuse a migration that removes or replaces the player's database's refusal of sandbox-marked events.

The runner then stops such a migration before it is applied, so her database never loses the refusal and the server is never left unable to start under REQ-6314.

Written from RES-4130 on the owner's instruction of 2026-09-28.
