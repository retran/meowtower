---
id: TSK-1036
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0380
closes: [REQ-6608]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The PDF snapshot prints every report screen and every node card, or nothing

After this task, the print stylesheet of the report has no per-screen switch and a test fails the print when a screen or a node card is missing, so a snapshot can't be a curated report in another form.

## Acceptance criteria

1. Given a report with its screens and N nodes, when the print is made, then the printed sections number one for each screen and one for each node card (REQ-6608). Closed by: a Playwright print test that counts sections against the screens and the graph's nodes.
2. Given a print where one node card is removed by a fixture, when the test runs, then it fails (REQ-6608). Closed by: the same test with the fixture.
3. Given the stylesheet and the print route, when they are read, then neither carries a per-screen or per-node switch (REQ-6608). Closed by: a unit test over the stylesheet's selectors and the route's query schema.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Change the print path of ADR-0180's report so it prints every screen and every node's card, and make the test count them. The export for the school stays as ADR-0310 builds it, holding school data only, and the snapshot adds no route.

## Depends on

Nothing in this epic.

The epic realising ADR-0180 supplies the print stylesheet; this task changes it.

## Evidence

Not yet.

## Left alone

The export for the school.
