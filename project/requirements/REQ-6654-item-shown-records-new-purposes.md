---
id: REQ-6654
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4200
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6654

When the Director shows a task as a retention check or as a Dutch probe task, its `item_shown` event MUST record the purpose `retention_check` or `nl_probe`.

The Director's choice at show time exists nowhere else in the log.

Written from RES-4200 on the owner's instruction of 2026-09-28 to process addendum 2.

Imposed by the owner's addendum 2 of 2026-09-28.
