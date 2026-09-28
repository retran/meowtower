---
id: REQ-5022
artifact: requirement
topic: time
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4000
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5022

The check that no player screen shows a clock MUST fail on every display of her own current or elapsed time and on nothing printed inside a task, such as a timetable or a clock face to read.

The Sources track and the Dutch word bridge print times of day inside tasks, and the rule of REQ-0300 is about her own time. Default chosen by the requirements step: the task's content is the only exception.

Written from RES-4000 on the owner's instruction of 2026-09-28.
