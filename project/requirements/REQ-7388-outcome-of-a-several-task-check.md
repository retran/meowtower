---
id: REQ-7388
artifact: requirement
topic: outcomes
class: functional
status: approved
revised: 2026-11-15
elaborates: RES-4321
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7388

A check of several tasks MUST be `clean` when every task is clean, `alt` when more than half are wrong or «Не знаю» (I don't know), and `partial` otherwise.

One rule turns several verdicts into the one outcome the story tells, and a partial result stays possible.
