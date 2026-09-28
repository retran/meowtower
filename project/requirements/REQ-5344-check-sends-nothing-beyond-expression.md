---
id: REQ-5344
artifact: requirement
topic: api
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4030
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5344

Before the player submits the first attempt, the server MUST NOT send the client the correct answer, the result her check should give for her preliminary answer, or any verdict on that preliminary answer.

Any of these would give away whether her answer is right before the first attempt, and the check stays free of information only while the client holds nothing beyond the visible expression.

Written from RES-4030 on the owner's instruction of 2026-09-28.
