---
id: REQ-6318
artifact: requirement
topic: event-log
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4130
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6318

The game's log writer MUST refuse a sandbox-marked event bound for the player's database before the database sees it.

The database's own refusal is then the second guard and not the only one.

Written from RES-4130 on the owner's instruction of 2026-09-28.

Imposed by the owner's addendum 1 of 2026-09-28.
