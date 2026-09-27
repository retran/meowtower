---
id: REQ-2200
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-27
elaborates: RES-2200
verification: behavioural
---

# REQ-2200

When any derived view is deleted and a full recompute runs with the same model, threshold and graph versions, the game MUST rebuild that view from the event log alone, identical to the view before deletion.

Derived views are node estimates, node states, limits, the frontier, the report and every other table the log feeds. A view that holds something the log lacks can't be rebuilt, and then the log is no longer the only source of truth.
