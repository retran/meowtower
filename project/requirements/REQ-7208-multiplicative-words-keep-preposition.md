---
id: REQ-7208
artifact: requirement
topic: privacy
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4260
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7208

The engine MUST mask a multiplicative word as an n token with its preposition kept, so «вдвое» (twice) becomes «в n1 раза» (n1 times), and «пополам» (in half) as «на n1 части» (into n1 parts) with n1 = 2.

The parser then reads the same form as «в 2 раза» (2 times), and the token's span still maps back to her word.

Written from RES-4260 on the owner's instruction of 2026-09-28 to process addendum 2.
