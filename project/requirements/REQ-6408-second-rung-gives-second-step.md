---
id: REQ-6408
artifact: requirement
topic: threads
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-0500
verification: behavioural
supersedes: [REQ-0540]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6408

The second hint rung MUST give the second real step of its task's solution and stop before the result of the second step.

Each rung gives one real step of the template's computation graph (REQ-5106), so the second rung carries the second step. Whether a rung prints the task's numbers is left to the design, because on a word problem a printed given would tell a solvable problem from an unanswerable one (REQ-5414).

Imposed by the owner's instruction of 2026-09-28 to decide the conflicts the specification step found.
