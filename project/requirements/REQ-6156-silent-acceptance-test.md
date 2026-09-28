---
id: REQ-6156
artifact: requirement
topic: sound
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4110
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6156

The silent-play acceptance test MUST pass only when the Awakening and one adventure of the day, played on WebKit with default settings, reach their end with no audio context created, no media element played and no sound file requested.

A muted run proves nothing by itself, because the test browser is muted by default.

Written from RES-4110 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
