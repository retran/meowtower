---
id: REQ-6136
artifact: requirement
topic: time
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4110
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6136

In an eye exercise that takes the player's eyes off the screen, the «Готово» (Done) button MUST stay inactive for the first 30 seconds and show no countdown.

The wait keeps REQ-6132's 30-second minimum, and a countdown would show time, which REQ-0302 bans on a timed event's screen.

Written from RES-4110 on the owner's instruction of 2026-09-28.
