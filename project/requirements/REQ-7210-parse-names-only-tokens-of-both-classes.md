---
id: REQ-7210
artifact: requirement
topic: outcomes
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4260
verification: behavioural
supersedes: [REQ-5206]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7210

The engine MUST reject as invalid any parse whose graph names a number other than an n or d token of the masked text it was sent, where the 100 of a percentage, the sum of a ratio's parts and the numerator 1 of a fraction word with no count come from the named operation's fixed definition and are not numbers the graph names.

So no language model supplies a number to a verdict, as REQ-1216 requires, while the expansions of REQ-7222 still get their constants.

Written from RES-4260 on the owner's instruction of 2026-09-28 to process addendum 2.
