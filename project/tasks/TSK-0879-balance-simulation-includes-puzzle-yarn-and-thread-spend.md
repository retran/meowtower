---
id: TSK-0879
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0280
closes: [REQ-5782]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The economy's balance simulation counts the star yarn puzzles give and the guiding threads they spend

After this task, ADR-0190's group 3 simulation includes puzzle play, and it reports the yarn the puzzles yield and the threads their ladders spend, with the typical adventure day's net thread supply beside them.

## Acceptance criteria

1. Given a 60-day simulation with puzzle play, when the report is read, then it shows the star yarn from puzzles and the threads spent on puzzle ladders (REQ-5782). Closed by: the simulation's report.
2. Given the same seeds without puzzles, when the slots, plans and estimates are compared, then they are equal. Closed by: a diff of the two runs.
3. Given the report, when the net thread supply of the typical adventure day is read, then the report names the day's value and a value below 8, the bottom of the 8 to 10 threads a day REQ-0512 sets for adventure tasks, is printed as a finding. Closed by: the simulation's report with a fixture that spends enough threads to fall below 8.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add puzzle play, offers, solves, rungs and free threads to the simulation profiles in group 3. The report line is a finding and not a failing check, because the reversal condition that reads it is for the owner's reopening.

## Depends on

- TSK-0874 (blocking): the simulation needs the offer rules.
- TSK-0878 (blocking): the yield comes from the rewards.

The epic realising ADR-0190 supplies the simulation group and its ten profiles.

## Evidence

Not yet.

## Left alone

Resizing the ladder's price or the free thread, which the reversal condition reopens through a new record.
