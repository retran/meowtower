---
id: REQ-6896
artifact: requirement
topic: selection
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4220
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6896

When a recompute under a new threshold, rules or model version moves a held node out of «устойчиво» (stable), its plan and hold MUST stand.

The plan is what the Director did, and the facts a retention observation reads don't depend on a version. The report shows the node's current state beside the series.

Written from RES-4220 on the owner's instruction of 2026-09-28 to process addendum 2.
