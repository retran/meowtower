---
id: REQ-6356
artifact: requirement
topic: event-log
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4130
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6356

Every parent event written before parent events gained a source MUST still be read, with the same meaning, after they gain it.

A rebuild folds every past event again, so an old event read wrongly would change her derived data.

Written from RES-4130 on the owner's instruction of 2026-09-28.
