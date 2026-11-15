---
id: REQ-7284
artifact: requirement
topic: rewards
class: functional
status: approved
revised: 2026-11-15
elaborates: RES-4321
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7284

A first attempt MUST give 2 buttons when it is clean and unassisted, 1 when it is clean with help or partial, and 0 when it is wrong, «Не знаю» (I don't know) or a rapid guess, with a Volley counted as the 2 first attempts it replaces.

Solving pays and skipping doesn't, and a guess earns no more than an honest «Не знаю», so the avoidance measure stays readable. The amounts are starting values that I chose.
