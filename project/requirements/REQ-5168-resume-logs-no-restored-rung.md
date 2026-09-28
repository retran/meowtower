---
id: REQ-5168
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4010
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5168

When a resume restores a hint rung the player already saw, the event log MUST NOT record that rung as shown again.

The rung isn't shown anew, and a second record would count one hint twice in the depth of help; this is a default I chose, because the research doesn't say.

Written from RES-4010 on the owner's instruction of 2026-09-28.
