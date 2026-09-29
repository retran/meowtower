---
id: REQ-7504
artifact: requirement
topic: measurement
class: non-functional
status: approved
revised: 2026-09-29
elaborates: [RES-4270, RES-4280]
verification: evaluation
supersedes: [REQ-7360]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7504

The hold of REQ-7338 MUST be the shortest multiple of 7 adventure days, and at most 56, at which synthetic logs of 180 adventure days at the probe's planned volume, over 2,000 hypotheses whose true measures sit exactly at each condition's number, read once, give an upper limit of the 95 % Wilson interval of the false-label rate at or below 10 %, a false label being one other than «мало данных» on either side on any adventure day within the 180, and each hypothesis holding one condition on each side.

At 200 hypotheses, a bar on the measured rate alone passes a setting whose true rate is 10.3 % about half the time (RES-4280), so the parent could read labels that are wrong more than 1 time in 10. The interval makes the measurement show the bar holds, and RES-4280's conclusion 6 asks for it. A fixed count read once keeps the interval's 2.5 % chance of passing a rate above 10 %, which stopping at the first pass would lose, and at 2,000 the bound passes a true rate of about 8.6 % or less. The log length, the one condition a side and the cap of 56 adventure days stay REQ-7360's; if no hold up to the cap passes, this requirement fails and the computed label can't ship.

Imposed by the owner's instruction of 2026-09-29 to settle the open findings.
