---
id: REQ-5422
artifact: requirement
topic: outcomes
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4040
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5422

When the player answers «Нельзя узнать» (can't be known) on a solvable word problem, the server MUST record the verdict `false_insufficient` as a wrong answer, with credit 0, the outcome `alt` and the badge `soft`.

The claim is wrong on a problem that can be solved, and treating it as any wrong answer brings the usual free short solution.

Written from RES-4040 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
