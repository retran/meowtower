---
id: REQ-3912
artifact: requirement
topic: judge
class: functional
status: approved
revised: 2026-09-27
elaborates: [RES-3910, RES-1600]
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-3912

The server MUST treat a local judge's answer to a check as an error unless it names one of the check's fixed answers and gives a probability, between 0 and 1, for each of them.

An answer outside the fixed set maps to no outcome, and the thresholds the Russian test set sets are probabilities, so an answer without them can't be held to a threshold. An error takes the fallback the judge's decision sets.

Written from RES-3910 on the owner's instruction of 2026-09-27.
