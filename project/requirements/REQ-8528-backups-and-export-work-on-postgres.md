---
id: REQ-8528
artifact: requirement
topic: storage
class: functional
status: approved
revised: 2026-11-08
elaborates: RES-4319
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-8528

The backups and the export MUST work on Postgres.

Postgres has no single file to copy, so each of them needs its own path.
