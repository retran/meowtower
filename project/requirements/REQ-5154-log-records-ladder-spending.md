---
id: REQ-5154
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4010
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5154

When opening a hint ladder spends a guiding thread, the event log MUST record the spending with the reason `hint_ladder`.

The reason separates the opening from `hint` and `explanation` spending, and REQ-5152 relies on it to tell the two free cases apart.

Written from RES-4010 on the owner's instruction of 2026-09-28.

Imposed by the owner's addendum 1 of 2026-09-28.
