---
id: REQ-6672
artifact: requirement
topic: development
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4200
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6672

Build check 5 MUST pass only when the student with both gaps gets both the language line and the maths line on the same seed on at least 15 of 20 seeds.

A student with both gaps has to be told apart from one with either gap alone, which only both lines on one seed show. RES-4200 gives about 88 % for the language line and about 96 % for the maths line on this student.

Written from RES-4200 on the owner's instruction of 2026-09-28 to process addendum 2.

## Open review findings

The agent review of 2026-09-28 found that both lines on one seed need the joint rate, which RES-4200 doesn't report: at about 0.85 the bar passes about 93 % of builds, below the 97 % RES-4200 aims for. Still open: the check's first run, or a rerun of RES-4200's simulation, has to give the joint rate, and the bar drops to the count that passes 97 % of builds if the rate is below about 0.87.
