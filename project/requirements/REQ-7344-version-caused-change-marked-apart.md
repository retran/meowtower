---
id: REQ-7344
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4270
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7344

When a version change alters a hypothesis's label, the report MUST mark that change «пересчитано по новой версии» (recomputed under a new version) and keep it out of the count of REQ-7342.

A label that moved with no new play is not evidence about the player, and the parent must be able to tell the two apart. Default chosen by the requirements step: because REQ-7340 restarts the hold, a version's change of label shows only after the hold; it counts as the version's when the label REQ-7332 gives under the new versions already differed from the shown label on the day the versions changed.

Written from RES-4270 on the owner's instruction of 2026-09-28 to process addendum 2.
