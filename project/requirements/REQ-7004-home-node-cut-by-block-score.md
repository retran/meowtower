---
id: REQ-7004
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4240
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7004

For the home side of a quadrant, a node MUST count as high when its state rests on a block score of 4 or more, which covers «понимает, нужна скорость» (understands, needs speed), «бегло» (fluent) and «устойчиво» (stable), and as low when its state rests on a block score of 3.5 or less.

The cut is by accuracy and not by speed, because the Cito tests have no time limit and a speed gap read as a knowledge gap sends the parent to the wrong check. For goal rows this assumes the school learning system's goal tasks are untimed too, which is unconfirmed; REQ-7006 covers the other case.

Written from RES-4240 on the owner's instruction of 2026-09-28 to process addendum 2.
