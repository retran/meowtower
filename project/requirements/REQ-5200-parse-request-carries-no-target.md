---
id: REQ-5200
artifact: requirement
topic: privacy
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4020
verification: static
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5200

A parse request MUST carry only the fixed parse prompt and the player's cleaned composed text, and no target expression, node id, topic name, problem type, verdict or other answer.

A parse request is the request that asks a model to read a riddle («Сплети загадку», Weave a riddle) the player composed. A parser that sees the target can fit its reading to it, and her other answers stay on the Mac.

Written from RES-4020 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
