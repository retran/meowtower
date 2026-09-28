---
id: REQ-5725
artifact: requirement
topic: puzzles
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4070
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5725

When the player closes a puzzle she opened at a rest stop, the game MUST return her to the adventure's next step after the rest stop.

A rest stop doesn't pause the adventure, and its campfire scene has already ended, so the adventure picks up where it would have after the rest stop. I chose the next step as the default return point.

Written from RES-4070 on the owner's instruction of 2026-09-28.
