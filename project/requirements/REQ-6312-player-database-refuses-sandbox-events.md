---
id: REQ-6312
artifact: requirement
topic: event-log
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4130
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6312

The player's database MUST itself refuse to store an event that carries the sandbox mark, whatever code sends it.

The server still holds a connection that can write to her database, and one bug that hands it to sandbox code would otherwise put sandbox events into her log.

Written from RES-4130 on the owner's instruction of 2026-09-28.

Imposed by the owner's addendum 1 of 2026-09-28.
