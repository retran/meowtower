---
id: REQ-7314
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4270
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7314

The report MUST show a hypothesis's measures over the observations logged before its judging window opened apart from those in the window, marked «до записи» (before it was written) for data logged before the hypothesis and «до смены критериев» (before the criteria changed) for data logged after it but before its last change of criteria.

The earlier data is where the hypothesis came from, so the parent still sees it, and REQ-7312 keeps it out of the label. Default chosen by the requirements step: research named only «до записи», and data logged after the hypothesis was written needs its own mark, because calling it «до записи» would be false.

Written from RES-4270 on the owner's instruction of 2026-09-28 to process addendum 2.
