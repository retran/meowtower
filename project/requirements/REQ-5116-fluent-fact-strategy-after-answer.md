---
id: REQ-5116
artifact: requirement
topic: threads
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4010
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5116

When the player answers a basic fact in mental arithmetic whose fluency threshold is 10 seconds or less, the game MUST include its strategy hint in the short solution, whether the task window shows that solution at once after a miss or offers it after a right answer.

The task measures recall, so the strategy can teach only once the answer is in; REQ-5114 keeps it out of the task before the answer.

Written from RES-4010 on the owner's instruction of 2026-09-28.

Imposed by the owner's addendum 1 of 2026-09-28.
