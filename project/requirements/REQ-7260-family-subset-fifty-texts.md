---
id: REQ-7260
artifact: requirement
topic: development
class: non-functional
status: approved
revised: 2026-09-28
elaborates: RES-4260
verification: static
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7260

Acceptance test 3 MUST hold, apart from its 200 texts, a subset of 50 labelled texts for each family that writes a new operation: fractions, decimals, percentages and ratios.

One test over the whole set can pass while a family inside it fails. At 48 of 50 the 95 % Wilson interval bounds the true agreement from below at about 86.5 %, weaker than the whole set's 91 %, and cards cover a family until it passes. RES-4260 chose 50 texts over 100 because the parent labels about 20 texts in 15 minutes, so 200 more take about 2.5 hours; 100 a family would take about 5 hours for a lower bound of about 88.8 %.

Written from RES-4260 on the owner's instruction of 2026-09-28 to process addendum 2.
