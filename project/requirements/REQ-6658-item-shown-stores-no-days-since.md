---
id: REQ-6658
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4200
verification: static
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6658

The `item_shown` event MUST NOT store the days since the task's last exposure.

That figure is a difference between two logged dates, and a fact logged in two places can disagree after a bug. A projection over the log gives it.

Written from RES-4200 on the owner's instruction of 2026-09-28 to process addendum 2.
