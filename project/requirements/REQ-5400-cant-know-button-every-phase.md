---
id: REQ-5400
artifact: requirement
topic: answer-input
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4040
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5400

Every T1 to T4 word problem MUST offer «Нельзя узнать» (can't be known) beside «Не знаю» (I don't know) in every phase it shows, the model choice, the plan cards and the step fields included.

A button shown only on some problems or in some phases tells the player which problems can be solved before she answers. The check that finds «Не знаю» in every answer kind finds «Нельзя узнать» in every phase of every T1 to T4 problem.

Written from RES-4040 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.

## Open review findings

A reviewer found that no requirement carries the twin of an unanswerable problem, its exclusion from the holding-steps limit, or the button's own label. I added the label as REQ-5470 and wrote no twin or holding-steps rule here, because REQ-5130 and REQ-5248, which supersede the approved twin and holding-steps rules, already carry both for a problem with a missing number, and a second rule here would contradict their replacements.
