---
id: REQ-6110
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4110
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6110

When the parent changes music or effects, the event log MUST record the change as a `settings_changed` event and never as a `looks_set` event.

`looks_set` records a choice the player made, and this change is the parent's.

Written from RES-4110 on the owner's instruction of 2026-09-28.
