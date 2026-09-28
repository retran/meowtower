---
id: REQ-6426
artifact: requirement
topic: selection
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4080
verification: behavioural
supersedes: [REQ-5860]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6426

A fact MUST return the day after a wrong answer or one slower than the fact threshold, and after an answer both right and within the threshold, at a longer interval than the one before until the interval reaches 14 days, and at 14 days after that.

An interval that grew without end would leave a fact she knows unseen for months before the horizon.

Imposed by the owner's instruction of 2026-09-28 to decide the conflicts the specification step found.
