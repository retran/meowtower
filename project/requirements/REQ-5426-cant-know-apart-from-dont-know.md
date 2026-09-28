---
id: REQ-5426
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4040
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5426

The event log MUST keep each «Нельзя узнать» (can't be known) answer apart from «Не знаю» (I don't know), with the verdicts `insufficient_correct`, `insufficient_partial` and `false_insufficient` distinct from "don't know" and from each other.

«Не знаю» says she can't solve the problem; «Нельзя узнать» is a claim about the problem.

Written from RES-4040 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
