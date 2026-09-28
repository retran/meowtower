---
id: REQ-7404
artifact: requirement
topic: report
class: functional
status: approved
revised: 2026-09-28
elaborates: [RES-4280, RES-4240]
verification: behavioural
supersedes: [REQ-7034]
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# REQ-7404

The screen MUST place a Cito row in no quadrant when its category has fewer tested nodes than its floor, the smaller of 10 and the larger of 5 and three quarters of the category's mapped nodes rounded up, or when it has fewer than 10 tested nodes and the difference of REQ-7030 falls short of its margin, recomputed, once one of the category's tested nodes crosses the block score of 4 in the direction that narrows the difference.

The floor is 6 for Verhoudingen and Verbanden, which the flat floor of 10 shut out for the life of the game, and stays 10 for Meten en meetkunde and Getallen. At 6 tested nodes one node moves the share by 16.7 points, so one block that changes class with no change in the player could make a reading: without the guard a player with no real difference reads by chance on about 34 % of test moments, and with it on about 5 %, at the cost of about a quarter of true readings (RES-4280). Default chosen by the requirements step: ADR-0420's clause that the row's reason shows its tested and mapped node counts stays out of this requirement, because a file holds one obligation and REQ-7036 already makes every row in no quadrant say why.

Written from RES-4280 on the owner's instruction of 2026-09-28 to process addendum 2.

## Open review findings

- The agent review of 2026-09-28 found that no requirement now holds ADR-0420's clause on the tested and mapped counts, because REQ-7036 asks for the reason and not the counts. Open: the brief for this step allowed new requirements beyond the three replacements only where the hold's simulation forced one, so the counts clause waits for the owner, who can add it as its own requirement or leave it to ADR-0420's wording.
- The same review preferred the floor and the guard in two sentences or two files. Rejected: both set when a row goes in no quadrant, so they form one obligation, and two MUST sentences in one file would break the rule of one obligation a file.
