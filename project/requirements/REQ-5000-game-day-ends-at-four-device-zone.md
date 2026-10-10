---
id: REQ-5000
artifact: requirement
topic: time
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4000
verification: behavioural
supersedes: [REQ-0334]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5000

The game day MUST end at 04:00 in the time zone of the device the player plays on.

The hour stays only as a service boundary for the daily jobs, and REQ-5002 keeps it out of her sight. Midnight would turn the day during an evening session, and a boundary set by rest would allow two adventures in one afternoon, so the record keeps 04:00.

Written from RES-4000 on the owner's instruction of 2026-09-28.
