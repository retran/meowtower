---
id: REQ-5822
artifact: requirement
topic: selection
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4080
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5822

The Director's value of a node MUST include 1.5 times the node's block priority, which is (7 - block) / 6 while the node's Cito block isn't ready, and 0 once it is ready or when the node carries no block.

The priority raises a tested block's nodes before the horizon and never forms a queue, because the flow share still decides only between frontier and review.

Written from RES-4080 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
