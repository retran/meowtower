---
id: REQ-6360
artifact: requirement
topic: development
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4130
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-6360

The Mac MUST offer a command-line sandbox, as `./meowtower sandbox item`, `./meowtower sandbox batch` and `./meowtower sandbox adventure --from-snapshot`, each printing its result as JSON: `item` runs one task item, `batch` runs a batch of 10 to 50 task items, and `adventure --from-snapshot` plays an adventure as the player from the last sandbox snapshot of her state.

The agent checks content with these commands before the player meets it.

Written from RES-4130 on the owner's instruction of 2026-09-28.

Imposed by the owner's addendum 1 of 2026-09-28.
