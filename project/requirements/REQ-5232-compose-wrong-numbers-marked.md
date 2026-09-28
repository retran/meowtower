---
id: REQ-5232
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4020
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5232

When a riddle gets `wrong_structure` because its graph uses the target's operations on other numbers, the log MUST mark the verdict as that case.

The mark lets a later record count the case apart from a riddle solved by a different expression.

Written from RES-4020 on the owner's instruction of 2026-09-28.
