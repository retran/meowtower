---
id: REQ-6834
artifact: requirement
topic: knowledge-model
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4220
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6834

A retention observation MUST count as right only when its outcome is `clean`.

A `partial` answer already ends the review run in the knowledge model, and an `alt` answer is a different result, so neither shows the skill lasted.

Written from RES-4220 on the owner's instruction of 2026-09-28 to process addendum 2.
