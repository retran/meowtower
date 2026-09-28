---
id: REQ-6010
artifact: requirement
topic: school-data
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4100
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6010

When a snapshot document carries no date, the import MUST take the date from the parent and record in the import event that the parent entered it.

The timeline needs a date for every snapshot, and a date the parent supplied is weaker evidence than one printed on the document.

Written from RES-4100 on the owner's instruction of 2026-09-28.
