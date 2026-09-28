---
id: REQ-6882
artifact: requirement
topic: selection
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4220
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6882

After a failed series, the Director MUST start a new series when the owed block leaves the node «устойчиво» (stable), or, if the node drops below «устойчиво», when it next reaches that state.

A new series needs evidence that the node was learnt again.

Written from RES-4220 on the owner's instruction of 2026-09-28 to process addendum 2.
