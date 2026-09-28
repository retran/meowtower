---
id: REQ-6344
artifact: requirement
topic: api
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4130
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6344

Every sandbox request, including one shaped like a play request, MUST count as parent activity for the parent session's idle expiry.

Otherwise an adventure played in the sandbox as the player would expire after 30 minutes while the parent is still playing it.

Written from RES-4130 on the owner's instruction of 2026-09-28.

Imposed by the owner's addendum 1 of 2026-09-28.
