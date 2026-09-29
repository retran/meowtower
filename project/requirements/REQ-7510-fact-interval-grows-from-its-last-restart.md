---
id: REQ-7510
artifact: requirement
topic: selection
class: functional
status: approved
revised: 2026-09-29
elaborates: RES-4080
verification: behavioural
supersedes: [REQ-6426]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7510

A fact MUST return the day after a wrong answer or one slower than the fact threshold, which restarts its intervals at 1 day, and after each answer both right and within the threshold since that restart, at a longer interval than the one before until the interval reaches 14 days, and at 14 days after that.

An interval that grew without end would leave a fact she knows unseen for months before the horizon. REQ-6426 asked every interval to be longer than the one before, which the return after a wrong answer can't meet, so the growth counts from the last restart.

Imposed by the owner's instruction of 2026-09-29 to settle the open findings.
