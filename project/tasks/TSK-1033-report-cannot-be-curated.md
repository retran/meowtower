---
id: TSK-1033
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0380
closes: [REQ-6606]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The report offers no setting, filter or mode that hides a node or a figure

After this task, the report routes accept only `at=` and a page number, and a test finds every node of the graph on the map whatever the log holds, so the parent can't build a report that shows only the good.

## Acceptance criteria

1. Given each `/api/parent/report*` route, when it is called with a parameter such as `filter`, `hide`, `mode` or `node`, then it answers `400` (REQ-6606). Closed by: a route test over every report route and four parameters.
2. Given a fixture log in which half the nodes are weak, when the graph map is rendered, then it shows every node of the graph (REQ-6606). Closed by: a Playwright test that counts the nodes.
3. Given the Parent Room's settings schema, when its keys are listed, then none hides a node, a dimension or a figure (REQ-6606). Closed by: a unit test against the list of allowed keys.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Make the query schemas of the report routes strict and let them accept ADR-0180's `at=` and a page number only. Add the allow-list test for the settings. A report that can show only the good can't show a weak side at all, so the test has to fail when anyone adds a key.

## Depends on

Nothing in this epic.

The epic realising ADR-0180 supplies the report routes; this task tightens the ones that exist.

## Evidence

Not yet.

## Left alone

The PDF snapshot, which TSK-1036 holds to the same rule.
