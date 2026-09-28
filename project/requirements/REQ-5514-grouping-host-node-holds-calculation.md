---
id: REQ-5514
artifact: requirement
topic: templates
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4050
verification: static
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5514

A grouping template's host node MUST be the node of the RES-0800 node table that holds the plain calculation, or A13 when the item's calculation meets A13's prerequisites A7 and A11.

The addendum offers a grouping task only on nodes she already calculates correctly, which reads as the node of the plain calculation. A13, which holds efficient calculation, may also host an item such as `99 * 6` whose calculation lies within its prerequisites, and REQ-5588 bars A13 from hosting the rest.

Written from RES-4050 on the owner's instruction of 2026-09-28.
