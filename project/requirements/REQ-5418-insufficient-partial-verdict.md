---
id: REQ-5418
artifact: requirement
topic: outcomes
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4040
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5418

When the player answers «Нельзя узнать» (can't be known) on an unanswerable problem and chooses a wrong given or none, the server MUST record the verdict `insufficient_partial` with credit 0.5 and the outcome `partial`.

An unanswerable problem is a T1 to T4 word problem of a subtype `T1.insufficient` to `T4.insufficient`, which can't be answered because a needed given is missing. Noticing that the problem can't be answered is the skill measured, and naming the given is the second step.

Written from RES-4040 on the owner's instruction of 2026-09-28.
