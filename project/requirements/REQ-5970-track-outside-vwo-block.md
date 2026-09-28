---
id: REQ-5970
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4090
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5970

The VWO readiness block MUST NOT count any Sources track node in its coverage, margin, ceiling or ladder.

A track node has no SLO level, so it has no place on a ladder that counts 1F, 1S and stretch nodes.

Written from RES-4090 on the owner's instruction of 2026-09-28.
