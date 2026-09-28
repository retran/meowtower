---
id: REQ-7340
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4270
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7340

When the model, threshold, rules or graph version changes, the report MUST restart the hold of every hypothesis, open or closed, and count towards it only adventure days after the day of the change.

The recompute rewrites every past day under the new version at once, so those rewritten rows would otherwise satisfy the hold in one step, and a closed hypothesis reopened later would skip it. Default chosen by the requirements step: the day of the change itself doesn't count, because part of it ran under the old versions.

Written from RES-4270 on the owner's instruction of 2026-09-28 to process addendum 2.
