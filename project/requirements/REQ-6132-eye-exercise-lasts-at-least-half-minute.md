---
id: REQ-6132
artifact: requirement
topic: time
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4110
verification: behavioural
supersedes: [REQ-0306]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6132

An eye exercise MUST last at least 30 seconds, and at most 40 seconds when it keeps the player's eyes on the screen.

An exercise that takes her eyes off the screen ends when she taps «Готово» (Done), so it can run past 40 seconds.

Written from RES-4110 on the owner's instruction of 2026-09-28.

## Open review findings

- Rejected: "add RES-0300's reason for the 30- and 40-second bounds". RES-0300 records the 30-to-40-second length without a reason, so any reason written here would be invented; the bounds carry over from REQ-0306 unchanged.
