---
id: REQ-7206
artifact: requirement
topic: privacy
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4260
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7206

The engine MUST mask a round cardinal of tens or hundreds followed by an ordinal of a lower order, such as «двадцать пятых» (twenty-fifths) or «сто первый» (hundred and first), as one d token whose value is the whole compound denominator.

So «три двадцать пятых» reads as 3/25, with «три» as an n token, and not as a count of 3 and 20 fifths. A run that forms no compound ordinal, such as «двадцать одна пятая» (twenty-one fifths), keeps its cardinals as n tokens and its ordinal as a d token.

Written from RES-4260 on the owner's instruction of 2026-09-28 to process addendum 2.
