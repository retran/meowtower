---
id: REQ-6022
artifact: requirement
topic: school-data
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4100
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6022

When a reparse and a correction give different values for the same field, the Parent Room MUST show the parent both values and that they disagree.

A new parser that disagrees with the parent's correction means either the correction or the parser is wrong, and only the parent can check against the document.

Written from RES-4100 on the owner's instruction of 2026-09-28.
