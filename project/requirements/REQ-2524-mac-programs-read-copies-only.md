---
id: REQ-2524
artifact: requirement
topic: platform
class: non-functional
status: approved
revised: 2026-09-27
elaborates: RES-2500
verification: static
---

# REQ-2524

A program on the Mac other than the server MUST read game data only from a copy, never from the live data the server writes.

Reading the live data from outside can lock or damage it while the game runs.
