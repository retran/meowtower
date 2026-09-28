---
id: REQ-6024
artifact: requirement
topic: school-data
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4100
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6024

The parser MUST leave empty every field the document doesn't show, with no value inferred for it.

A guessed value would enter the log as a fact the school never reported; an empty field stays open for the parent to correct.

Written from RES-4100 on the owner's instruction of 2026-09-28.
