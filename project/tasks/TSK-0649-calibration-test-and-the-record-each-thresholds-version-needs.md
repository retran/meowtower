---
id: TSK-0649
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0140
closes: [REQ-1730, REQ-1732, REQ-1734, REQ-1740]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The build fails when the thresholds in force miss the target shares, and a new version needs a decision record that names it

After this task, a simulation test runs the room and floor rules over mixed-knowledge profiles after a cold start and fails when the thresholds in force miss the four target shares, and a check fails a thresholds version above 1 that no decision record names.

## Acceptance criteria

1. Given the mixed profiles and `thresholds.json` version 1, when the simulation runs, then it reports the room `success` share, the floor-days in `cunning` and in `triumph`, and the share of chapters with the triumph variant, and the build passes only when `success` is in 55-75 % of rooms, `cunning` in at most 25 % of floor-days, `triumph` in 15-35 % and the triumph variant in about half of the chapters (REQ-1730, REQ-1732). Closed by: the simulation test's report.
2. Given a fixture version whose room threshold is 0.95, when the simulation runs, then the test fails and names the share that missed (REQ-1732). Closed by: the test's fixture run.
3. Given `thresholds.json` at version 2, when the check runs, then it fails unless a decision record under `project/adrs/` names version 2, and version 1 passes because it is the starting set (REQ-1734). Closed by: a unit test with a fixture folder of records.
4. Given the file's `notes` and the first-month review's checklist, when the owner reads them, then both say that the chapter triumph share changes before any other threshold, because a fixed chapter threshold swings from nearly no chapters to nearly all of them as the mean room share moves by 0.1 (REQ-1740). Closed by: a unit test that reads the notes and the owner's judgement at the first-month review.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Write `tests/simulation/thresholds.test.ts` and read the profiles from the generator of the epic realising ADR-0190. Until it lands, use a seeded fixture of mixed profiles that draws verdict sequences per room, and record in the evidence which profiles were used. Report the four shares for each version the file has had. Version 1 carries the starting values REQ-1736 and REQ-1738 impose.

## Depends on

- TSK-0647 (blocking): the rules the simulation runs.

The epic realising ADR-0190 owns the stage 0.1 simulation runner and the profile mix. The first run may show that version 1 misses a target; ADR-0140 then asks for version 2 with a decision record, and that record is a new decision and not a task of this epic.

## Evidence

Not yet.

## Left alone

Tuning the numbers, which waits for the stage 0.1 simulation on the real Director, and the first-month review itself, which the owner holds.
