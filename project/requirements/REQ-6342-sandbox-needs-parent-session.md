---
id: REQ-6342
artifact: requirement
topic: api
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4130
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6342

Every sandbox request that reaches the game's network listener MUST require a parent session opened with the PIN on the device making the request.

The sandbox shows answers and templates and lets the parent set outcomes, which the player's devices must never reach. The command-line sandbox is outside this rule: it answers only on the Mac itself, as REQ-6362 requires.

Written from RES-4130 on the owner's instruction of 2026-09-28.

Imposed by the owner's addendum 1 of 2026-09-28.
