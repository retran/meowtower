---
id: REQ-6008
artifact: requirement
topic: school-data
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4100
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6008

When the parent imports a snapshot, the game MUST write one import event carrying the date the document carries, the date of upload, the source the parent names and the file's hash.

The source is the teacher, an access request or another route the parent names. The timeline needs the document's date, the date of upload shows how late the parent received it, and the hash and source trace each value back to its file (REQ-6014).

Written from RES-4100 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
