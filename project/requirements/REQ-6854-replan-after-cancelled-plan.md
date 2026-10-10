---
id: REQ-6854
artifact: requirement
topic: selection
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4220
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6854

After a lesson mark cancels a plan, the Director MUST start a new series at check number 1 as soon as the lesson's second recheck leaves the node «устойчиво» (stable), or, when that recheck leaves it below, as soon as it next reaches «устойчиво».

A node the parent's lesson left stable shouldn't have to drop and regain the state before it is measured, which is the same reason stable nodes are planned when the check ships. The second recheck ends the lesson's own measurement. A new series, not the old one, because the lesson changed what the earlier observations measured; I chose this as a default.
