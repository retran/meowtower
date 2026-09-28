---
id: REQ-6818
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4220
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6818

When a node's week holds fewer than 5 first attempts, the trajectory's share «сама» (on her own) at that week's point MUST pool the week with as many earlier weeks, up to 4, as it takes to reach 5, and name the weeks it pooled.

A node sees about 0 to 5 first attempts a week, so a single week rarely reaches the report's floor of 5, and a line of «мало данных» (too little data) points shows the parent nothing. Four weeks is the span the owner's profile uses for its dynamics. When four weeks still hold fewer than 5, the point shows «мало данных» by the report's floor for a share.

Written from RES-4220 on the owner's instruction of 2026-09-28 to process addendum 2.
