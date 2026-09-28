---
id: REQ-5636
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4060
verification: behavioural
---

# REQ-5636

When a problem opened with a plan, the event log MUST record with the attempt its `planChoice` as one of `correct`, `extra_step`, `missing_step`, `wrong_order` and `used_distractor`, apart from the answer.

Recording it apart keeps the plan's score from mixing with the answer's.

Written from RES-4060 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
