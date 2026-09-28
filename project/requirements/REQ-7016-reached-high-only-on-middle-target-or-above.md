---
id: REQ-7016
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4240
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7016

The school side of a goal row MUST count the status `reached` as high when the goal's target level is 3 or above, and place the goal in no quadrant when that level is below 3.

The school learning system sets the target at or just above the player's current percentile, so a reached low target says she met a target placed at her own level and nothing about mastery. Level 3 is the national middle band, the 40th to 59th percentile.

Written from RES-4240 on the owner's instruction of 2026-09-28 to process addendum 2.
