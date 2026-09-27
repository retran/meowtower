---
id: REQ-2532
artifact: requirement
topic: platform
class: non-functional
status: approved
revised: 2026-09-27
elaborates: RES-2500
verification: static
---

# REQ-2532

Every backup copy MUST hold the event log and the stored binary data (blobs).

Every other table is rebuilt from the event log, so these two are all a restore needs.
