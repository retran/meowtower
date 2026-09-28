---
id: REQ-6660
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4200
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6660

Every `item_shown` event stored before addendum 2's fields are added MUST stay readable by every projection after they are.

Projections replay the whole log, so an old event they can't read drops part of her history from every figure built on it.

Written from RES-4200 on the owner's instruction of 2026-09-28 to process addendum 2.
