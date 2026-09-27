---
id: REQ-1412
artifact: requirement
topic: lessons
class: functional
status: approved
revised: 2026-09-27
elaborates: RES-1400
verification: behavioural
---

# REQ-1412

When the lesson's second recheck gives a state lower than the first recheck, in the order «Пока не освоено» (not mastered yet), «Понимает» (understands), «Понимает, нужна скорость» (understands, needs speed), «Бегло» (fluent), «Устойчиво» (stable), the report MUST label the node «Не сохранилось» (did not hold).

Default chosen by the requirements step. The research leaves the order of states open; the order follows the chain of rule states in RES-0900, and an inferred, unchecked or cut-off state is not a check.
