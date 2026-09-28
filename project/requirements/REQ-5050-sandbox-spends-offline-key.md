---
id: REQ-5050
artifact: requirement
topic: cost
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4000
verification: static
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5050

The model features of the parent's sandbox and the agent's command-line sandbox MUST spend from the offline key and never from the play key.

The parent's sandbox then can never stop the player's play by using up the play key's monthly limit.

Written from RES-4000 on the owner's instruction of 2026-09-28.
