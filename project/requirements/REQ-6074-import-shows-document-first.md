---
id: REQ-6074
artifact: requirement
topic: school-data
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4100
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6074

Before an import writes any event or file, the Parent Room on the Mac MUST show the parent the document beside the pupil's name the parser read from it, or a notice that it read no name.

Once imported, nothing removes a snapshot from the log or the kept files, so a wrong pupil's file has to be caught before it gets in.

Written from RES-4100 on the owner's instruction of 2026-09-28.
