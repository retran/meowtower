---
id: REQ-5640
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4060
verification: behavioural
---

# REQ-5640

When the player submits a plan, the event log MUST record a `plan_submitted` event holding the full sequence of cards she laid, before she answers the problem.

The attempt is written only when she answers, so without this event a break between the plan and the answer would lose the plan.

Written from RES-4060 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
