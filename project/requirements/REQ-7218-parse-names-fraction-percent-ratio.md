---
id: REQ-7218
artifact: requirement
topic: outcomes
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4260
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7218

The parse reply MUST be able to name, over tokens only, a fraction a/b, a mixed number, a fraction of a number, a percentage of a number, a share of a ratio from its total and a part of a ratio from a known part.

A child writes «три четверти от двадцати» (three quarters of twenty), «два с половиной» (two and a half) and «две целых пять десятых» (two point five) as quantities, and the parse may name no number to build them. A fraction with no count before its fraction word takes a = 1, as REQ-7224 says.

Written from RES-4260 on the owner's instruction of 2026-09-28 to process addendum 2.
Imposed by the owner's addendum 2 of 2026-09-28.
