---
id: REQ-5742
artifact: requirement
topic: puzzles
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4070
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5742

A puzzle MUST enter the parent's review queue only after its stored reference solution passes the puzzle's check.

A passing reference solution proves the puzzle solvable. The record asks this proof of every puzzle with a widget; I chose as the default to ask it of every puzzle, because a text-answer puzzle can be unsolvable too.

Written from RES-4070 on the owner's instruction of 2026-09-28.
