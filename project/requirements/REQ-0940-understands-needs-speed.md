---
id: REQ-0940
artifact: requirement
topic: knowledge-model
class: functional
status: approved
revised: 2026-09-27
elaborates: RES-0900
verification: behavioural
---

# REQ-0940

When a full block scores 4 or more and the median time of its right answers is above the fluency threshold, the node's state MUST become "understands" with the label «Понимает, нужна скорость» (understands, needs speed).

After a score of 3 the missing part is accuracy, so only the slow case says speed.
