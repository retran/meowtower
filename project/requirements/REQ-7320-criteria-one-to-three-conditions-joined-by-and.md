---
id: REQ-7320
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4270
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7320

When the parent writes numeric criteria for a hypothesis, they MUST hold one to three conditions for confirmation and one to three for refutation.

A side with no condition could never be met, so the label could fall only one way, and each added condition needs its own 20 observations in the judging window, so each one delays the label further. A hypothesis with text criteria alone, such as one written in the first version, has no computed label, and REQ-7370 has the report say why.

Written from RES-4270 on the owner's instruction of 2026-09-28 to process addendum 2.

## Open review findings

- The first review noted that RES-4270 has the report say why a hypothesis written in free text alone has no label, while this requirement asks for at least one condition. The second review found the same gap; the requirement now binds only numeric criteria, and REQ-7370 carries the report's explanation. Resolved on 2026-09-28.
