---
id: REQ-7358
artifact: requirement
topic: scope
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4270
verification: static
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7358

The first version MUST NOT contain numeric hypothesis conditions, links to profile dimensions or probe presentations, or a computed hypothesis label.

The measures a condition reads come from the ability profile and the Dutch probe, which come after the MVP, so a label in the MVP would read «мало данных» throughout. The date of a hypothesis is what the MVP must keep, and every measure can be recomputed from the log later. A hypothesis written in the MVP holds its criteria as text, so it gets conditions only when the parent rewrites them, and that rewrite opens its judging window afresh. The scope guard checks it.

Written from RES-4270 on the owner's instruction of 2026-09-28 to process addendum 2.
