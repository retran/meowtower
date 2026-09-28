---
id: REQ-6762
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4210
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6762

The model building bar MUST read plan labels only while the plans logged so far hold at least 10 `correct` plans and 10 faulty ones and wrong answers follow `correct` plans less often than faulty ones.

The plan label is approved as measuring nothing until that check holds, because a child can reach `correct` by matching card text to problem text. REQ-5644 still holds: a bar is a report figure and not a skill estimate. Default chosen by the requirements step: the check runs over every plan in the log and is rerun at each computation, so labels leave the bar again if the rates reverse, as the approved rule reopens the plan cross.

Written from RES-4210 on the owner's instruction of 2026-09-28 to process addendum 2.
