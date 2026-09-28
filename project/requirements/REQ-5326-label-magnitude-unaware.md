---
id: REQ-5326
artifact: requirement
topic: answer-input
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4030
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5326

When the exact answer differs from the correct result by a factor of 10 to a whole power other than 0 and the estimate is wrong, the engine MUST label the attempt `magnitude_unaware`.

Unlike `magnitude`, the label shows the parent that the player doesn't feel the size of the result either, so the error lies in her number sense and not only in the calculation.

Written from RES-4030 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
