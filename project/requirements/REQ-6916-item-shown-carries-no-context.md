---
id: REQ-6916
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4230
verification: static
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6916

The `item_shown` event MUST NOT record the context of the task it shows.

The event already names the frame, whose acceptance records the context, and a second record of one fact can disagree with the first.

Written from RES-4230 on the owner's instruction of 2026-09-28 to process addendum 2.
