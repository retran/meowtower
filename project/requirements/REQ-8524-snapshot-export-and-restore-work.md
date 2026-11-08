---
id: REQ-8524
artifact: requirement
topic: storage
class: functional
status: approved
revised: 2026-11-08
elaborates: RES-4319
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-8524

A restored backup MUST give the same derived tables as the log it holds.

Postgres has no single file to copy, so each of them needs its own path.
