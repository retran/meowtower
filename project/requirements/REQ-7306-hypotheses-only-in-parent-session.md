---
id: REQ-7306
artifact: requirement
topic: api
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4270
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7306

The server MUST refuse every request that reads or changes a hypothesis unless it comes from a Parent Room session opened with the PIN.

A hypothesis names what the parent suspects about the player, and the player's device must never reach it.

Written from RES-4270 on the owner's instruction of 2026-09-28 to process addendum 2.
