---
id: REQ-6402
artifact: requirement
topic: measurement
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-1100
verification: behavioural
supersedes: [REQ-1112]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6402

When an answer arrives faster than its template's minimum time, the game MUST mark the answer as a rapid guess, unless the attempt was interrupted, moved between devices or carried an estimate step.

The time of those three kinds of attempt doesn't measure how long she took to answer, so a mark read from it would call a real answer a guess.

Imposed by the owner's instruction of 2026-09-28 to decide the conflicts the specification step found.
