---
id: TSK-0897
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0290
closes: [REQ-5804, REQ-5866, REQ-5874, REQ-5890, REQ-6064]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The report shows each block's readiness by week, the formats apart, the work ahead of school and the Cito entries with their marks

After this task, the VWO readiness screen holds a Cito preparation section and a beyond-school section, the node card shows bare and context tasks apart, and every report text that rests on an unconfirmed Cito entry shows «не подтверждено» beside it.

## Acceptance criteria

1. Given a fixture log, when the report's Cito preparation section is built, then it shows the active horizon and its date, and for each block and each week the share of its members fluent or stable and, for blocks 1 and 2, the share of its facts automatic, beside whether the block is ready (REQ-5890). Closed by: a report test on the fixture log, with the weekly values replayed to each week's end.
2. Given bare and context tasks in the log, when the section and the node card are built, then accuracy and fluency show for each format apart (REQ-5866). Closed by: a report test that finds both figures on both screens.
3. Given a school-group setting of group 5 and nodes fluent or stable whose typical group is 6 or later, when the beyond-school list is built, then it holds exactly those nodes, and it changes when the setting changes (REQ-5874). Closed by: a report test with two settings.
4. Given an entry marked «не подтверждено» whose `usedBy` lists two string keys, when the report renders, then «не подтверждено» shows beside the text of each key, and on none that rests on a confirmed entry (REQ-5804). Closed by: a report test with one unconfirmed and one confirmed entry.
5. Given the report after this task, when its screens are listed, then there are nine named in REQ-6064, none was added, and each of the five Cito sections of ADR-0290 sits under the screen its table names (REQ-6064). Closed by: a report test that lists the screens and the sections.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the Cito preparation section, the beyond-school section and the format split on the node card to the report frame, with every string under `parent.cito.*` in `content/i18n/ru.json`. The Cito preparation section also shows the home scale and the entered results beside it, with no conversion, and lists the Cito entries with their marks. The weekly values come from replaying the projections to each week's end, a pure function over 308 facts and 79 nodes.

Reading the school's position from a node's typical group is a default the requirement itself names, because it is the one source every node already carries.

## Depends on

- TSK-0884 (blocking): the marks and `usedBy` keys.
- TSK-0885 (not blocking): the entered results the section lists; the test here writes fixture results.
- TSK-0887 (blocking): block readiness.
- TSK-0889 (blocking): the facts' states for the shares.
- TSK-0894 (blocking): `format` on `item_shown`.
- TSK-0896 (blocking): the scale's reply the section shows.

The epic realising ADR-0180 supplies the report frame and its nine screens; until it exists, the sections render on a minimal page that the Parent Room's routes serve, and that epic places them.

## Evidence

Not yet.

## Left alone

The careless errors line, the fact report and the printable list, which TSK-0898 adds to the same screens. The ninth screen «Работа с источниками», which ADR-0300's epic builds.
