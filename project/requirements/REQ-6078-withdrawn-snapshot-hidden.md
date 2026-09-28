---
id: REQ-6078
artifact: requirement
topic: school-data
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4100
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6078

When the parent withdraws a snapshot, the game MUST write a withdrawal event and hide the snapshot and its values from every projection, every report and the export for the school.

The log erases nothing, so a withdrawal is the only way to undo a wrong snapshot that got past the check at import. The export of the whole event log still holds the snapshot's import, parse, correction and withdrawal events, so its row count matches the log (REQ-2926) and a recompute from it hides the snapshot again.

Written from RES-4100 on the owner's instruction of 2026-09-28.
