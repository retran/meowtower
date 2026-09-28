---
id: REQ-6068
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4100
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6068

The export for the school MUST hold, per snapshot date, the school values as the parser read them, each correction marked as the parent's, and the Cito results the parent entered.

The export hands the school back its own data in one file. The corrections are the parent's readings of the school's own document, so they are marked as hers and the school can tell them from what it reported.

Written from RES-4100 on the owner's instruction of 2026-09-28.
