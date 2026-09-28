---
id: REQ-6914
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4230
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6914

The `frame_accepted` event MUST record the context of the frame it accepts.

The log then gives the context of every show through the frame the show names, from the log alone. Every frame carries its context from the first accepted frame, since the holds apply from the player's first adventure, so the log is expected to hold no untagged acceptance.

Written from RES-4230 on the owner's instruction of 2026-09-28 to process addendum 2.
