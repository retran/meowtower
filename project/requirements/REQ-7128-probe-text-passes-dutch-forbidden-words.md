---
id: REQ-7128
artifact: requirement
topic: safety
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4250
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7128

A Dutch probe text MUST pass a check against Dutch forbidden words before it enters the parent's review.

The forbidden-list check reads Russian words today, so a Dutch sentence with a shaming or frightening word would pass it untouched. The Dutch words can sit in the one forbidden list REQ-3328 requires.

Written from RES-4250 on the owner's instruction of 2026-09-28 to process addendum 2.
