---
id: REQ-0206
artifact: requirement
topic: resume
class: functional
status: approved
revised: 2026-09-27
elaborates: RES-0200
verification: behavioural
---

# REQ-0206

After every adventure event, the stored resume point MUST equal the resume point derived from the event log alone.

The event log is the only source of truth, so a resume point it can't reproduce holds a fact nobody logged.
