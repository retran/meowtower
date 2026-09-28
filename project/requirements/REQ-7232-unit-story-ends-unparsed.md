---
id: REQ-7232
artifact: requirement
topic: outcomes
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4260
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7232

When a story needs a unit conversion to join its quantities, such as «2 кг 500 г» (2 kg 500 g), the riddle MUST end as `unparsed`.

The factor, 1000 here, is no token, and a table of conversions would be a new source of numbers into the verdict that nothing in the record asks for.

Written from RES-4260 on the owner's instruction of 2026-09-28 to process addendum 2.
