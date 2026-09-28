---
id: REQ-7304
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4270
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7304

When the parent closes a hypothesis that has a computed label, its `hypothesis_updated` event MUST hold the label and the model, threshold, rules and graph versions the report showed her at that moment.

A later version change recomputes every label, and without this record nothing would show which label she saw when she closed it. A hypothesis closed while it has no computed label, as in the first version, has no label or versions to hold.

Written from RES-4270 on the owner's instruction of 2026-09-28 to process addendum 2.
