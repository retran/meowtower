---
id: REQ-6622
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4200
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6622

When a share or a median time in the report parts addendum 2 adds has no «мало данных» (too little data) floor of its own and rests on fewer than 5 observations, the report MUST show «мало данных» with the count in place of the value.

Each measure owns its floor: the profile bar, transfer, probe and hypothesis floors belong to their own records, and 5 is the floor REQ-5368 and ADR-0300 already use for a cell. A distribution-free 80 % interval for a median needs at least 4 observations, so the floor of 5 also keeps every median interval defined. The floors for limits and for the interest signal stay, because they count sessions and days.

Written from RES-4200 on the owner's instruction of 2026-09-28 to process addendum 2.
