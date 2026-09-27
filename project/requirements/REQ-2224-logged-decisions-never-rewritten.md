---
id: REQ-2224
artifact: requirement
topic: event-log
class: functional
status: approved
revised: 2026-09-27
elaborates: RES-2200
verification: behavioural
---

# REQ-2224

The game MUST NOT change an outcome, a reward or a branch it has logged, even when a recompute under new versions would decide it differently.

The log keeps what the game decided and showed at that moment; a recompute changes only the conclusions drawn from it.
