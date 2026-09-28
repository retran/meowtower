---
id: REQ-6004
artifact: requirement
topic: school-data
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4100
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6004

The game MUST keep each imported snapshot file exactly once, identified by the hash of its content.

The original file is what lets a better parser reread every old snapshot, and what every parsed value traces back to.

Written from RES-4100 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
