---
id: REQ-5952
artifact: requirement
topic: answer-input
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4090
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5952

A region answer MUST earn credit 1 for the correct region and 0 for any other region.

Point and grid answers give no partial credit either, and a neighbouring cell is the `misread_cell` trap, not a near miss.

Written from RES-4090 on the owner's instruction of 2026-09-28.
