---
id: REQ-6752
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4210
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6752

The model building bar MUST count one observation per Guardian problem, judged on its unassisted first attempt, a success when every part of its modelling phase that the problem has is right: the model choice, every entered step, and, while REQ-6762 allows, the plan labelled `correct`.

Default chosen by the requirements step: a Guardian problem that opened with no model choice, took no step input and has no plan the bar may read doesn't enter the bar, because it has no modelling phase to judge. A problem assisted during its modelling phase doesn't enter either, because REQ-6796 lets the dynamics read only unassisted first attempts.

Written from RES-4210 on the owner's instruction of 2026-09-28 to process addendum 2.

Imposed by the owner's addendum 2 of 2026-09-28.
