---
id: REQ-1408
artifact: requirement
topic: lessons
class: functional
status: approved
revised: 2026-09-27
elaborates: RES-1400
verification: behavioural
---

# REQ-1408

When a node's state at a check is higher than at the check before it, in the order «Пока не освоено» (not mastered yet), «Понимает» (understands), «Понимает, нужна скорость» (understands, needs speed), «Бегло» (fluent), «Устойчиво» (stable), and neither the node nor any of its prerequisites has a lesson mark in the 30 days before the check, the report MUST label the node «Улучшилось без урока» (improved without a lesson).

Default chosen by the requirements step. The research leaves the order of states open; the order follows the chain of rule states in RES-0900, and an inferred, unchecked or cut-off state is not a check.
