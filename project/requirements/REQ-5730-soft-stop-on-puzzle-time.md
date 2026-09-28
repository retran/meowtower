---
id: REQ-5730
artifact: requirement
topic: time
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4070
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-5730

When, after the day's finale, the day's active time reaches the soft-stop point while the player is on a puzzle, the game MUST bring the soft stop at the next boundary.

Without this, no soft stop comes after the finale, because the approved soft stop comes only on an unfinished adventure; before the finale, a puzzle opened at a rest stop is inside an unfinished adventure, so the approved soft stop already covers it. The soft stop ends nothing by force, so the game still has no daily maximum. I chose as the default that a boundary on a puzzle is the moment after the reply to an answer or a hint, and never in the middle of a move in a widget.

Written from RES-4070 on the owner's instruction of 2026-09-28.

Imposed by the owner's addendum 1 of 2026-09-28.
