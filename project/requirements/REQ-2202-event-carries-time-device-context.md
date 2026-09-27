---
id: REQ-2202
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-27
elaborates: RES-2200
verification: static
---

# REQ-2202

Every event MUST carry the server time, the device time, the device identifier and, where the event happens inside a session or an adventure, that session and that adventure.

Default chosen by the requirements step: the research asks every event to carry a session and an adventure, and a parent action or a device pairing happens outside both, so those events carry them only when they exist.
