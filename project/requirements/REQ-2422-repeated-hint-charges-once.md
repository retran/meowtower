---
id: REQ-2422
artifact: requirement
topic: api
class: functional
status: approved
revised: 2026-09-27
elaborates: RES-2400
verification: behavioural
---

# REQ-2422

When the client repeats a hint request it has already sent, the server MUST NOT spend a second guiding thread for it.

A retry after a lost reply would otherwise charge the player for a hint she saw once.
