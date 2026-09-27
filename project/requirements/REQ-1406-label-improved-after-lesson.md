---
id: REQ-1406
artifact: requirement
topic: lessons
class: functional
status: approved
revised: 2026-09-27
elaborates: RES-1400
verification: behavioural
---

# REQ-1406

When a lesson mark exists on a node or on one of its prerequisites, and the node's state at a check after the mark is higher than at the last check before it, in the order «Пока не освоено» (not mastered yet), «Понимает» (understands), «Понимает, нужна скорость» (understands, needs speed), «Бегло» (fluent), «Устойчиво» (stable), the report MUST label the node «Улучшилось после урока» (improved after a lesson).

Default chosen by the requirements step. The research leaves open which label applies when only a prerequisite was marked; a lesson on a prerequisite is the likelier cause, so it counts. The research leaves the order of states open; the order follows the chain of rule states in RES-0900, and an inferred, unchecked or cut-off state is not a check.
