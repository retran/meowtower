---
id: REQ-6890
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4220
verification: static
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6890

The `solution_shown` event MUST carry the `itemId` of its task from its first payload version.

A later report can't find which node a short solution belonged to without it, and event order alone breaks across resumes and devices.

Written from RES-4220 on the owner's instruction of 2026-09-28 to process addendum 2.
