---
id: REQ-3640
artifact: requirement
topic: task-text
class: functional
status: withdrawn
revised: 2026-11-01
elaborates: RES-0720
verification: behavioural
---

# REQ-3640

Withdrawn by ADR-3260 and replaced by REQ-8162: it contradicted a later decision.

When more than 30% of the live frames checked on a game day are rejected, the game MUST stop generating live frames until the day ends and take frames from the library.

The research doesn't say over what period the share is measured or when live generation starts again. Default chosen by the requirements step. It measures over the game day, from the tenth checked frame on, and starts again the next game day.
