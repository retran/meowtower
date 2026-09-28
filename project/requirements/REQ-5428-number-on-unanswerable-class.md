---
id: REQ-5428
artifact: requirement
topic: templates
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4040
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5428

When the player gives a number as the answer to an unanswerable problem, the checker MUST give it the error class `answered_insufficient`, as a wrong answer with credit 0.

An unanswerable problem is a T1 to T4 word problem of a subtype `T1.insufficient` to `T4.insufficient`, which can't be answered because a needed given is missing. The checker's other classes, a trap, `computational` and `unclassified`, don't describe an answer to a problem that has none.

Written from RES-4040 on the owner's instruction of 2026-09-28.
