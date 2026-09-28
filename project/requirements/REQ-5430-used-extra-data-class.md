---
id: REQ-5430
artifact: requirement
topic: templates
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4040
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5430

When the player's answer to a word problem equals the result of a solution that uses the problem's unused number, the checker MUST give it the error class `used_extra_data`.

Without this class such an answer is `unclassified`, or a trap only when a template happens to list it, so the report can't show how often she uses surplus data. It holds for the surplus subtypes of T1 to T3 and for every T4 problem, which always holds one unused number.

Written from RES-4040 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
