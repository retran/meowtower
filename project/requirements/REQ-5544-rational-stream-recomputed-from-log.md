---
id: REQ-5544
artifact: requirement
topic: knowledge-model
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4050
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5544

The rational calculation stream MUST be recomputable from the event log alone, giving the same figures as the stream held before the recompute.

The test drops the stream, replays the log and compares the figures.

Written from RES-4050 on the owner's instruction of 2026-09-28.
