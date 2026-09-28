---
id: REQ-5290
artifact: requirement
topic: development
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4020
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5290

The composing flag MUST stay off unless acceptance test 3 has passed on masked text on the parse model the gateway is configured with.

So a change of parse model turns the flag off until the test passes on the new one.

Written from RES-4020 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
