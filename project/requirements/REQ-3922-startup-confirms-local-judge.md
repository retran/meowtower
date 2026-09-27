---
id: REQ-3922
artifact: requirement
topic: judge
class: functional
status: approved
revised: 2026-09-27
elaborates: RES-3910
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-3922

When the server starts, it MUST confirm that each judge on the Mac answers, and read the hash of the model file it serves, before it sends that judge a check.

A judge that is down leaves each check it holds waiting out the judge timeout while the player waits, and finding it at start-up lets the checks go elsewhere first; the hash is what REQ-3920 compares. Where a check goes instead follows REQ-1688 and REQ-3924.

Written from RES-3910 on the owner's instruction of 2026-09-27.
