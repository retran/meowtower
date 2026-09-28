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

## Open review findings

The second agent review preferred splitting the three commands into three requirements and asked what `batch` does with fewer than 10 or more than 50 items and what `adventure --from-snapshot` does with no snapshot. I kept one requirement because the three commands form one interface the owner's addendum names together, and I leave both edge cases to the design step, since RES-4130 decides neither.

The third agent review suggested reusing REQ-6378's default for `adventure --from-snapshot` with no snapshot. I reject it here: taking a snapshot is a second obligation this file can't carry, and whether the command-line sandbox may take one is left to the design step.
