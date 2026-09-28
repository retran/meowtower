---
id: REQ-6378
artifact: requirement
topic: screens
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4130
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6378

When the parent chooses the copy at a sandbox reset and no sandbox snapshot of the player's state exists yet, the game MUST take one and start the sandbox from it.

Default chosen by the requirements step: the copy option shows even before the first snapshot, so the parent needn't find a separate control to take one.

Written from RES-4130 on the owner's instruction of 2026-09-28.
