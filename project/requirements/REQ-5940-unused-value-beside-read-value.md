---
id: REQ-5940
artifact: requirement
topic: templates
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4090
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5940

Every generated source MUST place a different value the solution doesn't use next to each value the solution reads: in the adjacent cell of a table or timetable, the adjacent bar or point of a chart, or the adjacent square of a map.

A `misread_cell` answer then differs from the correct one, so the trap stays distinguishable.

Written from RES-4090 on the owner's instruction of 2026-09-28.
