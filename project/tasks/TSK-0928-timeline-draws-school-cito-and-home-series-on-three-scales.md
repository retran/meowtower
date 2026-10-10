---
id: TSK-0928
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0310
closes: [REQ-6044, REQ-6046, REQ-6062]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# After the MVP, the timeline draws the school's levels, the Cito results and the home scale as three labelled series

After this task, the full report has a timeline screen with three series, each on its own axis with its own scale and its own label, no line or number that converts one into another, and a mark on each school point from a moved target.

## Acceptance criteria

1. Given fixture data for all three sources, when the timeline is built, then it holds three series, each with its own axis and scale, and no line, number or legend relates one series to another (REQ-6044, REQ-6062). Closed by: a report test that reads the axes and a Playwright test that looks for any shared axis.
2. Given the timeline, when it is read, then the series are labelled «Школа», «Cito» and «Игра дома» (REQ-6046). Closed by: a report test.
3. Given two snapshots whose pair is marked `target_moved`, when the school series is built, then it holds the subdomain level for each snapshot date where the document shows it, with a mark on each point that comes from such a pair (ADR-0310). Closed by: a report test over two fixture snapshots.
4. Given no Cito result and no home scale data, when the timeline is built, then each such series shows its label and «нет данных»; given no snapshot, then the screen shows «Нет снимков из школы»; and a withdrawn snapshot adds no point (ADR-0310). Closed by: a report test over the four cases.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `GET /api/parent/report/timeline` on the loopback listener and the screen, with strings under `parent.school.*`. The three scales measure different things and a conversion would invent an equivalence nobody measured, so each series keeps its own scale. The Cito series reads the results the parent entered and the home series the home skill scale, both from the epic realising ADR-0290. The screen works before either exists, because a series with no data shows its label and «нет данных».

The mark on a point from a moved target is on the timeline as well as on the changes view, because a school line that rises each month can be the vendor's automatic target keeping pace with a percentile, and a parent who reads it as learning is misled.

## Depends on

- TSK-0922 (blocking): the school levels in force.
- TSK-0923 (blocking): the `target_moved` marks.

## Evidence

Not yet.

## Left alone

The Cito results and the home scale themselves, which the epic realising ADR-0290 builds; until then their series show «нет данных».
