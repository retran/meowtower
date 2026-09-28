---
id: REQ-6306
artifact: requirement
topic: data-model
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4130
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6306

The sandbox MUST read the player's database only through a connection that can't write to it.

A sandbox that holds a connection able to write can change her log through a single bug, whatever else guards it.

Written from RES-4130 on the owner's instruction of 2026-09-28.

Imposed by the owner's addendum 1 of 2026-09-28.
