---
id: REQ-6314
artifact: requirement
topic: event-log
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4130
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6314

When the player's database lacks its refusal of sandbox-marked events, the server MUST refuse to start.

The server already refuses to start without the database's append-only guards, and a missing refusal would let a sandbox event into her log unnoticed.

Written from RES-4130 on the owner's instruction of 2026-09-28.
