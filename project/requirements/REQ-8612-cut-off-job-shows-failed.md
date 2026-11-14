---
id: REQ-8612
artifact: requirement
topic: studio
class: functional
status: approved
revised: 2026-11-14
elaborates: RES-4320
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-8612

A background job that a restart cut off MUST show as failed with its last step, and never as running.

A job shown as running for ever hides the failure and blocks a retry.
