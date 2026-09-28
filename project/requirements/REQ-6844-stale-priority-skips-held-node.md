---
id: REQ-6844
artifact: requirement
topic: knowledge-model
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4220
verification: behavioural
supersedes: [REQ-0978]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6844

A node whose last unassisted first attempt is more than 30 days old MUST get priority in task selection, unless it is held for a retention check.

A held node passes 30 days since its last meeting while its check is due from day 28 to day 35, and the check itself is the observation the priority asks for.

Written from RES-4220 on the owner's instruction of 2026-09-28 to process addendum 2.
