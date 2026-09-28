---
id: REQ-6852
artifact: requirement
topic: selection
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4220
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6852

When a node with a planned retention check gets a lesson mark or a «тренировали факты» (we practised facts) mark, the Director MUST end any hold and log the plan's cancellation as `retention_check_cancelled` with the reason.

The parent's recheck outranks the retention check, and a lesson inside the gap would spoil its observation anyway. The rule covers a plan whose hold hasn't started yet, such as one waiting for the next-day review.

Written from RES-4220 on the owner's instruction of 2026-09-28 to process addendum 2.
