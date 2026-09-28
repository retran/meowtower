---
id: REQ-6346
artifact: requirement
topic: screens
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4130
verification: behavioural
supersedes: [REQ-3520]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6346

Every sandbox screen MUST show a striped frame with the label «Песочница — не влияет на игру» (Sandbox: does not affect the game).

The frame keeps the parent from taking a sandbox screen for the player's live game, and a screenshot of it from being read as her data. This replaces the test mode's frame and label, which the owner renamed to the sandbox. The label is given in Russian because the player-facing text is Russian for now, and it lives in the language files like every other string.

Written from RES-4130 on the owner's instruction of 2026-09-28.

Imposed by the owner's addendum 1 of 2026-09-28.
