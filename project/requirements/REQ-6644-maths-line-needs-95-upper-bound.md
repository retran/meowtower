---
id: REQ-6644
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4200
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6644

The maths line MUST appear only when the upper limit of the 95 % Wilson interval of its pooled share lies below 0.8.

Default chosen by the requirements step: RES-4200 draws a line when the level lies wholly above or below its threshold, and I keep only the case below, because the maths line reports a maths gap and a share clearly above 0.8 shows none. At a share of 55 % the bound falls below 0.8 on about 96 % of seeds in RES-4200's simulation.

Written from RES-4200 on the owner's instruction of 2026-09-28 to process addendum 2.
