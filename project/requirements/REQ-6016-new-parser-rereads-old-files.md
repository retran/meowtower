---
id: REQ-6016
artifact: requirement
topic: school-data
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4100
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6016

When the parser version changes, the game MUST reread every kept snapshot file that isn't withdrawn into new parse events and leave the earlier parse events unchanged.

The earlier parses are events in a log that erases nothing, and the new parse is what lets a better parser improve old snapshots. Default chosen by the requirements step: a withdrawn file isn't reread, because every view hides it (REQ-6078).

Written from RES-4100 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
