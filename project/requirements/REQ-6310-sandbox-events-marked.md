---
id: REQ-6310
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4130
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6310

Every event written to the sandbox's own database MUST carry a mark that tells it apart from the player's events.

A sandbox event otherwise looks the same as hers, so the game's log writer and the player's database need the mark to recognise one that reaches the wrong database. A confirmed action is written to the player's log and is outside this rule (REQ-6352).

Written from RES-4130 on the owner's instruction of 2026-09-28.

Imposed by the owner's addendum 1 of 2026-09-28.
