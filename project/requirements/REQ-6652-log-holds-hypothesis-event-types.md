---
id: REQ-6652
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4200
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6652

From the first version, the event log MUST hold the event types `hypothesis_recorded` and `hypothesis_updated`.

A hypothesis written during the MVP keeps its date and its written prediction only in these events, and REQ-6676 puts them in the first version.

Written from RES-4200 on the owner's instruction of 2026-09-28 to process addendum 2.

Imposed by the owner's addendum 2 of 2026-09-28.
