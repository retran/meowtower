---
id: REQ-7402
artifact: requirement
topic: development
class: functional
status: approved
revised: 2026-09-28
elaborates: [RES-4280, RES-4200]
verification: behavioural
supersedes: [REQ-6672]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7402

Build check 5 MUST pass only when the student with both gaps gets both the language line and the maths line on the same seed on at least 14 of 20 seeds.

Both lines on one seed are what tell this student from one with either gap alone, whose joint rates are 3.39 % and 0.01 %. At the joint rate of 84.0 % a working report passes a bar of 15 on 91.4 % of fixed seed sets and this bar on 97.0 %, so 14 is the highest bar that passes a working report on at least 97 % of seed sets, the target RES-4200 set for every bar, and fixed seeds repeat a failure on every build (RES-4280).

Written from RES-4280 on the owner's instruction of 2026-09-28 to process addendum 2.
