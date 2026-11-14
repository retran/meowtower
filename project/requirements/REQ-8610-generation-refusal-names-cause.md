---
id: REQ-8610
artifact: requirement
topic: studio
class: functional
status: approved
revised: 2026-11-14
elaborates: RES-4320
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-8610

A generation that stops without a draft MUST say whether the cause was the budget, a provider failure or a failed code check.

The parent acts differently for each, and today all three read as a failed check.
