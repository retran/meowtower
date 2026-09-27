---
id: REQ-1104
artifact: requirement
topic: measurement
class: functional
status: approved
revised: 2026-09-27
elaborates: RES-1100
verification: behavioural
---

# REQ-1104

The game MUST raise the fatigue signal when, and only when, the median answer time at a control-fact point exceeds 1.5 times the median at the adventure's opening point, whatever the accuracy at either point.

Accuracy stays out so that fatigue isn't confused with a hard task or with a run of `alt` outcomes, which the anxiety signal watches.
