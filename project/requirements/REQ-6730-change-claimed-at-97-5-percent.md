---
id: REQ-6730
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4210
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6730

A bar's change line MUST claim a rise or a fall only when Newcombe's hybrid score interval at 97.5 % for the gap between its two windows excludes zero.

At 80 % a bar with no real change shows a false rise or fall about one time in five, and about 83 % of reports would show at least one across eight bars taken as independent. At 97.5 %, that is 1 - 0.2 / 8, the chance of any false change across the eight stays at most 20 %. The change line isn't one of the interpretation lines REQ-6636 and REQ-6638 govern: RES-4200 leaves the profile's change lines to RES-4210, because eight lines read at once need the stricter level.

Written from RES-4210 on the owner's instruction of 2026-09-28 to process addendum 2.
