---
id: REQ-5424
artifact: requirement
topic: knowledge-model
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4040
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5424

The knowledge model MUST score `insufficient_correct` as 1, `insufficient_partial` as 0.5 and `false_insufficient` as 0.

The scores match the credits the server records for these verdicts, so the knowledge model and the event log agree.

Written from RES-4040 on the owner's instruction of 2026-09-28.
