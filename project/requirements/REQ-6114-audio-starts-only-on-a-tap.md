---
id: REQ-6114
artifact: requirement
topic: sound
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4110
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6114

When the parent has turned sound on, the client MUST start audio output only in response to the player's tap.

Safari may refuse to start audio at any other moment, and a sound that fails to start at one moment and starts at another would be a surprise.

Written from RES-4110 on the owner's instruction of 2026-09-28.
