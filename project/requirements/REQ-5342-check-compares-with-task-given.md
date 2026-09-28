---
id: REQ-5342
artifact: requirement
topic: answer-input
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4030
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5342

The inverse check MUST compare the player's check result only with the number in the task that her check must reproduce, and never with the correct answer.

For 345 - 178 with her answer 167, the check 167 + 178 must give 345, a number already on her screen, so the match tells her nothing her own addition doesn't. A comparison with the correct answer would be a free verdict before the first attempt.

Written from RES-4030 on the owner's instruction of 2026-09-28.
