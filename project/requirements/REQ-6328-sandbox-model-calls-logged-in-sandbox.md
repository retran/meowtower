---
id: REQ-6328
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4130
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6328

Every model call the sandbox makes MUST be recorded, both its request-and-response record and its call event, in the sandbox's database and never in the player's.

A call recorded in the player's database changes her file, and it would also enter the play key's monthly count.

Written from RES-4130 on the owner's instruction of 2026-09-28.

Imposed by the owner's addendum 1 of 2026-09-28.
