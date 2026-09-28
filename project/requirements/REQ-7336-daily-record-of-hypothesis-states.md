---
id: REQ-7336
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4270
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7336

The report MUST keep, for each hypothesis and each adventure day, a row with the state of every condition, the label REQ-7332 gives that day, the label shown after the hold, and the model, threshold, rules and graph versions the row was computed under.

The hold of REQ-7338 reads the computed label and the count of REQ-7342 reads the shown one, and the node snapshots the report already keeps hold none of the probe, subtype or profile measures a condition reads. Default chosen by the requirements step: a recompute adds rows under the new versions beside the old ones, as the approved snapshots do, so REQ-7344 can still tell a version's change from new play.

Written from RES-4270 on the owner's instruction of 2026-09-28 to process addendum 2.
