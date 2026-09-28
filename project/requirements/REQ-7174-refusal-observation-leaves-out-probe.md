---
id: REQ-7174
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: [RES-4250, RES-4040]
verification: behavioural
supersedes: [REQ-5454]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7174

When the player has answered «Нельзя узнать» (can't be known) on 3 or more of her last 20 solvable T1 to T4 word problems, not counting Dutch probe letters, the report MUST show the observation «склонна отказываться от задачи» (tends to refuse the problem).

The guard applies only once 20 such problems exist. At 7 to 9 word problems a week, one slip is 11 % to 15 % of a week and would cross the owner's 10 % in a weekly window; in a window of 20 one slip is 5 %, and 3 is the first count above 10 %. A letter offers no «Нельзя узнать», so counting it would dilute the window.

Written from RES-4250 on the owner's instruction of 2026-09-28 to process addendum 2.
