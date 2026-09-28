---
id: REQ-7030
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: RES-4240
verification: behavioural
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7030

The home side of a Cito row MUST count the category as a relative strength when the share of its tested nodes at a block score of 4 or more exceeds the share over the tested nodes outside the category by at least the margin, as a relative weakness when it falls short by at least the margin, and as neither otherwise, where the margin in percentage points is 100 times the square root of q(1 - q)(1/n_in + 1/n_out), q is the share over all tested nodes, and n_in and n_out count the tested nodes inside and outside the category, and as neither when no tested node lies outside the category or when q is 0 or 1.

The margin is one standard deviation of the difference by chance, so it grows as the counts shrink: at 10 nodes inside, 40 outside and a share of 0.7 it is about 16 points. Comparing inside with outside makes the home side relative to her own profile, as Cito's side is. With no node outside or a share of 0 or 1 the margin is undefined or 0, and a row would read as strength and weakness at once. Default chosen by the requirements step: such a row counts as neither and goes in no quadrant. The owner revisits the one-deviation rule once a year of real home data shows how far category shares move between months with no lesson.

Written from RES-4240 on the owner's instruction of 2026-09-28 to process addendum 2.
