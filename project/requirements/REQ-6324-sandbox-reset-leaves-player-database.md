---
id: REQ-6324
artifact: requirement
topic: data-model
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4130
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6324

When the parent resets the sandbox, the reset MUST leave the player's database unchanged.

A reset replaces a database file and may copy hers again, so a wrong path or an opener that writes would change her file.

Written from RES-4130 on the owner's instruction of 2026-09-28.
