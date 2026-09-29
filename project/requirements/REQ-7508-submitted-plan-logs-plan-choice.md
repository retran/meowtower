---
id: REQ-7508
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-29
elaborates: RES-4060
verification: behavioural
supersedes: [REQ-5636]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7508

When a problem opened with a plan and the player submitted the plan, the event log MUST record with the attempt its `planChoice` as one of `correct`, `extra_step`, `missing_step`, `wrong_order` and `used_distractor`, apart from the answer.

Recording it apart keeps the plan's score from mixing with the answer's. A plan that «Нельзя узнать» (can't be known) ends before she submits it gets no label (ADR-0360 entry 56), because a label on cards she never submitted would grade a plan she didn't make.

Imposed by the owner's instruction of 2026-09-29 to settle the open findings.
