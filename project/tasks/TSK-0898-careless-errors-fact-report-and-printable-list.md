---
id: TSK-0898
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0290
closes: [REQ-5868, REQ-5870, REQ-5888, REQ-5892]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The report shows careless errors on familiar material, two 10 x 10 fact maps and a printable list of slow facts

After this task, the report holds the careless-errors section by week and error class, the Summary raises the observation above 10 %, the graph map holds the multiplication and division maps under domain A, and the parent can print the facts that aren't automatic.

## Acceptance criteria

1. Given a fixture log with wrong first attempts on nodes that were fluent or stable and on facts that were automatic at that moment, when the section is built, then it shows for each week and each of the four error classes the share of those attempts that were wrong, with its count (REQ-5868). Closed by: a report test on the fixture log.
2. Given a week with 11 % of wrong first attempts on familiar material across all classes, when the Summary is built, then it raises «небрежные ошибки на знакомом» with the count beside the share, such as 1 of 4; given 10 %, then it raises nothing; and it raises the line at most once a week (REQ-5870). Closed by: a report test at 11 % and 10 %.
3. Given a fixture log of the 308 facts, when the fact report is built, then it shows a 10 x 10 map of the multiplication facts and a second of the division facts, each cell in its fact's state (REQ-5888). Closed by: a report test that reads 200 cells and their states.
4. Given facts in all three states, when the printable list is built, then it holds only the facts that aren't automatic, grouped by operation in the file's order, with no topic order and no date, and a print stylesheet formats it for the browser's print (REQ-5892). Closed by: a report test of the list and a Playwright test that emulates print media.
5. Given the parent presses «тренировали факты», when the event is read, then it logs the mark of REQ-5074 and the report shows it beside the list (ADR-0290's table). Closed by: a report test over the mark's event.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the section to the VWO readiness screen, the line to the Summary and the maps with the list under domain A on the graph map, with strings under `parent.cito.*`. A wrong first attempt counts when its node was fluent or stable at that moment or its fact was automatic; the error classes are the four of ADR-0180. The Summary line shows at most once a week, because the interruption budget of the parent is small.

The list prints through the browser's print with a print stylesheet, which ADR-0180 already plans for its snapshot. It sets no dates and orders no topics, because it is a view of the heat map and not a lesson plan.

## Depends on

- TSK-0889 (blocking): the fact states the maps and the list read, and the automatic state at a past moment.

The epic realising ADR-0180 supplies the report frame, the error classes and the Summary. The event of the mark «тренировали факты» belongs to ADR-0210 under REQ-5074; until that epic exists, the test uses a fixture event and the report only shows it.

## Evidence

Not yet.

## Left alone

A Director response to careless errors, such as offering «Проверить нить» more often, which no requirement asks for.
