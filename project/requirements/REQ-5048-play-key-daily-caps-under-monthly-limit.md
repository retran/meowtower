---
id: REQ-5048
artifact: requirement
topic: cost
class: non-functional
status: withdrawn
revised: 2026-11-01
elaborates: RES-4000
verification: static
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5048

Withdrawn by ADR-3260 and replaced by REQ-8156: it contradicted a later decision.

The daily budgets that spend from the play key MUST sum, over a 31-day month, to less than the play key's $60 monthly limit.

The monthly limit exists to catch a runaway bug, and a limit that ordinary spending reaches stops the player's play until the month ends. With the adventure budget, the explanation budget and the parse budget, the sum is $1.9 a day, or $58.90 in 31 days.

Written from RES-4000 on the owner's instruction of 2026-09-28.
