---
id: REQ-5152
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4010
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5152

When the game shows a hint rung, the event log MUST record it as `thread` if its request spent the guiding thread and as `free_step` if it was shown with no charge, so the log tells a paid rung from a free one.

A reader tells the two free cases, a rung after the paid opening and a ladder the familiar opens free on a puzzle, apart by whether the task has a spending with the reason `hint_ladder`. REQ-5168 covers a rung restored on resume. The addendum set the two values, and research decided on the owner's instruction what `free_step` covers.

Written from RES-4010 on the owner's instruction of 2026-09-28.

Imposed by the owner's addendum 1 of 2026-09-28.
