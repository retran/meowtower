---
id: REQ-7502
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-29
elaborates: RES-4220
verification: behavioural
supersedes: [REQ-6818]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7502

When a node's week holds fewer than 5 first attempts, the trajectory's share «сама» (on her own) at that week's point MUST pool the week with as many earlier weeks as it takes to reach 5, over at most 4 weeks in all, the point's week included, and name the weeks it pooled.

A node sees about 0 to 5 first attempts a week, so a single week rarely reaches the report's floor of 5. Four weeks is the span the owner's profile uses for its dynamics, and REQ-6818's "up to 4" earlier weeks would pool 5. When four weeks still hold fewer than 5, the point shows «мало данных» (too little data) by the report's floor for a share.

Imposed by the owner's instruction of 2026-09-29 to settle the open findings.
