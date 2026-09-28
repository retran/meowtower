---
id: REQ-7236
artifact: requirement
topic: templates
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4260
verification: static
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7236

A target of the two meanings of division MUST declare its meaning, sharing into a number of parts or grouping by a size.

`compose_partition_vs_quotition` compares a division's kind with the kind the target declares, and without a declared kind the class can't fire. Default chosen by the requirements step: a `:` inside another construction's target, such as `(120 − 30) : 3`, declares no meaning, so the class doesn't fire on it.

Written from RES-4260 on the owner's instruction of 2026-09-28 to process addendum 2.
