---
id: REQ-8604
artifact: requirement
topic: studio
class: functional
status: approved
revised: 2026-11-14
elaborates: RES-4320
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-8604

A version a generator writes MUST NOT be played, in the sandbox or by the child, until the parent keeps it.

The play path reads the newest version, so a generated one that is current plays before anyone has read it.
