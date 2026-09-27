---
id: REQ-3924
artifact: requirement
topic: judge
class: functional
status: approved
revised: 2026-09-27
elaborates: RES-3910
verification: static
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-3924

A judge check for which no model on the Mac passes both its agreement test (REQ-1688) and its latency test (REQ-3914) MUST stay with the hosted judge if that judge passed the check's test set, and otherwise with the safety model, as the approved record places it (RES-1600, RES-3910).

Only the check's own test set shows that a local model judges her Russian text as well as the reference, so a check with no passing result has no evidence that a local model may take it, and a local judge slower than the judge timeout sends her text to the safety model anyway; a local judge answering a check that failed its latency test breaks this.

Written from RES-3910 on the owner's instruction of 2026-09-27.
