---
id: REQ-5834
artifact: requirement
topic: knowledge-model
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4080
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5834

A fact MUST count as automatic when it was right and no slower than the fact threshold on 2 of its last 3 shows, the last of them within the past 14 days.

The owner set both numbers. Two of three shows forgives one slip without calling a slow fact automatic, and the 14-day limit stops a fact that hasn't been seen for weeks from keeping the state.

Written from RES-4080 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
