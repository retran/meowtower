---
id: TSK-0912
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0300
closes: [REQ-5964, REQ-5966, REQ-5970, REQ-5972, REQ-5924, REQ-5996, REQ-6064]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The report's ninth screen «Работа с источниками» shows states, accuracy by level and the traps that fired

After this task, report v1 has the screen «Работа с источниками» apart from the graph screens, the VWO block and the gap list ignore the track, and no text or setting names a Studievaardigheden test.

## Acceptance criteria

1. Given the report, when its screens are listed, then there are nine, the ninth is «Работа с источниками», and none is a graph screen (REQ-5964, REQ-6064). Closed by: a report test that lists the screens.
2. Given a fixture log with track attempts, when the screen is built, then it shows I1 to I5 with their states and the rule behind each, first-attempt accuracy over the last 30 days by question level across all track nodes and by node, «мало данных» for any figure under 5 first attempts, and the reading traps that fired with up to 3 examples each drawn from `item_shown`; given a log with no track attempts, then every node shows «не проверено» (REQ-5966). Closed by: a report test over both logs.
3. Given 3 wrong first attempts on track tasks in 30 days that matched a reading trap, when the screen is built, then it shows «считает, но ошибается в чтении», and given 3 wrong number or time answers at `calculate` or `combine` that matched none, then it shows «находит, но не считает»; a wrong region or choice with no trap counts toward neither and appears as unclassified on the misconceptions screen (ADR-0300). Closed by: a report test at 2 and at 3.
4. Given every track node «пока не освоено», when the VWO readiness block and the gap list are built, then no coverage, margin, ceiling or ladder figure changes and no track node is listed (REQ-5970, REQ-5972). Closed by: a unit test of each.
5. Given every string file and the Parent Room's schemas, when the build's search runs, then it finds no "Studievaardigheden", and the settings schema holds no field for the school's tests (REQ-5924, REQ-5996). Closed by: the build check's test with a failing fixture.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the screen to the report frame, with every string under `parent.*` in `content/i18n/ru.json`. The screen sends no notification to the parent or the owner; each gap line shows while its condition holds. I chose two short rows, accuracy by level and by node, over a node by level table, as ADR-0300 did, because 2 tasks a host day give 40 to 60 first attempts in 30 days, too few to fill 20 cells. I chose a floor of 5 first attempts for a figure, because below 5 one answer moves it by 20 points or more.

The VWO block and the gap list read `nodes` only and the track lives in `tracks`, so the exclusion holds by the file's shape; the tests hold it too. ADR-0360 owns the requirement for the two gap lines, REQ-6428, and the epic realising it adopts the lines this task shows; the build search for the test's name runs over the game's own text, because ADR-0370 limits REQ-6504 to it.

## Depends on

- TSK-0901 (blocking): the states the screen shows.
- TSK-0909 (blocking): the traps it counts and names.

The epic realising ADR-0180 supplies the report frame, the node card and the misconceptions screen.

## Evidence

Not yet.

## Left alone

The home and school screen and the timeline, which come after the MVP with ADR-0310.
