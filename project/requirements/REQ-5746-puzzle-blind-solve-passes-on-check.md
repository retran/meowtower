---
id: REQ-5746
artifact: requirement
topic: puzzles
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4070
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5746

A puzzle MUST enter the parent's review queue only after its check accepts the checking model's free-form answer from the blind solve.

Comparing with one stored answer would fail a right answer in a format that has several, and a puzzle the model can't solve from its statement alone may have a faulty statement.

Written from RES-4070 on the owner's instruction of 2026-09-28.

Imposed by the owner's addendum 1 of 2026-09-28.
