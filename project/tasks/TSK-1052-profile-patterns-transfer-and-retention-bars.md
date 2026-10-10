---
id: TSK-1052
artifact: task
status: approved
revised: 2026-10-10
epic: EPC-0390
closes: [REQ-6724, REQ-6756, REQ-6758, REQ-6760, REQ-6768]
issue:
---

<!-- Written to the writing standard meow-prose ships: lead with the answer, give each rule its reason in the same sentence, and show the failing case. -->

# The finding patterns, transfer and retention bars read their own sources and carry the slow-bar note

After this task, the finding patterns bar reads unassisted first attempts on node S6 and shows the puzzles solved beside it, the transfer and retention bars read the observations their decisions define, and all three carry a note that they will read «мало данных» for most of the first months.

## Acceptance criteria

1. Given unassisted first attempts on node S6 and 7 puzzles solved in the patterns, working-backwards and enumeration themes, when the bar is built, then the bar counts the attempts, the count of puzzles shows under it labelled «запас, а не оценка», and removing the puzzles leaves the bar's count unchanged (REQ-6758, REQ-6768). Closed by: a fixture log with and without the puzzles.
2. Given eligible first encounters of which 3 are counted transferred, when the transfer bar is built, then it shows 3 successes of the eligible count; given retention observations of which 2 are right, when the retention bar is built, then it shows 2 successes (REQ-6756, REQ-6760). Closed by: a fixture observation source for each bar.
3. Given mapping version 1, when the report is built from a log with no transfer and no retention events, then transfer and retention read «нет данных» and finding patterns reads «мало данных» with its count (REQ-6716's states, REQ-6724). Closed by: a fixture log.
4. Given the three bars, when their entries are read, then each carries the key of the fixed note that it will read «мало данных» for most of the first months (REQ-6724). Closed by: a unit test on the entries.

The definition of done in ADR-0190 applies as well and isn't restated here.

## What to do

Add `src/parent/profile/patterns.ts`, `transfer.ts` and `retention.ts`. The transfer and retention bars read through one interface, `ObservationSource`, that returns the window's observations with their verdicts, so this task needs neither projection to exist. Version 1 of the mapping file sets `built: false` on both, and the build that adds ADR-0410's or ADR-0400's observations raises the file's version and sets the flag.

Node S6 gives about 11 first attempts in 28 days, so the finding patterns bar mostly reads «мало данных» for months, and that is the honest reading.

## Depends on

- TSK-1045 (blocking): S6, retention and transfer take precedence in the routing order.
- TSK-1046 (blocking): the windows.
- TSK-1047 (blocking): the bar builder.

The epic realising ADR-0400 supplies the projection `retention_observations` and its verdict (REQ-6826, REQ-6834), and the epic realising ADR-0410 supplies the eligible first encounters and their transfer verdict (REQ-6946, REQ-6960). Until they exist the fixtures above stand in, and wiring each source to its projection is the only work left to those epics. The epic realising ADR-0280 supplies the puzzle events.

## Evidence

Not yet.

## Left alone

What a retention observation is and when it counts as right, which ADR-0400 owns, and what a first encounter is, which ADR-0410 owns.
