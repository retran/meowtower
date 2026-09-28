---
id: REQ-5104
artifact: requirement
topic: threads
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4010
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5104

Opening the hint ladder on the parallel task of a second attempt MUST cost 1 guiding thread of its own, whether or not the player opened the ladder on the first task.

The twin is a task of its own, and a free ladder there would weaken the check that the first hint helped. With the detailed explanation at 1 thread an attempt, this caps a task at 4 threads across both attempts.

Written from RES-4010 on the owner's instruction of 2026-09-28.
