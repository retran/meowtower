---
id: REQ-6256
artifact: requirement
topic: master
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4120
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6256

When a drafted scene that isn't a reply to the player's free text still holds a phrase the Master was told not to use, the game MUST regenerate it once.

A reply to free text gets no regeneration, so its wait stays within 6 seconds at the 95th percentile.

Written from RES-4120 on the owner's instruction of 2026-09-28.

Imposed by the owner's addendum 1 of 2026-09-28.
