---
id: REQ-5274
artifact: requirement
topic: development
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4020
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5274

Acceptance test 3 MUST run the parser on masked text, in the live verification run, on the offline key.

The flag turns on only on the text the parser will get in play, and the test's spending stays off the play key.

## Open review findings

- Finding 20 (split masked text, live run and offline key): rejected, because one live run of acceptance test 3 verifies all three together.

Written from RES-4020 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
