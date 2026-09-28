---
id: REQ-6980
artifact: requirement
topic: measurement
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4230
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6980

A 60-day simulation MUST show that the game gives at most one `firstExposure` per subtype, per subtype-and-format pair and per subtype-and-context pair, and exactly one for each such pair shown in the simulation and not used up by a higher kind at the same show; that no subtype with templates in both formats shows its context format before its node is fluent by a tested result or 14 game days have passed; that no subtype with at least 2 contexts with an accepted frame shows its last unmet context before its node is fluent by a tested result; and that REQ-5864's half-bare rule still holds on every node.

This is addendum 2's acceptance test 2, read per subtype as REQ-6924 reads the 2 weeks.

Written from RES-4230 on the owner's instruction of 2026-09-28 to process addendum 2.
Imposed by the owner's addendum 2 of 2026-09-28.
