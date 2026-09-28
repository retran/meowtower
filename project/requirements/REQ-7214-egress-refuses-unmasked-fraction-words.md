---
id: REQ-7214
artifact: requirement
topic: privacy
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4260
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7214

The server MUST refuse to send a parse request whose text still holds a fraction word, an ordinal, a multiplicative word, «пара», «пополам» or a word of a cardinal-plus-ordinal run that REQ-7202, REQ-7204, REQ-7206 or REQ-7208 masks.

The refusal is the same one the server gives for any other unmasked number word, so a masker that misses one of the new words fails closed and the riddle falls back to cards.

Written from RES-4260 on the owner's instruction of 2026-09-28 to process addendum 2.
