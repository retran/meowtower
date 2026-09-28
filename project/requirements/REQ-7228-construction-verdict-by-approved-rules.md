---
id: REQ-7228
artifact: requirement
topic: outcomes
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4260
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7228

The engine MUST give a construction riddle its verdict by the approved verdict rules applied to the expanded graph and the expanded target, with no verdict and no match rule of its own.

The approved rules, REQ-5226, REQ-5228 and REQ-5298 among them, then hold word for word. A story «четверть от 80» (a quarter of 80) for the target `25 % от 80` has other operations and the same value, so it gets `match_other_structure`.

Written from RES-4260 on the owner's instruction of 2026-09-28 to process addendum 2.
