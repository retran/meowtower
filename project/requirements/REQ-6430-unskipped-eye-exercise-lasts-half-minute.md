---
id: REQ-6430
artifact: requirement
topic: time
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4110
verification: behavioural
supersedes: [REQ-6132]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6430

An eye exercise the player doesn't skip MUST last at least 30 seconds, and at most 40 seconds when it keeps her eyes on the screen.

The parent can switch on «Пропустить» (Skip) (REQ-0314, REQ-0316), which ends an exercise at once, so the minimum binds only an exercise she completes. An exercise that takes her eyes off the screen ends when she taps «Готово» (Done), so it can run past 40 seconds.

Imposed by the owner's instruction of 2026-09-28 to decide the conflicts the specification step found.
