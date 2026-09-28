---
id: REQ-5298
artifact: requirement
topic: outcomes
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4020
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5298

The engine MUST give the verdict `wrong_structure` to a confirmed graph whose value differs from the target's.

That covers different operations with a different value, and the target's operations with `−` or `:` in the wrong order, such as «6 : 48» for «48 : 6». With REQ-5226, REQ-5228 and REQ-5230 every confirmed graph then gets one verdict, which REQ-5224 needs; the addendum defines `wrong_structure` as a riddle solved by another expression. Default chosen by the requirements step, because RES-4020 conclusion 8 left these cases without a verdict.

Written from RES-4020 on the owner's instruction of 2026-09-28.
Imposed by the owner's addendum 1 of 2026-09-28.
