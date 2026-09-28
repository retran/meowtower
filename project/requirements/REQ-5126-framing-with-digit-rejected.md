---
id: REQ-5126
artifact: requirement
topic: safety
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4010
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5126

The game MUST reject, before it reaches the review queue, a framing line that contains a digit or a Russian cardinal or ordinal numeral in any inflection, «один» and «одна» included.

The numbers in a hint come only from the engine, and this check catches the case a reader is most likely to miss. The check can't tell «одна» (alone) from «одна» (one), so it rejects both, a default I chose because a false rejection costs one rewritten line while a leaked number reaches the player. «Раз» (time, once) isn't a numeral and passes.

Written from RES-4010 on the owner's instruction of 2026-09-28.

Imposed by the owner's addendum 1 of 2026-09-28.
