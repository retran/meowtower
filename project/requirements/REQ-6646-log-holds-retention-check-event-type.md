---
id: REQ-6646
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4200
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6646

From the release that brings retention checks, the event log MUST hold the event type `retention_check_planned`.

A planned retention check is a fact nothing else in the log records. REQ-6682 keeps retention checks out of the first version.

Written from RES-4200 on the owner's instruction of 2026-09-28 to process addendum 2.

Imposed by the owner's addendum 2 of 2026-09-28.
