---
id: REQ-7790
artifact: requirement
topic: task-text
class: functional
status: superseded
revised: 2026-10-31
elaborates: RES-4310
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7790

The game MUST reject a story frame that loses a placeholder of its template or adds one.

A story may name a number twice, because code fills the same value. The first live run on 2026-10-31 rejected 9 of 10 variants for that alone.
