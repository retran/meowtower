---
id: REQ-5432
artifact: requirement
topic: templates
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4040
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5432

The generator MUST NOT produce a word problem in which a solution using its unused number gives the correct answer or the answer of another trap.

If the answers match, the class `used_extra_data` can't be told apart from a right answer or from the other trap.

Written from RES-4040 on the owner's instruction of 2026-09-28.
