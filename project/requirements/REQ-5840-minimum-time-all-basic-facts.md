---
id: REQ-5840
artifact: requirement
topic: measurement
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4080
verification: behavioural
supersedes: [REQ-1116]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5840

The minimum time of every basic fact, multiplying and dividing by 10, 100 and 1000 included, and of every control fact MUST be the motor correction plus 600 ms.

A fact recalled from memory is fast by design. The general floor would give multiplying by 10, 100 and 1000 at least 1500 ms plus the motor correction, half the 3 s fact threshold, and a quick real answer would count as a rapid guess.

Written from RES-4080 on the owner's instruction of 2026-09-28.
