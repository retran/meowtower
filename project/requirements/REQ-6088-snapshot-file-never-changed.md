---
id: REQ-6088
artifact: requirement
topic: school-data
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4100
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6088

A kept snapshot file MUST stay byte for byte as it was imported.

Every parse and correction names the file by its hash, so a changed file would break the trace from each value to its source.

Written from RES-4100 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
