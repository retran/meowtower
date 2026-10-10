---
id: TSK-0927
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0310
closes: [REQ-6036, REQ-6038, REQ-6040, REQ-6060, REQ-6064]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# After the MVP, the «home and school» screen sets the school's values beside the home states and converts neither

After this task, the full report has a screen that shows, for each goal with a confirmed link, the school's level and status in a school column and the linked nodes' home states in a home column, with the school's two labels, and report v1 keeps its nine screens until the MVP ends.

## Acceptance criteria

1. Given no snapshot, when the screen is built, then it shows «Нет снимков из школы»; given a snapshot and a goal with a confirmed link, then it shows one row for the goal with the school's level and status and the state label of each linked node (REQ-6060). Closed by: a report test over both fixtures.
2. Given the screen in a Parent Room opened on the Mac and one opened on the iPad, when each loads, then the first shows the screen and the second offers none, and its route answers `404` through `https://<mac-name>.local` (REQ-6060). Closed by: a route test and a Playwright test on both devices.
3. Given a synthetic snapshot, when the parent reads the screen, then the level is labelled «уровень школы: сравнение с учениками по стране» and the status «относительно цели, которую поставила школа», and each says what it measures, a national comparison and a target the school set (REQ-6036, REQ-6038). Closed by: the parent's judgement on a synthetic snapshot before the feature's acceptance, because the parent judges whether the wording reads right; a test also finds both strings in the screen.
4. Given fixture rows for every combination of the school's three statuses and levels 0 to 5 and the home states, when the screen is built, then each school value shows only in the school column and each home state only in the home column, and a search of `src/parent/school/` finds no function or table that takes a school value and returns a home state or the reverse (REQ-6040). Closed by: a render test over the fixtures and the search's test with a failing fixture.
5. Given the report before the MVP ends, when its screens are listed, then there are nine and neither this screen nor the timeline is among them; given the scope guard released after the MVP, then they are (REQ-6064). Closed by: a report test and the scope guard's test.
6. Given a withdrawn snapshot, when the screen is built, then none of its goals shows (ADR-0310). Closed by: a report test after a withdrawal.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `GET /api/parent/report/home-and-school` on the loopback listener and the screen, with every string under `parent.school.*` in `content/i18n/ru.json`, where ADR-0180's label check already runs. The home side shows the state labels of ADR-0180 for each linked node. Compute rows on each request and write none to the log or a cache, so a full recompute gives the same screen.

The school's level is a national percentile turned into levels 0 to 5, and its status is relative to a target the vendor can move each month, so the two never convert into a home state. This task puts the marks of ADR-0310's two contradictions on no row: ADR-0420 replaced them with the four quadrants, and the epic realising it places the quadrants and their reasons on the rows this task builds.

## Depends on

- TSK-0922 (blocking): the values in force the school column shows.
- TSK-0926 (blocking): the confirmed links that select the rows.
- TSK-0924 (not blocking): withdrawal; the criterion on a withdrawn snapshot reads through the same projections.

The epic realising ADR-0060 supplies the node states and the epic realising ADR-0180 the report's frame.

## Evidence

Not yet.

## Left alone

The timeline, which TSK-0928 builds. The quadrants and the line «Школа и игра меряют разное», which the epic realising ADR-0420 owns.
