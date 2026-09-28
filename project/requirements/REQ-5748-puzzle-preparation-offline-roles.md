---
id: REQ-5748
artifact: requirement
topic: cost
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4070
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5748

The offline preparation of the puzzle bank MUST call models only in offline roles on the offline key.

The gateway refuses a play role on the offline key, and an offline run must never spend the month's play limit.

Written from RES-4070 on the owner's instruction of 2026-09-28.
