---
id: REQ-5226
artifact: requirement
topic: outcomes
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4020
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5226

The engine MUST give a confirmed graph the verdict `match` when it uses the same operations on the same numbers as the target, counting `+` and `·` as commutative and associative and keeping `−` and `:` in their fixed order.

Reordering the terms of a sum or the factors of a product doesn't change the problem she describes, while reordering a difference or a quotient does. So «6 · 4 + 6» and «6 + 4 · 6» match each other, and «48 : 6» and «6 : 48» don't; REQ-5298 gives the second pair its verdict.
