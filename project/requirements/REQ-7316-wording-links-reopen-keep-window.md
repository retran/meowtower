---
id: REQ-7316
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4270
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7316

A `hypothesis_updated` event whose change is `wording`, `links`, `closed` or `reopened` MUST NOT move the start of the hypothesis's judging window.

Only a change of criteria is a new prediction; a hypothesis reopened keeps the window it had, because its criteria didn't change.

Written from RES-4270 on the owner's instruction of 2026-09-28 to process addendum 2.
