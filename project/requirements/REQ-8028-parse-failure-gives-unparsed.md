---
id: REQ-8028
artifact: requirement
topic: progression
class: functional
status: approved
revised: 2026-10-31
elaborates: RES-4311
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-8028

When a parse times out after 10 seconds, returns invalid JSON or returns a graph with no question, the riddle MUST get the verdict `unparsed`, with no observation.

Replaces the requirement that named base experience.
