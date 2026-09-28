---
id: REQ-6084
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4100
verification: static
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6084

The event log MUST record snapshots through four event types: `school_snapshot_imported`, `school_snapshot_parsed`, `school_snapshot_corrected` and `school_snapshot_withdrawn`.

Each type is a separate step: REQ-6032 derives the view of changes from them, and REQ-6000 and REQ-6002 need them named to exclude them from the knowledge model.

Written from RES-4100 on the owner's instruction of 2026-09-28.
