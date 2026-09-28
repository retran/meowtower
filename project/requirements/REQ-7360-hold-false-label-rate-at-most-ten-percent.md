---
id: REQ-7360
artifact: requirement
topic: measurement
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4270
verification: evaluation
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7360

The hold of REQ-7338 MUST be the shortest multiple of 7 adventure days, and at most 56, at which synthetic logs of 180 adventure days at the probe's planned volume, with at least 200 hypotheses whose true measures sit exactly at each condition's number, show a label other than «мало данных», on either side and on any adventure day within the 180, in at most 10 % of hypotheses, each hypothesis holding one condition on each side.

Daily states over growing data are strongly correlated, so 7 of them may protect little more than one, and only a measurement settles it. Ten per cent is what one side of an 80 % interval gives at a single look, and research counts both sides against it so the hold must beat a single look. One condition a side is the worst case, because REQ-7368 makes more conditions harder to meet. Default chosen by the requirements step: the log length, the count of hypotheses, the one condition a side and the cap of 56 adventure days, 8 weeks of play; if no hold up to the cap passes, this requirement fails and the computed label can't ship.

Written from RES-4270 on the owner's instruction of 2026-09-28 to process addendum 2.
