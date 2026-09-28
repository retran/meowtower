---
id: REQ-5960
artifact: requirement
topic: limits
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4090
verification: static
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5960

The error-type limit MUST class `axis_scale`, `scale_conversion` and `time_across_hour` as conceptual.

Each is a misunderstanding of how the source encodes a quantity. The research rejected one procedural class for all seven, because it hides from the parent whether a scale or a row is the trouble.

Written from RES-4090 on the owner's instruction of 2026-09-28.
