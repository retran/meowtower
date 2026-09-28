---
id: REQ-5438
artifact: requirement
topic: selection
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4040
verification: evaluation
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5438

Except while a refusal halves it, about 5 % of the T1 to T4 word problems the player gets on nodes whose ordinary subtype is «понимает» (understands) or above MUST be unanswerable problems.

An unanswerable problem is a T1 to T4 word problem of a subtype `T1.insufficient` to `T4.insufficient`, which can't be answered because a needed given is missing. The share stays low so that «Нельзя узнать» (can't be known) is a poor guess on a problem she can't solve. Below «понимает» the Director may not choose an unanswerable subtype at all, so those nodes stay out of the share.

Written from RES-4040 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.

## Open review findings

A reviewer suggested a tolerance and a sample size for "about 5 %". I left both to the author of the evaluation, because the owner's addendum and RES-4040 give neither and inventing one would add a decision research didn't make.
