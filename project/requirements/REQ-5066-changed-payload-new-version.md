---
id: REQ-5066
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4000
verification: static
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5066

A change to the fields of `attempt_submitted`, `item_shown` or `verdict` MUST arrive as a new version of that type's payload schema that still reads the events stored under earlier versions.

Stored events never change (REQ-2226), so an old event is read through its version and never rewritten.

Written from RES-4000 on the owner's instruction of 2026-09-28.
