---
id: REQ-5362
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4030
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5362

The report MUST count an answer changed after the inverse check as spoiled when it went from right to wrong.

A wrong check calculation can turn a right answer wrong, and a count that only means "changed" would report that as a save.

Written from RES-4030 on the owner's instruction of 2026-09-28.
