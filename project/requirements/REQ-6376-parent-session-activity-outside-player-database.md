---
id: REQ-6376
artifact: requirement
topic: api
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4130
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6376

The parent session's activity MUST NOT be recorded in the player's database.

Every sandbox request renews the parent session (REQ-6344), so activity recorded in her database would change it on every sandbox request and break the guarantee REQ-6370 measures. The server keeps parent sessions in memory today.

Written from RES-4130 on the owner's instruction of 2026-09-28.
