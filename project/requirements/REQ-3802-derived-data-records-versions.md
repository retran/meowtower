---
id: REQ-3802
artifact: requirement
topic: data-model
class: functional
status: approved
revised: 2026-09-27
elaborates: RES-2550
verification: static
---

# REQ-3802

Every derived table and snapshot MUST record the model, threshold and graph versions it was computed with, the sequence number of the last event it took into account and the time it was computed.

Without them two snapshots can't be told apart or compared after a version change.
