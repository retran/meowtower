---
id: REQ-5316
artifact: requirement
topic: answer-input
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4030
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5316

The value ten times the correct result, the value one tenth of it and, when the task's final operation is multiplication, the sum of its operands MUST each fall on an option other than the correct one.

The estimate is meant to catch errors of order and, on multiplication, adding in place of multiplying, and an option that covers both the right value and an error can't tell them apart. The addendum names adding in place of multiplying only, so the third error applies to multiplication alone; this reading is a default chosen in writing this requirement.

Written from RES-4030 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
