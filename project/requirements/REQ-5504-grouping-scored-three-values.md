---
id: REQ-5504
artifact: requirement
topic: outcomes
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4050
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5504

When the player submits an answer on a grouping task, the engine MUST score the links she submitted with it as `optimal`, `valid` or `none`, apart from the answer.

The grouping is scored apart so that a shortcut becomes visible without touching the verdict. Skipped links score `none`.

Written from RES-4050 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
