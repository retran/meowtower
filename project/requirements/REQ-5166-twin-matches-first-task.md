---
id: REQ-5166
artifact: requirement
topic: attempts
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4010
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5166

The parallel task of a second attempt MUST have the same template, subtype and difficulty features as the first attempt's task, except that the twin of a problem with a missing number is drawn at random as a missing-number or a solvable problem of the same tier, so that over 1000 seeds both kinds occur.

A twin of a different kind measures something else, and a twin that always had a missing number would tell the player what kind of problem she had just met (RES-4040).
