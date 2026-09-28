---
id: REQ-7362
artifact: requirement
topic: measurement
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4270
verification: evaluation
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7362

On synthetic logs of the players with a maths gap and with a language gap that build check 5 defines in REQ-6668, the addendum's example hypothesis that the weakness in word problems comes from language, with each condition written as a number, MUST reach «опровергается» for the maths-gap player and «подтверждается» for the language-gap player on at least 15 of 20 seeds within 180 adventure days.

The example is the addendum's own, so the check shows the rule can tell the two causes apart. Default chosen by the requirements step: the pass bar of 15 of 20 seeds is check 5's (REQ-6670), and 180 adventure days covers the probe's slow phase, when a first label can take 57 to 107 adventure days. The design step writes the example's conditions as numbers, because the addendum's word "vanishes" has none.

Written from RES-4270 on the owner's instruction of 2026-09-28 to process addendum 2.

Imposed by the owner's addendum 2 of 2026-09-28.

## Open review findings

- The requirements step found, while fixing the first review's findings, that the addendum's refutation, Russian problems 20 points below bare ones, is never met by REQ-6668's maths-gap player, whose every presentation sits at 55 %, and a condition that Russian and Dutch differ by less than a number needs far more than 20 observations a side to be met at 80 %. The design step must choose numeric conditions that can separate the two players within the stated days, or research must revise conclusion 15. Open on 2026-09-28.
- The second review noted that leaving the numeric conditions to the design step lets whoever writes the check tune them until it passes. I kept the conditions out, because RES-4270 gives no numbers for the example and the requirements step must not invent them; the design step must fix and record them before the check's first run. Open on 2026-09-28.
