---
id: REQ-5458
artifact: requirement
topic: limits
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4040
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5458

An answer of «Нельзя узнать» (can't be known) MUST NOT count as «Не знаю» (I don't know) in a run of 3 «Не знаю» in a row, which logs an avoidance signal and offers a rest stop.

The run counts avoidance, and «Нельзя узнать» is a claim about the problem, not avoidance. I chose that it ends a run like any other answer that isn't «Не знаю».

Written from RES-4040 on the owner's instruction of 2026-09-28.
