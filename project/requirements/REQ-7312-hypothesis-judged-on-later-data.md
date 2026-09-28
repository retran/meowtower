---
id: REQ-7312
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4270
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7312

The report MUST compute a hypothesis's condition states and label only from observations that come later in the log than its `hypothesis_recorded` event, or than its last `hypothesis_updated` event whose change is `criteria`.

A hypothesis judged on data the parent could already read is an explanation of that data, not a prediction, and nothing can check what she had read. Default chosen by the requirements step: the order is the log's own order, not the device clock, because an entry a device queued offline can carry an earlier time than events logged before it.

Written from RES-4270 on the owner's instruction of 2026-09-28 to process addendum 2.

Imposed by the owner's addendum 2 of 2026-09-28.
