---
id: REQ-5524
artifact: requirement
topic: templates
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4050
verification: static
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5524

A grouping template MUST use only expressions in which every link is admissible: all additions, all multiplications, or one number to round.

In `2 + 3 * 4` a loop between `2` and `3` is wrong, and none of the three grouping values fits it.

Written from RES-4050 on the owner's instruction of 2026-09-28.
