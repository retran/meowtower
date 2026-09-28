---
id: REQ-7332
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4270
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7332

The report MUST label a hypothesis «опровергается» (is being refuted) when every refutation condition is met, «подтверждается» (is being confirmed) when every confirmation condition is met and not every refutation condition is, and «мало данных» (too little data) in every other case, a confirmation that is not met included.

A met refutation outranks a met confirmation because the report must show a weak side as clearly as a strong one. A failed confirmation shows that the prediction wasn't borne out, not that her refutation was met, so it leaves the label at «мало данных» and REQ-7334 shows it.

Written from RES-4270 on the owner's instruction of 2026-09-28 to process addendum 2.

Imposed by the owner's addendum 2 of 2026-09-28.
