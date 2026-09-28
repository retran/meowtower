---
id: REQ-5668
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4060
verification: behavioural
---

# REQ-5668

The report MUST count a wrong answer after a `correct` plan as a calculation error.

After a right plan only the execution is left to fail, following Mayer's split of solving into representing, planning and executing.

Written from RES-4060 on the owner's instruction of 2026-09-28.

## Open review findings

- The finding asks how a wrong answer after an `extra_step` or `wrong_order` plan counts. Rejected: RES-4060 decides only the case after a `correct` plan, and choosing the others would change the research decision.
