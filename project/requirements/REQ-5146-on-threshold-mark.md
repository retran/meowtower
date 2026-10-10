---
id: REQ-5146
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4010
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5146

The report MUST mark a node «на пороге» (on the threshold) when its state is «Пока не освоено» (not mastered yet) or «Уточняется» (being clarified), and at least 60 % of at least 3 assisted attempts within the last 14 days were right after rung 1.

The mark tells the parent the node needs consolidation and not an explanation from scratch. It reads the state and not a probability, because every label in the report comes from an explicit rule over counted attempts. These are the two states below «Понимает» (understands) that rest on unassisted evidence; «Не проверено» (not checked), «Не проверялся, отрезан узлом X» (not tested, cut off by node X) and «Stretch: не проверялся» never get the mark, because with no unassisted evidence there is nothing to set the hint against.
