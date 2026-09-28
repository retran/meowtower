---
id: REQ-5300
artifact: requirement
topic: answer-input
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4030
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5300

The game MUST ask for an estimate before the exact answer on between 10 % and 20 % of the scored tasks, counted over at least 200 such tasks, of multi-digit multiplication and division, decimals, percentages, area and volume, and T2 to T4 word problems whose correct result is 1000 or more.

An estimate and an exact answer on the same numbers let the report separate a player who feels the size of a result but miscalculates from one who calculates but doesn't feel the size; the two skills correlate at only 0.35 in accuracy. The owner's addendum says "about 15 %" and "large numbers" without a bound; the range of 10 % to 20 % over 200 tasks and the result of 1000 or more are defaults chosen in writing this requirement, and the design step can change them through a new requirement.

Written from RES-4030 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
