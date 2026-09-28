---
id: REQ-6938
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4230
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6938

Every `firstExposure` MUST carry its `kind` (subtype, format or context), its `distance` (near or far), whether it is `eligible`, the `reason` when it isn't, and `expected`.

The owner named `kind` and `distance`. The research added the other three so the report can count only clean observations and judge a share against what the model expected.

Written from RES-4230 on the owner's instruction of 2026-09-28 to process addendum 2.
Imposed by the owner's addendum 2 of 2026-09-28.
