---
id: REQ-6370
artifact: requirement
topic: data-model
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4130
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6370

A sandbox scenario with no confirmed action MUST leave every table of the player's database unchanged, from just after the parent's PIN login to the scenario's end.

This is how the owner's acceptance test measures that the sandbox has no effect on the game, the guarantee REQ-6348 states. Default chosen by the requirements step: the player doesn't play and the parent doesn't log in again during the scenario, since either would change her database for a reason outside the sandbox. The PIN login itself writes to the database, so the comparison starts after it.

Written from RES-4130 on the owner's instruction of 2026-09-28.

Imposed by the owner's addendum 1 of 2026-09-28.
