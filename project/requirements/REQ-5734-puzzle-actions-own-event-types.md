---
id: REQ-5734
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4070
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5734

The event log MUST record every step of the player's play with a puzzle under a puzzle event type of its own, `puzzle_offered`, `puzzle_opened`, `puzzle_move`, `puzzle_attempt`, `puzzle_hint`, `puzzle_solved` or `puzzle_shelved`, and never as a graded attempt.

A puzzle logged as a graded attempt would reach the knowledge model, which must not read it (REQ-5732).

Written from RES-4070 on the owner's instruction of 2026-09-28.

Imposed by the owner's addendum 1 of 2026-09-28.
