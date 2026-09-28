---
id: REQ-6106
artifact: requirement
topic: sound
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4110
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6106

Every volume the parent sets for music or effects MUST stay at or below a ceiling that keeps the game within the loudness budget of ADR-0150, part 7, and the ADR-0190 Baselines, each file normalised to -20 LUFS and -3 dBTP.

The ceiling exists because the addendum asks for a volume limit and the approved budget caps only each file, not how loud the parent's setting plays it. The design step sets the ceiling's value, and the check reads it from that value; I left the figure to the design step, because the record names none.

Written from RES-4110 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
