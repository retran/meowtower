---
id: REQ-7500
artifact: requirement
topic: development
class: functional
status: approved
revised: 2026-09-29
elaborates: [RES-4200, RES-4280]
verification: behavioural
supersedes: [REQ-6668]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7500

Build check 5 MUST run four synthetic students over 20 seeds each, and read each seed only once its `bare`, Russian, Dutch and Dutch-after-the-words cells each hold 20 graded first attempts: a maths gap with every presentation at 55 %; a language gap with bare and Russian at 90 %, Dutch at 45 % and Dutch after the words at 85 %; no gap with every presentation at 90 %; and both gaps with bare and Russian at 55 %, Dutch at 15 % and Dutch after the words at 50 %.

The maths line pools bare with Russian, so its rate depends on the bare count: at 10 bare observations the both-gaps student's joint rate falls from 84.0 % to 74.6 %, and the bar of 14 of 20 then passes a working report on only 77 % of seed sets (ADR-0380). Bare tasks still follow the probe's own schedule, and the check only waits for them. The four students, the 20 seeds and the 45-point gaps are REQ-6668's, which research chose (RES-4200).

Imposed by the owner's instruction of 2026-09-29 to settle the open findings.
