---
id: REQ-5824
artifact: requirement
topic: selection
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4080
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5824

The Director's value of a node MUST include 1.0 when a school goal reaches the node through a link the parent confirmed, and nothing for a link the parent hasn't confirmed.

A link the parent hasn't confirmed may map a goal to the wrong node, so it moves nothing. The owner set the weight at 1.0, below the 1.5 of block priority, so a school goal nudges the order without outranking the tested blocks.

Written from RES-4080 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
