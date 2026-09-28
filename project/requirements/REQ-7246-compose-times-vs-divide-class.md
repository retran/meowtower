---
id: REQ-7246
artifact: requirement
topic: outcomes
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4260
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7246

The engine MUST give the error class `compose_times_vs_divide` to a confirmed graph whose expanded form has `·` where the expanded target has `:` on the same numbers, or `:` where it has `·`.

Fischbein et al. (1985) and Greer (1987) found that the numbers in a problem change which of the two operations pupils choose. The class sits beside the verdict the value comparison gives, which for this pattern is `wrong_structure` unless the two values happen to be equal.

Written from RES-4260 on the owner's instruction of 2026-09-28 to process addendum 2.
