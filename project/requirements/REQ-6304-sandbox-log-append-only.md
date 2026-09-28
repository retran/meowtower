---
id: REQ-6304
artifact: requirement
topic: event-log
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4130
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6304

The sandbox's event log MUST refuse to change or delete an event, as the player's log does.

The sandbox runs the same game as the player's, so its log needs the same guarantees for its folds to mean the same thing.

Written from RES-4130 on the owner's instruction of 2026-09-28.
