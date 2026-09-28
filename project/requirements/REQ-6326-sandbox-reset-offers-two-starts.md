---
id: REQ-6326
artifact: requirement
topic: screens
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4130
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6326

When the parent resets the sandbox, the game MUST offer to start it from an empty profile or from a copy of the last sandbox snapshot of the player's state.

The sandbox snapshot is the one taken for the sandbox, at one point in time and with no credential in it, and never a backup of her whole file. REQ-6378 covers the case with no sandbox snapshot yet.

The empty profile checks a new player's path and the snapshot checks hers. RES-4130 decided this on 2026-09-28, and that record is approved.

Written from RES-4130 on the owner's instruction of 2026-09-28.
