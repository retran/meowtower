---
id: REQ-7270
artifact: requirement
topic: answer-input
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4260
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7270

Equal groups, the two meanings of division and multi-step expressions whose operands are all whole numbers MUST be able to play in text form once the composing flag is on, with no subset test of their own.

REQ-5290 already holds the flag off until acceptance test 3 passes, and REQ-7268 puts these constructions in that test. A multi-step expression that holds a decimal, a fraction, a percentage or a ratio belongs to that family and waits for its pass under REQ-7264.

Written from RES-4260 on the owner's instruction of 2026-09-28 to process addendum 2.
