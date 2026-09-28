---
id: REQ-5252
artifact: requirement
topic: knowledge-model
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4020
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5252

The composing stream MUST keep, for each tier and problem type, the count of each riddle verdict other than `unparsed`.

An `unparsed` riddle is the parser's failure, not hers. The counts feed the report line of REQ-5254.

Written from RES-4020 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
