---
id: REQ-5830
artifact: requirement
topic: knowledge-model
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4080
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5830

A Cito block MUST count as ready when at least 80 % of its nodes and subtypes are fluent or stable and, for blocks 1 and 2, at least 90 % of their facts are also automatic.

The owner set 80 % and 90 %. Blocks 1 and 2 are the basic operations and the times tables, which Cito also tests as bare facts, so their nodes can look fluent while single facts stay slow, and the fact condition catches that.

Written from RES-4080 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
