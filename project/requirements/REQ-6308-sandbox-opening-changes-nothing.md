---
id: REQ-6308
artifact: requirement
topic: data-model
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4130
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6308

Opening the player's database for the sandbox MUST change no table and no row in it.

The server's usual way of opening a database applies migrations and rebuilds derived tables, and each of those writes.

Written from RES-4130 on the owner's instruction of 2026-09-28.
