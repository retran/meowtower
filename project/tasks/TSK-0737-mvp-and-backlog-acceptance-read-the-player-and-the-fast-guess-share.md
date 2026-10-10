---
id: TSK-0737
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0190
closes: [REQ-3012, REQ-3014, REQ-3016, REQ-3018]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The MVP and each backlog item are accepted from the player's play and a fast-guess share below 15 %

After this task, verify's report prints the share of fast guesses among the player's scored first attempts over the last 14 days from the newest snapshot, and the stage 0.3 and backlog acceptance tasks name what the parent judges.

## Acceptance criteria

1. Given a snapshot of 14 days in which fast guesses are 14 % of scored first attempts, when verify's acceptance section runs, then it prints 14 % and passes; given 16 %, then it prints 16 % and fails (REQ-3014). Closed by: two integration tests over fixture snapshots.
2. Given no snapshot in `data/snapshots/`, when the section runs, then it reports that the share can't be read and passes nothing. Closed by: an integration test.
3. Given two weeks of daily play, when the parent has watched the player, then the parent judges that she wants to come back, spends guiding threads without fear and isn't upset by the other path (REQ-3012). Closed by: the parent's judgement from watching her play, because wanting to return is not a number a program can read.
4. Given a backlog item after the MVP, when a week of play ends, then the parent judges that the player shows no loss of interest (REQ-3018). Closed by: the parent's judgement from watching her play.
5. Given the recorded order of backlog items, when verify reads the stage, then only one item is current, so no work starts on an item before the item before it is accepted (REQ-3016). Closed by: the integration test of TSK-0735 criterion 2, and the owner's judgement from the order of the acceptances.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add the acceptance section to the report. It reads the newest file in `data/snapshots/`, the only place verify reads the player's data, and counts fast guesses by the rule of the rapid-guess row of the limits table: a wrong answer faster than 30 % of the task's fluency threshold. Scored first attempts are the answers that could be guessed (REQ-3014). Choice this task makes: the window is the last 14 days of the snapshot, because REQ-3014 names the two weeks of MVP play and the report can't know which fortnight the owner means.

The epic realising ADR-0180 supplies the limits table and the rapid-guess row. Until it exists the section runs on a fixture snapshot with the row's inputs.

## Depends on

- TSK-0724 (blocking): the section is part of the runner's report.
- TSK-0735 (blocking): criterion 5 reads the stage function.

## Evidence

Not yet.

Criteria 3 and 4 rest on the parent's judgement from watching the player, because wanting to come back and being upset are not things a log can show.

## Left alone

The pure-measurement mode and the habit of hints before an answer, which stay deferred to the stage 0.3 review, and which backlog item comes first, which is the family's choice at that review.
