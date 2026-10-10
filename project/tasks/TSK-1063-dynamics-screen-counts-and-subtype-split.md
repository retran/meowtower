---
id: TSK-1063
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0400
closes: [REQ-6800, REQ-6814]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The dynamics screen shows each node's weekly counts, and the node card splits them by subtype

After this task, the post-MVP dynamics screen shows for each node and week the count in each of four bins, such as "5 сама, 1 хватило первой ступени, 2 требует обучения", and the node card shows the same counts split by subtype.

## Acceptance criteria

1. Given a node with 5 «сама», 1 «хватило первой ступени» and 2 «требует обучения» in one week, when the dynamics screen is rendered, then the week reads "5 сама, 1 хватило первой ступени, 2 требует обучения" and shows no share and no floor (REQ-6800). Closed by: a Playwright test over a fixture log.
2. Given a node with two subtypes whose attempts need different help, when its node card is opened, then it shows the bins' counts for each subtype apart (REQ-6814). Closed by: a Playwright test.
3. Given the report after this task, when its screens are listed, then report v1's screens are still present and unchanged in their approved contents (REQ-6800). Closed by: a Playwright test that lists the screens.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the weekly counts to the dynamics screen and the subtype split to the node card, reading `weekly_breakdown` of TSK-1061. A count is exact at any size, so it needs no «мало данных» floor. All strings, the four bin names included, live in the Russian string file of ADR-0160; the bin names are listed in ADR-0400's Consequences.

## Depends on

- TSK-1061 (blocking): the bins.

The epic realising ADR-0180 supplies the report, the dynamics screen and the node card; until it exists a test renders the added components alone.

## Evidence

Not yet.

## Left alone

The trajectory's points and marks, which TSK-1062 builds, and the retention list, which TSK-1073 builds.
