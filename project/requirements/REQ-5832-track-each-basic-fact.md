---
id: REQ-5832
artifact: requirement
topic: knowledge-model
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4080
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5832

The knowledge model MUST give each basic fact, about 300 of them, one of three states over its last 3 shows: «автоматизм» (automatic) as REQ-5834 defines it, «вычисляет» (computes) when the fact isn't automatic but was right on at least 2 of those shows, and «не знает» (doesn't know) otherwise, a fact shown fewer than 2 times included.

The basic facts are the times tables 1 to 10 with multiplication and division counted apart, addition and subtraction within 20 across the ten, and multiplying and dividing by 10, 100 and 1000. A node estimate can't show which fact is slow, and Cito sells a separate bare-sum test to find exactly that. The addendum defines «вычисляет» only as right but slower than the threshold, so the rule over the last 3 shows, and «не знает» for everything else, is a default chosen while writing this requirement.

Written from RES-4080 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
