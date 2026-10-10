---
id: TSK-1097
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0420
closes: [REQ-7404]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# A small category reads on a floor scaled to its size and passes a one-node guard

After this task, a Cito row reads only when its category has at least as many tested nodes as its floor, the smaller of 10 and the larger of 5 and three quarters of its mapped nodes rounded up, and below 10 tested nodes only when its difference survives one node moving toward the outside share.

## Acceptance criteria

1. Given the four domains, when the floor is computed, then Getallen (34 nodes) and Meten en meetkunde (18) have the floor 10, and Verhoudingen (8) and Verbanden (7) have the floor 6; given a category that maps fewer than 5 nodes, then it never reads and its row shows `category_small` (REQ-7404). Closed by: a unit test on the four domains and a typed category mapped to 4 nodes.
2. Given Verbanden with 6 of its 7 nodes tested and a difference past the margin, when the row is built, then it reads; given 5 tested, then it is in no quadrant under `home_too_few` with «проверено 5 из 7 узлов за 30 дней до теста»; given Getallen with 9 tested, then `home_too_few` (REQ-7404). Closed by: a unit test, three fixtures.
3. Given 5 of 6 tested nodes high inside against 33 of 40 outside, then the row is even; given 6 of 6 inside against 33 of 40, then the difference is past the margin but falls short of it once one inside node moves one class toward the outside share, so the row shows `home_one_node` with «разница держится на одном узле» (REQ-7404). Closed by: a unit test, two fixtures.
4. Given a category with 10 or more tested nodes, when the row is built, then it follows the margin of TSK-1096 alone and the guard changes no reading it already gives (REQ-7404). Closed by: a unit test that runs the same fixture at 10 tested nodes with and without the guard.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the floor and the guard to the Cito row of `quadrants.ts`. The guard recomputes the difference with one inside node moved one class toward the outside share and puts the row in no quadrant when the recomputed difference falls short of the margin. Register the floor and the guard in ADR-0380's floor registry, `src/parent/measures.ts`, as the Cito category measure. A row under its floor shows how many nodes were tested of how many are mapped. This changes RES-4240's flat floor of 10 and replaces the requirement it set, which REQ-7404 now holds.

## Depends on

- TSK-1096 (blocking): the guard recomputes that task's margin and share.

The epic realising ADR-0380 supplies the floor registry; the task registers the measure in a stand-in registry with the same shape until it exists.

## Evidence

Not yet.

## Left alone

The order in which a row's reasons are shown, which TSK-1098 sets, and the wording of the reason strings, which ADR-0160's checks cover.
