---
id: REQ-8614
artifact: requirement
topic: studio
class: functional
status: approved
revised: 2026-11-14
elaborates: RES-4320
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-8614

The graph MUST mark each encounter and each exit that no test has reached, so the parent can see what is left to test.

The graph marks only what was reached, so what is left has to be worked out by eye.
