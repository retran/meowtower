---
id: REQ-7020
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4240
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7020

The screen MUST place a goal in no quadrant when its status is `developing`, when its target level is empty, when its goal level is 0 («niet gestart of niet genoeg opgaven gemaakt», not started or not enough tasks done) or when the parser couldn't place its status.

None of these says whether the player stands high or low against a target a cut can trust.

Written from RES-4240 on the owner's instruction of 2026-09-28 to process addendum 2.
