---
id: REQ-5738
artifact: requirement
topic: puzzles
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4070
verification: static
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5738

Every number in a puzzle's statement, hint rungs and solution MUST come from the puzzle's data, which a person wrote or approved, and never from a model at play time; a number a model drafted counts as data only once a person approves it.

In a pouring or a weighing puzzle the numbers are the idea: jugs of 3 and 5 litres measure 4, while jugs of 2 and 4 measure no odd amount, so a changed number can make a puzzle unsolvable.

Written from RES-4070 on the owner's instruction of 2026-09-28.
