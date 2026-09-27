---
id: REQ-3914
artifact: requirement
topic: judge
class: non-functional
status: draft
revised: 2026-09-27
elaborates: RES-3910
verification: evaluation
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-3914

A check MUST move to a judge model on the Mac only after that judge answers the check's test set on the family Mac, with the check's fixed prompt already cached and as many checks running at once as the game sends in one turn, within the judge timeout ADR-0100 sets, now 1500 ms, at the 95th percentile, measured at the gateway.

The gateway waits that long and then sends the check to the safety model, so a local judge that agrees with the reference but answers too slowly sends her text out anyway. A model that matches the reference but takes 2 seconds on the check fails this.

Written from RES-3910 on the owner's instruction of 2026-09-27.
