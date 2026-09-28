---
id: REQ-6014
artifact: requirement
topic: school-data
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4100
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6014

Every parse of a snapshot MUST be written as a new event carrying the parser version and the hash of the file it read.

Every value in the report then traces to one file and one parser version.

Written from RES-4100 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
