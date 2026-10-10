---
id: TSK-0880
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0280
closes: [REQ-5796, REQ-5798, REQ-6064]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The VWO readiness screen shows «Нестандартное мышление» as a reserve, with the puzzle counts, and report v1 keeps nine screens

After this task, the VWO readiness screen holds a section «Нестандартное мышление» beside the ceiling above 1S, labelled «запас, а не оценка», that shows the puzzles solved in each theme, the mean of the highest rung taken, the puzzles she opened on a later game day than their offer, the puzzles solved with no rung on the second or third game day after the offer and the counts offered, opened and shelved.

## Acceptance criteria

1. Given a fixture log, when the report is built, then the section shows each count of REQ-5798, and a rungless solve counts as 0 in the mean of the highest rung, per ADR-0370 (REQ-5798). Closed by: the report test over the fixture.
2. Given the section, when its label is read, then it says «запас, а не оценка», and no figure in it is a grade or reads from the knowledge model (REQ-5796). Closed by: a report test and the model's input list.
3. Given the report, when its screens are counted, then it has nine: the summary, VWO readiness, the graph map, the node card, misconceptions, limits, science, the story book and «Работа с источниками», and the section adds no screen (REQ-6064). Closed by: a report test that counts the screens.
4. Given a box that rises past 20, when the report is built, then the section shows one line saying so, each time the box rises past 20, per ADR-0370; and given the bank has no approved puzzle left, the section shows the count of approved puzzles left. Closed by: two report fixtures.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the section to the VWO readiness screen of ADR-0180 as ADR-0280 amends it, reading the puzzle events (TSK-0876) and no knowledge projection. I chose as ADR-0280 does that she came back to a puzzle by herself when she opened it on a later game day than it was offered. The counts of offered, opened and shelved are the data the owner reads when growing the branch by her interest.

## Depends on

- TSK-0876 (blocking): the section reads those event types.

The epic realising ADR-0180 supplies the report's screens; the epic realising ADR-0390 may later add the count under the profile's finding patterns bar, and this task leaves that to it.

## Evidence

Not yet.

## Left alone

The rule that grows the branch by her interest, and a shared count of running clues across the Master's scenes and the puzzles, because ADR-0110 logs no clue event.
