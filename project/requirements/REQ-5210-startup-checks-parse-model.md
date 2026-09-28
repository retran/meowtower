---
id: REQ-5210
artifact: requirement
topic: privacy
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4020
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5210

The server MUST refuse to start when the parse model has no zero-retention endpoint at a provider on the player-tier list.

The parse model is checked at start-up like every other player-tier model under REQ-2628.

Written from RES-4020 on the owner's instruction of 2026-09-28.
