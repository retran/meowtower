---
id: REQ-6406
artifact: requirement
topic: knowledge-model
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-0900
verification: behavioural
supersedes: [REQ-0958]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6406

When a probe scores 0 out of 2, the Director MUST complete the node's full block in the same session, or, when time or the stretch cap of REQ-1004 runs out, first in each following session until the block completes.

The cap of 2 stretch tasks a day guards her daily load, so a stretch node's block can't finish in one session and continues first in the sessions after it.

Imposed by the owner's instruction of 2026-09-28 to decide the conflicts the specification step found.
