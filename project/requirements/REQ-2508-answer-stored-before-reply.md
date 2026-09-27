---
id: REQ-2508
artifact: requirement
topic: platform
class: non-functional
status: approved
revised: 2026-09-27
elaborates: RES-2500
verification: behavioural
---

# REQ-2508

When the server receives an answer, the server MUST store it durably before it replies to the client.

A crash or a power cut after the reply then loses no answer.

Default chosen by the requirements step: the research asks for the write as soon as the answer arrives, and storing it before the reply makes that moment testable.
