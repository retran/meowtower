---
id: REQ-2420
artifact: requirement
topic: api
class: functional
status: approved
revised: 2026-09-27
elaborates: RES-2400
verification: behavioural
---

# REQ-2420

The server MUST NOT send a task's correct answer to the client before the player submits the first attempt on that task.

The first attempt measures what the player does alone, and an answer already on the device could leak into it.
