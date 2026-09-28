---
id: REQ-5630
artifact: requirement
topic: answer-input
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4060
verification: behavioural
---

# REQ-5630

The engine MUST score a plan `wrong_order` when, and only when, a card stands before a card that finds a quantity the first card needs, and no label of higher precedence applies.

A fork's two first steps don't depend on each other, so both of their orders are right.

Written from RES-4060 on the owner's instruction of 2026-09-28.
