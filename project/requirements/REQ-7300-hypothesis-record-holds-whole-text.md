---
id: REQ-7300
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4270
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7300

When the parent saves a new hypothesis, the game MUST log a `hypothesis_recorded` event that holds its whole text, its criteria and its links.

The event's time is the date a later report can't rebuild, and the whole text in the event keeps the prediction readable from the log alone.

Written from RES-4270 on the owner's instruction of 2026-09-28 to process addendum 2.

Imposed by the owner's addendum 2 of 2026-09-28.
