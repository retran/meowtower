---
id: REQ-5288
artifact: requirement
topic: outcomes
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4020
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5288

When a parse times out after 10 seconds, returns invalid JSON or returns a graph with no question, the riddle MUST get the verdict `unparsed`, with base experience and no observation.

A parse failure must never become her error, as REQ-5236 holds for a failed correction. A replayed test checks each of the three cases.

Written from RES-4020 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
