---
id: REQ-1832
artifact: requirement
topic: safety
class: functional
status: withdrawn
revised: 2026-11-01
elaborates: RES-1800
verification: behavioural
---

# REQ-1832

Withdrawn by ADR-3270 and replaced by REQ-8230: the Master reads signals in its own reply.

When a signal's level is in doubt, the game MUST treat the signal as serious.

A false alarm costs a paused story, while a missed serious signal leaves a real risk unreported.
