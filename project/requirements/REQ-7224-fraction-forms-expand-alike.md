---
id: REQ-7224
artifact: requirement
topic: outcomes
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4260
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7224

The engine MUST expand a fraction written as one token, a/b, and a count followed by a fraction word alike, through the numerator a and the denominator b, and a fraction word with no count, such as «четверть от 80» (a quarter of 80), with a = 1.

Otherwise the same fraction would get two verdicts depending on whether she wrote it in digits or in words.

Written from RES-4260 on the owner's instruction of 2026-09-28 to process addendum 2.
