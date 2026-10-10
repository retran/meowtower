---
id: REQ-5860
artifact: requirement
topic: selection
class: functional
status: superseded
revised: 2026-09-28
elaborates: RES-4080
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5860

A fact MUST return the day after a wrong answer or one slower than the fact threshold, and after an answer both right and within the threshold, at a longer interval than the one before.

A wrong or slow fact is still weak, so it comes back while the miss is fresh. A fact answered well needs less practice each time, so the gap grows.

Written from RES-4080 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
