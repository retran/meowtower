---
id: REQ-2226
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-27
elaborates: RES-2200
verification: behavioural
---

# REQ-2226

The event log MUST reject every attempt to change or remove a stored event, whichever part of the system makes it.

A guard in the application alone isn't enough: the research asks for the refusal at the level of the database.
