---
id: REQ-6982
artifact: requirement
topic: task-text
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4230
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6982

When every frame of a structure the player hasn't met is held back by REQ-6926 or kept out of the slot by REQ-6956, and every other frame was shown in the last 14 days, the game MUST use the frame it showed longest ago among those not held.

REQ-3612 covers only a structure with no frame left unshown, and a held frame is never shown, so without this rule no frame would be named while a hold is on.

Written from RES-4230 on the owner's instruction of 2026-09-28 to process addendum 2.
