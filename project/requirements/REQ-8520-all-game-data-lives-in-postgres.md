---
id: REQ-8520
artifact: requirement
topic: storage
class: non-functional
status: approved
revised: 2026-11-08
elaborates: RES-4319
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-8520

All game data, meaning the event log, the derived tables, the settings and the accounts, MUST live in a Postgres database that runs on the parent's Mac.

The owner asked on 2026-11-08 for a full Postgres for all data, and REQ-2502 keeps the data on the Mac.
