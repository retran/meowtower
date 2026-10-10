---
id: TSK-0603
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0110
closes: [REQ-1514, REQ-1516, REQ-1520, REQ-1522, REQ-1524]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The parent sets a creepiness level of 0, 1 or 2, no line above it shows, and a fixed list of things never shows at any level

After this task, the Parent Room setting holds `creepiness`, 1 by default, named «Уютно», «Чуть жутковато» and «Загадочно», every pool line carries a minimum and a maximum level, a line above the level in force never shows, the always-forbidden list is part of every reply's checklist, and the five calm kinds of order are held at level 0.

## Acceptance criteria

1. Given a fresh database, when the parent settings are read, then `creepiness` is 1, and a value outside 0, 1 and 2 is refused (REQ-1514). Closed by: an integration test.
2. Given the Parent Room's stand-in page, when the setting is opened, then it names the three levels «Уютно», «Чуть жутковато» and «Загадочно» (REQ-1516). Closed by: a Playwright test.
3. Given a pool of lines with levels 0 to 2 and a level in force of 1, when 1,000 lines are drawn, then none has a minimum level above 1 (REQ-1520). Closed by: a unit test.
4. Given the labelled test set, when the safety check runs, then each item of the always-forbidden list, among them jump scares, blood, death, body horror, being stuck forever, threats to loved ones, realistic dangers and the heroine being chased, has positive lines and the check flags each at every level (REQ-1522). Closed by: the test set's report with the count of positives for each item.
5. Given the pool categories of eye exercises, rest stops, the end of the row, the heroine's room and the task window, when the content test runs, then every line is level 0 with no dreamcore, and a fixture line at level 1 in one of them fails the test (REQ-1524). Closed by: the content test and its fixture.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the setting as a `settings_changed` key, the level fields on pool lines in `content/lines.ru.json`, the filter at the pool draw, and the forced «Уютно» for the order kinds REQ-1524 names. The level reaches the order through TSK-0597's field. The checklist items are measured by the safety check of TSK-0599; this task adds the labelled lines for the always-forbidden items.

## Depends on

- TSK-0597 (blocking): the order's level field is that task's.

The epic realising ADR-0180 draws the setting on the Parent Room's page.

## Evidence

Not yet.

## Left alone

The dreamcore variant and the slips, which TSK-0604 builds, and the fear path that lowers the level, which TSK-0602 builds.
