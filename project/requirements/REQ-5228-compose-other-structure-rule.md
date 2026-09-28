---
id: REQ-5228
artifact: requirement
topic: outcomes
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4020
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5228

The engine MUST give a confirmed graph the verdict `match_other_structure` when its operations differ from the target's and its value equals the target's.

For example, a riddle for «6 · 4 + 6» that solves as «6 · 5». It is a verdict of its own, and not `match`, so the composing stream can count riddles that reach the value by another structure.

Written from RES-4020 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
