---
id: REQ-5510
artifact: requirement
topic: outcomes
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4050
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5510

The grouping score MUST NOT change a task's outcome.

The addendum's acceptance test 6 holds that skipping the grouping never lowers the outcome, so the outcome comes from the verdict alone, and the short loop can only decorate a `clean` outcome.

Written from RES-4050 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
